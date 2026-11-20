<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  /** A field of the Create Variable form. */
  export type FormValidationField = 'key' | 'value' | 'environment' | 'description'

  /** The entries of the form, and the values a submit sends. */
  export interface FormValidationValues {
    /** The variable name, uppercase letters, digits and underscores. */
    key: string
    /** The value services read at runtime. */
    value: string
    /** Environment option value. */
    environment: string
    /** Optional note, up to 200 characters. */
    description: string
  }

  /** The variable a request created, named in the success toast. */
  export interface FormValidationSaved {
    /** The key of the new variable. */
    key: string
    /** Where it is available. */
    environment: string
  }

  export interface FormValidationProps {
    /** The form's data is still arriving: Skeleton rows stand in for the fields and Create is disabled. */
    loading?: boolean
    /** The create request is in flight: Create spins and the fields and Cancel are disabled. */
    submitting?: boolean
    /** Why the request failed when no field owns it, shown in the error toast with Retry; the entries are kept. */
    error?: string
    /** A key the server reported as already in use: Key turns invalid and the danger Alert opens above the fields. */
    takenKey?: string
    /** The variable the request created: the success toast names it and the form is cleared. */
    saved?: FormValidationSaved
    /** Entries the form opens with, such as a kept draft. */
    defaultValues?: Partial<FormValidationValues>
    /** Opens with the validation messages shown, as after a press on Create. */
    defaultSubmitted?: boolean
  }

  const props = withDefaults(defineProps<FormValidationProps>(), {
    loading: false,
    submitting: false,
    error: '',
    takenKey: '',
    saved: undefined,
    defaultValues: () => ({}),
    defaultSubmitted: false
  })

  const emit = defineEmits<{
    submit: [event: Event, values: FormValidationValues]
  }>()

  const KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/
  const DESCRIPTION_LIMIT = 200
  const RESULT_TOAST = 'create-variable-result'
  const environments = [
    { value: 'Production', label: 'Production' },
    { value: 'Preview', label: 'Preview' }
  ]
  const fieldIds: Record<FormValidationField, string> = {
    key: 'variable-key',
    value: 'variable-value',
    environment: 'variable-environment',
    description: 'variable-description'
  }
  const empty = (): FormValidationValues => ({
    key: '',
    value: '',
    environment: '',
    description: ''
  })

  const form = reactive<FormValidationValues>({ ...empty(), ...props.defaultValues })
  const submitted = ref(props.defaultSubmitted)

  const errors = computed<Record<FormValidationField, string>>(() => ({
    key: !form.key
      ? 'This field is required.'
      : !KEY_PATTERN.test(form.key)
        ? 'Use uppercase letters, digits and underscores, starting with a letter.'
        : form.key === props.takenKey
          ? `A variable named ${form.key} already exists.`
          : '',
    value: form.value ? '' : 'This field is required.',
    environment: form.environment ? '' : 'Select an environment.',
    description:
      form.description.length > DESCRIPTION_LIMIT
        ? `Keep the description under ${DESCRIPTION_LIMIT} characters.`
        : ''
  }))

  const conflict = computed(
    () => submitted.value && Boolean(form.key) && form.key === props.takenKey
  )
  const busy = computed(() => props.loading || props.submitting)
  const message = (field: FormValidationField) => (submitted.value ? errors.value[field] : '')

  const focusField = async (field: FormValidationField) => {
    await nextTick()
    document.getElementById(fieldIds[field])?.focus()
  }

  const submit = (event: Event) => {
    if (busy.value) return
    submitted.value = true
    const firstError = (Object.keys(fieldIds) as FormValidationField[]).find(
      (field) => errors.value[field]
    )
    if (firstError) {
      focusField(firstError)
      return
    }
    toast.dismiss(RESULT_TOAST)
    emit('submit', event, { ...form })
  }

  const reportFailure = () =>
    toast.error("The variable wasn't created.", {
      id: RESULT_TOAST,
      description: props.error,
      action: { label: 'Retry', onClick: (event: MouseEvent) => submit(event) }
    })

  const reportSaved = (variable: FormValidationSaved) => {
    Object.assign(form, empty())
    submitted.value = false
    toast.success(`${variable.key} was created.`, {
      id: RESULT_TOAST,
      description: `It is available in ${variable.environment}.`
    })
  }

  onMounted(() => {
    if (props.error) reportFailure()
    if (props.saved) reportSaved(props.saved)
  })

  watch(
    () => props.error,
    (next) => {
      if (next) reportFailure()
    }
  )

  watch(
    () => props.saved,
    (next) => {
      if (next) reportSaved(next)
    }
  )

  watch(
    () => props.takenKey,
    (next) => {
      if (next && !props.submitting) focusField('key')
    }
  )
