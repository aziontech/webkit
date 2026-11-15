# DeleteWithConfirmation (`platform/delete/delete-with-confirmation`)

> The destructive confirmation a resource list uses for Delete: a warning `Alert`, a sentence naming what goes with the resource and a Help Center link, then a prompt that shows the resource name in code type with a `CopyButton` beside it and an input the user must match before Delete enables. Every resource list, a folder of files and a table of records open it from the row Delete action; the title reads Delete plus the resource kind, and a container that holds other items passes its own consequence sentence. Delete shows its loading state while the request runs (Cancel and the input are locked, the dialog cannot be dismissed), then closes with a success toast; a refused delete keeps the dialog and the typed name and swaps the warning for a danger `Alert` saying why (Failed). The typed confirmation resets each time the dialog opens, so the content stays put while it closes. Built from `ConfirmDialog` (the body in its default slot, its own Cancel and Delete buttons with `loading` and `disabled`), `Alert`, `CopyButton`, `Input` and `Button`; closed by default behind a visible danger trigger. The LabelledField variant is the settings-page delete: an outlined `Item` row opens the same `ConfirmDialog` with a labelled `Field` + `Input` in its body.

- Surface: product
- Source: `blocks/platform/delete/delete-with-confirmation/delete-with-confirmation.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/delete/delete-with-confirmation")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [ConfirmDialog](../../../components/confirm-dialog.md), [CopyButton](../../../components/copy-button.md), [Field](../../../components/field.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [PageHeader](../../../components/page-header.md), [Toast](../../../components/toast.md)
- Skills: `webkit-ux-heuristics`, `webkit-microcopy`, `webkit-form`, `webkit-errors`

## Asked as

delete; delete dialog; delete confirmation; delete resource; type to confirm; destructive confirmation; remove resource; excluir; confirmar exclusão; excluir recurso; apagar; delete with confirmation; excluir com confirmação; form in modal; dialog form; modal form; blocking decision; type name to delete; confirm in dialog; formulário em modal; formulário no diálogo; modal com formulário; type the name to delete; confirm deletion by name

The last stop before a resource is gone for good. The user chose Delete from a row menu or a settings page and now has to see what goes with the resource, take one deliberate step to prove they mean this one, and either confirm or back out. The dialog makes the irreversible action slow on purpose: Delete stays disabled until the typed name matches. LabelledField draws the page it is opened from as a page body for `ConsoleLayout` (the layout owns the rail, the header and the `main`).

## When to use

- Use delete-with-confirmation when the user deletes a resource from the UI and must type its name.
- Any permanent delete of a resource, a folder of files or a record, opened from the row Delete action of `platform/view/table-view`, `platform/view/file-browser` or `platform/detail/record-table`.
- The resource takes other things with it (settings, instances, files) and the user must read that before confirming.
- A delete that lives in a settings page as its own row (the danger zone): use the LabelledField variant, a labelled field inside the same medium `ConfirmDialog` opened from an outlined `Item`.

## When not to use

- Detaching a reference while the object survives: that is Remove, a plain action with an undo toast, not this dialog.
- A reversible change such as disabling or archiving: save it through `platform/settings/settings-form` or `platform/edit/edit-resource`.
- A plain yes-or-no decision with nothing to type: use `ConfirmDialog` with its actions only, without the typed name.
- A long-running delete that reports back later (a purge, a teardown): the submit lifecycle is `platform/states/async-submit`.

## Building blocks

### A. Dialog and trigger — `ConfirmDialog`, `Button` (required)

`ConfirmDialog` at `size="medium"`, bound with `v-model:open`, closed by default. Its `#trigger` slot holds the visible `Button kind="danger"` that opens it; in a list the trigger is the row menu's Delete option instead. The title reads Delete plus the resource kind, the same string as the trigger. The body goes in the default slot; the dialog's own Cancel and Delete buttons take `confirm-label`, `cancel-label`, `:disabled` and `:loading`.

### B. Consequence — `Alert` (required)

A `severity="warning"` `Alert` first in the body states that the action cannot be reversed. Below it, one muted sentence names what goes with the resource and links the Help Center with the `text-link` utility. When the server refuses the delete, the same slot shows a `severity="danger"` `Alert` that says what blocks it and how to fix it. A container that holds other items (a folder, a database) passes its own consequence sentence instead of the generic one.

### C. Name and copy — `CopyButton` (required)

The prompt "Type … to confirm." shows the resource name in `text-label-code-sm` with a `CopyButton` beside it (`aria-label` "Copy resource-01", `copied-label` "Copied"), so the user can paste the exact name.

### D. Typed confirmation — `Input` (required)

A full-width `Input` with `autocomplete="off"`, labelled by the prompt paragraph through `aria-labelledby`. The value is compared trimmed and must match the name exactly. Enter confirms only when it matches. The input and the error reset each time the dialog opens, never as it closes, so the content stays put during the exit motion.

### E. Trigger — `Button` (required)

The visible `kind="danger"` trigger in `#trigger`. The dialog's own footer carries Cancel and `kind="danger"` Delete resource (the title repeated), `:disabled` until the typed name matches and `:loading` while the request runs; while it loads Cancel and the input are disabled and the dialog cannot be dismissed. On success the dialog closes and a toast says `resource-01 was deleted.`

## Do

