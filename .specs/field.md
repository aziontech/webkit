---
name: field
category: inputs
structure: composition
status: implemented
spec_version: 1
checksum: 586f6ef2618e067c2661545443a35d1c328a2df72f6e58374e61ff2d9b7c979e
created: 2026-11-10
last_updated: 2026-11-11
---

# Field — Component Spec

## Purpose

One composable form field that wraps **any** control — `Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput`, `PasswordInput`, `PhoneInput`, `InputGroup`, `Checkbox`, `RadioButton`, `Switch`, `Slider` — with its label, description and error. The root `Field` owns the field state (`invalid`, `disabled`, `required`) and the ids, and shares them through `provide`/`inject`: the control picks up its `id`, `aria-describedby`, `aria-invalid`, `disabled` and `required` from the Field, `Field.Label` points its `for` at the control and shows the Required marker, and `Field.Description` / `Field.Error` register themselves so the control is described by them. Grouping parts (`Field.Set`, `Field.Legend`, `Field.Group`, `Field.Content`, `Field.Title`, `Field.Separator`) build fieldsets, choice cards and settings rows. It replaces the v5 `field-*` family (`field-text`, `field-select`, `field-checkbox-block`, …), one wrapper per control, with a single anatomy.

## When to use

- Any labelled form control: a text input, a select, a textarea, a password, a phone number, a slider.
- A checkbox, radio or switch with its label beside it (`orientation="horizontal"`).
- A selectable choice card: `Field.Label` wrapping a horizontal `Field` (replaces the v5 `*-block` variants).
- A group of related controls under one caption (`Field.Set` + `Field.Legend`), or a form section (`Field.Group`).

## When NOT to use

- A control with no visible label inside a toolbar or a table cell → render the control alone with an `aria-label`.
- A group of mutually exclusive cards with icons → use `radio-cards`.
- A static key/value read-out → use `key-value-pairs`.

## Related

- `label` — the standalone label; `Field.Label` adds the `for` wiring and the Required marker from the Field.
- `helper-text` — the tone-aware helper line that `Field.Description` and `Field.Error` render.
- `input-group` — wraps an input with addons; put it inside a `Field` and use `InputGroup.Input` as the control.
- `phone-input`, `password-requirements` — the controls that replaced `field-phone-number` and the requirements row of `field-password`.

## Best practices

- Put the state on the `Field`, not on the control: `<Field invalid>` sets `aria-invalid` on the control and the invalid tone on `Field.Description`.
- Let the Field own the ids. Pass an explicit `id` on the control and `for` on `Field.Label` only when another part of the page needs the id (focusing the first invalid field, an error summary link).
- Render `Field.Description` for guidance and `Field.Error` for a validation message; both are announced through `aria-describedby`. `Field.Error` has `role="alert"`, so render it only when there is an error.
- Choice cards: `<Field.Label><Field orientation="horizontal">control + Field.Content</Field></Field.Label>`. Never nest a choice card inside another `Field`; group cards with `Field.Set`.
- Use `orientation="responsive"` for settings rows that stack in a narrow container and sit side by side in a wide one; it follows the nearest container (a `Field.Group`, a Card, a dialog or drawer body).

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Checkbox from '@aziontech/webkit/checkbox'

  const name = ref('')
  const terms = ref(false)
</script>

<template>
  <Field.Set>
    <Field.Legend>Account</Field.Legend>
    <Field.Description>Shown on invoices.</Field.Description>
    <Field.Group>
      <Field
        required
        :invalid="!name"
      >
        <Field.Label>Name</Field.Label>
        <Input
          v-model="name"
          autocomplete="name"
        />
        <Field.Description>Your full legal name.</Field.Description>
        <Field.Error v-if="!name">Enter your name.</Field.Error>
      </Field>
      <Field.Separator>Or</Field.Separator>
      <Field.Label>
        <Field orientation="horizontal">
          <Checkbox
            v-model="terms"
            binary
          />
          <Field.Content>
            <Field.Title>Accept the terms</Field.Title>
            <Field.Description>You can withdraw at any time.</Field.Description>
          </Field.Content>
        </Field>
      </Field.Label>
    </Field.Group>
  </Field.Set>
