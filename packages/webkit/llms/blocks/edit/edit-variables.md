# EditVariables (`edit/edit-variables`)

> A key/value editor, drawn as a variables list page and the Create variable drawer its heading action opens. The list follows the view-table recipe: one client-mode `useCollection` drives a `PropertyFilter`, `CollectionPreferences` and a data-driven `DataTable`, with a state-first-use and a no-match `EmptyState`; each row's Edit opens the drawer on that variable, Clone inserts a copy below it, and Delete opens the typed `ConfirmDialog` of edit-delete-dialog. In the drawer the variables are an `AttributeEditor` (add, remove, focus, announcements, minimum one row) whose `row` slot draws each variable as a pair of `InputGroupRoot` rows with `InputGroupInput` fields, a Key row with a Remove button and a Value row with a show-value button and a Secret checkbox, beside a Form or JSON view and an Upload of a .env file; every scope is an `InputGroupRoot` joining its label, a `MultiSelect` of resources and an enable `Switch`, with Global giving way to any specific scope. Required and invalid states appear only after Save is pressed; every create, edit, clone and delete raises a success toast, and a save that fails keeps the drawer open with a danger `Alert`. Built from `AttributeEditor`, `PageHeader`, `PropertyFilter`, `CollectionPreferences`, `SettingsGroup`, `DataTable`, `Card`, `EmptyState`, `TableCellId`, `TableCellLink`, `TableCellActions`, `TableCellTime`, `DropdownMenu`, `ConfirmDialog`, `Alert`, `Input`, `IconButton`, `Tooltip`, `Drawer` and its parts, `PanelHeader`, `PanelBody`, `PanelFooter`, `InputGroupRoot`, `InputGroupAddon`, `InputGroupInput`, `Checkbox`, `ToggleGroup`, `MultiSelect`, `Switch`, `FieldError` and `Button`; the JSON view is a webkit `Textarea`. A page body for ConsoleLayout.

