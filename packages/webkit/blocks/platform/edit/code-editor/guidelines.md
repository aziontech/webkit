# Code editor

The editing page of a service whose behavior lives in source code. The user writes and saves the code, defines the argument form each instance of the service asks for (its fields, types and defaults), and adjusts the service's settings. The editor fills the page so the code has room, and one save bar commits code, arguments and settings together.

## When to use

- A resource is mainly a document the user edits as text: function code, a schema, a configuration file.
- The document comes with a structured companion (an argument form) that is easier to edit as fields than as JSON, and the user wants both views side by side.
- The same resource also has a few settings, shown on a second tab of the same page.

## When not to use

- A resource made only of settings: use `platform/edit/edit-resource`.
- Ordered conditions and actions the user composes without code: use `platform/edit/rule-builder`.
- Free key and value pairs such as environment variables: use `platform/edit/attribute-editor`.
- Running queries and reading results: use `platform/view/query-editor`.

## Building blocks

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Breadcrumb`, `Kbd`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The platform shell from `shells/console`: the `Sidebar` with `Brand`, the `Command` search, the `Menu` of modules and the account `DropdownMenu`; the `GlobalHeader` with the Services `Breadcrumb` and the Create and Agent actions; and on small screens the same sidebar inside a `Drawer`. The breadcrumb carries the service name, so the page has no title of its own. See `skills/webkit-navigation`.

### B. Page tabs — `PageTabs`, `Tabs` (required)

A full-bleed `PageTabs` with Code and Settings as `Tabs.Item`s. Each tab keeps its state when the user switches away, so unsaved code survives a visit to Settings.

### C. Editor toolbar — `ToggleGroup` (required)

A thin bar above the editor with a `ToggleGroup` labeled Editor document that switches between the Code and Arguments documents, and a muted line describing the active one, e.g. the runtime for Code.

### D. Code document — `Textarea`, `HelperText` (required)

A flush `Textarea` with `resizable="none"` fills the pane in a code font; it is where a product embeds its code editor. An empty document on Save shows an invalid `HelperText` under the editor, cleared on the next keystroke.

### E. Arguments split — `ResizableRoot`, `ResizablePane`, `ResizableHandle`, `Textarea`, `Button` (required)

A count of fields and the outlined Add field and Remove form `Button`s sit above a `ResizableRoot`. The left `ResizablePane` holds the schema as JSON in a flush `Textarea`; it is `collapsible` with a minimum and maximum width. The `ResizableHandle` resizes it and collapses it past its minimum. The right pane holds the fields form; both panes describe the same argument form.

### F. No fields — `EmptyState`, `Button`, `Link` (optional)

When the form has no fields, the right pane shows an `EmptyState` with one sentence, an Add field `Button` and a `Link` to the arguments documentation.

### G. Field list — `Card`, `Item`, `Tag`, `Tooltip`, `IconButton` (required)

A flush `Card` with one small `Item` per field: a reorder grip, the field name and type, small `Tag`s for Required and Needs a name, and `IconButton`s to duplicate, remove and expand the field, each named by a `Tooltip`. Only the expanded field shows its settings.

### H. Field settings — `SettingRow`, `Input`, `Select`, `Switch`, `Textarea`, `HelperText` (required)

Inside an expanded field, `SettingRow`s for Name, Type, Label, Description, Required and Default, then the rows that follow the type: minimum and maximum length and a pattern for text, minimum and maximum for numbers, Choices as a `Textarea` with one value per line, List of for lists. A name error shows as `HelperText` once the field was touched.

### I. Settings tab — `SettingsSection`, `Card`, `Item`, `SettingRow`, `Input`, `Field`, `RadioButton`, `Switch`, `HelperText` (required)

The form column with four `SettingsSection`s: General (Name, required on Save), Runtime (a read-only `Input` with a lock glyph, because it cannot change after creation), Execution environment (On request or At the gateway as `Field` choice cards around `RadioButton`s) and Status (Active as a `Switch`). See `skills/webkit-form`.

### J. Save bar — `SaveBar`, `Button` (required)

A `SaveBar` slides up on the first change to code, arguments or settings, with an outlined Discard and a primary Save, both medium. If Save finds Name empty, it switches to the Settings tab and moves focus to Name; an empty Code document takes focus on the Code tab.

## Do

- Let the editor fill the pane; the page scrolls inside the editor, not around it.
- Show the schema JSON and the fields form side by side, so the user can check one against the other.
- Keep collapsed fields as one-line summaries with their tags, and open settings only for the field being edited.
- Lock fields that cannot change after creation, with a lock glyph and a description that says so.
- Use one save bar for both tabs, and take the user to the tab that holds the error.

## Don't

- Don't put the code editor inside a card, a drawer or a modal.
- Don't add a page heading above the tabs; the breadcrumb names the service.
- Don't save from inside the Arguments pane or a field; Save lives in the bar.
- Don't flag a new field's name before the user has touched it.
- Don't let the schema pane squeeze the fields pane below a usable width; collapse it instead.

## Copy

- **Tabs and documents:** single nouns, e.g. "Code", "Settings", "Arguments".
- **Field count:** a number and the noun, e.g. "1 field", "2 fields".
- **Buttons:** verb first, three words or fewer, e.g. "Add field", "Remove form", "Discard", "Save".
- **Empty state:** title states the fact, e.g. "This form has no fields"; description says what to do, e.g. "Add the first argument the service reads."
- **Errors:** short and specific, e.g. "This field is required.", "Another field already uses this name."
- **Save bar:** "You have unsaved changes."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Both editors have an `aria-label` that names the document, e.g. "Source code", "Argument form schema, as JSON".
- The split is labeled "Argument form", its panes "Schema" and "Fields", and the handle "Resize the schema".
- Field grips are focusable buttons named "Reorder" plus the field name, and move the field with the arrow keys.
- The expand button sets `aria-expanded` and `aria-controls` and names the field it opens.
- Every icon-only control has an `aria-label` that matches its `Tooltip`; decorative icons carry `aria-hidden="true"`.
- The save bar's motion respects reduced motion.

## States

- Code: the Code tab with the Code document filling the editor pane.
- Arguments: the Arguments document of image-optimizer, the schema on the left and two fields on the right, one expanded.
- NoArguments: the Arguments document of a service with no form, the empty schema and the no fields empty state.
- Settings: the Settings tab with General, Runtime, Execution environment and Status; editing raises the save bar.

## Related

- `shells/console` — the platform shell around this page.
- `platform/edit/edit-resource` — the settings form and save bar pattern the Settings tab follows.
- `platform/view/query-editor` — an editor page that runs queries and shows results.
- `platform/detail/version-detail` — reading a deployed version of the code.
- `ResizableRoot` — the split between schema and fields; see `skills/webkit-layout`.
