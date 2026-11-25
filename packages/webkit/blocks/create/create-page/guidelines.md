# Single page create

The page a first-level resource is created on when everything it needs fits on one screen. The user arrives from the module's `Create <Object>` button, answers the required fields at the top, leaves the defaulted ones folded under Advanced, and commits from a bar that never scrolls away. The page has its own URL, its own creation header and no sidebar, so it survives a reload and the back button, and leaving it returns to the list.

## When to use

- Use create-page only to create a first-level resource on one page; its settings page is edit-resource (`edit/edit-resource`).
- The resource is one the sidebar routes to (a domain, a service, a purge) and the user came only to create it (`skills/webkit-create-surface`).
- Its fields fit in a few sections without depending on each other's answers step by step.
- An action that takes a form and runs once, whose submit names what it does (Save, Purge, Deploy).

## When not to use

- The fields split into steps that unlock in order, or one answer adds a step: use `create/create-wizard`.
- The resource binds another one and then deploys: use `create/create-wizard` (CreateAndDeploy).
- Deploying a repository, a template or an uploaded folder: start at `create/create-hub` and deploy with `create/create-deploy-template` (ImportFromGit covers a Git import).
- The thing is created inside another resource (a record in a zone, a rule in an application): use `create/create-drawer`.
- The settings page of an existing resource, with the save bar that mounts only after a change: use `edit/edit-resource`.
- Never put a create form in a dialog.

## Building blocks

### A. Creation header — `AppHeader`, `IconButton`, `Brand`, `Breadcrumb`, `AppHeaderAccount` (required)

`AppHeader` with no sidebar: a small outlined `IconButton` back to the module ("Back to Domains"), the `Brand` linking home, a `Breadcrumb` of the module and the page title, and the account `AppHeaderAccount` on the right. The breadcrumb's last item repeats the create button's label exactly.

### B. Page heading — `PageHeader` (required)

`PageHeader size="small"` at the top of the centred form column (`layout-column-form`), titled with the create label and described in one sentence of what the resource is. Its `title-id` labels the `form`. One section gap separates it from the first band.

### C. Sections — `SettingsGroup`, `Card`, `Item` (required)

Each band is a `SettingsGroup` with a title and a `hint` (the glyph that reveals guidance on hover or focus) over a flush `Card :padded="false"` whose content is an `Item.List` of rows. Required fields go in the first band, General. The last band is Advanced: `collapsible`, `icon="az az-settings"`, closed by default (`v-model:open`), holding only fields the endpoint does not require, that already carry its default and that are not the point of the form.

### D. Field rows — `SettingsRow`, `Input`, `FieldError` (required)

A `SettingsRow` per field: its title names the field and its description carries the guidance, so the control takes an `aria-label` instead of a separate label. A large `Input` sits right at the fixed cell width; every field row sets `stackable`, so on a phone the control moves under the copy at full width and the description wraps in full. Each required control takes `required` from the first render. On submit, an empty required field or a value the endpoint rejects gets `:invalid` and a `FieldError` that says what to enter. Editing the field clears its own message. A wide control (textarea, radio choice cards) uses `variant="stacked"` so it takes the full measure below the name.

### E. Switch rows — `Switch` (optional)

On/off settings use `SettingsRow variant="compact"` with a `Switch` hard right at its natural size, named by an `aria-label` that matches the row title, e.g. "Enable DNSSEC".

### F. Tags — `TagEditor` (optional)

A Tags band between the required fields and Advanced: a padded `Card` holding one `TagEditor` bound with `v-model:tags`, with key suggestions. Submit calls its `validate()` with the other fields, and the values carry only the tags that have a key. Never a comma-separated text field.

### G. Commit bar — `SaveBar`, `Button` (required)

`SaveBar variant="centered"`, a raised card centred at the bottom of the form that stays on screen while the form scrolls under it, at every width. It is the last child of the scrolling region, so the last field always scrolls clear of it. Its `#leading` slot holds what sits at the start, when there is something: an outlined Import `Button` and one muted line on the domain form, nothing on the others. On a phone the muted line hides, so Import keeps its label beside Cancel and Save; the Domain name description already says a paste imports. Its `#actions` slot holds outlined Cancel and the primary submit, both medium `Button`s. The submit is the form's only `type="submit"`. A long create uses the same bar.

### H. Failed request — `Alert` (required)

