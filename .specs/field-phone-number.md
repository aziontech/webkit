---
name: field-phone-number
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2048-5713
  node_id: 2048:5713
checksum: ba21a686b86d27db9d7ce0686646a67812c41a24839d18928a23b57bd7684308
created: 2026-07-06
last_updated: 2026-07-06
---

# FieldPhoneNumber — Component Spec

## Purpose

Form field for international phone-number entry that composes `Label`, `InputGroup` (with a leading `Select` for the dial code and a middle `<input>` for the national number), and `HelperText` into a single vertical stack with consistent spacing. Mirrors `FieldInputGroup`'s template shape verbatim — the difference is that the left side of the `InputGroup` is a dial-code `<Select>` (e.g. `+55`, `+1`, `+44`) and the middle `<input>` applies a per-country mask so the user sees a formatted number as they type (e.g. `(11) 99999-9999` for BR). Emits two v-models: `modelValue` for the national digits (no dial code, no mask characters) and `country` for the selected ISO 3166-1 alpha-2 code.

## Usage

```vue
<script setup>
import { ref } from 'vue'
import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'

const phone = ref('')
const country = ref('BR')
</script>

<template>
  <FieldPhoneNumber
    v-model="phone"
    v-model:country="country"
    label="Phone"
    placeholder="(11) 99999-9999"
    helper-text="We'll use this to send the verification code."
    required
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `string` | `''` | no | Two-way bound national number as **digits only**, without dial code and without mask characters (e.g. `'11999999999'`). Enables `v-model`. |
| `country` | `string` | `'BR'` | no | Two-way bound ISO 3166-1 alpha-2 code of the selected country (e.g. `'BR'`, `'US'`, `'GB'`). Drives the dial code shown in the `Select` and the mask applied to the input. Enables `v-model:country`. |
| `countries` | `Array<{ code: string; dialCode: string; mask: string; label: string }>` | (built-in curated list — see Notes) | no | Countries offered by the dial-code `Select`. Each entry: `code` (ISO alpha-2), `dialCode` (e.g. `'+55'`), `mask` (e.g. `'(##) #####-####'` where `#` = digit slot), `label` (e.g. `'Brazil'`, used for the Select's item label / a11y). When omitted, the component uses its built-in list. |
| `label` | `string` | `''` | no | Text rendered inside the `Label`. When empty, the label row is omitted. |
| `placeholder` | `string` | `''` | no | Placeholder forwarded to the internal `<input>`. When empty, the placeholder falls back to the selected country's mask literal (e.g. `(11) 99999-9999`). |
| `helperText` | `string` | `''` | no | Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted **except** when `disabled` is true — in that case the component falls back to a default disabled message so the lock icon always has matching copy. |
| `disabled` | `boolean` | `false` | no | Disables both the dial-code `Select` and the internal `<input>`, and switches the helper to `kind="disabled"` (lock icon). |
| `readonly` | `boolean` | `false` | no | Marks the internal `<input>` read-only; value is visible but not editable. The dial-code `Select` is also disabled while readonly (dial code cannot change without editing). Native pass-through on the input. |
| `required` | `boolean` | `false` | no | Adds the Required tag to the `Label`, sets `required` on `InputGroup`, and sets native `required` + `aria-required` on the internal `<input>`. |
| `invalid` | `boolean` | `false` | no | Sets `invalid` on `InputGroup` (danger border) and switches the helper to `kind="invalid"`. Also sets `aria-invalid` on the internal `<input>`. |
| `inputId` | `string` | `''` | no | `id` for the internal `<input>`; consumed by `Label` via `for` and by `aria-describedby` wiring. Auto-generated via Vue's `useId()` when empty. |
| `name` | `string` | `''` | no | HTML `name` for the internal `<input>` (form + vee-validate integration). |

Notes on the built-in `countries` list: the default set is a curated shortlist (BR, US, GB, PT, ES, AR, MX, CL, CO, DE, FR, IT — order preserves this priority in the Select). The full list is not shipped — consumers who need more countries pass a custom `countries` array. The list lives in a co-located `countries.ts` inside the component folder; it is data, not a public export.

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `[value: string]` | Emitted on every native `input` event of the internal `<input>` **and** whenever `country` changes (re-emitted so validators react to dial-code switches). Value is always digits-only (mask characters stripped). |
| `update:country` | `[code: string]` | Emitted when the user picks a different country in the dial-code `Select`. Enables `v-model:country`. |

