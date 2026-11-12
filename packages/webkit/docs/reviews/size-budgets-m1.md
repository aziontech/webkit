# Size budgets after Milestone 1 (M1.10 row 23)

M1.7 re-baselined 21 entries that M1.4–M1.6 had pushed over their budgets, and raised `chart-root` for the hidden-table sample. M1.10 shrank them with three shared changes, then set each budget to the measured size plus about 0.1 KB:

- **`useTranslate`** (`src/composables/use-locale/use-translate.ts`): `t`, `locale` and `dir` without the `Intl` date, relative-time, list and file-size formatters. The 85 components that only read catalog messages use it; `useLocale` keeps its full API on top of the same code. Saves about 0.4 KB per entry.
- **`eventDirection(event)`** (`src/composables/use-direction`): components that need the direction only while handling a key or pointer event read it from the event target instead of subscribing to `dir` changes with `useDirection`. Saves about 0.35 KB per entry (drag and resize handles, slider, tree, calendar grid, quote tabs, article highlight, browser frame; `carousel` reads it from its track).
- **Directional icons** match with one regular expression instead of shipping the icon list (the list stays as the test oracle).

Sizes are gzip, measured by `scripts/check-size.mjs`.

| Entry                    | Pre-M1.4 | M1.7 budget | Measured before | Measured now | New budget | Note                                                                                                          |
| ------------------------ | -------- | ----------- | --------------- | ------------ | ---------- | ------------------------------------------------------------------------------------------------------------- |
| browser-frame            | 11.5     | 12.75       | 12.47           | 11.79        | 11.9       | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| calendar-root            | 18       | 19.75       | 20.95           | 20.21        | 20.35      | Raised over M1.7: typed periods and dates parse in the active locale (M1.10 rows 1–6), landed after M1.7.     |
| doc-callout              | 6.5      | 6.75        | 6.61            | 6.17         | 6.3        | Under pre-M1.4.                                                                                               |
| doc-prompt               | 9.5      | 10.25       | 9.95            | 9.50         | 9.6        | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| doc-tooltip              | 5.5      | 6.75        | 6.58            | 6.15         | 6.25       | The inner `Link` reads its default label from the catalog and mirrors its arrow in RTL.                       |
| carousel-root            | 3        | 4.5         | 4.28            | 3.54         | 3.65       | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| shell-mockup             | 30       | 30.75       | 30.78           | 30.35        | 30.45      | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| shell-mockup-root        | 30       | 30.5        | 30.44           | 30.03        | 30.15      | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| quote-tabs               | 20.75    | 21.5        | 21.20           | 20.50        | 20.6       | Under pre-M1.4.                                                                                               |
| article-highlight        | 7.3      | 7.75        | 7.43            | 7.07         | 7.2        | Under pre-M1.4.                                                                                               |
| article-index-blog       | 22       | 22.25       | 22.03           | 21.59        | 21.7       | Under pre-M1.4.                                                                                               |
| chart-root               | 13.5     | 13.75       | 13.64           | 13.26        | 13.4       | Under pre-M1.4, hidden data table included.                                                                   |
| donut-chart              | 12       | 12.25       | 12.01           | 11.59        | 11.7       | Under pre-M1.4.                                                                                               |
| chart-card               | 4        | 5.5         | 5.33            | 4.60         | 4.7        | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| chart-card-drag-handle   | 1.25     | 2.75        | 2.55            | 1.78         | 1.9        | The catalog label (`Move card`) needs the translator (about 0.5 KB); nothing else is left to cut.             |
| chart-card-resize-handle | 1.75     | 3.25        | 3.08            | 2.35         | 2.45       | Same as the drag handle.                                                                                      |
| tracker                  | 4.5      | 5.5         | 5.39            | 5.00         | 5.1        | Locale strings and `useDirection`, which the readout position reads while rendering.                          |
| tree                     | 5.5      | 6.75        | 6.48            | 5.77         | 5.9        | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| slider                   | 2.75     | 3.5         | 3.28            | 2.94         | 3.05       | RTL arrow keys (M1.5) and the Field context (M1.2) stay.                                                      |
| wizard                   | 6.25     | 7.25        | 7.21            | 6.78         | 6.9        | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| wizard-root              | 5.5      | 6.75        | 6.64            | 6.20         | 6.3        | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| section-header           | 7.5      | 8.5         | 8.25            | 7.80         | 7.9        | Catalog strings (M1.4) and RTL handling (M1.5) stay.                                                          |
| webkit-provider          | —        | 8           | 8.96            | 8.96         | 9.1        | Raised: ships the three built-in catalogs (`en`, `pt-BR`, `es`), which grew with the M1.9 collection strings. |

Three Table entries changed in the same pass. The Table's parts use `useTranslate` as well, and M1.10 rows 21, 26 and 27 added about 1.4 KB to `table.vue`: export of every match (`exportRows`), the virtual-row height index (measured with `ResizeObserver`, with scroll compensation), and the lazy mounting of long lists without `virtual`.

| Entry           | Pre-M1.4 | Budget before | Measured before | Measured now | New budget | Note                                                                             |
| --------------- | -------- | ------------- | --------------- | ------------ | ---------- | -------------------------------------------------------------------------------- |
| table-root      | —        | 50            | —               | 49.64        | 50         | Kept: the `useTranslate` switch pays for the three new Table capabilities.       |
| listing-table   | —        | 55            | —               | 55.54        | 55.65      | Raised: the section embeds the data-driven Table and its three new capabilities. |
| listing-browser | —        | 63            | 63.10           | 64.13        | 64.25      | Raised: already over at the start (M1.9), plus the same Table growth as above.   |

