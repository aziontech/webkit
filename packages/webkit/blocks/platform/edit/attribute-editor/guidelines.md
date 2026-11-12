# Attribute editor

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
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so this page body never renders a `Toaster`.

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
