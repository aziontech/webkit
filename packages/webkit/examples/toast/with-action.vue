<script setup>
  import { Toaster, toast } from '@aziontech/webkit/toast'
  import Button from '@aziontech/webkit/button'

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
