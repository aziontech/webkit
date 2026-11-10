<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Clear cached content again?"
    description="This clears the same 2 URLs from the Edge cache again. Each object is fetched from your origin on its next request."
    confirm-label="Clear again"
    kind="primary"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Run again"
        kind="outlined"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
