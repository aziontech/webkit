<script setup>
  import { ref } from 'vue'
  import FieldSelect from '@aziontech/webkit/field-select'

  const country = ref('')
  const countries = [
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Brazil', label: 'Brazil' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Colombia', label: 'Colombia' },
    { value: 'Mexico', label: 'Mexico' }
  ]
</script>

<template>
  <div class="w-[320px]">
    <FieldSelect
      v-model="country"
      label="Country"
      placeholder="Choose a country"
      searchable
      search-placeholder="Search country"
      :options="countries"
    />
  </div>
</template>
