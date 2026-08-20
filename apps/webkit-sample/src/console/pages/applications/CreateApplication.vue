<script setup>
  // THE APPLICATION CREATE — a WIZARD, because the first answer decides the rest.
  //
  // ── WHY THIS ONE CREATE IS IN PARTS ──
  //
  // Every other create in this console is one page of Section bands with one Save
  // (../../components/page/CreatePage.vue), and that is right for them: a DNS zone or a
  // team asks a fixed set of questions in a fixed order, and splitting a fixed form into
  // parts buys the reader nothing but clicks. An application is the exception. The
  // question that matters — WHERE DOES THE CODE COME FROM — changes which questions
  // follow it, and asking all of them at once means showing a repository field to
  // somebody starting from scratch.
  //
  // So: three flows, each declaring its own parts (../../lib/data/application-flows.js).
  //
  //   Import from Git       method → repository → configure
  //   Start from scratch    method → configure                  (it IS the source)
  //   Start from a template method → template   → repository → configure
  //                         method → template   → configure     (an Azion template)
  //
  // THE TEMPLATE FLOW'S THIRD PART IS CONDITIONAL, and on the answer to the part before
  // it. A FRAMEWORK STARTER is cloned into the reader's own GitHub account, so it needs
  // an authorized account and somewhere to land — new repository or one already there
  // (./wizard/RepositoryStep.vue). An AZION TEMPLATE is configured rather than cloned:
  // its settings ARE the template, so the part is dropped and the rail goes back to
  // three rather than asking anybody to authorize GitHub for a clone that never happens
  // (../../lib/data/templates.js → `requiresRepository`).
  //
  // The CHROME is the create page's, unchanged — same header, same measure, same band
  // rhythm, same floating action bar (../../components/page/WizardPage.vue explains what
  // it adds and what it borrows). A wizard is not a different kind of page; it is this
  // create page whose questions arrive in parts.
  //
  // ── WHAT MOVED, AND WHAT DID NOT ──
  //
  // This page was the API-shaped form: `name`, the seven `modules` switches, `active`
  // and `debug`, in three open bands. Those fields all still exist, with the same copy
  // and in the same order — they are the Configure part's ADVANCED disclosure
  // (./wizard/ConfigureStep.vue), because every one already carries the endpoint's own
  // default and none of them is the reason anybody opens this flow. `name` stayed open
  // and required: it is the endpoint's only requirement and the name the whole
  // provisioned chain takes.
  //
  // The CREATION CENTER (/create) and the template deploy (/deploy) are untouched. They
  // are the header's Create — the console's own front door for "make something" — and
  // this flow does not replace them; a reader who lands on Applications and presses
  // Create gets this, a reader who presses Create in the header gets that.
  //
  // ── CREATING IS DEPLOYING HERE, AND THE VERB SAYS SO ──
  //
  // The old form's Save created an application and stopped, because publishing spends
  // real infrastructure and a button labelled "Save" must not do that as a side effect.
  // This flow's commit is labelled "Create and deploy" and does both — honest, because
  // the reader who arrived by picking a repository came to deploy that repository,
  // and a create that stopped short would leave them on a list hunting for a Deploy
  // button. The verb is what makes it consent instead of a surprise.
  import { toast } from '@aziontech/webkit/toast'
  import { provisionDeployment, resourceChain } from '@shared/lib/provisioning'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DeploymentFlow from '../../components/deployment/DeploymentFlow.vue'
  import WizardPage from '../../components/page/WizardPage.vue'
  import { useBaseline } from '../../lib/behavior/forms'
  import {
    getApplicationFlow,
    PROVISIONAL_STEPS,
    SCRATCH_SOURCE
  } from '../../lib/data/application-flows'
  import { defaultModuleState } from '../../lib/data/application-modules'
  import { defaultFirewallModuleState, enabledFirewallModules } from '../../lib/data/firewalls'
  import { configuredTemplateSteps } from '../../lib/data/template-provisioning'
  import ConfigureStep from './wizard/ConfigureStep.vue'
  import DeploySuccess from './wizard/DeploySuccess.vue'
  import { provideCreateForm } from './wizard/form-context'
  import GitSourceStep from './wizard/GitSourceStep.vue'
  import MethodStep from './wizard/MethodStep.vue'
  import RepositoryStep from './wizard/RepositoryStep.vue'
  import SourceSummary from './wizard/SourceSummary.vue'
  import TemplateSourceStep from './wizard/TemplateSourceStep.vue'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // --- The answers ---------------------------------------------------------
  // `source` is the first answer: a repository, a template, or from scratch. ONE shape for
  // all three (see ./wizard/GitSourceStep.vue → emitSource), so nothing downstream has
  // to know which door the reader came through.
  const source = ref(null)

  // WHERE THE CLONE LANDS — the template flow's third answer, and only that flow's. One
  // shape for both ways of answering it (see ./wizard/RepositoryStep.vue):
  //
  //   { mode: 'new' | 'existing', owner, name, visibility }
  //
  // It is NOT folded into `source`: the source is WHAT is being deployed and is the same
  // object whichever door the reader came through, while this is WHERE a copy of it goes
  // — and two of the three flows never have one.
  const repository = ref(null)

  // --- Phase and position --------------------------------------------------
  // `phase` is where the FLOW is: asking, running, done. `stepIndex` is where inside the
  // asking. They are separate because the run and the outcome are not parts — nothing is
  // asked in either, and neither has a Back.
  const phase = ref('wizard') // wizard | deploying | success
  const flowId = ref('')
  const stepIndex = ref(0)

  const flow = computed(() => getApplicationFlow(flowId.value))

  // Before a method is chosen the progress shows the PROVISIONAL shape (three parts —
  // what two of the three flows really have), so the first screen of a stepped flow is
  // not the one screen with no progress on it. Once a flow is chosen the progress is that
  // flow's own list, which for from scratch is one part shorter. See PROVISIONAL_STEPS.
  //
  // THE REPOSITORY PART IS CONDITIONAL. Only the template flow declares it, and only a
  // framework starter keeps it: an Azion template is configured rather than cloned, so
  // there is nothing to authorize and nowhere for a clone to land. Before a template is
  // chosen the part STAYS — the flow's real shape is four, and learning it is one part
  // shorter after answering is the direction to be wrong in (see PROVISIONAL_STEPS).
  const needsRepository = computed(
    () => flowId.value === 'template' && source.value?.requiresRepository !== false
  )

  const steps = computed(() => {
    const declared = flow.value?.steps ?? PROVISIONAL_STEPS
    return needsRepository.value ? declared : declared.filter((part) => part.id !== 'repository')
  })
  const step = computed(() => steps.value[stepIndex.value]?.id ?? 'method')
  const isLastStep = computed(() => stepIndex.value === steps.value.length - 1)

  // The request body. Keyed by the API's own names — `modules` is snake_case because
  // this object IS the body — plus the two build commands the deploy needs. `settings`
  // holds whatever the chosen template declares.
  const form = reactive({
    name: '',
    buildCommand: 'npm run build',
    deployCommand: 'npm run deploy',
    settings: {},
    // Not part of the application body: a firewall is its own resource, so it travels to
    // the provisioning call rather than into `payload()`. Its modules are decided in the
    // same part that decides whether there is a firewall at all.
    //
    // ON by default, and the reader still decides. An application that reaches production
    // with nothing in front of it is the expensive default, so the flow pre-answers the
    // question the safe way rather than leaving it to be remembered. The consent is not
    // skipped, it is moved: the switch is on the part, open and unfolded above its modules
    // (./wizard/ConfigureStep.vue), so opting out is one visible click before the commit.
    firewall: true,
    firewallModules: defaultFirewallModuleState(),
    modules: defaultModuleState(),
    active: true,
    debug: false
  })

  // Per-field messages, filled on the commit attempt and cleared as the reader edits.
  const errors = reactive({})
  const clearErrors = () => Object.keys(errors).forEach((key) => delete errors[key])

  // The parts read and write both through injected context rather than props — see
  // ./wizard/form-context.js. The Configure part is the one that writes.
  provideCreateForm({ form, errors })

  const submitting = ref(false)

  // The wizard page, so a failed check can hand the reader back to the field that caused it
  // (./../../components/page/WizardPage.vue → `revealInvalid`). Configure is the part that
  // needs it: name sits at the top of a card, above the build pair, the template settings,
  // the protection card and the Advanced band — several screens above the bar that reports
  // the miss.
  const page = ref(null)
  const revealInvalid = () => page.value?.revealInvalid()

  // The leave guard's trigger (../../components/form/UnsavedChangesGuard.vue, mounted by
  // WizardPage): dirty while the flow holds input that has not been committed. The
  // baseline is re-taken on the way OUT of a successful create — this page's own
  // navigation must not be stopped by the guard that exists to protect the input the
  // create just consumed.
  const { dirty, commit } = useBaseline(() => ({
    ...form,
    source: source.value,
    repository: repository.value
  }))

  // --- Choosing a source seeds the name ------------------------------------
  // The project name defaults to the source's own name, because that is what the reader
  // would type. `nameTouched` keeps a later seed from overwriting a name they typed
  // themselves — switching template must not silently rename their project.
  const nameTouched = ref(false)
  watch(
    () => form.name,
    (next) => {
      if (next && next !== (source.value?.defaultName ?? '')) nameTouched.value = true
    }
  )

  const setSource = (next) => {
    source.value = next
    clearErrors()

    if (!nameTouched.value) form.name = next?.defaultName ?? ''

    // A different source is a different clone, so where the last one was going does not
    // survive it — a repository named after the template the reader just abandoned would
    // otherwise ride along into the deploy.
    repository.value = null

    // Reset the per-template settings to the new template's schema: values keyed to a
    // template the reader is no longer deploying would be sent anyway.
    Object.keys(form.settings).forEach((key) => delete form.settings[key])
    ;(next?.settings ?? []).forEach((setting) => {
      form.settings[setting.name] = ''
    })
  }

  // The repository part writes its answer up on every change, so the message it failed
  // on clears as the reader fixes it rather than surviving until the next press.
  const setRepository = (next) => {
    repository.value = next
    if (errors.repository) delete errors.repository
  }

  // CHOOSING A SOURCE IS THE ADVANCE. Picking a repository, committing a URL or picking a
  // template answers the whole part, so the part is over — the same rule the method rows
  // follow. A Next beside a chosen row would be a second answer to a question already
  // answered, and the part the reader lands on opens with a summary of what they picked
  // (with a Change back to here), so the choice is confirmed on the way forward rather
  // than by staying put and reading a checkmark.
  //
  // Every path into here is an explicit commit — a row click, or the URL field's own
  // "Use this repository" — so nothing advances while the reader is still typing.
  const selectSource = (next) => {
    setSource(next)
    if (next && !isLastStep.value) stepIndex.value += 1
  }

  // Choosing a method starts that flow at its part after `method`. From scratch IS its own
  // source, so it sets one here and lands on Configure — the part it would otherwise
  // reach by answering a question with one possible answer.
  const chooseMethod = (id) => {
    flowId.value = id
    if (id === 'scratch') setSource({ ...SCRATCH_SOURCE })
    else setSource(null)
    stepIndex.value = 1
  }

  // `?method=<flow>` enters a DEDICATED flow at its first real question, skipping the
  // chooser — so a link that names one way in delivers that way in.
  const seedFromQuery = () => {
    const method = route.query.method
    if (method && getApplicationFlow(String(method))) {
      chooseMethod(String(method))
      commit() // a seeded method is not the reader's unsaved input
    }
  }
  seedFromQuery()

  // --- Moving through the flow ---------------------------------------------
  const goBack = () => {
    if (stepIndex.value <= 0) return
    stepIndex.value -= 1
    clearErrors()
    // Stepping back ONTO the method part abandons the flow, so the progress must stop
    // claiming a flow was chosen.
    if (stepIndex.value === 0) flowId.value = ''
  }

  // Only backwards, and only to a part already answered — the progress hands up an index
  // it has already checked is behind the reader.
  const goToStep = (index) => {
    if (index >= stepIndex.value) return
    stepIndex.value = index
    clearErrors()
    if (index === 0) flowId.value = ''
  }

  const cancel = () => router.push({ path: '/applications', query: { email: userEmail.value } })

  // Validation runs on the COMMIT only, and only over fields on screen: `name` and
  // whatever the template declared required. Every other field carries the endpoint's
  // own default, which is what lets them sit behind the Advanced disclosure without a
  // failed submit ever pointing somewhere the reader cannot see.
  // The repository part's own check, run on ITS advance rather than at the commit: it is
  // the one part with a Next that is not the last, so its answer is verified where it is
  // given instead of two parts later.
  const validateRepository = () => {
    clearErrors()
    const target = repository.value
    if (!target?.name) {
      errors.repository =
        target?.mode === 'existing'
          ? 'Choose a repository, or create a new one.'
          : 'This field is required.'
    }
    return !errors.repository
  }

  const validate = () => {
    clearErrors()
    if (!form.name.trim()) errors.name = 'This field is required.'
    ;(source.value?.settings ?? [])
      .filter((setting) => setting.required)
      .forEach((setting) => {
        if (!String(form.settings[setting.name] ?? '').trim()) {
          errors[setting.name] = 'This field is required.'
        }
      })
    return Object.keys(errors).length === 0
  }

  // The request body, exactly as POST /v4/workspace/applications expects it: each module
  // flag nested under its own `{ enabled }` object.
  // A source with no build contributes no build commands: sending `npm run build` for the
  // bare Azion layer would describe a build nobody asked for.
  const buildFields = () =>
    source.value?.requiresBuild
      ? { buildCommand: form.buildCommand.trim(), deployCommand: form.deployCommand.trim() }
      : {}

  const payload = () => ({
    ...buildFields(),
    name: form.name.trim(),
    modules: Object.fromEntries(
      Object.entries(form.modules).map(([key, enabled]) => [key, { enabled }])
    ),
    active: form.active,
    debug: form.debug
  })

  const advance = async () => {
    if (submitting.value) return

    if (!isLastStep.value) {
      if (step.value === 'repository' && !validateRepository()) {
        revealInvalid()
        return
      }
      stepIndex.value += 1
      clearErrors()
      return
    }

    if (!validate()) {
      revealInvalid()
      return
    }

    // The commit. One flag locks the whole part while the request is in flight; the
    // fieldset in WizardPage is the native safety net and each control takes the same
    // flag for its disabled visual.
    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))
      phase.value = 'deploying'
    } catch (error) {
      toast.error('Could not start the deployment.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => advance() }
      })
    } finally {
      submitting.value = false
    }
  }

  // --- Whose account this ends up in ---------------------------------------
  // THE GIT OWNER, or nothing. It is the reader's own account in the two flows that have
  // one — the repository they imported, or the repository the template was cloned into —
  // and empty for the rest. A template's own `repoOwner` is `aziontech`, the UPSTREAM
  // that ships the starter, so printing it would tell the reader they just deployed into
  // an organisation they have nothing to do with.
  const gitScope = computed(() => {
    if (repository.value?.owner) return repository.value.owner
    return source.value?.kind === 'git' ? (source.value.repoOwner ?? '') : ''
  })

  // The clone's DESTINATION, as the deploy splash says it: "Cloning aziontech/templates/
  // nextjs to gab-az/my-repository". The full path, because the account alone does not
  // say what is being created in it.
  const cloneDestination = computed(() => {
    if (repository.value?.name) return `${repository.value.owner}/${repository.value.name}`
    return gitScope.value || 'gab-az'
  })

  // --- The run's own story --------------------------------------------------
  // A CONFIGURED source has no clone and no build, so the card must not narrate one. The
  // template-deploy pipeline mints a token, clones the starter, installs, builds, uploads
  // and wires a repository secret — six rows of work that never runs for an Azion
  // template, whose settings ARE the deploy
  // (../../lib/data/template-provisioning.js). Same for the splash: "Cloning
  // aziontech/templates/proxy to gab-az" invents both ends of a copy nobody made.
  //
  // A framework starter and a git import keep the deploy story unchanged — they really
  // are cloned — so all three of these resolve to the card's own defaults for them.
  const isConfigured = computed(() => source.value?.requiresRepository === false)

  const deploySteps = computed(() =>
    isConfigured.value
      ? configuredTemplateSteps({
          title: source.value?.title ?? 'template',
          settings: (source.value?.settings ?? []).map((setting) => setting.label)
        })
      : undefined
  )

  const deploySplash = computed(() =>
    isConfigured.value
      ? {
          verb: 'Provisioning',
          icon: source.value?.icon || 'ai ai-applications',
          from: source.value?.title ?? 'application',
          // No destination: a configuration is not copied anywhere, and the card drops
          // the second chip when `to` is empty.
          to: ''
        }
      : null
  )

  // --- The run and its outcome ---------------------------------------------
  // A finished deploy provisions the CHAIN — Workload → Application → Connector →
  // Storage (../../../shared/lib/provisioning.js) — so the created resources are
  // immediately real for the rest of the console: they appear in the Workloads,
  // Applications and Object Storage lists, and Manage opens the new workload.
  const provisioned = ref(null)
  const createdResources = computed(() =>
    provisioned.value ? resourceChain(provisioned.value) : []
  )

  const onDeployFinished = () => {
    const application = payload()
    provisioned.value = provisionDeployment({
      repoName: application.name,
      // The account the code actually lives in, so the Application row's repository
      // reads `gab-az/my-app` and not the upstream that shipped the starter.
      scope: gitScope.value || 'gab-az',
      isPublic: repository.value ? repository.value.visibility !== 'private' : true,
      framework: source.value?.framework ?? '',
      templateTitle: source.value?.title ?? application.name,
      firewall: form.firewall,
      firewallModules: enabledFirewallModules(form.firewallModules)
    })
    // The create landed: nothing is pending any more, so the leave guard stands down
    // before this flow navigates on its own success.
    commit()
    phase.value = 'success'
  }

  // A failed run goes BACK to the part that can fix it, with the reason in a toast. It
  // does not strand the reader on a dead progress card, and it does not pretend the
  // deploy succeeded.
  const onDeployFailed = (failedStep) => {
    phase.value = 'wizard'
    toast.error('The deployment did not finish.', {
      description: `It stopped at ${failedStep}. Check the configuration and deploy again.`,
      action: { label: 'Try again', onClick: () => advance() }
    })
  }

  const manageWorkload = () =>
    router.push({
      path: `/workloads/${provisioned.value?.workload.id ?? ''}`,
      query: { email: userEmail.value, name: provisioned.value?.workload.name }
    })

  // THE SUMMARY'S WAY BACK. It names two answers, so it hands up WHICH one rather than
  // an index: the part that holds each is a fact about the flow, and the summary has no
  // business knowing that from scratch has no source part (so its source lives on the
  // method part, index 0).
  const onChangeAnswer = (answer) =>
    goToStep(answer === 'repository' ? 2 : flowId.value === 'scratch' ? 0 : 1)

  // --- The part's own advance ----------------------------------------------
  // THE FIRST PART HAS NO BAR. Nothing to go back to and nothing to advance: the flow
  // has not started, and the reader is choosing WHICH flow it will be — the three rows
  // are the only forward there is. So the method part declares no advance and the band
  // itself retires with it (../../components/page/WizardPage.vue renders the footer only
  // when something is in it), which is also the honest reading of the geometry: an empty
  // bar at the foot of the first screen is a control strip with no controls.
  //
  // EVERY PART AFTER IT CARRIES THE ADVANCE, in the same place with the same label —
  // Next until the last, where it becomes the commit's own verb. Once the flow is
  // running, the way forward does not move and does not disappear for a part.
  const nextLabel = computed(() => {
    if (step.value === 'method') return ''
    return isLastStep.value ? 'Create and deploy' : 'Next'
  })

  // AND IT IS GATED WHERE THERE IS NOTHING TO REPORT. Two kinds of part, two rules:
  //
  //   The SOURCE part is answered by CHOOSING: it has no field to fail and no place to
  //     put a message — the answer is which row was pressed. So its advance is disabled
  //     until one is. Pressing the row both answers the part and advances it (see
  //     `selectSource`), so the reader never comes down to the bar to confirm a choice
  //     they just made; the advance is there to say the flow continues and that this
  //     part is what is holding it.
  //   A TYPED part (repository, configure) keeps its advance live and validates on the
  //     press, so the miss is reported at the field that missed rather than by a button
  //     the reader cannot press and cannot ask.
  const nextDisabled = computed(() => step.value === 'source' && !source.value)
