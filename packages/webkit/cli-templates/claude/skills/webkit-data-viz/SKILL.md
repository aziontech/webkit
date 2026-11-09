---
name: webkit-data-viz
description: The token adapter that maps charts onto @aziontech/theme — every series color derived from the --color-* families (never hex), computed tokens re-read on a data-theme change so a canvas re-themes (SVG re-themes for free), and the chart's loading/empty/error surface rendered with webkit components. For chart-form and palette theory, use the generic dataviz skill; this skill covers only mapping that onto theme tokens. Use when building or reviewing a chart, dashboard, or KPI tile in a webkit app.
status: active
last_updated: 2026-10-20
scope: general
enforced_by: [webkit-tokens, webkit-component-states, ui-verify]
---

# Skill: webkit-data-viz

## Purpose

A chart muddy in one theme, or spinning forever on an empty dataset, is broken the same way a
mis-tokened button is — and Azion Console is an observability product, so charts are a primary
surface, not decoration. This skill is the **token adapter**: it takes the charting decisions and
realizes them in `@aziontech/theme`. **For chart-form (which form answers which question) and palette
theory (categorical / sequential / diverging, contrast math, color-blind pairing), see the generic
`dataviz` skill; this skill covers only mapping that onto `@aziontech/theme` tokens** — reaching for
the shipped chart components first (`Chart`, `DonutChart`, `StatTile`, `ChartCard`), taking every
color from the validated `--chart-*` role (never hex, never a hand-picked `--color-*` step),
re-reading computed tokens on a `data-theme` change when a canvas library is unavoidable, and
rendering the chart's loading / empty / error surface with webkit components.

## How to use

- `/webkit-data-viz` — apply the token mapping to any chart, dashboard, or KPI tile you build in this
  conversation. Pick the form and the palette **kind** with the generic `dataviz` skill first, then map
  it onto tokens here.
- `/webkit-data-viz <file>` — review the file's charts and report, per gap: the quoted line, the token
  problem (off-token color, no theme re-read, missing state, non-tabular figures), and the concrete
  token-mapped fix. Form and palette-kind review belong to the generic `dataviz` skill.

## How to find the components + tokens

Never guess an import path or a hex value. Resolve both from the contract:

- **Chart components first.** `@aziontech/webkit/chart` (lines, areas and bars composed from
  `Chart.Grid`, `Chart.Axis`, `Chart.Line`, `Chart.Area`, `Chart.Bar`, `Chart.Crosshair`,
  `Chart.Tooltip`, `Chart.Legend`), `@aziontech/webkit/donut-chart`, `@aziontech/webkit/stat-tile`
  and `@aziontech/webkit/chart-card` already carry the palette, the tooltip, the legend, the keyboard
  model, the table twin and the state surface. Use them before adding a charting library.
- **Other components** (`Skeleton`, `EmptyState`, `Message`, `CardBox`, `StatusIndicator`): ask the
  **webkit MCP** — `suggest_component` in plain words ("empty state", "stat card") — or read the
  `imports` keys in **`node_modules/@aziontech/webkit/catalog.json`**. A subpath that is not a key
  there does not exist.
- **Tokens**: the `--chart-*` role in the `tokens` tree of the same **`catalog.json`**, or the human
  catalog in **`node_modules/@aziontech/webkit/docs/STYLEGUIDE.md`**. Derive every chart color from
  it — never a raw hex.

## Map the palette kind onto the `--chart-*` role

The generic `dataviz` skill decides the palette **kind**; the role already realizes each one,
validated for color-vision separation and 3:1 contrast in both themes:

- **Categorical** (distinct series, no order): `--chart-series-1` … `--chart-series-6`, in a fixed
  order that is the same in both themes. A seventh series folds into `--chart-series-other`; never
  generate or reuse a hue.
- **Sequential** (magnitude, e.g. a heatmap): `--chart-sequential-1` (lowest) … `--chart-sequential-7`.
- **Diverging** (+/- around a midpoint): `--chart-diverging-negative`, `--chart-diverging-neutral`,
  `--chart-diverging-positive`.
- **Status** (`--chart-status-success` / `-warning` / `-danger` / `-info`): only for a series whose
  color MEANS a state — blocked requests, an error rate. Never borrow one as a categorical accent, or a
  green series reads as "healthy" when it just means "series 3".
- **Chrome**: `--chart-grid`, `--chart-axis`, `--chart-label`, `--chart-crosshair`, and the inverse
  tooltip `--chart-tooltip-bg` / `--chart-tooltip-text` / `--chart-tooltip-muted`.

