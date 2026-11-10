---
name: feature-tabs
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 479f5cbab356ced37757c21ee48943e69dc60452a79ea813313abef49bbb0166
---
# FeatureTabs — Component Spec

## Purpose

The feature walkthrough band of a product page: a left-aligned section title over up to three tabs on one side and the active tab's illustration on the other, closed by a small link under the frame. It is a page section — the site places it from a `{ _id: 'feature-tabs', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `media-tabs`, `illustration` and `mini-button`. The tabs advance on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion; that state is owned by `media-tabs`.

## When to use

- To walk through the two or three features behind one claim, one picture at a time, like Functions' Observability.

## When NOT to use

- For architectures drawn as diagrams across the full width → use `architecture-tabs`.
- For a scroll-driven walkthrough of more features → use `feature-scroll`.

## Related

- `media-tabs` — the timed tabs this section renders through.
- `illustration` — the scene each tab shows.

## Best practices

- Keep to three tabs; tabs past the limit are not rendered.
- Give every tab an `illustrationLabel` saying what its picture shows.

## Usage

```vue
<script setup>
import FeatureTabs from '@aziontech/webkit/sections/feature-tabs'
</script>

<template>
  <FeatureTabs
    eyebrow="Observability"
    title="Inspect every run end-to-end"
    :tabs="[
      { title: 'Trace', description: 'The run as a waterfall.', illustration: 'live-debugging', illustrationLabel: 'A trace waterfall' },
      { title: 'Logs', description: 'Structured output on the same clock.', illustration: 'stay-in-control', illustrationLabel: 'Structured logs' }
    ]"
    :primary-action="{ label: 'Open an invocation', href: '/docs', trailing: true }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the left section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `tabs` | `FeatureTabsTab[]` | `[]` | false | The features, in order, at most three; each is `{ title, description, illustration, illustrationLabel? }` where `illustration` is a registry name and `illustrationLabel` its accessible name. |
| `primaryAction` | `FeatureTabsAction` | `undefined` | false | Small link under the frame; `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the active tab, its progress and the timer are owned by `media-tabs`
- Empty: when `tabs` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the link renders only when `primaryAction` is set

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| link inset | `var(--spacing-xl)` |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `media-tabs` (the tabs) and `mini-button`.
- Keyboard map: `Tab` reaches the tabs and the link; the tabs' keys are owned by `media-tabs`.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; each illustration is named by its tab's `illustrationLabel`, or decorative when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-tabs` and `mini-button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the timer never runs under reduced motion (owned by `media-tabs`).
- Touch target ≥40×40 px: the tab rows; the link is supplementary to them.

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
