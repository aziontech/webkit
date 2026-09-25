---
name: embed
category: marketing
structure: monolithic
status: implemented
spec_version: 2
checksum: e467147d32097e315ea2f8c5911369861fd77f2196b862fb6124cec108e8743f
created: 2026-09-22
last_updated: 2026-09-25
---

# Embed — Component Spec

## Purpose

A responsive `iframe` for third-party content — a demo, a player, a status page, a form — that keeps its aspect ratio at every width and always carries the accessible name an `iframe` needs. It is the one place external content enters a page, so the attributes that are easy to forget are not optional.

## When to use

- To embed a video player, live demo, status page or third-party form in a marketing page.
- Whenever content comes from another origin and must sit inside the page's own frame.
- When the embedded thing has a natural aspect ratio the page should preserve while it scales.

## When NOT to use

- For a screenshot or a clip hosted by us inside documentation → use `doc-frame`, which frames stills and clips and opens them full screen.
- For an image → use a plain `img` inside `frame-box`; an `iframe` for a picture costs a document load.
- For content we own and could render directly — an embed is a last resort, not a layout tool.

## Related

- `doc-frame` — the documentation frame for stills and clips, not third-party documents.
- `frame-box` — the frame drawn around the embedded document by whatever assembles the page; the embed draws none of its own.
- `media-split` — when the embed is one half of a copy-and-media band.

## Best practices

- The band draws no frame of its own: the rule and the corner marks belong to the `section-module` or `frame-box` that the page assembles it into, so a band placed in a framed column never lands a second hairline on the column's own.

- Always write a `title` that says what the embedded thing is. It is the frame's accessible name, and a screen-reader user meets it before the content.
- Pick the `ratio` that matches the source. A `video` ratio around a square form leaves bands of empty frame.
- Prefer `loading="lazy"` behaviour for anything below the fold — it is the default here, and an embed is usually the heaviest thing on a marketing page.
- Do not embed something essential. A blocked or failed third-party frame leaves a hole the page cannot fill.

## Usage

```vue
<script setup>
import Embed from '@aziontech/webkit/embed'
</script>

<template>
  <Embed
    src="https://demo.azion.com/edge-function"
    title="An interactive demo of an edge function responding to a request"
    ratio="video"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `src` | `string` | `—` | true | URL of the document to embed. |
| `title` | `string` | `—` | true | Accessible name for the embedded document, announced before its content. |
| `ratio` | `'video' \| 'square' \| 'wide'` | `'video'` | false | Aspect ratio the frame holds while it scales. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`
- `data-ratio` mirrors the `ratio` prop and drives the frame's aspect ratio
- The frame reserves its aspect ratio before the document loads, so the page does not shift when it arrives

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| frame rules and marks | `var(--border-default)` |
| frame surface | `var(--bg-surface)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the embedded document manages focus inside itself; the frame adds no focusable element of its own.
- Keyboard map: `Tab` moves into the embedded document, which owns its own keyboard model. The frame intercepts nothing.
- ARIA: `title` is required and renders as the `iframe`'s `title` attribute — an `iframe` without one is announced as an unnamed frame, which is why the prop is not optional here.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the embedded document carries its own contrast; the frame contributes only its border.
- `motion-reduce:transition-none motion-reduce:transform-none` — not applicable, the frame is static.
- Touch target ≥40×40 px — not applicable; any control belongs to the embedded document.

## Stories (Storybook)

- Default
- Ratios — composite story rendering every `ratio` value one under the other

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
