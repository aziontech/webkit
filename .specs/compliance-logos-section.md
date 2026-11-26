---
name: compliance-logos-section
category: section
structure: monolithic
status: implemented
spec_version: 5
created: 2026-11-04
last_updated: 2026-11-18
checksum: af89cc1c723d4c88d5cab733ba1244f7cc77d8c811cc137d000f2506f5529802
template: 2
---

# ComplianceLogosSection — Component Spec

## Purpose

The compliance band: a framed media split whose copy states the certifications and whose media is a frame grid of badges, each a picture over a check-marked pill, closed by a "see more" cell. It is a page section — the site places it from a `{ _id: 'compliance-logos-section', props }` entry and binds `props` straight onto it — and it composes `module`, `media-split` and `card-grid`.

## When to use

- On security, enterprise or pricing pages, to list the certifications and link to the compliance page.

## When NOT to use

- For client logos → use `logo-wall-section` or `client-mosaic-section`.

## Related

- `media-split` — the copy-beside-media band this section renders through.

## Best practices

- Four or five certifications plus the link cell fill two rows of three.
- Give every badge an `alt` naming the certification; the pill repeats it for sighted readers.

## Usage

```vue
<script setup>
  import ComplianceLogosSection from '@aziontech/ui/compliance-logos-section'
</script>

<template>
  <ComplianceLogosSection
    eyebrow="Compliance"
    title="Meet your compliance requirements"
    aria-label="Compliance certifications"
    :certifications="[
      { label: 'SOC 2 & 3', badge: '/badges/soc.svg', alt: 'AICPA SOC 2 Type 2 and SOC 3 badge' },
      { label: 'PCI DSS', badge: '/badges/pci.svg', alt: 'PCI DSS badge' }
    ]"
    :primary-action="{ label: 'See more', href: '/compliance' }"
  />
</template>
```

## Props

| Prop             | Type                                    | Default     | Required | JSDoc                                                                                                             |
| ---------------- | --------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `eyebrow`        | `string`                                | `''`        | false    | Eyebrow above the headline.                                                                                       |
| `title`          | `string`                                | `''`        | false    | Headline of the band, rendered by the media split as its `h2`; the band renders nothing when empty.               |
| `description`    | `string`                                | `''`        | false    | Supporting sentence under the headline.                                                                           |
| `ariaLabel`      | `string`                                | `''`        | false    | Accessible name of the badge list.                                                                                |
| `certifications` | `ComplianceLogosSectionCertification[]` | `[]`        | false    | The badges, in order; each is `{ label, badge, alt }` where `badge` is the picture URL and `label` the pill text. |
| `primaryAction`  | `ModuleHeaderAction`                    | `undefined` | false    | The closing "see more" cell; `{ label, href }`. Omitted when absent.                                              |
| `anchor`         | `string`                                | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                    |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` and `focus-visible` on the see-more cell
- Empty: when `title` is empty the band renders nothing; when `certifications` is empty the media holds only the see-more cell, if any

## Motion & Animations

| Trigger                            | Animation / Transition                                                 | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| ---------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- |
| hover / focus on the see-more cell | `transition-colors duration-moderate-02 ease-expressive-entrance`      | inline (matches catalog)                               | `motion-reduce:transition-none` |
| hover on the see-more chevron      | `transition-[translate] duration-moderate-02 ease-expressive-entrance` | inline (matches catalog)                               | `motion-reduce:transition-none` |

## Tokens

| Region                | Token (TOKENS.md)           |
| --------------------- | --------------------------- |
| typography (pill)     | `.text-overline-sm`         |
| typography (see more) | `.text-overline-md`         |
| pill text             | `var(--text-default)`       |
| see-more text         | `var(--text-muted)`         |
| pill border           | `var(--border-muted)`       |
| pill fill             | `var(--bg-surface-raised)`  |
| check bubble fill     | `var(--success-foreground)` |
| check glyph           | `var(--success)`            |
| see-more hover fill   | `var(--bg-hover)`           |
| focus ring            | `var(--ring-color)`         |
| cell rhythm           | `var(--spacing-lg)`         |
| cell inset            | `var(--spacing-xl)`         |
| pill gap              | `var(--spacing-xs)`         |
| anchor scroll offset  | `var(--spacing-2xl)`        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the see-more cell carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`.
- Keyboard map: `Tab` reaches the see-more link; `Enter` follows it.
- ARIA: the band is a plain `div`; the named landmark is `media-split`'s own section (labelled by `title`), so no second landmark is added; the badge grid is a list (`role="list"` named by `ariaLabel`) of list items; each badge image carries its `alt`; the check bubble and chevron are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): pill `var(--text-default)` on `var(--bg-surface-raised)`; see-more `var(--text-muted)` rising to `var(--text-default)` on hover.
- `motion-reduce:transition-none motion-reduce:transform-none` on both transitions above.
- Touch target ≥40×40 px — the see-more cell is a full grid cell.

## Internationalization

No built-in strings: every visible and announced text is a prop from the page JSON.

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the "more" chevron mirrors (`rtl:-scale-x-100`) and its hover nudge moves toward the end edge.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Responsive

- Container queries: none of its own; `media-split` stacks the copy over the grid below its breakpoint.
- Narrow (below `md`): the badge grid drops from three columns to two.
- Touch: the see-more cell is a full grid cell; nothing depends on hover.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 9 KB gzip, the `.size-limit.json` entry `compliance-logos-section`.
- Runtime budget: none: static.
- Heavy parts: none.

## Examples

- Default

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
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
