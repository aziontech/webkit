---
name: checkbox
category: input
structure: monolithic
status: implemented
spec_version: 8
checksum: 99e3d7150c0569ceac0fc0e3348e84d243cc3e6f1a6072f8db69c9152bcdf070
created: 2026-05-22
last_updated: 2026-11-15
---

# Checkbox — Component Spec

## Purpose

Binary selection control. Supports a single boolean (no `value`), a scalar paired with `value`, and array-based multi-select (adds or removes its `value` in the `modelValue` array) (used by `MultiSelect` and `DataTable` to drive bulk selection). The new `indeterminate` prop renders a third visual state (horizontal bar) and sets the native `indeterminate` property, which exposes the mixed state — used by parents that own a partial-selection summary (e.g. "select all" rows where some children are selected). Aligned with Figma frame `2027:7311`.

## When to use

- Use a Checkbox per option inside Field.Set for two to five options that all fit on screen; use Checkbox alone for an on/off choice submitted with a form. For a longer list use MultiSelect; for an on/off setting that applies at once use Switch.
- A bare boolean control whose label lives outside it: a table row-selection cell, an option row in a list, a settings matrix.
- Picking several values from a short set: give each box its own `value` and bind them all to one array `v-model`.
- A "select all" control over a partial selection: set `indeterminate` while only some children are checked.

## When NOT to use

- A form field that needs its own label, description, or helper text → wrap it in a horizontal `field` (`Field orientation="horizontal"` + `Field.Content`).
- Each option needs a bordered card with a label and description → use a `field` choice card (`Field.Label` wrapping a horizontal `Field`).
- An on/off setting that applies as soon as it flips → use `switch`.
- Only one option of the set may be chosen → use `radio-group`.

## Related

- `field` — `orientation="horizontal"` puts the checkbox beside its label and description (the default inside forms); a `Field.Label` wrapping that Field turns it into a bordered choice card.
- `switch` — on/off toggle for settings that take effect immediately.
- `multi-select` — renders this checkbox in every option row; use it when the option list is long.
- `data-table` — uses this checkbox for row selection and the select-all header.

## Best practices

- Leave `value` unset for a plain true/false model. With `value`, the checkbox adds or removes it in an array model, or sets a scalar model to `value` (checked) and `null` (unchecked).
- Give every checkbox an accessible name: point a `label` element's `for` at the `id` you pass (or wrap it in a `Field`), or pass `aria-label` (attributes land on the inner input).
- `indeterminate` only changes the visual and sets the native `indeterminate` property (exposed as mixed); the parent computes it and decides what a click does.
- Use `readonly` for a value that cannot change in this context and `disabled` for an option that is unavailable.

## Usage

```vue
<script setup>
  import Checkbox from '@aziontech/webkit/checkbox'

  const checked = defineModel({ default: false })
</script>

<template>
  <Checkbox
    v-model="checked"
    aria-label="Subscribe to newsletter"
  />
</template>
```

## Props

| Prop            | Type      | Default     | Required | JSDoc                                                                                                                                                 |
| --------------- | --------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `unknown` | `undefined` | false    | Identifier for this checkbox in a group: compared against a scalar model, or added to and removed from an array model. Unset, the model is a boolean. |
| `indeterminate` | `boolean` | `false`     | false    | Renders the indeterminate visual (horizontal bar). Does not affect `modelValue`; the parent owns the tri-state logic.                                 |
| `disabled`      | `boolean` | `false`     | false    | Disables interaction and applies disabled tokens.                                                                                                     |
| `readonly`      | `boolean` | `false`     | false    | Marks the field read-only; value is visible but cannot change via interaction.                                                                        |
| `invalid`       | `boolean` | `false`     | false    | Marks the control invalid: sets `aria-invalid` and the danger border (unchecked). An enclosing `Field`'s `invalid` sets it too.                       |
| `name`          | `string`  | `''`        | false    | HTML name for form submission.                                                                                                                        |

