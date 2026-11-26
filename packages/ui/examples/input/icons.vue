<script setup>
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const leading = ref('')
  const trailing = ref('')
  const both = ref('')
</script>

<template>
  <div class="flex w-full max-w-(--container-xs) flex-col items-stretch gap-(--spacing-md)">
    <Field>
      <Field.Label>Domain</Field.Label>
      <Input
        v-model="leading"
        placeholder="example.com"
      >
        <template #leading>
          <i class="az az-globe" />
        </template>
      </Input>
    </Field>
    <Field>
      <Field.Label>Search</Field.Label>
      <Input v-model="trailing">
        <template #trailing>
          <i class="az az-search" />
        </template>
      </Input>
    </Field>
    <Field>
      <Field.Label>Find a domain</Field.Label>
      <Input
        v-model="both"
        placeholder="example.com"
      >
        <template #leading>
          <i class="az az-globe" />
        </template>
        <template #trailing>
          <i class="az az-search" />
        </template>
      </Input>
    </Field>
  </div>
</template>