When the request fails, a danger `Alert` under the page heading, above the first section and scrolled into view, names what failed ("Could not create the domain."), says why, and carries Retry. It stays until the next request ends, and it is mounted again after each one, so a second identical failure is announced again. Nothing is reported only in a toast.

### I. Leaving with typed work — `useUnsavedChanges`, `ConfirmDialog` (required)

Cancel and the header Back both leave the page, so both ask first once the form differs from what it opened with: `useUnsavedChanges(() => form)` tracks it, Cancel and Back `await guard.confirmLeave()` before the page emits `cancel`, and one `ConfirmDialog v-bind="guard.dialogProps"` asks "Unsaved changes" with Keep editing and Discard changes. A clean form leaves at once, with no dialog, and the browser's own prompt covers a reload or a tab close while dirty. In a router app pair it with `onBeforeRouteLeave(() => guard.confirmLeave())` so a link or the browser Back asks too. Escape runs the same Cancel path through `useEscapeToCancel(onCancel)`.

### J. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`. `Kbd` hides itself inside a button on a touch screen and greys with a disabled button.

## Data

The block keeps the form as a local draft, validates it and emits `submit` with the values; it sends no request. `CreatePageValues` and `CreatePageProps` are exported from `create-page.vue`. The page owns the request: it sets `loading` while it runs, and on failure sets `error`, which the block shows in a danger `Alert` with Retry under the page heading; on success the page shows the toast and opens the new domain.

| Prop            | Type                        | What it does                                                                        |
| --------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| `defaultValues` | `Partial<CreatePageValues>` | The values the form starts from: Name and Domain name empty, DNSSEC off, Active on. |
| `loading`       | `boolean`                   | The create request is in flight; the `fieldset` locks and Save spins.               |
| `error`         | `string`                    | Why the request failed, shown in the danger `Alert` with Retry under the heading.   |

| Event    | Payload           | When                                                                               |
| -------- | ----------------- | ---------------------------------------------------------------------------------- |
| `submit` | `(event, values)` | Save on a valid form, and Retry in the error toast; `values` are trimmed.          |
| `cancel` | `(event)`         | Cancel in the bar or the header Back, once the user confirms leaving a dirty form. |

To go live, render the block from a page that owns the request:

```vue
<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import CreatePage, { type CreatePageValues } from './create-page.vue'

  const { mutate, pending, error } = useCreateDomain()
  const create = async (_event: Event, values: CreatePageValues) => {
    await mutate(values)
    toast.success(`${values.domain} created.`)
  }
</script>

<template>
  <CreatePage
    :loading="pending"
    :error="error ? 'The service did not answer. Check your connection and try again.' : ''"
    @submit="create"
    @cancel="router.back()"
  />
</template>
```

## Do

- Put every required field in the first band; never inside Advanced, so a failed submit always points at something on screen.
- Validate on submit only, then clear each message as soon as its field is edited.
- Give every control an `aria-label` that repeats its row title.
- Keep Cancel and the submit in the same bar, submit last, and name the submit after what it does (Save, Purge, Deploy).
- Lock the whole `fieldset` and every control with one `loading` flag while the request is in flight, and put `:loading` on the submit.
- On success, show a toast that names the resource and opens it; on failure, an error toast with Retry that keeps the values (`skills/webkit-errors`). Every submit in this block models the request: Default, CreateZone, CreatePurge, CreateService and CreateOrganization.

## Don't

- Don't show the sidebar on this page, or open it as a modal over the list.
- Don't stretch the commit bar across the page or build the centred card by hand; it is `SaveBar variant="centered"`.
- Don't print the band's guidance as a paragraph under its title; use the `hint`.
- Don't mark fields invalid before the first submit; `required` is set from the start and draws no colour.
- Don't make Save deploy, publish or charge as a side effect; creating is not deploying.
- Don't add a validation summary at the top; each message sits at its field.
- Don't squeeze a textarea or radio group into the right-hand cell; stack the row.

## Copy

- **Title and breadcrumb:** the create label, verb first with the entity's capitalization, e.g. "Create Domain". Identical to the button that opened the page.
- **Description:** one sentence on what the resource is, e.g. "A domain holds the DNS records that answer authoritatively for a hostname."
- **Section titles:** the domain, not the widget, e.g. "General", "Target", "Delivery settings", "Advanced".
- **Row descriptions:** a full sentence with a period, saying what the value does, e.g. "Identifies the domain in this list. It is not the hostname."
- **Submit:** one verb, e.g. "Save", "Purge", "Deploy". Cancel is always exactly "Cancel".
- **Required message:** "This field is required."
- **Invalid message:** what to enter, with an example, e.g. "Enter a valid domain name. Example: example.com."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no parentheses in labels, no "please".

