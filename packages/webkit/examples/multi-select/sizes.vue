<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
  import MultiSelect from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref([])
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ]
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div
    class="flex flex-col gap-4"
    style="width: 280px"
  >
    <MultiSelect
      :aria-label="`Option, ${s}`"
      v-for="s in sizes"
      :key="s"
      v-model="value"
      :size="s"
      :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"
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
