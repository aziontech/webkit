<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'

  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'pi pi-home', path: '/home' },
        { id: 'projects', label: 'Projects', icon: 'pi pi-folder', path: '/projects' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'pi pi-cloud-upload',
          path: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'applications', label: 'Applications', icon: 'pi pi-box', path: '/applications' },
        { id: 'services', label: 'Services', icon: 'pi pi-server', path: '/services' },
        { id: 'variables', label: 'Variables', icon: 'pi pi-sliders-h', path: '/variables' },
        { id: 'integrations', label: 'Integrations', icon: 'pi pi-link', path: '/integrations' },
        { id: 'templates', label: 'Templates', icon: 'pi pi-clone', path: '/templates' }
      ]
    },
    {
      label: 'Security',
      items: [
        { id: 'domains', label: 'Domains', icon: 'pi pi-globe', path: '/domains' },
        { id: 'policies', label: 'Policies', icon: 'pi pi-shield', path: '/policies' },
        { id: 'rule-sets', label: 'Rule sets', icon: 'pi pi-list', path: '/rule-sets' },
        { id: 'keys', label: 'Keys', icon: 'pi pi-key', path: '/keys' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          id: 'databases',
          label: 'Databases',
          icon: 'pi pi-database',
          path: '/databases',
          tagValue: 'Preview'
        },
        { id: 'storage', label: 'Storage', icon: 'pi pi-inbox', path: '/storage' }
      ]
    },
    {
      label: 'Observability',
      items: [
        { id: 'logs', label: 'Logs', icon: 'pi pi-file', path: '/logs' },
        {
          id: 'metrics-module',
          label: 'Metrics',
          icon: 'pi pi-chart-bar',
          kind: 'drill',
          href: '/metrics',
          groups: [
            {
              items: [{ id: 'metrics', label: 'Overview', path: '/metrics' }]
            },
            {
              label: 'Build',
              items: [
                {
                  id: 'metrics-resources',
                  label: 'Resources',
                  path: '/metrics',
                  query: { dashboard: 'resources' }
                },
                {
                  id: 'metrics-services',
                  label: 'Services',
                  path: '/metrics',
                  query: { dashboard: 'services' }
                },
                {
                  id: 'metrics-cache',
                  label: 'Cache',
                  path: '/metrics',
                  query: { dashboard: 'cache' }
                }
              ]
            },
            {
              label: 'Security',
              items: [
                {
                  id: 'metrics-domains',
                  label: 'Domains',
                  path: '/metrics',
                  query: { dashboard: 'domains' }
                },
                {
                  id: 'metrics-policies',
                  label: 'Policies',
                  path: '/metrics',
                  query: { dashboard: 'policies' }
                },
                {
                  id: 'metrics-rule-sets',
                  label: 'Rule sets',
                  path: '/metrics',
                  query: { dashboard: 'rule-sets' }
                }
              ]
            },
            {
              label: 'Data',
              items: [
                {
                  id: 'metrics-databases',
                  label: 'Databases',
                  path: '/metrics',
                  query: { dashboard: 'databases' }
                },
                {
                  id: 'metrics-storage',
                  label: 'Storage',
                  path: '/metrics',
                  query: { dashboard: 'storage' }
                }
              ]
            }
          ]
        },
        { id: 'events', label: 'Events', icon: 'pi pi-bolt', path: '/events' }
      ]
    },
    {
      label: 'More',
      items: [
        { id: 'catalog', label: 'Catalog', icon: 'pi pi-th-large', path: '/catalog' },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', path: '/account' },
                {
                  id: 'settings-build-deployment',
                  label: 'Build and deployment',
                  path: '/account/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  path: '/account/environments'
                },
                { id: 'settings-users', label: 'Users management', path: '/account/users' },
                { id: 'settings-teams', label: 'Teams and permissions', path: '/account/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', path: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', path: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity history', path: '/account/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', path: '/account/billing' },
                { id: 'settings-invoices', label: 'Invoices' }
              ]
            }
          ]
        }
      ]
    }
  ]

  const recentRows = [
    {
      key: 'applications/storefront-app',
      name: 'storefront-app',
      icon: 'pi pi-box',
      typeLabel: 'Application',
      navId: 'applications'
    },
    {
      key: 'domains/domain-1020655',
      name: 'app.example.com',
      icon: 'pi pi-globe',
      typeLabel: 'Domain',
      navId: 'domains'
    },
    {
      key: 'databases/feature-flags',
      name: 'feature-flags',
      icon: 'pi pi-database',
      typeLabel: 'Database',
      navId: 'databases'
    }
  ]

  const accountCommands = [
    { id: 'settings', label: 'Account settings', icon: 'pi pi-cog' },
    { id: 'personal-tokens', label: 'Personal tokens', icon: 'pi pi-key' },
    { id: 'docs', label: 'Docs', icon: 'pi pi-book' },
    { id: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }
  ]

  const activeId = ref('applications')
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)

  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })

  const leaves = (items) =>
    items.flatMap((item) =>
      item.groups
        ? leaves(item.groups.flatMap((group) => group.items))
        : item.children
          ? leaves(item.children)
          : [item]
    )

  const paletteGroups = navGroups.flatMap((group, groupIndex) => {
    const blocks = []
    let run = []
    const flush = () => {
      if (run.length) {
        blocks.push({
          key: `area-${groupIndex}-${blocks.length}`,
          heading: group.label ?? '',
          items: leaves(run)
        })
      }
      run = []
    }
    for (const item of group.items) {
      if (item.groups || item.children) {
        flush()
        blocks.push({ key: item.id, heading: item.label, items: leaves([item]) })
      } else run.push(item)
    }
    flush()
    return blocks
  })

  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.value
  )

  const actionCommands = computed(() => [
    { id: 'create', label: 'Create Application', icon: 'pi pi-plus-circle' },
    {
      id: 'theme',
      label: resolvedTheme.value === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
    },
    {
      id: 'sidebar',
      label: railCollapsed.value ? 'Expand sidebar' : 'Collapse sidebar',
      icon: railCollapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'
    }
  ])

  const onNavigate = (event, node, closeNavigation) => {
    activeId.value = node.id
    closeNavigation()
  }

  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') activeId.value = id
    if (scope === 'res') {
      activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }
  const APP = {
    name: 'storefront-app',
    host: 'storefront-app-k3m9.example.app',
    deployment: '4182093317',
    version: 'BX7Q2LMA'
  }

  const crumbs = [{ label: 'Applications', href: '/applications' }, { label: APP.name }]

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

  const versionColumns = [
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
      description: 'Add rule "Redirect old checkout"',
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
  const versionSeverity = { Active: 'success', Ready: 'secondary', Draft: 'warning' }

  const deploymentColumns = [
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
  const deploymentSeverity = { Live: 'success', Failed: 'danger', Building: 'info' }

  const targets = {
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

  const deployed = reactive({ firewall: 'edge-guard', function: '' })
  const staged = reactive({})
  const expanded = ref(['firewall'])
  const stagedCount = computed(() => Object.keys(staged).length)
  const stagedNote = ref('')

  const slotNode = (key) => {
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

  const levels = computed(() => [
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

  const bind = (key, value) => {
    if (value === deployed[key]) delete staged[key]
    else staged[key] = value
    stagedNote.value = `${value} staged on ${targets[key].kind.toLowerCase()}.`
  }
  const unbind = (key) => {
    if (staged[key] !== undefined && staged[key] !== '') delete staged[key]
    else if (deployed[key]) staged[key] = ''
    stagedNote.value = `${targets[key].kind} staged for removal.`
  }
  const createTarget = (key) => {
    stagedNote.value = `Opens the create flow for a new ${targets[key].kind.toLowerCase()}.`
  }

  const deployOpen = ref(false)
  const deploying = ref(false)
  const RUN_TOAST = 'application-deploy'
  let timer

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
  <div class="h-dvh [--sidebar-width:var(--container-2xs)]">
    <AppLayout>
      <template #navigation="{ drawer, closeNavigation }">
        <Sidebar
          v-model:width="railWidth"
          v-model:collapsed="railCollapsed"
          :resizable="!drawer"
          :collapsible="!drawer"
          aria-label="Main navigation"
          collapse-aria-label="Collapse sidebar"
          expand-aria-label="Expand sidebar"
          resize-aria-label="Resize sidebar"
        >
          <template #header>
            <div class="-m-(--spacing-md) flex flex-col">
              <div
                class="flex h-14 shrink-0 items-center border-b border-(--border-default) px-(--spacing-md)"
              >
                <a
                  href="/home"
                  aria-label="Azion home"
                  class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                >
                  <Brand
                    kind="default"
                    size="small"
                  />
                </a>
              </div>

              <Command
                v-model:open="paletteOpen"
                @select="onPaletteSelect"
              >
                <Command.Input
                  placeholder="Search resources, pages and commands"
                  @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
                />
                <Command.List>
                  <Command.Group
                    v-if="!paletteQuery"
                    key="recents"
                    heading="Recents"
                  >
                    <Command.Item
                      v-for="row in recentRows"
                      :key="row.key"
                      :value="'res:' + row.key"
                    >
                      <template #prefix>
                        <i
                          :class="row.icon"
                          aria-hidden="true"
                        />
                      </template>
                      {{ row.name }}
                      <template #suffix>
                        <span class="text-label-sm text-(--text-muted)">{{ row.typeLabel }}</span>
                      </template>
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator
                    v-if="!paletteQuery"
                    key="recents-rule"
                  />

                  <Command.Group
                    v-for="group in paletteGroups"
                    :key="group.key"
                    :heading="group.heading"
                  >
                    <Command.Item
                      v-for="item in group.items"
                      :key="item.id"
                      :value="'nav:' + item.id"
                    >
                      <template
                        v-if="item.icon"
                        #prefix
                      >
                        <i
                          :class="item.icon"
                          aria-hidden="true"
                        />
                      </template>
                      {{ item.label }}
                    </Command.Item>
                  </Command.Group>

                  <Command.Separator key="commands-rule" />

                  <Command.Group heading="Actions">
                    <Command.Item
                      v-for="command in actionCommands"
                      :key="command.id"
                      :value="'cmd:' + command.id"
                    >
                      <template #prefix>
                        <i
                          :class="command.icon"
                          aria-hidden="true"
                        />
                      </template>
                      {{ command.label }}
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Account">
                    <Command.Item
                      v-for="command in accountCommands"
                      :key="command.id"
                      :value="'cmd:' + command.id"
                    >
                      <template #prefix>
                        <i
                          :class="command.icon"
                          aria-hidden="true"
                        />
                      </template>
                      {{ command.label }}
                    </Command.Item>
                  </Command.Group>

                  <Command.Empty>No resource, page or command matches your search.</Command.Empty>
                </Command.List>
              </Command>
            </div>
          </template>

          <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
            <Menu
              :groups="navGroups"
              :active-id="activeId"
              role="presentation"
              @navigate="(event, node) => onNavigate(event, node, closeNavigation)"
            >
              <Menu.Back />
            </Menu>
          </div>

          <template #footer>
            <div class="flex items-center gap-(--spacing-xs)">
              <Avatar
                label="alex@example.com"
                size="small"
                kind="square"
              />
              <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)">alex</span>
              <DropdownMenu placement="top-end">
                <DropdownMenu.Trigger>
                  <Tooltip text="Account menu">
                    <IconButton
                      icon="pi pi-ellipsis-v"
                      aria-label="Account menu"
                      kind="outlined"
                      size="small"
                    />
                  </Tooltip>
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <template #top>
                    <div class="flex min-w-0 flex-col">
                      <span class="truncate text-label-md text-(--text-default)">alex</span>
                      <span class="truncate text-body-xs text-(--text-muted)"
                        >alex@example.com</span
                      >
                    </div>
                  </template>
                  <DropdownMenu.Option
                    value="settings"
                    label="Account settings"
                  >
                    <template #right>
                      <i
                        class="pi pi-cog"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Option>
                  <DropdownMenu.Option
                    value="personal-tokens"
                    label="Personal tokens"
                  >
                    <template #right>
                      <i
                        class="pi pi-key"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Option>
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                  <div
                    class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                  >
                    <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
                      >Theme</span
                    >
                    <ThemeSwitcher
                      v-model="theme"
                      aria-label="Theme"
                    />
                  </div>
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="home"
                    label="Home page"
                  >
                    <template #right>
                      <i
                        class="pi pi-home"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Option>
                  <DropdownMenu.Option
                    value="changelog"
                    label="Changelog"
                  >
                    <template #right>
                      <i
                        class="pi pi-pencil"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Option>
                  <DropdownMenu.Option
                    value="feedback"
                    label="Feedback"
                  >
                    <template #right>
                      <i
                        class="pi pi-comment"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Option>
                  <DropdownMenu.Option
                    value="docs"
                    label="Docs"
                  >
                    <template #right>
                      <i
                        class="pi pi-book"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Option>
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="logout"
                    label="Log out"
                  >
                    <template #right>
                      <i
                        class="pi pi-sign-out"
                        aria-hidden="true"
                      />
                    </template>
                  </DropdownMenu.Option>
                </DropdownMenu.Group>
                <DropdownMenu.Group>
                  <div
                    class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)"
                  >
                    <Button
                      label="Upgrade to Pro"
                      kind="secondary"
                      size="medium"
                      class="w-full"
                    />
                    <div class="flex justify-center px-(--spacing-xs)">
                      <StatusIndicator
                        severity="success"
                        label="All systems normal"
                      />
                    </div>
                  </div>
                </DropdownMenu.Group>
              </DropdownMenu>
            </div>
          </template>
        </Sidebar>
      </template>

      <template #header="{ compact, openNavigation }">
        <div class="@container">
          <GlobalHeader aria-label="Console">
            <GlobalHeader.Left>
              <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
                <span
                  v-if="compact"
                  class="contents"
                >
                  <Tooltip
                    text="Open navigation"
                    placement="bottom"
                  >
                    <IconButton
                      icon="pi pi-bars"
                      aria-label="Open navigation"
                      kind="outlined"
                      size="medium"
                      @click="openNavigation"
                    />
                  </Tooltip>
                </span>

                <a
                  v-if="compact"
                  href="/home"
                  aria-label="Azion home"
                  class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                >
                  <Brand
                    kind="default"
                    size="small"
                  />
                </a>

                <div
                  v-else
                  class="-ms-(--spacing-xs) flex w-fit min-w-0 shrink"
                >
                  <Breadcrumb
                    :items="crumbs"
                    class="w-full"
                  />
                </div>
              </div>
            </GlobalHeader.Left>
            <GlobalHeader.Middle />
            <GlobalHeader.Right>
              <SearchTrigger
                collapsible
                @open="paletteOpen = true"
              />

              <span
                v-if="compact"
                class="contents"
              >
                <Tooltip
                  text="Create"
                  placement="bottom"
                >
                  <IconButton
                    icon="pi pi-plus-circle"
                    kind="primary"
                    size="medium"
                    aria-label="Create"
                  />
                </Tooltip>
                <Tooltip
                  text="Agent"
                  placement="bottom"
                >
                  <IconButton
                    icon="ai ai-ask-azion"
                    kind="outlined"
                    size="medium"
                    aria-label="Agent"
                  />
                </Tooltip>
              </span>
              <span
                v-else
                class="contents"
              >
                <Button
                  label="Create"
                  kind="primary"
                  size="medium"
                  icon="pi pi-plus-circle"
                />
                <ButtonHighlight
                  label="Agent"
                  size="medium"
                  icon="ai ai-ask-azion"
                />
              </span>

              <button
                type="button"
                aria-label="Account settings"
                class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
              >
                <Avatar
                  label="alex@example.com"
                  size="medium"
                  kind="square"
                />
              </button>
            </GlobalHeader.Right>
          </GlobalHeader>
        </div>
      </template>

      <main class="flex h-full flex-col animate-page-enter motion-reduce:animate-none">
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

        <section class="min-h-0 flex-1 overflow-auto">
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
                {{
                  stagedCount ? `${stagedNote} ${stagedCount} staged. Deploy to apply.` : stagedNote
                }}
              </p>
            </section>
          </div>
        </section>
      </main>
    </AppLayout>

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

    <Toaster position="bottom-right" />
  </div>
</template>
