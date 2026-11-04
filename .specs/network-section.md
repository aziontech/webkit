---
name: network-section
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: 1f56e6afe7cf70255d77cd3aa6b06ace21bcbde3612bb0aaaa819647c4e6f108
---
# NetworkSection — Component Spec

## Purpose

The infrastructure band of a marketing page: a tall framed panel with the world network map drawn behind a small left-aligned title, a lead line and a row of claim chips, closed by a floor of either client outcomes (a quote with its highlights and the client's mark) or benefits (icon-led topics). It is a page section — the site places it from a `{ _id: 'network-section', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `network-map`, `section-title`, `card-grid`, `quote` and `topic`. `kind` picks the floor only: `outcomes` renders four quotes, `benefits` three topics; the band above is the same.

## When to use

- To state the network's reach with figures and back it with either client results or product benefits.

## When NOT to use

- For figures alone → use `stats-band`.
- For a logo wall with one quote → use `logo-wall-quote`.

## Related

- `network-map` — the animated map behind the copy.
- `quote` / `topic` — the two cell types the floor renders.
- `sections` — the registry compound that renders this block from a page's `sections[]` JSON.

## Best practices

- Four short `claims`; they are chips, not sentences.
- Four `outcomes` or three `benefits`, so the floor closes the grid.
- Use `logoTreatment: 'monochrome'` for a dark mark that must invert in the dark theme; leave `as-is` for a colour mark.

## Usage

```vue
<script setup>
import NetworkSection from '@aziontech/webkit/sections/network-section'
</script>

<template>
  <NetworkSection
    eyebrow="Region: Earth."
    title="One distributed infrastructure without the complexity of managing, securing and scaling it"
    lead="Built around your users. Distributed around your data."
    :claims="['100+ data centers', '100+ Tbps network capacity', '30 ms median latency', '100% availability']"
    :outcomes="[
      { logo: '/logos/dafiti.svg', logoAlt: 'Dafiti', logoTreatment: 'monochrome', text: '86% faster load times, with a 45% cost reduction in data transfer.', highlights: ['86% faster load times', '45% cost reduction'] },
      { logo: '/logos/renner.svg', logoAlt: 'Renner', logoTreatment: 'as-is', text: '67% saved on data transfer, even during massive traffic spikes.', highlights: ['67% saved'] }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `NetworkSectionKind` | `'outcomes'` | false | Which floor closes the band: `outcomes` renders the client quotes, `benefits` the icon-led topics. |
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the small section title as its `h2`; the band renders nothing when empty. |
| `lead` | `string` | `''` | false | Overline-set line above the claims. |
| `claims` | `string[]` | `[]` | false | Short figures rendered as chips under the lead, in order. |
| `outcomes` | `NetworkSectionOutcome[]` | `[]` | false | Client results for the `outcomes` floor, in order; each is `{ logo, logoAlt, logoTreatment?, text, highlights? }` where `logo` is the mark URL, `logoTreatment` is `'monochrome'` or `'as-is'`, and `highlights` are the phrases of `text` set in the accent. |
| `benefits` | `NetworkSectionBenefit[]` | `[]` | false | Topics for the `benefits` floor, in order; each is `{ icon, title, description }`. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and selects the floor
- Empty: when `title` is empty the band renders nothing; when the selected floor's array is empty the band renders without a floor
- The map renders twice: a faded top-right world from the medium breakpoint up, a centered masked world below it; both are `network-map`'s own animation

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (lead) | `.text-overline-md` |
| typography (claim chip) | `.text-label-sm` |
| lead text | `var(--text-muted)` |
| claim text | `var(--text-default)` |
| claim chip border | `var(--primary)` |
| band and cell fill | `var(--bg-canvas)` |
| claim chip shape | `var(--shape-elements)` |
| claim chip inset and gap | `var(--spacing-xs)` |
| copy rhythm | `var(--spacing-md)` |
| band rhythm | `var(--spacing-xl)` |
| band inset | `var(--spacing-xxl)` |
| claims width | `var(--container-sm)` |
| headline width | `var(--container-lg)` |
| frame rules, marks and floor rule | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: nothing in the band is interactive.
- Keyboard map: none.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the headline is the section title's `h2`; the claims are a real list; the maps are decorative and hidden from assistive technology by `network-map`; each outcome's mark carries the client name as `alt`; benefit topics are `h3`s.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): lead `var(--text-muted)`, claims `var(--text-default)` on a tinted canvas; the map sits at low opacity behind the copy and never under the text column on large screens.
- `motion-reduce:transition-none motion-reduce:transform-none` — the map animation belongs to `network-map`, which carries its own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — not applicable, nothing is interactive.

## Stories (Storybook)

- Default
- Types — composite story rendering both `kind` values stacked.

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
