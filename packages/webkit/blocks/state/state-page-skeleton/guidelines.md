# Page wires

The skeleton wires an app paints while a page is still arriving. The user's job does not change while they wait: they need to see the shape of the page they asked for, so the wire draws the real page's grid with `Skeleton` bands inside the same `Card` frames, and nothing shifts when the content lands. The set covers the Home overview, the first-access Home, and the whole shell while an expired session signs out, drawn over the family of page it covers (list, detail, create form or Home).

Overview and Onboarding are page bodies for the default slot of `ConsoleLayout` (`shell/shell-console`); the Session wires stand in for the whole app, layout included.

## When to use

- Use state-page-skeleton for the first paint of a whole page or shell; inside a block use that block's Loading variant.
- The first paint of a page whose data is still loading, when the layout is known.
- Home, before its metrics and recent activity arrive (Overview), or before the first project (Onboarding).
- Over the whole app while an expired session signs out (the Session wires), so the user sees the page dissolve into its frame instead of a blank screen.

## When not to use

- A single control or panel loading inside a ready page: use `Skeleton` or `Spinner` inside that panel only.
- A form whose options are loading: use the Loading state of `state/state-form-validation`.
- A dashboard's own loading: use the Loading variant of that dashboard block (for example `dashboard/dashboard-analytics`).
- A long upload or build: use `state/state-project-intake` or `state/state-async-submit`, which report progress.
- After the sign-out completes: `auth/auth-sign-in` (SessionExpired).

## Building blocks

### A. Bands — `Skeleton` (required)

Every text line, number, chip and avatar is a band sized like the content it stands for: a heading band, label and value bands per metric, a delta chip, `variant="rectangle"` circles for avatar stacks. Vary the widths row to row so the wire reads as text, not a grid of bars.

### B. Frames — `Card` (required)

The same `Card` frames, with the same `:padded="false"` and inner padding as the real page, so the borders are already where the content will be. The metrics strip keeps its responsive dividers (one, two or four columns).

### C. Lists — `Item` (required)

Panels of rows use `Item.List` with `Item size="small"` and `Item.Content`, the same row height the real list renders, with a band per row.

## Data

The wire shows no records and fetches nothing: the page renders it while its own request is pending and swaps in the real page when the data lands. `PageSkeletonProps` is exported from `state-page-skeleton.vue`.

| Prop    | Type     | What it does                                                                                      |
| ------- | -------- | ------------------------------------------------------------------------------------------------- |
| `label` | `string` | What is loading, the screen-reader text of the status region; `Loading the overview.` by default. |

The wire emits no events. To go live, render it in place of the page while the page's request is pending:

```vue
<script setup lang="ts">
  import StatePageSkeleton from './state-page-skeleton.vue'

  const { data, pending } = useOverview()
</script>

<template>
  <StatePageSkeleton
    v-if="pending && !data"
    label="Loading the overview."
  />
  <HomeOverview
    v-else
    :overview="data"
  />
</template>
```

## Do

- Draw the exact grid of the page that is coming: same columns, gaps and breakpoints.
- Use the real layout utilities (`layout-column`, `layout-boundary`, `--layout-section-gap`), not fixed sizes.
- Hide the bands from assistive technology and announce the wait once: `role="status"`, `aria-live="polite"`, `aria-busy="true"`, with a short screen-reader text on every wire.
- Size the session wire to the measured header and rail in the app, so the frame does not move when it appears.
- Fade the session wire in with `motion-reduce:animate-none`.

## Don't

- Don't show a wire for less than a perceptible moment; if the data arrives within about 300 ms, paint the page directly.
- Don't use a generic spinner for a page whose layout is known.
- Don't animate each band independently; a shimmer comes from `Skeleton`.
- Don't mix real content and bands in one card; the card swaps in whole.
- Don't let the wire collapse to a few lines on wide screens; it holds the page's full footprint.

## Copy

- **Bands:** no visible text. The wire has nothing to read.
- **Screen-reader status (session):** states what is happening, as a sentence: `Session expired. Signing you out.`
- **Screen-reader status (page):** names what is loading: `Loading the overview.` on the Overview wire, `Loading Home.` on the Onboarding wire.

## Accessibility

- The bands are decorative (`aria-hidden="true"` on the wire's body).
- The region that stands in for the page is `role="status"` with `aria-live="polite"` and `aria-busy="true"`; clear `aria-busy` when the content lands.
- The wire takes no focus and traps none; the real page receives focus as it would on a normal load.
- Respect `prefers-reduced-motion` on the entrance and on the shimmer.

## States

- Overview: the primary, its `label` naming what loads; the Home overview wire: heading, the four-metric strip, the side card, and the five-column row of list panels.
- Onboarding: the first-access Home wire: headline and prompt bands over three door cards, each with its illustration stage, three text lines and an action.
- Session: the whole shell as a wire over a list page: header bar, navigation rail with grouped items, the list controls row and a table card with header, eight rows and pagination.
- SessionDetail: the same over a detail page: tab bands under the header, a heading and two cards of field rows in the data column.
- SessionForm: the same over a create page: a heading and two cards of field rows in the create column, with the save bar held at the foot.
- SessionHome: the same over Home: the Overview wire centred in the data column.
- VersionDetail: the version page loading; form-column heading bands and two sectioned flush cards whose rows end in a switch band, one `role="status"` region with `aria-busy`, no tabs.

## Related

- `dashboard/dashboard-home` — the Home page the Overview and Onboarding wires stand in for.
- `view/view-table` — the list page the Session wire draws.
- `detail/detail-resource` — the detail page the SessionDetail wire draws.
- `create/create-page` — the create page the SessionForm wire draws.
- `detail/detail-version` — the version page the VersionDetail wire stands in for.
- `auth/auth-sign-in` — where the session wire lands once the sign-out completes.
- `shell/shell-console` — the header and rail the session wires reproduce.
