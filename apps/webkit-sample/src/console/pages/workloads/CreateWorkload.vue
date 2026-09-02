<script setup>
  // THE WORKLOAD CREATE — a WIZARD, because its questions are sequentially dependent.
  //
  // ── WHY THIS ONE IS IN PARTS ──
  //
  // The application create branches: its first answer decides which questions follow. This
  // one does not — there is a single path through it. It earns a wizard for the other
  // reason: each part is answerable only once the one before it is settled.
  //
  //   Application  what the domain will SERVE. Nothing downstream means anything without
  //                it — an address points at THIS. One that already exists, or a new one
  //                asked the same two questions the application create's from-scratch door
  //                asks.
  //   Domain and   the public address, the environment and certificate that answer on it,
  //   deployment   and where the first release lands. The part that binds it.
  //
  // Asked together, a reader could bind an address to an application they had not chosen.
  // The parts are the dependency order.
  //
  // ── AND A FIREWALL IS NOT ONE OF THEM ──
  //
  // A workload is deployable when it has an APPLICATION: that is what answers on the
  // domain. A workload with a firewall in front of nothing serves nothing, so protection is
  // not something this create needs an answer to before it can finish — asking for it here
  // only put an optional resource between the reader and the two facts that are not
  // optional. It is asked where the binding actually happens instead: on the workload's own
  // page (./WorkloadDetail.vue → the topology's bind slots, and the Ship to production band
  // that points a reader at them). This flow used to carry it as part 2 with its own switch
  // and its own picker.
  //
  // ── THIS ORDER IS A CHANGE, AND THE OLD ONE WAS BACKWARDS ──
  //
  // The flow used to open by NAMING the workload — which produced its domain — and only
  // then ask what it serves, from a bare `Select` over four fixtures. Two costs came out of
  // that:
  //
  //   The address was decided before the thing behind it. A reader chose a public hostname
  //   for an application they had not yet identified, and if it did not exist there was
  //   nothing they could do here — a Select over existing applications has nowhere to put a
  //   new one, so the way through was to abandon the flow and come back.
  //
  //   The Azion domain was the only address on offer. Anyone bringing their own hostname
  //   created the workload on a domain they did not want and added theirs afterwards.
  //
  // Now the resource comes first, answered the way every binding question in this console
  // is — one that exists, or a new one — and the address comes last, in two branches. Every
  // name the commit uses cascades from the one string typed on that last part
  // (../../lib/data/workload-flows.js → `workloadNamesFromForm`).
  //
  // ── THE COMMIT PROVISIONS THE CHAIN ──
  //
  // "Create and deploy" does not just POST a workload. It provisions the chain the console
  // already models (../../../shared/lib/provisioning.js) and streams the run through the
  // SAME card the application deploy uses, on the workload pipeline
  // (../../lib/data/workload-provisioning.js) — whose rows now run in the chain's own
  // order: resources, environment, deployment, release, and the workload last, because it
  // is the row that ties an address to all of it.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import { toast } from '@aziontech/webkit/toast'
  import { provisionDeployment, resourceChain } from '@shared/lib/provisioning'
  import { computed, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentFlow from '../../components/deployment/DeploymentFlow.vue'
  import WizardPage from '../../components/page/WizardPage.vue'
  import { useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import {
    defaultScratchConfig,
    enabledCachePolicies,
    scratchCachePolicies,
    scratchConnector,
    validateScratch
  } from '../../lib/data/application-scratch'
  import { connectorMeta } from '../../lib/data/connectors'
  import {
    defaultResourceBinding,
    resourceBindingIsExisting,
    resourceBindingName
  } from '../../lib/data/resource-binding'
  import {
    WORKLOAD_APPLICATIONS,
    WORKLOAD_STEPS,
    workloadDeploymentName,
    workloadNamesFromForm
  } from '../../lib/data/workload-flows'
  import { workloadProvisioningSteps } from '../../lib/data/workload-provisioning'
  import DeploySuccess from '../applications/wizard/DeploySuccess.vue'
  import ApplicationStep from './wizard/ApplicationStep.vue'
  import BindingStep from './wizard/BindingStep.vue'
  import { provideWorkloadForm } from './wizard/form-context'

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
  const step = computed(() => steps[stepIndex.value]?.id ?? 'application')
  const isLastStep = computed(() => stepIndex.value === steps.length - 1)

  // --- The answers ---------------------------------------------------------
  // The request body. The resource question is ONE object
  // (../../lib/data/resource-binding.js), because it is a pair — which branch, and that
  // branch's value — and holding them as separate keys means keeping them agreeing by hand.
  const form = reactive({
    // Part 1 — what the workload serves. `scratch` is the CREATE branch's own half: how a
    // new application caches and where it fetches from
    // (../../lib/data/application-scratch.js), the same two answers the application
    // create's from-scratch door collects. It rides INSIDE the binding object because it
    // is part of one answer — which branch, and that branch's value — so switching to the
    // existing list and back does not discard it, exactly as `name` survives the trip.
    application: defaultResourceBinding({ scratch: defaultScratchConfig() }),
    // Part 2 — the address, and what answers on it.
    domainType: 'azion', // azion | own
    // A KEY PER BRANCH, not one `domain` meaning "a prefix or a hostname, depending". The
    // two are different facts — `checkout` and `www.example.com` are not the same kind of
    // string — and one key holding both meant switching branches carried the prefix into a
    // field asking for a hostname and printed `https://checkout` as the address. Separate
    // keys also mean switching back and forth discards neither answer, exactly as the
    // resource question above keeps `existing` and `name` side by side.
    domainPrefix: '',
    domainHost: '',
    // Only on the custom branch: with no prefix to derive from, the workload still needs a
    // name for every list it appears in.
    name: '',
    environment: 'Production',
    certificate: 'azion_san',
    deploymentMode: 'auto', // auto | existing
    deployment: '',
    // Advanced — every one of these already carries the endpoint's own default.
    minimumTlsVersion: 'tls_1_2',
    customPage: '',
    allowAzionDomain: true,
    active: true
  })

  // `?application=<name>` SEEDS PART 1. The from-scratch application create ends by
  // offering "Deploy using a new workload"
  // (../applications/CreateApplication.vue → `deployMethods`), and the reader arriving from
  // there has exactly one application in mind — the one they just made. Seeding it means
  // the flow opens already pointed at it instead of asking them to find it in a list they
  // have never seen.
  //
  // A NAME NO ROW MATCHES SEEDS THE OTHER BRANCH. The picker is keyed by name
  // (../../lib/data/workload-flows.js → WORKLOAD_APPLICATIONS, which includes what this
  // session provisioned), so a stale or hand-written link used to seed nothing at all —
  // the reader landed on a list that did not contain what the link named and had to notice
  // that for themselves. Now the link is taken at its word: a name the account does not
  // have is a name to CREATE, so the flow opens on the create branch with it typed in.
  // Which is only honest because that branch can now build the whole application (its
  // cache, its connector) rather than just accepting a name.
  const seededApplication = String(route.query.application || '')
  if (WORKLOAD_APPLICATIONS.value.some((option) => option.value === seededApplication)) {
    form.application.existing = seededApplication
  } else if (seededApplication) {
    form.application.mode = 'new'
    form.application.name = seededApplication
  }

  const errors = reactive({})
  const clearErrors = () => Object.keys(errors).forEach((key) => delete errors[key])

  const submitting = ref(false)

  // The wizard page, so a failed check can hand the reader back to the field that caused it
  // (../../components/page/WizardPage.vue → `revealInvalid`). The binding part is the long
  // one: its domain field sits above the environment, the certificate, the deployment and
  // the Advanced band, so the miss it reports is off-screen from the bar that reports it.
  const page = ref(null)

  // The parts read and write through injected context rather than props — see
  // ./wizard/form-context.js for why (a child writing into a prop object is what
  // `vue/no-mutating-props` forbids).
  provideWorkloadForm({ form, errors })

  // The leave guard's trigger (mounted by WizardPage): dirty while the flow holds input
  // that has not been committed. Re-taken on the way OUT of a successful create.
  const { dirty, commit } = useBaseline(form)

  // --- What the answers derive ---------------------------------------------
  // Every one of these is read through the shared derivation rather than re-assembled
  // here: a summary that re-derives an answer is a summary that can disagree with it.
  const names = computed(() => workloadNamesFromForm(form))

  const applicationName = computed(() => resourceBindingName(form.application))
  const applicationIsExisting = computed(() => resourceBindingIsExisting(form.application))

  const deploymentName = computed(() =>
    form.deploymentMode === 'existing'
      ? workloadDeploymentName(form.deployment)
      : names.value.deployment
  )

  // WHAT ELSE THE CREATE BRANCH IS MAKING — the switched-on cache templates and the
  // connector, if either was asked for. Read from the same answer the part collected and
  // the commit provisions, so the three cannot disagree about what gets created. Empty on
  // the existing branch: nothing is being made, so there is nothing to list.
  const applicationExtras = computed(() => {
    if (applicationIsExisting.value) return []
    const { scratch } = form.application
    const policies = enabledCachePolicies(scratch)
    return [
      policies.length ? `${policies.length} cache setting${policies.length > 1 ? 's' : ''}` : '',
      scratch.connector.enabled
        ? `its ${connectorMeta(scratch.connector.type).label} connector`
        : ''
    ].filter(Boolean)
  })

  // What the summary says about part 1's answer.
  const applicationSummary = computed(() => {
    if (!applicationName.value) return 'Not chosen yet. Pick one, or create it with the workload.'
    if (applicationIsExisting.value) {
      return 'Serving its latest ready version. The domain answers with this.'
    }
    // The extras are named rather than counted, because they are resources this create
    // spends: a reader two parts downstream must be able to see that a connector and a
    // cache setting are riding along before they press the button that makes them.
    return applicationExtras.value.length
      ? `Created with the workload, plus ${applicationExtras.value.join(' and ')}.`
      : 'Created with the workload and built before the release is cut.'
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

  // WHERE THIS FLOW CAME FROM. The Workloads list by default — its own Create button is
  // there — or the Creation Center when the reader picked "Workload" out of that rail, which
  // sends `?from=/create` precisely so the way back is the index they were working from and
  // not a list they may never have opened (../../lib/behavior/create-origin.js).
  const { path: originPath, label: originLabel } = useCreateOrigin('/workloads', 'Workloads')

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  // Validation runs PER PART, on its own Next, and only over what that part asks. A wizard
  // that validated everything on the last button would report a missing application two
  // parts after the reader left the control that fills it.
  const validate = () => {
    clearErrors()

    if (step.value === 'application') {
      if (!applicationName.value) {
        errors.application = applicationIsExisting.value
          ? 'Select the application this workload serves, or create a new one.'
          : 'Name the application, or select one that already exists.'
      }
      // The layer's own required fields, and only the ones ON SCREEN: a switched-off
      // policy and the fields of a connector type the reader is not on are not rendered,
      // so a check against them would fail on something they were never shown
      // (../../lib/data/application-scratch.js → validateScratch). Nothing to check at all
      // on the existing branch — there is no application being created to configure.
      if (!applicationIsExisting.value) validateScratch(form.application.scratch, errors)
    }

    if (step.value === 'binding') {
      // Only the branch the reader is ON is checked — the other one's field is not on
      // screen, and reporting a miss on a control nobody can see is a dead end.
      if (form.domainType === 'own') {
        if (!form.domainHost.trim()) {
          errors.domainHost = 'Enter the hostname that points at this workload.'
        }
        // The custom branch is the only one that asks for a name; on the Azion branch the
        // prefix IS it.
        if (!form.name.trim()) errors.name = 'Name the workload.'
      } else if (!form.domainPrefix.trim()) {
        errors.domainPrefix = 'Enter the prefix for the Azion domain.'
      }
      if (form.deploymentMode === 'existing' && !form.deployment) {
        errors.deployment = 'Select the deployment the first release lands in.'
      }
    }

    return Object.keys(errors).length === 0
  }

  // The provisioning run's own step model, built from the answers: the application row
  // narrates whether it was created or reused, and the workload row names the address the
  // reader chose. Computed, so a Back-and-change is reflected in the run that follows.
  const provisioningSteps = computed(() =>
    workloadProvisioningSteps({
      workload: names.value.workload,
      domain: names.value.domain,
      application: applicationName.value,
      applicationExisting: applicationIsExisting.value,
      environment: form.environment,
      deployment: deploymentName.value,
      deploymentExisting: form.deploymentMode === 'existing'
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

  // THE CONNECTOR AND THE CACHE SETTINGS THE READER CONFIGURED — the create branch only,
  // because it is the only branch that makes an application to configure. Bound to an
  // existing one, the chain keeps the connector a deploy implies (it reads from the bucket
  // the upload went to); created here, the answer already exists, so it is handed over
  // rather than derived (../../../shared/lib/provisioning.js). The same hand-off the
  // application create's from-scratch commit makes.
  const applicationLayer = () => {
    if (applicationIsExisting.value) return {}
    const { scratch } = form.application
    const name = applicationName.value
    return {
      connector: scratchConnector(scratch, name, connectorMeta(scratch.connector.type).label),
      cachePolicies: scratchCachePolicies(scratch, name)
    }
  }

  const onFinished = () => {
    provisioned.value = provisionDeployment({
      ...applicationLayer(),
      repoName: names.value.workload,
      framework: '',
      templateTitle: names.value.workload,
      // The application is named on its OWN part here, so the chain reports the name the
      // reader typed rather than renaming it after the workload — and says whether it was
      // created or merely bound.
      applicationName: applicationName.value,
      applicationBound: applicationIsExisting.value,
      // The address the reader watched being derived on part 3. Without this the chain
      // would report a second, randomly minted domain and contradict the create.
      domain: names.value.domain
      // No firewall: this create does not ask for one, so the chain records none and the
      // workload's own page is where one gets bound (`provisionDeployment` defaults
      // `firewall` to false — see ../../../shared/lib/provisioning.js).
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

  // WHAT HAPPENED, in this flow's own words. DeploySuccess defaults to "Application
  // deployed", which is the application create's claim — this create ships a workload, and
  // the heading has always been the one false line on the screen at the end of it.
  //
  // The lead branches with the domain, because "is live" is only true on one of them. An
  // Azion domain answers the moment the run finishes; a custom hostname answers when the
  // reader's DNS points at it, which is work this flow does not do and must not claim.
  const successLead = computed(() => {
    const app = applicationName.value || 'the application'
    return form.domainType === 'own'
      ? `The workload is serving ${app}. Point ${names.value.domain} at it to send traffic.`
      : `https://${names.value.domain} is live and serving ${app}.`
  })

  // --- The part's own advance ----------------------------------------------
  const nextLabel = computed(() => (isLastStep.value ? 'Create and deploy' : 'Next'))

  // Nothing is disabled here: a button that reports what is missing beats one the reader
  // cannot press and cannot ask. `validate` is what blocks.
  const nextDisabled = computed(() => false)
</script>

<template>
  <WizardPage
    ref="page"
    :breadcrumb="[{ label: originLabel, href: originPath }, { label: 'Create Workload' }]"
    :back-label="`Back to ${originLabel}`"
    title="Create Workload"
    description="A workload is the public entry point: what it serves, and the domain traffic arrives on. The last step provisions both."
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
    <ApplicationStep
      v-if="step === 'application'"
      :disabled="submitting"
    />

    <template v-else-if="step === 'binding'">
      <!-- WHAT IS BEING BOUND, above the questions about it. The reader chose an
           application one part ago and now has to give it an address; losing sight of it is
           how a domain ends up pointed at the wrong application. The shape the application
           flow's counterpart has (../applications/wizard/SourceSummary.vue): a projected
           answer is a summary, and a summary is one card. Read-only, with a way BACK to the
           part that OWNS the answer rather than a second control for it here. -->
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
                    class="ai ai-edge-application text-[1rem] leading-none text-(--text-default)"
                    aria-hidden="true"
                  />
                </span>
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ applicationName || 'No application' }}</Item.Title>
                <Item.Description>{{ applicationSummary }}</Item.Description>
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
          </Item.List>
        </template>
      </CardBox>

      <BindingStep :disabled="submitting" />
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
          from: names.workload || 'workload',
          to: ''
        }"
        @finished="onFinished"
        @failed="onFailed"
      />
      <DeploySuccess
        v-else
        title="Workload deployed"
        :lead="successLead"
        :resources="createdResources"
        @manage="manageWorkload"
      />
    </template>
  </WizardPage>
</template>
