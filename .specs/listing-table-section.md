---
name: listing-table-section
category: section
structure: monolithic
status: implemented
spec_version: 7
template: 2
created: 2026-11-05
last_updated: 2026-11-18
checksum: 40f125520efb6f1efab21d03cbbbd74f492c0600c00f4b4ad72916361fc1f85e
---

# ListingTableSection — Component Spec

## Purpose

A titled preview of a longer listing: a few linked rows in columns, and one outlined button into the full list. It is a page section — the site places it from a `{ _id: 'listing-table-section', props }` entry and binds `props` straight onto it — and it composes `module`, `module-header`, `registration-frame`, `table` and, below `sm`, `item`. Each row is one link named by its first column; a pointer click anywhere on the row follows that link (with the same modifier keys), and the link stays the keyboard and screen-reader path. The other columns are metadata in the small overline, each cut to one line with its full text as a tooltip. Below `sm` the same rows become a list of items, the first column as the title and the second as the description in the small overline, with the button going full width.

## When to use

- To preview the latest entries of a listing (open roles, releases, events) with a way into the full list.

## When NOT to use

- For a filterable or paginated listing → use `listing-index-section`.
- For a comparison of plans or features → use the pricing matrix.

## Related

- `table` — the composition table the wide layout renders.
- `listing-index-section` — the full listing this band links into.

## Best practices

- Keep three columns at most; the first names the row and the second describes it on phones.
- Give the wide columns `grow: 2` and align a short trailing column to `end`.
- Keep the preview to a handful of rows and point `primaryAction` at the full listing.

## Usage

```vue
<script setup>
  import ListingTableSection from '@aziontech/webkit/listing-table-section'
</script>

<template>
  <ListingTableSection
    title="Latest roles"
    :columns="[
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ]"
    :data="[
      {
        href: '/careers/software-engineer-go',
        values: {
          role: 'Software Engineer (Go)',
          team: 'Engineering · Porto Alegre',
          type: 'Hybrid · Full-time'
        }
      }
    ]"
    :primary-action="{ label: 'See all 23 roles', href: '/careers/jobs', trailing: true }"
  />
</template>
```

## Props

| Prop            | Type                          | Default     | Required | JSDoc                                                                                                                                                                                                                                            |
| --------------- | ----------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `anchor`        | `string`                      | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                                                   |
| `title`         | `string`                      | `''`        | false    | Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty.                                                                                                                             |
| `columns`       | `ListingTableSectionColumn[]` | `[]`        | false    | The columns left to right; each is `{ key, label, grow?, align? }` where `key` picks the row value, `grow` is the flex weight (1, 2 or 3) and `align` is `start` or `end`. The first column names the row and the second describes it on phones. |
| `data`          | `ListingTableSectionRow[]`    | `[]`        | false    | The linked rows, in order; each is `{ href, values }` where `values` maps a column key to its text.                                                                                                                                              |
| `primaryAction` | `ModuleHeaderAction`          | `undefined` | false    | Outlined button into the full listing, in the table footer; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent.                                                                                                 |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (row fill `var(--bg-hover)` in both the table and the list)
- Whole-row navigation: a click on a row outside its link is forwarded to the link, keeping `ctrl`/`meta`/`shift`/`alt`; a click that ends a text selection is not forwarded
- Metadata cells (every column after the first) render `text-overline-sm`, truncated to one line, with their full value as `title`
- Empty: when `data` or `columns` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the footer button only when `primaryAction` is set
- Below `sm` the table is hidden and the rows render as an item list

## Motion & Animations

_none_

## Tokens

| Region                | Token (DESIGN.md)                        |
| --------------------- | ---------------------------------------- |
| column headers        | `.text-overline-md`, `var(--text-muted)` |
| row title             | `.text-label-lg`, `var(--text-default)`  |
| row values            | `.text-overline-sm`, `var(--text-muted)` |
| row hover             | `var(--bg-hover)`                        |
| cell insets           | `var(--spacing-xl)`, `var(--spacing-lg)` |
| frame rules and marks | `var(--border-default)`                  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the row links and the composed `button`.
- Keyboard map: `Tab` reaches each row's link and then the button; `Enter` follows it.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the table keeps its native column headers; the phone list is the same rows as list items.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): row titles `var(--text-default)`, values `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the button carries its own fallback.
- Touch target ≥40×40 px — each phone row is a whole-item link; the button is large.

## Internationalization

- Built-in strings: none. Column labels, row values and the action arrive through props.
- Formatting: none; values arrive pre-formatted.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`); columns mirror with the table.
- Icons: the button's trailing chevron mirrors (owned by `button`).
- Keyboard: unchanged.
- User data: none.

## Responsive

- Container queries: none.
- Narrow (< `sm`): the table is hidden and the rows render as an item list, the description in the small overline, the button full width.
- Touch: each phone row is a whole-item link; each table row is a whole-row target.
- Reflow: no horizontal scroll at 320 px; metadata truncates instead of widening the table, its full text in the tooltip.

## Performance

- Bundle budget: the `./listing-table-section` entry in `.size-limit.json`.
- Runtime budget: `listing-table-1k` in `perf-budgets.json` (mount and replace 1k rows), measured by `src/test/performance.test.ts`.
- Heavy parts: the phone list and the table are both rendered and switched by CSS at the small breakpoint, so the server-rendered and hydrated markup stays one for every screen; the table composes the `table` root, which brings its state engine. Above 300 rows each of the two mounts its rows in chunks of 100 as the page scrolls near them (`LazyNodes`; an `aria-hidden` placeholder holds each chunk's place), so only the first 100 rows of a long listing are in the server-rendered HTML. Keep the listing to the dozens of rows a page shows and link to the full listing with `primaryAction`.

## Examples

- Default

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
