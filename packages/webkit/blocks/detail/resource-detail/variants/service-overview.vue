<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Select from '@aziontech/webkit/select'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import TopologyDiagram, {
    type TopologyDiagramBindOption,
    type TopologyDiagramLevel,
    type TopologyDiagramNodeData,
    type TopologyDiagramNodeField
  } from '@aziontech/webkit/topology-diagram'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  type ProductionStep = {
    id: string
    icon: string
    title: string
    description: string
    actionLabel: string
    done: boolean
    doneNote?: string
  }
  type Target = {
    kind: string
    icon: string
    options: TopologyDiagramBindOption[]
    unbound?: string
    bound?: string
    removable?: boolean
    fields?: TopologyDiagramNodeField[]
  }

  const environments = [
    { name: 'Production', policy: 'Single' },
    { name: 'Preview', policy: 'Versioned' }
  ]
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const activeTab = ref('overview')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const environment = ref('Production')
  const environmentQuery = ref('')
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((option) => option.name.toLowerCase().includes(needle))
  })

  const domains = [
    'service-01.example.com',
    'service-01-alias-1.example.com',
    'service-01-alias-2.example.com',
    'service-01-alias-3.example.com',
    'service-01-alias-4.example.com',
    'service-01-alias-5.example.com',
    'service-01-alias-6.example.com',
    'service-01-alias-7.example.com'
  ]
  const productionSteps: ProductionStep[] = [
    {
      id: 'domain',
      icon: 'ai ai-globe',
      title: 'Add a custom domain',
      description:
        'Serve this service on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
      actionLabel: 'Add Domain',
      done: false
    },
    {
      id: 'policy',
      icon: 'ai ai-shield',
      title: 'Enable a security policy',
      description:
        'Bind a policy so requests are inspected before they reach the resource. Rate limiting, request inspection, and IP filtering.',
      actionLabel: 'Bind Policy',
      done: false
    },
    {
      id: 'errorPage',
      icon: 'ai ai-file',
      title: 'Set custom error pages',
      description: 'Answer 4xx and 5xx with your own page instead of the default response.',
      actionLabel: 'Bind Error Page',
      done: false
    }
  ]

  const SERVICE = { name: 'service-01' }

  const detailOpen = ref(false)

  const targets: Record<string, Target> = {
    policy: {
      kind: 'Policy',
      icon: 'ai ai-shield',
      options: [
        { value: 'payments-api', label: 'payments-api' },
        { value: 'api-hardening', label: 'api-hardening' },
        { value: 'partner-gateway', label: 'partner-gateway' },
        { value: 'production-policy', label: 'production-policy' },
        { value: 'canary-policy', label: 'canary-policy' }
      ],
      unbound: 'Requests reach the resource without inspection.'
    },
    errorPage: {
      kind: 'Error Page',
      icon: 'ai ai-file',
      options: [
        { value: 'Branded 404', label: 'Branded 404' },
        { value: 'Maintenance window', label: 'Maintenance window' },
        { value: 'Server error', label: 'Server error' },
        { value: 'Blocked by policy', label: 'Blocked by policy' },
        { value: 'Rate limited', label: 'Rate limited' }
      ],
      unbound: 'Errors answer with the default page.'
    },
    origin: {
      kind: 'Origin',
      icon: 'ai ai-link',
      options: [
        { value: 'web-app-storage', label: 'web-app-storage' },
        { value: 'api-primary', label: 'api-primary' },
        { value: 'assets-storage', label: 'assets-storage' },
        { value: 'api-failover', label: 'api-failover' },
        { value: 'uploads', label: 'uploads' }
      ],
      removable: false,
      bound:
        'Provisioned with this service. It is the resource’s origin, so it can be re-pointed but not removed.',
      fields: [
        { label: 'ID', value: '1599818521' },
        { label: 'Type', value: 'Storage' },
        { label: 'Address', value: 'web-app-assets' }
      ]
    }
  }

  const deployed = reactive<Record<string, string>>({
    policy: '',
    errorPage: '',
    origin: 'web-app-storage'
  })
  const staged = reactive<Record<string, string>>({})
  const expanded = ref<string[]>([])
  const stagedCount = computed(() => Object.keys(staged).length)
  const stagedNote = ref('')

  const slotNode = (key: string): TopologyDiagramNodeData => {
    const target = targets[key]
    const pick = staged[key]
    const removing = pick === ''
    const value = pick === undefined ? deployed[key] : pick
    const base = {
      id: key,
      type: target.kind,
      icon: target.icon,
      bindable: true,
      bindOptions: target.options,
      removable: target.removable !== false
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
      message:
        pick === undefined
          ? target.bound || ''
          : `Deploy to apply this ${target.kind.toLowerCase()}.`,
      fields: pick === undefined ? target.fields : undefined
    }
  }

  const topologyLevels = computed<TopologyDiagramLevel[]>(() => [
    {
      id: 'domains',
      nodes: [
        {
          id: 'domains',
          type: 'Domains',
          icon: 'ai ai-globe',
          name: 'service-01.example.com',
          status: '1 domain',
          severity: 'neutral',
          fields: [
            {
              label: 'Generated domain',
              value: 'service-01.example.com',
              copyable: true,
              href: 'https://service-01.example.com'
            }
          ]
        }
      ]
    },
    {
      id: 'service',
      nodes: [
        {
          id: 'service',
          type: 'Service',
          icon: 'ai ai-server',
          name: SERVICE.name,
          status: 'Live',
          severity: 'success',
          href: '/services/1020655',
          fields: [
            { label: 'ID', value: '1020655' },
            {
              label: 'Domain',
              value: 'service-01.example.com',
              copyable: true,
              href: 'https://service-01.example.com'
            },
            { label: 'Environment', value: 'Production' }
          ]
        }
      ]
    },
    { id: 'policy', nodes: [slotNode('policy')] },
    {
      id: 'resource',
      nodes: [
        {
          id: 'resource',
          type: 'Resource',
          icon: 'ai ai-box',
          name: 'web-app',
          status: 'Active',
          severity: 'success',
          href: '/resources/1170472732',
          fields: [
            { label: 'ID', value: '1170472732' },
            { label: 'Repository', value: 'acme/web-app' },
            { label: 'Branch', value: 'main' }
          ]
        },
        { ...slotNode('errorPage'), terminal: true }
      ]
    },
    { id: 'origin', nodes: [slotNode('origin')] },
    {
      id: 'storage',
      nodes: [
        {
          id: 'storage',
          type: 'Storage',
          icon: 'ai ai-inbox',
          name: 'web-app-assets',
          status: 'Public',
          severity: 'info',
          href: '/storage/web-app-assets',
          terminal: true,
          fields: [
            { label: 'Access', value: 'Public' },
            { label: 'Files', value: '24' },
            { label: 'Size', value: '1.2 MB' }
          ]
        }
      ]
    }
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

  const topologyEl = ref<HTMLElement | null>(null)
  const showTopology = (key: string) => {
    detailOpen.value = false
    if (!expanded.value.includes(key)) expanded.value = [...expanded.value, key]
    topologyEl.value?.scrollIntoView({ block: 'start' })
  }

  const deployOpen = ref(false)
  const deploying = ref(false)
  const RUN_TOAST = 'service-deploy'
  let timer: ReturnType<typeof setTimeout> | undefined

  const editStaged = () => {
    toast.dismiss(RUN_TOAST)
    topologyEl.value?.scrollIntoView({ block: 'start' })
  }

  const runDeploy = () => {
    deployOpen.value = false
    deploying.value = true
    const changes = stagedChanges.value.length
    toast.loading(`Deploying ${SERVICE.name}…`, {
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
      toast.success(`${SERVICE.name} is live.`, {
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

  onBeforeUnmount(() => clearTimeout(timer))

  const doneCount = computed(() => productionSteps.filter((step) => step.done).length)
  const complete = computed(
    () => productionSteps.length > 0 && doneCount.value === productionSteps.length
  )
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <ConsoleLayout.Breadcrumb
      :items="[
        { label: 'Services', href: '/services' },
        { label: SERVICE.name, href: '/services/1020655' }
      ]"
    >
      <Select
        :model-value="environment"
        :display-value="(value) => String(value ?? '')"
        variant="ghost"
        size="small"
        @update:model-value="
          (value) => {
            if (value !== '__add-environment__') environment = String(value)
          }
        "
        @update:open="
          (open) => {
            if (!open) environmentQuery = ''
          }
        "
      >
        <Select.Trigger aria-label="Switch environment" />
        <Select.Content>
          <template #search>
            <Input
              v-model="environmentQuery"
              size="small"
              placeholder="Search environments"
              aria-label="Search environments"
              @keydown.stop
            >
              <template #leading>
                <i
                  class="ai ai-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </template>
          <Select.Group label="Environments">
            <Select.Item
              v-for="option in environmentMatches"
              :key="option.name"
              :value="option.name"
            >
              {{ option.name }}
              <template #tag>
                <Tag
                  :label="option.policy"
                  severity="neutral"
                  size="small"
                />
              </template>
            </Select.Item>
            <p
              v-if="!environmentMatches.length"
              class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
            >
              No environments match "{{ environmentQuery }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Item
              value="__add-environment__"
              class="w-full"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="ai ai-circle-plus"
                  aria-hidden="true"
                />
                Add Environment
              </span>
            </Select.Item>
          </template>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumb>
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
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
              variant="outline"
              size="medium"
              icon="ai ai-cloud-upload"
              :loading="deploying"
              @click="deployOpen = true"
            />
          </div>
        </template>
      </PageTabs>
    </div>

    <section
      v-if="activeTab === 'overview'"
      class="min-h-0 flex-1"
    >
      <div>
        <div class="layout-column layout-boundary flex min-w-0 flex-col">
          <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
            <Card :padded="false">
              <template #default>
                <div
                  class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
                >
                  <div
                    class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
                  >
                    <i
                      class="ai ai-globe shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <div class="flex min-w-0">
                      <Tooltip
                        content="Open service-01.example.com in a new tab"
                        class="w-full"
                      >
                        <a
                          href="https://service-01.example.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          data-link
                          class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                        >
                          <span class="truncate underline-offset-2 group-hover/link:underline"
                            >service-01.example.com</span
                          >
                          <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                          <i
                            class="ai ai-external-link shrink-0 text-body-xs leading-none"
                            aria-hidden="true"
                          />
                        </a>
                      </Tooltip>
                    </div>
                    <Popover
                      placement="bottom-start"
                      size="small"
                    >
                      <Popover.Trigger>
                        <div class="shrink-0 cursor-pointer">
                          <Tag
                            label="+7"
                            severity="neutral"
                            size="small"
                          />
                        </div>
                      </Popover.Trigger>

                      <Popover.Content>
                        <div
                          class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                        >
                          <p class="text-label-sm text-(--text-muted)">8 domains</p>
                        </div>

                        <div
                          class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-2xs)"
                        >
                          <a
                            v-for="domain in domains"
                            :key="domain"
                            :href="`https://${domain}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center gap-(--spacing-2xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                          >
                            <span class="truncate">{{ domain }}</span>
                            <i
                              class="ai ai-external-link ms-auto shrink-0 text-body-xs leading-none"
                              aria-hidden="true"
                            />
                          </a>
                        </div>

                        <span
                          class="sr-only"
                          role="status"
                          >8 domains</span
                        >
                      </Popover.Content>
                    </Popover>
                  </div>

                  <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
                    <Button
                      label="Visit"
                      href="https://service-01.example.com"
                      target="_blank"
                      variant="secondary"
                      size="medium"
                      icon="ai ai-external-link"
                    />

                    <div class="contents md:hidden">
                      <Tooltip
                        content="Select an environment to see its deployment and settings, or add another one"
                      >
                        <DropdownMenu
                          placement="bottom-end"
                          @select="
                            (_event, value) => {
                              if (value !== '__add-environment__') environment = String(value)
                            }
                          "
                        >
                          <DropdownMenu.Trigger>
                            <span
                              class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)"
                            >
                              <i
                                class="ai ai-layers shrink-0 text-(--text-muted)"
                                aria-hidden="true"
                              />
                              <span class="truncate">{{ environment }}</span>
                              <i
                                class="ai ai-chevron-down shrink-0 text-(--text-muted)"
                                aria-hidden="true"
                              />
                            </span>
                          </DropdownMenu.Trigger>

                          <DropdownMenu.Group label="Environments">
                            <DropdownMenu.Item
                              v-for="option in environments"
                              :key="option.name"
                              :value="option.name"
                              :label="option.name"
                              :selected="option.name === environment"
                            />
                          </DropdownMenu.Group>

                          <DropdownMenu.Group>
                            <DropdownMenu.Item
                              value="__add-environment__"
                              label="Add Environment"
                            >
                              <template #leading>
                                <i
                                  class="ai ai-plus"
                                  aria-hidden="true"
                                />
                              </template>
                            </DropdownMenu.Item>
                          </DropdownMenu.Group>
                        </DropdownMenu>
                      </Tooltip>
                    </div>

                    <DropdownMenu placement="bottom-end">
                      <DropdownMenu.Trigger>
                        <Tooltip content="Service actions">
                          <IconButton
                            icon="ai ai-ellipsis"
                            variant="outline"
                            size="medium"
                            aria-label="Service actions"
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
                              class="ai ai-copy"
                              aria-hidden="true"
                            />
                          </template>
                        </DropdownMenu.Item>
                      </DropdownMenu.Group>

                      <DropdownMenu.Group>
                        <DropdownMenu.Item
                          value="manage-domains"
                          label="Manage domains"
                        >
                          <template #leading>
                            <i
                              class="ai ai-globe"
                              aria-hidden="true"
                            />
                          </template>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                          value="settings"
                          label="Settings"
                        >
                          <template #leading>
                            <i
                              class="ai ai-settings"
                              aria-hidden="true"
                            />
                          </template>
                        </DropdownMenu.Item>
                      </DropdownMenu.Group>
                    </DropdownMenu>
                  </div>
                </div>

                <div
                  class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-4"
                >
                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                      <span class="text-label-sm text-(--text-muted)">Custom domains</span>
                      <Tooltip content="Add a custom domain">
                        <IconButton
                          icon="ai ai-circle-plus"
                          variant="ghost"
                          size="small"
                          aria-label="Add a custom domain"
                        />
                      </Tooltip>
                    </span>
                    <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-muted)"> None </span>
                    </div>
                  </div>

                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span class="text-label-sm text-(--text-muted)">Status</span>
                    <div class="flex min-h-7 min-w-0 items-center">
                      <StatusIndicator
                        severity="success"
                        label="Live"
                      />
                    </div>
                  </div>

                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span class="text-label-sm text-(--text-muted)">Service ID</span>
                    <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm tabular-nums text-(--text-default)">
                        1020655
                      </span>
                      <CopyButton
                        variant="outline"
                        value="1020655"
                        aria-label="Copy service ID"
                        class="shrink-0"
                        size="small"
                      />
                    </div>
                  </div>

                  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                    <span class="text-label-sm text-(--text-muted)">Created</span>
                    <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">
                        Sep 22 by Ethan Brooks
                      </span>
                      <Avatar
                        alt="Ethan Brooks"
                        label="Ethan Brooks"
                        size="small"
                        variant="square"
                        class="shrink-0"
                      />
                    </div>
                  </div>
                </div>

                <div
                  class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas)"
                >
                  <Accordion
                    type="single"
                    icon-position="leading"
                    collapsible
                  >
                    <Accordion.Item value="deployment-settings">
                      <div class="relative">
                        <Accordion.Trigger :heading-level="3">
                          <span class="flex min-h-12 items-center">
                            <span class="text-label-md text-(--text-default)"
                              >Deployment Settings</span
                            >
                          </span>
                        </Accordion.Trigger>

                        <div
                          class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-2xs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:end-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pe-(--spacing-md) @lg/band:pb-0"
                        >
                          <Tag
                            label="Shared · 3 services"
                            severity="warning"
                            size="medium"
                            class="shrink-0"
                          />
                          <div class="pointer-events-auto">
                            <Tooltip
                              content="Open acme-production in Build and deployment settings"
                            >
                              <a
                                href="/account/build-deployment"
                                class="group/link inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                              >
                                <span
                                  class="truncate underline-offset-2 group-hover/link:underline"
                                >
                                  acme-production
                                </span>
                                <i
                                  class="ai ai-external-link shrink-0 text-body-xs leading-none"
                                  aria-hidden="true"
                                />
                              </a>
                            </Tooltip>
                          </div>
                        </div>
                      </div>

                      <Accordion.Content>
                        <div class="px-(--spacing-md) pt-(--spacing-xs)">
                          <Alert
                            severity="warning"
                            size="small"
                            label="Deploying with this setting also publishes to service-05, service-09."
                          />
                        </div>

                        <div
                          class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4"
                        >
                          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                            <span class="text-label-sm text-(--text-muted)">Binding policy</span>
                            <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                              <span class="truncate text-body-sm text-(--text-default)">
                                Strict
                              </span>
                            </span>
                          </div>
                          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                            <span class="text-label-sm text-(--text-muted)">Deployment policy</span>
                            <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                              <span class="truncate text-body-sm text-(--text-default)">
                                Single
                              </span>
                            </span>
                          </div>
                          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                            <span class="text-label-sm text-(--text-muted)">Canary</span>
                            <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                              <svg
                                class="h-(--size-4) w-(--size-4) shrink-0 text-(--success-foreground)"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                fill-rule="evenodd"
                                aria-hidden="true"
                              >
                                <path
                                  d="M8 0a8 8 0 100 16A8 8 0 008 0z M11.53 5.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 0z"
                                />
                              </svg>
                              <span class="truncate text-body-sm text-(--text-default)">
                                Enabled
                              </span>
                            </span>
                          </div>
                          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                            <span class="text-label-sm text-(--text-muted)">Skew protection</span>
                            <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                              <svg
                                class="h-(--size-4) w-(--size-4) shrink-0 text-(--success-foreground)"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                fill-rule="evenodd"
                                aria-hidden="true"
                              >
                                <path
                                  d="M8 0a8 8 0 100 16A8 8 0 008 0z M11.53 5.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 0z"
                                />
                              </svg>
                              <span class="truncate text-body-sm text-(--text-default)">
                                Enabled
                              </span>
                            </span>
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </template>
            </Card>

            <Card
              :padded="false"
              :data-complete="complete || null"
            >
              <template #header>
                <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
                  <h2 class="truncate text-label-md text-(--text-default)">Ship to production</h2>

                  <Tag
                    :label="
                      complete
                        ? 'Ready for production'
                        : `${doneCount} of ${productionSteps.length}`
                    "
                    :severity="complete ? 'success' : 'neutral'"
                    size="small"
                    class="shrink-0"
                  />
                </div>

                <IconButton
                  icon="ai ai-window-maximize"
                  aria-label="Expand the production checklist"
                  variant="outline"
                  size="small"
                  class="shrink-0"
                  @click="detailOpen = true"
                />
              </template>

              <template #default>
                <div
                  v-if="!complete"
                  class="flex flex-col"
                >
                  <div
                    v-for="step in productionSteps"
                    :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
                    :data-done="step.done || null"
                    class="group/step transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
                  >
                    <Item
                      size="small"
                      clickable
                    >
                      <Item.Media>
                        <i
                          :class="step.icon"
                          class="text-body-sm leading-none text-(--text-muted) group-data-done/step:text-(--primary)"
                          aria-hidden="true"
                        />
                      </Item.Media>

                      <Item.Content>
                        <Item.Title>
                          {{ step.title }}
                        </Item.Title>
                      </Item.Content>

                      <Item.Actions>
                        <i
                          v-if="step.done"
                          class="ai ai-check text-body-sm leading-none text-(--primary)"
                          aria-hidden="true"
                        />
                        <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
                      </Item.Actions>
                    </Item>
                  </div>
                </div>
              </template>
            </Card>

            <Drawer
              v-model:open="detailOpen"
              size="large"
              side="end"
            >
              <DrawerContent>
                <PanelHeader class="w-full">
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                      <DrawerTitle>Ship to production</DrawerTitle>
                      <Tag
                        :label="
                          complete
                            ? 'Ready for production'
                            : `${doneCount} of ${productionSteps.length}`
                        "
                        :severity="complete ? 'success' : 'neutral'"
                        size="small"
                        class="shrink-0"
                      />
                    </div>
                    <p class="text-body-sm text-(--text-muted)">
                      The create put this service live on a generated hostname. These are the gates
                      between that and production.
                    </p>
                  </div>
                </PanelHeader>

                <PanelBody>
                  <div class="flex flex-col gap-(--spacing-sm)">
                    <Item
                      v-for="step in productionSteps"
                      :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
                      size="medium"
                      :data-done="step.done || null"
                    >
                      <Item.Media>
                        <span
                          class="flex size-8 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
                          aria-hidden="true"
                        >
                          <i
                            :class="step.done ? 'ai ai-check' : step.icon"
                            class="text-body-sm leading-none"
                          />
                        </span>
                      </Item.Media>

                      <Item.Content>
                        <Item.Title>
                          {{ step.title }}
                        </Item.Title>
                        <Item.Description>
                          {{ step.description }}
                        </Item.Description>
                      </Item.Content>

                      <Item.Footer>
                        <Tag
                          v-if="step.done"
                          icon="ai ai-check"
                          :label="step.doneNote || 'Done'"
                          severity="neutral"
                          size="medium"
                        />
                        <Button
                          v-else
                          :label="step.actionLabel || step.title"
                          variant="outline"
                          size="small"
                          @click="step.id in targets ? showTopology(step.id) : (detailOpen = false)"
                        />
                      </Item.Footer>
                    </Item>
                  </div>
                </PanelBody>

                <PanelFooter>
                  <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
                    <Button
                      label="Done"
                      variant="primary"
                      size="medium"
                      @click="detailOpen = false"
                    />
                  </div>
                </PanelFooter>
              </DrawerContent>
            </Drawer>

            <div
              ref="topologyEl"
              class="flex scroll-mt-(--spacing-lg) flex-col gap-(--layout-group-gap)"
            >
              <SectionHeader
                title="Deployment topology"
                description="How a request reaches this service in Production. Bind, change or remove a policy, an error page or the origin here; the change is staged until you deploy."
                size="small"
              />
              <div
                class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
              >
                <TopologyDiagram
                  v-model:open-keys="expanded"
                  :levels="topologyLevels"
                  @bind="(_event, { id, value }) => bind(id, value)"
                  @remove="(_event, key) => unbind(key)"
                  @create="(_event, key) => createTarget(key)"
                >
                  <template #actions="{ node }">
                    <Tooltip
                      v-if="node.id === 'domains'"
                      content="Add domain"
                    >
                      <IconButton
                        icon="ai ai-plus"
                        variant="outline"
                        size="small"
                        aria-label="Add domain"
                        href="/domains/create"
                      />
                    </Tooltip>
                  </template>
                </TopologyDiagram>
              </div>
              <p
                role="status"
                class="m-0 text-body-sm text-(--text-muted)"
              >
                {{
                  stagedCount ? `${stagedNote} ${stagedCount} staged. Deploy to apply.` : stagedNote
                }}
              </p>
            </div>
          </section>
        </div>
      </div>
    </section>
    <section
      v-else
      class="min-h-0 flex-1"
    >
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="layout-section-start">
          <EmptyState
            size="medium"
            icon="ai ai-external-link"
            :title="tabLabel"
            :description="`${tabLabel} opens on its own page.`"
          >
            <template #actions>
              <Button
                :label="`Open ${tabLabel}`"
                variant="outline"
                size="small"
                :href="`/services/service-01/${activeTab}`"
              />
            </template>
          </EmptyState>
        </div>
      </div>
    </section>

    <Drawer
      v-model:open="deployOpen"
      side="end"
      size="large"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Deploy {{ SERVICE.name }}</DrawerTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <DrawerDescription>
              The service goes to Production with the changes below. The deployment that is live
              keeps serving until the new one is ready.
            </DrawerDescription>
            <section
              aria-labelledby="service-deploy-changes"
              class="flex flex-col gap-(--spacing-xs)"
            >
              <h3
                id="service-deploy-changes"
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
                  class="flex flex-wrap items-center justify-between gap-(--spacing-xs) rounded-(--shape-control) border border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
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
                No topology change is staged. The deploy publishes the service as it is.
              </p>
            </section>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end gap-(--spacing-xs)">
            <Button
              label="Cancel"
              variant="outline"
              @click="deployOpen = false"
            />
            <Button
              label="Deploy"
              variant="primary"
              icon="ai ai-cloud-upload"
              @click="runDeploy"
            />
          </div>
        </PanelFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
