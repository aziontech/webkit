<script setup>
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectGroup from '@aziontech/webkit/multi-select-group'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
  import MultiSelectRoot from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import { ref } from 'vue'

  const value = ref([])
  const groups = [
    {
      label: 'Group A',
      options: [
        { value: 'a-1', label: 'Option 1' },
        { value: 'a-2', label: 'Option 2' }
      ]
    },
    {
      label: 'Group B',
      options: [
        { value: 'b-1', label: 'Option 1' },
        { value: 'b-2', label: 'Option 2' }
      ]
    }
  ]
</script>

<template>
  <div style="width: 280px">
    <MultiSelectRoot
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectGroup
          v-for="g in groups"
          :key="g.label"
          :label="g.label"
        >
          <MultiSelectOption
            v-for="o in g.options"
            :key="o.value"
            :value="o.value"
            >{{ o.label }}</MultiSelectOption
          >
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
