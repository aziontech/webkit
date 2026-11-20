<script setup>
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  const options = [
    { label: 'Label', value: 'option-1' },
    { label: 'Label', value: 'option-2' },
    { label: 'Label', value: 'option-3' },
    { label: 'Label', value: 'option-4' },
    { label: 'Label', value: 'option-5' }
  ]

  const selected = ref('option-1')
</script>

<template>
  <ToggleGroup
    v-model="selected"
    :options="options"
    aria-label="Segmented options"
  />
</template>
