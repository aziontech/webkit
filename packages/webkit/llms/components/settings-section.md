# Settings Section

> A band of a settings page: an h2 with a `Hint` glyph that carries the one-sentence guidance, over the band body (usually a flush `Card` of `SettingRow` rows). Bands stack at the section gap with no rule between them. An anchored band shows a copy-link button in the gutter when the heading is hovered or focused; a collapsible band turns the heading into a disclosure that unfolds the body along the grid track.

- Import: `import SettingsSection from '@aziontech/webkit/settings-section'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [settings-section.json](https://github.com/aziontech/webkit/blob/main/.specs/settings-section.json)

## When to use

- Every settings page and create page: a resource's Settings tab, Account Settings, a create form, a create drawer.
- An Advanced band that starts closed (`collapsible`).

## Do

- One sentence of guidance in `hint`; the title names the band in one or two words.
- Set `anchor` on bands people link to.
- Use `collapsible` only for an Advanced band whose defaults are right for most people; it starts closed.
- Stack the bands inside one form column (`layout-column-form`); the first band takes no top margin.

## Don’t

- A band whose heading carries a description line and actions → use `section-header`.
- The page title → use `page-header`.
- A disclosure list of several independent panels → use `accordion`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [setting-row](setting-row.md) — the rows inside the band's card.
- [card](card.md) — the flush (`:padded="false"`) surface the rows sit on.
- [hint](hint.md) — the guidance glyph beside the title.
- [section-header](section-header.md) — the band heading with a description and actions.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The band title, rendered as an h2. |
| `hint` | `string` | `''` | false | One-sentence guidance shown in a Hint glyph beside the title. |
| `anchor` | `string` | `''` | false | Id of the h2 that a hash link targets; when set, a copy-link button appears in the gutter on hover or focus. |
| `collapsible` | `boolean` | `false` | false | Turns the title into a disclosure that folds the band body. |
| `icon` | `string` | `''` | false | Glyph shown before the title of a collapsible band (e.g. `pi pi-cog`). |
| `open` | `boolean` | `false` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The band body, usually a flush Card of SettingRow rows. |
| `title` | — | Rich title content; replaces the `title` prop text in the h2. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## v-model

- **`v-model:open`** — `boolean`, default `false`. Whether a collapsible band is unfolded; it updates when the disclosure toggles. Ignored unless `collapsible`.

## States

- Visual states: `default`, `hover` / `focus-within` (reveals the copy-link button)
- `data-state` on the root: `open` | `closed` when `collapsible`
- `data-open` on the body mirrors whether it is unfolded
- Responsive: the body is the `@container/settings-section`, so rows and fields inside lay out for the section, not the window.
- Hover-free devices: the copy-link button is shown inline after the title where the pointer cannot hover (`@media (hover: none)`), instead of floating outside the start edge on hover.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the copy-link and the disclosure button (plus `ring-offset` on the disclosure).
- Keyboard map: `Tab` reaches the copy-link, the disclosure and then the body; `Enter`/`Space` toggles the disclosure.
- ARIA: the disclosure is a `button` inside the h2 with `aria-expanded` and `aria-controls` pointing at the body (`useId`); a folded body is `inert` and `aria-hidden`. The copy-link button is named "Copy link to the {title} section"; after a successful copy its glyph turns into a check and its name into "Link copied" for two seconds, then both return.
- Contrast ≥4.5:1 for the title.
- `motion-reduce:transition-none` on every transition.

## Examples

### Default

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { ref } from 'vue'

  const fonts = [
    { label: 'Rubik (Default)', value: 'rubik' },
    { label: 'Inter', value: 'inter' },
    { label: 'IBM Plex Sans', value: 'ibm-plex-sans' },
    { label: 'Geist', value: 'geist' }
  ]

  const appearances = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' }
  ]

  const font = ref('rubik')
  const theme = ref('system')

  const labelFor = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
    <SettingsSection
      title="Appearance"
      hint="Preferences for this browser, applied the moment you change them and not part of Save."
      anchor="appearance"
    >
      <Card :padded="false">
        <template #content>
          <Item.List>
            <SettingRow
              title="Font family"
              description="The primary sans typeface across the interface."
            >
              <Select
                v-model="font"
                size="large"
                :display-value="labelFor(fonts)"
              >
                <Select.Trigger
                  class="w-full"
                  aria-label="Font family"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in fonts"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </SettingRow>
            <SettingRow
              title="System appearance"
              description="Follow the operating system, or force a light or dark theme."
            >
              <Select
                v-model="theme"
                size="large"
                :display-value="labelFor(appearances)"
              >
                <Select.Trigger
                  class="w-full"
                  aria-label="System appearance"
                />
                <Select.Content>
                  <Select.Option
                    v-for="option in appearances"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </SettingRow>
          </Item.List>
        </template>
      </Card>
    </SettingsSection>
  </div>
</template>
```

### Stacked

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const defaultFeatures = [
    {
      key: 'compression',
      title: 'Compression',
      description: 'Compress text responses with gzip or Brotli.'
    },
    { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Enable dynamic image resizing and format conversion.'
    }
  ]

  const name = ref('web-app')
  const active = ref(true)
  const features = ref({ compression: true, cache: true, image_optimization: false })
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
    <SettingsSection
      title="General"
      hint="How this resource is identified, and whether it is serving traffic."
      anchor="general"
    >
      <Card :padded="false">
        <template #content>
          <Item.List>
            <SettingRow
              title="Name"
              description="A unique and descriptive name to identify the resource."
            >
              <Input
                v-model="name"
                size="large"
                class="w-full"
                aria-label="Name"
              />
            </SettingRow>
            <SettingRow
              title="Active"
              description="When disabled, the resource stops serving traffic."
              kind="compact"
            >
              <Switch
                v-model="active"
                aria-label="Active"
              />
            </SettingRow>
          </Item.List>
        </template>
      </Card>
    </SettingsSection>
    <SettingsSection
      title="Features"
      hint="The capabilities this resource runs with, each of which can be toggled here."
      anchor="features"
    >
      <Card :padded="false">
        <template #content>
          <Item.List>
            <SettingRow
              v-for="feature in defaultFeatures"
              :key="feature.key"
              :title="feature.title"
              :description="feature.description"
              kind="compact"
            >
              <Switch
                v-model="features[feature.key]"
                :aria-label="feature.title"
              />
            </SettingRow>
          </Item.List>
        </template>
      </Card>
    </SettingsSection>
  </div>
</template>
```

### Collapsible

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const open = ref(false)
  const active = ref(true)
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
    <SettingsSection
      v-model:open="open"
      title="Advanced"
      icon="pi pi-cog"
      collapsible
    >
      <Card :padded="false">
        <template #content>
          <Item.List>
            <SettingRow
              title="Active"
              description="Inactive teams keep their permissions but can't be assigned."
              kind="compact"
            >
              <Switch
                v-model="active"
                aria-label="Active"
              />
            </SettingRow>
          </Item.List>
        </template>
      </Card>
    </SettingsSection>
  </div>
</template>
```
