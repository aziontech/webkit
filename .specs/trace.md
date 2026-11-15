---
name: trace
category: code
structure: monolithic
status: implemented
spec_version: 5
template: 2
checksum: 7bf7009b5b0a6b2d062a8b45d54a8996b961e1379c8d7078f31b85c8e79a1917
created: 2026-11-11
last_updated: 2026-11-15
---

# Trace — Component Spec

## Purpose

A span waterfall: one row per span of a run (a function invocation, a request through several services), indented under the span it ran inside and drawn as a bar placed against the run's own clock. The rows form a tree grid that expands and collapses, a search narrows them to the spans whose name or service matches, and selecting a row opens its details (service, start, duration, share of the run, outcome message and attributes) under the waterfall. It reads a flat `spans` list with `parentId` links and never fetches anything. With `zoomable`, a minimap under the axis draws the whole run and a window the reader drags or resizes (or moves from the keyboard) to zoom the waterfall into part of it, through `v-model:range`. A span can carry `events` — moments inside it, drawn as markers on its bar and listed in its details — and `highlightSlowest` flags the span that took longest.

## When to use

- Use Trace for the timed span waterfall of one request or invocation; a nested data hierarchy without timing is a Tree.
- The test run of a function or the detail of one invocation, to show where the time went.
- A request that crossed several services, each with its own span, where the order and the overlap matter.
- Next to the run's logs (`log-view`), on the same clock.

## When NOT to use

- A list of log lines with levels → use `log-view`.
- Durations to compare across many items with no parent/child relation → use `bar-list` or `chart`.
- Status history of a service over days → use `tracker`.
- A hierarchy without time → use `tree`.

## Related

- `log-view` — the run's log lines, shown under the trace on the same clock.
- `tree` — the same expand and collapse model without the time axis.
- `bar-list` — ranked durations without nesting.
- `key-value-pairs` — the facts of the run above the trace.

## Best practices

- Pass `start` and `duration` in milliseconds from the start of the run; the axis spans the latest end.
- Link children with `parentId`; a span whose parent is missing becomes a root, so a partial trace still renders.
- Set `status: 'error'` and a one-line `message` on the span that failed, and on its parents if the failure bubbled up.
- Turn on `zoomable` for a run with many short spans next to one long one, so the short ones can be read; bind `v-model:range` when the logs or a chart beside the trace should follow the same window.
- Use `events` for moments that have no duration of their own (a cache miss, a retry, the first byte), with `at` on the run's clock; keep the names short, they are listed in the details.
- Turn on `highlightSlowest` where the question is where the time went; the flag goes to the longest span under the root, never to the root itself, which always spans the run.
- Bind `v-model:selected` when another view (a request path, a log line) selects the same span.
- Name the waterfall after the run (`aria-label="Trace of inv_7f21"`).

## Usage

```vue
<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    { id: 'root', name: 'image-resizer', service: 'Function', start: 0, duration: 412 },
    {
      id: 'fetch',
      parentId: 'root',
      name: 'fetch-origin',
      service: 'Network',
      start: 16,
      duration: 186
    },
    { id: 'encode', parentId: 'root', name: 'encode', service: 'Compute', start: 256, duration: 92 }
  ]
  const selected = ref('')
</script>

<template>
  <Trace
    v-model:selected="selected"
    :spans="spans"
    aria-label="Trace of the test run"
  />
</template>
```

## Props

| Prop               | Type          | Default | Required | JSDoc                                                                                                                                 |
| ------------------ | ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `spans`            | `TraceSpan[]` | `[]`    | false    | Spans of the trace, each `{ id, parentId?, name, service?, icon?, start, duration, status?, message?, attributes? }` in milliseconds. |
| `ariaLabel`        | `string`      | `''`    | false    | Accessible name of the waterfall. Empty uses the locale catalog.                                                                      |
| `bordered`         | `boolean`     | `true`  | false    | Draws the outer border and radius. Off for a trace inside a card or panel that has its own.                                           |
| `loading`          | `boolean`     | `false` | false    | Shows placeholder rows while the spans load; search and selection wait.                                                               |
| `zoomable`         | `boolean`     | `false` | false    | Shows a minimap under the axis to zoom the waterfall into a window of the run. Supports v-model:range.                                |
| `highlightSlowest` | `boolean`     | `false` | false    | Flags the span that took longest, other than the root, in its row and its details.                                                    |

