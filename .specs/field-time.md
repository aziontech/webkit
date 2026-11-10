---
name: field-time
category: inputs
structure: monolithic
status: implemented
checksum: 6f474ab55b6c9577f054b600b972ff28291de9922bad8ae0134e25eaae245b2a
spec_version: 1
created: 2026-11-10
last_updated: 2026-11-10
---

# FieldTime — Component Spec

## Purpose

Form field for entering a time of day in 24-hour notation (`HH:mm` or `HH:mm:ss`). It stacks `Label`, `Input`, and `HelperText` the same way `FieldText` does, and adds a masked text input: the user types digits, the field inserts the `:` separators, and it checks hours (00–23), minutes and seconds (00–59). It is a masked text input, not a native `type="time"`, so the control looks and behaves the same in every browser and matches the other fields. Use it for schedules, maintenance windows, cron-style start times, and any value that is a clock time with no date.

## When to use

- A time of day with no date: schedule start, maintenance window, daily report time, purge time.
- Console forms where the value is stored as a 24-hour `HH:mm` or `HH:mm:ss` string.
- Times that need second precision (`format="hh:mm:ss"`), such as log filters or exact trigger times.

## When NOT to use

- The value is a date, or a date and a time → use `calendar`.
- The value is a duration or interval (minutes, seconds, TTL) → use `number-input`.
- The value is a full cron expression or any other free-form schedule → use `field-text`.
- The user chooses from a short fixed list of times (every hour, 00:00 / 06:00 / 12:00) → use `field-select`.

## Related

- `field-text` — the plain text field this one mirrors: same props, same helper behavior, same `Label` → control → `HelperText` stack.
- `input` — the input this field wraps; it owns the border, height, focus ring, and the readonly and disabled looks.
- `field-phone-number` — the other masked field; same approach: the mask is applied as the user types and lives in a local helper.
- `calendar` — use it when a date is involved.
- `helper-text` — the hint and error row under the input.

## Best practices

- `v-model` holds the text exactly as the field shows it (`'09:3'` while typing, `'09:30'` when done). Before you save it, check that it is complete and in range: `/^([01]\d|2[0-3]):[0-5]\d$/` for `hh:mm`, `/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/` for `hh:mm:ss`. The field shows the error, but it does not stop an invalid value from reaching the model.
- `required` paints the warning border and the required helper on first render. Bind it to a submit state (`:required="submitted && !time"`), not as a bare attribute.
- Leave `helperText` empty to get the built-in format hint ("24-hour, HH:MM"). Pass `helperText` to replace it, for example with translated copy or a validation message.
- Seed `v-model` with zero-padded values (`'09:30'`, not `'9:30'`) that match `format`. Any other shape is re-masked for display and shows as invalid.
- Keep `size` the same as the sibling fields in the same form. It defaults to `medium`.
- Time zones are out of scope. The field holds a wall-clock time. State the zone in the label or the helper (for example "UTC") when it matters.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import FieldTime from '@aziontech/webkit/field-time'

  const startTime = ref('')
</script>

<template>
  <FieldTime
    v-model="startTime"
    label="Start time"
    name="startTime"
  />
