# DeleteWithConfirmation (`platform/delete/delete-with-confirmation`)

> The destructive confirmation a resource list uses for Delete: a warning `Alert`, a sentence naming what goes with the resource and a Help Center link, then a prompt that shows the resource name as a click-to-copy chip and an input the user must match before Delete enables. Every resource list, a folder of files and a table of records open it from the row Delete action; the title reads Delete plus the resource kind, and a container that holds other items passes its own consequence sentence. The typed confirmation and the Copied reveal reset each time the dialog opens, so the content stays put while it closes. Built from `ConfirmDialog` (the body in its default slot, Cancel and Delete in its `actions` slot), `Alert`, `Tooltip`, `Input` and `Button`; closed by default behind a visible danger trigger. The LabelledField variant asks for the name through a labelled `Field` + `Input` inside a medium `Dialog`, opened from an outlined `Item` row on the page, for a delete that sits in a settings form rather than a list.

- Surface: product
- Source: `blocks/platform/delete/delete-with-confirmation/delete-with-confirmation.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/delete/delete-with-confirmation")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [ButtonHighlight](../../../components/button-highlight.md), [Command](../../../components/command.md), [ConfirmDialog](../../../components/confirm-dialog.md), [Dialog](../../../components/dialog.md), `DialogClose`, `DialogContent`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, `DialogTrigger`, [Drawer](../../../components/drawer.md), `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, [DropdownMenu](../../../components/dropdown-menu.md), [Field](../../../components/field.md), [GlobalHeader](../../../components/global-header.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Kbd](../../../components/kbd.md), [Menu](../../../components/menu.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [Sidebar](../../../components/sidebar.md), [StatusIndicator](../../../components/status-indicator.md), [ThemeSwitcher](../../../components/theme-switcher.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-ux-heuristics`, `webkit-microcopy`, `webkit-form`, `webkit-errors`

## Asked as

delete; delete dialog; delete confirmation; delete resource; type to confirm; destructive confirmation; remove resource; excluir; confirmar exclusão; excluir recurso; apagar; delete with confirmation; excluir com confirmação; form in modal; dialog form; modal form; blocking decision; type name to delete; confirm in dialog; formulário em modal; formulário no diálogo; modal com formulário

The last stop before a resource is gone for good. The user chose Delete from a row menu or a settings page and now has to see what goes with the resource, take one deliberate step to prove they mean this one, and either confirm or back out. The dialog makes the irreversible action slow on purpose: Delete stays disabled until the typed name matches.

## When to use

- Any permanent delete of a resource, a folder of files or a record, opened from the row Delete action of `platform/view/table-view`, `platform/view/file-browser` or `platform/detail/record-table`.
- The resource takes other things with it (settings, instances, files) and the user must read that before confirming.
- A delete that lives in a settings page as its own row: use the LabelledField variant, a labelled field inside a medium `Dialog` opened from an outlined `Item`.

## When not to use

- Detaching a reference while the object survives: that is Remove, a plain action with an undo toast, not this dialog.
- A reversible change such as disabling or archiving: save it through `platform/settings/settings-form` or `platform/edit/edit-resource`.
- A plain yes-or-no decision with nothing to type: use `ConfirmDialog` with its actions only, without the typed name.
- A failed or slow delete request: the submit lifecycle is `platform/states/async-submit`.

## Building blocks

### A. Dialog and trigger — `ConfirmDialog`, `Button` (required)

`ConfirmDialog` at `size="medium"`, bound with `v-model:open`, closed by default. Its `#trigger` slot holds the visible `Button kind="danger"` that opens it; in a list the trigger is the row menu's Delete option instead. The title reads Delete plus the resource kind, the same string as the trigger. The body goes in the default slot and the buttons in the `#actions` slot.

### B. Consequence — `Alert` (required)

A `severity="warning"` `Alert` first in the body states that the action cannot be reversed. Below it, one muted sentence names what goes with the resource and links the Help Center. A container that holds other items (a folder, a database) passes its own consequence sentence instead of the generic one.

### C. Name chip — `Tooltip` (required)

The prompt "Type … to confirm." shows the resource name as a click-to-copy chip inside a `Tooltip` reading Copy to clipboard. Clicking copies the name and reveals Copied with a check icon for two seconds. The chip truncates a long name instead of wrapping the dialog wider.

### D. Typed confirmation — `Input` (required)

A full-width `Input` with `autocomplete="off"`, labelled by the prompt paragraph through `aria-labelledby`. The value is compared trimmed and must match the name exactly. Enter confirms only when it matches. The input and the Copied reveal reset each time the dialog opens, never as it closes, so the content stays put during the exit motion.

### E. Actions — `Button` (required)

In the `#actions` slot: an outlined Cancel that calls the slot's `close`, then `kind="danger"` Delete resource, the title repeated, `:disabled` until the typed name matches. Both are medium. In the LabelledField variant the same pair sits in `PanelFooter`, stacked full width on a phone, and Delete takes `:loading` while the request runs.

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
- Don't make Delete the only button, or use primary for it; it is `kind="danger"` beside an outlined Cancel.
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
- The name chip is a real `button` whose `aria-label` switches from "Copy resource-01 to the clipboard" to "Copied resource-01"; its icons carry `aria-hidden="true"`.
- Enter in the input confirms only when the name matches; otherwise focus moves on to Cancel and Delete in reading order.
- In the LabelledField variant the `Field` label carries the prompt, so the name to type is part of the input's accessible name.
- Motion on the Copied reveal is turned off under `prefers-reduced-motion`.

## States

- Default: the danger trigger is visible; opening it shows the warning, the name chip and the empty input with Delete resource disabled.
- LabelledField: an outlined `Item` row on a settings page opens a medium `Dialog` asking for the name through a labelled `Field`, with Delete resource disabled until it matches.

## Related

- `platform/view/table-view` — the row menu Delete that opens this dialog.
- `platform/view/file-browser` — Delete on a file or folder row.
- `platform/detail/record-table` — Delete on a record of a resource.
- `platform/settings/settings-form` — where the LabelledField variant sits.
- `platform/states/async-submit` — the delete request in flight and its failure.
- `ConfirmDialog` — the dialog this block fills; see `skills/webkit-form` for the Dialog form type.

## Variants

- `Default` — primary (the code below)
- `LabelledField` — A short, blocking decision in a modal: an outlined `Item` row on the page names what the delete removes and holds the danger trigger, and the medium dialog it opens stacks a warning `Alert` over a labelled `Field` + `Input` asking for the exact resource name, with Delete disabled until the typed name matches. The field clears every time the dialog opens, so its content stays in place while it closes. It is the form counterpart of the default Delete dialog on the resource lists, which renders the name as a copy chip with a bare input instead of a labelled field. Built from `PageHeader`, the platform shell, `Item`, `Dialog` with its trigger, portal, overlay, content, title and close parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Alert`, `Field`, `Input` and `Button`.

Each variant is the same screen in another state: `get_pattern("platform/delete/delete-with-confirmation", { variant })`, or the file under `blocks/platform/delete/delete-with-confirmation/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Input from '@aziontech/webkit/input'
  import Alert from '@aziontech/webkit/alert'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, useId, watch } from 'vue'

  const open = ref(false)
  const name = 'resource-01'
  const confirmation = ref('')
  const copied = ref(false)
  const confirmLabelId = useId()

  const canDelete = computed(
    () => confirmation.value.trim().length > 0 && confirmation.value.trim() === name.trim()
  )

  watch(open, (isOpen) => {
    if (!isOpen) return
    confirmation.value = ''
    copied.value = false
  })

  const copyName = async () => {
    await navigator.clipboard.writeText(name)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }

  const confirm = () => {
    if (!canDelete.value) return
    open.value = false
  }
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Delete resource"
    size="medium"
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
        severity="warning"
        label="Once confirmed, this action can't be reversed."
      />
      <p class="m-0 text-body-sm text-(--text-muted)">
        The selected resource will be deleted, along with all associated settings or instances.
        Check the
        <a
          href="https://example.com/docs"
          class="rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          >Help Center</a
        >
        for more details.
      </p>
      <p
        :id="confirmLabelId"
        class="m-0 flex flex-wrap items-center gap-(--spacing-xxs) text-body-sm text-(--text-default)"
      >
        <span>Type</span>
        <Tooltip
          text="Copy to clipboard"
          class="max-w-full"
        >
          <button
            type="button"
            class="inline-flex max-w-full cursor-pointer items-center rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-overlay) px-(--spacing-xxs) text-body-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:border-(--border-default) hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
            :aria-label="copied ? 'Copied ' + name : 'Copy ' + name + ' to the clipboard'"
            @click="copyName"
          >
            <span class="truncate">{{ name }}</span>
            <i
              :class="copied ? 'pi pi-check' : 'pi pi-copy'"
              class="ms-(--spacing-xxs) shrink-0 text-body-xs text-(--text-default)"
              aria-hidden="true"
            />
            <span
              :data-shown="copied || null"
              class="grid min-w-0 grid-cols-[0fr] transition-[grid-template-columns] duration-moderate-01 ease-productive-entrance data-shown:grid-cols-[1fr] motion-reduce:transition-none"
            >
              <span class="min-w-0 overflow-hidden">
                <span
                  class="block whitespace-nowrap ps-(--spacing-xxs) text-body-xs text-(--text-default)"
                  >Copied</span
                >
              </span>
            </span>
          </button>
        </Tooltip>
        <span>to confirm.</span>
      </p>
      <Input
        v-model="confirmation"
        :aria-labelledby="confirmLabelId"
        autocomplete="off"
        class="w-full"
        @keydown.enter="confirm"
      />
    </div>
    <template #actions="{ close }">
      <Button
        label="Cancel"
        kind="outlined"
        size="medium"
        @click="close"
      />
      <Button
        label="Delete resource"
        kind="danger"
        size="medium"
        :disabled="!canDelete"
        @click="confirm"
      />
    </template>
  </ConfirmDialog>
</template>
```
