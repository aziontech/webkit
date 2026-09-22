<script setup>
  // CreateFunction — the create page for a Function, and the ONE create in the console
  // that is not the generic renderer (../components/CreateResource.vue).
  //
  // WHY IT IS ITS OWN PAGE. Every other first-level resource is created by answering
  // questions: a name, a type, a couple of toggles. A function is not — the RESOURCE IS
  // THE CODE. Asking for it as one field among four, in a 12-row textarea inside a band,
  // is the create page saying the code is a detail of the form. It is the form. So the
  // editor gets the viewport, and the rest of `POST v4/workspace/functions` moves out of
  // its way:
  //
  //   the NAME  → into the commit bar, so the one required field is on screen from
  //               whichever tab the reader presses Save on;
  //   the ARGS  → their own editor, because `default_args` is JSON the reader writes,
  //               not a value they pick — the same tab the console gives them;
  //   the REST  → Main Settings (runtime, execution environment, status).
  //
  // THE FIELDS ARE THE CONSOLE'S, ONE FOR ONE. The body this page builds is the body the
  // console's own adapter builds — `{ name, code, runtime, execution_environment,
  // default_args, azion_form, active }` — and the tabs carry the same three groups
  // (Code · Arguments · Main Settings). One deliberate difference, stated where it
  // happens: the name is in the commit bar rather than in Main Settings.
  //
  // `azion_form` — the JSON Schema the console renders as a form over the arguments —
  // is written from the Arguments document's own JSON / Form Builder switch
  // (../components/function/FunctionArgsForm.vue), which is where both ways of writing
  // it live: as a list of fields, or as the schema itself.
  //
  // The surface rule is untouched (../lib/surfaces.js): a first-level resource creates
  // on a PAGE, at `/functions/new`, linkable and reload-safe. What changes is the page's
  // shape, not where it lives — this is the create page a code resource asks for, not an
  // exemption from the rule.
  //
  // WHY THE PAGE DOES NOT SCROLL. It is `h-dvh` and the regions inside it are what
  // scroll: the editor scrolls its own document, the Settings tab scrolls its bands. An
  // editor that grows the page instead of scrolling itself would push the commit bar off
  // the bottom, and a code editor whose Save you have to scroll to find is not one. That
  // is also why the bar here is a hard-edged sibling rather than CreatePage's translucent
  // gradient: nothing passes under it, so there is no edge to soften.
  //
  // The FIELDS and their guidance are the same ones ../lib/create-resources.js declares
  // for this resource, and the editor opens on the same starter — one API truth, two
  // renderings of it.
  import CardBox from '@aziontech/webkit/card-box'
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, useId, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FunctionCodeEditor from '../../components/function/FunctionCodeEditor.vue'
  import FunctionSettings from '../../components/function/FunctionSettings.vue'
  import Section from '../../components/page/Section.vue'
  import StepperCreatePage from '../../components/page/StepperCreatePage.vue'
  import DependencyStep from '../../components/resource/DependencyStep.vue'
  import ModuleStep from '../../components/resource/ModuleStep.vue'
  import ReviewStep from '../../components/resource/ReviewStep.vue'
  import { hostRecord, HOSTS, resolveHostChoice } from '../../lib/behavior/application-binding'
  import { CREATION_CENTER_PATH, useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import { bindingFor } from '../../lib/data/create-bindings'
  import { FUNCTION_ARGS, FUNCTION_STARTER } from '../../lib/data/create-resources'
  import { addFunction, RUNTIMES } from '../../lib/data/functions'
  import { hostHasModule, moduleRequirementFor } from '../../lib/data/resource-dependencies'

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow, so identity survives every hop —
  // the same contract CreatePage and CreationHeader keep.
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // THE STEPS, in the order the decisions are actually made: where the function runs (and
  // the module that lets it), the code itself, the settings around it, then a review. The
  // detail page keeps the same two surfaces as TABS (./FunctionDetail.vue) — correcting a
  // function is not ordered, writing one is.
  const DEPENDENCY_STEP = 'where-it-runs'
  const MODULE_STEP = 'module'
  const CODE_STEP = 'code'
  const SETTINGS_STEP = 'settings'
  const REVIEW_STEP = 'review'
  // Which document the shared editor is showing. Local here (the create page has no
  // record to link to yet); the detail page puts the same model in its URL.
  const editorDocument = ref('code')

  // The request body of `POST v4/workspace/functions`, one ref per property the endpoint
  // takes. `runtime` has a single value (`azion_js`) so it is not a ref — it is shown
  // locked and posted as a constant.
  const name = ref('')
  const code = ref(FUNCTION_STARTER)
  const args = ref(FUNCTION_ARGS)
  // `azion_form` — the JSON Schema the Form Builder writes. Empty until the reader adds
  // a form; the endpoint takes the function without one.
  const form = ref('')
  const executionEnvironment = ref('application')
  const active = ref(true)

  // The gate's answer: `{ mode, name }`, or null when the reader continued without an
  // application. Resolved (and provisioned, on the new branch) at SAVE, not here.
  const applicationChoice = ref(null)

  // A new function is written in JavaScript. The endpoint's other runtime (`azion_lua`)
  // exists on functions the platform already holds, but nothing here writes Lua, so the
  // create page states one runtime instead of asking a question with one useful answer.
  const RUNTIME = RUNTIMES.azion_js

  const saving = ref(false)

  // The leave guard's trigger (ui/UnsavedChangesGuard.vue). This page's fields are separate
  // refs rather than one reactive record, so the baseline reads them through a getter — a
  // ref inside a plain object serializes to its internals, not its value. `commit` runs on
  // the way OUT of a successful create, so the page's own navigation is not stopped by the
  // guard protecting the input that create just consumed.
  const { dirty, commit } = useBaseline(() => ({
    name: name.value,
    code: code.value,
    args: args.value,
    form: form.value,
    executionEnvironment: executionEnvironment.value,
    active: active.value,
    applicationChoice: applicationChoice.value
  }))

  // Validation runs on SUBMIT only — nothing is judged while the reader is still typing,
  // and an empty required field gets the amber `required` prompt rather than a red error.
  // The exception is the args editor: Monaco's JSON worker underlines a syntax error as
  // it is typed, which is the language server doing what it is for, not the form judging.
  const nameError = ref('')
  const codeError = ref('')
  const argsError = ref('')
  const formError = ref('')

  const nameId = useId()
  const nameMessageId = useId()

  const listPath = '/functions'

  // ── WHO ASKED FOR THIS FUNCTION ───────────────────────────────────────────
  //
  // Normally this page is entered from the module and leaves back to it. But a function
  // is also the RELATED resource of other forms — an application's Functions Instances
  // drawer picks one, and its "Create Function" quick-add sends the reader here rather
  // than to a reduced copy of this page in a nested drawer (../lib/surfaces.js: a
  // first-level resource creates on a page).
  //
  // Such a caller passes `returnTo` (where to come back to, already carrying its own
  // resume marker) and `returnLabel` (what to call it, in the crumb and on Back). Both
  // outcomes return there — saved, with the new function's id; cancelled, with the
  // caller's form intact — so the round trip costs the reader nothing.
  //
  // And under that, the plain ORIGIN: `?from=`, which the Creation Center's rail sends when
  // the reader picked `Function` out of it (../../lib/behavior/create-origin.js). It is the
  // FALLBACK, not a third case — a caller waiting on this function outranks the screen the
  // reader browsed from, because that caller has a half-filled form to resume.
  const { path: originPath, label: originLabel } = useCreateOrigin(listPath, 'Functions')

  const returnTo = computed(() => String(route.query.returnTo || ''))
  const returnLabel = computed(() => String(route.query.returnLabel || originLabel.value))

  /** Leave for the caller (or the origin the reader came from), handing back any result. */
  const leave = (extraQuery = {}) => {
    if (!returnTo.value) {
      router.push({ path: originPath.value, query: { ...extraQuery, email: userEmail.value } })
      return
    }
    const back = router.resolve(returnTo.value)
    router.push({
      path: back.path,
      query: { ...back.query, ...extraQuery, email: userEmail.value }
    })
  }

  const cancel = () => leave()

  // The first crumb is where Back goes: the origin — the module, or whatever `?from=` named —
  // when this page was entered from it, the caller when one sent us. The caller's crumb is `#`
  // rather than its real path: its full location (query and resume marker included) lives in
  // `returnTo`, and `#` is the href StepperCreatePage already reads as "the same intent as Back".
  const breadcrumb = computed(() => [
    { label: returnLabel.value, href: returnTo.value ? '#' : originPath.value },
    { label: 'Create Function' }
  ])

  // ── WHERE THIS FUNCTION RUNS ──────────────────────────────────────────────
  //
  // A function is inert until an application holds it and a rule calls it
  // (../../lib/data/create-bindings.js reads that off the API), so the page opens on the
  // question rather than burying it in a tab: the gate is the first screen, and the editor
  // is behind it.
  //
  // TWO READERS SKIP IT. One arrived from a form that is already binding this function (a
  // `returnTo` caller — an application's Functions Instances drawer), and one is writing a
  // FIREWALL function, whose host is a firewall this prototype cannot write a rule into.
  // Both get the editor directly, and the second loses the answer if they switch the
  // environment after giving one.
  const applicationBindingSpec = bindingFor('functions')
  const hostSpec = HOSTS[applicationBindingSpec.host]

  const canBindApplication = computed(
    () => !returnTo.value && executionEnvironment.value === 'application'
  )

  const boundApplicationName = computed(() => applicationChoice.value?.name ?? '')

  // The matrix routes a function to its host THROUGH a function instance, and that is where
  // `modules.functions` is required (../../lib/data/resource-dependencies.js). So the module
  // question is the same one every other create asks, resolved through that hop.
  const moduleRequirement = computed(() =>
    canBindApplication.value ? moduleRequirementFor('functions', applicationBindingSpec.host) : null
  )

  const moduleMissing = computed(() => {
    if (!moduleRequirement.value || !applicationChoice.value) return false
    const record =
      applicationChoice.value.mode === 'existing'
        ? hostRecord(applicationBindingSpec.host, boundApplicationName.value)
        : {}
    return !hostHasModule(record ?? {}, moduleRequirement.value)
  })

  const enableModule = ref(false)

  // An account with no application cannot answer the gate at all — so the way on is the
  // Creation Center, where an application is made.
  const goToCreationCenter = () =>
    router.push({ path: CREATION_CENTER_PATH, query: { email: userEmail.value } })

  watch(executionEnvironment, (environment) => {
    if (environment !== 'application') applicationChoice.value = null
  })

  // A caller that is already binding this function (an application's Function Instances
  // drawer) has answered the host question for us, so its step is not asked again.
  const asksHost = computed(() => Boolean(applicationBindingSpec) && !returnTo.value)

  const stepDefs = computed(() => {
    const list = []

    if (asksHost.value) {
      list.push({
        value: DEPENDENCY_STEP,
        title: 'Where it runs',
        description: applicationBindingSpec.mechanism,
        heading: false
      })
      if (moduleRequirement.value && moduleMissing.value) {
        list.push({
          value: MODULE_STEP,
          title: moduleRequirement.value.label,
          description: `Off on ${boundApplicationName.value}.`
        })
      }
    }

    list.push({
      value: CODE_STEP,
      title: 'Code',
      description: 'The function body, and the arguments it is called with.',
      bleed: true
    })
    list.push({
      value: SETTINGS_STEP,
      title: 'Settings',
      description: 'What the function is called, where it runs, and whether it is active.'
    })
    list.push({
      value: REVIEW_STEP,
      title: 'Review',
      description: 'What will be created, and what it can do the moment it exists.'
    })

    return list
  })

  const currentStep = ref('')
  const unlocked = ref([])

  watch(
    stepDefs,
    (list) => {
      if (list.some((step) => step.value === currentStep.value)) return
      currentStep.value = list[0]?.value ?? ''
      unlocked.value = currentStep.value ? [currentStep.value] : []
    },
    { immediate: true }
  )

  const stepIndex = computed(() =>
    Math.max(
      0,
      stepDefs.value.findIndex((step) => step.value === currentStep.value)
    )
  )

  // Which step is carrying a message, so the rail can say so without the reader opening it.
  const stepHasError = (value) => {
    if (value === CODE_STEP) return Boolean(codeError.value || argsError.value || formError.value)
    if (value === SETTINGS_STEP) return Boolean(nameError.value)
    return false
  }

  const railSteps = computed(() =>
    stepDefs.value.map((step, index) => ({
      value: step.value,
      title: step.title,
      description: step.description,
      heading: step.heading !== false,
      bleed: Boolean(step.bleed),
      state: stepHasError(step.value)
        ? 'error'
        : saving.value && step.value === REVIEW_STEP
          ? 'loading'
          : index < stepIndex.value
            ? 'complete'
            : 'upcoming',
      disabled: !unlocked.value.includes(step.value)
    }))
  )

  const goNext = () => {
    const step = stepDefs.value[stepIndex.value]
    if (!step) return
    if (step.value === CODE_STEP && !validateCode()) return
    if (step.value === SETTINGS_STEP && !validateSettings()) return
    const next = stepDefs.value[stepIndex.value + 1]
    if (!next) return
    if (!unlocked.value.includes(next.value)) unlocked.value.push(next.value)
    currentStep.value = next.value
  }

  const goBack = () => {
    const previous = stepDefs.value[stepIndex.value - 1]
    if (previous) currentStep.value = previous.value
  }

  // Answering the host question moves the reader on, the way the full-screen gate did.
  const onHostAnswer = () => {
    enableModule.value = false
    goNext()
  }

  /** `default_args` is posted as an object, so what is typed has to parse. */
  const parsedArgs = () => {
    try {
      const value = JSON.parse(args.value)
      // `[1,2]` and `"x"` are valid JSON and invalid arguments: the endpoint takes an
      // object, and an array would be posted as one silently.
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  /** `azion_form` is posted as an object too, so an unfinished schema is not posted. */
  const parsedForm = () => {
    if (!form.value.trim()) return undefined // no form is a valid answer
    try {
      const value = JSON.parse(form.value)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  /**
   * The code step's own checks. A failure switches the editor to the document that holds
   * it — a message on a document nobody is looking at is a failed submit with no visible
   * cause — and the arguments are switched to LAST so the leftmost failure is what stays.
   */
  const validateCode = () => {
    codeError.value = code.value.trim() ? '' : 'This field is required.'
    argsError.value = parsedArgs() ? '' : 'Arguments must be a JSON object.'
    formError.value = parsedForm() === null ? 'The form schema must be a JSON object.' : ''

    if (formError.value || argsError.value) editorDocument.value = 'arguments'
    if (codeError.value) editorDocument.value = 'code'

    return !codeError.value && !argsError.value && !formError.value
  }

  /** The settings step's own check: the one field the endpoint requires. */
  const validateSettings = () => {
    nameError.value = name.value.trim() ? '' : 'This field is required.'
    if (nameError.value) globalThis.document.getElementById(nameId)?.focus()
    return !nameError.value
  }

  /**
   * The whole form, at commit. A failed submit must point at a field already on screen, so
   * the rail moves to the step that is carrying the message rather than leaving the reader
   * on Review beside an error they cannot see.
   */
  const validate = () => {
    const codeOk = validateCode()
    const settingsOk = validateSettings()
    if (!codeOk) currentStep.value = CODE_STEP
    else if (!settingsOk) currentStep.value = SETTINGS_STEP
    return codeOk && settingsOk
  }

  /**
   * Stands in for `POST v4/workspace/functions`. The body is built here, in the
   * endpoint's own snake_case, so the page shows the request it would actually send.
   */
  const post = (body) => new Promise((resolve) => globalThis.setTimeout(() => resolve(body), 900))

  /** The function, as the rows Review prints — each value under the property it posts. */
  const reviewAnswers = computed(() => [
    { field: { id: 'name', label: 'Name', api: 'name' }, value: name.value },
    { field: { id: 'runtime', label: 'Runtime', api: 'runtime' }, value: RUNTIME.label },
    {
      field: {
        id: 'execution_environment',
        label: 'Execution environment',
        api: 'execution_environment'
      },
      value: executionEnvironment.value
    },
    { field: { id: 'default_args', label: 'Arguments', api: 'default_args' }, value: args.value },
    { field: { id: 'active', label: 'Active', api: 'active' }, value: active.value }
  ])

  const save = async () => {
    if (saving.value) return // re-entrancy lock
    if (!validate()) return

    saving.value = true
    try {
      await post({
        name: name.value.trim(),
        code: code.value,
        runtime: RUNTIME.api,
        execution_environment: executionEnvironment.value,
        default_args: parsedArgs(),
        azion_form: parsedForm(),
        active: active.value
      })
      // The function joins the LIBRARY (../lib/functions.js), which is the same list
      // the module renders and the same one an application's Functions Instances tab
      // binds from. Creating a function here and not finding it in the selector there
      // would be the console saying these are two different products.
      const record = addFunction({
        name: name.value.trim(),
        runtimeApi: RUNTIME.api,
        executionEnvironment: executionEnvironment.value,
        code: code.value,
        args: parsedArgs(),
        form: parsedForm(),
        active: active.value
      })

      const application = canBindApplication.value
        ? resolveHostChoice(applicationBindingSpec.host, applicationChoice.value)
        : null

      if (application) {
        toast.success(`${record.name} created.`, {
          description: application.created
            ? `${application.name} was created for it. Save the rule to start running it.`
            : `Save the rule to run it on ${application.name}.`
        })
        commit()
        const target = applicationBindingSpec.destination({ host: application, record })
        router.push({ path: target.path, query: { email: userEmail.value, ...target.query } })
        return
      }

      // The success toast CARRIES THE RESOURCE: it names what was created and its action
      // opens THE FUNCTION, in the same three tabs this page wrote it in (Functions.vue §
      // OPENING A FUNCTION) — not the module list, which is where we are already landing
      // the reader. Creating is not deploying: this page writes the function; running it on
      // traffic is an instance on an application. When a caller sent us here, the toast
      // drops the action: we are already taking the reader back to the form that asked for
      // this function, and the function is what that form is about to hold.
      toast.success(
        `${record.name} created.`,
        returnTo.value
          ? undefined
          : {
              action: {
                label: 'Open function',
                onClick: () =>
                  router.push({
                    path: `${listPath}/${record.id}`,
                    query: { email: userEmail.value }
                  })
              }
            }
      )
      commit() // the create landed — the leave guard stands down
      leave(returnTo.value ? { created: record.id } : {})
    } catch (error) {
      toast.error('Could not create the function.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => save() }
      })
    } finally {
      saving.value = false // release on success AND failure
    }
  }
</script>

<template>
  <StepperCreatePage
    v-model="currentStep"
    :breadcrumb="breadcrumb"
    :back-label="`Back to ${returnLabel}`"
    title="Create Function"
    :steps="railSteps"
    :submitting="saving"
    :dirty="dirty"
    save-label="Create function"
    @cancel="cancel"
    @back="goBack"
    @next="goNext"
    @submit="save"
  >
    <DependencyStep
      v-if="currentStep === DEPENDENCY_STEP"
      v-model:choice="applicationChoice"
      v-model:enable-module="enableModule"
      resource="functions"
      title="Create Function"
      icon="ai ai-edge-functions"
      :binding="applicationBindingSpec"
      :host="hostSpec"
      unit="function"
      :disabled="saving"
      @answer="onHostAnswer"
      @empty-action="goToCreationCenter"
    />

    <ModuleStep
      v-else-if="currentStep === MODULE_STEP && moduleRequirement"
      v-model="enableModule"
      :requirement="moduleRequirement"
      :host-name="boundApplicationName"
      :host-noun="hostSpec.noun"
      unit="function"
      :disabled="saving"
    />

    <!-- THE EDITOR, shared with the detail page (../../components/function/FunctionCodeEditor.vue):
         the same Code / Arguments switch, the same full-bleed editor. It is the one step that
         takes the whole pane — a code editor held to the form measure spends its width on
         padding. `v-show` rather than `v-if` because Monaco owns undo history, cursor and
         folding state and unmounting throws all three away. -->
    <div
      v-show="currentStep === CODE_STEP"
      class="flex min-h-0 flex-1 flex-col"
    >
      <FunctionCodeEditor
        v-model:code="code"
        v-model:args="args"
        v-model:form="form"
        v-model:document="editorDocument"
        :language="RUNTIME.language"
        :runtime-label="RUNTIME.label"
        :file-name="name || 'function'"
        :code-error="codeError"
        :args-error="argsError"
        :disabled="saving"
        test-id="create-function"
        @update:code-error="codeError = $event"
        @update:args-error="argsError = $event"
      />
    </div>

    <template v-if="currentStep === SETTINGS_STEP">
      <!-- The NAME moved out of the commit bar and into the step that names the function.
           On a stepped create there is a place for it: Settings is passed through, so the
           field is answered in the band that describes it rather than pinned to the bar. -->
      <Section
        stacked
        :divided="false"
        title="Identification"
        hint="The name the function is listed and selected by."
      >
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <Item>
                <Item.Content>
                  <Item.Title>Name</Item.Title>
                  <Item.Description>name</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <div class="layout-field-control">
                    <InputText
                      :id="nameId"
                      v-model="name"
                      size="medium"
                      placeholder="my-function"
                      class="w-full"
                      aria-label="Name"
                      autocomplete="off"
                      :required="!!nameError"
                      :aria-describedby="nameError ? nameMessageId : undefined"
                      :disabled="saving"
                      @update:model-value="nameError = ''"
                    />
                  </div>
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>
        <HelperText
          v-if="nameError"
          :id="nameMessageId"
          kind="required"
          :label="nameError"
        />
      </Section>

      <!-- The bands shared with the detail page, so a function's settings cannot read one
           way while it is being written and another once it exists. -->
      <FunctionSettings
        v-model:execution-environment="executionEnvironment"
        v-model:active="active"
        :runtime-label="RUNTIME.label"
        :disabled="saving"
      />
    </template>

    <ReviewStep
      v-else-if="currentStep === REVIEW_STEP"
      resource="functions"
      unit="function"
      :answers="reviewAnswers"
      :binding="asksHost ? applicationBindingSpec : null"
      :host="hostSpec"
      :bound-to="canBindApplication ? boundApplicationName : ''"
      :module-requirement="moduleRequirement"
      :module-missing="moduleMissing"
      :module-enabled="enableModule"
    />
  </StepperCreatePage>
</template>
