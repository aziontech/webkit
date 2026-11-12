<script setup lang="ts">
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
          class="rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
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
