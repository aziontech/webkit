<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import CopyButton from '@aziontech/webkit/copy-button'
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
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Menu from '@aziontech/webkit/menu'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import SectionHeader from '@aziontech/webkit/section-header'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
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
        { id: 'home', label: 'Home', icon: 'pi pi-home', href: '/home' },
        { id: 'projects', label: 'Projects', icon: 'pi pi-folder', href: '/projects' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'pi pi-cloud-upload',
          href: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'resources', label: 'Resources', icon: 'pi pi-box', href: '/resources' },
        { id: 'services', label: 'Services', icon: 'pi pi-server', href: '/services' },
        { id: 'variables', label: 'Variables', icon: 'pi pi-sliders-h', href: '/variables' },
        { id: 'integrations', label: 'Integrations', icon: 'pi pi-link', href: '/integrations' },
        { id: 'templates', label: 'Templates', icon: 'pi pi-clone', href: '/templates' }
      ]
    },
    {
      label: 'Security',
      items: [
        { id: 'domains', label: 'Domains', icon: 'pi pi-globe', href: '/domains' },
        { id: 'policies', label: 'Policies', icon: 'pi pi-shield', href: '/policies' },
        { id: 'rule-sets', label: 'Rule sets', icon: 'pi pi-list', href: '/rule-sets' },
        { id: 'keys', label: 'Keys', icon: 'pi pi-key', href: '/keys' }
      ]
    },
    {
      label: 'Data',
      items: [
        {
          id: 'databases',
          label: 'Databases',
          icon: 'pi pi-database',
          href: '/databases',
          tagValue: 'Preview'
        },
        { id: 'storage', label: 'Storage', icon: 'pi pi-inbox', href: '/storage' }
      ]
    },
    {
      label: 'Observability',
      items: [
        { id: 'logs', label: 'Logs', icon: 'pi pi-file', href: '/logs' },
        {
          id: 'metrics-module',
          label: 'Metrics',
          icon: 'pi pi-chart-bar',
          kind: 'drill',
          href: '/metrics',
          groups: [
            {
              items: [{ id: 'metrics', label: 'Overview', href: '/metrics' }]
            },
            {
              label: 'Build',
              items: [
                {
                  id: 'metrics-resources',
                  label: 'Resources',
                  href: '/metrics',
                  query: { dashboard: 'resources' }
                },
                {
                  id: 'metrics-services',
                  label: 'Services',
                  href: '/metrics',
                  query: { dashboard: 'services' }
                },
                {
                  id: 'metrics-cache',
                  label: 'Cache',
                  href: '/metrics',
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
                  href: '/metrics',
                  query: { dashboard: 'domains' }
                },
                {
                  id: 'metrics-policies',
                  label: 'Policies',
                  href: '/metrics',
                  query: { dashboard: 'policies' }
                },
                {
                  id: 'metrics-rule-sets',
                  label: 'Rule sets',
                  href: '/metrics',
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
                  href: '/metrics',
                  query: { dashboard: 'databases' }
                },
                {
                  id: 'metrics-storage',
                  label: 'Storage',
                  href: '/metrics',
                  query: { dashboard: 'storage' }
                }
              ]
            }
          ]
        },
        { id: 'events', label: 'Events', icon: 'pi pi-bolt', href: '/events' }
      ]
    },
    {
      label: 'More',
      items: [
        { id: 'catalog', label: 'Catalog', icon: 'pi pi-th-large', href: '/catalog' },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', href: '/account' },
                {
                  id: 'settings-build-deployment',
                  label: 'Build and deployment',
                  href: '/account/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  href: '/account/environments'
                },
                { id: 'settings-users', label: 'Users management', href: '/account/users' },
                { id: 'settings-teams', label: 'Teams and permissions', href: '/account/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', href: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', href: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity history', href: '/account/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', href: '/account/billing' },
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
      key: 'resources/1020655',
      name: 'resource-01',
      icon: 'pi pi-box',
      typeLabel: 'Resource',
      navId: 'resources'
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

  const leadingCrumbs = [
    { label: 'Services', href: '/services' },
    { label: 'service-01', href: '/services/1020655' }
  ]

  const environments = [
    { name: 'Production', policy: 'Single' },
    { name: 'Preview', policy: 'Versioned' }
  ]
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const activeId = ref('services')
  const navOpen = ref(false)
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)
  const activeTab = ref('overview')
  const environment = ref('Production')
  const environmentQuery = ref('')

  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((entry) => entry.name.toLowerCase().includes(needle))
  })

  const pickEnvironment = (value) => {
    if (value !== '__create-environment__') environment.value = value
  }

  const onEnvironmentOpen = (open) => {
    if (!open) environmentQuery.value = ''
  }

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
    { id: 'create', label: 'Create Resource', icon: 'pi pi-plus-circle' },
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

  const onNavigate = (event, node) => {
    event.preventDefault()
    activeId.value = node.id
  }

  const onMobileNavigate = (event, node) => {
    onNavigate(event, node)
    navOpen.value = false
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
  const productionSteps = [
    {
      id: 'domain',
      icon: 'pi pi-globe',
      title: 'Add a custom domain',
      description:
        'Serve it on a domain of your own, with a free HTTPS certificate, instead of the generated hostname.',
      actionLabel: 'Add Domain',
      done: false
    },
    {
      id: 'policy',
      icon: 'pi pi-shield',
      title: 'Attach a security policy',
      description:
        'Bind a policy so requests are inspected before they reach the resource. Rate limiting, request inspection, and IP filtering.',
      actionLabel: 'Bind Policy',
      done: false
    },
    {
      id: 'errorPage',
      icon: 'pi pi-file',
      title: 'Set custom error pages',
      description: 'Answer 4xx and 5xx with your own page instead of the default response.',
      actionLabel: 'Bind Error Page',
      done: false
    }
  ]

  const SERVICE = { name: 'service-01' }

  const detailOpen = ref(false)

  const targets = {
    policy: {
      kind: 'Policy',
      icon: 'pi pi-shield',
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
      icon: 'pi pi-file',
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
      icon: 'pi pi-link',
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

  const deployed = reactive({ policy: '', errorPage: '', origin: 'web-app-storage' })
  const staged = reactive({})
  const expanded = ref([])
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

  const topologyLevels = computed(() => [
    {
      key: 'domains',
      nodes: [
        {
          key: 'domains',
          kind: 'Domains',
          icon: 'pi pi-globe',
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
      key: 'service',
      nodes: [
        {
          key: 'service',
          kind: 'Service',
          icon: 'pi pi-server',
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
    { key: 'policy', nodes: [slotNode('policy')] },
    {
      key: 'resource',
      nodes: [
        {
          key: 'resource',
          kind: 'Resource',
          icon: 'pi pi-box',
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
    { key: 'origin', nodes: [slotNode('origin')] },
    {
      key: 'storage',
      nodes: [
        {
          key: 'storage',
          kind: 'Storage',
          icon: 'pi pi-inbox',
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

  const topologyRef = ref(null)
  const showTopology = (key) => {
    detailOpen.value = false
    if (!expanded.value.includes(key)) expanded.value = [...expanded.value, key]
    topologyRef.value?.scrollIntoView({ block: 'start' })
  }

  const deployOpen = ref(false)
  const deploying = ref(false)
  const RUN_TOAST = 'service-deploy'
  let timer

  const editStaged = () => {
    toast.dismiss(RUN_TOAST)
    topologyRef.value?.scrollIntoView({ block: 'start' })
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
  <div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
    <div class="hidden h-full [--sidebar-width:var(--container-2xs)] md:flex">
      <Sidebar
        v-model:width="railWidth"
        v-model:collapsed="railCollapsed"
        resizable
        collapsible
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
            @navigate="onNavigate"
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
                    <span class="truncate text-body-xs text-(--text-muted)">alex@example.com</span>
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
                <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)">
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
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="@container">
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left>
            <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
              <span class="contents md:hidden">
                <Tooltip
                  text="Open navigation"
                  placement="bottom"
                >
                  <IconButton
                    icon="pi pi-bars"
                    aria-label="Open navigation"
                    kind="outlined"
                    size="medium"
                    @click="navOpen = true"
                  />
                </Tooltip>
              </span>

              <a
                href="/home"
                aria-label="Azion home"
                class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none md:hidden"
              >
                <Brand
                  kind="default"
                  size="small"
                />
              </a>

              <div class="-ms-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
                <Breadcrumb class="w-full">
                  <Breadcrumb.List>
                    <template
                      v-for="(item, index) in leadingCrumbs"
                      :key="item.label + '-' + index"
                    >
                      <li class="inline-flex items-center">
                        <Breadcrumb.Item
                          :label="item.label"
                          :href="item.href"
                        />
                      </li>
                      <Breadcrumb.Separator />
                    </template>
                    <li class="inline-flex min-w-0 items-center">
                      <div class="min-w-0">
                        <Select
                          :model-value="environment"
                          :display-value="(value) => String(value ?? '')"
                          size="small"
                          class="w-full"
                          @update:model-value="pickEnvironment"
                          @update:open="onEnvironmentOpen"
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
                                <template #iconLeft>
                                  <i
                                    class="pi pi-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </template>
                            <Select.Group label="Environments">
                              <Select.Option
                                v-for="entry in environmentMatches"
                                :key="entry.name"
                                :value="entry.name"
                              >
                                {{ entry.name }}
                                <template #tag>
                                  <Tag
                                    :label="entry.policy"
                                    severity="secondary"
                                    size="small"
                                  />
                                </template>
                              </Select.Option>
                              <p
                                v-if="!environmentMatches.length"
                                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                              >
                                No environments match "{{ environmentQuery }}".
                              </p>
                            </Select.Group>
                            <template #footer>
                              <Select.Option
                                value="__create-environment__"
                                class="w-full"
                              >
                                <span class="flex items-center gap-(--spacing-xs)">
                                  <i
                                    class="pi pi-plus-circle"
                                    aria-hidden="true"
                                  />
                                  Add Environment
                                </span>
                              </Select.Option>
                            </template>
                          </Select.Content>
                        </Select>
                      </div>
                    </li>
                  </Breadcrumb.List>
                </Breadcrumb>
              </div>
            </div>
          </GlobalHeader.Left>
          <GlobalHeader.Middle />
          <GlobalHeader.Right>
            <SearchTrigger
              collapsible
              @open="paletteOpen = true"
            />

            <span class="contents md:hidden">
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
            <span class="hidden md:contents">
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

      <div class="min-h-0 flex-1 overflow-auto animate-page-enter motion-reduce:animate-none">
        <main class="flex h-full flex-col">
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
            <div>
              <div class="layout-column layout-boundary flex min-w-0 flex-col">
                <section
                  class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
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
                              text="Open service-01.example.com in a new tab"
                              class="w-full"
                            >
                              <a
                                href="https://service-01.example.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                data-link
                                class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                              >
                                <span class="truncate underline-offset-2 group-hover/link:underline"
                                  >service-01.example.com</span
                                >
                                <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                                <i
                                  class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                  aria-hidden="true"
                                />
                              </a>
                            </Tooltip>
                          </div>
                          <Popover
                            placement="bottom-start"
                            width="small"
                          >
                            <Popover.Trigger>
                              <div class="shrink-0 cursor-pointer">
                                <Tag
                                  label="+7"
                                  severity="secondary"
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
                                class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
                              >
                                <a
                                  v-for="domain in domains"
                                  :key="domain"
                                  :href="`https://${domain}`"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                >
                                  <span class="truncate">{{ domain }}</span>
                                  <i
                                    class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
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
                            kind="secondary"
                            size="medium"
                            icon="pi pi-external-link"
                          />

                          <div class="contents md:hidden">
                            <Tooltip
                              text="Select an environment to see its deployment and settings, or add another one"
                            >
                              <DropdownMenu
                                placement="bottom-end"
                                @select="
                                  (event, value) => {
                                    if (value !== '__add-environment__') environment = value
                                  }
                                "
                              >
                                <DropdownMenu.Trigger>
                                  <span
                                    class="flex h-8 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong)"
                                  >
                                    <i
                                      class="ai ai-layers shrink-0 text-(--text-muted)"
                                      aria-hidden="true"
                                    />
                                    <span class="truncate">{{ environment }}</span>
                                    <i
                                      class="pi pi-chevron-down shrink-0 text-(--text-muted)"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </DropdownMenu.Trigger>

                                <DropdownMenu.Group label="Environments">
                                  <DropdownMenu.Option
                                    v-for="option in environments"
                                    :key="option.name"
                                    :value="option.name"
                                    :label="option.name"
                                    :selected="option.name === environment"
                                  />
                                </DropdownMenu.Group>

                                <DropdownMenu.Group>
                                  <DropdownMenu.Option
                                    value="__add-environment__"
                                    label="Add Environment"
                                  >
                                    <template #left>
                                      <i
                                        class="pi pi-plus"
                                        aria-hidden="true"
                                      />
                                    </template>
                                  </DropdownMenu.Option>
                                </DropdownMenu.Group>
                              </DropdownMenu>
                            </Tooltip>
                          </div>

                          <DropdownMenu placement="bottom-end">
                            <DropdownMenu.Trigger>
                              <Tooltip text="Service actions">
                                <IconButton
                                  icon="pi pi-ellipsis-h"
                                  kind="outlined"
                                  size="medium"
                                  aria-label="Service actions"
                                />
                              </Tooltip>
                            </DropdownMenu.Trigger>

                            <DropdownMenu.Group>
                              <DropdownMenu.Option
                                value="copy-url"
                                label="Copy URL"
                              >
                                <template #left>
                                  <i
                                    class="pi pi-copy"
                                    aria-hidden="true"
                                  />
                                </template>
                              </DropdownMenu.Option>
                            </DropdownMenu.Group>

                            <DropdownMenu.Group>
                              <DropdownMenu.Option
                                value="manage-domains"
                                label="Manage domains"
                              >
                                <template #left>
                                  <i
                                    class="pi pi-globe"
                                    aria-hidden="true"
                                  />
                                </template>
                              </DropdownMenu.Option>
                              <DropdownMenu.Option
                                value="settings"
                                label="Settings"
                              >
                                <template #left>
                                  <i
                                    class="pi pi-cog"
                                    aria-hidden="true"
                                  />
                                </template>
                              </DropdownMenu.Option>
                            </DropdownMenu.Group>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div
                        class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-4"
                      >
                        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                          <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                            <span class="text-label-sm text-(--text-muted)">Custom domains</span>
                            <Tooltip text="Add a custom domain">
                              <button
                                type="button"
                                class="-m-1 inline-flex size-6 shrink-0 items-center justify-center rounded-(--shape-button) p-1 text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                aria-label="Add a custom domain"
                              >
                                <i
                                  class="pi pi-plus-circle text-body-sm leading-none"
                                  aria-hidden="true"
                                />
                              </button>
                            </Tooltip>
                          </span>
                          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                            <span class="truncate text-body-sm text-(--text-muted)"> None </span>
                          </div>
                        </div>

                        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                          <span class="text-label-sm text-(--text-muted)">Status</span>
                          <div class="flex min-h-7 min-w-0 items-center">
                            <StatusIndicator
                              severity="success"
                              label="Live"
                            />
                          </div>
                        </div>

                        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                          <span class="text-label-sm text-(--text-muted)">Service ID</span>
                          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                            <span class="truncate text-body-sm tabular-nums text-(--text-default)">
                              1020655
                            </span>
                            <CopyButton
                              kind="outlined"
                              value="1020655"
                              aria-label="Copy service ID"
                              class="shrink-0"
                            />
                          </div>
                        </div>

                        <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                          <span class="text-label-sm text-(--text-muted)">Created</span>
                          <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                            <span class="truncate text-body-sm text-(--text-default)">
                              Sep 22 by Robson Junior
                            </span>
                            <Avatar
                              alt="Robson Junior"
                              label="Robson Junior"
                              size="small"
                              kind="square"
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
                          arrow-position="left"
                          collapsible
                        >
                          <Accordion.Item value="deployment-settings">
                            <div class="relative">
                              <Accordion.Trigger :level="3">
                                <span class="flex min-h-12 items-center">
                                  <span class="text-label-md text-(--text-default)"
                                    >Deployment Settings</span
                                  >
                                </span>
                              </Accordion.Trigger>

                              <div
                                class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:end-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pe-(--spacing-md) @lg/band:pb-0"
                              >
                                <Tag
                                  label="Shared · 3 services"
                                  severity="warning"
                                  size="medium"
                                  class="shrink-0"
                                />
                                <div class="pointer-events-auto">
                                  <Tooltip
                                    text="Open acme-production in Build and deployment settings"
                                  >
                                    <a
                                      href="/account/build-deployment"
                                      class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                    >
                                      <span
                                        class="truncate underline-offset-2 group-hover/link:underline"
                                      >
                                        acme-production
                                      </span>
                                      <i
                                        class="pi pi-external-link shrink-0 text-body-xs leading-none"
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
                                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                  <span class="text-label-sm text-(--text-muted)"
                                    >Binding policy</span
                                  >
                                  <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                                    <span class="truncate text-body-sm text-(--text-default)">
                                      Strict
                                    </span>
                                  </span>
                                </div>
                                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                  <span class="text-label-sm text-(--text-muted)"
                                    >Deployment policy</span
                                  >
                                  <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                                    <span class="truncate text-body-sm text-(--text-default)">
                                      Single
                                    </span>
                                  </span>
                                </div>
                                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                  <span class="text-label-sm text-(--text-muted)">Canary</span>
                                  <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                                    <svg
                                      class="h-(--size-4) w-(--size-4) shrink-0 text-(--success-contrast)"
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
                                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                  <span class="text-label-sm text-(--text-muted)"
                                    >Skew protection</span
                                  >
                                  <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                                    <svg
                                      class="h-(--size-4) w-(--size-4) shrink-0 text-(--success-contrast)"
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
                        <h2 class="truncate text-label-md text-(--text-default)">
                          Ship to production
                        </h2>

                        <Tag
                          :label="
                            complete
                              ? 'Ready for production'
                              : `${doneCount} of ${productionSteps.length}`
                          "
                          :severity="complete ? 'success' : 'secondary'"
                          size="small"
                          class="shrink-0"
                        />
                      </div>

                      <IconButton
                        icon="pi pi-window-maximize"
                        aria-label="Expand the production checklist"
                        kind="outlined"
                        size="small"
                        class="shrink-0"
                        @click="detailOpen = true"
                      />
                    </template>

                    <template #content>
                      <div
                        v-if="!complete"
                        class="flex flex-col"
                      >
                        <Item
                          v-for="step in productionSteps"
                          :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
                          as-child
                          size="small"
                        >
                          <button
                            type="button"
                            :data-done="step.done || null"
                            class="w-full rounded-none text-start transition-colors duration-fast-02 ease-productive-entrance data-done:bg-(--primary-mask) motion-reduce:transition-none"
                          >
                            <Item.Media>
                              <i
                                :class="step.icon"
                                class="text-body-sm leading-none text-(--text-muted) group-data-done/item:text-(--primary)"
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
                                class="pi pi-check text-body-sm leading-none text-(--primary)"
                                aria-hidden="true"
                              />
                              <span class="sr-only">{{ step.done ? 'Done' : 'Not started' }}</span>
                            </Item.Actions>
                          </button>
                        </Item>
                      </div>
                    </template>
                  </Card>

                  <Drawer
                    v-model:open="detailOpen"
                    size="large"
                    side="right"
                  >
                    <DrawerPortal>
                      <DrawerOverlay />
                      <DrawerContent>
                        <PanelHeader class="w-full">
                          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                            <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                              <DrawerTitle>Ship to production</DrawerTitle>
                              <Tag
                                :label="
                                  complete
                                    ? 'Ready for production'
                                    : `${doneCount} of ${productionSteps.length}`
                                "
                                :severity="complete ? 'success' : 'secondary'"
                                size="small"
                                class="shrink-0"
                              />
                            </div>
                            <p class="text-body-sm text-(--text-muted)">
                              The create put this service live on a generated hostname. These are
                              the gates between that and production.
                            </p>
                          </div>
                          <DrawerClose />
                        </PanelHeader>

                        <PanelContent>
                          <div class="flex flex-col gap-(--spacing-sm)">
                            <Item
                              v-for="step in productionSteps"
                              :key="`${step.id}:${step.done ? 'done' : 'todo'}`"
                              size="medium"
                              :data-done="step.done || null"
                            >
                              <Item.Media>
                                <span
                                  class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-data-done/item:border-(--primary) group-data-done/item:bg-transparent group-data-done/item:text-(--primary) motion-reduce:transition-none"
                                  aria-hidden="true"
                                >
                                  <i
                                    :class="step.done ? 'pi pi-check' : step.icon"
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
                                  icon="pi pi-check"
                                  :label="step.doneNote || 'Done'"
                                  severity="secondary"
                                  size="medium"
                                />
                                <Button
                                  v-else
                                  :label="step.actionLabel || step.title"
                                  kind="outlined"
                                  size="small"
                                  @click="
                                    step.id in targets
                                      ? showTopology(step.id)
                                      : (detailOpen = false)
                                  "
                                />
                              </Item.Footer>
                            </Item>
                          </div>
                        </PanelContent>

                        <PanelFooter>
                          <div class="flex w-full items-center justify-end gap-(--spacing-sm)">
                            <Button
                              label="Done"
                              kind="primary"
                              size="medium"
                              @click="detailOpen = false"
                            />
                          </div>
                        </PanelFooter>
                      </DrawerContent>
                    </DrawerPortal>
                  </Drawer>

                  <div
                    ref="topologyRef"
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
                        v-model:expanded="expanded"
                        :levels="topologyLevels"
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
                        stagedCount
                          ? `${stagedNote} ${stagedCount} staged. Deploy to apply.`
                          : stagedNote
                      }}
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>

    <Drawer
      v-model:open="navOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent aria-label="Navigation">
          <Sidebar aria-label="Main navigation">
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
              </div>
            </template>

            <div class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)">
              <Menu
                :groups="navGroups"
                :active-id="activeId"
                role="presentation"
                @navigate="onMobileNavigate"
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
                <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)"
                  >alex</span
                >
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
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
    <Drawer
      v-model:open="deployOpen"
      side="right"
      size="medium"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <PanelHeader class="w-full">
            <DrawerTitle>Deploy {{ SERVICE.name }}</DrawerTitle>
            <DrawerClose />
          </PanelHeader>
          <PanelContent>
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
                  No topology change is staged. The deploy publishes the service as it is.
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
