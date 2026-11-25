<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'

  import { sampleNetworkLists } from '../blocks/network-lists.sample'
  import NetworkLists, { type NetworkListRow } from '../blocks/network-lists.vue'

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
    { value, list }: { value: unknown; list: NetworkListRow }
  ) => {
    if (value === 'duplicate') toast.success(`${list.name} was cloned.`, { closable: true })
    if (value === 'edit') toast.info(`Editing ${list.name} is not part of this mock.`)
  }
</script>

<template>
  <NetworkLists
    :lists="sampleNetworkLists"
    :loading="loading"
    @create="toast.info('Creating a network list is not part of this mock.')"
    @refresh="refresh"
    @retry="refresh"
    @row-action="onRowAction"
    @delete="(_event, list) => toast.success(`${list.name} was deleted.`, { closable: true })"
  />
</template>
