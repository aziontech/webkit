---
name: webkit-form
description: Accessible forms on @aziontech/webkit, and which control each kind of value takes (a date or date and time is DatePicker, a range DateRangePicker, a number NumberInput, a phone PhoneInput, a secret PasswordInput — never a text Input that asks for a format). Use for any field, even one. Also: one Form Layout spacing reference (xs inside a field, lg between fields/rows) shared by five form types (Drawer, nested Drawer, Dialog, ItemGroup settings, Card with independent saves) that differ only in container + save model, with two internal layouts (Cards + ItemGroups / Fields separated) composing inside each. Every field carries a real label (never a placeholder-as-label), errors are tied to the control via aria-describedby, and related fields group in a real <fieldset>/<legend>; validated only on submit with the field's own invalid state as the feedback (required is static and draws no colour) — no custom error-summary block, no Alert callout for field validation. The a11y companion to /webkit-ux-heuristics (states) and /webkit-ui-states (locking + toast).
status: active
last_updated: 2026-11-23
scope: general
enforced_by: [webkit-accessibility, webkit-component-states, ui-verify]
---

# Skill: webkit-form

## Purpose

Forms are where a product is most keyboard- and screen-reader-tested and most often fails: a label
that is really a placeholder, a select whose `<label for>` points at nothing, a validation error shown
only in colour, a field that never says it was required. This skill fixes the accessibility of a form
built on `@aziontech/webkit` so it is operable by keyboard, understandable by a screen reader, and
recoverable when it rejects input. It is the a11y companion to `/webkit-ux-heuristics`
(which establishes the states) and `/webkit-ui-states` (which locks the scope and
toasts request errors) — this skill owns **layout, labels, grouping, validation semantics, and submit**.

There are **two ways to lay out a form**, and both are first-class:

- **Approach A — Cards + ItemGroups.** Sections are a `SettingsGroup` over a flush `Card` wrapping
  an `Item.List`; every field is one `SettingsRow` (name/guidance on the left, control on the right). This is the default for
  **grouped, settings-style, or list-like** forms — an account settings page, a resource's config or
  create page, a create drawer.
- **Approach B — Fields separated.** Standalone `Field` triads (label, control, description) stacked in a column. This is for
  **short, focused, single-purpose** forms — a sign-in flow, a rename or delete-confirmation dialog, a
  short create drawer, a single step in a wizard.

Pick one per form; don't mix row-fields and stacked-fields in the same section.

## How to use

- `/webkit-form`
  Apply the layout + patterns below to any form you build in this conversation.
- `/webkit-form <file>`
  Review the file's form against the patterns and output, per gap:
  - the exact line / element (quoted),
  - which pattern it breaks (1 short sentence),
  - the concrete fix, naming the webkit component to use.

## When to invoke

- Building or reviewing any create/edit page, settings panel, drawer form, or multi-field form.
- The user asks "is this form accessible", "wire up the labels", "the screen reader skips this",
  "where do errors go", "which layout for this form".
- After `/webkit-ux-heuristics` establishes the states and before `/webkit-ui-states` locks the async submit.

## Wrap every control in a `Field` — loose inputs are the fallback

webkit ships **one** form-field component, `Field` (`@aziontech/webkit/field`), and wraps **any** control
in it: `Input`, `Textarea`, `Select`, `MultiSelect`, `NumberInput`, `PasswordInput`, `PhoneInput`,
`InputGroup` (with `InputGroup.Input`), `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`,
`DateRangePicker`, `Combobox`, `OtpInput`, `TagEditor`, `LanguageSelect`. **Default to a `Field`**; leave
a control bare only when no label belongs next to it. Which control a value takes is the table in
"Pick the control from the kind of value" below.

- **`Field` (preferred):** `<Field>` + `<Field.Label>` + the control + `<Field.Description>` /
  `<Field.Error>`. State lives on the Field — `<Field required :invalid :disabled>` — and the control
  reads its `id`, `aria-describedby`, `aria-invalid`, `disabled` and `required` from it; `Field.Label`
  points `for` at the control and shows the Required marker; `Field.Description` takes its tone
  (disabled → invalid → helper) from the Field. The accessible-name / error-association rules
  below are satisfied **by construction**.
- **Extra help on a field:** `Field.Description` first (always visible); detail some people want goes in
  `<Field.Label hint="…">`, a Hint glyph that opens a short note on click. Never a typed `?`, a boxed icon
  button or a long `Tooltip` beside a label (`/webkit-in-product-help`).
- **Checkbox, switch:** `<Field orientation="horizontal">` with the control first and a
  `<Field.Content>` holding `Field.Label` + `Field.Description`.
- **One of a few (radios):** always `<RadioGroup v-model>` with a `RadioGroup.Item` per option
  (`description` for the line under it); `variant="card"` for bordered option cards. Never compose a
  radio by hand inside `Field.Label`.
- **Checkbox and switch cards** (a bordered option with a title and description): `<Field.Label>` wrapping a
  horizontal `<Field>` with the control and `<Field.Content>` (`Field.Title` + `Field.Description`).
  Group cards with `<Field.Set>` + `<Field.Legend>`, never inside another `Field`.
- **Loose (the bare control):** only when the label lives elsewhere — a control in an `Item.Actions`
  cell whose `Item.Title` names it, a table cell, a toolbar. Then **you** own the `aria-label` /
  `aria-describedby` per the rules below.
- **Types come from the binding.** `Select` and `MultiSelect` take their value type from the bound
  model (a `string` model gives `@update:model-value` and `display-value` a `string`, so handlers are
  `(value: string)` with no `typeof` guard), and an options list is `SelectOptionItem[]` from
  `@aziontech/webkit/select`. `Input`, `Textarea` and `PasswordInput` expose `focus()`: type the ref
  `ref<InstanceType<typeof Input> | null>(null)` and call `field.value?.focus()`, never `$el.querySelector`.

```vue
<!-- ✅ Preferred — the Field owns label + description + validation wiring -->
<Field required :invalid="!!errors.name">
  <Field.Label>Application name</Field.Label>
  <Input v-model="form.name" name="name" @update:model-value="errors.name = ''" />
  <Field.Description>Shown in the dashboard.</Field.Description>
  <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
</Field>

<!-- ⚠️ Loose — only when no Field fits; now YOU wire the label + aria-describedby -->
<Field.Label for="app-name" required>Application name</Field.Label>
<Input
  id="app-name"
  v-model="form.name"
  required
  :invalid="!!errors.name"
  :aria-describedby="errors.name ? 'app-name-error' : undefined"
  @update:model-value="errors.name = ''"
/>
<FieldError v-if="errors.name" id="app-name-error">{{ errors.name }}</FieldError>
```

## Pick the control from the kind of value

Before you write a field, name the **kind of value** it holds and take the control WebKit ships for
it. A plain `Input` is for free text only. A typed value in a text box (a date as
`2026-12-31T00:00:00Z`, a phone as digits, a port as text) makes the person learn a format, fails
only at submit and loses the keyboard, locale and time zone handling the real control already has.

| The field holds                                                 | Use                                                                                                                                                                                            | Bind                                                       | Never                                                                |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- |
| One date (due date, expiry, birthday)                           | `DatePicker`                                                                                                                                                                                   | `Date \| null`                                             | an `Input` that asks for `YYYY-MM-DD`                                |
| One date **and** time (a schedule, a start, an expiry instant)  | `DatePicker` with `show-time`                                                                                                                                                                  | `Date \| null`                                             | an `Input` that asks for ISO 8601 text, two loose text fields        |
| A start and an end, or "the last N" (a period, a window, a log) | `DateRangePicker` (`:show-time="false"` for whole days)                                                                                                                                        | a `DateRangeValue` (relative, absolute or since)           | two `DatePicker`s, two text fields                                   |
| A duration or a count (TTL, retention days, port, replicas)     | `NumberInput` with `min` / `max` / `step` and the unit in the label (`TTL in seconds`) or an `InputGroup`; a `Select` or `RadioGroup` of presets (`1 hour`, `7 days`) when the API takes a few | `number`                                                   | `Input`, a date picker for a number of days, `1h30m` typed by hand   |
| An approximate value inside a bounded range                     | `Slider`                                                                                                                                                                                       | `number`                                                   | a `NumberInput` when the exact digit does not matter                 |
| Money                                                           | `NumberInput` with the currency in the label (`Monthly limit in USD`) or an `InputGroup.Addon`, and `min`                                                                                      | `number` in major units; convert minor units at the edge   | a string with a currency sign the API must parse                     |
| A percentage                                                    | `NumberInput` with `:min="0"` `:max="100"` and `%` in an `InputGroup.Addon`                                                                                                                    | `number` from 0 to 100                                     | a fraction (`0.15`) the person has to convert                        |
| A phone number                                                  | `PhoneInput`                                                                                                                                                                                   | national digits + `v-model:country`; send the E.164 number | `Input` with a mask or a `+1` placeholder                            |
| A password or another secret (token, client secret)             | `PasswordInput` (+ `PasswordRequirements` under a new password)                                                                                                                                | `string`                                                   | `Input` with dots, a hand-made reveal button                         |
| A one-time code                                                 | `OtpInput`                                                                                                                                                                                     | `string`                                                   | six `Input`s                                                         |
| One choice of two to seven, all visible                         | `RadioGroup` (`variant="card"` for cards)                                                                                                                                                      | the option's value                                         | a `Select` for three options                                         |
| One choice from a longer list                                   | `Select` (a search box in its panel for a long list)                                                                                                                                           | the option's value                                         | a typed id or name                                                   |
| The ID of another resource (`organization_id`, `team_ids`)      | A resource picker searched by name: `Select` with a `#search` field and Load more, `Combobox` with server search, `MultiSelect` with `searchable` for several (below)                          | the ID, or an array of IDs                                 | an `Input` that asks for the ID, a label that says `Organization ID` |
| A value the list only suggests (a new one is valid)             | `Combobox`                                                                                                                                                                                     | `string`                                                   | an `Input` beside a list of examples                                 |
| Several choices from a list                                     | `MultiSelect`; a `Checkbox` per option for two to five                                                                                                                                         | an array of values                                         | a comma-separated `Input`                                            |
| On or off, saved with the form                                  | `Checkbox`                                                                                                                                                                                     | `boolean`                                                  | a `Select` with Yes and No                                           |
| On or off, applied at once                                      | `Switch`                                                                                                                                                                                       | `boolean`                                                  | a checkbox that saves on click                                       |
| A list of same-shaped rows (variables, headers, criteria)       | `AttributeEditor`                                                                                                                                                                              | an array of rows                                           | a `Textarea` of `KEY=value` lines                                    |
| Key and value tags of a resource                                | `TagEditor`                                                                                                                                                                                    | `key` / `value` pairs                                      | a comma-separated `Input`                                            |
| Files to upload                                                 | `FileDropzone` + a Browse files `Button`, the picked files in `FileTokenGroup`                                                                                                                 | the `File` list your form keeps                            | a native file input left unstyled                                    |
| Code, a query, JSON or YAML the person edits                    | `CodeEditor`                                                                                                                                                                                   | `string`                                                   | a `Textarea`                                                         |
| Several lines of free text                                      | `Textarea`                                                                                                                                                                                     | `string`                                                   | an `Input`                                                           |
| Text with a fixed part in the same box (`https://`, `.com`)     | `InputGroup` with `InputGroup.Addon`                                                                                                                                                           | `string`                                                   | the fixed part typed into the value                                  |
| The interface language                                          | `LanguageSelect`                                                                                                                                                                               | a BCP 47 tag                                               | a hand-made `Select` of languages                                    |
| The colour theme (system, light, dark)                          | `ThemeSwitcher`                                                                                                                                                                                | the mode                                                   | a `Select` or three buttons                                          |
| A form described by a JSON schema                               | `SchemaForm`                                                                                                                                                                                   | the value object                                           | fields written by hand from the schema                               |
| A score on a fixed scale (satisfaction, 1 to 5 stars)           | `Rating`                                                                                                                                                                                       | `number`                                                   | a `RadioGroup` of numbers                                            |
| A reply or note with formatting and @mentions                   | `MarkdownEditor` (Write and Preview)                                                                                                                                                           | a Markdown `string`                                        | a `Textarea` with hand-made toolbar buttons                          |
| One line of free text, an e-mail, a name, a slug                | `Input`                                                                                                                                                                                        | `string`                                                   | —                                                                    |

