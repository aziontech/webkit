<script setup lang="ts">
  import { computed, ref } from 'vue'

  import { useDeployRun } from '../composables/use-deploy-run'
  import { useReloadFlag } from '../composables/use-reload-flag'
  import CreateDeployDrawer, { type DeployDrawerValues } from '../create-deploy-drawer.vue'
  import {
    sampleDefaultValues,
    sampleDependencyResources,
    sampleNewProject,
    sampleProjectGroups
  } from '../sample'

  const SERVICE_VERSION = 'AG1VVDJP'

  const initialValues: Partial<DeployDrawerValues> = {
    ...sampleDefaultValues,
    versions: { service: SERVICE_VERSION },
    projectMode: 'existing',
    environment: 'Production'
  }

  const open = ref(false)
  const versions = ref<Record<string, string>>({ service: SERVICE_VERSION })
  const defaults = ref<Partial<DeployDrawerValues>>(initialValues)

  const serviceVersion = computed(() => versions.value.service ?? SERVICE_VERSION)

  const resources = computed(() => sampleDependencyResources(serviceVersion.value))

  const serviceDependencies = computed(() => resources.value[0].dependencies)

  const reloading = useReloadFlag(
    serviceVersion,
    (next, previous) => Boolean(previous) && next !== previous
  )

  const blocker = computed(() => {
    if (reloading.value) return ''
    const missing = serviceDependencies.value.find(
      (dependency) => !dependency.note && !dependency.versions.length
    )
    return missing
      ? `${missing.name} has no ready version. Pick another service version, or build ${missing.name} first.`
      : ''
  })

  const projectName = (values: DeployDrawerValues) =>
    values.projectMode === 'new'
      ? sampleNewProject.name
      : (sampleProjectGroups
          .flatMap((group) => group.projects)
          .find((entry) => entry.id === values.projectId)?.name ?? '')

  const versionName = (id: string | undefined, list: { id: string; name: string }[]) =>
    list.find((entry) => entry.id === id)?.name ?? list[0]?.name ?? ''

  const serviceName = (values: DeployDrawerValues) =>
    versionName(values.versions[resources.value[0].key], resources.value[0].versions)

  const { onSubmit } = useDeployRun({
    toastId: 'deploy-drawer-dependencies-run',
    open,
    defaults,
    initialValues,
    start: (values) => ({
      title: 'Deploying web-app…',
      description: `${serviceName(values)} with ${serviceDependencies.value.length} dependencies to ${values.environment}. It keeps running if you leave.`
    }),
    finish: (values, attempt) => {
      const gateway = serviceDependencies.value[0]
      return attempt === 1
        ? {
            status: 'error',
            title: "web-app wasn't deployed.",
            description: `auth-gateway ${versionName(values.versions[gateway.key], gateway.versions)} failed its health check. Nothing changed in ${values.environment}.`
          }
        : {
            status: 'success',
            title: `web-app is live in ${values.environment}.`,
            description: `${serviceName(values)} and its dependencies serve ${projectName(values)} now.`
          }
    }
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
