---
name: trace
category: code
structure: monolithic
status: implemented
spec_version: 8
template: 2
checksum: 55be49b1df12cee1ec5a49bb86009f653ef67b77aea1f2911d507662e6ebe97d
created: 2026-11-11
last_updated: 2026-11-18
---

# Trace — Component Spec

## Purpose

A span waterfall: one row per span of a run (a function invocation, a request through several services), indented under the span it ran inside and drawn as a bar placed against the run's own clock. The rows form a tree grid that expands and collapses, a search narrows them to the spans whose name or service matches, and selecting a row opens its details (service, start, duration, share of the run, outcome message and attributes) under the waterfall. It reads a flat `spans` list with `parentId` links and never fetches anything. With `zoomable`, a minimap under the axis draws the whole run and a window the reader drags or resizes (or moves from the keyboard) to zoom the waterfall into part of it, through `v-model:range`. A span can carry `events` — moments inside it, drawn as markers on its bar and listed in its details — and `highlightSlowest` flags the span that took longest. `highlightCriticalPath` traces the critical path — the chain of work that set the run's end, walked back from the root's end through the child that finished last before each point — and draws a line under each bar along the stretches of that span that lie on it, so the reader sees which work to shorten to make the run faster. The details of a span with children show its self time (its duration less the time its children covered), and of a span on the critical path, its time on that path. The same spans read in three views the reader picks with a `ToggleGroup` in the toolbar, bound to `v-model:view`: `waterfall` (the default: the tree of spans with a bar per row on the run clock), `timeline` (bars only, on one shared time axis: each nesting level is a band, and spans of a level that do not overlap share a lane, so a whole run fits in a few lines) and `tree` (the nesting only, with the start and duration of each span as text instead of a bar). Search, selection and the details are shared by the three views; the zoom applies to the two views with a time axis.

## When to use

- Use Trace for the timed span waterfall of one request or invocation; a nested data hierarchy without timing is a Tree.
- The test run of a function or the detail of one invocation, to show where the time went.
- A request that crossed several services, each with its own span, where the order and the overlap matter.
- Next to the run's logs (`log-viewer`), on the same clock.

## When NOT to use

- A list of log lines with levels → use `log-viewer`.
- Durations to compare across many items with no parent/child relation → use `bar-list` or `chart`.
- Status history of a service over days → use `tracker`.
- A hierarchy without time → use `tree`.
- In a docs Markdown page or the site's page JSON. Trace is app-only (decision RV-C2-1, rule `webkit-content-channels`): it explores one run (expand, search, select a span for its details), so it has no `DocMarkdown` tag and no page JSON entry. A docs page or the site explains where the time went with a `FlowDiagram` or a `Chart`.

## Related

- `log-viewer` — the run's log lines, shown under the trace on the same clock.
- `tree` — the same expand and collapse model without the time axis.
- `bar-list` — ranked durations without nesting.
- `key-value-list` — the facts of the run above the trace.

## Best practices

- Pass `start` and `duration` in milliseconds from the start of the run; the axis spans the latest end.
- Link children with `parentId`; a span whose parent is missing becomes a root, so a partial trace still renders.
- Set `status: 'error'` and a one-line `message` on the span that failed, and on its parents if the failure bubbled up.
- Turn on `zoomable` for a run with many short spans next to one long one, so the short ones can be read; bind `v-model:range` when the logs or a chart beside the trace should follow the same window.
- Use `events` for moments that have no duration of their own (a cache miss, a retry, the first byte), with `at` on the run's clock; keep the names short, they are listed in the details.
- Turn on `highlightCriticalPath` where the question is what to make faster: shortening a span off the path does not shorten the run, shortening one on it does. It reads better than `highlightSlowest` when work runs in parallel, because the longest span is not always the one that held the run up.
- Turn on `highlightSlowest` where the question is where the time went; the flag goes to the longest span under the root, never to the root itself, which always spans the run.
- Bind `v-model:view` when the reader's choice of view should last: the page can keep it across traces or sessions. Unbound, each trace opens in the waterfall.
- Use the timeline view for a run with many spans or a narrow panel, the tree view to read names and durations as text, the waterfall when both the nesting and the timing matter.
- Bind `v-model:selected-key` when another view (a request path, a log line) selects the same span.
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
    v-model:selected-key="selected"
    :spans="spans"
    aria-label="Trace of the test run"
  />