- Surface: app
- Source: `blocks/edit/edit-variables/edit-variables.vue` in `@aziontech/webkit`
- MCP: `get_block("edit/edit-variables")`
- Components: [Alert](../../components/alert.md), [AttributeEditor](../../components/attribute-editor.md), [Button](../../components/button.md), [Card](../../components/card.md), [Checkbox](../../components/checkbox.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfigProvider](../../components/config-provider.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, `DrawerTrigger`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), `FieldDescription`, `FieldError`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), `InputGroupAddon`, `InputGroupInput`, `InputGroupRoot`, [Kbd](../../components/kbd.md), [MultiSelect](../../components/multi-select.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../components/property-filter.md), [SettingsGroup](../../components/settings-group.md), [Switch](../../components/switch.md), `TableCellActions`, `TableCellId`, `TableCellLink`, `TableCellTime`, [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-collection`, `use-file-picker`, `use-shortcuts`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-create-surface`

## Asked as

variables; environment variables; env vars; secrets; create variable; edit variable; variables list; variáveis; variáveis de ambiente; segredos; criar variável; key value editor; attribute editor; .env upload; editor de chave e valor; delete variable; clone variable; paste .env; paste env file; import .env; colar .env; importar variáveis; dotenv; network list; ip list; asn list; country list; bulk paste; lista de rede; lista de ips; lista de red; variables page; variables block; environment variables page; list of variables; página de variáveis

A list of key and value pairs and the drawer that edits them, here environment variables. The user scans the variables already defined, then opens Create variable to type or paste several pairs at once, mark the sensitive ones as secret, and select where they apply (the whole account, or specific environments, projects, services or policies) before saving them in one step. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header, the ⌘K palette and the `main`.

## When to use

- Use the variables block for a list of key/value variables with a create/edit drawer; the key/value field itself is the AttributeEditor component.
- Users define many free-form pairs of a name and a value (environment variables, headers, metadata, tags) and often bring them from a file.
- Some values are sensitive and must be masked and write-only once saved.
- Each pair applies to a scope the user picks from existing resources.

## When not to use

- Conditions and actions evaluated in order: use `edit/edit-rule-builder`.
- A fixed set of named settings on one resource: use `edit/edit-resource` or `settings/settings-form`.
- A short read-only list of related records inside a settings tab: use `detail/detail-domains-card`.
- A long document or code the user edits as text: use `edit/edit-function`.

## Building blocks

### A. Page heading — `ConfigProvider`, `PageHeader`, `Button` (required)

`PageHeader` titled Variables with a one-sentence description and two actions: an outlined medium Documentation and the primary medium `Create variable`, the same height as Documentation, which opens the drawer. `ConfigProvider` only fixes the clock (`now`) for the sample, a test or a server render, so the relative update times read the same everywhere; with live data and no `now` they read the real clock.

### B. Controls row — `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

The same controls row as `view/view-table`, all bound to one client-mode `useCollection` call: a `PropertyFilter` labeled "Filter variables" (free text over key, ID, author and type, plus Key, Author and Type properties), outlined `IconButton`s for Refresh and Download CSV, each named by a `Tooltip`, and `CollectionPreferences` last. The filter, sort and page live in the URL; page size and columns are saved. See `skills/webkit-lists`.

### C. Variables table — `Card`, `DataTable`, `TableCellId`, `TableCellLink`, `TableCellTime`, `Tooltip` (required)

`Card :padded="false"` around a borderless data-driven `DataTable` bound with `v-bind="tableProps"`, with Key as the `principal`, unhideable column, then ID (hidden by default), Value, Scope and Last modified. ID is `TableCellId` ("Copy variable ID") and Value is `TableCellLink` with `copyable`; a secret value shows its mask and loses its copy control (`:copyable="!row.secret"`). Last modified is `TableCellTime` with the row's instant (a `Date` or an ISO string, never typed text such as `2 days ago`) and its `author`, so the column sorts by time and the relative text follows the locale. See `skills/webkit-tables`.

### D. Row actions — `TableCellActions`, `DropdownMenu` (required)

`TableCellActions`, named after the variable ("Actions for API_URL"), opens its menu of `DropdownMenu.Group`s placed `bottom-end`: Edit and Clone in the first group, Delete alone in the last. Edit opens the drawer on that variable; Clone inserts a copy right below it with `_COPY` appended to the key; Delete opens the confirmation dialog.

### E. Create and edit drawer — `Drawer`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `PanelBody` (required)

A right-side `Drawer` whose content is one `form` labeled Create variable or Edit variable. `PanelHeader` holds the `DrawerTitle` and the drawer's own close button; `PanelBody` scrolls the Variables and Scope sections. The form resets every time the drawer opens: from Create variable, one empty pair, the Form view, Global the only scope on; from a row's Edit, that variable's pair and scopes, with no Upload, view toggle or Add variable. A saved secret is never shown: its value starts empty, an empty value keeps the saved secret, and the Secret checkbox is locked. See `skills/webkit-create-surface`.

### F. Variables section — `SettingsGroup`, `Button`, `ToggleGroup` (required)

A `SettingsGroup` titled Variables with a hint that says what variables are for. Its toolbar holds an outlined Upload `Button` that reads a `.env` or text file into rows, and a medium `ToggleGroup` that switches between the Form and JSON views of the same data.

### G. Key and value rows — `AttributeEditor`, `Field`, `InputGroupRoot`, `InputGroupAddon`, `InputGroupInput`, `Input`, `Tooltip`, `IconButton`, `Checkbox`, `FieldError` (required)

The rows are one `AttributeEditor` (`v-model:items`, `min-items` 1, `add-disabled` until the last pair is filled), which owns the list semantics, Add variable, Remove, the focus after each, the polite "Item n added / removed" announcement and, while editing one variable, the limit of 1 with the note "Edit one variable at a time.". Its `row` slot draws each variable as two large `InputGroupRoot` rows. The Key row joins a Key label addon, an `InputGroupInput` that turns spaces into underscores, and a Remove variable `IconButton` (hidden while only one pair is left). The Value row joins a Value label addon, an `InputGroupInput` (a password field while the value is a secret), a Show value `IconButton` and a Secret `Checkbox` named by a `Tooltip`. Errors render as `FieldError` under the pair. The editor's outlined Add variable button is enabled only when the last pair is filled, and its `info` slot carries the hint that pasting `.env` or JSON contents into an empty key creates one row per variable. Remove is named with the row number ("Remove variable 2").

### H. Paste .env panel — `Button`, `Textarea`, `FieldDescription` (optional)

In the PasteEnv state an outlined Paste .env `Button` (with `aria-expanded`) beside Upload opens an inline panel above the rows: a labelled monospace `Textarea`, a report of what the text holds ("3 variables found.", the lines that are not `KEY=value` and will be skipped, keys repeated in the text, keys already in the list whose value will be replaced), and a primary Add N variables `Button` beside Cancel. Applying merges the pairs into the rows (replace by key, append the rest), closes the panel, announces the count and returns focus to Paste .env. Parsing follows the design sample: blank lines and `#` comments are ignored, `export` is accepted, quotes are removed, the last value of a repeated key wins.

### I. JSON view — `Textarea`, `FieldDescription` (optional)

The JSON view replaces the rows with one `Textarea` labeled Variables JSON over the same entries; a `FieldError` reports a parse error in place. Switching back to Form keeps what was typed.

### J. Scope — `SettingsGroup`, `InputGroupRoot`, `InputGroupAddon`, `MultiSelect`, `Input`, `Switch`, `FieldError` (required)

A `SettingsGroup` titled Scope with one large `InputGroupRoot` per scope type: a label addon, a `MultiSelect` of resources with a search `Input` (Global shows "The entire account. Turns off by itself when another scope is on" instead), and an enable `Switch`. Global turns off when any specific scope turns on. An enabled scope with no resource selected shows a required `FieldError`.

### K. Drawer footer — `PanelFooter`, `Button` (required)

`PanelFooter` holds one primary medium Save `Button` at the end, which submits the form and shows its loading state while saving. Save emits `save` with the pairs. When the save fails (`saveError` set), the drawer stays open with every row kept and a danger `Alert` at the top of `PanelBody` says why ("Variables not saved. You are offline; check your connection and save again."); pressing Save again retries.

### L. List states — `EmptyState`, `Button` (required)

With no variables at all, the card holds a state-first-use `EmptyState` (`No variables yet`) with Create variable and Documentation. When the filter matches nothing, the table's `#empty` slot holds a no-match `EmptyState` (`No matching variables`) with an outlined Clear filters `Button`.

### M. Delete confirmation — `ConfirmDialog`, `Alert`, `Input`, `Button` (required)

The dialog of `edit/edit-delete-dialog`, titled Delete variable: a warning `Alert`, one sentence on the consequence, and an `Input` where the user types the key. The danger Delete variable `Button` stays disabled until the trimmed value equals the key; Cancel closes the dialog.

Every change confirms itself with a success toast: "API_KEY created." or "3 variables created.", "API_KEY updated.", "API_KEY cloned as API_KEY_COPY.", "API_KEY deleted.".

### N. Network list drawer — `Drawer`, `SettingsGroup`, `ToggleGroup`, `Button`, `Textarea`, `FieldDescription`, `AttributeEditor`, `MultiSelect` (optional)

In the NetworkList state the same drawer recipe creates a network list for firewall rules: a General section with a required Name, then an Entries section whose `ToggleGroup` picks the type (IP/CIDR, ASN, Countries). IP/CIDR and ASN entries are an `AttributeEditor` in list mode, large, with an Address (or ASN) column in the code font through `cell-value` and an optional Comment, at most 200 rows; a paste that would pass 200 says how many lines will be skipped and adds only what fits. Paste list opens the panel of H for a whole list, one entry per line with `#` comments: its report counts the entries found, names the lines that are not valid ("Line 4 is not an IPv4 or IPv6 address, or a CIDR range") and the lines already in the list that will be skipped. Add N entries appends every new line as a row, valid or not, and each invalid row shows its own error under the field right away, so the user fixes the list line by line instead of retyping it; typed rows are checked only after Save, and empty rows are ignored once one row is filled. Countries is a required `MultiSelect`. Save validates, moves focus to the first field in error, then closes the drawer and raises a success toast with the entry count.

### O. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

The block takes its variables through props and emits every action; it fetches nothing and saves nothing. `VariablesVariable`, `VariablesScope`, `VariablesDraft`, `VariablesSavePayload` and `VariablesProps` are exported from `edit-variables.vue`, and `sample.ts` holds the sample variables the block renders when `variables` is left out (and never while `loading` is set).

The block is a folder. `edit-variables.vue` is the wiring: the props, the list rows, the row actions and the save. `parts/` holds its regions: `variables-list.vue` (the controls row and the table, on `useCollection`), `variables-drawer-form.vue` (the drawer form with its header, alert, fieldset and Save), `variables-entries.vue` (the Variables section: rows, JSON view and import tools), `variables-scope-group.vue` (the Scope section), `paste-panel.vue` with `env-paste-panel.vue` (the inline paste panel), and `network-list-fields.vue` (the network list sections). `composables/use-variables-form.ts` owns the drawer form state and validation and provides it to the parts, `composables/use-network-list-form.ts` does the same for the network list, and `lib/` holds the pure helpers (the `.env` and JSON parsing, the scopes, the row updates, the network list rules). The PasteEnv and NetworkList variants render the same parts with their own sample text from `sample.ts`. `webkit add` copies every file listed in `block.json` `files`.

| Prop          | Type                  | What it does                                                                                                                 |
| ------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `variables`   | `VariablesVariable[]` | The rows; the filter, the sort and the pages run on them in the browser. Pass `[]` for an account with none.                 |
| `loading`     | `boolean`             | The list is loading or refreshing: Refresh spins and the table shows its loading state.                                      |
| `saving`      | `boolean`             | The save is in flight: the drawer locks and Save spins. When it turns off with no `saveError`, the drawer closes.            |
| `saveError`   | `string`              | Why the save failed, in the danger `Alert` at the top of the drawer; every pair is kept so Save retries.                     |
| `defaultOpen` | `boolean`             | The create drawer starts open.                                                                                               |
| `now`         | `Date`                | A fixed clock the Last modified times read, for a test or a server render. Leave it out in the app; the sample uses its own. |

| Event     | Payload                         | When                                                                                          |
| --------- | ------------------------------- | --------------------------------------------------------------------------------------------- |
| `refresh` | `(event)`                       | Refresh.                                                                                      |
| `save`    | `(event, { variable, values })` | Save passed validation; `variable` is the row being edited, or `null` when creating `values`. |
| `clone`   | `(event, variable)`             | Clone in the row menu; the copy is already in the table below it.                             |
| `delete`  | `(event, variable)`             | The delete dialog was confirmed; the row is already gone from the table.                      |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import EditVariables, { type VariablesSavePayload } from './edit-variables.vue'

  const { data, pending, refresh } = useVariables()
  const { saving, error, run } = useSaveVariables()
  const save = (_event: Event, payload: VariablesSavePayload) => run(payload).then(refresh)
</script>

<template>
  <EditVariables
    :variables="data ?? []"
    :loading="pending"
    :saving="saving"
    :save-error="error ? 'Variables not saved. Check your connection and save again.' : ''"
    @refresh="refresh"
    @save="save"
  />
</template>
```

Then delete the sample variables from `sample.ts` and their import. With no `saving` set during the `save` handler the block treats the save as done at once, which is how it runs on its sample.

## Do

- Validate only after Save is pressed; then flag each empty, malformed or duplicated key under its own pair and move focus to the first field in error.
- Keep secret values masked in the list and in the drawer, and say in the hint that secrets are write-only once saved.
- Let users bring pairs in bulk: Upload, Paste .env, paste into a key, or edit as JSON.
- Before pasted pairs land, say how many were found, which lines are skipped and which keys will be replaced.
- Build the rows on `AttributeEditor` so add, remove, focus and announcements behave the same on every key and value editor.
- Keep the label of each field inside its `InputGroupAddon`, tied to the field by `for`.
- Reset the drawer on open so a closed and reopened drawer never shows stale rows.
- Follow `skills/webkit-form` for required states and `skills/webkit-lists` for the list page.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't show required errors on first render or while the user is still typing the first pair.
- Don't offer Remove on the last remaining pair.
- Don't drop invalid pasted lines silently, and don't add duplicate keys from a paste: replace the existing value and say so.
- Don't reveal a saved secret value in the table, a tooltip or the copy control.
- Don't add a Cancel button beside Save; the drawer's close button and the overlay close it.
- Don't keep Global on together with a specific scope.

## Copy

- **Title and create action:** "Variables" and "Create variable"; the drawer title repeats "Create variable", or reads "Edit variable" from a row.
- **Empty states:** "No variables yet" / "Create a variable to store a value your services read at runtime."; "No matching variables" / "No variable matches these filters."
- **Delete dialog:** title and danger button "Delete variable"; the prompt reads "Type API_BASE_URL to confirm."
- **Field placeholders:** show the format, e.g. "MY_VARIABLE" for the key, "my-variable-value" for the value.
- **Toasts:** "API_KEY created.", "3 variables created.", "API_KEY updated.", "API_KEY cloned as API_KEY_COPY.", "API_KEY deleted."; save failure "Variables not saved. You are offline; check your connection and save again."
- **Errors:** short and specific, e.g. "Key is required.", "Use only uppercase letters, numbers, and underscores.", "Select at least one resource for this scope."
- **Secret control:** "Mark as secret" and "Unmark as secret"; the hint states the rule, e.g. "Secret values are hidden and write-only after saving."
- **Network list:** title "Create network list"; types "IP/CIDR", "ASN", "Countries"; panel label "Paste one address per line"; report "7 entries found. Text after # is kept as the comment.", "Lines 4 and 8 are not an IPv4 or IPv6 address, or a CIDR range; they are added with an error to fix.", "Line 7 is already in the list and will be skipped."; row error "198.51.100.300 is not an IPv4 or IPv6 address, or a CIDR range."; toast "Office and partners created."
- **Paste panel:** label "Paste .env contents"; report "3 variables found. Lines starting with # are ignored.", "Line 5 is not KEY=value with an uppercase key and will be skipped.", "CACHE_TTL is already in the list; its value will be replaced."; buttons "Paste .env", "Add 3 variables", "Cancel".
- **Buttons:** verb first, three words or fewer, e.g. "Upload", "Add variable", "Save".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Every key and value field has a visible `label` in its addon; an invalid field sets `aria-invalid` and points to its `FieldError` through `aria-describedby`.
- Icon-only controls (Remove variable, Show value, Hide value, row actions, toolbar) carry an `aria-label` that matches their `Tooltip`.
- The Secret `Checkbox` and each scope `Switch` have an `aria-label` naming what they toggle, e.g. "Enable Project scope".
- The `ToggleGroup` is labeled "Variables view"; the Upload button opens the system file picker through `useFilePicker`, so no hidden input sits in the tab order.
- Adding a pair moves focus to its new Key field; removing one moves focus to the pair now in its place (or Add variable); both are announced in a polite live region by `AttributeEditor`.
- The paste panel's `Textarea` is described by its report, so skipped lines and replaced keys are read with the field; Paste .env exposes `aria-expanded`, and applying announces how many variables were added.
- The drawer traps focus while open and returns it to Create variable on close.
- `/` focuses the property filter from anywhere on the page, except while typing in a field.
- The table rows are one tab stop: Arrow Up and Arrow Down move between rows, Home and End jump to the first and last, Enter opens the focused variable in the edit drawer as the row menu's Edit does, and Delete or Backspace opens the delete dialog. After a delete, focus lands on the next row.
- `⌘ Enter` (`Ctrl Enter` off Apple) submits the open drawer's form from any field, the same as Save, in the create and edit drawer, the Paste .env drawer and the network list drawer. Save carries `aria-keyshortcuts` and a `Kbd` keycap.

## States

- List: the variables list page with the controls row and table, from `variables` (the sample when left out); the drawer is closed. `loading` spins Refresh and puts the table in its loading state.
- First use: `variables` is `[]`; the card holds the state-first-use `EmptyState` with Create variable.
- No match: the filter matches nothing; the table shows the no-match `EmptyState` with Clear filters.
- Edit: a row's Edit opens the drawer on that variable; Save emits `save` with the variable and replaces it in the list and raises "<KEY> updated.".
- Save failed: `saveError` is set when the save ends; the drawer stays open with its rows and a danger `Alert` above the sections.
- Delete: a row's Delete opens the typed confirmation; confirming emits `delete`, removes the row and raises "<KEY> deleted.".
- Create: `defaultOpen`; the drawer open with one empty pair, the Form view and Global on; errors appear only after Save.
- PasteEnv: Create variable opens the drawer with one pair and the Paste .env panel holding a pasted file with a comment, an `export`, a skipped lowercase line and a repeated key that is already in the list; Add 3 variables merges them.
- NetworkList: Create network list opens the drawer named Office and partners, type IP/CIDR, with the Paste list panel holding nine lines: a comment line, two lines that are not valid addresses and one already pasted above; Add 7 entries appends them as rows, the two invalid ones showing their errors.

## Related

- `create/create-drawer` — the general drawer create pattern this drawer follows.
- `view/view-table` — the controls row and table recipe the list page reuses.
- `edit/edit-rule-builder` — a drawer for ordered conditions and behaviors instead of free pairs.
- `state/state-form-validation` — when and how errors appear after Save.
- `InputGroupRoot` — joins label, field and actions into one row; see `skills/webkit-form`.
- `AttributeEditor` and `TagEditor` — the components behind the rows; `TagEditor` for resource tags.

## Variants

- `List` — primary (the code below)
- `Create` — The list page with the create drawer open on load (`defaultOpen`): one empty Key and Value pair in an `AttributeEditor`, the Form view selected and Global the only scope switched on, all reset each time the drawer opens. Add variable waits for the last pair to be filled; Save flags the empty or malformed fields only after it is pressed, then emits `save` with the pairs and their scope.
- `PasteEnv` — The Variables page header with its drawer already open, so the state shows what it names: Create variable opens the drawer with the Paste .env panel open on a pasted file: the report counts the pairs found, names the line that will be skipped, the key repeated in the text and the key already in the list whose value will be replaced, and Add 3 variables merges them into the rows, announces the count and returns focus to Paste .env.
- `NetworkList` — A Network lists page header with its drawer already open, so the state shows what it names: Create network list opens a drawer with a Name, a type `ToggleGroup` (IP/CIDR, ASN, Countries) and the entries as an `AttributeEditor` of address and comment rows; Paste list holds a pasted list of nine lines whose report counts 7 entries, names the 2 lines that are not valid addresses and the line already in the list, and Add 7 entries appends them as rows where each invalid line shows its own error. Countries is a `MultiSelect`; Save checks every row and raises a success toast.

Each variant is the same screen in another state: `get_block("edit/edit-variables", { variant })`, or the file under `blocks/edit/edit-variables/variants/`.

## Code (`List`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Drawer from '@aziontech/webkit/drawer-root'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import PageHeader from '@aziontech/webkit/page-header'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'

  import { provideVariablesForm, useVariablesForm } from './composables/use-variables-form'
  import {
    cloneKey,
    insertAfter,
    touched,
    updateRow,
    type VariablesRow,
    withType
  } from './lib/variables-rows'
  import { createScopes, scopesFor } from './lib/variables-scope'
  import VariablesDrawerForm from './parts/variables-drawer-form.vue'
  import VariablesEntries from './parts/variables-entries.vue'
  import VariablesList from './parts/variables-list.vue'
  import VariablesScopeGroup from './parts/variables-scope-group.vue'
  import { sampleNow, sampleVariables } from './sample'

  /** Where a variable applies: the whole account, or one environment, project, service or policy. */
  export interface VariablesScope {
    /** global, environment, project, service or policy. */
    type: string
    /** The resource ID; empty for global. */
    id: string
    /** The resource name shown in the Scope column; empty for global. */
    name: string
  }

  /** One saved variable, a row of the table. */
  export interface VariablesVariable {
    /** Stable key, shown in the hidden ID column. */
    id: string
    /** The variable name, uppercase letters, numbers and underscores. */
    key: string
    /** The value; a secret's value is shown masked. */
    value: string
    /** Whether the value is hidden and write-only. */
    secret: boolean
    /** Where the variable applies. */
    scope: VariablesScope[]
    /** Who changed it last. */
    lastEditor: string
    /** That person's avatar URL; empty shows the initials. */
    lastEditorAvatar: string
    /** When it changed last: a Date or an ISO 8601 string. */
    lastModified: Date | string
  }

  /** One pair the drawer saves, with the scope chosen for every pair. */
  export interface VariablesDraft {
    /** The variable name. */
    key: string
    /** The value; empty when an edited secret keeps its saved value. */
    value: string
    /** Whether the value is a secret. */
    secret: boolean
    /** Where the variable applies. */
    scope: VariablesScope[]
  }

  /** What Save sends. */
  export interface VariablesSavePayload {
    /** The variable being edited, or null when the drawer creates new ones. */
    variable: VariablesVariable | null
    /** The pairs in the drawer. */
    values: VariablesDraft[]
  }

  export interface VariablesProps {
    /** The variables to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    variables?: VariablesVariable[]
    /** The list is loading or refreshing: Refresh spins and the table shows its loading state. */
    loading?: boolean
    /** The save is in flight: the drawer locks and Save spins; when it ends with no saveError the drawer closes. */
    saving?: boolean
    /** Why the save failed, shown in the danger alert at the top of the drawer; the pairs are kept. */
    saveError?: string
    /** The create drawer starts open. */
    defaultOpen?: boolean
    /** A fixed moment the Last modified times read (a test, a server render). Left out, the real clock; the sample uses its own. */
    now?: Date
  }

  const props = withDefaults(defineProps<VariablesProps>(), {
    variables: undefined,
    loading: false,
    saving: false,
    saveError: '',
    defaultOpen: false,
    now: undefined
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    save: [event: Event, payload: VariablesSavePayload]
    clone: [event: Event, variable: VariablesVariable]
    delete: [event: Event, variable: VariablesVariable]
  }>()

  const source = computed<VariablesVariable[]>(
    () => props.variables ?? (props.loading ? [] : sampleVariables)
  )
  const clock = computed(
    () => props.now ?? (props.variables || props.loading ? undefined : sampleNow)
  )
  const rows = ref<VariablesRow[]>([])
  watch(
    source,
    (next) => {
      rows.value = next.map(withType)
    },
    { immediate: true }
  )
  const editing = ref<VariablesRow | null>(null)
  const existingKeys = computed(() =>
    rows.value
      .filter((variable) => variable.id !== editing.value?.id)
      .map((variable) => variable.key)
  )

  const refresh = (event: MouseEvent) => {
    if (props.loading) return
    emit('refresh', event)
  }

  let nextVariableId = rows.value.length
  const newVariableId = () => `v-${String((nextVariableId += 1)).padStart(3, '0')}`

  const drawerOpen = ref(props.defaultOpen)
  const openCreate = () => {
    editing.value = null
    drawerOpen.value = true
  }

  const pending = ref<VariablesRow | null>(null)
  const deleteOpen = ref(false)
  const confirmDelete = (event: Event) => {
    if (!pending.value) return
    const key = pending.value.key
    emit('delete', event, pending.value)
    rows.value = rows.value.filter((variable) => variable.id !== pending.value?.id)
    deleteOpen.value = false
    toast.success(`${key} deleted.`)
  }

  const cloneRow = (event: Event, row: VariablesRow) => {
    const copy = touched({ ...row, id: newVariableId(), key: cloneKey(rows.value, row.key) })
    emit('clone', event, row)
    rows.value = insertAfter(rows.value, row.id, copy)
    toast.success(`${row.key} cloned as ${copy.key}.`)
  }

  const onRowAction = (event: Event, value: DropdownMenuItemValue, row: VariablesRow) => {
    if (value === 'edit') {
      editing.value = row
      drawerOpen.value = true
    } else if (value === 'duplicate') {
      cloneRow(event, row)
    } else if (value === 'delete') {
      pending.value = row
      deleteOpen.value = true
    }
  }

  const form = useVariablesForm({
    existingKeys,
    lockedSecret: () => Boolean(editing.value?.secret)
  })
  provideVariablesForm(form)

  const submitting = computed(() => props.saving)
  const saveError = ref(props.defaultOpen ? props.saveError : '')
  const pendingSave = ref<VariablesSavePayload | null>(null)

  const drawerTitle = computed(() => (editing.value ? 'Edit variable' : 'Create variable'))
  const drawerDescription = computed(() => {
    if (!editing.value) return 'Create one or more variables and define where they are available.'
    if (editing.value.secret) return 'Leave the value empty to keep the saved secret.'
    return 'Change the key, value or scope of this variable.'
  })

  watch(drawerOpen, (isOpen) => {
    if (!isOpen) return
    const current = editing.value
    form.reset(
      current
        ? [form.createEntry(current.key, current.secret ? '' : current.value, current.secret)]
        : [form.createEntry()],
      current ? scopesFor(current.scope) : createScopes()
    )
    pendingSave.value = null
    saveError.value = ''
  })

  const finishSave = ({ variable, values }: VariablesSavePayload) => {
    if (variable) {
      rows.value = updateRow(rows.value, variable.id, values)
      toast.success(`${values[0].key} updated.`)
    } else {
      rows.value = [
        ...values.map((value) => touched({ ...value, id: newVariableId() })),
        ...rows.value
      ]
      toast.success(
        values.length === 1 ? `${values[0].key} created.` : `${values.length} variables created.`
      )
    }
    editing.value = null
    drawerOpen.value = false
  }

  watch(
    () => props.saveError,
    (message) => {
      if (drawerOpen.value) saveError.value = message
    }
  )

  watch(
    () => props.saving,
    (now, was) => {
      const payload = pendingSave.value
      if (!was || now || !payload) return
      pendingSave.value = null
      if (props.saveError) {
        saveError.value = props.saveError
        return
      }
      finishSave(payload)
    }
  )

  const submit = async (event: Event, formEl: HTMLFormElement | null) => {
    if (submitting.value || !(await form.check(formEl))) return
    saveError.value = ''
    const payload: VariablesSavePayload = { variable: editing.value, values: form.drafts() }
    emit('save', event, payload)
    await nextTick()
    if (props.saving) {
      pendingSave.value = payload
      return
    }
    if (props.saveError) {
      saveError.value = props.saveError
      return
    }
    finishSave(payload)
  }
</script>

<template>
  <ConfigProvider :now="clock">
    <div class="layout-column layout-boundary flex flex-col">
      <PageHeader
        title="Variables"
        description="Configure variable names, values, and settings for use across your projects."
      >
        <template #actions>
          <Button
            label="Documentation"
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            href="https://example.com/docs/variables"
            target="_blank"
            size="medium"
          />
          <Button
            label="Create variable"
            icon="az az-plus"
            variant="primary"
            size="medium"
            @click="openCreate"
          />
        </template>
      </PageHeader>

      <VariablesList
        :rows="rows"
        :loading="loading"
        @refresh="refresh"
        @create="openCreate"
        @row-action="onRowAction"
      />

      <Drawer
        v-model:open="drawerOpen"
        size="large"
        side="end"
      >
        <VariablesDrawerForm
          :title="drawerTitle"
          :description="drawerDescription"
          shortcut-label="Save variable"
          :active="drawerOpen"
          :submitting="submitting"
          :save-error="saveError"
          @submit="submit"
        >
          <VariablesEntries
            :editing="!!editing"
            :secret-locked="Boolean(editing?.secret)"
          />
          <VariablesScopeGroup />
        </VariablesDrawerForm>
      </Drawer>

      <ConfirmDialog
        v-model:open="deleteOpen"
        title="Delete variable"
        size="medium"
        confirm-label="Delete variable"
        :confirmation-phrase="pending?.key ?? ''"
        @confirm="confirmDelete"
      >
        <div class="flex flex-col gap-(--spacing-md)">
          <Alert
            severity="warning"
            label="Once confirmed, this action can't be reversed."
          />
          <p class="m-0 text-body-sm text-(--text-muted)">
            The selected variable will be deleted, and services in its scope stop reading it on
            their next deployment.
          </p>
        </div>
      </ConfirmDialog>
    </div>
  </ConfigProvider>
</template>
```

## `sample.ts`

```ts
import type { VariablesVariable } from './edit-variables.vue'

export const sampleNow = new Date(Date.UTC(2026, 10, 10, 12))

export const sampleVariables: VariablesVariable[] = [
  {
    id: 'v-001',
    key: 'API_BASE_URL',
    value: 'https://api.example.com',
    secret: false,
    scope: [{ type: 'global', id: '', name: '' }],
    lastEditor: 'Ethan Brooks',
    lastEditorAvatar: '',
    lastModified: '2026-10-10T12:00:00Z'
  },
  {
    id: 'v-002',
    key: 'PAYMENT_SECRET_KEY',
    value: 'sk_example_4f8a2c9e',
    secret: true,
    scope: [{ type: 'environment', id: 'env-production', name: 'Production' }],
    lastEditor: 'Jordan Kim',
    lastEditorAvatar: '',
    lastModified: '2026-09-08T12:00:00Z'
  },
  {
    id: 'v-003',
    key: 'FEATURE_FLAGS',
    value: 'checkout_v2,dark_mode',
    secret: false,
    scope: [{ type: 'service', id: '3344556677', name: 'storefront' }],
    lastEditor: 'Taylor Reed',
    lastEditorAvatar: '',
    lastModified: '2026-09-08T12:00:00Z'
  },
  {
    id: 'v-004',
    key: 'DATABASE_PASSWORD',
    value: 'p4ssw0rd-r0t4t3d',
    secret: true,
    scope: [{ type: 'policy', id: '5540117', name: 'production-policy' }],
    lastEditor: 'John Smith',
    lastEditorAvatar: '',
    lastModified: '2026-09-08T12:00:00Z'
  },
  {
    id: 'v-005',
    key: 'MAX_UPLOAD_MB',
    value: '25',
    secret: false,
    scope: [{ type: 'global', id: '', name: '' }],
    lastEditor: 'Sam Lee',
    lastEditorAvatar: '',
    lastModified: '2026-08-06T12:00:00Z'
  }
]

export const sampleEnv = [
  '# Copied from the project .env',
  'API_BASE_URL=https://api.example.com',
  'CACHE_TTL=300',
  'export FEATURE_FLAGS="search,checkout"',
  'api_token=example',
  'CACHE_TTL=600'
].join('\n')

export const sampleNetworkList = [
  '# Office and partner ranges',
  '203.0.113.0/24  # head office',
  '198.51.100.17',
  '198.51.100.300',
  '2001:db8::/32  # partner VPN',
  '192.0.2.44',
  '198.51.100.17',
  '192.0.2.0/33',
  '192.0.2.128/25  # staging'
].join('\n')
```

## `lib/paste-report.ts`

```ts
import { nextTick, type Ref } from 'vue'

export const lineList = (lines: number[]): string =>
  lines.length === 1
    ? `Line ${lines[0]} is`
    : `Lines ${lines.slice(0, -1).join(', ')} and ${lines.at(-1)} are`

export const closePastePanel = async (
  open: Ref<boolean>,
  toggle: Ref<{ $el?: HTMLElement } | null>
): Promise<void> => {
  open.value = false
  await nextTick()
  toggle.value?.$el?.focus()
}
```

## `lib/variables-format.ts`

```ts
/** A key and value read from a file, a paste or the JSON view. */
export type VariablesPair = { key: string; value: string }

export const formatKey = (value: string): string => value.replace(/\s/g, '_').toUpperCase()

const unquote = (value: string) => {
  const quote = value[0]
  if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
    return value.slice(1, -1)
  }
  return value
}

export const parseEnvFile = (
  content: string | undefined
): { parsed: VariablesPair[]; invalidLines: number[] } => {
  const parsed: VariablesPair[] = []
  const invalidLines: number[] = []
  String(content ?? '')
    .split(/\r?\n/)
    .forEach((line, index) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return
      const declaration = trimmed.startsWith('export ') ? trimmed.slice(7).trim() : trimmed
      const match = declaration.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/)
      if (!match) {
        invalidLines.push(index + 1)
        return
      }
      parsed.push({ key: match[1], value: unquote(match[2]) })
    })
  return { parsed, invalidLines }
}

const jsonValue = (value: unknown): string => {
  if (typeof value === 'string') return value
  if (value == null) return ''
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}

export const parseJsonObject = (content: string): VariablesPair[] | null => {
  const parsed: unknown = JSON.parse(content)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
  return Object.entries(parsed)
    .filter(([key]) => key.trim())
    .map(([key, value]) => ({ key: formatKey(key), value: jsonValue(value) }))
}

export const parsePasted = (content: string | undefined): VariablesPair[] | null => {
  const text = String(content ?? '').trim()
  if (!text) return null
  if (text.startsWith('{')) {
    try {
      const pairs = parseJsonObject(text)
      return pairs?.length ? pairs : null
    } catch {
      return null
    }
  }
  const { parsed, invalidLines } = parseEnvFile(text)
  return invalidLines.length || !parsed.length ? null : parsed
}

export const envPasteReport = (
  text: string,
  listedKeys: string[]
): { pairs: VariablesPair[]; invalidLines: number[]; repeated: string[]; replaced: string[] } => {
  const { parsed, invalidLines } = parseEnvFile(text)
  const byKey = new Map(parsed.map((pair) => [pair.key, pair]))
  const repeated = [...new Set(parsed.map((pair) => pair.key))].filter(
    (key) => parsed.filter((pair) => pair.key === key).length > 1
  )
  const listed = new Set(listedKeys)
  const replaced = [...byKey.keys()].filter((key) => listed.has(key))
  return { pairs: [...byKey.values()], invalidLines, repeated, replaced }
}

export const plural = (count: number, one: string, many: string): string =>
  `${count} ${count === 1 ? one : many}`
```

## `lib/variables-rows.ts`

```ts
import type { VariablesDraft, VariablesVariable } from '../edit-variables.vue'

/** A table row: the variable with its Plain or Secret type for the filter. */
export type VariablesRow = VariablesVariable & { type: string }

export const SECRET_MASK = '••••••••'

export const withType = (variable: VariablesVariable): VariablesRow => ({
  ...variable,
  type: variable.secret ? 'Secret' : 'Plain'
})

export const touched = (
  variable: Omit<VariablesVariable, 'lastEditor' | 'lastEditorAvatar' | 'lastModified'>
): VariablesRow =>
  withType({
    ...variable,
    lastEditor: 'Jane Doe',
    lastEditorAvatar: '',
    lastModified: new Date()
  })

export const updateRow = (
  rows: VariablesRow[],
  id: string,
  [changed]: VariablesDraft[]
): VariablesRow[] =>
  rows.map((variable) =>
    variable.id === id
      ? touched({
          ...variable,
          ...changed,
          value: changed.secret && !changed.value ? variable.value : changed.value
        })
      : variable
  )

export const cloneKey = (rows: VariablesRow[], key: string): string => {
  const taken = new Set(rows.map((variable) => variable.key))
  let candidate = `${key}_COPY`
  let n = 1
  while (taken.has(candidate)) candidate = `${key}_COPY_${(n += 1)}`
  return candidate
}

export const insertAfter = (
  rows: VariablesRow[],
  id: string,
  copy: VariablesRow
): VariablesRow[] => {
  const index = rows.findIndex((variable) => variable.id === id)
  return [...rows.slice(0, index + 1), copy, ...rows.slice(index + 1)]
}
```

## `lib/variables-scope.ts`

```ts
import type { VariablesScope } from '../edit-variables.vue'

/** One resource a scope can select. */
export type VariablesScopeOption = { value: string; label: string }

/** One scope row of the drawer. */
export type VariablesScopeState = {
  type: string
  label: string
  plural: string
  placeholder: string
  enabled: boolean
  ids: string[]
  query: string
  options: VariablesScopeOption[]
}

const SCOPE_TYPES = [
  { type: 'global', label: 'Global', plural: '' },
  { type: 'environment', label: 'Environment', plural: 'environments' },
  { type: 'project', label: 'Project', plural: 'projects' },
  { type: 'service', label: 'Service', plural: 'services' },
  { type: 'policy', label: 'Policy', plural: 'policies' }
]

const SCOPE_OPTIONS: Record<string, VariablesScopeOption[]> = {
  environment: [
    { value: 'env-production', label: 'Production' },
    { value: 'env-preview', label: 'Preview' },
    { value: 'env-stage', label: 'Stage' }
  ],
  project: [
    { value: '1020655', label: 'web-app' },
    { value: '1020828', label: 'docs-site' },
    { value: '1021001', label: 'api-gateway' },
    { value: '1021174', label: 'mobile-backend' }
  ],
  service: [
    { value: '4410203040', label: 'checkout' },
    { value: '3344556677', label: 'storefront' },
    { value: '8899001122', label: 'search' },
    { value: '9988776655', label: 'marketing-site' }
  ],
  policy: [
    { value: '5540117', label: 'production-policy' },
    { value: '5540118', label: 'staging-policy' },
    { value: '5540119', label: 'api-hardening' },
    { value: '5540120', label: 'checkout-shield' }
  ]
}

export const SCOPE_HINT =
  'Global covers the entire account and turns off when you enable a specific scope. Each scope starts with every resource selected. Scope cannot be changed after the variable is ' +
  'created.'

export const createScopes = (): VariablesScopeState[] =>
  SCOPE_TYPES.map((scope) => ({
    ...scope,
    placeholder: scope.plural ? `Select ${scope.plural}` : '',
    enabled: scope.type === 'global',
    ids: [],
    query: '',
    options: SCOPE_OPTIONS[scope.type] ?? []
  }))

export const scopesFor = (scope: VariablesScope[]): VariablesScopeState[] =>
  createScopes().map((item) => {
    const ids = (scope ?? []).filter((entry) => entry.type === item.type).map((entry) => entry.id)
    return item.type === 'global'
      ? { ...item, enabled: ids.length > 0 }
      : { ...item, enabled: ids.length > 0, ids }
  })

export const setScopeEnabled = (
  scopes: VariablesScopeState[],
  scope: VariablesScopeState,
  enabled: boolean
): void => {
  if (scope.type === 'global') return
  scope.enabled = enabled
  scope.ids = enabled ? scope.options.map((option) => option.value) : []
  scope.query = ''
  scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
}

export const scopeMissing = (scope: VariablesScopeState): boolean =>
  scope.enabled && scope.type !== 'global' && scope.ids.length === 0

export const scopeDisplay =
  (scope: VariablesScopeState) =>
  (ids: unknown[]): string => {
    if (!ids?.length) return ''
    if (ids.length > 1) return `Selected ${ids.length} ${scope.plural}`
    return scope.options.find((option) => option.value === ids[0])?.label ?? String(ids[0])
  }

export const visibleScopeOptions = (scope: VariablesScopeState): VariablesScopeOption[] => {
  const query = scope.query.trim().toLowerCase()
  if (!query) return scope.options
  return scope.options.filter((option) => option.label.toLowerCase().includes(query))
}

export const scopePayload = (scopes: VariablesScopeState[]): VariablesScope[] =>
  scopes.flatMap((scope) => {
    if (!scope.enabled) return []
    if (scope.type === 'global') return [{ type: 'global', id: '', name: '' }]
    return scope.ids.map((id) => ({
      type: scope.type,
      id,
      name: scope.options.find((option) => option.value === id)?.label ?? id
    }))
  })

const scopeDetail = (type: string, names: string[], pluralName: string) => {
  if (type === 'global') return ''
  return names.length === 1 ? names[0] : `${names.length} ${pluralName}`
}

export const scopeSummary = (
  scope: VariablesScope[] | undefined
): { label: string; detail: string }[] =>
  SCOPE_TYPES.map((entry) => ({
    ...entry,
    names: (scope ?? []).filter((item) => item.type === entry.type).map((item) => item.name)
  }))
    .filter((entry) => entry.names.length > 0)
    .map((group) => ({
      label: group.label,
      detail: scopeDetail(group.type, group.names, group.plural)
    }))
```

## `lib/network-list.ts`

```ts
/** One row of a network list: the address or ASN, a comment, and whether it came from a paste. */
export type NetworkListEntry = { value: string; note: string; pasted: boolean }

/** The words of an IP/CIDR or ASN list. */
export type NetworkListCopy = {
  column: string
  placeholder: string
  noun: string
  rule: string
  hint: string
}

export const NETWORK_LIST_TYPES = [
  { label: 'IP/CIDR', value: 'ip' },
  { label: 'ASN', value: 'asn' },
  { label: 'Countries', value: 'countries' }
]

export const NETWORK_LIST_COPY: Record<string, NetworkListCopy | undefined> = {
  ip: {
    column: 'Address',
    placeholder: '203.0.113.0/24',
    noun: 'address',
    rule: 'an IPv4 or IPv6 address, or a CIDR range',
    hint: 'One IPv4 or IPv6 address or CIDR range per row, with an optional comment.'
  },
  asn: {
    column: 'ASN',
    placeholder: 'AS64500',
    noun: 'ASN',
    rule: 'a number from 1 to 4294967295, with or without AS',
    hint: 'One autonomous system number per row, written 64500 or AS64500.'
  }
}

export const COUNTRIES = [
  { value: 'AR', label: 'Argentina' },
  { value: 'BR', label: 'Brazil' },
  { value: 'CL', label: 'Chile' },
  { value: 'DE', label: 'Germany' },
  { value: 'IN', label: 'India' },
  { value: 'JP', label: 'Japan' },
  { value: 'MX', label: 'Mexico' },
  { value: 'PT', label: 'Portugal' },
  { value: 'US', label: 'United States' }
]

export const NETWORK_LIST_LIMIT = 200

const isIPv4 = (value: string) => {
  const parts = value.split('.')
  return parts.length === 4 && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255)
}

const isIPv6 = (value: string) =>
  /^[0-9a-f:]+$/i.test(value) &&
  value.includes(':') &&
  (value.match(/::/g) ?? []).length <= 1 &&
  value.split(':').every((group) => group.length <= 4)

const validIp = (raw: string) => {
  const [address, prefix, extra] = raw.split('/')
  if (extra !== undefined) return false
  const v4 = isIPv4(address)
  if (!v4 && !isIPv6(address)) return false
  if (prefix === undefined) return true
  if (!/^\d{1,3}$/.test(prefix)) return false
  return Number(prefix) <= (v4 ? 32 : 128)
}

const validAsn = (raw: string) => {
  const digits = raw.replace(/^AS/i, '')
  return /^\d{1,10}$/.test(digits) && Number(digits) >= 1 && Number(digits) <= 4294967295
}

export const entryError = (kind: string, value: string): string => {
  const text = value.trim()
  if (!text) return `Enter ${kind === 'ip' ? 'an address' : 'an ASN'}.`
  const ok = kind === 'ip' ? validIp(text) : validAsn(text)
  return ok ? '' : `${text} is not ${NETWORK_LIST_COPY[kind]?.rule}.`
}

const normalize = (kind: string, value: string) =>
  kind === 'asn' ? value.trim().replace(/^AS/i, '') : value.trim().toLowerCase()

export const createListEntry = (value = '', note = '', pasted = false): NetworkListEntry => ({
  value,
  note,
  pasted
})

export const listPasteReport = (
  text: string,
  kind: string,
  rows: NetworkListEntry[]
): { lines: NetworkListEntry[]; duplicates: number[]; invalid: number[] } => {
  const seen = new Set(
    rows.filter((entry) => entry.value.trim()).map((entry) => normalize(kind, entry.value))
  )
  const lines: NetworkListEntry[] = []
  const duplicates: number[] = []
  const invalid: number[] = []
  text.split(/\r?\n/).forEach((line, index) => {
    const [body, ...comment] = line.split('#')
    const value = body.trim()
    if (!value) return
    const key = normalize(kind, value)
    if (seen.has(key)) {
      duplicates.push(index + 1)
      return
    }
    seen.add(key)
    if (entryError(kind, value)) invalid.push(index + 1)
    lines.push(createListEntry(value, comment.join('#').trim(), true))
  })
  return { lines, duplicates, invalid }
}
```

## `composables/use-variables-form.ts`

```ts
import { useFilePicker } from '@aziontech/webkit/use-file-picker'
import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  type MaybeRefOrGetter,
  nextTick,
  provide,
  reactive,
  type Ref,
  ref,
  toValue,
  useId,
  watch
} from 'vue'

import type { VariablesDraft } from '../edit-variables.vue'
import {
  formatKey,
  parseEnvFile,
  parseJsonObject,
  parsePasted,
  type VariablesPair
} from '../lib/variables-format'
import {
  createScopes,
  scopeMissing,
  scopePayload,
  type VariablesScopeState
} from '../lib/variables-scope'

const writable = <T>(source: Ref<T>) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

/** One key and value row of the drawer. */
export type VariablesEntry = {
  key: string
  id: number
  value: string
  secret: boolean
  visible: boolean
}

/** Why a key or value is not accepted. */
export type VariablesEntryProblem = { type: 'helper' | 'invalid' | 'required'; message: string }

export interface UseVariablesFormOptions {
  /** Keys already saved, which a new pair may not reuse. */
  existingKeys: MaybeRefOrGetter<string[]>
  /** True while the edited variable is a saved secret: its value may stay empty. */
  lockedSecret?: MaybeRefOrGetter<boolean>
}

export interface UseVariablesFormReturn {
  /** The id prefix of every field in the drawer. */
  formId: string
  /** The rows in the drawer. */
  entries: Ref<VariablesEntry[]>
  /** Form or JSON. */
  view: Ref<string>
  /** The text of the JSON view. */
  jsonText: Ref<string>
  /** Why the JSON view cannot be read; empty when it can. */
  jsonError: Ref<string>
  /** True once Save was pressed. */
  submitted: Ref<boolean>
  /** The rows that hold a key or a value. */
  filledEntries: ComputedRef<VariablesEntry[]>
  /** True when no row holds a key or a value. */
  noVariables: ComputedRef<boolean>
  /** True when the last row is filled, so another one may be added. */
  canAdd: ComputedRef<boolean>
  /** The scope rows. */
  scopes: VariablesScopeState[]
  /** A new row. */
  createEntry: (key?: string, value?: string, secret?: boolean) => VariablesEntry
  /** The key problem of a row, shown once Save was pressed. */
  keyError: (entry: VariablesEntry) => VariablesEntryProblem | null
  /** The value problem of a row, shown once Save was pressed. */
  valueError: (entry: VariablesEntry) => VariablesEntryProblem | null
  /** True when an enabled scope has no resource, once Save was pressed. */
  scopeError: (scope: VariablesScopeState) => boolean
  /** Writes a key as the variable format: spaces to underscores, uppercase. */
  setKey: (entry: VariablesEntry, value: string) => void
  /** Turns pasted .env or JSON contents in an empty key into one row per variable. */
  pasteIntoKey: (event: ClipboardEvent, index: number) => void
  /** Reads a .env file into rows. */
  pickEnvFile: () => Promise<void>
  /** Replaces the values of listed keys and appends the other pairs. */
  mergePairs: (pairs: VariablesPair[]) => void
  /** Puts the form back to its first state with these rows and scopes. */
  reset: (seed: VariablesEntry[], nextScopes?: VariablesScopeState[]) => void
  /** The filled rows with the chosen scope, as Save sends them. */
  drafts: () => VariablesDraft[]
  /** Validates after Save; focuses the first field in error and resolves false when invalid. */
  check: (form: HTMLFormElement | null) => Promise<boolean>
}

const INVALID_FIELD =
  ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'

const isEmptyEntry = (entry: VariablesEntry) => !entry.key.trim() && !entry.value.trim()

const countKeys = (entries: VariablesEntry[]) =>
  entries.reduce((counts, entry) => {
    const key = entry.key.trim()
    counts.set(key, (counts.get(key) ?? 0) + 1)
    return counts
  }, new Map<string, number>())

function useEntryChecks(
  entries: Ref<VariablesEntry[]>,
  submitted: Ref<boolean>,
  options: UseVariablesFormOptions
) {
  const filledEntries = computed(() => entries.value.filter((entry) => !isEmptyEntry(entry)))
  const keyCounts = computed(() => countKeys(filledEntries.value))
  const duplicatedKeys = computed(() =>
    [...keyCounts.value].filter(([, count]) => count > 1).map(([key]) => key)
  )
  const keyError = (entry: VariablesEntry): VariablesEntryProblem | null => {
    if (!submitted.value || isEmptyEntry(entry)) return null
    const key = entry.key.trim()
    if (!key) return { type: 'required', message: 'Key is required.' }
    if (!/^[A-Z0-9_]+$/.test(key))
      return { type: 'invalid', message: 'Use only uppercase letters, numbers, and underscores.' }
    if ((keyCounts.value.get(key) ?? 0) > 1)
      return { type: 'invalid', message: `Duplicated key: ${duplicatedKeys.value.join(', ')}` }
    if (toValue(options.existingKeys).includes(key))
      return { type: 'invalid', message: `${key} already exists in this list.` }
    return null
  }
  const keepsSecret = (entry: VariablesEntry) =>
    Boolean(toValue(options.lockedSecret) && entry.secret && entry.key.trim())
  const valueError = (entry: VariablesEntry): VariablesEntryProblem | null => {
    if (!submitted.value || isEmptyEntry(entry) || entry.value.trim() || keepsSecret(entry))
      return null
    return { type: 'required', message: 'Value is required.' }
  }
  const noVariables = computed(() => filledEntries.value.length === 0)
  const isValid = computed(
    () =>
      !noVariables.value &&
      filledEntries.value.every((entry) => !keyError(entry) && !valueError(entry))
  )
  const canAdd = computed(() => {
    const last = entries.value.at(-1)
    return Boolean(last?.key.trim() && last?.value.trim())
  })
  return { filledEntries, keyError, valueError, noVariables, isValid, canAdd }
}

function useJsonView(
  entries: Ref<VariablesEntry[]>,
  filledEntries: ComputedRef<VariablesEntry[]>,
  toEntries: (pairs: VariablesPair[], secrets?: Set<string>) => VariablesEntry[],
  createEntry: () => VariablesEntry
) {
  const view = ref('Form')
  const jsonText = ref('{}')
  const jsonError = ref('')
  watch(view, (next) => {
    if (next === 'JSON') {
      jsonError.value = ''
      jsonText.value = JSON.stringify(
        Object.fromEntries(filledEntries.value.map((entry) => [entry.key.trim(), entry.value])),
        null,
        2
      )
      return
    }
    if (jsonError.value) return
    const secrets = new Set(
      filledEntries.value.filter((entry) => entry.secret).map((entry) => entry.key.trim())
    )
    const pairs = parseJsonObject(jsonText.value) ?? []
    entries.value = pairs.length ? toEntries(pairs, secrets) : [createEntry()]
  })
  watch(jsonText, (text) => {
    if (view.value !== 'JSON') return
    try {
      jsonError.value = parseJsonObject(text)
        ? ''
        : 'Variables must be a JSON object with key/value pairs.'
    } catch {
      jsonError.value = 'Variables must be valid JSON.'
    }
  })
  return { view, jsonText, jsonError }
}

function useEntryImport(
  entries: Ref<VariablesEntry[]>,
  filledEntries: ComputedRef<VariablesEntry[]>,
  toEntries: (pairs: VariablesPair[]) => VariablesEntry[],
  createEntry: () => VariablesEntry
) {
  const envFilePicker = useFilePicker({ accept: '.env,.txt,text/plain' })
  const pasteIntoKey = (event: ClipboardEvent, index: number) => {
    if (!isEmptyEntry(entries.value[index])) return
    const pairs = parsePasted(event.clipboardData?.getData('text/plain'))
    if (!pairs) return
    event.preventDefault()
    entries.value.splice(index, 1, ...toEntries(pairs))
  }
  const pickEnvFile = async (view: Ref<string>) => {
    const [file] = await envFilePicker.open()
    if (!file) return
    const { parsed, invalidLines } = parseEnvFile(await file.text())
    if (!parsed.length && invalidLines.length) return
    view.value = 'Form'
    await nextTick()
    entries.value = [...filledEntries.value, ...toEntries(parsed)]
    if (!entries.value.length) entries.value = [createEntry()]
  }
  const mergePairs = (pairs: VariablesPair[]) => {
    const merged = filledEntries.value.map((entry) => {
      const pasted = pairs.find((pair) => pair.key === entry.key.trim())
      return pasted ? { ...entry, value: pasted.value } : entry
    })
    const known = new Set(merged.map((entry) => entry.key.trim()))
    entries.value = [...merged, ...toEntries(pairs.filter((pair) => !known.has(pair.key)))]
  }
  return { pasteIntoKey, pickEnvFile, mergePairs }
}

function useFormSubmit(
  view: Ref<string>,
  jsonError: Ref<string>,
  submitted: Ref<boolean>,
  valid: () => boolean
) {
  return async (form: HTMLFormElement | null) => {
    if (view.value === 'JSON') {
      if (jsonError.value) return false
      view.value = 'Form'
      await nextTick()
    }
    submitted.value = true
    if (valid()) return true
    await nextTick()
    form?.querySelector<HTMLElement>(INVALID_FIELD)?.focus()
    return false
  }
}

const toDrafts = (entries: VariablesEntry[], scopes: VariablesScopeState[]): VariablesDraft[] => {
  const scope = scopePayload(scopes)
  return entries.map((entry) => ({
    key: entry.key.trim(),
    value: entry.value,
    secret: entry.secret,
    scope
  }))
}

export function useVariablesForm(options: UseVariablesFormOptions): UseVariablesFormReturn {
  const formId = useId()
  let nextEntryId = 0
  const createEntry = (key = '', value = '', secret = false): VariablesEntry => ({
    key,
    id: (nextEntryId += 1),
    value,
    secret,
    visible: false
  })
  const toEntries = (pairs: VariablesPair[], secrets = new Set<string>()) =>
    pairs.map((pair) => createEntry(pair.key, pair.value, secrets.has(pair.key)))
  const submitted = ref(false)
  const entries = ref<VariablesEntry[]>([createEntry()])
  const checks = useEntryChecks(entries, submitted, options)
  const json = useJsonView(entries, checks.filledEntries, toEntries, createEntry)
  const imports = useEntryImport(entries, checks.filledEntries, toEntries, createEntry)
  const scopes = reactive(createScopes())
  const check = useFormSubmit(
    json.view,
    json.jsonError,
    submitted,
    () => checks.isValid.value && !scopes.some(scopeMissing)
  )
  const reset = (seed: VariablesEntry[], nextScopes = createScopes()) => {
    entries.value = seed
    json.view.value = 'Form'
    json.jsonText.value = '{}'
    json.jsonError.value = ''
    submitted.value = false
    Object.assign(scopes, nextScopes)
  }
  return {
    formId,
    entries: writable(entries),
    submitted: writable(submitted),
    scopes,
    createEntry,
    setKey: (entry, value) => {
      entry.key = formatKey(value)
    },
    scopeError: (scope) => submitted.value && scopeMissing(scope),
    pasteIntoKey: imports.pasteIntoKey,
    pickEnvFile: () => imports.pickEnvFile(json.view),
    mergePairs: imports.mergePairs,
    reset,
    drafts: () => toDrafts(checks.filledEntries.value, scopes),
    check,
    ...json,
    ...checks
  }
}

const VariablesFormInjectionKey: InjectionKey<UseVariablesFormReturn> = Symbol('VariablesForm')

export function provideVariablesForm(form: UseVariablesFormReturn): void {
  provide(VariablesFormInjectionKey, form)
}

export function useVariablesFormContext(): UseVariablesFormReturn {
  const form = inject(VariablesFormInjectionKey, null)
  if (!form) throw new Error('useVariablesFormContext must be used within the variables drawer.')
  return form
}
```

## `composables/use-network-list-form.ts`

```ts
import {
  computed,
  type ComputedRef,
  inject,
  type InjectionKey,
  nextTick,
  provide,
  type Ref,
  ref,
  useId,
  type WritableComputedRef
} from 'vue'

import {
  COUNTRIES,
  createListEntry,
  entryError,
  listPasteReport,
  NETWORK_LIST_COPY,
  NETWORK_LIST_LIMIT,
  type NetworkListCopy,
  type NetworkListEntry
} from '../lib/network-list'
import { closePastePanel } from '../lib/paste-report'
import { plural } from '../lib/variables-format'

const writable = <T>(source: Ref<T>) =>
  computed({
    get: () => source.value,
    set: (value: T) => {
      source.value = value
    }
  })

/** One column of the entries editor. */
export type NetworkListColumn = {
  key: string
  label: string
  placeholder: string
  required?: boolean
}

export interface UseNetworkListFormReturn {
  /** The list name. */
  name: Ref<string>
  /** ip, asn or countries. */
  type: Ref<string>
  /** The countries picked when the type is countries. */
  countries: Ref<string[]>
  /** The rows of the current type. */
  rows: WritableComputedRef<NetworkListEntry[]>
  /** The words of the current type; undefined for countries. */
  copy: ComputedRef<NetworkListCopy | undefined>
  /** The columns of the entries editor. */
  columns: ComputedRef<NetworkListColumn[]>
  /** The error of each row, shown after Save or right away for a pasted row. */
  rowErrors: ComputedRef<Record<string, string>[]>
  /** True once Save was pressed with no name. */
  nameMissing: ComputedRef<boolean>
  /** True once Save was pressed on a countries list with none picked. */
  countriesMissing: ComputedRef<boolean>
  /** The id of the paste field. */
  pasteId: string
  /** The paste panel is open. */
  pasteOpen: Ref<boolean>
  /** The pasted text. */
  pasteText: Ref<string>
  /** What the last paste added, for the live region. */
  status: Ref<string>
  /** The Paste list button, which gets the focus back when the panel closes. */
  pasteToggleEl: Ref<{ $el?: HTMLElement } | null>
  /** What the pasted text holds. */
  pasteReport: ComputedRef<{ lines: NetworkListEntry[]; duplicates: number[]; invalid: number[] }>
  /** How many pasted lines do not fit under the limit. */
  pasteOverflow: ComputedRef<number>
  /** Closes the paste panel. */
  cancelPaste: () => Promise<void>
  /** Appends the pasted lines that fit as rows. */
  applyPaste: () => Promise<void>
  /** The text of the countries trigger. */
  countryDisplay: (ids: unknown[]) => string
  /** Puts the form back to its first state with this name and pasted text. */
  reset: (seedName: string, seedPaste: string) => void
  /** Validates after Save; focuses the first field in error and resolves false when invalid. */
  check: (form: HTMLFormElement | null) => Promise<boolean>
  /** How many entries or countries Save keeps. */
  count: () => number
}

const INVALID_FIELD =
  ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'

const emptyEntries = () => ({ ip: [createListEntry()], asn: [createListEntry()] })

function useListRows(type: Ref<string>, submitted: Ref<boolean>) {
  const entries = ref<Record<string, NetworkListEntry[]>>(emptyEntries())
  const rows = computed({
    get: () => entries.value[type.value] ?? [],
    set: (next: NetworkListEntry[]) => {
      entries.value = { ...entries.value, [type.value]: next }
    }
  })
  const copy = computed(() => NETWORK_LIST_COPY[type.value])
  const columns = computed<NetworkListColumn[]>(() =>
    copy.value
      ? [
          {
            key: 'value',
            label: copy.value.column,
            placeholder: copy.value.placeholder,
            required: true
          },
          { key: 'note', label: 'Comment', placeholder: 'Optional' }
        ]
      : []
  )
  const filled = computed(() => rows.value.filter((entry) => entry.value.trim()))
  const checked = (entry: NetworkListEntry) =>
    Boolean(entry.value.trim() || entry.note.trim() || !filled.value.length)
  const rowErrors = computed(() =>
    rows.value.map((entry): Record<string, string> => {
      const shown = submitted.value ? checked(entry) : entry.pasted && entry.value.trim()
      const message = shown ? entryError(type.value, entry.value) : ''
      return message ? { value: message } : {}
    })
  )
  const rowsValid = () =>
    filled.value.length > 0 &&
    rows.value.filter(checked).every((entry) => !entryError(type.value, entry.value))
  const clear = () => {
    entries.value = emptyEntries()
  }
  return { rows, copy, columns, filled, rowErrors, rowsValid, clear }
}

function useListPaste(type: Ref<string>, rows: WritableComputedRef<NetworkListEntry[]>) {
  const pasteId = useId()
  const pasteOpen = ref(false)
  const pasteText = ref('')
  const status = ref('')
  const pasteToggleEl = ref<{ $el?: HTMLElement } | null>(null)
  const pasteReport = computed(() => listPasteReport(pasteText.value, type.value, rows.value))
  const keptRows = () => rows.value.filter((entry) => entry.value.trim() || entry.note.trim())
  const pasteOverflow = computed(() =>
    Math.max(0, pasteReport.value.lines.length - (NETWORK_LIST_LIMIT - keptRows().length))
  )
  const cancelPaste = () => closePastePanel(pasteOpen, pasteToggleEl)
  const applyPaste = async () => {
    const { invalid } = pasteReport.value
    const kept = keptRows()
    const lines = pasteReport.value.lines.slice(0, Math.max(0, NETWORK_LIST_LIMIT - kept.length))
    rows.value = [...kept, ...lines]
    const fix = invalid.length
      ? ` ${invalid.length} ${invalid.length === 1 ? 'needs' : 'need'} a fix.`
      : ''
    status.value = `${plural(lines.length, 'entry', 'entries')} added from the pasted list.${fix}`
    pasteText.value = ''
    await cancelPaste()
  }
  return {
    pasteId,
    pasteOpen,
    pasteText,
    status,
    pasteToggleEl,
    pasteReport,
    pasteOverflow,
    cancelPaste,
    applyPaste
  }
}

const countryDisplay = (ids: unknown[]): string => {
  if (!ids?.length) return ''
  if (ids.length > 1) return `${ids.length} countries`
  return COUNTRIES.find((option) => option.value === ids[0])?.label ?? String(ids[0])
}

export function useNetworkListForm(): UseNetworkListFormReturn {
  const name = ref('')
  const type = ref('ip')
  const countries = ref<string[]>([])
  const submitted = ref(false)
  const list = useListRows(type, submitted)
  const paste = useListPaste(type, list.rows)
  const nameMissing = computed(() => submitted.value && !name.value.trim())
  const countriesMissing = computed(
    () => submitted.value && type.value === 'countries' && !countries.value.length
  )
  const isValid = () => {
    if (!name.value.trim()) return false
    if (type.value === 'countries') return countries.value.length > 0
    return list.rowsValid()
  }
  const reset = (seedName: string, seedPaste: string) => {
    name.value = seedName
    type.value = 'ip'
    countries.value = []
    list.clear()
    submitted.value = false
    paste.status.value = ''
    paste.pasteOpen.value = true
    paste.pasteText.value = seedPaste
  }
  const check = async (form: HTMLFormElement | null) => {
    submitted.value = true
    if (isValid()) return true
    await nextTick()
    form?.querySelector<HTMLElement>(INVALID_FIELD)?.focus()
    return false
  }
  const count = () =>
    type.value === 'countries' ? countries.value.length : list.filled.value.length
  const { rows, copy, columns, rowErrors } = list
  return {
    name: writable(name),
    type: writable(type),
    countries: writable(countries),
    rows,
    copy,
    columns,
    rowErrors,
    nameMissing,
    countriesMissing,
    countryDisplay,
    reset,
    check,
    count,
    ...paste
  }
}

const NetworkListFormInjectionKey: InjectionKey<UseNetworkListFormReturn> =
  Symbol('NetworkListForm')

export function provideNetworkListForm(form: UseNetworkListFormReturn): void {
  provide(NetworkListFormInjectionKey, form)
}

export function useNetworkListFormContext(): UseNetworkListFormReturn {
  const form = inject(NetworkListFormInjectionKey, null)
  if (!form)
    throw new Error('useNetworkListFormContext must be used within the network list drawer.')
  return form
}
```

## `parts/variables-list.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import type { TableColumn, TableExposed } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DataTablePagination from '@aziontech/webkit/data-table-pagination'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  import { SECRET_MASK, type VariablesRow } from '../lib/variables-rows'
  import { scopeSummary } from '../lib/variables-scope'

  export interface VariablesListProps {
    /** The rows to list; filtered, sorted and paged in the browser. */
    rows: VariablesRow[]
    /** The list is loading or refreshing. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<VariablesListProps>(), { loading: false })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    create: []
    'row-action': [event: Event, value: DropdownMenuItemValue, row: VariablesRow]
  }>()

  const columns: TableColumn[] = [
    {
      accessorKey: 'key',
      header: 'Key',
      sortable: true,
      principal: true,
      hideable: false,
      frozen: 'start'
    },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'scope', header: 'Scope', minWidth: 80 },
    { accessorKey: 'lastModified', header: 'Last modified', sortable: true, minWidth: 80 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties = computed(() => [
    { key: 'key', label: 'Key' },
    {
      key: 'lastEditor',
      label: 'Author',
      options: [...new Set(props.rows.map((variable) => variable.lastEditor))].map((value) => ({
        value
      }))
    },
    { key: 'type', label: 'Type', options: [{ value: 'Plain' }, { value: 'Secret' }] }
  ])

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: () => props.rows,
    columns,
    filtering: { fields: ['key', 'id', 'lastEditor', 'type'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'variables-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

  const tableEl = ref<TableExposed<VariablesRow> | null>(null)
  const exportCsv = () => tableEl.value?.exportCsv({ filename: 'variables.csv' })

  const displayValue = (row: VariablesRow) => (row.secret ? SECRET_MASK : row.value)

  const onRowOpen = (event: MouseEvent | KeyboardEvent, row: VariablesRow) => {
    if (event instanceof KeyboardEvent) emit('row-action', event, 'edit', row)
  }
</script>

<template>
  <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
    <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
      <header class="flex items-start gap-(--layout-group-gap)">
        <div class="flex min-w-0 grow">
          <PropertyFilter
            v-bind="propertyFilterProps"
            placeholder="Filter variables"
            aria-label="Filter variables"
          />
        </div>
        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
          <Tooltip
            content="Refresh"
            class="shrink-0"
          >
            <IconButton
              icon="az az-refresh"
              variant="outline"
              size="medium"
              :loading="loading"
              aria-label="Refresh"
              @click="(event) => emit('refresh', event)"
            />
          </Tooltip>
          <Tooltip
            content="Download CSV"
            class="shrink-0"
          >
            <IconButton
              icon="az az-download"
              variant="outline"
              size="medium"
              :disabled="!matchingItems.length"
              aria-label="Download CSV"
              @click="exportCsv"
            />
          </Tooltip>
          <CollectionPreferences
            v-bind="preferencesProps"
            title="Table preferences"
          />
        </div>
      </header>

      <section class="flex min-h-0 flex-col">
        <Card
          v-if="status === 'empty' && !loading"
          key="first-use"
          :padded="false"
        >
          <template #default>
            <EmptyState
              size="medium"
              icon="az az-key"
              title="No variables yet"
              description="Create a variable to store a value your services read at runtime."
            >
              <template #actions>
                <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                  <Button
                    label="Create variable"
                    icon="az az-plus"
                    variant="secondary"
                    size="small"
                    @click="emit('create')"
                  />
                  <Button
                    label="Documentation"
                    aria-label="Documentation (opens in a new tab)"
                    icon="az az-book"
                    variant="outline"
                    size="small"
                    href="https://example.com/docs/variables"
                    target="_blank"
                  />
                </div>
              </template>
            </EmptyState>
          </template>
        </Card>
        <Card
          v-else
          key="table"
          :padded="false"
        >
          <template #default>
            <DataTable
              ref="tableEl"
              v-bind="tableProps"
              :loading="loading || fetching"
              sortable
              :bordered="false"
              @row-click="onRowOpen"
              @row-remove="(event, row) => emit('row-action', event, 'delete', row)"
            >
              <template #cell-key="{ value }">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="az az-key shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 truncate">{{ value }}</span>
                </div>
              </template>

              <template #cell-id="{ value }">
                <TableCellId
                  :value="value"
                  resource="variable"
                />
              </template>

              <template #cell-value="{ row }">
                <TableCellLink
                  :label="displayValue(row)"
                  :copyable="!row.secret"
                  :copy-value="row.value"
                />
              </template>

              <template #cell-lastModified="{ row, value }">
                <TableCellTime
                  :value="value"
                  :author="row.lastEditor"
                  :avatar-src="row.lastEditorAvatar || undefined"
                />
              </template>

              <template #cell-scope="{ value }">
                <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span
                    v-for="item in scopeSummary(value)"
                    :key="item.label"
                    class="truncate whitespace-nowrap"
                  >
                    {{ item.label }}
                    <span
                      v-if="item.detail"
                      class="text-(--text-muted)"
                      >{{ item.detail }}</span
                    >
                  </span>
                </div>
              </template>

              <template #cell-actions="{ row }">
                <TableCellActions
                  :name="row.key"
                  @select="(event, value) => emit('row-action', event, value, row)"
                >
                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="edit"
                      label="Edit"
                    >
                      <template #leading>
                        <i
                          class="az az-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      value="duplicate"
                      label="Clone"
                    >
                      <template #leading>
                        <i
                          class="az az-copy"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>

                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete"
                      severity="danger"
                    >
                      <template #leading>
                        <i
                          class="az az-trash"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </TableCellActions>
              </template>

              <template #empty>
                <EmptyState
                  size="medium"
                  icon="az az-filter-off"
                  title="No matching variables"
                  description="No variable matches these filters."
                >
                  <template #actions>
                    <Button
                      label="Clear filters"
                      variant="outline"
                      size="small"
                      @click="clearFilters"
                    />
                  </template>
                </EmptyState>
              </template>
              <template #footer>
                <DataTablePagination
                  v-bind="paginationProps"
                  manual
                />
              </template>
            </DataTable>
          </template>
        </Card>
      </section>
    </section>
  </section>
</template>
```

## `parts/variables-drawer-form.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import Kbd from '@aziontech/webkit/kbd'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { ref } from 'vue'

  export interface VariablesDrawerFormProps {
    /** The drawer title, also the name of the form. */
    title: string
    /** The sentence under the title. */
    description: string
    /** What the Command Enter shortcut does, as the shortcut list names it. */
    shortcutLabel: string
    /** The drawer is open: the shortcut submits the form. */
    active?: boolean
    /** The save is in flight: the fields lock and Save spins. */
    submitting?: boolean
    /** Why the save failed, in a danger alert above the sections. */
    saveError?: string
  }

  const props = withDefaults(defineProps<VariablesDrawerFormProps>(), {
    active: false,
    submitting: false,
    saveError: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, form: HTMLFormElement | null]
  }>()

  defineSlots<{
    /** The sections of the form. */
    default(): unknown
  }>()

  const formEl = ref<HTMLFormElement | null>(null)

  useShortcuts({
    keys: 'meta+enter',
    label: props.shortcutLabel,
    group: 'Drawer',
    element: formEl,
    when: () => props.active && !props.submitting,
    handler: () => formEl.value?.requestSubmit()
  })
</script>

<template>
  <DrawerContent>
    <form
      ref="formEl"
      class="flex min-h-0 flex-1 flex-col"
      :aria-label="title"
      novalidate
      @submit.prevent="(event) => emit('submit', event, formEl)"
    >
      <PanelHeader class="w-full">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <DrawerTitle>{{ title }}</DrawerTitle>
          <p class="text-body-sm text-(--text-muted)">
            {{ description }}
          </p>
        </div>
      </PanelHeader>

      <PanelBody>
        <div
          v-if="saveError"
          class="mb-(--spacing-md)"
        >
          <Alert
            severity="danger"
            :label="saveError"
            data-testid="variables-save-error"
          />
        </div>
        <fieldset
          class="m-0 flex min-w-0 flex-col border-0 p-0"
          :disabled="submitting"
        >
          <legend class="sr-only">{{ title }}</legend>
          <slot />
        </fieldset>
      </PanelBody>

      <PanelFooter>
        <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
          <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
          <Button
            variant="primary"
            size="medium"
            :loading="submitting"
            type="submit"
            :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
          >
            Save
            <Kbd
              meta
              key-name="enter"
              size="small"
              aria-hidden="true"
            />
          </Button>
        </div>
      </PanelFooter>
    </form>
  </DrawerContent>
</template>
```

## `parts/variables-entries.vue`

```ts
<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Checkbox from '@aziontech/webkit/checkbox'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupInput from '@aziontech/webkit/input-group-input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Textarea from '@aziontech/webkit/textarea'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'

  import { useVariablesFormContext, type VariablesEntry } from '../composables/use-variables-form'
  import { SECRET_MASK } from '../lib/variables-rows'

  export interface VariablesEntriesProps {
    /** One saved variable is being edited: no import tools, at most one row. */
    editing?: boolean
    /** The edited variable is a saved secret: its Secret checkbox is locked. */
    secretLocked?: boolean
  }

  withDefaults(defineProps<VariablesEntriesProps>(), { editing: false, secretLocked: false })

  defineSlots<{
    /** Tools placed before Upload. */
    toolbar(): unknown
    /** Content placed above the rows in the Form view. */
    panel(): unknown
  }>()

  const {
    formId,
    entries,
    view,
    jsonText,
    jsonError,
    submitted,
    noVariables,
    canAdd,
    createEntry,
    keyError,
    valueError,
    setKey,
    pasteIntoKey,
    pickEnvFile
  } = useVariablesFormContext()

  const SECRET_HINT =
    'Secret values are hidden and write-only after saving. Once saved as a secret, this behavior cannot be changed.'
  const VIEW_OPTIONS = [
    { label: 'Form', value: 'Form' },
    { label: 'JSON', value: 'JSON' }
  ]

  const fieldId = (entry: VariablesEntry, part: string) => `${formId}-${part}-${entry.id}`
  const messageId = (entry: VariablesEntry, part: string) => `${fieldId(entry, part)}-message`
  const secretTooltip = (entry: VariablesEntry) =>
    entry.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
  const secretAriaLabel = (entry: VariablesEntry) =>
    entry.secret ? 'Unmark as secret' : 'Mark as secret'
</script>

<template>
  <SettingsGroup
    label="Variables"
    hint="Store values your services read at runtime. Add one row per variable, or import a .env file."
  >
    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
      <div
        v-if="!editing"
        class="flex items-center gap-(--spacing-xs) self-end"
      >
        <slot name="toolbar" />
        <Button
          label="Upload"
          icon="az az-upload"
          variant="outline"
          size="medium"
          @click="pickEnvFile"
        />
        <ToggleGroup
          v-model="view"
          :options="VIEW_OPTIONS"
          aria-label="Variables view"
          size="medium"
        />
      </div>

      <template v-if="view === 'Form'">
        <slot name="panel" />
        <AttributeEditor
          v-model:items="entries"
          :new-item="createEntry"
          :min-items="1"
          :limit="editing ? 1 : undefined"
          :add-disabled="!canAdd"
          add-button-label="Add variable"
          remove-button-label="Remove variable"
          aria-label="Variables"
        >
          <template #row="{ index, remove, removable, removeLabel }">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <Field>
                <InputGroupRoot
                  size="large"
                  required
                  :invalid="!!keyError(entries[index])"
                >
                  <InputGroupAddon>
                    <span class="inline-block w-20">
                      <Field.Label :for="fieldId(entries[index], 'key')">Key</Field.Label>
                    </span>
                  </InputGroupAddon>
                  <InputGroupInput
                    :id="fieldId(entries[index], 'key')"
                    :model-value="entries[index].key"
                    placeholder="MY_VARIABLE"
                    autocomplete="off"
                    spellcheck="false"
                    :invalid="!!keyError(entries[index])"
                    :aria-describedby="
                      keyError(entries[index]) ? messageId(entries[index], 'key') : undefined
                    "
                    @update:model-value="(value) => setKey(entries[index], value)"
                    @paste="pasteIntoKey($event, index)"
                  />
                  <Tooltip
                    v-if="removable"
                    content="Remove variable"
                  >
                    <IconButton
                      icon="az az-trash"
                      variant="outline"
                      size="large"
                      :aria-label="removeLabel"
                      @click="remove"
                    />
                  </Tooltip>
                </InputGroupRoot>
              </Field>

              <Field>
                <InputGroupRoot
                  size="large"
                  required
                  :invalid="!!valueError(entries[index])"
                >
                  <InputGroupAddon>
                    <span class="inline-block w-20">
                      <Field.Label :for="fieldId(entries[index], 'value')">Value</Field.Label>
                    </span>
                  </InputGroupAddon>
                  <InputGroupInput
                    :id="fieldId(entries[index], 'value')"
                    v-model="entries[index].value"
                    :type="entries[index].secret && !entries[index].visible ? 'password' : 'text'"
                    :placeholder="entries[index].secret ? SECRET_MASK : 'my-variable-value'"
                    autocomplete="off"
                    spellcheck="false"
                    :invalid="!!valueError(entries[index])"
                    :aria-describedby="
                      valueError(entries[index]) ? messageId(entries[index], 'value') : undefined
                    "
                  />
                  <Tooltip
                    v-if="entries[index].secret"
                    :content="entries[index].visible ? 'Hide value' : 'Show value'"
                  >
                    <IconButton
                      :icon="entries[index].visible ? 'az az-eye-off' : 'az az-eye'"
                      variant="outline"
                      size="large"
                      :aria-label="entries[index].visible ? 'Hide value' : 'Show value'"
                      :aria-pressed="entries[index].visible"
                      @click="entries[index].visible = !entries[index].visible"
                    />
                  </Tooltip>
                  <InputGroupAddon>
                    <Tooltip :content="secretTooltip(entries[index])">
                      <Field
                        orientation="horizontal"
                        :disabled="secretLocked"
                      >
                        <Field.Label :for="fieldId(entries[index], 'secret')">Secret</Field.Label>
                        <Checkbox
                          v-model="entries[index].secret"
                          :id="fieldId(entries[index], 'secret')"
                          :aria-label="secretAriaLabel(entries[index])"
                        />
                      </Field>
                    </Tooltip>
                  </InputGroupAddon>
                </InputGroupRoot>
              </Field>
            </div>

            <FieldError
              v-if="keyError(entries[index])"
              key="key-error"
              :id="messageId(entries[index], 'key')"
              >{{ keyError(entries[index])?.message }}</FieldError
            >
            <FieldError
              v-if="valueError(entries[index])"
              key="value-error"
              :id="messageId(entries[index], 'value')"
              >{{ valueError(entries[index])?.message }}</FieldError
            >
          </template>
          <template #limit>Edit one variable at a time.</template>
          <template #info>
            <FieldDescription v-if="!editing"
              >Paste JSON or .env contents into an empty key field to create one row per
              variable.</FieldDescription
            >
          </template>
        </AttributeEditor>
      </template>

      <template v-else>
        <Textarea
          v-model="jsonText"
          aria-label="Variables JSON"
          :invalid="!!jsonError"
          :aria-describedby="jsonError ? formId + '-json-message' : undefined"
        />
        <FieldDescription>
          Use a JSON object format, for example:
          <code class="text-label-code-sm">{"API_URL":"https://example.com"}</code>
        </FieldDescription>
        <FieldError
          v-if="jsonError"
          :id="formId + '-json-message'"
          >{{ jsonError }}</FieldError
        >
      </template>

      <FieldDescription>{{ SECRET_HINT }}</FieldDescription>
      <FieldError v-if="submitted && noVariables">Add at least one variable.</FieldError>
    </div>
  </SettingsGroup>
</template>
```

## `parts/variables-scope-group.vue`

```ts
<script setup lang="ts">
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Switch from '@aziontech/webkit/switch'

  import { useVariablesFormContext } from '../composables/use-variables-form'
  import {
    SCOPE_HINT,
    scopeDisplay,
    setScopeEnabled,
    visibleScopeOptions
  } from '../lib/variables-scope'

  const { formId, scopes, scopeError } = useVariablesFormContext()
</script>

<template>
  <SettingsGroup
    label="Scope"
    :hint="SCOPE_HINT"
  >
    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
      <div
        v-for="scope in scopes"
        :key="scope.type"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <InputGroupRoot
          size="large"
          :required="scope.enabled && scope.type !== 'global'"
          :invalid="scopeError(scope)"
        >
          <InputGroupAddon>
            <span class="w-20">{{ scope.label }}</span>
          </InputGroupAddon>
          <span
            v-if="scope.type === 'global'"
            class="flex h-full min-w-0 flex-1 items-center bg-(--bg-canvas) px-(--spacing-md) text-label-sm text-(--text-default)"
          >
            The entire account. Turns off by itself when another scope is on
          </span>
          <div
            v-else
            class="h-full min-w-0 flex-1"
          >
            <MultiSelect
              v-model="scope.ids"
              size="large"
              :placeholder="scope.placeholder"
              :display-value="scopeDisplay(scope)"
              :disabled="!scope.enabled"
              :required="scope.enabled && scope.type !== 'global'"
              :invalid="scopeError(scope)"
            >
              <MultiSelect.Trigger
                :aria-label="scope.placeholder"
                :aria-describedby="scopeError(scope) ? formId + '-scope-' + scope.type : undefined"
              />
              <MultiSelect.Content>
                <template #search>
                  <Input
                    v-model="scope.query"
                    size="small"
                    placeholder="Search"
                    aria-label="Search"
                  >
                    <template #leading>
                      <i
                        class="az az-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </template>
                <MultiSelect.Item
                  v-for="option in visibleScopeOptions(scope)"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </MultiSelect.Item>
              </MultiSelect.Content>
            </MultiSelect>
          </div>
          <InputGroupAddon>
            <Switch
              :model-value="scope.enabled"
              :disabled="scope.type === 'global'"
              :aria-label="'Enable ' + scope.label + ' scope'"
              @update:model-value="(value) => setScopeEnabled(scopes, scope, value)"
            />
          </InputGroupAddon>
        </InputGroupRoot>
        <FieldError
          v-if="scopeError(scope)"
          :id="formId + '-scope-' + scope.type"
          >Select at least one resource for this scope.</FieldError
        >
      </div>
    </div>
  </SettingsGroup>
</template>
```

## `parts/paste-panel.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'

  export interface PastePanelProps {
    /** The id of the text field; the panel and its report derive theirs from it. */
    id: string
    /** The label of the text field. */
    label: string
    /** The rows of the text field. */
    rows: number
    /** The text of the apply button. */
    applyLabel: string
    /** The test id of the apply button. */
    applyTestid: string
    /** True when the text holds nothing to apply. */
    applyDisabled?: boolean
    /** True when the text holds lines that will be skipped. */
    invalid?: boolean
    /** Writes the text in the code font through the Textarea monospace look. */
    monospace?: boolean
    /** Writes the text in the code font family only. */
    codeFont?: boolean
  }

  withDefaults(defineProps<PastePanelProps>(), {
    applyDisabled: false,
    invalid: false,
    monospace: false,
    codeFont: false
  })

  const text = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    apply: [event: MouseEvent]
    cancel: [event: MouseEvent]
  }>()

  defineSlots<{
    /** What the text holds, read with the field. */
    report(): unknown
  }>()
