<script setup>
  import Button from '@aziontech/webkit/button'
  import { toast, Toaster } from '@aziontech/webkit/toast'

  const positions = [
    'top-start',
    'top-center',
    'top-end',
    'bottom-start',
    'bottom-center',
    'bottom-end'
  ]
</script>

<template>
  <Toaster position="bottom-end" />
  <div class="flex flex-wrap justify-center gap-(--spacing-xs)">
    <Button
      v-for="p in positions"
      :key="p"
      :label="p"
      variant="secondary"
      @click="() => toast(p, { position: p })"
    />
  </div>
</template>
