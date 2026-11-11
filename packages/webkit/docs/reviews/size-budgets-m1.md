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
