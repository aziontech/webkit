---
name: sections
category: sections
structure: composition
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: e1e4edd128b463ce3ed5d6610742029fd6f68ea562f47a066158527ff8b77032
---

# Sections — Component Spec

## Purpose

The one import that assembles a marketing page: `Sections` takes the page's `sections[]` JSON — a list of `{ _id, props }` entries — and renders each entry's page-section component with its props bound, in order. It is a registry compound, not an anatomy compound: the root is a dispatcher that provides nothing, every block (`Sections.UseCases`) is a complete, props-only component of its own, and the typed `registry` maps each site `_id` to its block. See `.claude/docs/SECTIONS.md` and `.claude/rules/compound-api.md` § Registry compounds.

## When to use

- In the site's page renderer: one `<Sections :sections="page.sections" />` per page.
- Anywhere a page is described as data and the blocks must come from one import.

## When NOT to use

- For a single, hand-placed block → import it from `@aziontech/webkit/sections/<name>` (tree-shakeable) or reach it as `Sections.<Block>`.
- For product-flow blocks (sign-up, onboarding, deploy success) → those are `templates`, not page sections.

## Related

- `use-cases` — the first block in the registry; every block is listed under Sub-components.
- `section-container` / `section-gap` — the column and the gaps the page wraps the rendered blocks in.

## Best practices

- Keep `_id` strings identical to the block names; the registry is keyed by them and an unknown id renders nothing.
- Give every entry a stable `_id` + props pair from the site JSON; do not pre-render blocks by hand and also pass them in `sections`.
- Wrap the output in the page column (`section-container`) — the root draws no column of its own.

## Usage

```vue
<script setup>
import Sections from '@aziontech/webkit/sections'
</script>

<template>
  <Sections
    :sections="[
      { _id: 'use-cases', props: { eyebrow: 'SQL Database', title: 'What teams use SQL Database for', items: [] } }
    ]"
  />
  <Sections.UseCases
    eyebrow="SQL Database"
    title="What teams use SQL Database for"
  />
</template>
```

Tree-shaking alternative — the standalone root, or one block on its own:

```vue
<script setup>
import Sections from '@aziontech/webkit/sections-root'
import UseCases from '@aziontech/webkit/sections/use-cases'
</script>
```

## Sub-components

The root `Sections` (`sections/sections/sections.vue`) owns the loop: for each entry it renders `registry[entry._id]` with `v-bind="entry.props"`, skipping ids the registry does not know. `registry.ts` beside it exports the `_id` → component map and `SectionId`; `index.ts` attaches every block to the root with `Object.assign` and exposes `registry` as a member. Nothing is provided or injected: a block renders the same whether it is reached through `Sections`, as `Sections.<Block>`, or from its own export. Member names are the PascalCase of the block's `_id`.

Blocks are sibling components under `src/components/sections/`, each with its own spec, test and `./sections/<name>` export:

- `../use-cases/use-cases.vue` — `Sections.UseCases`, registered as `'use-cases'`; see `.specs/use-cases.md` for its props.

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `sections` | `SectionEntry[]` | `[]` | false | The page's section entries, in render order; each is `{ _id, props }` where `_id` is a registry key and `props` is bound onto that block. Unknown ids are skipped. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Empty: when `sections` is empty, or no entry has a known `_id`, the root renders an empty container
- Each rendered block carries its own states; the root adds none

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| page fill | `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by each rendered block; the root is a plain `div` with no focusable element of its own.
- Keyboard map: none at the root; each block declares its own.
- ARIA: the root carries no role. Each block is its own landmark (`<section>` labelled by its heading), so the page outline is the blocks' outline in `sections` order.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by each block.
- `motion-reduce:transition-none motion-reduce:transform-none` — the root adds no motion.
- Touch target ≥40×40 px — owned by each block.

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
