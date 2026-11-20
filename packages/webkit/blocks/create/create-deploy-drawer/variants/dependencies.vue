<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

  import CreateDeployDrawer, { type DeployDrawerValues } from '../create-deploy-drawer.vue'
  import {
    sampleDefaultValues,
    sampleDependencyResources,
    sampleNewProject,
    sampleProjectGroups
  } from '../sample'

  const RELOAD_MS = 600
  const RUN_MS = 3200
  const RUN_TOAST = 'deploy-drawer-dependencies-run'
  const SERVICE_VERSION = 'AG1VVDJP'

  const initialValues: Partial<DeployDrawerValues> = {
    ...sampleDefaultValues,
    versions: { service: SERVICE_VERSION },
    projectMode: 'existing',
    environment: 'Production'
  }

  const open = ref(false)
  const versions = ref<Record<string, string>>({ service: SERVICE_VERSION })
  const reloading = ref(false)
  const defaults = ref<Partial<DeployDrawerValues>>(initialValues)
  const deployed = ref<DeployDrawerValues | null>(null)

  let reloadTimer: ReturnType<typeof setTimeout> | undefined
  let runTimer: ReturnType<typeof setTimeout> | undefined
  let attempts = 0

  const serviceVersion = computed(() => versions.value.service ?? SERVICE_VERSION)

  const resources = computed(() => sampleDependencyResources(serviceVersion.value))

  const serviceDependencies = computed(() => resources.value[0].dependencies)

  const blocker = computed(() => {
    if (reloading.value) return ''
    const missing = serviceDependencies.value.find(
      (dependency) => !dependency.note && !dependency.versions.length
    )
    return missing
      ? `${missing.name} has no ready version. Pick another service version, or build ${missing.name} first.`
      : ''
  })

  watch(serviceVersion, (next, previous) => {
    if (!previous || next === previous) return
    clearTimeout(reloadTimer)
    reloading.value = true
    reloadTimer = setTimeout(() => {
      reloading.value = false
    }, RELOAD_MS)
  })

  watch(open, (isOpen) => {
    if (!isOpen) defaults.value = initialValues
  })

  const projectName = (values: DeployDrawerValues) =>
    values.projectMode === 'new'
      ? sampleNewProject.name
      : (sampleProjectGroups
          .flatMap((group) => group.projects)
          .find((entry) => entry.id === values.projectId)?.name ?? '')

  const edit = () => {
    toast.dismiss(RUN_TOAST)
    if (deployed.value) defaults.value = deployed.value
    open.value = true
  }

  const startRun = () => {
    const values = deployed.value
    if (!values) return
    clearTimeout(runTimer)
    attempts += 1
    const service = resources.value[0]
    const versionName = (id: string | undefined, list: { id: string; name: string }[]) =>
      list.find((entry) => entry.id === id)?.name ?? list[0]?.name ?? ''
    const serviceName = versionName(values.versions[service.key], service.versions)
    const dependencies = serviceDependencies.value
    const gateway = dependencies[0]
    const actions = [
      { label: 'Edit', onClick: edit },
      { label: 'Redeploy', onClick: startRun }
    ]
    toast.loading('Deploying web-app…', {
      id: RUN_TOAST,
      description: `${serviceName} with ${dependencies.length} dependencies to ${values.environment}. It keeps running if you leave.`
    })
    runTimer = setTimeout(() => {
      if (attempts === 1) {
        toast.error("web-app wasn't deployed.", {
          id: RUN_TOAST,
          description: `auth-gateway ${versionName(values.versions[gateway.key], gateway.versions)} failed its health check. Nothing changed in ${values.environment}.`,
          duration: 0,
          closable: true,
          actions
        })
        return
      }
      toast.success(`web-app is live in ${values.environment}.`, {
        id: RUN_TOAST,
        description: `${serviceName} and its dependencies serve ${projectName(values)} now.`,
        duration: 0,
        closable: true,
        actions
      })
    }, RUN_MS)
  }

  const onSubmit = (_event: Event, values: DeployDrawerValues) => {
    deployed.value = values
    startRun()
  }

  onBeforeUnmount(() => {
    clearTimeout(reloadTimer)
    clearTimeout(runTimer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <CreateDeployDrawer
    v-model:open="open"
    v-model:versions="versions"
    :default-values="defaults"
    :resources="resources"
    :blocker="blocker"
    :dependencies-loading-keys="reloading ? ['service'] : []"
    dependencies-open
    @submit="onSubmit"
  />
</template>
