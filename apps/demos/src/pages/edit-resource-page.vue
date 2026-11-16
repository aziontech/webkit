<script setup lang="ts">
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleProject } from '../blocks/edit-resource.sample'
  import EditResource, { type EditResourceProject } from '../blocks/edit-resource.vue'
  import { findResource, updateResource } from '../lib/store'

  const route = useRoute()
  const router = useRouter()
  const record = findResource(route.params.id)
  const saving = ref(false)

  const project = ref<EditResourceProject>({
    ...sampleProject,
    name: record?.name ?? sampleProject.name,
    active: record ? record.status === 'Live' : sampleProject.active
  })

  const breadcrumb = computed(() => [
    { label: 'Resources', href: '/resources' },
    {
      label: record?.name ?? project.value.name,
      href: record ? `/resources/${record.id}` : undefined
    }
  ])

  const onSubmit = (_event: Event, values: EditResourceProject) => {
    saving.value = true
    setTimeout(() => {
      project.value = values
      saving.value = false
      if (!record) return
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
    :resource="project"
    :loading="saving"
    @submit="onSubmit"
  />
</template>