```ts
// The webkit components assign these for you. A custom SVG mark passes the var() straight to
// fill / stroke — it re-themes for free.
const SERIES = [1, 2, 3, 4, 5, 6].map((slot) => `var(--chart-series-${slot})`)

// Canvas libraries can't read CSS vars — resolve computed values, and RE-READ on data-theme
// change so the canvas repaints in the new theme (see /webkit-theming-dark-mode).
const read = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()
const seriesColors = () => SERIES.map((s) => read(s.slice(4, -1)))
```

## States — a chart is a data-backed view

A chart fetches, so it owns the full state surface, rendered **in the chart's own box** (never a
blank rectangle): **loading** → `Skeleton` sized to the chart area, reserving the layout so it doesn't
reflow; **empty** → `EmptyState` ("No requests in this window", + a range/filter action); **error** →
a `Message severity="danger"` with what failed and a retry. The trigger comes from the consuming app's
data layer; webkit ships the rendering of each state. Full matrix in `/webkit-ui-states`.

## Numbers — tabular figures, deltas read good or bad

**`tabular-nums`** on every figure that stacks in a column or updates in place, so digits don't jitter.
A delta's color encodes GOOD/BAD for the metric, not merely up/down — a rising threat count is bad
even though the arrow points up. `StatTile` does this for you: pass `inverse` on every metric where
a rise is bad.

```vue
<script setup lang="ts">
  import StatTile from '@aziontech/webkit/stat-tile'
</script>

<template>
  <div class="grid grid-cols-3 gap-(--spacing-md)">
    <StatTile
      label="Requests"
      :value="3400000"
      :delta="12.4"
      delta-label="vs previous 24 hours"
    />
    <StatTile
      label="Cache hit ratio"
      :value="96.2"
      :delta="0.8"
      delta-label="vs previous 24 hours"
    />
    <StatTile
      label="Error rate"
      :value="0.42"
      :delta="0.3"
      delta-label="vs previous 24 hours"
      inverse
    />
  </div>
</template>
```

## Theme

Because every color is a token, the chart works in light **and** dark with no per-theme branch. SVG
`var()` marks re-theme automatically; canvas marks only re-theme if you re-read the tokens on a
`data-theme` change (see `/webkit-theming-dark-mode`). Verify both.

## Enforcement (honest)

Only the hex ban is machine-checked: the **token lint** blocks any hex / rgb-hsl / Tailwind-palette
literal in a chart's colors, so an off-token series fails the build. The canvas theme re-read, the
state surface, and `tabular-nums` are **review**, not a hook — and form choice, palette kind, contrast,
and anatomy live in the generic `dataviz` skill and are review there. The `/webkit-ui-verify` skill
screenshots the chart in light and dark as the paired visual check; use it to confirm the theme claim
above rather than eyeballing one mode.

## Hard rules

- Use `Chart` / `DonutChart` / `StatTile` / `ChartCard` before a charting library.
- Every chart color is a `--chart-*` token — **never** a hex, rgb/hsl, Tailwind-palette literal, or a
  hand-picked `--color-*` step.
- SVG marks take the `var()` string directly; canvas marks resolve computed values and **re-read on a
  `data-theme` change** so the canvas repaints in the new theme.
- `--chart-status-*` means status only — never a categorical accent; series slots follow
  declaration order and never cycle.
- Every chart renders loading, empty, and error inside its own box (`Skeleton` / `EmptyState` /
  `Message`) — no blank async rectangle.
- `tabular-nums` on every figure that stacks in a column or updates in place.
- Pick the form and the palette kind with the generic `dataviz` skill **before** mapping onto tokens.

## Review output

For `/webkit-data-viz <file>`, list gaps grouped by chart. Each:

```
✗ TrafficChart.vue:42  stroke="#3b82f6" on the requests series
  token: hex literal — fails the token lint and won't re-theme in dark mode.
  fix: render it with Chart, or map the series to var(--chart-series-1); resolve computed
       values for a canvas and re-read on the data-theme change.

✗ TrafficChart.vue:88  v-if="data.length" with no empty/error branch
  state: Empty + Error missing — a failed or empty range renders a blank canvas.
  fix: Skeleton sized to the chart box while loading; EmptyState + Message severity="danger" (retry).
```

End with: `charts token-mapped + complete` or `N gaps — fix before ship`.

## Definition of Done

- [ ] Every color is a `--chart-*` token; the palette kind (chosen with the generic `dataviz` skill)
      is realized via the role; status tokens used for status only.
- [ ] SVG marks pass `var()` directly; canvas marks re-read computed tokens on a `data-theme` change.
- [ ] Loading (`Skeleton`), empty (`EmptyState`), and error (`Message`) render in the chart's box.
- [ ] `tabular-nums` on every stacked/updating figure.
- [ ] Verified in light and dark (`/webkit-ui-verify` screenshots both).
- [ ] Form and palette chosen with the generic `dataviz` skill before token mapping.
