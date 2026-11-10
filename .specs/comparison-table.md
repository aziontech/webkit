---
name: comparison-table
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 9bc97f3f15893cf535aad5f44c996a20d413bd910c5211bc9ce54c30df948881
---

# ComparisonTable — Component Spec

## Purpose

The capability-by-capability comparison of Azion with one competitor on a migration landing page: a left section title over a framed table whose header row (the capability column, the Azion brand and the competitor logo) stays pinned while the page scrolls. Each category opens with a heading row; each cell is a support glyph — full, partial or none — named by a tooltip and by screen-reader text, and a capability with a definition carries an info button that opens it in a popover. It is a page section — the site places it from a `{ _id: 'comparison-table', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `brand`, `popover`, `icon-button` and `tooltip`.

## When to use

- On a "Azion vs X" page, to lay one competitor against Azion across a few categories of capabilities.

## When NOT to use

- To compare Azion's own plans → use `compare-plans`.
- To compare support tiers → use `compare-support-tiers`.

## Related

- `compare-plans` — the plan-by-plan matrix of Pricing.
- `tooltip` — names each support glyph on hover and focus.

## Best practices

- Give every row a `definition`; the info popover is where a reader learns what the capability means.
- Ship both `competitor.logo` (dark theme) and `competitor.logoLight` (light theme); with one file it shows in both, with none the name shows as text.
- Keep `caption` equal to the title; it is the table's accessible name.

## Usage

```vue
<script setup>
import ComparisonTable from '@aziontech/webkit/comparison-table'
</script>

<template>
  <ComparisonTable
    eyebrow="Comparison"
    title="How Azion compares with Cloudflare"
    caption="How Azion compares with Cloudflare"
    column-label="Capability"
    full-label="Full support"
    partial-label="Partial support"
    none-label="Not available"
    :competitor="{ name: 'Cloudflare' }"
    :groups="[
      {
        title: 'Security',
        rows: [
          { capability: 'Bot management', definition: 'Detecting and blocking automated traffic.', azion: 'full', competitor: 'partial' }
        ]
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the section title as its `h2` and naming the band; no header renders when empty. |
| `caption` | `string` | `''` | false | Screen-reader caption naming the table. |
| `columnLabel` | `string` | `''` | false | Heading of the capability column. |
| `fullLabel` | `string` | `''` | false | Tooltip and screen-reader text of a full-support cell. |
| `partialLabel` | `string` | `''` | false | Tooltip and screen-reader text of a partial-support cell. |
| `noneLabel` | `string` | `''` | false | Tooltip and screen-reader text of an unsupported cell. |
| `competitor` | `ComparisonTableCompetitor` | `—` | true | The platform compared with Azion; `{ name, logo?, logoLight? }` where `logo` is the dark-theme file and `logoLight` the light-theme one. |
| `groups` | `ComparisonTableGroup[]` | `[]` | false | The categories, in order; each is `{ title, rows }` and a row is `{ capability, definition?, azion?, competitor? }` with each level `full`, `partial` or `none` (missing reads as `none`). |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- A support cell is one of `full`, `partial` or `none`, mirrored on the glyph's `data-support`
- Without a competitor logo the header shows the competitor name as text
- Empty: when `groups` is empty the band renders nothing but its root — no header, no table

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (column heads, category heads) | `.text-overline-md` |
| typography (row heads) | `.text-label-md` |
| category head text | `var(--primary)` |
| column head text | `var(--text-muted)` |
| row head text | `var(--text-default)` |
| full / partial / none glyph | `var(--success-contrast)` / `var(--warning-contrast)` / `var(--text-muted)` |
| header fill | `var(--bg-canvas)` |
| category fill | `var(--bg-surface)` |
| rules | `var(--border-default)` |
| cell padding | `var(--spacing-xs)` / `var(--spacing-md)` / `var(--spacing-xl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `icon-button` and `tooltip` triggers.
- Keyboard map: `Tab` reaches each definition's info button; `Enter` / `Space` opens its popover and `Esc` closes it (owned by `popover`).
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the table carries a `caption`, `scope="col"` heads, a `scope="colgroup"` head per category and a `scope="row"` head per capability, so each value is announced with its row and column. The glyphs are `aria-hidden` and every cell carries its level as `sr-only` text; each logo has the platform name as `alt`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text and glyph colours are the tokens above.
- `motion-reduce:transition-none motion-reduce:transform-none` — the popover and tooltip carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the info button is a small `icon-button`, a secondary affordance next to the capability name.

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
