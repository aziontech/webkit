# Panel

> Layered surface above the page (modal, drawer, menu). Lives at `packages/webkit/src/components/overlay/panel/`.

- Import: `import Panel from '@aziontech/webkit/panel'`
- Category: overlay · Surface: product · Structure: composition
- API as JSON: [panel.json](https://github.com/aziontech/webkit/blob/main/.specs/panel.json)

## When to use

- Laying out the regions inside `DialogContent` or `DrawerContent`: `PanelHeader` for the title and close control, `PanelContent` for the body that scrolls, `PanelFooter` for the actions.
- A static preview of an overlay surface outside a live overlay, for example a frozen dialog on a docs or marketing page.

## Do

- Inside a dialog or drawer, use only `PanelHeader`, `PanelContent` and `PanelFooter`. The overlay already renders the `Panel` root, so a second `Panel` inside it nests two shells.
- Put long content in `PanelContent`. It is the only region that scrolls; the header and footer stay in place.
- size` caps the max width (`small`, `medium`, `large` map to the `--container-sm` / `--container-xl` / `--container-2xl` tokens). `sizeAtMd` applies that cap from `md` up only and is meant for the dialog's mobile bottom sheet.
- Panel` has no open state, no dismissal and no focus management. Don't use it alone as a modal.

## Don’t

- The surface has to open over the page and trap focus → use `dialog`.
- The surface slides in from a screen edge → use `drawer`.
- Rich content anchored to a trigger that leaves the page interactive → use `popover`.
- A card in the page layout, with header, content and footer slots → use `card`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [dialog](dialog.md) — renders a `Panel` inside `DialogContent`; compose the `Panel*` regions directly in it.
- [drawer](drawer.md) — renders a `Panel` inside `DrawerContent`; there `PanelContent` scrolls through a `ScrollArea`.
- [card](card.md) — in-page card with header, content and footer slots. `Panel` is the elevated overlay shell, with a large shadow and max-width presets.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | `PanelSize` | `'medium'` | false | Max width of the panel shell. |
| `sizeAtMd` | `boolean` | `false` | false | When true, the `size` max-width applies from `md` up only (dialog mobile bottom sheet). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | — |

## Sub-component imports

- `@aziontech/webkit/panel-content`
- `@aziontech/webkit/panel-footer`
- `@aziontech/webkit/panel-header`

## Sub-components

- `panel-content.vue` — Public sub-component `panel-content`.
- `panel-footer.vue` — Public sub-component `panel-footer`.
- `panel-header.vue` — Public sub-component `panel-header`.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)
- Responsive: `PanelContent` is the `@container/panel`, so the content of a dialog or a drawer lays out for the panel width. Below `sm` the `PanelFooter` wraps, stretches its direct children to equal widths (`max-sm:*:flex-1`) and pads the bottom by `env(safe-area-inset-bottom)`.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Usage

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Panel from '@aziontech/webkit/panel'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
</script>

<template>
  <Panel size="medium">
    <PanelHeader>
      <h2 class="text-heading-sm text-(--text-default)">Cache settings</h2>
    </PanelHeader>
    <PanelContent>
      <p class="text-body-sm text-(--text-muted)">
        Objects are cached at the edge for the TTL set on each rule.
      </p>
    </PanelContent>
    <PanelFooter>
      <Button
        label="Cancel"
        kind="outlined"
      />
      <Button
        label="Save"
        kind="primary"
      />
    </PanelFooter>
  </Panel>
</template>
```
