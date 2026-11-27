---
name: competitor-comparison-section
category: section
structure: monolithic
status: implemented
spec_version: 6
template: 2
created: 2026-11-05
last_updated: 2026-11-24
checksum: 9173895ff664da0fcf13489ae3f9293650bb6aed3beef08585249c2e29b77b1f
---

# CompetitorComparisonSection — Component Spec

## Purpose

The capability-by-capability comparison of Azion with one competitor on a migration landing page: a left section title over a framed table whose header row (the capability column, the Azion brand and the competitor logo) stays pinned while the page scrolls. Each category opens with a heading row; each cell is a support glyph — full, partial or none — named by a tooltip and by screen-reader text and keyed in a one-line legend above the table (each glyph with its label, for touch and keyboard readers who never see the tooltip), and a capability with a definition carries a `hint` glyph that opens it as a short note. It is a page section — the site places it from a `{ _id: 'competitor-comparison-section', props }` entry and binds `props` straight onto it — and it composes `module`, `module-header`, `registration-frame`, `brand`, `hint` and `tooltip`.

## When to use

- Use CompetitorComparisonSection to compare Azion with one competitor, on an "Azion vs X" page, across a few categories of capabilities.

## When NOT to use

- To compare Azion's own plans or support tiers → use `plan-comparison-section`.
- For price cards with a billing-period toggle → use `pricing-plans-section`.

## Related

- `plan-comparison-section` — the plan-by-plan matrix of Pricing.
- `tooltip` — names each support glyph on hover and focus.
- `third-party-logo` — draws the competitor's mark right on both themes.

## Best practices