- Name the resource kind in the title and the resource itself in the chip, so the user knows exactly what goes.
- Keep the confirm button disabled until the trimmed value equals the name; that is the prevention, not a toast after the fact.
- Reset the typed value each time the dialog opens.
- Let the user copy the name from the chip; never block paste in the input.
- Put the consequence in the `Alert` and the sentence below it, before the input that asks for the decision.
- Use the LabelledField variant on a settings page, so the confirmation is a real labelled `Field`.

## Don't

- Don't delete on the first click, from a row menu or anywhere else.
- Don't enable Delete on a partial or case-insensitive match.
- Don't put the warning in the input's label or placeholder.
- Don't make Delete the only button, or use primary for it; it is `kind="danger"` beside Cancel.
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
- In the LabelledField variant the `Field` label carries the prompt, so the name to type is part of the input's accessible name.
- While the delete runs, the confirm button announces its busy state and the dialog stays open.

## States

- Default: the danger trigger is visible; opening it shows the warning, the name chip and the empty input with Delete resource disabled.
- LabelledField: the settings-page danger zone; an outlined `Item` row opens the medium `ConfirmDialog` asking for the name through a labelled `Field`, with Delete resource disabled until it matches and loading while it runs.
- Failed: the server refuses the delete (the resource is still used by two workloads); the dialog stays open with the typed name, a danger `Alert` says why, and Delete can run again.

## Related

- `platform/view/table-view` — the row menu Delete that opens this dialog.
- `platform/view/file-browser` — Delete on a file or folder row.
- `platform/detail/record-table` — Delete on a record of a resource.
- `platform/settings/settings-form` — where the LabelledField variant sits.
- `platform/states/async-submit` — a long-running request that reports back later.
- `ConfirmDialog` — the dialog this block fills; see `skills/webkit-form` for the Dialog form type.

## Variants

- `Default` — primary (the code below)
- `LabelledField` — The danger-zone delete of a settings page: an outlined `Item` row under the page's `PageHeader` names what the delete removes and holds the danger trigger, and the medium `ConfirmDialog` it opens stacks a warning `Alert` (with the Help Center link) over a labelled `Field` + `Input` asking for the exact resource name, with Delete disabled until the typed name matches and loading while it runs. The field clears every time the dialog opens. Built from `PageHeader`, `Item`, `ConfirmDialog`, `Alert`, `Field`, `Input` and `Button`. The page is a page body for ConsoleLayout.
- `Failed` — A delete the server refuses (the resource is still in use): the dialog stays open with the typed name kept, the warning gives way to a danger `Alert` saying what blocks the delete and how to fix it, and Delete can run again.

Each variant is the same screen in another state: `get_pattern("platform/delete/delete-with-confirmation", { variant })`, or the file under `blocks/platform/delete/delete-with-confirmation/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Input from '@aziontech/webkit/input'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onScopeDispose, ref, useId, watch } from 'vue'

  const name = 'resource-01'
  const inUseError = `${name} is still used by 2 workloads. Remove it from them and try again.`
  const failing = false

  const open = ref(false)
  const confirmation = ref('')
  const deleting = ref(false)
  const deleteError = ref('')
  const confirmLabelId = useId()
  let deleteTimer: ReturnType<typeof setTimeout> | undefined

  onScopeDispose(() => clearTimeout(deleteTimer))

  const canDelete = computed(
    () => confirmation.value.trim().length > 0 && confirmation.value.trim() === name
  )

  watch(open, (isOpen) => {
    if (!isOpen) return
    confirmation.value = ''
    deleteError.value = ''
  })

  const confirm = () => {
    if (!canDelete.value || deleting.value) return
    deleting.value = true
    deleteError.value = ''
    clearTimeout(deleteTimer)
    deleteTimer = setTimeout(() => {
      deleting.value = false
      if (failing) {
        deleteError.value = inUseError
        return
      }
      open.value = false
      toast.success(`${name} was deleted.`, { id: 'delete-resource-result' })
    }, 600)
  }
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Delete resource"
    size="medium"
    confirm-label="Delete resource"
    cancel-label="Cancel"
    :loading="deleting"
    :disabled="!canDelete"
    @confirm="confirm"
  >
    <template #trigger>
      <Button
        label="Delete resource"
        kind="danger"
        size="medium"
      />
    </template>
    <div class="flex flex-col gap-(--spacing-md)">
      <Alert
        v-if="deleteError"
        key="delete-error"
        severity="danger"
        :label="deleteError"
      />
      <Alert
        v-else
        key="delete-warning"
        severity="warning"
        label="Once confirmed, this action can't be reversed."
      />
      <p class="m-0 text-body-sm text-(--text-muted)">
        The selected resource will be deleted, along with all associated settings or instances.
        Check the
        <a
          href="https://example.com/docs"
          class="text-link"
          >Help Center</a
        >
        for more details.
      </p>
      <p
        :id="confirmLabelId"
        class="m-0 flex flex-wrap items-center gap-(--spacing-xxs) text-body-sm text-(--text-default)"
      >
        <span>Type</span>
        <span class="text-label-code-sm text-(--text-default)">{{ name }}</span>
        <CopyButton
          :value="name"
          :aria-label="`Copy ${name}`"
          copied-label="Copied"
          size="small"
        />
        <span>to confirm.</span>
      </p>
      <Input
        v-model="confirmation"
        :aria-labelledby="confirmLabelId"
        autocomplete="off"
        class="w-full"
        :disabled="deleting"
        @keydown.enter="confirm"
      />
    </div>
  </ConfirmDialog>
</template>
```
