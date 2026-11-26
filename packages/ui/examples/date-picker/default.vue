<script setup>
  import DatePickerRoot from '@aziontech/webkit/date-picker-root'
  import { ref } from 'vue'

  const date = ref(null)
</script>

<template>
  <DatePickerRoot
    v-model="date"
    aria-label="Start date"
  />
</template>
