---
name: status-indicator
category: feedback
structure: monolithic
status: implemented
spec_version: 6
checksum: 03eb9e220f9d81074addd7986f820c5c2c373cde404c812f18ab16c3911a0f50
created: 2026-05-22
last_updated: 2026-11-15
---

# Status Indicator — Component Spec

## Purpose

Use StatusIndicator for the current state of one resource (Active, Failed, Deploying) in a table column or detail header — the default answer for 'status'. A category or outcome word is a Tag, a number is a Badge, a level on the critical → info scale is a SeverityTag, and an HTTP code is a StatusCode.

Shows the settled or transitional state of one resource as a colored dot (or a spinner while `loading`) beside a short label: Active, Failed, Paused, Deploying. It is the status column of tables and lists and the status line of a detail header, so it is static text, not a live region.

## When to use

- The state of a resource in a table cell, a list row or a detail header: Active, Failed, Paused.
- A transitional state such as Deploying or Propagating, with `loading`.

## When NOT to use

- A count or a very short label attached to another element → use `badge`.
- A category or status chip with an optional icon → use `tag`.
- A page or section notice with copy and actions → use `alert`.
- Measurable progress → use `progress`.

## Related

- `badge` — filled count indicator, usually overlaid on an icon or avatar.
- `tag` — labelled chip for categories and statuses.
- `spinner` — replaces the dot while `loading` is true.
- `progress` — continuous progress instead of a discrete state.

## Best practices

- Always pass `label`. The default is the literal `'Status'`, and the color alone does not carry the meaning.
- Map `severity` to meaning and keep it consistent across the app: `success`, `info`, `warning` and `danger` follow their tokens and `neutral` is muted.
- With `loading`, pass the bare verb (`"Deploying"`). The component appends the ellipsis character (`…`, not three periods) and swaps the dot for a spinner. A label that already ends in `…` or `...` (copy pasted from a design: `"Building..."`) is trimmed first, so it renders `Building…`, never `Building......`.
- It is a non-interactive element with no role, no click and no keyboard behavior. Don't attach handlers to it. When a status change must be announced (a single deploy you are watching), announce it through a toast or a live region the page owns, not by making every indicator live.

## Usage

```vue
<script setup>
  import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <StatusIndicator
    severity="success"
    label="Status"
  />
</template>
```

## Props

| Prop       | Type                                                                     | Default     | Required | JSDoc                                                                                                                                                                             |
| ---------- | ------------------------------------------------------------------------ | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `severity` | `Severity` (`'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'`) | `'success'` | false    | Severity token driving the status dot color. `Severity` is the shared status scale, exported from this component (and from `badge` and `tag`).                                    |
| `loading`  | `boolean`                                                                | `false`     | false    | Transitional state: a spinner replaces the dot and the label gains a trailing ellipsis (`…`), so pass the bare verb; a trailing `…` or `...` already in the label is not doubled. |
| `label`    | `string`                                                                 | `''`        | false    | Visible label text. Empty uses the locale catalog (`Status`).                                                                                                                     |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`

## Motion & Animations

_none_

## Tokens

| Region     | Token (DESIGN.md)      |
| ---------- | ---------------------- |
| typography | .text-body-sm          |
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
- ARIA: no role on the root. It is plain text (the dot is `aria-hidden`; the label carries the meaning), because a table of 1k rows would otherwise hold 1k live regions and announce every change. `aria-busy="true"` while `loading`. Tests: `src/test/live-regions.test.ts`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Forced colors: the dot opts out of forced colour adjustment and paints `CanvasText`, so it stays visible when backgrounds are forced to `Canvas`; the severity is still carried by the label text, never by the dot's colour alone. Tests: `src/test/forced-colors.test.ts`.

## Examples

- Default
- Status
- Loading

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
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
