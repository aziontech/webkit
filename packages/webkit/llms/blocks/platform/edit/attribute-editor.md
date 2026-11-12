# AttributeEditor (`platform/edit/attribute-editor`)

> A key/value editor, drawn as a variables list page and the Create Variable drawer its heading action opens. The list follows the table-view recipe: one client-mode `useCollection` drives a `PropertyFilter`, `CollectionPreferences` and a data-driven `TableRoot`, with a first-use and a no-match `EmptyState`; each row's Edit opens the drawer on that variable, Clone inserts a copy below it, and Delete opens the typed `ConfirmDialog` of delete-with-confirmation. In the drawer the variables are an `AttributeEditor` (add, remove, focus, announcements, minimum one row) whose `row` slot draws each variable as a pair of `InputGroupRoot` rows, a Key row with a Remove button and a Value row with a show-value button and a Secret checkbox, beside a Form or JSON view and an Upload of a .env file; every scope is an `InputGroupRoot` joining its label, a `MultiSelect` of resources and an enable `Switch`, with Global giving way to any specific scope. Required and invalid states appear only after Save is pressed. Built from `AttributeEditor`, `PageHeader`, `PropertyFilter`, `CollectionPreferences`, `SettingsSection`, `TableRoot`, `Card`, `EmptyState`, `Table.CellId`, `Table.CellLink`, `Table.CellActions`, `Avatar`, `DropdownMenu`, `ConfirmDialog`, `Alert`, `Input`, `IconButton`, `Tooltip`, `Drawer` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `InputGroupRoot`, `InputGroupAddon`, `Checkbox`, `ToggleGroup`, `MultiSelect`, `Switch`, `HelperText` and `Button`; the JSON view is a webkit `Textarea`. A page body for ConsoleLayout.

