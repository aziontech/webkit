<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'

  const show = () =>
    toast('Cache purge started', {
      description: 'https://example.com/docs/* clears from every node in a few minutes.'
    })
</script>

<template>
  <Toaster position="bottom-end" />
  <Button
    label="Purge cache"
    variant="outline"
    @click="show"
  />
</template>