- **The model is the typed value, not its text.** A date field binds a `Date` (or `null` while empty)
  and the picker prints it for the person's locale and time zone. Convert at the edge: send
  `value.toISOString()` (or the ISO date) to the server and build the `Date` from the server's string
  when the form loads. The person never reads or types ISO 8601.
- **Bound what can be picked** with the control's own props (`min` / `max` on `DatePicker`,
  `DateRangePicker` and `NumberInput`) instead of refusing the value after submit. A date that must
  be in the future (a token expiry, a schedule) sets `:min` to today, a stored period sets
  `:max-duration`, a percentage stops at 100; still validate on submit.
- **Every one of these sits in a `Field`** and takes its label, description, `required`, `invalid`
  and `disabled` from it, like an `Input` does.
- **Label the thing, not its storage.** The label is `Organization`, `Assignee`, `Expires`; the API
  field name (`organization_id`, `expires_at`) never reaches the screen. The description says what
  the value is for, with a concrete example.
- **A closed set shows a human label per value**, never the raw value (`read_only`) as the label.
  A code, key or slug the person creates is an `Input` with its rule in `Field.Description`
  (`Lowercase letters, digits and _, 3 to 40 characters`), filled from the name until edited.
- **To show a value the person does not edit**, use `Timestamp` for a moment in time and a readonly
  `Input` for text, never a disabled picker.
- **Lint holds the clear cases.** `webkit/prefer-value-control` fails an `Input` with a native
  `type` of `number`, `date`, `datetime-local`, `time`, `tel` or `password`, or with a date format in
  its placeholder.
- **Not sure a control exists?** Ask the webkit MCP `suggest_component` with the kind of value ("date
  and time", "phone number") before you reach for `Input`; `Input` is the answer only for free text.

```vue
<!-- ❌ Wrong: the person must know and type ISO 8601, and the model is text -->
<Field>
  <Field.Label>Expires at</Field.Label>
  <Input v-model="form.expiresAt" placeholder="2026-12-31T00:00:00Z" />
</Field>
```

```vue
<script setup lang="ts">
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import Field from '@aziontech/webkit/field'
  import { reactive } from 'vue'

  const props = defineProps<{ today: Date }>()

  const form = reactive<{ expiresAt: Date | null }>({ expiresAt: null })
  const errors = reactive({ expiresAt: '' })

  function payload() {
    return { expires_at: form.expiresAt ? form.expiresAt.toISOString() : null }
  }
</script>

<template>
  <Field
    required
    :invalid="!!errors.expiresAt"
  >
    <Field.Label>Expires at</Field.Label>
    <DatePickerRoot
      v-model="form.expiresAt"
      show-time
      :min="props.today"
      clearable
      @update:model-value="errors.expiresAt = ''"
    />
    <Field.Description>The token stops working at this time.</Field.Description>
    <Field.Error v-if="errors.expiresAt">{{ errors.expiresAt }}</Field.Error>
  </Field>
</template>
```

### Dates and times

With `show-time` the value is an instant: send it with `toISOString()` (RFC 3339, UTC), as above. A
date with no time is a calendar day: send its local parts, never `toISOString()`, which moves the day
across zones. To pick in a zone that is not the browser's (the person's saved zone, the zone a
schedule runs in), bind `v-model:time-zone`: the trigger, the grid, the time field and `min` / `max`
all read in that zone while `v-model` stays the same instant. Name the zone beside the field (an
`abbr` with the zone id as its `title`, or a Time zone `Select`), as `DateRangePicker` asks of the page.

```vue
<script setup lang="ts">
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const due = ref<Date | null>(null)

  const calendarDay = (value: Date | null) =>
    value
      ? [
          value.getFullYear(),
          String(value.getMonth() + 1).padStart(2, '0'),
          String(value.getDate()).padStart(2, '0')
        ].join('-')
      : null
  // body: { due_date: calendarDay(due.value) }
</script>

<template>
  <Field>
    <Field.Label>Due date</Field.Label>
    <DatePickerRoot v-model="due" />
  </Field>
</template>
```

A period is one `DateRangePicker` (`@aziontech/webkit/date-range-picker`). In a form, offer absolute
ranges only; its value is `{ type: 'absolute', start, end }` with ISO strings, ready to send.
Relative ranges (`Last 24 hours`) belong to filters and dashboards, not to a stored period.

```vue
<script setup lang="ts">
  import DateRangePicker, { type DateRangeValue } from '@aziontech/webkit/date-range-picker'
  import Field from '@aziontech/webkit/field'
  import { ref } from 'vue'

  const period = ref<DateRangeValue | null>(null)
</script>

<template>
  <Field required>
    <Field.Label>Billing period</Field.Label>
    <DateRangePicker
      v-model="period"
      range-selector-mode="absolute-only"
      :show-time="false"
      :show-refresh="false"
      :max-duration="{ amount: 1, unit: 'year' }"
    />
  </Field>
</template>
```

### References to other resources — a picker, never an ID field

A field whose value is the ID of another resource is a **searchable resource picker**: the person
types part of a name, sees names, and picks one; the ID travels in `v-model` and never has to be
read or typed. Each option shows the **name first**, with the kind or a shortened ID
(`org_01a1…3f2a`) as secondary text, so two resources with the same name can still be told apart.

The picker follows the long-list rule in `/webkit-ux-heuristics`: search past 7 options, a fixed
first batch with Load more, a no-match line, and a `Create <noun>` action when the person may not
have the resource yet (`/webkit-create-surface`, section 6). A whole resource the flow may reuse or
create gets its own band instead: the `create/create-resource-picker` block (Existing / New).

**A `Select` with a search field** is the default: the search sits in `Select.Content`'s `#search`
slot, Load more and `Create <noun>` in its `#footer`, and `display-value` names the chosen resource
even when the current page of results does not hold it (an edit form opens on a saved ID).

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import { onBeforeUnmount, ref, watch } from 'vue'

  type Organization = { id: string; name: string }
  const props = defineProps<{
    listOrganizations: (query: {
      search: string
      page: number
      signal: AbortSignal
    }) => Promise<{ items: Organization[]; total: number }>
    selectedName?: string
  }>()

  const organizationId = ref('')
  const search = ref('')
  const items = ref<Organization[]>([])
  const total = ref(0)
  const page = ref(1)
  const loading = ref(false)
  const names = new Map<string, string>()
  let timer: ReturnType<typeof setTimeout> | undefined
  let controller: AbortController | undefined

  const shortId = (id: string) => (id.length > 12 ? `${id.slice(0, 8)}…${id.slice(-4)}` : id)

  async function load(next: number) {
    controller?.abort()
    controller = new AbortController()
    loading.value = true
    try {
      const result = await props.listOrganizations({
        search: search.value.trim(),
        page: next,
        signal: controller.signal
      })
      result.items.forEach((item) => names.set(item.id, item.name))
      items.value = next === 1 ? result.items : [...items.value, ...result.items]
      total.value = result.total
      page.value = next
    } finally {
      loading.value = false
    }
  }

  watch(search, () => {
    clearTimeout(timer)
    timer = setTimeout(() => load(1), 250)
  })
  load(1)
  onBeforeUnmount(() => {
    clearTimeout(timer)
    controller?.abort()
  })
</script>

