<script setup>
  // THE WORKLOAD CREATE — a WIZARD, because its questions are sequentially dependent.
  //
  // ── WHY THIS ONE IS IN PARTS ──
  //
  // The application create branches: its first answer decides which questions follow. This
  // one does not — there is a single path through it. It earns a wizard for the other
  // reason: each part is answerable only once the one before it is settled.
  //
  //   Name the workload   the name PRODUCES the domain, so naming is choosing the address.
  //   Protect it          whether a firewall stands in front, and which one.
  //   Compose the release what the domain SERVES — with the firewall from the part before
  //                      folded in, not asked again.
  //
  // Asked together, a reader could compose a release for a workload they had not named and
  // a firewall they had not chosen. The parts are the dependency order.
  //
  // ── THE COMMIT PROVISIONS THE CHAIN ──
  //
  // "Create and deploy" does not just POST a workload. It provisions the chain the console
  // already models (../../../shared/lib/provisioning.js) and streams the run through the
  // SAME card the application deploy uses — on the workload pipeline rather than the
  // template one (../../lib/data/workload-provisioning.js). That card used to be hardcoded
  // to a template deploy; it takes its title, splash and steps as props now, so every
  // resource whose create ends in a chain narrates its OWN work instead of borrowing a
  // story about cloning a repository.
  //
  // ── WHAT THIS PAGE REPLACED ──
  //
  // A single-screen create with four open bands (General, Domains, Environments, Advanced),
  // two sub-drawers, and a Save that created the workload and stopped. The domains band
  // asked the reader to add a hostname by hand; the name already produces one, so the first
  // part shows it instead of asking. The environments band asked them to LINK deployment
  // settings to an environment their domains referenced — which is the release, so it is
  // the last part rather than a band that read as empty until two other bands were filled.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import { toast } from '@aziontech/webkit/toast'
  import { provisionDeployment, resourceChain } from '@shared/lib/provisioning'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentFlow from '../../components/deployment/DeploymentFlow.vue'
  import WizardPage from '../../components/page/WizardPage.vue'
  import { useBaseline } from '../../lib/behavior/forms'
  import { WORKLOAD_FIREWALLS, WORKLOAD_STEPS } from '../../lib/data/workload-flows'
  import {
    domainForWorkload,
    workloadProvisioningSteps
  } from '../../lib/data/workload-provisioning'
  import DeploySuccess from '../applications/wizard/DeploySuccess.vue'
  import { provideWorkloadForm } from './wizard/form-context'
  import ProtectionStep from './wizard/ProtectionStep.vue'
  import ReleaseStep from './wizard/ReleaseStep.vue'
  import WorkloadStep from './wizard/WorkloadStep.vue'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // --- Phase and position --------------------------------------------------
  // `phase` is where the FLOW is: asking, running, done. `stepIndex` is where inside the
  // asking. Separate, because the run and the outcome are not parts — nothing is asked in
  // either, and neither has a Back.
  const phase = ref('wizard') // wizard | provisioning | success
  const stepIndex = ref(0)

  const steps = WORKLOAD_STEPS
  const step = computed(() => steps[stepIndex.value]?.id ?? 'workload')
  const isLastStep = computed(() => stepIndex.value === steps.length - 1)

  // --- The answers ---------------------------------------------------------
  // The request body. `protected` + `firewall` are answered on part 2 and CONSUMED by the
  // release on part 3 — one object, so the release projects them instead of holding a
  // second copy that could disagree.
  //
  // `protected` starts TRUE, with the first firewall selected: a workload is the public
  // entry point, so the protected shape is the one the flow proposes. Part 2 is a whole
  // part about that answer — nothing is hidden, and `Not protected` is one option away in
  // the same Select that binds the firewall.
  const form = reactive({
    name: '',
    protected: true,
    firewall: WORKLOAD_FIREWALLS[0].value,
    application: '',
    applicationVersion: 'latest',
    environment: 'Production',
    customPage: '',
    // Advanced — every one of these already carries the endpoint's own default.
    certificate: 'azion_san',
    minimumTlsVersion: 'tls_1_2',
    allowAzionDomain: true,
    active: true
  })

  const errors = reactive({})
  const clearErrors = () => Object.keys(errors).forEach((key) => delete errors[key])

  const submitting = ref(false)

  // The wizard page, so a failed check can hand the reader back to the field that caused it
  // (../../components/page/WizardPage.vue → `revealInvalid`). The release part is the long
  // one: its Application select sits above the environment, the custom page and the
  // Advanced band, so the miss it reports is off-screen from the bar that reports it.
  const page = ref(null)

  // The parts read and write through injected context rather than props — see
  // ./wizard/form-context.js for why (a child writing into a prop object is what
  // `vue/no-mutating-props` forbids).
  provideWorkloadForm({ form, errors })

  // The leave guard's trigger (mounted by WizardPage): dirty while the flow holds input
  // that has not been committed. Re-taken on the way OUT of a successful create.
  const { dirty, commit } = useBaseline(form)

  const domain = computed(() => domainForWorkload(form.name))

  // --- Moving through the flow ---------------------------------------------
  const goBack = () => {
    if (stepIndex.value <= 0) return
    stepIndex.value -= 1
    clearErrors()
  }

  // Only backwards, and only to a part already answered — the progress hands up an index it
  // has already checked is behind the reader.
  const goToStep = (index) => {
    if (index >= stepIndex.value) return
    stepIndex.value = index
    clearErrors()
  }

  const cancel = () => router.push({ path: '/workloads', query: { email: userEmail.value } })

  // Validation runs PER PART, on its own Next, and only over what that part asks. A wizard
  // that validated everything on the last button would report a missing name three parts
  // after the reader left the field that fills it.
  const validate = () => {
    clearErrors()
    if (step.value === 'workload' && !form.name.trim()) {
      errors.name = 'This field is required.'
    }
    if (step.value === 'release' && !form.application) {
      errors.application = 'Choose the application this workload serves.'
    }
    return Object.keys(errors).length === 0
  }

  // The provisioning run's own step model, built from the answers: the firewall row only
  // exists when the reader asked for protection, and the domain row names the domain their
  // name produced. Computed, so a Back-and-change is reflected in the run that follows.
  const provisioningSteps = computed(() =>
    workloadProvisioningSteps({
      name: form.name.trim(),
      protected: form.protected,
      firewall: form.firewall,
      application: form.application
    })
  )

  const advance = async () => {
    if (submitting.value) return
    if (!validate()) {
      // Nothing is disabled on this flow's bar: a Next that reports what is missing beats
      // one the reader cannot press. Reporting is only half of it — this is the other half,
      // taking them to the field it is reported on.
      page.value?.revealInvalid()
      return
    }

    if (!isLastStep.value) {
      stepIndex.value += 1
      clearErrors()
      return
    }

    // The commit. One flag locks the whole part while the request is in flight.
    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      phase.value = 'provisioning'
    } catch (error) {
      toast.error('Could not start provisioning.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => advance() }
      })
    } finally {
      submitting.value = false
    }
  }

  // --- The run and its outcome ---------------------------------------------
  const provisioned = ref(null)
  const createdResources = computed(() =>
    provisioned.value ? resourceChain(provisioned.value) : []
  )

  const onFinished = () => {
    provisioned.value = provisionDeployment({
      repoName: form.name.trim(),
      framework: '',
      templateTitle: form.name.trim()
    })
    // The create landed: nothing is pending, so the leave guard stands down before this
    // flow navigates on its own success.
    commit()
    phase.value = 'success'
  }

  // A failed run goes BACK to the parts that can fix it, with the reason in a toast. It does
  // not strand the reader on a dead progress card, and it does not pretend it succeeded.
  const onFailed = (failedStep) => {
    phase.value = 'wizard'
    toast.error('Provisioning did not finish.', {
      description: `It stopped at ${failedStep}. Check the configuration and try again.`,
      action: { label: 'Try again', onClick: () => advance() }
    })
  }

  const manageWorkload = () =>
    router.push({
      path: `/workloads/${provisioned.value?.workload.id ?? ''}`,
      query: { email: userEmail.value, name: provisioned.value?.workload.name }
    })

  // --- The part's own advance ----------------------------------------------
  const nextLabel = computed(() => (isLastStep.value ? 'Create and deploy' : 'Next'))

  // Part 1 cannot advance without a name — its Next reports that rather than being dead,
  // so `validate` is what blocks. The release part is the same. Nothing is disabled here:
  // a button that reports what is missing beats one the reader cannot press and cannot ask.
  const nextDisabled = computed(() => false)
