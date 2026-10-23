---
name: field-phone-number
category: inputs
structure: monolithic
status: implemented
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2048-5713
  node_id: 2048:5713
checksum: 8d1c213cca7bd0ea9aa477693907afb05013d58a088acee61212df24a4235df7
created: 2026-07-06
last_updated: 2026-10-19
---

# FieldPhoneNumber — Component Spec

## Purpose

Form field for international phone-number entry that composes `Label`, `InputGroup` (with a leading `Select` for the dial code and a middle `<input>` for the national number), and `HelperText` into a single vertical stack with consistent spacing. Mirrors `FieldInputGroup`'s template shape verbatim — the difference is that the left side of the `InputGroup` is a dial-code `<Select>` (e.g. `+55`, `+1`, `+44`) and the middle `<input>` follows the selected country: it applies that country's mask as the user types and accepts exactly the lengths the country allows. A country may allow more than one length — a Brazilian landline (10 digits, `(11) 9999-9999`) and mobile (11 digits, `(11) 99999-9999`) both format correctly, the mask switching as the digits grow. Two v-models (`v-model` for the national digits, `v-model:country` for the ISO 3166-1 alpha-2 code) carry the editable state; the one-way `update:phone` event hands the form everything it would otherwise derive by hand — the full number with its dial code and whether that number is complete — so no form re-implements per-country length rules.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import FieldPhoneNumber from '@aziontech/webkit/field-phone-number'

  const digits = ref('')
  const country = ref('BR')
  const phone = ref(null)
</script>

<template>
  <FieldPhoneNumber
    v-model="digits"
    v-model:country="country"
    label="Phone"
    helper-text="We'll use this to send the verification code."
    required
    @update:phone="phone = $event"
  />
  <!-- phone.number === '+5511999999999', phone.complete === true -->
</template>
```

## Props

| Prop          | Type                                                                     | Default                             | Required | JSDoc                                                                                                                                                                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------ | ----------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `countries`   | `Array<{ code: string; dialCode: string; mask: string \| string[]; label: string }>` | (built-in list — see Notes) | false    | Countries offered by the dial-code `Select`. Each entry: `code` (ISO alpha-2), `dialCode` (e.g. `'+55'`), `mask` (e.g. `'(##) #####-####'` where `#` = digit slot), `label` (e.g. `'Brazil'`, used for the Select's item label / a11y). `mask` is a list when the country allows more than one length (e.g. BR `['(##) ####-####', '(##) #####-####']`). When omitted, the component uses its built-in list. |
| `label`       | `string`                                                                 | `''`                                | false    | Text rendered inside the `Label`. When empty, the label row is omitted.                                                                                                                                                                                                                     |
| `placeholder` | `string`                                                                 | `''`                                | false    | Placeholder forwarded to the internal `<input>`. When empty, the placeholder falls back to the selected country's mask literal (e.g. `(11) 99999-9999`).                                                                                                                                    |
| `helperText`  | `string`                                                                 | `''`                                | false    | Auxiliary text rendered inside `HelperText`. When empty, the helper row is omitted — including while `disabled`: the field never substitutes copy of its own, so a field disabled for the length of a request grows no line (and no lock glyph) in the one moment it has nothing to say.    |
| `disabled`    | `boolean`                                                                | `false`                             | false    | Disables both the dial-code `Select` and the internal `<input>`, and switches the helper to `kind="disabled"` (lock icon).                                                                                                                                                                  |
| `readonly`    | `boolean`                                                                | `false`                             | false    | Marks the internal `<input>` read-only; value is visible but not editable. The dial-code `Select` is also disabled while readonly (dial code cannot change without editing). Native pass-through on the input.                                                                              |
| `required`    | `boolean`                                                                | `false`                             | false    | Adds the Required tag to the `Label`, sets `required` on `InputGroup`, and sets native `required` + `aria-required` on the internal `<input>`.                                                                                                                                              |
| `invalid`     | `boolean`                                                                | `false`                             | false    | Sets `invalid` on `InputGroup` (danger border) and switches the helper to `kind="invalid"`. Also sets `aria-invalid` on the internal `<input>`.                                                                                                                                             |
| `inputId`     | `string`                                                                 | `''`                                | false    | `id` for the internal `<input>`; consumed by `Label` via `for` and by `aria-describedby` wiring. Auto-generated via Vue's `useId()` when empty.                                                                                                                                             |
| `name`        | `string`                                                                 | `''`                                | false    | HTML `name` for the internal `<input>` (form + vee-validate integration).                                                                                                                                                                                                                   |

Notes on the built-in `countries` list: the default set opens with the priority shortlist (BR, US, GB, PT, ES, AR, MX, CL, CO, DE, FR, IT — order preserved in the Select), continues with the rest of the supported countries in alphabetical order (AU, BE, BO, CA, CN, EC, IN, IE, IL, JP, NL, PY, PE, PL, SG, ZA, KR, CH, TR, AE, UY, VE), and closes with **Other** (`code: 'ZZ'`, the CLDR "unknown region" code; `dialCode: '+'`). Other is the way in for a country not on the list: the user types the country code and the number together into the input, which accepts 7–15 digits (the E.164 range) without grouping. Consumers who need a different set pass a custom `countries` array. The list lives in a co-located `countries.ts` inside the component folder; it is data, not a public export.

