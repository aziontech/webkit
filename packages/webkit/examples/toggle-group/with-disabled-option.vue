<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const options = [
    { label: 'Hourly', value: 'hourly' },
    { label: 'Daily', value: 'daily', disabled: true },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' }
  ]

  const selected = ref('hourly')
</script>

<template>
  <ToggleGroup
    v-model="selected"
    :options="options"
    aria-label="Report frequency"
  />
</template>
