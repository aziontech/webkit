---
name: field-switch-block
category: inputs
structure: monolithic
status: implemented
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2027-7168
  node_id: 2027:7168
checksum: bbef804d83a805d3ded4e00901ab2e28790ca0a25b2de6347a7b66fe64755a57
created: 2026-05-23
last_updated: 2026-11-09
---

# Field Switch Block — Component Spec

## Purpose

Card-style boolean toggle with switch, label, description, and optional disabled helper badge inside a bordered block. Matches Figma FieldSwitchBlock (node 2027:7168).

## When to use

- A feature toggle that deserves its own card, with a description of what turning it on does.
- A stack of independent feature toggles on a settings page where the enabled ones should stand out.

## When NOT to use

- An inline row is enough → use `field-switch`.
- The options are picked now and applied on submit → use `field-checkbox-block`.
- The toggle must show the Required tag → use `field-switch`.
- Only one option of the group can be on → use `field-radio-block`.

## Related

- `field-switch` — inline row with the same props, plus `required`.
- `field-checkbox-block` — the same card with a checkbox.
- `field-radio-block` — the same card for a mutually exclusive choice.
- `switch` — the bare control rendered inside the card.

## Best practices

- Bind with `v-model`; the value is a boolean and defaults to `false`.
- The whole card is a `label` for the switch, so a click anywhere toggles it; `label` and `description` are plain strings.
- `helperText` renders only while `disabled`, as a lock badge — use it to say why the feature is locked.
- There is no `name`, `inputId`, or `required`; the switch is not a native form input, so read the bound value.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import FieldSwitchBlock from '@aziontech/webkit/field-switch-block'

const tieredCache = ref(false)
</script>

<template>
  <FieldSwitchBlock
    v-model="tieredCache"
    label="Tiered Cache"
    description="Serve cache misses from a regional layer before reaching the origin."
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

## Events

| Event               | Payload   | Notes    |
| ------------------- | --------- | -------- |
| `update:modelValue` | `boolean` | v-model. |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `checked`, `highlighted` (card border)
- `data-disabled` mirrors the `disabled` prop
- `data-checked` mirrors toggled-on state
- `data-highlighted` mirrors Figma card emphasis: on when checked and enabled, and also on when unchecked and disabled

## Motion & Animations

| Trigger      | Animation / Transition                    | Token  | Reduced-motion fallback         |
| ------------ | ----------------------------------------- | ------ | ------------------------------- |
| state change | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region                   | Token (DESIGN.md)         |
| ------------------------ | ------------------------- |
| typography (label)       | `.text-body-sm`           |
| typography (description) | `.text-body-xs`           |
| typography (helper)      | `.text-body-xs`           |
| surface                  | `var(--bg-surface)`       |
| surface (highlighted)    | `var(--primary-selected)` |
| text                     | `var(--text-default)`     |
| text (muted)             | `var(--text-muted)`       |
| border (muted)           | `var(--border-muted)`     |
| border (highlighted)     | `var(--border-selected)`  |
| border (helper)          | `var(--border-default)`   |
| spacing                  | `var(--spacing-sm)`       |
| spacing (tight)          | `var(--spacing-xxs)`      |
| spacing (helper gap)     | `var(--spacing-xs)`       |
| shape                    | `var(--shape-elements)`   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: delegated to nested Switch.
- Keyboard map: `Tab` focuses switch; `Space` / `Enter` toggles.
- ARIA: label associated via `for` pointing to an internally generated `id` injected on the `Switch` button.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- Touch target ≥40×40 px via card hit area.

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
