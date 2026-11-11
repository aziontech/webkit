---
name: process-scroll
category: sections
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 58276c18c6192a5ac676405328ceac7b61362cc1ec281114eb9f4add1798de4c
created: 2026-11-11
last_updated: 2026-11-11
---

# ProcessScroll — Component Spec

## Purpose

The stages of a process as a row of numbered dark cards on a pixel texture, under a section title. On narrow screens the row scrolls sideways with snap; from the large breakpoint up the cards share the width. From the design sample's site `ProcessScroll`.

## When to use

- How something works in three to five ordered stages (build, deploy, observe).

## When NOT to use

- For more than five stages or stages with art — use `FeatureScroll`.
- For a row that pins while the page scrolls — use `StickyCarousel`.

## Related

- `StickyCarousel` — the same cards, pinned while the row travels.
- `TextureMaterial`, `FrameBox`, `SectionTitle`.

## Best practices

- Name each stage with a verb.
- Keep descriptions to two lines.

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

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Renders nothing without a title or steps.
- Cards are `data-theme="dark"` in both themes (the sample's design).

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
- From large: cards share the width.

## Performance

- Bundle budget: 5.5 KB for `./process-scroll` gzip in `.size-limit.json` (measured + ~0.5 KB).

## Examples

- Default — four stages.

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
