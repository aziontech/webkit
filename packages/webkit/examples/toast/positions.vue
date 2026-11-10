<script setup>
  import { Toaster, toast } from '@aziontech/webkit/toast'
  import Button from '@aziontech/webkit/button'

  const positions = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right'
  ]
</script>

<template>
  <Toaster position="bottom-right" />
  <div class="flex flex-wrap justify-center gap-2">
    <Button
      v-for="p in positions"
      :key="p"
      :label="p"
      kind="secondary"
      @click="() => toast(p, { position: p })"
    />
  </div>
</template>
