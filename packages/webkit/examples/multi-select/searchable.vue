<script setup>
  import MultiSelect from '@aziontech/webkit/multi-select'
  import { ref } from 'vue'

  const labels = ref(['production', 'staging', 'docs-site', 'site-assets', 'acme-store'])
  const value = ref(['production', 'docs-site'])

  const add = (event, label) => {
    labels.value = [...labels.value, label]
    value.value = [...value.value, label]
  }
</script>

<template>
  <div style="width: 320px">
    <MultiSelect
      v-model="value"
      kind="chips"
      searchable
      allow-custom
      placeholder="Add labels"
      aria-label="Labels"
      @create="add"
    >
      <MultiSelect.Trigger />
      <MultiSelect.Content>
        <MultiSelect.Option
          v-for="label in labels"
          :key="label"
          :value="label"
          >{{ label }}</MultiSelect.Option
        >
      </MultiSelect.Content>
    </MultiSelect>
  </div>
</template>