Types (exported from the component): `TraceSpan = { id: string; parentId?: string; name: string; service?: string; icon?: string; start: number; duration: number; status?: 'success' | 'error' | 'running'; message?: string; attributes?: Record<string, string | number>; events?: TraceSpanEvent[] }`, `TraceSpanEvent = { at: number; name: string }` (`at` in milliseconds from the start of the trace), `TraceRange = [number, number]` (start and end of the visible window, in milliseconds).

## v-model

| Model              | Type                 | Default | Emits             | Notes                                                                                                                                                                                                       |
| ------------------ | -------------------- | ------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:selected` | `string`             | `''`    | `update:selected` | Id of the span whose details show under the waterfall, via `defineModel('selected')`. A row was selected, selected again (empty: deselected), or Close used. Unbound, the trace keeps the selection itself. |
| `v-model:range`    | `TraceRange \| null` | `null`  | `update:range`    | The visible window of the run clock, via `defineModel('range')`. `null` shows the whole run. Applied with or without `zoomable`; clamped to the run and widened to at least 1% of it.                       |

## Events

_None of its own._ The two models above are the only emits.

## Slots

_none_ — the search, the axis, the rows and the details are fixed parts.

## States

- Visual states: `default`, `hover` (row), `focus-visible` (row), `selected` (row and details band), `collapsed` / `expanded` (parent rows), `searching` (rows narrowed, every match's ancestors shown), `loading` (placeholder rows in a `role="status"` region, `aria-busy` on the root, search disabled, no details), `empty` (the package `EmptyState`, small: no spans, or no match with a Clear search action).
- Bar colour on `data-status` (`success`, `error`, `running`) plus `data-root` on a successful root span: root (info), `success`, `error` (danger), `running` (warning).
- `data-selected` on the selected row; `aria-expanded` on parent rows; `data-bordered` and `data-loading` on the root mirror their props.
- `zoomed` (a window narrower than the run): the axis, the bars and the event markers are placed against the window; a bar outside it is hidden (`data-outside`) while its row stays; the minimap shows the window and Reset zoom.
- `data-slowest` on the slowest span's row (with `highlightSlowest`).

## Motion & Animations

| Trigger   | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| --------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| row hover | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                | Token (DESIGN.md)                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| surface               | `var(--bg-surface)`, `var(--border-default)`                                                            |
| row dividers, grid    | `var(--border-muted)`                                                                                   |
| hovered row           | `var(--bg-hover)`                                                                                       |
| selected row          | `var(--bg-selected)`                                                                                    |
| bars                  | `var(--info)`, `var(--success)`, `var(--danger)`, `var(--warning)` with their `-border` and `-contrast` |
| details band          | `var(--bg-canvas)`                                                                                      |
| minimap track, window | `var(--bg-canvas)`; window `var(--bg-selected)` at 40% with a `var(--border-selected)` edge             |
| event marker          | `var(--text-default)` with a `var(--bg-surface)` ring                                                   |
| slowest flag          | `var(--text-default)` icon; `info` Tag in the details                                                   |
| shape                 | `var(--shape-card)`, `var(--shape-button)`                                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a 2 px inset ring on the focused row.
- Keyboard map: one row is in the tab order (roving `tabindex`); `ArrowDown`/`ArrowUp` move between visible rows; `Home`/`End` go to the first and last row; `ArrowRight` expands a collapsed parent, or moves into its first child; `ArrowLeft` collapses an expanded parent, or moves to the parent; `Enter` or `Space` selects the row (again: deselects). Close in the details returns focus to the row.
- ARIA: the waterfall is a named `treegrid` of `row`s with `aria-level`, `aria-posinset`, `aria-setsize`, `aria-expanded` (parents only) and `aria-selected`; each row is named with its span, service, start, duration and outcome; the details band is a named `region` that describes the grid. The axis, the bars' duration labels and the expand glyph are decorative (`aria-hidden`).
- Minimap: the two window edges are `role="slider"` thumbs named Zoom start and Zoom end, with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` in milliseconds and the formatted time as `aria-valuetext`. `ArrowRight`/`ArrowUp` move an edge by 1% of the run, `ArrowLeft`/`ArrowDown` back, `PageUp`/`PageDown` by 10%, `Home`/`End` to its limits, `Escape` resets the zoom. Reset zoom is a button. The span lines drawn in the minimap are decorative.
- Event markers are decorative; a row with events is named with their count, and the details list each event with its time. The slowest flag is named in the row (`Slowest`) and shown as a Tag in the details.
- Rows are 36 px high (44 px on `pointer: coarse`).
- Colour is never the only signal: a failed span also carries an icon in the row and a Failed tag in the details.
- Contrast ≥4.5:1 from the semantic text tokens; duration labels use the `-foreground` tokens of their status.

