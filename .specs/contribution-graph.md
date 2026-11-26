---
name: contribution-graph
category: chart
structure: monolithic
status: implemented
stability: preview
spec_version: 1
template: 2
checksum: d5926f3f385b971e76e1abe6f10d1f1f20a641262af3230395d5d02b74543034
created: 2026-11-24
last_updated: 2026-11-25
---

# ContributionGraph — Component Spec

## Purpose

Use ContributionGraph for a 52-week × 7-day calendar heatmap of daily activity intensity (platform contributions, deployments, builds, Copilot tasks) across a year. Each day renders as a cell shaded across five sequential intensity levels (0–4), with month and weekday axes, a hover and keyboard-focus readout, an intensity legend, and optional day selection so clicking a cell filters a sibling history list.

Unlike `Tracker` (a 1D status strip of discrete severities for uptime) or `Chart` (a continuous time-series plot), `ContributionGraph` reveals weekly and seasonal cadence of daily counts at a glance.

## When to use

- User profile platform contributions across a year, paired with a year-over-year selector and a `Timeline` of contribution history.
- Daily deployment, build, or AI workflow cadence over a 12-month period where streaks and active days matter.
- Any calendar-aligned daily intensity heatmap with up to 366 days where selecting a day filters activity details.

## When NOT to use

- Uptime or pass/fail severity history across discrete periods → use `tracker`.
- A continuous measured trend over time (requests/sec, latency, bandwidth) → use `chart` or `spark-chart`.
- Comparing totals across named categories → use `bar-list`.
- Picking a single date or date range in a form → use `date-picker` or `date-range-picker`.

## Related

- `tracker` — 1D severity strip for service uptime; `contribution-graph` is a 2D calendar grid of quantitative intensity.
- `timeline` — chronological activity feed commonly paired below `contribution-graph` and filtered by its `v-model:selected-date`.
- `stat-tile-group` — summary KPI strip placed above `contribution-graph` (total contributions, streaks, deployments).
- `card` — the surface `contribution-graph` usually sits inside; the graph itself has no outer card chrome.

## Best practices

- Supply ISO date strings (`YYYY-MM-DD`) in `items`; days without an entry render as level `0` (zero activity) so the calendar grid stays continuous.
- Pass `year` (e.g. `2026`) when showing a calendar year paired with a year-over-year selector; omit `year` to render the rolling 52 weeks ending at `endDate` (or the latest item date).
- Bind `v-model:selected-date` to filter a sibling `Timeline` or list to that day, and provide a visible clear control when a date is selected.
- Always supply `ariaLabel` naming the subject and period (e.g. `"Platform contributions in 2026"`).

## Usage

```vue
<script setup lang="ts">
  import ContributionGraph from '@aziontech/webkit/contribution-graph'
  import { ref } from 'vue'

  const selectedDate = ref<string | null>(null)
  const items = [
    { date: '2026-11-18', count: 6, level: 3 },
    { date: '2026-11-19', count: 12, level: 4 },
    { date: '2026-11-20', count: 2, level: 1 }
  ]
</script>

<template>
  <ContributionGraph
    v-model:selected-date="selectedDate"
    :items="items"
    :year="2026"
    aria-label="Platform contributions in 2026"
  />
</template>
```

## Props

| Prop         | Type                      | Default     | Required | JSDoc                                                                                                                                           |
| ------------ | ------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`      | `ContributionGraphItem[]` | `[]`        | false    | Daily contribution entries (`{ date: string; count: number; level?: ContributionGraphLevel; label?: string }`). Missing days render at level 0. |
| `year`       | `number`                  | `undefined` | false    | Calendar year to display (Jan 1 – Dec 31). When omitted, displays 52 weeks ending at `endDate` or the latest item date.                         |
| `endDate`    | `string`                  | `''`        | false    | ISO date (`YYYY-MM-DD`) ending a rolling 52-week window when `year` is omitted.                                                                 |
| `showLegend` | `boolean`                 | `true`      | false    | Renders the `Less … More` intensity legend in the footer.                                                                                       |
| `loading`    | `boolean`                 | `false`     | false    | Renders a Skeleton placeholder in place of the calendar grid.                                                                                   |
| `error`      | `string`                  | `''`        | false    | Error message; when set, renders an `EmptyState` with the message inside a `role="alert"` region in place of the grid.                          |
| `ariaLabel`  | `string`                  | `''`        | false    | Accessible name of the contribution grid.                                                                                                       |

## v-model

| Model                   | Type             | Default | Emits                 | Notes                                                                                               |
| ----------------------- | ---------------- | ------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| `v-model:selected-date` | `string \| null` | `null`  | `update:selectedDate` | ISO date (`YYYY-MM-DD`) of the selected day, or `null`. Clicking an already-selected day clears it. |

## Events

| Event    | Payload                                                            | Notes                                                               |
| -------- | ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `select` | `(event: MouseEvent \| KeyboardEvent, item: ContributionGraphDay)` | Fires when a day cell is activated by pointer click or Enter/Space. |

## Slots

_No slots._

## States

- Visual states: `default`, `hover` / `focus-visible` (active cell readout), `selected` (`aria-selected="true"` / `data-selected`), `loading` (Skeleton placeholder), `empty` (a small bordered `EmptyState` when `items` is empty and no `year` is set; with a `year` the grid renders all at level 0), `error` (a small bordered `EmptyState` with the message inside a `role="alert"` region).
- `data-loading` mirrors `loading` on the root; `data-error` is set when `error` is non-empty and not loading.
- `data-level` (`0` | `1` | `2` | `3` | `4`) on each day cell; `data-selected` when the cell matches `selectedDate`.
- Root carries `data-plain-ground` so a `Texture` beside it hides itself.

## Motion & Animations

| Trigger                | Animation / Transition                                        | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ---------------------- | ------------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| cell hover / selection | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02` · `productive-entrance`                 | `motion-reduce:transition-none` |