</template>
```

## Props

| Prop                    | Type          | Default | Required | JSDoc                                                                                                                                 |
| ----------------------- | ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `spans`                 | `TraceSpan[]` | `[]`    | false    | Spans of the trace, each `{ id, parentId?, name, service?, icon?, start, duration, status?, message?, attributes? }` in milliseconds. |
| `ariaLabel`             | `string`      | `''`    | false    | Accessible name of the waterfall. Empty uses the locale catalog.                                                                      |
| `bordered`              | `boolean`     | `true`  | false    | Draws the outer border and radius. Off for a trace inside a card or panel that has its own.                                           |
| `loading`               | `boolean`     | `false` | false    | Shows placeholder rows while the spans load; search and selection wait.                                                               |
| `zoomable`              | `boolean`     | `false` | false    | Shows a minimap under the axis to zoom the waterfall into a window of the run. Supports v-model:range.                                |
| `highlightSlowest`      | `boolean`     | `false` | false    | Flags the span that took longest, other than the root, in its row and its details.                                                    |
| `highlightCriticalPath` | `boolean`     | `false` | false    | Draws the critical path of the run under the bars and flags the spans on it in their rows and details.                                |

Types (exported from the component): `TraceSpan = { id: string; parentId?: string; name: string; service?: string; icon?: string; start: number; duration: number; status?: 'success' | 'error' | 'running'; message?: string; attributes?: Record<string, string | number>; events?: TraceSpanEvent[] }`, `TraceSpanEvent = { at: number; name: string }` (`at` in milliseconds from the start of the trace), `TraceRange = [number, number]` (start and end of the visible window, in milliseconds), `TraceView = 'waterfall' | 'timeline' | 'tree'`.

## v-model

| Model                 | Type                 | Default       | Emits                | Notes                                                                                                                                                                                                          |
| --------------------- | -------------------- | ------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:selectedKey` | `string`             | `''`          | `update:selectedKey` | Id of the span whose details show under the waterfall, via `defineModel('selectedKey')`. A row was selected, selected again (empty: deselected), or Close used. Unbound, the trace keeps the selection itself. |
| `v-model:view`        | `TraceView`          | `'waterfall'` | `update:view`        | The view the reader picked in the toolbar, via `defineModel('view')`: `waterfall`, `timeline` or `tree`. Unbound, the trace keeps the choice itself.                                                           |
| `v-model:range`       | `TraceRange \| null` | `null`        | `update:range`       | The visible window of the run clock, via `defineModel('range')`. `null` shows the whole run. Applied with or without `zoomable`; clamped to the run and widened to at least 1% of it.                          |

## Events

_None of its own._ The three models above are the only emits.

## Slots

_none_ — the search, the axis, the rows and the details are fixed parts.

## States