</script>

<template>
  <div>
    <form
      class="layout-column-form layout-boundary flex min-w-0 flex-col"
      aria-labelledby="create-variable-title"
      novalidate
      :aria-busy="busy"
      @submit.prevent="submit"
    >
      <PageHeader
        title="Create Variable"
        description="Add a key-value pair your services read at runtime."
        size="small"
        title-id="create-variable-title"
      />

      <div class="layout-section-start flex flex-col gap-(--spacing-md)">
        <div
          v-if="loading"
          class="flex flex-col gap-(--spacing-md)"
          role="status"
          aria-label="Loading the form"
        >
          <div
            v-for="row in 4"
            :key="row"
            class="flex flex-col gap-(--spacing-xs)"
          >
            <Skeleton
              width="var(--size-24)"
              height="var(--size-3)"
            />
            <Skeleton height="var(--size-8)" />
          </div>
        </div>

        <div
          v-else
          class="flex flex-col gap-(--spacing-md)"
        >
          <Alert
            v-if="conflict"
            severity="danger"
            :label="`A variable named ${form.key} already exists in this account, so it wasn't created. Your entries are kept: change the key and press Create again.`"
          />
          <Field
            required
            :invalid="Boolean(message('key'))"
            :disabled="busy"
          >
            <Field.Label :for="fieldIds.key">Key</Field.Label>
            <Input
              :id="fieldIds.key"
              v-model="form.key"
              name="key"
              placeholder="API_TOKEN"
            />
            <Field.Description
              >Uppercase letters, digits and underscores, for example API_TOKEN.</Field.Description
            >
            <Field.Error v-if="message('key')">{{ message('key') }}</Field.Error>
          </Field>
          <Field
            required
            :invalid="Boolean(message('value'))"
            :disabled="busy"
          >
            <Field.Label :for="fieldIds.value">Value</Field.Label>
            <Input
              :id="fieldIds.value"
              v-model="form.value"
              name="value"
            />
            <Field.Description>The value your services read at runtime.</Field.Description>
            <Field.Error v-if="message('value')">{{ message('value') }}</Field.Error>
          </Field>
          <Field
            required
            :invalid="Boolean(message('environment'))"
            :disabled="busy"
          >
            <Field.Label :for="fieldIds.environment">Environment</Field.Label>
            <Select
              v-model="form.environment"
              placeholder="Select an environment"
            >
              <Select.Trigger :id="fieldIds.environment" />
              <Select.Content>
                <Select.Item
                  v-for="option in environments"
                  :key="String(option.value)"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Item>
              </Select.Content>
            </Select>
            <Field.Description>Where this variable is available.</Field.Description>
            <Field.Error v-if="message('environment')">{{ message('environment') }}</Field.Error>
          </Field>
          <Field
            :invalid="Boolean(message('description'))"
            :disabled="busy"
          >
            <Field.Label :for="fieldIds.description">Description</Field.Label>
            <Textarea
              :id="fieldIds.description"
              v-model="form.description"
              name="description"
            />
            <Field.Description>Optional. Up to 200 characters.</Field.Description>
            <Field.Error v-if="message('description')">{{ message('description') }}</Field.Error>
          </Field>
        </div>
      </div>

      <div class="layout-section-start flex flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
        <div class="w-full md:w-fit">
          <Button
            class="w-full"
            label="Cancel"
            variant="outline"
            size="medium"
            :disabled="busy"
            href="/variables"
          />
        </div>
        <div class="w-full md:w-fit">
          <Button
            class="w-full"
            type="submit"
            label="Create"
            variant="primary"
            size="medium"
            :disabled="loading"
            :loading="submitting"
          />
        </div>
      </div>
    </form>
  </div>
</template>
