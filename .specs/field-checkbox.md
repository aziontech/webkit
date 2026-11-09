---
name: field-checkbox
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7337
  node_id: 2027:7337
checksum: 6697bd1e8bb981accbd07d90faf611fdad2846387e7f21cf4fe9282d4c2a87aa
created: 2026-05-23
last_updated: 2026-11-09
---

# Field Checkbox — Component Spec

## Purpose

Inline checkbox field with leading control, label, optional description, and optional disabled helper badge. Matches Figma FieldCheckbox (node 2027:7337). Use for standalone consent checkboxes, agreement fields, or any isolated boolean choice within a form.

## When to use

- A single yes/no choice in a form that needs a visible label: a consent, an agreement, an opt-in.
- A short list of independent options, one `FieldCheckbox` per option, each bound to its own `v-model`.
- The option needs a `description` line under the label, or a lock badge (`helperText`) explaining why it is disabled.

## When NOT to use

- Each option should read as a bordered card that highlights when checked → use `field-checkbox-block`.
- Toggling applies a setting immediately instead of on submit → use `field-switch`.
- Only one option of a group can be picked → use `field-radio`.
- The control sits in a row or cell that already labels it → use `checkbox`.

## Related

- `checkbox` — the bare control this field wraps; no label, description, or helper badge.
- `field-checkbox-block` — the same props inside a bordered card; has no `required`.
- `field-switch` — labeled boolean toggle for settings that take effect immediately.
- `label` — renders the label text and the Required tag for this field.
- `multi-select` — many options picked from a long list in a dropdown.

## Best practices

- Bind with `v-model`; the field emits `trueValue` when checked and `falseValue` when unchecked (defaults `true` / `false`).
- `helperText` renders only while `disabled`, as a badge with a lock icon — use it to say why the option is locked, not for general guidance.
- Omit `inputId` unless something outside the field must reference the input; the field generates one with `useId()` and links the label to it.
- `required` adds the Required tag to the label and native `required` + `aria-required` to the input; pass `name` when the value is submitted through a native form or vee-validate.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import FieldCheckbox from '@aziontech/webkit/field-checkbox'

const accepted = ref(false)
</script>

<template>
  <FieldCheckbox
    v-model="accepted"
    name="terms"
    label="I accept the terms of service"
    description="You can review the terms at any time in Account settings."
  />
</template>
```

## Props

| Prop          | Type      | Default     | Required | JSDoc                                             |
| ------------- | --------- | ----------- | -------- | ------------------------------------------------- |
| `modelValue`  | `boolean` | `undefined` | false    | Selected value for v-model.                       |
| `trueValue`   | `boolean` | `true`      | false    | Value emitted when checked.                       |
| `falseValue`  | `boolean` | `false`     | false    | Value emitted when unchecked.                     |
| `name`        | `string`  | `undefined` | false    | HTML name for form and vee-validate integration.  |
| `disabled`    | `boolean` | `false`     | false    | Disables interaction and applies disabled tokens. |
| `inputId`     | `string`  | `undefined` | false    | id for the native input; links label to control.  |
| `label`       | `string`  | `''`        | false    | Primary label text.                               |
| `description` | `string`  | `''`        | false    | Secondary description.                            |
| `helperText`  | `string`  | `''`        | false    | Helper badge text shown when disabled.            |
| `required`    | `boolean` | `false`     | false    | Adds the Required tag to the Label and sets native `required` + `aria-required` on the input. |

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
| typography (label)       | `.text-body-sm`         |
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

- Visible focus: delegated to nested Checkbox.
- Keyboard map: `Tab` focuses native input; `Space` toggles.
- ARIA: label associated via `for` / `inputId`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- Touch target ≥40×40 px via label hit area.

## Stories (Storybook)

- Default
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
