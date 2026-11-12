# Combobox

> A text field with a list of suggestions under it: typing filters the options, picking one fills the field, and a value that is not in the list is accepted as typed. It holds one string value, after the design sample's `ComboboxInput` and the ARIA 1.2 combobox pattern. It differs from `Select`, whose value must be one of its options and whose trigger is a button, and from `Command`, which runs commands from a palette instead of filling a form field.

- Import: `import Combobox from '@aziontech/webkit/combobox'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [combobox.json](https://github.com/aziontech/webkit/blob/main/.specs/combobox.json)

## When to use

- A form field whose usual values are known but a new one is valid: an environment variable name, a header, a path, a region tag, a branch.
- A long option list the user would rather type than scroll, with the list as a reminder.
- Options that come from the server as the user types (`search` event, `loading`, `filter: false`).
- Suggestions grouped by origin (Recent, Suggested, System) in one field.

## Do

- Put the Combobox in a `Field` so it gets a visible label; use `ariaLabel` only where no label can be shown.
- Keep `allowCustom` on only when a new value is genuinely valid; with it off, the field restores the last valid value when the typed text matches nothing.
- Give options a `description` for what tells them apart (a scope, a count), not a second copy of the label.
- For server data set `filter` to `false`, listen to `search` (debounce on your side), and drive `loading` from the request.
- Validate the committed value (`update:modelValue`) in the form, not each keystroke; `search` is for suggestions only.
- Use `group` when options come from distinct sources; keep group titles one or two words.

## Don’t

- The value must be one of a short fixed list → use `select` (or `radio-group` for 2–5 visible choices).
- Several values at once → use `multi-select`.
- Searching and running commands or jumping to a page → use `command`.
- Filtering a collection by properties → use `property-filter`.
- Key/value pairs or tags → use `attribute-editor` or `tag-editor` (their key cells may hold a Combobox).
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [select](select.md) — closed list, button trigger, no free entry.
- [input](input.md) — the field Combobox is built on; use it alone when there are no suggestions.
- [field](field.md) — label, description and error around the Combobox; it reads id, invalid, disabled and required from it.
- [command](command.md) — palette of actions, not a form value.
- [property-filter](property-filter.md) — token-based filtering with the same listbox look.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `options` | `ComboboxOption[]` | `[]` | false | Suggestions: `{ value, label?, description?, group?, disabled? }`. |
| `placeholder` | `string` | `''` | false | Placeholder of the field. |
| `ariaLabel` | `string` | `''` | false | Accessible name when no `Field` label names the field. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token, as `Input`: 28 / 32 / 40 px. |
| `allowCustom` | `boolean` | `true` | false | Accepts a typed value that matches no option, offered as `Use "…"`. |
| `filter` | `boolean` | `true` | false | Filters `options` by the typed text. Turn off when the server filters on `search`. |
| `clearable` | `boolean` | `false` | false | Shows a clear button while the field has a value. |
| `loading` | `boolean` | `false` | false | Shows a spinner and the loading row while options are fetched. |
| `emptyText` | `string` | `''` | false | Text of the list when nothing matches. Empty uses the locale catalog. |
| `disabled` | `boolean` | `false` | false | Disables the field. |
| `readonly` | `boolean` | `false` | false | Shows the value without the list or editing. |
| `required` | `boolean` | `false` | false | Marks the field required (`aria-required`). |
| `invalid` | `boolean` | `false` | false | Marks the field invalid (`aria-invalid`, danger border). |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `search` | `string` | The typed text, on each keystroke while the list is open (server filters). |
| `create` | `string` | A value that matches no option was committed (`allowCustom`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `option` | { option: ComboboxOption, active: boolean, selected: boolean } | Replaces the content of one option row. |

## Sub-components

_none_ — one `.vue` file. The list is rendered by the component itself (teleported to `body`, positioned with `usePlacement`); options are data, rendered through the optional `option` slot.

## v-model

| Model | Type | Default | Emits | Notes |
| --- | --- | --- | --- | --- |
| `v-model` | `string` | `''` | `update:modelValue` | The committed value via `defineModel`. Changes on pick, Enter, Tab, blur and clear, not on each keystroke. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `open`, `disabled`, `readonly`, `invalid`, `loading`, empty list
- `data-state` on the root: `open` | `closed`
- `data-disabled`, `data-invalid` on the root mirror the resolved props (prop or `Field`)
- Option rows: `data-active` (the keyboard/pointer highlight), `data-selected` (equals the committed value), `data-disabled`
- The field shows the selected option's `label` when the value equals an option's `value`, otherwise the value itself

## Accessibility

- ARIA 1.2 combobox: the `<input>` has `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls` (the listbox id) and `aria-activedescendant` (the highlighted option); the list is `role="listbox"`, rows are `role="option"` with `aria-selected` and `aria-disabled`; grouped rows sit in `role="group"` named by their title (`aria-labelledby`).
- Keyboard map: focus or `ArrowDown` opens the list; `ArrowDown`/`ArrowUp` move the highlight (wrapping, skipping disabled rows); `Home`/`End` move it to the first/last option while the list is open (otherwise the caret moves); `Enter` commits the highlighted option, or the typed text when nothing is highlighted (`allowCustom`); `Escape` closes the list, and a second `Escape` restores the last committed text; `Tab` commits the highlighted option or the typed text and moves on; `Alt+ArrowUp` closes.
- Focus stays in the input the whole time; pointer clicks on rows do not move focus (`mousedown.prevent`).
- A polite status region announces the number of options after each change of the typed text ("3 options"), "No matches" and "Loading options"; it is visually hidden.
- The clear button is a real button with an accessible name ("Clear"), reachable by Tab only while there is a value, and returns focus to the input.
- `Field` integration through `Input`: label `for`/`id`, `aria-describedby`, `aria-invalid`, `aria-required`, disabled.
- Contrast: option text and muted descriptions ≥4.5:1 on `--bg-surface-raised` in both themes; the active row is marked by its fill and `aria-activedescendant`, never colour alone for selection (a check icon marks the selected row).
- Touch targets: rows are 32 px tall, 44 px on `pointer: coarse`.

## Right-to-left

- Layout: logical utilities only (`ps-`/`pe-`, `text-start`, `ms-auto`); the list anchors at `bottom-start` and mirrors.
- Icons: the search glyph and the check mark are not mirrored.
- Keyboard: arrows are vertical, no change under rtl; `Home`/`End` keep their meaning.
- User data: option labels and the field value render with `dir="auto"` / `<bdi>`, so Latin identifiers inside rtl text keep their order.

## Internationalization

| Key                    | English source                                | Override prop |
| ---------------------- | --------------------------------------------- | ------------- |
| `combobox.empty`       | `No matches`                                  | `emptyText`   |
| `combobox.loading`     | `Loading options`                             | —             |
| `combobox.useValue`    | `Use "{value}"`                               | —             |
| `combobox.clear`       | `Clear`                                       | —             |
| `combobox.suggestions` | `Suggestions`                                 | —             |
| `combobox.count`       | `{count} option` / `{count} options` (plural) | —             |

- Formatting: plural rules through the locale catalog (`Intl.PluralRules`); matching is case- and accent-insensitive with `String.prototype.normalize('NFD')` and `toLocaleLowerCase(locale)`.

## Responsive

- Container queries: none; the field fills its container and the list is at least as wide as the field (`matchTriggerWidth` floor, may grow to the longest row within the viewport).
- Narrow (≤ 640 px): the list flips above the field when there is no room below, and rows truncate with an ellipsis.
- Touch: rows grow to 44 px on `pointer: coarse`; no hover-only affordance (the highlight follows the pointer and the keyboard).
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Combobox from '@aziontech/webkit/combobox'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const name = ref('API_URL')

  const options = [
    { value: 'API_URL', description: 'Suggested' },
    { value: 'API_TOKEN', description: 'Suggested' },
    { value: 'NODE_ENV', description: 'System' },
    { value: 'LOG_LEVEL' },
    { value: 'CACHE_TTL' }
  ]
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Variable name</Field.Label>
    <Combobox
      v-model="name"
      :options="options"
      placeholder="Search or type a name"
      clearable
    />
    <Field.Description>Pick a known variable or type a new one.</Field.Description>
  </Field>
</template>
```

