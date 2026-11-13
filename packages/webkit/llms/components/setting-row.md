# Setting Row

> One setting inside a flush `Card`: an `Item` whose content carries the title and description, with the control placed by what it needs. A typed or picked field sits in a right cell capped at the 3xs container so every field on the card ends at the same edge (`field`); a switch or a button sits hard right at its natural width (`compact`); a textarea, list, radio group or editor drops under the copy at the full measure (`stacked`). A child setting indents one or two levels under a rule (`level`). The copy top-aligns with the control, and the row keeps its two columns at every width (the description clamps to two lines); `stackable` opts a row into moving a `field` control under the copy in a narrow box.

- Import: `import SettingRow from '@aziontech/webkit/setting-row'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [setting-row.json](https://github.com/aziontech/webkit/blob/main/.specs/setting-row.json)

## When to use

- Every row of a settings card: account settings, build settings, create pages, resource settings.
- A field with a validation message under it (put the `HelperText` in the default slot after the control).

## Do

- The title is the label: give the control the same text as `aria-label`.
- Pick `kind` by the control: `field` for Input and Select, `compact` for Switch and Button, `stacked` for Textarea, radio groups and editors.
- Show a validation message only after Save was pressed.
- Use `level` only for a setting that applies when the row above it is on, and render it with `v-if` on that state.
- Keep the default two columns on a phone: the title and the clamped description sit on the start side, the control on the end side, both aligned to the top. This is the console layout at every width.
- Set `stackable` only when the field needs the full measure to be usable in a narrow box (a long URL or a code value in a side drawer); never to fix a centred or cramped look.
- Let a tall control (an input group of three nameservers, a textarea) sit beside the copy: the title stays at the top of the row.
- Do not wrap the row or its copy in your own flex box to change the alignment or to stack it; use `kind` and `stackable`.
- Do not set `stackable` on a `compact` row: a switch or a button always stays at the end side.

## Don’t

- A stand-alone form field with a visible label above it → use `field-text` and the other `field-*` components.
- A read-only list of label and value pairs → use `key-value-pairs`.
- A navigable list row → use `item` directly.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [settings-section](settings-section.md) — the band the card of rows sits in.
- [item](item.md) — the row primitive it renders; place rows in an `Item.List` inside the card.
- [helper-text](helper-text.md) — the required or invalid message under the control.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The setting name; the control takes the same text as its aria-label. |
| `description` | `string` | `''` | false | One sentence under the title that says what the setting does. |
| `kind` | `'field' \| 'compact' \| 'stacked'` | `'field'` | false | Where the control sits relative to the copy. |
| `level` | `0 \| 1 \| 2` | `0` | false | Indent depth under a rule, for a setting that only applies when its parent is on. |
| `stackable` | `boolean` | `false` | false | Below the md container of the row, move a field control under the copy at full width. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The control, plus the HelperText message under it when there is one. |
| `title` | — | Rich title content (a Tag, a Hint); replaces the `title` prop. |
| `description` | — | Rich description content (links, inline code); replaces the `description` prop. |

## States

- Visual states: `default`
- `data-row-kind` mirrors `kind` and `data-level` mirrors `level` on the root; `data-stackable` is set when `stackable` is on
- Alignment: the copy and the control align to the top of the row, so a title stays level with the first line of a tall control.
- Responsive: the row is the `@container/setting-row`. By default the row keeps its two columns at every width: the copy shrinks (the description clamps to two lines with an ellipsis) and a `field` control keeps the end cell, capped at the 3xs container. With `stackable`, below `@md` of the row a `field` control moves under the copy at full width.

## Accessibility

- Visible focus: owned by the control in the default slot.
- Keyboard map: `Tab` reaches the control; the row is not interactive.
- ARIA: the row is an `Item` (a `listitem` inside `Item.List`); the control carries `aria-label` equal to the title, and a message is linked with `aria-describedby`.
- Contrast ≥4.5:1 for the title and the muted description.

## Examples

### SettingsCard

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Textarea from '@aziontech/webkit/textarea'
  import { reactive } from 'vue'

  const form = reactive({ companyName: '', taxId: '', billingEmails: 'jane.doe@example.com' })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <SettingRow
          title="Company Name"
          description="The legal entity that owns this account."
        >
          <Input
            v-model="form.companyName"
            size="large"
            class="w-full"
            aria-label="Company Name"
          />
        </SettingRow>
        <SettingRow
          title="Tax ID"
          description="The tax identification number of the entity that owns this account."
        >
          <Input
            v-model="form.taxId"
            size="large"
            class="w-full"
            aria-label="Tax ID"
          />
        </SettingRow>
        <SettingRow
          title="Billing emails"
          description="Billing is forwarded to every address listed here. Separate each one with a semicolon ( ; )."
          kind="stacked"
        >
          <Textarea
            v-model="form.billingEmails"
            class="w-full"
            :rows="3"
            aria-label="Billing emails"
          />
        </SettingRow>
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
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import { reactive } from 'vue'

  const form = reactive({ allowSocialLogin: true, enforceMfa: false })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <SettingRow
          title="Allow social login"
          description="Users linked to the account can log in with their social network credentials."
          kind="compact"
        >
          <Switch
            v-model="form.allowSocialLogin"
            aria-label="Allow social login"
          />
        </SettingRow>
        <SettingRow
          title="Enforce multi-factor authentication"
          description="MFA is required on login for every user linked to this account."
          kind="compact"
        >
          <Switch
            v-model="form.enforceMfa"
            aria-label="Enforce multi-factor authentication"
          />
        </SettingRow>
        <SettingRow
          title="Authenticator devices"
          description="Manage the devices and recovery codes registered for this account."
          kind="compact"
        >
          <Button
            type="button"
            label="Manage"
            kind="outlined"
            size="medium"
          />
        </SettingRow>
      </Item.List>
    </template>
  </Card>
</template>
```

### WithMessage

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import HelperText from '@aziontech/webkit/helper-text'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import { reactive } from 'vue'

  const form = reactive({ name: '' })
</script>

<template>
  <Card :padded="false">
    <template #content>
      <Item.List>
        <SettingRow
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
          <HelperText
            id="resource-name-message"
            kind="required"
            label="This field is required."
          />
        </SettingRow>
      </Item.List>
    </template>
  </Card>
</template>
```
