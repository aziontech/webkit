---
name: listing-browser
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 1d0d3c43d8d8526cae45696f9fb195384d7612e205012defc7f06e70957a1b4c
---

# ListingBrowser — Component Spec

## Purpose

The full, browsable listing of a page such as the Careers jobs list: a headline over a toolbar (a search field, one select per facet and one for the order) and every row under its group, as a table from the small breakpoint up and as a list of items below it, with an empty state when nothing matches. Search, facets and order are local state over the rows the page carries; a facet is seeded from `?<key>=` in the URL when the value is one the page offers. It is a page section — the site places it from a `{ _id: 'listing-browser', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `section-title`, `frame-box`, `input-text`, `select`, `table`, `item`, `empty-state` and `button` rather than owning any anatomy of its own.

## When to use

- For a listing a reader narrows by text and by a few facets, such as open positions grouped by department.
- When every row links to its own page and the listing fits in the page JSON.

## When NOT to use

- For a short, unfiltered preview of the same rows → use `listing-table`.
- For a data table with sorting, selection and pagination inside the product → use `table`.
- For a grid of linked topic cards → use `subject-library`.

## Related

- `table` — the composed rows and cells the listing renders from the small breakpoint up.
- `item` — the list rows the listing renders below the small breakpoint.
- `empty-state` — the state shown when the search and facets match nothing.

## Best practices

- Name the first column after what the row is (`Role`); it is the row's link, and the second column describes the row on phones.
- Give every row the facet values it carries under the facet's `key`, so the selects narrow it.
- Keep `groups` in the order the reader scans; rows of a group not listed there are not shown.
- Make the first entry of `sorts` the order the page is authored in, with an empty `by`.

## Usage

```vue
<script setup>
import ListingBrowser from '@aziontech/webkit/listing-browser'
</script>

<template>
  <ListingBrowser
    title="Open positions"
    :columns="[
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ]"
    :rows="[
      {
        href: '/careers/software-engineer-go',
        group: 'Engineering',
        values: { role: 'Software Engineer (Go)', team: 'Engineering · Porto Alegre', type: 'Hybrid · Full-time' },
        facets: { area: ['Engineering'] }
      }
    ]"
    :groups="['Engineering']"
    :facets="[
      { key: 'area', label: 'Department', allLabel: 'All departments', options: [{ value: 'Engineering', label: 'Engineering' }] }
    ]"
    :sorts="[
      { value: 'newest', label: 'Newest posted', by: '' },
      { value: 'title', label: 'Title (A–Z)', by: 'role' }
    ]"
    sort-aria-label="Sort positions"
    :search="{ placeholder: 'Search by title, team, or location', shortPlaceholder: 'Search positions', label: 'Search positions' }"
    :empty="{ title: 'Nothing here yet', description: 'No open positions match your search.', clearLabel: 'View all open positions' }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page `id` of the band, the target of a `#hash` link. |
| `title` | `string` | `''` | false | Headline over the listing, rendered by the section title as its `h2` and naming the band. |
| `columns` | `ListingBrowserColumn[]` | `[]` | false | The columns, left to right; each is `{ key, label, grow?, align? }`. The first names the row and links it, the second describes it on phones. |
| `rows` | `ListingBrowserRow[]` | `[]` | false | Every row, in source order; each is `{ href, group, values, facets }` where `values` and `facets` are keyed by column and facet. |
| `groups` | `string[]` | `[]` | false | The groups the rows are listed under, in order; a group with no matching row is not shown. |
| `facets` | `ListingBrowserFacet[]` | `[]` | false | The facet selects; each is `{ key, label, allLabel, options }` where `key` matches a row facet and seeds it from `?key=` in the URL, and every option is `{ value, label }`. |
| `sorts` | `ListingBrowserSort[]` | `[]` | false | The orders, the first the default; each is `{ value, label, by? }` where `by` is the column it sorts on and an empty `by` keeps the source order. |
| `sortAriaLabel` | `string` | `''` | false | Accessible name of the order select. |
| `search` | `ListingBrowserSearch` | `undefined` | false | The search field; `{ placeholder, shortPlaceholder, label }` where `shortPlaceholder` is used below the large breakpoint and `label` names the field. Omitted when absent. |
| `empty` | `ListingBrowserEmpty` | `undefined` | false | The state shown when nothing matches; `{ title, description, clearLabel }` where `clearLabel` is the button that clears the search and every facet. Omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `filtered`, `empty`
- Filtered: the search matches a row when any of its values contains the query, ignoring case; every facet set to a value keeps only the rows carrying it; the order select sorts on its column or keeps the source order
- Empty: when the search and facets match no row, `empty-state` replaces the table and the list, and its button clears the search and every facet; without `empty`, nothing is shown in their place
- Seeded: on mount a facet takes the value of `?<key>=` in the URL when it is one of its options
- Absent: when `rows` is empty the band renders nothing — not the header, not the toolbar
- The table renders from the small breakpoint up, the list below it; the toolbar stacks below the large breakpoint, where the search field shows `shortPlaceholder`

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (column headers, group headings) | `.text-overline-md` |
| typography (row link) | `.text-label-lg` |
| row link and group heading | `var(--text-default)` |
| column headers and meta cells | `var(--text-muted)` |
| group row fill | `var(--bg-surface)` |
| row hover fill | `var(--bg-canvas)` |
| list row hover fill | `var(--bg-hover)` |
| rules | `var(--border-default)` |
| band inset | `var(--spacing-xl)` |
| header inset | `var(--spacing-xxl)` |
| toolbar inset and gap | `var(--spacing-lg)`, `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `input-text`, `select` and `button`; each row link draws `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the row it stretches over.
- Keyboard map: `Tab` moves through the search field, the selects and the row links in reading order; a select opens on `Enter`, `Space` or `ArrowDown`, moves with the arrows and closes on `Escape` (all `select`'s own); `Enter` follows a row link.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the toolbar is a `role="search"` region; the search field is named by `search.label`, each facet select by its `label` and the order select by `sortAriaLabel`; each group is an `h3`; the table is `table`'s `role="table"`, and the phone list is `item`'s `role="list"` of `role="listitem"` rows.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): row links and group headings `var(--text-default)`, headers and meta `var(--text-muted)`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the field, select and button transitions belong to the composed components, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the search field, selects and empty-state button are large; each row link stretches over its whole row.

## Stories (Storybook)

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
