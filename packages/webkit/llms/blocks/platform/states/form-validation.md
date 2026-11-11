# FormValidation (`platform/states/form-validation`)

> A standalone form that walks through every state a submit can land in, one story per state, on a single Create Variable page with no card around it: a heading, then `Field`s wrapping `Input`, `Select` and `Textarea` straight on the canvas in the form column, with Cancel and Create at the end of the column. Validation runs only on submit. An empty field takes the `required` state, a filled but wrong one takes `invalid`, and its helper text swaps the guidance for the message, so each field speaks in one place and there is no summary. Submit moves focus to the first field in error. A rejected request that no field owns raises an error toast with Retry and keeps the entries. A rejection a field owns, a key already in use, lands on that field and in a danger `Alert` above the fields, and never toasts. A successful save raises a success toast and clears the form. One `Toaster` is mounted with the form. While the form loads, `Skeleton` rows stand in for the fields and Create is disabled. Every story is wired: press Create with API_TOKEN as the key to get the conflict, or any other valid key to get the success state. Below md the actions stack at full width. Its page-level parts are `PageHeader`. A rejection the server scopes to one section of a long form (a linked resource deleted while the form is open) is the FormError template (Templates/Platform/States/FormError).

- Surface: product
- Source: `blocks/platform/states/form-validation/form-validation.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/states/form-validation")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Field](../../../components/field.md), [Input](../../../components/input.md), [PageHeader](../../../components/page-header.md), [Select](../../../components/select.md), [Skeleton](../../../components/skeleton.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md)
- Skills: `webkit-form`, `webkit-errors`, `webkit-ui-states`

## Asked as

form validation; validation errors; submit states; required fields; server error on submit; conflict error; saved state; validação de formulário; erros de validação; campos obrigatórios

Every state a submit can land in, on one create form. The user's job is to create a resource and, when something stops the save, to know exactly which control to touch and that nothing they typed was lost. The primary is a short Create Variable page (heading, four fields straight on the canvas, Cancel and Create); the variants walk it through validation, the in-flight lock, an unscoped failure, a conflict, success and loading. A server rejection scoped to one section of a long form is its own block, `platform/states/form-error`.

## When to use

- As the reference for the submit states of any create or edit form: what happens on Create with gaps, while the request is in flight, and on each kind of answer.
- A short create form with a handful of fields and no sections (a variable, a key, a token).

## When not to use

- A sectioned create page with many settings and a sticky save bar: build it from `platform/create/single-page-create` and apply these states to it.
- A create that runs for tens of seconds and can be left (build, deploy, import): use `platform/states/async-submit`.
- Settings of an existing object saved section by section: use `platform/settings/settings-form`.
- A long sectioned form whose save is rejected because of one section (a linked resource deleted under the user): use `platform/states/form-error`.
- Signed-out screens: use `platform/auth`, where nothing toasts.
- A create launched from a list without leaving it: use `platform/create/create-in-drawer`.

## Building blocks

### A. Page heading — `PageHeader` (required)

`size="small"`, the create title and one sentence on what the object is for, with `title-id` so the `<form>` is labelled by it. No actions in the header: the form's actions sit at the end of the column.

### B. Loading rows — `Skeleton` (loading only)

While the form's data loads (the options a select offers, the record an edit form opens with), four pairs of bands stand in for label and control inside a `role="status"` region with an accessible name. Create stays disabled until the fields arrive.

### C. Field — `Field` (required)

Each control sits in a `Field` with `Field.Label` (bound by `for`) and `Field.Description`. The description carries the guidance until a submit finds a problem, then swaps to the message, so each field speaks in one place. The field takes `required` when the value is empty and `invalid` when it is filled but wrong (malformed, too long, or already taken on the server). All fields take `disabled` while the request is in flight.

### D. Text value — `Input` (required)

Key and Value. A placeholder may show the expected shape (`API_TOKEN`); the rule itself lives in the description.

### E. Choice — `Select` (required)

Environment, with `placeholder="Select an environment"`, `Select.Trigger` carrying the id the label points at, and `Select.Option` per value. Empty on submit takes `required`.

### F. Long text — `Textarea` (optional)

Description. Optionality is said in the description (`Optional. Up to 200 characters.`), never in the label; over the limit takes `invalid`.

### G. Actions — `Button` (required)

`Cancel` (`kind="outlined"`, resets the form) then `Create` (`kind="primary"`, `type="submit"`) at the end of the column. Create shows `loading` while submitting and is `disabled` while loading; Cancel is disabled while busy. Below `md` both stack at full width.

### H. Result notices — `Toaster` (required)

One `Toaster` mounted with the form, `position="bottom-right"`. It shows the result of a save that no field owns: `toast.error` with **Retry** when the request failed and no field is to blame (row 3 of `skills/webkit-errors`), `toast.success` naming the new object when the save went through. Both use one `id`, and the previous result is dismissed when a new submit starts, so attempts never stack.

### I. Section notice — `Alert` (conflict and rejection only)

A server rejection a field owns lands in two places, never in a toast: a danger `Alert` at the top of the section that owns the field (on this one-section form, above the fields; on a long form, under the section heading, as in `platform/states/form-error`), and the field's `invalid` state with its reason. The `Alert` says what happened, that nothing typed was lost and what to do; it closes once the user changes the value or recovers.

## Do

- Validate on submit, not on every keystroke; after the first submit, a field's message updates as the user fixes it.
- Move focus to the first field in error after a submit, after the lock is released.
- Lock the whole scope while the request is in flight: Create shows `loading`, every field and Cancel are disabled, `aria-busy` is on the form. Release it on success and failure alike.
- Keep every entry after a failed or rejected save, and say so in the copy.
- Clear the form after a success, so the next entry starts clean, and name the new object in the toast.
- On the one-section form, a key already in use raises the danger `Alert` above the fields as well as the `invalid` Key, and focus moves to Key.

## Don't

- Don't show a validation summary at the top; each field carries its own message.
- Don't toast a rejection a field owns (a key already in use, a deleted origin). The toast dismisses itself and points nowhere.
- Don't use the amber `required` prompt for a value the server rejected; the value is present, so it is `invalid`.
- Don't disable Create to signal missing values; let submit run and show the messages.
- Don't auto-dismiss an `Alert` that names a required action; it stays until the user recovers (see the Reloaded state of `platform/states/form-error`).

## Copy

- **Page heading:** `Create` plus the entity, matching the page it lists: `Create Variable`. Lead: one sentence on what it is for: `Add a key-value pair your services read at runtime.`
- **Field labels:** one to three words, no colon, no parentheses: `Key`, `Value`, `Environment`, `Description`.
- **Field descriptions:** a constraint or purpose, one sentence with a period: `Uppercase letters, digits and underscores, for example API_TOKEN.`, `Optional. Up to 200 characters.`
- **Required message:** names the field: `Key is required.`; for a select, the action: `Select an environment.`
- **Invalid message:** what is wrong and the rule: `Use uppercase letters, digits and underscores, starting with a letter.`
- **Conflict message:** the fact, on the field: `A variable named API_TOKEN already exists.` The section `Alert` adds what happened and what to do: `A variable named API_TOKEN already exists in this account, so it wasn't created. Your entries are kept: change the key and press Create again.`
- **Error toast:** what did not happen, then what was kept: title `The variable wasn't created.`, description `The request didn't reach the server. Your entries are kept.`, action `Retry`.
- **Success toast:** past tense, names the object and where it applies: `API_TOKEN was created.` / `It is available in Production.`
- **Actions:** `Cancel`, `Create`, `Retry`.