<template>
  <Field required>
    <Field.Label>Organization</Field.Label>
    <Select
      v-model="organizationId"
      placeholder="Select an organization"
      :display-value="(id: string) => names.get(id) ?? props.selectedName ?? shortId(id)"
    >
      <Select.Trigger />
      <Select.Content>
        <template #search>
          <Input
            v-model="search"
            size="small"
            placeholder="Search by name"
            aria-label="Search organizations"
          />
        </template>
        <Select.Item
          v-for="organization in items"
          :key="organization.id"
          :value="organization.id"
        >
          {{ organization.name }}
          <span class="text-(--text-muted)">{{ shortId(organization.id) }}</span>
        </Select.Item>
        <template #footer>
          <Button
            v-if="items.length < total"
            :label="`Load ${Math.min(7, total - items.length)} more`"
            variant="ghost"
            size="small"
            class="w-full"
            :loading="loading"
            @click="load(page + 1)"
          />
        </template>
      </Select.Content>
    </Select>
    <Field.Description>The organization that owns the new project.</Field.Description>
  </Field>
</template>
```

**A `Combobox` with server search** fits when typing is the way in (a directory of people, a large
catalog) and a first batch of names is enough: `:filter="false"` hands filtering to the server,
`:allow-custom="false"` rejects text that names no resource, `:loading` shows the spinner and the
loading row, and each option's `description` carries the secondary text. `search` fires on every
keystroke, so debounce it; keep the chosen option in `options`, or the field falls back to showing
the raw value.

```vue
<script setup lang="ts">
  import Combobox, { type ComboboxOption } from '@aziontech/webkit/combobox'
  import Field from '@aziontech/webkit/field'
  import { onBeforeUnmount, ref } from 'vue'

  type Person = { id: string; name: string; email: string }
  const props = defineProps<{ findPeople: (text: string) => Promise<Person[]> }>()

  const assigneeId = ref('')
  const options = ref<ComboboxOption[]>([])
  const loading = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  let latest = 0

  function search(text: string) {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      const id = ++latest
      loading.value = true
      const people = await props.findPeople(text.trim())
      if (id !== latest) return
      const chosen = options.value.find((option) => option.value === assigneeId.value)
      const found = people.map((person) => ({
        value: person.id,
        label: person.name,
        description: person.email
      }))
      options.value =
        chosen && !found.some((option) => option.value === chosen.value)
          ? [chosen, ...found]
          : found
      loading.value = false
    }, 250)
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Field>
    <Field.Label>Assignee</Field.Label>
    <Combobox
      v-model="assigneeId"
      :options="options"
      :filter="false"
      :allow-custom="false"
      :loading="loading"
      placeholder="Search people by name or email"
      @search="search"
    />
  </Field>
</template>
```

Several references are a `MultiSelect` with `searchable` (and `:filter="false"` plus its `search`
event when the server filters): the chosen resources show as chips with their names. A list filter
on a referenced resource is a `PropertyFilter` property whose values come from `loadValues`, so the
token prints the name while the URL keeps the ID (`/webkit-lists`, section 3).

Pasting a full ID into the search is still useful to people who have one: when the text matches
the ID's pattern, resolve it with the API's get-by-ID call and offer that one resource as the
result.

### Reading it back — IDs and times in read views

The same values in a detail page or a table: **the name first**, linked by name; the ID as
secondary mono text with a copy button (`TableCellId`, with `resource` naming what it copies); a time
as `Timestamp` or `TableCellTime`, relative with the absolute date a hover away. `/webkit-tables`
owns the cell recipes.

### Do and Don't

- **Do:** pick the control from the type of the value before you write the field.
- **Do:** name the thing in the label and keep the API field name off the screen.
- **Do:** send instants as RFC 3339 UTC and calendar days as `YYYY-MM-DD` from their local parts.
- **Don't:** ask a person to type a date, a time, an enum value or another resource's ID.
- **Don't:** put a format in the placeholder (`YYYY-MM-DD`, `org_…`) as the only guidance; the
  right control makes the format disappear.

The consumer lint backs this section beyond `prefer-value-control`: `webkit/prefer-date-picker` warns on a text field that holds a
date or time by its key (`*_at` / `*At` / `*date` / `*time`) or label (`Start date`), or a `Textarea` or native input with a date format, and
`webkit/no-raw-id-input` on one that asks for an ID (key `*_id` / `*Id`, a label ending in `ID`, an
opaque identifier as placeholder). An identifier from another system that people copy in (a tax ID,
an OAuth client ID) is the one legitimate text field for an ID; the rule skips those names, and a
`readonly` field that only shows an ID.

## Label association — every control names itself (both approaches)

The one non-negotiable both layouts share: every control has a **programmatic accessible name**, its
error is **tied to it**, and related controls are **grouped** — so a screen reader announces the field,
its state, and the group it belongs to. The mechanics differ per approach, the contract does not:

- **A real label, never a placeholder.** Approach B (and a composed `Select`) wires a real `<label for>`
  to the control `id` — a `Field.Label` inside a `Field` does it for you (a `Select` inside a `Field`
  gets the id on its trigger); a `Field.Label` set apart from its control points `for` at
  `Select.Trigger`'s `id` (labelling the wrapper labels nothing). Approach A (ItemGroup) uses
  `Item.Title` as the field name and gives the control an `aria-label`. A placeholder is **never** the
  label — it disappears on input and is not a reliable accessible name.
- **Errors associated via `aria-describedby`.** The message carries an `id` and the control points
  `aria-describedby` at it, so it is announced when focus lands; `required` / `:invalid` set
  `aria-required` / `aria-invalid` — don't hand-roll them. Inside a `Field`, `Field.Description` /
  `Field.Error` register themselves and the control is described by them automatically; in an ItemGroup
  you set `aria-describedby` on the control and the `id` on the `<FieldError>` yourself.
- **Groups in `<fieldset>` + `<legend>`.** Each section is a native `<fieldset>` with a `<legend>`
  (`sr-only` when a visible title already names it); a radio/checkbox set is its own `<fieldset>` whose
  `<legend>` is the question.

The sections below show each mechanism in place; this is the contract they satisfy.

## Form Layout — the spacing reference

Every form sits on the same **Form Layout**: the shared spacing spec for field rows and columns — the
gutter between columns, the vertical rhythm between rows, and the label-to-control spacing. **This is the
reference.** The _form types_ below only change the **container** the form lives in and its **save
model**; the two internal layouts (Approach A / B) compose inside any of them. The spacing itself never
changes.

### Field spacing — the macro rule (one rhythm, everywhere)

The same spacing applies in **every** container and **both** approaches. Never hand-pick a one-off gap;
if a form seems to need a different rhythm, it's in the wrong container.

| Between                                               | Token          | px                                   |
| ----------------------------------------------------- | -------------- | ------------------------------------ |
| Label → control → FieldDescription (inside one field) | `--spacing-xs` | 8 — already baked into every `Field` |
| Field → field (and row → row)                         | `--spacing-lg` | 24                                   |
| Section → section                                     | `--spacing-lg` | 24                                   |
| Section title → its card (`SettingsGroup`)            | `--spacing-md` | 16 — owned by the component          |
| Compact modal body (Dialog / Drawer)                  | `--spacing-md` | 16 — the **only** allowed tightening |

### Hierarchy (top → down, never inverted)

form title (`text-heading-*` — `PageHeader` on a page, a `Card` title / `text-title-sm`
in a contained card, `DialogTitle` / `text-title-lg` in a modal) → form description (`text-body-sm text-(--text-muted)`)
→ section title (`SettingsGroup`, `text-heading-2xs`) or sub-heading (`text-heading-xs`) → **field label** (`Field.Label`,
which carries the Required marker) → control → **helper** (`Field.Description` guidance, then `Field.Error` for the invalid
feedback). A label is never smaller than its helper; a section title is never smaller than a field label.

## Form types — container and save model

Every form sits on the same **Form Layout** (above); a _type_ only changes the **container** the form
lives in and its **save model**. Approach A / B still applies inside each one. There are **five form
contexts** in Azion products:

- **Drawer form.** In-context creation — the user is working inside a resource and adds an item that
  only exists in it (a rule, an origin, a domain, a record) _without leaving the page they're on_. A
  first-level resource started from its own module creates on a page, not here
  (`/webkit-create-surface`; variables are the one exception). A `large` drawer (`/webkit-navigation`, Drawers). One scoped save (the drawer's primary
  action).
  Approach A for grouped/config-heavy creates (one flush ItemGroup, or several `SettingsGroup` bands),
  Approach B for short ones.

- **Missing-resource drawer.** A form whose field needs a resource that does not exist yet — a workload
  being created needs a digital certificate the reader has not made. The field offers `Create <noun>`,
  and a drawer holding **that resource's own create form** opens over the form, creates it and selects
  it back. A must, for first-level resources too: never send the reader to another page to create it
  and come back (`/webkit-navigation`, Create what is missing). `large` when opened from a page;
  from a drawer it is the nested drawer below.

- **Nested drawer.** A drawer form whose Select points at a resource or an item that may not exist
  yet — the origin a new rule sends requests to, or the certificate a new domain needs.
  Rather than sending the user away to create it (losing the parent form's in-progress state), a
  "Create …" quick-add opens a **second, smaller drawer** (`medium` over the parent's `large`, never a third) stacked over the first; on save the new item is
  appended to the Select's options and selected back into the parent. **Each drawer is its own form** —
  its own scoped save, its own `submitting` flag, its own `<fieldset>`; the two never share a lock.
  Approach A inside each. Documented below. A first-level resource (a Certificate, a Function, a
  Firewall) creates here too, with the same fields as its create page. Only a resource whose creation
  takes several steps (a repository import, a provisioning wizard) opens its create page in a new tab
  instead, and the field offers `Refresh`.

- **Dialog form.** Small, focused, usually confirmational or destructive — e.g. removing a resource.
  Few (or zero) fields, a single confirm action. A yes-or-no decision is `ConfirmDialog`
  (`@aziontech/webkit/confirm-dialog`); a typed confirmation puts its field in the default slot and
  keeps the confirm `disabled` until it matches. Approach B (stacked fields). A destructive confirm
  typically gates its action on a typed phrase (error prevention) rather than surfacing a required-error.

- **ItemGroup settings.** Account-level configuration surfaces built from `Item` rows (Approach A). The
  rows organize **either as multiple Cards** (grouped by topic — e.g. Billing split into Plan, Payment,
  Invoices; each card titled by a `SettingsGroup`, see Approach A § _Section title_) **or as a
  single flush block** (all rows in one container, for shorter or flat settings). Used for Billing,
  Integrations, Account Settings — "define and manage personal account preferences and profile config".
  The read-only cards beside them are components too, never a hand-written `dl` or `ul`: plan
  facts (Plan Price, Billing Period, Next Invoice) are `KeyValueList variant="split"`
  (`@aziontech/webkit/key-value-list`, label at the start, value at the end of each row), and
  the perks of an upgrade card are `PlanFeatureList` (`@aziontech/webkit/plan-feature-list`, a check per
  included feature, `:columns="2"` in a wide card).

- **Card with independent saves.** Long configuration pages split into multiple `Card` sections
  where **each card owns its own save**, so the user commits changes in parts instead of one giant
  submit. Approach A inside each card.

**Save model follows partitioning, not the container type.** A form that is one logical unit has **one
save** — a Drawer, a Dialog, or an ItemGroup (whether a single flush block **or** several
`SettingsGroup` bands, like Account Settings; the sections group the topic, not the save). A form deliberately split
into independently-committed cards — the **Card with independent saves** type — has **one save per
card**, each locking off its own `submitting` flag (the `/webkit-ui-states` contract).

Each form type has its pattern in the `webkit` MCP (`get_block`): the Drawer form and the Nested
drawer are `create/create-drawer` (variant `NestedDrawer` for the stacked child); the
Dialog form is `edit/edit-delete-dialog` (variant `SettingsRow` for the labelled
typed confirmation); ItemGroup settings and Card with independent saves are
`settings/settings-form`, whose primary `SaveAll` is the default one-save model and whose
`SavePerGroup` and `SavePerCard` variants are the split ones. A resource's own settings tab is
`edit/edit-resource`; every submit state is `state/state-form-validation`; a server
rejection that one section owns is its SectionRejected variant; a save that starts a long run (build,
deploy) is `state/state-async-submit`.

### Example — Card with its own save

A self-contained settings card (one of possibly several on the page, each committing independently): the
card's name is the `Card` **`title`** (it renders in the card header), then a short description at the
top of the body, the fields, an optional inline note, and the card's **own save in the footer**.
`Card`'s footer is centered by default, so a full-width `justify-between` child puts a "Learn more"
link on the left and Save on the right. Canonical pattern:

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import Link from '@aziontech/webkit/link'
  import Alert from '@aziontech/webkit/alert'
  import Select from '@aziontech/webkit/select'
  import { reactive, ref } from 'vue'

  const form = reactive({ preprod: 'default', prod: 'default' })
  const options = [
    { label: 'Default (controlled at the team level)', value: 'default' },
    { label: 'Enabled', value: 'enabled' },
    { label: 'Disabled', value: 'disabled' }
  ]
  const displayValue = (v) => options.find((o) => o.value === v)?.label ?? ''
  const submitting = ref(false) // /webkit-ui-states: Save :loading + fields :disabled off one flag
</script>

<template>
  <Card
    title="Azion Toolbar"
    class="w-full"
  >
    <template #default>
      <!-- body rhythm: fields are --spacing-lg apart; each field triad is --spacing-xs -->
      <div class="flex flex-col gap-(--spacing-lg)">
        <p class="text-body-sm text-(--text-muted)">
          Enable the Azion Toolbar on your Deployments.
        </p>

        <div class="grid grid-cols-1 gap-(--spacing-lg) sm:grid-cols-2">
          <div class="flex flex-col gap-(--spacing-xs)">
            <Field.Label for="tb-preprod">Pre-Production Deployments</Field.Label>
            <Select
              v-model="form.preprod"
              size="large"
              :display-value="displayValue"
            >
              <Select.Trigger id="tb-preprod" />
              <Select.Content>
                <Select.Item
                  v-for="o in options"
                  :key="o.value"
                  :value="o.value"
                  >{{ o.label }}</Select.Item
                >
              </Select.Content>
            </Select>
          </div>
          <div class="flex flex-col gap-(--spacing-xs)">
            <Field.Label for="tb-prod">Production Deployments</Field.Label>
            <Select
              v-model="form.prod"
              size="large"
              :display-value="displayValue"
            >
              <Select.Trigger id="tb-prod" />
              <Select.Content>
                <Select.Item
                  v-for="o in options"
                  :key="o.value"
                  :value="o.value"
                  >{{ o.label }}</Select.Item
                >
              </Select.Content>
            </Select>
          </div>
        </div>

        <Alert severity="info">
          To use the toolbar in production your team members need the Chrome extension, or
          <Link
            inline
            href="/docs/toolbar"
            >enable the toolbar for that domain</Link
          >
          in the toolbar menu.
        </Alert>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full items-center justify-between gap-(--spacing-sm)">
        <Link
          href="#"
          label="Learn more about the Azion Toolbar"
          size="medium"
        />
        <Button
          label="Save"
          variant="primary"
          size="medium"
          :loading="submitting"
        />
      </div>
    </template>
  </Card>
</template>
```

