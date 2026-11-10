<script setup>
  import { computed, ref } from 'vue'
  import Field from '@aziontech/webkit/field'
  import Input from '@aziontech/webkit/input'

  const slug = ref('My Project')
  const invalid = computed(() => !/^[a-z0-9-]+$/.test(slug.value))
</script>

<template>
  <Field
    required
    :invalid="invalid"
    class="max-w-(--container-xs)"
  >
    <Field.Label>Project slug</Field.Label>
    <Input
      v-model="slug"
      :spellcheck="false"
      autocomplete="off"
    />
    <Field.Description>Used in the project URL.</Field.Description>
    <Field.Error v-if="invalid">Use lowercase letters, numbers and hyphens only.</Field.Error>
  </Field>
</template>
