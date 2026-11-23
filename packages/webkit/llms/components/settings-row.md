# Settings Row

> One setting inside a flush `Card`: an `Item` whose content carries the title and description, with the control placed by what it needs. A typed or picked field sits in a right cell capped at the 3xs container so every field on the card ends at the same edge (`field`); a switch or a button sits hard right at its natural width (`compact`); a textarea, list, radio group or editor drops under the copy at the full measure (`stacked`). A child setting indents one or two levels under a rule (`depth`). The copy top-aligns with the control, and the description always wraps in full, never truncated. In a narrow row (below `@md` of the row, a phone) a `field` control stacks under the copy at full width; a `compact` switch or button stays at the end side beside the wrapped copy. `stackable` moves the stacking point up to `@lg` for a field that needs the full measure in a drawer-width box.

- Import: `import SettingsRow from '@aziontech/webkit/settings-row'`
- Category: layout · Surface: app · Structure: monolithic
- API as JSON: [settings-row.json](settings-row.json)

## When to use

- Every row of a settings card: account settings, build settings, create pages, resource settings.
- A field with a validation message under it (put the `FieldError` in the default slot after the control).

## Do

- The title is the label: give the control the same text as `aria-label`.
- Pick `variant` by the control: `field` for Input and Select, `compact` for Switch and Button, `stacked` for Textarea, radio groups and editors.
- Show a validation message only after Save was pressed.
- Use `depth` only for a setting that applies when the row above it is on, and render it with `v-if` on that state.
- Let the row stack on a phone: the title and the full description on top, a `field` control under them at full width. A `compact` switch or button keeps the end side, beside the wrapped copy.
- Set `stackable` only when the field needs the full measure in a drawer-width box (a long URL or a code value in a side drawer), where a default row would still sit beside its copy; never to fix a centred or cramped look.
- Let a tall control (an input group of three nameservers, a textarea) sit beside the copy: the title stays at the top of the row.
- Do not wrap the row or its copy in your own flex box to change the alignment or to stack it; use `variant` and `stackable`.
- Do not set `stackable` on a `compact` row: a switch or a button always stays at the end side.
- Keep the description to the one sentence that says what the setting does, and put the rest of a longer explanation in `hint`: the description is never truncated, so a long one makes a tall row, and the Hint glyph beside the title keeps the extra text out of the way until hover or focus.

## Don’t

- A stand-alone form field with a visible label above it → use `field` around the control (`Field`, `FieldLabel`, `FieldDescription`).
- A read-only list of label and value pairs → use `key-value-list`.
- A navigable list row → use `item` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [settings-group](settings-group.md) — the band the card of rows sits in.
- [item](item.md) — the row primitive it renders; place rows in an `Item.List` inside the card.
- `field-error` — the required or invalid message under the control.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The setting name; the control takes the same text as its aria-label. |
| `description` | `string` | `''` | false | One sentence under the title that says what the setting does. |
| `variant` | `'field' \| 'compact' \| 'stacked'` | `'field'` | false | Where the control sits relative to the copy. |
| `depth` | `0 \| 1 \| 2` | `0` | false | Indent depth under a rule, for a setting that only applies when its parent is on. |
| `stackable` | `boolean` | `false` | false | Stack a field control under the copy below the lg container of the row instead of md, for a value that needs the full measure. |
| `hint` | `string` | `''` | false | Extra guidance in a Hint glyph beside the title; empty renders no glyph. |
| `required` | `boolean` | `false` | false | Marks the setting as required after its title, as a required field label does. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The control, plus the FieldDescription message under it when there is one. |
| `title` | — | Rich title content (a Tag); replaces the `title` prop. The `hint` glyph still renders after it. |
| `description` | — | Rich description content (links, inline code); replaces the `description` prop. |

## States

