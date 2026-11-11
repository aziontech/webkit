<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import CodeEditor from '@aziontech/webkit/code-editor'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PasswordInput from '@aziontech/webkit/password-input'
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
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

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
        { id: 'data-stream', label: 'Data stream', icon: 'pi pi-share-alt', path: '/data-stream' },
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

  const breadcrumb = [
    { label: 'Data stream', href: '/data-stream' },
    { label: 'http-to-collector' }
  ]

  const activeId = ref('data-stream')
  const navOpen = ref(false)
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

  const sourceOptions = [
    { value: 'applications', label: 'Applications' },
    { value: 'functions', label: 'Functions' },
    { value: 'firewall', label: 'Firewall' },
    { value: 'activity', label: 'Activity history' }
  ]

  const scopeOptions = [
    {
      value: 'all',
      label: 'All current and future workloads',
      description:
        'Collect from every workload, including the ones created later. Unlocks sampling.'
    },
    {
      value: 'filtered',
      label: 'Selected workloads',
      description: 'Collect only from the workloads you list.'
    }
  ]

  const presetTemplates = {
    'http-requests': {
      label: 'HTTP requests',
      dataSet: {
        time: '$time',
        host: '$host',
        request_method: '$request_method',
        request_uri: '$request_uri',
        status: '$status',
        bytes_sent: '$bytes_sent',
        request_time: '$request_time',
        upstream_cache_status: '$upstream_cache_status',
        remote_addr: '$remote_addr',
        geoip_country: '$geoip_country'
      }
    },
    'function-runs': {
      label: 'Function runs',
      dataSet: {
        time: '$time',
        function_id: '$function_id',
        function_name: '$function_name',
        duration_ms: '$duration_ms',
        status: '$status',
        log_level: '$log_level',
        message: '$message'
      }
    },
    'firewall-events': {
      label: 'Firewall events',
      dataSet: {
        time: '$time',
        host: '$host',
        rule_id: '$rule_id',
        rule_action: '$rule_action',
        threat_family: '$threat_family',
        remote_addr: '$remote_addr',
        request_uri: '$request_uri'
      }
    }
  }

  const templateOptions = [
    ...Object.entries(presetTemplates).map(([value, template]) => ({
      value,
      label: template.label
    })),
    { value: 'custom', label: 'Custom template' }
  ]

  const connectorOptions = [
    { value: 'standard', label: 'Standard HTTP/HTTPS POST' },
    { value: 'kafka', label: 'Apache Kafka' },
    { value: 's3', label: 'S3-compatible storage' },
    { value: 'analytics', label: 'Log analytics service' }
  ]

  const labelOf = (options) => (value) =>
    options.find((option) => option.value === value)?.label ?? ''

  const sourceLabel = labelOf(sourceOptions)
  const templateLabel = labelOf(templateOptions)
  const connectorLabel = labelOf(connectorOptions)

  const record = {
    name: 'http-to-collector',
    active: true,
    source: 'applications',
    scope: 'all',
    workloads: '',
    sampling: true,
    samplingRate: 25,
    template: 'custom',
    templateName: 'http-compact',
    dataSet: JSON.stringify(
      {
        time: '$time',
        host: '$host',
        status: '$status',
        request_uri: '$request_uri',
        request_time: '$request_time',
        upstream_cache_status: '$upstream_cache_status'
      },
      null,
      2
    ),
    connector: 'standard',
    url: 'https://collector.example.com/ingest',
    payloadFormat: '$dataset',
    lineSeparator: '\\n',
    headers: 'Authorization:Bearer example-token',
    bootstrapServers: '',
    topic: '',
    bucket: '',
    region: '',
    accessKey: '',
    secretKey: '',
    analyticsUrl: '',
    apiKey: ''
  }

  const form = reactive(structuredClone(record))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)

  const errors = reactive({})
  const destinationError = ref('')

  const URL_PATTERN = /^https?:\/\/[^\s/$.?#][^\s]*$/
  const HEADERS_PATTERN = /^[^:\n]+:[^\n]*\S[^\n]*(\n[^:\n]+:[^\n]*\S[^\n]*){0,4}$/
  const SERVERS_PATTERN = /^[^\s,]+(,[^\s,]+)*$/
  const WORKLOADS_PATTERN = /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/

  const presetDocument = computed(() => {
    const template = presetTemplates[form.template]
    return template ? JSON.stringify(template.dataSet, null, 2) : ''
  })

  const presetTabs = computed(() => [
    {
      label: 'Data set',
      value: 'data-set',
      language: 'json',
      code: presetDocument.value
    }
  ])

  const clear = (id) => {
    if (errors[id]) delete errors[id]
  }

  const onDestinationChange = (id) => {
    clear(id)
    destinationError.value = ''
  }

  const required = (id) => {
    if (!String(form[id] ?? '').trim()) {
      errors[id] = { kind: 'required', message: 'This field is required.' }
      return false
    }
    return true
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    if (required('name') && form.name.trim().length > 250)
      errors.name = { kind: 'invalid', message: 'Use at most 250 characters.' }
    if (
      form.scope === 'filtered' &&
      required('workloads') &&
      !WORKLOADS_PATTERN.test(form.workloads.trim())
    )
      errors.workloads = {
        kind: 'invalid',
        message: 'Remove the empty lines. Every line holds one workload.'
      }
    if (form.scope === 'all' && form.sampling) {
      const rate = Number(form.samplingRate)
      if (!Number.isFinite(rate) || rate < 1 || rate > 100)
        errors.samplingRate = { kind: 'invalid', message: 'Enter a rate from 1 to 100.' }
    }
    if (form.template === 'custom') {
      required('templateName')
      if (required('dataSet')) {
        let parsed = null
        try {
          parsed = JSON.parse(form.dataSet)
        } catch {
          parsed = null
        }
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
          errors.dataSet = { kind: 'invalid', message: 'Write the data set as a JSON object.' }
        else if (!Object.keys(parsed).length)
          errors.dataSet = {
            kind: 'invalid',
            message: 'Add at least one variable to the data set.'
          }
      }
    }
    if (form.connector === 'standard') {
      if (required('url') && !URL_PATTERN.test(form.url.trim()))
        errors.url = {
          kind: 'invalid',
          message: 'Enter a valid URL. Example: https://collector.example.com/ingest.'
        }
      required('payloadFormat')
      required('lineSeparator')
      if (form.headers.trim() && !HEADERS_PATTERN.test(form.headers.trim()))
        errors.headers = {
          kind: 'invalid',
          message: 'Write up to 5 headers, one per line, in the Key:Value format.'
        }
    }
    if (form.connector === 'kafka') {
      if (required('bootstrapServers') && !SERVERS_PATTERN.test(form.bootstrapServers.trim()))
        errors.bootstrapServers = {
          kind: 'invalid',
          message: 'Separate the servers with a comma and no space.'
        }
      required('topic')
    }
    if (form.connector === 's3') {
      required('bucket')
      required('region')
      required('accessKey')
      required('secretKey')
    }
    if (form.connector === 'analytics') {
      if (required('analyticsUrl') && !URL_PATTERN.test(form.analyticsUrl.trim()))
        errors.analyticsUrl = {
          kind: 'invalid',
          message: 'Enter a valid URL. Example: https://logs.example.com/api/v2/logs.'
        }
      required('apiKey')
    }
    return Object.keys(errors).length === 0
  }

  const focusFirstError = () =>
    nextTick(() => {
      const id = Object.keys(errors)[0]
      if (id) document.getElementById(`data-stream-${id}`)?.focus()
    })

  const unreachable = (value) => {
    try {
      return new URL(value).hostname.endsWith('.invalid')
    } catch {
      return false
    }
  }

  const save = () => {
    destinationError.value = ''
    if (!validate()) {
      focusFirstError()
      return
    }
    saving.value = true
    setTimeout(() => {
      saving.value = false
      const target = form.connector === 'analytics' ? 'analyticsUrl' : 'url'
      if (['standard', 'analytics'].includes(form.connector) && unreachable(form[target])) {
        destinationError.value =
          'The endpoint did not answer the test record, so the stream was not saved. Your other changes are still here.'
        errors[target] = {
          kind: 'invalid',
          message: 'The endpoint did not answer within 10 seconds.'
        }
        nextTick(() => document.getElementById('destination')?.scrollIntoView({ block: 'start' }))
        focusFirstError()
        return
      }
      baseline.value = JSON.stringify(form)
    }, 900)
  }

  const discard = () => {
    Object.assign(form, JSON.parse(baseline.value))
    Object.keys(errors).forEach((key) => delete errors[key])
    destinationError.value = ''
  }
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
                <Breadcrumb
                  :items="breadcrumb"
                  class="w-full"
                />
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
              class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-start text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
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
        <form
          class="flex min-h-full min-w-0 flex-col"
          aria-label="Data stream settings"
          novalidate
          @submit.prevent="save"
        >
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
            <PageHeader
              title="Settings"
              description="Ship the records of your workloads to your own observability or storage platform. One stream, one destination."
              size="small"
            />

            <fieldset
              class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">Data stream settings</legend>

              <SettingsSection
                title="General"
                hint="How the stream is identified, and whether it is collecting records."
                anchor="general"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="name"
                          title="Name"
                          description="Give a unique and descriptive name to identify the data stream."
                        >
                          <Input
                            id="data-stream-name"
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                            placeholder="my-data-stream"
                            autocomplete="off"
                            :required="errors.name?.kind === 'required'"
                            :invalid="errors.name?.kind === 'invalid'"
                            :aria-describedby="errors.name ? 'data-stream-name-message' : undefined"
                            :disabled="saving"
                            @update:model-value="clear('name')"
                          />
                          <HelperText
                            v-if="errors.name"
                            id="data-stream-name-message"
                            :kind="errors.name.kind"
                            :label="errors.name.message"
                          />
                        </SettingRow>
                        <SettingRow
                          key="active"
                          title="Active"
                          description="When off, the stream stops collecting records and nothing is sent to the destination."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                            :disabled="saving"
                          />
                        </SettingRow>
                      </TransitionGroup>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Source"
                hint="Which records the stream collects, and from which workloads."
                anchor="source"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="source"
                          title="Data source"
                          description="The product the records are collected from."
                        >
                          <Select
                            v-model="form.source"
                            size="large"
                            class="w-full"
                            :display-value="sourceLabel"
                            :disabled="saving"
                            @update:model-value="clear('source')"
                          >
                            <Select.Trigger aria-label="Data source" />
                            <Select.Content>
                              <Select.Option
                                v-for="option in sourceOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </SettingRow>
                        <SettingRow
                          key="scope"
                          title="Workloads"
                          kind="stacked"
                        >
                          <fieldset
                            class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0"
                          >
                            <legend class="sr-only">Workloads</legend>
                            <Field.Label
                              v-for="option in scopeOptions"
                              :key="option.value"
                            >
                              <Field
                                orientation="horizontal"
                                :disabled="saving"
                              >
                                <RadioButton
                                  v-model="form.scope"
                                  :value="option.value"
                                  name="data-stream-scope"
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
                          v-if="form.scope === 'filtered'"
                          key="workloads"
                          title="Selected workloads"
                          description="One workload per line. Only their records are sent to the destination."
                          kind="stacked"
                        >
                          <Textarea
                            id="data-stream-workloads"
                            v-model="form.workloads"
                            class="w-full"
                            :rows="4"
                            aria-label="Selected workloads"
                            placeholder="storefront&#10;checkout-api"
                            :required="errors.workloads?.kind === 'required'"
                            :invalid="errors.workloads?.kind === 'invalid'"
                            :aria-describedby="
                              errors.workloads ? 'data-stream-workloads-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="clear('workloads')"
                          />
                          <HelperText
                            v-if="errors.workloads"
                            id="data-stream-workloads-message"
                            :kind="errors.workloads.kind"
                            :label="errors.workloads.message"
                          />
                        </SettingRow>
                      </TransitionGroup>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                v-if="form.scope === 'all'"
                title="Sampling"
                hint="Collect a share of the records instead of all of them. Only available when the stream collects from every workload."
                anchor="sampling"
              >
                <div
                  v-if="form.sampling"
                  class="mb-(--spacing-sm)"
                >
                  <Alert
                    severity="warning"
                    label="Saving a stream with sampling on turns off every other data stream in this account."
                  />
                </div>
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="sampling"
                          title="Sampling"
                          description="Collect a share of the records instead of all of them, to save resources."
                          kind="compact"
                        >
                          <Switch
                            v-model="form.sampling"
                            aria-label="Sampling"
                            :disabled="saving"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.sampling"
                          key="samplingRate"
                          title="Sampling rate"
                          description="Percentage of records collected, from 1 to 100. The rate is statistical, and when streams differ the lowest one applies."
                        >
                          <NumberInput
                            id="data-stream-samplingRate"
                            v-model="form.samplingRate"
                            size="large"
                            class="w-full"
                            :min="1"
                            :max="100"
                            aria-label="Sampling rate, in percent"
                            :invalid="!!errors.samplingRate"
                            :aria-describedby="
                              errors.samplingRate ? 'data-stream-samplingRate-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="clear('samplingRate')"
                          >
                            <template #suffix>%</template>
                          </NumberInput>
                          <HelperText
                            v-if="errors.samplingRate"
                            id="data-stream-samplingRate-message"
                            :kind="errors.samplingRate.kind"
                            :label="errors.samplingRate.message"
                          />
                        </SettingRow>
                      </TransitionGroup>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Template"
                hint="The structure of each record sent to the destination."
                anchor="template"
              >
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="template"
                          title="Template"
                          description="A preset sends a fixed set of variables for one source. A custom template lets you choose the variables."
                        >
                          <Select
                            v-model="form.template"
                            size="large"
                            class="w-full"
                            :display-value="templateLabel"
                            :disabled="saving"
                            @update:model-value="clear('template')"
                          >
                            <Select.Trigger aria-label="Template" />
                            <Select.Content>
                              <Select.Option
                                v-for="option in templateOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </SettingRow>
                        <SettingRow
                          v-if="form.template === 'custom'"
                          key="templateName"
                          title="Template name"
                          description="Give a unique and descriptive name to identify the custom template."
                        >
                          <Input
                            id="data-stream-templateName"
                            v-model="form.templateName"
                            size="large"
                            class="w-full"
                            aria-label="Template name"
                            placeholder="my-custom-template"
                            autocomplete="off"
                            :required="errors.templateName?.kind === 'required'"
                            :invalid="errors.templateName?.kind === 'invalid'"
                            :aria-describedby="
                              errors.templateName ? 'data-stream-templateName-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="clear('templateName')"
                          />
                          <HelperText
                            v-if="errors.templateName"
                            id="data-stream-templateName-message"
                            :kind="errors.templateName.kind"
                            :label="errors.templateName.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.template === 'custom'"
                          key="dataSet"
                          title="Data set"
                          description="The variables sent to the destination, as a JSON object. Each value is a variable such as $host or $status."
                          kind="stacked"
                        >
                          <div class="flex w-full flex-col">
                            <CodeEditor
                              id="data-stream-dataSet"
                              v-model="form.dataSet"
                              language="json"
                              path="data-set.json"
                              height="16rem"
                              aria-label="Data set"
                              :invalid="!!errors.dataSet"
                              :aria-describedby="
                                errors.dataSet ? 'data-stream-dataSet-message' : undefined
                              "
                              :disabled="saving"
                              @update:model-value="clear('dataSet')"
                            />
                          </div>
                          <HelperText
                            v-if="errors.dataSet"
                            id="data-stream-dataSet-message"
                            :kind="errors.dataSet.kind"
                            :label="errors.dataSet.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-else
                          key="preset"
                          title="Data set"
                          description="The variables this template sends. A preset cannot be edited; choose Custom template to pick the variables yourself."
                          kind="stacked"
                        >
                          <div class="w-full min-w-0">
                            <CodeBlock
                              :tabs="presetTabs"
                              copy-aria-label="Copy the data set as JSON"
                            />
                          </div>
                        </SettingRow>
                      </TransitionGroup>
                    </Item.List>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Destination"
                hint="The platform the records are sent to. Every value comes from that platform, and credentials cannot be read back."
                anchor="destination"
              >
                <Transition
                  enter-active-class="transition duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                  enter-from-class="translate-y-2 opacity-0"
                  leave-active-class="transition duration-fast-02 ease-productive-exit motion-reduce:transition-none"
                  leave-to-class="-translate-y-2 opacity-0"
                >
                  <div
                    v-if="destinationError"
                    class="mb-(--spacing-sm)"
                  >
                    <Alert
                      severity="danger"
                      :label="destinationError"
                    >
                      <template #action>
                        <Button
                          type="button"
                          label="Send test record"
                          kind="secondary"
                          size="medium"
                          :loading="saving"
                          @click="save"
                        />
                      </template>
                    </Alert>
                  </div>
                </Transition>
                <Card :padded="false">
                  <template #content>
                    <Item.List>
                      <TransitionGroup
                        enter-active-class="animate-content-enter motion-reduce:animate-none"
                      >
                        <SettingRow
                          key="connector"
                          title="Connector"
                          description="Each platform asks for different values."
                        >
                          <Select
                            v-model="form.connector"
                            size="large"
                            class="w-full"
                            :display-value="connectorLabel"
                            :disabled="saving"
                            @update:model-value="onDestinationChange('connector')"
                          >
                            <Select.Trigger
                              id="data-stream-connector"
                              aria-label="Connector"
                            />
                            <Select.Content>
                              <Select.Option
                                v-for="option in connectorOptions"
                                :key="option.value"
                                :value="option.value"
                              >
                                {{ option.label }}
                              </Select.Option>
                            </Select.Content>
                          </Select>
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 'standard'"
                          key="url"
                          title="URL"
                          description="The URL that receives the records."
                        >
                          <Input
                            id="data-stream-url"
                            v-model="form.url"
                            size="large"
                            class="w-full"
                            aria-label="URL"
                            placeholder="https://collector.example.com/ingest"
                            autocomplete="off"
                            :required="errors.url?.kind === 'required'"
                            :invalid="errors.url?.kind === 'invalid'"
                            :aria-describedby="errors.url ? 'data-stream-url-message' : undefined"
                            :disabled="saving"
                            @update:model-value="onDestinationChange('url')"
                          />
                          <HelperText
                            v-if="errors.url"
                            id="data-stream-url-message"
                            :kind="errors.url.kind"
                            :label="errors.url.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 'standard'"
                          key="payloadFormat"
                          title="Payload format"
                          description="The format each payload is sent in. $dataset is replaced by the records, joined by the log line separator."
                        >
                          <Input
                            id="data-stream-payloadFormat"
                            v-model="form.payloadFormat"
                            size="large"
                            class="w-full"
                            aria-label="Payload format"
                            placeholder="$dataset"
                            autocomplete="off"
                            :required="errors.payloadFormat?.kind === 'required'"
                            :invalid="errors.payloadFormat?.kind === 'invalid'"
                            :aria-describedby="
                              errors.payloadFormat ? 'data-stream-payloadFormat-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('payloadFormat')"
                          />
                          <HelperText
                            v-if="errors.payloadFormat"
                            id="data-stream-payloadFormat-message"
                            :kind="errors.payloadFormat.kind"
                            :label="errors.payloadFormat.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 'standard'"
                          key="lineSeparator"
                          title="Log line separator"
                          description="Written at the end of each record. \n puts one record per line, in NDJSON format."
                        >
                          <Input
                            id="data-stream-lineSeparator"
                            v-model="form.lineSeparator"
                            size="large"
                            class="w-full"
                            aria-label="Log line separator"
                            placeholder="\n"
                            autocomplete="off"
                            :required="errors.lineSeparator?.kind === 'required'"
                            :invalid="errors.lineSeparator?.kind === 'invalid'"
                            :aria-describedby="
                              errors.lineSeparator ? 'data-stream-lineSeparator-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('lineSeparator')"
                          />
                          <HelperText
                            v-if="errors.lineSeparator"
                            id="data-stream-lineSeparator-message"
                            :kind="errors.lineSeparator.kind"
                            :label="errors.lineSeparator.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 'standard'"
                          key="headers"
                          title="Custom headers"
                          description="Sent with every request. One per line, up to 5, in the Key:Value format."
                          kind="stacked"
                        >
                          <div class="flex w-full font-code">
                            <Textarea
                              id="data-stream-headers"
                              v-model="form.headers"
                              class="w-full"
                              :rows="3"
                              aria-label="Custom headers"
                              placeholder="header-name:value"
                              :required="errors.headers?.kind === 'required'"
                              :invalid="errors.headers?.kind === 'invalid'"
                              :aria-describedby="
                                errors.headers ? 'data-stream-headers-message' : undefined
                              "
                              :disabled="saving"
                              @update:model-value="onDestinationChange('headers')"
                            />
                          </div>
                          <HelperText
                            v-if="errors.headers"
                            id="data-stream-headers-message"
                            :kind="errors.headers.kind"
                            :label="errors.headers.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 'kafka'"
                          key="bootstrapServers"
                          title="Bootstrap servers"
                          description="The hosts and ports of the Kafka cluster, separated by a comma and no space."
                          kind="stacked"
                        >
                          <div class="flex w-full font-code">
                            <Textarea
                              id="data-stream-bootstrapServers"
                              v-model="form.bootstrapServers"
                              class="w-full"
                              :rows="2"
                              aria-label="Bootstrap servers"
                              placeholder="host1:9092,host2:9092"
                              :required="errors.bootstrapServers?.kind === 'required'"
                              :invalid="errors.bootstrapServers?.kind === 'invalid'"
                              :aria-describedby="
                                errors.bootstrapServers
                                  ? 'data-stream-bootstrapServers-message'
                                  : undefined
                              "
                              :disabled="saving"
                              @update:model-value="onDestinationChange('bootstrapServers')"
                            />
                          </div>
                          <HelperText
                            v-if="errors.bootstrapServers"
                            id="data-stream-bootstrapServers-message"
                            :kind="errors.bootstrapServers.kind"
                            :label="errors.bootstrapServers.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 'kafka'"
                          key="topic"
                          title="Topic"
                          description="The Kafka topic the records are written to."
                        >
                          <Input
                            id="data-stream-topic"
                            v-model="form.topic"
                            size="large"
                            class="w-full"
                            aria-label="Topic"
                            placeholder="edge-records"
                            autocomplete="off"
                            :required="errors.topic?.kind === 'required'"
                            :invalid="errors.topic?.kind === 'invalid'"
                            :aria-describedby="
                              errors.topic ? 'data-stream-topic-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('topic')"
                          />
                          <HelperText
                            v-if="errors.topic"
                            id="data-stream-topic-message"
                            :kind="errors.topic.kind"
                            :label="errors.topic.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 's3'"
                          key="bucket"
                          title="Bucket"
                          description="The bucket the record files are written to."
                        >
                          <Input
                            id="data-stream-bucket"
                            v-model="form.bucket"
                            size="large"
                            class="w-full"
                            aria-label="Bucket"
                            placeholder="my-records-bucket"
                            autocomplete="off"
                            :required="errors.bucket?.kind === 'required'"
                            :invalid="errors.bucket?.kind === 'invalid'"
                            :aria-describedby="
                              errors.bucket ? 'data-stream-bucket-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('bucket')"
                          />
                          <HelperText
                            v-if="errors.bucket"
                            id="data-stream-bucket-message"
                            :kind="errors.bucket.kind"
                            :label="errors.bucket.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 's3'"
                          key="region"
                          title="Region"
                          description="The region of the bucket, as the storage provider names it."
                        >
                          <Input
                            id="data-stream-region"
                            v-model="form.region"
                            size="large"
                            class="w-full"
                            aria-label="Region"
                            placeholder="us-east-1"
                            autocomplete="off"
                            :required="errors.region?.kind === 'required'"
                            :invalid="errors.region?.kind === 'invalid'"
                            :aria-describedby="
                              errors.region ? 'data-stream-region-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('region')"
                          />
                          <HelperText
                            v-if="errors.region"
                            id="data-stream-region-message"
                            :kind="errors.region.kind"
                            :label="errors.region.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 's3'"
                          key="accessKey"
                          title="Access key"
                          description="The access key of a user allowed to write to the bucket."
                        >
                          <Input
                            id="data-stream-accessKey"
                            v-model="form.accessKey"
                            size="large"
                            class="w-full"
                            aria-label="Access key"
                            placeholder="AKIAEXAMPLE"
                            autocomplete="off"
                            :required="errors.accessKey?.kind === 'required'"
                            :invalid="errors.accessKey?.kind === 'invalid'"
                            :aria-describedby="
                              errors.accessKey ? 'data-stream-accessKey-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('accessKey')"
                          />
                          <HelperText
                            v-if="errors.accessKey"
                            id="data-stream-accessKey-message"
                            :kind="errors.accessKey.kind"
                            :label="errors.accessKey.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 's3'"
                          key="secretKey"
                          title="Secret key"
                          description="The secret key paired with the access key. It cannot be read back after saving."
                        >
                          <PasswordInput
                            id="data-stream-secretKey"
                            v-model="form.secretKey"
                            class="w-full"
                            aria-label="Secret key"
                            placeholder="Enter the secret key"
                            autocomplete="off"
                            :required="errors.secretKey?.kind === 'required'"
                            :invalid="errors.secretKey?.kind === 'invalid'"
                            :aria-describedby="
                              errors.secretKey ? 'data-stream-secretKey-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('secretKey')"
                          />
                          <HelperText
                            v-if="errors.secretKey"
                            id="data-stream-secretKey-message"
                            :kind="errors.secretKey.kind"
                            :label="errors.secretKey.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 'analytics'"
                          key="analyticsUrl"
                          title="Intake URL"
                          description="The intake URL of your log analytics account."
                        >
                          <Input
                            id="data-stream-analyticsUrl"
                            v-model="form.analyticsUrl"
                            size="large"
                            class="w-full"
                            aria-label="Intake URL"
                            placeholder="https://logs.example.com/api/v2/logs"
                            autocomplete="off"
                            :required="errors.analyticsUrl?.kind === 'required'"
                            :invalid="errors.analyticsUrl?.kind === 'invalid'"
                            :aria-describedby="
                              errors.analyticsUrl ? 'data-stream-analyticsUrl-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('analyticsUrl')"
                          />
                          <HelperText
                            v-if="errors.analyticsUrl"
                            id="data-stream-analyticsUrl-message"
                            :kind="errors.analyticsUrl.kind"
                            :label="errors.analyticsUrl.message"
                          />
                        </SettingRow>
                        <SettingRow
                          v-if="form.connector === 'analytics'"
                          key="apiKey"
                          title="API key"
                          description="An API key of your log analytics account. It cannot be read back after saving."
                        >
                          <PasswordInput
                            id="data-stream-apiKey"
                            v-model="form.apiKey"
                            class="w-full"
                            aria-label="API key"
                            placeholder="Enter the API key"
                            autocomplete="off"
                            :required="errors.apiKey?.kind === 'required'"
                            :invalid="errors.apiKey?.kind === 'invalid'"
                            :aria-describedby="
                              errors.apiKey ? 'data-stream-apiKey-message' : undefined
                            "
                            :disabled="saving"
                            @update:model-value="onDestinationChange('apiKey')"
                          />
                          <HelperText
                            v-if="errors.apiKey"
                            id="data-stream-apiKey-message"
                            :kind="errors.apiKey.kind"
                            :label="errors.apiKey.message"
                          />
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
              Data stream settings changed.
              <span class="text-(--text-muted)"
                >Saving sends one test record to the destination.</span
              >

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
  </div>
</template>
