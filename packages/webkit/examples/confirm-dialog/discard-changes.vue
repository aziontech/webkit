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
