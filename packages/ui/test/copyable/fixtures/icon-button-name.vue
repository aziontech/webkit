<script setup lang="ts">
  import IconButton from '@aziontech/ui/icon-button'
  import { ref } from 'vue'

  const revealed = ref<boolean>(false)
</script>

<template>
  <IconButton
    icon="az az-trash"
    aria-label="Delete domain"
  />
  <IconButton
    :icon="revealed ? 'az az-eye-off' : 'az az-eye'"
    :aria-label="revealed ? 'Hide password' : 'Show password'"
    @click="revealed = !revealed"
  />
  <span id="close-name">Close panel</span>
  <IconButton
    icon="az az-x"
    aria-labelledby="close-name"
  />
  <!-- @vue-expect-error the accessible name is a string -->
  <IconButton
    icon="az az-x"
    :ariaLabel="3"
  />
</template>
