---
name: template-gallery
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 608b1b9b879862c527d0a134e08ae24d5269942742e3f8a13955212b70a436b0
---

# TemplateGallery — Component Spec

## Purpose

The templates band of a solution page: a framed media split whose copy side invites the reader to start from a template and whose media side is a scrolling two-column wall of deployable template cards, closed by a ticker of the frameworks and clouds it works with. Each card is a mark, a title, one line and a deploy action. It is a page section — the site places it from a `{ _id: 'template-gallery', props }` entry and binds `props` straight onto it — so its whole API is the props below, and it composes `section-module`, `media-split`, `scroll-area`, `card-grid`, `button`, `frame-box` and `ticker` rather than owning any anatomy of its own.

## When to use

- On a solution page (Retail, Web Apps, AI Workloads, Security, Performance, Streaming) to show the templates a reader can deploy right away.
- Whenever a band pairs one pitch with a long, browsable list of deployable starters.

## When NOT to use

- For a grid of features with artwork → use `feature-tiles`.
- For a ticker of marks alone → compose `ticker` directly.
- For a handful of icon-led use cases → use `use-cases`.

## Related

- `media-split` — the framed copy-and-media split the band is built on; it owns the band's named region.
- `ticker` — the row of framework and cloud marks that closes the band.

## Best practices

- Keep the wall to an even number of templates so the two columns end level.
- Turn on `invertInDark` only for a mark whose artwork ships in dark ink, so it stays legible on the dark theme.
- Set `templatesAriaLabel` so the scrolling wall is announced by name.

## Usage

```vue
<script setup>
import TemplateGallery from '@aziontech/webkit/sections/template-gallery'
</script>

<template>
  <TemplateGallery
    eyebrow="Your Stack, Your Way"
    title="Quick Start with Templates"
    description="Deploy complete projects in seconds with popular frameworks."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Talk to a specialist', href: '/contact', trailing: true }"
    :templates="[
      { title: 'Astro Odyssey', description: 'A marketing website starter built with Astro.', icon: 'ai-cor ai-astro', href: '/templates/astro-odyssey' },
      { title: 'Next.js Commerce', description: 'Ecommerce template built with Next.js.', icon: 'ai-cor ai-next', invertInDark: true, href: '/templates/nextjs-commerce' }
    ]"
    deploy-label="Deploy now"
    templates-aria-label="Templates you can deploy"
    ticker-label="Compatible with Your Stack"
    :ticker-marks="['nextjs', 'astro', 'react', 'vue']"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `eyebrow` | `string` | `''` | false | Overline above the headline. |
| `title` | `string` | `''` | false | Headline of the band, rendered by the media split as its `h2` and naming its region. |
| `description` | `string` | `''` | false | Paragraph under the headline. |
| `primaryAction` | `TemplateGalleryAction` | `undefined` | false | First button under the copy, drawn as the large secondary button; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `secondaryAction` | `TemplateGalleryAction` | `undefined` | false | Second button under the copy, drawn as the large outlined button; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `templates` | `TemplateGalleryTemplate[]` | `[]` | false | The template cards of the scrolling wall, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped. |
| `deployLabel` | `string` | `''` | false | Label of the deploy button on each card; a card renders its button only when both this and its `href` are set. |
| `templatesAriaLabel` | `string` | `''` | false | Accessible name of the scrolling wall of templates. |
| `tickerLabel` | `string` | `''` | false | Overline above the row of marks. |
| `tickerMarks` | `string[]` | `[]` | false | Registry names of the frameworks and clouds in the row of marks, in order; the ticker is omitted when empty. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Hovering a card lights its deploy button
- Empty: when no template carries a title the band renders nothing — not the split, not the ticker

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (card title) | `.text-body-md` |
| typography (card line) | `.text-body-sm` |
| card title | `var(--text-default)` |
| card line | `var(--text-muted)` |
| card fill | `var(--bg-surface)` |
| card inset | `var(--spacing-xl)` |
| card rhythm | `var(--spacing-md)` |
| mark tile fill | `var(--bg-surface-raised)` |
| mark tile rule | `var(--border-muted)` |
| mark tile shape | `var(--shape-elements)` |
| deploy prefix mark | `var(--primary)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `button`s and the `scroll-area`.
- Keyboard map: `Tab` reaches the copy's actions, the scrolling wall and each card's deploy link in reading order; `Enter` follows a link. Nothing else in the band is interactive.
- ARIA: the band's root is a plain `div`, because `media-split` already renders the band's region named by its title; the wall is `scroll-area`'s region named by `templatesAriaLabel`; the template marks are decorative (`aria-hidden`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): card titles `var(--text-default)`, card lines `var(--text-muted)`; marks flagged `invertInDark` invert under the dark theme.
- `motion-reduce:transition-none motion-reduce:transform-none` — the button hover and the ticker scroll belong to `button` and `ticker`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the deploy buttons are medium `button`s, the copy's actions are large.

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
