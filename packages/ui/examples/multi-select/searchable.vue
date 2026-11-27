<script setup>
  import MultiSelect from '@aziontech/ui/multi-select'
  import { ref } from 'vue'

  const labels = ref(['production', 'staging', 'docs-site', 'site-assets', 'acme-store'])
  const value = ref(['production', 'docs-site'])

  const add = (event, label) => {
    labels.value = [...labels.value, label]
    value.value = [...value.value, label]
  }
</script>

<template>
  <div class="w-full max-w-80">
    <MultiSelect
      v-model="value"
      variant="chips"
      searchable
      allow-custom
      placeholder="Add labels"
      aria-label="Labels"
      @create="add"
    >
      <MultiSelect.Trigger />
      <MultiSelect.Content>
        <MultiSelect.Item
          v-for="label in labels"
          :key="label"
          :value="label"
          >{{ label }}</MultiSelect.Item
        >
      </MultiSelect.Content>
    </MultiSelect>
  </div>
</template>
