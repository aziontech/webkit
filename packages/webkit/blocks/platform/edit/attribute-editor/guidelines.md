# Attribute editor

A list of key and value pairs and the drawer that edits them, here environment variables. The user scans the variables already defined, then opens Create Variable to type or paste several pairs at once, mark the sensitive ones as secret, and choose where they apply (the whole account, or specific environments, projects, services or policies) before saving them in one step.

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

`PageHeader` titled Variables with a one-sentence description and two actions: an outlined Documentation and the primary `Create Variable`, which opens the drawer.

### B. Controls row — `Popover`, `Button`, `Input`, `Tooltip`, `IconButton`, `Switch` (optional)

The same controls row as `platform/view/table-view`: a Filter `Popover` (Author, Type and Last Modified fields), a search `Input` labeled "Search variables", and outlined `IconButton`s for Refresh, Download CSV and Columns, each named by a `Tooltip`. The Columns popover holds a `Switch` per hideable column and a Show all columns `Button`.

### C. Variables table — `Card`, `TableRoot`, `CopyButton`, `Avatar`, `Tooltip` (required)

`Card :padded="false"` around a borderless `TableRoot` with Key as the `principal`, unhideable column, then ID, Value, Scope and Last Modified. ID and Value end with a `CopyButton`; a secret value shows its mask and loses its copy control. Last Modified pairs the author `Avatar`, named in a `Tooltip`, with the relative time. See `skills/webkit-tables`.

### D. Row actions — `DropdownMenu`, `Tooltip`, `IconButton` (required)

An ellipsis `IconButton` named Row actions opens a `DropdownMenu` placed `bottom-end`: Edit and Clone in the first group, Delete alone in the last.

### E. Create drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent` (required)

A right-side `Drawer` whose content is one `form` labeled Create Variable. `PanelHeader` holds the `DrawerTitle` and `DrawerClose`; `PanelContent` scrolls the Variables and Scope sections. The form resets every time the drawer opens: one empty pair, the Form view, Global the only scope on. See `skills/webkit-create-surface`.

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

## Do

- Validate only after Save is pressed; then flag each empty, malformed or duplicated key under its own pair.
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

- **Title and create action:** "Variables" and "Create Variable"; the drawer title repeats "Create Variable".
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
- Create: the drawer open with one empty pair, the Form view and Global on; errors appear only after Save.

## Related

- `platform/create/create-in-drawer` — the general drawer create pattern this drawer follows.
- `platform/view/table-view` — the controls row and table recipe the list page reuses.
- `platform/edit/rule-builder` — a drawer for ordered conditions and behaviors instead of free pairs.
- `platform/states/form-validation` — when and how errors appear after Save.
- `InputGroupRoot` — joins label, field and actions into one row; see `skills/webkit-form`.
