<script setup lang="ts">
  import { ref } from 'vue'

  import AccountSwitch from './account-switch.vue'

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const switchOpen = ref(true)
  const loadError = ref('The account list could not be loaded.')
</script>

<template>
  <AccountSwitch
    v-model:open="switchOpen"
    :error="loadError"
    @retry="loadError = ''"
    @sign-out="(event) => emit('sign-out', event)"
  />
</template>
