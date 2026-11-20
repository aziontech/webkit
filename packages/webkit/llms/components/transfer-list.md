# Transfer List

> Dual-list transfer control: a labelled **source** listbox and a labelled **target** listbox with a control column to move items between them. Use it when the consumer needs to build a subset from a pool of options where both the chosen set and the remaining pool stay visible. Named after the MUI Transfer List (Ant Design calls it Transfer; it was PickList before 6.0), written to our conventions (no Figma); the visual surface is a best-effort first draft to validate. Compound, composition API: the root (`<TransferList>`) owns the bound data (`v-model` = `[sourceItems, targetItems]`) and the shared selection/move state, and provides it through `provide`/`inject`. The consumer composes the anatomy — `<TransferList.Source>`, `<TransferList.Controls>`, `<TransferList.Target>` — and the context-aware `<TransferList.Controls>` wires the move buttons with no props. Each list is data-driven: items come from the root's bound pair and render through the list's `#item` slot (repeated data stays as props, not hand-authored rows). Double-clicking an option moves it to the opposite list (emitting `item-double-click`); this auto-move can be turned off with `move-on-double-click`. The two lists sit side by side on wider viewports and stack vertically (with the controls as a horizontal row between them) on narrow ones; the move arrows point left/right side-by-side and up/down when stacked.

- Import: `import TransferListRoot from '@aziontech/webkit/transfer-list-root'`
- Compound import (dot notation, not tree-shakeable): `import TransferList from '@aziontech/webkit/transfer-list'`
- Category: data · Surface: app · Structure: composition
- API as JSON: [transfer-list.json](transfer-list.json)

## When to use

- Use TransferList only when the person builds a large subset and must see the chosen and remaining items side by side. To pick several values in a compact form field use MultiSelect; for two to five options use a Checkbox per option.
- Building a subset from a pool where both the chosen and the remaining items stay visible (domains assigned to an application, members of a team).
- Moving many items at once with move-all and multi-selection.
- Lists that load separately, each with its own `loading` state.

## Do

- Set `item-key` to a unique item field so rows keep stable keys across moves and the selection follows the record when the lists change; without it rows and the selection are keyed by their index.
- Set `title` on both `TransferList.Source` and `TransferList.Target`; it is the listbox's accessible name.
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
| `itemKey` | `string` | `''` | false | Item field that identifies a record, the same name as `card-list`: each row's render key and the key of the selection, so an external change to the v-model pair keeps the selection on its records. Empty falls back to the index. |
| `disabled` | `boolean` | `false` | false | Disables all selection and move controls and applies disabled tokens. |
| `moveOnDoubleClick` | `boolean` | `true` | false | When true, double-clicking an item moves it to the opposite list. Set false to keep `item-double-click` firing without the move. |
| `modelValue` | `TransferListValue` | `—` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `move` | `(event: Event, payload: { direction: 'to-target' \| 'to-source'; items: unknown[] })` | Fired after items move between lists; the DOM event of the control (or the double-click) first, then the direction and the moved items. |
| `item-double-click` | `(event: MouseEvent, payload: { list: 'source' \| 'target'; item: unknown; index: number })` | Fired when an option is double-clicked. `event` is the dblclick; `payload` carries the item, its index, and which list it was in. Fires regardless of `moveOnDoubleClick`, but not while the component is disabled or a list is loading. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | { move, moveAll, hasSelection, count, disabled, loading } | Composition slot; receives `<TransferList.Source>`, `<TransferList.Controls>`, and `<TransferList.Target>` in flow order. The scope exposes the move actions plus selection/loading state, so a consumer can render custom controls inside the root in place of `<TransferList.Controls>`. |

## Sub-component imports

- `@aziontech/webkit/transfer-list-source`
- `@aziontech/webkit/transfer-list-target`
- `@aziontech/webkit/transfer-list-controls`

## Sub-components

- `transfer-list-source/transfer-list-source.vue` — The source listbox (the left/top list). Reads its items and selection from the injected context. Props: `title` (heading text / accessible name), `loading` (shows a spinner in place of options and locks its controls). Slots: `item` (`{ item, index, list }`) renders one option row; `title` overrides the heading content. Double-clicking an option moves it to the target (driven by the root via the injected context).
- `transfer-list-target/transfer-list-target.vue` — The target listbox (the right/bottom list). Same anatomy, props, and slots as `transfer-list-source`, bound to the target side of the pair; double-clicking an option moves it back to the source.
- `transfer-list-controls/transfer-list-controls.vue` — The context-aware control column between the lists. Renders the four move buttons (move selected / move all, in each direction) as icon-only buttons; reads selection, item counts, loading, and disabled from the injected context and drives the moves. Takes no props. The arrows point left/right when the lists are side by side and rotate to up/down when they stack on narrow viewports.

