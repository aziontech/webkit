---
name: client-quotes
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: cbf8b61a2bb7102cac0be6d0307652f57f4da353a5af3263e63f773c228dd1ba
---
# ClientQuotes — Component Spec

## Purpose

The client-stories band: a framed `quote-tabs` carousel of customer quotes, each signed by its author and marked by the client's logo, with one call to action under it. It is a page section — the site places it from a `{ _id: 'client-quotes', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `quote-tabs` and `button`.

## When to use

- To let several customers speak in turn, one at a time, near the end of a page's argument.

## When NOT to use

- For one quote beside a logo wall → use `logo-wall-quote`.
- For a scrolling strip of analyst recognitions → use `recognition-marquee`.

## Related

- `quote-tabs` — the tabbed quote carousel this band frames.

## Best practices

- Three to six items; the tabs need room for each client's mark.
- Give each item either a registry `mark` or a `logo` URL with `clientName`, not both.

## Usage

```vue
<script setup>
import ClientQuotes from '@aziontech/webkit/client-quotes'
</script>

<template>
  <ClientQuotes
    aria-label="Client stories"
    :items="[
      { mark: 'dafiti', clientName: 'Dafiti', text: 'One of the best CDN and WAF solutions I have ever used.', name: 'Julian H', jobTitle: 'IT OPS, SRE & SEC Manager at Dafiti Group' },
      { logo: '/logos/magalu.svg', clientName: 'Magalu', text: 'Azion shielded us from sophisticated cyberattacks.', name: 'Allan Monteiro', jobTitle: 'CISO at Magalu' }
    ]"
    :primary-action="{ label: 'See customer stories', href: '/success-cases', trailing: true }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `ariaLabel` | `string` | `''` | false | Accessible name of the quote carousel. |
| `items` | `ClientQuotesItem[]` | `[]` | false | The quotes, in order; each is `{ text, name?, jobTitle?, mark?, logo?, clientName?, photo? }` where `mark` is a registry mark name and `logo` a mark URL named by `clientName`. |
| `primaryAction` | `ClientQuotesAction` | `undefined` | false | Button under the quotes; `{ label, href, trailing? }`. Omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Empty: when `items` is empty the band renders nothing
- The active quote, its progress and the tab keyboard model belong to `quote-tabs`

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

- Visible focus: owned by the composed components.
- Keyboard map: `Tab` reaches each link or button; `Enter` follows it.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- Touch target ≥40×40 px — every affordance is a large `button` or spans its cell.
- ARIA: the band is a plain `div`; the carousel is `quote-tabs`' own labelled region (`ariaLabel`), so no second landmark is added.
- `motion-reduce:transition-none motion-reduce:transform-none` — the tab transition belongs to `quote-tabs`; this band adds no motion.

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
