<script setup lang="ts">
  import Checkbox from '@aziontech/webkit/checkbox'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  type Range = 'day' | 'week'

  const regions = ref<string[]>([])
  const accepted = ref<boolean>(false)
  const tags = ref<string[]>([])
  const range = ref<Range>('day')
  const ranges: ToggleGroupOption<Range>[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' }
  ]
  const onRegions = (next: string[]): void => {
    regions.value = next
  }
  const onAccepted = (next: boolean): void => {
    accepted.value = next
  }
  const onRange = (next: Range | undefined): void => {
    if (next) range.value = next
  }
</script>

<template>
  <MultiSelect
    :model-value="regions"
    :display-value="(value) => `${value.length} regions`"
    @update:model-value="onRegions"
  />
  <Checkbox
    :model-value="accepted"
    binary
    @update:model-value="onAccepted"
  />
  <Checkbox
    v-model="tags"
    value="edge"
  />
  <ToggleGroup
    :model-value="range"
    :options="ranges"
    aria-label="Range"
    @update:model-value="onRange"
  />
  <ToggleGroup
    v-model="range"
    :options="ranges"
    aria-label="Range"
  />
  <!-- @vue-expect-error the model is the Range union, so update:modelValue never sends a number -->
  <ToggleGroup
    :model-value="range"
    :options="ranges"
    aria-label="Range"
    @update:model-value="(next: number) => next"
  />
  <!-- @vue-expect-error a string[] model sends string[], not number[] -->
  <MultiSelect
    :model-value="regions"
    @update:model-value="(next: number[]) => next"
  />
</template>
