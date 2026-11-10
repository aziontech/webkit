<script setup>
  import { ref } from 'vue'
  import FieldSelect from '@aziontech/webkit/field-select'

  const region = ref('')
  const options = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'EU (Ireland)' }
  ]
</script>

<template>
  <div class="w-[320px]">
    <FieldSelect
      v-model="region"
      label="Region"
      placeholder="Choose a region"
      helper-text="Pick a valid region."
      :options="options"
      invalid
    />
  </div>
</template>
