<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import { computed, ref, useId, watch } from 'vue'

  import BuildItem from './parts/build-item.vue'
  import DeployDrawerFrame from './parts/deploy-drawer-frame.vue'
  import DeployLoading from './parts/deploy-loading.vue'
  import DeployResourcesCard from './parts/deploy-resources-card.vue'
  import EnvironmentChoices from './parts/environment-choices.vue'
  import ImpactedProjects from './parts/impacted-projects.vue'
  import ProjectCard from './parts/project-card.vue'
  import {
    sampleDefaultValues,
    sampleEnvironments,
    sampleImpacted,
    sampleNewProject,
    sampleProjectGroups,
    sampleResources
  } from './sample'
  import type {
    DeployDrawerBuild,
    DeployDrawerDependency,
    DeployDrawerEnvironment,
    DeployDrawerImpact,
    DeployDrawerProject,
    DeployDrawerProjectGroup,
    DeployDrawerProjectMode,
    DeployDrawerResource,
    DeployDrawerValues,
    DeployDrawerVersion
  } from './types'

  export type {
    DeployDrawerBuild,
    DeployDrawerDependency,
    DeployDrawerDomainGroup,
    DeployDrawerEnvironment,
    DeployDrawerExistingProject,
    DeployDrawerImpact,
    DeployDrawerImpactedProject,
    DeployDrawerProject,
    DeployDrawerProjectGroup,
    DeployDrawerProjectMode,
    DeployDrawerResource,
    DeployDrawerValues,
    DeployDrawerVersion
  } from './types'

  export interface DeployDrawerProps {
    /** The resources and their dependencies. Left out, the sample renders. */
    resources?: DeployDrawerResource[]
    /** The projects to pick from, in groups. Left out, the sample renders. */
    projectGroups?: DeployDrawerProjectGroup[]
    /** The project Create new makes. Left out, the sample renders. */
    newProject?: DeployDrawerProject
    /** The environments to go live in. Left out, the sample renders. */
    environments?: DeployDrawerEnvironment[]
    /** The projects reached through shared Deployment Settings. Left out, the sample renders. */
    impacted?: DeployDrawerImpact[]
    /** The values the form opens with; every open resets to them. */
    defaultValues?: Partial<DeployDrawerValues>
    /** A build in progress: it replaces the resources and the rest waits, inert. */
    build?: DeployDrawerBuild
    /** The deploy targets are loading; skeletons stand in for the sections. */
    loading?: boolean
    /** Why the deploy targets could not load; a danger alert with Retry replaces the sections. */
    error?: string
    /** Opens every Dependencies disclosure when the drawer opens. */
    dependenciesOpen?: boolean
    /** Keys of the resources whose dependencies are reloading; skeleton rows stand in and Deploy waits. */
    dependenciesLoadingKeys?: string[]
    /** The projects impacted are reloading; skeleton rows stand in and Deploy waits. */
    impactedLoading?: boolean
    /** Why Deploy cannot run, said in the footer; empty leaves Deploy to the other states. */
    blocker?: string
  }

  const props = withDefaults(defineProps<DeployDrawerProps>(), {
    resources: undefined,
    projectGroups: undefined,
    newProject: undefined,
    environments: undefined,
    impacted: undefined,
    defaultValues: undefined,
    build: undefined,
    loading: false,
    error: '',
    dependenciesOpen: false,
    dependenciesLoadingKeys: () => [],
    impactedLoading: false,
    blocker: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: DeployDrawerValues]
    retry: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  /** The picked version id per resource key; every open resets it to defaultValues. */
  const picks = defineModel<Record<string, string>>('versions', { default: () => ({}) })

  /** The environment it goes live in; every open resets it to defaultValues. */
  const environment = defineModel<string>('environment', { default: '' })

  defineSlots<{
    /** Alerts under the environment choices, for what the chosen environment changes. */
    'environment-alerts'(props: { environment: string; project: DeployDrawerProject }): unknown
  }>()

  const pending = computed(() => props.loading || props.error !== '')
  const resources = computed<DeployDrawerResource[]>(
    () => props.resources ?? (pending.value ? [] : sampleResources)
  )
  const projectGroups = computed<DeployDrawerProjectGroup[]>(
    () => props.projectGroups ?? (pending.value ? [] : sampleProjectGroups)
  )
  const newProject = computed<DeployDrawerProject>(
    () => props.newProject ?? (pending.value ? { name: '' } : sampleNewProject)
  )
  const environmentChoices = computed<DeployDrawerEnvironment[]>(
    () => props.environments ?? (pending.value ? [] : sampleEnvironments)
  )
  const impacted = computed<DeployDrawerImpact[]>(
    () => props.impacted ?? (pending.value ? [] : sampleImpacted)
  )
  const initial = computed<DeployDrawerValues>(() => ({
    versions: {},
    projectMode: 'existing',
    projectId: '',
    environment: environmentChoices.value[0]?.name ?? '',
    ...(props.defaultValues ?? (props.resources ? {} : sampleDefaultValues))
  }))

  type Dependency = DeployDrawerDependency
  type ProjectView = DeployDrawerProject

  picks.value = { ...initial.value.versions }
  environment.value = initial.value.environment
  const projectMode = ref<DeployDrawerProjectMode>(initial.value.projectMode)
  const projectId = ref(initial.value.projectId)

  const project = computed<ProjectView>(() =>
    projectMode.value === 'new'
      ? newProject.value
      : (projectGroups.value
          .flatMap((group) => group.projects)
          .find((entry) => entry.id === projectId.value) ??
        projectGroups.value[0]?.projects[0] ?? { name: '' })
  )

  const versionOf = (row: Dependency): DeployDrawerVersion | undefined =>
    row.versions.find((entry) => entry.id === picks.value[row.key]) ?? row.versions[0]

  const liveVersionId = (row: Dependency) =>
    (row.versions.find((entry) => entry.active) ?? row.versions[0])?.id ?? ''

  const changeCount = computed(
    () =>
      resources.value
        .flatMap((row) => [row, ...row.dependencies])
        .filter((row) => row.versions.length && versionOf(row)?.id !== liveVersionId(row)).length
  )

  const changeSummary = computed(
    () =>
      `${changeCount.value} ${changeCount.value === 1 ? 'change goes' : 'changes go'} live in ${environment.value}.`
  )

  const blockerId = useId()

  const reset = () => {
    const values = initial.value
    picks.value = { ...values.versions }
    projectMode.value = values.projectMode
    projectId.value = values.projectId
    environment.value = values.environment
  }

  watch(open, (isOpen) => {
    if (isOpen) reset()
  })

  const blocked = computed(
    () =>
      pending.value ||
      !!props.build ||
      !!props.blocker ||
      props.impactedLoading ||
      props.dependenciesLoadingKeys.length > 0
  )

  const title = computed(() => (props.build ? 'Build and deployment' : 'Deploy'))

  const submit = (event: Event) => {
    if (blocked.value) return
    emit('submit', event, {
      versions: Object.fromEntries(
        resources.value
          .flatMap((row) => [row, ...row.dependencies])
          .filter((row) => row.versions.length)
          .map((row) => [row.key, versionOf(row)?.id ?? ''])
      ),
      projectMode: projectMode.value,
      projectId: project.value.id ?? '',
      environment: environment.value
    })
    open.value = false
  }
</script>

<template>
  <DeployDrawerFrame
    v-model:open="open"
    :title="title"
    :blocked="blocked"
    :reason-id="blocker ? blockerId : ''"
    @submit="submit"
  >
    <DeployLoading v-if="loading" />

    <SettingsGroup
      v-else-if="error"
      label="Deploy targets"
    >
      <div class="flex min-w-0 flex-col items-start gap-(--spacing-sm)">
        <Alert
          severity="danger"
          :label="error"
        />
        <Button
          label="Retry"
          variant="outline"
          size="small"
          icon="az az-refresh"
          @click="(event: MouseEvent) => emit('retry', event)"
        />
      </div>
    </SettingsGroup>

    <fieldset
      v-else
      class="m-0 flex min-w-0 flex-col border-0 p-0"
    >
      <legend class="sr-only">{{ title }}</legend>
      <SettingsGroup
        label="Resources"
        hint="The service version this deployment sends live, and the version of every module and integration it references."
      >
        <BuildItem
          v-if="build"
          :build="build"
        />
        <DeployResourcesCard
          v-else
          v-model:picks="picks"
          :resources="resources"
          :dependencies-open="dependenciesOpen"
          :dependencies-loading-keys="dependenciesLoadingKeys"
        />
      </SettingsGroup>

      <div
        :inert="!!build || undefined"
        :data-pending="build ? 'true' : undefined"
        class="mt-(--layout-section-gap) flex min-w-0 flex-col data-[pending]:opacity-50"
      >
        <SettingsGroup
          label="Project"
          hint="The project whose domains serve the service. Create one to deploy it on a new domain."
        >
          <ProjectCard
            v-model:project-mode="projectMode"
            v-model:project-id="projectId"
            :project="project"
            :project-groups="projectGroups"
          />
        </SettingsGroup>

        <SettingsGroup
          label="Environment"
          hint="Where the deployment goes live, from the environments this project serves. Each one goes live with the Deployment Settings set on the project."
        >
          <EnvironmentChoices
            v-model="environment"
            :environments="environmentChoices"
            name="service-deploy-environment"
          />

          <slot
            name="environment-alerts"
            :environment="environment"
            :project="project"
          />
        </SettingsGroup>

        <SettingsGroup
          v-if="impacted.length"
          label="Projects impacted"
          hint="This environment deploys with shared Deployment Settings, so the deployment reaches every project below, in every environment they are linked to, and the domains they serve."
        >
          <ImpactedProjects
            :impacted="impacted"
            :loading="impactedLoading"
          />
        </SettingsGroup>
      </div>

      <span
        class="sr-only"
        role="status"
      >
        {{ impactedLoading ? 'Loading the projects this deployment reaches' : '' }}
      </span>
    </fieldset>
    <template #footer-start>
      <p
        v-if="blocker"
        :id="blockerId"
        class="flex min-w-0 items-start gap-(--spacing-xs) text-body-sm text-(--warning-foreground)"
      >
        <i
          class="az az-triangle-alert mt-0.5 shrink-0 text-body-xs"
          aria-hidden="true"
        />
        <span>{{ blocker }}</span>
      </p>
      <p
        v-else-if="changeCount && !build"
        class="flex min-w-0 items-center gap-(--spacing-2xs) text-body-xs text-(--text-muted)"
      >
        <i
          class="az az-circle-info shrink-0"
          aria-hidden="true"
        />
        <span class="truncate">{{ changeSummary }}</span>
      </p>
      <span v-else />
    </template>
  </DeployDrawerFrame>
</template>
