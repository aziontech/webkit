<script setup>
  import Button from '@aziontech/ui/button'
  import { toast, Toaster } from '@aziontech/ui/toast'

  const show = () =>
    toast('Application deleted', {
      description: 'acme-store was removed from your account.',
      action: { label: 'Undo', onClick: () => {} }
    })
</script>

<template>
  <Toaster position="bottom-end" />
  <Button
    label="Delete application"
    variant="outline"
    @click="show"
  />
</template>