- Visual states: `default`, `hinted` (a `Hint` glyph after the title when `hint` is set), `required` (after the title, the same marker a required `Field.Label` renders: a `*` hidden from assistive tech, then the `field.required` string, "(Required)" in English)
- `data-row-variant` mirrors `variant` and `data-depth` mirrors `depth` on the root; `data-stackable` is set when `stackable` is on
- Alignment: the copy and the control align to the top of the row, so a title stays level with the first line of a tall control.
- Responsive: the row is the `@container/settings-row`. The description wraps in full at every width; it is never clamped or cut with an ellipsis. From `@md` of the row up, a `field` control keeps the end cell, capped at the 3xs container; below `@md` (a phone) it moves under the copy at full width. With `stackable` the move happens below `@lg` instead. A `compact` control stays at the end side at every width; a `stacked` control is always under the copy.

## Accessibility

- Visible focus: owned by the control in the default slot.
- Keyboard map: `Tab` reaches the control; the row is not interactive.
- ARIA: the row is an `Item` (a `listitem` inside `Item.List`); the control carries `aria-label` equal to the title, and a message is linked with `aria-describedby`.
- No truncation: the description shows its full text to every user at every width (WCAG 1.4.10 Reflow). `hint` holds the longer explanation: its glyph is a focusable button whose accessible name and tooltip are the hint text, reachable with `Tab` and revealed on hover or focus.
- Contrast ≥4.5:1 for the title and the muted description. The required `*` is `var(--text-default)`, like the `Field.Label` asterisk (the logo orange is never a text colour); it is `aria-hidden`, and the "(Required)" text after it is what a screen reader reads. The control in the slot still sets its own `required`.

## Examples

### SettingsCard

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  const form = reactive({ companyName: '', taxId: '', billingEmails: '' })
</script>

<template>
  <Card :padded="false">
    <template #default>
      <Item.List>
        <SettingsRow
          title="Company Name"
          description="The legal entity that owns this account."
        >
          <Input
            v-model="form.companyName"
            size="large"
            class="w-full"
            aria-label="Company Name"
          />
        </SettingsRow>
        <SettingsRow
          title="Tax ID"
          description="The tax identification number of the entity that owns this account."
        >
          <Input
            v-model="form.taxId"
            size="large"
            class="w-full"
            aria-label="Tax ID"
          />
        </SettingsRow>
        <SettingsRow
          title="Billing emails"
          description="Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; )."
          variant="stacked"
        >
          <Textarea
            v-model="form.billingEmails"
            class="w-full"
            :rows="3"
            aria-label="Billing emails"
          />
        </SettingsRow>
      </Item.List>
    </template>
  </Card>
</template>
```

### CompactRows

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { reactive } from 'vue'

  const form = reactive({ allowSocialLogin: true, enforceMfa: false })
</script>

<template>
  <Card :padded="false">
    <template #default>
      <Item.List>
        <SettingsRow
          title="Allow social login"
          description="Users linked to the account can log in with their social network credentials."
          variant="compact"
        >
          <Switch
            v-model="form.allowSocialLogin"
            aria-label="Allow social login"
          />
        </SettingsRow>
        <SettingsRow
          title="Enforce multi-factor authentication"
          description="MFA is required on login for every user linked to this account."
          variant="compact"
        >
          <Switch
            v-model="form.enforceMfa"
            aria-label="Enforce multi-factor authentication"
          />
        </SettingsRow>
        <SettingsRow
          title="Authenticator devices"
          description="Manage the devices and recovery codes registered for this account."
          variant="compact"
        >
          <Button
            type="button"
            label="Manage"
            variant="outline"
            size="medium"
          />
        </SettingsRow>
      </Item.List>
    </template>
  </Card>
</template>
```

### WithMessage

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { reactive } from 'vue'

  const form = reactive({ name: '' })
</script>

<template>
  <Card :padded="false">
    <template #default>
      <Item.List>
        <SettingsRow
          required
          title="Name"
          description="Give a unique and descriptive name to identify the resource."
        >
          <Input
            v-model="form.name"
            size="large"
            class="w-full"
            aria-label="Name"
            placeholder="office-ranges"
            autocomplete="off"
            required
            aria-describedby="resource-name-message"
          />
          <FieldError id="resource-name-message">This field is required.</FieldError>
        </SettingsRow>
      </Item.List>
    </template>
  </Card>
</template>
```
