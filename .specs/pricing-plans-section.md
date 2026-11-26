---
name: pricing-plans-section
category: section
structure: monolithic
template: 2
status: implemented
spec_version: 5
created: 2026-11-05
last_updated: 2026-11-16
checksum: 4f2ea207dbecb24fc1da21de9593e6e68a73811ecb745da011102de4c5fe8262
---

# PricingPlansSection — Component Spec

## Purpose

The plan cards at the top of Pricing: a billing-period toggle over a framed row of pricing cards, each with its plan name, its price for the picked period, what it includes and one button. The recommended plan sits on a raised surface and carries a tag. It is a page section — the site places it from a `{ _id: 'pricing-plans-section', props }` entry and binds `props` straight onto it — and it composes `registration-frame`, `toggle-group`, `card-grid`, `pricing-card` and `button`; the picked period is local state. The band runs full bleed (the page's inline inset only, closed by a bottom rule) and centres its frame at the site measure, with rules on its sides.

## When to use

- Use PricingPlansSection for price cards with a billing-period toggle on the public pricing page, the plans side by side at the top of Pricing.

## When NOT to use

- To compare plans or support tiers feature by feature → use `plan-comparison-section`.
- To compare Azion with one competitor → use `competitor-comparison-section`.

## Related

- `pricing-card` — the card each plan renders with.
- `plan-comparison-section` — the matrix that sits under these cards.

## Best practices

- Give every plan one price per period, matched by `period`; a price without a `period` applies to every period.
- Highlight one plan; it is raised and is the only card that shows its tag.
- Put terms that hold for every period in the plan's `description`; a price's own `details` replaces it for that period.
- Keep `features` to five or so short labels led by an icon.

## Usage

```vue
<script setup>
  import PricingPlansSection from '@aziontech/webkit/pricing-plans-section'
</script>

<template>
  <PricingPlansSection
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
          {
            period: 'monthly',
            value: '25',
            prefix: '$',
            suffix: '/mo',
            details: 'Billed monthly.'
          },
          { period: 'annual', value: '20', prefix: '$', suffix: '/mo', details: 'Billed annually.' }
        ],
        featuresTitle: 'All Hobby features, plus:',
        features: [{ icon: 'az az-workloads', label: 'Additional workloads' }],
        action: { label: 'Start with Pro', href: '/signup' }
      }
    ]"
  />
</template>
```

## Props

| Prop               | Type                          | Default | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------ | ----------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`           | `string`                      | `''`    | false    | In-page id set on the band so a hash link can target it.                                                                                                                                                                                                                                                                                                                                                        |
| `periods`          | `PricingPlansSectionPeriod[]` | `[]`    | false    | The billing periods of the toggle, in order; each is `{ label, value }`. The toggle shows with two or more and opens on the first.                                                                                                                                                                                                                                                                              |
| `periodsAriaLabel` | `string`                      | `''`    | false    | Accessible name of the billing-period toggle.                                                                                                                                                                                                                                                                                                                                                                   |
| `plans`            | `PricingPlansSectionPlan[]`   | `[]`    | false    | The plan cards, in order; each is `{ name, description?, highlighted?, tagLabel?, prices, featuresTitle?, features?, action? }` where a price is `{ period?, value, prefix?, suffix?, details? }`, a feature is `{ icon, label }` and `action` is `{ label, href }`; `description` stands in for a price without `details`, a plan without a name is dropped, and an action without a label or href is dropped. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- The picked period selects each plan's price; a plan with no price for it falls back to its period-less price
- Price change: every card is `animated`, so a period switch fades the old price out and the new one in (the card's reduced-motion fallback swaps it in place)
- Terms: the line under the price is the price's `details`, else the plan's `description`, else empty
- Layout: a full-width band (`__band`) on `var(--bg-canvas)` with the page's inline inset `var(--layout-boundary-inline)` and a bottom rule, and inside it a `registration-frame` with side rules and bottom marks capped at `var(--layout-measure-site)` and centred
- The highlighted plan sits on `var(--bg-surface)`, shows its tag and carries the secondary button; the others sit on `var(--bg-canvas)` with an outlined button
- Empty: when no plan has a name the band renders nothing but its root

## Motion & Animations

_none_

## Tokens

| Region                | Token (TOKENS.md)                         |
| --------------------- | ----------------------------------------- |
| typography (features) | `.text-body-sm`                           |
| features title text   | `var(--text-muted)`                       |
| feature text          | `var(--text-default)`                     |
| feature glyph         | `var(--primary)`                          |
| raised card fill      | `var(--bg-surface)`                       |
| card fill             | `var(--bg-canvas)`                        |
| toggle rule           | `var(--border-default)`                   |
| rhythm                | `var(--spacing-sm)` / `var(--spacing-md)` |
| frame measure         | `var(--layout-measure-site)`              |
| band inset            | `var(--layout-boundary-inline)`           |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `toggle-group` and `button`.
- Keyboard map: `Tab` reaches the toggle and each card's button; the toggle's arrow-key map is `toggle-group`'s.
- ARIA: the toggle is named by `periodsAriaLabel`; each plan is a `pricing-card` article with its name as `h3`; the features are a list and their glyphs are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the toggle indicator belongs to `toggle-group` and the price fade to `pricing-card`, each with its own reduced-motion fallback; this band adds no motion of its own.
- Touch target ≥40×40 px — the toggle and the buttons are `large`.

## Internationalization

- No built-in strings: every visible string arrives through props.

## Right-to-left

- Layout: logical utilities and the composed components' own mirroring, so the plan cards fill from the inline start.
- Icons: action chevrons mirror (owned by `button`).
- Keyboard: unchanged.

## Responsive

- The plan cards follow `card-grid`: stacked on phones, side by side as the grid widens; the billing `toggle-group` stays above them.
- No horizontal scroll at 320 px.

## Performance

- Bundle budget: 22.3 KB for `./pricing-plans-section` gzip in `.size-limit.json`.
- The billing switch is local state; no timers or observers.

## Examples

- Default

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
