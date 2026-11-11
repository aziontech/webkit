---
name: closing-call-to-action-templates
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-11
checksum: 2ec81e62a136c9764fd7296d2431c5d3a228ad3f99254b5c6c49a60da2c395ea
last_updated: 2026-11-11
---
# ClosingCallToActionTemplates — Component Spec

## Purpose

The close for a page whose last ask is "start from a template": a framed split whose left cell carries the ask — headline, sentence and two actions, left-aligned — over the pixelated, waving texture of the `primary` close, and whose right cell is a scrolling two-column grid of deployable template cards, each with its mark, name, one line and a deploy button, its top and bottom fading out; then the tall hatched closing frame. Below `lg` the cells stack, the ask first. It merges the `primary` close of `closing-call-to-action` with the scrolling template wall of `template-gallery`. It is a page section — the site places it from a `{ _id: 'closing-call-to-action-templates', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `button`, `scroll-area`, `card-grid`, `card-grid-cell`, `frame-box` and `texture-material`.

## When to use

- To close a framework, solution or developer page on a ready-to-deploy start rather than on a sign-up alone.

## When NOT to use

- For a close on one or two link actions → use `closing-call-to-action` (`primary` for the same loud register without the templates).
- For a mid-page band that browses many templates beside its copy → use `template-gallery`.
- For a close whose reader may be an agent → use `closing-call-to-action-agents`.

## Related

- `closing-call-to-action` — the `primary` close, centred, without the template grid.
- `template-gallery` — a scrolling wall of templates beside its copy, as a mid-page band.

## Best practices

- Give the grid six to eight templates so it overflows its height and reads as scrollable; an even count keeps its two columns full.
- Keep each template line to one short sentence so the cards keep one height.
- Give every card an `href` and set `deployLabel`, or no card shows its deploy button.

## Usage

```vue
<script setup>
import ClosingCallToActionTemplates from '@aziontech/webkit/closing-call-to-action-templates'
</script>

<template>
  <ClosingCallToActionTemplates
    anchor="contact"
    title="Start from a template. Ship today."
    description="Pick a starter, deploy it in seconds, and make it yours."
    :primary-action="{ label: 'Start for free', href: '/signup' }"
    :secondary-action="{ label: 'Browse all templates', href: '/templates', trailing: true }"
    deploy-label="Deploy"
    templates-aria-label="Templates you can deploy"
    :templates="[
      { title: 'Next.js Commerce', description: 'Ecommerce template built with Next.js and Shopify.', icon: 'ai-cor ai-next', invertInDark: true, href: '/templates/nextjs-commerce' },
      { title: 'Astro Odyssey', description: 'A business marketing website built with Astro.', icon: 'ai-cor ai-astro', href: '/templates/astro-odyssey' }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `title` | `string` | `''` | false | Headline of the band, rendered as its `h2` and naming its region; the band renders nothing when empty. |
| `description` | `string` | `''` | false | Sentence under the headline. |
| `primaryAction` | `ClosingCallToActionTemplatesAction` | `undefined` | false | The white button under the copy; `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent. |
| `secondaryAction` | `ClosingCallToActionTemplatesAction` | `undefined` | false | The outlined button beside the primary one; `{ label, href, trailing?, target? }`. Omitted when absent. |
| `templates` | `ClosingCallToActionTemplatesTemplate[]` | `[]` | false | The template cards of the scrolling grid beside the copy, in order; each is `{ title, description?, icon?, invertInDark?, href? }`. Templates without a title are skipped and the grid is omitted when none is left. |
| `deployLabel` | `string` | `''` | false | Label of the deploy button on each card; a card renders its button only when both this and its `href` are set. |
| `templatesAriaLabel` | `string` | `''` | false | Accessible name of the scrolling grid of templates. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- Hovering a card shows the pointer cursor and lights its deploy button
- Layout: from `lg` up the ask and the grid sit side by side; below it they stack, the ask first, and the grid drops to one column below `sm`
- Overflow: the grid holds a fixed height (32rem, 38rem from `lg`) and scrolls vertically, its top and bottom fading out
- Empty: when `title` is empty the band renders nothing but its root; without titled templates the grid is omitted and the ask stands alone in the band; a card without `href` (or without `deployLabel`) shows no deploy button

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
| cell seam | `var(--border-default)` |
| ask cell fill | `var(--bg-canvas)` |
| scroll floor | `var(--spacing-xxl)` |
| card rhythm | `var(--spacing-md)` |
| mark tile fill | `var(--bg-surface-raised)` |
| mark tile rule | `var(--border-muted)` |
| mark tile shape | `var(--shape-elements)` |
| deploy prefix mark | `var(--primary)` |
| closing frame | `var(--spacing-xxl)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by the composed `button`s.
- Keyboard map: `Tab` reaches the band's two actions, then the scrolling grid and each card's deploy link in reading order; the arrow keys scroll the focused grid; `Enter` follows a link.
- ARIA: the root is a plain `div`; the split is a `section` region named by `title`, whose headline is the `h2`. The scrolling grid is `scroll-area`'s region named by `templatesAriaLabel`; the texture and the template marks are decorative (`aria-hidden`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): card titles `var(--text-default)`, card lines `var(--text-muted)`; marks flagged `invertInDark` invert under the dark theme.
- `motion-reduce:transition-none motion-reduce:transform-none` — the waving texture, the button hover and the scrolling belong to `texture-material`, `button` and `scroll-area`, which carry their own reduced-motion fallback; this band adds no motion.
- Touch target ≥40×40 px — the band's actions are large `button`s, the deploy buttons medium.

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