</script>

<template>
  <div
    :id="`${id}-panel`"
    class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
  >
    <Field>
      <Field.Label :for="id">{{ label }}</Field.Label>
      <div :class="codeFont ? '[&_textarea]:font-code' : undefined">
        <Textarea
          :id="id"
          v-model="text"
          :rows="rows"
          :monospace="monospace"
          spellcheck="false"
          :invalid="invalid"
          :aria-describedby="`${id}-report`"
        />
      </div>
    </Field>
    <div
      :id="`${id}-report`"
      class="flex flex-col gap-(--spacing-2xs)"
    >
      <slot name="report" />
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Button
        :label="applyLabel"
        variant="primary"
        size="medium"
        :disabled="applyDisabled"
        :data-testid="applyTestid"
        @click="(event) => emit('apply', event)"
      />
      <Button
        label="Cancel"
        variant="ghost"
        size="medium"
        @click="(event) => emit('cancel', event)"
      />
    </div>
  </div>
</template>
```

## `parts/env-paste-panel.vue`

```ts
<script setup lang="ts">
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import { computed } from 'vue'

  import { useVariablesFormContext } from '../composables/use-variables-form'
  import { lineList } from '../lib/paste-report'
  import { envPasteReport, plural, type VariablesPair } from '../lib/variables-format'
  import PastePanel from './paste-panel.vue'

  export interface EnvPastePanelProps {
    /** The id of the text field. */
    id: string
  }

  defineProps<EnvPastePanelProps>()

  const text = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    apply: [event: MouseEvent, pairs: VariablesPair[]]
    cancel: [event: MouseEvent]
  }>()

  const { filledEntries } = useVariablesFormContext()

  const report = computed(() =>
    envPasteReport(
      text.value,
      filledEntries.value.map((entry) => entry.key.trim())
    )
  )
  const found = computed(() => plural(report.value.pairs.length, 'variable', 'variables'))
