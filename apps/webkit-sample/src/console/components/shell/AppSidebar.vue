<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { menuLeaves, menuPath } from '@shared/lib/menu-tree.js'
  import { useTheme } from '@shared/lib/theme.js'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import { platformResources, searchPlatform } from '../../lib/data/search-index'
  import { SAMPLE_MODES } from '../../lib/state/sample-mode.js'
  import { nextPlanUp, useSamplePreset } from '../../lib/state/sample-preset.js'
  import { expireSession } from '../../lib/state/session.js'
  import { reportNavLevel, setNavPath, setNavScroll, useSidebar } from '../../lib/state/sidebar.js'
  import AccountSwitcher from './AccountSwitcher.vue'

  interface Props {
    user?: string
    name?: string
    accountId?: string | number
    clientId?: string
    ariaLabel?: string
    active?: string
    collapsible?: boolean
    fluid?: boolean
    palette?: boolean
    shortcut?: string
    tenancy?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    user: 'myemail@azion.com',
    name: '',
    accountId: '6528',
    clientId: '9757a',
    ariaLabel: 'Sidebar',
    active: '',
    collapsible: false,
    fluid: false,
    palette: true,
    shortcut: 'meta+k',
    tenancy: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const emit = defineEmits<{
    logout: [event: Event]
    select: [event: Event, value: unknown]
    navigate: [event: Event, item: unknown]
    create: [event: Event]
  }>()

  const NAV_TREE = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', path: '/home' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', path: '/workloads' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'ai ai-deploy-pillar',
          path: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        {
          id: 'applications',
          label: 'Applications',
          icon: 'ai ai-edge-application',
          path: '/applications'
        },
        {
          id: 'functions',
          label: 'Functions',
          icon: 'ai ai-edge-functions',
          path: '/functions'
        },
        { id: 'variables', label: 'Variables', icon: 'ai ai-variables', path: '/variables' },
        {
          id: 'connectors',
          label: 'Connectors',
          icon: 'ai ai-edge-connectors',
          path: '/connectors'
        },
        {
          id: 'custom-pages',
          label: 'Custom Pages',
          icon: 'ai ai-custom-pages',
          path: '/custom-pages'
        }
      ]
    },
    {
      label: 'Secure',
      items: [
        {
          id: 'firewall',
          label: 'Firewall',
          icon: 'ai ai-edge-firewall',
          path: '/firewall'
        },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns', path: '/edge-dns' },
        { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules', path: '/waf-rules' },
        {
          id: 'certificate-manager',
          label: 'Certificate Manager',
          icon: 'ai ai-digital-certificates',
          path: '/certificates'
        },
        {
          id: 'network-lists',
          label: 'Network Lists',
          icon: 'ai ai-network-lists',
          path: '/network-lists'
        }
      ]
    },
    {
      label: 'Store',
      items: [
        {
          id: 'object-storage',
          label: 'Object Storage',
          icon: 'ai ai-edge-storage',
          path: '/object-storage'
        },
        {
          id: 'sql-database',
          label: 'SQL Database',
          icon: 'ai ai-edge-sql',
          path: '/sql-database',
          tagValue: 'Preview'
        }
      ]
    },
    {
      label: 'Observe',
      items: [
        {
          id: 'data-stream',
          label: 'Data Stream',
          icon: 'ai ai-data-stream',
          path: '/data-stream'
        },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse', path: '/edge-pulse' },
        {
          id: 'real-time-metrics',
          label: 'Real-Time Metrics',
          icon: 'ai ai-real-time-metrics',
          path: '/real-time-metrics'
        },
        {
          id: 'real-time-events',
          label: 'Real-Time Events',
          icon: 'ai ai-real-time-events',
          path: '/real-time-events'
        },
        {
          id: 'real-time-purge',
          label: 'Real-Time Purge',
          icon: 'ai ai-real-time-purge',
          path: '/real-time-purge'
        }
      ]
    },
    {
      label: 'More',
      items: [
        {
          id: 'marketplace',
          label: 'Marketplace',
          icon: 'ai ai-marketplace',
          path: '/marketplace'
        },
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
                {
                  id: 'settings-credentials',
                  label: 'Credentials',
                  path: '/account/credentials'
                },
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

  const { collapsed, railWidth, expanded, navPath, navEntering, navScroll } = useSidebar()

  const { theme } = useTheme()

  const userName = computed(() => props.name || props.user.split('@')[0])

  const navGroups = computed(() => NAV_TREE)

  const sidebarRef = ref(null)

  let navScrollEl = null
  const onNavScroll = () => {
    if (navScrollEl) setNavScroll(navScrollEl.scrollTop)
  }

  onMounted(() => {
    if (!props.collapsible) return
    const railEl = [...document.querySelectorAll('[data-testid="layout-sidebar"]')].find((el) =>
      el.querySelector('[data-testid="layout-sidebar__handle"]')
    )
    navScrollEl = railEl?.querySelector('[data-testid="layout-sidebar__scroll"]') ?? null
    if (!navScrollEl) return
    navScrollEl.scrollTop = navScroll.value
    navScrollEl.addEventListener('scroll', onNavScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    navScrollEl?.removeEventListener('scroll', onNavScroll)
    navScrollEl = null
  })

  const paletteOpen = ref(false)
  const showPalette = () => {
    paletteOpen.value = true
  }
  const onBrand = (event) => {
    event.preventDefault()
    emit('navigate', event, { id: 'overview', label: 'Overview', path: '/home' })
  }

  defineExpose({ measure: () => sidebarRef.value?.measure(), showPalette })

  const RESULT_LIMIT = 8

  const paletteQuery = ref('')
  const onPaletteQuery = (value) => {
    paletteQuery.value = String(value ?? '')
  }

  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })

  const searchResults = computed(() => searchPlatform(paletteQuery.value, RESULT_LIMIT))

  const resultsHeading = computed(() => {
    const { rows, total } = searchResults.value
    return total > rows.length ? `Resources · ${rows.length} of ${total}` : 'Resources'
  })

  const PALETTE_RECENTS = 3

  const recentRows = computed(() =>
    platformResources()
      .filter((row) => row.modifiedAt)
      .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))
      .slice(0, PALETTE_RECENTS)
  )

  const navItems = computed(() => navGroups.value.flatMap((group) => menuLeaves(group.items)))

  const drillIds = computed(() => {
    const ids = new Set()
    const walk = (nodes) =>
      nodes.forEach((node) => {
        if (node.kind === 'drill') ids.add(node.id)
        if (node.children) walk(node.children)
        if (node.groups) walk(node.groups.flatMap((group) => group.items))
      })
    navGroups.value.forEach((group) => walk(group.items))
    return ids
  })

  watch(
    () => props.active,
    (id) => {
      const ancestors = id
        ? navGroups.value.flatMap((group) => menuPath(group.items, id) ?? [])
        : []
      const levels = ancestors.filter((ancestorId) => drillIds.value.has(ancestorId))
      reportNavLevel(id, levels)
    },
    { immediate: true }
  )

  const landingOf = (node) => (node.groups || node.children ? menuLeaves([node])[0] : node)

  const onNavigate = (event, node) => {
    const target = landingOf(node)
    if (target) emit('navigate', event, target)
  }

  const paletteGroups = computed(() =>
    navGroups.value.flatMap((group, groupIndex) => {
      const blocks = []
      let run = []
      const flush = () => {
        if (run.length) {
          blocks.push({
            key: `area-${groupIndex}-${blocks.length}`,
            heading: group.label ?? '',
            items: menuLeaves(run)
          })
        }
        run = []
      }
      for (const item of group.items) {
        if (item.children || item.groups) {
          flush()
          blocks.push({ key: item.id, heading: item.label, items: menuLeaves([item]) })
        } else run.push(item)
      }
      flush()
      return blocks
    })
  )

  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.value
  )

  const actionCommands = computed(() => [
    {
      id: 'create',
      label: 'Create Resource',
      icon: 'pi pi-plus-circle',
      run: (event) => emit('create', event)
    },
    {
      id: 'theme',
      label: resolvedTheme.value === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon',
      run: () => {
        theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
      }
    },
    ...(props.collapsible
      ? [
          {
            id: 'sidebar',
            label: collapsed.value ? 'Expand Sidebar' : 'Collapse Sidebar',
            icon: collapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left',
            run: () => {
              collapsed.value = !collapsed.value
            }
          }
        ]
      : []),
    {
      id: 'expire-session',
      label: 'Expire session token',
      icon: 'pi pi-clock',
      run: () => expireSession()
    }
  ])

  const accountCommands = [
    {
      id: 'settings',
      label: 'Account Settings',
      icon: 'pi pi-cog',
      run: (event) => emit('select', event, 'settings')
    },
    {
      id: 'personal-tokens',
      label: 'Personal Tokens',
      icon: 'pi pi-key',
      run: (event) => emit('select', event, 'personal-tokens')
    },
    {
      id: 'docs',
      label: 'Docs',
      icon: 'pi pi-book',
      run: (event) => emit('select', event, 'docs')
    },
    {
      id: 'sample-preset',
      label: 'Sample preset',
      icon: 'pi pi-sliders-h',
      run: (event) => emit('select', event, 'sample-preset')
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: 'pi pi-sign-out',
      run: (event) => emit('logout', event)
    }
  ]

  const matchesPalette = (...text) => {
    const query = paletteQuery.value.trim().toLowerCase()
    if (!query) return true
    return text.filter(Boolean).join(' ').toLowerCase().includes(query)
  }

  const showResults = computed(() => searchResults.value.rows.length > 0)
  const showRecents = computed(() => !paletteQuery.value && recentRows.value.length > 0)
  const showNav = computed(() =>
    paletteGroups.value.some((group) =>
      group.items.some((item) => matchesPalette(`nav:${item.id}`, item.label))
    )
  )
  const showActions = computed(() =>
    actionCommands.value.some((command) => matchesPalette(`cmd:${command.id}`, command.label))
  )
  const showAccount = computed(() =>
    accountCommands.some((command) => matchesPalette(`cmd:${command.id}`, command.label))
  )
  const showCommands = computed(() => showActions.value || showAccount.value)

  const onPaletteSelect = (event, value) => {
    const raw = String(value)
    const separator = raw.indexOf(':')
    const scope = raw.slice(0, separator)
    const id = raw.slice(separator + 1)
    if (scope === 'res') {
      const row = platformResources().find((entry) => entry.key === id)
      if (row)
        emit('navigate', event, {
          id: row.navId,
          label: row.name,
          path: row.path,
          query: row.query
        })
      return
    }
    if (scope === 'nav') {
      const item = navItems.value.find((entry) => entry.id === id)
      if (item) emit('navigate', event, item)
      return
    }
    const command = [...actionCommands.value, ...accountCommands].find((entry) => entry.id === id)
    command?.run(event)
  }

  const accountMenuOpen = ref(false)

  const { planInfo, mode: sampleMode } = useSamplePreset()

  const presetSummary = computed(() => {
    const version = SAMPLE_MODES.find((option) => option.value === sampleMode.value)
    return [planInfo.value.name, version?.label.split(' ')[0]].filter(Boolean).join(' · ')
  })

  const upgradePlan = computed(() => nextPlanUp())

  const demoEntries = {
    feedback: 'Feedback is disabled in the demo.',
    changelog: "You're on the latest version.",
    upgrade: 'Plan management is disabled in the demo.'
  }

  const routeEntry = (event, value) => {
    if (value === 'logout') return emit('logout', event)
    if (value === 'expire-session') return expireSession()
    if (value in demoEntries) return toast.info(demoEntries[value])
    emit('select', event, value)
  }
  const onSelect = (event, value) => routeEntry(event, value)
  const onShortcut = (event, value) => {
    accountMenuOpen.value = false
    routeEntry(event, value)
  }
