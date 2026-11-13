<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SectionHeader from '@aziontech/webkit/section-header'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import type { TableColumn } from '@aziontech/webkit/table-root'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import TopologyDiagram, {
    type TopologyBindOption,
    type TopologyLevel,
    type TopologyNode
  } from '@aziontech/webkit/topology-diagram'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  const APP = {
    name: 'storefront-app',
    host: 'storefront-app-k3m9.azion.app',
    deployment: '4182093317',
    version: 'BX7Q2LMA'
  }

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'topology', label: 'Topology' }
  ]
  const activeTab = ref('overview')

  const facts = [
    { label: 'Active version', value: APP.version, code: true },
    { label: 'Framework', value: 'Vite' },
    { label: 'Source', value: 'acme/storefront (main)' },
    { label: 'Created', value: '2 weeks ago by Mara Lin', author: 'Mara Lin' }
  ]

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
      description: 'Add rule"Redirect old checkout"',
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
    Ready: 'secondary',
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
      status: 'Live',
      createdAgo: '3 hours ago'
    },
    {
      id: '4181877250',
      version: 'BW1K8RTE',
      environment: 'Preview',
      status: 'Live',
      createdAgo: 'Yesterday'
    },
    {
      id: '4180412906',
      version: 'BW1K8RTE',
      environment: 'Production',
      status: 'Failed',
      createdAgo: 'Yesterday'
    }
  ]
  const deploymentSeverity: Record<string, StatusIndicatorSeverity> = {
    Live: 'success',
    Failed: 'danger',
    Building: 'info'
  }

  const targets: Record<
    string,
    { kind: string; icon: string; options: TopologyBindOption[]; unbound: string }
  > = {
    firewall: {
      kind: 'Firewall',
      icon: 'pi pi-shield',
      options: [
        { value: 'edge-guard', label: 'edge-guard' },
        { value: 'strict-waf', label: 'strict-waf' }
      ],
      unbound: 'Requests reach the application without inspection.'
    },
    function: {
      kind: 'Function instance',
      icon: 'pi pi-code',
      options: [
        { value: 'geo-redirect', label: 'geo-redirect' },
        { value: 'ab-split', label: 'ab-split' }
      ],
      unbound: 'No function runs before the cache.'
    }
  }

  const deployed = reactive<Record<string, string>>({ firewall: 'edge-guard', function: '' })
  const staged = reactive<Record<string, string>>({})
  const expanded = ref(['firewall'])
  const stagedCount = computed(() => Object.keys(staged).length)
  const stagedNote = ref('')

  const slotNode = (key: string): TopologyNode => {
    const target = targets[key]
    const pick = staged[key]
    const removing = pick === ''
    const value = pick === undefined ? deployed[key] : pick
    const base = {
      key,
      kind: target.kind,
      icon: target.icon,
      bindable: true,
      bindOptions: target.options,
      removable: true
    }
    if (!value) {
      return {
        ...base,
        status: removing ? 'Staged' : '',
        severity: removing ? 'warning' : 'neutral',
        dashed: true,
        message: removing ? `Deploy to remove this ${target.kind.toLowerCase()}.` : target.unbound
      }
    }
    return {
      ...base,
      name: value,
      boundValue: value,
      status: pick === undefined ? 'Active' : 'Staged',
      severity: pick === undefined ? 'success' : 'warning',
      dashed: pick !== undefined,
      message: pick === undefined ? '' : `Deploy to apply this ${target.kind.toLowerCase()}.`
    }
  }

  const levels = computed<TopologyLevel[]>(() => [
    {
      key: 'domain',
      nodes: [
        {
          key: 'domain',
          kind: 'Domain',
          icon: 'pi pi-globe',
          name: 'shop.example.com',
          status: 'Live',
          severity: 'success'
        }
      ]
    },
    {
      key: 'workload',
      nodes: [
        {
          key: 'workload',
          kind: 'Workload',
          icon: 'pi pi-sitemap',
          name: 'storefront',
          status: 'Active',
          severity: 'success'
        }
      ]
    },
    { key: 'firewall', nodes: [slotNode('firewall')] },
    {
      key: 'application',
      nodes: [
        {
          key: 'application',
          kind: 'Application',
          icon: 'pi pi-box',
          name: APP.name,
          status: 'Active',
          severity: 'success'
        }
      ]
    },
    { key: 'function', nodes: [{ ...slotNode('function'), terminal: true }] }
  ])

  const stagedChanges = computed(() =>
    Object.entries(staged).map(([key, value]) => ({
      key,
      kind: targets[key].kind,
      from: deployed[key] || 'Not bound',
      to: value || 'Removed'
    }))
  )

  const bind = (key: string, value: string) => {
    if (value === deployed[key]) delete staged[key]
    else staged[key] = value
    stagedNote.value = `${value} staged on ${targets[key].kind.toLowerCase()}.`
  }
  const unbind = (key: string) => {
    if (staged[key] !== undefined && staged[key] !== '') delete staged[key]
    else if (deployed[key]) staged[key] = ''
    stagedNote.value = `${targets[key].kind} staged for removal.`
  }
  const createTarget = (key: string) => {
    stagedNote.value = `Opens the create flow for a new ${targets[key].kind.toLowerCase()}.`
  }

  const deployOpen = ref(false)
  const deploying = ref(false)
  const RUN_TOAST = 'application-deploy'
  let timer: ReturnType<typeof setTimeout> | undefined

  const editStaged = () => {
    toast.dismiss(RUN_TOAST)
    activeTab.value = 'topology'
  }

  const runDeploy = () => {
    deployOpen.value = false
    deploying.value = true
    const changes = stagedChanges.value.length
    toast.loading(`Deploying ${APP.name}…`, {
      id: RUN_TOAST,
      description: 'It keeps running if you leave this page.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      for (const [key, value] of Object.entries(staged)) {
        deployed[key] = value
        delete staged[key]
      }
      deploying.value = false
      stagedNote.value = ''
      toast.success(`${APP.name} is live.`, {
        id: RUN_TOAST,
        description: changes
          ? `${changes} topology ${changes === 1 ? 'change' : 'changes'} now serve Production.`
          : 'Production serves the active version.',
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: editStaged },
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
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
        <template #actions>
          <div class="flex items-center gap-(--spacing-xs)">
            <Tag
              v-if="stagedCount"
              :label="`${stagedCount} ${stagedCount === 1 ? 'change' : 'changes'}`"
              severity="warning"
              size="small"
            />
            <Button
              label="Deploy"
              kind="outlined"
              size="medium"
              icon="pi pi-cloud-upload"
              :loading="deploying"
              @click="deployOpen = true"
            />
          </div>
        </template>
      </PageTabs>
    </div>

    <section class="min-h-0 flex-1">
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <section
          v-if="activeTab === 'overview'"
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
        >
          <Card :padded="false">
            <template #content>
              <div
                class="flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
              >
                <div
                  class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
                >
                  <i
                    class="pi pi-box shrink-0 text-body-lg text-(--text-muted)"
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
                      <DropdownMenu.Option
                        value="copy-url"
                        label="Copy URL"
                      />
                    </DropdownMenu.Group>
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="settings"
                        label="Settings"
                      />
                    </DropdownMenu.Group>
                  </DropdownMenu>
                </div>
              </div>

              <dl
                class="m-0 grid grid-cols-2 gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md) sm:grid-cols-3 lg:grid-cols-6"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                  <dt class="text-label-sm text-(--text-muted)">Deployment</dt>
                  <dd class="m-0 flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                    <a
                      :href="`/deployments/${APP.deployment}`"
                      class="truncate text-body-sm text-(--text-default) underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                      >{{ APP.deployment }}</a
                    >
                    <Tag
                      label="Production"
                      severity="secondary"
                      size="small"
                      class="shrink-0"
                    />
                  </dd>
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs) lg:col-span-2">
                  <dt class="text-label-sm text-(--text-muted)">Status</dt>
                  <dd class="m-0 flex min-h-7 items-center">
                    <StatusIndicator
                      severity="success"
                      label="Ready"
                    />
                  </dd>
                </div>
                <div
                  v-for="fact in facts"
                  :key="fact.label"
                  class="flex min-w-0 flex-col gap-(--spacing-xxs)"
                >
                  <dt class="text-label-sm text-(--text-muted)">{{ fact.label }}</dt>
                  <dd class="m-0 flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                    <Avatar
                      v-if="fact.author"
                      :label="fact.author"
                      size="small"
                    />
                    <span
                      class="truncate text-body-sm text-(--text-default)"
                      :class="fact.code && 'font-(family-name:--font-code)'"
                      >{{ fact.value }}</span
                    >
                  </dd>
                </div>
              </dl>

              <div
                class="flex flex-wrap items-center justify-between gap-(--spacing-sm) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-sm)"
              >
                <p class="m-0 text-body-sm text-(--text-muted)">
                  Settings, cache and rules live on a version. Open the active version to change
                  them, then deploy it.
                </p>
                <Button
                  label="Open active version"
                  kind="outlined"
                  size="small"
                  @click="activeTab = 'versions'"
                />
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
              <TableRoot
                :data="versions"
                :columns="versionColumns"
                row-key="id"
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
              </TableRoot>
            </template>
          </Card>
        </section>

        <section
          v-else-if="activeTab === 'deployments'"
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
        >
          <SectionHeader
            title="Deployments"
            size="small"
          />
          <Card :padded="false">
            <template #content>
              <TableRoot
                :data="deployments"
                :columns="deploymentColumns"
                row-key="id"
                :bordered="false"
                aria-label="Deployments"
              >
                <template #cell-status="{ value }">
                  <StatusIndicator
                    :severity="deploymentSeverity[value]"
                    :label="value"
                  />
                </template>
              </TableRoot>
            </template>
          </Card>
        </section>

        <section
          v-else
          class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-section-gap)"
        >
          <SectionHeader
            title="Deployment topology"
            description="How a request reaches this application in Production. Bind or remove a firewall or a function here; the change is staged until you deploy."
            size="small"
          />
          <div
            class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
          >
            <TopologyDiagram
              v-model:expanded="expanded"
              :levels="levels"
              @bind="bind"
              @remove="unbind"
              @create="createTarget"
            />
          </div>
          <p
            role="status"
            class="m-0 text-body-sm text-(--text-muted)"
          >
            {{ stagedCount ? `${stagedNote} ${stagedCount} staged. Deploy to apply.` : stagedNote }}
          </p>
        </section>
      </div>
    </section>

    <Drawer
      v-model:open="deployOpen"
      side="right"
      size="medium"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <PanelHeader class="w-full">
            <DrawerTitle>Deploy {{ APP.name }}</DrawerTitle>
            <DrawerClose />
          </PanelHeader>
          <PanelContent>
            <div class="flex flex-col gap-(--spacing-md)">
              <DrawerDescription>
                Version {{ APP.version }} goes to Production. The version that is live keeps serving
                until the new one is ready.
              </DrawerDescription>
              <section
                aria-labelledby="application-deploy-changes"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <h3
                  id="application-deploy-changes"
                  class="m-0 text-label-md text-(--text-default)"
                >
                  Topology changes
                </h3>
                <ul
                  v-if="stagedChanges.length"
                  class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
                >
                  <li
                    v-for="change in stagedChanges"
                    :key="change.key"
                    class="flex flex-wrap items-center justify-between gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
                  >
                    <span class="text-body-sm text-(--text-default)">{{ change.kind }}</span>
                    <span class="text-body-sm text-(--text-muted)"
                      >{{ change.from }} to {{ change.to }}</span
                    >
                  </li>
                </ul>
                <p
                  v-else
                  class="m-0 text-body-sm text-(--text-muted)"
                >
                  No topology change is staged. The deploy publishes the active version as it is.
                </p>
              </section>
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
      </DrawerPortal>
    </Drawer>
  </div>
</template>
