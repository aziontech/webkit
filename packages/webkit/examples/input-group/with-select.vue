<script setup>
  import InputGroup from '@aziontech/webkit/input-group'
  import Button from '@aziontech/webkit/button'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const currency = ref('BRL')
</script>

<template>
  <InputGroup>
    <Select
      v-model="currency"
      placeholder="BRL"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Option value="BRL">BRL</Select.Option>
        <Select.Option value="USD">USD</Select.Option>
        <Select.Option value="EUR">EUR</Select.Option>
      </Select.Content>
    </Select>
    <input
      placeholder="0.00"
      class="flex-1 min-w-0 h-full bg-(--bg-surface) border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted)"
    />
  </InputGroup>
</template>