## Internationalization

| Key                                                  | English source                                   | Override prop |
| ---------------------------------------------------- | ------------------------------------------------ | ------------- |
| `trace.label`                                        | Trace                                            | `ariaLabel`   |
| `trace.search`                                       | Search spans                                     | —             |
| `trace.noMatch`                                      | No span matches “{query}”.                       | —             |
| `trace.clearSearch`                                  | Clear search                                     | —             |
| `trace.emptyTitle`                                   | No spans in this trace.                          | —             |
| `trace.loading`                                      | Loading spans                                    | —             |
| `trace.details`                                      | Details of {name}                                | —             |
| `trace.close`                                        | Close                                            | —             |
| `trace.copyName`                                     | Copy span name                                   | —             |
| `trace.service` / `startedAt` / `duration` / `share` | Service / Started at / Duration / Share of trace | —             |
| `trace.percent`                                      | {value}%                                         | —             |
| `trace.failed` / `running`                           | Failed / Running                                 | —             |
| `trace.attributes`                                   | Attributes                                       | —             |
| `trace.milliseconds` / `seconds`                     | {value} ms / {value} s                           | —             |
| `trace.zoom` / `resetZoom`                           | Zoom / Reset zoom                                | —             |
| `trace.zoomStart` / `zoomEnd`                        | Zoom start / Zoom end                            | —             |
| `trace.slowest`                                      | Slowest                                          | —             |
| `trace.events`                                       | Events                                           | —             |
| `trace.eventCount`                                   | {count} event / {count} events                   | —             |

- Formatting: durations under one second print whole milliseconds, longer ones seconds with two decimals, both through `Intl.NumberFormat` of the active locale.

## Right-to-left

- Layout: logical utilities only; bars sit at `inset-inline-start` with an inline size, so the waterfall runs from the inline start and mirrors; indentation is `padding-inline-start`.
- Icons: the collapsed chevron is mirrored (`rtl:-scale-x-100`); span icons are not.
- Keyboard: `ArrowRight` and `ArrowLeft` swap under `dir="rtl"` (expand is the inline-end arrow).
- User data: span names, services, attribute values and event names sit in `<bdi>`.
- Minimap: the run clock starts at the inline start, so the track mirrors; the pointer position is read from the inline start and the slider arrows swap with `logicalArrowKey`.

## Responsive

- Container queries: `@container/trace`; the name column grows from 9 rem to 20 rem with the container, the service column and the grid lines appear from `@xl`/`@3xl`.
- Narrow: names truncate, the duration labels stay on the bars, the details facts take two columns.
- Touch: rows are 44 px high on `pointer: coarse`; nothing depends on hover. The minimap track sets `touch-action: none` so a drag zooms instead of scrolling, and its thumbs widen to 24 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 14.75 KB gzip for the initial chunk of `./trace` (it carries `input`, `button`, `copy-button`, `tag`, `empty-state` and `skeleton`) in `.size-limit.json`; the minimap, events and slowest flag add no dependency.
- Runtime budget: the tree and the visible rows recompute per search keystroke, toggle or zoom step; the minimap draws one line per span with no per-frame work while idle. The `Trace with 1k spans: mount and search` scenario of `performance.test.ts` holds it to its budget in `perf-budgets.json`; the trace length is a reduce, never a spread, so very long traces do not hit the argument limit.
- Heavy parts: none; no virtualisation (a trace with thousands of spans should be paged by the product).

## Examples

- Default — a successful run, every span expanded.
- WithError — a failed run with the error bubbling to its parents.
- Selected — a selected span with its details and attributes.
- Empty — a trace with no spans, and the no-match state with Clear search; justified because both states use EmptyState.
- Loading — placeholder rows while the spans load; justified because `loading` is a state the consumer triggers.
- Zoom — `zoomable` with `v-model:range`: a long run zoomed into its first steps, with Reset zoom; justified because zooming needs its own canvas (a zoomed window).
- SpanEvents — spans with `events` drawn as markers and `highlightSlowest` flagging the longest step, the slowest span selected so its events show in the details; justified because markers and the slowest flag need their own canvas.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