Three entries changed for M1.10 rows 41, 42 and 44. Overlays that teleport to `body` now read the `WebkitProvider`'s `dir` and `lang` (`usePortalLocale`) and bind them on their teleported root; `DropdownMenu.Trigger` forwards its ARIA onto the slotted control instead of wrapping it in a second tab stop; `SelectTrigger` isolates its value in a `<bdi>` with an optional `valueDir`. Each is a fix (overlays laid out left-to-right under an Arabic provider, a nested interactive control, `+55` read as `55+`), so the bytes stay.

| Entry           | Budget before | Measured before | Measured now | New budget | Note                                                                                                |
| --------------- | ------------- | --------------- | ------------ | ---------- | --------------------------------------------------------------------------------------------------- |
| doc-page-header | 25.5          | 25.20           | 25.56        | 25.75      | Raised: its Breadcrumb overflow menu carries the as-child `DropdownMenu.Trigger` and portal locale. |
| listing-browser | 64.25         | 64.13           | 64.26        | 64.5       | Raised: its Select and Popover panels bind the portal locale.                                       |
| select          | 19.5          | 19.39           | 19.51        | 19.75      | Raised: the content binds the portal locale and the trigger isolates its value.                     |

Five entries changed for M1.10 rows 46 and 48. `Popover.Trigger`, `Dialog.Trigger` and `Drawer.Trigger` became as-child triggers like `DropdownMenu.Trigger` (no role-less or focusable wrapper around the slotted button), and the four share an internal `TriggerHost` that merges the trigger ARIA into a slotted `Button`, `IconButton` or native control at render, so it is in the server HTML. `Tooltip` moves its `aria-describedby` from the wrapper onto the slotted control. Each is an accessibility fix (a nested interactive control, ARIA on an element with no role, a description nobody hears, ARIA missing until hydration), so the bytes stay.

| Entry           | Budget before | Measured before | Measured now | New budget | Note                                                                                      |
| --------------- | ------------- | --------------- | ------------ | ---------- | ----------------------------------------------------------------------------------------- |
| browser-frame   | 11.9          | 11.87           | 12.02        | 12.1       | Raised: its `CopyButton` tooltip forwards `aria-describedby` onto the button.             |
| doc-prompt      | 9.6           | 9.57            | 9.75         | 9.85       | Raised: same tooltip change, through `CopyButton`.                                        |
| section-header  | 7.9           | 7.87            | 8.05         | 8.15       | Raised: same tooltip change, through `CopyButton`.                                        |
| doc-page-header | 25.75         | 25.56           | 26.21        | 26.3       | Raised: its overflow menu's trigger carries `TriggerHost`, and its tooltips forward ARIA. |
| confirm-dialog  | 23            | 22.59           | 23.48        | 23.6       | Raised: it ships `Dialog.Trigger`, now an as-child trigger on `TriggerHost`.              |

Two entries changed for M1.10 row 51. `TriggerHost` now looks through a `Tooltip` at render, so a trigger whose slot is a `Tooltip` around an `IconButton` (the row-actions and account menus) carries its ARIA in the server HTML, and it treats `Avatar`, `Badge`, `Tag` and `SeverityTag` leaves as inert, so an `Avatar` trigger renders its wrapper as the button on the server. The code was compacted once (about 0.07 KB back); what is left is the Tooltip slot rewrite and the leaf check, an accessibility fix for server-rendered pages, so the bytes stay.

| Entry           | Budget before | Measured before | Measured now | New budget | Note                                                                                 |
| --------------- | ------------- | --------------- | ------------ | ---------- | ------------------------------------------------------------------------------------ |
| doc-page-header | 26.3          | 26.21           | 26.40        | 26.5       | Raised: its overflow menu's `DropdownMenu.Trigger` carries the larger `TriggerHost`. |
| confirm-dialog  | 23.6          | 23.48           | 23.71        | 23.8       | Raised: it ships `Dialog.Trigger`, which carries the larger `TriggerHost`.           |

