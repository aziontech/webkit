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
  import {
    defaultFirewallProtection,
    enabledFirewallModules,
    firewallBindingName,
    firewallIsBound
  } from '../../lib/data/firewalls'
  import { WORKLOAD_STEPS, workloadFirewallModuleLabels } from '../../lib/data/workload-flows'
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
  // The request body. `protection` is answered on part 2 and CONSUMED by the release on
  // part 3 — one object, so the release projects it instead of holding a second copy that
  // could disagree.
  //
  // It starts OFF. It used to start protected with the first firewall pre-selected, which
  // bound a firewall the reader never picked — a pre-selection is an answer, not a
  // proposal. Part 2 is a whole part about this question and now asks it: whether there is
  // a firewall, and whether it is one that already exists or a new one
  // (../../lib/data/firewalls.js → `defaultFirewallProtection`).
  const form = reactive({
    name: '',
    protection: defaultFirewallProtection(),
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

  // WHICH firewall this workload ends up behind, by name — one derivation for the parts
  // that show it (the release summary), the run that narrates it, and the chain that
  // records it. `''` when the reader declined protection.
  const firewallName = computed(() => firewallBindingName(form.protection))

  // What the protection row on the release summary says about the answer part 2 settled on.
  // Read through the one derivation both flows use (../../lib/data/firewalls.js) rather
  // than re-assembled: a summary that re-derives an answer is a summary that can disagree
  // with it.
  const protectionSummary = computed(() => {
    if (!firewallName.value) {
      return 'No firewall in front of this workload. Requests reach the application directly.'
    }
    return firewallIsBound(form.protection)
      ? 'An existing firewall, bound to this release. Requests are filtered before the application runs.'
      : 'Created with this workload and bound to the release. Requests are filtered before the application runs.'
  })

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
    // The protection branch the reader is ON is the one that can be incomplete: a firewall
    // being created needs a name, one being bound needs to be picked. Neither is asked
    // while the switch is off.
    if (step.value === 'protection' && form.protection.enabled && !firewallName.value) {
      errors.firewall =
        form.protection.mode === 'new'
          ? 'Name the firewall, or bind one that already exists.'
          : 'Select the firewall to bind, or create a new one.'
    }
    if (step.value === 'release' && !form.application) {
      errors.application = 'Select the application this workload serves.'
    }
    return Object.keys(errors).length === 0
  }

  // The provisioning run's own step model, built from the answers: the firewall row only
  // exists when the reader asked for protection, and the domain row names the domain their
  // name produced. Computed, so a Back-and-change is reflected in the run that follows.
  const provisioningSteps = computed(() =>
    workloadProvisioningSteps({
      name: form.name.trim(),
      protected: form.protection.enabled,
      firewall: firewallName.value,
      // Creating a firewall and binding one are different work, so the run narrates the
      // one that actually happens rather than one row that covers both.
      firewallBound: firewallIsBound(form.protection),
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
        description: error?.message ?? 'Check your connection, then retry.',
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
      templateTitle: form.name.trim(),
      // The firewall the reader chose on part 2 — it was asked for and narrated by the
      // run, so it belongs in the chain the success screen lists. A bound one is marked as
      // bound rather than credited to this create.
      firewall: form.protection.enabled,
      firewallName: firewallName.value,
      firewallBound: firewallIsBound(form.protection),
      // A bound firewall reports the modules it ALREADY has on; a created one reports the
      // ones this part switched on for it.
      firewallModules: firewallIsBound(form.protection)
        ? workloadFirewallModuleLabels(firewallName.value)
        : enabledFirewallModules(form.protection.modules)
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
      description: `It stopped at ${failedStep}. Check the configuration and deploy again.`,
      action: { label: 'Retry', onClick: () => advance() }
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
           workload two parts ago and protected it one part ago, and now has to say what it
           serves; losing sight of either is how a release ends up bound to the wrong
           workload, or behind a firewall nobody meant.
           ONE card of both answers, which is the shape the application flow's counterpart
           has (../applications/wizard/SourceSummary.vue): projected answers are a summary,
           and a summary is one card. They used to be two — this row here and a titled
           "Serving" card inside the release part — which printed the domain twice, 100px
           apart, and titled one group with a card header while the other had none.
           Read-only, with a way BACK to the part that OWNS each answer rather than a
           second control for it here. -->
      <CardBox
        :padded="false"
        class="mb-(--layout-section-gap)"
      >
        <template #content>
          <Item.List>
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
                <Item.Description>
                  {{ domain || 'No domain yet' }} — provisioned from the workload name. Traffic
                  arrives here.
                </Item.Description>
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

            <Item size="small">
              <Item.Media>
                <span
                  class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                >
                  <i
                    class="pi pi-shield text-[1rem] leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ firewallName || 'Not protected' }}</Item.Title>
                <Item.Description>{{ protectionSummary }}</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Button
                  type="button"
                  label="Change"
                  kind="text"
                  size="small"
                  :disabled="submitting"
                  @click="goToStep(1)"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>

      <ReleaseStep :disabled="submitting" />
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
