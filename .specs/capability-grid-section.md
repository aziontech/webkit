---
name: capability-grid-section
category: section
structure: monolithic
status: implemented
spec_version: 12
template: 2
checksum: aeb71f8d712911e5f0bb0f187179916cfe81ea31baed90571fccbbbeb72f2eee
created: 2026-11-11
last_updated: 2026-11-18
---

# CapabilityGridSection — Component Spec

## Purpose

A framed grid of claims or links under an optional section title: each cell is a `FeatureItem` (optional glyph, heading, sentence) with optional bullet points, three or four to a row, and an item with an `href` turns its whole cell into a link to that page. It is the one marketing grid of claims or links: it replaces `'use-case-links'`, `'resource-grid'` and `'content-columns'`. From the design sample's site `CapabilityGridSection`.

Use CapabilityGridSection for any grid of claims or links on a marketing page. It has three layouts, set by the items rather than a prop: benefits (every item has an `icon`), resources (every item has an `href` and no icon) and text columns (no icon, no link). Per-item links are optional; icons are all or none.

## When to use

- A product page listing what the product does, three or six at a time.
- Use cases or resources that each link to their own page, on a hub or landing page: give each item an `href` (and no `icon` for a resource list).
- A bare grid (no title) under a band that already has its heading.

## When NOT to use

- For capabilities with art — use `FeatureTilesSection` or `BentoGrid`.
- For use cases whose band title sits in the first grid cell with one action — use `CustomerUseCasesSection`.
- For the use cases of a product page — not on product pages; use `CustomerUseCasesSection` with exactly four items. The linked use-case grid belongs on hub and landing pages.
- For cells that each carry their own action or copy button — use `FeatureWidgetsSection`.

## Related

- `FeatureItem`, `CardGrid`, `RegistrationFrame`, `ModuleHeader` — the parts.
- `FeatureTilesSection` — tiles with illustrations.

## Best practices

- Three or six items at three columns, four or eight at four, so rows stay full.
- Keep points to three short lines.
- A benefits grid gives every item an `icon`; a resource list or text columns give none. A grid where only some items have an icon is a benefits grid with a gap: it logs a development warning, and the site-composition check (`test/standards/site-composition.test.mjs`) fails it in the shipped page JSON.
- Give either every item an `href` or none, so the grid reads as one kind of cell; do not combine `points` with an `href` (the whole cell is the link).
- Set `titleAlign: 'start'` for a band whose header sits at the start edge (the Partners page's "Why you should be a partner"); the grid keeps its title, so each capability stays an `h3`. Never wrap a bare grid in `Module` to move the title: the capability headings rise to `h2` and the outline breaks.

## Usage

```vue
<script setup>
  import CapabilityGridSection from '@aziontech/webkit/capability-grid-section'
</script>

<template>
  <CapabilityGridSection
    title="Everything an application needs"
    :items="[
      { icon: 'az az-bolt', title: 'Functions', description: 'Run code close to users.' },
      {
        icon: 'az az-database',
        title: 'Storage',
        description: 'Keep objects where they are read.'
      },
      {
        icon: 'az az-shield',
        title: 'Firewall',
        description: 'Stop attacks before they reach you.'
      }
    ]"
  />
</template>
```

## Props

| Prop              | Type                           | Default     | Required | JSDoc                                                                                                                                                                            |
| ----------------- | ------------------------------ | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eyebrow`         | `string`                       | `''`        | false    | Eyebrow above the title.                                                                                                                                                         |
| `title`           | `string`                       | `''`        | false    | Headline over the grid, rendered as the band `h2`; without it the grid is bare and each capability heading is an `h2`.                                                           |
| `description`     | `string`                       | `''`        | false    | One or two sentences under the title.                                                                                                                                            |
| `items`           | `CapabilityGridSectionItem[]`  | `[]`        | false    | The capabilities, in order; each is `{ title, description, icon?, points?, href? }`; an item with `href` links its whole cell to that page. The band renders nothing when empty. |
| `columns`         | `CapabilityGridSectionColumns` | `3`         | false    | Capabilities per row from the large breakpoint up.                                                                                                                               |
| `primaryAction`   | `CapabilityGridSectionAction`  | `undefined` | false    | First button under the section title, `secondary`; `{ label, href, trailing?, target? }`. Shown only with a label and a link.                                                    |
| `secondaryAction` | `CapabilityGridSectionAction`  | `undefined` | false    | Second button under the section title, `outline`; same shape. Shown only with a label and a link.                                                                                |
| `anchor`          | `string`                       | `''`        | false    | In-page id set on the band so a hash link can target it.                                                                                                                         |
| `titleAlign`      | `ModuleHeaderAlign`            | `'center'`  | false    | Layout of the section title: `center` stacks and centers it, `start` stacks it at the start edge, `split` sets the headline and its description in two columns.                  |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Renders nothing without items.
- Heading level drops to `h3` under a title and rises to `h2` without one.
- An item with `href` renders its heading as a link that covers the cell.
- Items that mix an `icon` with none log one development warning naming how many lack it; nothing changes in the render.
- `titleAlign` is passed to the section title as its `align`; it has no effect on a bare grid.

## Motion & Animations

_none_

## Tokens

| Region  | Token (TOKENS.md)                                                 |
| ------- | ----------------------------------------------------------------- |
| frame   | From `RegistrationFrame` and `CardGrid` (`var(--border-default)`) |
| cell    | `var(--bg-canvas)` (`CardGridCell variant="canvas"`)              |
| points  | `.text-body-md`, `var(--text-muted)`                              |
| spacing | `var(--spacing-sm)`, `var(--spacing-xs)`, `var(--spacing-md)`     |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- A `section` named by its title; headings nest under it.
- Points are a real list.
- Glyphs are decorative (from `FeatureItem`).
- A linked cell is one link named by its heading (from `FeatureItem`), with a visible focus ring.

## Internationalization

- Built-in strings: none. Every visible string is marketing copy and arrives through props, so the page supplies it in its own language.

## Right-to-left

- Layout: logical utilities only (`ps-*`, `border-e`, `ms-*`).
- Icons: none mirrored.
- Keyboard: unchanged.

## Responsive

- One column on phones, two on medium, `columns` from large (from `CardGrid`).
- No horizontal scroll at 320 px.

## Performance

- Bundle budget: 6.75 KB for `./capability-grid-section` gzip in `.size-limit.json` (measured + ~0.5 KB).
- Heavy parts: none.

## Examples

- Default — three capabilities with a title and an action.
- Points — six capabilities with bullet points at four columns.
- Left title — `titleAlign: 'start'` sets the header at the start edge over the grid.
- Links — use cases without points, each cell linking to its page.

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
