<script setup>
  import { Toaster, toast } from '@aziontech/webkit/toast'
  import Button from '@aziontech/webkit/button'

  const show = () =>
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM'
    })
</script>

<template>
  <Toaster position="bottom-right" />
  <Button
    label="Show toast"
    @click="show"
  />
</template>
