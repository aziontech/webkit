---
name: pricing-plans
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: a00ae78546849f329a8278c0ba3009de577aafab1d47e8bc9d6401490c07049a
---

# PricingPlans — Component Spec

## Purpose

The plan cards at the top of Pricing: a billing-period toggle over a framed row of pricing cards, each with its plan name, its price for the picked period, what it includes and one button. The recommended plan sits on a raised surface and carries a tag. It is a page section — the site places it from a `{ _id: 'pricing-plans', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `segmented-button`, `card-grid`, `card-pricing` and `button`; the picked period is local state.

## When to use

- At the top of Pricing, to lay the plans side by side with a price per billing period.

## When NOT to use

- To compare plans feature by feature → use `compare-plans`.

## Related

- `card-pricing` — the card each plan renders with.
- `compare-plans` — the matrix that sits under these cards.

## Best practices

- Give every plan one price per period, matched by `period`; a price without a `period` applies to every period.
- Highlight one plan; it is raised and is the only card that shows its tag.
- Keep `features` to five or so short labels led by an icon.

## Usage

```vue
<script setup>
import PricingPlans from '@aziontech/webkit/sections/pricing-plans'
</script>

<template>
  <PricingPlans
    anchor="plans"
    periods-aria-label="Billing period"
    :periods="[
      { label: 'Monthly', value: 'monthly' },
      { label: 'Annual', value: 'annual' }
    ]"
    :plans="[
      {
        name: 'Pro',
        highlighted: true,
        tagLabel: 'Popular',
        prices: [
          { period: 'monthly', value: '25', prefix: '$', suffix: '/mo', details: 'Billed monthly.' },
          { period: 'annual', value: '20', prefix: '$', suffix: '/mo', details: 'Billed annually.' }
        ],
        featuresTitle: 'All Hobby features, plus:',
        features: [{ icon: 'ai ai-workloads', label: 'Additional workloads' }],
        action: { label: 'Start with Pro', href: '/signup' }
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `periods` | `PricingPlansPeriod[]` | `[]` | false | The billing periods of the toggle, in order; each is `{ label, value }`. The toggle shows with two or more and opens on the first. |
| `periodsAriaLabel` | `string` | `''` | false | Accessible name of the billing-period toggle. |
| `plans` | `PricingPlansPlan[]` | `[]` | false | The plan cards, in order; each is `{ name, highlighted?, tagLabel?, prices, featuresTitle?, features?, action? }` where a price is `{ period?, value, prefix?, suffix?, details? }`, a feature is `{ icon, label }` and `action` is `{ label, href }`; a plan without a name is dropped, and an action without a label or href is dropped. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- The picked period selects each plan's price; a plan with no price for it falls back to its period-less price
- The highlighted plan sits on `var(--bg-surface)`, shows its tag and carries the secondary button; the others sit on `var(--bg-canvas)` with an outlined button
- Empty: when no plan has a name the band renders nothing but its root

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (features) | `.text-body-sm` |
| features title text | `var(--text-muted)` |
| feature text | `var(--text-default)` |
| feature glyph | `var(--primary)` |
| raised card fill | `var(--bg-surface)` |
| card fill | `var(--bg-canvas)` |
| toggle rule | `var(--border-default)` |
| rhythm | `var(--spacing-sm)` / `var(--spacing-md)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `segmented-button` and `button`.
- Keyboard map: `Tab` reaches the toggle and each card's button; the toggle's arrow-key map is `segmented-button`'s.
- ARIA: the toggle is named by `periodsAriaLabel`; each plan is a `card-pricing` article with its name as `h3`; the features are a list and their glyphs are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the toggle indicator belongs to `segmented-button`, which carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — the toggle and the buttons are `large`.

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
