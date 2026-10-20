<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SpecFieldRow from '../../components/form/SpecFieldRow.vue'
  import FunctionCodeEditor from '../../components/function/FunctionCodeEditor.vue'
  import Section from '../../components/page/Section.vue'
  import StepperCreatePage from '../../components/page/StepperCreatePage.vue'
  import DependencyStep from '../../components/resource/DependencyStep.vue'
  import ModuleStep from '../../components/resource/ModuleStep.vue'
  import { hostRecord, HOSTS, resolveHostChoice } from '../../lib/behavior/application-binding'
  import { CREATION_CENTER_PATH, useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import { bindingFor } from '../../lib/data/create-bindings'
  import { FUNCTION_ARGS, FUNCTION_STARTER } from '../../lib/data/create-resources'
  import { addFunction, RUNTIMES } from '../../lib/data/functions'
  import { hostHasModule, moduleRequirementFor } from '../../lib/data/resource-dependencies'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const DEPENDENCY_STEP = 'where-it-runs'
  const MODULE_STEP = 'module'
  const CODE_STEP = 'code'
  const SETTINGS_STEP = 'settings'
  const editorDocument = ref('code')

  const name = ref('')
  const code = ref(FUNCTION_STARTER)
  const args = ref(FUNCTION_ARGS)
  const form = ref('')
  const executionEnvironment = ref('application')
  const active = ref(true)

  const applicationChoice = ref(null)

  const RUNTIME = RUNTIMES.azion_js

  const saving = ref(false)

  const { dirty, commit } = useBaseline(() => ({
    name: name.value,
    code: code.value,
    args: args.value,
    form: form.value,
    executionEnvironment: executionEnvironment.value,
    active: active.value,
    applicationChoice: applicationChoice.value
  }))

  const nameError = ref('')
  const codeError = ref('')
  const argsError = ref('')
  const formError = ref('')

  const listPath = '/functions'

  const { path: originPath, label: originLabel } = useCreateOrigin(listPath, 'Functions')

  const returnTo = computed(() => String(route.query.returnTo || ''))
  const returnLabel = computed(() => String(route.query.returnLabel || originLabel.value))

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

  const breadcrumb = computed(() => [
    { label: returnLabel.value, href: returnTo.value ? '#' : originPath.value },
    { label: 'Create Function' }
  ])

  const hostKind = ref('')

  const applicationBindingSpec = computed(() =>
    bindingFor('functions', applicationChoice.value?.kind ?? hostKind.value)
  )
  const hostSpec = computed(() => HOSTS[applicationBindingSpec.value.host])

  const canBindApplication = computed(
    () => !returnTo.value && executionEnvironment.value === applicationBindingSpec.value.host
  )

  const boundApplicationName = computed(() => applicationChoice.value?.name ?? '')

  const moduleRequirement = computed(() =>
    canBindApplication.value
      ? moduleRequirementFor('functions', applicationBindingSpec.value.host)
      : null
  )

  const moduleMissing = computed(() => {
    if (!moduleRequirement.value || !applicationChoice.value) return false
    const record =
      applicationChoice.value.mode === 'existing'
        ? hostRecord(applicationBindingSpec.value.host, boundApplicationName.value)
        : {}
    return !hostHasModule(record ?? {}, moduleRequirement.value)
  })

  const enableModule = ref(false)

  const goToHostCreate = (kind) =>
    router.push({
      path: HOSTS[kind]?.emptyPath ?? CREATION_CENTER_PATH,
      query: { email: userEmail.value }
    })

  watch(applicationChoice, (choice) => {
    if (choice?.kind) executionEnvironment.value = choice.kind
  })

  watch(executionEnvironment, (environment) => {
    if (applicationChoice.value && environment !== applicationChoice.value.kind) {
      applicationChoice.value = null
    }
  })

  const asksHost = computed(() => Boolean(applicationBindingSpec.value) && !returnTo.value)

  const stepDefs = computed(() => {
    const list = []

    if (asksHost.value) {
      list.push({
        value: DEPENDENCY_STEP,
        title: applicationBindingSpec.value.title,
        description: applicationBindingSpec.value.description,
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
        : saving.value && index === stepDefs.value.length - 1
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

  const onHostAnswer = () => {
    enableModule.value = false
    goNext()
  }

  const parsedArgs = () => {
    try {
      const value = JSON.parse(args.value)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  const parsedForm = () => {
    if (!form.value.trim()) return undefined
    try {
      const value = JSON.parse(form.value)
      if (value === null || Array.isArray(value) || typeof value !== 'object') return null
      return value
    } catch {
      return null
    }
  }

  const validateCode = () => {
    codeError.value = code.value.trim() ? '' : 'This field is required.'
    argsError.value = parsedArgs() ? '' : 'Arguments must be a JSON object.'
    formError.value = parsedForm() === null ? 'The form schema must be a JSON object.' : ''

    if (formError.value || argsError.value) editorDocument.value = 'arguments'
    if (codeError.value) editorDocument.value = 'code'

    return !codeError.value && !argsError.value && !formError.value
  }

  const validateSettings = () => {
    nameError.value = name.value.trim() ? '' : 'This field is required.'
    return !nameError.value
  }

  const validate = () => {
    const codeOk = validateCode()
    const settingsOk = validateSettings()
    if (!codeOk) currentStep.value = CODE_STEP
    else if (!settingsOk) currentStep.value = SETTINGS_STEP
    return codeOk && settingsOk
  }

  const SETTINGS_FIELDS = [
    {
      id: 'name',
      kind: 'text',
      label: 'Name',
      placeholder: 'my-function',
      helper: 'Give a unique and descriptive name to identify the function.'
    },
    {
      id: 'runtime',
      kind: 'text',
      label: 'Runtime',
      helper: "The runtime isn't editable after the function is created.",
      readonly: true
    },
    {
      id: 'executionEnvironment',
      kind: 'radio',
      label: 'Execution environment',
      helper: 'Which product runs the function, each handing the code a different request.',
      options: [
        {
          value: 'application',
          label: 'Application',
          description: 'Runs on requests an application serves, after routing.'
        },
        {
          value: 'firewall',
          label: 'Firewall',
          description:
            'Runs inside Firewall, before the request reaches an application, where a request can still be refused.'
        }
      ]
    },
    {
      id: 'active',
      kind: 'switch',
      label: 'Active',
      description: 'An inactive function keeps its code and stops running.'
    }
  ]

  const settingsFields = computed(() =>
    SETTINGS_FIELDS.map((field) =>
      field.id === 'executionEnvironment' && applicationChoice.value
        ? {
            ...field,
            readonly: true,
            helper: `Set by the ${hostSpec.value.noun} it runs on, ${applicationChoice.value.name}.`
          }
        : field
    )
  )

  const settingsModel = {
    name,
    runtime: ref(RUNTIME.label),
    executionEnvironment,
    active
  }

  const post = (body) => new Promise((resolve) => globalThis.setTimeout(() => resolve(body), 900))

  const save = async () => {
    if (saving.value) return
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
        ? resolveHostChoice(applicationBindingSpec.value.host, applicationChoice.value)
        : null

      if (application) {
        toast.success(`${record.name} created.`, {
          description: application.created
            ? `${application.name} was created for it. Save the rule to start running it.`
            : `Save the rule to run it on ${application.name}.`
        })
        commit()
        const target = applicationBindingSpec.value.destination({ host: application, record })
        router.push({ path: target.path, query: { email: userEmail.value, ...target.query } })
        return
      }

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
      commit()
      leave(returnTo.value ? { created: record.id } : {})
    } catch (error) {
      toast.error('Could not create the function.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => save() }
      })
    } finally {
      saving.value = false
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
      v-model:kind="hostKind"
      resource="functions"
      title="Create Function"
      icon="ai ai-edge-functions"
      :binding="applicationBindingSpec"
      unit="function"
      :disabled="saving"
      @answer="onHostAnswer"
      @empty-action="goToHostCreate"
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

    <Section
      v-if="currentStep === SETTINGS_STEP"
      stacked
      :divided="false"
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <SpecFieldRow
              v-for="field in settingsFields"
              :key="field.id"
              v-model="settingsModel[field.id].value"
              :field="field"
              :message="field.id === 'name' ? nameError : ''"
              :message-kind="field.id === 'name' && nameError ? 'required' : 'helper'"
              :disabled="saving"
              name-prefix="function"
              @update:model-value="field.id === 'name' && (nameError = '')"
            />
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </StepperCreatePage>
</template>
