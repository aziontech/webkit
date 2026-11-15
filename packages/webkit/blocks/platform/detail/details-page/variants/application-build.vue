<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CopyButton from '@aziontech/webkit/copy-button'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import InputGroupRoot from '@aziontech/webkit/input-group-root'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SaveBar from '@aziontech/webkit/save-bar'
  import SectionHeader from '@aziontech/webkit/section-header'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  const APP = {
    name: 'storefront-app',
    host: 'storefront-app-k3m9.example.com',
    deployment: '4182093317',
    version: 'BX7Q2LMA',
    repository: 'acme/storefront'
  }

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' }
  ]
  const currentTab = ref('overview')

  const versionColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Version', principal: true, hideable: false },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { accessorKey: 'state', header: 'Status', minWidth: 104 },
    { accessorKey: 'createdAgo', header: 'Created', minWidth: 96 }
  ]
  const versions = [
    {
      id: 'BX7Q2LMA',
      name: 'BX7Q2LMA',
      description: 'Cache product images for 7 days',
      state: 'Active',
      createdAgo: '3 hours ago'
    },
    {
      id: 'BW1K8RTE',
      name: 'BW1K8RTE',
      description: 'Redirect the old checkout path',
      state: 'Ready',
      createdAgo: 'Yesterday'
    },
    {
      id: 'BV4N6PXD',
      name: 'BV4N6PXD',
      description: 'Bypass cache for /api/*',
      state: 'Ready',
      createdAgo: '4 days ago'
    }
  ]
  const versionSeverity: Record<string, TagSeverity> = {
    Active: 'success',
    Ready: 'neutral',
    Draft: 'warning'
  }

  const deploymentColumns: TableColumn[] = [
    { accessorKey: 'id', header: 'Deployment', principal: true, hideable: false },
    { accessorKey: 'version', header: 'Version' },
    { accessorKey: 'environment', header: 'Environment' },
    { accessorKey: 'status', header: 'Status', minWidth: 104 },
    { accessorKey: 'createdAgo', header: 'Created', minWidth: 96 }
  ]
  const deployments = [
    {
      id: '4182093317',
      version: 'BX7Q2LMA',
      environment: 'Production',
      status: 'Ready',
      createdAgo: '3 hours ago'
    },
    {
      id: '4181877250',
      version: 'BW1K8RTE',
      environment: 'Preview',
      status: 'Ready',
      createdAgo: 'Yesterday'
    },
    {
      id: '4180412906',
      version: 'BW1K8RTE',
      environment: 'Production',
      status: 'Error',
      createdAgo: 'Yesterday'
    }
  ]
  const deploymentSeverity: Record<string, StatusIndicatorSeverity> = {
    Ready: 'success',
    Error: 'danger',
    Building: 'info'
  }

  const build = reactive({
    productionBranch: 'main',
    previewBranch: 'develop',
    buildCommand: 'platform build',
    deployCommand: 'platform deploy --local'
  })
  const saving = ref(false)

  const commitSave = () =>
    new Promise<void>((resolve) => {
      saving.value = true
      setTimeout(() => {
        guard.commit()
        saving.value = false
        toast.success('Build settings saved.')
        resolve()
      }, 800)
    })

  const guard = useUnsavedChanges(() => build, {
    onDiscard: (baseline) => Object.assign(build, baseline),
    onSave: commitSave
  })
  guard.commit()
  const dirty = guard.isDirty
  const leaveDialog = guard.dialogProps
  const leaveLabels = guard.labels

  const activeTab = computed({
    get: () => currentTab.value,
    set: async (value) => {
      if (!value || value === currentTab.value) return
      if (currentTab.value === 'build' && !(await guard.confirmLeave())) return
      currentTab.value = value
    }
  })

  const dragDepth = ref(0)
  const dragging = computed(() => dragDepth.value > 0)
  const dropped = ref('')

  const hasFiles = (event: DragEvent) =>
    Array.from(event.dataTransfer?.types ?? []).includes('Files')

  const onDragEnter = (event: DragEvent) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    dragDepth.value += 1
  }

  const onDragOver = (event: DragEvent) => {
    if (hasFiles(event)) event.preventDefault()
  }

  const onDragLeave = (event: DragEvent) => {
    if (!hasFiles(event)) return
    dragDepth.value = Math.max(0, dragDepth.value - 1)
  }

  const deployOpen = ref(false)
  const deploying = ref(false)

  const onDrop = (event: DragEvent) => {
    if (!hasFiles(event)) return
    event.preventDefault()
    dragDepth.value = 0
    const [first] = Array.from(event.dataTransfer?.files ?? [])
    const path = (first as (File & { webkitRelativePath?: string }) | undefined)?.webkitRelativePath
    dropped.value = path?.split('/')[0] || first?.name || 'dropped files'
    deployOpen.value = true
  }

  const openDeploy = () => {
    dropped.value = ''
    deployOpen.value = true
  }

  const deploySource = computed(() => dropped.value || `the ${build.productionBranch} branch`)

  const RUN_TOAST = 'application-build-deploy'
  let timer: ReturnType<typeof setTimeout> | undefined

  const runDeploy = () => {
    deployOpen.value = false
    deploying.value = true
    toast.loading(`Deploying ${APP.name}…`, {
      id: RUN_TOAST,
      description: 'It keeps running if you leave this page.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      deploying.value = false
      toast.success(`${APP.name} is live.`, {
        id: RUN_TOAST,
        description: `A new version built from ${deploySource.value} serves Production.`,
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: () => (currentTab.value = 'build') },
          { label: 'Redeploy', onClick: runDeploy }
        ]
      })
    }, 1500)
  }

  onBeforeUnmount(() => {
    clearTimeout(timer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div
    class="flex min-h-0 flex-1 flex-col"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
          :dirty="tab.value === 'build' && dirty"
        />
        <template #actions>
          <Button
            label="Deploy"
            kind="outlined"
            size="medium"
            icon="pi pi-cloud-upload"
            :loading="deploying"
            @click="openDeploy"
          />
        </template>
      </PageTabs>
    </div>

    <section class="relative min-h-0 flex-1">
      <Transition
        enter-active-class="animate-fade-in motion-reduce:animate-none"
        leave-active-class="animate-fade-out motion-reduce:animate-none"
      >
        <div
          v-if="dragging"
          aria-hidden="true"
          class="pointer-events-none absolute inset-[var(--drop-zone-inset,0)] z-40 overflow-hidden rounded-(--shape-card) border-2 border-dashed border-(--border-selected) bg-(--bg-canvas) [--drop-zone-inset:var(--layout-boundary-inline)]"
        >
          <div
            class="sticky top-0 flex h-dvh max-h-full flex-col items-center justify-center gap-(--spacing-md) p-(--spacing-lg) text-center"
          >
            <span
              class="flex size-12 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised)"
            >
              <i
                class="pi pi-cloud-upload text-body-lg leading-none text-(--text-default)"
                aria-hidden="true"
              />
            </span>
            <div class="flex max-w-(--container-md) flex-col gap-(--spacing-xxs)">
              <p class="text-heading-xs text-(--text-default)">Drop your project to deploy it</p>
              <p class="text-pretty text-body-sm text-(--text-muted)">
                We build a new version of {{ APP.name }}, then you choose where it goes live.
              </p>
            </div>
          </div>
        </div>
      </Transition>

      <div
        v-if="activeTab === 'build'"
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
      >
        <SectionHeader
          title="Build"
          description="How code reaches this application, and what the CLI builds it with."
          size="small"
        />

        <form
          class="mt-(--layout-section-gap) flex min-w-0 flex-col"
          aria-label="Build settings"
          novalidate
          @submit.prevent="commitSave"
        >
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="saving"
          >
            <legend class="sr-only">Build settings</legend>
            <SettingsSection
              title="Git repository"
              hint="The repository this application builds from, and the branches a push deploys."
              anchor="git-repository"
            >
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Connected repository"
                      kind="compact"
                    >
                      <template #description>
                        <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
                          <i
                            class="ai ai-github shrink-0"
                            aria-hidden="true"
                          />
                          <a
                            :href="`https://github.com/${APP.repository}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="truncate rounded-(--shape-button) text-body-sm text-(--text-default) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                            >{{ APP.repository
                            }}<span class="sr-only">{{ ' (opens in a new tab)' }}</span></a
                          >
                        </span>
                      </template>
                      <Button
                        type="button"
                        label="Disconnect"
                        kind="danger"
                        size="small"
                      />
                    </SettingRow>
                    <SettingRow
                      title="Production branch"
                      description="Pushes to this branch build and deploy to Production."
                      stackable
                    >
                      <Input
                        v-model="build.productionBranch"
                        size="large"
                        class="w-full"
                        aria-label="Production branch"
                        monospace
                        :spellcheck="false"
                      />
                    </SettingRow>
                    <SettingRow
                      title="Preview branch"
                      description="Pushes to this branch deploy a preview with its own URL. Production is untouched."
                      stackable
                    >
                      <Input
                        v-model="build.previewBranch"
                        size="large"
                        class="w-full"
                        aria-label="Preview branch"
                        monospace
                        :spellcheck="false"
                      />
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </SettingsSection>

            <SettingsSection
              title="Build configuration"
              hint="How the CLI builds this application."
              anchor="build-configuration"
            >
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="Build command"
                      description="The command that builds the application."
                      stackable
                    >
                      <Input
                        v-model="build.buildCommand"
                        size="large"
                        class="w-full"
                        aria-label="Build command"
                        monospace
                        :spellcheck="false"
                      />
                    </SettingRow>
                    <SettingRow
                      title="Deploy command"
                      description="The command that deploys the build."
                      stackable
                    >
                      <Input
                        v-model="build.deployCommand"
                        size="large"
                        class="w-full"
                        aria-label="Deploy command"
                        monospace
                        :spellcheck="false"
                      />
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </SettingsSection>

            <SettingsSection
              title="Deployment"
              hint="The personal token the workflow authenticates with, kept as a repository secret."
              anchor="deployment"
            >
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <SettingRow
                      title="API token"
                      description="Stored as the PLATFORM_TOKEN GitHub secret."
                      stackable
                    >
                      <InputGroupRoot class="w-full">
                        <div class="flex flex-1">
                          <Input
                            :model-value="`${APP.name} build token`"
                            size="large"
                            class="w-full"
                            aria-label="API token"
                            monospace
                            readonly
                          />
                        </div>
                        <CopyButton
                          kind="transparent"
                          :value="`${APP.name} build token`"
                          aria-label="Copy API token"
                          size="small"
                        />
                      </InputGroupRoot>
                    </SettingRow>
                  </Item.List>
                </template>
              </Card>
            </SettingsSection>
          </fieldset>
        </form>

        <Transition
          enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="translate-y-2 opacity-0"
          leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="translate-y-2 opacity-0"
        >
          <SaveBar v-if="dirty || saving">
            Build settings changed.
            <span class="text-(--text-muted)">Saving applies them to the next build.</span>
            <template #actions>
              <Button
                type="button"
                label="Discard"
                kind="outlined"
                size="medium"
                :disabled="saving"
                @click="guard.discard()"
              />
              <Button
                label="Save"
                kind="primary"
                size="medium"
                :loading="saving"
                @click="commitSave"
              />
            </template>
          </SaveBar>
        </Transition>
      </div>

      <div
        v-else
        class="layout-column layout-boundary flex min-w-0 flex-col"
      >
        <section
          v-if="activeTab === 'overview'"
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
        >
          <Card :padded="false">
            <template #content>
              <div
                class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
              >
                <div
                  class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
                >
                  <i
                    class="pi pi-globe shrink-0 text-body-lg text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <div class="flex min-w-0">
                    <Tooltip
                      :text="`Open ${APP.host} in a new tab`"
                      class="w-full"
                    >
                      <a
                        :href="`https://${APP.host}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                      >
                        <span class="truncate underline-offset-2 group-hover/link:underline">{{
                          APP.host
                        }}</span>
                        <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                        <i
                          class="pi pi-external-link shrink-0 text-body-xs leading-none"
                          aria-hidden="true"
                        />
                      </a>
                    </Tooltip>
                  </div>
                </div>
                <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
                  <Button
                    label="Visit"
                    kind="secondary"
                    size="medium"
                    icon="pi pi-external-link"
                    :href="`https://${APP.host}`"
                    target="_blank"
                  />
                  <DropdownMenu placement="bottom-end">
                    <DropdownMenu.Trigger>
                      <Tooltip text="Application actions">
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="outlined"
                          size="medium"
                          aria-label="Application actions"
                        />
                      </Tooltip>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Group>
                      <DropdownMenu.Item
                        value="copy-url"
                        label="Copy URL"
                      >
                        <template #leading>
                          <i
                            class="pi pi-copy"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Item>
                    </DropdownMenu.Group>
                    <DropdownMenu.Group>
                      <DropdownMenu.Item
                        value="settings"
                        label="Settings"
                      >
                        <template #leading>
                          <i
                            class="pi pi-cog"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Item>
                    </DropdownMenu.Group>
                  </DropdownMenu>
                </div>
              </div>

              <div
                class="grid grid-cols-2 gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) sm:grid-cols-3 lg:grid-cols-6"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                  <span class="text-label-sm text-(--text-muted)">Deployment</span>
                  <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                    <Link
                      :label="APP.deployment"
                      :href="`/deployments/${APP.deployment}`"
                      size="small"
                    />
                    <Tag
                      label="Production"
                      severity="neutral"
                      size="small"
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                  <span class="text-label-sm text-(--text-muted)">Domains</span>
                  <div class="flex min-h-7 min-w-0 items-center">
                    <span class="truncate text-body-sm text-(--text-default)">{{ APP.host }}</span>
                  </div>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                  <span class="text-label-sm text-(--text-muted)">Status</span>
                  <div class="flex min-h-7 min-w-0 items-center">
                    <StatusIndicator
                      severity="success"
                      label="Ready"
                    />
                  </div>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                  <span class="text-label-sm text-(--text-muted)">Created</span>
                  <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                    <span class="truncate text-body-sm text-(--text-default)"
                      >3 hours ago by Priya Patel</span
                    >
                    <Avatar
                      alt="Priya Patel"
                      label="Priya Patel"
                      size="small"
                      kind="square"
                      class="shrink-0"
                    />
                  </div>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                  <span class="text-label-sm text-(--text-muted)">Source</span>
                  <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-sm)">
                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="ai ai-github shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        APP.repository
                      }}</span>
                    </span>
                    <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <i
                        class="ai ai-branch shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        build.productionBranch
                      }}</span>
                    </span>
                  </div>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                  <span class="text-label-sm text-(--text-muted)">Framework</span>
                  <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="ai-cor ai-vue shrink-0 text-body-lg"
                      aria-hidden="true"
                    />
                    <span class="truncate text-body-sm text-(--text-default)">Vue</span>
                  </div>
                </div>
              </div>

              <div
                class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs)"
              >
                <p
                  class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
                >
                  Every push to
                  <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)">{{
                    build.productionBranch
                  }}</code>
                  deploys this application to Production. To ship from your machine, drop your
                  project anywhere on this page or run
                  <code class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
                    >platform deploy</code
                  >
                  via the CLI.
                </p>
                <div class="w-full shrink-0 @lg/band:ms-auto @lg/band:w-fit">
                  <Button
                    class="w-full"
                    label="Documentation"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-book"
                    href="https://example.com/docs/cli"
                    target="_blank"
                  />
                </div>
              </div>
            </template>
          </Card>
        </section>

        <section
          v-else-if="activeTab === 'versions'"
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
        >
          <SectionHeader
            title="Versions"
            size="small"
          >
            <template #actions>
              <Button
                label="Add Version"
                kind="outlined"
                size="medium"
                icon="pi pi-plus"
              />
            </template>
          </SectionHeader>
          <Card :padded="false">
            <template #content>
              <DataTable
                :data="versions"
                :columns="versionColumns"
                row-key="id"
                paginated
                :page-size="10"
                :bordered="false"
                aria-label="Versions"
              >
                <template #cell-name="{ value }">
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="truncate font-(family-name:--font-code) text-body-sm">{{
                      value
                    }}</span>
                    <span
                      v-if="value === APP.version"
                      class="shrink-0 text-body-sm text-(--text-muted)"
                      >Latest</span
                    >
                  </span>
                </template>
                <template #cell-state="{ value }">
                  <Tag
                    :label="value"
                    :severity="versionSeverity[value]"
                    size="small"
                  />
                </template>
                <template #empty>
                  <EmptyState
                    size="medium"
                    icon="pi pi-history"
                    title="No versions yet"
                    description="Every deploy creates a version of this application."
                  />
                </template>
              </DataTable>
            </template>
          </Card>
        </section>

        <section
          v-else
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
        >
          <SectionHeader
            title="Deployments"
            size="small"
          />
          <Card :padded="false">
            <template #content>
              <DataTable
                :data="deployments"
                :columns="deploymentColumns"
                row-key="id"
                paginated
                :page-size="10"
                :bordered="false"
                aria-label="Deployments"
              >
                <template #cell-status="{ value }">
                  <StatusIndicator
                    :severity="deploymentSeverity[value]"
                    :label="value"
                  />
                </template>
                <template #empty>
                  <EmptyState
                    size="medium"
                    icon="pi pi-cloud-upload"
                    title="No deployments yet"
                    description="Deploy this application and each run lands here."
                  />
                </template>
              </DataTable>
            </template>
          </Card>
        </section>
      </div>
    </section>

    <Drawer
      v-model:open="deployOpen"
      side="right"
      size="medium"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Deploy {{ APP.name }}</DrawerTitle>
        </PanelHeader>
        <PanelContent>
          <div class="flex flex-col gap-(--spacing-md)">
            <DrawerDescription>
              We build a new version of {{ APP.name }} from {{ deploySource }}, then it goes live in
              Production. The deployment that is live keeps serving until the new one is ready.
            </DrawerDescription>
            <dl class="m-0 grid grid-cols-[auto_1fr] gap-x-(--spacing-md) gap-y-(--spacing-xs)">
              <dt class="text-label-sm text-(--text-muted)">Source</dt>
              <dd class="m-0 truncate text-body-sm text-(--text-default)">{{ deploySource }}</dd>
              <dt class="text-label-sm text-(--text-muted)">Environment</dt>
              <dd class="m-0">
                <Tag
                  label="Production"
                  severity="neutral"
                  size="small"
                />
              </dd>
            </dl>
          </div>
        </PanelContent>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              label="Cancel"
              kind="outlined"
              @click="deployOpen = false"
            />
            <Button
              label="Deploy"
              kind="primary"
              icon="pi pi-cloud-upload"
              @click="runDeploy"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </Drawer>

    <ConfirmDialog v-bind="leaveDialog">
      <template #actions>
        <Button
          :label="leaveLabels.keepEditing"
          kind="transparent"
          size="medium"
          :disabled="leaveDialog.loading"
          @click="guard.keepEditing"
        />
        <Button
          :label="leaveLabels.discard"
          kind="outlined"
          size="medium"
          :disabled="leaveDialog.loading"
          @click="guard.discardAndLeave"
        />
        <Button
          :label="leaveLabels.save"
          kind="primary"
          size="medium"
          :loading="leaveDialog.loading"
          @click="guard.saveAndLeave"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>
