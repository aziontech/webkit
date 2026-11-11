# Copy Button

> Icon-only control that copies a string to the clipboard and briefly confirms success. Composes `IconButton` for visuals and interaction tokens, and `Tooltip` for its name: an icon-only button is silent to a pointer user until hovered, so the glyph is always labelled on hover/focus. The tooltip text is the same string as the accessible name — `ariaLabel` while idle, `copiedLabel` for the two seconds after a write — so the confirmation is seen as well as announced. It is suppressed with `disabled`.

- Import: `import CopyButton from '@aziontech/webkit/copy-button'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [copy-button.json](https://github.com/aziontech/webkit/blob/main/.specs/copy-button.json)

## When to use

- Next to a value the user will paste elsewhere: an ID, a domain, a token, a CLI command.
- Inside key/value rows, terminal mocks and code samples that need a one-click copy.

## Do

- Pass the exact text in `value`; an empty `value` makes the click a no-op.
- Localize `ariaLabel` and `copiedLabel`: each is both the accessible name and the tooltip text.
- Listen to `copy` for analytics or a toast; it fires only after the clipboard write succeeds.
- The click stops propagation, so it is safe inside clickable rows and cards.
- Keep the `transparent` / `small` defaults in dense rows.

## Don’t

- The action is anything other than copying → use `icon-button`.
- A labelled "Copy" action in a form or dialog footer → use `button`.
- A full code sample with its own copy control → use `code-block`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [icon-button](icon-button.md) — the control it composes; `kind` and `size` are forwarded to it.
- [tooltip](tooltip.md) — composed to show `ariaLabel` and then `copiedLabel` on hover and focus.
- [code-block](code-block.md) — already embeds a copy-button for its content.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `—` | true | Text copied to the clipboard on activation. |
| `ariaLabel` | `string` | `''` | false | Accessible name while idle. Empty uses the locale catalog (`Copy`). |
| `copiedLabel` | `string` | `''` | false | Accessible name while the copied state is shown. Empty uses the locale catalog (`Copied`). |
| `kind` | `'primary' \| 'secondary' \| 'outlined' \| 'transparent' \| 'danger'` | `'transparent'` | false | Visual variant forwarded to `IconButton`. |
| `size` | `'small' \| 'medium' \| 'large'` | `'small'` | false | Size token forwarded to `IconButton`. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `string` | Emitted after a successful clipboard write with the copied value. |

## States

- Visual states: `default`, `copied`, `disabled`
- `data-state` mirrors `default` or `copied`
- `data-disabled` mirrors the `disabled` prop
- The composed `Tooltip` carries its own `data-state` (`open` | `closed`) and is disabled with the button

## Accessibility

- Visible focus: inherited from `IconButton` (`focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`)
- Keyboard map: `Tab` focuses; `Enter`/`Space` activates copy.
- ARIA: `aria-label` toggles between `ariaLabel` and `copiedLabel` when copied.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

### Default

```vue
<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
</script>

<template>
  <CopyButton
    value="https://example.com/deploy/abc123"
    ariaLabel="Copy URL"
  />
</template>
```

### Disabled

```vue
<script setup>
  import CopyButton from '@aziontech/webkit/copy-button'
</script>

<template>
  <CopyButton
    value="https://example.com/deploy/abc123"
    ariaLabel="Copy URL"
    disabled
  />
</template>
```
