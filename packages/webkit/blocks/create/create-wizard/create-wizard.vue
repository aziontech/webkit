<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import Wizard from '@aziontech/webkit/wizard'
  import { computed, reactive, ref, watch } from 'vue'

  import { listFields, types } from './lib/access-list'
  import PolicyPickerStep from './parts/policy-picker-step.vue'
  import ReviewStep from './parts/review-step.vue'
  import WizardFrame from './parts/wizard-frame.vue'
  import { samplePolicies } from './sample'
  import type {
    CreateWizardPolicy,
    CreateWizardStep,
    CreateWizardSubmission,
    CreateWizardValues
  } from './types'

  export type {
    CreateWizardListType,
    CreateWizardPolicy,
    CreateWizardStep,
    CreateWizardSubmission,
    CreateWizardValues
  } from './types'

  export interface CreateWizardProps {
    /** The policies to pick from. Left out, the sample renders. */
    policies?: CreateWizardPolicy[]
    /** The step the wizard opens on. */
    defaultStep?: CreateWizardStep
    /** The policy already picked; empty, Where it runs waits for an answer. */
    defaultPolicy?: string
    /** The values the form starts from. */
    defaultValues?: Partial<CreateWizardValues>
    /** The create request is in flight; the submit spins and the wizard locks. */
    loading?: boolean
    /** Why the create request failed, shown in an error toast with Retry. */
    error?: string
  }

  type FieldName = 'name' | 'type' | 'items'

  interface FieldProblem {
    type: 'helper' | 'invalid' | 'required'
    message: string
  }

  interface StepDefinition {
    value: string
    title: string
    description: string
    fields: FieldName[]
  }

  const props = withDefaults(defineProps<CreateWizardProps>(), {
    policies: undefined,
    defaultStep: 'where-it-runs',
    defaultPolicy: '',
    defaultValues: () => ({}),
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: MouseEvent, values: CreateWizardSubmission]
    cancel: [event: MouseEvent | KeyboardEvent]
  }>()

  const breadcrumb = [
    { label: 'Access Lists', href: '/access-lists' },
    { label: 'Create Access List' }
  ]
  const policies = computed<CreateWizardPolicy[]>(() => props.policies ?? samplePolicies)

  const current = ref<string>(props.defaultStep)
  const choice = ref(props.defaultPolicy)
  const enableModule = ref(false)
  const form = reactive<CreateWizardValues>({
    name: '',
    type: 'asn',
    items: '',
    ...props.defaultValues
  })
  const errors = reactive<Partial<Record<FieldName, FieldProblem>>>({})
  const answered = ref(choice.value !== '')
  const whereMissing = ref(false)

  const moduleMissing = computed(
    () => !!choice.value && !policies.value.find((option) => option.value === choice.value)?.ready
  )

  const definitions = computed((): StepDefinition[] => [
    {
      value: 'where-it-runs',
      title: 'Where it runs',
      description: 'Select the policy whose rules match it. It needs IP filtering on.',
      fields: []
    },
    ...(moduleMissing.value
      ? [
          {
            value: 'module',
            title: 'IP filtering',
            description: 'Off on ' + choice.value + '.',
            fields: []
          }
        ]
      : []),
    {
      value: 'general',
      title: 'General',
      description:
        'Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in policy rules.',
      fields: ['name']
    },
    {
      value: 'settings',
      title: 'List settings',
      description:
        'The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it.',
      fields: ['type', 'items']
    },
    {
      value: 'review',
      title: 'Review',
      description: 'Check what is created and where it runs. Edit any part, then create the list.',
      fields: []
    }
  ])

  const index = computed(() =>
    Math.max(
      0,
      definitions.value.findIndex((entry) => entry.value === current.value)
    )
  )
  const stepIndex = computed({
    get: () => index.value,
    set: (position: number) => {
      const next = definitions.value[position]
      if (next) current.value = next.value
    }
  })

  const byValue = (value: string) =>
    definitions.value.find((entry) => entry.value === value) ?? definitions.value[0]

  const listField = computed(() => listFields[form.type])

  const validate = (fields: FieldName[]) => {
    for (const field of fields) delete errors[field]
    if (fields.includes('name') && !form.name.trim()) {
      errors.name = { type: 'required', message: 'This field is required.' }
    }
    if (fields.includes('items') && !form.items.trim()) {
      errors.items = { type: 'required', message: 'This field is required.' }
    }
    return fields.every((field) => !errors[field])
  }

  const answer = (value: string) => {
    choice.value = value
    answered.value = true
    enableModule.value = false
    whereMissing.value = false
    stepIndex.value = 1
  }

  const entries = computed(() =>
    Array.from(
      new Set(
        form.items
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      )
    )
  )
  const typeLabel = computed(() => types.find((option) => option.value === form.type)?.label)
  const editStep = (value: string) => {
    current.value = value
  }

  const onNext = (event: MouseEvent, position: number) => {
    const entry = definitions.value[position]
    if (entry?.value === 'where-it-runs' && !answered.value) {
      whereMissing.value = true
      event.preventDefault()
      return
    }
    if (entry && !validate(entry.fields)) event.preventDefault()
  }

  const commit = (event: MouseEvent) => {
    if (props.loading) return
    if (!validate(['name', 'type', 'items'])) {
      const failed = definitions.value.find((entry) => entry.fields.some((field) => errors[field]))
      if (failed) editStep(failed.value)
      return
    }
    emit('submit', event, {
      name: form.name.trim(),
      type: form.type,
      items: entries.value.join('\n'),
      policy: choice.value,
      enableModule: moduleMissing.value && enableModule.value
    })
  }

  const guard = useUnsavedChanges(
    () => ({ form, choice: choice.value, enableModule: enableModule.value }),
    {
      enabled: () => !props.loading
    }
  )

  watch(
    () => props.error,
    (message) => {
      if (!message) return
      toast.error(`Could not create ${form.name.trim() || 'the access list'}.`, {
        description: message,
        action: { label: 'Retry', onClick: (event: MouseEvent) => commit(event) }
      })
    },
    { immediate: true }
  )
