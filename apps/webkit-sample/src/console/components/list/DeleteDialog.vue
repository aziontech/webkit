<script setup lang="ts">
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

  interface Props {
    name?: string
    kind?: string
    title?: string
    description?: string
    helpHref?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    kind: 'resource',
    title: '',
    description: '',
    helpHref: '#'
  })

  const emit = defineEmits<{
    confirm: []
  }>()

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

  const canDelete = computed(
    () => confirmation.value.trim().length > 0 && confirmation.value.trim() === props.name.trim()
  )

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
                <i
                  :class="copied ? 'pi pi-check' : 'pi pi-copy'"
                  class="ml-(--spacing-xxs) shrink-0 text-body-xs text-(--text-default)"
                  aria-hidden="true"
                />
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
