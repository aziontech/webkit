<script setup>
  import FieldSwitch from '@aziontech/webkit/field-switch'
  import { ref } from 'vue'

  const off = ref(false)
  const on = ref(true)
</script>

<template>
  <div class="flex max-w-xs flex-col gap-(--spacing-3)">
    <FieldSwitch
      v-model="off"
      label="Switch label"
      description="Switch description"
    />
    <FieldSwitch
      v-model="on"
      label="Switch label"
      description="Switch description"
    />
  </div>
</template>
