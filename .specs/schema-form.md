---
name: schema-form
category: inputs
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 28922f79d913c1afb789aa461260fc4f1c54927b48cb0c43159a21c160702eec
created: 2026-11-11
last_updated: 2026-11-14
---

# SchemaForm — Component Spec

## Purpose

A form rendered from a JSON schema: each property of an object schema becomes a `Field` with its label, description, Required marker and control, and a nested object becomes a fieldset with its own legend. It edits one value object through `v-model`, seeds the schema's defaults, validates the supported draft-07 keywords with built-in messages (on leaving a field, or only after `validate()`), and shows server messages passed by field path. It also reads the OpenAPI request-body keywords a console generates its create and edit forms from: `oneOf` with a `discriminator`, `format`, `writeOnly` and string maps (`additionalProperties`). Through the `ui` map the app adds what a schema cannot say: fields shown only while a predicate holds (`when`), choices loaded from the app (`options`), arrays of objects edited as repeatable fieldsets (`widget: 'repeat'`) and sections, one of them folded under Advanced settings. It is for forms whose fields are data (a function's arguments, an integration's settings, a resource's request body), not for forms a designer lays out by hand.

## When to use

- A function, template or integration declares its own arguments as a JSON schema and the console must ask for them.
- The same settings form must follow a schema the server sends (fields added or removed without a release).
- A form of typed values (text, choices, numbers, switches, lists) with constraints that already live in a schema.
- A resource's create or edit drawer generated from its OpenAPI request schema, with choices read from other endpoints through a loader the app supplies.

## When NOT to use

- A form with a fixed, designed layout (settings sections, create pages) → compose `field`, `input`, `select` and `switch` by hand (`platform/edit/edit-resource`, `platform/create/single-page-create`).
- Rows of key/value pairs the user adds and removes → use `attribute-editor`.
- Editing the schema itself, or raw JSON → use `code-editor`.
- A single choice or value → use the control directly inside a `field`.

## Related

- `field` — the wrapper every generated field uses; SchemaForm adds no field chrome of its own.
- `input`, `select`, `switch`, `textarea`, `password-input` — the controls it renders per type and format.
- `combobox`, `multi-select` — the controls of a field whose choices come from `ui[path].options`.
- `accordion` — folds a collapsed section.
- `attribute-editor` — user-defined key/value rows; SchemaForm uses it for string maps and for the Add and Remove of a repeat.
- `code-editor` — the JSON view of the same value, when the user prefers to type it.

## Best practices

- Give every property a `title` and a one-sentence `description`; the key is only the fallback label.
- Put limits in the schema (`minimum`, `maxLength`, `pattern`, `enum`) so the form checks them; say the rule in the `description` when it is a `pattern`, since the built-in message cannot name it.
- Keep the default `validate-on="blur"` for short forms; use `submit` when the form sits in a drawer or dialog with one Save.
- Call `validate()` on submit and stop when it returns `valid: false`; it shows every message and focuses the first invalid field.
- Pass server rejections in `errors` keyed by path (`origin.host`): the field turns invalid with that message until the user edits it (the form-error rule). Put a section-level failure in an `Alert` above the form, not in `errors`.
- Use a `field:<path>` slot for a control the schema cannot express (`RadioCards`, a resource picker); the slot keeps the label, description and messages.
- Do not rely on unsupported keywords (`$ref`, `anyOf`, `allOf`, `if`/`then`/`else`, `uniqueItems`, `multipleOf`, `patternProperties`, a `oneOf` without a `discriminator`): they are ignored, so validate them on the server. Express an `if`/`then` as `ui[path].when`.
- Define `ui` once in the script, not inline in the template: a new `ui` object rebuilds the fields and seeds defaults again.
- Keep a `when` predicate pure and cheap (it runs on every change); read the second argument (the object holding the field) inside a repeat item.
- An `options` loader receives the typed text (empty on first load) and resolves to `{ value, label?, description? }`; filter on the server, return a short list, and let it reject on failure (the field then says so). SchemaForm calls it; it never fetches on its own.
- Mark secrets `writeOnly`: the field starts empty, an empty field leaves the key out of the value, so a PATCH keeps the stored secret.
- Put rarely changed keys in a collapsed section (`ui[''].sections`), not in a second form.

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

With the `ui` map (define it once in the script):

```js
const ui = {
  origin: { options: (query) => api.origins(query) },
  ttl: { when: (value) => value.cache === true },
  rules: { widget: 'repeat' },
  'rules.*.target': { when: (value, rule) => rule.behavior === 'redirect' },
  '': { sections: [{ keys: ['headers', 'retries'], collapsed: true }] }
}
```

