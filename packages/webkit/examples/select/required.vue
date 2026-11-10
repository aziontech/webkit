<script setup>
  import Select from '@aziontech/webkit/select'
  import Button from '@aziontech/webkit/button'
  import { ref } from 'vue'

  const value = ref('')
  const submitted = ref(false)
  const options = [
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' },
    { value: 'opt-4', label: 'Option 4' }
  ]
</script>

<template>
  <div class="flex w-[280px] flex-col items-start gap-4">
    <Select
      v-model="value"
      :required="submitted && !value"
      placeholder="Select an option"
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
    <Button
      label="Submit"
      size="medium"
      @click="submitted = true"
    />
  </div>
</template>
