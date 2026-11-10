<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Remove domain"
    description="shop.example.com stops answering for this resource once you save. Traffic already pointed at it gets no response."
    confirm-label="Remove Domain"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Remove domain"
        kind="outlined"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
