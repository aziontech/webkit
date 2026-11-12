# Tracker

> A status strip: one block per period — a day, an hour, a deployment — colored by its severity, with a readout of the period's label on hover or keyboard focus. It shows the history of a state at a glance (uptime, health checks, build results), where a `chart` would plot a measure.

- Import: `import Tracker from '@aziontech/webkit/tracker'`
- Category: chart · Surface: product · Structure: monolithic
- API as JSON: [tracker.json](https://github.com/aziontech/webkit/blob/main/.specs/tracker.json)

## When to use

- Uptime and availability history: ninety days of a service, a region or an origin.
- Pass/fail history: health checks, scheduled jobs, deployments.
- Any discrete sequence where each period has one state and the pattern of failures matters.

## Do

- Write each `label` as period plus state ("Nov 3 · Partial outage"), so the readout stands alone.
- Leave periods with no data without a severity; they render neutral rather than pretending to be healthy.
- Keep the period count fixed for a given view (90 days, 24 hours) so strips stacked in a list line up.
- Put the summary figure (99.98% uptime) beside the strip; the strip shows where, the figure shows how much.

## Don’t

- A measured value over time → use `chart` or `spark-chart`.
- The current state of one thing → use `status-indicator`.
- A ranking across categories → use `bar-list`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [status-indicator](status-indicator.md) — the current state; a Tracker is that state's history.
- [spark-chart](spark-chart.md) — a measured trend rather than a sequence of states.
- [chart-card](chart-card.md) — the box a Tracker sits in, with the uptime figure in its header.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `TrackerItem[]` | `[]` | false | One block per period, oldest first; each item is `{ id?: string; severity?: ChartStatus; label: string }`. No severity renders a neutral no-data block. |
| `loading` | `boolean` | `false` | false | Renders a Skeleton strip in place of the blocks. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the strip. |

## States

- Visual states: `default`, `active block` (pointer or keyboard; the others dim), `loading` (Skeleton strip), `empty` (one neutral strip announced as No data)
- `data-loading` mirrors `loading`
- `data-severity` on each block: `success` | `warning` | `danger` | `info` | `none`
- `data-active` on the active block; `data-dimmed` on every other block while one is active
- `data-visible` on the readout while a block is active; `data-moving` while it follows from one block to the next

## Accessibility

- The strip is one tab stop: `role="group"` named by `ariaLabel`, with `aria-roledescription="status history"`.
- Keyboard map: Left / Right move the active block, Home / End jump to the ends, Escape clears.
- A polite live region reads the active block's `label`; the visual readout is `aria-hidden`.
- Severity never rests on color alone: the label names the state.
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface)` on the strip (the offset takes the surface color, so it never shows as a white gap in the dark theme).
- Status colors clear 3:1 against the chart surfaces in both themes.
- Forced colors: the blocks keep their status colour (`forced-color-adjust: none`), because a background-painted block would be forced to `Canvas` and the whole tracker would vanish (`src/test/forced-colors-charts.test.ts`).

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none.
- Keyboard: `ArrowRight`/`ArrowLeft` move the active bar later/earlier, swapped under `dir="rtl"` (`logicalArrowKey`); the oldest bar sits at the start edge.
- Pointer: the hovered bar is measured from the start edge (`rect.right - clientX` under `rtl`), and the readout is anchored with a physical `left: 0` plus the mirrored bar center.
- User data: dates in the readout are printed by `Intl` in the active locale.

## Examples

### Default

```vue
<script setup>
  import Tracker from '@aziontech/webkit/tracker'

  const DAYS = 90
  const DEGRADED_DAY = 52
  const OUTAGE_DAY = 73

  const days = Array.from({ length: DAYS }, (_, index) => {
    const date = new Date(Date.UTC(2026, 10, 10 - (DAYS - 1 - index)))
    const id = date.toISOString().slice(0, 10)
    const day = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
    if (index === DAYS - 1) return { id, label: `${day} · No data` }
    if (index === OUTAGE_DAY) return { id, severity: 'danger', label: `${day} · Partial outage` }
    if (index === DEGRADED_DAY)
      return { id, severity: 'warning', label: `${day} · Degraded performance` }
    return { id, severity: 'success', label: `${day} · Operational` }
  })
</script>

<template>
  <div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
    <Tracker
      aria-label="Edge Application uptime, last 90 days"
      :items="days"
    />
  </div>
</template>
```

### Loading

```vue
<script setup>
  import Tracker from '@aziontech/webkit/tracker'
</script>

<template>
  <div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
    <Tracker
      aria-label="Edge Application uptime, last 90 days"
      loading
    />
  </div>
</template>
```

### Empty

```vue
<script setup>
  import Tracker from '@aziontech/webkit/tracker'
</script>

<template>
  <div class="w-full max-w-(--container-xl) pt-(--spacing-xl)">
    <Tracker
      aria-label="Edge Application uptime, last 90 days"
      :items="[]"
    />
  </div>
</template>
```
