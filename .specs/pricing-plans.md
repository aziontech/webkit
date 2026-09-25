---
name: pricing-plans
category: marketing
structure: monolithic
status: approved
spec_version: 1
checksum: 409b64872aa492e30e6d153575f2bc9088fd2dd420a663bd7bcb7c83f5a2d45d
created: 2026-09-22
last_updated: 2026-09-24
---

# Pricing Plans — Component Spec

## Purpose

The pricing band: an optional billing-period switch above a row of plan cards that share one height and one rhythm. It owns the switch and the row; the cards are `card-pricing`, composed by the page, and the selected period is a two-way value the page reads to decide what each card shows.

## When to use

- As the pricing section of a marketing or plans page, holding two to four plans.
- Whenever the page offers more than one billing period and the cards must react together.
- When the plan cards should share a row and a height rather than stack at every width.

## When NOT to use

- For one plan with no alternatives → render a `card-pricing` directly; a switch over one option is furniture.
- For a feature comparison matrix → use `table`, which is built to be scanned row by row.
- For a general grid of tiles → use `feature-card`, or `bento-grid` when the cells are unequal.

## Related

- `card-pricing` — the plan card this band lays out; the band composes it and never restyles it.
- `segmented-button` — the billing-period switch, configured rather than reimplemented.
- `currency` — the amount inside a plan card.
- `carousel` — wrap the band's cards when a page has more plans than fit a row.

## Best practices

- Give every card in the row `aligned` so their caveat bands line up; one unaligned card drags the whole row out of rhythm.
- Keep `periods` to two. A switch with four billing options is a filter, and belongs in the cards.
- Read the two-way period value and change what the cards show — the band switches the control, not the prices; only the page knows what an annual plan costs.
- Leave `periods` empty when there is one billing model. The band then renders the row alone, with no dead control above it.
- Match the register to the card: `gap` with `card-pricing kind="contained"`, `divider` with `kind="transparent"`. A contained card in the `divider` register draws a border a pixel from the seam that already separates it.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import PricingPlans from '@aziontech/webkit/pricing-plans'
  import CardPricing from '@aziontech/webkit/card-pricing'

  const period = ref('monthly')
  const periods = [
    { label: 'Monthly', value: 'monthly' },
    { label: 'Annual', value: 'annual' }
  ]
</script>

<template>
  <PricingPlans
    v-model="period"
    :periods="periods"
    aria-label="Billing period"
  >
    <CardPricing
      plan-title="Developer"
      :value="period === 'annual' ? '180' : '20'"
      aligned
    />
    <CardPricing
      plan-title="Business"
      :value="period === 'annual' ? '900' : '100'"
      aligned
      show-tag
    />
  </PricingPlans>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `'gap' \| 'divider'` | `'gap'` | false | Register of the band: gutters between self-contained cards, or hairline rules drawn by the gaps. In `divider` each card fills its own background. |
| `periods` | `PricingPeriod[]` | `[]` | false | Billing periods offered above the row; each item is `{ label, value }`. The switch is omitted when fewer than two are given. |
| `ariaLabel` | `string` | `'Billing period'` | false | Accessible name for the billing-period switch. |

## v-model

| Model | Type | Default | Notes |
|---|---|---|---|
| default | `string` | `undefined` | The selected billing period's `value`. The page reads it to decide what each composed card shows. |

## Events

_No plain events — the selected period flows through `v-model`._

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The plan cards, composed as `card-pricing` elements in reading order. |

## States

- Visual states: `default`
- `data-kind` carries the register: `gap` spaces the row with a gutter and centres the switch above it; `divider` closes the gutter to a hairline and turns the switch into a strip that draws its own `border-b`
- `data-switchable` is present when two or more `periods` are given, which is when the switch renders
- Below `md` the cards stack in one column in DOM order; from `md` up they share one row as equal columns, whatever their number
- Empty: a band with no cards renders the switch alone if periods were given, and nothing otherwise

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| spacing (switch to row, `gap`) | `var(--spacing-xl)` |
| spacing (cards gap, `gap`) | `var(--spacing-md)` |
| spacing (switch strip, `divider`) | `var(--spacing-md)` |
| rules (`divider` seams and strip floor) | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `segmented-button`, whose options carry the `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` ring.
- Keyboard map: delegated to `segmented-button` — `Tab` reaches the switch and its own key model moves between options. The band adds no key handler.
- ARIA: the switch is named by `ariaLabel`, since the band renders no visible label for it; the band itself is a plain container and adds no role, so the composed cards keep their own headings and the document outline stays honest.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the band contributes no text of its own; the switch and the cards carry their own colours.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the band is static.
- Touch target ≥40×40 px — the switch keeps `segmented-button`'s own option height.

## Stories (Storybook)

- Default
- Types — the two registers side by side (`gap` and `divider`)
- WithoutPeriods — the row alone, with no switch above it (mutually-exclusive rendered state of an empty `periods`)

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
