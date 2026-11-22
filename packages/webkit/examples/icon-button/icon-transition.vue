<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import { ref } from 'vue'

  const shown = ref(false)
</script>

<template>
  <IconButton
    variant="outline"
    :icon="shown ? 'az az-eye-off' : 'az az-eye'"
    :aria-label="shown ? 'Hide token' : 'Show token'"
    :aria-pressed="shown"
    icon-transition
    @click="shown = !shown"
  />
</template>
