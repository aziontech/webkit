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
    description="Traffic sent to shop.example.com stops getting a response. You can add the domain again later."
    confirm-label="Remove domain"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Remove domain"
        variant="outline"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