</template>
```

## Props

| Prop          | Type                             | Default    | Required | JSDoc                                                                                                                                                                                                                                          |
| ------------- | -------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `format`      | `'hh:mm' \| 'hh:mm:ss'`          | `'hh:mm'`  | false    | Time format, always 24-hour. `hh:mm` accepts hours and minutes (5 characters). `hh:mm:ss` adds seconds (8 characters). Drives the mask, the input's `maxlength`, the placeholder fallback, and the format hint. Exported as `FieldTimeFormat`. |
| `label`       | `string`                         | `''`       | false    | Text rendered inside the `Label`. When empty, the label row is omitted.                                                                                                                                                                        |
| `placeholder` | `string`                         | `''`       | false    | Placeholder forwarded to the `Input`. When empty, it falls back to the format in upper case: `HH:MM` for `hh:mm`, `HH:MM:SS` for `hh:mm:ss`.                                                                                                   |
| `helperText`  | `string`                         | `''`       | false    | Text rendered inside `HelperText`. When empty, the helper row shows the format hint instead ("24-hour, HH:MM" or "24-hour, HH:MM:SS"), so the row is always present. A non-empty value replaces the hint.                                      |
| `size`        | `'small' \| 'medium' \| 'large'` | `'medium'` | false    | Size forwarded to the `Input`. Heights: small=28px, medium=32px, large=40px. Exported as `FieldTimeSize`.                                                                                                                                      |
| `disabled`    | `boolean`                        | `false`    | false    | Disables the input and switches the helper to `kind="disabled"` (lock icon).                                                                                                                                                                   |
| `readonly`    | `boolean`                        | `false`    | false    | Marks the input read-only: the value is visible, focusable, and copyable, but not editable. The input renders transparent with a dashed border, as `Input` does.                                                                               |
| `required`    | `boolean`                        | `false`    | false    | Adds the `Required` tag to the `Label` and sets native `required` and `aria-required` on the input.                                                                                                                                            |
| `invalid`     | `boolean`                        | `false`    | false    | Forces the invalid state: switches the helper to `kind="invalid"` and applies the invalid border on the input. The field also turns invalid on its own when the time is out of range (see States).                                             |
| `inputId`     | `string`                         | `''`       | false    | id for the native input. `Label` uses it via `for`, and the `aria-describedby` wiring builds on it. When empty, the component generates an id with `useId()`.                                                                                  |
| `name`        | `string`                         | `''`       | false    | HTML name for the underlying input (form and vee-validate integration).                                                                                                                                                                        |

Exported types: `FieldTimeFormat` (`'hh:mm' | 'hh:mm:ss'`) and `FieldTimeSize` (`'small' | 'medium' | 'large'`).

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                                                                                                                                                                                                                           |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The masked text exactly as the field shows it: `''` when empty, partial while typing (`'0'`, `'09'`, `'09:3'`), complete as `'HH:mm'` or `'HH:mm:ss'` (24-hour, zero-padded). Updates on every input event that changes the masked text. Declared with `defineModel<string>({ default: '' })`, so the field also works unbound. |

Masking rules, applied on every input event:

1. Strip every character that is not a digit or `:`.
2. A one-digit segment followed by `:` is left-padded with `0`, so typing `9:30` produces `09:30`.
3. Drop the remaining `:` characters, keep at most 4 digits (`hh:mm`) or 6 digits (`hh:mm:ss`), and insert `:` after the 2nd and 4th digit. A `:` is inserted only when a digit follows it, so the field never ends in a trailing `:` and Backspace deletes naturally.
4. If the masked text differs from what is in the input, write it back to the input and keep the caret after the same number of digits.

The mask does not clamp or reject digits that are out of range. `25:61` stays as typed, and the field shows it as invalid, so the user sees what they entered. A value set by the consumer goes through the same masking for display, but the model is not rewritten until the user types. The field emits nothing on mount.

The mask is plain string logic in a local helper inside the component folder. It is not a public export and uses no mask library.

## Events

| _none_ | — | — |

The only change signal is `update:modelValue`, generated by `defineModel` (see v-model), as in `FieldText`.

## Slots

_none_ — the affordance is fixed: a leading `pi pi-clock` icon rendered into `Input#iconLeft`, and no trailing slot. Consumers who need another adornment compose `label` + `input` + `helper-text` themselves.

## States

- Visual states: `empty` (placeholder visible), `filled`, `required`, `invalid`, `disabled`, `readonly`. Empty and filled are expressed by the value and the placeholder and have no data attribute. Hover, focus ring, readonly, and disabled looks are owned by `Input`.
- **Format error, computed by the field.** The time is invalid when either:
  - the text is complete and any segment is out of range (hours > 23, minutes or seconds > 59). This shows at once, while typing; or
  - the text is non-empty but incomplete when the input loses focus. This shows from that blur until the text becomes complete and in range, or empty.
- An empty field is never a format error. Emptiness is the job of `required`, bound to the submit state.
- **Effective invalid** = the `invalid` prop OR the format error. It drives `Input`'s `invalid` (danger border plus `aria-invalid`), `data-invalid` on the root, and the helper kind.
- `HelperText.kind` precedence: `disabled > invalid > required > 'helper'`. On a format error with an empty `helperText`, the format hint itself turns into the error message ("24-hour, HH:MM" in invalid tone). The field writes no other copy.
- Root `data-*`: `data-size` mirrors `size`, `data-format` mirrors `format`, `data-disabled` mirrors `disabled`, `data-readonly` mirrors `readonly`, `data-required` mirrors `required`, and `data-invalid` mirrors effective invalid.
- While `disabled` or `readonly`, the format check still runs on the displayed value, but the blur rule cannot trigger because the user cannot edit.

## Motion & Animations

| Trigger                                            | Animation / Transition | Token | Reduced-motion fallback |
| -------------------------------------------------- | ---------------------- | ----- | ----------------------- |
| _none_ — motion is owned by the underlying `Input` | —                      | —     | —                       |

## Tokens