### Example — Dialog form (destructive confirm)

A modal for a short, blocking decision. Compose `Dialog` + `DialogContent` (it renders the overlay and the close button itself)
with the `Panel*` regions; the body uses the compact `--spacing-md` rhythm. The primary (destructive)
action stays disabled until the user types the exact confirmation phrase — error prevention, not a toast.
Canonical pattern:

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import DialogRoot from '@aziontech/webkit/dialog-root'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Input from '@aziontech/webkit/input'
  import Alert from '@aziontech/webkit/alert'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import { computed, ref } from 'vue'

  const open = ref(false)
  const phrase = 'webkit-docs-dev'
  const confirmation = ref('')
  const canDelete = computed(() => confirmation.value.trim() === phrase)

  const remove = () => {
    if (!canDelete.value) return
    open.value = false
    confirmation.value = ''
  }
</script>

<template>
  <DialogRoot
    v-model:open="open"
    size="medium"
  >
    <DialogContent>
      <PanelHeader class="w-full">
        <DialogTitle>Delete Application</DialogTitle>
      </PanelHeader>

      <!-- compact modal body: --spacing-md between blocks, on your own wrapper -->
      <PanelBody>
        <div class="flex flex-col gap-(--spacing-md)">
          <Alert
            severity="warning"
            label="Once confirmed, this action can't be reversed."
          />
          <p class="m-0 text-body-sm text-(--text-muted)">
            The selected Application will be deleted, along with all associated settings or
            instances.
          </p>
          <label
            for="confirm-delete"
            class="text-body-sm text-(--text-default)"
          >
            To confirm, type "{{ phrase }}" in the box below:
          </label>
          <Input
            id="confirm-delete"
            v-model="confirmation"
            autocomplete="off"
            class="w-full"
          />
        </div>
      </PanelBody>

      <PanelFooter>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              label="Cancel"
              variant="outline"
              @click="open = false"
            />
          </div>
          <div class="w-full md:w-fit">
            <Button
              class="w-full"
              label="Delete"
              variant="danger"
              :disabled="!canDelete"
              @click="remove"
            />
          </div>
        </div>
      </PanelFooter>
    </DialogContent>
  </DialogRoot>
</template>
```

### Example — Nested drawer (create a missing resource inline)

A drawer form whose `Select` points at a resource or an item that the user may not have created yet. Rather than sending them away to make it — and losing everything they've typed in the parent —
a "Create …" affordance in the `Select`'s footer opens a **second, smaller drawer** on top. The child
creates the item, appends it to the `Select`'s options, selects it back into the parent, and closes; the
parent form is exactly as the user left it. This is the pattern behind _Rules Engine → Add Rule → Origin →
Create Origin_ on a resource (`create/create-drawer`, variant `NestedDrawer`): the rule and the
origin both live inside the storefront resource, so both create in a drawer.

**First-level resources too.** When the missing thing is a first-level resource (a Certificate, a
Function, a Firewall), the child drawer holds that resource's own create form, the same sections and
fields as its create page. The same shape works from a page: on a workload create page, the
Certificate `Select` opens a `large` drawer with the certificate form. Only a resource whose creation
takes several steps (a repository import, a provisioning wizard) does not fit a drawer: open its
create page in a new tab, so the form keeps its typing, and give the field a `Refresh` option.

Three decisions make it safe:

- **Independent scopes.** The parent and child are separate `<form>`s, each with its **own** `submitting`
  flag, its own `<fieldset :disabled>`, its own Save `:loading` (the `/webkit-ui-states` Pattern 1 lock, per
  drawer). Submitting the child never locks the parent, and the parent's save never touches the child.
- **A controlled Select + a sentinel value.** The parent `Select` is **controlled** (`:model-value`, not
  `v-model`) so picking the quick-add never commits a real value. The quick-add is a normal
  `Select.Item` in the `#footer` slot carrying a sentinel value; `@update:model-value` intercepts it,
  closes the dropdown, and opens the child instead of assigning `form.*`.
- **Stacking is built in.** The child `Drawer` portals after the parent, so it sits over it at the same
  layer, and a `Select.Content` teleports at `--z-control-overlay` (above every drawer). Add no `z-*`
  overrides to the overlay, the content or the popups.

Canonical pattern:

