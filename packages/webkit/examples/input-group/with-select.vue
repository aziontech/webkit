<script setup>
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const currency = ref('USD')
</script>

<template>
  <InputGroupRoot>
    <Select
      aria-label="Currency"
      v-model="currency"
      placeholder="USD"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Option value="USD">USD</Select.Option>
        <Select.Option value="EUR">EUR</Select.Option>
        <Select.Option value="GBP">GBP</Select.Option>
      </Select.Content>
    </Select>
    <input
      placeholder="0.00"
      class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
    />
  </InputGroupRoot>
</template>
