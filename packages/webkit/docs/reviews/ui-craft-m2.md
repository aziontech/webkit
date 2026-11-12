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

## WP charts-2

Scope: `Chart` gains `Chart.Scatter`, `Chart.Brush` (`v-model:range`), `labelScale="linear"`, series focus from the keyboard and RTL axes (line, area, stacked area and bar parts were already in the family, so line, area, stacked-area and mixed are compositions, shown in the `mixed` example); new `GaugeChart` and `MapChart`; the `platform/view/split-view` volume histogram rebuilt on `Chart` with a brush; a `metric-panel` example of `ChartCard` with `StatTile` for the Console MetricPanel. A mechanical pass over every changed SFC and example found no raw colours, palette classes, physical direction utilities or raw sizes, and every transition carries a `motion-reduce` escape.

### Chart (scatter, brush, linear scale, RTL)

- Scatter dots use the series slot colour with a 1.5 px surface ring so overlapping dots stay countable; the active dot grows from r 4 to r 6 instead of changing colour. No defect.
- The brush band paints in `--bg-selected` edged with `--border-selected` under the marks. Pointer drag and Shift + arrows draw the same span; Enter commits, Escape steps back draft → focused series → active index → range. The live region says "Selecting from … to …" while drawing and "Selected from … to …" once committed. No defect.
- Up / Down move the focus between series; the others dim and the live region reads only the focused series, so a five-series stack is no longer a five-value announcement per step.
- Under RTL the category axis mirrors, the value axis moves to the inline end, and the arrow keys follow the reading direction (`logicalArrowKey`). No defect.
- Finding: the tooltip anchored at `left: '0px'`, which the authoring ratchet rejects. Fixed: `0`.

### GaugeChart

- A half-circle `role="meter"` with `aria-valuenow`, min and max and an `aria-valuetext` that carries the band name ("72%, Busy"); the band name also shows as text under the value, so colour never carries the meaning alone. Loading, empty and error use the chart family surface. No defect.
- Finding: the spec's Events table had an `_none_` row, which the compliance check read as an event called `_none_`. Fixed: the no-events sentence that `StatTile` uses.

### MapChart

- Countries shade on a five-step sequential scale on the `NetworkMap` dot grid; points draw as bubbles by area. One tab stop walks the places from the highest value down with a tooltip, a polite announcement and a table twin (Name, Value), and the legend has a screen-reader sentence ("From … to …"). The country geometry is a lazy chunk, so the entry stays near 17 KB. No defect.
- The map carries values by place, not time, so it has no `timeZone` prop; `formatValue` defaults to the locale compact format like `Chart`.
- Finding: the tooltip used `left: '0px'`. Fixed: `0`.

### split-view and metric panel

- The volume histogram is `Chart.Bar stacked` by level with `Chart.Brush`; `range` is bound to `null` and `update:range` turns the span into the period filter, so the chart, the chips and the table agree on one window. Guidelines section F names `Chart`.
- The metric panel example is a row of `ChartCard`s holding a `StatTile` with trend and footer period; no new component was needed for it.

## WP observability

Scope: `DateRangePicker`, `PropertyFilter` query mode (`mode="query"`), `Trace`, the `platform/view/split-view` variants Query, Sessions and EventDocument (the field sidebar and saved queries live inside them), `analytics-dashboard#Metrics`, `code-editor#TestRun` and `edit-resource#DataStream`. Source order: the design sample (`apps/webkit-sample/src/console/pages/observe/*`, `components/observability/*`, `shared/ui/trace/*`) first, then Console Kit Events v2 for the query bar, time range, sessions and field sidebar, then Cloudscape for the date range picker and the property filter. A mechanical pass over every new SFC, block variant and example found no raw colours, palette classes, physical direction utilities or raw sizes, no product URLs in block data, and every transition carries a `motion-reduce` escape.

### DateRangePicker

- Relative and absolute in one panel, committed only on Apply; Cancel and Escape drop the draft and return focus to the trigger. Absolute boundaries are typed as wall-clock time in the selected zone and stored as instants, so a saved range reads correctly in every zone; the trigger prints the offset (`UTC−03:00`) beside an absolute range. No defect.
- Finding: `modelValue` and `timeZone` were a hand-written prop and emit pair, which the authoring ratchet blocks. Fixed: both are `defineModel`s (controlled and uncontrolled), the spec moved them to a v-model table and the stepping test now follows the uncontrolled value.
- Previous and Next move the window by its own length and never past now; a relative range steps into an absolute one, as Cloudscape and the Console Kit do. No defect.

### PropertyFilter query mode

- Additive: tokens mode is unchanged and stays the default. Query mode is a `combobox` over one string with suggestions for the word at the caret, an invalid state that sets `aria-invalid` and points `aria-describedby` at a polite message, and `submit` with the flat token list or `null` when AND and OR mix (the field says so instead of guessing). A product grammar replaces the built-in one through `validate` and `suggest`. No defect.
- The query text keeps `dir="auto"`, so a Latin query stays left-to-right in a right-to-left page. No defect.

### Trace

- A named `treegrid` with roving focus and the tree keyboard map; each row names span, service, start, duration and outcome; a failed span carries an icon and a Failed tag, never colour alone. Selecting a row opens a details region under the waterfall, and Close returns focus to the row. No defect.

### split-view variants

- Query: `DateRangePicker` replaces the Period field and `PropertyFilter` query mode replaces both the Filter popover and the search field; the guidelines forbid offering both surfaces at once. The fields panel adds or removes `field = value` clauses, so the panel and the query never disagree. Saved and Recent queries are two popovers beside the bar. No defect.
- Sessions: investigation tabs keep their own filters, search and period, cap at five with a status line, and rename inline (F2, double click or the actions menu; Enter keeps, Escape restores). Finding: a close button inside each tab would nest a button in the `tab` (the current `Tabs` `closable`), an axe `nested-interactive` failure. Decision: close lives in the actions menu and on Delete for the focused tab; the per-tab close control is an M2.10 row.
- Harness: the three variants inherit the primary's known findings from shared components, and nothing of their own. `aria-required-children` comes from `TableRoot` (on its root and on its paginated footer, a `rowgroup` whose child is not a `row`), as for every table block. `nested-interactive` comes from `Chip` with `clickable` and `removable` (a `role="button"` holding the remove `button`) in the applied-filter chips of Sessions and EventDocument; Query has no chips, so it has no such finding. Both are recorded in `a11y-known.json` exactly as for the primary, against the brief's rule, because the fix lives in those components; WP a11y removes the entries when it fixes `TableRoot` and `Chip` (M2.10 row 4).
- EventDocument: Search in this event narrows and highlights fields with a `role="status"` count; Filter by and Exclude are `aria-pressed` toggles named with field and value, and an exclusion shows as an `is not` chip with the other filters. No defect.