```vue
<script setup>
  // PARENT large drawer adds a Rule with a Select of the resource's Origins; the CHILD medium drawer creates one.
  const origins = ref([{ value: 'origin-api', label: 'api-backend' }])
  const originLabel = (v) => origins.value.find((o) => o.value === v)?.label ?? ''

  // The PARENT form's own scope.
  const form = reactive({ name: '', originId: '' })
  const errors = reactive({ name: '', originId: '' })
  const submitting = ref(false)

  // A sentinel Select value for the quick-add. The Select is CONTROLLED (:model-value),
  // so picking the sentinel never commits a real value — it opens the child instead.
  const CREATE_ORIGIN = '__create-origin__'
  const originSelectOpen = ref(false) // control the dropdown so we can close it first
  const onOriginModel = (value) => {
    if (value === CREATE_ORIGIN) {
      originSelectOpen.value = false // close the dropdown …
      childOpen.value = true // … then open the child over the parent
      return
    }
    form.originId = value
    errors.originId = ''
  }

  // The CHILD form's own, SEPARATE scope — its own submitting flag.
  const childOpen = ref(false)
  const childForm = reactive({ name: '', address: '' })
  const childSubmitting = ref(false)

  const submitChild = async () => {
    if (childSubmitting.value) return // re-entrancy lock, on the CHILD's flag
    childSubmitting.value = true
    try {
      const value = `origin-${uid()}`
      origins.value = [{ value, label: childForm.name.trim() }, ...origins.value]
      form.originId = value // select the new origin back into the parent
      errors.originId = ''
      toast.success(`Origin "${childForm.name.trim()}" created.`)
      childOpen.value = false
    } catch (error) {
      toast.error('Could not create the origin.', { description: error?.message })
    } finally {
      childSubmitting.value = false // release on success AND failure
    }
  }
</script>

<template>
  <!-- PARENT (Add Rule): the Origin Select with a quick-add in its footer slot -->
  <Select
    :model-value="form.originId"
    v-model:open="originSelectOpen"
    :display-value="originLabel"
    :disabled="submitting"
    placeholder="Select an origin"
    required
    :invalid="!!errors.originId"
    @update:model-value="onOriginModel"
  >
    <Select.Trigger
      id="rule-origin"
      aria-label="Origin"
    />
    <Select.Content>
      <Select.Item
        v-for="origin in origins"
        :key="origin.value"
        :value="origin.value"
        >{{ origin.label }}</Select.Item
      >
      <template #footer>
        <Select.Item
          :value="CREATE_ORIGIN"
          icon="az az-circle-plus"
          >Create Origin</Select.Item
        >
      </template>
    </Select.Content>
  </Select>

  <!-- CHILD medium drawer — its own form + submitting flag; portals over the parent -->
  <Drawer
    v-model:open="childOpen"
    size="medium"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Create Origin"
        novalidate
        @submit.prevent="submitChild"
      >
        <fieldset
          class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0"
          :disabled="childSubmitting"
        >
          <legend class="sr-only">Create origin</legend>
          <!-- Approach A ItemGroup sections here: Name, Address -->
        </fieldset>
        <!-- PanelFooter: Cancel + Create Origin type="submit" :loading="childSubmitting" -->
      </form>
    </DrawerContent>
  </Drawer>
</template>
```

Rules:

- **Parent and child are two independent forms.** Each has its own `submitting` flag, `<fieldset :disabled>`,
  and Save `:loading`; neither save locks the other. Guard each handler and release in `finally`.
- **The parent `Select` is controlled + intercepted.** Use `:model-value` (not `v-model`), a sentinel
  value for the quick-add `Select.Item` (in the `#footer` slot), and an `@update:model-value` that opens
  the child on the sentinel and only otherwise assigns `form.*` and clears the error.
- **Close the dropdown before opening the child.** Control the parent `Select`'s open state
  (`v-model:open`) and set it `false` in the same handler that opens the child, so the popup doesn't linger
  under the new drawer.
- **On the child's save, wire the resource back into the parent** — append it to the `Select`'s options,
  set the parent's model to the new value, clear the parent's error for that field, `toast.success`, close
  the child. The parent form keeps everything else the user had typed.
- **The child creates whatever the field is missing**, an item of the parent's resource or a
  first-level resource, with that resource's own create form. Only a multi-step create opens its page
  in a new tab instead.
- **No `z-*` overrides** — the child drawer portals over the parent and `Select.Content` already sits
  above every drawer.
- Everything else follows the **Drawer form** rules: Approach A ItemGroup sections inside each drawer,
  validation on submit only (`Item.Title` as the label, `FieldError` under the control), Enter submits
  through the Save `Button type="submit"`.

## Approach A — Cards + ItemGroups (grouped / settings forms)

Each section is a `SettingsGroup` (`@aziontech/webkit/settings-group`) over a flush `Card`
(`:padded="false"`) whose body is an `Item.List`. `Item.List` draws the dividers between rows, so every
field reads as a divided row inside one box. Each row is a `SettingsRow`
(`@aziontech/webkit/settings-row`): the field's name and guidance on the left, the control on the right.
Sections stack at the section gap; the first one takes no top margin.

**In a SettingsRow, `title` IS the label.** Do **not** use `<Field.Label>` inside a row — the field name is
`title`, its guidance is `description`, and the control carries an `aria-label` with the same text for
its accessible name. `<Field.Label>` is reserved for **Fields separated** (Approach B) and composed `Select`
fields, where there is a real `<label for>` wired to a control `id`.

**A language setting is `LanguageSelect`** (`@aziontech/webkit/language-select`), the full field
(the default `variant="outline"`: round flag and the language named in itself) in a `field` row, with
`aria-label="Language"`; never a `Select` of language names you list yourself.

**`variant` places the control by what it needs.** `field` (the default) for `Input` and `Select`: a right
cell capped at `--container-3xs`, so every field on the card ends at the same edge. `compact` for a
`Switch` or a `Button`, hard right at its natural width. `stacked` for a `Textarea`, a radio group or an
editor, under the copy at the full measure. A setting that only applies while the row above it is on
renders with `v-if` on that state and `:level="1"` (or `2`), indented under a rule.

**The row stacks on a phone and aligns to the top.** The copy and the control align to the top of the
row (a title stays level with the first of three stacked inputs), and the description always wraps in
full, never truncated. In a narrow row (a phone) a `field` control moves under the copy at full width; a
`compact` switch or button stays at the end side. Set `stackable` on one row only when its field needs
the full measure in a drawer-width box (a long URL in a side drawer); never wrap a row in your own flex
box to restack or re-centre it.

Canonical pattern:

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Switch from '@aziontech/webkit/switch'
</script>

<template>
  <SettingsGroup
    label="General"
    hint="How this application is identified, and whether it is serving traffic."
    anchor="general"
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            title="Name"
            description="A unique, descriptive name for the application."
          >
            <!-- Control + feedback stack in the row's control column: `required` is static
                 from the first render; a failed submit sets `invalid` for an empty or a
                 malformed value, and the FieldError renders UNDER the control. -->
            <Input
              v-model="form.name"
              size="large"
              class="w-full"
              aria-label="Name"
              required
              :invalid="!!errors.name"
              :aria-describedby="errors.name ? 'name-error' : undefined"
              @update:model-value="errors.name = ''"
            />
            <FieldError
              v-if="errors.name"
              id="name-error"
              >{{ errors.name }}</FieldError
            >
          </SettingsRow>
          <SettingsRow
            title="Active"
            description="When off, the application stops serving traffic."
            variant="compact"
          >
            <Switch
              v-model="form.active"
              aria-label="Active"
            />
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

Rules:

- **`SettingsGroup` + `Card :padded="false"` + `Item.List`** — one box per band, dividers from the
  list, no box-in-box. The card is header-less (only its default slot); the band's title is the section's.
- **Every row is a `SettingsRow`.** Do not hand-write the `Item` / `Item.Content` / `Item.Actions`
  markup of a settings row; the row owns its density (`Item size="small"`) and the control placement.
- **`title` is the label; the control takes an `aria-label`** with the same text. No `<Field.Label>` inside a
  row — the control takes `required` from the first render, and validation feedback is its own
  `:invalid` on submit.
- **The validation message renders as a `FieldError` under the control**, in the row's default slot
  after the control, shown only after a failed submit and linked to the control via
  `aria-describedby`. This is still the field saying what it needs, on the field — **not** a summary
  block or a `Alert` callout. `description` stays as the always-on guidance on the left.
- **`required` is static; `invalid` is the only error state.** Set `required` on the control from the
  first render (it sets `aria-required` and draws no colour). A failed submit sets `:invalid` for any
  blocking problem — an empty required value or a malformed one — and the `<FieldError>` says what to
  enter (`Enter a name.`, `This field is required.`). Only then does the field turn red. The same holds
  for `Select` / `MultiSelect`: static `required`, `:invalid` bound to the error.
- **Richer controls that don't fit a one-line row** (a radio group, a block of `Field` choice cards,
  a list editor) use `variant="stacked"`, not a squeezed right column.

### Section title — the SettingsGroup heading

When a settings surface is split into topic bands (the Account Settings pattern), **each band is a
`SettingsGroup`**: an h2 titled in one or two words, its one-sentence guidance in `hint` (rendered as
a `Hint` glyph beside the title), and `anchor` when people link to it (the h2 takes the id and a
copy-link appears in the gutter on hover or focus). An Advanced band whose defaults suit most people is
`collapsible` with `icon="az az-settings"`; it starts closed, and its body is `inert` while folded.

Rules:

- **Do not also set a `Card` `title`** on the card inside a band — the band's title would double it.
- **A help button beside the title goes in the `info` slot** (`SettingsGroup` and `Subheader` both
  have one): an `IconButton` `az az-circle-help`, `variant="ghost"`, `size="small"`, named after the
  topic (`Help: Advanced`), that opens the page's `HelpPanel`. The slot sits outside the h2 and, on a
  collapsible band, outside the disclosure, so pressing it never folds the band. A one-sentence note
  stays in `hint`; never put a button in the `label` slot, which renders inside the h2 and the toggle.
- **A band with a description line and its own actions** (Billing's Payment methods with Add payment
  method) is a `Subheader` (`@aziontech/webkit/subheader`) over its card, not a
  `SettingsGroup`.
