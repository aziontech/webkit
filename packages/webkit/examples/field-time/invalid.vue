<script setup>
  import { ref } from 'vue'
  import FieldTime from '@aziontech/webkit/field-time'

  const startTime = ref('25:70')
</script>

<template>
  <FieldTime
    v-model="startTime"
    label="Start time"
  />
</template>
