---
name: brand
category: content
structure: monolithic
status: implemented
spec_version: 6
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=587-3946
  node_id: 587:3946
checksum: 22375b5091cdeb0a6c768c87afda6884b5b7d3595d4183929ea5637396ef7c66
created: 2026-07-13
last_updated: 2026-11-25
---

# Brand — Component Spec

## Purpose

The Azion brand logo, rendered as an inline SVG lockup. A single `variant` prop selects the lockup: `default` (the AZION wordmark) for standard surfaces, `reduced` (the "A" glyph) for compact headers and tight spaces, and `extended` (the AZION wordmark over "technologies") for marketing-oriented layouts. It is the one public way to draw the Azion mark: the drawings live inside the package and are not exported on their own. The lockups that carry the "Move to the Edge" tagline were retired in 6.0.

## When to use

- Use Brand only for the Azion logo.
- The Azion logo in a header, navigation bar, footer, sign-in screen or product mockup.
- `variant="reduced"` where space is tight (collapsed sidebar, mobile header).
- `variant="extended"` in marketing layouts that show "AZION technologies".
- `treatment="monochrome"` where the orange mark cannot be used (a one-colour print, a document, a partner page that asks for a black or white logo); `treatment="knockout"` on an orange `--primary` fill.

## When NOT to use

- A customer, partner or competitor logo → use `third-party-logo` (one mark) or `logo-wall` (a grid of them).
- A person's or organization's picture → use `avatar`.
- A decorative product graphic → use `illustration`.

## Related

- `site-header-section` and `site-footer-section` — compose Brand for the site chrome.
- `avatar` — the picture or initials of a user, not the product mark.
- `third-party-logo` — another company's mark; `Brand` is only Azion's own.
- `logo-wall` — a grid of other companies' marks.

## Best practices

- Choose the lockup with `variant` and the height with `size` (16 / 24 / 32 px); do not pass width or height classes, the width follows the lockup's aspect ratio.
- Do not recolor or rebuild the SVG; use the component so every surface shows the same mark. The colour comes from `treatment`, never from a class.
- For a home link, wrap Brand in an anchor; its `role="img"` and accessible name "Azion" give the link its name.
- Take the logo only from Brand, never from a copied SVG file or a website URL.
- Keep clear contrast between the logo and its background, and clear space around it; never shrink it below the `small` size.
- Show the `extended` lockup at the `large` size: at `small` and `medium` its "technologies" line is a few pixels tall and cannot be read.
- Do not set the logo next to text or interface elements in the brand primary colour: the signature lockup already carries it.
- The `color` treatment works on light and dark surfaces: the orange mark stays, and the "technologies" line of the extended lockup follows the text colour (dark on a white background, light on a dark one).
- One-colour versions come from `treatment`: `monochrome` is black on light and white on dark, `knockout` is the label colour of an orange `--primary` fill. Never recolour a copy of the drawing.

## Usage

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
</script>

<template>
  <Brand variant="default" />
</template>
```

## Props

| Prop         | Type                                    | Default     | Required | JSDoc                                                                                                                                                                                   |
| ------------ | --------------------------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `variant`    | `'default' \| 'reduced' \| 'extended'`  | `'default'` | false    | Brand lockup to render: `default` (AZION wordmark), `reduced` (the "A" glyph for tight spaces), `extended` (wordmark over "technologies").                                              |
| `size`       | `'small' \| 'medium' \| 'large'`        | `'medium'`  | false    | Size token; sets the lockup height (16 / 24 / 32 px) while width scales automatically so each `variant` keeps its own aspect ratio.                                                     |
| `decorative` | `boolean`                               | `false`     | false    | Hides the mark from assistive tech when visible text beside it already says Azion.                                                                                                      |
| `treatment`  | `'color' \| 'monochrome' \| 'knockout'` | `'color'`   | false    | How the mark is inked: `color` keeps the orange mark, `monochrome` paints it in one colour (black on light, white on dark), `knockout` paints it in the label colour of an orange fill. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop
- `data-size` mirrors the `size` prop
- `data-treatment` mirrors the `treatment` prop

## Motion & Animations

_none_

## Tokens

| Region                                 | Token (TOKENS.md)           |
| -------------------------------------- | --------------------------- |
| brand mark (SVG fill, asset-owned)     | `var(--primary)`            |
| "technologies" line, `monochrome` mark | `var(--text-default)`       |
| `knockout` mark                        | `var(--primary-foreground)` |

## Theme gaps

| Figma variable           | Temporary primitive                             | Follow-up                                              |
| ------------------------ | ----------------------------------------------- | ------------------------------------------------------ |
| brand orange (`#F3652B`) | hardcoded HEX inside the private Azion drawings | `TODO: tokenizar the brand assets to `var(--primary)`` |

## Accessibility (WCAG 2.1 AA)

- The root carries `role="img"` and a default `aria-label` (`Azion`) so the logo has an accessible name; consumers may override the label via a passed `aria-label`. With `decorative` the root drops `role` and the name and is `aria-hidden`, for a mark next to visible Azion text (the same option `ThirdPartyLogo` has; `Brand` is the Azion house mark, `ThirdPartyLogo` any other company's mark).
- Non-interactive: the logo is not focusable and emits no events; the inner SVG is presentational.
- Contrast ≥3:1 for the brand mark against its background (large graphic).
- `motion-reduce` not applicable — the component is static.

## Examples

- Default
- Types — composite story rendering every `variant` value (`default`, `reduced`, `extended`) side-by-side.
- Sizes — composite story rendering every `size` value (`small`, `medium`, `large`) side-by-side.
- Treatments — composite story rendering every `treatment` value (`color`, `monochrome`, `knockout`), each on its background; justified because the treatment changes the colour of the mark, which Types and Sizes do not show.

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
- Do not add examples beyond Default + Types + Sizes for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
