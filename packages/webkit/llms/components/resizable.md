# Resizable

> A group of adjacent regions whose shared edges the reader can drag. It is the layout primitive behind a workspace — an editor with a terminal under it and a preview beside it — where every region is content the reader is working in and the split between them is theirs to set. It exists because `Sidebar` was being used for both jobs. `Sidebar` is the app's NAVIGATION rail: it collapses to icons, it hides, it is the thing you leave to go somewhere. A terminal, a preview and a code editor are not places you navigate to — they are the work — and dressing two of them as navigation rails made a screen with three "sidebars" and one document, on an axis `Sidebar` does not even have (it has no horizontal edge, so a terminal under an editor had to hand-roll its own splitter). This component owns the EDGE; `Sidebar` goes back to owning navigation.

- Import: `import ResizableRoot from '@aziontech/webkit/resizable-root'`
- Compound import (dot notation, not tree-shakeable): `import Resizable from '@aziontech/webkit/resizable'`
- Category: layout · Surface: product · Structure: composition
- API as JSON: [resizable.json](https://github.com/aziontech/webkit/blob/main/.specs/resizable.json)

## When to use

- Two or more content regions share an edge the reader should be able to move (editor + terminal, editor + preview, list + detail).
- The split is a working preference the reader sets many times in a session, not a one-time layout decision.
- A region has to shrink to nothing and come back without losing its state (an editor's undo history, a scroll position).
- The layout needs a horizontal edge — one region above another — which no other component in the package provides.

## Do

- Give exactly ONE pane in a group no `basis`. That pane absorbs the remaining space, so the group always fills its container and the reader never sees a gap or a scrollbar they did not cause.
- Put the `basis` on the pane whose size the reader cares about (the terminal's height, the preview's width) and let the document be the flexible one.
- Keep the pane's own state alive when it is collapsed — collapse renders it at zero length, it does not unmount it. A code editor that loses its undo history when the reader drags an edge shut has lost the reader's work.
- Give every handle an `ariaLabel` naming the edge it moves ("Resize the terminal"), never the generic default: a screen with three handles otherwise reads as three identical controls.
- A control that reopens a collapsed pane belongs OUTSIDE that pane, in the surrounding chrome. A control that only exists inside the thing it hides cannot bring it back.

## Don’t

- The panel is the app's navigation rail → use `sidebar`, which owns the icon rail, the collapse and the nav semantics.
- The content is a temporary overlay over the page → use `drawer` (a panel that comes and goes) or `dialog`.
- The regions have a fixed relationship the reader should not change → use plain flex/grid layout with the layout tokens.
- The panel is one scrolling region with no movable edge → use `scroll-area`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [sidebar](sidebar.md) — the navigation rail. Collapses to icons, hides, and carries nav semantics; reach for it when the panel is how the reader gets somewhere, not what they work in.
- [scroll-area](scroll-area.md) — one region that scrolls. A pane usually contains one.
- [drawer](drawer.md) — a panel that arrives over the page and leaves; a resizable pane is always there.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | false | Axis the panes are laid out on; horizontal places them side by side, vertical stacks them. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the group as a whole. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | On the root, the panes and handles in the order they appear. On a pane, its content. The handle takes no slot. |

## Sub-component imports

- `@aziontech/webkit/resizable-handle`
- `@aziontech/webkit/resizable-pane`

## Sub-components

- `resizable-pane/resizable-pane.vue` — one region of the group. Sized along the axis by `basis`, or flexible when `basis` is absent.
- `resizable-handle/resizable-handle.vue` — the movable edge between two panes. A focusable `separator` that publishes its value, so the split is settable without a pointer.

Neither part is an overlay, so neither is named `Trigger` or `Content` and neither carries `data-state="open|closed"`: the names come from this component's own anatomy — a group of PANES divided by HANDLES.

`resizable-pane` props:

- `basis` — `number`, default unset. The pane length in pixels along the group axis, two-way through `v-model:basis`. Leave unset for the pane that absorbs the remaining space.
- `min` — `number`, default `96`. Smallest length in pixels a drag may set.
- `max` — `number`, default `720`. Largest length in pixels a drag may set.
- `collapsed` — `boolean`, default unset. Whether the pane renders at zero length, two-way through `v-model:collapsed`. The pane stays mounted, so its content keeps its state.
- `collapsible` — `boolean`, default `false`. Whether dragging past the minimum collapses the pane instead of stopping at it.
- `ariaLabel` — `string`, default `''`. Accessible name for the region.

`resizable-handle` props:

- `ariaLabel` — `string`, default `''`. Accessible name of the separator; name the edge it moves. Empty uses the locale catalog (`Resize panel` in English).
- `disabled` — `boolean`, default `false`. Disables the drag and the keyboard nudge, and removes the separator from the tab order.

`resizable-pane` events: `update:basis` (`number`) on every step of a drag and on a
keyboard nudge, and `update:collapsed` (`boolean`) when a drag past the minimum collapses
the pane or a drag back out restores it. Both are the `v-model` half of the props above.

`resizable-handle` emits nothing: it drives the pane beside it through the group's
context, so a consumer never wires one part to the other.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-orientation`: `horizontal` | `vertical` — on the root, and mirrored onto every pane and handle so each part styles itself off one fact.
- `data-collapsed` mirrors the pane's `collapsed` state
- `data-resizing` on the handle while a drag is in flight
- `data-disabled` mirrors the handle's `disabled` prop
- Reflow: the group clips on its main axis (`overflow-x-clip` / `overflow-y-clip`), so the hit area of a handle at the edge (a collapsed end pane) never adds overflow.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses each handle; `ArrowLeft`/`ArrowRight` move a handle in a horizontal group and `ArrowUp`/`ArrowDown` in a vertical one, one 24px step per press; `Home` sets the pane to its minimum, `End` to its maximum; `Enter` toggles a collapsible pane.
- ARIA: the handle is `role="separator"` with `aria-orientation` (the PERPENDICULAR of the group's axis — a separator between two side-by-side panes is itself vertical), `aria-valuenow` / `aria-valuemin` / `aria-valuemax` published from the pane it moves, `aria-label` from `ariaLabel`, and `aria-disabled` when disabled. Each pane is `role="group"` with its `ariaLabel`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state
- `motion-reduce:transition-none` on the handle's colour transition
- Touch target: the handle draws a `--spacing-xxs` rail and extends its hit area to 16px across the axis with a pseudo-element, so the edge is grabbable without drawing a thick bar.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the grip is symmetric and does not mirror.
- Keyboard: on a horizontal group `ArrowLeft`/`ArrowRight` nudge the handle toward the start/end panel, swapped under `dir="rtl"` (`useDirection(handleRef)`), so `ArrowRight` always moves the handle right on screen.
- Pointer: the drag delta is inverted on horizontal groups under `rtl`, because the first panel sits on the right.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import Resizable from '@aziontech/webkit/resizable'
  import { ref } from 'vue'

  const basis = ref(240)
</script>

<template>
  <Resizable
    orientation="horizontal"
    aria-label="Workspace"
    class="h-64"
  >
    <Resizable.Pane aria-label="Document"
      >Flexible — no basis, so it takes what is left.</Resizable.Pane
    >
    <Resizable.Handle aria-label="Resize the panel" />
    <Resizable.Pane
      v-model:basis="basis"
      :min="160"
      :max="480"
      aria-label="Panel"
      >Sized</Resizable.Pane
    >
  </Resizable>
</template>
```

### Orientations

```vue
<script setup>
  import Resizable from '@aziontech/webkit/resizable'
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <Resizable
      orientation="horizontal"
      aria-label="Side by side"
      class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
      <Resizable.Handle aria-label="Resize the preview" />
      <Resizable.Pane
        :basis="200"
        :min="120"
        :max="400"
        aria-label="Preview"
        >Preview</Resizable.Pane
      >
    </Resizable>
    <Resizable
      orientation="vertical"
      aria-label="Stacked"
      class="h-64 overflow-hidden rounded-(--shape-card) border border-(--border-default)"
    >
      <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
      <Resizable.Handle aria-label="Resize the terminal" />
      <Resizable.Pane
        :basis="96"
        :min="48"
        :max="200"
        aria-label="Terminal"
        >Terminal</Resizable.Pane
      >
    </Resizable>
  </div>
</template>
```

### Collapsed

```vue
<script setup>
  import Resizable from '@aziontech/webkit/resizable'
  import { ref } from 'vue'

  const collapsed = ref(true)
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <button
      type="button"
      @click="collapsed = !collapsed"
    >
      {{ collapsed ? 'Show' : 'Hide' }} the preview
    </button>
    <Resizable
      aria-label="Workspace"
      class="h-64"
    >
      <Resizable.Pane aria-label="Editor">Editor</Resizable.Pane>
      <Resizable.Handle aria-label="Resize the preview" />
      <Resizable.Pane
        v-model:collapsed="collapsed"
        :basis="240"
        :min="160"
        collapsible
        aria-label="Preview"
        >Preview</Resizable.Pane
      >
    </Resizable>
  </div>
</template>
```
