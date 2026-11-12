# Configurable dashboard

A dashboard the reader arranges: they move cards, change how many columns a card spans and how tall it
is, and keep that layout. It serves readers who come back to the same page every day and care about
different cards than the default puts first. The page owns the layout (an array of id, span and
height, in order) and binds it to `Board`, which moves, resizes, clamps and announces; the
`ChartCard` inside each `Board.Item` provides the drag handle and the resize corner.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- The same dashboard serves readers with different priorities, and each comes back often.
- The cards are independent: none depends on its position to make sense.
- The product has somewhere to store per-user preferences.

## When not to use

- A dashboard read once to answer one question, or one whose order tells a story: use a static
  dashboard such as `platform/dashboard/analytics-dashboard` or
  `platform/dashboard/executive-summary-dashboard`.
- The reader needs to add or remove widgets from a palette; this block only rearranges and resizes the
  cards it has.
- A single chart with editable settings: use `ChartCard` alone.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Traffic overview` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`.

### B. Edit layout, Done and Reset layout — `Button` (required)

`Edit layout` (outlined) turns editing on and becomes `Done` (primary) with `aria-pressed` reflecting
the mode. `Reset layout` (transparent) appears only once the layout differs from the default. While
editing, one line of help sits beside the buttons: how to drag, resize and use the keyboard.

### C. Grid — `Board` (required)

`v-model:layout` binds the page's layout; `editing` follows the mode button. The bounds are set once
on the board: whole columns between 3 and 12, a height between 280 and 720 pixels. One `Board.Item`
per layout entry, keyed and labelled by the card title, so the board announces `Requests over time
moved to position 2 of 6.` and `… resized to 6 of 12 columns.` and puts focus back on the moved
handle. The board is twelve columns from a 48rem container and one column below it.

### D. Cards — `ChartCard` (required)

Inside a `Board.Item` the card takes its span, height and bounds from the board and shows its handles
only while the board is editing, so it carries no size props or drag events of its own. The header
holds `ChartCard.DragHandle` and the card `ChartCard.ResizeHandle`, each with an `aria-label` naming
the card (`Move Requests over time`, `Resize Requests over time`). The header keeps only the title and
its hint; no menus or toggles compete with the handles.

### E. Card definitions — `Hint` (required)

One sentence beside each title that defines the metric.

### F. Span while editing — `Tag` (required in edit mode)

Shows the card's span (`6/12`) in the header controls while editing, so a resize has a visible result
without counting grid lines.

### G. Split cards — `DonutChart` (optional)

A share of a whole (for example requests by region). Renders its own loading and empty state inside
the card.

### H. Ranked cards — `BarList` (optional)

A ranked list sorted descending (top sources). Renders its own loading and empty state.

### I. Time series cards — `Chart` (optional)

Bars, area or line over time. All time series share one `active-index`, so hovering a moment moves the
crosshair on every card. A legend with totals appears only when a card has more than one series.

## Do

- Keep the layout as data (id, span, height, order) owned by the page, bind it to `Board`, and persist
  it wherever the product stores preferences.
- Give every `Board.Item` the card title as its `label`; it is what moves and resizes announce.
- Announce a reset yourself in a polite live region (`Layout reset to the default.`); the board
  announces only what it did.
- Keep every card at its place and size in loading and empty states, so the reader can arrange it
  before data arrives.

## Don't

- Don't show handles outside edit mode; a dashboard that can be dragged by accident is worse than a static one.
- Don't let a card shrink below a span where its content stops reading (3 columns here).
- Don't put card menus, toggles or exports in the header; they conflict with the drag handle.
- Don't hide Reset layout behind a menu once the layout is customized.

## Copy

- **Title:** `Traffic overview`. **Description:** `Requests, regions, errors and response time for the period, in the layout you set.`
- **Mode button:** `Edit layout`, then `Done`. Never `Save`; changes apply as they happen.
- **Reset:** `Reset layout`.
- **Help line:** two short sentences on how, no layout positions. `Drag a card by its handle to move it, or by its corner to resize it. Focus a handle to use the arrow keys.`
- **Handle labels:** verb plus card title. `Move Requests over time`, `Resize Requests over time`.
- **Announcements:** full sentences with a period. `Layout reset to the default.`
- **Empty state:** `No requests yet` / `Metrics appear here once a service serves requests.`

## Accessibility

- The drag handle moves a card with the arrow keys; the resize corner changes span with Left and Right and height with Up and Down (`Board` handles both and mirrors them under right-to-left).
- Focus returns to the moved card's handle after a reorder.
- `Board` announces every move and resize in its own polite live region; the page announces the reset in an `aria-live="polite"` `sr-only` region.
- The board is a list named `Traffic overview cards`, one item per card.
- `Edit layout` exposes its mode with `aria-pressed`.
- Charts carry an `aria-label` equal to the card title.

## States

- Default: the arranged dashboard, read-only.
- Editing: handles and resize corners on every card, span tags in the headers, help line visible.
- Loading: every chart renders its own `Skeleton` inside its card; the layout holds its shape.
- Empty: nothing recorded yet; each card keeps its place and size and shows its empty state.
- Failed: the request failed; every card keeps its place, size and header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/analytics-dashboard` — the static version of the same cards.
- `platform/dashboard/data-dashboard` — a fixed dashboard when the order tells the story.
- `Board` — the grid component: layout model, bounds, reorder, resize and announcements.
- `ChartCard` — the card inside each item, with the drag handle and resize corner.
