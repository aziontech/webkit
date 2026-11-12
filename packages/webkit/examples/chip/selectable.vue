<script setup>
  import Chip from '@aziontech/webkit/chip'
  import { ref } from 'vue'

  const production = ref(true)
  const staging = ref(false)
  const preview = ref(false)
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Chip
      v-model:selected="production"
      label="Production"
      kind="outlined"
      size="medium"
      selectable
    />
    <Chip
      v-model:selected="staging"
      label="Staging"
      kind="outlined"
      size="medium"
      selectable
    />
    <Chip
      v-model:selected="preview"
      label="Preview"
      kind="outlined"
      size="medium"
      selectable
    />
  </div>
</template>
