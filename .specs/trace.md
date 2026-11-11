---
name: trace
category: code
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 93e44d20687fb54f5e4896d410e848827e34b25af8903ace1a094977c2ae4fdb
created: 2026-11-11
last_updated: 2026-11-11
---

# Trace — Component Spec

## Purpose

A span waterfall: one row per span of a run (a function invocation, a request through several services), indented under the span it ran inside and drawn as a bar placed against the run's own clock. The rows form a tree grid that expands and collapses, a search narrows them to the spans whose name or service matches, and selecting a row opens its details (service, start, duration, share of the run, outcome message and attributes) under the waterfall. It reads a flat `spans` list with `parentId` links and never fetches anything.

## When to use

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

| Prop        | Type          | Default | Required | JSDoc                                                                                                                                 |
| ----------- | ------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `spans`     | `TraceSpan[]` | `[]`    | false    | Spans of the trace, each `{ id, parentId?, name, service?, icon?, start, duration, status?, message?, attributes? }` in milliseconds. |
| `selected`  | `string`      | `''`    | false    | Id of the span whose details show under the waterfall. Supports v-model:selected.                                                     |
| `ariaLabel` | `string`      | `''`    | false    | Accessible name of the waterfall. Empty uses the locale catalog.                                                                      |

Types (exported from the component): `TraceSpan = { id: string; parentId?: string; name: string; service?: string; icon?: string; start: number; duration: number; status?: 'ok' | 'error' | 'running'; message?: string; attributes?: Record<string, string | number> }`.

## Events

| Event             | Payload  | Notes                                                                  |
| ----------------- | -------- | ---------------------------------------------------------------------- |
| `update:selected` | `string` | A row was selected, selected again (empty: deselected), or Close used. |

## Slots

_none_ — the search, the axis, the rows and the details are fixed parts.

## States

- Visual states: `default`, `hover` (row), `focus-visible` (row), `selected` (row and details band), `collapsed` / `expanded` (parent rows), `searching` (rows narrowed, every match's ancestors shown), `empty` (no spans, or no match with Clear search).
- Bar tones on `data-tone`: `root` (info), `ok` (success), `error` (danger), `running` (warning).
- `data-selected` on the selected row; `aria-expanded` on parent rows.

## Motion & Animations

| Trigger   | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| --------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| row hover | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region             | Token (DESIGN.md)                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| surface            | `var(--bg-surface)`, `var(--border-default)`                                                            |
| row dividers, grid | `var(--border-muted)`                                                                                   |
| hovered row        | `var(--bg-hover)`                                                                                       |
| selected row       | `var(--bg-selected)`                                                                                    |
| bars               | `var(--info)`, `var(--success)`, `var(--danger)`, `var(--warning)` with their `-border` and `-contrast` |
| details band       | `var(--bg-canvas)`                                                                                      |
| shape              | `var(--shape-card)`, `var(--shape-button)`                                                              |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: a 2 px inset ring on the focused row.
- Keyboard map: one row is in the tab order (roving `tabindex`); `ArrowDown`/`ArrowUp` move between visible rows; `Home`/`End` go to the first and last row; `ArrowRight` expands a collapsed parent, or moves into its first child; `ArrowLeft` collapses an expanded parent, or moves to the parent; `Enter` or `Space` selects the row (again: deselects). Close in the details returns focus to the row.
- ARIA: the waterfall is a named `treegrid` of `row`s with `aria-level`, `aria-posinset`, `aria-setsize`, `aria-expanded` (parents only) and `aria-selected`; each row is named with its span, service, start, duration and outcome; the details band is a named `region` that describes the grid. The axis, the bars' duration labels and the expand glyph are decorative (`aria-hidden`).
- Rows are 36 px high (44 px on `pointer: coarse`).
- Colour is never the only signal: a failed span also carries an icon in the row and a Failed tag in the details.
- Contrast ≥4.5:1 from the semantic text tokens; duration labels use the `-contrast` tokens of their tone.

## Internationalization

| Key                                                  | English source                                   | Override prop |
| ---------------------------------------------------- | ------------------------------------------------ | ------------- |
| `trace.label`                                        | Trace                                            | `ariaLabel`   |
| `trace.search`                                       | Search spans                                     | —             |
| `trace.noMatch`                                      | No span matches “{query}”.                       | —             |
| `trace.clearSearch`                                  | Clear search                                     | —             |
| `trace.empty`                                        | No spans in this trace.                          | —             |
| `trace.details`                                      | Details of {name}                                | —             |
| `trace.close`                                        | Close                                            | —             |
| `trace.copyName`                                     | Copy span name                                   | —             |
| `trace.service` / `startedAt` / `duration` / `share` | Service / Started at / Duration / Share of trace | —             |
| `trace.percent`                                      | {value}%                                         | —             |
| `trace.failed` / `running`                           | Failed / Running                                 | —             |
| `trace.attributes`                                   | Attributes                                       | —             |
| `trace.milliseconds` / `seconds`                     | {value} ms / {value} s                           | —             |

- Formatting: durations under one second print whole milliseconds, longer ones seconds with two decimals, both through `Intl.NumberFormat` of the active locale.

## Right-to-left

- Layout: logical utilities only; bars sit at `inset-inline-start` with an inline size, so the waterfall runs from the inline start and mirrors; indentation is `padding-inline-start`.
- Icons: the collapsed chevron is mirrored (`rtl:-scale-x-100`); span icons are not.
- Keyboard: `ArrowRight` and `ArrowLeft` swap under `dir="rtl"` (expand is the inline-end arrow).
- User data: span names, services and attribute values sit in `<bdi>`.

## Responsive

- Container queries: `@container/trace`; the name column grows from 9 rem to 20 rem with the container, the service column and the grid lines appear from `@xl`/`@3xl`.
- Narrow: names truncate, the duration labels stay on the bars, the details facts take two columns.
- Touch: rows are 44 px high on `pointer: coarse`; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 20 KB gzip for `./trace` (it carries `input`, `button`, `copy-button` and `tag`) in `.size-limit.json`.
- Runtime budget: the tree and the visible rows recompute per search keystroke or toggle; a few hundred spans stay under one frame.
- Heavy parts: none; no virtualisation (a trace with thousands of spans should be paged by the product).

## Stories (Storybook)

- Default — a successful run, every span expanded.
- WithError — a failed run with the error bubbling to its parents.
- Selected — a selected span with its details and attributes.

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
