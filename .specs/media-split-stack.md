---
name: media-split-stack
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: e49f812c82de151c56ce12411d5df21f73298ece9e87c29ff7b2d12e0c49271d
---
# MediaSplitStack — Component Spec

## Purpose

A run of large media-split bands that pile up under the site header as the page scrolls, each a centered claim with an outlined "learn more" button beside its picture, the whole band linking through. An optional large centered section title opens the run. It is a page section — the site places it from a `{ _id: 'media-split-stack', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `band-stack`, `media-split`, `illustration` and `button`. `kind` picks the layout only: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band; the bands keep the same shape in both.

## When to use

- To list the solution areas or the claims of a page, one large band each, with a link through to its own page.

## When NOT to use

- For a single claim beside its media → use `media-split` directly.
- For small reasons in a grid → use `feature-tiles`.

## Related

- `band-stack` — the sticky run the bands pile up in.
- `media-split` — the band each entry renders through.

## Best practices

- Give a band either `image` (a URL, with `imageAlt` when it says something) or `illustration` (a registry name, with `illustrationLabel`), not both; a band with neither renders without its media cell.
- Give every band an `action`; it is both the button and the link the whole band follows.

## Usage

```vue
<script setup>
import MediaSplitStack from '@aziontech/webkit/sections/media-split-stack'
</script>

<template>
  <MediaSplitStack
    kind="alternating"
    eyebrow="Managed Infrastructure"
    title="Stop managing regions and capacity by hand"
    :bands="[
      {
        title: 'Run closer to users',
        description: 'Handle requests close to users.',
        illustration: 'fastest-path-to-live-website',
        illustrationLabel: 'Requests served from the nearest data center',
        action: { label: 'Learn more', href: '/products/application-accelerator' }
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `kind` | `MediaSplitStackKind` | `'media-end'` | false | Layout of the run: `media-end` sets every picture at the closing end, `alternating` starts it at the opening end and swaps sides band by band. |
| `eyebrow` | `string` | `''` | false | Overline above the section title. |
| `title` | `string` | `''` | false | Headline of the run, rendered by the large centered section title as its `h2`; the run renders no header when empty. |
| `bands` | `MediaSplitStackBand[]` | `[]` | false | The bands, in order; each is `{ title, description, image?, imageAlt?, illustration?, illustrationLabel?, action? }` where `image` is a picture URL, `illustration` a registry name, and `action` `{ label, href }` the outlined button and the link the whole band follows. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; hovering a linked band reveals its link affordance (owned by `media-split`)
- `data-kind` mirrors the `kind` prop
- Empty: when `bands` is empty the run renders nothing — not the header, not the stack
- The header renders only when `title` is set; a band renders its button and its link only when it has an `action`, and its media cell only when it has a picture

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| band rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `button` and `media-split`'s media link.
- Keyboard map: `Tab` reaches each band's media link and button; `Enter` follows them.
- ARIA: the run is a `<section>` named by its title (`aria-label`) when one is set; each band is `media-split`'s own section named by the band's title, with its headline as an `h2`; illustrations are named by `illustrationLabel` and images by `imageAlt`, or decorative when empty.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-split` and `button`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the run adds no motion.
- Touch target ≥40×40 px: the medium buttons and the band links.

## Stories (Storybook)

- Default
- Types — composite story rendering both `kind` values stacked.

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
