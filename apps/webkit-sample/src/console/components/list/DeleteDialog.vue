<script setup>
  // The one destructive confirmation every resource list shares.
  //
  // Deleting a resource is the single action on these pages with no undo, so it does not
  // happen on a menu click: the row opens this dialog, and the Delete button stays
  // disabled until the reader has typed the resource's own name. The name is the phrase
  // on purpose — it is the thing they were looking at in the row, so typing it is a
  // deliberate re-read of WHICH one is about to go, not a captcha.
  //
  // The name is also CLICKABLE: click it and it lands on the clipboard, ready to paste
  // into the field below. That keeps the guard honest for names nobody can retype from
  // memory (`prod-edge-fw-01-us-east`) without softening it for the short ones.
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'

  const props = defineProps({
    // The resource's own name — both the confirmation phrase and what the copy control
    // puts on the clipboard.
    name: { type: String, default: '' },
    // Singular noun for this resource ("Application", "Workload", "Personal token").
    // Drives the title and the body copy, so each list reads as its own dialog.
    kind: { type: String, default: 'resource' },
    // Overrides when a list needs to say something the generic line can't.
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    helpHref: { type: String, default: '#' }
  })

  const emit = defineEmits(['confirm'])

  const open = defineModel('open', { type: Boolean, default: false })

  const confirmation = ref('')
  const copied = ref(false)
  const confirmLabelId = useId()
  let copiedTimeoutId = null

  const heading = computed(() => props.title || `Delete ${props.kind}`)

  const body = computed(
    () =>
      props.description ||
      `The selected ${props.kind} will be deleted, along with all associated settings or instances. Check the`
  )

  // Trimmed on both sides: a trailing space from a paste is not a different name, and
  // failing on one is the kind of guard that teaches people to distrust the guard.
  const canDelete = computed(
    () => confirmation.value.trim().length > 0 && confirmation.value.trim() === props.name.trim()
  )

  // Every open starts from empty. A phrase left from the LAST row is the one state this
  // dialog must never be in — it would arm Delete for a resource nobody re-confirmed.
  watch(open, () => {
    confirmation.value = ''
    copied.value = false
  })

  const copyName = async () => {
    if (!props.name || typeof globalThis.navigator === 'undefined') return
    try {
      await globalThis.navigator.clipboard.writeText(props.name)
    } catch {
      return
    }
    copied.value = true
    if (copiedTimeoutId) clearTimeout(copiedTimeoutId)
    copiedTimeoutId = setTimeout(() => {
      copied.value = false
      copiedTimeoutId = null
    }, 2000)
  }

  const confirm = () => {
    if (!canDelete.value) return
    open.value = false
    emit('confirm')
  }

  onBeforeUnmount(() => {
    if (copiedTimeoutId) clearTimeout(copiedTimeoutId)
  })
</script>

<template>
  <Dialog
    v-model:open="open"
    size="medium"
    data-testid="delete-dialog"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>{{ heading }}</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <PanelContent class="flex flex-col gap-(--spacing-md)">
          <Message
            severity="warning"
            label="Once confirmed, this action can't be reversed."
          />

          <p class="m-0 text-body-sm text-(--text-muted)">
            {{ body }}
            <!-- An inline link inside a sentence is the `text-link` utility, not the Link
                 component: Link is a control with its own box (inline-flex, a min-height,
                 a size axis), so putting one mid-paragraph meant overriding all three with
                 `!` just to get it to sit on the text baseline. -->
            <a
              :href="helpHref"
              class="text-link"
              >Help Center</a
            >
            for more details.
          </p>

          <p
            :id="confirmLabelId"
            class="m-0 flex flex-wrap items-center gap-(--spacing-xxs) text-body-sm text-(--text-default)"
          >
            <span>To confirm, type</span>
            <!-- The name is the control: clicking it copies, so a long name can be
                 pasted instead of retyped. It stays a plain button (not an icon next to
                 the text) because the text IS what the reader is aiming at. -->
            <Tooltip
              text="Copy to clipboard"
              class="max-w-full"
            >
              <button
                type="button"
                class="inline-flex max-w-full cursor-pointer items-center rounded-(--shape-elements) border border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-overlay) px-(--spacing-xxs) text-body-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:border-(--border-default) hover:bg-(--bg-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
                :aria-label="copied ? `Copied ${name}` : `Copy ${name} to the clipboard`"
                @click="copyName"
              >
                <span class="truncate">{{ name }}</span>
                <!-- Glyph and confirmation both take --text-default, NOT --text-muted:
                     the chip's own fill is --bg-surface-overlay (#4D4D4D in dark), and
                     --text-muted on it is 2.14:1 — under the 3:1 a glyph needs and the
                     4.5:1 the word needs. Quieter than the name comes from the smaller
                     size, which costs no contrast. -->
                <i
                  :class="copied ? 'pi pi-check' : 'pi pi-copy'"
                  class="ml-(--spacing-xxs) shrink-0 text-body-xs text-(--text-default)"
                  aria-hidden="true"
                />
                <!-- "Copied" grows the chip instead of appearing in it: the confirmation
                     is the only thing that moves, so the eye is already on the word by
                     the time it finishes. Width is not interpolable from `auto`, so the
                     word rides a single-column grid track from 0fr to 1fr and the chip's
                     own auto width follows. The clip stays BARE — the leading gap lives
                     on the row inside it, or it would survive the collapse as dead space. -->
                <span
                  :data-shown="copied || null"
                  class="grid min-w-0 grid-cols-[0fr] transition-[grid-template-columns] duration-moderate-01 ease-productive-entrance data-shown:grid-cols-[1fr] motion-reduce:transition-none"
                >
                  <span class="min-w-0 overflow-hidden">
                    <span
                      class="block whitespace-nowrap pl-(--spacing-xxs) text-body-xs text-(--text-default)"
                    >
                      Copied
                    </span>
                  </span>
                </span>
              </button>
            </Tooltip>
            <span>in the box below:</span>
          </p>

          <InputText
            v-model="confirmation"
            :aria-labelledby="confirmLabelId"
            autocomplete="off"
            class="w-full"
            data-testid="delete-dialog__confirm-input"
            @keydown.enter="confirm"
          />
        </PanelContent>

        <PanelFooter class="flex-col md:flex-row md:justify-end">
          <Button
            class="w-full md:w-auto"
            label="Cancel"
            kind="outlined"
            size="medium"
            @click="open = false"
          />
          <Button
            class="w-full md:w-auto"
            label="Delete"
            kind="danger"
            size="medium"
            :disabled="!canDelete"
            data-testid="delete-dialog__delete"
            @click="confirm"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
