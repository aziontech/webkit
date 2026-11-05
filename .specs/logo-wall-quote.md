---
name: logo-wall-quote
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: 8c379282536bd5cd939ab94d152cf8a4e862d3596288869bb76617a9f56e3b05
---
# LogoWallQuote — Component Spec

## Purpose

The customers band: a section title over a framed logo wall of linked client marks with one signed quote in its aside, closed by a call to action. It is a page section — the site places it from a `{ _id: 'logo-wall-quote', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `logo-wall`, `quote` and `button`.

## When to use

- To prove adoption with marks and let one customer speak, early on a home or solution page.

## When NOT to use

- For several quotes in turn → use `client-quotes`.
- For marks with photos and stories in a mosaic → use `client-mosaic`.

## Related

- `logo-wall` — the wall the marks are laid in, with the quote in its aside.

## Best practices

- Eight or nine logos fill the rectangle wall beside the aside.
- Set `logoTreatment` per mark: `monochrome` for a mark drawn in one ink that must follow the theme, `invert-light` for a reversed mark that must flip on the light theme, `as-is` for a colour mark; give a `logoLight` file instead when the light theme needs a different drawing.

## Usage

```vue
<script setup>
import LogoWallQuote from '@aziontech/webkit/sections/logo-wall-quote'
</script>

<template>
  <LogoWallQuote
    eyebrow="Customers"
    title="Trusted by the world's largest banks and e-commerce companies"
    aria-label="Banks and e-commerce companies running on Azion"
    :logos="[
      { name: 'Magalu', logo: '/logos/magalu.svg', href: '/success-case/magalu' },
      { name: 'Banco de la Nación', logo: '/logos/banco-de-la-nacion.svg', logoTreatment: 'monochrome', href: '/success-case/banco' }
    ]"
    :quote="{ text: 'Azion delivered the advanced protection and superior performance we needed.', name: 'Ismael Aguilar', jobTitle: 'Information Security Manager at Zoop', logo: '/logos/zoop.svg', logoAlt: 'Zoop' }"
    :primary-action="{ label: 'Read the case study', href: '/success-case/zoop', trailing: true, target: '_blank' }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the logo wall. |
| `logos` | `LogoWallQuoteLogo[]` | `[]` | false | The client marks, in order; each is `{ name, logo, logoLight?, logoTreatment?, href? }` where `logoTreatment` is `'as-is'`, `'monochrome'` or `'invert-light'`. |
| `quote` | `LogoWallQuoteQuote` | `undefined` | false | The signed quote in the wall's aside; `{ text, name, jobTitle, logo, logoAlt }`. Omitted when absent. |
| `primaryAction` | `LogoWallQuoteAction` | `undefined` | false | Button under the quote; `{ label, href, trailing?, target? }`. Omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Empty: when `logos` is empty the band renders nothing
- Each mark carries `data-treatment` so the theme-following inks are driven by data attributes

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `logo-wall` (each mark link) and `button`.
- Keyboard map: `Tab` moves between mark links and the action; `Enter` follows.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the wall is `logo-wall`'s own list named by `ariaLabel`; every mark image carries the client `name` as `alt`; the quote is a `blockquote` signed by its author.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components; marks follow the theme through their treatment.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion.
- Touch target ≥40×40 px — each mark link spans its wall cell.

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