### analytics-dashboard#Metrics

- Product is a page-level `PageTabs` choice and the period one `Select` that drives every tile and card and survives a product change. Rate and percentile cards turn legend totals off, since a sum of them means nothing. Built on the existing `Chart` (area, line, stacked bar) and `ChartCard`; no new chart type was needed. No defect.

### code-editor#TestRun

- The run pane sits under the editor in a vertical `ResizableRoot` and collapses past its minimum. Status, run ID with Copy, request and outcome, run details in skeletons while running, the `Trace` with `v-model:selected`, and the logs on the same clock. After the merge the code and schema documents are `CodeEditor`s, like the primary. No defect.

### edit-resource#DataStream

- The choice that decides other fields comes first; destination fields follow the connector, and credentials cannot be read back. A preset template is read-only in a `CodeBlock` with Copy; a custom data set is now a `CodeEditor` (`language="json"`). An endpoint that does not answer the test record follows the form-error rule: one danger `Alert` above Destination with Send test record, the URL invalid with its reason and focused, every other change kept. Settings saves are not deploys, so the async-submit toast does not apply. No defect.

## WP deploy-release

Scope: new `TopologyDiagram` (on `Flow`'s connector engine and anchors, no node-graph dependency) and `OutcomeMark`; new blocks `platform/create/release-impact` (primary plus Loading, Unavailable, MissingVersion, Failed) and `platform/create/deploy-progress-dialog` (primary plus Succeeded, PartialFailure, Drop); new variants `deploy-drawer#Environment`, `deploy-drawer#Dependencies` and `version-detail#Revert`. A mechanical pass over every changed SFC and example found no raw colours, palette classes, physical direction utilities or raw pixel sizes, and every transition carries a `motion-reduce` escape. Every deploy screen ends in the async-submit toast with **Edit** and **Redeploy** (`toast({ actions })`); none says View deployments.

### TopologyDiagram

- Columns are an `ol` of `li` (one per depth); node cards are disclosure buttons with `aria-expanded` and `aria-controls`, the closed body is `inert`. Connectors are the `Flow` paths, `aria-hidden`, dashed and flowing with `motion-reduce:animate-none`. An overflowing scroll area becomes a focusable named group, so keyboard users can pan. No defect.
- Unbound slots read "Not bound" in a dashed card; the bind control is a `DropdownMenu` (existing options, Create, Remove) whose icon trigger is named "Bind <kind>" and carries a `Tooltip`. No defect.
- Finding: the spec listed `update:expanded` in the Events table, which the compliance check reads as an emitted event; `v-model:expanded` already documents it. Fixed: row removed, checksum refreshed.
- Finding: `topology-node.vue` is checked against the root spec's motion table and lacks `animate-flow-dash` (the root draws the connectors). Same checker limitation `Flow`'s sub-components carry; baselined like them.

### OutcomeMark

- `role="img"` with a name from the locale catalog per severity (Succeeded, Failed, Needs attention, Not set) or `ariaLabel`. The disc scales in and the glyph draws after it with the duration and ease tokens; static under reduced motion (the script checks the media query and skips the pending frame). Neutral uses the raised surface with a border so it does not read as disabled text. No defect.
- Finding: the glyph delay used `delay-(--transition-duration-moderate-01)`, which the motion rule rejects as a hardcoded delay (there is no delay token). Fixed: `delay-150`, the same 150 ms, as `StickyStack` does.

### release-impact

- One primary action (Deploy release) behind a `ConfirmDialog` whose sentence names resources, versions and reach. A resource with no Ready version blocks the commit with a warning line that says why, until the resource is left out with its `Switch`. The impact card has Tree and Flow views on one `ToggleGroup`, and loading, unavailable (deploy stays possible) and partial states. No defect.
- Finding: the per-dependency version `Select` was labelled by a `Field.Label` with `sr-only`, an override of a webkit component. Fixed: the `Select.Trigger` carries `aria-label="Version of <name>"`.
- Finding: the footer buttons used `md:w-auto` and the impact spinner `size-4 text-(--text-muted)` on webkit tags. Fixed: wrappers (`w-full md:w-fit`, a `size-4` span with the colour) as the other blocks do.

### deploy-progress-dialog

- For the drop-to-deploy path only (the toast stays the standard for everything else, guidelines say so). The title counts while running and states the result when settled; a large animated `OutcomeMark` lands before it; rows lead with a small mark once settled; a `role="status"` line announces the result once. Close is disabled while the run goes on; Retry failed appears only after failures. No defect.
- Finding: 33 consumer-lint overrides on webkit tags (`DialogDescription` text classes, `PanelContent` and `PanelFooter` layout, `mt-0.5` on `OutcomeMark`, `Spinner` size, `md:w-auto` on buttons). Fixed: the description takes its default style, layout moves to inner wrappers, the leading glyph sits in a `mt-0.5` span.

### deploy-drawer#Environment, #Dependencies and version-detail#Revert

- Environment: a locked Strict environment, an Also deploys tag, the replace and multi-environment `Alert`s, and Projects impacted grouped per environment and reloaded on switch; the toast names the targets. Dependencies: the open disclosure shows a shared dependency, a not-versioned integration and one with no ready version that blocks Deploy; the first run fails and its toast offers Edit and Redeploy. Revert: an earlier version is read-only with a Viewing `Tag` and `aria-current` in history; the primary action opens a `ConfirmDialog` with the diff in words. No defect.
- Finding: guidelines for `version-detail` section H named `ConfirmDialog` and `Toaster`, which only the variant imports. Fixed: the heading names `Button` and `Tag`, the prose keeps the dialog and toast.

## WP sql-storage

Scope: new `FileTokenGroup` (files picked for upload as removable tokens with size, date, progress, error and warning) and `UploadProgress` (floating transfer card for upload, move and delete); new block `platform/edit/schema-editor` (primary CreateTable plus AddColumn, InsertRow, ChangeType, TruncateTable, Failed); new variants `query-editor#TableData` and `#CreateDatabase`, `file-browser#Uploading` and `#MoveObject`. The query editor's SQL `Textarea` became `CodeEditor` (`language="sql"`, error markers on the failing line) and its hand-drawn row grid became a selectable, paged `TableRoot` in the primary and every variant. A mechanical pass over every new SFC and example found no raw colours, palette classes, physical direction utilities or raw pixel sizes, and every transition carries a `motion-reduce` escape. No storage or schema change is a deploy, so every outcome toast carries actions that fit the item (Open folder, Retry failed, Undo, Insert row, Add column, Change type, Change again, Insert another, Open database, Create Table), never View deployments, Edit or Redeploy; the guidelines say why.

### FileTokenGroup

- A named `ul` of tokens; each remove button is named `Remove <file>` and described by the token's error or warning line; removing moves focus to the next token, the previous one or the list. Errors and warnings are text with an icon, not colour alone. Show more is a real button with `aria-expanded`. File names sit in `<bdi>`. No defect.
- Finding: `IconButton` received the kebab `aria-label`, which `vue-tsc` rejects against the required `ariaLabel` prop (M2.10 row 15). Fixed: `:ariaLabel`.

### UploadProgress

- A `section` region named File transfers; the header text is mirrored in one polite `role="status"`, so each finished file and the outcome are announced, not every percent. The overall bar is named by the header, each row bar by its file. Finished state swaps the operation glyph for an animated `OutcomeMark`; Close only appears then. Floating anchors with `end-*` and spans the width minus the gutters below 640 px. No defect.
- Finding: same kebab `aria-label` on `IconButton`s, and `slots.actions` read through the index signature. Fixed.

### schema-editor

- Drawers follow create-in-drawer: a `form` named by its title, a disabled-while-saving `fieldset`, validation on submit only, `Field` for every label, description and error. The column grip is a real button that reorders with ArrowUp and ArrowDown and keeps focus on the moved row. Change type and Truncate show the SQL that will run in a read-only `CodeEditor`; Truncate asks for the table name. The server's name conflict follows the form-error rule (section `Alert` plus the field). No defect.
- Finding: 36 consumer-lint `no-style-override` hits, `font-code` on webkit `Input`s. Fixed: removed; the code font stays on plain spans (column names, types, the type list).
- Finding: the guidelines first named variant-only components in building-block headings. Fixed: headings name only primary imports.

### query-editor#TableData, #CreateDatabase and the editor swap

- TableData: header slots show name, type and a key on the primary key; `NULL` is muted italic; selection resets per table; the bulk Delete is a danger button that only appears with a selection and ends in a toast with Undo. CreateDatabase follows the sample's create page: one Name row, Advanced with Active, a save bar that says Unsaved changes, the name conflict on the field and Retry in a toast for a request that never arrived; focus returns to Name after a failed submit. No defect.
- Finding: building blocks K and L were lettered before J and named variant-only components. Fixed: moved after J, headings name primary imports, the prose lists what the variant adds.

### file-browser#Uploading and #MoveObject

- Uploading: the dialog keeps refused files with the reason and leaves them out of the count on the primary button; the page drop overlay is `aria-hidden` because Add to files is the keyboard path; transfers never block the page; finished files land in the table one by one. MoveObject: the destination is a `Combobox` of folders that accepts a new path, validated on Move with the reason under the field. No defect.
- Decision: the `Toaster` sits at `top-right` in both variants, because the floating transfer card holds the bottom inline-end corner.
- Finding: Move stayed enabled with only folders or the `..` row selected and then did nothing. Fixed: disabled until a file is selected. Open: `TableRoot` cannot make single rows unselectable, so folders and `..` still take a checkbox (M2.10 row 24).

## WP firewall-rules

Scope: new blocks `platform/view/rules-list` (Application primary; Firewall, ReviewChanges, SaveFailed, Searching, Empty, Loading) and `platform/view/waf-tuning` (Default; Allow, AllowFailed, Empty, Loading); new variants `attribute-editor#NetworkList` and `create-in-drawer#Certificate`; `platform/edit/rule-builder` criteria rebuilt on `AttributeEditor` grouped mode (M2.10 row 11). Sources: the design sample's `RulesEngine.vue`, `FirewallRulesEngine.vue` and `WafTuning.vue`; Console Kit's `order-dialog.vue` and `ReorderedRulesPreview.vue` (review before save), `ListWafRulesTuning.vue` and its allow dialog (reason required), and the network list and certificate form fields.

### rules-list

- Structure: phases are an `Accordion` (all open), one data-driven `TableRoot` per phase; order is behavior, so nothing applies until Review changes and Save. Moves are collected, counted in the `SaveBar` and listed per phase in the review `Dialog` (every rule whose position changes, and every rule turned on or off). States: loading (table skeleton), empty phase (`EmptyState` with Add Rule), search no-match (table `empty` slot), save failure (danger `Alert` in the dialog, Save again).
- Keyboard and announcements: grip with Up and Down, Move up and Move down, and a typed position (Enter commits, Escape cancels); each move is announced in a polite `role="status"` that exists from the first render, and focus follows the moved rule to the same control (the grip when that control is now disabled). Disabled controls carry their reason in the name and tooltip. Covered by `src/test/rules-list-block.test.ts` (6 tests).
- Finding: the first cut used a composed `Table` with fixed widths on `Table.Cell` and the drag state on `Table.Row` (77 consumer-lint overrides, and `webkit-tables` asks for data-driven tables). Fixed: `TableRoot` with `width` columns; each cell slot wraps its content in one element holding the rule id and drag state, and the panel delegates drag over and drop, so rows still stack as cards when narrow.
- Finding: after a successful save the Review changes button unmounts with the `SaveBar`, and `Dialog` skips focus return to a detached element, so focus fell to `body`. Fixed: focus moves to the rules region (`tabindex="-1"`), asserted in the test.
- Finding: footer buttons used `md:w-auto` and `PanelFooter` layout classes, and the search `Input` carried grow and basis. Fixed with wrappers, as the other WPs did.

### waf-tuning

- The threshold settings (Time range, Minimum hits with whole-number validation) apply as they change; the allow action names its count; the dialog says how many allowed rules will be created and requires a reason, validated only after Allow rules, with focus moved to it. Success clears the selection and moves focus to the results region; failure keeps the input with a danger `Alert`. Example addresses use the documentation ranges only.
- Finding: same wrapper fixes as rules-list (`Field` widths, search, footer). Axe on the open dialog is clean (`src/test/firewall-drawers-block.test.ts`).

### attribute-editor#NetworkList and create-in-drawer#Certificate

- NetworkList: a pasted list keeps every new line as a row and shows each invalid line its own error in place (per-line validation), skips lines already in the list, keeps `#` comments as the row comment; typed rows are checked after Save only, and empty rows are ignored once one row is filled.
- Certificate: the PEM is read in the browser (a small DER walk for subject, issuer and validity; no dependency), the expiry gets a `StatusIndicator` (30-day warning, expired blocks Save), the private key is never shown back. The sample PEM is a throwaway test certificate for `shop.example.com` issued by "Example Test CA"; no key is in the repo.
- Finding: `PanelFooter class="justify-end"` is an override. Fixed with an inner wrapper. Finding: guidelines sections for variant-only parts must be lettered last and name only what the primary imports (check-patterns); moved and relabelled, the rest stays in prose.

### rule-builder

- Criteria are now `AttributeEditor` grouped (labels, Add condition, Add OR group, limits 10 and 5, Remove, focus, announcements, per-cell errors after Save), the variable a `Combobox` of the phase's variables. Decision: conditions no longer reorder (And and Or do not depend on order); the old mixed And/Or join inside one group is gone, since one level of Or over And is the model the guidelines already stated. Behaviors keep drag and arrow reorder.

## WP list-kit

Scope: new `OverflowCount` (`content/overflow-count`); six cell presets on the `Table` compound (`Table.CellLink`, `Table.CellId`, `Table.CellStatus`, `Table.CellTags`, `Table.CellTime`, `Table.CellActions`); `Table` `reorderable` rows; `Table.RefreshButton` `loading` and a `Tooltip` on it and on `Table.Export`; the refresh pattern and the presets in `skills/webkit-tables`; examples `overflow-count/default`, `overflow-count/long-list`, `table/cell-presets`, `table/reorderable-rows`, `table/refresh`. Already on the branch and not rebuilt: `Table.Export` / `exportCsv` (CSV of the visible, ordered columns) and `virtual` rows (sticky header, resizable columns, measured heights). A mechanical pass over every new SFC and example found no raw colours, palette classes, physical direction utilities or raw pixel sizes, and every transition carries a `motion-reduce` escape.

### OverflowCount

- One shape for every "+N": a small secondary `Tag` in a `Popover` trigger named `Show all <n> <noun>` (the visible `+3` alone does not say what it counts). The popover follows the overflow rule of `webkit-ux-heuristics`: summary (`3 domains`, `10 of 33 tags`), search past 7 items, Load more in batches of 10, a no-match line quoting the query, a polite status region, reset on close. Entries that open a new tab say so in hidden text; every entry is `dir="auto"`. No defect.
- Decision: the search threshold is 7 (our heuristics rule, Cloudscape) rather than the design sample's 10; Load more is synchronous (the sample's 420 ms fake latency is demo data, not design).
- Finding: axe `aria-dialog-name` on the open popover (a `role="dialog"` with no name). Fixed: the summary is the `PopoverTitle`, so the dialog is named by it.
- Note: the chip is 20 px tall (the small `Tag`); it passes WCAG 2.5.8 through the spacing exception in a cell (8 px gap to its neighbours), not through its own size.

