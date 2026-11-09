import Button from '@aziontech/webkit/button'
import FieldSelect from '@aziontech/webkit/field-select'
import FieldText from '@aziontech/webkit/field-text'
import FieldTextarea from '@aziontech/webkit/field-textarea'
import Skeleton from '@aziontech/webkit/skeleton'
import { toast, Toaster } from '@aziontech/webkit/toast'
import { computed, nextTick, onMounted, reactive, ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const components = { Button, FieldSelect, FieldText, FieldTextarea, Skeleton, Toaster }

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FieldSelect from '@aziontech/webkit/field-select'",
  "import FieldText from '@aziontech/webkit/field-text'",
  "import FieldTextarea from '@aziontech/webkit/field-textarea'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import { toast, Toaster } from '@aziontech/webkit/toast'",
  "import { computed, nextTick, onMounted, reactive, ref } from 'vue'"
]

const KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/
const DESCRIPTION_LIMIT = 200
const EXISTING_KEYS = ['API_TOKEN']
const ENVIRONMENTS = [
  { value: 'Production', label: 'Production' },
  { value: 'Preview', label: 'Preview' }
]
const FIELD_IDS = {
  key: 'variable-key',
  value: 'variable-value',
  environment: 'variable-environment',
  description: 'variable-description'
}
const EMPTY = { key: '', value: '', environment: '', description: '' }
const FILLED = {
  key: 'API_BASE_URL',
  value: 'https://api.example.com/v2',
  environment: 'Production',
  description: 'Base URL the checkout function calls.'
}

const SEEDS = {
  idle: { form: EMPTY, submitted: false, status: 'idle', takenKey: '', report: null },
  invalid: {
    form: { key: 'api token', value: '', environment: '', description: '' },
    submitted: true,
    status: 'idle',
    takenKey: '',
    report: null
  },
  submitting: { form: FILLED, submitted: true, status: 'submitting', takenKey: '', report: null },
  error: { form: FILLED, submitted: true, status: 'idle', takenKey: '', report: 'failure' },
  conflict: {
    form: { ...FILLED, key: 'API_TOKEN' },
    submitted: true,
    status: 'idle',
    takenKey: 'API_TOKEN',
    report: null
  },
  saved: { form: EMPTY, submitted: false, status: 'idle', takenKey: '', report: 'saved' },
  loading: { form: EMPTY, submitted: false, status: 'loading', takenKey: '', report: null }
}

const TOAST_ID = 'create-variable-result'
const FAILURE_TITLE = "The variable wasn't created."
const FAILURE_DESCRIPTION = "The request didn't reach the server. Your entries are kept."

const quote = (text) => `'${String(text).replaceAll("'", "\\'")}'`

const objectLiteral = (value) =>
  `{ ${Object.entries(value)
    .map(([key, item]) => `${key}: ${quote(item)}`)
    .join(', ')} }`

const multiline = (value) =>
  `{\n${Object.entries(value)
    .map(([key, item]) => `  ${key}: ${quote(item)}`)
    .join(',\n')}\n}`

