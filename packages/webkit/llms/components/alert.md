# Alert

> Use Alert for a persistent message on a console page or section (info, warning, error) — the answer for 'banner' or 'notice'. A short confirmation after an action that disappears on its own is a Toast. Inline feedback banner that communicates status, alerts, or progress. Presents a severity-colored surface with a leading icon, an optional bold `title` over the copy, and message copy that may carry inline links, plus an optional secondary action button.

- Import: `import Alert from '@aziontech/webkit/alert'`
- Category: feedback · Surface: app · Structure: monolithic
- API as JSON: [alert.json](alert.json)

## When to use

- A status, warning or error that belongs to a page, section or form and should stay visible in context.
- A notice with an inline link, or with one follow-up action (`actionLabel` or the `actions` slot).
- A notice that needs a short headline and a sentence of detail (`title` over the copy): "Maintenance scheduled" over the window and what changes.

## Do

- Pick `severity` by meaning. `danger` and `warning` render with `role="alert"`.
- Use `label` for plain copy and the default slot when the copy needs inline links; each link is a `Link` with `inline`.
- Set `title` when the alert says two things: what happened (the title, a few words, no end period) and what it means or what to do (the copy). A one-sentence alert needs no title. A title alone, with no copy, is allowed for a short notice that still wants the heading weight.
- Use either the built-in action (`actionLabel` with `@action`) or the `actions` slot, not both. The slot replaces the button.
- The `life` timer pauses while the pointer is over the alert or focus is inside it, and resumes with the time left when both leave, so the alert never disappears while it is being read or used. Keep `life` for `info` and `success` status messages.
- Once `closable` or `life` dismisses the message, it stays hidden until it is remounted. Listen to `close` to keep your own state in sync.
- Use `size="small"` inside dense surfaces such as cards and drawers.

## Don’t

- A transient confirmation of an action → use `toast`.
- Validation feedback under one form field → use `field-error`.
- An admonition inside documentation prose → use `doc-callout`.
- A promotional band between page sections → use `call-to-action` with `variant="announcement"`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [toast](toast.md) — overlay stack raised imperatively, auto-dismissing and not anchored to content.
- `field-error` — field-level guidance and errors below an input.
- [doc-callout](doc-callout.md) — docs admonition rendered on the `Alert` surface.
- [empty-state](empty-state.md) — a full zero-data block, not a status banner.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `severity` | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` | false | Visual severity variant. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token. Drives the banner height, inline padding, copy scale, and the trailing control sizes. |
| `label` | `string` | `''` | false | Fallback message copy when the default slot is empty. |
| `title` | `string` | `''` | false | Bold heading above the message copy; hidden when empty. |
| `icon` | `string` | `''` | false | Azion icon class override for the leading icon. |
| `actionLabel` | `string` | `''` | false | Label for the built-in secondary action button; hidden when empty. |
| `closable` | `boolean` | `false` | false | When true, shows a close control that dismisses the message. |
| `life` | `number` | `0` | false | Duration in milliseconds before auto-dismiss; `0` disables auto-dismiss. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `action` | `MouseEvent` | Emitted when the built-in action button is clicked. |
| `close` | `(event: Event)` | Emitted when the message is dismissed, after the fade. Carries the originating event: the close button's `MouseEvent`, the `Escape` `KeyboardEvent`, or an `Event` of type `timeout` after `life` expires. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `actions` | — | Custom action control; replaces the built-in Button when provided. |
| `default` | — | Alert copy. Inline content — plain text plus anchors, which the message region styles with the `.text-link` token — or flow content such as paragraphs and a list. The copy region is a flow container (a `div`, not a `p`), so block markup arriving from a server render stays inside it instead of being closed out beside the copy. Falls back to `label` when empty. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: default (per severity)
- `data-titled` on the root mirrors a non-empty `title`: the title renders above the copy in `.text-title-sm` (`__title`), and the copy keeps its size below it. With a title and no copy (no default slot, empty `label`), only the title renders.
- Responsive: the root is the `@container/alert`. Below `@sm` of its box the action (built-in or the `actions` slot, wrapped in `[data-slot=alert-actions]`) moves to its own line under the message while the close button stays on the message line.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses inline links in the message copy, then the action and close controls when present; `Enter` follows a link, `Enter`/`Space` activates the controls; `Escape` dismisses when `closable` is true.
- ARIA: root uses `role="alert"` for danger/warning severities and `role="status"` for info/success. The title is text inside the live region, read before the copy; it is not a document heading, so it does not enter the page outline.
- Inline links are underlined, not colour-only, so they stay distinguishable against every severity surface (WCAG 1.4.1); the `.text-link` token supplies the focus outline.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on the dismiss fade; nothing sets the transition inline.
- Touch target ≥40×40 px where the control is interactive.

## Right-to-left

- Layout: logical utilities only (`pe-`, `gap`, flex order), so the icon leads and the controls trail under `dir="rtl"`.
- Icons: severity glyphs and the close `×` are not mirrored.
- Keyboard: no horizontal arrow-key logic.
- User data: none.

## Internationalization

| Key           | English source  | Override prop |
| ------------- | --------------- | ------------- |
| `alert.close` | `Close message` | —             |

- Formatting: none; `title`, `label` and the slot copy come from the consumer.

## Responsive

- Container queries: the root is `@container/alert`; below `@sm` the action moves to its own line under the message.
- Narrow (≤ 640 px or a narrow container): the title and copy wrap; the close button stays on the first line.
- Touch: the action and close take Button / IconButton sizes (28 or 32 px); no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; long words break (`break-words`).

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
    action-label="View workload"
  />
</template>
```

### Severities

```vue
<script setup>
  import Alert from '@aziontech/webkit/alert'
</script>

<template>
  <div class="flex w-full flex-col gap-(--spacing-md)">
    <Alert
      severity="info"
      label="Your workload finished deploying in 42 seconds."
      action-label="View workload"
    />
    <Alert
      severity="success"
      label="The certificate was issued and is now serving traffic."
      action-label="View certificate"
    />
    <Alert
      severity="warning"
      label="This edge function is close to its execution time limit."
      action-label="View limits"
    />
    <Alert
      severity="danger"
      label="The last deploy failed before reaching the edge."
      action-label="View logs"
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
  <div class="flex w-full flex-col gap-(--spacing-md)">
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
