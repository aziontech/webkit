<script setup>
  import MultiSelect from '@aziontech/webkit/multi-select'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

  const state = ref('loading')
  const states = [
    { label: 'Loading', value: 'loading' },
    { label: 'Error', value: 'error' },
    { label: 'Empty', value: 'empty' }
  ]
  const value = ref([])
  const error = computed(() =>
    state.value === 'error'
      ? 'Could not load the domains. Close the list and open it again to retry.'
      : ''
  )
  let retry = false
  const onOpen = (open) => {
    if (open && retry && state.value === 'error') state.value = 'loading'
    retry = !open && state.value === 'error'
  }
</script>

<template>
  <div class="flex w-full max-w-80 flex-col gap-(--spacing-sm)">
    <ToggleGroup
      v-model="state"
      :options="states"
      aria-label="List state"
      size="small"
    />
    <MultiSelect
      v-model="value"
      searchable
      :loading="state === 'loading'"
      :error="error"
      empty-title="No domains yet"
      placeholder="Select domains"
      aria-label="Domains"
      @update:open="onOpen"
    >
      <MultiSelect.Trigger />
      <MultiSelect.Content />
    </MultiSelect>
  </div>
</template>