- **`SettingsGroup` vs `Card` title — pick by role.** A `SettingsGroup` titles a _band of a larger
  page_. A **`Card` `title`** (in the card header) names a _self-contained card that is the form_ — the
  "Card with its own save" / Contained form. Never use both on one card.

## Approach B — Fields separated (short focused forms)

A field is a **triad**: a visible label, the control, and a description. Ship it as a
`Field` (`@aziontech/webkit/field`) — it renders the triad and wires the a11y for you: the label's `for`
matches the control `id`, the description is linked via `aria-describedby`, `required` sets
`aria-required`, and `invalid` sets `aria-invalid`. Stack the fields in a single column (`Field.Group`
gives the `--spacing-lg` rhythm).

`required` is **static** — set it on the `Field` from the first render. `Field.Label` shows the Required
marker (a lone `*`, hidden from screen readers) from it and the control gets `required` / `aria-required`; it draws no
colour. A failed submit sets the Field's `:invalid` for any blocking problem, empty or malformed, and a
`Field.Error` says what to enter. Canonical pattern:

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
</script>

<template>
  <Field.Group>
    <!-- `required` is static; a failed submit sets `invalid` for an empty or a
         malformed value. `errors.name` holds the message ("" = valid). -->
    <Field
      required
      :invalid="!!errors.name"
    >
      <Field.Label for="app-name">Name</Field.Label>
      <Input
        id="app-name"
        v-model="form.name"
        name="name"
        placeholder="my-application"
        @update:model-value="errors.name = ''"
      />
      <Field.Description>A unique name for this application.</Field.Description>
      <Field.Error v-if="errors.name">{{ errors.name }}</Field.Error>
    </Field>
  </Field.Group>
</template>
```

A `Field.Label` set apart from its control (no enclosing `Field`) takes its own `required` to show the
marker.

### Required and optional

- **Mark the required fields, leave the optional ones plain.** `required` on the `Field` draws the `*`
  after the label; an optional field has no `required` and no marker. Do not write "(optional)" or
  "(required)" into the label text.
- **Screen readers hear "required" from the control, not from the `*`.** The `*` is `aria-hidden`. A
  text box, combobox, checkbox, switch or radio group carries `required` / `aria-required`; a control
  whose role cannot (the `DatePicker` and `DateRangePicker` trigger buttons, the `FileDropzone` and
  `TagEditor` groups) is described by the `Field`'s hidden "Required" text instead. Both come from the
  `Field`; you wire nothing.
- **Optional means "may be empty", not "anything goes".** A value that is filled in must still be valid.
  For a `PhoneInput`, read the `phone-change` payload: a required phone is valid when `complete` is true;
  an optional one when it is empty or complete (`!phone.digits || phone.complete`).

### One errors object for the whole form

The state of every field lives in **one place**: an `errors` object for the whole form, with one entry
per field (`''` = valid). Each `Field` reads its own entry for `:invalid` and its `Field.Error`. You never
set `invalid` on the control, the description or the label one by one: the `Field` passes it to all of
them (red border, red description, `aria-invalid`, the error tied through `aria-describedby`).

A form library gives you the same object: VeeValidate with a zod schema returns `errors` keyed by field
name, and `z.string().optional()` is the optional field. Keep the schema in the app; the `Field` only
shows the state it is given. The full example is the `Validation` example of `field` in the catalog.

Parts of the `Field` compound (ask the webkit MCP `suggest_component`, or read
`node_modules/@aziontech/webkit/catalog.json` (`imports`)): `Field.Label`, `Field.Description`,
`Field.Error`, `Field.Group`, `Field.Set`, `Field.Legend`, `Field.Content`, `Field.Title`,
`Field.Separator`. Controls: `input`, `textarea`, `select`, `multi-select`, `number-input`,
`password-input` (+ `password-requirements` for the rules row), `phone-input`, `input-group` (+
`InputGroup.Input`), `checkbox`, `radio-group`, `switch`, `slider`.

Rules:

- **Never a bare `Input` / `Textarea` next to a floating `<p>` "label".** Wrap it in a `Field`.
  A placeholder is **not** a label — it vanishes on input and is not a reliable accessible name.
- **The description is the guidance region.** Feed it the field's guidance; on a failed submit set the
  Field's `:invalid` (for an empty required value or a malformed one) and render the message in a
  `Field.Error` beside it. `required` stays static and never colours the field.
- **A `Select` in a `Field` is labelled on its trigger automatically**; outside a `Field`, see the next
  pattern.

## Composed Select — label the TRIGGER, not the wrapper

Inside a `Field`, `Field.Label` already targets the trigger. When you render a `Field.Label` apart from a
`Select` (no enclosing `Field`), the focusable
element is the **trigger** (a `role="combobox"` `<button>`), and `Select`'s `$attrs` land on its outer
wrapper `<div>`, _not_ the button. So the `Field.Label`'s `for` and the `id` must go on **`<Select.Trigger>`**.
Pointing `<label for>` at the `<Select>` wrapper labels nothing. This holds in **both** approaches.

```vue
<!-- `required` is static; a failed submit sets `invalid` and shows a FieldError. -->
<Field.Label for="app-country" required>Country</Field.Label>
<Select
  v-model="form.country"
  placeholder="Select an option…"
  required
  :invalid="!!errors.country"
  :display-value="labelOf(countries)"
  @update:model-value="errors.country = ''"
>
  <Select.Trigger id="app-country" />
  <Select.Content>
    <Select.Item v-for="o in countries" :key="o.value" :value="o.value">{{ o.label }}</Select.Item>
  </Select.Content>
</Select>
```

Rules:

- **`Field.Label for` === `Select.Trigger id`.** Same string, and it must be the trigger's.
- **`Select` already sets `aria-required` / `aria-invalid`** on the trigger from its `required` /
  `invalid` props — pass the props, don't hand-roll the aria.

## Grouping — a real `<fieldset>` + `<legend>`

Each section is a **group of related controls**. Give it programmatic grouping with a native
`<fieldset>` and an `sr-only` `<legend>` (the visible section title — the `SettingsGroup` title or `Card title`
— already names it, so it isn't drawn twice). A `<fieldset>` also disables its whole subtree in one
attribute, which is how you lock the scope on submit.

```vue
<fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-lg) border-0 p-0" :disabled="submitting">
  <legend class="sr-only">Account settings</legend>
  <!-- sections: Card + Item.List (Approach A) OR stacked Fields (Approach B) -->
</fieldset>
```

Rules:

- **`<legend>` is the fieldset's first child**, and `sr-only` when a visible title already shows it.
- **Related radios/checkboxes are their own group** — a set of checkboxes is a `<fieldset>` whose
  `<legend>` is the question; the choice cards are the options. A set of radios is one `RadioGroup`
  (a `radiogroup` named by `aria-label`, or by the `Field.Legend` of the `Field.Set` around it). `Field.Set` + `Field.Legend` render that
  native `<fieldset>` + `<legend>` without browser chrome.

## Native input hints — autofill, keyboards, paste

The browser, password managers and mobile keyboards read the `<input>`, so the hints must land
there. `Input` takes `type`, `autocomplete` and `spellcheck` on its `<input>`; `PasswordInput` takes
`autocomplete`.

| Field                                  | `type`  | `autocomplete`     | `spellcheck` |
| -------------------------------------- | ------- | ------------------ | ------------ |
| Sign-in e-mail / username              | `email` | `username`         | `false`      |
| Sign-up, contact or newsletter mail    | `email` | `email`            | `false`      |
| Current password                       | —       | `current-password` | —            |
| New password (sign-up, reset)          | —       | `new-password`     | —            |
| One-time code                          | `text`  | `one-time-code`    | `false`      |
| Slug, external ID, domain, token, code | `text`  | `off`              | `false`      |
| Search, filter (not a credential)      | `text`  | `off`              | —            |

- `Input`'s `type` is a keyboard and autofill hint for **text**. A date, a date and time, a phone
  number, a password or a one-time code is never an `Input` with a `type`, a mask or a format in its
  placeholder: each has its own control (see "Pick the control from the kind of value").
- Give every control a meaningful `name` next to `autocomplete`; autofill needs both.
- WebKit hides every field **without** `autocomplete` from password managers (`data-1p-ignore` and the
  LastPass, Bitwarden and Dashlane equivalents), so 1Password never offers a sign-in on an account name
  or a search box. A login or contact field **must** set `autocomplete` (or `type="email"`) to stay
  fillable; a read-only field is always hidden.
- **Never block paste** — not in passwords, not in one-time codes, not in confirmation fields.
- Do not block keystrokes in a numeric field: accept the input and validate on submit.
- Trim the value before validating: input methods and autofill add trailing spaces.
- A field that is not a credential never uses a reserved name (`password`, `email`) that makes a
  password manager offer itself.

Validation runs **on submit, once** — not on every keystroke, not on blur. The **feedback is the
field's own state plus an on-field `FieldError`** — there is **no separate error-summary block and no
`Alert` callout** for field validation; the field says what it needs, where it is.

**`required` is static; `invalid` is the error.** Two settings, two jobs:

- **`required`** → set from the first render (on the `Field`, or on the control when there is no
  `Field`). It shows the Required marker on `Field.Label`, sets `aria-required` and draws no colour.
- **`invalid`** → set by a failed submit for **any** blocking problem: an empty required value or a
  malformed one. The field turns red and a `FieldError` / `Field.Error` says what to enter.

On a failed submit, **move focus to the first field in error** so keyboard and screen-reader users
land on it. Never pre-disable the submit button to stop an incomplete form: let it submit and show
the feedback.

Store a real message that says what to enter, so the `FieldError` has something to show.

**Where a field has a `Field.Label`, its Required marker shows from the first render**, so the user knows
the field is mandatory before touching it. Only the red `invalid` state is revealed on submit. An
**ItemGroup** has no `Field.Label`, so it has no visible marker — the control still takes `required`,
and a failed submit shows the `FieldError`.

```js
const errors = reactive({ name: '', country: '' }) // "" = valid; populated ONLY by validate()
const fieldRefs = reactive({ name: null, country: null }) // :ref="(el) => (fieldRefs.name = el)" on each control

