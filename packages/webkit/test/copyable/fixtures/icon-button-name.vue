<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import { ref } from 'vue'

  const revealed = ref<boolean>(false)
</script>

<template>
  <IconButton
    icon="ai ai-trash"
    aria-label="Delete domain"
  />
  <IconButton
    :icon="revealed ? 'ai ai-eye-slash' : 'ai ai-eye'"
    :aria-label="revealed ? 'Hide password' : 'Show password'"
    @click="revealed = !revealed"
  />
  <span id="close-name">Close panel</span>
  <IconButton
    icon="ai ai-times"
    aria-labelledby="close-name"
  />
  <!-- @vue-expect-error the accessible name is a string -->
  <IconButton
    icon="ai ai-times"
    :ariaLabel="3"
  />
</template>
