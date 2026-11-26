<script setup>
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const lockedOff = ref(false)
  const lockedOn = ref(true)
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-4)">
    <Switch
      v-model="lockedOff"
      disabled
      aria-label="Locked off"
    />
    <Switch
      v-model="lockedOn"
      disabled
      aria-label="Locked on"
    />
  </div>
</template>
