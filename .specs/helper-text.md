---
name: helper-text
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=600-5603
  node_id: 600:5603
checksum: 14d654e7eb44ef5aab4089b9109a6672cac0f6d46ca18770da4e0885b9f76667
created: 2026-06-15
last_updated: 2026-11-09
---

# HelperText — Component Spec

## Purpose

Auxiliary text rendered below a form input to communicate guidance (`helper`), validation errors (`invalid`), required-field reminders (`required`), or a locked/disabled state (`disabled`). Each variant changes only color (and, for `disabled`, prepends a lock icon) so the visual weight stays consistent with the field above it.

## When to use

- Guidance under a bare input you compose yourself (format hints, limits).
- A validation error (`kind="invalid"`), a required reminder (`kind="required"`), or a locked-field notice (`kind="disabled"`) under a field.

## When NOT to use

- A standard form field → use `field-text` or another `field-*` wrapper, which renders the helper and wires it to the input.
- The field name or required marker above the input → use `label`.
- Feedback about a whole form or page rather than one field → use `message`.

## Related

- `label` — sits above the input; HelperText sits below it.
- `field-text` — switches the helper `kind` from its own `invalid` and `disabled` props.
- `message` — banner-level feedback with severity and an optional action.

## Best practices

- Give it an `id` and point the input's `aria-describedby` at it so screen readers read it with the field.
- Pick `kind` from the field state: `invalid` for errors, `required` for a missing required value, `disabled` when the field is locked.
- Keep it to one short line; `kind="disabled"` already prepends the lock icon, so do not add another.

## Usage

```vue
<script setup>
import HelperText from '@aziontech/webkit/helper-text'
import InputText from '@aziontech/webkit/input-text'
</script>

<template>
  <InputText id="email" />
  <HelperText kind="invalid" label="Enter a valid email address." />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |
| `kind` | `'helper' \| 'invalid' \| 'required' \| 'disabled'` | `'helper'` | false | Visual variant; `disabled` also prepends a `pi pi-lock` icon. |

## Events

| _none_ | — | — |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Helper text; falls back to `label` prop when empty. |

## States

- Visual states: `helper`, `invalid`, `required`, `disabled`
- `data-kind` mirrors the `kind` prop

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography | `.text-label-sm` |
| color (helper, disabled) | `var(--text-muted)` |
| color (invalid) | `var(--danger-contrast)` |
| color (required) | `var(--warning-contrast)` |
| gap (disabled icon) | `var(--spacing-xxs)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `Components/Form Field/Helper` (Sora 12 / weight 400 / lh 1.3) | `.text-label-sm` (12px / lh 1.5 / weight 500) | `TODO: tokenizar text-form-helper semantic class to match Figma weight 400 + lh 1.3` |

## Accessibility (WCAG 2.1 AA)

- Root is a `<p>` element so the text is part of the document flow; consumers wire the input with `aria-describedby="<helper-id>"` to expose the helper text to assistive tech.
- Keyboard map: not focusable (descriptive text); the lock icon for `kind="disabled"` is decorative and marked `aria-hidden="true"`.
- ARIA: when `kind="invalid"`, consumers should also set `aria-invalid="true"` on the associated input; the helper text content carries the human-readable error.
- Contrast ≥4.5:1 between each `kind` color and `var(--bg-canvas)` (verified by Storybook a11y addon).
- `motion-reduce:transition-none motion-reduce:transform-none` not applicable (no motion).
- Touch target: text is non-interactive; not subject to the 40×40 px rule.

## Stories (Storybook)

- Default
- Types — composite story rendering every `kind` label side-by-side.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=label]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