### Grouped

```vue
<script setup>
  import Combobox from '@aziontech/webkit/combobox'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const header = ref('')

  const options = [
    { value: 'X-Request-Id', group: 'Recent' },
    { value: 'X-Tenant', group: 'Recent' },
    { value: 'Cache-Control', group: 'Standard' },
    { value: 'Content-Type', group: 'Standard' },
    { value: 'Authorization', group: 'Standard', disabled: true, description: 'Managed' }
  ]
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Request header</Field.Label>
    <Combobox
      v-model="header"
      :options="options"
      placeholder="Header name"
    />
  </Field>
</template>
```

### Server

```vue
<script setup>
  import Combobox from '@aziontech/webkit/combobox'
  import Field from '@aziontech/webkit/field'
  import { onBeforeUnmount, ref } from 'vue'

  const regions = [
    { value: 'sa-east', label: 'South America (São Paulo)' },
    { value: 'us-east', label: 'US East (Virginia)' },
    { value: 'us-west', label: 'US West (Oregon)' },
    { value: 'eu-west', label: 'Europe (Frankfurt)' },
    { value: 'ap-south', label: 'Asia Pacific (Singapore)' }
  ]

  const region = ref('')
  const options = ref(regions)
  const loading = ref(false)
  let timer

  const search = (text) => {
    clearTimeout(timer)
    loading.value = true
    timer = setTimeout(() => {
      const needle = text.trim().toLowerCase()
      options.value = regions.filter((item) => item.label.toLowerCase().includes(needle))
      loading.value = false
    }, 400)
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Region</Field.Label>
    <Combobox
      v-model="region"
      :options="options"
      :filter="false"
      :allow-custom="false"
      :loading="loading"
      placeholder="Search regions"
      @search="search"
    />
    <Field.Description>Only listed regions are accepted.</Field.Description>
  </Field>
</template>
```