## Accessibility

- The `<form>` is labelled by the heading (`aria-labelledby`), uses `novalidate`, and sets `aria-busy` while loading or submitting.
- Every control has a `Field.Label` bound by `for`; the description and message are wired to the control by `Field`.
- The loading region is `role="status"` with an accessible name (`Loading the form`).
- Focus moves to the first field in error, only after the lock is released, since a disabled control cannot take focus.
- Toasts are announced by the `Toaster`; the error toast keeps its Retry reachable by keyboard.
- A section `Alert` sits in reading order before the fields it governs.

## States

- Default: the empty Create Variable form, idle.
- ValidationErrors: Create pressed with gaps; empty Value and Environment take `required`, the malformed Key takes `invalid`, each with its own message, and focus moves to Key.
- Submitting: the request is in flight; Create shows `loading`, the fields and Cancel are disabled.
- ServerError: the request failed and no field owns it; an error toast with Retry, the lock released, every entry kept.
- Conflict: the key is already in use; the danger `Alert` opens above the fields, Key takes `invalid` with its reason and focus, and nothing toasts.
- Saved: the save went through; a success toast names the variable and where it is available, and the form is cleared.
- Loading: the form data is still arriving; `Skeleton` rows hold the layout and Create is disabled.

## Related

- `platform/states/form-error` — a server rejection scoped to one section of a long form: the section `Alert` with its recovery action, and the field's own reason.
- `platform/states/async-submit` — the long-running counterpart: the outcome reports back wherever the user is.
- `platform/create/single-page-create` — the sectioned create page these states apply to.
- `platform/auth` — the signed-out version, where every outcome lands in one card `Alert` and nothing toasts.
- `platform/settings/settings-form` — the same field states on an existing object.
- `Field` — the label, description and state triad every field here uses.

