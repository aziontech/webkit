<script setup>
  import MultiSelectContent from '@aziontech/ui/multi-select-content'
  import MultiSelectGroup from '@aziontech/ui/multi-select-group'
  import MultiSelectItem from '@aziontech/ui/multi-select-item'
  import MultiSelectRoot from '@aziontech/ui/multi-select-root'
  import MultiSelectTrigger from '@aziontech/ui/multi-select-trigger'
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
  <div class="w-full max-w-70">
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
          <MultiSelectItem
            v-for="o in g.options"
            :key="o.value"
            :value="o.value"
            >{{ o.label }}</MultiSelectItem
          >
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>
