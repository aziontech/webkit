<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import Alert from '@aziontech/webkit/alert'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Select from '@aziontech/webkit/select'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

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
        { id: 'resources', label: 'Resources', icon: 'pi pi-box', path: '/resources' },
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
                  label: 'Build & Deployment',
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
                { id: 'settings-tokens', label: 'Personal Tokens', path: '/personal-tokens' },
                { id: 'settings-credentials', label: 'Credentials', path: '/account/credentials' },
                { id: 'settings-security-mfa', label: 'Multi-factor auth' },
                { id: 'settings-security-sessions', label: 'Active sessions' },
                { id: 'settings-activity', label: 'Activity History', path: '/account/activity' }
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
    { id: 'settings', label: 'Account Settings', icon: 'pi pi-cog' },
    { id: 'personal-tokens', label: 'Personal Tokens', icon: 'pi pi-key' },
    { id: 'docs', label: 'Docs', icon: 'pi pi-book' },
    { id: 'logout', label: 'Log out', icon: 'pi pi-sign-out' }
  ]

  const leadingCrumbs = [
    { label: 'Resources', href: '/resources' },
    { label: 'resource-01', href: '/resources/1020655?name=resource-01' }
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

  const activeId = ref('resources')
  const navOpen = ref(false)
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref('system')
  const railWidth = ref(null)
  const railCollapsed = ref(false)

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
  const activeTab = ref('settings')
  const advancedOpen = ref(false)

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
      label: resolvedTheme.value === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon'
    },
    {
      id: 'sidebar',
      label: railCollapsed.value ? 'Expand Sidebar' : 'Collapse Sidebar',
      icon: railCollapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'
    }
  ])

  const onNavigate = (event, node) => {
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
    {
      id: 'generated',
      domain: 'resource-01.example.app',
      environment: 'Production',
      policy: 'Single',
      certificate: 'Platform (free)',
      generated: true
    },
    {
      id: 'd-7731',
      domain: 'www.example.com',
      environment: 'Production',
      policy: 'Single',
      certificate: 'example.com wildcard',
      generated: false
    }
  ]

  const linkedEnvironments = [
    {
      name: 'Production',
      policy: 'Single',
      settingsId: 's1',
      auto: true,
      options: [
        { value: 'default', label: 'Default' },
        { value: 's1', label: 'storefront-production' },
        { value: 's2', label: 'storefront-legacy' }
      ]
    },
    {
      name: 'Preview',
      policy: 'Versioned',
      settingsId: 's5',
      auto: true,
      options: [
        { value: 's5', label: 'analytics-canary' },
        { value: 's10', label: 'blog-platform-stage' }
      ]
    }
  ]

  const httpPortOptions = [
    { value: 80, label: '80 (Default)' },
    { value: 8008, label: '8008' },
    { value: 8080, label: '8080' },
    { value: 8880, label: '8880' }
  ]

  const httpsPortOptions = [
    { value: 443, label: '443 (Default)' },
    { value: 8443, label: '8443' },
    { value: 9440, label: '9440' },
    { value: 9441, label: '9441' },
    { value: 9442, label: '9442' },
    { value: 9443, label: '9443' },
    { value: 7777, label: '7777' },
    { value: 8888, label: '8888' },
    { value: 9553, label: '9553' },
    { value: 9653, label: '9653' },
    { value: 8035, label: '8035' },
    { value: 8090, label: '8090' }
  ]

  const http3PortOptions = [
    { value: 443, label: '443 (Default)' },
    { value: 7777, label: '7777' },
    { value: 8035, label: '8035' },
    { value: 8090, label: '8090' },
    { value: 8443, label: '8443' },
    { value: 8888, label: '8888' },
    { value: 9440, label: '9440' },
    { value: 9441, label: '9441' },
    { value: 9442, label: '9442' },
    { value: 9443, label: '9443' },
    { value: 9553, label: '9553' },
    { value: 9653, label: '9653' }
  ]

  const tlsVersionOptions = [
    { value: 'tls_1_3', label: 'TLS v1.3 (Default)' },
    { value: 'tls_1_2', label: 'TLS v1.2' },
    { value: 'tls_1_1', label: 'TLS v1.1 (Deprecated)' },
    { value: 'tls_1_0', label: 'TLS v1.0 (Deprecated)' }
  ]

  const cipherSuiteOptions = [
    { value: 7, label: 'Modern v2025Q1' },
    { value: 6, label: 'Compatible v2025Q1' },
    { value: 5, label: 'Legacy v2025Q1' },
    { value: 4, label: 'Modern v2022Q1 (migration TLS 1.3)' },
    { value: 3, label: 'Modern v2022Q1 - TLS 1.2' },
    { value: 2, label: 'Compatible v2018Q1 - TLS 1.2' },
    { value: 1, label: 'Legacy v2018Q1 - TLS 1.2' }
  ]

  const mtlsModeOptions = [
    {
      value: 'enforce',
      label: 'Enforce',
      description:
        'Blocks the client certificate during the TLS handshake when the Trusted CA can’t be validated.'
    },
    {
      value: 'permissive',
      label: 'Permissive',
      description:
        'Attempts to verify the client certificate, but allows the handshake even when the Trusted CA can’t be validated. Check which certificate attempted the request in the request logs.'
    }
  ]

  const trustedCaOptions = [
    { value: 'cert-8804', label: 'legacy origin CA' },
    { value: 'cert-8806', label: 'partner mTLS CA' }
  ]

  const revocationListOptions = [{ value: 'cert-8807', label: 'partner revocation list' }]

  const record = {
    name: 'resource-01',
    active: true,
    deploymentSettings: {},
    protocols: {
      httpPorts: [80],
      useHttps: true,
      httpsPorts: [443],
      useHttp3: false,
      http3Ports: [443],
      minimumTlsVersion: 'tls_1_3',
      cipherSuite: 7
    },
    mtls: { enabled: false, mode: 'enforce', certificate: '', crl: [] }
  }

  const form = reactive(structuredClone(record))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)

  const secure = computed(() => form.protocols.useHttps || form.protocols.useHttp3)
  const armed = computed(() => form.protocols.useHttps && form.mtls.enabled)

  const optionLabel = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? String(value ?? '')

  const portsLabel = (values) =>
    values.map((value) => optionLabel([...httpPortOptions, ...httpsPortOptions])(value)).join(', ')
  const tlsVersionLabel = optionLabel(tlsVersionOptions)
  const cipherSuiteLabel = optionLabel(cipherSuiteOptions)
  const certificateName = (value) => (value ? optionLabel(trustedCaOptions)(value) : '')
  const crlLabel = (values) => values.map(optionLabel(revocationListOptions)).join(', ')
  const settingName = (value) =>
    optionLabel(linkedEnvironments.flatMap((environment) => environment.options))(value)

  const setHttps = (value) => {
    form.protocols.useHttps = value
    if (!value) form.protocols.useHttp3 = false
  }

  const setHttp3 = (value) => {
    form.protocols.useHttp3 = value
    if (value) form.protocols.useHttps = true
  }

  const save = () => {
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(form)
      saving.value = false
    }, 900)
  }

  const discard = () => Object.assign(form, JSON.parse(baseline.value))
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
                  label="Account Settings"
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
                  label="Personal Tokens"
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
                  <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
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
                  label="Home Page"
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

              <div class="-ml-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
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
            <span class="contents @min-[47rem]:hidden">
              <IconButton
                icon="pi pi-search"
                kind="outlined"
                size="medium"
                aria-label="Search"
                aria-keyshortcuts="Meta+K"
                @click="paletteOpen = true"
              />
            </span>
            <button
              type="button"
              aria-label="Search"
              aria-keyshortcuts="Meta+K"
              class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-left text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
              @click="paletteOpen = true"
            >
              <span
                class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
                aria-hidden="true"
              >
                <i class="pi pi-search" />
              </span>
              <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)">Search</span>
              <Kbd
                meta
                size="small"
                class="shrink-0"
                >K</Kbd
              >
            </button>

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
          <div class="border-b border-(--border-default)">
            <div
              class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)"
            >
              <div class="flex -ml-(--spacing-xs) min-w-0 flex-1">
                <Tabs
                  v-model="activeTab"
                  class="w-full"
                >
                  <Tabs.List>
                    <Tabs.Item
                      v-for="tab in tabs"
                      :key="tab.value"
                      :value="tab.value"
                      :label="tab.label"
                    />
                  </Tabs.List>
                </Tabs>
              </div>
              <div class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)">
                <Button
                  label="Deploy"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-cloud-upload"
                />
              </div>
            </div>
          </div>

          <section class="min-h-0 flex-1 overflow-auto">
            <div>
              <div
                class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
              >
                <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <h1
                        data-size="small"
                        class="text-balance text-(--text-default) data-[size=small]:text-heading-xs data-[size=medium]:text-heading-sm data-[size=large]:text-heading-lg"
                      >
                        Settings
                      </h1>
                    </div>
                    <p class="text-pretty text-body-sm text-(--text-muted)">
                      Manage this resource’s configuration.
                    </p>
                  </div>
                </header>

                <form
                  class="mt-(--layout-section-gap) flex min-w-0 flex-col"
                  aria-label="Resource settings"
                  novalidate
                  @submit.prevent="save"
                >
                  <fieldset
                    class="m-0 flex min-w-0 flex-col border-0 p-0"
                    :disabled="saving"
                  >
                    <legend class="sr-only">Resource settings</legend>

                    <section
                      data-stacked
                      class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                    >
                      <div
                        data-stacked
                        class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                      >
                        <div
                          class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <button
                            type="button"
                            aria-label="Copy link to the General section"
                            class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                          >
                            <i
                              class="pi pi-link text-body-xs"
                              aria-hidden="true"
                            />
                          </button>
                          <h2
                            id="general"
                            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                          >
                            <span class="flex items-center gap-(--spacing-xs)">General</span>
                          </h2>
                          <Hint
                            text="How this resource is identified across the platform, and whether it answers at all."
                            class="shrink-0"
                          />
                        </div>
                      </div>
                      <div
                        data-open
                        class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                      >
                        <div class="min-w-0 data-collapsible:overflow-hidden">
                          <div
                            data-open
                            class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                          >
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <Item size="small">
                                    <Item.Content>
                                      <Item.Title>Name</Item.Title>
                                      <Item.Description
                                        >A unique and descriptive name to identify the
                                        resource.</Item.Description
                                      >
                                    </Item.Content>
                                    <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                      <Item.Actions class="w-full">
                                        <div
                                          class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                        >
                                          <Input
                                            v-model="form.name"
                                            size="large"
                                            class="w-full"
                                            aria-label="Name"
                                            :disabled="saving"
                                          />
                                        </div>
                                      </Item.Actions>
                                    </div>
                                  </Item>
                                  <Item size="small">
                                    <Item.Content>
                                      <Item.Title>Active</Item.Title>
                                      <Item.Description
                                        >When disabled, the resource stops answering and traffic to
                                        its domains is refused. Its deployments are
                                        kept.</Item.Description
                                      >
                                    </Item.Content>
                                    <Item.Actions>
                                      <Switch
                                        v-model="form.active"
                                        aria-label="Active"
                                        :disabled="saving"
                                      />
                                    </Item.Actions>
                                  </Item>
                                </Item.List>
                              </template>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section
                      data-stacked
                      class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                    >
                      <div
                        data-stacked
                        class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                      >
                        <div
                          class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <button
                            type="button"
                            aria-label="Copy link to the Domains section"
                            class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                          >
                            <i
                              class="pi pi-link text-body-xs"
                              aria-hidden="true"
                            />
                          </button>
                          <h2
                            id="domains"
                            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                          >
                            <span class="flex items-center gap-(--spacing-xs)">Domains</span>
                          </h2>
                          <Hint
                            text="The addresses this resource answers on, the environment each one answers in, and the certificate it is served with."
                            class="shrink-0"
                          />
                        </div>
                      </div>
                      <div
                        data-open
                        class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                      >
                        <div class="min-w-0 data-collapsible:overflow-hidden">
                          <div
                            data-open
                            class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                          >
                            <Card :padded="false">
                              <template #content>
                                <div class="flex min-w-0 flex-col">
                                  <Table :bordered="false">
                                    <Table.Header>
                                      <Table.Row>
                                        <Table.HeadCell principal>Domain</Table.HeadCell>
                                        <Table.HeadCell>Environment</Table.HeadCell>
                                        <Table.HeadCell>Policy</Table.HeadCell>
                                        <Table.HeadCell>Certificate</Table.HeadCell>
                                        <Table.HeadCell kind="action" />
                                      </Table.Row>
                                    </Table.Header>

                                    <Table.Body>
                                      <Table.Row
                                        v-for="entry in domains"
                                        :key="entry.id"
                                      >
                                        <Table.Cell principal>{{ entry.domain }}</Table.Cell>
                                        <Table.Cell>
                                          <Tag
                                            v-if="entry.environment"
                                            severity="secondary"
                                            size="medium"
                                            rounded
                                            icon="ai ai-layers"
                                            :label="entry.environment"
                                          />
                                        </Table.Cell>
                                        <Table.Cell>
                                          <Tag
                                            v-if="entry.environment"
                                            severity="secondary"
                                            size="medium"
                                            rounded
                                            :label="entry.policy"
                                          />
                                        </Table.Cell>
                                        <Table.Cell>
                                          <Tag
                                            severity="secondary"
                                            size="medium"
                                            rounded
                                            icon="pi pi-verified"
                                            :label="entry.certificate"
                                          />
                                        </Table.Cell>
                                        <Table.Cell kind="action">
                                          <DropdownMenu
                                            v-if="!entry.generated"
                                            placement="bottom-end"
                                          >
                                            <DropdownMenu.Trigger>
                                              <Tooltip text="Row actions">
                                                <IconButton
                                                  icon="pi pi-ellipsis-h"
                                                  kind="outlined"
                                                  size="small"
                                                  :disabled="saving"
                                                  :aria-label="`Actions for ${entry.domain}`"
                                                />
                                              </Tooltip>
                                            </DropdownMenu.Trigger>
                                            <DropdownMenu.Group>
                                              <DropdownMenu.Option
                                                value="edit"
                                                label="Edit"
                                              >
                                                <template #left
                                                  ><i
                                                    class="pi pi-pencil"
                                                    aria-hidden="true"
                                                /></template>
                                              </DropdownMenu.Option>
                                            </DropdownMenu.Group>
                                            <DropdownMenu.Group>
                                              <DropdownMenu.Option
                                                value="delete"
                                                label="Delete"
                                              >
                                                <template #left
                                                  ><i
                                                    class="pi pi-trash"
                                                    aria-hidden="true"
                                                /></template>
                                              </DropdownMenu.Option>
                                            </DropdownMenu.Group>
                                          </DropdownMenu>
                                        </Table.Cell>
                                      </Table.Row>
                                    </Table.Body>
                                  </Table>

                                  <div
                                    class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)"
                                  >
                                    <span class="text-body-xs text-(--text-muted)"
                                      >{{ domains.length }}
                                      {{ domains.length === 1 ? 'domain' : 'domains' }}</span
                                    >
                                    <Button
                                      type="button"
                                      label="Add Domain"
                                      kind="outlined"
                                      size="medium"
                                      icon="pi pi-plus"
                                      :disabled="saving"
                                    />
                                  </div>
                                </div>
                              </template>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section
                      data-stacked
                      class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                    >
                      <div
                        data-stacked
                        class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                      >
                        <div
                          class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <button
                            type="button"
                            aria-label="Copy link to the Advanced Settings section"
                            class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                          >
                            <i
                              class="pi pi-link text-body-xs"
                              aria-hidden="true"
                            />
                          </button>
                          <h2
                            id="advanced-settings"
                            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                          >
                            <button
                              type="button"
                              :aria-expanded="advancedOpen"
                              aria-controls="resource-advanced-settings"
                              :data-state="advancedOpen ? 'open' : 'closed'"
                              class="group/disclosure -mx-(--spacing-xxs) flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) text-left text-[length:inherit] font-[inherit] leading-[inherit] transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-muted) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                              @click="advancedOpen = !advancedOpen"
                            >
                              Advanced Settings
                              <i
                                class="pi pi-chevron-down shrink-0 text-body-xs leading-none text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance group-data-[state=open]/disclosure:rotate-180 motion-reduce:transition-none"
                                aria-hidden="true"
                              />
                            </button>
                          </h2>
                          <Hint
                            text="Deployment Settings, protocols and mutual authentication, which most resources never change."
                            class="shrink-0"
                          />
                        </div>
                      </div>
                      <div
                        id="resource-advanced-settings"
                        :data-open="advancedOpen || null"
                        :inert="!advancedOpen || undefined"
                        :aria-hidden="!advancedOpen || undefined"
                        class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                      >
                        <div
                          data-collapsible
                          class="min-w-0 data-collapsible:overflow-hidden"
                        >
                          <div
                            :data-open="advancedOpen || null"
                            class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                          >
                            <div class="flex min-w-0 flex-col">
                              <section
                                data-stacked
                                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                              >
                                <div
                                  data-stacked
                                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                                >
                                  <div
                                    class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                                  >
                                    <button
                                      type="button"
                                      aria-label="Copy link to the Deployment Settings section"
                                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                                    >
                                      <i
                                        class="pi pi-link text-body-xs"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <h2
                                      id="deployment-settings"
                                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                                    >
                                      <span class="flex items-center gap-(--spacing-xs)"
                                        >Deployment Settings</span
                                      >
                                    </h2>
                                    <Hint
                                      text="Which shared configuration each of this resource’s environments publishes with, linked automatically by deployment policy."
                                      class="shrink-0"
                                    />
                                  </div>
                                </div>
                                <div
                                  data-open
                                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                                >
                                  <div class="min-w-0 data-collapsible:overflow-hidden">
                                    <div
                                      data-open
                                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                                    >
                                      <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                                        <Alert
                                          severity="info"
                                          size="small"
                                          action-label="Manage Deployment Settings"
                                        >
                                          Deployment Settings centralize the services, policies and
                                          error pages that environments share. Every environment a
                                          domain answers in is linked to one automatically, matching
                                          that environment’s deployment policy.
                                        </Alert>

                                        <Card :padded="false">
                                          <template #content>
                                            <Item.List>
                                              <Item
                                                v-for="environment in linkedEnvironments"
                                                :key="environment.name"
                                                size="small"
                                              >
                                                <Item.Content>
                                                  <Item.Title>{{ environment.name }}</Item.Title>
                                                  <Item.Description>
                                                    <span
                                                      class="flex flex-wrap items-center gap-(--spacing-xs)"
                                                    >
                                                      <Tag
                                                        severity="info"
                                                        size="small"
                                                        :label="environment.policy"
                                                      />
                                                      <Tag
                                                        v-if="
                                                          environment.auto &&
                                                          !form.deploymentSettings[environment.name]
                                                        "
                                                        severity="secondary"
                                                        size="small"
                                                        label="Linked automatically"
                                                      />
                                                      <span class="text-body-xs text-(--text-muted)"
                                                        >Only {{ environment.policy }} Deployment
                                                        Settings can be linked to this
                                                        environment.</span
                                                      >
                                                    </span>
                                                  </Item.Description>
                                                </Item.Content>
                                                <div
                                                  class="flex max-w-(--container-3xs) flex-1 justify-end"
                                                >
                                                  <Item.Actions class="w-full">
                                                    <div
                                                      class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                    >
                                                      <Select
                                                        :model-value="
                                                          form.deploymentSettings[
                                                            environment.name
                                                          ] ?? environment.settingsId
                                                        "
                                                        size="large"
                                                        class="w-full"
                                                        placeholder="Select a Deployment Setting"
                                                        :disabled="saving"
                                                        :display-value="settingName"
                                                        @update:model-value="
                                                          form.deploymentSettings[
                                                            environment.name
                                                          ] = $event
                                                        "
                                                      >
                                                        <Select.Trigger
                                                          class="w-full"
                                                          :aria-label="`Deployment Settings for ${environment.name}`"
                                                        />
                                                        <Select.Content>
                                                          <Select.Option
                                                            v-for="option in environment.options"
                                                            :key="option.value"
                                                            :value="option.value"
                                                          >
                                                            {{ option.label }}
                                                          </Select.Option>
                                                        </Select.Content>
                                                      </Select>
                                                    </div>
                                                  </Item.Actions>
                                                </div>
                                              </Item>
                                            </Item.List>
                                          </template>
                                        </Card>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </section>

                              <section
                                data-stacked
                                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                              >
                                <div
                                  data-stacked
                                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                                >
                                  <div
                                    class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                                  >
                                    <button
                                      type="button"
                                      aria-label="Copy link to the Protocol Settings section"
                                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                                    >
                                      <i
                                        class="pi pi-link text-body-xs"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <h2
                                      id="protocol-settings"
                                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                                    >
                                      <span class="flex items-center gap-(--spacing-xs)"
                                        >Protocol Settings</span
                                      >
                                    </h2>
                                    <Hint
                                      text="Which protocols and ports this resource answers on, and the TLS floor it accepts."
                                      class="shrink-0"
                                    />
                                  </div>
                                </div>
                                <div
                                  data-open
                                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                                >
                                  <div class="min-w-0 data-collapsible:overflow-hidden">
                                    <div
                                      data-open
                                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                                    >
                                      <Card :padded="false">
                                        <template #content>
                                          <Item.List>
                                            <Item size="small">
                                              <Item.Content>
                                                <Item.Title>HTTP Ports</Item.Title>
                                                <Item.Description
                                                  >The ports this resource answers plain HTTP
                                                  on.</Item.Description
                                                >
                                              </Item.Content>
                                              <div
                                                class="flex max-w-(--container-3xs) flex-1 justify-end"
                                              >
                                                <Item.Actions class="w-full">
                                                  <div
                                                    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                  >
                                                    <MultiSelect
                                                      v-model="form.protocols.httpPorts"
                                                      size="large"
                                                      class="w-full"
                                                      placeholder="Select an HTTP port"
                                                      :disabled="saving"
                                                      :display-value="portsLabel"
                                                    >
                                                      <MultiSelect.Trigger
                                                        aria-label="HTTP Ports"
                                                      />
                                                      <MultiSelect.Content>
                                                        <MultiSelect.Option
                                                          v-for="option in httpPortOptions"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </MultiSelect.Option>
                                                      </MultiSelect.Content>
                                                    </MultiSelect>
                                                    <HelperText
                                                      v-if="!form.protocols.httpPorts.length"
                                                      id="http-ports-message"
                                                      :kind="'required'"
                                                      :label="'Select at least one HTTP port.'"
                                                    />
                                                  </div>
                                                </Item.Actions>
                                              </div>
                                            </Item>
                                            <Item size="small">
                                              <Item.Content>
                                                <Item.Title>HTTPS support</Item.Title>
                                                <Item.Description
                                                  >Answer on both HTTP and HTTPS. Required by HTTP/3
                                                  and by mutual authentication.</Item.Description
                                                >
                                              </Item.Content>
                                              <Item.Actions>
                                                <Switch
                                                  :model-value="form.protocols.useHttps"
                                                  aria-label="HTTPS support"
                                                  :disabled="saving"
                                                  @update:model-value="setHttps"
                                                />
                                              </Item.Actions>
                                            </Item>
                                            <Item
                                              v-if="form.protocols.useHttps"
                                              key="https-ports"
                                              size="small"
                                            >
                                              <Item.Content>
                                                <Item.Title>HTTPS Ports</Item.Title>
                                                <Item.Description
                                                  >The ports this resource answers TLS traffic
                                                  on.</Item.Description
                                                >
                                              </Item.Content>
                                              <div
                                                class="flex max-w-(--container-3xs) flex-1 justify-end"
                                              >
                                                <Item.Actions class="w-full">
                                                  <div
                                                    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                  >
                                                    <MultiSelect
                                                      v-model="form.protocols.httpsPorts"
                                                      size="large"
                                                      class="w-full"
                                                      placeholder="Select an HTTPS port"
                                                      :disabled="saving"
                                                      :display-value="portsLabel"
                                                    >
                                                      <MultiSelect.Trigger
                                                        aria-label="HTTPS Ports"
                                                      />
                                                      <MultiSelect.Content>
                                                        <MultiSelect.Option
                                                          v-for="option in httpsPortOptions"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </MultiSelect.Option>
                                                      </MultiSelect.Content>
                                                    </MultiSelect>
                                                    <HelperText
                                                      v-if="!form.protocols.httpsPorts.length"
                                                      id="https-ports-message"
                                                      :kind="'required'"
                                                      :label="'Select at least one HTTPS port.'"
                                                    />
                                                  </div>
                                                </Item.Actions>
                                              </div>
                                            </Item>
                                            <Item size="small">
                                              <Item.Content>
                                                <Item.Title>HTTP/3 support</Item.Title>
                                                <Item.Description
                                                  >Serve over HTTP/3 (QUIC) where the client
                                                  supports it. Turns HTTPS support on with
                                                  it.</Item.Description
                                                >
                                              </Item.Content>
                                              <Item.Actions>
                                                <Switch
                                                  :model-value="form.protocols.useHttp3"
                                                  aria-label="HTTP/3 support"
                                                  :disabled="saving"
                                                  @update:model-value="setHttp3"
                                                />
                                              </Item.Actions>
                                            </Item>
                                            <Item
                                              v-if="form.protocols.useHttp3"
                                              key="http3-ports"
                                              size="small"
                                            >
                                              <Item.Content>
                                                <Item.Title>HTTP/3 Ports</Item.Title>
                                                <Item.Description
                                                  >The ports QUIC is answered on.</Item.Description
                                                >
                                              </Item.Content>
                                              <div
                                                class="flex max-w-(--container-3xs) flex-1 justify-end"
                                              >
                                                <Item.Actions class="w-full">
                                                  <div
                                                    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                  >
                                                    <MultiSelect
                                                      v-model="form.protocols.http3Ports"
                                                      size="large"
                                                      class="w-full"
                                                      placeholder="Select an HTTP/3 port"
                                                      :disabled="saving"
                                                      :display-value="portsLabel"
                                                    >
                                                      <MultiSelect.Trigger
                                                        aria-label="HTTP/3 Ports"
                                                      />
                                                      <MultiSelect.Content>
                                                        <MultiSelect.Option
                                                          v-for="option in http3PortOptions"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </MultiSelect.Option>
                                                      </MultiSelect.Content>
                                                    </MultiSelect>
                                                    <HelperText
                                                      v-if="!form.protocols.http3Ports.length"
                                                      id="http3-ports-message"
                                                      :kind="'required'"
                                                      :label="'Select at least one HTTP/3 port.'"
                                                    />
                                                  </div>
                                                </Item.Actions>
                                              </div>
                                            </Item>
                                            <Item
                                              v-if="secure"
                                              key="tls-version"
                                              size="small"
                                            >
                                              <Item.Content>
                                                <Item.Title>Minimum TLS version</Item.Title>
                                                <Item.Description
                                                  >The oldest TLS version a client may negotiate
                                                  with.</Item.Description
                                                >
                                              </Item.Content>
                                              <div
                                                class="flex max-w-(--container-3xs) flex-1 justify-end"
                                              >
                                                <Item.Actions class="w-full">
                                                  <div
                                                    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                  >
                                                    <Select
                                                      v-model="form.protocols.minimumTlsVersion"
                                                      size="large"
                                                      class="w-full"
                                                      :disabled="saving"
                                                      :display-value="tlsVersionLabel"
                                                    >
                                                      <Select.Trigger
                                                        class="w-full"
                                                        aria-label="Minimum TLS version"
                                                      />
                                                      <Select.Content>
                                                        <Select.Option
                                                          v-for="option in tlsVersionOptions"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </Select.Option>
                                                      </Select.Content>
                                                    </Select>
                                                  </div>
                                                </Item.Actions>
                                              </div>
                                            </Item>
                                            <Item
                                              v-if="secure"
                                              key="cipher-suite"
                                              size="small"
                                            >
                                              <Item.Content>
                                                <Item.Title>Cipher suite</Item.Title>
                                                <Item.Description
                                                  >The set of ciphers offered during the
                                                  handshake.</Item.Description
                                                >
                                              </Item.Content>
                                              <div
                                                class="flex max-w-(--container-3xs) flex-1 justify-end"
                                              >
                                                <Item.Actions class="w-full">
                                                  <div
                                                    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                  >
                                                    <Select
                                                      v-model="form.protocols.cipherSuite"
                                                      size="large"
                                                      class="w-full"
                                                      :disabled="saving"
                                                      :display-value="cipherSuiteLabel"
                                                    >
                                                      <Select.Trigger
                                                        class="w-full"
                                                        aria-label="Cipher suite"
                                                      />
                                                      <Select.Content>
                                                        <Select.Option
                                                          v-for="option in cipherSuiteOptions"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </Select.Option>
                                                      </Select.Content>
                                                    </Select>
                                                  </div>
                                                </Item.Actions>
                                              </div>
                                            </Item>
                                          </Item.List>
                                        </template>
                                      </Card>
                                    </div>
                                  </div>
                                </div>
                              </section>

                              <section
                                data-stacked
                                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                              >
                                <div
                                  data-stacked
                                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                                >
                                  <div
                                    class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                                  >
                                    <button
                                      type="button"
                                      aria-label="Copy link to the Mutual Authentication section"
                                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                                    >
                                      <i
                                        class="pi pi-link text-body-xs"
                                        aria-hidden="true"
                                      />
                                    </button>
                                    <h2
                                      id="mutual-authentication"
                                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                                    >
                                      <span class="flex items-center gap-(--spacing-xs)"
                                        >Mutual Authentication</span
                                      >
                                    </h2>
                                    <Hint
                                      text="Require the client to present a certificate the resource can verify, as well as presenting its own."
                                      class="shrink-0"
                                    />
                                  </div>
                                </div>
                                <div
                                  data-open
                                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                                >
                                  <div class="min-w-0 data-collapsible:overflow-hidden">
                                    <div
                                      data-open
                                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                                    >
                                      <Card :padded="false">
                                        <template #content>
                                          <Item.List>
                                            <Item size="small">
                                              <Item.Content>
                                                <Item.Title>Mutual Authentication</Item.Title>
                                                <Item.Description
                                                  >Require the client to present a certificate the
                                                  resource can verify, as well as presenting its
                                                  own.</Item.Description
                                                >
                                              </Item.Content>
                                              <Item.Actions>
                                                <Switch
                                                  v-model="form.mtls.enabled"
                                                  aria-label="Mutual Authentication"
                                                  :disabled="saving || !form.protocols.useHttps"
                                                />
                                              </Item.Actions>
                                            </Item>
                                            <Item
                                              v-if="armed"
                                              key="mtls-mode"
                                              size="small"
                                            >
                                              <div
                                                class="flex w-full flex-col items-stretch gap-(--spacing-sm)"
                                              >
                                                <Item.Content>
                                                  <Item.Title>Mode</Item.Title>
                                                  <Item.Description
                                                    >What happens when the client certificate cannot
                                                    be validated against the Trusted
                                                    CA.</Item.Description
                                                  >
                                                </Item.Content>
                                                <Item.Actions class="w-full">
                                                  <div
                                                    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                  >
                                                    <div
                                                      role="radiogroup"
                                                      aria-label="Mutual Authentication mode"
                                                      class="flex w-full flex-col gap-(--spacing-sm)"
                                                    >
                                                      <Field.Label
                                                        v-for="option in mtlsModeOptions"
                                                        :key="option.value"
                                                      >
                                                        <Field
                                                          orientation="horizontal"
                                                          :disabled="saving"
                                                        >
                                                          <RadioButton
                                                            v-model="form.mtls.mode"
                                                            :value="option.value"
                                                            name="mtls-mode"
                                                            :input-id="`mtls-mode-${option.value}`"
                                                          />
                                                          <Field.Content>
                                                            <Field.Title>{{
                                                              option.label
                                                            }}</Field.Title>
                                                            <Field.Description
                                                              v-if="option.description"
                                                              >{{
                                                                option.description
                                                              }}</Field.Description
                                                            >
                                                          </Field.Content>
                                                        </Field>
                                                      </Field.Label>
                                                    </div>
                                                  </div>
                                                </Item.Actions>
                                              </div>
                                            </Item>
                                            <Item
                                              v-if="armed"
                                              key="mtls-certificate"
                                              size="small"
                                            >
                                              <Item.Content>
                                                <Item.Title>Trusted CA Certificate</Item.Title>
                                                <Item.Description
                                                  >The authority a client certificate is verified
                                                  against.</Item.Description
                                                >
                                              </Item.Content>
                                              <div
                                                class="flex max-w-(--container-3xs) flex-1 justify-end"
                                              >
                                                <Item.Actions class="w-full">
                                                  <div
                                                    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                  >
                                                    <Select
                                                      v-model="form.mtls.certificate"
                                                      size="large"
                                                      class="w-full"
                                                      placeholder="Select a Trusted CA certificate"
                                                      :disabled="saving"
                                                      :display-value="certificateName"
                                                    >
                                                      <Select.Trigger
                                                        class="w-full"
                                                        aria-label="Trusted CA Certificate"
                                                      />
                                                      <Select.Content>
                                                        <Select.Option
                                                          v-for="option in trustedCaOptions"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </Select.Option>
                                                      </Select.Content>
                                                    </Select>
                                                    <HelperText
                                                      v-if="!form.mtls.certificate"
                                                      id="mtls-certificate-message"
                                                      :kind="'required'"
                                                      :label="'Mutual Authentication requires a Trusted CA certificate.'"
                                                    />
                                                  </div>
                                                </Item.Actions>
                                              </div>
                                            </Item>
                                            <Item
                                              v-if="armed"
                                              key="mtls-crl"
                                              size="small"
                                            >
                                              <Item.Content>
                                                <Item.Title>Certificate Revocation List</Item.Title>
                                                <Item.Description
                                                  >Revoked certificates are rejected during the
                                                  handshake.</Item.Description
                                                >
                                              </Item.Content>
                                              <div
                                                class="flex max-w-(--container-3xs) flex-1 justify-end"
                                              >
                                                <Item.Actions class="w-full">
                                                  <div
                                                    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
                                                  >
                                                    <MultiSelect
                                                      v-model="form.mtls.crl"
                                                      size="large"
                                                      class="w-full"
                                                      placeholder="Select a revocation list"
                                                      :disabled="saving"
                                                      :display-value="crlLabel"
                                                    >
                                                      <MultiSelect.Trigger
                                                        aria-label="Certificate Revocation List"
                                                      />
                                                      <MultiSelect.Content>
                                                        <MultiSelect.Option
                                                          v-for="option in revocationListOptions"
                                                          :key="option.value"
                                                          :value="option.value"
                                                        >
                                                          {{ option.label }}
                                                        </MultiSelect.Option>
                                                      </MultiSelect.Content>
                                                    </MultiSelect>
                                                  </div>
                                                </Item.Actions>
                                              </div>
                                            </Item>
                                          </Item.List>
                                        </template>
                                      </Card>
                                    </div>
                                  </div>
                                </div>
                              </section>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section
                      data-stacked
                      class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
                    >
                      <div
                        data-stacked
                        class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                      >
                        <div
                          class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)"
                        >
                          <button
                            type="button"
                            aria-label="Copy link to the Danger Zone section"
                            class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                          >
                            <i
                              class="pi pi-link text-body-xs"
                              aria-hidden="true"
                            />
                          </button>
                          <h2
                            id="danger-zone"
                            class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                          >
                            <span class="flex items-center gap-(--spacing-xs)">Danger Zone</span>
                          </h2>
                          <Hint
                            text="Actions that cannot be undone."
                            class="shrink-0"
                          />
                        </div>
                      </div>
                      <div
                        data-open
                        class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                      >
                        <div class="min-w-0 data-collapsible:overflow-hidden">
                          <div
                            data-open
                            class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                          >
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <Item size="small">
                                    <Item.Content>
                                      <Item.Title>Delete this resource</Item.Title>
                                      <Item.Description
                                        >Once deleted, the resource and its deployments cannot be
                                        recovered.</Item.Description
                                      >
                                    </Item.Content>
                                    <Item.Actions>
                                      <Button
                                        type="button"
                                        label="Delete Resource"
                                        kind="danger"
                                        size="medium"
                                        icon="pi pi-trash"
                                      />
                                    </Item.Actions>
                                  </Item>
                                </Item.List>
                              </template>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </section>
                  </fieldset>
                </form>
              </div>
            </div>
          </section>
        </main>

        <Transition
          enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="translate-y-2 opacity-0"
          leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="translate-y-2 opacity-0"
        >
          <footer
            v-if="dirty || saving"
            class="sticky bottom-0 z-10 h-0 shrink-0"
          >
            <div
              class="absolute inset-x-0 bottom-0 border-t border-(--border-default) bg-(--bg-canvas) lg:h-14"
            >
              <div
                class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0"
              >
                <div class="flex min-w-0 items-start gap-(--spacing-xs)">
                  <i
                    class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <p class="min-w-0 text-body-sm text-(--text-default)">
                    You have unsaved changes.
                  </p>
                </div>
                <div
                  class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)"
                >
                  <Button
                    type="button"
                    label="Discard"
                    kind="outlined"
                    size="medium"
                    :disabled="saving"
                    @click="discard"
                  />
                  <Button
                    label="Save"
                    kind="primary"
                    size="medium"
                    :loading="saving"
                    @click="save"
                  />
                </div>
              </div>
            </div>
          </footer>
        </Transition>
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
                      label="Account Settings"
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
                      label="Personal Tokens"
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
                      <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
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
                      label="Home Page"
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
  </div>
</template>
