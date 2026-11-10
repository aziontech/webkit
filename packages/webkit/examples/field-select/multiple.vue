<script setup>
  import { ref } from 'vue'
  import FieldSelect from '@aziontech/webkit/field-select'

  const regions = ref([])
  const options = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'EU (Ireland)' }
  ]
</script>

<template>
  <div class="w-[320px]">
    <FieldSelect
      v-model="regions"
      label="Regions"
      placeholder="Choose regions"
      helper-text="Select every region."
      :options="options"
      multiple
    />
  </div>
</template>
