# Page Tabs

> The second-level navigation strip of a resource detail page: a full-bleed bar ruled at the bottom, its `Tabs` at the page boundary inset, with room for the actions the whole resource owns on the right (a staged-changes `Tag`, Deploy). It is `Tabs` plus the strip and the actions region, so every detail page stops re-creating the same bar.

- Import: `import PageTabs from '@aziontech/webkit/page-tabs'`
- Category: navigation · Surface: app · Structure: monolithic
- API as JSON: [page-tabs.json](https://github.com/aziontech/webkit/blob/main/.specs/page-tabs.json)

## When to use

- Use PageTabs for the second-level navigation strip of a resource detail page; to switch peer views inside a page or panel use Tabs.
- The top of every resource detail page, under the global header.
- An account page split into tabs, such as Billing.

## Do

- Bind `v-model` to the route (or a ref) and render the section below from it. PageTabs renders only the tab list, so it takes no `Tabs.Content` / `Tabs.Panel`: the page renders the active section itself from the `v-model` value.
- Keep the labels to one word where possible.
- Put only actions that apply to the whole resource in `actions`; page-level actions go in the `page-header`.
- Set `column` to the column the page body uses (`form` over a settings form, `data` over a list) so the tabs start where the content starts.

## Don’t

- Tabs inside a card, a drawer or a panel → use `tabs`.
- Steps of a flow → use `stepper` or `wizard`.
- Navigation between pages of the app → use `sidebar` or `navigation-menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tabs](tabs.md) — the tablist it renders; pass one `Tabs.Item` per section in the default slot.
- [page-header](page-header.md) — the page heading under the strip.
- [tag](tag.md) and `button` — the usual content of the `actions` slot.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `column` | `'full' \| 'data' \| 'form' \| 'focused'` | `'full'` | false | The page column the tab row lines up with: the full width, or the data, form or focused column below it. |
| `modelValue` | `TabsValue \| null` | `null` | false | Two-way value (`v-model`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | One Tabs.Item per section of the resource. |
| `actions` | — | The actions the whole resource owns, on the right of the strip: a staged-changes Tag, Deploy. |

## v-model

- **`v-model`** (`modelValue`) — `string | number | null`, default `null`. The active tab; it updates when a tab is picked.

## States

- Visual states: `default`; the tab states are owned by `tabs`
- `data-column` mirrors the `column` prop on the root. The strip and its rule stay full bleed; with `data`, `form` or `focused` the tab row inside is capped at the same measure as the page column it sits over (`layout-column`, `layout-column-form`, `layout-column-focused`) and centred, so the first tab lines up with the content below. `full` leaves the row at the page boundary inset.

## Accessibility

- Visible focus: owned by `Tabs.Item` and the actions.
- Keyboard map: the tablist follows `tabs` (arrows move between tabs, `Home`/`End` jump); `Tab` leaves the tablist for the actions.
- ARIA: `role="tablist"` and `role="tab"` come from `tabs`.
- Contrast ≥4.5:1, owned by `tabs`.

## Right-to-left

- Layout: logical utilities only (`-ms-`, `margin-inline` from the column utilities); the tabs start at the inline start and the actions sit at the inline end.
- Icons: none of its own.
- Keyboard: owned by `tabs` (the arrow keys follow the reading direction).
- User data: none.

## Internationalization

No built-in strings: the tab labels and the actions come from the consumer's slots.

- Formatting: none.

## Responsive

- Container queries: none; the column utilities cap the tab row at the page column's measure and fall back to the full width below it.
- Narrow (≤ 640 px or a narrow container): the tablist scrolls inline inside its own region (owned by `tabs`); the actions keep their size at the inline end.
- Touch: tab targets are owned by `tabs`; no hover-only affordance.
- Reflow: no page-level horizontal scroll at 320 px and 200 % zoom; only the tablist scrolls.

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
        icon="ai ai-cloud-upload"
      />
    </template>
  </PageTabs>
</template>
```

### FormColumn

```vue
<script setup>
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const activeTab = ref('general')
  const tabs = [
    { value: 'general', label: 'General' },
    { value: 'members', label: 'Members' },
    { value: 'billing', label: 'Billing' }
  ]
</script>

<template>
  <PageTabs
    v-model="activeTab"
    column="form"
  >
    <Tabs.Item
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
  </PageTabs>
</template>
```
