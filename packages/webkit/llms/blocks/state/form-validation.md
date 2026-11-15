# FormValidation (`state/form-validation`)

> A standalone form that walks through every state a submit can land in, one story per state, on a single Create Variable page with no card around it: a heading, then `Field`s wrapping `Input`, `Select` and `Textarea` straight on the canvas in the form column, with Cancel and Create at the end of the column. Validation runs only on submit. An empty field takes the `required` state, a filled but wrong one takes `invalid`, and its helper text swaps the guidance for the message, so each field speaks in one place and there is no summary. Submit moves focus to the first field in error. A rejected request that no field owns raises an error toast with Retry and keeps the entries. A rejection a field owns, a key already in use, lands on that field and in a danger `Alert` above the fields, and never toasts. A successful save raises a success toast and clears the form. Its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. While the form loads, `Skeleton` rows stand in for the fields and Create is disabled. Every story is wired: press Create with API_TOKEN as the key to get the conflict, or any other valid key to get the success state. Below md the actions stack at full width. Its page-level parts are `PageHeader`; the Section variants add `SectionHeader`, `SettingRow`, `SaveBar`, `GlobalHeader`, `Breadcrumb`, `Card`, `Item`, `MultiSelect`, `RadioGroup`, `Switch`, `NumberInput` and `Alert`. The Section variants move the same rules to a long sectioned Create Service page (the creation header, section headings over flush `Card` groups of `Item` rows, a sticky `SaveBar`): another user deleted the linked origin, Save comes back with an error the Origin section owns, the page scrolls there, one danger `Alert` under the heading says what happened with the recovery action on it (Reload origins), and the Origin select turns invalid with its own reason and takes the focus; reloading swaps the select for a `Skeleton` and disables Save, and once reloaded the Alert closes and the select is flagged required. Never a toast, never a summary. A page body for a create page: render it under the focused creation header (top-bar/creation-bar), not in ConsoleLayout.

- Surface: app
- Source: `blocks/state/form-validation/form-validation.vue` in `@aziontech/webkit`
- MCP: `get_block("state/form-validation")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [DropdownMenu](../../components/dropdown-menu.md), [Field](../../components/field.md), [GlobalHeader](../../components/global-header.md), [HelperText](../../components/helper-text.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [MultiSelect](../../components/multi-select.md), [NumberInput](../../components/number-input.md), [PageHeader](../../components/page-header.md), [RadioGroup](../../components/radio-group.md), [SaveBar](../../components/save-bar.md), [SectionHeader](../../components/section-header.md), [Select](../../components/select.md), [SettingRow](../../components/setting-row.md), [Skeleton](../../components/skeleton.md), [Switch](../../components/switch.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-form`, `webkit-errors`, `webkit-ui-states`

## Asked as

form validation; validation errors; submit states; required fields; server error on submit; conflict error; saved state; validação de formulário; erros de validação; campos obrigatórios; submit outcomes; every submit outcome; server validation; server-side error; rejected save; field scoped error; section error; stale reference; linked resource deleted; api error on save; reload options; form error; erro de formulário; validação no servidor; erro da api; salvamento rejeitado; error de formulario; validación en el servidor

Every state a submit can land in, on one create form. The user's job is to create a resource and, when something stops the save, to know exactly which control to touch and that nothing they typed was lost. The primary is a short Create Variable page (heading, four fields straight on the canvas, Cancel and Create); the variants walk it through validation, the in-flight lock, an unscoped failure, a conflict, success and loading. The Section variants carry the same rules to a long sectioned create page, where the server rejects the save because of one section: another user deleted the origin the form links to, so the page takes the user to that section, says what happened and that nothing else was lost, offers the one action that recovers (Reload origins) and marks the field with its own reason. The Section variants are a focused create page with their own creation header and no rail.

This block is a page body for a create page: render it under the focused creation header (`top-bar/creation-bar`), not in `ConsoleLayout`.

## When to use

- Use form-validation as the reference for every submit outcome of a create or edit form: required, invalid, in flight, conflict, section rejected, unscoped failure, saved.
- As the reference for the submit states of any create or edit form: what happens on Create with gaps, while the request is in flight, and on each kind of answer.
- A short create form with a handful of fields and no sections (a variable, a key, a token).
- A long, sectioned create or edit form whose save can be rejected because of one section (a linked resource deleted or changed by someone else): SectionRejected, SectionReloading, SectionReloaded.

