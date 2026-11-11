# Page Tabs

> The second-level navigation strip of a resource detail page: a full-bleed bar ruled at the bottom, its `Tabs` at the page boundary inset, with room for the actions the whole resource owns on the right (a staged-changes `Tag`, Deploy). It is `Tabs` plus the strip and the actions region, so every detail page stops re-creating the same bar.

- Import: `import PageTabs from '@aziontech/webkit/page-tabs'`
- Category: navigation · Surface: product · Structure: monolithic
- API as JSON: [page-tabs.json](https://github.com/aziontech/webkit/blob/main/.specs/page-tabs.json)

## When to use

- The top of every resource detail page, under the global header.
- An account page split into tabs, such as Billing.

## Do

- Bind `v-model` to the route (or a ref) and render the section below from it.
- Keep the labels to one word where possible.
- Put only actions that apply to the whole resource in `actions`; page-level actions go in the `page-header`.

## Don’t

- Tabs inside a card, a drawer or a panel → use `tabs`.
- Steps of a flow → use `stepper` or `wizard`.
- Navigation between pages of the app → use `sidebar` or `navigation-menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tabs](tabs.md) — the tablist it renders; pass one `Tabs.Item` per section in the default slot.
- [page-header](page-header.md) — the page heading under the strip.
- [tag](tag.md) and `button` — the usual content of the `actions` slot.

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | One Tabs.Item per section of the resource. |
| `actions` | — | The actions the whole resource owns, on the right of the strip: a staged-changes Tag, Deploy. |

## v-model

- **`v-model`** (`modelValue`) — `string | number | null`, default `null`. The active tab; it updates when a tab is picked.

## States

- Visual states: `default`; the tab states are owned by `tabs`

## Accessibility

- Visible focus: owned by `Tabs.Item` and the actions.
- Keyboard map: the tablist follows `tabs` (arrows move between tabs, `Home`/`End` jump); `Tab` leaves the tablist for the actions.
- ARIA: `role="tablist"` and `role="tab"` come from `tabs`.
- Contrast ≥4.5:1, owned by `tabs`.

## Examples

### Default

```vue
<script setup>
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const activeTab = ref('overview')
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'variables', label: 'Variables' },
    { value: 'rules', label: 'Rules' },
    { value: 'logs', label: 'Logs' },
    { value: 'metrics', label: 'Metrics' },
    { value: 'settings', label: 'Settings' }
  ]
</script>

<template>
  <PageTabs v-model="activeTab">
    <Tabs.Item
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
  </PageTabs>
</template>
```

### WithActions

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const activeTab = ref('overview')
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]
</script>

<template>
  <PageTabs v-model="activeTab">
    <Tabs.Item
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
    <template #actions>
      <Tag
        severity="warning"
        size="small"
        label="2 changes"
      />
      <Button
        label="Deploy"
        kind="outlined"
        size="medium"
        icon="pi pi-cloud-upload"
      />
    </template>
  </PageTabs>
</template>
```
