<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'

  const show = () =>
    toast('Event has been created', {
      action: { label: 'Undo', onClick: () => {} }
    })
</script>

<template>
  <Toaster position="bottom-right" />
  <Button
    label="Show toast"
    @click="show"
  />
</template>
