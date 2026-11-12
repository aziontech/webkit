<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
  import MultiSelect from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref(['opt-1', 'opt-3'])
  const options = [
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' },
    { value: 'opt-4', label: 'Option 4' }
  ]
</script>

<template>
  <div style="width: 280px">
    <MultiSelect
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectOption
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectOption
        >
      </MultiSelectContent>
    </MultiSelect>
  </div>
</template>