## When not to use

- A sectioned create page with many settings and a sticky save bar: build it from `create/create-page` and apply these states to it.
- A create that runs for tens of seconds and can be left (build, deploy, import): use `state/async-submit`.
- Settings of an existing object saved section by section: use `settings/settings-form`.
- Signed-out screens: use `auth/sign-in`, where nothing toasts.
- A create launched from a list without leaving it: use `create/create-drawer`.

## Where the error renders

| Error                                                                   | Where it renders                                                                                                                                                                     | Variant          |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| A value the user left empty or typed wrong (client-side)                | On the field: `required` or `invalid`, its message in the description, focus on the first field in error                                                                             | ValidationErrors |
| A value the server refused that one field owns (a key already in use)   | On the field (`invalid` with its reason) and in a danger `Alert` above the fields of its section; never a toast                                                                      | Conflict         |
| A rejection one section of a long form owns (a linked resource deleted) | A danger `Alert` under that section's heading with the recovery action, the field `invalid` with its own reason, the section scrolled into view and the field focused; never a toast | SectionRejected  |
| A failure no field or section owns (network, timeout, 500)              | `toast.error` with Retry, every entry kept                                                                                                                                           | ServerError      |
| A save that went through                                                | `toast.success` naming the new object, the form cleared                                                                                                                              | Saved            |

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

`Cancel` (`kind="outlined"`, a link back to the Variables list; it never clears the form in place) then `Create` (`kind="primary"`, `type="submit"`) at the end of the column. Create shows `loading` while submitting and is `disabled` while loading; Cancel is disabled while busy. Below `md` both stack at full width.

### H. Section notice — `Alert` (conflict and rejection only)

A server rejection a field owns lands in two places, never in a toast: a danger `Alert` at the top of the section that owns the field (on this one-section form, above the fields; on a long form, under the section heading, as in SectionRejected), and the field's `invalid` state with its reason. The `Alert` says what happened, that nothing typed was lost and what to do; it closes once the user changes the value or recovers.

### Section rejection (Section variants only)

The Section variants add `GlobalHeader`, `IconButton`, `Tooltip`, `Brand`, `Breadcrumb`, `DropdownMenu`, `Avatar`, `SectionHeader`, `SettingRow`, `SaveBar`, `Card`, `Item`, `MultiSelect`, `RadioGroup`, `Switch`, `NumberInput` and `HelperText` to the parts above. The Section variants are a Create Service page under the creation header (`top-bar/creation-bar`): a back `IconButton` with a `Tooltip`, the `Brand`, a `Breadcrumb` (`Services › Create Service`) and the account `DropdownMenu`. Each section is a `SectionHeader` over a flush `Card` whose `Item.List` holds `SettingRow`s (`Input`, `MultiSelect`, `RadioGroup` with `kind="card"`, `Switch`, `NumberInput`), and a sticky `SaveBar` raised with `z-10` holds Cancel and Save. The Origin heading carries an id so the save can scroll it into view; the danger `Alert` opens under it with an expand transition (`motion-reduce:transition-none`) and the recovery action (`Reload origins`, `kind="secondary"`, `loading` while it runs) in its `action` slot. The Origin `Select` takes `invalid` when the server says the chosen origin no longer exists, and `required` once the list is reloaded without it, each with a one-line `HelperText`. While the list reloads a `Skeleton` named `Loading origins` stands in for the select and Save is disabled.

### Result notices — through `toast`

A toast shows the result of a save that no field owns: `toast.error` with **Retry** when the request failed and no field is to blame (row 3 of `skills/webkit-errors`), `toast.success` naming the new object when the save went through. Both use one `id`, and the previous result is dismissed when a new submit starts, so attempts never stack. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so the page never renders a `Toaster`.

## Do

- Validate on submit, not on every keystroke; after the first submit, a field's message updates as the user fixes it.
- Move focus to the first field in error after a submit, after the lock is released.
- Lock the whole scope while the request is in flight: Create shows `loading`, every field and Cancel are disabled, `aria-busy` is on the form. Release it on success and failure alike.
- Keep every entry after a failed or rejected save, and say so in the copy.
- Clear the form after a success, so the next entry starts clean, and name the new object in the toast.
- On the one-section form, a key already in use raises the danger `Alert` above the fields as well as the `invalid` Key, and focus moves to Key.
- On a long form, put a section-scoped rejection in one danger `Alert` under that section's heading with the recovery on it, scroll the section into view (instant under `prefers-reduced-motion`) and focus the field with `preventScroll` after the lock is released. After the recovery, close the `Alert`, clear the stale value and flag the field `required`.

