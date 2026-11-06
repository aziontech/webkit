---
name: hero-with-opening
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 2407d36acdbc38c4ede8d937edb7b50be9612f5fd96ef64d17ae3d34a76ccd97
---
# HeroWithOpening — Component Spec

## Purpose

The opening band of a product page followed straight by its arguments: a large centered title band with the page `h1`, overline, sentence and up to two actions, then a frame grid of three-column argument cells in the page column, closed by a hatched gap. It is a page section — the site places it from a `{ _id: 'hero-with-opening', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button`, `section-container`, `section-module`, `frame-box`, `card-grid`, `topic` and `section-gap`. The grid starts at the hero floor with no gap, so the arguments read as the second half of the hero.

## When to use

- To open a product page that argues on three or six claims right under its headline.

## When NOT to use

- For an opening band with no arguments → use `hero-band`.
- For a reasons band further down the page → use `feature-tiles` or `use-cases`.

## Related

- `hero-band` — the opening band without the argument grid.
- `topic` — the icon, heading and sentence each argument is rendered with.

## Best practices

- Use three or six items so every row of the grid is full.
- Keep each item to a short title and one sentence.
- A title longer than 45 characters widens the headline column so it breaks into two lines instead of three.

## Usage

```vue
<script setup>
import HeroWithOpening from '@aziontech/webkit/sections/hero-with-opening'
</script>

<template>
  <HeroWithOpening
    eyebrow="Firewall"
    title="Programmable firewall for distributed applications"
    description="Protect users, applications, and networks with rules you program."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
    :items="[
      { icon: 'pi pi-shield', title: 'Programmable rule engine', description: 'Define custom rules across OSI layers L3-L7.' },
      { icon: 'pi pi-code', title: 'Extensible with Functions', description: 'Run custom JavaScript security code.' },
      { icon: 'pi pi-sync', title: 'Real-time synchronization', description: 'Rules sync automatically across every data center.' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. A title longer than 45 characters widens the headline column. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `HeroWithOpeningAction` | `undefined` | false | First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `HeroWithOpeningAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `items` | `HeroWithOpeningItem[]` | `[]` | false | The arguments in reading order, three to a row; each is `{ icon, title, description }`. The grid renders only when there are items. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- The headline column is `xl` wide for a title of up to 45 characters and `4xl` wide for a longer one
- Empty: when `title` is empty the band renders nothing but its root; when `items` is empty the grid and its closing gap are omitted
- Each action renders only with a label and a link

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| cell fill | `var(--bg-canvas)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button`.
- Keyboard map: `Tab` moves through the actions.
- ARIA: the hero `<section>` is named by the headline (`aria-label`); the headline is the page `h1` and each argument's heading is an `h2` from `topic`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `hero-title`, `button` and `topic`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — the large buttons meet it.

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