- Surface: product
- Source: `blocks/platform/edit/attribute-editor/attribute-editor.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/edit/attribute-editor")`
- Components: [Alert](../../../components/alert.md), [AttributeEditor](../../../components/attribute-editor.md), [Avatar](../../../components/avatar.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Checkbox](../../../components/checkbox.md), [CollectionPreferences](../../../components/collection-preferences.md), [ConfirmDialog](../../../components/confirm-dialog.md), [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, `DrawerTrigger`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), `InputGroupAddon`, `InputGroupRoot`, [MultiSelect](../../../components/multi-select.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PropertyFilter](../../../components/property-filter.md), [SettingsSection](../../../components/settings-section.md), [Switch](../../../components/switch.md), [Table](../../../components/table.md), `TableRoot`, [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-create-surface`

## Asked as

variables; environment variables; env vars; secrets; create variable; edit variable; variables list; version history; variáveis; variáveis de ambiente; segredos; criar variável; key value editor; attribute editor; .env upload; editor de chave e valor; delete variable; clone variable; paste .env; paste env file; import .env; colar .env; importar variáveis; dotenv; network list; ip list; asn list; country list; bulk paste; lista de rede; lista de ips; lista de red

A list of key and value pairs and the drawer that edits them, here environment variables. The user scans the variables already defined, then opens Create Variable to type or paste several pairs at once, mark the sensitive ones as secret, and select where they apply (the whole account, or specific environments, projects, services or policies) before saving them in one step. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header, the ⌘K palette and the `main`.

## When to use

- Users define many free-form pairs of a name and a value (environment variables, headers, metadata, tags) and often bring them from a file.
- Some values are sensitive and must be masked and write-only once saved.
- Each pair applies to a scope the user picks from existing resources.

## When not to use

- Conditions and actions evaluated in order: use `platform/edit/rule-builder`.
- A fixed set of named settings on one resource: use `platform/edit/edit-resource` or `platform/settings/settings-form`.
- A short read-only list of related records inside a settings tab: use `platform/detail/attached-resources`.
- A long document or code the user edits as text: use `platform/edit/code-editor`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

`PageHeader` titled Variables with a one-sentence description and two actions: an outlined medium Documentation and the primary large `Create Variable`, the page's only large control, which opens the drawer.

### B. Controls row — `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

The same controls row as `platform/view/table-view`, all bound to one client-mode `useCollection` call: a `PropertyFilter` labeled "Filter variables" (free text over key, ID, author and type, plus Key, Author and Type properties), outlined `IconButton`s for Refresh and Download CSV, each named by a `Tooltip`, and `CollectionPreferences` last. The filter, sort and page live in the URL; page size and columns are saved. See `skills/webkit-lists`.

### C. Variables table — `Card`, `TableRoot`, `Table.CellId`, `Table.CellLink`, `Avatar`, `Tooltip` (required)

`Card :padded="false"` around a borderless data-driven `TableRoot` bound with `v-bind="tableProps"`, with Key as the `principal`, unhideable column, then ID (hidden by default), Value, Scope and Last modified. ID is `Table.CellId` ("Copy variable ID") and Value is `Table.CellLink` with `copyable`; a secret value shows its mask and loses its copy control (`:copyable="!row.secret"`). Last modified pairs the author `Avatar`, named in a `Tooltip`, with the relative time. See `skills/webkit-tables`.

### D. Row actions — `Table`, `DropdownMenu` (required)

`Table.CellActions`, named after the variable ("Actions for API_URL"), opens its menu of `DropdownMenu.Group`s placed `bottom-end`: Edit and Clone in the first group, Delete alone in the last. Edit opens the drawer on that variable; Clone inserts a copy right below it with `_COPY` appended to the key; Delete opens the confirmation dialog.

### E. Create and edit drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent` (required)

A right-side `Drawer` whose content is one `form` labeled Create Variable or Edit Variable. `PanelHeader` holds the `DrawerTitle` and `DrawerClose`; `PanelContent` scrolls the Variables and Scope sections. The form resets every time the drawer opens: from Create Variable, one empty pair, the Form view, Global the only scope on; from a row's Edit, that variable's pair and scopes, with no Upload, view toggle or Add variable. A saved secret is never shown: its value starts empty, an empty value keeps the saved secret, and the Secret checkbox is locked. See `skills/webkit-create-surface`.

### F. Variables section — `SettingsSection`, `Button`, `ToggleGroup` (required)

A `SettingsSection` titled Variables with a hint that says what variables are for. Its toolbar holds an outlined Upload `Button` that reads a `.env` or text file into rows, and a medium `ToggleGroup` that switches between the Form and JSON views of the same data.

### G. Key and value rows — `AttributeEditor`, `Field`, `InputGroupRoot`, `InputGroupAddon`, `Input`, `Tooltip`, `IconButton`, `Checkbox`, `HelperText` (required)

The rows are one `AttributeEditor` (`v-model:items`, `min-items` 1, `add-disabled` until the last pair is filled), which owns the list semantics, Add variable, Remove, the focus after each, the polite "Item n added / removed" announcement and, while editing one variable, the limit of 1 with the note "Edit one variable at a time.". Its `row` slot draws each variable as two large `InputGroupRoot` rows. The Key row joins a Key label addon, a code-font field that turns spaces into underscores, and a Remove variable `IconButton` (hidden while only one pair is left). The Value row joins a Value label addon, the field, a Show value `IconButton` and a Secret `Checkbox` named by a `Tooltip`. Errors render as `HelperText` under the pair. The editor's outlined Add variable button is enabled only when the last pair is filled, and its `info` slot carries the hint that pasting `.env` or JSON contents into an empty key creates one row per variable. Remove is named with the row number ("Remove variable 2").

### H. Paste .env panel — `Button`, `Textarea`, `HelperText` (optional)

In the PasteEnv state an outlined Paste .env `Button` (with `aria-expanded`) beside Upload opens an inline panel above the rows: a labelled monospace `Textarea`, a report of what the text holds ("3 variables found.", the lines that are not `KEY=value` and will be skipped, keys repeated in the text, keys already in the list whose value will be replaced), and a primary Add N variables `Button` beside Cancel. Applying merges the pairs into the rows (replace by key, append the rest), closes the panel, announces the count and returns focus to Paste .env. Parsing follows the design sample: blank lines and `#` comments are ignored, `export` is accepted, quotes are removed, the last value of a repeated key wins.

### I. JSON view — `Textarea`, `HelperText` (optional)

The JSON view replaces the rows with one `Textarea` labeled Variables JSON over the same entries; a `HelperText` reports a parse error in place. Switching back to Form keeps what was typed.

### J. Scope — `SettingsSection`, `InputGroupRoot`, `InputGroupAddon`, `MultiSelect`, `Input`, `Switch`, `HelperText` (required)

A `SettingsSection` titled Scope with one large `InputGroupRoot` per scope type: a label addon, a `MultiSelect` of resources with a search `Input` (Global shows "The entire account" instead), and an enable `Switch`. Global turns off when any specific scope turns on. An enabled scope with no resource selected shows a required `HelperText`.

### K. Drawer footer — `PanelFooter`, `Button` (required)

`PanelFooter` holds one primary medium Save `Button` at the end, which submits the form and shows its loading state while saving.

### L. List states — `EmptyState`, `Button` (required)

With no variables at all, the card holds a first-use `EmptyState` (`No variables yet`) with Create Variable and Documentation. When the filter matches nothing, the table's `#empty` slot holds a no-match `EmptyState` (`No matching variables`) with an outlined Clear filters `Button`.

### M. Delete confirmation — `ConfirmDialog`, `Alert`, `Input`, `Button` (required)

The dialog of `platform/delete/delete-with-confirmation`, titled Delete variable: a warning `Alert`, one sentence on the consequence, and an `Input` where the user types the key. The danger Delete variable `Button` stays disabled until the trimmed value equals the key; Cancel closes the dialog.

### N. Network list drawer — `Drawer`, `SettingsSection`, `ToggleGroup`, `Button`, `Textarea`, `HelperText`, `AttributeEditor`, `MultiSelect` (optional)

In the NetworkList state the same drawer recipe creates a network list for firewall rules: a General section with a required Name, then an Entries section whose `ToggleGroup` picks the type (IP/CIDR, ASN, Countries). IP/CIDR and ASN entries are an `AttributeEditor` in list mode, large, with an Address (or ASN) column in the code font through `cell-value` and an optional Comment, at most 200 rows. Paste list opens the panel of H for a whole list, one entry per line with `#` comments: its report counts the entries found, names the lines that are not valid ("Line 4 is not an IPv4 or IPv6 address, or a CIDR range") and the lines already in the list that will be skipped. Add N entries appends every new line as a row, valid or not, and each invalid row shows its own error under the field right away, so the user fixes the list line by line instead of retyping it; typed rows are checked only after Save, and empty rows are ignored once one row is filled. Countries is a required `MultiSelect`. Save validates, moves focus to the first field in error, then closes the drawer and raises a success toast with the entry count.

## Do

- Validate only after Save is pressed; then flag each empty, malformed or duplicated key under its own pair and move focus to the first field in error.
- Keep secret values masked in the list and in the drawer, and say in the hint that secrets are write-only once saved.
- Let users bring pairs in bulk: Upload, Paste .env, paste into a key, or edit as JSON.
- Before pasted pairs land, say how many were found, which lines are skipped and which keys will be replaced.
- Build the rows on `AttributeEditor` so add, remove, focus and announcements behave the same on every key and value editor.
- Keep the label of each field inside its `InputGroupAddon`, tied to the field by `for`.
- Reset the drawer on open so a closed and reopened drawer never shows stale rows.
- Follow `skills/webkit-form` for required states and `skills/webkit-lists` for the list page.

## Don't

- Don't show required errors on first render or while the user is still typing the first pair.
- Don't offer Remove on the last remaining pair.
- Don't drop invalid pasted lines silently, and don't add duplicate keys from a paste: replace the existing value and say so.
- Don't reveal a saved secret value in the table, a tooltip or the copy control.
- Don't add a Cancel button beside Save; `DrawerClose` and the overlay close the drawer.
- Don't keep Global on together with a specific scope.

## Copy

- **Title and create action:** "Variables" and "Create Variable"; the drawer title repeats "Create Variable", or reads "Edit Variable" from a row.
- **Empty states:** "No variables yet" / "Create a variable to store a value your services read at runtime."; "No matching variables" / "No variable matches these filters."
- **Delete dialog:** title and danger button "Delete variable"; the prompt reads "Type API_BASE_URL to confirm."
- **Field placeholders:** show the format, e.g. "MY_VARIABLE" for the key, "my-variable-value" for the value.
- **Errors:** short and specific, e.g. "Key is required.", "Use only uppercase letters, numbers, and underscores.", "Select at least one resource for this scope."
- **Secret control:** "Mark as secret" and "Unmark as secret"; the hint states the rule, e.g. "Secret values are hidden and write-only after saving."
- **Network list:** title "Create Network List"; types "IP/CIDR", "ASN", "Countries"; panel label "Paste one address per line"; report "7 entries found. Text after # is kept as the comment.", "Lines 4 and 8 are not an IPv4 or IPv6 address, or a CIDR range; they are added with an error to fix.", "Line 7 is already in the list and will be skipped."; row error "198.51.100.300 is not an IPv4 or IPv6 address, or a CIDR range."; toast "Office and partners created."
- **Paste panel:** label "Paste .env contents"; report "3 variables found. Lines starting with # are ignored.", "Line 5 is not KEY=value with an uppercase key and will be skipped.", "CACHE_TTL is already in the list; its value will be replaced."; buttons "Paste .env", "Add 3 variables", "Cancel".
- **Buttons:** verb first, three words or fewer, e.g. "Upload", "Add variable", "Save".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Every key and value field has a visible `label` in its addon; an invalid field sets `aria-invalid` and points to its `HelperText` through `aria-describedby`.
- Icon-only controls (Remove variable, Show value, Hide value, row actions, toolbar) carry an `aria-label` that matches their `Tooltip`.
- The Secret `Checkbox` and each scope `Switch` have an `aria-label` naming what they toggle, e.g. "Enable Project scope".
- The `ToggleGroup` is labeled "Variables view"; the hidden file input is removed from the tab order and the Upload button triggers it.
- Adding a pair moves focus to its new Key field; removing one moves focus to the pair now in its place (or Add variable); both are announced in a polite live region by `AttributeEditor`.
- The paste panel's `Textarea` is described by its report, so skipped lines and replaced keys are read with the field; Paste .env exposes `aria-expanded`, and applying announces how many variables were added.
- The drawer traps focus while open and returns it to Create Variable on close.

## States

- List: the variables list page with the controls row and table; the drawer is closed.
- First use: no variables yet; the card holds the first-use `EmptyState` with Create Variable.
- No match: the filter matches nothing; the table shows the no-match `EmptyState` with Clear filters.
- Edit: a row's Edit opens the drawer on that variable; Save replaces it in the list.
- Delete: a row's Delete opens the typed confirmation; confirming removes the row.
- Create: the drawer open with one empty pair, the Form view and Global on; errors appear only after Save.
- PasteEnv: Create Variable opens the drawer with one pair and the Paste .env panel holding a pasted file with a comment, an `export`, a skipped lowercase line and a repeated key that is already in the list; Add 3 variables merges them.
- NetworkList: Create Network List opens the drawer named Office and partners, type IP/CIDR, with the Paste list panel holding nine lines: a comment line, two lines that are not valid addresses and one already pasted above; Add 7 entries appends them as rows, the two invalid ones showing their errors.

## Related

- `platform/create/create-in-drawer` — the general drawer create pattern this drawer follows.
- `platform/view/table-view` — the controls row and table recipe the list page reuses.
- `platform/edit/rule-builder` — a drawer for ordered conditions and behaviors instead of free pairs.
- `platform/states/form-validation` — when and how errors appear after Save.
- `InputGroupRoot` — joins label, field and actions into one row; see `skills/webkit-form`.
- `AttributeEditor` and `TagEditor` — the components behind the rows; `TagEditor` for resource tags.

## Variants

- `List` — primary (the code below)
- `Create` — Closed until Create Variable opens it: one empty Key and Value pair in an `AttributeEditor`, the Form view selected and Global the only scope switched on, all reset each time the drawer opens. Add variable waits for the last pair to be filled; Save flags the empty or malformed fields only after it is pressed.
- `PasteEnv` — Create Variable opens the drawer with the Paste .env panel open on a pasted file: the report counts the pairs found, names the line that will be skipped, the key repeated in the text and the key already in the list whose value will be replaced, and Add 3 variables merges them into the rows, announces the count and returns focus to Paste .env.
- `NetworkList` — Create Network List opens a drawer with a Name, a type `ToggleGroup` (IP/CIDR, ASN, Countries) and the entries as an `AttributeEditor` of address and comment rows; Paste list holds a pasted list of nine lines whose report counts 7 entries, names the 2 lines that are not valid addresses and the line already in the list, and Add 7 entries appends them as rows where each invalid line shows its own error. Countries is a `MultiSelect`; Save checks every row and raises a success toast.

Each variant is the same screen in another state: `get_pattern("platform/edit/attribute-editor", { variant })`, or the file under `blocks/platform/edit/attribute-editor/variants/`.

## Code (`List`)

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Checkbox from '@aziontech/webkit/checkbox'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupAddon from '@aziontech/webkit/input-group-addon'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Table from '@aziontech/webkit/table'
  import TableRoot from '@aziontech/webkit/table-root'
  import Textarea from '@aziontech/webkit/textarea'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, reactive, ref, useId, watch } from 'vue'

  const columns = [
    { accessorKey: 'key', header: 'Key', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'value', header: 'Value', grow: 2 },
    { accessorKey: 'scope', header: 'Scope', minWidth: 80 },
    { accessorKey: 'lastModified', header: 'Last modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]
  const seed = [
    {
      id: 'v-001',
      key: 'API_BASE_URL',
      value: 'https://api.example.com',
      secret: false,
      scope: [{ type: 'global', id: '', name: '' }],
      lastEditor: 'Robson Junior',
      lastEditorAvatar: '',
      lastModified: '1 month ago'
    },
    {
      id: 'v-002',
      key: 'PAYMENT_SECRET_KEY',
      value: 'sk_live_51H8sX2eZv...',
      secret: true,
      scope: [{ type: 'environment', id: 'env-production', name: 'Production' }],
      lastEditor: 'Isaque Böck',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-003',
      key: 'FEATURE_FLAGS',
      value: 'checkout_v2,dark_mode',
      secret: false,
      scope: [{ type: 'service', id: '3344556677', name: 'storefront' }],
      lastEditor: 'Rafael Garbinatto',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-004',
      key: 'DATABASE_PASSWORD',
      value: 'p4ssw0rd-r0t4t3d',
      secret: true,
      scope: [{ type: 'policy', id: '5540117', name: 'production-policy' }],
      lastEditor: 'Herbert Júlio',
      lastEditorAvatar: '',
      lastModified: '2 months ago'
    },
    {
      id: 'v-005',
      key: 'MAX_UPLOAD_MB',
      value: '25',
      secret: false,
      scope: [{ type: 'global', id: '', name: '' }],
      lastEditor: 'Rafael Umman',
      lastEditorAvatar: '',
      lastModified: '3 months ago'
    }
  ]

  const authors = [
    'Robson Junior',
    'Isaque Böck',
    'Rafael Garbinatto',
    'Herbert Júlio',
    'Rafael Umman',
    'myemail'
  ]
  const properties = [
    { key: 'key', label: 'Key' },
    { key: 'lastEditor', label: 'Author', options: authors.map((value) => ({ value })) },
    { key: 'type', label: 'Type', options: [{ value: 'Plain' }, { value: 'Secret' }] }
  ]
  const withType = (variable) => ({ ...variable, type: variable.secret ? 'Secret' : 'Plain' })

  const variables = ref(seed.map(withType))
  const editing = ref(null)
  const existingKeys = computed(() =>
    variables.value
      .filter((variable) => variable.id !== editing.value?.id)
      .map((variable) => variable.key)
  )

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: variables,
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

  const loading = ref(false)
  const table = ref(null)
  const exportCsv = () => table.value?.exportCsv({ filename: 'variables.csv' })

  const refresh = () => {
    if (loading.value) return
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 600)
  }

  const displayValue = (row) => (row.secret ? SECRET_MASK : row.value)

  const scopeSummary = (scope) =>
    scopeTypes
      .map((entry) => ({
        ...entry,
        names: (scope ?? []).filter((item) => item.type === entry.type).map((item) => item.name)
      }))
      .filter((entry) => entry.names.length > 0)
      .map((group) => ({
        label: group.label,
        detail:
          group.type === 'global'
            ? ''
            : group.names.length === 1
              ? group.names[0]
              : `${group.names.length} ${group.plural}`
      }))

  let nextVariableId = seed.length
  const newVariableId = () => `v-${String((nextVariableId += 1)).padStart(3, '0')}`
  const touched = (variable) =>
    withType({ ...variable, lastEditor: 'myemail', lastEditorAvatar: '', lastModified: 'just now' })

  const onCreated = (created) => {
    variables.value = [
      ...created.map((variable) => touched({ ...variable, id: newVariableId() })),
      ...variables.value
    ]
  }

  const onUpdated = (id, [changed]) => {
    variables.value = variables.value.map((variable) =>
      variable.id === id
        ? touched({
            ...variable,
            ...changed,
            value: changed.secret && !changed.value ? variable.value : changed.value
          })
        : variable
    )
  }

  const cloneKey = (key) => {
    const taken = new Set(variables.value.map((variable) => variable.key))
    let candidate = `${key}_COPY`
    let n = 1
    while (taken.has(candidate)) candidate = `${key}_COPY_${(n += 1)}`
    return candidate
  }

  const openCreate = () => {
    editing.value = null
    drawerOpen.value = true
  }

  const pending = ref(null)
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const canDelete = computed(
    () => Boolean(pending.value) && confirmation.value.trim() === pending.value.key
  )
  const confirmDelete = () => {
    if (!canDelete.value) return
    variables.value = variables.value.filter((variable) => variable.id !== pending.value.id)
    deleteOpen.value = false
  }

  const onRowAction = (value, row) => {
    if (value === 'edit') {
      editing.value = row
      drawerOpen.value = true
      return
    }
    if (value === 'duplicate') {
      const index = variables.value.findIndex((variable) => variable.id === row.id)
      const copy = touched({ ...row, id: newVariableId(), key: cloneKey(row.key) })
      variables.value = [
        ...variables.value.slice(0, index + 1),
        copy,
        ...variables.value.slice(index + 1)
      ]
      return
    }
    if (value === 'delete') {
      pending.value = row
      confirmation.value = ''
      deleteOpen.value = true
    }
  }

  const SECRET_MASK = '••••••••'
  const SECRET_HINT =
    'Secret values are hidden and write-only after saving. Once saved as a secret, this behavior cannot be changed.'
  const VIEW_OPTIONS = [
    { label: 'Form', value: 'Form' },
    { label: 'JSON', value: 'JSON' }
  ]
  const fieldClass =
    'h-full min-w-0 flex-1 border-0 bg-transparent px-(--spacing-md) text-(--text-default) outline-none placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)'

  const formId = useId()
  const fieldId = (entry, part) => `${formId}-${part}-${entry.id}`
  const messageId = (entry, part) => `${fieldId(entry, part)}-message`

  let nextEntryId = 0
  const createEntry = (key = '', value = '', secret = false) => ({
    id: (nextEntryId += 1),
    key,
    value,
    secret,
    visible: false
  })
  const isEmptyEntry = (entry) => !entry.key.trim() && !entry.value.trim()
  const formatKey = (value) =>
    String(value ?? '')
      .replace(/\s/g, '_')
      .toUpperCase()

  const drawerOpen = ref(false)
  const submitting = ref(false)
  const submitted = ref(false)
  const entries = ref([createEntry()])
  const view = ref('Form')
  const jsonText = ref('{}')
  const jsonError = ref('')
  const fileInput = ref(null)

  const filledEntries = computed(() => entries.value.filter((entry) => !isEmptyEntry(entry)))
  const keyCounts = computed(() =>
    filledEntries.value.reduce((counts, entry) => {
      const key = entry.key.trim()
      counts.set(key, (counts.get(key) ?? 0) + 1)
      return counts
    }, new Map())
  )
  const duplicatedKeys = computed(() =>
    [...keyCounts.value].filter(([, count]) => count > 1).map(([key]) => key)
  )

  const keyError = (entry) => {
    if (!submitted.value || isEmptyEntry(entry)) return null
    const key = entry.key.trim()
    if (!key) return { kind: 'required', message: 'Key is required.' }
    if (!/^[A-Z0-9_]+$/.test(key))
      return { kind: 'invalid', message: 'Use only uppercase letters, numbers, and underscores.' }
    if (keyCounts.value.get(key) > 1)
      return { kind: 'invalid', message: `Duplicated key: ${duplicatedKeys.value.join(', ')}` }
    if (existingKeys.value.includes(key))
      return { kind: 'invalid', message: `${key} already exists in this list.` }
    return null
  }
  const keepsSecret = (entry) => Boolean(editing.value?.secret && entry.secret && entry.key.trim())
  const valueError = (entry) => {
    if (!submitted.value || isEmptyEntry(entry) || entry.value.trim() || keepsSecret(entry))
      return null
    return { kind: 'required', message: 'Value is required.' }
  }

  const noVariables = computed(() => filledEntries.value.length === 0)
  const isValid = computed(
    () =>
      !noVariables.value &&
      filledEntries.value.every((entry) => !keyError(entry) && !valueError(entry))
  )
  const drawerTitle = computed(() => (editing.value ? 'Edit Variable' : 'Create Variable'))
  const drawerDescription = computed(() => {
    if (!editing.value) return 'Create one or more variables and define where they are available.'
    if (editing.value.secret) return 'Leave the value empty to keep the saved secret.'
    return 'Change the key, value or scope of this variable.'
  })
  const canAdd = computed(() => {
    const last = entries.value.at(-1)
    return Boolean(last?.key.trim() && last?.value.trim())
  })
  const setKey = (entry, value) => {
    entry.key = formatKey(value)
  }

  const secretTooltip = (entry) =>
    entry.secret ? 'The value is hidden and write-only.' : 'Mark as secret'
  const secretAriaLabel = (entry) => (entry.secret ? 'Unmark as secret' : 'Mark as secret')

  const unquote = (value) => {
    const quote = value[0]
    if ((quote === '"' || quote === "'") && value.length > 1 && value.at(-1) === quote) {
      return value.slice(1, -1)
    }
    return value
  }
  const parseEnvFile = (content) => {
    const parsed = []
    const invalidLines = []
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
  const parseJsonObject = (content) => {
    const parsed = JSON.parse(content)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null
    return Object.entries(parsed)
      .filter(([key]) => key.trim())
      .map(([key, value]) => ({
        key: formatKey(key),
        value:
          typeof value === 'string'
            ? value
            : value == null
              ? ''
              : typeof value === 'object'
                ? JSON.stringify(value)
                : String(value)
      }))
  }
  const parsePasted = (content) => {
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
  const toEntries = (pairs, secrets = new Set()) =>
    pairs.map((pair) => createEntry(pair.key, pair.value, secrets.has(pair.key)))

  const pasteIntoKey = (event, index) => {
    if (!isEmptyEntry(entries.value[index])) return
    const pairs = parsePasted(event.clipboardData?.getData('text/plain'))
    if (!pairs) return
    event.preventDefault()
    entries.value.splice(index, 1, ...toEntries(pairs))
  }

  const onFilePicked = async (event) => {
    const [file] = event.target.files ?? []
    event.target.value = ''
    if (!file) return
    const { parsed, invalidLines } = parseEnvFile(await file.text())
    if (!parsed.length && invalidLines.length) return
    view.value = 'Form'
    await nextTick()
    entries.value = [...filledEntries.value, ...toEntries(parsed)]
    if (!entries.value.length) entries.value = [createEntry()]
  }

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

  const scopeTypes = [
    { type: 'global', label: 'Global', plural: '' },
    { type: 'environment', label: 'Environment', plural: 'environments' },
    { type: 'project', label: 'Project', plural: 'projects' },
    { type: 'service', label: 'Service', plural: 'services' },
    { type: 'policy', label: 'Policy', plural: 'policies' }
  ]
  const scopeOptions = {
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
  const createScopes = () =>
    scopeTypes.map((scope) => ({
      ...scope,
      placeholder: scope.plural ? `Select ${scope.plural}` : '',
      enabled: scope.type === 'global',
      ids: [],
      query: '',
      options: scopeOptions[scope.type] ?? []
    }))
  const scopes = reactive(createScopes())

  const setScopeEnabled = (scope, enabled) => {
    if (scope.type === 'global') return
    scope.enabled = enabled
    scope.ids = enabled ? scope.options.map((option) => option.value) : []
    scope.query = ''
    scopes[0].enabled = !scopes.some((item) => item.type !== 'global' && item.enabled)
  }
  const scopeMissing = (scope) => scope.enabled && scope.type !== 'global' && scope.ids.length === 0
  const scopeError = (scope) => submitted.value && scopeMissing(scope)
  const scopeDisplay = (scope) => (ids) => {
    if (!ids?.length) return ''
    if (ids.length > 1) return `Selected ${ids.length} ${scope.plural}`
    return scope.options.find((option) => option.value === ids[0])?.label ?? ids[0]
  }
  const visibleScopeOptions = (scope) => {
    const query = scope.query.trim().toLowerCase()
    if (!query) return scope.options
    return scope.options.filter((option) => option.label.toLowerCase().includes(query))
  }
  const scopePayload = () =>
    scopes.flatMap((scope) => {
      if (!scope.enabled) return []
      if (scope.type === 'global') return [{ type: 'global', id: '', name: '' }]
      return scope.ids.map((id) => ({
        type: scope.type,
        id,
        name: scope.options.find((option) => option.value === id)?.label ?? id
      }))
    })

  const scopesFor = (scope) =>
    createScopes().map((item) => {
      const ids = (scope ?? []).filter((entry) => entry.type === item.type).map((entry) => entry.id)
      return item.type === 'global'
        ? { ...item, enabled: ids.length > 0 }
        : { ...item, enabled: ids.length > 0, ids }
    })

  watch(drawerOpen, (isOpen) => {
    if (!isOpen) return
    const current = editing.value
    entries.value = current
      ? [createEntry(current.key, current.secret ? '' : current.value, current.secret)]
      : [createEntry()]
    view.value = 'Form'
    jsonText.value = '{}'
    jsonError.value = ''
    submitted.value = false
    Object.assign(scopes, current ? scopesFor(current.scope) : createScopes())
    submitting.value = false
  })

  const formEl = ref(null)
  const submit = async () => {
    if (submitting.value) return
    if (view.value === 'JSON') {
      if (jsonError.value) return
      view.value = 'Form'
      await nextTick()
    }
    submitted.value = true
    if (!isValid.value || scopes.some(scopeMissing)) {
      await nextTick()
      formEl.value
        ?.querySelector(
          ':is(input, textarea, button)[aria-invalid="true"], :is(input, textarea, button)[aria-required="true"]'
        )
        ?.focus()
      return
    }
    submitting.value = true
    await new Promise((resolve) => setTimeout(resolve, 900))
    const scope = scopePayload()
    const created = filledEntries.value.map((entry) => ({
      key: entry.key.trim(),
      value: entry.value,
      secret: entry.secret,
      scope
    }))
    if (editing.value) onUpdated(editing.value.id, created)
    else onCreated(created)
    editing.value = null
    submitting.value = false
    drawerOpen.value = false
  }
</script>

<template>
  <div class="layout-column layout-boundary flex flex-col">
    <PageHeader
      title="Variables"
      description="Configure variable names, values, and settings for use across your projects."
    >
      <template #actions>
        <Button
          label="Documentation"
          icon="pi pi-book"
          kind="outlined"
          href="https://example.com/docs/variables"
          target="_blank"
          size="medium"
        />
        <Button
          label="Create Variable"
          icon="pi pi-plus"
          kind="primary"
          size="large"
          @click="openCreate"
        />
      </template>
    </PageHeader>

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
              text="Refresh"
              class="shrink-0"
            >
              <IconButton
                icon="pi pi-refresh"
                kind="outlined"
                size="medium"
                :loading="loading"
                aria-label="Refresh"
                @click="refresh"
              />
            </Tooltip>
            <Tooltip
              text="Download CSV"
              class="shrink-0"
            >
              <IconButton
                icon="pi pi-download"
                kind="outlined"
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
            v-if="status === 'empty'"
            key="first-use"
            :padded="false"
          >
            <template #content>
              <EmptyState
                size="medium"
                icon="pi pi-key"
                title="No variables yet"
                description="Create a variable to store a value your services read at runtime."
              >
                <template #actions>
                  <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                    <Button
                      label="Create Variable"
                      icon="pi pi-plus"
                      kind="secondary"
                      size="small"
                      @click="openCreate"
                    />
                    <Button
                      label="Documentation"
                      icon="pi pi-book"
                      kind="outlined"
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
            <template #content>
              <TableRoot
                ref="table"
                v-bind="tableProps"
                :loading="loading || fetching"
                enable-sorting
                :bordered="false"
              >
                <template #cell-key="{ value }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-key shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 truncate">{{ value }}</span>
                  </div>
                </template>

                <template #cell-id="{ value }">
                  <Table.CellId
                    :value="value"
                    resource="variable"
                  />
                </template>

                <template #cell-value="{ row }">
                  <Table.CellLink
                    :label="displayValue(row)"
                    :copyable="!row.secret"
                    :copy-value="row.value"
                  />
                </template>

                <template #cell-lastModified="{ row, value }">
                  <div
                    v-if="value"
                    class="flex min-w-0 items-center gap-(--spacing-xs)"
                  >
                    <Tooltip
                      v-if="row.lastEditor"
                      :text="row.lastEditor"
                    >
                      <Avatar
                        :src="row.lastEditorAvatar || undefined"
                        :alt="row.lastEditor"
                        :label="row.lastEditor"
                        size="small"
                        kind="square"
                      />
                    </Tooltip>
                    <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
                  </div>
                </template>

                <template #cell-scope="{ value }">
                  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
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
                  <Table.CellActions
                    :name="row.key"
                    @select="(event, value) => onRowAction(value, row)"
                  >
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="edit"
                        label="Edit"
                      >
                        <template #left>
                          <i
                            class="pi pi-pencil"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                      <DropdownMenu.Option
                        value="duplicate"
                        label="Clone"
                      >
                        <template #left>
                          <i
                            class="pi pi-clone"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                    </DropdownMenu.Group>

                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="delete"
                        label="Delete"
                      >
                        <template #left>
                          <i
                            class="pi pi-trash"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                    </DropdownMenu.Group>
                  </Table.CellActions>
                </template>

                <template #empty>
                  <EmptyState
                    size="medium"
                    icon="pi pi-filter-slash"
                    title="No matching variables"
                    description="No variable matches these filters."
                  >
                    <template #actions>
                      <Button
                        label="Clear filters"
                        kind="outlined"
                        size="small"
                        @click="clearFilters"
                      />
                    </template>
                  </EmptyState>
                </template>
              </TableRoot>
            </template>
          </Card>
        </section>
      </section>
    </section>

    <Drawer
      v-model:open="drawerOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            ref="formEl"
            class="flex min-h-0 flex-1 flex-col"
            :aria-label="drawerTitle"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>{{ drawerTitle }}</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  {{ drawerDescription }}
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">{{ drawerTitle }}</legend>
                <SettingsSection
                  title="Variables"
                  hint="Store values your services read at runtime. Add one row per variable, or import a .env file."
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                    <div
                      v-if="!editing"
                      class="flex items-center gap-(--spacing-xs) self-end"
                    >
                      <Button
                        label="Upload"
                        icon="pi pi-upload"
                        kind="outlined"
                        size="medium"
                        @click="fileInput?.click()"
                      />
                      <input
                        ref="fileInput"
                        type="file"
                        accept=".env,.txt,text/plain"
                        class="sr-only"
                        tabindex="-1"
                        aria-hidden="true"
                        @change="onFilePicked"
                      />
                      <ToggleGroup
                        v-model="view"
                        :options="VIEW_OPTIONS"
                        aria-label="Variables view"
                        size="medium"
                      />
                    </div>

                    <template v-if="view === 'Form'">
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
                        <template #row="{ item: entry, index, remove, removable, removeLabel }">
                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                            <Field>
                              <InputGroupRoot
                                size="large"
                                :required="keyError(entry)?.kind === 'required'"
                                :invalid="keyError(entry)?.kind === 'invalid'"
                              >
                                <InputGroupAddon>
                                  <span class="inline-block w-20">
                                    <Field.Label :for="fieldId(entry, 'key')">Key</Field.Label>
                                  </span>
                                </InputGroupAddon>
                                <input
                                  :id="fieldId(entry, 'key')"
                                  :value="entry.key"
                                  placeholder="MY_VARIABLE"
                                  autocomplete="off"
                                  spellcheck="false"
                                  :aria-invalid="!!keyError(entry) || undefined"
                                  :aria-describedby="
                                    keyError(entry) ? messageId(entry, 'key') : undefined
                                  "
                                  :class="fieldClass"
                                  class="text-label-code-sm"
                                  @input="setKey(entry, $event.target.value)"
                                  @paste="pasteIntoKey($event, index)"
                                />
                                <Tooltip
                                  v-if="removable"
                                  text="Remove variable"
                                >
                                  <IconButton
                                    icon="pi pi-trash"
                                    kind="outlined"
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
                                :required="!!valueError(entry)"
                              >
                                <InputGroupAddon>
                                  <span class="inline-block w-20">
                                    <Field.Label :for="fieldId(entry, 'value')">Value</Field.Label>
                                  </span>
                                </InputGroupAddon>
                                <input
                                  :id="fieldId(entry, 'value')"
                                  v-model="entry.value"
                                  :type="entry.secret && !entry.visible ? 'password' : 'text'"
                                  :placeholder="entry.secret ? SECRET_MASK : 'my-variable-value'"
                                  autocomplete="off"
                                  spellcheck="false"
                                  :aria-invalid="!!valueError(entry) || undefined"
                                  :aria-describedby="
                                    valueError(entry) ? messageId(entry, 'value') : undefined
                                  "
                                  :class="fieldClass"
                                  class="text-label-sm"
                                />
                                <Tooltip
                                  v-if="entry.secret"
                                  :text="entry.visible ? 'Hide value' : 'Show value'"
                                >
                                  <IconButton
                                    :icon="entry.visible ? 'pi pi-eye-slash' : 'pi pi-eye'"
                                    kind="outlined"
                                    size="large"
                                    :aria-label="entry.visible ? 'Hide value' : 'Show value'"
                                    :aria-pressed="entry.visible"
                                    @click="entry.visible = !entry.visible"
                                  />
                                </Tooltip>
                                <InputGroupAddon>
                                  <Tooltip :text="secretTooltip(entry)">
                                    <Field
                                      orientation="horizontal"
                                      :disabled="Boolean(editing?.secret)"
                                    >
                                      <Field.Label :for="fieldId(entry, 'secret')"
                                        >Secret</Field.Label
                                      >
                                      <Checkbox
                                        v-model="entry.secret"
                                        binary
                                        :input-id="fieldId(entry, 'secret')"
                                        :aria-label="secretAriaLabel(entry)"
                                      />
                                    </Field>
                                  </Tooltip>
                                </InputGroupAddon>
                              </InputGroupRoot>
                            </Field>
                          </div>

                          <HelperText
                            v-if="keyError(entry)"
                            :id="messageId(entry, 'key')"
                            :kind="keyError(entry).kind"
                            :label="keyError(entry).message"
                          />
                          <HelperText
                            key="helper-text-2"
                            v-if="valueError(entry)"
                            :id="messageId(entry, 'value')"
                            :kind="valueError(entry).kind"
                            :label="valueError(entry).message"
                          />
                        </template>
                        <template #limit>Edit one variable at a time.</template>
                        <template #info>
                          <HelperText
                            v-if="!editing"
                            label="Paste JSON or .env contents into an empty key field to create one row per variable."
                          />
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
                      <HelperText>
                        Use a JSON object format, for example:
                        <code class="text-label-code-sm">{"API_URL":"https://example.com"}</code>
                      </HelperText>
                      <HelperText
                        v-if="jsonError"
                        :id="formId + '-json-message'"
                        kind="invalid"
                        :label="jsonError"
                      />
                    </template>

                    <HelperText :label="SECRET_HINT" />
                    <HelperText
                      v-if="submitted && noVariables"
                      kind="required"
                      label="Add at least one variable."
                    />
                  </div>
                </SettingsSection>

                <SettingsSection
                  title="Scope"
                  hint="Global covers the entire account and turns off when you enable a specific scope. Each scope starts with every resource selected. Scope cannot be changed after the variable is created."
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                    <div
                      v-for="scope in scopes"
                      :key="scope.type"
                      class="flex min-w-0 flex-col gap-(--spacing-xs)"
                    >
                      <InputGroupRoot
                        size="large"
                        :required="scopeError(scope)"
                      >
                        <InputGroupAddon>
                          <span class="w-20">{{ scope.label }}</span>
                        </InputGroupAddon>
                        <span
                          v-if="scope.type === 'global'"
                          class="flex h-full min-w-0 flex-1 items-center bg-(--bg-canvas) px-(--spacing-md) text-label-sm text-(--text-default)"
                        >
                          The entire account
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
                            :required="scopeError(scope)"
                          >
                            <MultiSelect.Trigger
                              :aria-label="scope.placeholder"
                              :aria-describedby="
                                scopeError(scope) ? formId + '-scope-' + scope.type : undefined
                              "
                            />
                            <MultiSelect.Content>
                              <template #search>
                                <Input
                                  v-model="scope.query"
                                  size="small"
                                  placeholder="Search"
                                  aria-label="Search"
                                  @keydown.stop
                                >
                                  <template #iconLeft>
                                    <i
                                      class="pi pi-search"
                                      aria-hidden="true"
                                    />
                                  </template>
                                </Input>
                              </template>
                              <MultiSelect.Option
                                v-for="option in visibleScopeOptions(scope)"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </MultiSelect.Option>
                            </MultiSelect.Content>
                          </MultiSelect>
                        </div>
                        <InputGroupAddon>
                          <Switch
                            :model-value="scope.enabled"
                            :disabled="scope.type === 'global'"
                            :aria-label="'Enable ' + scope.label + ' scope'"
                            @update:model-value="(value) => setScopeEnabled(scope, value)"
                          />
                        </InputGroupAddon>
                      </InputGroupRoot>
                      <HelperText
                        v-if="scopeError(scope)"
                        :id="formId + '-scope-' + scope.type"
                        kind="required"
                        label="Select at least one resource for this scope."
                      />
                    </div>
                  </div>
                </SettingsSection>
              </fieldset>
            </PanelContent>

            <PanelFooter>
              <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
                <div class="flex min-w-0 items-center gap-(--spacing-sm)"></div>
                <Button
                  label="Save"
                  kind="primary"
                  size="medium"
                  :loading="submitting"
                  type="submit"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete variable"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The selected variable will be deleted, and services in its scope stop reading it on their
          next deployment.
        </p>
        <p
          :id="confirmLabelId"
          class="m-0 text-body-sm text-(--text-default)"
        >
          Type <code class="text-label-code-sm">{{ pending?.key }}</code> to confirm.
        </p>
        <Input
          v-model="confirmation"
          :aria-labelledby="confirmLabelId"
          autocomplete="off"
          class="w-full"
          @keydown.enter="confirmDelete"
        />
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          kind="outlined"
          size="medium"
          @click="close"
        />
        <Button
          label="Delete variable"
          kind="danger"
          size="medium"
          :disabled="!canDelete"
          @click="confirmDelete"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
```