## Don't

- Don't show a validation summary at the top; each field carries its own message.
- Don't toast a rejection a field owns (a key already in use, a deleted origin). The toast dismisses itself and points nowhere.
- Don't use the amber `required` prompt for a value the server rejected; the value is present, so it is `invalid`.
- Don't disable Create to signal missing values; let submit run and show the messages.
- Don't clear the form or send the user back to the start after a rejection, and don't open more than one `Alert` for one rejection.
- Don't auto-dismiss an `Alert` that names a required action; it stays until the user recovers (see SectionReloaded).

## Copy

- **Page heading:** `Create` plus the entity, matching the page it lists: `Create Variable`. Lead: one sentence on what it is for: `Add a key-value pair your services read at runtime.`
- **Field labels:** one to three words, no colon, no parentheses: `Key`, `Value`, `Environment`, `Description`.
- **Field descriptions:** a constraint or purpose, one sentence with a period: `Uppercase letters, digits and underscores, for example API_TOKEN.`, `Optional. Up to 200 characters.`
- **Required message:** the one sentence every block uses: `This field is required.`; for a select, the action: `Select an environment.`
- **Invalid message:** what is wrong and the rule: `Use uppercase letters, digits and underscores, starting with a letter.`
- **Conflict message:** the fact, on the field: `A variable named API_TOKEN already exists.` The section `Alert` adds what happened and what to do: `A variable named API_TOKEN already exists in this account, so it wasn't created. Your entries are kept: change the key and press Create again.`
- **Error toast:** what did not happen, then what was kept: title `The variable wasn't created.`, description `The request didn't reach the server. Your entries are kept.`, action `Retry`.
- **Success toast:** past tense, names the object and where it applies: `API_TOKEN was created.` / `It is available in Production.`
- **Section Alert:** the fact, the cause, what was not lost, what to do: `Origin "web-origin-prod" no longer exists. Another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one.` Field reasons: `This origin no longer exists.`, then `Select an origin to continue.`
- **Actions:** `Cancel`, `Create`, `Retry`; on the long form `Cancel`, `Save`, `Reload origins`.

## Accessibility

- The `<form>` is labelled by the heading (`aria-labelledby`), uses `novalidate`, and sets `aria-busy` while loading or submitting.
- Every control has a `Field.Label` bound by `for`; the description and message are wired to the control by `Field`.
- The loading region is `role="status"` with an accessible name (`Loading the form`).
- Focus moves to the first field in error, only after the lock is released, since a disabled control cannot take focus.
- Toasts are announced by the app's `Toaster` region; the error toast keeps its Retry reachable by keyboard.
- A section `Alert` sits in reading order before the fields it governs; its action is a real button reachable by keyboard.
- In SectionRejected focus moves to the refused field with `preventScroll`, so the scroll to the section heading is the only movement; the reloading `Skeleton` has an accessible name.

## States

- Default: the empty Create Variable form, idle.
- ValidationErrors: Create pressed with gaps; empty Value and Environment take `required`, the malformed Key takes `invalid`, each with its own message, and focus moves to Key.
- Submitting: the request is in flight; Create shows `loading`, the fields and Cancel are disabled.
- ServerError: the request failed and no field owns it; an error toast with Retry, the lock released, every entry kept.
- Conflict: the key is already in use; the danger `Alert` opens above the fields, Key takes `invalid` with its reason and focus, and nothing toasts.
- Saved: the save went through; a success toast names the variable and where it is available, and the form is cleared.
- Loading: the form data is still arriving; `Skeleton` rows hold the layout and Create is disabled.
- SectionRejected: on the long Create Service form, another user deleted the origin and Save was pressed; the page scrolls to Origin, the danger `Alert` opens under its heading with Reload origins, and focus lands on the Origin select, which reads This origin no longer exists.
- SectionReloading: Reload origins in flight; its button loads, the select gives way to a `Skeleton`, Save is disabled.
- SectionReloaded: the list is back without the deleted origin; the `Alert` closes, the select is cleared and flagged required with Select an origin to continue.

