<script setup>
  import Select from '@aziontech/webkit/select'
  import { computed, ref } from 'vue'

  const value = ref('')
  const options = [
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' },
    { value: 'opt-4', label: 'Option 4' }
  ]
  const invalid = computed(() => !value.value)
</script>

<template>
  <div class="w-[280px]">
    <Select
      aria-label="Option"
      v-model="value"
      :invalid="invalid"
      placeholder="Select an option"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Option
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</Select.Option
        >
      </Select.Content>
    </Select>
  </div>
</template>
