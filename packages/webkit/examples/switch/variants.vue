<script setup>
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const defaultOff = ref(false)
  const defaultOn = ref(true)
  const privacyOff = ref(false)
  const privacyOn = ref(true)
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-4)">
    <Switch
      v-model="defaultOff"
      variant="default"
      aria-label="Default off"
    />
    <Switch
      v-model="defaultOn"
      variant="default"
      aria-label="Default on"
    />
    <Switch
      v-model="privacyOff"
      variant="privacy"
      aria-label="Privacy off"
    />
    <Switch
      v-model="privacyOn"
      variant="privacy"
      aria-label="Privacy on"
    />
  </div>
</template>