Masks: `#` is a digit slot and every other character is a literal. Digits are always the **national significant number** — no dial code, no trunk prefix (`0`) — so `dialCode + digits` is the E.164 number. With several masks, the field formats with the shortest mask whose slot count covers the digits typed so far, caps input at the longest mask's slot count, and treats the number as complete when its digit count equals one of the masks' slot counts. The placeholder fallback is the longest mask with every slot shown as `9`.

## v-model

| Model             | Type     | Default | Emits                | Notes                                                                                                                                                                                                                     |
| ----------------- | -------- | ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`         | `string` | `''`    | `update:modelValue`  | National number as **digits only**, without dial code and without mask characters (e.g. `'11999999999'`). Updates on input when the digits change, and when a country switch truncates digits beyond the new country's capacity. Via `defineModel`, so the field also works unbound. |
| `v-model:country` | `string` | `'BR'`  | `update:country`     | ISO 3166-1 alpha-2 code of the selected country (e.g. `'BR'`, `'US'`, `'GB'`, `'ZZ'` for Other). Drives the dial code shown in the `Select` and the masks applied to the input. Via `defineModel`, so picking a country works even when the consumer binds only `v-model`. |

## Events

| Event          | Payload                | Notes                                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:phone` | `[value: PhoneNumber]` | One-way snapshot of the number, emitted once on mount and again whenever the digits or the country change. `PhoneNumber` (exported from the component) is `{ country: string; dialCode: string; digits: string; number: string; complete: boolean }`: `number` is the full E.164 number (`dialCode + digits`, e.g. `'+5511999999999'`; `''` while empty) and `complete` is true when the digit count is one the selected country allows. Not a v-model — the field never reads it back. |

## Slots

_none_ — the affordance is fixed (dial-code Select on the left, phone input on the right). Consumers who need extra addons should compose `InputGroup` directly.

## States

- Visual states delegated to `InputGroup`: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`.
- On the field wrapper root: `data-disabled`, `data-invalid`, `data-required` mirror the props (for test/query targeting).
- `HelperText.kind` computed by precedence: `disabled > invalid > required > 'helper'`.
- When `disabled` is set and `helperText` is empty, no helper row renders (parity with `FieldText`, `FieldInputGroup`) — the field substitutes no copy, so a transient lock adds no padlock line.
- Completeness is reported, not rendered: an incomplete number sets `complete: false` on `update:phone`, and the consumer decides when to show it (typically on submit, via `invalid` + `helperText`). The field writes no "incomplete" copy of its own.
- The dial-code `Select` is disabled whenever the wrapper is `disabled` **or** `readonly`.

## Motion & Animations

_none_ — motion is owned by the underlying `InputGroup` (color transitions on state changes) and `Select` (dropdown open/close). The wrapper adds no animations of its own.

## Tokens

| Region                     | Token (DESIGN.md)     |
| -------------------------- | --------------------- |
| stack gap (vertical)       | `var(--spacing-xs)`   |
| internal input surface     | `var(--bg-surface)`   |
| internal input text        | `var(--text-default)` |
| internal input placeholder | `var(--text-muted)`   |
| internal input padding.x   | `var(--spacing-md)`   |
| internal input typography  | `.text-label-sm`      |

Border / focus / hover / invalid / required / disabled tokens are owned by the nested `InputGroup`. Dial-code `Select` uses its own tokens.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: delegated to `InputGroup` (focus-within ring on the group root). The internal `<input>` and the dial-code `Select` both render `focus:ring-0 outline-none` so only the group ring shows.
- Keyboard map: `Tab` moves from the dial-code `Select` to the internal `<input>`, in DOM order. Inside the `Select`, standard keyboard behavior applies (arrows to navigate, Enter to select, Esc to close) — owned by `Select`.
- ARIA: the internal `<input>` receives `type="tel"`, `inputmode="tel"`, `autocomplete="tel-national"`, `aria-invalid`, `aria-required`, and `aria-describedby` pointing at the `HelperText` id when helper text is present. `Label` is linked via `for=<inputId>`. The dial-code `Select` receives `aria-label="Country dial code"` (or a translated equivalent) because it has no visible label of its own — the field's `Label` describes the whole compound, not the dial-code control specifically.
- Contrast ≥4.5:1 for label / input text / helper text / dial-code text against their surfaces.
- Motion: state color transitions come from `InputGroup` (`duration-150 ease-out`, `motion-reduce:transition-none`); `Select` dropdown motion is owned by `Select`.
- Touch target ≥32×32 px (matches the fixed `h-8` `InputGroup` root; the dial-code `Select` inherits the same height).

## Stories (Storybook)

- Default — `label='Phone'`, `country='BR'`, empty value, sample `placeholder` and `helperText`.
- Countries — composite story with BR mobile, BR landline, US and GB side by side, each with a value formatted by its mask, to document per-country masking and a country with two lengths.
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
