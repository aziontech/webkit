<script setup>
  import InputGroupInput from '@aziontech/webkit/input-group-input'
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
      class="max-w-28 shrink-0"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="USD">USD</Select.Item>
        <Select.Item value="EUR">EUR</Select.Item>
        <Select.Item value="GBP">GBP</Select.Item>
      </Select.Content>
    </Select>
    <InputGroupInput
      aria-label="Amount"
      placeholder="0.00"
    />
  </InputGroupRoot>
</template>
