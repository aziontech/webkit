<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Dialog
    v-model:open="open"
    dismissible
    size="medium"
  >
    <Dialog.Trigger>
      <Button
        label="Open dialog"
        variant="primary"
      />
    </Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Header class="w-full">
        <Dialog.Title>Dialog Title</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Dialog.Description>
          Modal content. Uses the shared Panel header, body, and footer regions.
        </Dialog.Description>
      </Dialog.Body>
      <Dialog.Footer>
        <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
          <Button
            label="Cancel"
            variant="outline"
            @click="open = false"
          />
          <Button
            label="Save"
            variant="primary"
          />
        </div>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog>
</template>
