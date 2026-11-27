<script setup lang="ts">
  import { toast } from '@aziontech/ui/toast'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import TableView, { type TableViewResource } from '../blocks/table-view.vue'
  import { cloneResource, resources } from '../lib/store'

  const router = useRouter()
  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined

  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const onRowAction = (
    _event: Event,
    { value, resource }: { value: unknown; resource: TableViewResource }
  ) => {
    if (value === 'view') router.push(`/resources/${resource.id}`)
    if (value === 'deploy') router.push(`/resources/${resource.id}/deploy`)
    if (value === 'delete') router.push(`/resources/${resource.id}/delete`)
    if (value === 'duplicate') {
      const copy = cloneResource(resource.id)
      if (copy) toast.success(`${copy.name} was created from ${resource.name}.`, { closable: true })
    }
  }
</script>

<template>
  <TableView
    :resources="resources"
    :loading="loading"
    @create="router.push('/resources/new')"
    @refresh="refresh"
    @retry="refresh"
    @row-action="onRowAction"
  />
</template>
