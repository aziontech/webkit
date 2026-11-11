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
