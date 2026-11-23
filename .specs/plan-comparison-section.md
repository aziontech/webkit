---
name: plan-comparison-section
category: section
structure: monolithic
status: implemented
spec_version: 11
created: 2026-11-05
last_updated: 2026-11-18
checksum: c6e734ed939a68c435f6fb233967aefd8a24b8223e16e420e92d664aa45ed64b
---

# PlanComparisonSection — Component Spec

## Purpose

The feature-by-feature matrix under the plan cards on Pricing: one column per plan with its name and action button pinned in the header while the page scrolls, one band per product with an overline, a title and a lead, and one row per feature saying what each plan includes — an included mark, a not-included mark, or the allowance as text. The recommended plan carries an accent bar, and below the large breakpoint the table folds to one plan picked from a searchable select. It is a page section — the site places it from a `{ _id: 'plan-comparison-section', props }` entry and binds `props` straight onto it — and it composes `module`, `select`, `input`, `button`, `icon-button`, `popover`, `tooltip`, `eyebrow`, `tag` and `link`.

## When to use

- Use PlanComparisonSection for a feature matrix across plans or support tiers: on Pricing under the plan cards, product by product, and on Support with one column per support tier.

## When NOT to use

- To compare Azion with one competitor → use `competitor-comparison-section`.
- For price cards with a billing-period toggle → use `pricing-plans-section`.

## Related

- `pricing-plans-section` — the plan cards this matrix sits under.
- `competitor-comparison-section` — Azion against one competitor.

## Best practices

- Give every plan a stable `id`; the narrow-screen picker selects by it.
- Mark one plan `highlighted`; it gets the accent bar, the secondary button and opens the picker.
- Give every row's `values` one entry per plan, in plan order.
- Use a row's `hint` to define the term its label names; it opens in a popover titled with the label, so it can run to a sentence or two.
- Set `includedLabel` and `excludedLabel` to the page's words; left empty, the marks read the locale's Included and Not included.

## Usage

```vue
<script setup>
  import PlanComparisonSection from '@aziontech/webkit/plan-comparison-section'
</script>

<template>
  <PlanComparisonSection
    anchor="comparison"
    caption="Feature comparison across the plans."
    column-label="Features"
    picker-aria-label="Plan being compared"
    included-label="Included"
    excluded-label="Not included"
    :plans="[
      { id: 'hobby', name: 'Hobby', action: { label: 'Start for free', href: '/signup' } },
      {
        id: 'pro',
        name: 'Pro',
        highlighted: true,
        action: { label: 'Start with Pro', href: '/signup' }
      }
    ]"
    :sections="[
      {
        eyebrow: 'Build',
        title: 'Applications',
        description: 'Build, run and scale applications globally.',
        rows: [
          {
            label: 'Rules Engine',
            hint: 'Conditional rules evaluated per request.',
            values: ['✓', '✓']
          },
          { label: 'Rules per application', values: ['10 included', '20 included'] }
        ]
      }
    ]"
    :primary-action="{ label: 'See on-demand pricing', href: '/docs/pricing' }"
  />
</template>
```

## Props

