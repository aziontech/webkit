---
name: feature-tabs
category: section
structure: monolithic
status: implemented
spec_version: 5
created: 2026-11-05
last_updated: 2026-11-15
checksum: dd03bd7b92af6ceaefb58951dbdf1fef13e4e74117cd849c5c78b54cfec29112
---

# FeatureTabs — Component Spec

## Purpose

The feature walkthrough band of a product page: a horizontal section title, with its button beside the headline, over up to three tabs on one side and the active tab's media on the other. A tab's media is its own code file (a `code-block` with line numbers whose lines rise in while the tab is open, on a pixelate texture in a taller stage), the band's live scene (handed the open tab's `value`), or the tab's illustration. It is a page section — the site places it from a `{ _id: 'feature-tabs', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `registration-frame`, `media-tabs`, `code-block`, `illustration`, `button`, `link` and the webkit scene assets. The tabs advance on a timer that pauses under the pointer or keyboard focus and never runs under reduced motion; that state is owned by `media-tabs`.

## When to use

- Use FeatureTabs for up to three tabs beside a media on a product page.
- To walk through the two or three features behind one claim, one picture at a time, like Functions' Observability.

## When NOT to use

- For architectures drawn as diagrams across the full width → use `architecture-tabs`.
- For a scroll-driven walkthrough of more features → use `feature-scroll`.

## Related

- `media-tabs` — the timed tabs this section renders through.
- `illustration` — the picture a tab shows when it has no code and the band has no scene.
- `code-block` — the code file a tab opens as its media.

## Best practices

- Keep to three tabs; tabs past the limit are not rendered.
- Give every tab an `illustrationLabel` saying what its picture shows.
- Use tab `code` when the feature is an API a developer reads; keep each file short enough to read in the stage. Set `copyAriaLabel` to say what the copy button copies.
- Use the band `scene` when one console widget plays a different beat per tab (`{ component: 'ConsoleMockup', props: { name: 'functions-start' } }` with tab `value`s naming its tabs); give every tab a `value` then.

## Usage

```vue
<script setup>
  import FeatureTabs from '@aziontech/webkit/feature-tabs'
</script>

<template>
  <FeatureTabs
    eyebrow="Observability"
    title="Inspect every run end-to-end"
    :tabs="[
      {
        title: 'Trace',
        description: 'The run as a waterfall.',
        illustration: 'live-debugging',
        illustrationLabel: 'A trace waterfall'
      },
      {
        title: 'Logs',
        description: 'Structured output on the same clock.',
        illustration: 'traffic-and-cost-bar-chart',
        illustrationLabel: 'Structured logs'
      }
    ]"
    :primary-action="{ label: 'Open an invocation', href: '/docs', trailing: true }"
  />
</template>
```

## Props

| Prop               | Type                 | Default     | Required | JSDoc                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | -------------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `anchor`           | `string`             | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                                                                                                                                                                                                                                                                                                                                                 |
| `eyebrow`          | `string`             | `''`        | false    | Eyebrow above the section title.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `title`            | `string`             | `''`        | false    | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty.                                                                                                                                                                                                                                                                                                                             |
| `description`      | `string`             | `''`        | false    | Supporting sentence under the headline.                                                                                                                                                                                                                                                                                                                                                                                                        |
| `tabs`             | `FeatureTabsTab[]`   | `[]`        | false    | The features, in order, at most three; each is `{ title, description, value?, code?, illustration?, illustrationLabel? }` where `value` is the stable key handed to the band scene as its `tab`, `code` is the `{ label, value, code, language?, fileName?, fileIcon? }` file the tab opens as its media, `illustration` is a registry name drawn when the tab has no code and the band no scene, and `illustrationLabel` its accessible name. |
| `scene`            | `FeatureTabsScene`   | `undefined` | false    | Live scene drawn as the media of every tab without code, `{ component, props? }` naming a webkit scene asset; it receives the tab's `value` as `tab` and whether the tab is open as `active`. Wins over the illustrations.                                                                                                                                                                                                                     |
| `autoplay`         | `boolean`            | `true`      | false    | Opens the next tab on a timer, with the composed tabs' visible pause control.                                                                                                                                                                                                                                                                                                                                                                  |
| `autoplayInterval` | `number`             | `5200`      | false    | Milliseconds each tab holds before the next one opens.                                                                                                                                                                                                                                                                                                                                                                                         |
| `copyAriaLabel`    | `string`             | `''`        | false    | Accessible name of the copy button on each tab's code file; empty keeps the code block's own.                                                                                                                                                                                                                                                                                                                                                  |
| `primaryAction`    | `SectionTitleAction` | `undefined` | false    | Button in the section title, beside the headline (under the frame when the band has no title); `{ label, href, trailing?, target? }` where `trailing` adds the chevron. Omitted when absent.                                                                                                                                                                                                                                                   |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`; the active tab, its progress and the timer are owned by `media-tabs`
- Empty: when `tabs` is empty the band renders nothing — not the header, not the frame
- The header renders only when `title` is set; the action renders only when `primaryAction` is set — as a secondary `button` in the header, or as a `link` under the frame when there is no header
- Media per tab: its `code` wins, then the band `scene`, then its `illustration`; when any tab carries `code` the stage grows from 24rem to 30rem and draws the pixelate texture, and an open tab's code lines rise in (owned by `code-block`, never under reduced motion). A scene name that is not registered draws nothing.

## Motion & Animations

_none_

## Tokens

| Region                | Token (DESIGN.md)       |
| --------------------- | ----------------------- |
| link inset            | `var(--spacing-xl)`     |
| code inset            | `var(--spacing-xl)`     |
| code shape            | `var(--shape-control)`  |
| code shadow           | `var(--shadow-sm)`      |
| anchor scroll offset  | `var(--spacing-2xl)`    |
| frame rules and marks | `var(--border-default)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `media-tabs` (the tabs), `code-block` (the copy button), `button` and `link`.
- Keyboard map: `Tab` reaches the action, the tabs and the open file's copy button; the tabs' keys are owned by `media-tabs`.
- ARIA: the band is a `<section>` named by its title (`aria-label`) when one is set; the headline is the section title's `h2`; each illustration is named by its tab's `illustrationLabel`, or decorative when empty; a code file is real text a screen reader reads, with a named copy button.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`, `media-tabs`, `code-block`, `button` and `link`.
- `motion-reduce:transition-none motion-reduce:transform-none` — the band adds no motion; the timer never runs under reduced motion (owned by `media-tabs`).
- Touch target ≥40×40 px: the tab rows and the large header button; the under-frame link is supplementary to them.

## Examples

- Default
- Code — each tab opens a code file; the stage grows and draws the pixelate texture.
- Live scene — one `ConsoleMockup` plays a different tab per feature through the band `scene` and the tab `value`s.

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
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
