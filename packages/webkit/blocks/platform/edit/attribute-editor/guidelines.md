# Attribute editor

A list of key and value pairs and the drawer that edits them, here environment variables. The user scans the variables already defined, then opens Create Variable to type or paste several pairs at once, mark the sensitive ones as secret, and select where they apply (the whole account, or specific environments, projects, services or policies) before saving them in one step.

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

### C. Variables table — `Card`, `TableRoot`, `CopyButton`, `Avatar`, `Tooltip` (required)

`Card :padded="false"` around a borderless data-driven `TableRoot` bound with `v-bind="tableProps"`, with Key as the `principal`, unhideable column, then ID (hidden by default), Value, Scope and Last modified. ID and Value end with a `CopyButton`; a secret value shows its mask and loses its copy control. Last modified pairs the author `Avatar`, named in a `Tooltip`, with the relative time. See `skills/webkit-tables`.

### D. Row actions — `DropdownMenu`, `Tooltip`, `IconButton` (required)

An ellipsis `IconButton` named Row actions opens a `DropdownMenu` placed `bottom-end`: Edit and Clone in the first group, Delete alone in the last. Edit opens the drawer on that variable; Clone inserts a copy right below it with `_COPY` appended to the key; Delete opens the confirmation dialog.

### E. Create and edit drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent` (required)

A right-side `Drawer` whose content is one `form` labeled Create Variable or Edit Variable. `PanelHeader` holds the `DrawerTitle` and `DrawerClose`; `PanelContent` scrolls the Variables and Scope sections. The form resets every time the drawer opens: from Create Variable, one empty pair, the Form view, Global the only scope on; from a row's Edit, that variable's pair and scopes, with no Upload, view toggle or Add variable. A saved secret is never shown: its value starts empty, an empty value keeps the saved secret, and the Secret checkbox is locked. See `skills/webkit-create-surface`.

### F. Variables section — `SettingsSection`, `Button`, `ToggleGroup` (required)

A `SettingsSection` titled Variables with a hint that says what variables are for. Its toolbar holds an outlined Upload `Button` that reads a `.env` or text file into rows, and a medium `ToggleGroup` that switches between the Form and JSON views of the same data.

### G. Key and value rows — `InputGroupRoot`, `InputGroupAddon`, `Input`, `Tooltip`, `IconButton`, `Checkbox`, `HelperText` (required)

Each variable is two large `InputGroupRoot` rows. The Key row joins a Key label addon, a code-font field that turns spaces into underscores, and a Remove variable `IconButton` (hidden while only one pair is left). The Value row joins a Value label addon, the field, a Show value `IconButton` and a Secret `Checkbox` named by a `Tooltip`. Errors render as `HelperText` under the pair. An outlined Add variable `Button` below the list is enabled only when the last pair is filled. Pasting `.env` or JSON contents into an empty key creates one row per variable.

### H. JSON view — `Textarea`, `HelperText` (optional)

The JSON view replaces the rows with one `Textarea` labeled Variables JSON over the same entries; a `HelperText` reports a parse error in place. Switching back to Form keeps what was typed.

### I. Scope — `SettingsSection`, `InputGroupRoot`, `InputGroupAddon`, `MultiSelect`, `Input`, `Switch`, `HelperText` (required)

A `SettingsSection` titled Scope with one large `InputGroupRoot` per scope type: a label addon, a `MultiSelect` of resources with a search `Input` (Global shows "The entire account" instead), and an enable `Switch`. Global turns off when any specific scope turns on. An enabled scope with no resource selected shows a required `HelperText`.

### J. Drawer footer — `PanelFooter`, `Button` (required)

`PanelFooter` holds one primary medium Save `Button` at the end, which submits the form and shows its loading state while saving.

### K. List states — `EmptyState`, `Button` (required)

With no variables at all, the card holds a first-use `EmptyState` (`No variables yet`) with Create Variable and Documentation. When the filter matches nothing, the table's `#empty` slot holds a no-match `EmptyState` (`No matching variables`) with an outlined Clear filters `Button`.

### L. Delete confirmation — `ConfirmDialog`, `Alert`, `Input`, `Button` (required)

The dialog of `platform/delete/delete-with-confirmation`, titled Delete variable: a warning `Alert`, one sentence on the consequence, and an `Input` where the user types the key. The danger Delete variable `Button` stays disabled until the trimmed value equals the key; Cancel closes the dialog.

## Do

- Validate only after Save is pressed; then flag each empty, malformed or duplicated key under its own pair and move focus to the first field in error.
- Keep secret values masked in the list and in the drawer, and say in the hint that secrets are write-only once saved.
- Let users bring pairs in bulk: Upload, paste into a key, or edit as JSON.
- Keep the label of each field inside its `InputGroupAddon`, tied to the field by `for`.
- Reset the drawer on open so a closed and reopened drawer never shows stale rows.
- Follow `skills/webkit-form` for required states and `skills/webkit-lists` for the list page.

## Don't

- Don't show required errors on first render or while the user is still typing the first pair.
- Don't offer Remove on the last remaining pair.
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
- **Buttons:** verb first, three words or fewer, e.g. "Upload", "Add variable", "Save".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Every key and value field has a visible `label` in its addon; an invalid field sets `aria-invalid` and points to its `HelperText` through `aria-describedby`.
- Icon-only controls (Remove variable, Show value, Hide value, row actions, toolbar) carry an `aria-label` that matches their `Tooltip`.
- The Secret `Checkbox` and each scope `Switch` have an `aria-label` naming what they toggle, e.g. "Enable Project scope".
- The `ToggleGroup` is labeled "Variables view"; the hidden file input is removed from the tab order and the Upload button triggers it.
- Adding a pair moves focus to its new Key field.
- The drawer traps focus while open and returns it to Create Variable on close.

## States

- List: the variables list page with the controls row and table; the drawer is closed.
- First use: no variables yet; the card holds the first-use `EmptyState` with Create Variable.
- No match: the filter matches nothing; the table shows the no-match `EmptyState` with Clear filters.
- Edit: a row's Edit opens the drawer on that variable; Save replaces it in the list.
- Delete: a row's Delete opens the typed confirmation; confirming removes the row.
- Create: the drawer open with one empty pair, the Form view and Global on; errors appear only after Save.

## Related

- `platform/create/create-in-drawer` — the general drawer create pattern this drawer follows.
- `platform/view/table-view` — the controls row and table recipe the list page reuses.
- `platform/edit/rule-builder` — a drawer for ordered conditions and behaviors instead of free pairs.
- `platform/states/form-validation` — when and how errors appear after Save.
- `InputGroupRoot` — joins label, field and actions into one row; see `skills/webkit-form`.
