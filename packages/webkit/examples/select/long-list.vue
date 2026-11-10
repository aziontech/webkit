<script setup>
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const value = ref('')
  const options = Array.from({ length: 40 }, (_, i) => ({
    value: `opt-${i + 1}`,
    label: `Option ${i + 1}`
  }))
</script>

<template>
  <div class="w-[280px]">
    <Select
      v-model="value"
      placeholder="Pick one of many"
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
