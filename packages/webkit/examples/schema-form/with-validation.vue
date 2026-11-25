<script setup>
  import Button from '@aziontech/webkit/button'
  import SchemaForm from '@aziontech/webkit/schema-form'
  import { ref } from 'vue'

  const schema = {
    type: 'object',
    required: ['name', 'origin'],
    properties: {
      name: {
        type: 'string',
        title: 'Name',
        description: 'Lowercase letters, numbers and hyphens.',
        pattern: '^[a-z0-9-]+$',
        minLength: 3
      },
      origin: {
        type: 'object',
        title: 'Origin',
        description: 'Where requests go when the cache misses.',
        required: ['host'],
        properties: {
          host: { type: 'string', title: 'Host', default: 'origin.example.com' },
          port: { type: 'integer', title: 'Port', minimum: 1, maximum: 65535, default: 443 }
        }
      }
    }
  }

  const value = ref({ name: 'shop' })
  const formEl = ref(null)
  const saving = ref(false)
  const serverErrors = ref({})

  const save = async () => {
    const { valid } = await formEl.value.validate()
    if (!valid) return
    saving.value = true
    setTimeout(() => {
      saving.value = false
      serverErrors.value = { 'origin.host': 'This host does not answer on the chosen port.' }
    }, 600)
  }
</script>

<template>
  <form
    class="flex w-full max-w-(--container-sm) flex-col gap-(--spacing-lg)"
    novalidate
    :aria-busy="saving || undefined"
    @submit.prevent="save"
  >
    <SchemaForm
      ref="formEl"
      v-model="value"
      :schema="schema"
      :errors="serverErrors"
      :readonly="saving"
      validate-on="submit"
    />
    <div class="flex justify-end">
      <Button
        type="submit"
        label="Save"
        variant="primary"
        size="medium"
        :loading="saving"
      />
    </div>
  </form>
</template>
