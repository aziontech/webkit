<script setup lang="ts">
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import { toast } from '@aziontech/webkit/toast'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleError, sampleFailedSteps, sampleRunningSteps } from '../blocks/async-submit.sample'
  import AsyncSubmit, { type AsyncSubmitStep } from '../blocks/async-submit.vue'
  import { run, RUN_TOAST, startDeploy } from '../lib/deploy'
  import { findResource } from '../lib/store'

  const route = useRoute()
  const router = useRouter()
  const resource = computed(() => findResource(route.params.id))
  const name = computed(() => resource.value?.name ?? 'web-app')

  const breadcrumb = computed(() => [
    { label: 'Resources', href: '/resources' },
    {
      label: name.value,
      href: resource.value ? `/resources/${resource.value.id}` : undefined
    },
    { label: 'Deploy' }
  ])

  const status = computed(() => (run.resourceId === resource.value?.id ? run.status : 'idle'))

  const finishedSteps: AsyncSubmitStep[] = sampleRunningSteps.map((step) => ({
    ...step,
    status: 'success'
  }))

  const steps = computed<AsyncSubmitStep[]>(() => {
    if (status.value === 'running') return sampleRunningSteps
    if (status.value === 'error') return sampleFailedSteps
    if (status.value === 'success') return finishedSteps
    return []
  })

  const deployment = computed(() =>
    status.value === 'success' ? { domain: run.domain, attempts: 1 } : undefined
  )

  const deploy = () => {
    if (resource.value) startDeploy(resource.value)
  }

  const edit = () => {
    toast.dismiss(RUN_TOAST)
    router.push(`/resources/${resource.value?.id}/edit`)
  }
</script>

<template>
  <ConsoleLayout.Breadcrumb :items="breadcrumb" />
  <AsyncSubmit
    :name="name"
    :loading="status === 'running'"
    :error="status === 'error' ? sampleError : ''"
    :deployment="deployment"
    :steps="steps"
    @deploy="deploy"
    @redeploy="deploy"
    @edit="edit"
    @open-service="router.push(`/resources/${resource?.id}`)"
  />
</template>
