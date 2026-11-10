---
name: recognition-marquee
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-04
last_updated: 2026-11-04
checksum: 90aa4fdcbada0263fa4ae09ada0844adf3127a15c70be7d44fe77757f054586a
---
# RecognitionMarquee — Component Spec

## Purpose

The analyst-recognition band: a section title over a framed strip of signed quotes — one per report, marked by the firm's logo — that scrolls continuously and pauses on hover or focus. It is a page section — the site places it from a `{ _id: 'recognition-marquee', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box` and `quote`.

## When to use

- To list analyst reports and awards on a page that needs third-party proof.

## When NOT to use

- For office photos → use `photo-marquee`.
- For customer quotes → use `client-quotes`.

## Related

- `quote` — the signed card each recognition renders with.
- `photo-marquee` — the sibling strip of pictures with the same loop.

## Best practices

- Five to eight items; the loop needs enough width to read as continuous.
- Leave `duration` at `0` to let the strip pace itself (twelve seconds per item).

## Usage

```vue
<script setup>
import RecognitionMarquee from '@aziontech/webkit/sections/recognition-marquee'
</script>

<template>
  <RecognitionMarquee
    eyebrow="Analysts"
    title="Recognized as a market leader"
    aria-label="Analyst recognitions"
    :items="[
      { text: 'Named a Leader and Fast Mover.', reportName: 'GigaOm Radar for Full-Stack Edge Deployments', date: 'May 2026', firmName: 'GigaOm', logo: '/logos/gigaom-reversed.svg', logoLight: '/logos/gigaom-color.svg' },
      { text: 'Recognized as a Leader in CDN.', reportName: 'G2 Reports', date: 'March 2026', firmName: 'G2', logo: '/logos/g2.svg' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the scrolling region. |
| `duration` | `number` | `0` | false | Seconds one loop of the strip takes; `0` paces it at twelve seconds per item. |
| `items` | `RecognitionMarqueeItem[]` | `[]` | false | The recognitions, in order; each is `{ text, reportName, date?, firmName, logo, logoLight? }` where `logo` is the firm's mark on the dark theme and `logoLight` the one on the light theme. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, paused while the strip is hovered or holds focus
- Empty: when `items` is empty the band renders nothing
- The list is rendered twice for a seamless loop; the duplicate is `aria-hidden` and hidden under reduced motion, where the region scrolls by hand instead

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| continuous scroll of the strip | `animate-brand-marquee` | semantic (brand-marquee) | `motion-reduce:animate-none` (the region becomes a horizontal scroller) |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| card fill | `var(--bg-surface)` |
| card inset | `var(--spacing-xl)` |
| card width | `var(--container-md)` |
| focus ring | `var(--ring-color)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the scrolling region is focusable and carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`.
- Keyboard map: `Tab` reaches the region, which pauses the loop; under reduced motion arrow keys scroll it.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the strip is a `region` named by `ariaLabel`; the second copy of the list is `aria-hidden`; each firm mark carries `firmName` as `alt`; each recognition is a `blockquote` signed by its report and date.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `quote` on `var(--bg-surface)`.
- `motion-reduce:animate-none` on the strip; the duplicate list is hidden so nothing moves and nothing repeats.
- Touch target ≥40×40 px — not applicable beyond the focusable region.

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
