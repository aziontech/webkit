<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import { ref } from 'vue'

  const revealed = ref<boolean>(false)
</script>

<template>
  <IconButton
    icon="pi pi-trash"
    aria-label="Delete domain"
  />
  <IconButton
    :icon="revealed ? 'pi pi-eye-slash' : 'pi pi-eye'"
    :aria-label="revealed ? 'Hide password' : 'Show password'"
    @click="revealed = !revealed"
  />
  <span id="close-name">Close panel</span>
  <IconButton
    icon="pi pi-times"
    aria-labelledby="close-name"
  />
  <!-- @vue-expect-error the accessible name is a string -->
  <IconButton
    icon="pi pi-times"
    :ariaLabel="3"
  />
</template>
