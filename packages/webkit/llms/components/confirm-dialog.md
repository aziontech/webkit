# Confirm Dialog

> A small confirmation dialog: a title with a close button, one sentence of description, and a Cancel plus a confirm button whose `kind` says how destructive the outcome is (`danger` for a removal or a discard, `primary` for a commit). The unsaved-changes guard uses the same shell; the `actions` slot replaces the two buttons when the guard can also save. Built from `Dialog`, `Panel` parts and `Button`.

- Import: `import ConfirmDialog from '@aziontech/webkit/confirm-dialog'`
- Category: overlay · Surface: product · Structure: monolithic
- API as JSON: [confirm-dialog.json](https://github.com/aziontech/webkit/blob/main/.specs/confirm-dialog.json)

## When to use

- Before a removal (Remove domain, Delete resource) or a re-run (Clear again).
- When someone leaves a form with unsaved changes.
- A deletion that needs typed confirmation: put the field in the default slot and set `disabled` until it matches.

## Do

- The confirm label repeats the verb of the title (Remove Domain, Discard changes), never OK or Yes.
- kind="danger"` only when the outcome removes or discards something; a commit is `primary`.
- Close the dialog from `@confirm` once the action has run; keep it open with `loading` while it runs.
- Below `md` the buttons stack full width with the confirm button on top, the same order as `save-bar`.

## Don’t

- A form of several fields → use `dialog` with your own body.
- A non-blocking notice → use `toast` or `alert`.
- A settings save that needs no decision → use `save-bar`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [dialog](dialog.md) — the overlay it composes; use it directly for anything that is not a yes-or-no decision.
- [button](button.md) — the trigger and the actions.
- [save-bar](save-bar.md) — the unsaved-changes bar this dialog guards.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The question or the outcome, as the dialog title. |
| `description` | `string` | `''` | false | One sentence that says what happens on confirm. |
| `confirmLabel` | `string` | `''` | false | Label of the confirm button. Empty uses the locale catalog (`Confirm`). |
| `cancelLabel` | `string` | `''` | false | Label of the cancel button. Empty uses the locale catalog (`Cancel`). |
| `kind` | `'danger' \| 'primary'` | `'danger'` | false | Kind of the confirm button. |
| `size` | `'small' \| 'medium'` | `'small'` | false | Width of the dialog. |
| `loading` | `boolean` | `false` | false | Shows a spinner on the confirm button while the action runs; Cancel, the close button, `Esc` and the overlay stop closing the dialog until it clears. |
| `disabled` | `boolean` | `false` | false | Disables the confirm button, for a confirmation that needs input first. |
| `open` | `boolean` | `false` | false | Two-way value (`v-model:open`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `confirm` | `(event: MouseEvent)` | The confirm button was activated; not emitted while `disabled` or `loading`. |
| `cancel` | `(event: MouseEvent)` | The cancel button was activated; the dialog closes. Not emitted while `loading`. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `trigger` | — | The control that opens the dialog. |
| `default` | — | Body content under the description: a field, an alert. |
| `actions` | { close: () => void } | Replaces the Cancel and confirm buttons; receives a close function. |

## v-model

- **`v-model:open`** — `boolean`, default `false`. Whether the dialog is open; the trigger, the close button, `Esc` and Cancel update it. While `loading`, only the consumer closes it (set `open` to `false` from `@confirm` once the action settles).

## States

- Visual states: `closed`, `open`
- `data-state` on the root: `open` | `closed` (from `dialog`)

## Accessibility

- Visible focus: owned by the buttons and `dialog`.
- Keyboard map: `Esc` closes; `Tab` is trapped in the dialog and focus returns to the trigger on close (from `dialog`).
- ARIA: the dialog is named by its title and described by its description (`DialogTitle`, `DialogDescription`).
- Contrast ≥4.5:1, owned by the composed parts.

## Examples

### Confirm

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Remove domain"
    description="shop.example.com stops answering for this resource once you save. Traffic already pointed at it gets no response."
    confirm-label="Remove Domain"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Remove domain"
        kind="outlined"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
```

### DiscardChanges

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Unsaved changes"
    description="This page has changes you haven't saved. If you leave now, they're discarded."
    cancel-label="Keep editing"
    confirm-label="Discard changes"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Leave page"
        kind="outlined"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
```

### RunAgain

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Clear cached content again?"
    description="This clears the same 2 URLs from the Edge cache again. Each object is fetched from your origin on its next request."
    confirm-label="Clear again"
    kind="primary"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Run again"
        kind="outlined"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
```