### Table cell presets

- Rule 10 of ui-craft ("one shape per recurring element, built once") is now code: the cross-resource link, the domain cell, the ID, the status chip, the tag list, the last-modified cell and the row menu are components, so a list cannot drift from the others. The skill's recipes now point at them.
- `CellLink` keeps the three link rules (destination tooltip, fixed 12 px mark, no mark without a destination), underlines on hover only, stops the click before a clickable row, and uses the app's registered `RouterLink` for `to` (plain `href` without a router). `CellId` keeps IDs `dir="ltr"`. Copy buttons pin to the end edge with `ms-auto`, so they align down the column. No defect.
- `CellTime` folds author and time into one column (avatar with the name on its tooltip, relative time with the absolute one on its tooltip and in hidden text) and shares one minute clock across all mounted cells.
- Finding: the relative time read `46 seconds ago` and could differ between server and client render. Fixed: under an hour it reads in whole minutes (`just now` under 45 s), and the clock takes the current time when its first cell sets up.
- Finding: `CellTags` re-measured inside its `ResizeObserver` callback (a "loop completed with undelivered notifications" error). Fixed: measuring is deferred to the next animation frame.
- Finding: the presets example's actions column had an empty header (axe `empty-table-header`). Fixed: `#header-actions` renders a visually hidden `Actions`, and the skill says so.
- Empty values render a muted dash, as in the design sample.

