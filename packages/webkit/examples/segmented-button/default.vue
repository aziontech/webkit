<script setup>
  import SegmentedButton from '@aziontech/webkit/segmented-button'
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
  <SegmentedButton
    v-model="selected"
    :options="options"
    aria-label="Segmented options"
  />
</template>
