<script setup lang="ts">
  import Select from '@aziontech/ui/select'

  import type { ScanFilterOption } from '../scan-results-config'

  export interface FilterSelectProps {
    /** Accessible name of the filter. */
    label: string
    /** The options; the first one keeps every row. */
    options: ScanFilterOption[]
  }

  const props = defineProps<FilterSelectProps>()

  const value = defineModel<string>({ required: true })

  const displayValue = (current: unknown) =>
    props.options.find((option) => option.value === current)?.label ?? String(current)
</script>

<template>
  <div class="w-full sm:w-44">
    <Select
      v-model="value"
      size="medium"
      :display-value="displayValue"
    >
      <Select.Trigger :aria-label="label" />
      <Select.Content>
        <Select.Item
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </Select.Item>
      </Select.Content>
    </Select>
  </div>
</template>
