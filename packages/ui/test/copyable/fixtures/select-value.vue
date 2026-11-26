<script setup lang="ts">
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select, { type SelectOptionItem } from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const environment = ref<string>('production')
  const regions = ref<string[]>([])
  const options: SelectOptionItem<string>[] = [
    { value: 'production', label: 'Production' },
    { value: 'preview', label: 'Preview', icon: 'az az-eye', disabled: true }
  ]
  const labelOf = (value: string): string =>
    options.find((option) => option.value === value)?.label ?? value
  const onEnvironment = (value: string): void => {
    environment.value = value
  }
</script>

<template>
  <Select
    :model-value="environment"
    :display-value="labelOf"
    @update:model-value="onEnvironment"
  >
    <Select.Trigger />
    <Select.Content>
      <Select.Item
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :icon="option.icon"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </Select.Item>
    </Select.Content>
  </Select>
  <MultiSelect
    v-model="regions"
    :display-value="(value) => value.join(' / ')"
  />
  <!-- @vue-expect-error the formatter receives the bound string, not a number -->
  <Select
    :model-value="environment"
    :display-value="(value: number) => value.toFixed(0)"
  />
</template>
