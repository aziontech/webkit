<script setup>
  import Field from '@aziontech/webkit/field'
  import Select from '@aziontech/webkit/select'
  import { computed, ref } from 'vue'

  const value = ref('')
  const regions = [
    { value: 'us-east', label: 'US East' },
    { value: 'us-west', label: 'US West' },
    { value: 'eu-central', label: 'EU Central' },
    { value: 'ap-southeast', label: 'Asia Pacific Southeast' }
  ]
  const invalid = computed(() => !value.value)
</script>

<template>
  <Field
    :invalid="invalid"
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Region</Field.Label>
    <Select
      v-model="value"
      placeholder="Select a region"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item
          v-for="option in regions"
          :key="option.value"
          :value="option.value"
          >{{ option.label }}</Select.Item
        >
      </Select.Content>
    </Select>
    <Field.Error v-if="invalid">Choose a region.</Field.Error>
  </Field>
</template>
