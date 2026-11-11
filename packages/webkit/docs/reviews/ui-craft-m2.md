# ui-craft review — Milestone 2

The mandatory `ui-craft` progression (`.claude/skills/ui-craft/SKILL.md`) for what each M2.9 work package adds. One section per work package. Real defects that could not be fixed here are rows in ROADMAP M2.10.

## WP editors

Scope: `AttributeEditor`, `TagEditor`, `ButtonGroup`, `Combobox`, `CodeEditor`, `SchemaForm`, `useUnsavedChanges`, the `Tabs` dirty mark, the rebuilt `platform/edit/attribute-editor` block and its `PasteEnv` variant, `edit-resource#StaleRecord` and `#DangerZone`, and the `platform/edit/code-editor` block (now on `CodeEditor`). A mechanical pass over every new SFC, block variant and example found no raw colours, palette classes, physical direction utilities or raw sizes, and every transition carries a `motion-reduce` escape.

### AttributeEditor

- Finding: rows are a `ul` of `li`, each cell a `Field` with its own label (visually hidden above the container breakpoint, where the column header shows it), so every input has a name at every width. No defect.
- Finding: add and remove move focus (to the new row's first field, to the next row or Add) and announce "Item n added / removed" politely. No defect.
- Finding: the prop `isItemRemovable` broke the prop vocabulary (no `is` prefix). Fixed: renamed `itemRemovable` (spec, `.vue`).
- Finding: the `cell-<key>` dynamic slot cannot be a row of the spec's Slots table (the compliance check reads literal names). Fixed: documented as a dynamic slot under the table, like `SchemaForm`'s `field:<path>`.

### TagEditor

- Finding: a key that both used the reserved prefix and exceeded the length limit reported only the length. Fixed: the reserved-prefix message wins (it is the one the user must act on first), as Cloudscape orders it; a test covers it.
- Saved tags: read-only key, Remove marks for removal with Undo and a visible "will be removed when you save" note, so a remove is never silent. No defect.

### ButtonGroup

- `role="toolbar"` with one tab stop, roving focus, Home and End, and arrows that follow the reading direction (tested under `dir="rtl"`). Toggles carry `aria-pressed`; the overflow is a `DropdownMenu`. No findings.

### Combobox

- Finding: it hand-rolled `modelValue` plus `update:modelValue`. Fixed: `defineModel`, spec moved to a `v-model` section.
- Finding: the test id fallback was `combobox`, against the `input-<name>` convention. Fixed: `input-combobox`.
- APG combobox pattern (`aria-activedescendant`, `aria-autocomplete`, listbox popup in a portal that keeps the provider's `dir` and `lang`, a polite count). No other findings.

### CodeEditor

- Finding: the problems list read "Warning:Line 2Careful" (no spaces between the severity, the line and the message), which a screen reader runs together. Fixed: the separators are part of the text.
- Finding: the test id fallback was `code-editor`. Fixed: `code-code-editor`.
- Tab indents, and Escape then Tab leaves; the hint says so and is tied to the field by `aria-describedby`. Read-only does not trap Tab. The code stays `dir="ltr"` under an RTL page. Monaco is themed from the tokens and re-themed when the theme changes. No other findings.
- Finding: the `platform/edit/code-editor` block hand-rolled its code and schema documents with `Textarea` (rule 1, components only). Fixed: both are `CodeEditor` in the primary and the three variants, and the guidelines say how a product passes the Monaco loader.

### SchemaForm

- Each property is a `Field` (label, description, Required tag, error), nested objects are `fieldset` with a legend, and validation shows on leaving a field or after `validate()`, which focuses the first invalid control (the `webkit-form` rule). No findings.
- Finding: the slot scope interface was declared before `Props`, so the spec check read it as the props. Fixed: moved after `Props`.

### useUnsavedChanges and the Tabs dirty mark

- The leave dialog is the `ConfirmDialog` with built-in copy in three locales, with Save changes only when `onSave` is given. No findings.
- The dirty dot is decorative (`aria-hidden`), keeps a forced-colours fill, and the tab's name gains a hidden "Unsaved changes", so the state is not colour-only. No findings.

### Blocks

- `attribute-editor#PasteEnv`: the paste panel reports what it found, what it skips and what it replaces before anything lands, and returns focus to Paste .env. Finding: `font-mono` on the `Textarea` overrode the component's styles (consumer lint). Fixed: the code font comes from a wrapper.
- `edit-resource#StaleRecord`: a warning `Alert` in a polite region with Reload (and Undo reload), Overwrite behind a `ConfirmDialog`; the form-error rule applied to edits. No findings.
- `edit-resource#DangerZone`: the destructive action sits in its own settings section and goes through the type-the-name `ConfirmDialog` of `delete-with-confirmation`. No findings.

## WP app-layout

Scope: `AppLayout`, `Board` (`Board.Item`) and the `platform/dashboard/configurable-dashboard` block rebuilt on it, `TutorialPanel` (`TutorialPanel.Provider`) and `Hotspot`, `ErrorBoundary`, the `platform/states/not-found` block (404, 403, 500, missing record) and the `shells/console#Notifications` variant. A mechanical pass over every new SFC, block variant and example found no raw colours, palette classes, physical direction utilities or raw sizes, and every transition and animation carries a `motion-reduce` escape.

### AppLayout

- Regions are landmarks or labelled sections: navigation, the header slot, notifications above the content, the split panel and the tools region (`section` named by its `h2`). Compact mode is decided by the layout's own width (`compactBelow`, measured with a ResizeObserver), not the viewport, so the frame works inside a narrow host; navigation and tools become `Drawer`s there and the split panel moves to the bottom. No defect.
- Finding: the split panel and tools bodies scroll but held no focusable control in the Default example, so axe raised `scrollable-region-focusable` and a keyboard reader could not scroll them. Fixed: both bodies are `tabindex="0"`, `role="group"` named by the panel heading, with an inset focus ring; spec updated.
- The split separator is a `role="separator"` with value, min and max, arrow keys with a Shift step, Home and End, mirrored under RTL; the size and position persist under `storageKey`. No defect.
- Finding: the IconButtons passed `:aria-label`, which vue-tsc rejects against IconButton's required `ariaLabel`. Fixed: bound as `ariaLabel`.

### Board and configurable-dashboard

- `Board` is a labelled `ul`; each `Board.Item` an `li`. Moving (drag handle or arrow keys on it) and resizing (corner, arrows, Shift) announce the new position or span politely ("Requests over time moved to position 2 of 6."). No defect.
- Finding: the spec listed `update:layout` as an event while the `.vue` uses `defineModel`, so the compliance check failed. Fixed: moved to the v-model table with an Emits column, like `LogView`.
- `ChartCard` reads an enclosing `Board.Item` (additive): span, height, drag and keyboard move route through the board, so the block keeps one card component. The block's Edit layout is a pressed toggle, the span shows as a Tag only while editing, and Reset restores the default layout. No defect.

### TutorialPanel and Hotspot

- The panel lists tutorials with task and step counts, runs one with a progress list, and ends on a completion heading that receives focus. The hotspot marker is a 24 px button with a 40 px hit area, named "Tutorial step: <title>", whose pulse stops under reduced motion. No defect.
- Finding: `side="start"` reversed the row with `flex-row-reverse`, so the visual order and the tab order disagreed. Fixed: the marker renders before the control in the DOM; the test asserts DOM order.
- Finding: the spec's motion table named Popover's own animation class, which the compliance check read as missing from `hotspot.vue`. Fixed: reworded.

### ErrorBoundary

- Catches a render error in its subtree, shows a danger `Alert` with Try again in the region's place (focus moves to it only when focus was inside the failed region, and back to the region on retry), emits `error` for reporting and keeps the rest of the page alive. Copy says the rest of the page still works. No findings.

### not-found block

- Each variant has one hidden `h1` with the code, a plain-words `EmptyState` title, at most two actions, and no auto-redirect; the 500 gives a quotable reference in `bdi`. Finding: the Docs and System status links pointed at product URLs, against product-neutral block data. Fixed: `example.com`.

### shells/console#Notifications

- Finding: the variant failed the consumer lint: classes on `<AppLayout>`, `<GlobalHeader>` and `<Badge>`. Fixed: moved to wrapper elements.
- Finding: building blocks named components the primary does not import, which the pattern check rejects. Fixed: described in the Notifications state instead.
- The bell is a pressed toggle that names the unread count; the Badge is hidden from assistive technology; unread items carry a hidden "Unread:" prefix, not colour alone; deploy notifications offer Edit and Redeploy (async-submit rule), never View deployments.
