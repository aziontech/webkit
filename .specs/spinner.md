---
name: spinner
category: utils
structure: monolithic
status: implemented
spec_version: 5
checksum: 0c4f6c1f44ccd0707b0dc4275190b6c6578e8b698ce547924da9098af60f0149
style_seam: true
created: 2026-05-22
last_updated: 2026-11-15
---

# Spinner — Component Spec

## Purpose

Use Spinner only for an inline busy mark in a row, log line or custom control that has no loading prop; buttons use their own `loading`, a loading region with a known shape uses Skeleton, and measurable work uses Progress.

A small rotating mark that says work is in progress, for a row, a log line or a custom control that has no loading state of its own. It is decorative by default; with an `aria-label` it becomes a `status` region that announces the work, and it stops rotating under reduced motion.

## When to use

- An inline busy mark inside a row, log line or custom control that has no loading state of its own.
- A small in-progress indicator next to text in a toast or status row.

## When NOT to use

- A button waiting on its action → set `loading` on `button`, `icon-button` or `highlight-button`.
- Content that is still loading → use `skeleton`.
- Progress you can measure → use `progress`.
- A status with a color and a label → use `status-indicator`.

## Related

- `skeleton` — reserves the shape of content while it loads.
- `progress` — determinate progress.
- `button` — renders a Spinner itself when `loading` is set.

## Best practices

- Its one prop is `ariaLabel`: size it with a `size-*` class (`size-3`, `size-4`) and color it through the inherited text color (it strokes `currentColor`).
- `class` on its tag is its sizing API, not a restyle: the spec is a `style_seam`, so `webkit/no-style-override` accepts `<Spinner class="size-4" />`. Keep the class to a `size-*` and, when it must differ from the surrounding text, a text color token.
- Without `ariaLabel` it is `aria-hidden`: announce the busy state on the surrounding element (`aria-busy`, a live region or visible text). A standalone Spinner that is the only sign of the wait sets `ariaLabel` (`aria-label="Loading"`); it then renders `role="status"` with that name, so the wait is announced. Do not set it inside a control that already announces its own busy state (a `loading` button).
- The spin stops under reduced motion, so pair it with text when the wait matters.

## Usage

```vue
<script setup>
  import Spinner from '@aziontech/webkit/spinner'
</script>

<template>
  <Spinner class="size-4" />
  <!-- standalone: the only sign of the wait, so it announces itself -->
  <Spinner
    class="size-4"
    aria-label="Loading"
  />
</template>
```

## Props

| Prop        | Type     | Default | Required | JSDoc                                                                                                                                          |
| ----------- | -------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel` | `string` | `''`    | false    | Accessible name; when set the spinner renders role status with this name, otherwise it stays aria-hidden. Size and color come through `class`. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Motion & Animations

| Trigger                | Animation / Transition | Token         | Reduced-motion fallback      |
| ---------------------- | ---------------------- | ------------- | ---------------------------- |
| always (while mounted) | `animate-spin`         | Tailwind core | `motion-reduce:animate-none` |

## Tokens

| Region     | Token (DESIGN.md)      |
| ---------- | ---------------------- |
| typography | .text-body-sm          |
| surface    | `var(--bg-surface)`    |
| text       | `var(--text-default)`  |
| spacing    | `var(--spacing-3)`     |
| shape      | `var(--shape-control)` |
| ring       | `var(--ring-color)`    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: `aria-hidden="true"` by default (decorative, the surrounding element announces the wait); with `ariaLabel` set, `role="status"` and `aria-label` instead. Not focusable.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

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
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