## Props

| Prop         | Type                           | Default  | Required | JSDoc                                                                                                                                       |
| ------------ | ------------------------------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `schema`     | `SchemaFormSchema`             | —        | true     | JSON schema of an object (draft-07 subset); each property becomes a Field.                                                                  |
| `errors`     | `Record<string, string>`       | `{}`     | false    | Server or external messages by field path; a field shows its message until it is edited.                                                    |
| `ui`         | `Record<string, SchemaFormUi>` | `{}`     | false    | Presentation overrides by field path (`''` is the root, `*` a repeat item): widget, placeholder, hidden, order, when, options and sections. |
| `validateOn` | `'blur' \| 'submit'`           | `'blur'` | false    | When fields first show their validation message: on leaving the field, or only after `validate()`.                                          |
| `disabled`   | `boolean`                      | `false`  | false    | Disables every field.                                                                                                                       |
| `readonly`   | `boolean`                      | `false`  | false    | Shows every value without letting it change.                                                                                                |

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

| Schema                                                        | Control                                                                   | Checks                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `string`                                                      | `Input` (large)                                                           | `minLength`, `maxLength` (also the input's `maxlength`), `pattern`                 |
| `string` with `x-multiline: true` or `maxLength` over 200     | `Textarea`                                                                | same as `string`                                                                   |
| `enum` (string or number values)                              | `Select` with one option per value                                        | `enum`; numbers also `minimum` / `maximum`                                         |
| `number`, `integer`                                           | `Input` with `inputmode` decimal / numeric                                | number, whole number, `minimum`, `maximum`, `exclusiveMinimum`, `exclusiveMaximum` |
| `boolean`                                                     | `Switch`                                                                  | none (a switch always holds a value)                                               |
| `array` of strings or numbers                                 | `Textarea` in the code font, one value per line                           | `minItems`, `maxItems`, and each item's string or number keywords                  |
| `object` with `properties`                                    | `Field.Set` with `Field.Legend`, its fields inside                        | its own `required` list                                                            |
| `string` with `format: email`                                 | `Input` with `type="email"`                                               | `email` plus the `string` checks                                                   |
| `string` with `format: uri` (or `url`)                        | `Input` with `inputmode="url"`                                            | an absolute URL                                                                    |
| `string` with `format: date`                                  | `Input` with the `YYYY-MM-DD` placeholder                                 | a real calendar date as `YYYY-MM-DD`                                               |
| `string` with `writeOnly: true` or `format: password`         | `PasswordInput` (show/hide toggle)                                        | the `string` checks; empty leaves the key out                                      |
| `object` with `oneOf` and `discriminator.propertyName`        | `Field.Set`: a `Select` of the variants, then the chosen variant's fields | a variant must be chosen                                                           |
| `object` with `additionalProperties` of type `string` (a map) | `AttributeEditor` with Key and Value columns                              | unique keys; rows with an empty key are left out                                   |
| `array` of objects with `ui[path].widget: 'repeat'`           | `AttributeEditor` of fieldsets, one per item, with Add and Remove         | `minItems`, `maxItems` (Add stops, Remove hides at the limits), each item's fields |
| any field with `ui[path].options`                             | `Combobox` (searches through the loader), or `MultiSelect` for an array   | `required`, `minItems`, `maxItems`                                                 |
| anything else (arrays of objects, objects without properties) | `Textarea` holding JSON                                                   | valid JSON                                                                         |

`required` (on the parent object) adds the Required marker and the required check; `title` is the label (else the key); `description` is the helper text, replaced by the message while invalid; `default` seeds the value; `readOnly` makes that field (and a nested object's fields) read-only. The type is read from `default`, `enum`, `properties`, `oneOf` or `items` when `type` is missing. `ui[path].widget` swaps the control (`input`, `textarea`, `select`, `number`, `switch`, `list`, `json`, `password`, `repeat`, `map`). A variant is named by its discriminator property's `const` (or first `enum` value) and labelled by its `title`; the choice is labelled by the discriminator property's `title`. A key two variants share keeps its value when the choice changes.

## ui options

| Key           | Type                                             | Applies to | Effect                                                                                                                                                                                          |
| ------------- | ------------------------------------------------ | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `widget`      | `SchemaFormUi['widget']`                         | a field    | Control to render instead of the one the schema implies; `repeat` needs an array of objects, `map` an object.                                                                                   |
| `placeholder` | `string`                                         | a field    | Placeholder of the control.                                                                                                                                                                     |
| `hidden`      | `boolean`                                        | a field    | Leaves the field out of the form; its value is kept.                                                                                                                                            |
| `order`       | `string[]`                                       | an object  | The keys to ask first.                                                                                                                                                                          |
| `when`        | `(value, parent) => boolean`                     | a field    | Shows the field while it returns true. A hidden field is not validated and its key leaves the value; showing it again brings back what it held, else its `default`.                             |
| `options`     | `(query: string) => Promise<SchemaFormOption[]>` | a field    | Choices from the app: called with `''` when the field appears and with the typed text (after 250 ms) as the user searches; a late answer to an older query is dropped.                          |
| `sections`    | `SchemaFormSection[]`                            | an object  | Groups keys under a legend (`{ title, description, keys }`) or, with `collapsed: true`, under a closed disclosure; a section without `title` is "Advanced settings". Ungrouped keys come first. |

Paths inside a repeat item carry the index (`rules.0.path`) in `v-model`, `errors`, `validate()` and the `field:<path>` slot; `ui` addresses every item with `*` (`rules.*.target`).

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

Dynamic slot `field:<path>` (scope `SchemaFormFieldSlotProps`): Replaces the control of the field at `<path>` (`field:region`; a nested path such as `origin.host` needs the dynamic form `#[\`field:origin.host\`]`). Scope: `path`, `schema`, `value`, `setValue`, `invalid`, `error`, `required`, `disabled`, `readonly`. The label, description and message stay.

## States

- Visual states per field come from `Field`: `default`, `invalid` (message under the control), `disabled`, read-only.
- `data-disabled` and `data-readonly` on the root mirror the props; each field carries `data-path` and `data-widget`.
- Validation timing: a field shows its own message after the user leaves it (`validate-on="blur"`), after `validate()` in both modes, and from then on updates as the user types. Opening a `Select` does not count as leaving its field.
- Server messages (`errors`) show at once, win over the field's own message and leave once that field is edited; a new `errors` object shows them again.
- Draft text: a number, list or JSON field keeps what the user typed while it does not parse; the value then holds no key for it, and the field reports "Enter a number." or "Enter valid JSON."
- Hidden (`when`): the field is not rendered, not validated and its key is removed from the value; a variant not chosen is hidden the same way.
- Loading options: the `Combobox` shows its spinner and loading row; a rejected loader shows "Couldn't load the options." in the list.
- Repeat: an empty array shows the editor's empty text; the item fieldsets carry `data-testid` `__item`; Add is disabled at `maxItems` and Remove is hidden at `minItems`.
- Map: a duplicate key marks its row invalid at once and fails `validate()` on the map's path.
- Sections: `data-widget="section"`; a collapsed section opens when `validate()` focuses a field inside it.

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
- Keyboard map: no keys of its own; Tab moves through the controls in schema order (or `ui` order, then sections); each control keeps its own keys (the `Combobox` arrows and Enter, the `Accordion` trigger's Enter and Space).
- A repeat and a map are `<fieldset>`s named by the property title; each repeat item is a `role="group"` named "Item 2" (or the item schema's `title` and number), its Remove button is named "Remove item 2", and Add and Remove are announced by `AttributeEditor`'s live region, which also moves focus to the new row.
- A collapsed section is an `Accordion` trigger with `aria-expanded`; a closed section's fields are still validated, and `validate()` opens it before moving focus.
- A field that appears or disappears through `when` is not announced; keep the controlling field just before it so the change happens where the user is.
- A `field:<path>` slot control must name itself (the scope gives `invalid`, `required`, `disabled`); WebKit inputs read the Field context and need nothing.
- Visible focus, contrast and touch targets come from the composed controls.

## Internationalization

| Key                               | English source                                 | Override prop          |
| --------------------------------- | ---------------------------------------------- | ---------------------- |
| `schemaForm.required`             | This field is required.                        | —                      |
| `schemaForm.minLength`            | Use at least {min} characters.                 | —                      |
| `schemaForm.maxLength`            | Use at most {max} characters.                  | —                      |
| `schemaForm.pattern`              | This value doesn't match the expected format.  | —                      |
| `schemaForm.minimum`              | Enter {min} or more.                           | —                      |
| `schemaForm.maximum`              | Enter {max} or less.                           | —                      |
| `schemaForm.number`               | Enter a number.                                | —                      |
| `schemaForm.integer`              | Enter a whole number.                          | —                      |
| `schemaForm.enum`                 | Choose one of the options.                     | —                      |
| `schemaForm.minItems`             | Add at least {min} values.                     | —                      |
| `schemaForm.maxItems`             | Add at most {max} values.                      | —                      |
| `schemaForm.listItem`             | Line {line}: {message}                         | —                      |
| `schemaForm.json`                 | Enter valid JSON.                              | —                      |
| `schemaForm.selectPlaceholder`    | Select an option                               | `ui[path].placeholder` |
| `schemaForm.numberPlaceholder`    | A number                                       | `ui[path].placeholder` |
| `schemaForm.numberFrom`           | From {min}                                     | `ui[path].placeholder` |
| `schemaForm.listPlaceholder`      | One value per line                             | `ui[path].placeholder` |
| `schemaForm.jsonPlaceholder`      | A JSON value                                   | `ui[path].placeholder` |
| `schemaForm.email`                | Enter a valid email address.                   | —                      |
| `schemaForm.uri`                  | Enter a full URL, such as https://example.com. | —                      |
| `schemaForm.date`                 | Enter a date as YYYY-MM-DD.                    | —                      |
| `schemaForm.datePlaceholder`      | YYYY-MM-DD                                     | `ui[path].placeholder` |
| `schemaForm.searchPlaceholder`    | Search                                         | `ui[path].placeholder` |
| `schemaForm.optionsError`         | Couldn't load the options.                     | —                      |
| `schemaForm.writeOnlyPlaceholder` | Leave empty to keep the current value          | `ui[path].placeholder` |
| `schemaForm.item`                 | Item {index}                                   | item schema `title`    |
| `schemaForm.advanced`             | Advanced settings                              | section `title`        |
| `schemaForm.mapKey`               | Key                                            | —                      |
| `schemaForm.mapValue`             | Value                                          | —                      |
| `schemaForm.duplicateKey`         | Each key must be unique.                       | —                      |

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

- Bundle budget: see `.size-limit.json` (`schema-form`); it pulls in `Field`, `Input`, `Select`, `Switch`, `Textarea`, `PasswordInput`, `Combobox`, `MultiSelect`, `AttributeEditor` and `Accordion`.
- Runtime budget: a 50-property schema renders and validates in under 50 ms; validation is a plain walk, no schema compiler (no ajv). `when` predicates run on every change, so they must be cheap.
- Network: none of its own; a loader runs once when its field appears and once per search pause (250 ms).
- Heavy parts: none.

## Examples

- Default — a function's arguments: text with a default, a choice, an integer with bounds, a switch and a list.
- WithValidation — `validate-on="submit"`, a nested object as a fieldset, and a server message by path.
- CustomField — a `field:<path>` slot, `ui` order and placeholder, and a multiline string.
- DynamicFields — `when` on a field and inside repeat items, an `options` loader, and `widget: 'repeat'` for an array of objects.
- RequestSchema — an OpenAPI request body: `oneOf` with a `discriminator`, `writeOnly`, `format`, a string map and a collapsed section.

Justification: SchemaForm has no `kind` or `size` axis. WithValidation shows the submit timing and the server `errors` path, which the Default form cannot show at rest; CustomField shows the slot and `ui`, the two escape hatches. DynamicFields shows the `ui` behaviours that change the form as the value changes, and RequestSchema the keywords a generated console form reads, neither of which the other examples can show.

## Decisions and open questions

- **Numbers use `Input`, not `NumberInput`.** The design sample asks for numbers in a text field with a numeric keyboard (`From 100`, `A number`), and `NumberInput` turns an empty value into `min ?? 0`, which would hide a missing required number. Spinners are left out on purpose.
- **Lists are one value per line in a `Textarea`** (design sample), not chips: they paste well and read like the JSON they become.
- **The message replaces the description** while a field is invalid (design sample's `FieldStack`).
- **No JSON view toggle.** The sample's Fields / JSON switch belongs to the page (pair SchemaForm with `code-editor`), not to the form.
- **Unsupported keywords are ignored silently**, listed above and in the guidance; a dev warning was left out to keep the runtime small.
- **`if`/`then`/`else` is not read.** `ui[path].when` covers the same need with a predicate the app controls; mapping the keyword would need a second, partial validator.
- **Repeat is opt-in, maps are not.** An array of objects stays a JSON field unless `ui[path].widget` is `repeat`, so forms that relied on the JSON text keep it; a string map was an ignored keyword before, so it now opens as key/value rows (`widget: 'json'` brings the text back).
- **Hidden values leave the value.** Stripping them as they hide (and restoring them when shown) keeps `v-model` equal to what a submit sends, so the app needs no separate "submitted value".
- **A multiple `options` field does not search.** `MultiSelect` has no search box; it loads once with an empty query. A searchable multiple picker waits for one in `multi-select`.
- **Dates are typed, not picked.** `format: date` is a text field checked as `YYYY-MM-DD`; a `Calendar` popover would add a heavy dependency to every form.

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
