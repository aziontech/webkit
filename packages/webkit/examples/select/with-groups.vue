<script setup>
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const value = ref('')
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
  <div class="w-[280px]">
    <Select
      aria-label="Option"
      v-model="value"
      placeholder="Select an option"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Group
          v-for="g in groups"
          :key="g.label"
          :label="g.label"
        >
          <Select.Option
            v-for="o in g.options"
            :key="o.value"
            :value="o.value"
            >{{ o.label }}</Select.Option
          >
        </Select.Group>
      </Select.Content>
    </Select>
  </div>
</template>
