---
name: process-scroll
category: sections
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: f64e9bd583e3548176dc854e5592c62b37aedcbc42e7ae6e59c5c3edc51ab03b
created: 2026-11-11
last_updated: 2026-11-12
---

# ProcessScroll — Component Spec

## Purpose

The stages of a process as a row of numbered dark cards on a pixel texture, under a section title. On narrow screens the row scrolls sideways with snap; from the large breakpoint up the cards share the width, or, with `pinned`, keep a 26rem card width while the band pins under the site header and the page scroll slides the row sideways until its last card is in view (azion.com's careers hiring process). From the design sample's site `ProcessScroll`.

## When to use

- How something works in three to five ordered stages (build, deploy, observe).

## When NOT to use

- For more than five stages or stages with art — use `FeatureScroll`.
- For five to eight short points with no section-title layout — use `StickyCarousel`; for ordered stages that pin while the page scrolls, set `pinned` here.

## Related

- `StickyCarousel` — the same cards, always pinned, under a plain section title.
- `TextureMaterial`, `FrameBox`, `SectionTitle`.

## Best practices

- Name each stage with a verb.
- Keep descriptions to two lines.
- Set `pinned` when the stages run wider than the page column (five tall cards, as the careers hiring process): the band stays on screen while the page scroll walks the row. Do not nest a pinned band in a container that clips overflow; sticky positioning needs the page scroll.

## Usage

```vue
<script setup>
  import ProcessScroll from '@aziontech/webkit/process-scroll'
</script>

<template>
  <ProcessScroll
    title="From commit to production"
    :steps="[
      { title: 'Push', description: 'Every push builds a new version.' },
      { title: 'Deploy', description: 'The version goes live everywhere at once.' },
      { title: 'Observe', description: 'Metrics and logs arrive in seconds.' }
    ]"
  />
</template>
```

## Props

| Prop               | Type                           | Default        | Required | JSDoc                                                                                  |
| ------------------ | ------------------------------ | -------------- | -------- | -------------------------------------------------------------------------------------- |
| `anchor`           | `string`                       | `''`           | false    | In-page id set on the band so a hash link can target it.                               |
| `eyebrow`          | `string`                       | `''`           | false    | Overline above the title.                                                              |
| `titleKind`        | `SectionTitleKind`             | `'horizontal'` | false    | Alignment of the section title over the card row.                                      |
| `title`            | `string`                       | `''`           | false    | Headline of the band, rendered as its `h2`; the band renders nothing when empty.       |
| `description`      | `string`                       | `''`           | false    | Paragraph beside the headline.                                                         |
| `descriptionWidth` | `SectionTitleDescriptionWidth` | `'narrow'`     | false    | Column span of the paragraph: `wide` runs it across the middle column too.             |
| `steps`            | `ProcessScrollStep[]`          | `[]`           | false    | The stages, in order; each is `{ title, description }` and gets its own numbered card. |
| `ariaLabel`        | `string`                       | `''`           | false    | Accessible name of the scrollable card row; defaults to the title.                     |
| `pinned`           | `boolean`                      | `false`        | false    | From the large breakpoint, pins the band under the site header while the page scrolls and slides the card row sideways until its last card is in view; below it, or under reduced motion, the row scrolls sideways on its own. |
| `headerOffset`     | `string`                       | `'var(--layout-header-height)'` | false | Height of the sticky site header a pinned band sticks under; defaults to the SiteNav bar's token, any CSS length. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Renders nothing without a title or steps.
- Cards are `data-theme="dark"` in both themes (the sample's design).
- `data-pinned` on the root mirrors `pinned`. From `lg` with motion allowed, the band is `sticky` under `headerOffset` and one screen tall, the root (the runway) grows by the row's overflow, and the row's `translate` follows the page scroll (mirrored in right-to-left); below `lg` or under `prefers-reduced-motion` the band does not pin and the row scrolls inside itself. The runway is measured on mount and on scroll/resize, so the server HTML is the unpinned band.

## Motion & Animations

None of its own; `TextureMaterial` animates its pixel field and stops under reduced motion.

## Tokens

| Region  | Token (DESIGN.md)                             |
| ------- | --------------------------------------------- |
| card    | `var(--bg-surface)` under `data-theme="dark"` |
| number  | `.text-big-number-lg`                         |
| heading | `.text-heading-sm`, `var(--text-default)`     |
| copy    | `.text-body-md`, `var(--text-muted)`          |
| focus   | `var(--ring-color)`                           |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The band root is a plain container; the scroll row is the one focusable `region`, named by `ariaLabel` or the title, so keyboard users can scroll it with the arrow keys and the page has one landmark per band.
- Stages are an ordered list; the big number is `aria-hidden` because the list already orders them.
- Each stage heading is an `h3`.

## Internationalization

- Built-in strings: none. Every visible string is marketing copy and arrives through props, so the page supplies it in its own language.

## Right-to-left

- Layout: logical utilities only (`ps-*`, `border-e`, `ms-*`).
- Icons: none mirrored.
- Keyboard: unchanged.

## Responsive

- Below large: cards are `min(22rem, 80vw)` wide and snap; the row scrolls inside itself, never the page.
- From large: cards share the width; with `pinned`, cards keep a 26rem width and the pinned band slides them sideways.

## Performance

- Bundle budget: 6.4 KB for `./process-scroll` gzip in `.size-limit.json` (measured 5.91 KB with the `pinned` runway logic + ~0.5 KB).

## Examples

- Default — four stages.
- Pinned — the careers hiring process: five stages, centered title, the band pinned while the row slides sideways.

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