| Region                                    | Token (DESIGN.md)   |
| ----------------------------------------- | ------------------- |
| gap (between label / input / helper rows) | `var(--spacing-xs)` |

Typography, color, border, height, focus-ring, and clock-icon (`var(--text-muted)`) tokens are owned by the children (`Label`, `Input`, `HelperText`) and are not redeclared here.

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: owned by `Input` (`focus-within` ring with `var(--ring-color)` and the ring offset).
- Label association: the `Label`'s native `<label>` is wired to the input with `for="<inputId>"`. When `inputId` is empty, the id comes from `useId()`.
- Description: the helper row is always present (consumer copy or the format hint), so the input always has `aria-describedby="<inputId>-helper"`. Screen readers announce the expected format ("24-hour, HH:MM") before the user types.
- Input semantics: `type="text"`, `inputmode="numeric"` (numeric keypad on touch devices), and `maxlength` 5 (`hh:mm`) or 8 (`hh:mm:ss`). No `autocomplete`, so `Input`'s default keeps password managers off the field. No `role` override: it is a plain text input.
- Keyboard map: `Tab` / `Shift+Tab` move focus in and out. Digits type into the mask. `:` is accepted and pads the segment before it. Backspace and Delete edit normally. There is no arrow-key stepping.
- `required` sets native `required` and `aria-required="true"`; the Required tag lives on the `Label`. Effective invalid sets `aria-invalid="true"`, and the helper carries the human-readable message.
- The clock icon is decorative: `Input` renders the `iconLeft` slot inside an `aria-hidden="true"` wrapper.
- When `disabled`, the input is disabled and the helper shows the lock icon next to the hint or the consumer copy.
- Contrast ≥4.5:1 (text) and ≥3:1 (icon), including the disabled, readonly, and invalid states, inherited from the children's tokens.
- Touch target: `Input` owns the hit area, ≥40×40 px at `size="large"`.

## Stories (Storybook)

- Default — `label='Start time'`, empty value, `format='hh:mm'`; shows the placeholder fallback (`HH:MM`) and the built-in format hint.
- With seconds — `format='hh:mm:ss'` with a value of `'14:05:30'`; shows the longer mask, the `HH:MM:SS` placeholder fallback, and the matching hint.
- Invalid — a value of `'25:70'` (out of range), so the field's own format error is visible: danger border plus the hint in invalid tone.
- Disabled — `disabled=true` with a value of `'09:30'`; shows the lock-icon helper and the disabled input tokens.

Why these four instead of the template layout: the component has no `kind`, so `Types` does not apply. `With seconds` stands in for `Types` on the one variant axis that is specific to this field (`format`). `Invalid` is required because the format error is behavior the field owns, not just a prop it forwards. `Sizes` is left out on purpose: the size axis is forwarded unchanged to `Input` and is already documented on `FieldText` (see Open questions).

## Open questions

- **Exposing completeness.** The model mirrors partial text, so consumers have to check completeness with a regex before saving. `FieldPhoneNumber` solves this with a one-way `update:phone` snapshot (`{ complete, ... }`). Should `FieldTime` add an `update:time` snapshot (`{ value, complete, valid }`), or a model that only emits complete, valid values? The current choice keeps `FieldText`'s single event, as the brief asked.
- **No blur event.** `FieldText` emits no `blur`, and `$attrs` land on the wrapper `<div>`, where a `@blur` listener never fires because blur does not bubble. Validate-on-blur forms have no hook. Add a `blur` event to the field family, or keep none?
- **Format token casing.** `'hh:mm'` follows the brief and AWS Cloudscape. In date-fns and Day.js, `hh` means a 12-hour clock, and `HH` means 24-hour. Confirm the lowercase literals, or switch to `'HH:mm' | 'HH:mm:ss'` before approval.
- **Hint localization and opt-out.** The format hint is fixed English copy, and the only way to change it is a non-empty `helperText`. There is no way to render no helper row. Is that acceptable, or does the hint need its own prop (for example `formatHint`)?
- **Mismatched seed values.** A seed in the wrong shape (`'9:30'`, or `'12:30:45'` with `format='hh:mm'`) is re-masked for display and the model is left untouched until the user types. Should the field normalize and emit once on mount instead?
- **Sizes story.** The template asks for a `Sizes` composite whenever `size` has more than one value. The brief listed four stories without it. Add `Sizes` (next to a `FieldText` of the same size, as `FieldPhoneNumber` does) if reviewers want it.
- **12-hour input.** It is out of scope (the console convention is 24-hour). If it is ever needed, it would be a new `format` value, not a separate component.

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
