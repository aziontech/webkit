---
name: hero-band
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: d501820b40f8ec2c933701c2e24f39110aeb5c6d005633d2068f41c9fe159f07
---
# HeroBand — Component Spec

## Purpose

The opening band of a marketing page: the page `h1` with its overline, accent phrase, sentence and up to two actions, full width above the page column, with an optional client strip on the floor. It is a page section — the site places it from a `{ _id: 'hero-band', props }` entry and binds `props` straight onto it — and it composes `hero`, `hero-title`, `button` and `illustration`. `kind` picks the layout only: `centered` fills a screen over a dot field with the copy centered, `title-band` is a padded band with the copy centered, `pixel-floor` sets the copy at the start over an animated pixel floor, and `copy-beside-art` sets an illustration beside the copy; every layout takes the same copy, actions and client strip.

## When to use

- To open a home, solution, product, listing or contact page with its headline and main actions.

## When NOT to use

- For a hero followed by a grid of arguments → use `hero-with-opening`.
- For a hero with a topology scene under the copy → use `hero-copy-on-top-art`.
- For a band inside the page column → use `section-module` or a sibling section.

## Related

- `hero` — the band primitive every layout is rendered with.
- `hero-title` — the headline block rendered inside it.

## Best practices

- Use `title-band` with `size="large"` for a product page and `size="medium"` for a page whose bands start right under the headline.
- Give `illustration` and `illustrationAriaLabel` only to the `copy-beside-art` layout; the other layouts ignore them.
- Set `headerOffset` to the height of the site header so a band that fills a screen fills exactly the first screen with it.

## Usage

```vue
<script setup>
import HeroBand from '@aziontech/webkit/hero-band'
</script>

<template>
  <HeroBand
    kind="title-band"
    size="large"
    eyebrow="Cache"
    title="Deliver content fast, worldwide"
    description="Serve cached content close to users."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Docs', href: '/docs', trailing: true }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `HeroBandKind` | `'title-band'` | false | Layout of the band: `centered` fills a screen over a dot field, `title-band` is a padded band, `pixel-floor` sets the copy over an animated pixel floor, `copy-beside-art` sets an illustration beside the copy. |
| `size` | `HeroBandSize` | `'medium'` | false | Vertical rhythm of the band; `large` is the opening a product page leads with. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline. |
| `highlight` | `string` | `''` | false | Opening words of the headline, painted in the brand accent; reads as one sentence with `title`. |
| `title` | `string` | `''` | false | Page headline, rendered as the page `h1`; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `HeroBandAction` | `undefined` | false | First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `secondaryAction` | `HeroBandAction` | `undefined` | false | Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. |
| `carouselLabel` | `string` | `''` | false | Overline above the client strip. |
| `carouselMarks` | `string[]` | `[]` | false | Registry names of the client marks on the band floor, in order; the strip renders only when it has marks. |
| `illustration` | `string` | `''` | false | Registry name of the illustration set beside the copy in the `copy-beside-art` layout. |
| `illustrationAriaLabel` | `string` | `''` | false | Accessible description of the illustration. |
| `headerOffset` | `string` | `''` | false | Height of the site header above the band, taken out of a band that fills a screen; any CSS length. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and drives the hero's height, width, backdrop and the copy alignment
- Empty: when `title` is empty the band renders nothing but its root
- The client strip renders only when `carouselMarks` has marks; each action renders only with a label and a link; the illustration renders only in the `copy-beside-art` layout with `illustration` set

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| pixel floor fill | `var(--bg-surface)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button`.
- Keyboard map: `Tab` moves through the actions; the client strip is not focusable.
- ARIA: the hero `<section>` is named by the full headline (`aria-label`); the headline is the page `h1`; the illustration is named by `illustrationAriaLabel`, decorative when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `hero-title` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the pixel floor and the client strip stop under reduced motion in `texture-material` and `ticker`.
- Touch target ≥40×40 px — the large buttons meet it.

## Stories (Storybook)

- Default
- Types — composite story rendering every `kind` stacked.

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
