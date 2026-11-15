---
name: feature-scroll
category: sections
structure: monolithic
status: implemented
spec_version: 3
created: 2026-11-04
last_updated: 2026-11-15
checksum: fc448de522b05b0d15e94043275ede3970d5d5b0878fd4338af516bd119c0bf4
---
# FeatureScroll — Component Spec

## Purpose

The walkthrough band of a product page: a large section title over one screen per feature. From the large breakpoint up the features scroll through a sticky stack — the copy advances while the feature's live scene or illustration stays pinned in a framed, textured stage with one small action under each step (a step may pin a one-file code sample instead, for a code-led walkthrough); below it the same features are a three-column grid of media tiles. It is a page section — the site places it from a `{ _id: 'feature-scroll', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `card-grid`, `media-tile`, `illustration`, `code-block`, `sticky-stack`, `texture-material`, `button` and the webkit scene assets (a `ProductWidget` console fragment, most often).

## When to use

- Use FeatureScroll for the product-page walkthrough, one pinned screen (scene or code) per feature.
- To walk through four to six capabilities of one product, each with a picture of its own.
- To walk through capabilities each shown by the file you would write: give each item a `code` sample.

## When NOT to use

- For three reasons with no scroll story → use `feature-tiles`.
- For one claim beside one code sample → use `media-split-band` with `codeTabs`.
- In a hand-built SFC that needs its own media slot → use `sticky-stack` directly.

## Related

- `sticky-stack` — the scroll engine the large layout runs on.
- `media-tile` — the cell the small layout renders each feature with.

## Best practices

- Four to six items; the stack needs enough steps to earn the scroll.
- Give every item a `scene`, a `code` sample or an `illustration`; it is the pinned picture on large screens and the tile media on small ones. On a product page prefer a `scene` naming a `ProductWidget` (`{ component: 'ProductWidget', props: { name } }`): it shows the console itself.
- Keep `action` to a short label such as "Docs" — it sits under the step copy at the small size.

## Usage

```vue
<script setup>
import FeatureScroll from '@aziontech/webkit/feature-scroll'
</script>

<template>
  <FeatureScroll
    eyebrow="Workloads"
    title="Everything a workload does, one screen at a time"
    description="Scroll through the console a workload is run from."
    :items="[
      { title: 'Every workload on one list', description: 'See each workload with its domain, status and last deployment.', illustration: 'traffic-and-cost-bar-chart', action: { label: 'Docs', href: '/docs', trailing: true } },
      { title: 'Read the deployment topology', description: 'The domains, the application and the firewall a workload serves.', illustration: 'global-network', action: { label: 'Docs', href: '/docs', trailing: true } }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the large section title as its `h2`; the band renders no header when empty. |
| `description` | `string` | `''` | false | Supporting sentence under the headline. |
| `items` | `FeatureScrollItem[]` | `[]` | false | The features, in order; each is `{ title, description, scene?, code?, illustration?, action? }` where `scene` is `{ component, props? }` naming a webkit scene asset (drawn live in the stack, still in the grid), `code` is a one-file sample `{ fileName, code, language?, fileIcon?, copyAriaLabel? }` drawn when no scene is set, `illustration` is a registry name drawn when neither is set, and `action` is `{ label, href, trailing?, target?, kind? }` rendered as a small button under the step, secondary unless `kind` says otherwise. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Below the large breakpoint the features render as a three-column grid of media tiles; from it up they render as a sticky stack whose active step is `sticky-stack`'s own
- Empty: when `items` is empty the band renders nothing — not the header, not the frames
- Media: an item's `scene` wins over its `code`, which wins over its `illustration`; a `code` sample is a one-file `code-block` with line numbers, typed in once in the stack and loaded on demand; in the stack the scene receives `active` for the open step only, so a console fragment plays its beat while its step is open and rests on its settled frame otherwise; in the grid every scene is drawn still (`active: false`) in a 20rem window. A scene name that is not registered draws nothing.

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| stage fill | `var(--bg-surface)` |
| stage shape | `var(--shape-card)` |
| stage inset | `var(--spacing-md)` |
| stage inset (large) | `var(--spacing-xl)` |
| frame rules and marks | `var(--border-default)` |
| anchor scroll offset | `var(--spacing-xxl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `button`.
- Keyboard map: `Tab` reaches each step's action and a code sample's copy button; `Enter` follows it; the stack's own progression is scroll-driven and never traps focus.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the step headings are `sticky-stack`'s and `media-tile`'s; the texture layer and the pinned illustration are decorative; a scene carries its own semantics (a `ProductWidget` is a decorative console picture).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by the composed components.
- `motion-reduce:transition-none motion-reduce:transform-none` — the step transition belongs to `sticky-stack`, which carries its own fallback; this band adds no motion.
- Touch target ≥40×40 px — the per-step action is a small `button` on the large layout only, where pointer precision is available.

## Examples

- Default
- Live scenes — each item draws a `ProductWidget` console fragment instead of an illustration.
- Code — each item pins a one-file code sample with a docs action, one opening in a new tab (justified: the code media is a render path the other examples do not reach).

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