## Variants

- `Default` — primary (the code below)
- `ValidationErrors` — Create pressed with gaps. The empty Value and Environment take the required state, the malformed key takes the invalid state, each helper text carries its own message, and focus moves to Key.
- `Submitting` — The request is in flight. Create shows its loading state, and the fields and Cancel are disabled so the entries cannot change mid-save.
- `ServerError` — The request failed and no field owns the failure. An error Toast says what failed and carries Retry, the lock is released, and every entry stays as typed.
- `Conflict` — The server rejected a value one field owns: the key is already in use. A danger Alert above the fields says so and that the entries are kept, Key takes the invalid state with its reason and the focus, and nothing toasts.
- `Saved` — The save went through. A success Toast names the new variable and where it is available, and the form is cleared for the next entry.
- `Loading` — The form while its data loads, such as the environments it offers or the record an edit form opens with. Skeleton rows hold the layout, and Create stays disabled until the fields arrive.

Each variant is the same screen in another state: `get_pattern("platform/states/form-validation", { variant })`, or the file under `blocks/platform/states/form-validation/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Textarea from '@aziontech/webkit/textarea'
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

  const form = reactive(empty())
  const submitted = ref(false)
  const status = ref('idle')
  const takenKey = ref('')

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

  const conflict = computed(
    () => submitted.value && Boolean(form.key) && form.key === takenKey.value
  )
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
      <PageHeader
        title="Create Variable"
        description="Add a key-value pair your services read at runtime."
        size="small"
        title-id="create-variable-title"
      />

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
          <Alert
            v-if="conflict"
            severity="danger"
            :label="`A variable named ${form.key} already exists in this account, so it wasn't created. Your entries are kept: change the key and press Create again.`"
          />
          <Field
            :required="missing('key')"
            :invalid="invalid('key')"
            :disabled="busy"
          >
            <Field.Label :for="fieldIds.key">Key</Field.Label>
            <Input
              :id="fieldIds.key"
              v-model="form.key"
              name="key"
              placeholder="API_TOKEN"
            />
            <Field.Description>
              {{
                helper('key', 'Uppercase letters, digits and underscores, for example API_TOKEN.')
              }}
            </Field.Description>
          </Field>
          <Field
            :required="missing('value')"
            :invalid="invalid('value')"
            :disabled="busy"
          >
            <Field.Label :for="fieldIds.value">Value</Field.Label>
            <Input
              :id="fieldIds.value"
              v-model="form.value"
              name="value"
            />
            <Field.Description>
              {{ helper('value', 'The value your services read at runtime.') }}
            </Field.Description>
          </Field>
          <Field
            :required="missing('environment')"
            :disabled="busy"
          >
            <Field.Label :for="fieldIds.environment">Environment</Field.Label>
            <Select
              v-model="form.environment"
              placeholder="Select an environment"
            >
              <Select.Trigger :id="fieldIds.environment" />
              <Select.Content>
                <Select.Option
                  v-for="option in environments"
                  :key="String(option.value)"
                  :value="option.value"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
            <Field.Description>
              {{ helper('environment', 'Where this variable is available.') }}
            </Field.Description>
          </Field>
          <Field
            :invalid="invalid('description')"
            :disabled="busy"
          >
            <Field.Label :for="fieldIds.description">Description</Field.Label>
            <Textarea
              :id="fieldIds.description"
              v-model="form.description"
              name="description"
            />
            <Field.Description>
              {{ helper('description', 'Optional. Up to 200 characters.') }}
            </Field.Description>
          </Field>
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
```
