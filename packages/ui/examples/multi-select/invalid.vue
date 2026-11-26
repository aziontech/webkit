<script setup>
  import Field from '@aziontech/webkit/field'
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectItem from '@aziontech/webkit/multi-select-item'
  import MultiSelectRoot from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import { computed, ref } from 'vue'

  const value = ref([])
  const regions = [
    { value: 'us-east', label: 'US East' },
    { value: 'us-west', label: 'US West' },
    { value: 'eu-central', label: 'EU Central' },
    { value: 'ap-southeast', label: 'Asia Pacific Southeast' }
  ]
  const invalid = computed(() => value.value.length === 0)
</script>

<template>
  <Field
    :invalid="invalid"
    class="w-full max-w-(--container-xs)"
  >
    <Field.Label>Regions</Field.Label>
    <MultiSelectRoot
      v-model="value"
      placeholder="Select regions"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <MultiSelectItem
          v-for="option in regions"
          :key="option.value"
          :value="option.value"
          >{{ option.label }}</MultiSelectItem
        >
      </MultiSelectContent>
    </MultiSelectRoot>
    <Field.Error v-if="invalid">Choose at least one region.</Field.Error>
  </Field>
</template>
