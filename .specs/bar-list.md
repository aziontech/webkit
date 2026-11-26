---
name: bar-list
category: chart
structure: monolithic
status: implemented
spec_version: 5
created: 2026-11-10
last_updated: 2026-11-18
checksum: af6af532102d175e0c26790c39f5b9eb15aeeea3af949dea8cef365cc654d2ef
---

# BarList — Component Spec

## Purpose

Use BarList for a ranked top-N breakdown inside a chart card; a list of mixed rows with actions is Item rows.

A ranked list of named values: each row is a tinted bar whose length is the value against the largest one, with the name inside the bar and the formatted value in a right-aligned column. It reads as a list, not a chart — no axes, no grid — so it suits top-N breakdowns inside a card, where a horizontal `chart` would spend its width on an axis gutter.

## When to use

- Top-N breakdowns inside a card: top paths, top countries, top user agents, top rules triggered.
- A ranking where the name matters as much as the size, and names are long enough to need the bar's full width.
- Rows that lead somewhere — a filtered view of that path or country — via `href` or `item-click`.

## When NOT to use

- Several series per category, or values over time → use `chart`.
- A share of a whole where the parts sum to 100% → use `donut-chart`.
- One value against a limit (quota, usage) → use `progress`.

## Related

- `chart` — horizontal bars with an axis, for comparing several series per category.
- `donut-chart` — the share view of the same breakdown when the parts sum to a whole.
- `chart-card` — the box a BarList sits in on a dashboard.

## Best practices

- Keep it to about ten rows; fold the tail into an "Other" row in the data rather than scrolling.
- Leave `sort` on `descending` for rankings; use `none` only when the order itself carries meaning (pipeline steps, weekdays).
- Pass the same `formatValue` as the chart beside it so a number reads the same in both.
- Give interactive rows a destination the user expects — a filtered view of that item — not a detail drawer of the whole list.

## Usage

```vue
<script setup>
  import BarList from '@aziontech/webkit/bar-list'
</script>

<template>
  <BarList
    aria-label="Top paths"
    :items="[
      { name: '/home', value: 843 },
      { name: '/documentation', value: 384 },
      { name: '/blocks', value: 108 },
      { name: '/imprint', value: 46 },
      { name: '/cancellation', value: 3 }
    ]"
  />
</template>
```

**Three ways in** (decision RV-C2-1, rule `webkit-content-channels`). The same data renders from a docs page as a tag (`DocMarkdown`, braced attribute values are JSON) and from the site's page JSON as the `BarList` scene a band draws by name (a `console-showcase-section` with `variant: "diagram"` in its `scene` slot):

```mdx
<BarList aria-label="Top paths" items={[{ "name": "/home", "value": 843 }]} />
```

```json
{ "component": "BarList", "props": { "items": [{ "name": "/home", "value": 843 }] } }
```

The function props (`formatValue`) and the events stay Vue. `DocMarkdown` and the scene registry load the component as an async chunk, so neither grows unless a page uses it.

## Props

| Prop               | Type                                    | Default         | Required | JSDoc                                                                                                                                                                                                                  |
| ------------------ | --------------------------------------- | --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `BarListItem[]`                         | `[]`            | false    | Rows to rank; each item is `{ id?: string; name: string; value: number; href?: string }`. An item with `href` renders as a link.                                                                                       |
| `sort`             | `'descending' \| 'ascending' \| 'none'` | `'descending'`  | false    | Row order; `none` keeps the order of `items`.                                                                                                                                                                          |
| `color`            | `ChartColor`                            | `1`             | false    | Hue of the bars: a categorical slot (1–8), `other`, or a status. The fill is that hue tinted over the surface.                                                                                                         |
| `clickable`        | `boolean`                               | `false`         | false    | Renders rows without an `href` as buttons that emit `item-click`.                                                                                                                                                      |
| `formatValue`      | `(value: number) => string`             | `formatCompact` | false    | Formats the value column.                                                                                                                                                                                              |
| `loading`          | `boolean`                               | `false`         | false    | Renders Skeleton rows in place of the list.                                                                                                                                                                            |
| `refetching`       | `boolean`                               | `false`         | false    | Holds the previous rows at reduced opacity while new data loads (the same as `chart`).                                                                                                                                 |
| `error`            | `string`                                | `''`            | false    | Error message; when set, the list renders an error state in an `alert` region instead of rows: a bordered small `EmptyState` with the error mark, `barList.errorTitle` and the message (the `error` slot replaces it). |
| `emptyTitle`       | `string`                                | `''`            | false    | Title of the empty state shown when `items` is empty. Empty uses the locale catalog (`No data available`).                                                                                                             |
| `emptyDescription` | `string`                                | `''`            | false    | Supporting line under the empty title: why the list is empty, or what to do next.                                                                                                                                      |
| `ariaLabel`        | `string`                                | `''`            | false    | Accessible name of the list.                                                                                                                                                                                           |

