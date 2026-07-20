---
name: webkit-data-viz
description: Charts in a @aziontech/webkit app (edge metrics, request logs, cache-hit rates) render through theme tokens — categorical, sequential, and diverging palettes derived from the color families, never hardcoded hex — with the full state surface and an accessible data path. Use when building or reviewing any chart, dashboard, or KPI tile. Fixes the chart form per question, the color mapping, the anatomy, and the number formatting; governs how you render, not which charting library you pick.
status: active
last_updated: 2026-07-20
---

# Skill: webkit-data-viz

## Purpose

Azion Console is an observability product — edge traffic, request logs, cache-hit rates, latency —
so charts are a primary surface, not decoration. A chart muddy in one theme, or encoding six series
in six colors nobody can tell apart, or spinning forever on an empty dataset, is broken the same way
a mis-tokened button is. This skill fixes **how** a chart renders in a webkit app: the form you pick
for the question, the palette you derive from theme tokens, the anatomy every chart carries, and the
states a data-backed view owns. It does **not** pick your charting library — canvas or SVG rendering
is a consumer choice; the tokens and the method below are not.

## How to use

- `/webkit-data-viz` — apply the method to any chart, dashboard, or KPI tile you build in this
  conversation.
- `/webkit-data-viz <file>` — review the file's charts and report, per gap: the quoted line, what is
  wrong (form, color, anatomy, numbers, state, a11y), and the concrete token-mapped fix.

## How to find the components + palettes

Never guess an import path or a hex value. Resolve both from the contract:

- **Components** (`Skeleton`, `EmptyState`, `Message`, `CardBox`, `Tooltip`, `Table`, `StatusIndicator`):
  ask the **webkit MCP** — `suggest_component` in plain words ("empty state", "stat card") — or read
  the `imports` keys in **`node_modules/@aziontech/webkit/catalog.json`**. A subpath that is not a key
  there does not exist.
- **Palettes / tokens**: read the `tokens` tree in the same **`catalog.json`** (the `--color-*`
  families: `blue`, `violet`, `green`, `orange`, `yellow`, `red`, each `50`→`950`; plus `--success`,
  `--warning`, `--danger`, `--info`), or the human catalog in
  **`node_modules/@aziontech/webkit/docs/STYLEGUIDE.md`**. Derive every chart color from these — never
  from an implementation source file, never a raw hex.

## Choose the form by the question

The chart form follows the question the data answers, not the shape of the data:

| The question                            | Form                                                            |
| --------------------------------------- | --------------------------------------------------------------- |
| How does it move over time? (trend)     | line, or area for a single filled magnitude                     |
| How do categories compare?              | bar (horizontal when labels are long)                           |
| How do the parts make the whole?        | **stacked bar** — prefer over a pie; angles are hard to compare |
| How is a single measure distributed?    | histogram                                                       |
| What is the one number right now? (KPI) | a **stat tile** / big-number — not a one-slice chart            |

## Color — mapped to theme tokens, never hex

Pick the palette **kind** by what the color encodes, then take its values from the token families:

- **Categorical** (distinct series, no order): one hue per series, a fixed order chosen for adjacent
  contrast. Use a **mid step** (`400`/`500`) so the mark reads on both light and dark surfaces.
- **Sequential** (magnitude, e.g. a heatmap): one family's ramp, light→dark (`--color-blue-100` →
  `--color-blue-800`).
- **Diverging** (+/- around a midpoint): two hues meeting at a neutral middle (`red` ↔ neutral ↔
  `green`).
- **Semantic** (`--success` / `--warning` / `--danger`): status **only** — a failed region, a
  threshold breach. Never borrow a semantic token as a categorical accent, or a green series reads as
  "healthy" when it just means "series 3".

Two hard constraints: adjacent series need **≥3:1 contrast**, and you **never encode by color alone**
— pair the hue with a direct label, a line style (solid/dashed), a marker shape, or position, so the
chart survives color-blindness and a grayscale print.

```ts
// Categorical palette wired from tokens — one fixed order, max adjacent contrast.
// SVG marks: pass the var() string straight to fill/stroke — it re-themes for free.
const SERIES = [
  'var(--color-blue-400)',
  'var(--color-violet-400)',
  'var(--color-green-400)',
  'var(--color-orange-400)',
  'var(--color-yellow-400)',
  'var(--color-red-400)'
]

// Canvas libraries can't read CSS vars — resolve computed values, and RE-READ on theme
// change so the canvas repaints in the new theme (see webkit-theming-dark-mode).
const read = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim()
const seriesColors = () => SERIES.map((s) => read(s.slice(4, -1)))
```

## Anatomy — every chart carries these

A bare set of marks is not a chart. Each one needs: a **title**; **axis labels with units**; a
**legend** when there is more than one series (or direct labels on the marks); an **accessible
tooltip** on hover/focus; a **faint grid** (`--border-subtle`) that sits behind the data, not over it;
and, for a trend, **emphasis on the endpoint** — mark and label the last value, since "where it is now"
is what the reader came for.

## Numbers — aligned, consistent, abbreviated

