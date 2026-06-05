---
name: message
category: feedback
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=478-892
  node_id: 478:892
checksum: 369176139640a950359df9192158948fc7e62777ee0c88b2f8fba00a1a0b3ced
created: 2026-05-22
last_updated: 2026-05-29
---
# Message — Component Spec

## Purpose

Inline feedback banner that communicates status, alerts, or progress. Presents a severity-colored surface with icon, title, optional description, and an optional text action aligned to Figma Message (478:892).

## Usage

```vue
<script setup>
import Message from '@aziontech/webkit/feedback/message'
</script>

<template>
  <Message
    severity="info"
    title="Info message"
    description="A brief description of the message."
    action-label="Label"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `severity` | `'info' | 'success' | 'warning' | 'danger' | 'error'` | `'info'` | no | Visual severity variant (maps Error to danger). |
| `title` | `string` | `—` | yes | Primary message heading. |
| `description` | `string` | `''` | no | Supporting body copy below the title. |
| `icon` | `string` | `''` | no | PrimeIcons class override for the leading icon. |
| `actionLabel` | `string` | `''` | no | Label for the built-in text action button; hidden when empty. |
| `closable` | `boolean` | `false` | no | When true, shows a close control that dismisses the message. |
| `life` | `number` | `0` | no | Duration in milliseconds before auto-dismiss; `0` disables auto-dismiss. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `action` | `MouseEvent` | Emitted when the built-in action button is clicked. |
| `close` | `void` | Emitted when the message is dismissed manually or after `life` expires. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `action` | — | Custom action control; replaces the built-in Button when provided. |
| `default` | — | Replaces the default icon + title + description layout. |

## States

- Visual states: default (per severity)

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| dismiss | inline `opacity` transition | `duration['fast-02']` · `curve['productive-exit']` (animate.js) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| title typography | `.text-label-sm` |
| description typography | `.text-body-xs` |
| action typography | `.text-button-md` |
| surface (info) | `var(--info)` |
| surface (success) | `var(--success)` |
| surface (warning) | `var(--warning)` |
| surface (danger) | `var(--danger)` |
| border (info) | `var(--info-border)` |
| border (success) | `var(--success-border)` |
| border (warning) | `var(--warning-border)` |
| border (danger) | `var(--danger-border)` |
| icon (info) | `var(--info-contrast)` |
| icon (success) | `var(--success-contrast)` |
| icon (warning) | `var(--warning-contrast)` |
| icon (danger) | `var(--danger-contrast)` |
| text | `var(--text-default)` |
| muted text | `var(--text-muted)` |
| spacing (padding) | `var(--spacing-sm)` |
| spacing (gap) | `var(--spacing-xs)` |
| spacing (title stack) | `var(--spacing-xxs)` |
| shape | `var(--shape-button)` |
| shadow | `var(--shadow-xs)` |
| ring | `var(--ring-color)` |
| min height | `min-h-14` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses the action and close controls when present; `Enter`/`Space` activates them; `Escape` dismisses when `closable` is true.
- ARIA: root uses `role="alert"` for danger/warning severities and `role="status"` for info/success.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default
- Types
- Closable
- AutoDismiss

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