## Events

| Event        | Payload                                  | Notes                                                                                                                  |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `item-click` | `(event: MouseEvent, item: BarListItem)` | A row activated — a clickable row, or a link row (the link still navigates). `item` is the consumer's own item object. |

## Slots

| Slot            | Scope | Notes                                                             |
| --------------- | ----- | ----------------------------------------------------------------- |
| `empty`         | —     | Replaces the default `EmptyState` shown when `items` is empty.    |
| `empty-actions` | —     | Actions under the default empty state (a Clear filters or Retry). |
| `error`         | —     | Replaces the default error state shown while `error` is set.      |

The rows are data (`items`). The state surface matches `chart`, `donut-chart`, `gauge-chart` and `map-chart`.

## States

- Visual states: `default`, `hover` and `focus-visible` (interactive rows only), `loading` (Skeleton rows), `refetching` (previous rows at 60% opacity), `error` (error state in an `alert` region), `empty` (`EmptyState`). Precedence: loading, then error, then empty.
- `data-loading` mirrors `loading`; `data-refetching` mirrors `refetching`; `data-error` is set while an error shows
- `data-interactive` on a row that is a link or a button
- Bar width: `value / max`, at least 2% when the value is above zero, 0 when it is zero

- Its root carries `data-plain-ground`: it is content that must sit on a plain ground, so a `Texture` beside it hides itself, and the texture-backdrop check blocks placing it on a textured band (a texture is a backdrop for text only, RV-T2-1).

## Motion & Animations

| Trigger                   | Animation / Transition                                             | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------- |
| entrance and value change | bar `transition-[width] duration-slow-01 ease-productive-entrance` | `slow-01` · `productive-entrance`                      | `motion-reduce:transition-none` |
| row hover                 | `transition-colors duration-fast-02 ease-productive-entrance`      | `fast-02` · `productive-entrance`                      | `motion-reduce:transition-none` |
| refetching                | list `transition-opacity duration-moderate-01`                     | `moderate-01`                                          | `motion-reduce:transition-none` |

## Tokens

| Region    | Token (TOKENS.md)                                                                                                                                                                            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bar fill  | the `color` role (`var(--chart-series-1)` … `var(--chart-series-8)`, `var(--chart-series-other)`, `var(--chart-status-*)`) tinted over the surface, underlined by a 2px rule in the full hue |
| name      | `.text-label-md`, `var(--text-default)`                                                                                                                                                      |
| value     | `.text-label-md`, `tabular-nums`, `var(--text-default)`                                                                                                                                      |
| row hover | `var(--bg-hover)`                                                                                                                                                                            |
| shape     | `var(--shape-control)`                                                                                                                                                                       |
| spacing   | `var(--spacing-2xs)`, `var(--spacing-xs)`, `var(--spacing-md)`                                                                                                                               |
| ring      | `var(--ring-color)`                                                                                                                                                                          |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is an `<ol>` named by `ariaLabel`; each row is an `<li>` whose text reads "name, value" in order. The bar is decorative.
- A link row is a native `<a>`; a clickable row is a native `<button>`; a static row is neither, and is not focusable.
- Keyboard map: Tab moves between interactive rows; Enter activates (Space too on buttons).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface)` on interactive rows (the offset takes the surface color, so it never shows as a white gap in the dark theme).
- `aria-busy` on the root while `loading` or `refetching`.
- Name and value text clear 4.5:1 on the tinted fill and on the bare surface in both themes.
- The bar is underlined by a 2px rule in the full hue along its bottom edge (a solid mark, APCA Lc 30 or more on the surface in both themes), so the length reads in dark, where the tint alone stays under the mark target, and the rule never crosses the row label the way an inline-end cap did on short bars. The name and the value are `dir="auto"`, so a path or a number keeps its own order in right-to-left.
- Interactive rows are 32px tall and full width; a transparent hit area (`before:` pseudo-element, 4px above and below) makes the pointer target 40px without changing the look.
- Forced colors: the bar fill keeps its colour (`forced-color-adjust: none`); forced to `Canvas` it vanished and left only the labels (`src/test/forced-colors-charts.test.ts`).

## Examples

- Default — five ranked paths.
- Interactive — rows with `href` and a `clickable` list emitting `item-click`; justified because link and button rows render different elements.
- Loading — `loading`.
- Empty — `items` empty.
- Error — `error` set after a failed load; justified because `error` is a state the component owns.
- Markdown — the same data as a `<BarList>` tag rendered by `DocMarkdown`. Justified: the docs channel (RV-C2-1).
- Page JSON — the same data as a `BarList` scene in a `console-showcase-section` entry rendered by `SitePage`, with the JSON shown. Justified: the site channel (RV-C2-1).

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
