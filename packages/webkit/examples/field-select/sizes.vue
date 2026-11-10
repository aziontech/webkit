<script setup>
  import { ref } from 'vue'
  import FieldSelect from '@aziontech/webkit/field-select'

  const small = ref('')
  const medium = ref('')
  const large = ref('')
  const options = [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'eu-west-1', label: 'EU (Ireland)' }
  ]
</script>

<template>
  <div class="flex flex-col gap-6 w-[320px]">
    <FieldSelect
      v-model="small"
      size="small"
      label="Region (small)"
      placeholder="Choose a region"
      :options="options"
      helper-text="Small size — 28px trigger height."
    />
    <FieldSelect
      v-model="medium"
      size="medium"
      label="Region (medium)"
      placeholder="Choose a region"
      :options="options"
      helper-text="Medium size — 32px trigger height."
    />
    <FieldSelect
      v-model="large"
      size="large"
      label="Region (large)"
      placeholder="Choose a region"
      :options="options"
      helper-text="Large size — 40px trigger height."
    />
  </div>
</template>
