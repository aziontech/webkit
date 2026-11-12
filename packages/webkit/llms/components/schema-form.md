# Schema Form

> A form rendered from a JSON schema: each property of an object schema becomes a `Field` with its label, description, Required marker and control, and a nested object becomes a fieldset with its own legend. It edits one value object through `v-model`, seeds the schema's defaults, validates the supported draft-07 keywords with built-in messages (on leaving a field, or only after `validate()`), and shows server messages passed by field path. It is for forms whose fields are data (a function's arguments, an integration's settings), not for forms a designer lays out by hand.

- Import: `import SchemaForm from '@aziontech/webkit/schema-form'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [schema-form.json](https://github.com/aziontech/webkit/blob/main/.specs/schema-form.json)

## When to use

- A function, template or integration declares its own arguments as a JSON schema and the console must ask for them.
- The same settings form must follow a schema the server sends (fields added or removed without a release).
- A form of typed values (text, choices, numbers, switches, lists) with constraints that already live in a schema.

## Do

- Give every property a `title` and a one-sentence `description`; the key is only the fallback label.
- Put limits in the schema (`minimum`, `maxLength`, `pattern`, `enum`) so the form checks them; say the rule in the `description` when it is a `pattern`, since the built-in message cannot name it.
- Keep the default `validate-on="blur"` for short forms; use `submit` when the form sits in a drawer or dialog with one Save.
- Call `validate()` on submit and stop when it returns `valid: false`; it shows every message and focuses the first invalid field.
- Pass server rejections in `errors` keyed by path (`origin.host`): the field turns invalid with that message until the user edits it (the form-error rule). Put a section-level failure in an `Alert` above the form, not in `errors`.
- Use a `field:<path>` slot for a control the schema cannot express (`RadioCards`, a resource picker); the slot keeps the label, description and messages.
- Do not rely on unsupported keywords (`$ref`, `oneOf`, `anyOf`, `allOf`, `if`/`then`, `const`, `format`, `uniqueItems`, `multipleOf`, `additionalProperties`): they are ignored, so validate them on the server.

## Don’t

- A form with a fixed, designed layout (settings sections, create pages) → compose `field`, `input`, `select` and `switch` by hand (`platform/edit/edit-resource`, `platform/create/single-page-create`).
- Rows of key/value pairs the user adds and removes → use `attribute-editor`.
- Editing the schema itself, or raw JSON → use `code-editor`.
- A single choice or value → use the control directly inside a `field`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [field](field.md) — the wrapper every generated field uses; SchemaForm adds no field chrome of its own.
- [input](input.md), `select`, `switch`, `textarea` — the controls it renders per type.
- [attribute-editor](attribute-editor.md) — user-defined key/value rows, where SchemaForm renders a fixed set of keys.
- [code-editor](code-editor.md) — the JSON view of the same value, when the user prefers to type it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `schema` | `SchemaFormSchema` | `—` | true | JSON schema of an object (draft-07 subset); each property becomes a Field. |
| `errors` | `Record<string, string>` | `{}` | false | Server or external messages by field path; a field shows its message until it is edited. |
| `ui` | `Record<string, SchemaFormUi>` | `{}` | false | Presentation overrides by field path: widget, placeholder, hidden, and key order (`''` is the root). |
| `validateOn` | `'blur' \| 'submit'` | `'blur'` | false | When fields first show their validation message: on leaving the field, or only after `validate()`. |
| `disabled` | `boolean` | `false` | false | Disables every field. |
| `readonly` | `boolean` | `false` | false | Shows every value without letting it change. |
| `modelValue` | `SchemaFormValue` | `—` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type                      | Default | Emits               | Notes                                                                                                                                                                              |
| --------- | ------------------------- | ------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `Record<string, unknown>` | `{}`    | `update:modelValue` | The edited object. Each change emits a new object; an emptied field removes its key, and an emptied nested object is removed. Defaults are seeded on mount and on a schema change. |

## States

- Visual states per field come from `Field`: `default`, `invalid` (message under the control), `disabled`, read-only.
- `data-disabled` and `data-readonly` on the root mirror the props; each field carries `data-path` and `data-widget`.
- Validation timing: a field shows its own message after the user leaves it (`validate-on="blur"`), after `validate()` in both modes, and from then on updates as the user types. Opening a `Select` does not count as leaving its field.
- Server messages (`errors`) show at once, win over the field's own message and leave once that field is edited; a new `errors` object shows them again.
- Draft text: a number, list or JSON field keeps what the user typed while it does not parse; the value then holds no key for it, and the field reports "Enter a number." or "Enter valid JSON."

## Accessibility

- Every control is wrapped in a `Field` (`role="group"`): `Field.Label` targets the control by id, the description and the message join `aria-describedby`, `required` and `invalid` set `aria-required` and `aria-invalid`.
- A nested object is a real `<fieldset>` with a `<legend>`, so its fields are announced with the group name.
- Messages are text under the control, never colour alone; the message replaces the description while it shows, as the design sample does.
- `validate()` moves focus to the first invalid control, in reading order, so keyboard and screen-reader users land on the problem.
- Keyboard map: no keys of its own; Tab moves through the controls in schema order (or `ui` order); each control keeps its own keys.
- A `field:<path>` slot control must name itself (the scope gives `invalid`, `required`, `disabled`); WebKit inputs read the Field context and need nothing.
- Visible focus, contrast and touch targets come from the composed controls.

## Right-to-left

- Layout: no layout of its own beyond a column of `Field`s; the composed controls use logical utilities.
- Icons: none of its own.
- Keyboard: no arrow keys of its own.
- User data: list and JSON text keep the browser's own direction per line; values are not wrapped in `<bdi>`.

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

## Responsive

- Container queries: none of its own; the root is a `@container/schema-form` so slot content can react to the form's width.
- Narrow: fields are full width at any size; there is no side-by-side layout.
- Touch: targets come from the composed controls.
- Reflow: no horizontal scroll at 320 px; long values wrap in the textarea.

## Examples

### Default

```vue
<script setup>
  import SchemaForm from '@aziontech/webkit/schema-form'
  import { ref } from 'vue'

  const schema = {
    type: 'object',
    required: ['greeting', 'region'],
    properties: {
      greeting: {
        type: 'string',
        title: 'Greeting',
        description: 'The text the function returns on every request.',
        default: 'Hello from the edge',
        maxLength: 80
      },
      region: {
        type: 'string',
        title: 'Region',
        description: 'Where the function reads its data from.',
        enum: ['sa-east', 'us-east', 'eu-west']
      },
      timeout: {
        type: 'integer',
        title: 'Timeout (ms)',
        description: 'How long the function waits for its origin.',
        minimum: 100,
        maximum: 30000,
        default: 3000
      },
      debug: {
        type: 'boolean',
        title: 'Debug headers',
        description: 'Adds timing headers to every response.',
        default: false
      },
      allowedPaths: {
        type: 'array',
        title: 'Allowed paths',
        description: 'Requests to other paths return 404.',
        items: { type: 'string', pattern: '^/' }
      }
    }
  }

  const args = ref({ greeting: 'Hello from the edge', timeout: 3000, debug: false })