</script>

<template>
  <Sidebar
    ref="sidebarRef"
    v-model:collapsed="collapsed"
    v-model:width="railWidth"
    :resizable="collapsible"
    :collapsible="collapsible"
    :aria-label="ariaLabel"
    collapse-aria-label="Collapse sidebar"
    expand-aria-label="Expand sidebar"
    resize-aria-label="Resize sidebar"
    :class="[
      'app-sidebar h-full',
      fluid ? 'w-full' : collapsible ? '[--sidebar-width:var(--container-2xs)]' : 'w-(--container-2xs)'
    ]"
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
            @click="onBrand"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </div>

        <div
          v-if="tenancy"
          class="p-(--spacing-md)"
        >
          <AccountSwitcher fluid />
        </div>

        <CommandMenu
          v-if="palette"
          v-model:open="paletteOpen"
          :shortcut="shortcut"
          @select="onPaletteSelect"
        >
          <CommandMenu.Input
            placeholder="Search resources, pages and commands"
            @update:model-value="onPaletteQuery"
          />
          <CommandMenu.List>
            <CommandMenu.Group
              v-if="searchResults.rows.length"
              key="results"
              :heading="resultsHeading"
            >
              <CommandMenu.Item
                v-for="row in searchResults.rows"
                :key="row.key"
                :value="`res:${row.key}`"
              >
                <template #prefix>
                  <i
                    :class="row.icon"
                    aria-hidden="true"
                  />
                </template>
                <span class="flex min-w-0 items-baseline gap-(--spacing-xs)">
                  <span class="shrink-0">{{ row.name }}</span>
                  <span class="truncate text-label-sm text-(--text-muted)">{{ row.subtitle }}</span>
                  <span
                    class="hidden"
                    aria-hidden="true"
                    >{{ row.haystack }}</span
                  >
                </span>
                <template #suffix>
                  <span class="text-label-sm text-(--text-muted)">{{ row.typeLabel }}</span>
                </template>
              </CommandMenu.Item>
            </CommandMenu.Group>

            <CommandMenu.Separator
              v-if="showResults && (showNav || showCommands)"
              key="results-rule"
            />

            <CommandMenu.Group
              v-if="!paletteQuery && recentRows.length"
              key="recents"
              heading="Recents"
            >
              <CommandMenu.Item
                v-for="row in recentRows"
                :key="row.key"
                :value="`res:${row.key}`"
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
              v-if="showRecents && (showNav || showCommands)"
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
                :value="`nav:${item.id}`"
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

            <CommandMenu.Separator
              v-if="(showResults || showRecents || showNav) && showCommands"
              key="commands-rule"
            />

            <CommandMenu.Group heading="Actions">
              <CommandMenu.Item
                v-for="command in actionCommands"
                :key="command.id"
                :value="`cmd:${command.id}`"
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
                :value="`cmd:${command.id}`"
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

            <CommandMenu.Empty>No resource, page or command matches your search.</CommandMenu.Empty>
          </CommandMenu.List>
        </CommandMenu>
      </div>
    </template>

    <slot>
      <Menu
        class="-mt-(--spacing-xxs) pt-(--layout-boundary-start)"
        :path="navPath"
        v-model:expanded="expanded"
        @update:path="setNavPath"
        :groups="navGroups"
        :active-id="active"
        :enter-on-mount="navEntering"
        role="presentation"
        @navigate="onNavigate"
      >
        <Menu.Back />
      </Menu>
    </slot>

    <template #footer>
      <div class="flex items-center gap-(--spacing-xs)">
        <Avatar
          :label="user"
          size="small"
          kind="square"
        />
        <span class="min-w-0 flex-1 truncate text-label-sm text-(--text-default)">
          {{ userName }}
        </span>

        <Dropdown
          v-model:open="accountMenuOpen"
          placement="top-end"
          @select="onSelect"
        >
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
                <span class="truncate text-label-md text-(--text-default)">
                  {{ userName }}
                </span>
                <span class="truncate text-body-xs text-(--text-muted)">
                  {{ user }}
                </span>
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
              <span class="flex-1 truncate text-left text-label-sm text-(--text-default)">
                Theme
              </span>
              <ThemeSwitcher
                v-model:value="theme"
                aria-label="Theme"
              />
            </div>
          </Dropdown.Group>

          <Dropdown.Group label="Prototype">
            <Dropdown.Option
              value="sample-preset"
              label="Sample preset"
            >
              <template #right>
                <span class="text-body-xs text-(--text-muted)">
                  {{ presetSummary }}
                </span>
              </template>
            </Dropdown.Option>
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
              value="expire-session"
              label="Expire session token"
            >
              <template #right>
                <i
                  class="pi pi-clock"
                  aria-hidden="true"
                />
              </template>
            </Dropdown.Option>
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
                v-if="upgradePlan"
                :label="`Upgrade to ${upgradePlan.name}`"
                kind="secondary"
                size="medium"
                class="w-full"
                @click="(event) => onShortcut(event, 'upgrade')"
              />
              <div class="flex justify-center px-(--spacing-xs)">
                <StatusIndicator
                  status="positive"
                  label="All systems normal"
                />
              </div>
            </div>
          </Dropdown.Group>
        </Dropdown>
      </div>
    </template>
  </Sidebar>
</template>
