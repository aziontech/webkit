# Page wires

The skeleton wires an app paints while a page is still arriving. The user's job does not change while they wait: they need to see the shape of the page they asked for, so the wire draws the real page's grid with `Skeleton` bands inside the same `Card` frames, and nothing shifts when the content lands. The set covers the Home overview, the first-access Home, and the whole shell while an expired session signs out, drawn over the family of page it covers (list, detail, create form or Home).

## When to use

- The first paint of a page whose data is still loading, when the layout is known.
- Home, before its metrics and recent activity arrive (Overview), or before the first project (Onboarding).
- Over the whole app while an expired session signs out (the Session wires), so the user sees the page dissolve into its frame instead of a blank screen.

## When not to use

- A single control or panel loading inside a ready page: use `Skeleton` or `Spinner` inside that panel only.
- A form whose options are loading: use the Loading state of `platform/states/form-validation`.
- A dashboard's own loading: use the Loading variant of that dashboard block (for example `platform/dashboard/analytics-dashboard`).
- A long upload or build: use `platform/states/project-intake` or `platform/states/async-submit`, which report progress.
- After the sign-out completes: `platform/auth` (SessionExpired).

## Building blocks

### A. Bands — `Skeleton` (required)

Every text line, number, chip and avatar is a band sized like the content it stands for: a heading band, label and value bands per metric, a delta chip, `kind="shape"` circles for avatar stacks. Vary the widths row to row so the wire reads as text, not a grid of bars.

### B. Frames — `Card` (required)

The same `Card` frames, with the same `:padded="false"` and inner padding as the real page, so the borders are already where the content will be. The metrics strip keeps its responsive dividers (one, two or four columns).

### C. Lists — `Item` (required)

Panels of rows use `Item.List` with `Item size="small"` and `Item.Content`, the same row height the real list renders, with a band per row.

## Do

- Draw the exact grid of the page that is coming: same columns, gaps and breakpoints.
- Use the real layout utilities (`layout-column`, `layout-boundary`, `--layout-section-gap`), not fixed sizes.
- Hide the bands from assistive technology and announce the wait once: `role="status"`, `aria-live="polite"`, `aria-busy="true"`, with a short screen-reader text on the session wires.
- Size the session wire to the measured header and rail in the app, so the frame does not move when it appears.
- Fade the session wire in with `motion-reduce:animate-none`.

## Don't

- Don't show a wire for less than a perceptible moment; if the data arrives within about 300 ms, paint the page directly.
- Don't use a generic spinner for a page whose layout is known.
- Don't animate each band independently; a shimmer comes from `Skeleton`.
- Don't mix real content and bands in one card; the card swaps in whole.
- Don't let the wire collapse to a few lines on wide screens; it holds the page's full footprint.
- Known gap: the Overview and Onboarding wires mark their body `aria-hidden="true"` but have no `role="status"` region, so a screen reader hears nothing while they show; the Session wires do announce.

## Copy

- **Bands:** no visible text. The wire has nothing to read.
- **Screen-reader status (session):** states what is happening, as a sentence: `Session expired. Signing you out.`
- **Screen-reader status (page):** names what is loading: `Loading the overview.`

## Accessibility

- The bands are decorative (`aria-hidden="true"` on the wire's body).
- The region that stands in for the page is `role="status"` with `aria-live="polite"` and `aria-busy="true"`; clear `aria-busy` when the content lands.
- The wire takes no focus and traps none; the real page receives focus as it would on a normal load.
- Respect `prefers-reduced-motion` on the entrance and on the shimmer.

## States

- Overview: the Home overview wire: heading, the four-metric strip, the side card, and the five-column row of list panels.
- Onboarding: the first-access Home wire: headline and prompt bands over three door cards, each with its illustration stage, three text lines and an action.
- Session: the whole shell as a wire over a list page: header bar, navigation rail with grouped items, the list controls row and a table card with header, eight rows and pagination.
- SessionDetail: the same over a detail page: tab bands under the header, a heading and two cards of field rows in the data column.
- SessionForm: the same over a create page: a heading and two cards of field rows in the create column, with the save bar held at the foot.
- SessionHome: the same over Home: the Overview wire centred in the data column.

## Related

- `platform/dashboard/home-dashboard` — the Home page the Overview and Onboarding wires stand in for.
- `platform/view/table-view` — the list page the Session wire draws.
- `platform/detail/details-page` — the detail page the SessionDetail wire draws.
- `platform/create/single-page-create` — the create page the SessionForm wire draws.
- `platform/auth` — where the session wire lands once the sign-out completes.
- `shells/console` — the header and rail the session wires reproduce.
