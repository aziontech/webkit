---
name: sticky-carousel
category: sections
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: aa0b81885bc62d37a266a85390f0802b877370d61dfa0e17bc2f446ff088940e
created: 2026-11-11
last_updated: 2026-11-11
---

# StickyCarousel — Component Spec

## Purpose

A row of numbered dark cards that pins under the site header while the page scrolls and slides the row sideways until its last card is in view, then lets the page continue. Below the large breakpoint, or under reduced motion, it is a plain snap-scrolling row. From the design sample's site `StickyCarousel`.

## When to use

- Five to eight short points that read best one after another (principles, reasons).

## When NOT to use

- For three to five ordered stages that fit the width — use `ProcessScroll`.
- For content the reader must compare side by side.

## Related

- `ProcessScroll` — the same cards without pinning.
- `StickyStack`, `FeatureScroll` — other scroll-driven bands.

## Best practices

- Keep each card to a heading and two lines.
- Do not nest it inside a container that clips overflow; sticky positioning needs the page scroll.

## Usage

```vue
<script setup>
  import StickyCarousel from '@aziontech/webkit/sticky-carousel'
</script>

<template>
  <StickyCarousel
    title="Why teams move"
    :items="[
      { title: 'One platform', description: 'Code, data and security in one place.' },
      { title: 'No regions', description: 'Everything runs everywhere by default.' }
    ]"
  />
</template>
```

## Props

| Prop           | Type                   | Default    | Required | JSDoc                                                                                               |
| -------------- | ---------------------- | ---------- | -------- | --------------------------------------------------------------------------------------------------- |
| `anchor`       | `string`               | `''`       | false    | In-page id set on the band so a hash link can target it.                                            |
| `eyebrow`      | `string`               | `''`       | false    | Overline above the title.                                                                           |
| `title`        | `string`               | `''`       | false    | Headline of the band, rendered as its `h2`; the band renders nothing when empty.                    |
| `description`  | `string`               | `''`       | false    | Paragraph beside the headline.                                                                      |
| `items`        | `StickyCarouselItem[]` | `[]`       | false    | The cards, in order; each is `{ title, description }` and is numbered by its position.              |
| `ariaLabel`    | `string`               | `''`       | false    | Accessible name of the card row; defaults to the title.                                             |
| `headerOffset` | `string`               | `'3.5rem'` | false    | Height of the sticky site header the band pins under, from the large breakpoint up; any CSS length. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Renders nothing without a title or items.
- Pinned (large, motion allowed): the runway grows by the row overflow and the row translates with the scroll.
- Not pinned: a snap-scrolling row.

## Motion & Animations

The row translates with the page scroll only under `motion-safe` from the large breakpoint up; under reduced motion it is a plain scrolling row. The translation is inverted under `dir="rtl"`.

## Tokens

| Region  | Token (DESIGN.md)                             |
| ------- | --------------------------------------------- |
| card    | `var(--bg-surface)` under `data-theme="dark"` |
| number  | `.text-big-number-lg`                         |
| heading | `.text-heading-sm`                            |
| copy    | `.text-body-md`, `var(--text-muted)`          |
| focus   | `var(--ring-color)`                           |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The band root is a plain container; the row is the one focusable `region`, named by `ariaLabel` or the title.
- Cards are an ordered list; the number is `aria-hidden`.
- Keyboard: when pinned, focus moving into a card scrolls the page, and the row follows the page scroll.

## Internationalization

- Built-in strings: none. Every visible string is marketing copy and arrives through props, so the page supplies it in its own language.

## Right-to-left

- Layout: logical utilities; the pinned row slides toward the inline start in both directions.
- Keyboard: unchanged.

## Responsive

- Pins only from the large breakpoint up.
- Below large: cards `min(22rem, 80vw)` with snap.

## Performance

- One scroll listener (passive, capture) batched to one `requestAnimationFrame`; one `ResizeObserver`.
- Bundle budget: 6.1 KB for `./sticky-carousel` gzip in `.size-limit.json` (measured + ~0.5 KB).

## Examples

- Default — six cards.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