const validate = () => {
  // Empty or malformed → a message that says what to enter; both set invalid.
  errors.name = form.name.trim() ? '' : 'This field is required.'
  errors.country = form.country ? '' : 'This field is required.'
  return !errors.name && !errors.country
}

const submit = async () => {
  if (submitting.value) return // re-entrancy lock
  if (!validate()) {
    // errors now drive :invalid; focus lands on the first field in error, no summary
    const first = Object.keys(errors).find((key) => errors[key])
    await nextTick()
    fieldRefs[first]?.$el?.querySelector('input, textarea, button')?.focus()
    return
  }
  submitting.value = true
  try {
    await save(form)
    toast.success('Saved.')
  } catch (error) {
    toast.error('Could not save.', {
      description: error?.message,
      action: { label: 'Retry', onClick: submit }
    })
  } finally {
    submitting.value = false
  }
}
```

Rules:

- **`<form novalidate @submit.prevent>`** — own the validation; the native bubble UI is inconsistent
  and unstyleable.
- **Validate on submit only.** No live validation while the user types the first time.
- **The feedback is `:invalid` bound to the error** (for an empty required value or a malformed one),
  appearing only after a failed submit and clearing as the user edits
  (`@update:model-value="errors.x = ''"`). `required` is static and draws no colour. Colour is never the
  only signal — the error icon and message text are the non-colour cue.
- **The message lives on the field, as a `FieldError`.** In **Fields separated** it is a `Field.Error`
  inside the Field; in an **ItemGroup** it is a `<FieldError>` rendered under the control (see
  Approach A). Its text is its default slot, in `--text-danger` after an `az az-circle-alert` icon.
  Either way it is `aria-describedby`-linked to the control and appears only after a failed submit.
- **No custom error-summary block** (`role="alert"` list of links) and **no `Alert` callout** for
  field validation. Those were removed on purpose: the field's own state + its `FieldError` is the feedback.
- **Never `toast` a field error.** Missing/invalid input stays on the field. Toast is for
  request/API failures only (see `/webkit-ui-states`).

> **A server rejection scoped to one field is a different case**, and it is the one place a `Alert`
> is right. The value is not malformed — the API rejected it (a referenced object was deleted, a name
> is already taken), so it takes **both** surfaces: a `Alert` inside that field's own section _and_
> the field's red `invalid` state. On a
> long form, scroll-anchor the erroring section. The full placement table — field, section `Alert`,
> toast, auth card, background-job toast — is **`/webkit-errors`**.

## Submission — native submit, one locked scope, sticky actions

The primary action drives the native submit so **Enter submits**. While the request runs, **one flag
locks the whole scope** — this is `/webkit-ui-states` **Pattern 1**; this skill **references it, does not
re-derive it**. Save shows `:loading`, and **every field the action reads takes `:disabled` off the same
flag**. On a long form, the actions live in a **sticky bar** — `SaveBar`
(`@aziontech/webkit/save-bar`) — so Save/Cancel are always reachable. A create page uses
`variant="centered"` (Cancel and Create in a raised card centred at the bottom of the form, always
shown, at every width — never a hand-built sticky pill); an in-page form saved as one unit uses
`variant="plain"` (always shown, on the form column); a full-page wizard step uses
`variant="fade"` (no border, Back in `#leading`, the step's submit in `#actions`); a settings page
mounts the default `floating` bar only while the form is dirty or saving, with the status sentence
in its default slot.

**Bind `:disabled` on the controls, not only the `<fieldset>`.** A native `<fieldset :disabled>` blocks
_interaction_ for the whole subtree, but webkit controls (`Select`, `Switch`, `Input`, …)
render their **disabled visual** from their own `disabled` prop — a fieldset alone leaves them looking
active mid-submit. Keep the `<fieldset :disabled="submitting">` as the native safety net **and** pass
`:disabled="submitting"` to each `Field` (it disables the control inside) or to each bare control. Multi-save forms
(Card with independent saves) bind each card's controls to _that card's_ flag.

```vue
<SaveBar variant="plain">
  <template #actions>
    <Button type="button" label="Cancel" variant="outline" size="medium" :disabled="submitting" @click="cancel" />
    <Button type="submit" label="Save" variant="primary" size="medium" :loading="submitting" />
  </template>
</SaveBar>
```

Rules:

- **Enter must submit.** Give the primary `Button` `type="submit"` and handle the save in the form's
  `@submit.prevent` — never also in the Button's `@click`, or it runs twice. Every other `Button`
  keeps the default `type="button"`. `disabled` and `loading` block the submit, Enter included. The
  submit `Button` must sit inside the `<form>`: when the footer lives outside it, move the `<form>` up
  to wrap the footer too. No hidden `sr-only` submit button.
- **Lock off one flag.** `<fieldset :disabled="submitting">` + `:disabled="submitting"` on **every**
  control + Save `:loading="submitting"`; guard the handler and release in `finally` (this IS
  `/webkit-ui-states` Pattern 1 — the fieldset is the native lock, the per-control
  `:disabled` is what makes webkit `Select`/`Switch`/`Input` show the disabled visual).
- **Report the request result where the user is looking** — `toast.success` on the happy path,
  `toast.error` with a Retry on failure. Field errors stay inline.

### Form errors — the server rejects one section (`state/state-form-validation`, SectionRejected)

The design sample's `/forms/error-validation` screen is the standard. When the server rejects the save
because of one section (a linked resource another user deleted, a value only that section owns), the
form does four things, and never toasts:

1. **One danger `Alert` above that section**, under its `Subheader`, saying what happened, why,
   that nothing else was lost, and what to do, as separate sentences: `Origin "web-origin-prod" no
longer exists. Another user deleted it while you were filling in this form, so the service wasn't
created. Nothing else was lost: reload the origin list and select another one.`
2. **The recovery action on that `Alert`** (`#actions` slot, `variant="secondary"`): `Reload origins`,
   with `loading` while it runs; meanwhile the field gives way to a `Skeleton` and Save is disabled.
3. **The field turns `invalid`** with its own one-line reason under it (`This origin no longer
exists.`), wired by `aria-describedby`. After the reload clears the stale value its message becomes
   `Select an origin to continue.` and the `Alert` closes.
4. **The page takes the user there**: after the lock is released, scroll the section to the top of the
   scroll container (instant under `prefers-reduced-motion`) and focus the field with
   `preventScroll`. Every other entry is kept.

Where each error renders, row by row, is `/webkit-errors`.

### Unsaved changes — `useUnsavedChanges` (`edit/edit-resource`)

Every edit form keeps a saved baseline and asks before its edits are lost. Do not hand-roll
`JSON.stringify` baselines or `beforeunload` listeners: use the composable.

```js
import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
import { onBeforeRouteLeave } from 'vue-router'

const guard = useUnsavedChanges(() => form, {
  onDiscard: (baseline) => Object.assign(form, baseline),
  onSave: save
})
onBeforeRouteLeave(() => guard.confirmLeave())
```

- `isDirty` shows the `SaveBar` and the `dirty` mark on the section's `Tabs.Trigger`; `commit()` after a
  successful save, `discard()` for the bar's Discard (a ref source is restored in place, a getter
  source goes through `onDiscard`).
- `confirmLeave()` resolves `true` at once while clean; while dirty it opens the dialog and resolves
  with the user's choice. Use it in `onBeforeRouteLeave` and in the setter of a tab bar's `v-model`.
- Render one `ConfirmDialog v-bind="guard.dialogProps"` with the `#actions` slot holding Keep editing
  (`guard.keepEditing`), Discard changes (`guard.discardAndLeave`) and, when `onSave` is set, Save
  changes (`guard.saveAndLeave`, `:loading="guard.dialogProps.loading"`); labels come from
  `guard.labels` (built in for en, pt-BR and es).
- The browser's own reload / close prompt runs while dirty; turn the guards off with
  `enabled: false` while a successful save navigates away.
- When the record was saved elsewhere after the form opened, follow `edit-resource#StaleRecord`: a
  warning `Alert` above the form with Reload, and an overwrite `ConfirmDialog` before Save.

## Read-only vs disabled — a value the user cannot change

A value the user can see but must never edit — a client ID, an account ID, a generated key, a
creation date, an e-mail that only support can change — is **read-only**, not disabled:

```vue
<Field>
  <Field.Label>Client ID</Field.Label>
  <Input v-model="clientId" readonly monospace :spellcheck="false" />
  <Field.Description>Can't be changed. Quote it when opening a support ticket.</Field.Description>
</Field>
```

- `readonly` keeps the value in `var(--text-default)`, focusable and copyable. The `Input` stays the
  **same filled field** (surface, solid border) and only drops the hover border, as the design
  sample draws it; never restyle it (dashed border, transparent fill) to make it look different.
- **A long value takes `Textarea readonly`**, which draws the same filled field as `Input` (a
  certificate, a generated policy, a description only an admin can change; `Textarea` example
  ReadOnly). Never a `<pre>` or a styled block in its place.
- Say **why** in the helper text (who owns the value, and how to change it if that is possible): the
  description, not the chrome, tells the user the value is fixed.
- **Code-like values take `monospace`**: a CLI command, an ID, a token, a hash, a path. A command the
  user copies is `readonly monospace` in an `InputGroupRoot` with a `CopyButton`
  (`Input` example ReadOnly). Prose values (names, e-mails, domains being typed) stay in the sans face.
  The same `monospace` prop is on `PasswordInput` (an API token or client secret, with
  `autocomplete="off"`) and on `Textarea` (a pasted zone file, certificate, JSON or list of IPs). Never
  hand-apply `text-label-code-sm` / `text-body-code-sm` to a field.
