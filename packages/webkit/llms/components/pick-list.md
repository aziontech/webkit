# Pick List

> Dual-list transfer control: a labelled **source** listbox and a labelled **target** listbox with a control column to move items between them. Use it when the consumer needs to build a subset from a pool of options where both the chosen set and the remaining pool stay visible. Derived from the PrimeVue PickList behavior but rewritten to our conventions (no Figma); the visual surface is a best-effort first draft to validate. Compound, composition API: the root (`<PickList>`) owns the bound data (`v-model` = `[sourceItems, targetItems]`) and the shared selection/move state, and provides it through `provide`/`inject`. The consumer composes the anatomy — `<PickList.Source>`, `<PickList.Controls>`, `<PickList.Target>` — and the context-aware `<PickList.Controls>` wires the move buttons with no props. Each list is data-driven: items come from the root's bound pair and render through the list's `#item` slot (repeated data stays as props, not hand-authored rows). Double-clicking an option moves it to the opposite list (emitting `item-double-click`); this auto-move can be turned off with `move-on-double-click`. The two lists sit side by side on wider viewports and stack vertically (with the controls as a horizontal row between them) on narrow ones; the move arrows point left/right side-by-side and up/down when stacked.

- Import: `import PickListRoot from '@aziontech/webkit/pick-list-root'`
- Compound import (dot notation, not tree-shakeable): `import PickList from '@aziontech/webkit/pick-list'`
- Category: data · Surface: product · Structure: composition
- API as JSON: [pick-list.json](https://github.com/aziontech/webkit/blob/main/.specs/pick-list.json)

## When to use

- Building a subset from a pool where both the chosen and the remaining items stay visible (domains assigned to an application, members of a team).
- Moving many items at once with move-all and multi-selection.
- Lists that load separately, each with its own `loading` state.

## Do

- Set `data-key` to a unique item field so rows keep stable keys across moves; without it rows are keyed by their index.
- Set `title` on both `PickList.Source` and `PickList.Target`; it is the listbox's accessible name.
- Listen to `move` for side effects such as saving the assignment instead of diffing `v-model`.
- Set `:move-on-double-click="false"` when double-click should do something else; `item-double-click` still fires.

## Don’t

- Picking a few values in a compact field → use `multi-select`.
- Selecting rows of tabular data with columns, sorting, or pagination → use `table` with row selection.
- A handful of fixed options → use a horizontal `field` with a `checkbox` for each.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [multi-select](multi-select.md) — compact dropdown for multi-pick when the remaining pool does not need to stay visible.
- [table](table.md) — row selection over tabular data.
- [checkbox](checkbox.md) — independent boolean or small-set multi-pick.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `modelValue` | `[unknown[], unknown[]]` | `() => [[], []]` | false | Bound pair of lists as `[sourceItems, targetItems]` (v-model). |
| `dataKey` | `string` | `''` | false | Item field used as each row's render key (falls back to the index). Selection is always tracked by index. |
| `disabled` | `boolean` | `false` | false | Disables all selection and move controls and applies disabled tokens. |
| `moveOnDoubleClick` | `boolean` | `true` | false | When true, double-clicking an item moves it to the opposite list. Set false to keep `item-double-click` firing without the move. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:modelValue` | `[unknown[], unknown[]]` | v-model update with the new `[sourceItems, targetItems]` pair. |
| `move` | `{ direction: 'to-target' \| 'to-source'; items: unknown[] }` | Fired after items move between lists, with the moved items. |
| `item-double-click` | `(event: MouseEvent, payload: { list: 'source' \| 'target'; item: unknown; index: number })` | Fired when an option is double-clicked. `event` is the dblclick; `payload` carries the item, its index, and which list it was in. Fires regardless of `moveOnDoubleClick`, but not while the component is disabled or a list is loading. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | { move, moveAll, hasSelection, count, disabled, loading } | Composition slot; receives `<PickList.Source>`, `<PickList.Controls>`, and `<PickList.Target>` in flow order. The scope exposes the move actions plus selection/loading state, so a consumer can render custom controls inside the root in place of `<PickList.Controls>`. |

## Sub-component imports

- `@aziontech/webkit/pick-list-source`
- `@aziontech/webkit/pick-list-target`
- `@aziontech/webkit/pick-list-controls`

## Sub-components

- `pick-list-source/pick-list-source.vue` — The source listbox (the left/top list). Reads its items and selection from the injected context. Props: `title` (heading text / accessible name), `loading` (shows a spinner in place of options and locks its controls). Slots: `item` (`{ item, index, list }`) renders one option row; `title` overrides the heading content. Double-clicking an option moves it to the target (driven by the root via the injected context).
- `pick-list-target/pick-list-target.vue` — The target listbox (the right/bottom list). Same anatomy, props, and slots as `pick-list-source`, bound to the target side of the pair; double-clicking an option moves it back to the source.
- `pick-list-controls/pick-list-controls.vue` — The context-aware control column between the lists. Renders the four move buttons (move selected / move all, in each direction) as icon-only buttons; reads selection, item counts, loading, and disabled from the injected context and drives the moves. Takes no props. The arrows point left/right when the lists are side by side and rotate to up/down when they stack on narrow viewports.

## States

- Visual states: `default`, `hover` (option), `focus-visible` (option / control), `selected` (option), `disabled`, `loading`
- `data-disabled` on the root mirrors the `disabled` prop
- `data-loading` on a list (`pick-list-source` / `pick-list-target`) mirrors that list's `loading` prop
- A loading list renders a centered spinner instead of its options and sets `aria-busy="true"`; while any list is loading, both the move controls and double-click-to-move are disabled until loading clears
- Each option carries `data-selected` mirroring its selection and `aria-selected`
- Server render and hydration: the options are the direct `v-for` children of the `TransitionGroup` list (an empty list while loading) and the spinner a sibling `v-if`, so the server renders no fragment markers inside the list and the HTML hydrates as is.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on each option and on every move control.
- Keyboard map: `Tab` moves between the two listboxes and the control column; within a listbox `Space`/`Enter` toggle the focused option's selection; the move controls are activated with `Enter`/`Space`. Double-click on an option is a pointer affordance for moving it to the opposite list; the same move is reachable via select + the move controls (no keyboard-only feature is double-click-only).
- ARIA: each list is `role="listbox"` with `aria-label` from its title text; options are `role="option"` with `aria-selected`; the source/target listboxes set `aria-multiselectable="true"`; every move control is an icon-only button with an explicit `aria-label`; `aria-disabled` mirrors `disabled`.
- Contrast ≥4.5:1 (text) / ≥3:1 (borders + icons), including the disabled state.
- A loading list sets `aria-busy="true"`; its `Spinner` is decorative (`aria-hidden`) and carries its own reduced-motion fallback. Control hover transitions pair with `motion-reduce:transition-none`.
- Touch target ≥40×40 px for every move control (medium icon-button height).

## Examples

### Default

```vue
<script setup>
  import PickList from '@aziontech/webkit/pick-list'
  import { ref } from 'vue'

  const model = ref([
    [
      { id: 1, label: 'Edge Functions' },
      { id: 2, label: 'WAF' },
      { id: 3, label: 'Image Processor' }
    ],
    [{ id: 4, label: 'Cache' }]
  ])
</script>

<template>
  <PickList
    v-model="model"
    data-key="id"
  >
    <PickList.Source title="Available">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Source>

    <PickList.Controls />

    <PickList.Target title="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Target>
  </PickList>
</template>
```

### Disabled

```vue
<script setup>
  import PickList from '@aziontech/webkit/pick-list'
  import { ref } from 'vue'

  const model = ref([
    [
      { id: 1, label: 'Edge Functions' },
      { id: 2, label: 'WAF' },
      { id: 3, label: 'Image Processor' }
    ],
    [{ id: 4, label: 'Cache' }]
  ])
</script>

<template>
  <PickList
    v-model="model"
    data-key="id"
    disabled
  >
    <PickList.Source title="Available">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Source>

    <PickList.Controls />

    <PickList.Target title="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Target>
  </PickList>
</template>
```

### Loading

```vue
<script setup>
  import PickList from '@aziontech/webkit/pick-list'
  import { ref } from 'vue'

  const model = ref([
    [
      { id: 1, label: 'Edge Functions' },
      { id: 2, label: 'WAF' },
      { id: 3, label: 'Image Processor' }
    ],
    [{ id: 4, label: 'Cache' }]
  ])
</script>

<template>
  <PickList
    v-model="model"
    data-key="id"
  >
    <PickList.Source
      title="Available"
      loading
    >
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Source>

    <PickList.Controls />

    <PickList.Target title="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Target>
  </PickList>
</template>
```
