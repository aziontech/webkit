<script setup lang="ts">
  import ConsoleLayout from '@aziontech/ui/console-layout'
  import { toast } from '@aziontech/ui/toast'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleProject } from '../blocks/edit-resource.sample'
  import EditResource, { type EditResourceProject } from '../blocks/edit-resource.vue'
  import ResourceNotFound from '../components/resource-not-found.vue'
  import { findResource, updateResource } from '../lib/store'

  const route = useRoute()
  const router = useRouter()
  const record = findResource(route.params.id)
  const saving = ref(false)

  const project = ref<EditResourceProject>({
    ...sampleProject,
    name: record?.name ?? '',
    active: record?.status === 'Live'
  })

  const tab = computed({
    get: () => 'main-settings',
    set: (value: string) => {
      if (value === 'main-settings' || !record) return
      router.push({ path: `/resources/${record.id}`, state: { tab: value } })
    }
  })

  const breadcrumb = computed(() => [
    { label: 'Resources', href: '/resources' },
    record ? { label: record.name, href: `/resources/${record.id}` } : { label: 'Not found' }
  ])

  const onSubmit = (_event: Event, values: EditResourceProject) => {
    if (!record) return
    saving.value = true
    setTimeout(() => {
      project.value = values
      saving.value = false
      updateResource(record.id, {
        name: values.name.trim(),
        status: values.active ? 'Live' : 'Inactive'
      })
      toast.success(`${values.name.trim()} was saved.`, { closable: true })
      router.push(`/resources/${record.id}`)
    }, 900)
  }
</script>

<template>
  <ConsoleLayout.Breadcrumb :items="breadcrumb" />
  <EditResource
    v-if="record"
    v-model:tab="tab"
    :resource="project"
    :loading="saving"
    @submit="onSubmit"
  />
  <ResourceNotFound
    v-else
    :id="String(route.params.id)"
  />
</template>
