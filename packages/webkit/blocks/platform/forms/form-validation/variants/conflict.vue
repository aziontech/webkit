<script setup>
  import Button from '@aziontech/webkit/button'
  import FieldSelect from '@aziontech/webkit/field-select'
  import FieldText from '@aziontech/webkit/field-text'
  import FieldTextarea from '@aziontech/webkit/field-textarea'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import { computed, nextTick, onMounted, reactive, ref } from 'vue'

  const KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/
  const DESCRIPTION_LIMIT = 200
  const existingKeys = ['API_TOKEN']
  const environments = [
    { value: 'Production', label: 'Production' },
    { value: 'Preview', label: 'Preview' }
  ]
  const fieldIds = {
    key: 'variable-key',
    value: 'variable-value',
    environment: 'variable-environment',
    description: 'variable-description'
  }
  const empty = () => ({ key: '', value: '', environment: '', description: '' })

  const form = reactive({
    key: 'API_TOKEN',
    value: 'https://api.example.com/v2',
    environment: 'Production',
    description: 'Base URL the checkout service calls.'
  })
  const submitted = ref(true)
  const status = ref('idle')
  const takenKey = ref('API_TOKEN')

  const errors = computed(() => ({
    key: !form.key
      ? 'Key is required.'
      : !KEY_PATTERN.test(form.key)
        ? 'Use uppercase letters, digits and underscores, starting with a letter.'
        : form.key === takenKey.value
          ? `A variable named ${form.key} already exists.`
          : '',
    value: form.value ? '' : 'Value is required.',
    environment: form.environment ? '' : 'Select an environment.',
    description:
      form.description.length > DESCRIPTION_LIMIT
        ? `Keep the description under ${DESCRIPTION_LIMIT} characters.`
        : ''
  }))

  const busy = computed(() => status.value === 'loading' || status.value === 'submitting')
  const missing = (field) => submitted.value && !form[field]
  const invalid = (field) => submitted.value && Boolean(form[field]) && Boolean(errors.value[field])
  const helper = (field, guidance) =>
    submitted.value && errors.value[field] ? errors.value[field] : guidance

  const focusField = async (field) => {
    await nextTick()
    document.getElementById(fieldIds[field])?.focus()
  }

  const reportFailure = () =>
    toast.error("The variable wasn't created.", {
      id: 'create-variable-result',
      description: "The request didn't reach the server. Your entries are kept.",
      action: { label: 'Retry', onClick: () => submit() }
    })

  const reportSaved = (variable) =>
    toast.success(`${variable.key} was created.`, {
      id: 'create-variable-result',
      description: `It is available in ${variable.environment}.`
    })

  const reset = () => {
    Object.assign(form, empty())
    submitted.value = false
    takenKey.value = ''
    status.value = 'idle'
  }

  const submit = () => {
    if (busy.value) return
    submitted.value = true
    const firstError = Object.keys(fieldIds).find((field) => errors.value[field])
    if (firstError) {
      status.value = 'idle'
      focusField(firstError)
      return
    }
    status.value = 'submitting'
    toast.dismiss('create-variable-result')
    setTimeout(() => {
      status.value = 'idle'
      if (existingKeys.includes(form.key)) {
        takenKey.value = form.key
        focusField('key')
        return
      }
      const variable = { key: form.key, environment: form.environment }
      reset()
      reportSaved(variable)
    }, 900)
  }
</script>

<template>
  <div class="min-h-dvh bg-(--bg-canvas)">
    <form
      class="layout-column-form layout-boundary flex min-w-0 flex-col"
      aria-labelledby="create-variable-title"
      novalidate
      :aria-busy="busy"
      @submit.prevent="submit"
    >
      <header class="flex flex-col gap-(--spacing-xxs)">
        <h1
          id="create-variable-title"
          class="text-balance text-heading-xs text-(--text-default)"
        >
          Create Variable
        </h1>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          Add a key-value pair your services read at runtime.
        </p>
      </header>

      <div class="layout-section-start flex flex-col gap-(--spacing-md)">
        <div
          v-if="status === 'loading'"
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
          <FieldText
            v-model="form.key"
            :input-id="fieldIds.key"
            name="key"
            label="Key"
            placeholder="API_TOKEN"
            :required="missing('key')"
            :invalid="invalid('key')"
            :disabled="busy"
            :helper-text="
              helper('key', 'Uppercase letters, digits and underscores, for example API_TOKEN.')
            "
          />
          <FieldText
            v-model="form.value"
            :input-id="fieldIds.value"
            name="value"
            label="Value"
            :required="missing('value')"
            :invalid="invalid('value')"
            :disabled="busy"
            :helper-text="helper('value', 'The value your services read at runtime.')"
          />
          <FieldSelect
            v-model="form.environment"
            :input-id="fieldIds.environment"
            label="Environment"
            placeholder="Select an environment"
            :options="environments"
            :required="missing('environment')"
            :disabled="busy"
            :helper-text="helper('environment', 'Where this variable is available.')"
          />
          <FieldTextarea
            v-model="form.description"
            :input-id="fieldIds.description"
            name="description"
            label="Description"
            :invalid="invalid('description')"
            :disabled="busy"
            :helper-text="helper('description', 'Optional. Up to 200 characters.')"
          />
        </div>
      </div>

      <div class="layout-section-start flex flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
        <div class="w-full md:w-fit">
          <Button
            class="w-full"
            label="Cancel"
            kind="outlined"
            size="medium"
            :disabled="busy"
            @click="reset"
          />
        </div>
        <div class="w-full md:w-fit">
          <Button
            class="w-full"
            type="submit"
            label="Create"
            kind="primary"
            size="medium"
            :disabled="status === 'loading'"
            :loading="status === 'submitting'"
          />
        </div>
      </div>
    </form>
    <Toaster position="bottom-right" />
  </div>
</template>
