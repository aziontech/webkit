<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

  import CreateDeployDrawer, {
    type DeployDrawerEnvironment,
    type DeployDrawerValues
  } from '../create-deploy-drawer.vue'
  import {
    sampleDefaultValues,
    sampleEnvironmentEntries,
    sampleEnvironmentReach,
    sampleLastUsedEnvironment,
    sampleResources
  } from '../sample'

  const RELOAD_MS = 600
  const RUN_MS = 3200
  const RUN_TOAST = 'deploy-drawer-environment-run'

  const initialValues: Partial<DeployDrawerValues> = {
    ...sampleDefaultValues,
    projectMode: 'existing',
    environment: 'Production'
  }

  const open = ref(false)
  const environment = ref('Production')
  const reloading = ref(false)
  const defaults = ref<Partial<DeployDrawerValues>>(initialValues)
  const deployed = ref<DeployDrawerValues | null>(null)

  let reloadTimer: ReturnType<typeof setTimeout> | undefined
  let runTimer: ReturnType<typeof setTimeout> | undefined

  const listFormat = (names: string[]) =>
    names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : (names[0] ?? '')

  const projectsLabel = (count: number) => `${count} ${count === 1 ? 'project' : 'projects'}`

  const reachOf = (name: string) => sampleEnvironmentReach[name]

  const current = computed(() => reachOf(environment.value))

  const deployEnvironments = (name: string) =>
    reachOf(name).groups.map((group) => group.environment)

  const alsoDeploys = computed(() =>
    deployEnvironments(environment.value).filter((name) => name !== environment.value)
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

  watch(environment, () => {
    clearTimeout(reloadTimer)
    reloading.value = true
    reloadTimer = setTimeout(() => {
      reloading.value = false
    }, RELOAD_MS)
  })

  watch(open, (isOpen) => {
    if (!isOpen) defaults.value = initialValues
  })

  const edit = () => {
    toast.dismiss(RUN_TOAST)
    if (deployed.value) defaults.value = deployed.value
    open.value = true
  }

  const startRun = () => {
    const values = deployed.value
    if (!values) return
    clearTimeout(runTimer)
    const service = sampleResources[0]
    const version =
      service.versions.find((entry) => entry.id === values.versions[service.key])?.name ?? ''
    const targets = listFormat(deployEnvironments(values.environment))
    const count = projectCount(values.environment)
    toast.loading('Deploying web-app…', {
      id: RUN_TOAST,
      description: `${version} to ${targets}. It keeps running if you leave.`
    })
    runTimer = setTimeout(() => {
      toast.success(`web-app is live in ${targets}.`, {
        id: RUN_TOAST,
        description: `${projectsLabel(count)} serve ${version} now.`,
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: edit },
          { label: 'Redeploy', onClick: startRun }
        ]
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
        :label="`${environment} deploys with ${current.settings}, which is also linked in ${listFormat(alsoDeploys)}, so this deployment goes live in ${deployEnvironments(environment).length} environments at once.`"
      />
    </template>
  </CreateDeployDrawer>
</template>
