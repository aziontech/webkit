<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import SpecFieldRow from '../../components/form/SpecFieldRow.vue'
  import Section from '../../components/page/Section.vue'
  import StepperCreatePage from '../../components/page/StepperCreatePage.vue'
  import DependencyStep from '../../components/resource/DependencyStep.vue'
  import ModuleStep from '../../components/resource/ModuleStep.vue'
  import { hostRecord, HOSTS, resolveHostChoice } from '../../lib/behavior/application-binding'
  import { CREATION_CENTER_PATH, useCreateOrigin } from '../../lib/behavior/create-origin'
  import { useBaseline } from '../../lib/behavior/forms'
  import { bindingFor, bindingWritesRule } from '../../lib/data/create-bindings'
  import {
    createFormSeed,
    createResource,
    isVisible,
    resourceFields,
    resourceSettingsPath
  } from '../../lib/data/create-resources'
  import {
    hostHasModule,
    matrixBindingFor,
    moduleRequirementFor
  } from '../../lib/data/resource-dependencies'
  import { addCreatedResource, storesCreated } from '../../lib/state/created-resources'

  interface Props {
    resource: string
  }

  const props = defineProps<Props>()

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const spec = computed(() => createResource(props.resource))

  const seedFromQuery = (resource, seed) => {
    for (const field of resourceFields(resource)) {
      const value = route.query[field.id]
      if (typeof value !== 'string' || !value) continue
      if (field.kind === 'select') {
        if (!field.options?.some((option) => option.value === value)) continue
      } else if (!['text', 'textarea', 'code', 'list'].includes(field.kind)) continue
      seed[field.id] = value
    }
    return seed
  }

  const form = reactive(seedFromQuery(spec.value, createFormSeed(spec.value)))
  const errors = reactive({})

  watch(
    () => props.resource,
    () => {
      const seed = seedFromQuery(spec.value, createFormSeed(spec.value))
      Object.keys(errors).forEach((key) => delete errors[key])
      Object.keys(form).forEach((key) => delete form[key])
      Object.assign(form, seed)
    }
  )

  const submitting = ref(false)

  const applicationBindingSpec = computed(
    () => bindingFor(props.resource) ?? matrixBindingFor(props.resource)
  )
  const hostSpec = computed(() => HOSTS[applicationBindingSpec.value?.host] ?? HOSTS.application)

  const applicationChoice = ref(null)
  const enableModule = ref(false)

  const boundApplicationName = computed(() => applicationChoice.value?.name ?? '')

  const moduleRequirement = computed(() =>
    applicationBindingSpec.value
      ? moduleRequirementFor(props.resource, applicationBindingSpec.value.host)
      : null
  )

  const moduleMissing = computed(() => {
    if (!moduleRequirement.value || !applicationChoice.value) return false
    const record =
      applicationChoice.value.mode === 'existing'
        ? hostRecord(applicationBindingSpec.value.host, applicationChoice.value.name)
        : {}
    return !hostHasModule(record ?? {}, moduleRequirement.value)
  })

  const goToHostCreate = () =>
    router.push({
      path: hostSpec.value.emptyPath ?? CREATION_CENTER_PATH,
      query: { email: userEmail.value }
    })

  const { dirty, commit } = useBaseline(() => ({
    ...form,
    applicationChoice: applicationChoice.value
  }))

  const askedSections = computed(() =>
    spec.value.sections
      .filter((section) => isVisible(section, form))
      .map((section) => ({
        ...section,
        shown: section.fields.filter((field) => isVisible(field, form))
      }))
      .filter((section) => section.shown.length > 0)
  )

  const sections = computed(() =>
    askedSections.value.filter((section) => !section.advanced && !section.within)
  )

  const nestedSections = (host) =>
    askedSections.value.filter((section) => !section.advanced && section.within === host.id)

  const advancedFields = computed(() =>
    askedSections.value.filter((section) => section.advanced).flatMap((section) => section.shown)
  )

  const askedFields = computed(() =>
    resourceFields(spec.value).filter(
      (field) => isVisible(field.section, form) && isVisible(field, form)
    )
  )

  const DEPENDENCY_STEP = 'where-it-runs'
  const MODULE_STEP = 'module'
  const ADVANCED_STEP = 'advanced'

  const stepDefs = computed(() => {
    const list = []

    if (applicationBindingSpec.value) {
      list.push({
        value: DEPENDENCY_STEP,
        title: 'Where it runs',
        description: moduleRequirement.value
          ? `${applicationBindingSpec.value.mechanism} It needs ${moduleRequirement.value.label} on.`
          : applicationBindingSpec.value.mechanism,
        fields: [],
        heading: false
      })

      if (moduleRequirement.value && moduleMissing.value) {
        list.push({
          value: MODULE_STEP,
          title: moduleRequirement.value.label,
          description: `Off on ${boundApplicationName.value}.`,
          fields: []
        })
      }
    }

    for (const section of sections.value) {
      const groups = [section, ...nestedSections(section)]
      list.push({
        value: section.id,
        title: section.title,
        description: section.description ?? '',
        fields: groups.flatMap((group) => group.shown),
        groups
      })
    }

    if (advancedFields.value.length) {
      list.push({
        value: ADVANCED_STEP,
        title: 'Advanced',
        description:
          "Optional settings that already carry the endpoint's own defaults. Submitting them untouched sends what the API would have applied anyway.",
        fields: advancedFields.value,
        groups: [
          {
            id: ADVANCED_STEP,
            title: 'Advanced',
            description:
              "Optional settings that already carry the endpoint's own defaults. Submitting them untouched sends what the API would have applied anyway.",
            shown: advancedFields.value
          }
        ]
      })
    }

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

  const currentDef = computed(() => stepDefs.value[stepIndex.value] ?? null)

  const stepState = (step, index) => {
    if (submitting.value && index === stepDefs.value.length - 1) return 'loading'
    if (step.fields.some((field) => errors[field.id])) return 'error'
    if (index < stepIndex.value) return 'complete'
    return 'upcoming'
  }

  const railSteps = computed(() =>
    stepDefs.value.map((step, index) => ({
      value: step.value,
      title: step.title,
      description: step.description,
      heading: step.heading !== false,
      state: stepState(step, index),
      disabled: !unlocked.value.includes(step.value)
    }))
  )

  const goNext = () => {
    const step = currentDef.value
    if (!step) return
    if (step.fields.length && !validate(step.fields)) return
    const next = stepDefs.value[stepIndex.value + 1]
    if (!next) return
    if (!unlocked.value.includes(next.value)) unlocked.value.push(next.value)
    currentStep.value = next.value
  }

  const goBack = () => {
    const previous = stepDefs.value[stepIndex.value - 1]
    if (previous) currentStep.value = previous.value
  }

  const isEmpty = (value) => value === '' || value === undefined || value === null

  const validate = (fields = askedFields.value) => {
    for (const field of fields) delete errors[field.id]

    for (const field of fields) {
      const value = form[field.id]
      const text = typeof value === 'string' ? value.trim() : value

      if (field.required && isEmpty(text)) {
        errors[field.id] = { kind: 'required', message: 'This field is required.' }
        continue
      }
      if (isEmpty(text) || typeof text !== 'string') continue

      if (field.minLength && text.length < field.minLength) {
        errors[field.id] = {
          kind: 'invalid',
          message: `Use at least ${field.minLength} characters.`
        }
        continue
      }
      if (field.maxLength && text.length > field.maxLength) {
        errors[field.id] = {
          kind: 'invalid',
          message: `Use at most ${field.maxLength} characters.`
        }
        continue
      }
      if (field.pattern && !field.pattern.test(text)) {
        errors[field.id] = {
          kind: 'invalid',
          message: field.patternHint ?? 'This value is not in the expected format.'
        }
      }
    }

    return fields.every((field) => !errors[field.id])
  }

  const clear = (id) => {
    if (errors[id]) delete errors[id]
  }

  const messageFor = (field) => errors[field.id]?.message ?? ''
  const messageKindFor = (field) => errors[field.id]?.kind ?? 'helper'

  const { path: originPath, label: originLabel } = useCreateOrigin(
    () => spec.value.listPath,
    () => spec.value.listLabel
  )

  const cancel = () => router.push({ path: originPath.value, query: { email: userEmail.value } })

  const createdDomain = () =>
    form.domainType === 'azion' && form.azionSubdomain
      ? `${form.azionSubdomain}.azion.run`
      : form.domain

  const createdName = () => String(createdDomain() || form.name || spec.value.unit).trim()

  const openPath = (id) =>
    props.resource === 'object-storage'
      ? `/object-storage/${id}`
      : resourceSettingsPath(props.resource, id)

  const createdQuery = (name) => {
    const query = { email: userEmail.value, name }
    for (const field of askedFields.value) {
      if (['code', 'secret'].includes(field.kind) || field.id === 'name') continue
      const value = form[field.id]
      if (typeof value === 'string' && value) query[field.id] = value
    }
    return query
  }

  const revealFirstError = () => {
    const failing = stepDefs.value.find((step) => step.fields.some((field) => errors[field.id]))
    if (failing) currentStep.value = failing.value
  }

  const submit = async () => {
    if (submitting.value) return
    if (!validate()) {
      revealFirstError()
      return
    }

    submitting.value = true
    try {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 900))
      const name = createdName()
      const stored = storesCreated(props.resource) ? addCreatedResource(props.resource, form) : null
      const id = stored?.id ?? `${props.resource}-${Date.now().toString(36)}`
      const created = { path: openPath(id), query: createdQuery(name) }

      const host = resolveHostChoice(applicationBindingSpec.value?.host, applicationChoice.value)

      if (host && applicationBindingSpec.value.destination) {
        const created = { id, name }
        const moduleTurnedOn =
          enableModule.value && moduleMissing.value ? moduleRequirement.value : null
        if (moduleTurnedOn) {
          const record = hostRecord(applicationBindingSpec.value.host, host.name)
          if (Array.isArray(record?.modules) && !record.modules.includes(moduleTurnedOn.key)) {
            record.modules.push(moduleTurnedOn.key)
          }
        }
        const writesRule = bindingWritesRule(props.resource)
        const bound = host.created
          ? `${host.name} was created for it. Save the rule to start using it.`
          : writesRule
            ? `Save the rule to start using it on ${host.name}.`
            : `It runs in front of ${host.name}.`
        toast.success(`${name} created.`, {
          description: moduleTurnedOn
            ? `${moduleTurnedOn.label} was turned on for ${host.name}. ${bound}`
            : bound
        })
        commit()
        const target = applicationBindingSpec.value.destination({ host, record: created })
        router.push({ path: target.path, query: { email: userEmail.value, ...target.query } })
        return
      }

      toast.success(`${name} created.`, {
        action: {
          label: `Open ${spec.value.unit}`,
          onClick: () => router.push(created)
        }
      })

      commit()
      router.push({
        path: originPath.value,
        query: {
          email: userEmail.value,
          ...(props.resource === 'domains' ? { domain: createdDomain() } : {})
        }
      })
    } catch (error) {
      toast.error(`Could not create the ${spec.value.unit}.`, {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <StepperCreatePage
    v-model="currentStep"
    :breadcrumb="[{ label: originLabel, href: originPath }, { label: spec.title }]"
    :back-label="`Back to ${originLabel}`"
    :title="spec.title"
    :steps="railSteps"
    :submitting="submitting"
    :dirty="dirty"
    :save-label="`Create ${spec.unit}`"
    @cancel="cancel"
    @back="goBack"
    @next="goNext"
    @submit="submit"
  >
    <DependencyStep
      v-if="currentStep === DEPENDENCY_STEP && applicationBindingSpec"
      v-model:choice="applicationChoice"
      v-model:enable-module="enableModule"
      :resource="resource"
      :title="spec.title"
      :icon="spec.icon"
      :binding="applicationBindingSpec"
      :host="hostSpec"
      :unit="spec.unit"
      :disabled="submitting"
      @answer="goNext"
      @empty-action="goToHostCreate"
    />

    <ModuleStep
      v-else-if="currentStep === MODULE_STEP && moduleRequirement"
      v-model="enableModule"
      :requirement="moduleRequirement"
      :host-name="boundApplicationName"
      :host-noun="hostSpec.noun"
      :unit="spec.unit"
      :disabled="submitting"
    />

    <TransitionGroup
      v-else-if="currentDef"
      :key="currentStep"
      tag="div"
      enter-active-class="animate-content-enter motion-reduce:animate-none"
    >
      <Section
        v-for="group in currentDef.groups"
        :key="group.id"
        stacked
        :divided="false"
      >
        <CardBox :padded="false">
          <template #content>
            <Item.List>
              <TransitionGroup
                enter-active-class="animate-content-enter motion-reduce:animate-none"
              >
                <SpecFieldRow
                  v-for="field in group.shown"
                  :key="field.id"
                  v-model="form[field.id]"
                  :field="field"
                  :message="messageFor(field)"
                  :message-kind="messageKindFor(field)"
                  :disabled="submitting"
                  :name-prefix="resource"
                  @update:model-value="clear(field.id)"
                />
              </TransitionGroup>
            </Item.List>
          </template>
        </CardBox>
      </Section>
    </TransitionGroup>
  </StepperCreatePage>
</template>
