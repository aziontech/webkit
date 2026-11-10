<script setup>
  import { ref } from 'vue'
  import FieldTime from '@aziontech/webkit/field-time'

  const triggerTime = ref('14:05:30')
</script>

<template>
  <FieldTime
    v-model="triggerTime"
    format="hh:mm:ss"
    label="Start time"
  />
</template>