- Views: `data-view` on the root mirrors the model. `waterfall` and `tree` render the tree grid (in `tree` the second column holds the start and duration as text, with no axis, bars, grid lines or minimap); `timeline` renders a listbox of bars in lanes, each bar a named option with its name and duration inside when the bar is wide enough (a narrower bar carries them in its `title`); the first lane of each nesting level below the root starts with a divider (`data-level-start`). While searching, the timeline marks the bars that do not match `data-dimmed` and dims them instead of hiding them; a bar outside the zoom window is `data-outside`, hidden, and left out of the keyboard order. The view switch stays enabled while `loading`.
- Visual states: `default`, `hover` (row), `focus-visible` (row), `selected` (row and details band), `collapsed` / `expanded` (parent rows), `searching` (rows narrowed, every match's ancestors shown), `loading` (placeholder rows in a `role="status"` region, `aria-busy` on the root, search disabled, no details), `empty` (the package `EmptyState`, small: no spans, or no match with a Clear search action).
- Bar colour on `data-status` (`success`, `error`, `running`) plus `data-root` on a successful root span: root (info), `success`, `error` (danger), `running` (warning).
- `data-selected` on the selected row; `aria-expanded` on parent rows; `data-bordered` and `data-loading` on the root mirror their props.
- `zoomed` (a window narrower than the run): the axis, the bars and the event markers are placed against the window; a bar outside it is hidden (`data-outside`) while its row stays; the minimap shows the window and Reset zoom.
- `data-slowest` on the slowest span's row (with `highlightSlowest`).
- `data-critical` on the rows of spans on the critical path (with `highlightCriticalPath`); each stretch of the path is a line under its bar, placed against the visible window like the bar.

## Motion & Animations

| Trigger   | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| --------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| row hover | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                | Token (DESIGN.md)                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------- |
| surface               | `var(--bg-surface)`, `var(--border-default)`                                                              |
| view switch           | `ToggleGroup` (its own tokens)                                                                            |
| tree times            | `var(--text-muted)` start; duration `var(--text-default)`, `var(--text-danger)` when failed               |
| timeline selected bar | `var(--border-selected)` outline                                                                          |
| row dividers, grid    | `var(--border-muted)`                                                                                     |
| hovered row           | `var(--bg-hover)`                                                                                         |
| selected row          | `var(--bg-selected)`                                                                                      |
| bars                  | `var(--info)`, `var(--success)`, `var(--danger)`, `var(--warning)` with their `-border` and `-foreground` |
| details band          | `var(--bg-canvas)`                                                                                        |
| minimap track, window | `var(--bg-canvas)`; window `var(--bg-selected)` at 40% with a `var(--border-selected)` edge               |
| event marker          | `var(--text-default)` with a `var(--bg-surface)` ring                                                     |
| slowest flag          | `var(--text-default)` icon; `info` Tag in the details                                                     |
| critical path         | `var(--text-default)` line under the bar and `az-route` icon; `neutral` Tag in the details                |
| shape                 | `var(--shape-card)`, `var(--shape-button)`                                                                |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a 2 px inset ring on the focused row.
- View switch: a `ToggleGroup` named View (a `radiogroup` of Waterfall, Timeline and Tree) with its own arrow-key model; switching keeps the selection and the search.
- Timeline: a named `listbox` of `option`s in start order, one in the tab order (roving `tabindex`); `ArrowRight`/`ArrowDown` move to the next span, `ArrowLeft`/`ArrowUp` to the previous (the inline arrows swap under `dir="rtl"`), `Home`/`End` to the first and last, `Enter` or `Space` selects (again: deselects). Each option is named like a row and carries `aria-selected`. Lanes are `role="none"`.
- Keyboard map (waterfall and tree): one row is in the tab order (roving `tabindex`); `ArrowDown`/`ArrowUp` move between visible rows; `Home`/`End` go to the first and last row; `ArrowRight` expands a collapsed parent, or moves into its first child; `ArrowLeft` collapses an expanded parent, or moves to the parent; `Enter` or `Space` selects the row (again: deselects). Close in the details returns focus to the row (in the timeline, to the bar).
- ARIA: the waterfall is a named `treegrid` of `row`s with `aria-level`, `aria-posinset`, `aria-setsize`, `aria-expanded` (parents only) and `aria-selected`; each row is named with its span, service, start, duration and outcome; the details band is a named `region` that describes the grid. The axis, the bars' duration labels and the expand glyph are decorative (`aria-hidden`).
- Minimap: the two window edges are `role="slider"` thumbs named Zoom start and Zoom end, with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` in milliseconds and the formatted time as `aria-valuetext`. `ArrowRight`/`ArrowUp` move an edge by 1% of the run, `ArrowLeft`/`ArrowDown` back, `PageUp`/`PageDown` by 10%, `Home`/`End` to its limits, `Escape` resets the zoom. Reset zoom is a button. The span lines drawn in the minimap are decorative.
- Event markers are decorative; a row with events is named with their count, and the details list each event with its time. The slowest flag is named in the row (`Slowest`) and shown as a Tag in the details. The critical path lines are decorative; a span on the path is named in its row (`Critical path`), shown as a Tag in the details with its time on the path, so the path never depends on the line alone.
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
| `trace.criticalPath`                                 | Critical path                                    | —             |
| `trace.view`                                         | View                                             | —             |
| `trace.waterfall` / `timeline` / `tree`              | Waterfall / Timeline / Tree                      | —             |
| `trace.span`                                         | Span                                             | —             |
| `trace.onCriticalPath`                               | On critical path                                 | —             |
| `trace.selfTime`                                     | Self time                                        | —             |
| `trace.events`                                       | Events                                           | —             |
| `trace.eventCount`                                   | {count} event / {count} events                   | —             |

- Formatting: durations under one second print whole milliseconds, longer ones seconds with two decimals, both through `Intl.NumberFormat` of the active locale.

## Right-to-left

- Layout: logical utilities only; bars sit at `inset-inline-start` with an inline size, so the waterfall runs from the inline start and mirrors; indentation is `padding-inline-start`.
- Icons: the collapsed chevron is mirrored (`rtl:-scale-x-100`); span icons are not.
- Keyboard: `ArrowRight` and `ArrowLeft` swap under `dir="rtl"` (expand is the inline-end arrow).
- User data: services, attribute values and event names sit in `<bdi>`; a span name in a waterfall or tree row is `dir="ltr"` with `text-align: start`, so a long name keeps its beginning and its ellipsis falls at its end in any UI direction.
- Quantities: durations, start offsets, axis ticks and detail values sit in `<bdi>`, so `412 ms` never reads `ms 412` under `dir="rtl"`.
- Timeline bars sit at `inset-inline-start` with an inline size, so the lanes run from the inline start and mirror.
- Critical path lines sit at `inset-inline-start` with an inline size, like the bars, so they mirror with them.
- Minimap: the run clock starts at the inline start, so the track mirrors; the pointer position is read from the inline start and the slider arrows swap with `logicalArrowKey`.

## Responsive

- Container queries: `@container/trace`; below `@xl` a waterfall row takes two lines, the span name above its bar (axis, bars and minimap span the full width; the Span header hides); from `@xl` the name column sits beside the bars and grows from 13 rem to 20 rem with the container; the service column and the grid lines appear from `@xl`/`@3xl`.
- Toolbar: the search and the view switch wrap onto two lines when the trace is narrower than both.
- Narrow: the timeline view needs no name column and reads best in a narrow panel; names truncate, the duration labels stay on the bars, the details facts take two columns.
- Touch: rows and timeline lanes are 44 px high on `pointer: coarse`; a timeline bar narrower than a touch target is still reached from the keyboard and through the Waterfall and Tree views, which show the same span; nothing depends on hover. The minimap track sets `touch-action: none` so a drag zooms instead of scrolling, and its thumbs widen to 24 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 36.3 KB gzip for the initial chunk of `./trace` (it carries `input`, `button`, `copy-button`, `tag`, `toggle-group`, `empty-state` and `skeleton`) in `.size-limit.json`; the minimap, events, slowest flag and critical path add no dependency; the view switch adds `toggle-group`, whose `cn` (tailwind-merge) most apps already load through other components.
- Runtime budget: the tree and the visible rows recompute per search keystroke, toggle or zoom step; the minimap draws one line per span with no per-frame work while idle. The `Trace with 1k spans: mount and search` scenario of `performance.test.ts` holds it to its budget in `perf-budgets.json`; the critical path is one walk over the tree per change of `spans` (each span visited once, its children sorted once) and self time one sweep over a span's sorted children; the trace length is a reduce, never a spread, so very long traces do not hit the argument limit.
- Heavy parts: none; no virtualisation (a trace with thousands of spans should be paged by the product).

## Examples

- Default — a successful run, every span expanded.
- WithError — a failed run with the error bubbling to its parents.
- Selected — a selected span with its details and attributes.
- Empty — a trace with no spans, and the no-match state with Clear search; justified because both states use EmptyState.
- Loading — placeholder rows while the spans load; justified because `loading` is a state the consumer triggers.
- Zoom — `zoomable` with `v-model:range`: a long run zoomed into its first steps, with Reset zoom; justified because zooming needs its own canvas (a zoomed window).
- CriticalPath — `highlightCriticalPath` on a run whose work fans out in parallel, with a span on the path selected so its self time and time on the path show; justified because the path only reads on a run with parallel branches, which no other example has.
- Views — `v-model:view` bound by the page and opened on the timeline, so the choice outlives the trace; justified because the view model is the one prop no other example binds.
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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