**Generic.** The component is generic over `TModel` (default `unknown`), the type of the bound `modelValue`: `v-model` on a `Ref<boolean>` (no `value`) or a `Ref<string[]>` (with `value`) sends `update:modelValue` as that same type, so a handler needs no narrowing. Bind the shape the mode emits: a boolean with no `value`, an array or a scalar with one.

## v-model

| Model     | Type     | Default     | Emits               | Notes                                                                                                                                                                                                                                                             |
| --------- | -------- | ----------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `TModel` | `undefined` | `update:modelValue` | The bound value via `defineModel`: a boolean when `value` is unset; with `value`, an array (adds or removes `value`; an undefined model counts as an empty array) or a scalar (set to `value` when checked, to `null` when unchecked). Uncontrolled when unbound. |

## Events

_none_

## Slots

The checkbox is a leaf primitive — no slots. Label/description live in the enclosing `Field`, which also hands the checkbox its id, `aria-describedby`, `disabled` and `required`.

| Slot | Scope | Notes |
| ---- | ----- | ----- |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `checked`, `indeterminate`, `disabled`, `readonly`
- `data-state` on the root: `unchecked` | `checked` | `indeterminate`
- `data-checked` mirrors `isChecked` (legacy; kept for backwards compatibility with existing `data-[checked]:` styling)
- `data-indeterminate` mirrors the `indeterminate` prop
- `data-disabled` mirrors the `disabled` prop
- `data-invalid` mirrors `invalid` (own prop or the enclosing `Field`); with `aria-invalid` on the control, it paints the danger border while unchecked
- `data-readonly` mirrors the `readonly` prop
- Touch: the native input that receives the click extends past the 18 px box to 24 × 24 px, and to 44 × 44 px on a coarse pointer; the drawn box does not change.

## Motion & Animations

| Trigger                            | Animation / Transition                    | Token                    | Reduced-motion fallback         |
| ---------------------------------- | ----------------------------------------- | ------------------------ | ------------------------------- |
| state change (border / bg / color) | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region                         | Token (DESIGN.md)           |
| ------------------------------ | --------------------------- |
| surface (unchecked)            | `var(--bg-surface)`         |
| surface (checked)              | `var(--primary)`            |
| surface (indeterminate)        | `var(--primary)`            |
| surface (disabled)             | `var(--bg-disabled)`        |
| icon (checked / indeterminate) | `var(--primary-foreground)` |
| icon (disabled)                | `var(--text-muted)`         |
| border (default)               | `var(--border-default)`     |
| border (checked)               | `var(--primary)`            |
| ring (focus)                   | `var(--ring-color)`         |
| ring offset (focus)            | `var(--bg-canvas)`          |
| shape                          | `var(--shape-control)`      |

## Theme gaps

| Figma variable                    | Temporary primitive                   | Follow-up                                                                                                                |
| --------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--border-width-default` (0.8 px) | `border-[0.8px]` (Tailwind arbitrary) | TODO: catalog `--border-width-default` in DESIGN.md as a semantic primitive shared with Select / MultiSelect / Checkbox. |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Space` toggles. (The native `<input type="checkbox">` carries the semantics.) When `readonly`, `disabled`, or the parent refuses the change, the native `checked` is put back to the model's state, so assistive tech never announces a state the model does not hold; `readonly` also sets `aria-readonly` and cancels the click.
- ARIA: native `<input type="checkbox">` is the source of truth. No `aria-checked` is set on it: the checked state comes from `checked`, and the mixed state from the `indeterminate` DOM property, which browsers expose as mixed (an `aria-checked` on a native checkbox conflicts with its real state, axe `aria-conditional-attr`). The wrapping `<span>` is decorative.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons + borders), including disabled state.
- `motion-reduce:transition-none` on every transition-bearing class.
- Touch target — the `1.125rem` size is below 40×40 px; consumers should wrap it in a horizontal `Field` (the label extends the target) or expand the parent click area when the control sits on its own.

## Examples

- Default
- Indeterminate — justification: documents the tri-state visual (horizontal bar) and the mixed semantics added in `spec_version: 3`. Not reachable from any other story.
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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
