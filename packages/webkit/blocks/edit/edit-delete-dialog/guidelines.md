# Delete with confirmation

The last stop before a resource is gone for good. The user chose Delete from a row menu or a settings page and now has to see what goes with the resource, take one deliberate step to prove they mean this one, and either confirm or back out. The dialog makes the irreversible action slow on purpose: Delete stays disabled until the typed name matches. SettingsRow draws the page it is opened from as a page body for `ConsoleLayout` (the layout owns the rail, the header and the `main`).

## When to use

- Use edit-delete-dialog when the user deletes a resource from the UI and must type its name.
- Any permanent delete of a resource, a folder of files or a record, opened from the row Delete action of `view/view-table`, `view/view-file-browser` or `detail/detail-dns-zone`.
- The resource takes other things with it (settings, instances, files) and the user must read that before confirming.
- A delete that lives in a settings page as its own row (the danger zone): use the SettingsRow variant, a labelled field inside the same medium `ConfirmDialog` opened from an outlined `Item`.

## When not to use

- Detaching a reference while the object survives: that is Remove, a plain action with an undo toast, not this dialog.
- A reversible change such as disabling or archiving: save it through `settings/settings-form` or `edit/edit-resource`.
- A plain yes-or-no decision with nothing to type: use `ConfirmDialog` with its actions only, without the typed name.
- A long-running delete that reports back later (a purge, a teardown): the submit lifecycle is `state/state-async-submit`.

## Building blocks

### A. Dialog and trigger — `ConfirmDialog`, `Button` (required)

`ConfirmDialog` at `size="medium"`, bound with `v-model:open`, closed by default. Its `#trigger` slot holds the visible `Button variant="danger"` that opens it; in a list the trigger is the row menu's Delete option instead. The title reads Delete plus the resource kind, the same string as the trigger. The body goes in the default slot; the dialog's own Cancel and Delete buttons take `confirm-label`, `cancel-label`, `:disabled` and `:loading`.

### B. Consequence — `Alert` (required)

A `severity="warning"` `Alert` first in the body states that the action cannot be reversed. Below it, one muted sentence names what goes with the resource and links the Help Center with the `text-link` utility. When the server refuses the delete, the same slot shows a `severity="danger"` `Alert` that says what blocks it and how to fix it. A container that holds other items (a folder, a database) passes its own consequence sentence instead of the generic one.

### C. Name and copy — `CopyButton` (required)

The prompt "Type … to confirm." shows the resource name in `text-label-code-sm` with a `CopyButton` beside it (`aria-label` "Copy resource-01", `copied-label` "Copied"), so the user can paste the exact name.

### D. Typed confirmation — `Input` (required)

A full-width `Input` with `autocomplete="off"`, labelled by the prompt paragraph through `aria-labelledby`. The value is compared trimmed and must match the name exactly. Enter confirms only when it matches. The input and the error reset each time the dialog opens, never as it closes, so the content stays put during the exit motion.

### E. Trigger — `Button` (required)

The visible `variant="danger"` trigger in `#trigger`. The dialog's own footer carries Cancel and `variant="danger"` Delete resource (the title repeated), `:disabled` until the typed name matches and `:loading` while the request runs; while it loads Cancel and the input are disabled and the dialog cannot be dismissed. On success the dialog closes and a toast says `resource-01 was deleted.`

## Data

The block takes the resource name and the request state through props and emits the delete; it fetches nothing. `DeleteDialogProps` is exported from `edit-delete-dialog.vue`, and `sample.ts` holds the sample name the block shows when `name` is left out.

| Prop                  | Type      | What it does                                                                                                                            |
| --------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                | `string`  | The resource to delete; the user types it to confirm.                                                                                   |
| `loading`             | `boolean` | The delete is in flight: Delete spins, Cancel and the input lock. When it ends with no error, the dialog closes with the success toast. |
| `error`               | `string`  | Why the server refused the delete, shown in the danger `Alert` in place of the warning; the dialog stays open.                          |
| `defaultConfirmation` | `string`  | The text the input opens with.                                                                                                          |
| `defaultOpen`         | `boolean` | Whether the dialog starts open when `v-model:open` is not bound.                                                                        |
| `v-model:open`        | `boolean` | Whether the dialog is open.                                                                                                             |