</script>

<template>
  <div class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-lg)">
    <SchemaForm
      v-model="args"
      :schema="schema"
    />
    <pre
      class="m-0 overflow-auto rounded-(--shape-elements) bg-(--bg-surface) p-(--spacing-sm) font-code text-body-xs text-(--text-muted)"
      >{{ JSON.stringify(args, null, 2) }}</pre>
  </div>
</template>
```

### WithValidation

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SchemaForm from '@aziontech/webkit/schema-form'
  import { ref } from 'vue'

  const schema = {
    type: 'object',
    required: ['name', 'origin'],
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        description: 'Lowercase letters, numbers and hyphens.',
        pattern: '^[a-z0-9-]+$',
        minLength: 3
      },
      origin: {
        type: 'object',
        title: 'Origin',
        description: 'Where requests go when the cache misses.',
        required: ['host'],
        properties: {
          host: { type: 'string', title: 'Host', default: 'origin.example.com' },
          port: { type: 'integer', title: 'Port', minimum: 1, maximum: 65535, default: 443 }
        }
      }
    }
  }

  const value = ref({ name: 'shop' })
  const form = ref(null)
  const saving = ref(false)
  const serverErrors = ref({})

  const save = async () => {
    const { valid } = await form.value.validate()
    if (!valid) return
    saving.value = true
    setTimeout(() => {
      saving.value = false
      serverErrors.value = { 'origin.host': 'This host does not answer on the chosen port.' }
    }, 600)
  }
</script>

<template>
  <form
    class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-lg)"
    novalidate
    @submit.prevent="save"
  >
    <SchemaForm
      ref="form"
      v-model="value"
      :schema="schema"
      :errors="serverErrors"
      :disabled="saving"
      validate-on="submit"
    />
    <div class="flex justify-end">
      <Button
        type="submit"
        label="Save"
        kind="primary"
        size="medium"
        :loading="saving"
      />
    </div>
  </form>
</template>
```

### CustomField

```vue
<script setup>
  import RadioCards from '@aziontech/webkit/radio-cards'
  import SchemaForm from '@aziontech/webkit/schema-form'
  import { ref } from 'vue'

  const schema = {
    type: 'object',
    properties: {
      mode: {
        type: 'string',
        title: 'Cache mode',
        enum: ['honor', 'override'],
        default: 'honor'
      },
      ttl: { type: 'integer', title: 'TTL (seconds)', minimum: 0, default: 3600 },
      notes: { type: 'string', title: 'Notes', 'x-multiline': true }
    }
  }

  const ui = { '': { order: ['ttl', 'mode'] }, notes: { placeholder: 'Why this cache policy' } }
  const settings = ref({})
</script>

<template>
  <SchemaForm
    v-model="settings"
    :schema="schema"
    :ui="ui"
    class="max-w-(--container-sm)"
  >
    <template #field:mode="{ value, setValue, disabled }">
      <RadioCards
        :model-value="value"
        aria-label="Cache mode"
        :items="[
          {
            value: 'honor',
            label: 'Honor origin headers',
            description: 'Cache for as long as the origin says.'
          },
          {
            value: 'override',
            label: 'Override with TTL',
            description: 'Cache for the TTL below, whatever the origin says.'
          }
        ]"
        :disabled="disabled"
        @update:model-value="setValue"
      />
    </template>
  </SchemaForm>
</template>
```