</template>
```

Tree-shaking alternative — the standalone root + each part from its own entry (no `Object.assign` compound pulled in):

```vue
<script setup>
  import Field from '@aziontech/webkit/field-root'
  import FieldLabel from '@aziontech/webkit/field-label'
  import FieldDescription from '@aziontech/webkit/field-description'
  import FieldError from '@aziontech/webkit/field-error'
  import FieldGroup from '@aziontech/webkit/field-group'
  import FieldSet from '@aziontech/webkit/field-set'
  import FieldLegend from '@aziontech/webkit/field-legend'
  import FieldContent from '@aziontech/webkit/field-content'
  import FieldTitle from '@aziontech/webkit/field-title'
  import FieldSeparator from '@aziontech/webkit/field-separator'
</script>
```

## Sub-components

The root `Field` provides `fieldContextKey` (`injection-key.ts`): a generated `controlId`, the reactive `invalid` / `disabled` / `required` flags, `describedBy` (the ids of the mounted `Field.Description` and `Field.Error` parts), `labelledBy` (the ids of the mounted `Field.Title` parts) and `register`. Controls read it through the shared `useFieldControl` composable (`src/composables/use-field-control`); an explicit prop or attribute on the control always wins over the Field. Composite controls (`Select`, `MultiSelect`, `PhoneInput`) consume the context on their root and provide `null` below it, so their inner search inputs never take the field id. Every part works outside a `Field` too (it then reads no state). Member names mirror the anatomy; there is no `Trigger`/`Content` pair because the field has no open/closed state.

- `field-label/field-label.vue` — `<label>` whose `for` defaults to the Field's `controlId`; appends the Required marker (`*` + "(Required)") when the Field is `required`, and a `Hint` glyph when `hint` is set. When it wraps a `Field` it becomes a selectable card (border, padding, hover, focus ring, selected tokens when the control inside is `data-checked`).
  - Props: `hint` (`string`, default `''`) — short explanation revealed by a `Hint` glyph.
  - Events: _none_.
  - Slots: `default` — label text, or a horizontal `Field` for a choice card.
- `field-description/field-description.vue` — guidance line rendered through `HelperText`; registers its id with the Field. Tone follows the Field: `disabled` (lock icon) > `invalid` (only when no `Field.Error` is mounted) > `required` > `helper`.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-error/field-error.vue` — validation message rendered through `HelperText kind="invalid"` with `role="alert"`; registers its id with the Field.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-group/field-group.vue` — vertical stack of fields; it is a `@container/field-group`, one of the containers `orientation="responsive"` can follow.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-set/field-set.vue` — native `<fieldset>` without browser chrome, for a group of related fields or choices.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-legend/field-legend.vue` — native `<legend>` captioning a `Field.Set`.
  - Props: `kind` (`'legend' \| 'label'`, default `'legend'`) — `legend` titles a section, `label` matches a `Field.Label` for a group of choices.
  - Events: _none_. Slots: `default`.
- `field-content/field-content.vue` — column that holds the label/title and descriptions beside a control in a horizontal Field.
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-title/field-title.vue` — title inside a choice card; registers its id with the Field so the card's `Checkbox`, `RadioButton` or `Switch` is named by it through `aria-labelledby` (the wrapping `Field.Label` makes the whole card the click target).
  - Props: _none_. Events: _none_. Slots: `default`.
- `field-separator/field-separator.vue` — horizontal rule between fields, with optional centred text.
  - Props: _none_. Events: _none_. Slots: `default` — optional text.

<!-- Resulting layout:

  packages/webkit/src/components/inputs/field/
  ├── field.vue
  ├── index.ts
  ├── injection-key.ts
  ├── field-label/field-label.vue
  ├── field-description/field-description.vue
  ├── field-error/field-error.vue
  ├── field-group/field-group.vue
  ├── field-set/field-set.vue
  ├── field-legend/field-legend.vue
  ├── field-content/field-content.vue
  ├── field-title/field-title.vue
  └── field-separator/field-separator.vue

  `./field` → index.ts; `./field-root` → field.vue; each part flat (`./field-label`). -->

## Props