| Event    | Payload         | When                                                           |
| -------- | --------------- | -------------------------------------------------------------- |
| `delete` | `(event, name)` | Delete resource, or Enter in the input, once the name matches. |

To go live, render the block from a page that owns the request:

```vue
<script setup lang="ts">
  import EditDeleteDialog from './edit-delete-dialog.vue'

  const { run, pending, error } = useDeleteResource()
</script>

<template>
  <EditDeleteDialog
    :name="resource.name"
    :loading="pending"
    :error="error?.message ?? ''"
    @delete="(event, name) => run(name)"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Name the resource kind in the title and the resource itself in the chip, so the user knows exactly what goes.
- Keep the confirm button disabled until the trimmed value equals the name; that is the prevention, not a toast after the fact.
- Reset the typed value each time the dialog opens.
- Let the user copy the name from the chip; never block paste in the input.
- Put the consequence in the `Alert` and the sentence below it, before the input that asks for the decision.
- Use the SettingsRow variant on a settings page, so the confirmation is a real labelled `Field`.

## Don't

- Don't delete on the first click, from a row menu or anywhere else.
- Don't enable Delete on a partial or case-insensitive match.
- Don't put the warning in the input's label or placeholder.
- Don't make Delete the only button, or use primary for it; it is `variant="danger"` beside Cancel.
- Don't close the dialog on a refused delete or clear the typed name; show why in the danger `Alert` and let Delete run again.
- Don't clear the input as the dialog closes; the field would flash empty during the exit.

## Copy

- **Title:** Delete plus the resource kind, in sentence case, e.g. "Delete workload"; the visible trigger and the confirm button repeat it.
- **Trigger:** verb and object, e.g. "Delete resource" on a visible button; "Delete" in a row menu.
- **Alert:** one fact, e.g. "Once confirmed, this action can't be reversed."
- **Consequence:** one sentence naming what goes with it, e.g. "The selected bucket will be deleted, along with all its files."
- **Prompt:** "Type" before the name chip and "to confirm." after it; never a position such as "in the box below".
- **Confirm:** the title's verb and object, e.g. "Delete resource"; never "OK", "Confirm" or "Yes".
- **Cancel:** exactly "Cancel".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- `ConfirmDialog` traps focus, closes on Escape and returns focus to the trigger.
- The input is named by the prompt paragraph through `aria-labelledby`, so a screen reader hears the name to type.
- The `CopyButton` is named "Copy resource-01" and announces "Copied" once it copies.
- Enter in the input confirms only when the name matches; otherwise focus moves on to Cancel and Delete in reading order.
- In the SettingsRow variant the `Field` label carries the prompt, so the name to type is part of the input's accessible name.
- While the delete runs, the confirm button announces its busy state and the dialog stays open.

## States

- Default: the danger trigger is visible (`v-model:open` false); opening it shows the warning, the name chip and the empty input with Delete resource disabled.
- SettingsRow: the settings-page danger zone; an outlined `Item` row opens the medium `ConfirmDialog` asking for the name through a labelled `Field`, with Delete resource disabled until it matches and loading while it runs.
- Error: `error` set with `defaultOpen` and `defaultConfirmation`: the server refuses the delete (the resource is still used by two workloads); the dialog stays open with the typed name, a danger `Alert` says why, and Delete can run again.

## Related

- `view/view-table` — the row menu Delete that opens this dialog.
- `view/view-file-browser` — Delete on a file or folder row.
- `detail/detail-dns-zone` — Delete on a record of a resource.
- `settings/settings-form` — where the SettingsRow variant sits.
- `state/state-async-submit` — a long-running request that reports back later.
- `ConfirmDialog` — the dialog this block fills; see `skills/webkit-form` for the Dialog form type.
