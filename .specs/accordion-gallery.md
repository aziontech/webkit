---
name: accordion-gallery
category: marketing
structure: monolithic
status: approved
spec_version: 2
checksum: a0c3c5d5be2a14dc6e3b8cd2c223d42244bed59586039343fcd9031869801f32
created: 2026-09-22
last_updated: 2026-09-25
---

# Accordion Gallery — Component Spec

## Purpose

A two-column gallery: a stack of selectable steps on one side and the image for the selected step on the other, cross-fading as the selection moves. It advances on its own on a timer with a progress bar over the active step, and collapses below `lg` to one column where the selected step reveals its own image inline.

## When to use

- To walk a reader through a sequence of capabilities where each step has a picture.
- When the steps are short — a title and a few bullet points — and the image carries the detail.
- As a product-page section that rewards watching but does not require it.

## When NOT to use

- For a set of peers with no order and no imagery → use `feature-card` in a grid.
- For questions and answers → use `faq`.
- For one claim beside one picture → use `media-split`.
- For content a reader must see — a step past the first can be missed.

## Related

- `progress-bar` — the autoplay indicator over the active step; composed, not redrawn.
- `frame-box` — the frame and corner marks EACH STEP is drawn with. This is the step's own card, not a frame around the band: the band itself draws none, so the rule around it belongs to whatever assembles the page.
- `media-split` — the single copy-and-media pairing, when there is no sequence.
- `carousel` — when the items are peers to browse rather than a sequence to follow.

## Best practices

- The gallery draws no frame around itself — only around each step. The band's own rule and corner marks belong to the `section-module` or `frame-box` the page assembles it into.

- Keep `points` to three or four short lines. The step is a summary; the image is the argument.
- Give every item a `backgroundImage` of the same shape — the image column holds one frame and cross-fades within it, so mismatched aspect ratios jump.
- Leave `autoPlay` on for a section a reader is expected to watch, and off where they are expected to choose; it stops the moment they interact, and never runs under reduced motion.
- Order the items. This is a sequence, and a reader who lands mid-way reads them top to bottom.

## Usage

```vue
<script setup>
import AccordionGallery from '@aziontech/webkit/accordion-gallery'
</script>

<template>
  <AccordionGallery
    :items="[
      {
        title: 'Build',
        points: ['Import a repository', 'Pick a preset'],
        backgroundImage: '/media/build.png'
      },
      {
        title: 'Deploy',
        points: ['One command', 'Every location at once'],
        backgroundImage: '/media/deploy.png'
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `items` | `AccordionGalleryItem[]` | `[]` | false | The steps, in order; each item is `{ title, points, backgroundImage }`. |
| `autoPlay` | `boolean` | `true` | false | Advances to the next step on a timer; stops on interaction and never runs under reduced motion. |
| `autoPlayInterval` | `number` | `5000` | false | Milliseconds each step is held before the gallery advances. |
| `showProgress` | `boolean` | `true` | false | Draws the autoplay progress bar over the active step. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `step-change` | `(event: Event, index: number)` | The active step changed; `index` is the step now shown. Fires on a reader's selection, not on an autoplay tick. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible` on each step
- `data-active` marks the selected step; the others are dimmed and brighten on hover
- `data-autoplay` is present on the root while the timer is running, so a page can tell a moving gallery from a resting one
- The image column shows exactly one image at full opacity; the rest are present and transparent, which is what lets them cross-fade
- Empty: when `items` is empty the gallery renders nothing

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| step selection | `transition-opacity duration-500 ease-out` on the images | inline (matches catalog) | `motion-reduce:transition-none` (swaps instantly) |
| step hover / active change | `transition-opacity duration-150 ease-out` on the step | inline (matches catalog) | `motion-reduce:transition-none` |
| autoplay progress | the composed `progress-bar` advancing | owned by `progress-bar` | autoplay does not start under reduced motion, so the bar never moves |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (step title) | `.text-heading-md` |
| typography (step points) | `.text-body-sm` |
| step title text | `var(--text-default)` |
| active step title text | `var(--primary)` |
| step points text | `var(--text-muted)` |
| step rules and marks | `var(--border-default)` |
| image column surface | `var(--bg-surface)` |
| spacing (columns gap) | `var(--spacing-xl)` |
| spacing (step padding) | `var(--spacing-lg)` |
| spacing (step stack) | `var(--spacing-md)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--color-violet-300` (site progress fill) | `var(--primary)` via the composed `progress-bar` | The site draws the autoplay bar in a violet primitive with no semantic equivalent here; the bar uses the brand accent instead. Revisit if a distinct progress accent is ever tokenized. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: each step is a real `<button>` carrying `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: `Tab` moves between steps and `Enter` / `Space` selects one — the steps are buttons, not clickable containers, so no key handler is bolted onto a `div`.
- ARIA: the steps are a `<ul>` of `<li>`, each holding the button; the active button carries `aria-current="true"`; each image carries its step's `title` as `alt`, and the inactive images are `aria-hidden` so the column announces one picture rather than all of them. The composed `progress-bar` is named for the step it times, since a `role="progressbar"` with no accessible name is an axe `aria-progressbar-name` violation.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the active step title is `var(--primary)` and the points `var(--text-muted)`, both known theme-level shortfalls on the light canvas (see `big-numbers`); the dimmed inactive steps rely on opacity, so their text is below AA by construction until selected — they are decorative previews of a step the reader can bring forward.
- **WCAG 2.2.2 (pause, stop, hide):** autoplay is moving content, so it must be stoppable. It stops permanently on any selection, pauses while the gallery has hover or focus, and does not start at all under `prefers-reduced-motion`.
- Touch target ≥40×40 px — each step button spans its full frame, well past the minimum.

## Stories (Storybook)

- Default
- Static — `autoPlay` off, so the gallery rests on its first step (mutually-exclusive boolean state, and the story a reader can inspect without it moving)

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
