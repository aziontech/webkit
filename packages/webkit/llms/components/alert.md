# Alert

> Inline feedback banner that communicates status, alerts, or progress. Presents a severity-colored surface with a leading icon and a single line of message copy that may carry inline links, plus an optional secondary action button.

- Import: `import Alert from '@aziontech/webkit/alert'`
- Category: feedback · Surface: product · Structure: monolithic
- API as JSON: [alert.json](https://github.com/aziontech/webkit/blob/main/.specs/alert.json)

## When to use

- A status, warning or error that belongs to a page, section or form and should stay visible in context.
- A notice with an inline link, or with one follow-up action (`actionLabel` or the `action` slot).

## Do

- Pick `severity` by meaning. `danger` and `warning` render with `role="alert"`.
- Use `label` for plain copy and the default slot when the copy needs inline links.
- Use either the built-in action (`actionLabel` with `@action`) or the `action` slot, not both. The slot replaces the button.
- Once `closable` or `life` dismisses the message, it stays hidden until it is remounted. Listen to `close` to keep your own state in sync.
- Use `size="small"` inside dense surfaces such as cards and drawers.

## Don’t

- A transient confirmation of an action → use `toast`.
- Validation feedback under one form field → use `helper-text`.
- An admonition inside documentation prose → use `doc-callout`.
- A promotional band between page sections → use `banner`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [toast](toast.md) — overlay stack raised imperatively, auto-dismissing and not anchored to content.
- [helper-text](helper-text.md) — field-level guidance and errors below an input.
- [doc-callout](doc-callout.md) — docs admonition rendered on the `Alert` surface.
- [empty-state](empty-state.md) — a full zero-data block, not a status banner.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `severity` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | false | Visual severity variant. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token. Drives the banner height, inline padding, copy scale, and the trailing control sizes. |
| `label` | `string` | `''` | false | Fallback message copy when the default slot is empty. |
| `icon` | `string` | `''` | false | PrimeIcons class override for the leading icon. |
| `actionLabel` | `string` | `''` | false | Label for the built-in secondary action button; hidden when empty. |
| `closable` | `boolean` | `false` | false | When true, shows a close control that dismisses the message. |
| `life` | `number` | `0` | false | Duration in milliseconds before auto-dismiss; `0` disables auto-dismiss. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `action` | `MouseEvent` | Emitted when the built-in action button is clicked. |
| `close` | `void` | Emitted when the message is dismissed manually or after `life` expires. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `action` | — | Custom action control; replaces the built-in Button when provided. |
| `default` | — | Alert copy. Inline content — plain text plus anchors, which the message region styles with the `.text-link` token — or flow content such as paragraphs and a list. The copy region is a flow container (a `div`, not a `p`), so block markup arriving from a server render stays inside it instead of being closed out beside the copy. Falls back to `label` when empty. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: default (per severity)
- Responsive: the root is the `@container/alert`. Below `@sm` of its box the action (built-in or the `action` slot, wrapped in `[data-slot=alert-action]`) moves to its own line under the message while the close button stays on the message line.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses inline links in the message copy, then the action and close controls when present; `Enter` follows a link, `Enter`/`Space` activates the controls; `Escape` dismisses when `closable` is true.
- ARIA: root uses `role="alert"` for danger/warning severities and `role="status"` for info/success.
- Inline links are underlined, not colour-only, so they stay distinguishable against every severity surface (WCAG 1.4.1); the `.text-link` token supplies the focus outline.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.

## Examples

### Default

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <Alert
    severity="info"
    label="Your workload finished deploying in 42 seconds."
    action-label="Label"
  />
</template>
```

### Types

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Alert
      severity="info"
      label="Your workload finished deploying in 42 seconds."
      action-label="Label"
    />
    <Alert
      severity="success"
      label="The certificate was issued and is now serving traffic."
      action-label="Label"
    />
    <Alert
      severity="warning"
      label="This edge function is close to its execution time limit."
      action-label="Label"
    />
    <Alert
      severity="danger"
      label="The last deploy failed before reaching the edge."
      action-label="Label"
    />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <Alert
      severity="info"
      size="small"
      label="A small note."
    />
    <Alert
      severity="info"
      size="medium"
      label="A medium note."
    />
  </div>
</template>
```
