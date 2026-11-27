---
name: phone-input
category: input
structure: monolithic
status: implemented
spec_version: 7
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2048-5713
  node_id: 2048:5713
checksum: e3722ddfc5fcfaa6a527b8fdcb5db9ed586fcc92fdb21a86fd77dd018f820987
created: 2026-11-10
last_updated: 2026-11-25
---

# PhoneInput — Component Spec

## Purpose

International phone-number control: an `InputGroup` with a searchable country `Select` on the left (the closed trigger shows the selected country's flag, its name and, at the end, its dial code, like a row of the list) and a `type="tel"` input on the right that applies the selected country's mask as the user types and accepts exactly the lengths that country allows. Two v-models (`v-model` for the national digits, `v-model:country` for the ISO 3166-1 alpha-2 code) carry the editable state; the one-way `phone-change` event hands the form the full E.164 number and whether it is complete. It carries no label or helper text: wrap it in a `Field` (`Field.Label` + `PhoneInput` + `Field.Description`), and it picks up `id`, `aria-describedby`, `invalid`, `disabled` and `required` from the Field.

## When to use

- International phone entry where the user picks a country and types the national number with that country's mask.
- Forms that need the full E.164 number and whether it is complete, without per-country length rules in the form.

## When NOT to use

- The value may include characters the masks reject (extensions, free-form notes) → use `input`.
- The input needs addons other than the dial code → use `input-group` and compose it yourself.

## Related

- `field` — wraps the control with its label, description and error.
- `input-group` — the container this control renders around the dial-code select and the input.
- `select` — the dial-code picker inside the group.

## Best practices

- Put it in a `Field` with a `Field.Label`; the label targets the tel input.
- `v-model` holds the national digits only; read `number` from the `phone-change` payload when you need the E.164 value.
- Use `complete` from `phone-change` to decide `invalid` and the `Field.Error` on submit; the control shows no incomplete-number message of its own.
- The field starts on the United States. Set `default-country` to start on another country (an ISO 3166-1 alpha-2 code from `countries`), or bind `v-model:country` when the form owns the country.
- `searchPlaceholder` and `noMatch` default to English; pass translated copy in localized UIs.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import PhoneInput from '@aziontech/webkit/phone-input'

  const digits = ref('')
  const country = ref('US')
  const phone = ref(null)
</script>

<template>
  <Field required>
    <Field.Label>Phone</Field.Label>
    <PhoneInput
      v-model="digits"
      v-model:country="country"
      @phone-change="phone = $event"
    />
    <Field.Description>We'll use this to send the verification code.</Field.Description>
  </Field>
</template>
```

## Props

| Prop                | Type                             | Default                     | Required | JSDoc                                                                                                                                                                                                                                                       |
| ------------------- | -------------------------------- | --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `countries`         | `PhoneInputCountry[]`            | (built-in list — see Notes) | false    | Countries offered by the dial-code Select. When omitted, uses the built-in list of every region, in alphabetical order.                                                                                                                                                                    |
| `defaultCountry`    | `string`                         | `'US'`                      | false    | ISO 3166-1 alpha-2 code of the country selected at first, while `v-model:country` is empty. A code missing from `countries` falls back to US, then to the first country of the list.                                                                                    |
| `placeholder`       | `string`                         | `''`                        | false    | Placeholder of the tel input; empty shows none (never the national mask, per the example-data rule).                                                                                                                                                     |
| `size`              | `'small' \| 'medium' \| 'large'` | `'medium'`                  | false    | Size forwarded to the InputGroup and the dial-code Select trigger. Heights: small=28px, medium=32px, large=40px.                                                                                                                                            |
| `disabled`          | `boolean`                        | `false`                     | false    | Disables both the dial-code Select and the internal input.                                                                                                                                                                                                  |
| `readonly`          | `boolean`                        | `false`                     | false    | Marks the internal input read-only; dial-code Select is also disabled while readonly.                                                                                                                                                                       |
| `required`          | `boolean`                        | `false`                     | false    | Sets required and aria-required on the phone number input; it draws no border of its own.                                                                                                                                                                   |
| `invalid`           | `boolean`                        | `false`                     | false    | Applies the invalid border on the InputGroup and sets aria-invalid on the input.                                                                                                                                                                            |
| `name`              | `string`                         | `''`                        | false    | Form field name. Set, a hidden input submits the full E.164 number (dial code followed by the digits, empty while there are none) under this name; the visible input carries no name, so a native `form` never posts a national number without its country. |
| `searchPlaceholder` | `string`                         | `''`                        | false    | Placeholder of the search box that filters the dial-code list. Empty uses the locale catalog (`Search country`).                                                                                                                                            |
| `noMatch`           | `string`                         | `''`                        | false    | Shown in the dial-code list, and announced, when no country matches the search. Empty uses the locale catalog (`No country found.`).                                                                                                                        |

Notes on the built-in `countries` list: it offers every country and territory with a calling code — the 245 regions of Google's libphonenumber metadata (libphonenumber-js 1.13.16) — with the dial code each one uses (several share one: `+1` for the United States, Canada and the Caribbean numbering plan, `+44` for the United Kingdom, Guernsey, Jersey and the Isle of Man, `+7` for Russia and Kazakhstan). Every region, Brazil and the United States included, sits in English alphabetical order of its name; there is no pinned shortlist, so a scan from the top always reads A to Z. Names are plain English (`and`, never `&`; `Saint`, never `St.`; `Congo (DRC)` and `Congo`). The masks of the 34 countries the list had before 6.0 are kept as reviewed; every other region takes its national number lengths for mobile and fixed-line numbers from libphonenumber, formatted like its example mobile number where libphonenumber gives one and in groups of three or four digits otherwise. Consumers who need a different set pass a custom `countries` array. The list lives in a co-located `countries.ts` inside the component folder; it is data, not a public export. Every region has a flag in the sprite (`src/images/country-flags.webp`, drawn from the MIT-licensed `country-flag-icons` 3x2 set), which also backs `@aziontech/webkit/styles/country-flags`.

Masks: `#` is a digit slot and every other character is a literal. Digits are always the **national significant number** — no dial code, no trunk prefix (`0`) — so `dialCode + digits` is the E.164 number. With several masks, the field formats with the shortest mask whose slot count covers the digits typed so far, caps input at the longest mask's slot count, and treats the number as complete when its digit count equals one of the masks' slot counts. The mask formats the number as it is typed; it is never shown as a placeholder.

## v-model

| Model             | Type     | Default | Emits               | Notes                                                                                                                                                                                                                                                                                                                                      |
| ----------------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model`         | `string` | `''`    | `update:modelValue` | National number as **digits only**, without dial code and without mask characters (e.g. `'4155550100'`). Updates on input when the digits change, and when a country switch truncates digits beyond the new country's capacity. Via `defineModel`, so the field also works unbound.                                                        |
| `v-model:country` | `string` | `''`    | `update:country`    | ISO 3166-1 alpha-2 code of the selected country (e.g. `'US'`, `'GB'`, `'BR'`). While it is empty (`''`) the field shows `defaultCountry`. Drives the flag, name and dial code shown in the `Select` trigger and the masks applied to the input. Via `defineModel`, so picking a country works even when the consumer binds only `v-model`. |

## Events

| Event          | Payload                    | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `phone-change` | `[value: PhoneInputValue]` | One-way snapshot of the number, emitted once on mount and again whenever the digits or the country change. `PhoneInputValue` (exported from the component) is `{ country: string; dialCode: string; digits: string; number: string; complete: boolean }`: `number` is the full E.164 number (`dialCode + digits`, e.g. `'+14155550100'`; `''` while empty) and `complete` is true when the digit count is one the selected country allows. Not a v-model — the field never reads it back. |

## Slots

| Slot | Scope | Notes |
| ---- | ----- | ----- |

## States

- Visual states delegated to `InputGroup`: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`.
- `invalid`, `disabled` and `required` combine the prop with the enclosing `Field`.
- The dial-code `Select` is disabled whenever the control is `disabled` **or** `readonly`.
- The closed trigger mirrors a row of the list: the country's flag in the trigger's `#leading` slot, its name as the value (truncated with an ellipsis when the trigger is narrow), and its dial code in muted text in the trigger's `#trailing` slot at the inline end, which never shrinks. The country part sizes to its content and takes at most 60% of the field, so the number keeps at least 40%.
- Narrow fields: the root is a size container (`@container/phone-input`); below 21rem (336px) the trigger hides the country name (`data-slot="value"`) and shows only the flag and the dial code, so phones from 320 to 430px keep room to type the number. The open list always shows the full names, and the trigger keeps its accessible name.
- Completeness is reported through `phone-change`, never rendered.
- Searching the dial-code list announces the outcome through the shared polite live region (`useAnnouncer`): the number of countries that match (`phoneInput.results`), or the `noMatch` text when none does. The no-match line in the list is plain text; it is not a live region of its own.
- Parts carry `data-slot`: `input` (the tel input), `flag` and `dial-code` (the closed trigger), `no-match` (the empty line of the list).
- The value logic (selected country, mask, E.164 snapshot, digit cap) lives in `composables/use-phone-input-value.ts`, the country list in `lib/country-data.ts` and the mask functions in `lib/phone-mask.ts`; `PhoneInputValue` and `PhoneInputCountry` are still exported from the component.
- The flag sprite (`country-flags.png`, about 80 KB) loads with a dynamic `import()` after the field mounts in the browser (never on the server), so the closed trigger can show the selected flag; until it arrives the flag boxes stay blank. It is one shared request for every PhoneInput on the page.

## Motion & Animations

_none_ — motion is owned by `InputGroup` (colour transitions) and `Select` (dropdown open/close).

## Tokens

| Region            | Token (TOKENS.md)     |
| ----------------- | --------------------- |
| input text        | `var(--text-default)` |
| input placeholder | `var(--text-muted)`   |
| input padding.x   | `var(--spacing-md)`   |
| input typography  | `.text-label-sm`      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the `InputGroup` focus-within ring.
- Keyboard map: `Tab` moves from the dial-code `Select` to the tel input; inside the `Select`, arrows navigate, typing filters, `Enter` picks and returns focus to the input, `Esc` closes.
- ARIA: the tel input has `type="tel"`, `inputmode="tel"`, `autocomplete="tel-national"`, `aria-invalid`, `aria-required`, the `id` / `aria-describedby` of the enclosing `Field`, and the consumer's `aria-label` / `aria-labelledby` when it sits outside a `Field` (they name the number field, never the wrapper); the dial-code trigger has `aria-label="PhoneInputCountry dial code"`. The control provides an empty Field context below it so the inner search input never takes the field id.
- Contrast ≥4.5:1 for input and dial-code text.
- Touch target: the field is drawn 28 / 32 / 40 px tall by `size`; on a coarse pointer the number field carries an invisible `aria-hidden` layer (`data-slot="touch-target"`, shown only under `pointer-coarse:`) that extends its hit area to at least 44 px tall past the `InputGroup` frame, and a press on it focuses the field (not when disabled). The dial-code trigger carries the `Select` trigger's own touch target.
- Direction: the tel input, each option's dial code and the closed trigger's dial code (a `dir="ltr"` span in the trigger's `#trailing` slot) render left-to-right, so a number and its `+` keep their order on a right-to-left page; the typed number still aligns to the inline start of the page (`rtl:text-end`, which resolves against the input's own `ltr` direction).

## Responsive

- Touch: on coarse pointers (`pointer-coarse:`) the typed text steps up to 16 px (`text-body-md`; `text-label-code-lg` in the code face), so iOS Safari does not zoom the page when the field takes focus; fine pointers keep the dense size.

## Examples

The examples in `packages/webkit/examples/phone-input/` render on the docs site (`/components/<name>`):

- Default — inside a `Field` with a label and description.
- DefaultCountry — the field starting on another country with `default-country`; justified because `defaultCountry` changes which country and mask the field opens with.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