### Reorderable rows

- A leading 40 px grip column (an outlined `pi-bars` `IconButton`, as in the design sample's rules engine) frozen at the start when other columns are. Pointer drag (pointer events, so touch works) shows the dragged row with a dashed accent outline and the drop edge as a 2 px accent line; the viewport scrolls near its edges. Keyboard: Arrow Up, Arrow Down, Home, End on a focused grip; focus stays on the moved row's grip; `Esc` cancels a drag. Each grip is named `Reorder <name>, position <n> of <total>` and described by the hint, and a polite status announces every move (WCAG 2.5.7: dragging is never the only way).
- Decision: plain arrows on the grip (the design sample) rather than Alt+Arrow (the inventory's guess); the grip is a button, so arrows do not collide with anything.
- Decision: the grips lock while a sort is applied, with the reason in their description; a sorted order cannot be reordered meaningfully.
- No defect after tests (10 behaviour, keyboard, pointer, locale, RTL and axe cases).

### Refresh pattern

- `Table.RefreshButton :loading` spins and blocks a second press while the rows stay on screen; the table's own `loading` stays for a first load. The pattern (skill `webkit-tables`): an `Updated` time beside the button (`Table.CellTime`), auto-refresh off by default on lists and on by default only on live views, 30 s / 10 s intervals, skip while hidden or while the reader is acting, never move focus or reset scroll, page, sort or selection, refresh once after the reader's own change, and a failed refresh keeps stale rows with an `Alert` and Retry.
- Finding: the example's dates were computed per render, so server and client disagreed (hydration attribute mismatch). Fixed: example dates are anchored to the current minute.

Not verified: a styled render in both themes. The browser tests run without CSS, so geometry (the tag fit, the frozen grip offset, the drop line) is unasserted; it is an M2.10 row.

## WP workload-app

Scope: `shells/console` primary (ListPage) and DetailPage rebuilt on `AppLayout`, with `closeNavigation` added to the `AppLayout` navigation slot scope (additive; spec, checksum and test updated); new variants `details-page#Application` (Overview, Versions, Deployments and a Topology tab on `TopologyDiagram`), `edit-resource#CacheSettings` and `#Protocols`, `version-detail#EnvironmentCrumb`, `multipage-create#Review` and `record-table#ImportZoneFile`. Design from the sample (`ApplicationDetail`, `panels/CacheSettings`, `WorkloadProtocolSection`, `WorkloadMutualAuthSection`, `EnvironmentCrumb`, `ReviewStep`, `lib/format/zone-file.js`, `WorkloadDetail` topology), with fictional data. A mechanical pass over every new SFC found no raw colours, palette classes, physical direction utilities or raw pixel sizes, and every transition and page animation carries a `motion-reduce` escape. Deploys (the Application deploy, cache settings, protocols) end in the async-submit toast with Edit and Redeploy; the create and the zone import are not deploys, so their toasts carry no deploy actions. Behaviour, keyboard and axe for the interactive states the harness does not reach (Topology tab, deploy drawer, field errors, the open import drawer) are in `src/test/workload-app-blocks.test.ts`.

### shells/console on AppLayout

- One `AppLayout` per state; the rail in `#navigation` drops resize and collapse inside the drawer; the header swaps the breadcrumb for the hamburger and wordmark from the header scope's `compact`, so the shell goes compact in a narrow host too. No hand-written `Drawer` is left.
- Finding: inside the `AppLayout` drawer, choosing a `Menu` item left the drawer open (the old hand-written drawer closed it). Fixed: `AppLayout` exposes `closeNavigation` in the navigation scope and all three states call it on navigate.
- Finding: building blocks for the DetailPage tab bar and environment crumb named components the primary does not import. Fixed: described in the DetailPage state instead.

### details-page#Application

- The tab row keeps one outlined Deploy with the staged count beside it as a warning `Tag`; the deploy `Drawer` lists each staged change from and to before anything runs; the Topology status line is polite. Binds only stage; the toast's Edit returns to the Topology tab.
- Finding: frame classes on `TopologyDiagram` and `PanelFooter` (consumer lint `no-style-override`). Fixed: moved to wrapper elements.
- Finding: the Source fact linked to a Build tab this page does not have. Fixed: plain text.
- Decision: Build is left out of the tab set; it is the ResourceBuild state of the same block.

### edit-resource#CacheSettings and #Protocols

- Dependent rows sit one level in under their switch or behavior; HTTP/3 turns HTTPS on, HTTPS off turns HTTP/3 and mutual authentication off; mutual authentication explains why it is off instead of hiding. Errors follow the form rule: the field turns invalid with one reason under it, focus moves to the first one on Save. The CA picker searches, shows expiry and uploads through a `Drawer` that validates name and PEM.
- Finding: the forms had no `main` landmark, so the `PageHeader` `header` counted as a second banner (axe best practice `landmark-no-duplicate-banner`, not in the WCAG harness). Fixed: each form sits in `main`.
- Finding: the Protocols breadcrumb ended on Settings, a tab. Fixed: it ends on the workload.
- Open: only the success path of the deploy is drawn; the failure toast and `Alert` are the async-submit Failed state.

### version-detail#EnvironmentCrumb

- Environment comes before version; picking an environment moves the version crumb to the version live there and each version says where it is live, in text, beside its state `Tag`. No defect.
- Open: like the primary, the crumbs hide below md, so a phone cannot switch environment from this page (same as the version switcher today).

### multipage-create#Review

- Values show with the property they are sent as; long lists show five `Tag`s and a count; Edit per band is named for its band (`Edit list settings`), and Create re-validates and opens the first step with an error. No defect.

### record-table#ImportZoneFile

- Nothing is written on drop; every line is previewed with its number, status `Tag` and reason in text (not colour alone); the counts are a polite status; errors raise one danger `Alert` that says the ready lines still import; Import is disabled at zero and the toast counts what was left out. The hidden file input is out of the tab order; Browse files is the keyboard path.
- Note: axe best practice `empty-table-header` fires on the records table's action column, which predates this WP (its header is intentionally empty); the WCAG harness does not include that rule.

## WP marketplace

Scope: `Card` `kind="integration"` (additive), new blocks `platform/view/template-browser` (Default; Preview, NoMatch, Loading, Failed) and `platform/view/marketplace` (Default; Templates, Detail, Installing, Installed, InstallFailed, NoMatch, Loading). Sources: the design sample's `IntegrationCard.vue`, `TemplateCard.vue`, `TemplateBrowser.vue`, `TemplatePreview.vue` and `pages/marketplace/Marketplace.vue` (tabs, Featured, search plus Publisher, Category and Context filters, the tile anatomy); the Console Kit's `SolutionView.vue` (vendor, version, last update, Overview) and `IntegrationInstall.vue` with `PermissionsFieldset.vue` (required application, the permissions list).

### Card integration kind

- Anatomy from the sample's `IntegrationCard`: 40 px raised logo box, name, "by" vendor in muted body-xs, description (clamped to three lines), badge. Additions the inventory asked for: `installed` (success `Tag` with a check, a prop so it reads the same everywhere), `badges` (secondary info), one `action` slot. The title is the stretched target (a link with `href`, otherwise a button that emits `select`), so the tile is one target and the action stays a separate target above it; the focus ring is inset on the stretched box, so `overflow-clip` on the card never cuts it. Vendor and title in `bdi`; logical utilities only.
- Decision: the sample's featured layout (centred, with the primary glow) is not a second kind; the Featured row uses the same tile. One shape per recurring element (rule 10).
- Finding: the first cut built "by {vendor}" by trimming a translated string. Fixed: the whole `card.byVendor` message renders in one `bdi`, so word order stays the translator's.

### template-browser

- Structure: one band, one `PropertyFilter` (no second search, no filter popover), sections in a fixed category order that drop when empty, a drawer preview so the filter and scroll stay put. States: loading (disabled filter, skeleton tiles, `aria-busy`), no match (Clear filters), failure (danger `Alert` with Retry and an Import from Git way out). Deploy is a link into `deploy-template`; this screen never runs a deploy, so the async-submit toast belongs to that flow.
- Finding: the hover wash was a class on `<Card>` (consumer lint `no-style-override`). Fixed: the translucent `--bg-hover` wash is on the stretched target's `after` box, with `motion-reduce:after:transition-none`.
- Finding: guidelines first lettered Loading and Load failure as building blocks naming variant-only components. Fixed: described in the States lines.

### marketplace

- Structure: tabs for the two item kinds; Featured hides while filtering so results start at the top; Status (Installed or Available) is a filter property derived from where each integration runs; the tile action is named with the integration (`Install Rate Guard`). The drawer is a `novalidate` form: permissions before the target, a required Application `Field` that only errors after submit, and only the applications it is not on yet.
- Async install (async-submit rule): `loading` on Install, the field disabled, one toast id so progress turns into the outcome; success is closable with Configure and Open application, failure is permanent with Edit and Reinstall (never Retry, Try again or View deployments), and the drawer repeats the outcome as an `Alert`.
- Finding: after a successful install the field reset to empty while the submit flag stayed on, so the required error showed at once. Fixed: the flag resets on success.
- Finding (caught by `src/test/marketplace-block.test.ts`): the Installed variant called the success path without the run's application, so the `Alert` read "installed on .". Fixed: the success path records the application.
- Finding: `class` on `Tabs.Root` and `Tabs.Content` (16 `no-style-override` hits over 8 SFCs). Fixed: the section step sits on a wrapper and the panel gap on the panel's first child.
- Decision: the block opens on Integrations (the sample opens on Templates), because the template catalog has its own block and the Templates tab here only links to it.

## WP account-org

Sources: the design sample's `PersonalTokens.vue`, `panels/ActivityHistory.vue`, `panels/TeamsPermissions.vue`, `CreateTeam.vue`, `AccountSwitcher.vue`, `SwitchAccountDialog.vue` and `CardBrandMark.vue`; the Console Kit only where the sample has nothing (`mfa-setup-block`, `mfa-authenticate-block`, `checkout-block` terms, `card-flag-block` brand list). Data is fictional and product-neutral.

### OtpInput

- Decision: one real `input` laid over the boxes instead of the Console Kit's six inputs with hand-written focus moves. Autofill (`one-time-code`), password managers, paste and screen readers then see one field with one name and one value; auto-advance, Backspace and paste fall out of the native input. The caret stays at the end (arrows and Home do nothing), so the active box is always the next empty one.
- Decision: the box row is `dir="ltr"` under RTL: a code is read left to right like a phone number.
- `complete` fires once per full code (typed, pasted or autofilled), so a screen can submit without a press; the blocks keep a Verify button for keyboard users and retries.
- Finding: the `Field` description registers one tick after mount; the test waits a tick before reading the accessible description. No component change.
- Finding: Testing Library's `render` moves the mounted node, which drops focus taken in `onMounted`; the autofocus test mounts with `createApp` instead. In an app the field keeps focus.

### PaymentBrand

- Decision: monochrome marks in `currentColor` on `--bg-surface`, never the networks' fills (the sample's `#2548a0` Visa plate). They read in both themes and in forced colors, and they close the card-brand hex row (M2.11 0.5). The plate is a named image by default, so `Ending in 8888` reads `Visa, Ending in 8888`; `decorative` hides it when the row text names the brand.
- Brands the API sends in other spellings (`American Express`, `american_express`, `Diners Club`) are normalized; a lookup by own key avoids `constructor` and friends.

### platform/account/tokens

- The sample's design, with three changes for safety: revoke asks first (the sample revoked on click), Delete is offered only for expired or revoked tokens, and the reveal clears the secret when it closes. The secret is masked by default (`PasswordInput` read-only with show), with a `CopyButton` and a polite "Copied" line; the footer button reads `I copied the token` until the copy, then `Done`.
- The expiry select states the exact date it picks; a token within 7 days of expiry reads `Expires in N days` (warning) in the Status column.
- Finding: axe `landmark-no-duplicate-contentinfo` with the reveal open while the drawer closes (`PanelFooter`'s bare `footer`). Fixed at `PanelFooter` with `role="none"`, and the same on `PanelHeader` for the banner (M2.10 row 18).
- Finding: `no-style-override` on `Input`, `PasswordInput`, `PanelContent`, `PanelFooter` and `DialogDescription` (layout classes on webkit tags). Fixed with wrapper elements.

### platform/account/activity-history

- The sample is a table, not a timeline; the sample's design wins. Its FilterButton and chips become one `PropertyFilter`; the date filter is a `DateRangePicker` beside it (time is not a property token) and narrows the items before `useCollection`, newest first.
- IP addresses are `dir="ltr"` with a copy button; categories are text in a tag, not colour alone.
- An empty period is not an error: it offers the last 30 days.

### platform/account/team-permissions

- The permission matrix is a real `table` (caption, View and Edit column headers, one `tbody` per area with a `rowgroup` header holding the area checkbox, a row header per resource) instead of the sample's div grid with per-checkbox `aria-label`s; the checkboxes keep those names (`Edit Firewall`). A missing action is a dash with hidden "Not available", not an empty cell.
- Decision: Edit implies View (checking Edit checks View, clearing View clears Edit), stated under the matrix.
- Permissions in the list use `Table.CellTags` (the sample's first item plus a hand-made `+N` popover is now the preset); a team with every permission reads `All permissions`.

### auth#MfaSetup and auth#MfaCode

- Same card and frame as the other auth states; a rejected code is the field's reason (the field is cleared and keeps focus), a check that does not answer is the card's warning `Alert` with Retry, as the auth rule says. Never a toast.
- MfaSetup always offers the setup key as text with a copy button beside the QR code. There is no QR renderer in WebKit, so the block shows the API's image and, in the demo, a named placeholder (M2.10 row 35).
- MfaCode adds the recovery-code path (8 characters, alphanumeric, grouped by 4) and Sign in with another account; the form has no name of its own, so the code field is the only control named `Authentication code`.

### shells/console#AccountSwitch

- Built on the `AppLayout` console after merging workload-app. The switcher leads the header (square `Avatar`, name, chevron) with `aria-keyshortcuts` and the shortcut on its tooltip; Ctrl+O (⌘O on a Mac, detected after mount so server and client render the same tooltip) toggles the dialog.
- Each account name in the tree is a button (the sample made the whole row clickable, which a keyboard cannot reach); expand and collapse carry `aria-expanded`, search expands every match's branch.
- Finding: leaf rows reserved an empty 28 px box for the missing chevron (rule 5, "never reserve an empty glyph box"). Fixed: the type glyph carries the offset itself.

### change-plan-drawer#Checkout

- The upgrade drawer as the checkout step: Due today under the total, one note on taxes and renewal, and the terms as a required `Checkbox` whose label holds the two links. Upgrade without it marks the field invalid and focuses the checkbox; no toast.

Not verified: a styled render in both themes and RTL at 320 px (M2.10 row 37).

## WP site-sections

Scope: new sections `CapabilityGrid`, `ProcessScroll`, `StickyCarousel`, `ConsolePanel`, `CustomerSpotlight`, `SectionCommand`; the design sample's Heroes, QuoteBand and PlanMatrix as variants of `HeroBand`, `LogoWallQuote` and `ComparePlans`; docs parts `DocAccordionGroup`, `DocAccordionItem`, `DocCodeGroup`, `DocTabs`, `DocTab`, `DocHeading`, `DocCta`; `LineFigure` (engine and 25 figures); `BannerArt` (globe, map, network); every example under `examples/<name>/` for them. Source order: the design sample (`site/ui/sections/*`, `site/docs/ui/*`, `shared/ui/line-figure/*`, `shared/ui/banners/*`); the Console Kit and Cloudscape have nothing for marketing bands. ArticleIndex, CompareCompetitors and PlanMatrix already existed as `article-index-blog` / `article-index-resource-hub`, `comparison-table` and `compare-plans`, and were not rebuilt. A mechanical pass over every new SFC found no raw colours, palette classes, physical direction utilities or raw sizes, and every transition and animation carries a `motion-reduce` escape on the same class string. The rendered result was checked against the sample itself (`docs/reviews/m2.9-site-parity.md`).

### Sections

- Every section is a marketing band (rule `webkit-sections`): copy and actions arrive through props, no product-only parts (no `Table`, no form-error, no async toast). Built-in strings exist only where the band names a control: `ConsolePanel` tabs ("Console views"), `CustomerSpotlight` list and cue ("Customer stories", "Read story"), `SectionCommand` field and copy button; each is in en, pt-BR and es, and the first two take an override prop.
- Finding: `ProcessScroll` and `StickyCarousel` rendered two regions with the same name (the band and its scroll row; axe `landmark-unique`). Fixed: the band root is a plain container and the scroll row is the one focusable, named region.
- Finding: the parity check showed the sample's page data sets `kind` on each action (an outlined Docs beside the tabs); `ConsolePanel` and `CapabilityGrid` drew the first action filled. Fixed: actions take an optional `kind`, defaulting to the first secondary and the rest outlined.
- `CustomerSpotlight`: the sample's `role="list"` on a `div` with `role="listitem"` frames became a real `ul`/`li` with the `FrameBox` inside each item; the link name is "<cue>, <client>: <story>", so the reversed logo is decorative. Focus opens a card exactly like hover. The arrow glyph mirrors under RTL.
- `StickyCarousel`: the pinned row translates with the page scroll only under `motion-safe` from `lg`; the translation is inverted under `dir="rtl"`, and the sample's hard-coded `top-14` became `headerOffset` (default 3.5rem), so a page with a taller header does not hide the cards.
- `ConsolePanel`: the sample's `SegmentedButton` is `ToggleGroup` here (renamed in M1); the scene is a slot (`#scene="{ tab }"`) instead of a component prop, which is the scene convention for every band (`HeroBand` `#top`/`#bottom` too).
- `SectionCommand`: the command is `dir="ltr"` inside right-to-left pages; the `$` is decorative.
- Decision: `HeroBand` `compact-band` uses the medium hero height; `Hero` has no `small` size and adding one is outside this package. The difference is one spacing step at the top and bottom of the band (`m2.9-site-parity.md`).
- Decision: `LogoWallQuote` `kind="quote"` renders nothing without a quote; `kind="wall"` keeps its old behaviour exactly (an empty band still renders its section).

### Docs parts

- `DocAccordionGroup` keeps the sample's card (surface, rule, radius), the heading rung on the question, `text-wrap-style: pretty`, the inset focus ring and the padded panel body. `DocTabs` and `DocCodeGroup` sit on `Tabs` and `CodeBlock`, so keyboard and copy behaviour are the components'.
- Decision: a tab or sample without a title is labelled by its position ("2"), not by a built-in "Tab 2", so the parts stay free of strings.
- Decision: `DocHeading` without an `id` renders plain text; the sample drew a link to `#`.
- Decision: `DocCta` has no default copy (the sample defaulted to "Ready to build?" and "Start for free"); a page passes its own offer, and an action without a label is not drawn.

### LineFigure and BannerArt

- `LineFigure` is the sample's engine (MIT, `LICENSE` kept) and figures, unchanged apart from imports; it takes `role="img"` only when it has a name, and the sample's `console.warn` on an unknown figure is gone (it draws nothing). The figure descriptions are English asset metadata used only without `aria-label`.
- Decision: the inventory's "`Banner` `art` variants" is a sibling component, `BannerArt`, under `marketing/banner`. `Banner` is an announcement band with its own surfaces; a decorative backdrop for a hero's `background` slot is a different object. It draws WebKit's own `SpinningGlobe` and `NetworkMap`, so the system has one globe and one map. The sample's `MapMesh` traffic (rays and packets over the network map) is not drawn; it is an M2.10 row.

Not verified by the unit tests: styled geometry (the tests run without CSS). The parity screenshots cover it for the cases listed in `m2.9-site-parity.md`.

## M2.10 final leftovers (rows 7, 23, 46, 47)

Scope: new component `ArtifactCanvas` (spec, examples Default and Table) and its use in `ai-chat#Artifact`; `query-editor#ImportCsv`; `team-permissions#EditTeam`; `PromptInput`'s lazy reference chips. Source order: the design sample has `CreateTeam.vue` (edit mode) and the empty-table "Import data from CSV" button with no flow behind it; it has no artifact canvas, so that design follows the chat assistants' canvas pattern and Cloudscape's split panel. A mechanical pass over every new SFC found no raw colours, palette classes or physical direction utilities.

### ArtifactCanvas and ai-chat#Artifact

- Structure: the canvas is the panel only (header, version toolbar, scrolling body); the split, the handle and the collapse are `Resizable`'s, the pager is `ResponseBranches`, Copy is `CopyButton`. Nothing in it re-implements a part the system ships.
- States: one version (no pager), several, streaming (pager locked, body `aria-busy`, a polite "Generating a new version"), no Copy / Download (controls not drawn, toolbar dropped when empty).
- Keyboard and focus: Open moves focus to the canvas title (`focus()`), Close and Escape return it to the Open that showed it; an Escape an inner control handled does not close. The body is a named, focusable scroll region.
- Finding: the first variant hid the pane under `md` with `max-md:hidden` on `Resizable.Pane`/`Handle` and `Button`, which the pattern lint rejects (style override on a WebKit tag). Fixed: a `narrow` flag read from `matchMedia` after mount (server and first client render agree) chooses the pane or a full-height `Drawer`.
- Finding: a drawer titled like the canvas gave two `top-orders.sql` headings. Fixed: the drawer is named `Artifact` (visually hidden), the canvas keeps the file name.
- Each message's preview names its version (`Version 2`) and opens that version, so earlier answers stay reachable.

### query-editor#ImportCsv

- Flow: File → Map columns → Check rows → Insert, one drawer, errors only after Insert (form-error rule); a primary key may stay unmapped; rows with errors are skipped and counted in the outcome toast with Undo (not a deploy, so no Edit / Redeploy).
- Finding: the Skip option showed the raw `__skip` value in the trigger before the list was opened. Fixed with `Select`'s `displayValue`.
- Finding: the per-line error used `font-medium` and `mt-1`. Fixed: `text-label-sm` and `mt-(--spacing-xxs)`.
- The mapping arrow mirrors under RTL; the ready count is a polite live region, so changing a mapping announces the new count.

### team-permissions#EditTeam

- From the sample's `CreateTeam.vue` in edit mode, plus the Members section the row asks for: add from the account's users only (`Combobox`, `allow-custom` off, then Add), Remove per member with focus moving to the next Remove or back to Add member.
- Save changes is disabled until something differs from the saved team; Discard restores it. Delete team is a section at the end of the form behind a `ConfirmDialog` that counts the members who lose access.
- Finding: `Avatar` normalises its label to two letters, so passing the name drew `AN` for Ana Ribeiro. Fixed: the variant passes the initials.

### PromptInput

- The reference chip list is an async chunk; the shortcut menu stays synchronous because the text area drives it through `aria-activedescendant` on every keystroke. No visual change.

Not verified by the unit tests: styled geometry (the tests run without CSS), the canvas width limits in a real layout.

## M2.10 last leftovers (rows 46, 50, 38)

Scope: `Table` tree rows (additive: `getSubRows`, `v-model:expanded`, treegrid), its `TreeRows` example and the new block `platform/account/manage-resources` (primary, Selected, Empty, Loading, Failed). Source order: the design sample's `ManageResources.vue` decides the layout (heading with Refresh and the details toggle, the create and bulk toolbar, tree table, details panel with Permissions and Labels tabs, the pending-deletion link); the data is fictional. A mechanical pass over the new SFCs found no raw colours, palette classes or physical direction utilities.

### Table tree rows

- Structure: the tree lives in the data-driven `Table` (TanStack `getSubRows` and the expanded row model), so sorting, filtering, selection, frozen columns, stacking and virtual rows keep working; a hand-rolled tree inside a composition table (the sample's approach) was the alternative and was rejected because every product list would re-type it.
- Keyboard: one row is the tab stop; the APG treegrid row-focus map (arrows, Home, End, Enter, Space) mirrors Left and Right under RTL, ignores keys typed inside a cell control, and moves focus to a row that collapses over a focused descendant.
- Finding (rule 5, one content column): the first cut drew the chevron, and on leaves an empty box of the same width, after a separate indent span, so a leaf reserved an empty glyph box. Fixed: one `aria-hidden` gutter `calc(var(--spacing-md) * depth + var(--size-7))` wide holds the chevron at its end only when the row has children, so names at one depth start on one column and each level shifts it by one step; both values are tokens and `--spacing-md` is not redefined at a breakpoint.
- The chevron is pointer-only and hidden from assistive technology; the row's `aria-expanded` is the state, so there is no second expand control in the tab order (the sample's outlined `IconButton` with a Tooltip per row would have added one tab stop per parent).

### manage-resources

- From the sample: Create Project and Create Folder became Create workspace and Create group (the hierarchy here is organization, group, workspace); Tags became Labels to match the column and the details tab.
- Flows the sample stubbed with toasts are real: Move (a `Select` of organizations and groups that excludes the moving rows and everything inside them; an error under the field when nothing is chosen; the new parent opens), Labels (add from labels in use, remove from labels on the selection; Save disabled until something changes) and Delete (`ConfirmDialog` that counts what is inside and says it stays recoverable for 30 days). Outcomes are toasts with Undo for Move and Delete; none offers Edit or Redeploy because nothing is deployed.
- Finding: the sample hid the details panel below `lg`. Fixed: it stacks under the table on narrow screens, so 320 px keeps role bindings reachable.
- Finding: `Tabs.Content` carried `pt-(--spacing-md)`, a style override on a WebKit tag (pattern lint). Fixed with a wrapper that spaces the tab list and the panels.
- Finding: the details toggle pointed `aria-controls` at a panel removed with `v-if`. Fixed: the panel uses `v-show`, so the id always resolves.
- The details heading is a polite live region, so changing the selection is announced; the bulk buttons stay visible and disabled with no selection.

Not verified by the unit tests: styled geometry (they run without CSS); the indent, chevron and stacked layout are checked in the visual suite.
