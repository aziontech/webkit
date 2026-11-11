---
name: phone-input
category: inputs
structure: monolithic
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2048-5713
  node_id: 2048:5713
checksum: c3bad1bc02ad8061d04ea41c522129ae96b1ceca9277232343acd757af734d52
created: 2026-11-10
last_updated: 2026-11-11
---

# PhoneInput — Component Spec

## Purpose

International phone-number control: an `InputGroup` with a searchable dial-code `Select` on the left and a `type="tel"` input on the right that applies the selected country's mask as the user types and accepts exactly the lengths that country allows. Two v-models (`v-model` for the national digits, `v-model:country` for the ISO 3166-1 alpha-2 code) carry the editable state; the one-way `update:phone` event hands the form the full E.164 number and whether it is complete. It carries no label or helper text: wrap it in a `Field` (it replaces the v5 `field-phone-number`), and it picks up `id`, `aria-describedby`, `invalid`, `disabled` and `required` from the Field.

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
- `v-model` holds the national digits only; read `number` from the `update:phone` payload when you need the E.164 value.
- Use `complete` from `update:phone` to decide `invalid` and the `Field.Error` on submit; the control shows no incomplete-number message of its own.
- `v-model:country` defaults to `'BR'`; seed it with the user's country when you know it.
- `searchPlaceholder` and `searchEmptyLabel` default to English; pass translated copy in localized UIs.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import PhoneInput from '@aziontech/webkit/phone-input'

  const digits = ref('')
  const country = ref('BR')
  const phone = ref(null)
</script>

<template>
  <Field required>
    <Field.Label>Phone</Field.Label>
    <PhoneInput
      v-model="digits"
      v-model:country="country"
      @update:phone="phone = $event"
    />
    <Field.Description>We'll use this to send the verification code.</Field.Description>
  </Field>
</template>
```

## Props

| Prop                | Type                             | Default                     | Required | JSDoc                                                                                                               |
| ------------------- | -------------------------------- | --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `countries`         | `Country[]`                      | (built-in list — see Notes) | false    | Countries offered by the dial-code Select. When omitted, uses the built-in curated list.                            |
| `placeholder`       | `string`                         | `''`                        | false    | Placeholder of the tel input. Falls back to the selected country's mask when empty.                                 |
| `size`              | `'small' \| 'medium' \| 'large'` | `'medium'`                  | false    | Size forwarded to the InputGroup and the dial-code Select trigger. Heights: small=28px, medium=32px, large=40px.    |
| `disabled`          | `boolean`                        | `false`                     | false    | Disables both the dial-code Select and the internal input.                                                          |
| `readonly`          | `boolean`                        | `false`                     | false    | Marks the internal input read-only; dial-code Select is also disabled while readonly.                               |
| `required`          | `boolean`                        | `false`                     | false    | Applies the required border on the InputGroup and sets required on the input.                                       |
| `invalid`           | `boolean`                        | `false`                     | false    | Applies the invalid border on the InputGroup and sets aria-invalid on the input.                                    |
| `name`              | `string`                         | `''`                        | false    | HTML name for the internal input (form + vee-validate integration).                                                 |
| `searchPlaceholder` | `string`                         | `''`                        | false    | Placeholder of the search box that filters the dial-code list. Empty uses the locale catalog (`Search country`).    |
| `searchEmptyLabel`  | `string`                         | `''`                        | false    | Shown in the dial-code list when no country matches the search. Empty uses the locale catalog (`No country found`). |

Notes on the built-in `countries` list: the default set opens with the priority shortlist (BR, US, GB, PT, ES, AR, MX, CL, CO, DE, FR, IT — order preserved in the Select), continues with the rest of the supported countries in alphabetical order (AU, BE, BO, CA, CN, EC, IN, IE, IL, JP, NL, PY, PE, PL, SG, ZA, KR, CH, TR, AE, UY, VE). Countries outside the list are not offered. Consumers who need a different set pass a custom `countries` array. The list lives in a co-located `countries.ts` inside the component folder; it is data, not a public export.

Masks: `#` is a digit slot and every other character is a literal. Digits are always the **national significant number** — no dial code, no trunk prefix (`0`) — so `dialCode + digits` is the E.164 number. With several masks, the field formats with the shortest mask whose slot count covers the digits typed so far, caps input at the longest mask's slot count, and treats the number as complete when its digit count equals one of the masks' slot counts. The placeholder fallback is the longest mask with every slot shown as `9`.

## v-model

| Model             | Type     | Default | Emits               | Notes                                                                                                                                                                                                                                                                                |
| ----------------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model`         | `string` | `''`    | `update:modelValue` | National number as **digits only**, without dial code and without mask characters (e.g. `'11999999999'`). Updates on input when the digits change, and when a country switch truncates digits beyond the new country's capacity. Via `defineModel`, so the field also works unbound. |
| `v-model:country` | `string` | `'BR'`  | `update:country`    | ISO 3166-1 alpha-2 code of the selected country (e.g. `'BR'`, `'US'`, `'GB'`). Drives the dial code shown in the `Select` and the masks applied to the input. Via `defineModel`, so picking a country works even when the consumer binds only `v-model`.                             |

## Events

| Event          | Payload                | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `update:phone` | `[value: PhoneNumber]` | One-way snapshot of the number, emitted once on mount and again whenever the digits or the country change. `PhoneNumber` (exported from the component) is `{ country: string; dialCode: string; digits: string; number: string; complete: boolean }`: `number` is the full E.164 number (`dialCode + digits`, e.g. `'+5511999999999'`; `''` while empty) and `complete` is true when the digit count is one the selected country allows. Not a v-model — the field never reads it back. |

## Slots

| Slot | Scope | Notes |
| ---- | ----- | ----- |

## States

- Visual states delegated to `InputGroup`: `default`, `hover`, `focus-within`, `invalid`, `required`, `disabled`.
- `invalid`, `disabled` and `required` combine the prop with the enclosing `Field`.
- The dial-code `Select` is disabled whenever the control is `disabled` **or** `readonly`.
- Completeness is reported through `update:phone`, never rendered.

## Motion & Animations

_none_ — motion is owned by `InputGroup` (colour transitions) and `Select` (dropdown open/close).

## Tokens

| Region            | Token (DESIGN.md)     |
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
- ARIA: the tel input has `type="tel"`, `inputmode="tel"`, `autocomplete="tel-national"`, `aria-invalid`, `aria-required`, and the `id` / `aria-describedby` of the enclosing `Field`; the dial-code trigger has `aria-label="Country dial code"`. The control provides an empty Field context below it so the inner search input never takes the field id.
- Contrast ≥4.5:1 for input and dial-code text.
- Touch target follows the `size` (40px at `large`).

## Stories (Storybook)

The examples in `packages/webkit/examples/phone-input/` render in Storybook through the shared example stories:

- Default — inside a `Field` with a label and description.

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
