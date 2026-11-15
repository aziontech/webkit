<script setup>
  import MultiSelect from '@aziontech/webkit/multi-select'
  import { ref } from 'vue'

  const regions = [
    { value: 'us-east', label: 'US East' },
    { value: 'us-west', label: 'US West' },
    { value: 'eu-central', label: 'EU Central' },
    { value: 'eu-west', label: 'EU West' },
    { value: 'ap-south', label: 'Asia Pacific South' },
    { value: 'sa-east', label: 'South America East' }
  ]
  const value = ref(['us-east', 'us-west', 'eu-central', 'eu-west', 'ap-south'])
</script>

<template>
  <div style="width: 320px">
    <MultiSelect
      v-model="value"
      kind="chips"
      :chip-limit="3"
      placeholder="Select regions"
      aria-label="Regions"
    >
      <MultiSelect.Trigger />
      <MultiSelect.Content>
        <MultiSelect.Item
          v-for="region in regions"
          :key="region.value"
          :value="region.value"
          >{{ region.label }}</MultiSelect.Item
        >
      </MultiSelect.Content>
    </MultiSelect>
  </div>
</template>
