<script setup>
  import Button from '@aziontech/ui/button'
  import { toast, Toaster } from '@aziontech/ui/toast'

  const show = () =>
    toast('Rule moved to the end of the list', {
      action: { label: 'Undo', onClick: () => {} }
    })
</script>

<template>
  <Toaster position="bottom-end" />
  <Button
    label="Move rule to end"
    variant="outline"
    @click="show"
  />
</template>
