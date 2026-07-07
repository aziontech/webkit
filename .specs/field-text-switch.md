---
name: field-text-switch
category: inputs
structure: monolithic
status: implemented
spec_version: 1
checksum: 1997eb01d01f6f0c0808ee828de32c774d99b81098c421842cc902cde7a458e6
created: 2026-07-06
last_updated: 2026-07-06
---

# FieldTextSwitch — Component Spec

## Purpose

Form field wrapper that composes `Label`, an `InputGroup` (holding an internal `<input>` on the left and a `<Switch>` as the trailing child on the right), and `HelperText` into a single vertical stack. Use it when a text value is only meaningful while a boolean feature is enabled — e.g. "Custom domain" (text) + "Enabled" (switch), "Redirect URL" + "Follow redirects", "Cache key override" + "Override enabled". The switch owns the field's on/off state: when `enabled` is `false`, the internal text input is automatically inert (disabled tokens + native `disabled`), so a single glance answers "is this configured **and** on?". No Figma reference at draft time — tokens are inferred from `input-group`, `switch`, and `field-input-group`.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import FieldTextSwitch from '@aziontech/webkit/field-text-switch'

const domain = ref('mysite.com')
const enabled = ref(true)
</script>

<template>
  <FieldTextSwitch
    v-model="domain"
    v-model:enabled="enabled"
    label="Custom domain"
    placeholder="mysite.com"
    helper-text="Only used while the feature is enabled."
    required
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `''` | no | Two-way bound value of the internal `<input>`. |
| `enabled` | `boolean` | `false` | no | Two-way bound state of the trailing `Switch`. When `false`, the internal `<input>` becomes inert (rendered with `disabled` tokens and the native `disabled` attribute) regardless of the `disabled` prop; the switch itself remains focusable so the consumer can turn the field back on. |
| `label` | `string` | `''` | no | Text rendered inside the `Label`. When empty, the label row is omitted. |
| `placeholder` | `string` | `''` | no | Placeholder forwarded to the internal `<input>`. |
| `helperText` | `string` | `''` | no | Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted **except** when `disabled` is true — in that case the component falls back to a default disabled message so the lock icon always has matching copy. |
| `disabled` | `boolean` | `false` | no | Disables the whole field: the internal `<input>`, the trailing `Switch`, and the `InputGroup` chrome; switches the helper to `kind="disabled"` (lock icon). Independent from `enabled` — `disabled=true` overrides everything, `enabled=false` only disables the text input while keeping the switch operable. |
| `readonly` | `boolean` | `false` | no | Marks the internal input read-only; value is visible but not editable. Does not affect the switch. Native pass-through. |
| `required` | `boolean` | `false` | no | Adds the Required tag to the `Label`, sets `required` on `InputGroup`, and sets native `required` + `aria-required` on the internal `<input>`. Does not mark the switch as required. |
| `invalid` | `boolean` | `false` | no | Sets `invalid` on `InputGroup` (danger border) and switches the helper to `kind="invalid"`. Also sets `aria-invalid` on the internal `<input>`. |
| `inputId` | `string` | `''` | no | `id` for the internal `<input>`; consumed by `Label` via `for` and by `aria-describedby` wiring. Auto-generated via Vue's `useId()` when empty. |
| `name` | `string` | `''` | no | HTML `name` for the internal `<input>` (form + vee-validate integration). |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `string` | Re-emitted from the internal `<input>` on native `input` event. Enables `v-model`. |
| `update:enabled` | `boolean` | Re-emitted from the trailing `<Switch>` on toggle. Enables `v-model:enabled`. |

## Slots

| _none_ | — | — |

## States

- Visual states delegated to `InputGroup`: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`.
- On the field wrapper root: `data-disabled`, `data-invalid`, `data-required`, `data-enabled` mirror the props (for test/query targeting). `data-enabled` reflects the `enabled` prop verbatim.
- Internal-input inertness precedence: `disabled` prop > `!enabled` > `readonly`. When `enabled=false` and `disabled=false`, the `<input>` receives native `disabled` (so the consumer cannot type into an off feature) but the `Switch` stays operable.
- `HelperText.kind` computed by precedence: `disabled > invalid > required > 'helper'`.
- When `disabled` is set and `helperText` is empty, the helper defaults to `'This field is locked.'` (parity with `FieldText` / `FieldInputGroup`).

## Motion & Animations

_none_

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| stack gap (vertical) | `var(--spacing-xs)` |
| internal input surface | `var(--bg-surface)` |
| internal input text | `var(--text-default)` |
| internal input placeholder | `var(--text-muted)` |
| internal input padding.x | `var(--spacing-md)` |
| internal input typography | `.text-label-sm` |
| trailing switch padding.x | `var(--spacing-md)` |

Border / focus / hover / invalid / required / disabled tokens are owned by the nested `InputGroup`. Switch surface / thumb / on / off tokens are owned by the nested `Switch`.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: delegated to `InputGroup` (focus-within ring on the group root) and to `Switch` (its own focus ring inside the group). The internal `<input>` renders `focus:ring-0 outline-none` so only the group ring shows around the text half.
- Keyboard map: `Tab` moves from the internal `<input>` to the trailing `<Switch>` in DOM order; `Space` toggles the switch; typing edits the input; `Shift+Tab` moves back.
- ARIA: internal `<input>` receives `aria-invalid`, `aria-required`, and `aria-describedby` pointing at the `HelperText` id when helper text is present or `disabled` forces the fallback. `Label` is linked via `for=<inputId>`. The trailing `<Switch>` receives an `aria-label` derived from the `label` prop (e.g. `Toggle {label}`) so screen readers announce it distinctly from the text input.
- Contrast ≥4.5:1 for label / input text / helper text against their surfaces; ≥3:1 for the switch track / thumb in every state.
- Motion: state color transitions come from `InputGroup` and `Switch` (`duration-150 ease-out`, `motion-reduce:transition-none`).
- Touch target: the trailing `Switch` retains its own ≥32×32 px hit area inside the `h-8` group root.

## Stories (Storybook)

- Default — value + label + placeholder + helperText, `enabled=true`.
- SwitchOff — `enabled=false`, documents the auto-disabled text input while the switch remains operable.
- Required — `required=true`, documents the Required tag on the label and the group's required border.
- Invalid — `invalid=true` with a message in `helperText`.
- Disabled — `disabled=true`, helper falls back to the disabled copy; both input and switch are inert.

Justification for five stories (deviates from Default+Types+Sizes+state pattern): the component has no `kind` and no `size`, so `Types` and `Sizes` do not apply. `Default` and `SwitchOff` document the two visual states of the switch-controlled input (the whole point of this wrapper). `Required`, `Invalid`, `Disabled` exercise the three state signals the wrapper propagates.

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
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
