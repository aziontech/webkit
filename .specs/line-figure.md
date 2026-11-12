---
name: line-figure
category: content
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 2786f572ddd3195718906c9050d9342c42c34e7298ae5406ffc265d80ef6cfa6
created: 2026-11-11
last_updated: 2026-11-12
---

# LineFigure — Component Spec

## Purpose

An isometric line-art figure that answers the pointer: one per product (cache TTL, load balancer, DNS lookup, firewall, a 404 page and 20 more), drawn by a small engine into one SVG with the illustration tokens, so it follows the theme. Each figure loads on demand. The pointer, or focus with arrow keys, moves the figure through its answer; `play` walks it through on its own until a person arrives; under reduced motion it holds a still frame. From the design sample's `shared/ui/line-figure` (engine MIT, kept with its `LICENSE`). The figures are marketing assets, listed in the marketing inventory.

## When to use

- The art beside a product's copy on a landing or a docs home.
- An empty state or a not-found page (`azion-404`).

## When NOT to use

- For static, non-interactive art — use `Illustration`.
- For data — use the charts.
- Inside dense application screens.

## Related

- `Illustration` — static art from the registry.
- `ProductWidget`, `ShellMockup` — product scenes.
- `EmptyState` — can carry a figure in its art slot.

## Best practices

- One figure per view; two figures answering the pointer compete.
- Pass `aria-label` when the page says something more specific than the figure's own description.
- Use `play` only where nothing else moves.
- Take the name from `llms/foundations/line-figures.md` or `list_assets({ kind: "lineFigures" })`; an unknown name draws nothing.
- In a container that sizes to its content (the `EmptyState` `icon` slot, a centred flex column) the figure takes its natural 400×320 size, capped by the space available. Put it in a sized wrapper (`<div class="w-60 max-w-full">`) when the art should be smaller.

## Usage

```vue
<script setup>
  import LineFigure from '@aziontech/webkit/line-figure'
</script>

<template>
  <LineFigure name="cache-ttl" />
</template>
```

## Props

| Prop        | Type               | Default | Required | JSDoc                                                                                                                |
| ----------- | ------------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `name`      | `LineFigureName \| ''` | `''`    | false    | Registered figure to draw; an unknown or empty name draws nothing. |
| `intensity` | `number`           | `0.5`   | false    | How strongly the figure answers the pointer, from 0 (subtle) to 1 (strong).                                          |
| `play`      | `boolean`          | `false` | false    | Walks the figure through its answer on its own until a pointer or focus arrives; a still frame under reduced motion. |
| `ariaLabel` | `string`           | `''`    | false    | Accessible name; falls back to the figure's own English description.                                                 |

## Events

| Event  | Payload           | Notes                                                                           |
| ------ | ----------------- | ------------------------------------------------------------------------------- |
| `read` | `caption: string` | The figure's current reading each time it changes (the first reading on mount). |

## Slots

| _none_ | — | — |

## States

- `data-name` mirrors `name`; `data-play` is present while `play` is on.
- Empty: no role and an empty SVG for an unknown name.

## Motion & Animations

Springs and tweens in the engine (no CSS keyframes); stroke colour transitions use `duration-moderate-02 ease-productive-entrance` with `motion-reduce:transition-none`. Under `prefers-reduced-motion: reduce` springs settle at once and the tour stops on a still frame.

## Tokens

| Region | Token (DESIGN.md)                                                                              |
| ------ | ---------------------------------------------------------------------------------------------- |
| plate  | `var(--line-figure-plate, var(--illustration-ground))`                                         |
| line   | `var(--illustration-highlight)`, `var(--illustration-line)`, `var(--illustration-line-strong)` |
| accent | `var(--illustration-primary)`                                                                  |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- `role="img"` named by `ariaLabel` or the figure description; the SVG is `aria-hidden`.
- The figure is not a control: it never takes focus on its own, and the page stays operable without it.
- Readings go out through `read`; a page that shows them should put them in a polite live region (see the Play example).

## Internationalization

- Built-in strings: the 25 figure descriptions are English asset metadata (like an illustration's name), used only when `ariaLabel` is empty. A localized page passes `aria-label`.

## Right-to-left

- Layout: the figure is a picture and is not mirrored (isometric art has no reading direction).
- Keyboard: unchanged.

## Responsive

- Fills its width at a 5:4 aspect; strokes stay 1px at every size (`vector-effect: non-scaling-stroke`).
- The SVG is in flow with a natural 400×320 size, so a parent that sizes to its content (a flex column with centred items, the `EmptyState` `icon` slot) gets a 400 px wide figure, never a 0 px one; a narrower container shrinks it, and a sized wrapper sets another size.

## Performance

- Bundle budget: 3 KB gzip for `./line-figure` in `.size-limit.json` (entry chunk only; each figure is its own async chunk of 3–5 KB).
- Runtime: one `requestAnimationFrame` loop while the figure is moving, idle at rest.

## Examples

- Default — `cache-ttl` at rest.
- Play — `lb-rotor` touring with its reading in a live region.
- Gallery — all 25 figures.
- In an empty state — `azion-404` in the `EmptyState` `icon` slot inside a sized wrapper, the sizing contract of a content-sized parent.

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
