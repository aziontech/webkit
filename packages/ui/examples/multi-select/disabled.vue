<script setup>
  import MultiSelectContent from '@aziontech/ui/multi-select-content'
  import MultiSelectItem from '@aziontech/ui/multi-select-item'
  import MultiSelectRoot from '@aziontech/ui/multi-select-root'
  import MultiSelectTrigger from '@aziontech/ui/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref([])
  const options = [
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' },
    { value: 'opt-4', label: 'Option 4' }
  ]
</script>

<template>
  <div class="w-full max-w-70">
    <MultiSelectRoot
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
      disabled
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectItem
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectItem
        >
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
