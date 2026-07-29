---
name: message
category: feedback
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=478-892
  node_id: 478:892
checksum: 636ae80a81e8781b3b41769e4f9c1faa8b72db808c4d4d7f61dcac481d4b4f04
created: 2026-05-22
last_updated: 2026-07-29
---
# Message — Component Spec

## Purpose

Inline feedback banner that communicates status, alerts, or progress. Presents a severity-colored surface with a leading icon and a single line of message copy that may carry inline links, plus an optional text action.

## Usage

```vue
<script setup>
import Message from '@aziontech/webkit/message'
</script>

<template>
  <!-- Plain copy via the label prop -->
  <Message
    severity="info"
    label="Deployment finished in 42 seconds."
  />

  <!-- Copy with inline links via the default slot -->
  <Message severity="warning">
    Your plan is close to its request limit.
    <a href="/billing">Upgrade the plan</a>
    to avoid throttling.
  </Message>
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `severity` | `'info' | 'success' | 'warning' | 'danger' | 'error'` | `'info'` | no | Visual severity variant (maps Error to danger). |
| `size` | `'small' | 'medium'` | `'medium'` | no | Size token. Drives the banner height, inline padding, and copy scale. |
| `label` | `string` | `''` | no | Fallback message copy when the default slot is empty. |
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
| `default` | — | Message copy. Accepts inline content — plain text plus anchors, which the message region styles with the `.text-link` token. Falls back to `label` when empty. |

## States

- Visual states: default (per severity)

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| dismiss | inline `opacity` transition | `duration['fast-02']` · `curve['productive-exit']` (animate.js) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| message typography (small) | `.text-body-xs` |
| message typography (medium) | `.text-body-sm` |
| inline link (anchor inside the message) | `.text-link` |
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
| spacing (padding block) | `py-1.5` — 6px; no semantic token sits between `--spacing-xxs` (4px) and `--spacing-xs` (8px) |
| spacing (padding inline, small) | `var(--spacing-xs)` |
| spacing (padding inline, medium) | `var(--spacing-sm)` |
| spacing (padding inline end, with a trailing control) | `var(--spacing-xs)` — tightened; the trailing action/close control carries its own padding |
| spacing (gap) | `var(--spacing-sm)` |
| shape | `var(--shape-button)` — 6px, identical to `rounded-md` |
| shadow | `var(--shadow-xs)` |
| ring | `var(--ring-color)` |
| height (small) | `min-h-8` — 32px floor; grows with wrapped copy or a trailing control |
| height (medium) | `min-h-9` — 36px floor; grows with wrapped copy or a trailing control |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| block padding 6px | `py-1.5` (`calc(var(--spacing) * 1.5)`) | Add a 6px semantic spacing step if a second component needs it; today only this banner does. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `Tab` focuses inline links in the message copy, then the action and close controls when present; `Enter` follows a link, `Enter`/`Space` activates the controls; `Escape` dismisses when `closable` is true.
- ARIA: root uses `role="alert"` for danger/warning severities and `role="status"` for info/success.
- Inline links are underlined, not colour-only, so they stay distinguishable against every severity surface (WCAG 1.4.1); the `.text-link` token supplies the focus outline.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Stories (Storybook)

- Default
- Types
- Sizes
- WithLinks — the inline-link anatomy is the reason this component was reshaped; the default slot's link handling is not reachable from any arg-driven story, so it needs its own composite story.
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
