<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Kbd from '@aziontech/webkit/kbd'
  import LogView from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import Menu from '@aziontech/webkit/menu'
  import Alert from '@aziontech/webkit/alert'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

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

  const breadcrumb = [{ label: 'Deployments', href: '/deployments' }, { label: 'd_7Kq2mVbHZ' }]

  const activeId = ref('deployments')
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

  const steps = [
    {
      key: 'build',
      title: 'Build',
      description: 'Bundle written to .build/worker.js',
      status: 'done',
      duration: '28s',
      lines: [
        {
          id: '0',
          time: '14:02:11',
          type: 'text',
          message: '[build] Running deploy command · platform deploy --auto --local'
        },
        {
          id: '1',
          time: '14:02:11',
          type: 'text',
          message: '[build] Getting presets available'
        },
        {
          id: '2',
          time: '14:02:12',
          type: 'text',
          message: '[build] Building with preset "vue" (platform bundler)'
        },
        {
          id: '3',
          time: '14:02:38',
          type: 'text',
          message: '[build] vite build · 1.69 MB in dist/'
        },
        {
          id: '4',
          time: '14:02:39',
          type: 'text',
          message: '[build] Wrote .build/worker.js and .build/manifest.json'
        },
        {
          id: '5',
          time: '14:02:39',
          type: 'success',
          message: '[build] Build finished successfully'
        }
      ]
    },
    {
      key: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to Storage',
      status: 'done',
      duration: '8.1s',
      lines: [
        {
          id: '0',
          time: '14:02:39',
          type: 'text',
          message: '[upload] Uploading .build/assets to storage web-app-assets'
        },
        {
          id: '1',
          time: '14:02:40',
          type: 'text',
          message: '[upload] Prefix 20260722112530 (rotate-prefix)'
        },
        {
          id: '2',
          time: '14:02:46',
          type: 'success',
          message: '[upload] 24 files updated successfully'
        },
        {
          id: '3',
          time: '14:02:47',
          type: 'success',
          message: '[upload] Storage web-app-assets successfully updated'
        }
      ]
    },
    {
      key: 'manifest',
      title: 'Manifest',
      description: 'manifest.json read, every resource resolved',
      status: 'done',
      duration: '1.9s',
      lines: [
        {
          id: '0',
          time: '14:02:47',
          type: 'text',
          message: '[manifest] Reading manifest.json file'
        },
        {
          id: '1',
          time: '14:02:48',
          type: 'text',
          message: '[manifest] Resolved 4 resources to apply: function, resource, origin, service'
        },
        {
          id: '2',
          time: '14:02:48',
          type: 'text',
          message: '[manifest] 3 rules declared in the request phase'
        },
        {
          id: '3',
          time: '14:02:49',
          type: 'success',
          message: '[manifest] manifest.json read successfully'
        }
      ]
    },
    {
      key: 'function',
      title: 'Function',
      description: 'Function bound to the bundle',
      status: 'done',
      duration: '3.6s',
      lines: [
        {
          id: '0',
          time: '14:02:49',
          type: 'text',
          message: '[manifest] Updated function __DEFAULT__ with ID 53089'
        },
        {
          id: '1',
          time: '14:02:51',
          type: 'text',
          message: '[manifest] Bound .build/worker.js to function 53089'
        },
        {
          id: '2',
          time: '14:02:53',
          type: 'success',
          message: '[manifest] Function binding __DEFAULT__ with id 47458 successfully updated'
        }
      ]
    },
    {
      key: 'resource',
      title: 'Resource',
      description: 'Resource and cache settings applied',
      status: 'done',
      duration: '2.8s',
      lines: [
        {
          id: '0',
          time: '14:02:53',
          type: 'text',
          message: '[manifest] Updated resource web-app with ID 1784552864'
        },
        {
          id: '1',
          time: '14:02:55',
          type: 'success',
          message: '[manifest] Cache setting __DEFAULT__ successfully updated'
        },
        {
          id: '2',
          time: '14:02:56',
          type: 'success',
          message: '[manifest] Resource web-app successfully updated'
        }
      ]
    },
    {
      key: 'origin',
      title: 'Origin',
      description: 'Origin pointed at the storage',
      status: 'done',
      duration: '1.9s',
      lines: [
        {
          id: '0',
          time: '14:02:56',
          type: 'text',
          message: '[manifest] Creating origin storage-default (storage)'
        },
        {
          id: '1',
          time: '14:02:57',
          type: 'text',
          message: '[manifest] Storage web-app-assets · prefix 20260722112530'
        },
        {
          id: '2',
          time: '14:02:58',
          type: 'success',
          message: '[manifest] Origin storage-default with id 263718 successfully updated'
        }
      ]
    },
    {
      key: 'rules',
      title: 'Rules',
      description: 'Request-phase rules applied',
      status: 'done',
      duration: '4.8s',
      lines: [
        {
          id: '0',
          time: '14:02:59',
          type: 'success',
          message:
            '[manifest] Rule "Set storage origin for all requests" with id 604943 successfully updated'
        },
        {
          id: '1',
          time: '14:03:00',
          type: 'success',
          message: '[manifest] Rule "Deliver static assets" with id 604944 successfully updated'
        },
        {
          id: '2',
          time: '14:03:01',
          type: 'success',
          message: '[manifest] Rule "Redirect to index.html" with id 604945 successfully updated'
        },
        {
          id: '3',
          time: '14:03:03',
          type: 'success',
          message: '[manifest] 3 rules applied in the request phase'
        }
      ]
    },
    {
      key: 'service',
      title: 'Service',
      description: 'Service deployment published to the domain',
      status: 'done',
      duration: '3.7s',
      lines: [
        {
          id: '0',
          time: '14:03:04',
          type: 'success',
          message: '[manifest] Service web-app with id 1784675753 successfully updated'
        },
        {
          id: '1',
          time: '14:03:05',
          type: 'success',
          message: '[manifest] Service deployment d_7Kq2mVbHZ with id 5591028 successfully created'
        },
        {
          id: '2',
          time: '14:03:06',
          type: 'text',
          message: '[manifest] Environment production'
        },
        {
          id: '3',
          time: '14:03:07',
          type: 'text',
          message: '[manifest] Updated domain web-app with ID 1784675753'
        }
      ]
    },
    {
      key: 'purge',
      title: 'Cache Purge',
      description: 'Cache purged for the domain',
      status: 'done',
      duration: '3.4s',
      lines: [
        {
          id: '0',
          time: '14:03:08',
          type: 'text',
          message: '[purge] purge_on_publish · Initializing cache warming...'
        },
        {
          id: '1',
          time: '14:03:09',
          type: 'text',
          message: '[purge] Purge request accepted for web-app-mh2saq.example.com'
        },
        {
          id: '2',
          time: '14:03:10',
          type: 'text',
          message: '[purge] Cache warmed for 3 locations'
        },
        {
          id: '3',
          time: '14:03:11',
          type: 'success',
          message: '[purge] Purge finished executing'
        }
      ]
    },
    {
      key: 'finish',
      title: 'Live',
      description: 'Deployment serving traffic at the domain',
      status: 'done',
      duration: '0.9s',
      lines: [
        {
          id: '0',
          time: '14:03:12',
          type: 'text',
          message:
            '[deploy] To visualize your resource access the domain: https://web-app-mh2saq.example.com'
        },
        {
          id: '1',
          time: '14:03:12',
          type: 'success',
          message: '[deploy] Deployed finished executing'
        }
      ]
    }
  ]
  const lines = steps.flatMap((step, index) =>
    step.lines.map((line) => ({ ...line, id: `${index}-${line.id}` }))
  )
  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const logView = ref('phased')
  const openStep = ref('finish')
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
                    v-model:value="theme"
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

      <div
        class="min-h-0 flex-1 overflow-auto layout-boundary animate-page-enter motion-reduce:animate-none"
      >
        <main class="flex min-h-full w-full flex-col">
          <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
            <div class="[--popup-origin:top] animate-popup-scale-in motion-reduce:animate-none">
              <Alert
                severity="success"
                size="small"
                label="Live at https://web-app-mh2saq.example.com — published to web-app (production) in 1m 1s."
              />
            </div>

            <Card :padded="false">
              <template #header>
                <p class="text-heading-xs text-(--text-default)">Deployment Details</p>

                <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                  <Tooltip text="https://web-app-mh2saq.example.com">
                    <Button
                      label="Visit"
                      kind="secondary"
                      size="medium"
                      icon="pi pi-external-link"
                      href="https://web-app-mh2saq.example.com"
                      target="_blank"
                    />
                  </Tooltip>

                  <DropdownMenu placement="bottom-end">
                    <DropdownMenu.Trigger>
                      <Tooltip text="Deployment actions">
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="outlined"
                          size="medium"
                          aria-label="Deployment actions"
                        />
                      </Tooltip>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="logs"
                        label="Logs"
                      >
                        <template #left>
                          <i
                            class="pi pi-align-left"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                      <DropdownMenu.Option
                        value="requests"
                        label="Requests"
                      >
                        <template #left>
                          <i
                            class="pi pi-arrow-right-arrow-left"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                    </DropdownMenu.Group>
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        value="redeploy"
                        label="Redeploy"
                      >
                        <template #left>
                          <i
                            class="pi pi-refresh"
                            aria-hidden="true"
                          />
                        </template>
                      </DropdownMenu.Option>
                    </DropdownMenu.Group>
                  </DropdownMenu>
                </div>
              </template>

              <template #content>
                <div
                  class="grid grid-cols-1 gap-(--spacing-lg) p-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
                >
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Created</span>
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <Tooltip text="Rafael Garbinatto · October 29, 2026, 11:30:58 AM">
                        <Avatar
                          alt="Rafael Garbinatto"
                          label="Rafael Garbinatto"
                          size="small"
                          kind="square"
                        />
                      </Tooltip>
                      <span class="truncate text-body-sm text-(--text-default)">
                        Rafael Garbinatto
                      </span>
                      <span class="shrink-0 text-body-sm text-(--text-muted)"> 1 week ago </span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Status</span>
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <StatusIndicator
                        severity="success"
                        label="Ready"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Duration</span>
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-clock shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate text-body-sm text-(--text-default)"> 1m 1s </span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Environment</span>
                    <div class="flex min-w-0 items-center">
                      <Tag
                        severity="secondary"
                        size="medium"
                        label="Production"
                      />
                    </div>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Service</span>
                    <Tooltip text="Open web-app in Services">
                      <a
                        href="/services/1784675753"
                        class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                      >
                        <span class="truncate underline-offset-2 group-hover/link:underline">
                          web-app
                        </span>
                        <i
                          class="pi pi-external-link shrink-0 text-body-xs leading-none"
                          aria-hidden="true"
                        />
                      </a>
                    </Tooltip>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Resource</span>
                    <Tooltip text="Open web-app in Resources">
                      <a
                        href="/resources/1784552864"
                        class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                      >
                        <span class="truncate underline-offset-2 group-hover/link:underline">
                          web-app
                        </span>
                        <i
                          class="pi pi-external-link shrink-0 text-body-xs leading-none"
                          aria-hidden="true"
                        />
                      </a>
                    </Tooltip>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Triggered By</span>
                    <div class="flex min-w-0 items-center">
                      <Tooltip text="platform deploy --auto --local">
                        <Tag
                          severity="secondary"
                          size="medium"
                          icon="pi pi-code"
                          label="CLI"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs)">
                    <span class="text-label-sm text-(--text-muted)">Preset</span>
                    <div class="flex min-w-0 items-center">
                      <Tooltip text="build.preset in platform.config.js">
                        <Tag
                          severity="secondary"
                          size="medium"
                          icon="pi pi-wrench"
                          label="vue"
                        />
                      </Tooltip>
                    </div>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs) sm:col-span-2 lg:col-span-3">
                    <span class="text-label-sm text-(--text-muted)">Storage</span>
                    <div
                      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-default)"
                    >
                      <i
                        class="pi pi-inbox shrink-0 text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate">web-app-assets</span>
                      <span
                        class="text-body-xs text-(--text-muted)"
                        aria-hidden="true"
                        >·</span
                      >
                      <span class="text-label-code-sm text-(--text-muted)"> 20260722112530 </span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-(--spacing-xxs) sm:col-span-2 lg:col-span-3">
                    <span class="text-label-sm text-(--text-muted)">Domains</span>
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-globe shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <Tooltip text="Open web-app-mh2saq.example.com in a new tab">
                        <a
                          href="https://web-app-mh2saq.example.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                        >
                          <span class="truncate underline-offset-2 group-hover/link:underline">
                            web-app-mh2saq.example.com
                          </span>
                          <i
                            class="pi pi-external-link shrink-0 text-body-xs leading-none"
                            aria-hidden="true"
                          />
                        </a>
                      </Tooltip>
                      <CopyButton
                        kind="outlined"
                        value="web-app-mh2saq.example.com"
                        aria-label="Copy domain name"
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
                          class="flex flex-wrap items-center gap-x-(--spacing-sm) gap-y-(--spacing-xxs) px-(--spacing-md) pb-(--spacing-md) @lg/band:pointer-events-none @lg/band:absolute @lg/band:inset-y-0 @lg/band:right-0 @lg/band:max-w-[calc(100%-12rem)] @lg/band:justify-end @lg/band:px-0 @lg/band:pr-(--spacing-md) @lg/band:pb-0"
                        >
                          <div class="pointer-events-auto">
                            <Tooltip text="Open Default in Build & Deployment settings">
                              <a
                                href="/account/build-deployment"
                                class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                              >
                                <span
                                  class="truncate underline-offset-2 group-hover/link:underline"
                                >
                                  Default
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
                        <div
                          class="grid grid-cols-1 gap-(--spacing-lg) px-(--spacing-md) pt-(--spacing-xs) pb-(--spacing-md) sm:grid-cols-2 lg:grid-cols-4"
                        >
                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                            <span class="text-label-sm text-(--text-muted)">Binding policy</span>
                            <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                              <span class="truncate text-body-sm text-(--text-default)">
                                Strict
                              </span>
                            </span>
                          </div>
                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                            <span class="text-label-sm text-(--text-muted)">Deployment policy</span>
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
                                class="h-(--size-4) w-(--size-4) shrink-0 text-(--text-muted)"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                fill-rule="evenodd"
                                aria-hidden="true"
                              >
                                <path
                                  d="M8 0a8 8 0 100 16A8 8 0 008 0z M4.25 8a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H5A.75.75 0 014.25 8z"
                                />
                              </svg>
                              <span class="truncate text-body-sm text-(--text-muted)">
                                Disabled
                              </span>
                            </span>
                          </div>
                          <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                            <span class="text-label-sm text-(--text-muted)">Skew protection</span>
                            <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                              <svg
                                class="h-(--size-4) w-(--size-4) shrink-0 text-(--text-muted)"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                fill-rule="evenodd"
                                aria-hidden="true"
                              >
                                <path
                                  d="M8 0a8 8 0 100 16A8 8 0 008 0z M4.25 8a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H5A.75.75 0 014.25 8z"
                                />
                              </svg>
                              <span class="truncate text-body-sm text-(--text-muted)">
                                Disabled
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
              class="w-full"
            >
              <template #header>
                <p class="min-w-0 truncate text-heading-xs text-(--text-default)">
                  Deployment Logs
                </p>

                <div class="flex shrink-0 items-center gap-(--spacing-sm)">
                  <span class="text-label-sm text-(--text-muted)"> 1m 1s </span>
                  <ToggleGroup
                    v-model="logView"
                    :options="logViews"
                    size="medium"
                    aria-label="Log view"
                  />
                </div>
              </template>

              <template #content>
                <div class="flex w-full flex-col">
                  <Accordion
                    v-if="logView === 'phased'"
                    v-model:value="openStep"
                    type="single"
                    collapsible
                  >
                    <Accordion.Item
                      v-for="step in steps"
                      :key="step.key"
                      :value="step.key"
                    >
                      <Accordion.Trigger>
                        <span class="flex min-h-10 flex-1 items-center gap-(--spacing-sm)">
                          <span class="flex size-5 shrink-0 items-center justify-center">
                            <i
                              v-if="step.status === 'done'"
                              class="pi pi-check-circle text-(--success-contrast)"
                              aria-hidden="true"
                            />
                            <i
                              v-else-if="step.status === 'failed'"
                              class="pi pi-times-circle text-(--danger-contrast)"
                              aria-hidden="true"
                            />
                            <i
                              v-else-if="step.status === 'skipped'"
                              class="pi pi-minus-circle text-(--text-muted) opacity-60"
                              aria-hidden="true"
                            />
                            <span
                              v-else
                              class="size-3.5 rounded-full border border-dashed border-(--border-default)"
                            />
                          </span>
                          <span
                            :data-state="step.status"
                            class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-left data-[state=failed]:flex-wrap"
                          >
                            <span
                              :data-state="step.status"
                              class="shrink-0 text-label-md text-(--text-default) data-[state=pending]:text-(--text-muted) data-[state=skipped]:text-(--text-muted)"
                            >
                              {{ step.title }}
                            </span>
                            <span
                              :data-state="step.status"
                              class="min-w-0 truncate text-body-sm text-(--text-muted) data-[state=failed]:whitespace-normal data-[state=failed]:text-pretty data-[state=failed]:text-(--danger-contrast) data-[state=running]:motion-safe:bg-[linear-gradient(90deg,var(--text-muted)_0%,var(--text-muted)_35%,var(--text-default)_50%,var(--text-muted)_65%,var(--text-muted)_100%)] data-[state=running]:motion-safe:bg-[length:200%_100%] data-[state=running]:motion-safe:bg-clip-text data-[state=running]:motion-safe:text-transparent data-[state=running]:motion-safe:animate-(--animate-shimmer) motion-reduce:animate-none"
                            >
                              {{ step.description }}
                            </span>
                          </span>
                          <span class="ml-auto flex shrink-0 items-center">
                            <span
                              v-if="step.duration"
                              class="text-label-code-md text-(--text-muted)"
                            >
                              {{ step.duration }}
                            </span>
                          </span>
                        </span>
                      </Accordion.Trigger>
                      <Accordion.Content>
                        <LogView
                          :lines="step.lines"
                          :border="false"
                          show-copy
                          :loading="step.status === 'pending'"
                          loading-label="Waiting to start…"
                        >
                          <LogViewContent>
                            <template #empty>No log lines yet.</template>
                          </LogViewContent>
                        </LogView>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion>
                  <LogView
                    v-else
                    :lines="lines"
                    :border="false"
                    show-copy
                    loading-label="Waiting to start…"
                  >
                    <LogViewContent>
                      <template #empty>No log lines yet.</template>
                    </LogViewContent>
                  </LogView>
                </div>
              </template>
            </Card>
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
                        v-model:value="theme"
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
