---
name: client-mosaic-columns
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: 9c646c42e9ef69debd36f04dc92e7e25d2300770c092aacf5649e4a3d2168e17
---
# ClientMosaicColumns — Component Spec

## Purpose

Three featured success stories side by side: each column is a client's mark on a face painted in the client's own brand colour, over a one-line story that links to the case. It is a page section — the site places it from a `{ _id: 'client-mosaic-columns', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box` and `logo-wall`.

## When to use

- When three stories deserve equal weight and their brands should colour the band.

## When NOT to use

- For a mixed mosaic of stories and marks → use `client-mosaic`.

## Related

- `client-mosaic` — the bento sibling.
- `logo-wall` — the single-mark wall each column's face is rendered with.
- `sections` — the registry compound that renders this block from a page's `sections[]` JSON.

## Best practices

- Exactly three cells; the grid is three columns from the large breakpoint.
- `brand.base` and `brand.glow` are the client's colours and may be any CSS colour; set `brand.ink` to `'dark'` when the face is light enough that the link text must be dark.

## Usage

```vue
<script setup>
import ClientMosaicColumns from '@aziontech/webkit/sections/client-mosaic-columns'
</script>

<template>
  <ClientMosaicColumns
    aria-label="Featured success stories"
    link-label="Read story"
    :cells="[
      { name: 'Magalu', logo: '/logos/magalu.svg', href: '/success-case/magalu', story: 'How Magalu enhances cybersecurity with Azion.', brand: { base: '#0e89ff', glow: '#0e89ff' } },
      { name: 'Dafiti', logo: '/logos/dafiti.svg', href: '/success-case/dafiti', story: 'Dafiti modernized its digital architecture.', brand: { base: '#ffffff', glow: '#ffffff', ink: 'dark' }, logoTreatment: 'knockout' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of stories. |
| `linkLabel` | `string` | `''` | false | Label the mark face reveals on hover and the link's accessible name. |
| `cells` | `ClientMosaicColumnsCell[]` | `[]` | false | The stories, in order; each is `{ name, logo, href, story, brand, logoTreatment? }` where `brand` is `{ base, glow, ink? }` (CSS colours painting the face, `ink` `'dark'` or `'light'`) and `logoTreatment` is `'monochrome'`, `'knockout'` or `'as-is'`. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` on each column (the face reveals the link line, the story fill rises)
- The face colours are bound as the `--wall-face` and `--wall-ink` custom properties from `brand`; `data-treatment` on every mark drives its ink
- Empty: when `cells` is empty the band renders nothing

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover fill on the story | `before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance` | inline (matches catalog) | `motion-reduce:before:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (story) | `.text-heading-sm` |
| story text | `var(--text-default)` |
| story fill | `var(--bg-canvas)` |
| story hover fill | `var(--bg-hover)` |
| story inset | `var(--spacing-lg)` |
| mark lift | `var(--spacing-sm)` |
| grid gaps and frame marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| link ink on a brand face | `var(--color-base-white)` / `var(--color-base-black)` | `TODO: tokenizar` semantic on-brand ink tokens |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the mark link is `logo-wall`'s, with its ring; the story panel is a duplicate link hidden from the tab order and from assistive technology.
- Keyboard map: `Tab` moves between the three mark links; `Enter` follows.
- ARIA: the band is a `<section>`; the grid is a list named by `ariaLabel` whose items are the columns; each mark carries the client `name` as `alt`; the story panel is `aria-hidden` with `tabindex="-1"` so the case is reachable once.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the link line ink follows `brand.ink`; the story text is `var(--text-default)` on `var(--bg-canvas)`.
- `motion-reduce:before:transition-none` on the hover fill.
- Touch target ≥40×40 px — each mark face spans its column.

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
