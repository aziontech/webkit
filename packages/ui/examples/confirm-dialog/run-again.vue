<script setup>
  import Button from '@aziontech/ui/button'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Clear cached content again?"
    description="This clears the same 2 URLs from the Edge cache again. Each object is fetched from your origin on its next request."
    confirm-label="Clear again"
    variant="primary"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Run again"
        variant="outline"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
