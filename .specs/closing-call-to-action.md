---
name: closing-call-to-action
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 0789d68301a55f5b1604c6cd949e284392242cc9714949bb1b57c33d620f752f
---
# ClosingCallToAction — Component Spec

## Purpose

The last ask at the end of a landing page, followed by a hatched closing frame with no rules of its own, because the site footer under it opens with one. It is a page section — the site places it from a `{ _id: 'closing-call-to-action', props }` entry and binds `props` straight onto it — and it composes `section-module`, `call-to-action`, `button`, `frame-box` and `texture-material`. `kind` picks the layout only: `split` sets the headline and the primary action in a raised lead cell beside an aside cell carrying the description and the secondary action, over a tall closing frame; `panel` sets the copy and its actions on one surface, over a short closing frame; `primary` is the loud close, one centred ask on the canvas under a pixelated texture whose waves keep travelling, over a tall closing frame. All three take the same copy and the same two actions.

## When to use

- To close a solution or product page on its one or two asks (`split`), or a page such as Careers on one action (`panel`), or a page that ends on its one loud ask (`primary`).

## When NOT to use

- For a newsletter sign-up close → use `closing-call-to-action-newsletter`.
- For an ask in the middle of a page → compose `call-to-action` directly.

## Related

- `call-to-action` — the framed band this section renders.
- `closing-call-to-action-newsletter` — the closing band whose ask is a subscribe form.

## Best practices

- Place it last on the page, right above `site-footer`, after a hatched `section-gap`.
- Set `anchor: 'contact'` so the page's contact links scroll to the close.
- In `split`, keep `title` and `titleMuted` to one short line each; `panel` and `primary` do not draw `titleMuted`, and `primary` does not draw `eyebrow`.

## Usage

```vue
<script setup>
import ClosingCallToAction from '@aziontech/webkit/sections/closing-call-to-action'
</script>

<template>
  <ClosingCallToAction
    kind="split"
    anchor="contact"
    eyebrow="Build"
    title="Build once."
    title-muted="Run everywhere."
    description="Get a faster path to launch, lower latency, and less infrastructure overhead."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `ClosingCallToActionKind` | `'split'` | false | Layout of the band: `split` is a raised lead cell beside an aside cell over a tall closing frame, `panel` one surface over a short closing frame, `primary` a centred ask under a pixelated texture over a tall closing frame. |
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Short overline above the headline; not drawn in `primary`. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the call to action as its `h2`; the band renders nothing when empty. |
| `titleMuted` | `string` | `''` | false | Second line of the headline in muted ink; drawn in `split` only. |
| `description` | `string` | `''` | false | Supporting sentence: in the aside cell in `split`, under the headline in `panel`. |
| `primaryAction` | `ClosingCallToActionAction` | `undefined` | false | The white button of the band, under the headline in `split`; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent. |
| `secondaryAction` | `ClosingCallToActionAction` | `undefined` | false | The outlined button of the band, in the aside cell in `split` and beside the primary one in `panel` and `primary`; `{ label, href, trailing? }`. Omitted when absent. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop and drives the call-to-action layout and the closing frame height
- `primary`: the call to action takes its `primary` register with a pixelated `texture-material` in its `background` slot; its waves stop under reduced motion (owned by `texture-material`)
- Empty: when `title` is empty the band renders nothing but its root
- Each action renders only when given

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| closing frame height | `var(--spacing-xxl)` |
| anchor scroll offset | `var(--spacing-xxl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed buttons.
- Keyboard map: `Tab` reaches the primary then the secondary action; `Enter` follows it.
- ARIA: the `call-to-action` renders the band's `<section>` named by its title; the root is a plain `div` so the band has one landmark. The closing frame is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `call-to-action` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the texture and the buttons carry their own fallback.
- Touch target ≥40×40 px — the actions are large buttons.

## Stories (Storybook)

- Default
- Types — composite story rendering the three `kind` values stacked.

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