- **`tabular-nums`** on every figure that stacks in a column or updates in place, so digits don't jitter.
- One **unit and precision** per axis/series (`48ms`, not `48ms` beside `0.05s`), and abbreviate large
  numbers consistently across the view (`1.2k`, `3.4M`, `1.1B`).

```vue
<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'

  // delta color encodes GOOD/BAD for the metric, not merely up/down —
  // a rising error rate is red even though the arrow points up.
  const stats = [
    { label: 'Requests', value: '3.4M', delta: '+12.4%', good: true },
    { label: 'Cache-hit rate', value: '96.2%', delta: '+0.8%', good: true },
    { label: 'Error rate', value: '0.42%', delta: '+0.30%', good: false }
  ] as const
</script>

<template>
  <div class="grid grid-cols-3 gap-[var(--spacing-md)]">
    <CardBox
      v-for="s in stats"
      :key="s.label"
      class="flex flex-col gap-[var(--spacing-xs)]"
    >
      <span class="text-body-sm text-[var(--text-muted)]">{{ s.label }}</span>
      <span class="text-big-number-lg text-[var(--text-default)] tabular-nums">{{ s.value }}</span>
      <span
        class="text-body-sm tabular-nums"
        :class="s.good ? 'text-[var(--text-success)]' : 'text-[var(--text-danger)]'"
        >{{ s.delta }}</span
      >
    </CardBox>
  </div>
</template>
```

## States — a chart is a data-backed view

A chart fetches, so it owns the full state surface, rendered **in the chart's own box** (never a
blank rectangle): **loading** → `Skeleton` sized to the chart area, reserving the layout so it doesn't
reflow; **empty** → `EmptyState` ("No requests in this window", + a range/filter action); **error** →
a `Message severity="danger"` with what failed and a retry. The trigger comes from the consuming app's
data layer; webkit ships the rendering of each state. Full matrix in **webkit-ui-states**.

## Accessibility

- The chart has an **accessible name and a one-line summary** (`aria-label` / a visually-hidden
  caption describing the trend), so a screen reader gets the takeaway, not "graphic".
- The underlying data is **also reachable as a table** (`Table`) for assistive tech and export — a
  canvas is opaque to AT on its own.
- Any **animated draw-in respects `motion-reduce:`** — no sweeping reveal for users who opted out
  (see **webkit-motion-polish**).

## Theme

Because every color is a token, the chart works in light **and** dark with no per-theme branch. SVG
`var()` marks re-theme automatically; canvas marks only re-theme if you re-read the tokens on theme
change (see **webkit-theming-dark-mode**). Verify both.

## Enforcement (honest)

Only the hex ban is machine-checked: the **token lint** blocks any hex / rgb-hsl / Tailwind-palette
literal in a chart's colors, so an off-token series fails the build. Everything else here — form
choice, palette kind, ≥3:1 contrast, color-blind pairing, anatomy, states, accessible summary — is
**review**, not a hook. The **ui-verify** skill screenshots the chart in light and dark as the paired
visual check; use it to confirm the theme claim above rather than eyeballing one mode.

## Hard rules

- Every chart color is a theme token (`var(--color-*)` / semantic) — **never** a hex, rgb/hsl, or
  Tailwind-palette literal.
- The form follows the question (trend→line, compare→bar, part-to-whole→stacked bar, distribution→
  histogram, one number→stat tile).
- Semantic tokens (`--success`/`--warning`/`--danger`) mean status only — never a categorical accent.
- Never encode by color alone; pair every hue with a label, shape, or position, and keep adjacent
  series ≥3:1.
- Every chart renders loading, empty, and error inside its own box — no blank async rectangle.
- Every chart has a title, axis units, a legend when >1 series, an accessible name, and a table path
  for the data.
- `tabular-nums` and one consistent unit/precision on all figures.

## Review output

For `/webkit-data-viz <file>`, list gaps grouped by chart. Each:

```
✗ TrafficChart.vue:42  stroke="#3b82f6" on the requests series
  color: hex literal — fails the token lint and won't re-theme in dark mode.
  fix: map the series to a token-derived palette (var(--color-blue-400)); resolve computed
       values for the canvas and re-read on theme change.

✗ TrafficChart.vue:88  v-if="data.length" with no empty/error branch
  state: Empty + Error missing — a failed or empty range renders a blank canvas.
  fix: Skeleton sized to the chart box while loading; EmptyState + Message severity="danger" (retry).
```

End with: `charts token-mapped + complete` or `N gaps — fix before ship`.

## Definition of Done

- [ ] Chart form matches the question it answers.
- [ ] Every color is a theme token; palette kind (categorical/sequential/diverging) fits the encoding;
      status tokens used for status only.
- [ ] No color-only encoding; adjacent series ≥3:1; labels/shapes/position carry the meaning too.
- [ ] Title, axis units, legend (>1 series), accessible name, and a table data path all present.
- [ ] `tabular-nums` + consistent units/precision; large numbers abbreviated consistently.
- [ ] Loading (Skeleton), empty (EmptyState), and error (Message) render in the chart's box.
- [ ] Verified in light and dark; animated draw-in respects `motion-reduce:`.
