<script setup>
  import Combobox from '@aziontech/ui/combobox'
  import Field from '@aziontech/ui/field'
  import { ref } from 'vue'

  const region = ref('us-east-1')
  const missing = ref('')
  const options = [{ value: 'us-east-1' }, { value: 'us-west-2' }, { value: 'eu-west-1' }]
</script>

<template>
  <div class="flex max-w-(--container-xs) flex-col gap-(--spacing-sm)">
    <Field disabled>
      <Field.Label>Region</Field.Label>
      <Combobox
        v-model="region"
        :options="options"
      />
    </Field>
    <Field invalid>
      <Field.Label>Region</Field.Label>
      <Combobox
        v-model="missing"
        :options="options"
        placeholder="Select a region"
      />
      <Field.Error>Choose a region.</Field.Error>
    </Field>
    <Field>
      <Field.Label>Region</Field.Label>
      <Combobox
        v-model="missing"
        :options="[]"
        loading
      />
    </Field>
  </div>
</template>
