<script setup>
  import Combobox from '@aziontech/webkit/combobox'
  import Field from '@aziontech/webkit/field'
  import { onBeforeUnmount, ref } from 'vue'

  const regions = [
    { value: 'sa-east', label: 'South America (São Paulo)' },
    { value: 'us-east', label: 'US East (Virginia)' },
    { value: 'us-west', label: 'US West (Oregon)' },
    { value: 'eu-west', label: 'Europe (Frankfurt)' },
    { value: 'ap-south', label: 'Asia Pacific (Singapore)' }
  ]

  const region = ref('')
  const options = ref(regions)
  const loading = ref(false)
  let timer

  const search = (text) => {
    clearTimeout(timer)
    loading.value = true
    timer = setTimeout(() => {
      const needle = text.trim().toLowerCase()
      options.value = regions.filter((item) => item.label.toLowerCase().includes(needle))
      loading.value = false
    }, 400)
  }

  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>Region</Field.Label>
    <Combobox
      v-model="region"
      :options="options"
      :filter="false"
      :allow-custom="false"
      :loading="loading"
      placeholder="Search regions"
      @search="search"
    />
    <Field.Description>Only listed regions are accepted.</Field.Description>
  </Field>
</template>
