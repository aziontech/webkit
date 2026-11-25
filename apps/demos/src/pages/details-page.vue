<script setup lang="ts">
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import { toast } from '@aziontech/webkit/toast'
  import { copyText } from '@aziontech/webkit/utils/clipboard'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleResource } from '../blocks/resource-detail.sample'
  import ResourceDetail, {
    type ResourceDetailResource,
    type ResourceDetailTab
  } from '../blocks/resource-detail.vue'
  import ResourceNotFound from '../components/resource-not-found.vue'
  import { findResource } from '../lib/store'

  const route = useRoute()
  const router = useRouter()
  const record = computed(() => findResource(route.params.id))
  const TABS: ResourceDetailTab[] = ['overview', 'versions', 'build', 'deployments']
  const requested = String(globalThis.history?.state?.tab ?? '') as ResourceDetailTab
  const selected = ref<ResourceDetailTab>(TABS.includes(requested) ? requested : 'overview')
  const tab = computed({
    get: () => selected.value,
    set: (value: ResourceDetailTab) => {
      if (value === 'settings' && record.value) router.push(`/resources/${record.value.id}/edit`)
      else selected.value = value
    }
  })

  const resource = computed<ResourceDetailResource | undefined>(() => {
    const found = record.value
    if (!found) return undefined
    return {
      ...sampleResource,
      name: found.name,
      domain: found.domain,
      status: found.status,
      statusSeverity: found.status === 'Live' ? 'success' : 'neutral',
      createdAt: found.createdAt,
      createdBy: found.owner,
      ...(found.deployed
        ? {}
        : { deploymentId: '', environment: '', framework: '', frameworkIcon: '' })
    }
  })

  const breadcrumb = computed(() => [
    { label: 'Resources', href: '/resources' },
    { label: resource.value?.name ?? 'Not found' }
  ])

  const onResourceAction = async (_event: Event, value: unknown) => {
    if (value === 'settings' && record.value) router.push(`/resources/${record.value.id}/edit`)
    if (value === 'copy-url' && resource.value) {
      if (await copyText(`https://${resource.value.domain}`))
        toast.success('URL copied.', { closable: true })
    }
  }
</script>

<template>
  <ConsoleLayout.Breadcrumb :items="breadcrumb" />
  <ResourceDetail
    v-if="resource"
    v-model:tab="tab"
    :resource="resource"
    @resource-action="onResourceAction"
    @connect-repository="tab = 'build'"
  />
  <ResourceNotFound
    v-else
    :id="String(route.params.id)"
  />
</template>
