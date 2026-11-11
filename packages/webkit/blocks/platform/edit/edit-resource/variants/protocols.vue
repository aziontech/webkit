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
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import RadioButton from '@aziontech/webkit/radio-button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Switch from '@aziontech/webkit/switch'
  import Textarea from '@aziontech/webkit/textarea'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'

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
        { id: 'workloads', label: 'Workloads', icon: 'pi pi-sitemap', path: '/workloads' },
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
      key: 'workloads/storefront',
      name: 'storefront',
      icon: 'pi pi-box',
      typeLabel: 'Workload',
      navId: 'workloads'
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

  const activeId = ref('workloads')
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
    { id: 'create', label: 'Create Workload', icon: 'pi pi-plus-circle' },
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
  const crumbs = [
    { label: 'Workloads', href: '/workloads' },
    { label: 'storefront', href: '/workloads/storefront' },
    { label: 'Settings' }
  ]

  const port = (value, label = String(value)) => ({ value, label })
  const httpPorts = [port(80, '80 (default)'), port(8008), port(8080), port(8880)]
  const httpsPorts = [port(443, '443 (default)'), port(8443), port(9440), port(9443)]
  const http3Ports = [port(443, '443 (default)'), port(8443), port(9443)]
  const tlsVersions = [
    { value: 'tls_1_3', label: 'TLS 1.3 (default)' },
    { value: 'tls_1_2', label: 'TLS 1.2' },
    { value: 'tls_1_1', label: 'TLS 1.1 (deprecated)' }
  ]
  const cipherSuites = [
    { value: 'modern-2025', label: 'Modern 2025' },
    { value: 'compatible-2025', label: 'Compatible 2025' },
    { value: 'legacy-2025', label: 'Legacy 2025' }
  ]
  const mtlsModes = [
    {
      value: 'enforce',
      label: 'Enforce',
      description:
        'Stops the TLS handshake when the client certificate cannot be verified against the trusted CA.'
    },
    {
      value: 'permissive',
      label: 'Permissive',
      description:
        'Tries to verify the client certificate but lets the handshake finish either way. The firewall sees which certificate was presented.'
    }
  ]
  const trustedCas = ref([
    { value: 'partners-ca', label: 'partners-ca', expires: 'Expires Mar 2027' },
    { value: 'devices-ca', label: 'devices-ca', expires: 'Expires Aug 2026' }
  ])
  const revocationLists = [
    { value: 'partners-crl', label: 'partners-crl' },
    { value: 'devices-crl', label: 'devices-crl' }
  ]

  const labelOf = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? String(value ?? '')
  const caLabel = (value) => labelOf(trustedCas.value)(value)
  const portsLabel = (values) => (values ?? []).join(', ')
  const listLabel = (values) => (values ?? []).join(', ')

  const form = reactive({
    httpPorts: [80],
    useHttps: true,
    httpsPorts: [443],
    useHttp3: false,
    http3Ports: [443],
    minimumTls: 'tls_1_3',
    cipherSuite: 'modern-2025',
    mtls: false,
    mtlsMode: 'enforce',
    trustedCa: '',
    crl: []
  })
  const baseline = ref(JSON.stringify(form))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)
  const saving = ref(false)
  const errors = reactive({})
  const armed = computed(() => form.useHttps && form.mtls)

  const clear = (key) => {
    delete errors[key]
  }

  const setHttps = (value) => {
    form.useHttps = value
    if (!value) {
      form.useHttp3 = false
      form.mtls = false
    }
  }
  const setHttp3 = (value) => {
    form.useHttp3 = value
    if (value) form.useHttps = true
  }

  const caQuery = ref('')
  const caMatches = computed(() => {
    const needle = caQuery.value.trim().toLowerCase()
    return needle
      ? trustedCas.value.filter((option) => option.label.includes(needle))
      : trustedCas.value
  })
  const pickCa = (value) => {
    if (value === '__upload__') {
      uploadOpen.value = true
      return
    }
    form.trustedCa = value
    clear('trustedCa')
  }

  const uploadOpen = ref(false)
  const upload = reactive({ name: '', pem: '' })
  const uploadErrors = reactive({})
  const submitUpload = () => {
    Object.keys(uploadErrors).forEach((key) => delete uploadErrors[key])
    if (!/^[a-z0-9-]+$/.test(upload.name.trim())) {
      uploadErrors.name = upload.name.trim()
        ? { kind: 'invalid', message: 'Use lowercase letters, numbers and hyphens only.' }
        : { kind: 'required', message: 'Enter a name for the certificate.' }
    }
    if (!upload.pem.includes('BEGIN CERTIFICATE')) {
      uploadErrors.pem = upload.pem.trim()
        ? { kind: 'invalid', message: 'Paste a PEM certificate, starting with BEGIN CERTIFICATE.' }
        : { kind: 'required', message: 'Paste the CA certificate.' }
    }
    if (Object.keys(uploadErrors).length) return
    const value = upload.name.trim()
    trustedCas.value = [...trustedCas.value, { value, label: value, expires: 'Added now' }]
    form.trustedCa = value
    clear('trustedCa')
    upload.name = ''
    upload.pem = ''
    uploadOpen.value = false
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (!form.httpPorts.length) {
      errors.httpPorts = { kind: 'required', message: 'Select at least one HTTP port.' }
    }
    if (form.useHttps && !form.httpsPorts.length) {
      errors.httpsPorts = { kind: 'required', message: 'Select at least one HTTPS port.' }
    }
    if (form.useHttp3 && !form.http3Ports.length) {
      errors.http3Ports = { kind: 'required', message: 'Select at least one HTTP/3 port.' }
    }
    if (armed.value && !form.trustedCa) {
      errors.trustedCa = {
        kind: 'required',
        message: 'Mutual authentication needs a trusted CA certificate.'
      }
    }
    return Object.keys(errors).length === 0
  }

  const ERROR_ORDER = ['httpPorts', 'httpsPorts', 'http3Ports', 'trustedCa']
  const focusFirstError = () =>
    nextTick(() => {
      const first = ERROR_ORDER.find((key) => errors[key])
      if (first) document.getElementById(`protocols-${first}`)?.focus()
    })

  const RUN_TOAST = 'protocols-deploy'
  let timer

  const editAgain = () => {
    toast.dismiss(RUN_TOAST)
    nextTick(() => document.getElementById('protocols-httpPorts')?.focus())
  }

  const deploy = () => {
    toast.loading('Deploying storefront…', {
      id: RUN_TOAST,
      description: 'Clients keep connecting with the current settings until it finishes.'
    })
    clearTimeout(timer)
    timer = setTimeout(() => {
      saving.value = false
      baseline.value = JSON.stringify(form)
      toast.success('storefront is live.', {
        id: RUN_TOAST,
        description: armed.value
          ? 'Production now asks every client for a certificate.'
          : 'Production answers on the new ports and TLS settings.',
        duration: 0,
        closable: true,
        actions: [
          { label: 'Edit', onClick: editAgain },
          { label: 'Redeploy', onClick: deploy }
        ]
      })
    }, 1200)
  }

  const save = () => {
    if (!validate()) {
      focusFirstError()
      return
    }
    saving.value = true
    deploy()
  }

  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value))
    Object.keys(errors).forEach((key) => delete errors[key])
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
              <span class="contents @2xl:hidden">
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
                class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-start text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @2xl:flex"
                @click="paletteOpen = true"
              >
                <span
                  class="inline-flex shrink-0 items-center justify-center text-(--text-muted)"
                  aria-hidden="true"
                >
                  <i class="pi pi-search" />
                </span>
                <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-muted)"
                  >Search</span
                >
                <Kbd
                  meta
                  size="small"
                  class="shrink-0"
                  >K</Kbd
                >
              </button>

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

      <form
        class="flex min-h-full min-w-0 flex-col animate-page-enter motion-reduce:animate-none"
        aria-label="Protocol settings"
        novalidate
        @submit.prevent="save"
      >
        <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
          <PageHeader
            title="Protocols"
            description="How clients connect to storefront: ports, TLS, and whether they must present a certificate."
            size="small"
          />

          <fieldset
            class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="saving"
          >
            <legend class="sr-only">Protocol settings</legend>

            <SettingsSection
              title="Protocols"
              hint="The ports and TLS settings clients connect to this workload with."
              anchor="protocols"
            >
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <TransitionGroup
                      enter-active-class="animate-content-enter motion-reduce:animate-none"
                    >
                      <SettingRow
                        key="httpPorts"
                        title="HTTP ports"
                        description="The ports this workload answers plain HTTP on."
                      >
                        <MultiSelect
                          v-model="form.httpPorts"
                          size="large"
                          class="w-full"
                          placeholder="Select an HTTP port"
                          :display-value="portsLabel"
                          :disabled="saving"
                          :required="errors.httpPorts?.kind === 'required'"
                          :invalid="errors.httpPorts?.kind === 'invalid'"
                          :aria-describedby="
                            errors.httpPorts ? 'protocols-httpPorts-message' : undefined
                          "
                          @update:model-value="clear('httpPorts')"
                        >
                          <MultiSelect.Trigger
                            id="protocols-httpPorts"
                            aria-label="HTTP ports"
                          />
                          <MultiSelect.Content>
                            <MultiSelect.Option
                              v-for="option in httpPorts"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </MultiSelect.Option>
                          </MultiSelect.Content>
                        </MultiSelect>
                        <HelperText
                          v-if="errors.httpPorts"
                          id="protocols-httpPorts-message"
                          :kind="errors.httpPorts.kind"
                          :label="errors.httpPorts.message"
                        />
                      </SettingRow>
                      <SettingRow
                        key="useHttps"
                        title="HTTPS support"
                        description="Answer on HTTPS as well as HTTP. HTTP/3 and mutual authentication need it."
                        kind="compact"
                      >
                        <Switch
                          :model-value="form.useHttps"
                          aria-label="HTTPS support"
                          :disabled="saving"
                          @update:model-value="setHttps"
                        />
                      </SettingRow>
                      <SettingRow
                        v-if="form.useHttps"
                        key="httpsPorts"
                        title="HTTPS ports"
                        description="The ports this workload answers TLS traffic on."
                        :level="1"
                      >
                        <MultiSelect
                          v-model="form.httpsPorts"
                          size="large"
                          class="w-full"
                          placeholder="Select an HTTPS port"
                          :display-value="portsLabel"
                          :disabled="saving"
                          :required="errors.httpsPorts?.kind === 'required'"
                          :invalid="errors.httpsPorts?.kind === 'invalid'"
                          :aria-describedby="
                            errors.httpsPorts ? 'protocols-httpsPorts-message' : undefined
                          "
                          @update:model-value="clear('httpsPorts')"
                        >
                          <MultiSelect.Trigger
                            id="protocols-httpsPorts"
                            aria-label="HTTPS ports"
                          />
                          <MultiSelect.Content>
                            <MultiSelect.Option
                              v-for="option in httpsPorts"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </MultiSelect.Option>
                          </MultiSelect.Content>
                        </MultiSelect>
                        <HelperText
                          v-if="errors.httpsPorts"
                          id="protocols-httpsPorts-message"
                          :kind="errors.httpsPorts.kind"
                          :label="errors.httpsPorts.message"
                        />
                      </SettingRow>
                      <SettingRow
                        key="useHttp3"
                        title="HTTP/3 support"
                        description="Serve over HTTP/3 where the client supports it. Turns HTTPS support on with it."
                        kind="compact"
                      >
                        <Switch
                          :model-value="form.useHttp3"
                          aria-label="HTTP/3 support"
                          :disabled="saving"
                          @update:model-value="setHttp3"
                        />
                      </SettingRow>
                      <SettingRow
                        v-if="form.useHttp3"
                        key="http3Ports"
                        title="HTTP/3 ports"
                        description="The ports QUIC is answered on."
                        :level="1"
                      >
                        <MultiSelect
                          v-model="form.http3Ports"
                          size="large"
                          class="w-full"
                          placeholder="Select an HTTP/3 port"
                          :display-value="portsLabel"
                          :disabled="saving"
                          :required="errors.http3Ports?.kind === 'required'"
                          :invalid="errors.http3Ports?.kind === 'invalid'"
                          :aria-describedby="
                            errors.http3Ports ? 'protocols-http3Ports-message' : undefined
                          "
                          @update:model-value="clear('http3Ports')"
                        >
                          <MultiSelect.Trigger
                            id="protocols-http3Ports"
                            aria-label="HTTP/3 ports"
                          />
                          <MultiSelect.Content>
                            <MultiSelect.Option
                              v-for="option in http3Ports"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </MultiSelect.Option>
                          </MultiSelect.Content>
                        </MultiSelect>
                        <HelperText
                          v-if="errors.http3Ports"
                          id="protocols-http3Ports-message"
                          :kind="errors.http3Ports.kind"
                          :label="errors.http3Ports.message"
                        />
                      </SettingRow>
                      <SettingRow
                        v-if="form.useHttps"
                        key="minimumTls"
                        title="Minimum TLS version"
                        description="The oldest TLS version a client may negotiate."
                      >
                        <Select
                          v-model="form.minimumTls"
                          size="large"
                          class="w-full"
                          :display-value="labelOf(tlsVersions)"
                          :disabled="saving"
                        >
                          <Select.Trigger aria-label="Minimum TLS version" />
                          <Select.Content>
                            <Select.Option
                              v-for="option in tlsVersions"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                      <SettingRow
                        v-if="form.useHttps"
                        key="cipherSuite"
                        title="Cipher suite"
                        description="The ciphers offered during the handshake."
                      >
                        <Select
                          v-model="form.cipherSuite"
                          size="large"
                          class="w-full"
                          :display-value="labelOf(cipherSuites)"
                          :disabled="saving"
                        >
                          <Select.Trigger aria-label="Cipher suite" />
                          <Select.Content>
                            <Select.Option
                              v-for="option in cipherSuites"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </Select.Option>
                          </Select.Content>
                        </Select>
                      </SettingRow>
                    </TransitionGroup>
                  </Item.List>
                </template>
              </Card>
            </SettingsSection>
            <SettingsSection
              title="Mutual authentication"
              hint="Ask each client for a certificate the workload can verify, as well as presenting its own."
              anchor="mutual-authentication"
            >
              <Card :padded="false">
                <template #content>
                  <Item.List>
                    <TransitionGroup
                      enter-active-class="animate-content-enter motion-reduce:animate-none"
                    >
                      <SettingRow
                        key="mtls"
                        title="Mutual authentication"
                        description="Clients without a valid certificate are refused or flagged, depending on the mode."
                        kind="compact"
                      >
                        <Switch
                          v-model="form.mtls"
                          aria-label="Mutual authentication"
                          :disabled="saving || !form.useHttps"
                        />
                        <HelperText
                          v-if="!form.useHttps"
                          label="Turn on HTTPS support to use mutual authentication."
                        />
                      </SettingRow>
                      <SettingRow
                        v-if="armed"
                        key="mtlsMode"
                        title="Mode"
                        description="What happens when a client certificate cannot be verified."
                        kind="stacked"
                        :level="1"
                      >
                        <fieldset class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0">
                          <legend class="sr-only">Mutual authentication mode</legend>
                          <Field.Label
                            v-for="option in mtlsModes"
                            :key="option.value"
                          >
                            <Field
                              orientation="horizontal"
                              :disabled="saving"
                            >
                              <RadioButton
                                v-model="form.mtlsMode"
                                :value="option.value"
                                name="protocols-mtls-mode"
                              />
                              <Field.Content>
                                <Field.Title>{{ option.label }}</Field.Title>
                                <Field.Description>{{ option.description }}</Field.Description>
                              </Field.Content>
                            </Field>
                          </Field.Label>
                        </fieldset>
                      </SettingRow>
                      <SettingRow
                        v-if="armed"
                        key="trustedCa"
                        title="Trusted CA certificate"
                        description="The authority client certificates are verified against."
                        :level="1"
                      >
                        <Select
                          :model-value="form.trustedCa"
                          size="large"
                          class="w-full"
                          placeholder="Select a trusted CA certificate"
                          :display-value="caLabel"
                          :disabled="saving"
                          :required="errors.trustedCa?.kind === 'required'"
                          @update:model-value="pickCa"
                          @update:open="(open) => !open && (caQuery = '')"
                        >
                          <Select.Trigger
                            id="protocols-trustedCa"
                            aria-label="Trusted CA certificate"
                            :aria-describedby="
                              errors.trustedCa ? 'protocols-trustedCa-message' : undefined
                            "
                          />
                          <Select.Content>
                            <template #search>
                              <Input
                                v-model="caQuery"
                                size="small"
                                placeholder="Search certificates"
                                aria-label="Search certificates"
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
                            <Select.Group label="Trusted CA certificates">
                              <Select.Option
                                v-for="option in caMatches"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                                <template #tag>
                                  <span class="text-body-xs text-(--text-muted)">{{
                                    option.expires
                                  }}</span>
                                </template>
                              </Select.Option>
                              <p
                                v-if="!caMatches.length"
                                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                              >
                                No certificate matches "{{ caQuery }}".
                              </p>
                            </Select.Group>
                            <template #footer>
                              <Select.Option
                                value="__upload__"
                                class="w-full"
                              >
                                <span class="flex items-center gap-(--spacing-xs)">
                                  <i
                                    class="pi pi-upload"
                                    aria-hidden="true"
                                  />
                                  Upload certificate
                                </span>
                              </Select.Option>
                            </template>
                          </Select.Content>
                        </Select>
                        <HelperText
                          v-if="errors.trustedCa"
                          id="protocols-trustedCa-message"
                          :kind="errors.trustedCa.kind"
                          :label="errors.trustedCa.message"
                        />
                      </SettingRow>
                      <SettingRow
                        v-if="armed"
                        key="crl"
                        title="Certificate revocation lists"
                        description="Certificates on these lists are refused during the handshake."
                        :level="1"
                      >
                        <MultiSelect
                          v-model="form.crl"
                          size="large"
                          class="w-full"
                          placeholder="No revocation list"
                          :display-value="listLabel"
                          :disabled="saving"
                        >
                          <MultiSelect.Trigger
                            id="protocols-crl"
                            aria-label="Certificate revocation lists"
                          />
                          <MultiSelect.Content>
                            <MultiSelect.Option
                              v-for="option in revocationLists"
                              :key="option.value"
                              :value="option.value"
                            >
                              {{ option.label }}
                            </MultiSelect.Option>
                          </MultiSelect.Content>
                        </MultiSelect>
                      </SettingRow>
                    </TransitionGroup>
                  </Item.List>
                </template>
              </Card>
            </SettingsSection>
          </fieldset>
        </div>

        <Transition
          enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="translate-y-2 opacity-0"
          leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="translate-y-2 opacity-0"
        >
          <SaveBar v-if="dirty || saving">
            Protocol settings changed.
            <span class="text-(--text-muted)">Saving deploys storefront to Production.</span>

            <template #actions>
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
            </template>
          </SaveBar>
        </Transition>
      </form>
    </AppLayout>

    <Drawer
      v-model:open="uploadOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex h-full min-h-0 flex-col"
            novalidate
            @submit.prevent="submitUpload"
          >
            <PanelHeader class="w-full">
              <DrawerTitle>Upload certificate</DrawerTitle>
              <DrawerClose />
            </PanelHeader>
            <PanelContent>
              <div class="flex flex-col gap-(--spacing-md)">
                <DrawerDescription>
                  A trusted CA certificate in PEM format. It is added to the account and picked for
                  this workload.
                </DrawerDescription>
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <label
                    for="protocols-upload-name"
                    class="text-label-md text-(--text-default)"
                    >Name</label
                  >
                  <Input
                    id="protocols-upload-name"
                    v-model="upload.name"
                    size="large"
                    class="w-full"
                    placeholder="partners-ca"
                    autocomplete="off"
                    :required="uploadErrors.name?.kind === 'required'"
                    :invalid="uploadErrors.name?.kind === 'invalid'"
                    :aria-describedby="
                      uploadErrors.name ? 'protocols-upload-name-message' : undefined
                    "
                  />
                  <HelperText
                    v-if="uploadErrors.name"
                    id="protocols-upload-name-message"
                    :kind="uploadErrors.name.kind"
                    :label="uploadErrors.name.message"
                  />
                </div>
                <div class="flex flex-col gap-(--spacing-xxs)">
                  <label
                    for="protocols-upload-pem"
                    class="text-label-md text-(--text-default)"
                    >Certificate</label
                  >
                  <Textarea
                    id="protocols-upload-pem"
                    v-model="upload.pem"
                    class="w-full"
                    :rows="8"
                    placeholder="-----BEGIN CERTIFICATE-----"
                    :required="uploadErrors.pem?.kind === 'required'"
                    :invalid="uploadErrors.pem?.kind === 'invalid'"
                    :aria-describedby="
                      uploadErrors.pem ? 'protocols-upload-pem-message' : undefined
                    "
                  />
                  <HelperText
                    v-if="uploadErrors.pem"
                    id="protocols-upload-pem-message"
                    :kind="uploadErrors.pem.kind"
                    :label="uploadErrors.pem.message"
                  />
                </div>
              </div>
            </PanelContent>
            <PanelFooter>
              <div class="flex w-full justify-end gap-(--spacing-xs)">
                <Button
                  type="button"
                  label="Cancel"
                  kind="outlined"
                  @click="uploadOpen = false"
                />
                <Button
                  type="submit"
                  label="Upload"
                  kind="primary"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Toaster position="bottom-right" />
  </div>
</template>
