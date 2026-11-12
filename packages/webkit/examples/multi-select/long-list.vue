<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
  import MultiSelectRoot from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref([])
  const options = Array.from({ length: 40 }, (_, i) => ({
    value: `opt-${i + 1}`,
    label: `Option ${i + 1}`
  }))
</script>

<template>
  <div style="width: 280px">
    <MultiSelectRoot
      aria-label="Options"
      v-model="value"
      placeholder="Pick several"
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
    </MultiSelectRoot>
  </div>
</template>
