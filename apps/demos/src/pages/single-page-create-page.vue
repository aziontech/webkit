<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import CreatePage, { type CreatePageValues } from '../blocks/create-page.vue'
  import { createResource } from '../lib/store'

  const router = useRouter()
  const saving = ref(false)

  const onSubmit = (_event: Event, values: CreatePageValues) => {
    saving.value = true
    setTimeout(() => {
      const resource = createResource(values)
      saving.value = false
      toast.success(`${resource.name} was created.`, { closable: true })
      router.push(`/resources/${resource.id}`)
    }, 600)
  }
</script>

<template>
  <CreatePage
    :loading="saving"
    @submit="onSubmit"
    @cancel="router.push('/resources')"
  />
</template>
