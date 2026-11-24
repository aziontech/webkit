# Settings Group

> A band of a settings page: an h2 with a `Hint` glyph that opens the one-sentence guidance on click, over the band body (usually a flush `Card` of `SettingsRow` rows). Bands stack at the section gap with no rule between them. An anchored band shows a copy-link button in the gutter when the heading is hovered or focused; a collapsible band turns the heading into a disclosure that unfolds the body along the grid track.

- Import: `import SettingsGroup from '@aziontech/webkit/settings-group'`
- Category: layout · Surface: app · Structure: monolithic
- API as JSON: [settings-group.json](settings-group.json)

## When to use

- Use SettingsGroup for a band of a settings page whose body is SettingsRow rows; any other band heading is a Subheader.
- Every settings page and create page: a resource's Settings tab, Account Settings, a create form, a create drawer.
- An Advanced band that starts closed (`collapsible`).

## Do

- One sentence of guidance in `hint`; the title names the band in one or two words.
- Set `anchor` on bands people link to.
- Use `collapsible` only for an Advanced band whose defaults are right for most people; it starts closed.
- Stack the bands inside one form column (`layout-column-form`); the first band takes no top margin.

## Don’t

- A band whose heading carries a description line and actions → use `subheader`.
- The page title → use `page-header`.
- A disclosure list of several independent panels → use `accordion`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [settings-row](settings-row.md) — the rows inside the band's card.
- [card](card.md) — the flush (`:padded="false"`) surface the rows sit on.
- [hint](hint.md) — the guidance glyph beside the title.
- [subheader](subheader.md) — the band heading with a description and actions. Pick by content: a settings band of `SettingsRow`s (a Hint, a gutter copy-link, an optional disclosure) is `SettingsGroup`; a console band heading with a description and its own actions is `Subheader`; a marketing section heading is `module-header`. The three share the h2 and the copy-link anchor; folding SettingsGroup's heading onto Subheader is a planned refactor, not a behaviour change.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `—` | true | The group heading, rendered as an h2. |
| `hint` | `string` | `''` | false | One-sentence guidance in a click-open Hint note beside the label. |
| `anchor` | `string` | `''` | false | Id of the h2 that a hash link targets; when set, a copy-link button appears in the gutter on hover or focus. |
| `collapsible` | `boolean` | `false` | false | Turns the label into a disclosure that folds the band body. |
| `icon` | `string` | `''` | false | Glyph shown before the label of a collapsible band (e.g. `az az-settings`). |
| `open` | `boolean` | `false` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The band body, usually a flush Card of SettingsRow rows. |
| `label` | — | Rich label content; replaces the `label` prop text in the h2. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## v-model

- **`v-model:open`** — `boolean`, default `false`. Whether a collapsible band is unfolded; it updates when the disclosure toggles. Ignored unless `collapsible`.

## States

- Visual states: `default`, `hover` / `focus-within` (reveals the copy-link button)
- `data-state` on the root: `open` | `closed` when `collapsible`
- `data-state` on the body: `open` | `closed`, mirroring whether it is unfolded
- Only a collapsible band folds along the `0fr`/`1fr` grid track (`data-collapsible` on the body); a band that is not collapsible lays its body out in normal flow, so it has no track that can resolve to zero height.
- Responsive: the body is the `@container/settings-group`, so rows and fields inside lay out for the section, not the window.
- Hover-free devices: the copy-link button is shown inline after the title where the pointer cannot hover (`@media (hover: none)`), instead of floating outside the start edge on hover. There it sits `--spacing-xl` past the Hint and carries its own invisible 44px hit area on a coarse pointer (`data-slot="touch-target"`), so a tap on one never lands on the other. Tests: `src/test/touch-targets.test.ts`.

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
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
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
    <SettingsGroup
      label="Appearance"
      hint="Preferences for this browser, applied the moment you change them and not part of Save."
      anchor="appearance"
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
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
                  <Select.Item
                    v-for="option in fonts"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
            <SettingsRow
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
                  <Select.Item
                    v-for="option in appearances"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Content>
              </Select>
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>
  </div>
</template>
```

### Stacked

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
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
    <SettingsGroup
      label="General"
      hint="How this resource is identified, and whether it is serving traffic."
      anchor="general"
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              title="Name"
              description="A unique and descriptive name to identify the resource."
            >
              <Input
                v-model="name"
                size="large"
                class="w-full"
                aria-label="Name"
              />
            </SettingsRow>
            <SettingsRow
              title="Active"
              description="When disabled, the resource stops serving traffic."
              variant="compact"
            >
              <Switch
                v-model="active"
                aria-label="Active"
              />
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>
    <SettingsGroup
      label="Features"
      hint="The capabilities this resource runs with, each of which can be toggled here."
      anchor="features"
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              v-for="feature in defaultFeatures"
              :key="feature.key"
              :title="feature.title"
              :description="feature.description"
              variant="compact"
            >
              <Switch
                v-model="features[feature.key]"
                :aria-label="feature.title"
              />
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>
  </div>
</template>
```

### Collapsible

```vue
<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const open = ref(false)
  const active = ref(true)
</script>

<template>
  <div class="layout-column-form flex min-w-0 flex-col">
    <SettingsGroup
      v-model:open="open"
      label="Advanced"
      icon="az az-settings"
      collapsible
    >
      <Card :padded="false">
        <template #default>
          <Item.List>
            <SettingsRow
              title="Active"
              description="Inactive teams keep their permissions but can't be assigned."
              variant="compact"
            >
              <Switch
                v-model="active"
                aria-label="Active"
              />
            </SettingsRow>
          </Item.List>
        </template>
      </Card>
    </SettingsGroup>
  </div>
</template>
```