| Prop              | Type                             | Default     | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | -------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `anchor`          | `string`                         | `''`        | false    | In-page id set on the band so a hash link can target it.                                                                                                                                                                                                                                                                                               |
| `caption`         | `string`                         | `''`        | false    | Screen-reader caption naming the table.                                                                                                                                                                                                                                                                                                                |
| `columnLabel`     | `string`                         | `''`        | false    | Heading of the feature column, shown from the large breakpoint up.                                                                                                                                                                                                                                                                                     |
| `pickerAriaLabel` | `string`                         | `''`        | false    | Accessible name of the plan picker shown below the large breakpoint.                                                                                                                                                                                                                                                                                   |
| `includedLabel`   | `string`                         | `''`        | false    | Tooltip and screen-reader text of an included cell; empty uses the locale catalog (`Included`).                                                                                                                                                                                                                                                        |
| `excludedLabel`   | `string`                         | `''`        | false    | Tooltip and screen-reader text of a not-included cell; empty uses the locale catalog (`Not included`).                                                                                                                                                                                                                                                 |
| `plans`           | `PlanComparisonSectionPlan[]`    | `[]`        | false    | The plan columns, in order; each is `{ id, name, description?, highlighted?, action }` with `action` as `{ label, href }`; a plan without a name is dropped.                                                                                                                                                                                           |
| `sections`        | `PlanComparisonSectionSection[]` | `[]`        | false    | The product bands, in order; each is `{ eyebrow, title, description, rows, action? }` (`action` closes the band, `{ label, href }`) and a row is `{ label, values, group?, hint?, tag? }` with one value per plan: `true` or `✓` is included, `—` is not included, other text shows as written, empty is blank; `hint` defines the label in a popover. |
| `primaryAction`   | `ModuleHeaderAction`             | `undefined` | false    | Closing link under the table, opened in a new tab; `{ label, href }`. Omitted when absent.                                                                                                                                                                                                                                                             |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- The highlighted plan carries the accent bar and the secondary button; the others carry an outlined button
- Below the large breakpoint only the picked plan's column shows (`data-folded` on the others); the picker opens on the highlighted plan, or the first
- Picker search: the picker's list carries a search field that narrows the plans by name; with no match it shows a `role="status"` line from the locale catalog (`No results found.`); the query clears each time the list opens or closes
- Cells: an included cell is a `az az-circle-check` mark and a not-included cell an `az az-circle-minus` mark, each with a tooltip of its label on hover and the same label as `sr-only` text
- Hint: a row with `hint` ends its label with an info icon button that opens a popover titled with the label and described by the hint
- Closing rule: when neither the last band nor the table carries a closing link, the last row draws a bottom rule (`data-closing`) so the table never ends open
- Below the large breakpoint the plan button's label wraps (auto height, at least 40 px) instead of widening the table, so the folded matrix fits a 320 px screen whatever the font metrics.
- A group row (`group: true`) reads in the default text colour and draws a top rule unless it opens its band
- Category row: a group row whose values are all empty is a category heading. It opens its own `tbody` with one `th scope="rowgroup"` spanning every column (label, hint and tag included) and renders no value cells; the rows after it belong to that `tbody` until the next category. A group row that carries values stays a feature row.
- The feature column head (`columnLabel`) is start-aligned, like the row labels under it.
- Sticky header: the plan row (`thead` cells, `z-20`) sticks at `top: var(--layout-sticky-top)`, which defaults to `--layout-header-height`, so on the site it stops right under the sticky `site-header-section` and the bands scroll beneath it. Inside a scroller with no header above it (a docs example card, an example frame) set `--layout-sticky-top: 0` on that scroller: a sticky cell is pushed down to its offset even at rest, so an offset that reserves room for an absent header lays the plan row over the first band's eyebrow and title.
- Empty: when no plan has a name the band renders nothing but its root

## Motion & Animations

_none_

## Tokens

| Region                      | Token (DESIGN.md)                                                                     |
| --------------------------- | ------------------------------------------------------------------------------------- |
| typography (band title)     | `.text-heading-lg`                                                                    |
| typography (plan name)      | `.text-heading-md`                                                                    |
| typography (band lead)      | `.text-body-sm` / `.text-body-md`                                                     |
| typography (rows and cells) | `.text-label-md`                                                                      |
| typography (column head)    | `.text-overline-md`                                                                   |
| header fill                 | `var(--bg-canvas)`                                                                    |
| header stick offset         | `var(--layout-sticky-top)`                                                            |
| accent bar                  | `var(--border-selected)`                                                              |
| included mark               | `var(--success-mark)`, `.text-body-md`                                                |
| not-included mark           | `var(--text-muted)`, `.text-body-md`                                                  |
| picker empty status         | `.text-label-sm`, `var(--text-muted)`                                                 |
| muted text                  | `var(--text-muted)`                                                                   |
| default text                | `var(--text-default)`                                                                 |
| rules                       | `var(--border-default)`                                                               |
| cell padding                | `var(--spacing-sm)` / `var(--spacing-md)` / `var(--spacing-lg)` / `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `select`, `input`, `button`, `icon-button` and `link`.
- Keyboard map: `Tab` reaches the picker (below `lg`), each plan button, each hint button and the closing link; the picker's keyboard map is `select`'s and its search field takes typing while the list is open; `Enter` or `Space` on a hint button opens its popover and `Escape` closes it, returning focus to the button (`popover`'s map).
- ARIA: the table carries a `caption`, `scope="col"` plan heads, a `scope="rowgroup"` head opening each band `tbody` and each category `tbody`, and a `scope="row"` head per feature, so each value is announced with its row and plan. The included and not-included marks are `aria-hidden` and carry their label as `sr-only` text (the tooltip repeats it for pointer users); each hint button is named `About <label>` from the locale catalog and its popover is titled by the label; the picker's search field is named `Search <picker name>` and its no-match line is a `status`; the accent bar is decorative; the plan names stay readable to screen readers below `lg`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the composed controls carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the plan buttons and the picker are `large`.
- Reflow: below `lg` (one plan column beside the row labels) the header cells, the section headings and the row labels use `var(--spacing-sm)` side padding instead of `var(--spacing-lg)`, so the two columns fit a 640px box at 200% zoom; from `lg` the padding is unchanged.

## Examples

- Default
- Hints and marks — rows with a `hint` popover, included and not-included marks with their tooltips, and a table that ends without a closing link, so the last row draws the closing rule.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