## Related

- `state/async-submit` — the long-running counterpart: use it when the action runs long enough that the user leaves (build, deploy, import) and the result must reach them later.
- `skills/webkit-errors` — where every error renders, row by row.
- `create/create-page` — the sectioned create page these states apply to.
- `auth/sign-in` — the signed-out version, where every outcome lands in one card `Alert` and nothing toasts.
- `settings/settings-form` — the same field states on an existing object.
- `Field` — the label, description and state triad every field here uses.

## Variants

- `Default` — primary (the code below)
- `ValidationErrors` — Create pressed with gaps. The empty Value and Environment take the required state, the malformed key takes the invalid state, each helper text carries its own message, and focus moves to Key.
- `Submitting` — The request is in flight. Create shows its loading state, and the fields and Cancel are disabled so the entries cannot change mid-save.
- `ServerError` — The request failed and no field owns the failure. An error Toast says what failed and carries Retry, the lock is released, and every entry stays as typed.
- `Conflict` — The server rejected a value one field owns: the key is already in use. A danger Alert above the fields says so and that the entries are kept, Key takes the invalid state with its reason and the focus, and nothing toasts.
- `Saved` — The save went through. A success Toast names the new variable and where it is available, and the form is cleared for the next entry.
- `Loading` — The form while its data loads, such as the environments it offers or the record an edit form opens with. Skeleton rows hold the layout, and Create stays disabled until the fields arrive.
- `SectionRejected` — A long Create Service form whose linked origin another user deleted, after Save: the page scrolls to the Origin section, the danger Alert opens under its heading with Reload origins, and focus lands on the Origin select, which reads This origin no longer exists.
- `SectionReloading` — Reload origins in flight: its button shows the loading state, the Origin select gives way to a Skeleton, and Save is disabled until the list is back.
- `SectionReloaded` — The list is reloaded without the deleted origin: the Alert closes, the select is cleared and flagged required with Select an origin to continue.

Each variant is the same screen in another state: `get_block("state/form-validation", { variant })`, or the file under `blocks/state/form-validation/variants/`.

## Code (`Default`)

```vue
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
  import { computed, nextTick, reactive, ref } from 'vue'

  type FieldName = 'key' | 'value' | 'environment' | 'description'
  type FormStatus = 'idle' | 'loading' | 'submitting'
  type VariableForm = Record<FieldName, string>
  interface SavedVariable {
    key: string
    environment: string
  }

  const KEY_PATTERN = /^[A-Z][A-Z0-9_]*$/
  const DESCRIPTION_LIMIT = 200
  const existingKeys = ['API_TOKEN']
  const environments = [
    { value: 'Production', label: 'Production' },
    { value: 'Preview', label: 'Preview' }
  ]
  const fieldIds: Record<FieldName, string> = {
    key: 'variable-key',
    value: 'variable-value',
    environment: 'variable-environment',
    description: 'variable-description'
  }
  const empty = (): VariableForm => ({ key: '', value: '', environment: '', description: '' })

  const form = reactive<VariableForm>(empty())
  const submitted = ref(false)
  const status = ref<FormStatus>('idle')
  const takenKey = ref('')

  const errors = computed<Record<FieldName, string>>(() => ({
    key: !form.key
      ? 'This field is required.'
      : !KEY_PATTERN.test(form.key)
        ? 'Use uppercase letters, digits and underscores, starting with a letter.'
        : form.key === takenKey.value
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
    () => submitted.value && Boolean(form.key) && form.key === takenKey.value
  )
  const busy = computed(() => status.value === 'loading' || status.value === 'submitting')
  const missing = (field: FieldName) => submitted.value && !form[field]
  const invalid = (field: FieldName) =>
    submitted.value && Boolean(form[field]) && Boolean(errors.value[field])
  const helper = (field: FieldName, guidance: string) =>
    submitted.value && errors.value[field] ? errors.value[field] : guidance

  const focusField = async (field: FieldName) => {
    await nextTick()
    document.getElementById(fieldIds[field])?.focus()
  }

  const reportSaved = (variable: SavedVariable) =>
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
    const firstError = (Object.keys(fieldIds) as FieldName[]).find((field) => errors.value[field])
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
            href="/variables"
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
  </div>
</template>
```
