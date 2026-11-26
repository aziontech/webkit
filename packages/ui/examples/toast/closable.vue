<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'

  const show = () =>
    toast('Domain added', {
      description: 'shop.example.com starts answering once its DNS record propagates.'
    })
</script>

<template>
  <Toaster
    position="bottom-end"
    closable
  />
  <Button
    label="Add domain"
    variant="outline"
    @click="show"
  />
</template>
