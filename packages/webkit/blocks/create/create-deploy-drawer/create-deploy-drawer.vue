<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Separator from '@aziontech/webkit/separator'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import {
    sampleDefaultValues,
    sampleEnvironments,
    sampleImpacted,
    sampleNewProject,
    sampleProjectGroups,
    sampleResources
  } from './sample'

  /** One Ready version of a resource. */
  export interface DeployDrawerVersion {
    /** Stable key, the version id. */
    id: string
    /** The version name. */
    name: string
    /** Who built it. */
    author: string
    /** When it was built, already phrased (1 day ago). */
    createdAgo: string
    /** Whether it is the version live now. */
    active?: boolean
  }

  /** A resource the deployment sends live, or one it references. */
  export interface DeployDrawerDependency {
    /** Stable key; picked versions are keyed by it. */
    key: string
    /** The kind of resource (Service, Module, Integration). */
    label: string
    /** The resource name. */
    name: string
    /** The kind glyph, an icon class. */
    icon: string
    /** A note shown instead of the version picker; empty for a pickable resource. */
    note: string
    /** How many Ready versions exist; the list may hold only the most recent. */
    total: number
    /** The most recent Ready versions, newest first. */
    versions: DeployDrawerVersion[]
  }

  /** A top-level resource with the resources it references. */
  export interface DeployDrawerResource extends DeployDrawerDependency {
    /** Whether the project owns it. */
    owner: boolean
    /** The modules and integrations it references. */
    dependencies: DeployDrawerDependency[]
  }

  /** The domains of a project in one environment. */
  export interface DeployDrawerDomainGroup {
    /** The environment they answer in. */
    environment: string
    /** How many domains there are. */
    total: number
    /** The count, already phrased (10 of 22 domains). */
    summary: string
    /** The first domains. */
    domains: string[]
  }

  /** A project the deployment can go live on. */
  export interface DeployDrawerProject {
    /** Stable key; absent for the project Create new makes. */
    id?: string
    /** The project name. */
    name: string
    /** The domain a new project answers on. */
    domain?: string
    /** One line on what the project serves. */
    detail?: string
    /** Its domains per environment. */
    domains?: DeployDrawerDomainGroup[]
  }

  /** A project that already exists. */
  export interface DeployDrawerExistingProject extends DeployDrawerProject {
    /** Stable key. */
    id: string
  }

  /** A group of projects in the project picker. */
  export interface DeployDrawerProjectGroup {
    /** Stable key. */
    key: string
    /** The group heading. */
    label: string
    /** The projects in it. */
    projects: DeployDrawerExistingProject[]
  }

  /** An environment the deployment can go live in. */
  export interface DeployDrawerEnvironment {
    /** The environment name, also its value. */
    name: string
    /** One sentence on what deploying there does. */
    description: string
    /** A short tag beside the name (Last used); empty for none. */
    tag: string
  }

  /** A project the deployment reaches through shared Deployment Settings. */
  export interface DeployDrawerImpactedProject {
    /** Stable key. */
    id: string
    /** The project name. */
    name: string
    /** Whether it is the project picked above. */
    selected?: boolean
    /** Its domains per environment. */
    domains: DeployDrawerDomainGroup[]
  }

  /** The projects reached in one environment. */
  export interface DeployDrawerImpact {
    /** The environment name. */
    environment: string
    /** The projects reached there. */
    projects: DeployDrawerImpactedProject[]
  }

  /** A build in progress before the deployment can go live. */
  export interface DeployDrawerBuild {
    /** The resource being built. */
    name: string
    /** The version being built. */
    version: string
    /** Seconds since the build started. */
    elapsed: number
  }

  /** Whether the deployment uses an existing project or creates one. */
  export type DeployDrawerProjectMode = 'existing' | 'new'

  /** What the form holds, and what submit sends. */
  export interface DeployDrawerValues {
    /** The picked version id per resource key. */
    versions: Record<string, string>
    /** Use an existing project or create one. */
    projectMode: DeployDrawerProjectMode
    /** The existing project picked. */
    projectId: string
    /** The environment it goes live in. */
    environment: string
  }

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
    error: ''
  })

  const emit = defineEmits<{
    submit: [event: Event, values: DeployDrawerValues]
    retry: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: false })

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

  const projectModes = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]

  type Dependency = DeployDrawerDependency
  type ProjectView = DeployDrawerProject

  const picks = reactive<Record<string, string>>({ ...initial.value.versions })
  const versionOpen = reactive<Record<string, boolean>>({})
  const projectMode = ref<DeployDrawerProjectMode>(initial.value.projectMode)
  const projectId = ref(initial.value.projectId)
  const environment = ref(initial.value.environment)

  const project = computed<ProjectView>(() =>
    projectMode.value === 'new'
      ? newProject.value
      : (projectGroups.value
          .flatMap((group) => group.projects)
          .find((entry) => entry.id === projectId.value) ??
        projectGroups.value[0]?.projects[0] ?? { name: '' })
  )

  const versionOf = (row: Dependency) =>
    row.versions.find((entry) => entry.id === picks[row.key]) ?? row.versions[0]

  const versionSummary = (row: Dependency) =>
    row.total > row.versions.length
      ? `${row.versions.length} of ${row.total} Ready versions`
      : `${row.total} Ready versions`

  const liveVersionId = (row: Dependency) =>
    (row.versions.find((entry) => entry.active) ?? row.versions[0])?.id ?? ''

  const changeCount = computed(
    () =>
      resources.value
        .flatMap((row) => [row, ...row.dependencies])
        .filter((row) => row.versions.length && versionOf(row).id !== liveVersionId(row)).length
  )

  const changeSummary = computed(
    () =>
      `${changeCount.value} ${changeCount.value === 1 ? 'change goes' : 'changes go'} live in ${environment.value}.`
  )

  const pickVersion = (row: Dependency, id: string) => {
    picks[row.key] = id
    versionOpen[row.key] = false
  }

  const reset = () => {
    const values = initial.value
    Object.keys(picks).forEach((key) => delete picks[key])
    Object.assign(picks, values.versions)
    Object.keys(versionOpen).forEach((key) => delete versionOpen[key])
    projectMode.value = values.projectMode
    projectId.value = values.projectId
    environment.value = values.environment
  }

  watch(open, (isOpen) => {
    if (isOpen) reset()
  })

  const blocked = computed(() => pending.value || !!props.build)

  const title = computed(() => (props.build ? 'Build and deployment' : 'Deploy'))

  const submit = (event: Event) => {
    if (blocked.value) return
    emit('submit', event, {
      versions: Object.fromEntries(
        resources.value
          .flatMap((row) => [row, ...row.dependencies])
          .filter((row) => row.versions.length)
          .map((row) => [row.key, versionOf(row).id])
      ),
      projectMode: projectMode.value,
      projectId: project.value.id ?? '',
      environment: environment.value
    })
    open.value = false
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerTrigger>
      <Button
        label="Deploy"
        variant="outline"
        size="medium"
        icon="az az-cloud-upload"
      />
    </DrawerTrigger>

    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        :aria-label="title"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>{{ title }}</DrawerTitle>
          </div>
        </PanelHeader>

        <PanelBody>
          <div
            v-if="loading"
            class="flex min-w-0 flex-col"
            aria-busy="true"
          >
            <SettingsGroup
              label="Resources"
              hint="The service version this deployment sends live, and the version of every module and integration it references."
            >
              <div aria-hidden="true">
                <Skeleton height="var(--size-40)" />
              </div>
            </SettingsGroup>

            <SettingsGroup
              label="Environment"
              hint="Where the deployment goes live, from the environments this project serves. Each one goes live with the Deployment Settings set on the project."
            >
              <div
                class="flex min-w-0 flex-col gap-(--spacing-xs)"
                aria-hidden="true"
              >
                <Skeleton
                  v-for="row in 2"
                  :key="row"
                  height="var(--size-16)"
                />
              </div>
            </SettingsGroup>

            <span
              class="sr-only"
              role="status"
            >
              Loading the resources and environments for this deployment.
            </span>
          </div>

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
              <Item
                v-if="build"
                variant="outline"
                size="small"
                aria-live="polite"
              >
                <Item.Media>
                  <span
                    class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      class="az az-server text-body-xs text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Item.Title>{{ build.name }}</Item.Title>
                    <Tag
                      :label="build.version"
                      severity="neutral"
                      size="small"
                      class="shrink-0"
                    />
                  </span>
                  <Item.Description>Building…</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <span
                    class="font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)"
                  >
                    {{ build.elapsed }} s
                  </span>
                  <div class="contents text-(--text-default)">
                    <Spinner class="shrink-0" />
                  </div>
                </Item.Actions>
              </Item>
              <Card
                v-else
                :padded="false"
              >
                <template #default>
                  <template
                    v-for="(row, index) in resources"
                    :key="row.key"
                  >
                    <Separator v-if="index" />
                    <Item
                      variant="inline"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            :class="row.icon"
                            class="text-body-xs text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                          <span class="shrink-0 text-body-sm text-(--text-muted)">
                            {{ row.label }}
                          </span>
                          <Item.Title>{{ row.name }}</Item.Title>
                          <Tag
                            v-if="!row.note"
                            :label="row.versions.length ? 'Ready' : 'No ready version'"
                            :severity="row.versions.length ? 'success' : 'warning'"
                            size="small"
                            class="shrink-0"
                          />
                        </span>
                        <Item.Description>
                          {{ row.note || versionOf(row).name }}
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions
                        v-if="!row.note"
                        class="basis-full sm:basis-auto"
                      >
                        <DropdownMenu
                          v-model:open="versionOpen[row.key]"
                          side="bottom"
                          align="end"
                          @select="(_event, id) => pickVersion(row, String(id))"
                        >
                          <DropdownMenu.Trigger>
                            <Button
                              label="Change version"
                              :aria-label="`Change version of ${row.name}`"
                              variant="outline"
                              size="small"
                              icon="az az-chevron-down"
                              icon-position="trailing"
                              :disabled="!row.versions.length"
                            />
                          </DropdownMenu.Trigger>
                          <template #header>
                            <div
                              class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                            >
                              <p class="text-label-sm text-(--text-muted)">
                                {{ versionSummary(row) }}
                              </p>
                              <Input
                                v-if="row.total > row.versions.length"
                                size="medium"
                                placeholder="Search versions"
                                aria-label="Search versions"
                              >
                                <template #leading>
                                  <i
                                    class="az az-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </div>
                          </template>
                          <DropdownMenu.Group>
                            <DropdownMenu.Item
                              v-for="entry in row.versions"
                              :key="entry.id"
                              :value="entry.id"
                              :label="entry.name"
                              :selected="entry.id === versionOf(row).id"
                              :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                            >
                              <template #leading>
                                <Avatar
                                  :alt="entry.author"
                                  :label="entry.author"
                                  size="small"
                                  variant="square"
                                />
                              </template>
                              <span class="inline-flex min-w-0 items-center gap-(--spacing-xs)">
                                <span class="truncate">{{ entry.name }}</span>
                                <Tag
                                  v-if="entry.active"
                                  label="Active"
                                  severity="success"
                                  size="small"
                                  class="shrink-0"
                                />
                              </span>
                              <template #trailing>
                                <span class="text-body-xs text-(--text-muted)">{{
                                  entry.createdAgo
                                }}</span>
                              </template>
                            </DropdownMenu.Item>
                          </DropdownMenu.Group>
                          <template
                            v-if="row.total > row.versions.length"
                            #bottom
                          >
                            <div
                              class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)"
                            >
                              <Button
                                :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
                                variant="ghost"
                                size="small"
                                class="w-full"
                              />
                            </div>
                          </template>
                        </DropdownMenu>
                      </Item.Actions>
                    </Item>
                    <template v-if="row.owner">
                      <Separator />
                      <Accordion
                        type="single"
                        collapsible
                        size="medium"
                      >
                        <Accordion.Item value="dependencies">
                          <Accordion.Trigger>
                            <span class="text-label-sm text-(--text-default)">Dependencies</span>
                          </Accordion.Trigger>
                          <Accordion.Content>
                            <div class="min-w-0 px-(--spacing-md) py-(--spacing-md)">
                              <p
                                v-if="!row.dependencies.length"
                                class="text-body-sm text-(--text-muted)"
                              >
                                {{ row.name }} references no other resources.
                              </p>
                              <Item.Group v-else>
                                <Item
                                  v-for="dependency in row.dependencies"
                                  :key="dependency.key"
                                  variant="inline"
                                  size="small"
                                >
                                  <Item.Media>
                                    <span class="flex size-5 items-center justify-center">
                                      <i
                                        :class="dependency.icon"
                                        class="text-body-xs text-(--text-muted)"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Item.Media>
                                  <Item.Content>
                                    <span
                                      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
                                    >
                                      <span class="shrink-0 text-body-sm text-(--text-muted)">
                                        {{ dependency.label }}
                                      </span>
                                      <Item.Title>{{ dependency.name }}</Item.Title>
                                      <Tag
                                        v-if="!dependency.note"
                                        :label="
                                          dependency.versions.length ? 'Ready' : 'No ready version'
                                        "
                                        :severity="
                                          dependency.versions.length ? 'success' : 'warning'
                                        "
                                        size="small"
                                        class="shrink-0"
                                      />
                                    </span>
                                    <Item.Description>
                                      {{ dependency.note || versionOf(dependency).name }}
                                    </Item.Description>
                                  </Item.Content>
                                  <Item.Actions v-if="!dependency.note">
                                    <DropdownMenu
                                      v-model:open="versionOpen[dependency.key]"
                                      side="bottom"
                                      align="end"
                                      @select="(_event, id) => pickVersion(dependency, String(id))"
                                    >
                                      <DropdownMenu.Trigger>
                                        <Button
                                          label="Change version"
                                          :aria-label="`Change version of ${dependency.name}`"
                                          variant="outline"
                                          size="small"
                                          icon="az az-chevron-down"
                                          icon-position="trailing"
                                          :disabled="!dependency.versions.length"
                                        />
                                      </DropdownMenu.Trigger>
                                      <template #header>
                                        <div
                                          class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                                        >
                                          <p class="text-label-sm text-(--text-muted)">
                                            {{ versionSummary(dependency) }}
                                          </p>
                                          <Input
                                            v-if="dependency.total > dependency.versions.length"
                                            size="medium"
                                            placeholder="Search versions"
                                            aria-label="Search versions"
                                          >
                                            <template #leading>
                                              <i
                                                class="az az-search"
                                                aria-hidden="true"
                                              />
                                            </template>
                                          </Input>
                                        </div>
                                      </template>
                                      <DropdownMenu.Group>
                                        <DropdownMenu.Item
                                          v-for="entry in dependency.versions"
                                          :key="entry.id"
                                          :value="entry.id"
                                          :label="entry.name"
                                          :selected="entry.id === versionOf(dependency).id"
                                          :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                                        >
                                          <template #leading>
                                            <Avatar
                                              :alt="entry.author"
                                              :label="entry.author"
                                              size="small"
                                              variant="square"
                                            />
                                          </template>
                                          <span
                                            class="inline-flex min-w-0 items-center gap-(--spacing-xs)"
                                          >
                                            <span class="truncate">{{ entry.name }}</span>
                                            <Tag
                                              v-if="entry.active"
                                              label="Active"
                                              severity="success"
                                              size="small"
                                              class="shrink-0"
                                            />
                                          </span>
                                          <template #trailing>
                                            <span class="text-body-xs text-(--text-muted)">{{
                                              entry.createdAgo
                                            }}</span>
                                          </template>
                                        </DropdownMenu.Item>
                                      </DropdownMenu.Group>
                                      <template
                                        v-if="dependency.total > dependency.versions.length"
                                        #bottom
                                      >
                                        <div
                                          class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)"
                                        >
                                          <Button
                                            :label="`Load ${Math.min(dependency.versions.length, dependency.total - dependency.versions.length)} more`"
                                            variant="ghost"
                                            size="small"
                                            class="w-full"
                                          />
                                        </div>
                                      </template>
                                    </DropdownMenu>
                                  </Item.Actions>
                                </Item>
                              </Item.Group>
                              <span
                                class="sr-only"
                                role="status"
                              />
                            </div>
                          </Accordion.Content>
                        </Accordion.Item>
                      </Accordion>
                    </template>
                  </template>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              :inert="!!build || undefined"
              :data-pending="build ? 'true' : undefined"
              label="Project"
              hint="The project whose domains serve the service. Create one to deploy it on a new domain."
            >
              <Card :padded="false">
                <template #header>
                  <ToggleGroup
                    v-model="projectMode"
                    :options="projectModes"
                    size="medium"
                    fluid
                    aria-label="Project"
                    class="w-full"
                  />
                </template>
                <template #default>
                  <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                    <Item
                      variant="outline"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            class="az az-box text-body-xs text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <Item.Title>{{ project.name }}</Item.Title>
                          <Tag
                            v-if="projectMode === 'new'"
                            label="New"
                            severity="success"
                            size="small"
                            class="shrink-0"
                          />
                        </span>
                        <Item.Description v-if="projectMode === 'new'">
                          Gets its domains on the first deploy.
                        </Item.Description>
                        <ul
                          v-else
                          class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-2xs) p-0"
                        >
                          <li
                            v-for="domainGroup in project.domains"
                            :key="domainGroup.environment"
                            class="flex min-w-0 items-center gap-(--spacing-xs)"
                          >
                            <Tag
                              :label="domainGroup.environment"
                              severity="neutral"
                              size="small"
                              class="shrink-0"
                            />
                            <div class="flex min-w-0">
                              <Tooltip
                                :content="`Open ${domainGroup.domains[0]} in a new tab`"
                                class="w-full"
                              >
                                <Link
                                  class="max-w-full"
                                  :href="`https://${domainGroup.domains[0]}`"
                                  target="_blank"
                                  size="small"
                                >
                                  <span class="grid grid-cols-1">
                                    <span class="truncate">{{ domainGroup.domains[0] }}</span>
                                  </span>
                                </Link>
                              </Tooltip>
                            </div>
                            <Popover
                              v-if="domainGroup.total > 1"
                              side="bottom"
                              align="start"
                              size="small"
                            >
                              <Popover.Trigger
                                :aria-label="`${domainGroup.total - 1} more domains`"
                              >
                                <div class="shrink-0 cursor-pointer">
                                  <Tag
                                    :label="`+${domainGroup.total - 1}`"
                                    severity="neutral"
                                    size="small"
                                  />
                                </div>
                              </Popover.Trigger>
                              <Popover.Content>
                                <div
                                  class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                                >
                                  <p class="text-label-sm text-(--text-muted)">
                                    {{ domainGroup.summary }}
                                  </p>
                                  <Input
                                    v-if="domainGroup.total > 10"
                                    size="medium"
                                    placeholder="Search domains"
                                    aria-label="Search domains"
                                  >
                                    <template #leading>
                                      <i
                                        class="az az-search"
                                        aria-hidden="true"
                                      />
                                    </template>
                                  </Input>
                                </div>

                                <div
                                  class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-2xs)"
                                >
                                  <div
                                    v-for="domain in domainGroup.domains"
                                    :key="domain"
                                    class="flex min-w-0 px-(--spacing-xs) py-(--spacing-2xs)"
                                  >
                                    <Link
                                      :label="domain"
                                      :href="`https://${domain}`"
                                      target="_blank"
                                      size="small"
                                    />
                                  </div>
                                </div>

                                <div
                                  v-if="domainGroup.total > domainGroup.domains.length"
                                  class="border-t border-(--border-default) p-(--spacing-2xs)"
                                >
                                  <Button
                                    :label="`Load ${Math.min(10, domainGroup.total - domainGroup.domains.length)} more`"
                                    variant="ghost"
                                    size="small"
                                    class="w-full"
                                  />
                                </div>

                                <span
                                  class="sr-only"
                                  role="status"
                                >
                                  {{ domainGroup.summary }}
                                </span>
                              </Popover.Content>
                            </Popover>
                          </li>
                        </ul>
                      </Item.Content>
                      <Item.Actions
                        v-if="projectMode === 'existing'"
                        class="basis-full sm:basis-auto"
                      >
                        <DropdownMenu
                          side="bottom"
                          align="end"
                          @select="(_event, id) => (projectId = String(id))"
                        >
                          <DropdownMenu.Trigger>
                            <Button
                              label="Change"
                              variant="outline"
                              size="small"
                              icon="az az-chevron-down"
                              icon-position="trailing"
                            />
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Group
                            v-for="group in projectGroups"
                            :key="group.key"
                            :label="group.label"
                          >
                            <DropdownMenu.Item
                              v-for="entry in group.projects"
                              :key="entry.id"
                              :value="entry.id"
                              :label="entry.name"
                              :selected="entry.id === project.id"
                            >
                              <template #trailing>
                                <span class="truncate text-body-xs text-(--text-muted)">
                                  {{ entry.detail }}
                                </span>
                              </template>
                            </DropdownMenu.Item>
                          </DropdownMenu.Group>
                        </DropdownMenu>
                      </Item.Actions>
                    </Item>
                  </div>
                </template>
              </Card>
            </SettingsGroup>

            <SettingsGroup
              :inert="!!build || undefined"
              :data-pending="build ? 'true' : undefined"
              label="Environment"
              hint="Where the deployment goes live, from the environments this project serves. Each one goes live with the Deployment Settings set on the project."
            >
              <RadioGroup
                v-model="environment"
                variant="card"
                name="service-deploy-environment"
                aria-label="Environment"
              >
                <RadioGroup.Item
                  v-for="entry in environmentChoices"
                  :key="entry.name"
                  :value="entry.name"
                  :description="entry.description"
                >
                  {{ entry.name }}
                  <template
                    v-if="entry.tag"
                    #tag
                  >
                    <Tag
                      :label="entry.tag"
                      severity="info"
                      size="small"
                    />
                  </template>
                </RadioGroup.Item>
              </RadioGroup>
            </SettingsGroup>

            <SettingsGroup
              :inert="!!build || undefined"
              :data-pending="build ? 'true' : undefined"
              label="Projects impacted"
              hint="This environment deploys with shared Deployment Settings, so the deployment reaches every project below, in every environment they are linked to, and the domains they serve."
            >
              <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                <div
                  v-for="group in impacted"
                  :key="group.environment"
                  class="flex min-w-0 flex-col gap-(--spacing-xs)"
                >
                  <ul
                    class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xs) p-0"
                    :aria-label="`Projects impacted in ${group.environment} (${group.projects.length})`"
                  >
                    <li
                      v-for="target in group.projects"
                      :key="target.id"
                      class="min-w-0"
                    >
                      <Item
                        variant="outline"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              class="az az-box text-body-xs text-(--text-default)"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <Item.Title>{{ target.name }}</Item.Title>
                            <Tag
                              v-if="target.selected"
                              label="Selected"
                              severity="neutral"
                              size="small"
                              class="shrink-0"
                            />
                          </span>
                          <ul class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-2xs) p-0">
                            <li
                              v-for="domainGroup in target.domains"
                              :key="domainGroup.environment"
                              class="flex min-w-0 items-center gap-(--spacing-xs)"
                            >
                              <Tag
                                :label="domainGroup.environment"
                                severity="neutral"
                                size="small"
                                class="shrink-0"
                              />
                              <div class="flex min-w-0">
                                <Tooltip
                                  :content="`Open ${domainGroup.domains[0]} in a new tab`"
                                  class="w-full"
                                >
                                  <Link
                                    class="max-w-full"
                                    :href="`https://${domainGroup.domains[0]}`"
                                    target="_blank"
                                    size="small"
                                  >
                                    <span class="grid grid-cols-1">
                                      <span class="truncate">{{ domainGroup.domains[0] }}</span>
                                    </span>
                                  </Link>
                                </Tooltip>
                              </div>
                              <Popover
                                v-if="domainGroup.total > 1"
                                side="bottom"
                                align="start"
                                size="small"
                              >
                                <Popover.Trigger
                                  :aria-label="`${domainGroup.total - 1} more domains`"
                                >
                                  <div class="shrink-0 cursor-pointer">
                                    <Tag
                                      :label="`+${domainGroup.total - 1}`"
                                      severity="neutral"
                                      size="small"
                                    />
                                  </div>
                                </Popover.Trigger>
                                <Popover.Content>
                                  <div
                                    class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                                  >
                                    <p class="text-label-sm text-(--text-muted)">
                                      {{ domainGroup.summary }}
                                    </p>
                                    <Input
                                      v-if="domainGroup.total > 10"
                                      size="medium"
                                      placeholder="Search domains"
                                      aria-label="Search domains"
                                    >
                                      <template #leading>
                                        <i
                                          class="az az-search"
                                          aria-hidden="true"
                                        />
                                      </template>
                                    </Input>
                                  </div>

                                  <div
                                    class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-2xs)"
                                  >
                                    <div
                                      v-for="domain in domainGroup.domains"
                                      :key="domain"
                                      class="flex min-w-0 px-(--spacing-xs) py-(--spacing-2xs)"
                                    >
                                      <Link
                                        :label="domain"
                                        :href="`https://${domain}`"
                                        target="_blank"
                                        size="small"
                                      />
                                    </div>
                                  </div>

                                  <div
                                    v-if="domainGroup.total > domainGroup.domains.length"
                                    class="border-t border-(--border-default) p-(--spacing-2xs)"
                                  >
                                    <Button
                                      :label="`Load ${Math.min(10, domainGroup.total - domainGroup.domains.length)} more`"
                                      variant="ghost"
                                      size="small"
                                      class="w-full"
                                    />
                                  </div>

                                  <span
                                    class="sr-only"
                                    role="status"
                                  >
                                    {{ domainGroup.summary }}
                                  </span>
                                </Popover.Content>
                              </Popover>
                            </li>
                          </ul>
                        </Item.Content>
                      </Item>
                    </li>
                  </ul>
                </div>
              </div>
            </SettingsGroup>

            <span
              class="sr-only"
              role="status"
            />
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <p
              v-if="changeCount && !build"
              class="flex min-w-0 items-center gap-(--spacing-2xs) text-body-xs text-(--text-muted)"
            >
              <i
                class="az az-circle-info shrink-0"
                aria-hidden="true"
              />
              <span class="truncate">{{ changeSummary }}</span>
            </p>
            <span v-else />
            <Button
              label="Deploy"
              variant="primary"
              size="medium"
              :disabled="blocked"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>