const scriptFor = (seed) => [
  ...IMPORTS,
  '',
  'const KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/',
  `const DESCRIPTION_LIMIT = ${DESCRIPTION_LIMIT}`,
  `const existingKeys = [${EXISTING_KEYS.map(quote).join(', ')}]`,
  'const environments = [',
  ...ENVIRONMENTS.map(
    (option, index) =>
      `  ${objectLiteral(option)}${index < ENVIRONMENTS.length - 1 ? ',' : ''}`
  ),
  ']',
  `const fieldIds = ${multiline(FIELD_IDS)}`,
  `const empty = () => (${objectLiteral(EMPTY)})`,
  '',
  `const form = reactive(${
    seed.form === EMPTY ? 'empty()' : multiline(seed.form)
  })`,
  `const submitted = ref(${seed.submitted})`,
  `const status = ref(${quote(seed.status)})`,
  `const takenKey = ref(${quote(seed.takenKey)})`,
  '',
  'const errors = computed(() => ({',
  "  key: !form.key",
  "    ? 'Key is required.'",
  '    : !KEY_PATTERN.test(form.key)',
  "      ? 'Use uppercase letters, digits and underscores, starting with a letter.'",
  '      : form.key === takenKey.value',
  '        ? `A variable named ${form.key} already exists.`',
  "        : '',",
  "  value: form.value ? '' : 'Value is required.',",
  "  environment: form.environment ? '' : 'Select an environment.',",
  '  description:',
  '    form.description.length > DESCRIPTION_LIMIT',
  '      ? `Keep the description under ${DESCRIPTION_LIMIT} characters.`',
  "      : ''",
  '}))',
  '',
  "const busy = computed(() => status.value === 'loading' || status.value === 'submitting')",
  'const missing = (field) => submitted.value && !form[field]',
  'const invalid = (field) => submitted.value && Boolean(form[field]) && Boolean(errors.value[field])',
  'const helper = (field, guidance) =>',
  '  submitted.value && errors.value[field] ? errors.value[field] : guidance',
  '',
  'const focusField = async (field) => {',
  '  await nextTick()',
  '  document.getElementById(fieldIds[field])?.focus()',
  '}',
  '',
  'const reportFailure = () =>',
  `  toast.error(${quote(FAILURE_TITLE)}, {`,
  `    id: ${quote(TOAST_ID)},`,
  `    description: ${quote(FAILURE_DESCRIPTION)},`,
  "    action: { label: 'Retry', onClick: () => submit() }",
  '  })',
  '',
  'const reportSaved = (variable) =>',
  '  toast.success(`${variable.key} was created.`, {',
  `    id: ${quote(TOAST_ID)},`,
  '    description: `It is available in ${variable.environment}.`',
  '  })',
  '',
  'const reset = () => {',
  '  Object.assign(form, empty())',
  '  submitted.value = false',
  "  takenKey.value = ''",
  "  status.value = 'idle'",
  '}',
  '',
  'const submit = () => {',
  '  if (busy.value) return',
  '  submitted.value = true',
  '  const firstError = Object.keys(fieldIds).find((field) => errors.value[field])',
  '  if (firstError) {',
  "    status.value = 'idle'",
  '    focusField(firstError)',
  '    return',
  '  }',
  "  status.value = 'submitting'",
  '  toast.dismiss(' + quote(TOAST_ID) + ')',
  '  setTimeout(() => {',
  "    status.value = 'idle'",
  '    if (existingKeys.includes(form.key)) {',
  '      takenKey.value = form.key',
  "      focusField('key')",
  '      return',
  '    }',
  '    const variable = { key: form.key, environment: form.environment }',
  '    reset()',
  '    reportSaved(variable)',
  '  }, 900)',
  '}',
  ...(seed.report === 'failure' ? ['', 'onMounted(reportFailure)'] : []),
  ...(seed.report === 'saved'
    ? ['', `onMounted(() => reportSaved(${objectLiteral({ key: FILLED.key, environment: FILLED.environment })}))`]
    : [])
]

const TEMPLATE = `<div class="min-h-dvh bg-(--bg-canvas)">
  <form
    class="layout-column-form layout-boundary flex min-w-0 flex-col"
    aria-labelledby="create-variable-title"
    novalidate
    :aria-busy="busy"
    @submit.prevent="submit"
  >
    <header class="flex flex-col gap-(--spacing-xxs)">
      <h1 id="create-variable-title" class="text-balance text-heading-xs text-(--text-default)">Create Variable</h1>
      <p class="text-pretty text-body-sm text-(--text-muted)">Add a key-value pair your functions read at runtime.</p>
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
          <Skeleton width="var(--size-24)" height="var(--size-3)" />
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
          :helper-text="helper('key', 'Uppercase letters, digits and underscores, for example API_TOKEN.')"
        />
        <FieldText
          v-model="form.value"
          :input-id="fieldIds.value"
          name="value"
          label="Value"
          :required="missing('value')"
          :invalid="invalid('value')"
          :disabled="busy"
          :helper-text="helper('value', 'The value your functions read at runtime.')"
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
      <Button
        class="w-full md:w-auto"
        label="Cancel"
        kind="outlined"
        size="medium"
        :disabled="busy"
        @click="reset"
      />
      <Button
        class="w-full md:w-auto"
        type="submit"
        label="Create"
        kind="primary"
        size="medium"
        :disabled="status === 'loading'"
        :loading="status === 'submitting'"
      />
    </div>
  </form>
  <Toaster position="bottom-right" />
</div>`

