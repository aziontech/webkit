<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import CardBox from '@aziontech/webkit/card-box'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import Dropdown from '@aziontech/webkit/dropdown'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import HelperText from '@aziontech/webkit/helper-text'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Textarea from '@aziontech/webkit/textarea'
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

  const breadcrumb = [{ label: 'Access Lists', href: '/access-lists' }, { label: 'office-ranges' }]

  const activeId = ref('rule-sets')
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

  const typeOptions = [
    {
      value: 'asn',
      label: 'ASN',
      description: 'Identify networks by Autonomous System Number. Suited to grouping traffic.'
    },
    {
      value: 'ip_cidr',
      label: 'IP/CIDR',
      description:
        'Specific IP addresses or ranges in CIDR notation, for precise traffic segmentation.'
    },
    {
      value: 'countries',
      label: 'Countries',
      description: 'Group traffic by country, for location-based rules.'
    }
  ]

  const record = {
    name: 'office-ranges',
    type: 'ip_cidr',
    items: '185.241.208.232\n194.26.192.64\n171.25.193.25 #comment'
  }

  const form = reactive(structuredClone(record))
  const saving = ref(false)
  const baseline = ref(JSON.stringify(record))
  const dirty = computed(() => JSON.stringify(form) !== baseline.value)

  const errors = reactive({})

  const LIST_PATTERN = /^[^\n]*\S[^\n]*(\n[^\n]*\S[^\n]*)*$/
  const COUNTRY_PATTERN = /^[^\S\n]*[A-Za-z]{2}[^\S\n]*(\n[^\S\n]*[A-Za-z]{2}[^\S\n]*)*$/

  const clear = (id) => {
    if (errors[id]) delete errors[id]
  }

  const validate = () => {
    Object.keys(errors).forEach((key) => delete errors[key])
    const name = form.name.trim()
    const items = form.items.trim()
    if (!name) errors.name = { kind: 'required', message: 'This field is required.' }
    else if (name.length > 250)
      errors.name = { kind: 'invalid', message: 'Use at most 250 characters.' }
    if (!items) errors.items = { kind: 'required', message: 'This field is required.' }
    else if (form.type === 'countries' && !COUNTRY_PATTERN.test(items))
      errors.items = {
        kind: 'invalid',
        message: 'Enter one two-letter country code per line. Example: BR.'
      }
    else if (form.type !== 'countries' && !LIST_PATTERN.test(items))
      errors.items = {
        kind: 'invalid',
        message: 'Remove the empty lines. Every line holds one entry.'
      }
    return Object.keys(errors).length === 0
  }

  const save = () => {
    if (!validate()) return
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

            <CommandMenu
              v-model:open="paletteOpen"
              @select="onPaletteSelect"
            >
              <CommandMenu.Input
                placeholder="Search resources, pages and commands"
                @update:model-value="(value) => (paletteQuery = String(value ?? ''))"
              />
              <CommandMenu.List>
                <CommandMenu.Group
                  v-if="!paletteQuery"
                  key="recents"
                  heading="Recents"
                >
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Separator
                  v-if="!paletteQuery"
                  key="recents-rule"
                />

                <CommandMenu.Group
                  v-for="group in paletteGroups"
                  :key="group.key"
                  :heading="group.heading"
                >
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Separator key="commands-rule" />

                <CommandMenu.Group heading="Actions">
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Group heading="Account">
                  <CommandMenu.Item
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
                  </CommandMenu.Item>
                </CommandMenu.Group>

                <CommandMenu.Empty
                  >No resource, page or command matches your search.</CommandMenu.Empty
                >
              </CommandMenu.List>
            </CommandMenu>
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
            <Dropdown placement="top-end">
              <Dropdown.Trigger>
                <Tooltip text="Account menu">
                  <IconButton
                    icon="pi pi-ellipsis-v"
                    aria-label="Account menu"
                    kind="outlined"
                    size="small"
                  />
                </Tooltip>
              </Dropdown.Trigger>
              <Dropdown.Group>
                <template #top>
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate text-label-md text-(--text-default)">alex</span>
                    <span class="truncate text-body-xs text-(--text-muted)">alex@example.com</span>
                  </div>
                </template>
                <Dropdown.Option
                  value="settings"
                  label="Account Settings"
                >
                  <template #right>
                    <i
                      class="pi pi-cog"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="personal-tokens"
                  label="Personal Tokens"
                >
                  <template #right>
                    <i
                      class="pi pi-key"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
                <div
                  class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                >
                  <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
                    >Theme</span
                  >
                  <ThemeSwitcher
                    v-model:value="theme"
                    aria-label="Theme"
                  />
                </div>
              </Dropdown.Group>
              <Dropdown.Group>
                <Dropdown.Option
                  value="home"
                  label="Home Page"
                >
                  <template #right>
                    <i
                      class="pi pi-home"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="changelog"
                  label="Changelog"
                >
                  <template #right>
                    <i
                      class="pi pi-pencil"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="feedback"
                  label="Feedback"
                >
                  <template #right>
                    <i
                      class="pi pi-comment"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
                <Dropdown.Option
                  value="docs"
                  label="Docs"
                >
                  <template #right>
                    <i
                      class="pi pi-book"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
                <Dropdown.Option
                  value="logout"
                  label="Log out"
                >
                  <template #right>
                    <i
                      class="pi pi-sign-out"
                      aria-hidden="true"
                    />
                  </template>
                </Dropdown.Option>
              </Dropdown.Group>
              <Dropdown.Group>
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
              </Dropdown.Group>
            </Dropdown>
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
        <form
          class="flex min-h-full min-w-0 flex-col"
          aria-label="access list settings"
          novalidate
          @submit.prevent="save"
        >
          <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
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
                  Group networks once and reference them from policy rules, instead of restating a
                  range per rule.
                </p>
              </div>
            </header>

            <fieldset
              class="layout-section-start mx-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="saving"
            >
              <legend class="sr-only">access list settings</legend>

              <section
                data-stacked
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
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
                      text="Build allowlists, blocklists and greylists from IP addresses, countries or ASNs, and use them in policy rules."
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
                      <CardBox :padded="false">
                        <template #content>
                          <Item.List>
                            <TransitionGroup
                              enter-active-class="animate-content-enter motion-reduce:animate-none"
                            >
                              <Item
                                key="name"
                                size="small"
                              >
                                <Item.Content>
                                  <Item.Title>Name</Item.Title>
                                  <Item.Description
                                    >Give a unique and descriptive name to identify the access
                                    list.</Item.Description
                                  >
                                </Item.Content>
                                <div class="flex max-w-(--container-3xs) flex-1 justify-end">
                                  <Item.Actions class="w-full">
                                    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                      <InputText
                                        v-model="form.name"
                                        size="large"
                                        class="w-full"
                                        aria-label="Name"
                                        placeholder="office-ranges"
                                        autocomplete="off"
                                        :required="errors.name?.kind === 'required'"
                                        :invalid="errors.name?.kind === 'invalid'"
                                        :aria-describedby="
                                          errors.name ? 'access-lists-name-message' : undefined
                                        "
                                        :disabled="saving"
                                        @update:model-value="clear('name')"
                                      />
                                      <HelperText
                                        v-if="errors.name"
                                        id="access-lists-name-message"
                                        :kind="errors.name.kind"
                                        :label="errors.name.message"
                                      />
                                    </div>
                                  </Item.Actions>
                                </div>
                              </Item>
                            </TransitionGroup>
                          </Item.List>
                        </template>
                      </CardBox>
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
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <button
                      type="button"
                      aria-label="Copy link to the List settings section"
                      class="absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none"
                    >
                      <i
                        class="pi pi-link text-body-xs"
                        aria-hidden="true"
                      />
                    </button>
                    <h2
                      id="list-settings"
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">List settings</span>
                    </h2>
                    <Hint
                      text="The kind of entry the list holds, and the entries themselves. The type cannot be changed after the list is created, because every entry is validated against it."
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
                      <CardBox :padded="false">
                        <template #content>
                          <Item.List>
                            <TransitionGroup
                              enter-active-class="animate-content-enter motion-reduce:animate-none"
                            >
                              <Item
                                key="type"
                                size="small"
                              >
                                <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                                  <Item.Content>
                                    <Item.Title>Type</Item.Title>
                                  </Item.Content>
                                  <Item.Actions class="w-full">
                                    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                      <fieldset
                                        class="m-0 flex w-full flex-col gap-(--spacing-sm) border-0 p-0"
                                      >
                                        <legend class="sr-only">Type</legend>
                                        <FieldRadioBlock
                                          v-for="option in typeOptions"
                                          :key="option.value"
                                          v-model="form.type"
                                          :value="option.value"
                                          name="access-lists-type"
                                          :label="option.label"
                                          :description="option.description"
                                          :disabled="saving"
                                        />
                                      </fieldset>
                                    </div>
                                  </Item.Actions>
                                </div>
                              </Item>
                              <Item
                                v-if="form.type === 'asn'"
                                key="items-asn"
                                size="small"
                              >
                                <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                                  <Item.Content>
                                    <Item.Title>List</Item.Title>
                                    <Item.Description
                                      >One ASN per line, such as 13335. Public ASNs run from 1 to
                                      64511, private ones from 64512 to 65535. Duplicate entries are
                                      removed.</Item.Description
                                    >
                                  </Item.Content>
                                  <Item.Actions class="w-full">
                                    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                      <Textarea
                                        v-model="form.items"
                                        class="w-full"
                                        :rows="5"
                                        aria-label="List"
                                        placeholder="13335&#10;53331"
                                        :required="errors.items?.kind === 'required'"
                                        :invalid="errors.items?.kind === 'invalid'"
                                        :aria-describedby="
                                          errors.items ? 'access-lists-items-message' : undefined
                                        "
                                        :disabled="saving"
                                        @update:model-value="clear('items')"
                                      />
                                      <HelperText
                                        v-if="errors.items"
                                        id="access-lists-items-message"
                                        :kind="errors.items.kind"
                                        :label="errors.items.message"
                                      />
                                    </div>
                                  </Item.Actions>
                                </div>
                              </Item>
                              <Item
                                v-else-if="form.type === 'ip_cidr'"
                                key="items-ip-cidr"
                                size="small"
                              >
                                <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                                  <Item.Content>
                                    <Item.Title>List</Item.Title>
                                    <Item.Description
                                      >One address or range per line. Add a comment after #, and a
                                      date with --LT. Duplicate entries are
                                      removed.</Item.Description
                                    >
                                  </Item.Content>
                                  <Item.Actions class="w-full">
                                    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                      <Textarea
                                        v-model="form.items"
                                        class="w-full"
                                        :rows="5"
                                        aria-label="List"
                                        placeholder="185.241.208.232&#10;194.26.192.64&#10;171.25.193.25 #comment"
                                        :required="errors.items?.kind === 'required'"
                                        :invalid="errors.items?.kind === 'invalid'"
                                        :aria-describedby="
                                          errors.items ? 'access-lists-items-message' : undefined
                                        "
                                        :disabled="saving"
                                        @update:model-value="clear('items')"
                                      />
                                      <HelperText
                                        v-if="errors.items"
                                        id="access-lists-items-message"
                                        :kind="errors.items.kind"
                                        :label="errors.items.message"
                                      />
                                    </div>
                                  </Item.Actions>
                                </div>
                              </Item>
                              <Item
                                v-else
                                key="items-countries"
                                size="small"
                              >
                                <div class="flex w-full flex-col items-stretch gap-(--spacing-sm)">
                                  <Item.Content>
                                    <Item.Title>Countries</Item.Title>
                                    <Item.Description
                                      >One or more countries, one two-letter ISO 3166-1 code per
                                      line, such as BR.</Item.Description
                                    >
                                  </Item.Content>
                                  <Item.Actions class="w-full">
                                    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
                                      <Textarea
                                        v-model="form.items"
                                        class="w-full"
                                        :rows="5"
                                        aria-label="Countries"
                                        placeholder="BR&#10;US"
                                        :required="errors.items?.kind === 'required'"
                                        :invalid="errors.items?.kind === 'invalid'"
                                        :aria-describedby="
                                          errors.items ? 'access-lists-items-message' : undefined
                                        "
                                        :disabled="saving"
                                        @update:model-value="clear('items')"
                                      />
                                      <HelperText
                                        v-if="errors.items"
                                        id="access-lists-items-message"
                                        :kind="errors.items.kind"
                                        :label="errors.items.message"
                                      />
                                    </div>
                                  </Item.Actions>
                                </div>
                              </Item>
                            </TransitionGroup>
                          </Item.List>
                        </template>
                      </CardBox>
                    </div>
                  </div>
                </div>
              </section>
            </fieldset>
          </div>

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
                <Dropdown placement="top-end">
                  <Dropdown.Trigger>
                    <Tooltip text="Account menu">
                      <IconButton
                        icon="pi pi-ellipsis-v"
                        aria-label="Account menu"
                        kind="outlined"
                        size="small"
                      />
                    </Tooltip>
                  </Dropdown.Trigger>
                  <Dropdown.Group>
                    <template #top>
                      <div class="flex min-w-0 flex-col">
                        <span class="truncate text-label-md text-(--text-default)">alex</span>
                        <span class="truncate text-body-xs text-(--text-muted)"
                          >alex@example.com</span
                        >
                      </div>
                    </template>
                    <Dropdown.Option
                      value="settings"
                      label="Account Settings"
                    >
                      <template #right>
                        <i
                          class="pi pi-cog"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="personal-tokens"
                      label="Personal Tokens"
                    >
                      <template #right>
                        <i
                          class="pi pi-key"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <div
                      class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
                    >
                      <span class="flex-1 truncate text-left text-label-sm text-(--text-default)"
                        >Theme</span
                      >
                      <ThemeSwitcher
                        v-model:value="theme"
                        aria-label="Theme"
                      />
                    </div>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="home"
                      label="Home Page"
                    >
                      <template #right>
                        <i
                          class="pi pi-home"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="changelog"
                      label="Changelog"
                    >
                      <template #right>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="feedback"
                      label="Feedback"
                    >
                      <template #right>
                        <i
                          class="pi pi-comment"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                    <Dropdown.Option
                      value="docs"
                      label="Docs"
                    >
                      <template #right>
                        <i
                          class="pi pi-book"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
                    <Dropdown.Option
                      value="logout"
                      label="Log out"
                    >
                      <template #right>
                        <i
                          class="pi pi-sign-out"
                          aria-hidden="true"
                        />
                      </template>
                    </Dropdown.Option>
                  </Dropdown.Group>
                  <Dropdown.Group>
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
                  </Dropdown.Group>
                </Dropdown>
              </div>
            </template>
          </Sidebar>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>