</script>

<template>
  <PastePanel
    :id="id"
    v-model="text"
    label="Paste .env contents"
    :rows="6"
    monospace
    :invalid="report.invalidLines.length > 0"
    :apply-label="`Add ${found}`"
    apply-testid="paste-env-apply"
    :apply-disabled="!report.pairs.length"
    data-testid="paste-env-panel"
    @apply="(event) => emit('apply', event, report.pairs)"
    @cancel="(event) => emit('cancel', event)"
  >
    <template #report>
      <FieldError
        v-if="report.invalidLines.length"
        key="invalid"
        >{{
          `${lineList(report.invalidLines)} not KEY=value with an uppercase key and will be skipped.`
        }}</FieldError
      >
      <FieldDescription
        v-if="report.repeated.length"
        key="repeated"
        >{{
          `${report.repeated.join(', ')} appears more than once; the last value is kept.`
        }}</FieldDescription
      >
      <FieldDescription
        v-if="report.replaced.length"
        key="replaced"
        >{{
          `${report.replaced.join(', ')} is already in the list; its value will be replaced.`
        }}</FieldDescription
      >
      <FieldDescription key="found">{{
        `${found} found. Lines starting with # are ignored.`
      }}</FieldDescription>
    </template>
  </PastePanel>
</template>
```

## `parts/network-list-fields.vue`

```ts
<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed } from 'vue'

  import { useNetworkListFormContext } from '../composables/use-network-list-form'
  import {
    COUNTRIES,
    createListEntry,
    NETWORK_LIST_LIMIT,
    NETWORK_LIST_TYPES
  } from '../lib/network-list'
  import { lineList } from '../lib/paste-report'
  import { plural } from '../lib/variables-format'
  import PastePanel from './paste-panel.vue'

  const {
    name,
    type,
    countries,
    rows,
    copy,
    columns,
    rowErrors,
    nameMissing,
    countriesMissing,
    countryDisplay,
    pasteId,
    pasteOpen,
    pasteText,
    status,
    pasteToggleEl,
    pasteReport,
    pasteOverflow,
    cancelPaste,
    applyPaste
  } = useNetworkListFormContext()

  const setPasteToggle = (el: unknown) => {
    pasteToggleEl.value = el as { $el?: HTMLElement } | null
  }

  const found = computed(() => plural(pasteReport.value.lines.length, 'entry', 'entries'))
