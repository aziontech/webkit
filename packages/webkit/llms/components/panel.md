# Panel

> The shell inside an overlay: a sized surface with a header for the title and the close control, a body that scrolls and a footer for the actions. `DialogContent` and `DrawerContent` lay their regions out with it, and a page can render it on its own as a static preview of an overlay.

- Import: `import PanelRoot from '@aziontech/webkit/panel-root'`
- Compound import (dot notation, not tree-shakeable): `import Panel from '@aziontech/webkit/panel'`
- Category: overlay · Surface: app · Structure: composition
- API as JSON: [panel.json](panel.json)

## When to use

- Laying out the regions inside `DialogContent` or `DrawerContent`: `PanelHeader` for the title (the overlay adds its close control), `PanelBody` for the body that scrolls, `PanelFooter` for the actions.
- A static preview of an overlay surface outside a live overlay, for example a frozen dialog on a docs or marketing page.

## Do

- Inside a dialog or drawer, use only `PanelHeader`, `PanelBody` and `PanelFooter`. The overlay already renders the `Panel` root, so a second `Panel` inside it nests two shells.
- Put long content in `PanelBody`. It is the only region that scrolls; the header and footer stay in place.
- `PanelBody` is the dominant block. Its copy defaults to `.text-body-sm` (14px) in `var(--text-default)`, its padding (`var(--spacing-lg)`) is larger than the header and footer block padding (`var(--spacing-md)`), and it is at least `min-h-24` tall, so a one-line body still reads taller than the header and footer bands. The extra height falls after the text. Children with their own text class keep it.
- `size` caps the max width (`small`, `medium`, `large` map to the `--container-sm` / `--container-xl` / `--container-2xl` tokens). `sizeAtMd` applies that cap from `md` up only and is meant for the dialog's mobile bottom sheet.
- `Panel` has no open state, no dismissal and no focus management. Don't use it alone as a modal.

## Don’t

- The surface has to open over the page and trap focus → use `dialog`.
- The surface slides in from a screen edge → use `drawer`.
- Rich content anchored to a trigger that leaves the page interactive → use `popover`.
- A card in the page layout, with header, content and footer slots → use `card`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [dialog](dialog.md) — renders a `Panel` inside `DialogContent`; compose the `Panel*` regions directly in it.
- [drawer](drawer.md) — renders a `Panel` inside `DrawerContent`; there `PanelBody` scrolls through a `ScrollArea`.
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

- `@aziontech/webkit/panel-body`
- `@aziontech/webkit/panel-footer`
- `@aziontech/webkit/panel-header`

## Sub-components

- `index.ts` — the compound: `Panel` with `Panel.Header`, `Panel.Body` and `Panel.Footer` attached by `Object.assign`, exported at `@aziontech/webkit/panel`; the root alone is `@aziontech/webkit/panel-root`.
- `panel-body.vue` — Public sub-component `panel-body`.
- `panel-footer.vue` — Public sub-component `panel-footer`.
- `panel-header.vue` — Public sub-component `panel-header`. Inside `DialogContent` / `DrawerContent` it appends the overlay's close button after its content (the content then sits in one flex row that keeps its own start/end spread), while the overlay's `closable` is true; a `PanelHeader` of a nested `Panel` gets nothing. Standalone it renders only its slot.

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` (where applicable)
- `data-width` on the root carries the resolved width: `small` | `medium` | `large`, the same with `-md` when `sizeAtMd` is set, or `fluid` when the internal `data-fluid` attribute is passed (Drawer). Tailwind `data-[width=…]:` variants map it to the container tokens; there is no JS class map.
- Responsive: `PanelBody` is the `@container/panel`, so the content of a dialog or a drawer lays out for the panel width. Below `sm` the `PanelFooter` wraps, stretches its direct children to equal widths (`max-sm:*:flex-1`) and pads the bottom by `env(safe-area-inset-bottom)`. A footer the consumer stacks as a column (`flex-col`) keeps every child at its own height (`max-sm:[&.flex-col]:*:flex-none`), so stacked buttons never collapse below their drawn height.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates; `Escape` closes overlays where applicable.
- ARIA: root uses appropriate roles (`button`, `dialog`, `status`, etc.) per sub-component.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Scroll region: when `PanelBody` (outside a drawer's `ScrollArea`) overflows and holds nothing focusable, it takes `tabindex="0"` with an inset focus ring, so a keyboard user can scroll it (WCAG 2.1.1, axe `scrollable-region-focusable`); it is measured on resize and on content changes.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Panel from '@aziontech/webkit/panel-root'
</script>

<template>
  <Panel size="medium">
    <PanelHeader>
      <h2 class="text-heading-sm text-(--text-default)">Cache settings</h2>
    </PanelHeader>
    <PanelBody>
      <p class="text-body-sm text-(--text-muted)">
        Objects are cached at the edge for the TTL set on each rule.
      </p>
    </PanelBody>
    <PanelFooter>
      <Button
        label="Cancel"
        variant="outline"
      />
      <Button
        label="Save"
        variant="primary"
      />
    </PanelFooter>
  </Panel>
</template>
```
