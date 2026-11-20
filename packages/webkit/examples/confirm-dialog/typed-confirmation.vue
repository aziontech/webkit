<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <ConfirmDialog
    v-model:open="open"
    title="Delete application"
    description="acme-store and its domains and deployments are deleted. This can't be undone."
    confirm-label="Delete application"
    confirmation-phrase="acme-store"
    @confirm="open = false"
  >
    <template #trigger>
      <Button
        label="Delete application"
        variant="danger"
        size="medium"
      />
    </template>
  </ConfirmDialog>
</template>
