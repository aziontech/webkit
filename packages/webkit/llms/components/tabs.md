# Tabs

> Helps users move between views or sections. Lives at `packages/webkit/src/components/navigation/tabs/`.

- Import: `import Tabs from '@aziontech/webkit/tabs'`
- Category: navigation · Surface: product · Structure: composition
- API as JSON: [tabs.json](https://github.com/aziontech/webkit/blob/main/.specs/tabs.json)

## When to use

- A page or panel holds several peer views and only one is shown at a time (Overview / Settings / Logs on a resource page).
- The tab row may outgrow its container — `Tabs.List` scrolls horizontally with edge fades instead of wrapping.
- Tabs that the user can close: set `closable` on the item and remove it from your data on `@close`.
- A tab whose form holds unsaved changes: set `dirty` on the item (bind it to `useUnsavedChanges().isDirty`) so the reader sees which section still needs a save.

## Do

- Give each `Tabs.Item` and its `Tabs.Panel` the same `value`; the panel is linked to its tab by that value for `aria-labelledby` and visibility.
- Type a variable that holds the active tab or a list of tab definitions with the exported `TabsValue` (`ref<TabsValue>('overview')`), never `string | number` spelled out or a cast.
- Drive the active tab with `v-model` on the root, or seed it with `default-value`; with neither, the first enabled tab is selected on mount.
- closable` only emits `close` with `(event, value)` — remove the tab and its panel from your data yourself; when the active tab unmounts, the root moves to the first enabled tab.
- dirty` only marks the tab (a dot after the label, "Unsaved changes" for screen readers); guard the switch itself with `useUnsavedChanges().confirmLeave()` in the setter of the root's `v-model` when leaving must ask first.
- Use the item's `selected` prop only for a standalone `Tabs.Item` outside a root; inside a root the selection comes from the root's value.
- Put spacing between the list and the panels on `Tabs.Content` (e.g. a top margin), not inside each panel.
- Centre the tab row with `<Tabs.List align="center">`, never with a `justify-center` class or a centring wrapper; keep the default `start` for tabs that head a resource page or a settings form.

## Don’t

- Several sections may need to be open at once, or the content should expand inline → use `accordion`.
- The tabs switch the media of a marketing band → use `media-tabs`.
- It moves the reader between pages of the app → use `navigation-menu` or `sidebar`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [accordion](accordion.md) — stacked disclosure sections; more than one can be open and content expands below each header.
- [media-tabs](media-tabs.md) — the marketing band that switches an illustration per tab.
- [breadcrumb](breadcrumb.md) — location in a hierarchy, not sibling views.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `defaultValue` | `TabsValue \| null` | `null` | false | Initial active tab when uncontrolled. |
| `modelValue` | `TabsValue \| null \| undefined` | `undefined` | false | Two-way value (`v-model`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## Sub-components

- `tab-view-item.vue` — Public sub-component `tabs-item`. Props include `dirty: boolean` (default `false`): a `size-1.5` `var(--warning-contrast)` dot after the label (`aria-hidden`, `CanvasText` under forced colors) plus a `sr-only` "Unsaved changes" from the `tabs.unsaved` catalog key, and `data-dirty` on the tab.
- `tab-view-list.vue` — Public sub-component `tabs-list`. Prop `align: 'start' | 'center'` (default `'start'`): `center` centres the tabs in the row (`data-align="center"`, `justify-center-safe`, so a row that overflows still scrolls from its first tab), for a page whose content below is centred, such as a catalog of cards.
- `tab-view-panel.vue` — Public sub-component `tabs-panel`.

## v-model

| Model     | Type                             | Default     | Emits               | Notes                                                                                                                                        |
| --------- | -------------------------------- | ----------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `TabsValue \| null \| undefined` | `undefined` | `update:modelValue` | Active tab via `defineModel`. While unbound (`undefined`) the root is uncontrolled: it starts at `defaultValue`, else the first enabled tab. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values on panels: `active` | `inactive`
- Dirty: `data-dirty` on a `Tabs.Item` with `dirty`; the dot is not the only cue for assistive tech (a hidden "Unsaved changes" joins the tab's name).
- Responsive: the tab list (`Tabs.List`) scrolls **horizontally** when the tabs exceed the available width (mobile / narrow viewports) instead of overflowing or wrapping; the scrollbar is visually hidden and the active indicator stays aligned while scrolling. Tabs keep their intrinsic width (`shrink-0`). A gradient edge-fade overlay on the scrollable side(s) (mirrored on `data-fade-start` / `data-fade-end`) hints at off-screen tabs; it fades in / out with the semantic `animate-fade-in` / `animate-fade-out` utilities, and a non-scrollable edge renders no overlay so the first / last tab is never covered at rest.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map (inside `Tabs.List`): `Tab` moves into the list onto the selected tab and out of it to the panel (roving `tabindex`: only the selected tab is `0`); `ArrowRight`/`ArrowLeft` select and focus the next/previous enabled tab and wrap, swapped under `dir="rtl"` (`useDirection`); `Home`/`End` select the first/last enabled tab; `Enter`/`Space` activate the focused tab; `Delete` on a `closable` tab emits `close` (the tab carries `aria-keyshortcuts="Delete"`). Focus after a close is the consumer's call (the neighbouring tab, as `split-view#Sessions` does).
- Close control: the `closable` glyph is a pointer target only (`aria-hidden="true"`, no role, no `tabindex`, a `title` with "Close tab"); keyboard and screen-reader users close with `Delete`, the WAI-ARIA tabs pattern. A focusable close button cannot sit next to the tab: anything focusable inside `role="tablist"` that is not a `tab` fails axe `aria-required-children` (unallowed child), and inside the tab it is `nested-interactive`.
- ARIA: inside `Tabs.List` each item is `role="tab"` with `aria-selected` and `aria-controls` (when its panel is mounted); a `Tabs.Item` rendered on its own, outside any `Tabs`, is a toggle `<button>` with `aria-pressed` and no `tab` role, because a `tab` outside a `tablist` fails `aria-required-parent`. `Tabs.Panel` is `role="tabpanel"` labelled by its tab.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state. The dirty dot is `var(--warning-contrast)` (≥3:1 on the canvas in both themes) and the tab's accessible name carries "Unsaved changes", so colour is never the only cue.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target: the tab item is 32 px tall (`var(--size-8)`) — a justified deviation from 40×40 px matching the Figma tab-item size token, mitigated by the full label + padding being the hit area and by the tab list's own keyboard model.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move to the next/previous tab, swapped under `dir="rtl"` (`logicalArrowKey`); the indicator is anchored with a physical `left: 0` and moved by `offsetLeft`; scroll fades pair `bg-gradient-to-r` with `rtl:bg-gradient-to-l` and read `Math.abs(scrollLeft)`.
- Motion: panel slides mirror (`rtl:` flips the `translate-x` presets).
- User data: none.

## Examples

### Default

```vue
<script setup>
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const active = ref('tab-1')
</script>

<template>
  <Tabs.Root
    v-model="active"
    class="w-full max-w-[40rem]"
  >
    <Tabs.List>
      <Tabs.Item
        value="tab-1"
        label="Tab Item"
      />
      <Tabs.Item
        value="tab-2"
        label="Tab Item"
      />
      <Tabs.Item
        value="tab-3"
        label="Tab Item"
      />
    </Tabs.List>
    <div class="mt-(--spacing-4)">
      <Tabs.Content>
        <Tabs.Panel value="tab-1">
          <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
            <p class="text-body-sm text-(--text-default)">Content for tab 1</p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="tab-2">
          <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
            <p class="text-body-sm text-(--text-default)">Content for tab 2</p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="tab-3">
          <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
            <p class="text-body-sm text-(--text-default)">Content for tab 3</p>
          </div>
        </Tabs.Panel>
      </Tabs.Content>
    </div>
  </Tabs.Root>
</template>
```

### Centered

```vue
<script setup>
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const active = ref('templates')
</script>

<template>
  <Tabs.Root
    v-model="active"
    class="w-full max-w-[40rem]"
  >
    <Tabs.List align="center">
      <Tabs.Item
        value="templates"
        label="Templates"
      />
      <Tabs.Item
        value="integrations"
        label="Integrations"
      />
    </Tabs.List>
    <div class="mt-(--spacing-lg)">
      <Tabs.Content>
        <Tabs.Panel value="templates">
          <p class="text-center text-body-sm text-(--text-muted)">
            Start a project from a template built for the edge.
          </p>
        </Tabs.Panel>
        <Tabs.Panel value="integrations">
          <p class="text-center text-body-sm text-(--text-muted)">
            Connect the services your applications already use.
          </p>
        </Tabs.Panel>
      </Tabs.Content>
    </div>
  </Tabs.Root>
</template>
```

### Standalone

```vue
<script setup>
  import Tabs from '@aziontech/webkit/tabs'
</script>

<template>
  <div class="flex items-center gap-(--spacing-xxs)">
    <Tabs.Item
      label="Selected"
      selected
    />
    <Tabs.Item label="Idle" />
    <Tabs.Item
      label="Disabled"
      disabled
    />
  </div>
</template>
```