</script>

<template>
  <WizardPage
    ref="page"
    :breadcrumb="[
      { label: 'Applications', href: '/applications' },
      { label: 'Create application' }
    ]"
    back-label="Back to Applications"
    title="Create application"
    description="An application is the code Azion runs, and the configuration it runs with. Choose where the code comes from, name it, and the last step deploys it along with the workload that publishes it."
    title-id="create-application-title"
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
    <!-- THE PART. One at a time, each a set of Section bands — the same anatomy, in the
         same order, that every create page in this console uses. -->
    <MethodStep
      v-if="step === 'method'"
      @select="chooseMethod"
    />

    <GitSourceStep
      v-else-if="step === 'source' && flowId === 'git'"
      :source="source"
      :disabled="submitting"
      @update:source="selectSource"
    />

    <TemplateSourceStep
      v-else-if="step === 'source' && flowId === 'template'"
      :source="source"
      :disabled="submitting"
      @update:source="selectSource"
    />

    <!-- WHERE THE CLONE LANDS — framework starters only, and the wizard has already
         dropped this part for an Azion template (see `needsRepository`). -->
    <RepositoryStep
      v-else-if="step === 'repository'"
      :source="source"
      :repository="repository"
      :errors="errors"
      :disabled="submitting"
      @update:repository="setRepository"
    />

    <template v-else-if="step === 'configure'">
      <!-- WHAT IS BEING CONFIGURED, above the questions about it. The reader chose it one
           part ago and now has to name and build it, so losing sight of it is how a
           template deploy ends up with the wrong project name. Change goes back to the
           part that chose it — or, for from scratch which has no source part, to the
           method. The same row rides into the run below (see #terminal), read-only. -->
      <SourceSummary
        :source="source"
        :repository="repository"
        :disabled="submitting"
        class="mb-(--layout-section-gap)"
        @change="onChangeAnswer"
      />

      <ConfigureStep
        :source="source"
        :disabled="submitting"
      />
    </template>

    <!-- PAST THE QUESTIONS: the run, then the outcome. Both take the whole measure —
         see WizardPage's `terminal` for why they are this page and not another. -->
    <template #terminal>
      <!-- WHAT IS BEING DEPLOYED, still on top. The run's own card narrates the WORK
           (clone, install, build, provision) and never names the thing the work is for,
           so without this row the one screen the reader watches the deploy from is the
           one screen that cannot answer "which template did I just ship". Read-only: the
           clone is in flight, so there is nothing left to change.
           It gives way on success — DeploySuccess is the record of what shipped, and the
           same handoff the Creation Center's template deploy makes with its preview strip
           (../marketplace/DeployTemplate.vue). -->
      <template v-if="phase === 'deploying'">
        <SourceSummary
          :source="source"
          :repository="repository"
          :changeable="false"
          class="mb-(--layout-section-gap)"
        />

        <DeploymentFlow
          :title="isConfigured ? 'Provisioning' : 'Deployment'"
          :status-label="isConfigured ? 'Creating' : 'Building'"
          :steps="deploySteps"
          :splash="deploySplash"
          :repo-owner="source?.repoOwner ?? 'aziontech'"
          :repo-path="source?.repoPath ?? 'templates/hello-world'"
          :scope="cloneDestination"
          @finished="onDeployFinished"
          @failed="onDeployFailed"
        />
      </template>
      <!-- The scope tag is the GIT owner, so it is passed only for a git import. From
           scratch and the templates carry `aziontech` as their upstream `repoOwner`, and
           printing that would tell the reader they just deployed into an organisation they
           have nothing to do with. -->
      <DeploySuccess
        v-else
        :resources="createdResources"
        :scope="gitScope"
        @manage="manageWorkload"
      />
    </template>
  </WizardPage>
</template>