</script>

<template>
  <WizardPage
    ref="page"
    :breadcrumb="[{ label: 'Workloads', href: '/workloads' }, { label: 'Create workload' }]"
    back-label="Back to Workloads"
    title="Create workload"
    description="A workload is the public entry point: the domain traffic arrives on, what stands in front of it, and what it serves. The last step provisions all of it."
    title-id="create-workload-title"
    :heading="phase !== 'success'"
    :steps="steps"
    :current-step="stepIndex"
    :next-label="nextLabel"
    :next-disabled="nextDisabled"
    :submitting="submitting"
    :dirty="dirty && phase === 'wizard'"
    :terminal="phase !== 'wizard'"
    @back="goBack"
    @next="advance"
    @go="goToStep"
    @cancel="cancel"
  >
    <WorkloadStep
      v-if="step === 'workload'"
      :disabled="submitting"
    />

    <ProtectionStep
      v-else-if="step === 'protection'"
      :disabled="submitting"
    />

    <template v-else-if="step === 'release'">
      <!-- WHAT IS BEING RELEASED, above the questions about it. The reader named this
           workload two parts ago and now has to say what it serves; losing sight of the
           address is how a release ends up bound to the wrong workload. -->
      <CardBox
        :padded="false"
        class="mb-(--layout-section-gap)"
      >
        <template #content>
          <Item size="small">
            <Item.Media>
              <span
                class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
              >
                <i
                  class="ai ai-workloads text-[1rem] leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </span>
            </Item.Media>
            <Item.Content>
              <Item.Title>{{ form.name || 'Unnamed workload' }}</Item.Title>
              <Item.Description>{{ domain || 'No domain yet' }}</Item.Description>
            </Item.Content>
            <Item.Actions>
              <Button
                type="button"
                label="Change"
                kind="text"
                size="small"
                :disabled="submitting"
                @click="goToStep(0)"
              />
            </Item.Actions>
          </Item>
        </template>
      </CardBox>

      <ReleaseStep
        :disabled="submitting"
        @edit-protection="goToStep(1)"
      />
    </template>

    <!-- PAST THE QUESTIONS: the chain being built, then what it built. The SAME card the
         application deploy uses, told as this resource's own story — see
         ../../components/deployment/DeploymentFlow.vue's title / splash / steps props. -->
    <template #terminal>
      <DeploymentFlow
        v-if="phase === 'provisioning'"
        title="Provisioning"
        status-label="Creating"
        :steps="provisioningSteps"
        :splash="{
          verb: 'Provisioning',
          icon: 'ai ai-workloads',
          from: form.name.trim() || 'workload',
          to: ''
        }"
        @finished="onFinished"
        @failed="onFailed"
      />
      <DeploySuccess
        v-else
        :resources="createdResources"
        @manage="manageWorkload"
      />
    </template>
  </WizardPage>
</template>
