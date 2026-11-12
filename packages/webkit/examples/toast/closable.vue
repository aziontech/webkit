<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'

  const show = () =>
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM'
    })
</script>

<template>
  <Toaster
    position="bottom-right"
    closable
  />
  <Button
    label="Show toast"
    @click="show"
  />
</template>