Two entries changed for M2.9 phase 1 (the PR #1169 port). `Item.List` now tells its rows they are list members, so each row renders `role="listitem"`, and an `asChild` row gets a `listitem` wrapper. This fixes axe's `aria-required-children` on every `Item.List`. Both sections render their rows through `Item.List`.

| Entry                                                                                               | Budget before | Measured before | Measured now | New budget | Note                                                         |
| --------------------------------------------------------------------------------------------------- | ------------- | --------------- | ------------ | ---------- | ------------------------------------------------------------ |
| listing-browser                                                                                     | 64.65         | within budget   | 64.69        | 64.75      | Raised: `Item` list-member context and the listitem wrapper. |
| listing-table                                                                                       | 55.85         | within budget   | 55.92        | 56         | Raised: same `Item` change.                                  |
| Fifteen new entries for M2.4 (the generative-AI components in `src/components/ai/`). Each budget is |
| the measured gzip size plus about 8 %, rounded up to a quarter KB. `streaming-response` carries     |
| `CodeBlock` (26.75 KB on its own) for fenced code; `chat-message` carries `AiLoading`, `Avatar`,    |
| `Button`, `IconButton` and `Tooltip`.                                                               |

| Entry                 | Measured | Budget | Entry              | Measured | Budget |
| --------------------- | -------- | ------ | ------------------ | -------- | ------ |
| action-confirmation   | 10.09    | 11     | citation           | 5.51     | 6      |
| ai-loading            | 2.24     | 2.5    | conversation       | 4.17     | 4.75   |
| artifact-preview      | 8.89     | 9.75   | prompt-input       | 4.88     | 5.5    |
| chat-message          | 22.11    | 24     | reasoning          | 4.08     | 4.5    |
| chat-message-root     | 16.31    | 17.75  | sources            | 2.47     | 2.75   |
| chat-message-actions  | 1.34     | 1.5    | streaming-response | 29.51    | 32     |
| chat-message-feedback | 7.67     | 8.5    | suggestion-group   | 1.72     | 2      |
| tool-call             | 3.07     | 3.5    |                    |          |        |

The catalog budget in `test/mcp/catalog-split.test.mjs` went from 1.5 MB to 1.6 MB: the thirteen AI
imports and three AI patterns add 58 KB (1,459,260 → 1,517,943 bytes), about 3 KB per component, the
same as the existing entries. ROADMAP M2.10 row 2 moves the per-import prose out of `catalog.json`
before M2.9 adds more.

### M2 merge: webkit-provider 9.1 → 10.6 KB

`WebkitProvider` ships the pt-BR and es catalogs. M2.4 added the strings of 12 generative-AI components to all three, so the provider grew to 10.49 KB. The raise is temporary: M2.10 lists loading the non-English catalogs on demand, which takes the provider back under its old budget.

| Entry           | Budget before | Measured before | Measured now | New budget | Note                                                         |
| --------------- | ------------- | --------------- | ------------ | ---------- | ------------------------------------------------------------ |
| listing-browser | 64.65         | within budget   | 64.69        | 64.75      | Raised: `Item` list-member context and the listitem wrapper. |
| listing-table   | 55.85         | within budget   | 55.92        | 56         | Raised: same `Item` change.                                  |

M2.9 work package editors. Seven new entries and one raise. `WebKitProvider` ships the three built-in locale catalogs, and the new components' strings (attribute editor, tag editor, button group, combobox, code editor, schema form, unsaved-changes dialog, tab dirty mark) are in all three, as the i18n rule requires; the bytes are copy, not code.

| Entry               | Budget before | Measured before | Measured now | New budget | Note                                                                     |
| ------------------- | ------------- | --------------- | ------------ | ---------- | ------------------------------------------------------------------------ |
| webkit-provider     | 9.1           | within budget   | 11.71        | 11.8       | Raised: en, pt-BR and es strings of the editors work package.            |
| attribute-editor    | –             | –               | 13.96        | 14.25      | New: rows, grouped mode, per-cell `Field`s, live announcements.          |
| tag-editor          | –             | –               | 15.69        | 16         | New: built on `AttributeEditor`, with key rules and undo-remove.         |
| button-group        | –             | –               | 12.90        | 13.25      | New: roving focus, toggles and overflow into `DropdownMenu`.             |
| combobox            | –             | –               | 10.41        | 10.75      | New: listbox popup with groups, free entry and server search.            |
| code-editor         | –             | –               | 7.80         | 8          | New: the plain editor only; Monaco is the consumer's lazy `loader`.      |
| schema-form         | –             | –               | 30.64        | 31         | New: schema walk, draft-07 validation and the `Field` controls it draws. |
| use-unsaved-changes | –             | –               | 1.60         | 1.75       | New composable.                                                          |

### M2 merge (editors): webkit-provider → 13.3 KB

Editors added the strings of seven components to the three built-in catalogs (13.16 KB). Still temporary: M2.10 row 10 moves pt-BR and es to opt-in locale entries and lowers this budget.
Two entries changed and seven new entries were set for M2.9 WP app-layout. `ChartCard` now reads an enclosing `Board.Item` (span, height, drag and keyboard move go through the board), so the configurable dashboard is built on `Board`. `WebKitProvider` bundles the English catalog, which grew by the new `appLayout`, `board`, `errorBoundary`, `hotspot` and `tutorialPanel` groups. The new entries are set just above what they measure; `error-boundary` ships `Alert` and `Button` for its fallback.

| Entry           | Budget before | Measured before | Measured now | New budget | Note                                                   |
| --------------- | ------------- | --------------- | ------------ | ---------- | ------------------------------------------------------ |
| chart-card      | 4.7           | within budget   | 4.71         | 4.75       | Raised: the `Board.Item` bridge.                       |
| webkit-provider | 9.1           | within budget   | 10.21        | 10.25      | Raised: five new locale groups in the English catalog. |
| app-layout      | new           | –               | 22.48        | 23         | New: regions, two drawers, split panel resize.         |
| board           | new           | –               | 3.40         | 3.5        | New: `Board` and `Board.Item`.                         |
| error-boundary  | new           | –               | 6.35         | 6.5        | New: fallback built from `Alert` and `Button`.         |
| hotspot         | new           | –               | 11.10        | 11.25      | New: the marker on `Popover`.                          |
| tutorial-panel  | new           | –               | 8.48         | 8.75       | New: the panel, its provider and the task list.        |

### M2 merge (app-layout): webkit-provider → 14.4 KB

Temporary, as above; closed by the opt-in locale entries (M2.10).

### M2.10: webkit-provider 13.3 → 6.3 KB, two locale entries

`WebkitProvider` now ships only the English catalog. Portuguese and Spanish are opt-in entries (`@aziontech/webkit/locales/pt-BR`, `/locales/es`) that the app imports and passes through the provider's `catalogs` prop, so they are static imports and SSR stays deterministic. The budgets below are measured + ~0.2 KB. Each locale entry is pure copy and grows with every component's strings; that is the expected cost and no longer lands on apps that run in English only.

| Entry           | Before (KB) | Measured (KB) | Budget (KB) | Why                                         |
| --------------- | ----------- | ------------- | ----------- | ------------------------------------------- |
| webkit-provider | 13.16       | 6.10          | 6.3         | Lowered: pt-BR and es left the provider.    |
| locales-pt-BR   | –           | 5.44          | 5.65        | New: the Portuguese (Brazil) catalog alone. |
| locales-es      | –           | 5.49          | 5.7         | New: the Spanish catalog alone.             |

### Locales merge with app-layout

The app-layout strings (merged in parallel) grow the English catalog the provider ships and the two locale entries: webkit-provider 6.7 KB, locales-pt-BR 6.1 KB, locales-es 6.15 KB (measured + ~0.2 KB). These three entries grow with every component that adds built-in strings; that growth is expected.

## M2.9 WP charts-2

The new chart parts are separate entries, so only a consumer that places them pays for them. The root grew with what every chart needs once it has a brush or a non-Latin reader: the linear label scale, the RTL mirror with logical arrow keys, series focus and the range state with its two announcements. The `MapChart` country geometry is a lazy chunk and is not counted in the entry.

| Entry           | Budget before | Measured before | Measured now | New budget | Note                                                                                              |
| --------------- | ------------- | --------------- | ------------ | ---------- | ------------------------------------------------------------------------------------------------- |
| chart           | 19.5          | within budget   | 21.54        | 21.75      | Raised: the index re-exports `Chart.Scatter` and `Chart.Brush`, and the root grew (below).        |
| chart-root      | 13.4          | within budget   | 14.97        | 15.1       | Raised: linear label scale, RTL mirror and keys, series focus, brush range and its announcements. |
| chart-axis      | 1.75          | within budget   | 1.81         | 1.9        | Raised: ticks on the linear scale and the mirrored axis side under RTL.                           |
| gauge-chart     | new           | –               | 10.37        | 10.5       | New: the dial, threshold bands, sizes and the chart family state surface.                         |
| map-chart       | new           | –               | 16.79        | 16.9       | New: the map, bubbles, keyboard walk, tooltip and table twin; country shapes load lazily.         |
| webkit-provider | 14.4          | within budget   | 14.45        | 14.55      | Raised: the `gaugeChart` and `mapChart` groups and two `chart` keys in the catalogs.              |

### M2.9 WP observability

Two new entries and five raises. `DateRangePicker` composes the calendar parts (`CalendarGrid`, `CalendarFields`, `CalendarTimezone`), `Popover` placement and focus trap, `ToggleGroup`, `Select`, `Input` and `Button`, so it weighs about the `Calendar` (20.35 KB) plus the relative-range panel and the time-zone math. `PropertyFilter` gained query mode (the tokenizer and parser in `query-language.ts`, caret suggestions and the invalid-query message). The English catalog the provider ships, and the two opt-in locale entries, grew by the `dateRangePicker`, `propertyFilterQuery` and `trace` groups. Budgets are measured + ~0.2 KB.

| Entry             | Budget before | Measured now | New budget | Why                                                                |
| ----------------- | ------------- | ------------ | ---------- | ------------------------------------------------------------------ |
| date-range-picker | new           | 33.05        | 33.25      | New: calendar parts, relative panel, time zone, step back/forward. |
| trace             | new           | 14.57        | 14.75      | New: span waterfall, tree keyboard map, span details.              |
| property-filter   | 28            | 28.45        | 28.75      | Raised: query mode (`mode="query"`).                               |
| webkit-provider   | 6.7           | 7.27         | 7.5        | Raised: three new groups in the English catalog.                   |
| locales-pt-BR     | 6.1           | 6.68         | 6.9        | Raised: the same three groups in Portuguese.                       |
| locales-es        | 6.15          | 6.76         | 7          | Raised: the same three groups in Spanish.                          |

## M2.9 WP deploy-release

`TopologyDiagram` and `OutcomeMark` are new entries. The `topologyDiagram` and `outcomeMark` groups grow the English catalog the provider ships and the two opt-in locale entries; that is the expected per-component cost (see "Locales merge with app-layout"). Budgets are measured + ~0.2 KB.

| Entry            | Budget before | Measured now | New budget | Note                                                                      |
| ---------------- | ------------- | ------------ | ---------- | ------------------------------------------------------------------------- |
| outcome-mark     | new           | 2.00         | 3          | New: four glyphs, sizes and the appear animation.                         |
| topology-diagram | new           | 28.14        | 32         | New: node cards, bind control on `DropdownMenu`, `Flow` connector engine. |
| webkit-provider  | 6.7           | 6.78         | 6.95       | Raised: the `topologyDiagram` and `outcomeMark` English strings.          |
| locales-pt-BR    | 6.1           | 6.12         | 6.35       | Raised: the same groups in Portuguese.                                    |
| locales-es       | 6.15          | 6.17         | 6.4        | Raised: the same groups in Spanish.                                       |

### M2.9 WP a11y

No new entries. Six small raises, all from accessibility fixes in shared parts that these entries compose: `TriggerHost` leaves popup ARIA off text inputs (every `Popover`, `Tooltip` and `DropdownMenu` trigger), `Dialog` and `Drawer` return focus to the element focused before opening, `Table` moves `role="table"` onto its grid and forwards naming attributes there, `Chip` splits its body from the remove button, and `Progress` has a default accessible name (one more key in the English catalog that `doc-page-header` imports whole).

| Entry            | Budget before | Measured now | New budget | Why                                                            |
| ---------------- | ------------- | ------------ | ---------- | -------------------------------------------------------------- |
| doc-page-header  | 26.5          | 26.67        | 26.8       | Imports the whole English catalog, which gained keys.          |
| comparison-table | 22            | 22.09        | 22.25      | `Popover` and `Tooltip` triggers go through `TriggerHost`.     |
| listing-browser  | 64.75         | 64.91        | 65.1       | `Table` grid role and attribute forwarding, `Chip` body split. |
| listing-table    | 56            | 56.09        | 56.25      | `Table` grid role and attribute forwarding.                    |
| hotspot          | 11.25         | 11.32        | 11.4       | Built on `Popover`, whose trigger goes through `TriggerHost`.  |
| confirm-dialog   | 23.8          | 23.99        | 24.1       | `Dialog` focus return to the element focused before it opened. |

### M2.9 WP sql-storage

Two new entries at measured plus about 0.2 KB, and three raises from the two new string groups (`fileTokenGroup`, `uploadProgress`) in the locale catalogs.

| Entry            | Budget before | Measured now | New budget | Why                                                                 |
| ---------------- | ------------- | ------------ | ---------- | ------------------------------------------------------------------- |
| file-token-group | –             | 6.77         | 7          | New: `IconButton`, `Button`, `Progress` and `useLocale` formatters. |
| upload-progress  | –             | 8.03         | 8.25       | New: adds `OutcomeMark` to the same parts.                          |
| webkit-provider  | 7.75          | 7.83         | 8.05       | Raised: the English catalog gained the two groups.                  |
| locales-pt-BR    | 7.15          | 7.23         | 7.45       | Raised: the same groups in Portuguese.                              |
| locales-es       | 7.25          | 7.32         | 7.55       | Raised: the same groups in Spanish.                                 |

## M2.9 WP list-kit

`OverflowCount` and the six `Table.Cell*` presets are new entries. `TableCellTime` is the heaviest preset because `Avatar` merges classes with `tailwind-merge` (about 58 KB before compression, shared with every component that uses `cn`); an app that already ships webkit pays it once. `Table` grows by the reorderable rows (grip column, pointer and keyboard moves, announcements), and the two sections built on it grow with it. The `overflowCount`, `tableCell*` and `tableReorder` groups grow the English catalog the provider ships and the two opt-in locale entries. Budgets are measured + ~0.25 KB; the provider and locale rows are measured after merging `feat/webkit-v6` (sql-storage strings included).

| Entry              | Budget before | Measured now | New budget | Note                                                                   |
| ------------------ | ------------- | ------------ | ---------- | ---------------------------------------------------------------------- |
| overflow-count     | new           | 12.27        | 12.5       | New: `Popover`, `Tag`, search `Input`, Load more `Button`.             |
| table-cell-status  | new           | 1.41         | 3          | New: one `Tag`.                                                        |
| table-cell-link    | new           | 15.05        | 15.3       | New: `Tooltip`, `OverflowCount`, `CopyButton`.                         |
| table-cell-id      | new           | 7.70         | 7.95       | New: `CopyButton`.                                                     |
| table-cell-time    | new           | 17.05        | 17.3       | New: `Avatar` (with `tailwind-merge`), `Tooltip`, relative time clock. |
| table-cell-tags    | new           | 13.18        | 13.45      | New: fit measuring plus `OverflowCount`.                               |
| table-cell-actions | new           | 9.62         | 10         | New: `DropdownMenu` and its trigger.                                   |
| table-root         | 50            | 51.64        | 51.9       | Raised: `reorderable` rows.                                            |
| listing-browser    | 65.1          | 66.69        | 66.95      | Raised: built on `Table`.                                              |
| listing-table      | 56.25         | 57.77        | 58         | Raised: built on `Table`.                                              |
| webkit-provider    | 8.05          | 8.18         | 8.4        | Raised: the list-kit groups in the English catalog.                    |
| locales-pt-BR      | 7.45          | 7.57         | 7.8        | Raised: the same groups in Portuguese.                                 |
| locales-es         | 7.55          | 7.66         | 7.9        | Raised: the same groups in Spanish.                                    |

### M2.9 WP marketplace

One new entry. `card` had no budget; measured 11.07 KB before the change (`cn` carries `tailwind-merge`) and 13.23 KB with the integration kind (`Tag` and the translate helper). The two new strings (`card.byVendor`, `card.installed`) fit inside the current provider and locale budgets.

| Entry | Budget before | Measured now | New budget | Why                                                        |
| ----- | ------------- | ------------ | ---------- | ---------------------------------------------------------- |
| card  | –             | 13.23        | 13.5       | New entry: integration kind adds `Tag` and `useTranslate`. |

### M1.11 (full test pass)

Three entries changed in M1.11, where the full browser run turned four skipped axe tests back on. `Table` put `role="table"` on its frame, so the focusable scroll viewport, the toolbar, the empty state and the footer controls were children of the table (`aria-required-children`, critical). `role="table"` now sits on the element that holds only the row groups; the consumer's ARIA attributes move to it, and `TableCaption` names it through `aria-labelledby` (axe does not accept `role="caption"` as an owned child). The attribute split was compacted once (about 0.04 KB back); the rest is the accessibility fix, so the bytes stay.

| Entry           | Budget before | Measured before | Measured now | New budget | Note                                                     |
| --------------- | ------------- | --------------- | ------------ | ---------- | -------------------------------------------------------- |
| table-root      | 50            | 49.94           | 50.14        | 50.25      | Raised: the table role moves off the frame.              |
| listing-browser | 64.65         | 64.58           | 64.76        | 64.85      | Raised: it ships `Table`, same change.                   |
| listing-table   | 55.85         | 55.82           | 56.03        | 56.15      | Raised: it ships `Table` and `TableFooter`, same change. |

Four more entries changed in M1.11, from the WebKit run. For `locale="ar"` Node and Chromium format numbers with Latin digits (the current CLDR default) and Safari with Arabic-Indic ones, so a page rendered on the server failed to hydrate in Safari. Every `Intl` formatter now receives `intlLocale(tag)`, which pins Latin digits unless the tag picks a numbering system (`ar-u-nu-arab`). The helper was compacted once; the calendar calls it at each of its date and period formatters.

| Entry              | Budget before | Measured before | Measured now | New budget | Note                                                         |
| ------------------ | ------------- | --------------- | ------------ | ---------- | ------------------------------------------------------------ |
| calendar-root      | 20.35         | 20.34           | 20.39        | 20.5       | Raised: its date and period formatters pin the digits.       |
| doc-tooltip        | 6.25          | 6.20            | 6.25         | 6.35       | Raised: its `Link` label goes through the shared translator. |
| article-index-blog | 21.7          | 21.66           | 21.73        | 21.85      | Raised: dates and counts through the shared formatters.      |
| wizard-root        | 6.3           | 6.24            | 6.30         | 6.4        | Raised: its step counter goes through the shared translator. |

Three more entries changed later in M1.11, from the WebKit reflow run. `Table` measured the content width of auto-fit columns one cell at a time (append a clone, read its width, remove it), forcing a full layout for every cell: 130 layouts on mount of `platform/view/split-view`, 4.4 s in WebKit and about 0.5 s in Chromium. The clones of every measured column are now appended together, read together and removed together, so an auto-fit costs one layout (WebKit: 4.7 s → 0.3 s after mount). The batch costs about 30 bytes gzipped; the clone styling was tried as a loop over an object and compressed worse.

| Entry           | Budget before | Measured before | Measured now | New budget | Note                                                     |
| --------------- | ------------- | --------------- | ------------ | ---------- | -------------------------------------------------------- |
| table-root      | 50.25         | 50.14           | 50.27        | 50.35      | Raised: auto-fit columns measure in one layout.          |
| listing-browser | 64.85         | 64.76           | 64.88        | 64.95      | Raised: it ships `Table`, same change.                   |
| listing-table   | 56.15         | 56.03           | 56.17        | 56.25      | Raised: it ships `Table` and `TableFooter`, same change. |

### M2 merge (M1.11 into the integrated line)

The integrated values win for every entry both sides raised (`table-root` 51.9, `listing-browser` 66.95, `listing-table` 58, `wizard-root` 6.7): the integrated budgets already cover M1.11's batched auto-fit measuring and caption labelling, measured after the merge at 51.89, 66.87, 57.96 and 6.30 KB. One entry grew past its budget from the combination.

| Entry      | Budget before | Measured now | New budget | Why                                                                                           |
| ---------- | ------------- | ------------ | ---------- | --------------------------------------------------------------------------------------------- |
| chart-card | 4.75          | 4.80         | 4.95       | Raised: M1.11's pointer-capture guard in the resize handle on top of the `Board.Item` bridge. |

## M2.9 WP account-org

`PaymentBrand` and `OtpInput` are new entries; both include `useTranslate` for their one catalog string. The `paymentBrand` and `otpInput` groups are one string each, so the provider and the two locale entries stay inside their list-kit budgets (measured after merging `feat/webkit-v6`). Budgets are measured + ~0.2 KB.

| Entry           | Budget before | Measured now | New budget | Note                                                              |
| --------------- | ------------- | ------------ | ---------- | ----------------------------------------------------------------- |
| payment-brand   | new           | 3.82         | 4.05       | New: five inline monochrome marks and the generic card glyph.     |
| otp-input       | new           | 2.99         | 3.2        | New: one input over the boxes, `useFieldControl`, `useTranslate`. |
| webkit-provider | 8.4           | 8.25         | 8.4        | Unchanged: two one-string groups.                                 |
| locales-pt-BR   | 7.8           | 7.64         | 7.8        | Unchanged.                                                        |
| locales-es      | 7.9           | 7.73         | 7.9        | Unchanged.                                                        |

## M2.9 WP site-sections

New documentation parts. Each wrapper carries the design-system component it renders on, so its budget is that component plus a few hundred bytes. Budgets are measured + ~0.5 KB.

| Entry               | Budget before | Measured now | New budget | Note                                          |
| ------------------- | ------------- | ------------ | ---------- | --------------------------------------------- |
| doc-accordion-group | new           | 13.66        | 14.2       | New: `Accordion` at `size="large"` in a card. |
| doc-accordion-item  | new           | 0.32         | 1          | New: a `display: contents` carrier.           |
| doc-code-group      | new           | 26.45        | 27         | New: `CodeBlock` with its tab strip.          |
| doc-cta             | new           | 11.45        | 12         | New: `FrameBox`, `Brand`, two `Button`s.      |
| doc-heading         | new           | 0.95         | 1.5        | New: anchor heading on `useHeadingNav`.       |
| doc-tab             | new           | 0.28         | 1          | New: a `display: contents` carrier.           |
| doc-tabs            | new           | 16.56        | 17         | New: `Tabs` root, list, items and panels.     |

New sections and the sample's section variants. `ConsolePanel` carries `ToggleGroup` for its tabs and `SectionCommand` carries `InputGroup` and `CopyButton`; the others are layout over `SectionModule`, `SectionTitle`, `FrameBox` and `TextureMaterial`. `HeroBand`, `LogoWallQuote` and `ComparePlans` grow by their new variants and stay inside their budgets. The `consolePanel`, `customerSpotlight` and `sectionCommand` groups grow the English catalog the provider ships and the two opt-in locale entries (measured + ~0.2 KB).

| Entry              | Budget before | Measured now | New budget | Note                                             |
| ------------------ | ------------- | ------------ | ---------- | ------------------------------------------------ |
| capability-grid    | new           | 6.24         | 6.75       | New: `CardGrid` of `Topic`s.                     |
| console-panel      | new           | 20.72        | 21.25      | New: `ToggleGroup` tabs, scene slot.             |
| customer-spotlight | new           | 4.93         | 5.5        | New: expanding client cards.                     |
| process-scroll     | new           | 4.99         | 5.5        | New: numbered card row.                          |
| section-command    | new           | 8.53         | 9          | New: `InputGroup` with `CopyButton`.             |
| sticky-carousel    | new           | 5.60         | 6.1        | New: pinned row, one rAF-batched scroll handler. |
| webkit-provider    | 8.4           | 8.27         | 8.5        | Raised: the site-sections groups in English.     |
| locales-pt-BR      | 7.8           | 7.66         | 7.9        | Raised: the same groups in Portuguese.           |
| locales-es         | 7.9           | 7.75         | 8          | Raised: the same groups in Spanish.              |

`LineFigure` counts its entry chunk only: the engine and each of the 25 figures load on demand (27 async chunks, 3–5 KB each). `BannerArt` carries `NetworkMap` (its map data) and `SpinningGlobe`.

| Entry       | Budget before | Measured now | New budget | Note                                             |
| ----------- | ------------- | ------------ | ---------- | ------------------------------------------------ |
| line-figure | new           | 2.48         | 3          | New: entry only; figures are async chunks.       |
| banner-art  | new           | 9.61         | 10.1       | New: `NetworkMap`, `SpinningGlobe`, the lattice. |

M2.10 leftovers (blocks lane): `Table` gains `rowReorderable` (a pinned row keeps its place, used by `rules-list`) and `NetworkMap` gains `traffic` (the sample's `MapMesh`: a seeded mesh of links and Web Animations packets, turned on by `BannerArt` `art="network"`).

| Entry           | Budget before | Measured now | New budget | Note                                    |
| --------------- | ------------- | ------------ | ---------- | --------------------------------------- |
| table-root      | 51.9          | 51.97        | 52.15      | Raised: `rowReorderable`.               |
| listing-browser | 66.95         | 66.95        | 67.2       | Raised: carries `Table`.                |
| listing-table   | 58            | 58.07        | 58.3       | Raised: carries `Table`.                |
| network-map     | 6.5           | 7.30         | 7.5        | Raised: `traffic` mesh and packets.     |
| banner-art      | 10.1          | 10.87        | 11.1       | Raised: carries `NetworkMap` `traffic`. |

## M2.10 component leftovers

Measured with `scripts/check-size.mjs` on the merged branch (gzip, `vue` external).

- **CopyButton fallback is lazy.** `CopyButtonFallback` (Popover, Input) is a `defineAsyncComponent` chunk (~5 KB) that downloads only when `navigator.clipboard.writeText` rejects. Entries that contain `CopyButton` now measure their initial chunk (`entryOnly`; the report prints `2 async chunk(s) excluded`, the fallback's chunks): `browser-frame`, `doc-code-group`, `doc-prompt`, `section-command`, `section-header`, `code-split`, `sticky-scroll-code`, `cli-terminal`, `closing-call-to-action-agents`, `code-block`, `log-view-content`, `trace`, `artifact-preview`, `streaming-response`, `table-cell-link`, `table-cell-id`. Their initial chunks are all under the old budgets, which stay.
- **Button forced-colors edge** (`forced-colors:border forced-colors:border-[ButtonBorder]`, a few dozen bytes): `shell-mockup` 30.45 → 30.62 KB, `hotspot` 11.4 → 11.57 KB, `wizard` 6.9 → 7.06 KB. `donut-chart` 11.7 → 11.85 KB also carries the legend key's `forced-color-adjust: none`.
- **PanelContent scroll focus** (`useResizeObserver` and `useMutationObserver` to make an overflowing, non-focusable body reachable by keyboard): `confirm-dialog` 24.1 → 24.67 KB, `topology-diagram` 32 → 34.03 KB.
- **New catalog groups** (`copyFallback`, `qrCode`, `responseBranches`, `feedbackReason`, `conversationHistory`, `promptInputMenu`), measured + 0.2 KB as the brief asks: `webkit-provider` 8.5 → 8.93 KB, `locales-pt-BR` 7.9 → 8.32 KB, `locales-es` 8 → 8.41 KB.
- **MultiSelect labels** (options register their label, the content renders them once hidden): `multi-select` 20.75 → 21.07 KB.
- **New and extended components** (first budgets were estimates): `prompt-input` 5.5 → 11.45 KB (menus, references; most of it is `Chip` for the reference chips: follow-up row to load the chips lazily), `feedback-reason-dialog` 15 → 31.64 KB (`Dialog`, `Field`, `RadioButton`, `Textarea`, `Button`, shared with the page in practice), `conversation-history` 4.5 → 4.96 KB, `response-branches` 2.4 → 4 KB, `payment-brand` 4.05 → 4.84 KB (four more marks), `qr-code` 3.6 → 4.39 KB (encoder with the 40-version tables).

## M2.5 — styled geometry fixes (2026-11-11)

The styled visual suite showed that `Table`'s frozen-edge fades covered the first letters of the
next column even with nothing scrolled, and that the drag outline and drop line stopped at the
frozen columns. `Table` now measures whether content scrolls under each frozen edge (one
`ResizeObserver` on the viewport plus the scroll handler) and draws the drag outline and drop
line on a row pseudo-element above the frozen cells. Measured after merging `rowReorderable`.

| Entry      | Budget before | Measured now | New budget | Note                                    |
| ---------- | ------------- | ------------ | ---------- | --------------------------------------- |
| table-root | 52.15         | 52.16        | 52.35      | Raised: scroll-aware frozen-edge fades. |

## Merge of M2.5 into the integrated line (2026-11-11)

Both lines grew `Table`: the integrated line added `rowSelectable` and M2.5 the scroll-aware
frozen-edge fades and the row pseudo-element drop line. `table-root` stays inside 52.35 KB
(52.25 KB measured); the two sections that carry the whole `Table` cross their budgets.

| Entry           | Budget before | Measured now | New budget | Note                                          |
| --------------- | ------------- | ------------ | ---------- | --------------------------------------------- |
| listing-browser | 67.2          | 67.29        | 67.5       | Raised: carries `Table` (both lines' growth). |
| listing-table   | 58.3          | 58.37        | 58.6       | Raised: carries `Table` (both lines' growth). |

### M2.10 row 47 — PromptInput reference chips are lazy

`PromptInputReferences` (the `References` list of removable `Chip`s) is a `defineAsyncComponent` chunk that downloads the first time a reference exists. `prompt-input` now counts its initial chunk only (`entryOnly`, 2 async chunks excluded): 11.45 → 5.80 KB measured, budget 11.45 → 6 KB. The shortcut menu listbox stays in the entry: the text area drives it synchronously (`aria-controls`, `aria-activedescendant`, the polite count), and its markup is a few hundred bytes.

### M2.10 row 7 — ArtifactCanvas

New entry `artifact-canvas`: 6.32 KB initial chunk (`entryOnly`; `CopyButton`'s fallback is the 2 async chunks), budget 6.5 KB. It carries `ResponseBranches`, `CopyButton` and `IconButton`. The `artifactCanvas` catalog group keeps `webkit-provider` (8.79 KB), `locales/pt-BR` (8.16 KB) and `locales/es` (8.25 KB) inside their budgets.

### M2.10 row 46 — Table tree rows

`Table` gained tree rows (`getSubRows`, `v-model:expanded`, treegrid roles, the row-focus keyboard map and the depth gutter). Most of the growth is TanStack's `getExpandedRowModel`, which the root imports so a data-driven table can switch to tree rows by prop; the keyboard handler reads the direction per event (`eventDirection`), with no `useDirection` subscription. Measured + ~0.2 KB:

| Entry           | Budget before | Measured now | New budget | Note                                 |
| --------------- | ------------- | ------------ | ---------- | ------------------------------------ |
| table-root      | 52.35         | 53.61        | 53.8       | Raised: tree rows.                   |
| listing-browser | 67.5          | 68.68        | 68.9       | Raised: carries `Table` (tree rows). |
| listing-table   | 58.6          | 59.75        | 59.95      | Raised: carries `Table` (tree rows). |

## M2.7 owner items 3 and 6 (2026-11-12)

| Entry              | Budget before | Measured now | New budget | Note                                                                                                |
| ------------------ | ------------- | ------------ | ---------- | --------------------------------------------------------------------------------------------------- |
| search-trigger     | 3             | 3.78         | 4          | Raised: binds ⌘K / Ctrl K on the window (`@vueuse/core` listener + shortcut registry).              |
| copy-prompt-button | —             | 2.18         | 2.5        | New entry, initial chunk only (clipboard fallback is async).                                        |
| doc-hero           | —             | 0.73         | 1          | New entry.                                                                                          |
| doc-agent-card     | —             | 6.79         | 7          | New entry, initial chunk only; carries `Button`, `CopyPromptButton`, `FrameBox`, `TextureMaterial`. |
| webkit-provider    | 8.93          | 8.96         | 9.16       | New strings: `copyPromptButton`, `docAgentCard` (measured + 0.2).                                   |
| locales-pt-BR      | 8.32          | 8.34         | 8.54       | Same strings (measured + 0.2).                                                                      |
| locales-es         | 8.41          | 8.44         | 8.64       | Same strings (measured + 0.2).                                                                      |