## v-model

| Model     | Type                     | Default          | Emits               | Notes                                                                                                                                                                                          |
| --------- | ------------------------ | ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `[unknown[], unknown[]]` | `() => [[], []]` | `update:modelValue` | Bound pair of lists as `[sourceItems, targetItems]`, two-way through `defineModel`. Each move writes the new pair back; without a bound `v-model` the component keeps the pair as local state. |

## States

- Visual states: `default`, `hover` (option), `focus-visible` (option / control), `selected` (option), `disabled`, `loading`
- `data-disabled` on the root mirrors the `disabled` prop
- `data-loading` on a list (`transfer-list-source` / `transfer-list-target`) mirrors that list's `loading` prop
- A loading list renders a centered spinner instead of its options and sets `aria-busy="true"`; while any list is loading, both the move controls and double-click-to-move are disabled until loading clears
- Each option carries `data-selected` mirroring its selection and `aria-selected`
- Empty list (not loading, no items): the package `EmptyState` (small, `transferList.emptyTitle`, `No items`) is laid over the list box, outside the listbox element (a `status` region is not an allowed listbox child); test id `<list testid>__empty`
- Server render and hydration: the options are the direct `v-for` children of the `TransitionGroup` list (an empty list while loading) and the spinner a sibling `v-if`, so the server renders no fragment markers inside the list and the HTML hydrates as is.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on each option and on every move control.
- Keyboard map: `Tab` moves between the two listboxes and the control column, one tab stop per listbox (roving `tabindex`: the last focused option, the first by default); within a listbox `ArrowDown`/`ArrowUp` move focus, `Home`/`End` go to the first and last option, `Space`/`Enter` toggle the focused option's selection, and `Shift`+`ArrowDown`/`ArrowUp` extend the selection to the next option; the move controls are activated with `Enter`/`Space`. Double-click on an option is a pointer affordance for moving it to the opposite list; the same move is reachable via select + the move controls (no keyboard-only feature is double-click-only).
- ARIA: each list is `role="listbox"` with `aria-label` from its title text; options are `role="option"` with `aria-selected`; the source/target listboxes set `aria-multiselectable="true"`; every move control is an icon-only button with an explicit `aria-label`; `aria-disabled` mirrors `disabled` on both listboxes, and a disabled root becomes `role="group"` with `aria-disabled="true"`, so the titles dimmed by the root's `opacity-60` belong to a disabled control (WCAG 1.4.3 inactive-component exemption) instead of reading as low-contrast live text.
- Contrast ≥4.5:1 (text) / ≥3:1 (borders + icons), including the disabled state.
- A loading list sets `aria-busy="true"`; its `Spinner` is decorative (`aria-hidden`) and carries its own reduced-motion fallback. Control hover transitions pair with `motion-reduce:transition-none`.
- Touch target ≥40×40 px for every move control (medium icon-button height).

## Examples

### Default

```vue
<script setup>
  import TransferList from '@aziontech/webkit/transfer-list'
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
  <TransferList
    v-model="model"
    item-key="id"
  >
    <TransferList.Source title="Available">
      <template #item="{ item }">{{ item.label }}</template>
    </TransferList.Source>

    <TransferList.Controls />

    <TransferList.Target title="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </TransferList.Target>
  </TransferList>
</template>
```

### Disabled

```vue
<script setup>
  import TransferList from '@aziontech/webkit/transfer-list'
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
  <TransferList
    v-model="model"
    item-key="id"
    disabled
  >
    <TransferList.Source title="Available">
      <template #item="{ item }">{{ item.label }}</template>
    </TransferList.Source>

    <TransferList.Controls />

    <TransferList.Target title="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </TransferList.Target>
  </TransferList>
</template>
```

### Loading

```vue
<script setup>
  import TransferList from '@aziontech/webkit/transfer-list'
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
  <TransferList
    v-model="model"
    item-key="id"
  >
    <TransferList.Source
      title="Available"
      loading
    >
      <template #item="{ item }">{{ item.label }}</template>
    </TransferList.Source>

    <TransferList.Controls />

    <TransferList.Target title="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </TransferList.Target>
  </TransferList>
</template>
```
