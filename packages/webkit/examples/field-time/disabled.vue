<script setup>
  import { ref } from 'vue'
  import FieldTime from '@aziontech/webkit/field-time'

  const startTime = ref('09:30')
</script>

<template>
  <FieldTime
    v-model="startTime"
    label="Start time"
    disabled
  />
</template>