</script>

<template>
  <WizardFrame
    v-model="stepIndex"
    back-label="Back to Access Lists"
    :breadcrumb="breadcrumb"
    title="Create Access List"
    description="An access list groups IP addresses, countries or ASNs that policy rules match on. Answer each step, review, then create it."
    submit-label="Create Access List"
    :shortcut-label="stepIndex === definitions.length - 1 ? 'Create access list' : 'Next step'"
    :loading="loading"
    :guard="guard"
    @next="onNext"
    @submit="commit"
    @cancel="(event: MouseEvent | KeyboardEvent) => emit('cancel', event)"
  >
    <Wizard.Step
      title="Where it runs"
      :description="byValue('where-it-runs').description"
    >
      <PolicyPickerStep
        :policies="policies"
        :choice="choice"
        :missing="whereMissing"
        @answer="answer"
      />
    </Wizard.Step>
    <Wizard.Step
      v-if="moduleMissing"
      title="IP filtering"
      :description="'Off on ' + choice + '.'"
    >
      <Card :padded="false">
        <template #default>
          <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
            <Alert
              severity="warning"
              size="small"
              :label="
                'An access list is only read by policy rules, and ' +
                choice +
                ' has IP filtering off, so nothing reads this one until the module is on.'
              "
            />

            <Field.Label>
              <Field orientation="horizontal">
                <Switch v-model="enableModule" />
                <Field.Content>
                  <Field.Title> Turn on IP filtering </Field.Title>
                  <Field.Description>
                    {{
                      'Sets modules.ip_filtering on the policy ' +
                      choice +
                      ' when this access list is created.'
                    }}
                  </Field.Description>
                </Field.Content>
              </Field>
            </Field.Label>

            <p class="text-body-sm text-(--text-muted)">
              Leaving it off still creates the access list. It is not read until someone turns IP
              filtering on.
            </p>
          </div>
        </template>
      </Card>
    </Wizard.Step>
    <Wizard.Step
      title="General"
      :description="byValue('general').description"
    >
      <section
        class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  required
                  title="Name"
                  description="Give a unique and descriptive name to identify the access list."
                >
                  <Input
                    v-model="form.name"
                    size="large"
                    class="w-full"
                    aria-label="Name"
                    placeholder="office-ranges"
                    autocomplete="off"
                    required
                    :invalid="errors.name?.type === 'required'"
                    :aria-describedby="errors.name ? 'create-access-list-name-message' : undefined"
                    @update:model-value="delete errors.name"
                  />
                  <FieldError
                    v-if="errors.name"
                    id="create-access-list-name-message"
                    >{{ errors.name.message }}</FieldError
                  >
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </div>
      </section>
    </Wizard.Step>
    <Wizard.Step
      title="List settings"
      :description="byValue('settings').description"
    >
      <section
        class="grid grid-cols-1 gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap)"
      >
        <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
          <Card :padded="false">
            <template #default>
              <Item.List>
                <SettingsRow
                  title="Type"
                  variant="stacked"
                >
                  <RadioGroup
                    v-model="form.type"
                    variant="card"
                    class="w-full"
                    name="access-lists-type"
                    aria-label="Type"
                  >
                    <RadioGroup.Item
                      v-for="option in types"
                      :key="option.value"
                      :value="option.value"
                      :description="option.description"
                      >{{ option.label }}</RadioGroup.Item
                    >
                  </RadioGroup>
                </SettingsRow>
                <SettingsRow
                  required
                  :title="listField.label"
                  :description="listField.helper"
                  variant="stacked"
                >
                  <Textarea
                    v-model="form.items"
                    class="w-full"
                    :rows="5"
                    :aria-label="listField.label"
                    :placeholder="listField.placeholder"
                    required
                    :invalid="errors.items?.type === 'required'"
                    :aria-describedby="
                      errors.items ? 'create-access-list-items-message' : undefined
                    "
                    @update:model-value="delete errors.items"
                  />
                  <FieldError
                    v-if="errors.items"
                    id="create-access-list-items-message"
                    >{{ errors.items.message }}</FieldError
                  >
                </SettingsRow>
              </Item.List>
            </template>
          </Card>
        </div>
      </section>
    </Wizard.Step>
    <Wizard.Step
      title="Review"
      :description="byValue('review').description"
    >
      <ReviewStep
        :name="form.name"
        :type-label="typeLabel ?? ''"
        :list-label="listField.label"
        :entries="entries"
        :choice="choice"
        :module-missing="moduleMissing"
        :enable-module="enableModule"
        @edit="editStep"
      />
    </Wizard.Step>
  </WizardFrame>
</template>
