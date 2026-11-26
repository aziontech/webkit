<script setup>
  import Button from '@aziontech/ui/button'
  import Field from '@aziontech/ui/field'
  import Select from '@aziontech/ui/select'
  import { computed, ref } from 'vue'

  const region = ref('')
  const submitted = ref(false)
  const missing = computed(() => submitted.value && !region.value)
  const regions = [
    { value: 'us-east', label: 'US East' },
    { value: 'us-west', label: 'US West' },
    { value: 'eu-central', label: 'EU Central' },
    { value: 'ap-southeast', label: 'Asia Pacific Southeast' }
  ]
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col items-start gap-(--spacing-md)">
    <Field
      required
      :invalid="missing"
      class="w-full"
    >
      <Field.Label>Region</Field.Label>
      <Select
        v-model="region"
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
      <Field.Error v-if="missing">Choose a region.</Field.Error>
    </Field>
    <Button
      label="Submit"
      size="medium"
      @click="submitted = true"
    />
  </div>
</template>
