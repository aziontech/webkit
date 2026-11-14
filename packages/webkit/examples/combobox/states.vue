<script setup>
  import Combobox from '@aziontech/webkit/combobox'
  import { ref } from 'vue'

  const region = ref('us-east-1')
  const missing = ref('')
  const options = [{ value: 'us-east-1' }, { value: 'us-west-2' }, { value: 'eu-west-1' }]
</script>

<template>
  <div class="flex max-w-(--container-xs) flex-col gap-(--spacing-sm)">
    <Combobox
      v-model="region"
      :options="options"
      aria-label="Region (disabled)"
      disabled
    />
    <Combobox
      v-model="missing"
      :options="options"
      aria-label="Region (invalid)"
      invalid
    />
    <Combobox
      v-model="missing"
      :options="[]"
      aria-label="Region (loading)"
      loading
    />
  </div>
</template>
