<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import { computed, ref } from 'vue'

  import { useDeployRun } from '../composables/use-deploy-run'
  import { useReloadFlag } from '../composables/use-reload-flag'
  import CreateDeployDrawer, {
    type DeployDrawerEnvironment,
    type DeployDrawerValues
  } from '../create-deploy-drawer.vue'
  import { listFormat } from '../lib/list-format'
  import {
    sampleDefaultValues,
    sampleEnvironmentEntries,
    sampleEnvironmentReach,
    sampleLastUsedEnvironment,
    sampleResources
  } from '../sample'

  const initialValues: Partial<DeployDrawerValues> = {
    ...sampleDefaultValues,
    projectMode: 'existing',
    environment: 'Production'
  }

  const open = ref(false)
  const environment = ref('Production')
  const defaults = ref<Partial<DeployDrawerValues>>(initialValues)

  const projectsLabel = (count: number) => `${count} ${count === 1 ? 'project' : 'projects'}`

  const versionOf = (values: DeployDrawerValues) => {
    const service = sampleResources[0]
    return service.versions.find((entry) => entry.id === values.versions[service.key])?.name ?? ''
  }

  const reachOf = (name: string) => sampleEnvironmentReach[name]

  const current = computed(() => reachOf(environment.value))

  const deployEnvironments = (name: string) =>
    reachOf(name).groups.map((group) => group.environment)

  const alsoDeploys = computed(() =>
    deployEnvironments(environment.value).filter((name) => name !== environment.value)
  )

  const sharedSettingsLabel = computed(
    () =>
      `${environment.value} deploys with ${current.value.settings}, ` +
      `which is also linked in ${listFormat(alsoDeploys.value)}, ` +
      `so this deployment goes live in ${deployEnvironments(environment.value).length} environments at once.`
  )

  const projectCount = (name: string) =>
    reachOf(name).groups.reduce((total, group) => total + group.projects.length, 0)

  const shared = computed(() => projectCount(environment.value) > 1)

  const environmentChoices = computed(() =>
    sampleEnvironmentEntries.map((entry): DeployDrawerEnvironment => {
      if (entry.lock)
        return {
          name: entry.name,
          description: entry.lock,
          tag: 'Strict',
          tagSeverity: 'neutral',
          disabled: true
        }
      if (alsoDeploys.value.includes(entry.name))
        return { ...entry, tag: 'Also deploys', tagSeverity: 'warning' }
      return {
        ...entry,
        tag: entry.name === sampleLastUsedEnvironment ? 'Last used' : '',
        tagSeverity: 'info'
      }
    })
  )

  const reloading = useReloadFlag(environment)

  const { onSubmit } = useDeployRun({
    toastId: 'deploy-drawer-environment-run',
    open,
    defaults,
    initialValues,
    start: (values) => ({
      title: 'Deploying web-app…',
      description: `${versionOf(values)} to ${listFormat(deployEnvironments(values.environment))}. It keeps running if you leave.`
    }),
    finish: (values) => ({
      status: 'success',
      title: `web-app is live in ${listFormat(deployEnvironments(values.environment))}.`,
      description: `${projectsLabel(projectCount(values.environment))} serve ${versionOf(values)} now.`
    })
  })
</script>

<template>
  <CreateDeployDrawer
    v-model:open="open"
    v-model:environment="environment"
    :default-values="defaults"
    :environments="environmentChoices"
    :impacted="shared ? current.groups : []"
    :impacted-loading="reloading"
    @submit="onSubmit"
  >
    <template #environment-alerts="{ project }">
      <Alert
        v-if="current.replaced"
        severity="info"
        size="small"
        :label="`${project.name} serves ${current.replaced} in ${environment}. Its Deployment Settings are Flexible, so this deployment replaces ${current.replaced} with web-app there.`"
      />

      <Alert
        v-if="!reloading && alsoDeploys.length"
        key="alert-2"
        severity="warning"
        size="small"
        :label="sharedSettingsLabel"
      />
    </template>
  </CreateDeployDrawer>
</template>
