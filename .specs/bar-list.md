---
name: bar-list
category: chart
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
checksum: 184fe87064e423935f3af6a005541924c6d8ffa2b5eca5c6916aefa5b25b6421
---

# BarList — Component Spec

## Purpose

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

## Props

| Prop          | Type                                    | Default               | Required | JSDoc                                                                                                                            |
| ------------- | --------------------------------------- | --------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `items`       | `BarListItem[]`                         | `[]`                  | false    | Rows to rank; each item is `{ id?: string; name: string; value: number; href?: string }`. An item with `href` renders as a link. |
| `sort`        | `'descending' \| 'ascending' \| 'none'` | `'descending'`        | false    | Row order; `none` keeps the order of `items`.                                                                                    |
| `color`       | `ChartColor`                            | `1`                   | false    | Hue of the bars: a categorical slot (1–6), `other`, or a status. The fill is that hue tinted over the surface.                   |
| `clickable`   | `boolean`                               | `false`               | false    | Renders rows without an `href` as buttons that emit `item-click`.                                                                |
| `formatValue` | `(value: number) => string`             | `formatCompact`       | false    | Formats the value column.                                                                                                        |
| `loading`     | `boolean`                               | `false`               | false    | Renders Skeleton rows in place of the list.                                                                                      |
| `emptyTitle`  | `string`                                | `'No data available'` | false    | Title of the empty state shown when `items` is empty.                                                                            |
| `ariaLabel`   | `string`                                | `''`                  | false    | Accessible name of the list.                                                                                                     |

## Events

| Event        | Payload                                  | Notes                                                                                                                  |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `item-click` | `(event: MouseEvent, item: BarListItem)` | A row activated — a clickable row, or a link row (the link still navigates). `item` is the consumer's own item object. |

## Slots

_No slots — the rows are data (`items`); the empty state is the package's `EmptyState` titled by `emptyTitle`._

## States

- Visual states: `default`, `hover` and `focus-visible` (interactive rows only), `loading` (Skeleton rows), `empty` (`EmptyState`)
- `data-loading` mirrors `loading`
- `data-interactive` on a row that is a link or a button
- Bar width: `value / max`, at least 2% when the value is above zero, 0 when it is zero

## Motion & Animations

| Trigger                   | Animation / Transition                                             | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------- |
| entrance and value change | bar `transition-[width] duration-slow-01 ease-productive-entrance` | `slow-01` · `productive-entrance`                 | `motion-reduce:transition-none` |
| row hover                 | `transition-colors duration-fast-02 ease-productive-entrance`      | `fast-02` · `productive-entrance`                 | `motion-reduce:transition-none` |

## Tokens

| Region    | Token (DESIGN.md)                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| bar fill  | the `color` role (`var(--chart-series-1)` … `var(--chart-series-6)`, `var(--chart-series-other)`, `var(--chart-status-*)`) tinted over the surface |
| name      | `.text-label-md`, `var(--text-default)`                                                                                                            |
| value     | `.text-label-md`, `tabular-nums`, `var(--text-default)`                                                                                            |
| row hover | `var(--bg-hover)`                                                                                                                                  |
| shape     | `var(--shape-elements)`                                                                                                                            |
| spacing   | `var(--spacing-xxs)`, `var(--spacing-xs)`, `var(--spacing-md)`                                                                                     |
| ring      | `var(--ring-color)`                                                                                                                                |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is an `<ol>` named by `ariaLabel`; each row is an `<li>` whose text reads "name, value" in order. The bar is decorative.
- A link row is a native `<a>`; a clickable row is a native `<button>`; a static row is neither, and is not focusable.
- Keyboard map: Tab moves between interactive rows; Enter activates (Space too on buttons).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1` on interactive rows.
- `aria-busy` on the root while `loading`.
- Name and value text clear 4.5:1 on the tinted fill and on the bare surface in both themes.
- Interactive rows are 32px tall and full width.

## Stories (Storybook)

- Default — five ranked paths.
- Interactive — rows with `href` and a `clickable` list emitting `item-click`; justified because link and button rows render different elements.
- Loading — `loading`.
- Empty — `items` empty.

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
