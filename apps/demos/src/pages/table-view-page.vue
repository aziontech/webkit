<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import TableView, { type TableViewResource } from '../blocks/table-view.vue'
  import { deleteResource, resources } from '../lib/store'

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
  }

  const onDelete = (_event: Event, resource: TableViewResource) => {
    deleteResource(resource.id)
    toast.success(`${resource.name} was deleted.`, { closable: true })
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
    @delete="onDelete"
  />
</template>
