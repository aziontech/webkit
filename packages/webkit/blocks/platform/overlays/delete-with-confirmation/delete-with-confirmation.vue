<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DialogTrigger from '@aziontech/webkit/dialog-trigger'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
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
  <Dialog
    v-model:open="open"
    size="medium"
  >
    <DialogTrigger>
      <Button
        label="Delete resource"
        kind="danger"
        size="medium"
      />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Delete Resource</DialogTitle>
          <DialogClose />
        </PanelHeader>
        <PanelContent>
          <div class="flex flex-col gap-(--spacing-md)">
            <Message
              severity="warning"
              label="Once confirmed, this action can't be reversed."
            />
            <p class="m-0 text-body-sm text-(--text-muted)">
              The selected resource will be deleted, along with all associated settings or
              instances. Check the
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
              <span>To confirm, type</span>
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
                        >Copied</span
                      >
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
              @keydown.enter="confirm"
            />
          </div>
        </PanelContent>
        <PanelFooter>
          <div
            class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:items-center md:justify-end"
          >
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Cancel"
                kind="outlined"
                size="medium"
                @click="open = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Delete"
                kind="danger"
                size="medium"
                :disabled="!canDelete"
                @click="confirm"
              />
            </div>
          </div>
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>