</script>

<template>
  <SettingsGroup
    label="General"
    hint="Names the list where firewall rules pick it."
  >
    <Field
      required
      :invalid="nameMissing"
    >
      <Field.Label>Name</Field.Label>
      <Input
        v-model="name"
        size="large"
        placeholder="Office and partners"
        autocomplete="off"
      />
      <Field.Error v-if="nameMissing">Name is required.</Field.Error>
    </Field>
  </SettingsGroup>

  <SettingsGroup
    label="Entries"
    :hint="copy?.hint ?? 'The countries the list matches, by where the request comes from.'"
  >
    <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
      <div class="flex flex-wrap items-center justify-between gap-(--spacing-xs)">
        <ToggleGroup
          v-model="type"
          :options="NETWORK_LIST_TYPES"
          aria-label="List type"
          size="medium"
        />
        <Button
          v-if="copy"
          :ref="setPasteToggle"
          label="Paste list"
          icon="az az-clipboard"
          variant="outline"
          size="medium"
          :aria-expanded="pasteOpen"
          :aria-controls="pasteOpen ? `${pasteId}-panel` : undefined"
          @click="pasteOpen = !pasteOpen"
        />
      </div>

      <template v-if="copy">
        <PastePanel
          v-if="pasteOpen"
          :id="pasteId"
          v-model="pasteText"
          :label="`Paste one ${copy.noun} per line`"
          :rows="7"
          code-font
          :apply-label="`Add ${found}`"
          apply-testid="network-list-paste-apply"
          :apply-disabled="!pasteReport.lines.length"
          data-testid="network-list-paste-panel"
          @apply="applyPaste"
          @cancel="cancelPaste"
        >
          <template #report>
            <FieldDescription key="found">{{
              `${found} found. Text after # is kept as the comment.`
            }}</FieldDescription>
            <FieldError
              v-if="pasteReport.invalid.length"
              key="invalid"
              >{{
                `${lineList(pasteReport.invalid)} not ${copy.rule}; ${pasteReport.invalid.length === 1 ? 'it is' : 'they are'} added with an error to fix.`
              }}</FieldError
            >
            <FieldDescription
              v-if="pasteReport.duplicates.length"
              key="duplicates"
              >{{
                `${lineList(pasteReport.duplicates)} already in the list and will be skipped.`
              }}</FieldDescription
            >
            <FieldError
              v-if="pasteOverflow"
              key="overflow"
              >{{
                `A list holds at most ${NETWORK_LIST_LIMIT} entries; the last ${pasteOverflow} will be skipped.`
              }}</FieldError
            >
          </template>
        </PastePanel>
        <p
          class="sr-only"
          role="status"
          aria-live="polite"
        >
          {{ status }}
        </p>
        <AttributeEditor
          v-model:items="rows"
          :definition="columns"
          :errors="rowErrors"
          :new-item="() => createListEntry()"
          :min-items="1"
          :limit="NETWORK_LIST_LIMIT"
          size="large"
          :add-button-label="`Add ${copy.noun}`"
          :remove-button-label="`Remove ${copy.noun}`"
          :aria-label="`${copy.column} entries`"
        >
          <template #cell-value="{ value, update, invalid }">
            <Input
              :model-value="value"
              size="large"
              :placeholder="copy.placeholder"
              autocomplete="off"
              :spellcheck="false"
              monospace
              :invalid="invalid"
              @update:model-value="update"
            />
          </template>
        </AttributeEditor>
      </template>

      <Field
        v-else
        required
        :invalid="countriesMissing"
      >
        <Field.Label>Countries</Field.Label>
        <MultiSelect
          v-model="countries"
          size="large"
          placeholder="Select countries"
          :display-value="countryDisplay"
        >
          <MultiSelect.Trigger aria-label="Countries" />
          <MultiSelect.Content>
            <MultiSelect.Item
              v-for="option in COUNTRIES"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </MultiSelect.Item>
          </MultiSelect.Content>
        </MultiSelect>
        <Field.Error v-if="countriesMissing">Select at least one country.</Field.Error>
      </Field>
    </div>
  </SettingsGroup>
</template>
```