## Tokens

| Region                             | Token (DESIGN.md)                                              |
| ---------------------------------- | -------------------------------------------------------------- |
| typography (axis, footer, readout) | `.text-label-sm`                                               |
| level 0 cell                       | `var(--bg-placeholder)`                                        |
| level 1 cell                       | `var(--chart-sequential-2)`                                    |
| level 2 cell                       | `var(--chart-sequential-4)`                                    |
| level 3 cell                       | `var(--chart-sequential-5)`                                    |
| level 4 cell                       | `var(--chart-sequential-7)`                                    |
| text muted (axes & legend)         | `var(--text-muted)`                                            |
| text default (readout)             | `var(--text-default)`                                          |
| empty and error states             | `EmptyState` (`size="small"`, `bordered`)                      |
| spacing                            | `var(--spacing-2xs)`, `var(--spacing-xs)`, `var(--spacing-sm)` |
| shape                              | `var(--shape-control)`                                         |
| focus ring                         | `var(--ring-color)`, `var(--bg-surface)`                       |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface)` on each focusable cell (roving `tabindex`).
- Keyboard map: `Tab` focuses the active/selected cell in the grid; `ArrowUp` / `ArrowDown` moves by 1 day; `ArrowRight` / `ArrowLeft` moves by 1 week (mirrored under `dir="rtl"` via `logicalArrowKey`); `Home` / `End` jumps to the first/last day; `Enter` / `Space` toggles selection of the focused day; `Escape` clears `selectedDate`.
- ARIA: `role="grid"` with `aria-label` on the calendar grid, one `role="row"` per weekday, and each day a focusable `button` with `role="gridcell"`, a full localized `aria-label` (`"14 contributions on Oct 12, 2026"`) and `aria-selected` for selection; the padding days before the first and after the last day of the period are inert `aria-hidden` spacers, never cells; polite `aria-live` region announces the selected day (a focused cell already reads its own name, so focus and hover are not announced again); the grid is named by `ariaLabel`, else the locale's `Contributions`; `role="alert"` on error; `aria-busy="true"` while loading.
- Contrast: all intensity steps use `--chart-sequential-*` tokens and `forced-color-adjust-none` so cells remain distinguishable in light, dark, and forced-colors modes.
- `motion-reduce:transition-none` on cell transitions.

## Internationalization

| Key                                 | English source                                                       | Override prop |
| ----------------------------------- | -------------------------------------------------------------------- | ------------- |
| `contributionGraph.roleDescription` | `contribution calendar`                                              | —             |
| `contributionGraph.label`           | `Contributions`                                                      | `ariaLabel`   |
| `contributionGraph.noData`          | `No activity recorded`                                               | —             |
| `contributionGraph.errorTitle`      | `Contributions didn't load`                                          | —             |
| `contributionGraph.hint`            | `Select a day to see its activity`                                   | —             |
| `contributionGraph.less`            | `Less`                                                               | —             |
| `contributionGraph.more`            | `More`                                                               | —             |
| `contributionGraph.dayLabel`        | `{count} contribution on {date}` / `{count} contributions on {date}` | `item.label`  |
| `contributionGraph.dayZero`         | `No contributions on {date}`                                         | `item.label`  |

- Formatting: `Intl.DateTimeFormat` (short month names, short weekday names, localized cell dates) and `Intl.NumberFormat` via `useLocale()` from `ConfigProvider`.

## Right-to-left

- Layout: logical utilities only (`ms-`, `me-`, `ps-`, `pe-`, `text-start`); the grid flows along the inline axis so weeks progress right-to-left under `dir="rtl"`.
- Icons: the error (`az-triangle-alert`) and empty (`az-calendar`) icons are non-directional.
- Keyboard: `logicalArrowKey` swaps `ArrowLeft` and `ArrowRight` under `dir="rtl"` so inline-forward advances one week.
- User data: custom `item.label` text renders inside natural document flow.

## Responsive

- Container queries: none on the cell grid itself; the calendar sits inside an `overflow-x-auto` scroll container so all 52 weeks stay readable and crisp on narrow viewports without squashing cells below 10 px.
- Narrow (≤ 640 px): horizontal scroll on the calendar region; footer readout and legend wrap cleanly.
- Touch: tapping any cell updates the readout and selects/toggles that date without requiring hover.
- Reflow: the outer component never forces page-level horizontal overflow; only the calendar strip scrolls when narrower than 52 weeks.

## Performance

- Bundle budget: `7.2 KB` gzip (the entry includes `Skeleton`, `EmptyState` and the locale composables) for `./contribution-graph` in `.size-limit.json`.
- Runtime budget: rendering a full 366-day year completes in `< 16 ms` with a single flat grid of memoized day descriptors.
- Heavy parts: none.

## Examples

- Default — full year of Azion platform contributions with selectable days.
- Loading — Skeleton placeholder while contributions load.
- Empty — empty `items` array showing the no-activity state.
- Error — an `EmptyState` in an alert region when contributions fail to load.
- Markdown — the same graph as a `<ContributionGraph>` tag in a docs page.
- Page JSON — the same graph as a scene in the marketing site's page JSON.

## Constraints — DO NOT

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/primitives/animations/animate.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Variants + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Variants/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
