---
name: photo-marquee
category: sections
structure: monolithic
status: implemented
spec_version: 4
created: 2026-11-04
last_updated: 2026-11-15
checksum: 5d495eedb854f751be9ac93a8191631856ce6e8bff2171772393fe802632d4e9
template: 2
---

# PhotoMarquee — Component Spec

## Purpose

The office band of the careers page: a horizontal section title over a framed strip of photographs of varied aspect ratios that scrolls continuously and pauses on hover, on focus or from its pause control; the loop is the one `ticker` runs on. It is a page section — the site places it from a `{ _id: 'photo-marquee', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title` and `frame-box`.

## When to use

- Use PhotoMarquee for a decorative moving strip of photos.
- To show a place or a team in pictures without a grid.

## When NOT to use

- For quotes → use `recognition-marquee`.

## Related

- `recognition-marquee` — the sibling strip of quotes with the same loop.

## Best practices

- Give every photo its `width` and `height` so the strip reserves each slot before the picture loads.
- Leave `duration` at `0` to let the strip pace itself (ten seconds per photo).

## Usage

```vue
<script setup>
  import PhotoMarquee from '@aziontech/webkit/photo-marquee'
</script>

<template>
  <PhotoMarquee
    title="Work at Azion"
    description="You manage your own routine and answer for outcomes."
    description-width="wide"
    aria-label="Azion offices"
    :photos="[
      { src: '/careers/office-desks.jpg', alt: 'An open-plan office', width: 1066, height: 1600 },
      { src: '/careers/office-lounge.jpg', alt: 'A lounge corridor', width: 1600, height: 1066 }
    ]"
  />
</template>
```

## Props

| Prop               | Type                           | Default    | Required | JSDoc                                                                                                              |
| ------------------ | ------------------------------ | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `title`            | `string`                       | `''`       | false    | Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. |
| `description`      | `string`                       | `''`       | false    | Paragraph beside the headline.                                                                                     |
| `descriptionWidth` | `PhotoMarqueeDescriptionWidth` | `'narrow'` | false    | Width the description is capped at: `narrow` or `wide`.                                                            |
| `ariaLabel`        | `string`                       | `''`       | false    | Accessible name of the scrolling region.                                                                           |
| `duration`         | `number`                       | `0`        | false    | Seconds one loop of the strip takes; `0` paces it at ten seconds per photo.                                        |
| `photos`           | `PhotoMarqueePhoto[]`          | `[]`       | false    | The photographs, in order; each is `{ src, alt, width, height }`.                                                  |
| `anchor`           | `string`                       | `''`       | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                     |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, paused while the strip is hovered or holds focus, or while its pause control is pressed (the track carries `data-paused`)
- Empty: when `photos` is empty the band renders nothing
- The list is rendered twice for a seamless loop; the duplicate is `aria-hidden`, its photos carry an empty `alt`, and it is hidden under reduced motion, where the region scrolls by hand instead

## Motion & Animations

| Trigger                        | Animation / Transition                                         | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                                            |
| ------------------------------ | -------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------ |
| continuous scroll of the strip | the brand marquee of the internal loop it shares with `ticker` | semantic (brand-marquee)                          | reduced motion stops it (the region becomes a horizontal scroller) |

## Tokens

| Region                | Token (DESIGN.md)       |
| --------------------- | ----------------------- |
| photo gap             | `var(--spacing-md)`     |
| focus ring            | `var(--ring-color)`     |
| frame rules and marks | `var(--border-default)` |
| anchor scroll offset  | `var(--spacing-xxl)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the scrolling region is focusable and carries `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset`.
- Keyboard map: `Tab` reaches the region, which pauses the loop, then the pause control (`Enter` / `Space` toggles it, WCAG 2.2.2); under reduced motion the control is hidden and arrow keys scroll the region.
- ARIA: the band is a `<section>` named by its title (`aria-label`); the strip is a `region` named by `ariaLabel`; every photo carries its `alt` once — the duplicate copy is `aria-hidden` with empty `alt`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): owned by `section-title`.
- `motion-reduce:animate-none` on the strip; the duplicate list is hidden so nothing moves and nothing repeats.
- Touch target ≥40×40 px — not applicable beyond the focusable region.

## Internationalization

No built-in strings: every visible and announced text is a prop from the page JSON.

- Formatting: none.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Motion: under `dir="rtl"` the marquee track starts offset (`rtl:translate-x-1/2`) and the animation runs reversed, so photos flow in reading order; `motion-reduce` stops it in both.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Responsive

- Container queries: none: the strip is a fixed-height row that loops horizontally.
- Narrow (below `sm`): photos are 20rem tall instead of 28rem.
- Touch: the strip is one focusable region; hover pauses the loop on a pointer device and focus pauses it on any device.
- Reflow: the strip clips inside its frame, so the page never scrolls horizontally at 320 px and 200 % zoom.

## Performance

- Bundle budget: 7.25 KB gzip, the `.size-limit.json` entry `photo-marquee` (the shared marquee loop with its pause control and its locale strings).
- Runtime budget: one CSS animation on the compositor; no script runs per frame.
- Heavy parts: none; images decode asynchronously.

## Examples

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
