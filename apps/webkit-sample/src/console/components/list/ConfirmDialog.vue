<script setup>
  // THE SHORT BLOCKING DECISION — one question, two answers, no form.
  //
  // It is the OTHER half of ./DeleteDialog.vue, and the two are not interchangeable.
  // DeleteDialog guards the destruction of a stored resource: irreversible, so it makes
  // the reader type the name. This one guards an act inside work that is still pending —
  // pulling a row out of a form the page has not committed yet — where the page's own
  // Discard is already the undo. A type-the-name guard there is friction that teaches
  // people to stop reading guards.
  //
  // It confirms and closes; it never carries the work itself. The caller owns what
  // happens on `confirm`, so the same dialog can front a removal, a disconnect, or a
  // reset without knowing what any of them do (../../lib/behavior/surfaces.js §
  // never-dialog: a dialog that holds a form is a drawer with worse ergonomics).
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'

  defineProps({
    /** The question, as the act it confirms — "Remove domain", not "Are you sure?". */
    title: { type: String, default: 'Confirm' },
    /** One line on what the answer costs. The reader decides on this sentence. */
    description: { type: String, default: '' },
    /** The verb on the filled button. It repeats the act, never says "OK". */
    confirmLabel: { type: String, default: 'Confirm' },
    /** `danger` for anything that takes something away; `primary` otherwise. */
    confirmKind: {
      type: String,
      default: 'danger',
      validator: (value) => ['primary', 'danger'].includes(value)
    }
  })

  const emit = defineEmits(['confirm'])

  const open = defineModel('open', { type: Boolean, default: false })

  // Closing by any implicit route — Escape, the overlay, the X, Cancel — is the SAFE
  // answer. The only path to `confirm` is the button that names the act.
  const confirm = () => {
    open.value = false
    emit('confirm')
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="small"
    data-testid="confirm-dialog"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>{{ title }}</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <PanelContent>
          <DialogDescription class="m-0 text-body-sm text-(--text-muted)">
            {{ description }}
          </DialogDescription>
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Cancel"
            kind="text"
            size="medium"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            :label="confirmLabel"
            :kind="confirmKind"
            size="medium"
            data-testid="confirm-dialog__confirm"
            @click="confirm"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