- **`disabled` is something else:** a control that is temporarily unavailable (a submit lock, a
  dependency not met). It greys the value out and drops it from the tab order. Never use it for a
  value that is permanently fixed.
- Never fake read-only with a plain `<input>` or text styled to look like a field, and never leave a
  fixed value in an editable field "because the save ignores it".

## Disabled state — the disabled helper is optional context, not submit feedback

A `Field.Description` in a disabled `Field` (it takes the disabled tone: a lock glyph, muted text) is an **optional** element
whose only job is to explain **why a field is disabled** and how to lift the lock. It is **not**
validation feedback and it is **not** required by the submit lock. Two cases:

- **Submit lock — you don't need a helper, and you get none.** The `:disabled="submitting"` applied to
  every control during a save is transient (it clears in `finally`) and the Save button's `:loading`
  already says the form is busy. **Don't add a disabled-reason helper just because fields are locked
  mid-submit.** A `Field` that already has a guidance `Field.Description` keeps showing it (its tone
  flips to `disabled`, so the lock glyph joins it for the ~1s of the request); one with **no**
  description renders **no helper row at all** — the field writes no copy of its own, so nothing appears and
  disappears under the field mid-save. Do **not** invent a lock explanation for a lock that lasts a
  second.

- **Persistent disable — use the disabled helper when the reason isn't obvious.** When a field is
  disabled by a **dependency** (a plan tier, a toggle that must be on first, a mode that doesn't apply),
  the disabled `FieldDescription` is the right, optional tool — e.g. _"Enable HTTPS support to choose HTTPS
  ports."_ It gives the user the context to understand and lift the lock. In an **ItemGroup** that
  context usually already lives in `Item.Description` (e.g. a disabled "HTTPS Ports" row whose
  description reads _"Applies when the Application serves HTTPS traffic."_), so a separate disabled
  helper is redundant — add one only when it says something the description doesn't.

Rules:

- **The submit lock needs no disabled-reason helper** — it's transient and the Save `:loading` covers it.
- **A disabled helper is optional and explains the dependency**, never validation — it answers only
  "why is this locked and how do I unlock it".
- **Don't fabricate a disabled explanation for a transient lock.** Reserve the disabled helper for a
  persistent, non-obvious dependency.
- **A disabled field is never also `invalid`.** `disabled` wins the field's state (and the
  `Field.Description` tone), so a locked field never shows the red invalid cue.

## Choosing an approach

| Situation                                                                | Approach                                                                               |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| Settings page, resource config, many grouped fields, a Create drawer     | **A — Cards + ItemGroups** (`Item.List`, `size="small"`)                               |
| Login, rename, a short 1–3 field dialog, one wizard step                 | **B — Fields separated** (`Field` stacked)                                             |
| A section mixes a couple of simple rows with a radio block               | **A**, with the radio block as a full-width child inside its `Item`                    |
| A page's field needs a resource not created yet (workload → certificate) | **Missing-resource drawer** — `large`, the resource's own create form, selects it back |
| A drawer's Select needs a resource or an item not created yet            | **Nested drawer** — quick-add opens a second drawer; each drawer its own scoped save   |
| The missing resource creates in several steps (repository import)        | Its create page in a new tab, and a `Refresh` option on the field                      |

The module **create** action for a first-level resource lands on a dedicated **page** (route
`/<module>/new`), not a modal, so it is linkable and back-button-safe, however short the form; a
drawer creates only an item inside a resource (and variables, the one exception in
`/webkit-create-surface`).

## Review output

For `/webkit-form <file>`, list gaps grouped by pattern. Each:

```
✗ SomeForm.vue:NN  <Field.Label for="runtime" /> but no element has id="runtime"
  pattern: composed Select labels its trigger — for points at nothing; the combobox has no accessible name.
  fix: add id="runtime" to <Select.Trigger>, matching the Field.Label's for.

✗ SomeForm.vue:NN  <Item> with no size
  pattern: Cards + ItemGroups — form Items are size="small" for rhythm/hierarchy.
  fix: <Item size="small">.
```

```
✗ SomeForm.vue:NN  <Input v-model="form.expiresAt" placeholder="2026-12-31T00:00:00Z" />
  pattern: pick the control from the kind of value — a date and time typed as text.
  fix: <DatePicker v-model="form.expiresAt" show-time /> bound to a Date; send toISOString() in the request.
```

End with: `form is accessible` or `N gaps — fix before polish`.

## References

- `/webkit-api-data` — a `Select` or `MultiSelect` whose options come from an API: server search,
  selected values that are not in the loaded page, names instead of IDs, revalidated options.
- `Field` and its parts, `FieldDescription`, `Item`, `Card`, `Select`, `Button` import paths: ask the
  webkit MCP `suggest_component`, or read `node_modules/@aziontech/webkit/catalog.json` (`imports`) —
  every key is a real subpath.
- Companion skills: `/webkit-ux-heuristics` (states + inline error placement), `/webkit-ui-states`
  (lock-the-scope + toast for request errors), and `/webkit-errors` (where every failure goes: the
  field, a section `Alert`, a toast, the auth card — including the signed-out screens, which never
  toast).
- Token catalog (spacing, colour, shape, typography): the `@aziontech/theme` tokens (the `--*` CSS
  variables it ships; the webkit MCP lists them).
- Compose only webkit components and theme tokens — no external UI libraries, no hex/rgb colours, no
  component-local CSS.

## Definition of Done

- [ ] Every field uses the control for its kind of value (the "Pick the control" table): a date or a
      date and time is a `DatePicker` (`show-time`), a range a `DateRangePicker`, a number a
      `NumberInput`, a phone a `PhoneInput`, a secret a `PasswordInput`. No `Input` asks the person to
      type a format (ISO 8601, `YYYY-MM-DD`, E.164), and the model holds the typed value (`Date`,
      `number`), converted to the server's string only in the request.
- [ ] Every labelled control sits in a `Field` (`Field.Label` + control + `Field.Description` /
      `Field.Error`, state on the `Field`); checkboxes/switches use `orientation="horizontal"`,
      their cards are `Field.Label` wrapping a horizontal `Field`, radios are one `RadioGroup` (`variant="card"` for cards); a bare control is used only when its
      label lives elsewhere, and then the `aria-label` + `aria-describedby` are wired by hand.
- [ ] The form type fits the flow (Drawer / nested Drawer / Dialog / ItemGroup settings / Card with
      independent saves), and the **save model follows partitioning**: one save for a logical unit (Drawer,
      Dialog, or an ItemGroup — single block _or_ multiple `SettingsGroup` bands); one save per card only
      for the Card-with-independent-saves type.
- [ ] Every field that needs another resource offers `Create <noun>` when it may not exist yet; the
      drawer creates it and selects it back, so the reader never leaves the form to create it.
- [ ] Every control matches the type of its value (Pick the control from the kind of value): instants in a `DatePicker`
      with `show-time`, dates in a `DatePicker`, periods in one `DateRangePicker`, enums in a
      `RadioGroup` or `Select` with human labels, references to other resources in a searchable picker
      labelled with the thing (never an `Input` asking for an ID), money and percentages in a
      `NumberInput` with the unit in the label, known structures in `AttributeEditor` / `TagEditor`.
- [ ] A **nested drawer** keeps parent and child as independent forms — each its own `submitting` flag,
      `<fieldset :disabled>`, and Save `:loading`; the parent `Select` is controlled with a sentinel
      quick-add; the child creates the missing resource or item with its own create form and wires it
      back into the parent on save; no `z-*` overrides on the drawers or popups.
- [ ] Field spacing follows the macro rule: `--spacing-xs` inside a field, `--spacing-lg` between fields
      and sections (`--spacing-md` only in a compact modal body). No one-off gaps.
- [ ] Hierarchy is not inverted: title → description → section title → field label → control → helper.
- [ ] Section titling matches role: a multi-Card ItemGroup titles each band with a `SettingsGroup`
      over a header-less flush `Card`; a self-contained card that _is_ the form
      uses the `Card` `title` in its header. Never both on one card.
- [ ] The form uses **one** layout: Cards + ItemGroups (`Item.List` of `SettingsRow` rows) or
      Fields separated (`Field` stacked) — not a mix within a section.
- [ ] Field naming matches the type: in an **ItemGroup**, `Item.Title` is the label and the control
      takes an `aria-label` (no `<Field.Label>` inside an `Item`); in **Fields separated**, a real `Field.Label`
      with `for`→`id`, and a `Select` labels its trigger. No bare
      control with a floating `<p>` label, no placeholder-as-label.
- [ ] `required` is static from the first render (on the `Field`, or on the control when there is no
      `Field`), so a `Field.Label` shows the Required marker before any submit; it draws no colour.
- [ ] Each section is a native `<fieldset>` with an `sr-only` `<legend>`.
- [ ] Validation runs on submit only; feedback is the field's state **and** an on-field `FieldError`
      message (`Field.Description` / `Field.Error` in Fields separated; a `<FieldError>` under the control in an
      ItemGroup), bound to the error and cleared on edit. A failed submit sets `invalid` for an empty
      required value or a malformed one, and the message says what to enter. No error-summary block,
      no `Alert` callout for field validation.
- [ ] Native hints on the `<input>`: `type`, `autocomplete` + `name`, `spellcheck="false"` on
      e-mails, slugs and codes; paste is never blocked; a failed submit focuses the first field in
      error; submit is never pre-disabled.
- [ ] A value the user cannot change is `readonly` on its `Input` or `Textarea` (the filled field,
      with a helper saying why), never `disabled` and never an editable field the save ignores.
- [ ] Leaving the page with unsaved edits asks first (or the edits survive the navigation).
- [ ] `<form novalidate @submit.prevent>`; Enter submits; the scope locks off one flag
      (`<fieldset :disabled>` **and** `:disabled` on every control + Save `:loading`, per `/webkit-ui-states`
      Pattern 1); request errors toast, field errors stay inline.