## Slots

_none_ — the affordance is fixed (dial-code Select on the left, phone input on the right). Consumers who need extra addons should compose `InputGroup` directly.

## States

- Visual states delegated to `InputGroup`: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`.
- On the field wrapper root: `data-disabled`, `data-invalid`, `data-required` mirror the props (for test/query targeting).
- `HelperText.kind` computed by precedence: `disabled > invalid > required > 'helper'`.
- When `disabled` is set and `helperText` is empty, the helper defaults to `'This field is locked.'` (parity with `FieldText`, `FieldInputGroup`).
- The dial-code `Select` is disabled whenever the wrapper is `disabled` **or** `readonly`.

## Motion & Animations

_none_ — motion is owned by the underlying `InputGroup` (color transitions on state changes) and `Select` (dropdown open/close). The wrapper adds no animations of its own.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| stack gap (vertical) | `var(--spacing-xs)` |
| internal input surface | `var(--bg-surface)` |
| internal input text | `var(--text-default)` |
| internal input placeholder | `var(--text-muted)` |
| internal input padding.x | `var(--spacing-md)` |
| internal input typography | `.text-label-sm` |

Border / focus / hover / invalid / required / disabled tokens are owned by the nested `InputGroup`. Dial-code `Select` uses its own tokens.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: delegated to `InputGroup` (focus-within ring on the group root). The internal `<input>` and the dial-code `Select` both render `focus:ring-0 outline-none` so only the group ring shows.
- Keyboard map: `Tab` moves from the dial-code `Select` to the internal `<input>`, in DOM order. Inside the `Select`, standard keyboard behavior applies (arrows to navigate, Enter to select, Esc to close) — owned by `Select`.
- ARIA: the internal `<input>` receives `type="tel"`, `inputmode="tel"`, `autocomplete="tel-national"`, `aria-invalid`, `aria-required`, and `aria-describedby` pointing at the `HelperText` id when helper text is present or `disabled` forces the fallback. `Label` is linked via `for=<inputId>`. The dial-code `Select` receives `aria-label="Country dial code"` (or a translated equivalent) because it has no visible label of its own — the field's `Label` describes the whole compound, not the dial-code control specifically.
- Contrast ≥4.5:1 for label / input text / helper text / dial-code text against their surfaces.
- Motion: state color transitions come from `InputGroup` (`duration-150 ease-out`, `motion-reduce:transition-none`); `Select` dropdown motion is owned by `Select`.
- Touch target ≥32×32 px (matches the fixed `h-8` `InputGroup` root; the dial-code `Select` inherits the same height).

## Stories (Storybook)

- Default — `label='Phone'`, `country='BR'`, empty value, sample `placeholder` and `helperText`.
- Countries — composite story cycling through three countries (BR, US, GB) side by side, each with a value formatted by that country's mask, to document per-country masking.
- Required — `required=true`; documents the Label's Required tag plus the input's `aria-required` wiring.
- Invalid — `invalid=true` with a `helperText` such as `'Enter a valid phone number.'`.
- Disabled — `disabled=true`; documents the lock-icon helper and the disabled dial-code `Select` + `<input>`.
- Readonly — `readonly=true`; documents that the value is visible but neither the number nor the dial code can change.

Justification for six stories (deviates from Default+Types+Sizes+state pattern): the component has no `kind` and no `size`, so `Types` and `Sizes` do not apply. `Default` and `Countries` document the composition API (Label + `InputGroup` with `Select` + masked input + `HelperText`, plus per-country mask switching). `Required`, `Invalid`, `Disabled`, and `Readonly` exercise the four state signals the wrapper propagates.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not install or import phone-number / mask libraries (`libphonenumber-js`, `google-libphonenumber`, `intl-tel-input`, `maska`, `vue-the-mask`, `imask`, `cleave.js`). The mask is a plain string template driven by the selected country's `mask` field (`#` = digit slot, any other character = literal). Formatting logic lives in a local helper inside the component folder. Justification: masking a phone number is small, well-scoped string logic — importing a full i18n phone lib to do it violates the CSS-only / own-it-in-house posture in `.claude/rules/dependencies.md`.
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
