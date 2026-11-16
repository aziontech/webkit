<script setup lang="ts">
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleResource } from '../blocks/resource-detail.sample'
  import ResourceDetail, {
    type ResourceDetailResource,
    type ResourceDetailTab
  } from '../blocks/resource-detail.vue'
  import { findResource } from '../lib/store'

  const route = useRoute()
  const router = useRouter()
  const record = computed(() => findResource(route.params.id))
  const TABS: ResourceDetailTab[] = ['overview', 'versions', 'build', 'deployments']
  const requested = String(globalThis.history?.state?.tab ?? '') as ResourceDetailTab
  const tab = ref<ResourceDetailTab>(TABS.includes(requested) ? requested : 'overview')

  const resource = computed<ResourceDetailResource>(() => {
    const found = record.value
    if (!found) return sampleResource
    return {
      ...sampleResource,
      name: found.name,
      domain: found.domain,
      status: found.status === 'Live' ? 'Ready' : 'Inactive',
      statusSeverity: found.status === 'Live' ? 'success' : 'neutral',
      createdAt: found.modifiedAt,
      createdBy: found.owner
    }
  })

  const breadcrumb = computed(() => [
    { label: 'Resources', href: '/resources' },
    { label: resource.value.name }
  ])

  const onResourceAction = async (_event: Event, value: unknown) => {
    if (value === 'settings' && record.value) router.push(`/resources/${record.value.id}/edit`)
    if (value === 'copy-url') {
      await globalThis.navigator.clipboard?.writeText(`https://${resource.value.domain}`)
      toast.success('URL copied.', { closable: true })
    }
  }
</script>

<template>
  <ConsoleLayout.Breadcrumb :items="breadcrumb" />
  <ResourceDetail
    v-model:tab="tab"
    :resource="resource"
    @resource-action="onResourceAction"
    @connect-repository="tab = 'build'"
  />
</template>
