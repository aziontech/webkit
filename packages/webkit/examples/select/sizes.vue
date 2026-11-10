<script setup>
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const value = ref('')
  const options = [
    { value: 'a', label: 'Option A' },
    { value: 'b', label: 'Option B' }
  ]
  const sizes = ['small', 'medium', 'large']
</script>

<template>
  <div class="flex flex-col gap-4 w-[280px]">
    <Select
      v-for="s in sizes"
      :key="s"
      v-model="value"
      :size="s"
      :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"
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
