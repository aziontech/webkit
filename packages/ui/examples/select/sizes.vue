<script setup>
  import Select from '@aziontech/ui/select'
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
      :aria-label="`Option, ${s}`"
      v-for="s in sizes"
      :key="s"
      v-model="value"
      :size="s"
      :placeholder="s.charAt(0).toUpperCase() + s.slice(1)"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item
          v-for="o in options"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</Select.Item
        >
      </Select.Content>
    </Select>
  </div>
</template>