## Accessibility

- **Escape on the page = Cancel.** `useEscapeToCancel(onCancel)` runs the same path as the Cancel button: a clean form leaves at once, an edited one opens the Unsaved changes dialog. It stays inert while the create request is in flight, while an IME is composing, when another handler already used the key, while a menu, listbox, popover, tooltip or dialog is open (the open Select or DatePicker closes first, and Escape on the Unsaved changes dialog only keeps editing) and when focus is in a control that uses Escape itself (an open combobox, a search field). Edit and settings pages are places, not tasks: Escape stays inert there.
- **The page opens with the cursor in the first field.** `onMounted` focuses Name (CreatePurge: the chosen Layer card), so a keyboard user types at once.
- **⌘ Enter and ⌘ S submit (`Ctrl` off Apple).** The bar reads as a save bar, so ⌘ S saves too instead of opening the browser's Save page dialog. `useShortcuts` binds `meta+enter` and `meta+s` to the form's `requestSubmit()`, the same path as the bar's submit button, from any field and from the Purge list textarea, where a bare Enter only adds a line. It stays inert while the request is in flight and lists the action (Create domain, Purge…) in the `?` dialog. The submit button carries `aria-keyshortcuts` and an `aria-hidden` `Kbd` that prints the platform's key.
- One `main` landmark holding one `form`, labelled by the `PageHeader` title through `aria-labelledby`, with `novalidate` so the page's own messages replace the browser's.
- A `fieldset` with a visually hidden `legend` groups the sections.
- Each message is tied to its control with `aria-describedby` and appears only on submit; `required` and `invalid` are announced through the control's own state.
- The collapsed Advanced region is `inert` while closed, so keyboard focus never lands in hidden fields.
- The back `IconButton` and the account trigger have `aria-label`s; decorative icons carry `aria-hidden="true"`.
- Focus order follows reading order: header, heading, General, Tags, Advanced toggle, then the bar's Cancel and Save (CreateZone adds Import before them).

## States

- Default: the Create Domain page at rest (no `defaultValues`, not `loading`); General holds Name and Domain name, Tags holds a `TagEditor` (key and value tags with key suggestions, checked on submit with `validate()`; never a comma-separated text field), Advanced is collapsed, the bar shows Cancel and Save. `loading` locks the form and spins Save, and `error` raises the error toast with Retry. Importing a zone file belongs to CreateZone, not to this page.
- CreateZone: Create Zone after a zone file is imported; a Records section lists each imported record (type `Tag`, value, TTL) with a Remove `IconButton` per row and Discard import in the card footer; each removal and the discard confirm in a toast with Undo, which puts the records back. Import in the bar and a paste into Domain name both read a BIND zone file, skip the SOA and nameserver records, fill an empty Name and Domain name from `$ORIGIN`, and confirm in a toast; a file with no records raises an error toast. The list previews the first 50 records with an "and N more" line, and a re-import skips records already listed.
- CreateOrganization: General with Name and a Mark color chosen from six compact `RadioGroup` cards (`variant="card"`, three per row on a phone and one row of six from the small breakpoint) (each color built from semantic tokens: primary, warning, danger, success, info and the text grays, never palette primitives), each an `Avatar` with `pattern="marble"` seeded by the name in that color's `colors`, above an In the header preview drawn the same way, an Owner `Item` with Owner and Active `Tag`s, First workspace and a collapsed Advanced of `Select`s; a name already in use is invalid on submit, and the request ends in a success toast or an error toast with Retry.
- CreatePurge: a Target band of radio choice cards for Layer and Purge type, an Arguments textarea that follows the type, a warning alert and a bar with Cancel and Purge.
- CreateService: a long create with a small `PageHeader` (Create Service, breadcrumb Services / Create Service) and five groups of rows, each under an `h2`, under the same centred `SaveBar` with Cancel and Save.
- RequiredFields: Create Service after Save on the empty form; Name and Address show "This field is required." until edited.

## Related

- `create/create-wizard` — the same job split into steps.
- `create/create-drawer` — create inside a resource without leaving it.
- `settings/settings-form` — the edit page that reuses these sections.
- `state/state-form-validation` — required and invalid states on submit.
- `view/view-table` — the list whose `Create <Object>` button opens this page.
- `SettingsRow` — the field row every section is built from; see `skills/webkit-form`.
