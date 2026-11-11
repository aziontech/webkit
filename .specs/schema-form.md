---
name: schema-form
category: inputs
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: aee5ea5aca31142f857256cd4831ae4f44921bbb3928c76f9538caf6d56703b8
created: 2026-11-11
last_updated: 2026-11-11
---

# SchemaForm — Component Spec

## Purpose

A form rendered from a JSON schema: each property of an object schema becomes a `Field` with its label, description, Required marker and control, and a nested object becomes a fieldset with its own legend. It edits one value object through `v-model`, seeds the schema's defaults, validates the supported draft-07 keywords with built-in messages (on leaving a field, or only after `validate()`), and shows server messages passed by field path. It is for forms whose fields are data (a function's arguments, an integration's settings), not for forms a designer lays out by hand.

## When to use

- A function, template or integration declares its own arguments as a JSON schema and the console must ask for them.
- The same settings form must follow a schema the server sends (fields added or removed without a release).
- A form of typed values (text, choices, numbers, switches, lists) with constraints that already live in a schema.

## When NOT to use

- A form with a fixed, designed layout (settings sections, create pages) → compose `field`, `input`, `select` and `switch` by hand (`platform/edit/edit-resource`, `platform/create/single-page-create`).
- Rows of key/value pairs the user adds and removes → use `attribute-editor`.
- Editing the schema itself, or raw JSON → use `code-editor`.
- A single choice or value → use the control directly inside a `field`.

## Related

- `field` — the wrapper every generated field uses; SchemaForm adds no field chrome of its own.
- `input`, `select`, `switch`, `textarea` — the controls it renders per type.
- `attribute-editor` — user-defined key/value rows, where SchemaForm renders a fixed set of keys.
- `code-editor` — the JSON view of the same value, when the user prefers to type it.

## Best practices

- Give every property a `title` and a one-sentence `description`; the key is only the fallback label.
- Put limits in the schema (`minimum`, `maxLength`, `pattern`, `enum`) so the form checks them; say the rule in the `description` when it is a `pattern`, since the built-in message cannot name it.
- Keep the default `validate-on="blur"` for short forms; use `submit` when the form sits in a drawer or dialog with one Save.
- Call `validate()` on submit and stop when it returns `valid: false`; it shows every message and focuses the first invalid field.
- Pass server rejections in `errors` keyed by path (`origin.host`): the field turns invalid with that message until the user edits it (the form-error rule). Put a section-level failure in an `Alert` above the form, not in `errors`.
- Use a `field:<path>` slot for a control the schema cannot express (`RadioCards`, a resource picker); the slot keeps the label, description and messages.
- Do not rely on unsupported keywords (`$ref`, `oneOf`, `anyOf`, `allOf`, `if`/`then`, `const`, `format`, `uniqueItems`, `multipleOf`, `additionalProperties`): they are ignored, so validate them on the server.

## Usage

```vue
<script setup>
  import SchemaForm from '@aziontech/webkit/schema-form'
  import { ref } from 'vue'

  const schema = {
    type: 'object',
    required: ['greeting'],
    properties: {
      greeting: { type: 'string', title: 'Greeting', default: 'Hello from the edge' },
      region: { type: 'string', title: 'Region', enum: ['sa-east', 'us-east'] },
      timeout: { type: 'integer', title: 'Timeout (ms)', minimum: 100, default: 3000 },
      debug: { type: 'boolean', title: 'Debug headers', default: false }
    }
  }

  const args = ref({})
  const form = ref(null)
</script>

<template>
  <SchemaForm
    ref="form"
    v-model="args"
    :schema="schema"
  />
</template>
```

## Props

| Prop         | Type                           | Default  | Required | JSDoc                                                                                                |
| ------------ | ------------------------------ | -------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `schema`     | `SchemaFormSchema`             | —        | true     | JSON schema of an object (draft-07 subset); each property becomes a Field.                           |
| `errors`     | `Record<string, string>`       | `{}`     | false    | Server or external messages by field path; a field shows its message until it is edited.             |
| `ui`         | `Record<string, SchemaFormUi>` | `{}`     | false    | Presentation overrides by field path: widget, placeholder, hidden, and key order (`''` is the root). |
| `validateOn` | `'blur' \| 'submit'`           | `'blur'` | false    | When fields first show their validation message: on leaving the field, or only after `validate()`.   |
| `disabled`   | `boolean`                      | `false`  | false    | Disables every field.                                                                                |
| `readonly`   | `boolean`                      | `false`  | false    | Shows every value without letting it change.                                                         |

