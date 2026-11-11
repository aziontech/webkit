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

### M2.9 WP marketplace

One new entry. `card` had no budget; measured 11.07 KB before the change (`cn` carries `tailwind-merge`) and 13.23 KB with the integration kind (`Tag` and the translate helper). The two new strings (`card.byVendor`, `card.installed`) fit inside the current provider and locale budgets.

| Entry | Budget before | Measured now | New budget | Why                                                        |
| ----- | ------------- | ------------ | ---------- | ---------------------------------------------------------- |
| card  | –             | 13.23        | 13.5       | New entry: integration kind adds `Tag` and `useTranslate`. |