| Prop          | Type                                         | Default      | Required | JSDoc                                                                                                                                                  |
| ------------- | -------------------------------------------- | ------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `orientation` | `'vertical' \| 'horizontal' \| 'responsive'` | `'vertical'` | false    | Layout axis: label above the control, beside it, or beside it once the enclosing container (a FieldGroup, Card, drawer or dialog body) is wide enough. |
| `invalid`     | `boolean`                                    | `false`      | false    | Marks the field invalid: the control sets aria-invalid and FieldDescription switches to the invalid tone.                                              |
| `disabled`    | `boolean`                                    | `false`      | false    | Disables the wrapped control and dims the field.                                                                                                       |
| `required`    | `boolean`                                    | `false`      | false    | Shows the Required marker on FieldLabel and sets required on the wrapped control.                                                                      |

## Events

| Event | Payload | Notes |
| ----- | ------- | ----- |

## Slots

| Slot      | Scope | Notes                                                                                                                         |
| --------- | ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | `Field.Label`, the control, `Field.Description`, `Field.Error` (or `Field.Content` beside the control in a horizontal field). |

## States

- Visual states: `default`, `disabled`, `invalid`, `required`
- `data-orientation`: `vertical` | `horizontal` | `responsive`
- `data-invalid`, `data-disabled`, `data-required` mirror the props on the root
- `data-slot` identifies every part (`field`, `field-label`, `field-description`, `field-error`, `field-group`, `field-set`, `field-legend`, `field-content`, `field-title`, `field-separator`)
- Responsive: `orientation="responsive"` queries the nearest container (`@md:`), not only `Field.Group`: inside a Card, a drawer or dialog body (`@container/panel`), a settings section or a `Field.Group` it stacks the label above the control in a narrow box and puts them side by side from `@md`. With no container ancestor it stays vertical.

## Motion & Animations

| Trigger                 | Animation / Transition                    | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ----------------------- | ----------------------------------------- | ------------------------------------------------- | ------------------------------- |
| choice card hover/focus | `transition-colors duration-150 ease-out` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                | Token (DESIGN.md)        |
| --------------------- | ------------------------ |
| field gap             | `var(--spacing-xs)`      |
| group gap             | `var(--spacing-lg)`      |
| set gap               | `var(--spacing-md)`      |
| content gap           | `var(--spacing-xxs)`     |
| label typography      | `.text-label-sm`         |
| legend typography     | `.text-label-md`         |
| title typography      | `.text-body-sm`          |
| label text            | `var(--text-default)`    |
| muted text            | `var(--text-muted)`      |
| required marker       | `var(--primary)`         |
| card border           | `var(--border-muted)`    |
| card selected border  | `var(--border-selected)` |
| card selected surface | `var(--bg-selected)`     |
| card surface          | `var(--bg-surface)`      |
| card hover            | `var(--bg-hover)`        |
| card shape            | `var(--shape-button)`    |
| card padding          | `var(--spacing-sm)`      |
| separator line        | `var(--border-default)`  |
| focus ring            | `var(--ring-color)`      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the control keeps its own ring; a choice card shows `has-[:focus-visible]:ring-2 ring-(--ring-color) ring-offset-1 ring-offset-(--bg-canvas)` around the whole card.
- Keyboard map: the Field adds no keys; `Tab` reaches the control, and clicking `Field.Label` focuses or toggles it.
- ARIA: root `role="group"`; `Field.Label` `for` → control `id`; control `aria-describedby` → every mounted `Field.Description` and `Field.Error` id; control `aria-invalid` when the Field is `invalid`; `required` / `aria-required` when it is `required`; `Field.Error` `role="alert"`; `Field.Set` is a native `fieldset` named by its `legend`; the Required marker's `*` is `aria-hidden` and the word "(Required)" is read.
- Contrast ≥4.5:1 for label, description and error text in every tone, including disabled.
- `motion-reduce:transition-none` on the choice card transition.
- Touch target: the whole choice card is the target; a horizontal Field's label extends the control's target.

## Examples

The field's examples live in `packages/webkit/examples/field/` and render on the docs site (`/components/<name>`):

- Default — label, input, description.
- DescriptionAndError — a required, invalid field with both a description and an error.
- Horizontal — checkbox and switch beside their labels.
- ChoiceCard — checkbox and switch choice cards (the v5 `*-block` variants).
- Fieldset — `Field.Set` + `Field.Legend` grouping radio choices and fields.
- InputGroup — `InputGroup` + `InputGroup.Input` inside a Field.

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
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
