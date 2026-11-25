---
name: progress
category: feedback
structure: monolithic
status: implemented
spec_version: 7
checksum: fc928fe72a48ae2c23c597660b979c5975299ac6a85caab4f75c039e2861d08e
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=479-870
  node_id: 479:870
created: 2026-06-26
last_updated: 2026-11-25
---

# Progress Bar — Component Spec

## Purpose

Use Progress when the work has a measurable amount (value/max), or for a long task with no layout to reserve (indeterminate). A region with a known shape loads with Skeleton, an inline busy mark is a Spinner, and a background file transfer is an UploadProgress.

Communicates the progress of an ongoing task as a horizontal bar. Use it for a
determinate value within a range (`value` / `max`) or, when progress can't be
measured, as an indeterminate loading indicator. Unlike `skeleton` (placeholder
geometry) or `status-indicator` (discrete state), it expresses a continuous
quantity.

## When to use

- A task with measurable progress: an upload, a build, a multi-step import.
- A bar-shaped busy indicator at the top of a region when progress can't be measured (`indeterminate`).

## When NOT to use

- A placeholder for content that is still loading → use `skeleton`.
- A busy state inside a button or another compact control → use `spinner` (or the control's own `loading` prop).
- A discrete state with no quantity, such as Active or Failed → use `status-indicator`.

## Related

- `skeleton` — reserves the layout of loading content instead of showing task progress.
- `spinner` — compact, always-indeterminate busy glyph.
- `status-indicator` — labelled dot for a settled or transitional state.

## Best practices

- Pass `value` on the scale of `max`, for example `:value="3" :max="5"` for steps. Don't convert it to a percentage yourself.
- Switch to `indeterminate` when progress is unknown. `value` is then ignored and `aria-valuenow` is dropped.
- There is no label prop. Give the bar an accessible name with an `aria-label` or `aria-labelledby` attribute, and show the percentage in text next to it if users need the number.
- Set `severity` when the bar reports a status that is good or bad, such as a goal that is on track (`success`), at risk (`warning`) or off track (`danger`), so the fill agrees with the status tag next to it. Without it the fill is the brand orange, which is not a status colour.
- The default is the `medium` bar with `flat` corners. Set `size="small"` for a thin inline strip (table rows, upload rows, the top of a region); use `variant="rounded"` and a larger `size` only when the bar stands alone.

## Usage

```vue
<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <Progress :value="60" />
</template>
```

## Props

| Prop            | Type                                                                             | Default    | Required | JSDoc                                                                                              |
| --------------- | -------------------------------------------------------------------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------- |
| `value`         | `number`                                                                         | `0`        | false    | Current progress, relative to `max`.                                                               |
| `max`           | `number`                                                                         | `100`      | false    | Upper bound; percentage = `value / max * 100`.                                                     |
| `variant`       | `ProgressVariant` (`'rounded' \| 'flat'`)                                        | `'flat'`   | false    | Track and fill corner-radius variant.                                                              |
| `size`          | `'small' \| 'medium' \| 'large'`                                                 | `'medium'` | false    | Bar height token.                                                                                  |
| `indeterminate` | `boolean`                                                                        | `false`    | false    | Loading state; animates a sliding segment and ignores `value`.                                     |
| `severity`      | `ProgressSeverity` (`'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'`) | —          | false    | Status colour of the fill; unset keeps the brand fill. The values are the shared `Severity` scale. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `indeterminate`
- `data-variant` mirrors `variant`: `rounded` | `flat`.
- `data-size` mirrors the `size` prop: `small` | `medium` | `large`
- `data-indeterminate` is present while `indeterminate` is `true`
- `data-severity` mirrors the `severity` prop when it is set (`neutral` | `info` | `success` | `warning` | `danger`), on the root and the fill.

## Motion & Animations

| Trigger                         | Animation / Transition                                                                                                                                            | Token (see `.claude/docs/DESIGN.md` § Animations)                      | Reduced-motion fallback                                                                                                                                |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `value` change (determinate)    | `transition-[width] duration-moderate-02 ease-productive-entrance` (width morph)                                                                                  | duration/curve aliases from `animate.js` (240ms · productive-entrance) | `motion-reduce:transition-none`                                                                                                                        |
| `indeterminate` (loading sweep) | `animate-progress-indeterminate` + `animate-progress-indeterminate-short` (two offset bars sweeping across the track via `inset-inline-start`/`inset-inline-end`) | semantic (2.1s · infinite)                                             | `motion-reduce:animate-none` + `motion-reduce:before:inset-x-1/3` (a still segment over the middle third of the track, so the bar never reads as done) |

## Tokens

| Region          | Token (DESIGN.md)                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| fill            | `var(--primary)`                                                                                                      |
| fill (severity) | `var(--success-mark)`, `var(--warning-mark)`, `var(--danger-mark)`, `var(--info-mark)`; `neutral` `var(--text-muted)` |
| shape (rounded) | `var(--shape-control)`                                                                                                |
| shape (flat)    | `var(--shape-flat)`                                                                                                   |

<!-- Height is a sizing utility, not a DESIGN.md token: small/medium/large → `h-2`/`h-3`/`h-4`
     (8/12/16px from `height.js`), per DESIGN.md § Sizing. The track surface is recorded in Theme gaps. -->

## Theme gaps

| Figma variable             | Temporary primitive     | Follow-up                                                            |
| -------------------------- | ----------------------- | -------------------------------------------------------------------- |
| `--bg-placeholder` (track) | `var(--bg-placeholder)` | `TODO: document --bg-placeholder in .claude/docs/DESIGN.md § Colors` |

## Accessibility (WCAG 2.1 AA)

- Non-interactive: the bar is not focusable and takes no keyboard input.
- Name: the bar takes `aria-label` or `aria-labelledby` from the consumer; with neither it is named by the locale catalog (`progress.label`, "Progress"), so a bare bar never fails `aria-progressbar-name`.
- ARIA: root uses `role="progressbar"`. Determinate sets `aria-valuemin="0"`, `aria-valuemax="<max>"`, `aria-valuenow="<value>"`; indeterminate omits `aria-valuenow` and sets `aria-busy="true"`.
- Contrast ≥3:1 between the fill (`var(--primary)`) and the track (`var(--bg-placeholder)`). The track is an alpha overlay, not an opaque surface, so it keeps that contrast on any background the bar is placed over (canvas, surface, raised, overlay).
- `motion-reduce:transition-none` on the determinate width morph and `motion-reduce:animate-none` on the indeterminate animation (under reduced motion it holds a still segment over the middle third of the track, never a full bar, so an unfinished task never reads as done).

## Examples

Composite stories render every variant of an axis side-by-side in a single frame;
the `Indeterminate` story is the state story for the `indeterminate` boolean.

- Default
- Shapes — composite story rendering `rounded` and `flat` side-by-side (the component's variant axis; stands in for `Types`).
- Sizes — composite story rendering `small`, `medium`, `large` side-by-side.
- Indeterminate — state story for the `indeterminate` prop.
- Simulation — interactive story: a button advances `value` in steps so the reviewer can see the fill's width transition animate on each `value` change. Justified because this motion (the determinate `transition-[width]`) only manifests on a live value change and cannot be shown by a static frame.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
