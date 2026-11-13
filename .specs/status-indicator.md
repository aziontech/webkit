---
name: status-indicator
category: feedback
structure: monolithic
status: implemented
spec_version: 2
checksum: c13cdfbed86ed930c41d4f3fef3865368b9ef3f35fa47f809bcc78941393fb0d
created: 2026-05-22
last_updated: 2026-11-10
---
# Status Indicator — Component Spec

## Purpose

Shows the status of a resource as a small colored dot next to a short label: a deployment that is ready, building, or failed, or a service that is online or degraded. While the status is still in progress, the dot itself pulses. It is a read-only indicator, not a control.

## Usage

```vue
<script setup>
import StatusIndicator from '@aziontech/webkit/status-indicator'
</script>

<template>
  <StatusIndicator severity="success" label="Ready" />
  <StatusIndicator severity="warning" label="Building" loading />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `severity` | `'success' \| 'info' \| 'neutral' \| 'warning' \| 'alt' \| 'danger'` | `'success'` | false | Severity token driving the status dot color. |
| `loading` | `boolean` | `false` | false | Pulses the dot while the status is still in progress. |
| `label` | `string` | `'Status'` | false | Visible label text naming the status, in sentence case. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `loading`
- `data-severity` mirrors the `severity` prop on the root and the dot.
- `data-loading` mirrors the `loading` prop; the dot pulses and the root sets `aria-busy="true"`.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| `loading` (status in progress) | `animate-pulse` on the dot | primitive (2s · cubic-bezier, infinite) | `motion-reduce:animate-none` (static dot) |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | .text-label-md |
| text | `var(--text-default)` |
| gap (dot to label) | `var(--spacing-xs)` |
| dot fill · success | `var(--success-contrast)` |
| dot fill · info | `var(--info-contrast)` |
| dot fill · neutral | `var(--text-muted)` |
| dot fill · warning | `var(--warning-contrast)` |
| dot fill · alt | `var(--primary)` |
| dot fill · danger | `var(--danger-contrast)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Non-interactive: not focusable, no keyboard map, no focus ring.
- Root is `role="status"`, so a change of label is announced politely; `aria-busy="true"` while `loading`.
- The dot is `aria-hidden="true"`; the visible label carries the meaning, so color is never the only cue.
- Label text names the state on its own (`Ready`, `Building`, `Error`); do not prefix it with `Status:`.
- Contrast ≥4.5:1 for the label, ≥3:1 for the dot against the canvas.
- `motion-reduce:animate-none` on the pulsing dot.

## Stories (Storybook)

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
