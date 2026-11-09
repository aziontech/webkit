---
name: field-switch
category: inputs
structure: monolithic
status: implemented
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=542-105
  node_id: 542:105
checksum: 116f75e64fde2687a8f4c28a60c8d9f0e203313a660f21a1c61f56f82d49f205
created: 2026-05-23
last_updated: 2026-11-09
---

# Field Switch — Component Spec

## Purpose

Inline boolean toggle with switch on the leading edge, label, optional description, and optional disabled helper badge. Matches Figma FieldSwitch (node 542:105).

## When to use

- A setting that takes effect as soon as it is toggled (enable notifications, turn on caching) and needs a visible label.
- The toggle needs a `description` line, or a lock badge (`helperText`) explaining why it is disabled.

## When NOT to use

- The choice only applies when the form is submitted (consent, agreement) → use `field-checkbox`.
- The toggle should read as a bordered card → use `field-switch-block`.
- The switch turns on a companion text value → use `field-text-switch`.
- The row already labels the control → use `switch`.

## Related

- `switch` — the bare control; its `privacy` kind is not exposed by this field.
- `field-switch-block` — the same toggle inside a bordered card; has no `required`.
- `field-text-switch` — a text input whose trailing switch enables it.
- `field-checkbox` — boolean choice applied on submit.

## Best practices

- Bind with `v-model`; the value is a boolean and defaults to `false`.
- The control is a `role="switch"` button, not a native input: there is no `name` or `inputId`, so read the bound value instead of expecting it in native form data.
- `helperText` renders only while `disabled`, as a lock badge — use it to say why the setting is locked.
- `required` adds the Required tag to the label and `aria-required` to the switch; nothing validates it natively, so check it on submit.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import FieldSwitch from '@aziontech/webkit/field-switch'

const notifications = ref(true)
</script>

<template>
  <FieldSwitch
    v-model="notifications"
    label="Email notifications"
    description="Send an email when a deployment finishes."
  />
</template>
```

## Props

| Prop          | Type      | Default     | Required | JSDoc                                             |
| ------------- | --------- | ----------- | -------- | ------------------------------------------------- |
| `modelValue`  | `boolean` | `false`     | false    | Selected value for v-model.                       |
| `disabled`    | `boolean` | `false`     | false    | Disables interaction and applies disabled tokens. |
| `label`       | `string`  | `''`        | false    | Primary label text.                               |
| `description` | `string`  | `''`        | false    | Secondary description.                            |
| `helperText`  | `string`  | `''`        | false    | Helper badge text shown when disabled.            |
| `required`    | `boolean` | `false`     | false    | Adds the Required tag to the Label and sets `aria-required` on the switch. |

## Events

| Event               | Payload   | Notes    |
| ------------------- | --------- | -------- |
| `update:modelValue` | `boolean` | v-model. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `checked`
- `data-disabled` mirrors the `disabled` prop
- `data-required` mirrors the `required` prop

## Motion & Animations

_none_

## Tokens

| Region                   | Token (DESIGN.md)       |
| ------------------------ | ----------------------- |
| typography (label)       | `.text-label-md`        |
| typography (description) | `.text-body-xs`         |
| typography (helper)      | `.text-body-xs`         |
| text                     | `var(--text-default)`   |
| text (muted)             | `var(--text-muted)`     |
| surface                  | `var(--bg-surface)`     |
| border                   | `var(--border-default)` |
| spacing                  | `var(--spacing-sm)`     |
| spacing (tight)          | `var(--spacing-xxs)`    |
| spacing (helper gap)     | `var(--spacing-xs)`     |
| shape                    | `var(--shape-elements)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: delegated to nested Switch.
- Keyboard map: `Tab` focuses switch; `Space` / `Enter` toggles.
- ARIA: label associated to the switch via `for` bound to an internally generated id (`useId`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- Touch target ≥40×40 px via label hit area.

## Stories (Storybook)

- Default
- States
- Disabled

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