- Give every row a `definition`; the hint note is where a reader learns what the capability means.
- Pass the competitor's entry from `@aziontech/webkit/assets/competitor-registry` (`competitor('Akamai')`): its `logo` and `logoLight` render on first paint, server render included.
- With only a `name`, the band looks the name up in the competitor registry once the page is interactive (the registry loads on demand, outside the band's bundle) and shows the name as text until then, or for a platform the registry does not hold.
- For a platform outside the registry, ship both `competitor.logo` (dark theme) and `competitor.logoLight` (light theme), or one file with its `artwork`.
- Set `anchor` when a page links to the table (`#compare`).
- Keep `caption` equal to the title; it is the table's accessible name.

## Usage

```vue
<script setup>
  import CompetitorComparisonSection from '@aziontech/webkit/competitor-comparison-section'
</script>

<template>
  <CompetitorComparisonSection
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
          {
            capability: 'Bot management',
            definition: 'Detecting and blocking automated traffic.',
            azion: 'full',
            competitor: 'partial'
          }
        ]
      }
    ]"
  />
</template>
```

## Props

| Prop           | Type                                    | Default | Required | JSDoc                                                                                                                                                                                                                                                                                                                             |
| -------------- | --------------------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`       | `string`                                | `''`    | false    | In-page id set on the band so a hash link can target it.                                                                                                                                                                                                                                                                          |
| `eyebrow`      | `string`                                | `''`    | false    | Eyebrow above the section title.                                                                                                                                                                                                                                                                                                  |
| `title`        | `string`                                | `''`    | false    | Headline of the band, rendered by the section title as its `h2` and naming the band; no header renders when empty.                                                                                                                                                                                                                |
| `caption`      | `string`                                | `''`    | false    | Screen-reader caption naming the table.                                                                                                                                                                                                                                                                                           |
| `columnLabel`  | `string`                                | `''`    | false    | Heading of the capability column.                                                                                                                                                                                                                                                                                                 |
| `fullLabel`    | `string`                                | `''`    | false    | Legend entry, tooltip and screen-reader text of a full-support cell.                                                                                                                                                                                                                                                                            |
| `partialLabel` | `string`                                | `''`    | false    | Legend entry, tooltip and screen-reader text of a partial-support cell.                                                                                                                                                                                                                                                                         |
| `noneLabel`    | `string`                                | `''`    | false    | Legend entry, tooltip and screen-reader text of an unsupported cell.                                                                                                                                                                                                                                                                            |
| `competitor`   | `CompetitorComparisonSectionCompetitor` | `—`     | true     | The platform compared with Azion; `{ name, logo?, logoLight?, artwork? }` where `logo` is the dark-theme file and `logoLight` the light-theme one. With only a `name`, the logo is taken from the competitor registry once the page is interactive, and the name is the column head until then or when the registry has no entry. |
| `groups`       | `CompetitorComparisonSectionGroup[]`    | `[]`    | false    | The categories, in order; each is `{ title, rows }` and a row is `{ capability, definition?, azion?, competitor? }` with each level `full`, `partial` or `none` (missing reads as `none`).                                                                                                                                        |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- A support cell is one of `full`, `partial` or `none`, mirrored on the glyph's `data-support`. Only `full` is coloured; `partial` and `none` stay neutral, told apart by their glyph and their label:

  | Level     | Glyph                | Colour                |
  | --------- | -------------------- | --------------------- |
  | `full`    | `az az-circle-check` | `var(--success-mark)` |
  | `partial` | `az az-circle-half`  | `var(--text-muted)`   |
  | `none`    | `az az-minus`        | `var(--text-muted)`   |

  Partial support is a property of the platform, not a problem that needs action, so it never takes the warning colour; an unsupported capability is a quiet dash, not a red cross.

- The competitor head is a `ThirdPartyLogo` (`data-testid="competitor-comparison-section__competitor-logo"`) whose `data-route` is `pair` (light/dark files), `single` (one file) or `wordmark` (the name as text: no logo and no registry entry, or before the registry loads)
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed` (each hint owns its open state)
- Empty: when `groups` is empty the band renders nothing but its root — no header, no table

## Motion & Animations

_none_

## Tokens

| Region                                    | Token (TOKENS.md)                                                                                              |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| typography (column heads, category heads) | `.text-overline-md`                                                                                            |
| typography (row heads)                    | `.text-label-md`                                                                                               |
| category head text                        | `var(--text-default)` after a 2px start bar in `var(--primary)` (`competitor-comparison-section__group-title`) |
| column head text (aligned to the start)   | `var(--text-muted)`                                                                                            |
| row head text                             | `var(--text-default)`                                                                                          |
| full / partial / none glyph               | `var(--success-mark)` / `var(--text-muted)` / `var(--text-muted)`                                              |
| header fill                               | `var(--bg-canvas)`                                                                                             |
| category fill                             | `var(--bg-surface)`                                                                                            |
| rules                                     | `var(--border-default)`                                                                                        |
| cell padding                              | `var(--spacing-xs)` / `var(--spacing-md)` / `var(--spacing-xl)`                                                |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `hint` and `tooltip` triggers.
- Keyboard map: `Tab` reaches each definition's hint glyph; `Enter` / `Space` opens its note and `Esc` closes it (owned by `hint`).
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the table carries a `caption`, `scope="col"` heads, a `scope="colgroup"` head per category and a `scope="row"` head per capability, so each value is announced with its row and column. The glyphs are `aria-hidden` and every cell carries its level as `sr-only` text; the competitor logo is a `ThirdPartyLogo` named by the platform, inside a head cell that carries the same name.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text and glyph colours are the tokens above. The glyphs on `--bg-canvas`: `--success-mark` Lc 67.0 / 4.43:1 (light) and Lc 49.6 / 7.69:1 (dark); `--text-muted` Lc 80.8 / 7.06:1 (light) and Lc 60.7 / 9.90:1 (dark). The category heads are `--text-default` with a decorative bar in the logo orange (`--primary`); every part passes WCAG 2 AA with no exception (owner decision 2026-11-22).
- Never colour alone: each level has its own glyph and its label as tooltip and `sr-only` text, and the legend above the table pairs each glyph with its label for every reader.
- `motion-reduce:transition-none motion-reduce:transform-none` — the hint and tooltip carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the hint glyph is small and extends its touch target to the pointer size, a secondary affordance next to the capability name.

## Internationalization

| Key                                 | English source       | Override prop |
| ----------------------------------- | -------------------- | ------------- |
| `competitorComparisonSection.about` | `About {capability}` | —             |

- The column and level labels (`columnLabel`, `fullLabel`, `partialLabel`, `noneLabel`), the caption and every capability are content the page passes.
- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`border-s`, `ps-`/`pe-`); the Azion and competitor columns follow the reading direction.
- Icons: the support glyphs and the info glyph are not mirrored; logos are never mirrored.
- Keyboard: `Tab` order follows the DOM.
- User data: the competitor name drawn as a wordmark is wrapped in `dir="auto"` by `ThirdPartyLogo`.

## Responsive

- Container queries: none; below `sm` the head row names the two platforms in `text-label-sm` text instead of their logos, which would shrink past legibility; from `sm` the logos show at 16 px, and at 24 px from `md`.
- Narrow: the capability column keeps its text, the two platform columns narrow to their glyphs.
- Touch: the hint glyph is a secondary affordance next to the capability name; its touch target grows on a coarse pointer.
- Reflow: no horizontal scroll at 320 px; the head row stays pinned under the site header at `top: var(--layout-sticky-top)` (the header height by default; `0` inside a scroller with no header above it, so the head row never covers the first category at rest).

## Performance

- Bundle budget: 23.1 KB gzip for the initial chunk of `./competitor-comparison-section` in `.size-limit.json` (`entryOnly`); the competitor registry and its logo files are a separate chunk, fetched only when a competitor comes with a name and no logo.
- Runtime budget: one table; a few dozen rows.
- Heavy parts: the competitor registry, loaded on demand after mount.

## Examples

- Default
- Registry — the competitor given by name only, its logo taken from the competitor registry, and the band reachable at `#compare`.

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
