---
name: compare-support-tiers
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 4f5354c9f34ed8cd08d7d3aa8e1349a9b86b5f403976154c5ec8b754ffd3b8f4
---

# CompareSupportTiers — Component Spec

## Purpose

The tier-by-tier comparison on the Support page: one column per support tier with its name, who it is for and its action button pinned in the header while the page scrolls, one band per service family with an overline and a title, and one row per service saying what each tier includes — a tick, a dash, or the allowance as text. Each band closes on its own link to the matching pricing documentation, the recommended tier carries an accent bar, and below the large breakpoint the table folds to one tier picked from a select. It is a page section — the site places it from a `{ _id: 'compare-support-tiers', props }` entry and binds `props` straight onto it — and it composes `section-module`, `select`, `button`, `overline` and `link`.

## When to use

- On the Support page, to show what each support tier includes service by service.

## When NOT to use

- To compare platform plans → use `compare-plans`.
- To compare Azion with a competitor → use `comparison-table`.

## Related

- `compare-plans` — the same matrix for platform plans, with hints and tags on rows and one closing link.

## Best practices

- Give every tier a stable `id`; the narrow-screen picker selects by it.
- Mark one tier `highlighted`; it gets the accent bar, the secondary button and opens the picker.
- Give every row's `values` one entry per tier, in tier order.

## Usage

```vue
<script setup>
import CompareSupportTiers from '@aziontech/webkit/compare-support-tiers'
</script>

<template>
  <CompareSupportTiers
    anchor="tiers"
    caption="Support comparison across the tiers."
    column-label="Support"
    picker-aria-label="Tier being compared"
    included-label="Included"
    excluded-label="Not included"
    :tiers="[
      { id: 'developer', name: 'Developer', description: 'Ideal for exploring the platform.', action: { label: 'Start for free', href: '/signup' } },
      { id: 'enterprise', name: 'Enterprise', description: 'Ideal for advanced support.', highlighted: true, action: { label: 'Talk to a specialist', href: '/contact' } }
    ]"
    :sections="[
      {
        eyebrow: 'Support',
        title: 'Get help when it matters most',
        action: { label: 'See pricing', href: '/docs/pricing#support' },
        rows: [
          { label: 'Phone and video support', values: ['—', true] }
        ]
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a hash link can target it. |
| `caption` | `string` | `''` | false | Screen-reader caption naming the table. |
| `columnLabel` | `string` | `''` | false | Heading of the service column, shown from the large breakpoint up. |
| `pickerAriaLabel` | `string` | `''` | false | Accessible name of the tier picker shown below the large breakpoint. |
| `includedLabel` | `string` | `''` | false | Screen-reader text of a ticked cell. |
| `excludedLabel` | `string` | `''` | false | Screen-reader text of a dashed cell. |
| `tiers` | `CompareSupportTiersTier[]` | `[]` | false | The tier columns, in order; each is `{ id, name, description, highlighted?, action }` with `action` as `{ label, href }`; a tier without a name is dropped. |
| `sections` | `CompareSupportTiersSection[]` | `[]` | false | The service bands, in order; each is `{ eyebrow, title, action?, rows }` where `action` is the closing `{ label, href }` link, and a row is `{ label, values, group? }` with one value per tier: `true` or `✓` ticks, `—` dashes, other text shows as written, empty is blank. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- The highlighted tier carries the accent bar and the secondary button; the others carry an outlined button
- Below the large breakpoint only the picked tier's column shows (`data-folded` on the others); the picker opens on the highlighted tier, or the first
- A group row (`group: true`) reads in the default text colour and draws a top rule unless it opens its band
- Empty: when no tier has a name the band renders nothing but its root

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (band title) | `.text-heading-lg` |
| typography (tier name) | `.text-heading-md` |
| typography (tier description) | `.text-body-sm` |
| typography (rows and cells) | `.text-label-md` |
| typography (column head) | `.text-overline-md` |
| header fill | `var(--bg-canvas)` |
| accent bar | `var(--border-selected)` |
| tick | `var(--success-contrast)` |
| muted text | `var(--text-muted)` |
| default text | `var(--text-default)` |
| rules | `var(--border-default)` |
| cell padding | `var(--spacing-sm)` / `var(--spacing-md)` / `var(--spacing-lg)` / `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `select`, `button` and `link`.
- Keyboard map: `Tab` reaches the picker (below `lg`), each tier button and each band's closing link; the picker's keyboard map is `select`'s.
- ARIA: the table carries a `caption`, `scope="col"` tier heads, a `scope="colgroup"` head per band and a `scope="row"` head per service, so each value is announced with its row and tier. The tick and dash glyphs are `aria-hidden` and carry `includedLabel` / `excludedLabel` as `sr-only` text; the accent bar is decorative; the tier names stay readable to screen readers below `lg`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the composed controls carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the tier buttons and the picker are `large`.

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