## v-model

| Model     | Type                      | Default | Emits               | Notes                                                                                                                                                                              |
| --------- | ------------------------- | ------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `Record<string, unknown>` | `{}`    | `update:modelValue` | The edited object. Each change emits a new object; an emptied field removes its key, and an emptied nested object is removed. Defaults are seeded on mount and on a schema change. |

## Exposed

| Member              | Type                                  | Notes                                                                                        |
| ------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| `validate()`        | `() => Promise<SchemaFormValidation>` | Shows every message, focuses the first invalid control, returns `{ valid, errors }` by path. |
| `clearValidation()` | `() => void`                          | Hides the validation messages again (after a reset); server `errors` stay.                   |

## Schema mapping

| Schema                                                        | Control                                            | Checks                                                                             |
| ------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `string`                                                      | `Input` (large)                                    | `minLength`, `maxLength` (also the input's `maxlength`), `pattern`                 |
| `string` with `x-multiline: true` or `maxLength` over 200     | `Textarea`                                         | same as `string`                                                                   |
| `enum` (string or number values)                              | `Select` with one option per value                 | `enum`; numbers also `minimum` / `maximum`                                         |
| `number`, `integer`                                           | `Input` with `inputmode` decimal / numeric         | number, whole number, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum` |
| `boolean`                                                     | `Switch`                                           | none (a switch always holds a value)                                               |
| `array` of strings or numbers                                 | `Textarea` in the code font, one value per line    | `minItems`, `maxItems`, and each item's string or number keywords                  |
| `object` with `properties`                                    | `Field.Set` with `Field.Legend`, its fields inside | its own `required` list                                                            |
| anything else (arrays of objects, objects without properties) | `Textarea` holding JSON                            | valid JSON                                                                         |

`required` (on the parent object) adds the Required marker and the required check; `title` is the label (else the key); `description` is the helper text, replaced by the message while invalid; `default` seeds the value; `readOnly` makes that field (and a nested object's fields) read-only. The type is read from `default`, `enum`, `properties` or `items` when `type` is missing. `ui[path].widget` swaps the control (`input`, `textarea`, `select`, `number`, `switch`, `list`, `json`).

## Events

| Event               | Payload                   | Notes    |
| ------------------- | ------------------------- | -------- |
| `update:modelValue` | `Record<string, unknown>` | v-model. |

## Slots

| Slot           | Scope                      | Notes                                                                                                                                                                                                                                                                                                 |
| -------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `field:<path>` | `SchemaFormFieldSlotProps` | Replaces the control of the field at `<path>` (`field:region`; a nested path such as `origin.host` needs the dynamic form `#[\`field:origin.host\`]`). Scope: `path`, `schema`, `value`, `setValue`, `invalid`, `error`, `required`, `disabled`, `readonly`. The label, description and message stay. |

## States

- Visual states per field come from `Field`: `default`, `invalid` (message under the control), `disabled`, read-only.
- `data-disabled` and `data-readonly` on the root mirror the props; each field carries `data-path` and `data-widget`.
- Validation timing: a field shows its own message after the user leaves it (`validate-on="blur"`), after `validate()` in both modes, and from then on updates as the user types. Opening a `Select` does not count as leaving its field.
- Server messages (`errors`) show at once, win over the field's own message and leave once that field is edited; a new `errors` object shows them again.
- Draft text: a number, list or JSON field keeps what the user typed while it does not parse; the value then holds no key for it, and the field reports "Enter a number." or "Enter valid JSON."

## Motion & Animations

_none_

The form has no motion of its own; the composed controls bring theirs (the `Select` popup), already reduced-motion safe.

## Tokens

| Region                   | Token (DESIGN.md)                                               |
| ------------------------ | --------------------------------------------------------------- |
| gap between fields       | `var(--spacing-lg)` (from `Field.Group`)                        |
| fieldset legend → fields | `var(--spacing-md)` (from `Field.Set`)                          |
| list and JSON text       | `.font-code`                                                    |
| everything else          | inherited from `Field`, `Input`, `Select`, `Switch`, `Textarea` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Every control is wrapped in a `Field` (`role="group"`): `Field.Label` targets the control by id, the description and the message join `aria-describedby`, `required` and `invalid` set `aria-required` and `aria-invalid`.
- A nested object is a real `<fieldset>` with a `<legend>`, so its fields are announced with the group name.
- Messages are text under the control, never colour alone; the message replaces the description while it shows, as the design sample does.
- `validate()` moves focus to the first invalid control, in reading order, so keyboard and screen-reader users land on the problem.
- Keyboard map: no keys of its own; Tab moves through the controls in schema order (or `ui` order); each control keeps its own keys.
- A `field:<path>` slot control must name itself (the scope gives `invalid`, `required`, `disabled`); WebKit inputs read the Field context and need nothing.
- Visible focus, contrast and touch targets come from the composed controls.

## Internationalization

| Key                            | English source                                | Override prop          |
| ------------------------------ | --------------------------------------------- | ---------------------- |
| `schemaForm.required`          | This field is required.                       | —                      |
| `schemaForm.minLength`         | Use at least {min} characters.                | —                      |
| `schemaForm.maxLength`         | Use at most {max} characters.                 | —                      |
| `schemaForm.pattern`           | This value doesn't match the expected format. | —                      |
| `schemaForm.minimum`           | Enter {min} or more.                          | —                      |
| `schemaForm.maximum`           | Enter {max} or less.                          | —                      |
| `schemaForm.number`            | Enter a number.                               | —                      |
| `schemaForm.integer`           | Enter a whole number.                         | —                      |
| `schemaForm.enum`              | Choose one of the options.                    | —                      |
| `schemaForm.minItems`          | Add at least {min} values.                    | —                      |
| `schemaForm.maxItems`          | Add at most {max} values.                     | —                      |
| `schemaForm.listItem`          | Line {line}: {message}                        | —                      |
| `schemaForm.json`              | Enter valid JSON.                             | —                      |
| `schemaForm.selectPlaceholder` | Select an option                              | `ui[path].placeholder` |
| `schemaForm.numberPlaceholder` | A number                                      | `ui[path].placeholder` |
| `schemaForm.numberFrom`        | From {min}                                    | `ui[path].placeholder` |
| `schemaForm.listPlaceholder`   | One value per line                            | `ui[path].placeholder` |
| `schemaForm.jsonPlaceholder`   | A JSON value                                  | `ui[path].placeholder` |

- Formatting: `{min}` and `{max}` go through the locale's number format (`useTranslate`). Labels and descriptions come from the schema, so a translated form needs a translated schema.

## Right-to-left

- Layout: no layout of its own beyond a column of `Field`s; the composed controls use logical utilities.
- Icons: none of its own.
- Keyboard: no arrow keys of its own.
- User data: list and JSON text keep the browser's own direction per line; values are not wrapped in `<bdi>`.

## Responsive

- Container queries: none of its own; the root is a `@container/schema-form` so slot content can react to the form's width.
- Narrow: fields are full width at any size; there is no side-by-side layout.
- Touch: targets come from the composed controls.
- Reflow: no horizontal scroll at 320 px; long values wrap in the textarea.

## Performance

- Bundle budget: see `.size-limit.json` (`schema-form`); it pulls in `Field`, `Input`, `Select`, `Switch` and `Textarea`.
- Runtime budget: a 50-property schema renders and validates in under 50 ms; validation is a plain walk, no schema compiler (no ajv).
- Heavy parts: none.

## Stories (Storybook)

- Default — a function's arguments: text with a default, a choice, an integer with bounds, a switch and a list.
- WithValidation — `validate-on="submit"`, a nested object as a fieldset, and a server message by path.
- CustomField — a `field:<path>` slot, `ui` order and placeholder, and a multiline string.

Justification: SchemaForm has no `kind` or `size` axis. WithValidation shows the submit timing and the server `errors` path, which the Default form cannot show at rest; CustomField shows the slot and `ui`, the two escape hatches.

## Decisions and open questions

- **Numbers use `Input`, not `NumberInput`.** The design sample asks for numbers in a text field with a numeric keyboard (`From 100`, `A number`), and `NumberInput` turns an empty value into `min ?? 0`, which would hide a missing required number. Spinners are left out on purpose.
- **Lists are one value per line in a `Textarea`** (design sample), not chips: they paste well and read like the JSON they become.
- **The message replaces the description** while a field is invalid (design sample's `FieldStack`).
- **No JSON view toggle.** The sample's Fields / JSON switch belongs to the page (pair SchemaForm with `code-editor`), not to the form.
- **Unsupported keywords are ignored silently**, listed above and in the guidance; a dev warning was left out to keep the runtime small.

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
