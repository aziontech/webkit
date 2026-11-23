# Tracker

> Use Tracker for the history of a state across periods (an uptime strip); the current state of one resource is a StatusIndicator. A status strip: one block per period — a day, an hour, a deployment — colored by its severity, with a readout of the period's label on hover or keyboard focus. It shows the history of a state at a glance (uptime, health checks, build results), where a `chart` would plot a measure.

- Import: `import Tracker from '@aziontech/webkit/tracker'`
- Category: chart · Surface: app · Structure: monolithic
- API as JSON: [tracker.json](tracker.json)

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
| `items` | `TrackerItem[]` | `[]` | false | One block per period, oldest first; each item is `{ id?: string; severity?: ChartSemanticSeverity; label: string }`. No severity renders a neutral no-data block. |
| `loading` | `boolean` | `false` | false | Renders a Skeleton strip in place of the blocks. |
| `error` | `string` | `''` | false | Error message; when set, the strip renders it inline (`role="alert"`, danger tokens kept under forced colors) in place of the blocks. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the strip. |
| `activeIndex` | `number \| null` | `null` | false | Two-way value (`v-model:activeIndex`). |

## v-model

| Model                  | Type             | Default | Emits                | Notes                                                                                                                                                                                                                          |
| ---------------------- | ---------------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model:active-index` | `number \| null` | `null`  | `update:activeIndex` | Index of the active block, via `defineModel('activeIndex')`: pointer, arrows, Home / End and Escape change it, so a page can sync the strip with a sibling chart's `v-model:active-index`. Unbound, the strip keeps it itself. |

## States

- Visual states: `default`, `active block` (pointer or keyboard; the others dim), `loading` (Skeleton strip), `empty` (one dashed strip that reads No data on screen and is announced as No data), `error` (inline danger line, `role="alert"`)
- `data-loading` mirrors `loading`
- `data-severity` on each block: `success` | `warning` | `danger` | `info` | `none`
- `data-active` on the active block; `data-dimmed` on every other block while one is active
- `data-state="open|closed"` on the readout: `open` while a block is active; `data-moving` while it follows from one block to the next

- Its root carries `data-plain-ground`: it is content that must sit on a plain ground, so a `Texture` beside it hides itself, and the texture-backdrop check blocks placing it on a textured band (a texture is a backdrop for text only, RV-T2-1).

- Narrow strips: every block keeps at least 6px; when the strip is too narrow for one block per period, consecutive periods merge into one block per bucket (the same number of periods each, the last bucket shorter), coloured by the worst state in it (danger, then warning, then info, then success). The readout and the live region read the bucket as `{count} periods. Worst: {label}`; pointer and arrow keys move by block, and `v-model:activeIndex` carries the worst period of the active block. A strip measured as zero wide (the server render) draws one block per period.

## Accessibility

- The strip is one tab stop: `role="group"` named by `ariaLabel`, with `aria-roledescription="status history"`.
- Keyboard map: Left / Right move the active block, Home / End jump to the ends, Escape clears.
- A polite live region reads the active block's `label`; the visual readout is `aria-hidden`.
- Browse mode: a visually hidden list holds one entry per period label, and a visually hidden summary (`tracker.summary` / `tracker.summaryWorst`: `90 periods. Worst: Nov 8 · Partial outage`) describes the strip through `aria-describedby`, as the table twins of `chart`, `donut-chart` and `map-chart` do.
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
  import { useLocale } from '@aziontech/webkit/use-locale'

  const DAYS = 90
  const DEGRADED_DAY = 52
  const OUTAGE_DAY = 73

  const { formatDate } = useLocale()

  const dayOf = (index) => new Date(Date.UTC(2026, 10, 10 - (DAYS - 1 - index)))
  const shortDate = (date) => formatDate(date, { month: 'short', day: 'numeric', timeZone: 'UTC' })

  const days = Array.from({ length: DAYS }, (_, index) => {
    const date = dayOf(index)
    const id = date.toISOString().slice(0, 10)
    const day = shortDate(date)
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
    <div
      aria-hidden="true"
      class="mt-(--spacing-xs) flex justify-between text-label-sm text-(--text-muted)"
    >
      <span>{{ shortDate(dayOf(0)) }}</span>
      <span>{{ shortDate(dayOf(DAYS - 1)) }}</span>
    </div>
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
