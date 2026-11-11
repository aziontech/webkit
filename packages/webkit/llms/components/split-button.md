# Split Button

> A primary command button visually joined to a chevron toggle that opens an overlay menu of related actions defined by a `model` array. The primary button runs the default action; the joined toggle composes `navigation/dropdown-menu` to present the remaining actions. Opt into `updateLabelOnSelect` to have the primary segment mirror the last-chosen menu action (label + icon), turning the control into a "default is the last selection" pattern; the primary `click` then reports that mirrored action as its second argument, so a single handler can run whichever action is active. Use it when one action is the default and related actions belong in an attached menu; for a single action use `Button`, and for a standalone menu use `DropdownMenu`.

- Import: `import SplitButton from '@aziontech/webkit/split-button'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [split-button.json](https://github.com/aziontech/webkit/blob/main/.specs/split-button.json)

## When to use

- One default action with a few related alternatives (Save and Save as draft, Deploy and Deploy to staging).
- A "repeat the last choice" control: set `updateLabelOnSelect` so the primary segment mirrors the last action picked.

## Do

- Give every `model` entry a stable `value`; without one the `label` identifies the action, so renaming it changes what handlers receive.
- Handle the default action in `@click` and the menu actions in `@item-click`; both receive `(event, item)`.
- With `updateLabelOnSelect`, read the second argument of `click` (the mirrored item, `null` until one is picked) to run whichever action is active.
- Set `loading` while the action runs: it disables both segments and keeps the menu closed.
- Disable a single action with `disabled: true` on its model entry instead of removing it, so the menu does not shift.

## Don’t

- A single action → use `button`.
- A menu with no default action → use `dropdown-menu`.
- Picking one of a few visible, mutually exclusive options → use `toggle-group`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md) — the primary segment; `kind` here is limited to `primary`, `secondary` and `outlined`.
- [dropdown-menu](dropdown-menu.md) — the overlay menu the toggle composes; use it alone when there is no default action.
- [icon-button](icon-button.md) — the chevron toggle segment.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible label text on the primary command button. |
| `icon` | `string` | `''` | false | PrimeIcons class for the primary button's leading icon. |
| `model` | `SplitButtonItem[]` | `[]` | false | Actions rendered as rows in the attached overlay menu. |
| `kind` | `'primary' \| 'secondary' \| 'outlined'` | `'primary'` | false | Visual variant applied to both joined segments. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, and typography. |
| `disabled` | `boolean` | `false` | false | Disables both segments and prevents the menu from opening. |
| `loading` | `boolean` | `false` | false | Shows a spinner on the primary button and takes the disabled status: both segments are disabled and the menu cannot open while it resolves. |
| `updateLabelOnSelect` | `boolean` | `false` | false | When true, selecting a menu action updates the primary button's label and icon to mirror that action and marks it as selected in the menu. Opt-in; the mirrored action is also reported as the primary `click`'s second argument, so the consumer decides what each segment does. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `(event: MouseEvent, item: SplitButtonItem \| null)` | Fired by the primary command button on activation. `item` is the action currently mirrored on the primary segment when `updateLabelOnSelect` is on, otherwise `null`. Never fires while `disabled` or `loading`. |
| `item-click` | `(event: MouseEvent \| KeyboardEvent, item: SplitButtonItem)` | Fired when a menu action is selected. `event` is the pointer/keyboard event that activated the option; `item` is the matched `model` entry. The menu cannot open while `disabled` or `loading`, so it never fires in those states. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`
- `data-kind` mirrors the `kind` prop
- `data-size` mirrors the `size` prop
- `data-disabled` mirrors the `disabled` prop
- `data-loading` mirrors the `loading` prop
- `data-state` on the menu toggle: `open` | `closed` (provided by the composed `DropdownMenu.Trigger`)
- When `loading`, the control takes the disabled status: the primary button shows the spinner over the disabled tokens and blocks activation (owned by `Button`), the menu toggle is natively disabled with the disabled tokens, and the composed `DropdownMenu` is disabled so the menu cannot open. No `click` or `item-click` is emitted while loading.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on both segments; the focused segment raises its z-index so the ring is not clipped by its neighbor.
- Keyboard map: `Tab` focuses each segment; `Enter`/`Space` activates the primary button; on the toggle `Enter`/`Space`/`Down` open the menu, arrows navigate items, `Esc` closes and returns focus to the toggle (behavior owned by `DropdownMenu`).
- ARIA: the primary button is a native `button`; the toggle exposes `aria-haspopup="menu"`, `aria-expanded`, and `aria-controls` via `DropdownMenu.Trigger` and carries an `aria-label`; the chevron icon is `aria-hidden`; `aria-busy` reflects the loading state. While `loading`, the toggle is a natively disabled button, so the menu cannot be opened by pointer or keyboard and assistive tech perceives the whole control as non-interactive.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px at the large size.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: each menu item's directional `icon` mirrors (`directionalIconClass`); the caret toggle points down and does not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'pi pi-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'pi pi-copy' },
    { label: 'Delete', value: 'delete', icon: 'pi pi-trash', disabled: true }
  ]
</script>

<template>
  <SplitButton
    kind="primary"
    size="large"
    label="Save"
    icon="pi pi-check"
    :model="items"
  />
</template>
```

### Types

```vue
<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'pi pi-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'pi pi-copy' },
    { label: 'Delete', value: 'delete', icon: 'pi pi-trash', disabled: true }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SplitButton
      kind="primary"
      label="Primary"
      :model="items"
    />
    <SplitButton
      kind="secondary"
      label="Secondary"
      :model="items"
    />
    <SplitButton
      kind="outlined"
      label="Outlined"
      :model="items"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import SplitButton from '@aziontech/webkit/split-button'

  const items = [
    { label: 'Update', value: 'update', icon: 'pi pi-refresh' },
    { label: 'Duplicate', value: 'duplicate', icon: 'pi pi-copy' },
    { label: 'Delete', value: 'delete', icon: 'pi pi-trash', disabled: true }
  ]
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <SplitButton
      size="small"
      label="Small"
      :model="items"
    />
    <SplitButton
      size="medium"
      label="Medium"
      :model="items"
    />
    <SplitButton
      size="large"
      label="Large"
      :model="items"
    />
  </div>
</template>
```