const setupFor = (seed) => () => {
  const form = reactive({ ...seed.form })
  const submitted = ref(seed.submitted)
  const status = ref(seed.status)
  const takenKey = ref(seed.takenKey)

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
  const invalid = (field) =>
    submitted.value && Boolean(form[field]) && Boolean(errors.value[field])
  const helper = (field, guidance) =>
    submitted.value && errors.value[field] ? errors.value[field] : guidance

  const focusField = async (field) => {
    await nextTick()
    document.getElementById(FIELD_IDS[field])?.focus()
  }

  const reportFailure = () =>
    toast.error(FAILURE_TITLE, {
      id: TOAST_ID,
      description: FAILURE_DESCRIPTION,
      action: { label: 'Retry', onClick: () => submit() }
    })

  const reportSaved = (variable) =>
    toast.success(`${variable.key} was created.`, {
      id: TOAST_ID,
      description: `It is available in ${variable.environment}.`
    })

  const reset = () => {
    Object.assign(form, EMPTY)
    submitted.value = false
    takenKey.value = ''
    status.value = 'idle'
  }

  const submit = () => {
    if (busy.value) return
    submitted.value = true
    const firstError = Object.keys(FIELD_IDS).find((field) => errors.value[field])
    if (firstError) {
      status.value = 'idle'
      focusField(firstError)
      return
    }
    status.value = 'submitting'
    toast.dismiss(TOAST_ID)
    setTimeout(() => {
      status.value = 'idle'
      if (EXISTING_KEYS.includes(form.key)) {
        takenKey.value = form.key
        focusField('key')
        return
      }
      const variable = { key: form.key, environment: form.environment }
      reset()
      reportSaved(variable)
    }, 900)
  }

  onMounted(() => {
    if (seed.report === 'failure') reportFailure()
    if (seed.report === 'saved') reportSaved({ key: FILLED.key, environment: FILLED.environment })
  })

  return {
    environments: ENVIRONMENTS,
    fieldIds: FIELD_IDS,
    form,
    submitted,
    status,
    takenKey,
    busy,
    missing,
    invalid,
    helper,
    reset,
    submit
  }
}

const story = (seed, description) => ({
  render: () => ({ components, setup: setupFor(seed), template: TEMPLATE }),
  parameters: {
    docs: {
      description: { story: description },
      source: { code: toSfc(scriptFor(seed), TEMPLATE) }
    }
  }
})

const meta = {
  title: 'Templates/Platform/Forms/FormValidation',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A standalone form that walks through every state a submit can land in, one story per state, on a single Create Variable page with no card around it: a heading, then `FieldText`, `FieldSelect` and `FieldTextarea` straight on the canvas in the form column, with Cancel and Create at the end of the column. Validation runs only on submit. An empty field takes the `required` state, a filled but wrong one takes `invalid`, and its helper text swaps the guidance for the message, so each field speaks in one place and there is no summary. Submit moves focus to the first field in error. A rejected request that no field owns raises an error `Toast` with Retry and keeps the entries. A rejection a field owns, a key already in use, lands on that field and never toasts. A successful save raises a success `Toast` and clears the form. One `Toaster` is mounted with the form. While the form loads, `Skeleton` rows stand in for the fields and Create is disabled. Every story is wired: press Create with API_TOKEN as the key to get the conflict, or any other valid key to get the success state. Below md the actions stack at full width.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = story(
  SEEDS.idle,
  'The form as it opens: guidance under each field, no error shown before the first submit.'
)

export const ValidationErrors = story(
  SEEDS.invalid,
  'Create pressed with gaps. The empty Value and Environment take the required state, the malformed key takes the invalid state, each helper text carries its own message, and focus moves to Key.'
)

export const Submitting = story(
  SEEDS.submitting,
  'The request is in flight. Create shows its loading state, and the fields and Cancel are disabled so the entries cannot change mid-save.'
)

export const ServerError = story(
  SEEDS.error,
  'The request failed and no field owns the failure. An error Toast says what failed and carries Retry, the lock is released, and every entry stays as typed.'
)

export const Conflict = story(
  SEEDS.conflict,
  'The server rejected a value one field owns: the key is already in use. The error lands on Key and nowhere else.'
)

export const Saved = story(
  SEEDS.saved,
  'The save went through. A success Toast names the new variable and where it is available, and the form is cleared for the next entry.'
)

export const Loading = story(
  SEEDS.loading,
  'The form while its data loads, such as the environments it offers or the record an edit form opens with. Skeleton rows hold the layout, and Create stays disabled until the fields arrive.'
)
