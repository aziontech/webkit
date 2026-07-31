<script setup>
  // The app's standard left rail: navigation, and only navigation.
  //
  // The brand mark and the account switcher used to sit at the top of this rail;
  // they now live in the global header (see AppLayout.vue), next to the
  // organization that owns the account. Identity is global — it outranks the
  // rail, and it must not disappear when the rail collapses — so the two
  // concerns are segregated: the header answers "who am I acting as", the rail
  // answers "where in this tenant am I".
  //
  // What stays: the search field at the top (the ⌘K affordance for the
  // CommandMenu palette, which carries the same navigation plus the app-level
  // commands), the full Azion Console navigation as the default body (grouped by
  // product area, mirroring the console; a page can override it via the default
  // slot), and the footer — avatar + user name + the account menu, a Dropdown
  // anchored to the overflow (⋮) button with a single account "Settings" entry
  // (the per-category links are tabs on the /account page), a personal section
  // with an identity header, the theme control, and Logout.
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import Dropdown from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Kbd from '@aziontech/webkit/kbd'
  import MenuItem from '@aziontech/webkit/menu-item'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarGroup from '@aziontech/webkit/sidebar-group'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { useSidebar } from '../../sidebar.js'
  import { useTheme } from '../../theme.js'

  const props = defineProps({
    // Signed-in user's email; the footer shows the local part as the display name.
    user: { type: String, default: 'myemail@azion.com' },
    // Display name; falls back to the email's local part when omitted.
    name: { type: String, default: '' },
    // Account + client identifiers shown in the menu's top identity block.
    accountId: { type: [String, Number], default: '6528' },
    clientId: { type: String, default: '9757a' },
    ariaLabel: { type: String, default: 'Sidebar' },
    // Id of the nav item to render as selected.
    active: { type: String, default: '' },
    // Shows the collapse toggle at the bottom of the rail (desktop rail only;
    // off inside the mobile drawer).
    collapsible: { type: Boolean, default: false },
    // Global shortcut that opens the command palette. Only ONE mounted sidebar
    // may own it — the shell passes an empty string to the drawer copy so ⌘K
    // never opens two palettes at once.
    shortcut: { type: String, default: 'meta+k' }
  })

  // `logout` fires when the Logout entry is chosen; `select` fires for any other
  // account-menu entry; `navigate` fires when a nav item is activated. All are
  // event-first per the activation-payload convention.
  const emit = defineEmits(['logout', 'select', 'navigate'])

  // Azion Console navigation, grouped by product area — the full set mirroring
  // the console's left rail. Items with a `path` route; the rest highlight only.
  const navGroups = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'ai ai-home', path: '/home' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', path: '/workloads' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'ai ai-deploy-pillar',
          path: '/deployments'
        },
        {
          id: 'marketplace',
          label: 'Marketplace',
          icon: 'ai ai-marketplace',
          path: '/marketplace'
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
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions' },
        { id: 'variables', label: 'Variables', icon: 'ai ai-variables', path: '/variables' },
        { id: 'connectors', label: 'Connectors', icon: 'ai ai-edge-connectors' },
        { id: 'custom-pages', label: 'Custom Pages', icon: 'ai ai-custom-pages' }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'firewall', label: 'Firewall', icon: 'ai ai-edge-firewall' },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns', path: '/edge-dns' },
        { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules' },
        {
          id: 'certificate-manager',
          label: 'Certificate Manager',
          icon: 'ai ai-digital-certificates'
        },
        { id: 'network-lists', label: 'Network Lists', icon: 'ai ai-network-lists' }
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
          tag: 'Preview'
        }
      ]
    },
    {
      label: 'Deploy',
      items: [{ id: 'edge-nodes', label: 'Edge Nodes', icon: 'ai ai-edge-nodes' }]
    },
    {
      label: 'Observe',
      items: [
        { id: 'data-stream', label: 'Data Stream', icon: 'ai ai-data-stream' },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse' },
        { id: 'real-time-metrics', label: 'Real-Time Metrics', icon: 'ai ai-real-time-metrics' },
        { id: 'real-time-events', label: 'Real-Time Events', icon: 'ai ai-real-time-events' }
      ]
    },
    {
      label: 'Tools',
      items: [{ id: 'real-time-purge', label: 'Real-Time Purge', icon: 'ai ai-real-time-purge' }]
    },
    {
      label: 'Edge Libraries',
      items: [{ id: 'edge-services', label: 'Edge Services', icon: 'ai ai-edge-services' }]
    },
    // Demo-only pages that exercise the design system itself, kept last so they
    // never read as console product areas.
    {
      label: 'Design stuff',
      items: [
        { id: 'forms', label: 'Forms', icon: 'pi pi-file-edit', path: '/forms' },
        { id: 'diagrams', label: 'Diagrams', icon: 'pi pi-share-alt', path: '/diagrams' },
        { id: 'playground', label: 'Playground', icon: 'pi pi-palette', path: '/playground' }
      ]
    }
  ]

  const { theme } = useTheme()
  const userName = computed(() => props.name || props.user.split('@')[0])

  // Rail collapse: the shared singleton state. Collapsing is driven from the
  // control at the bottom of the rail (below); bringing the rail BACK is the
  // shell's job — its own toggle goes inert with the rail, so AppLayout owns the
  // hover-revealed trigger on the collapsed edge.
  const { collapsed } = useSidebar()

  // Sidebar search → CommandMenu. The field above the scrolling nav is a
  // read-only ⌘K affordance: clicking it (or pressing the global shortcut) opens
  // the palette, which owns the search. The palette carries the whole navigation
  // — same groups, same order as the rail — plus the app-level commands, so the
  // rail itself always shows the full nav instead of a second filtered list.
  const paletteOpen = ref(false)
  const openPalette = () => {
    paletteOpen.value = true
  }

  // Flat lookup for resolving a `nav:<id>` palette value back to its nav item.
  const navItems = navGroups.flatMap((group) => group.items)

  // The theme mode resolved to a concrete value, so the palette's theme command
  // can name the outcome ("Switch to Dark Theme") instead of the toggle.
  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.value
  )

  // App-level commands, listed below the navigation groups. Labels that depend on
  // current state are computed; the `value` each one is registered under (below)
  // keeps a stable keyword so filtering still finds it ("theme", "sidebar").
  const actionCommands = computed(() => [
    {
      id: 'create',
      label: 'Create Resource',
      icon: 'pi pi-plus-circle',
      run: (event) => emit('navigate', event, { id: 'create', label: 'Create', path: '/create' })
    },
    {
      id: 'theme',
      label: resolvedTheme.value === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon',
      run: () => {
        theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
      }
    },
    // Only offered where a collapsible rail exists (desktop) — inside the mobile
    // drawer the shell passes `collapsible: false` and there is nothing to
    // collapse.
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
      : [])
  ])

  // Account entries reuse the sidebar's existing events — the shell owns the
  // router, exactly as it does for the footer's ⋮ menu.
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
      id: 'logout',
      label: 'Log Out',
      icon: 'pi pi-sign-out',
      run: (event) => emit('logout', event)
    }
  ]

  // CommandMenu emits (event, value). Values are namespaced (`nav:` / `cmd:`) so a
  // nav id can never collide with a command id — the console has both a `home` nav
  // item and a `home` account entry. The palette closes itself on select.
  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') {
      const item = navItems.find((entry) => entry.id === id)
      if (item) emit('navigate', event, item)
      return
    }
    const command = [...actionCommands.value, ...accountCommands].find((entry) => entry.id === id)
    command?.run(event)
  }

  // The account menu is controlled so custom (non-Option) rows — the identity
  // header's Settings shortcut and the "Upgrade to Pro" CTA — can close it too.
  const accountMenuOpen = ref(false)

  // Entries the demo can't route anywhere real (Feedback, Changelog, Help,
  // Upgrade) acknowledge with a toast; navigations bubble to the parent, which
  // owns the router. Logout keeps its own event. "Personal Tokens" lives here,
  // directly under the account identity + Settings — the account's tokens area.
  const demoEntries = {
    feedback: 'Feedback is disabled in the demo.',
    changelog: "You're on the latest version.",
    upgrade: 'Plan management is disabled in the demo.'
  }

  // Dropdown Options emit (event, value) and close the menu on select; the
  // header gear and Upgrade CTA are plain buttons, so they close it by hand.
  const routeEntry = (event, value) => {
    if (value === 'logout') return emit('logout', event)
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
  <aside class="w-[var-(--container-xl)] shrink-0">
    <Sidebar :aria-label="ariaLabel">
      <template #header>
        <!-- Search → CommandMenu. A read-only field carrying the ⌘K hint, in the
             fixed header region so it stays put while the nav below it scrolls.
             It is the rail's whole header now: the brand and the account
             switcher moved to the global header (see AppLayout.vue). The
             wrapper takes the click so the icons and the field itself are all
             part of the target; Enter on the focused field opens it too. The
             palette teleports to the body, so it works while the rail is
             collapsed and inside the mobile drawer. -->
        <div>
          <div
            class="cursor-pointer [&_input]:cursor-pointer"
            @click="openPalette"
            @keydown.enter="openPalette"
          >
            <InputText
              model-value=""
              placeholder="Search"
              size="large"
              readonly
              aria-label="Search navigation and commands"
              aria-keyshortcuts="Meta+K"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
              <template #iconRight>
                <Kbd
                  meta
                  size="small"
                  >K</Kbd
                >
              </template>
            </InputText>
          </div>

          <!-- The palette: the rail's navigation groups first (same labels, same
               order), then the app-level commands. Groups whose items are all
               filtered out hide themselves. -->
          <CommandMenu
            v-model:open="paletteOpen"
            :shortcut="shortcut"
            @select="onPaletteSelect"
          >
            <CommandMenu.Input placeholder="Search navigation and commands" />
            <CommandMenu.List>
              <CommandMenu.Group
                v-for="(group, i) in navGroups"
                :key="group.label ?? `nav-group-${i}`"
                :heading="group.label ?? ''"
              >
                <CommandMenu.Item
                  v-for="item in group.items"
                  :key="item.id"
                  :value="`nav:${item.id}`"
                >
                  <template #prefix>
                    <i
                      :class="item.icon"
                      aria-hidden="true"
                    />
                  </template>
                  {{ item.label }}
                </CommandMenu.Item>
              </CommandMenu.Group>

              <CommandMenu.Separator />

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

              <CommandMenu.Empty>No navigation or command matches your search.</CommandMenu.Empty>
            </CommandMenu.List>
          </CommandMenu>
        </div>
      </template>

      <slot>
        <SidebarGroup
          v-for="(group, i) in navGroups"
          :key="group.label ?? `group-${i}`"
          :label="group.label"
        >
          <MenuItem
            v-for="item in group.items"
            :key="item.id"
            :label="item.label"
            :icon="item.icon"
            :selected="active === item.id"
            :tag-value="item.tag"
            @click="(event) => emit('navigate', event, item)"
          />
        </SidebarGroup>
      </slot>

      <template #footer>
        <div class="flex items-center pt-[var(--spacing-sm)] gap-[var(--spacing-xs)]">
          <Avatar
            :label="user"
            size="small"
            kind="square"
          />
          <span class="min-w-0 flex-1 truncate text-label-sm text-[var(--text-default)]">
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

            <!-- Account identity + the account's own links: Account Settings and
                 Personal Tokens (the account's tokens) sit directly under the
                 identity block. -->
            <Dropdown.Group>
              <template #top>
                <div class="flex min-w-0 flex-col">
                  <span class="truncate text-label-md text-[var(--text-default)]">
                    {{ userName }}
                  </span>
                  <span class="truncate text-body-xs text-[var(--text-muted)]">
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

            <!-- Theme row: not a selectable menuitem, but mirrors the Option's
                 height/padding so its inline control aligns with the rows. -->
            <Dropdown.Group>
              <div
                class="flex h-8 min-h-8 items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-sm)] py-[var(--spacing-xxs)]"
              >
                <span class="flex-1 truncate text-left text-label-sm text-[var(--text-default)]">
                  Theme
                </span>
                <ThemeSwitcher
                  v-model:value="theme"
                  aria-label="Theme"
                />
              </div>
            </Dropdown.Group>

            <!-- Resources -->
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

            <!-- Logout -->
            <Dropdown.Group>
              <Dropdown.Option
                value="logout"
                label="Log Out"
              >
                <template #right>
                  <i
                    class="pi pi-sign-out"
                    aria-hidden="true"
                  />
                </template>
              </Dropdown.Option>
            </Dropdown.Group>

            <!-- Upgrade CTA + platform status -->
            <Dropdown.Group>
              <div
                class="flex flex-col gap-[var(--spacing-sm)] px-[var(--spacing-xxs)] py-[var(--spacing-xxs)]"
              >
                <Button
                  label="Upgrade to Pro"
                  kind="secondary"
                  size="medium"
                  class="w-full"
                  @click="(event) => onShortcut(event, 'upgrade')"
                />
                <div class="flex justify-center px-[var(--spacing-xs)]">
                  <StatusIndicator
                    status="positive"
                    label="All systems normal"
                  />
                </div>
              </div>
            </Dropdown.Group>
          </Dropdown>

          <Tooltip
            v-if="collapsible"
            key="sidebar-toggle"
            text="Collapse sidebar"
            placement="top"
          >
            <IconButton
              icon="pi pi-angle-double-left"
              aria-label="Collapse sidebar"
              kind="outlined"
              size="small"
              icon-transition
              @click="collapsed = true"
            />
          </Tooltip>
        </div>
      </template>
    </Sidebar>
  </aside>
</template>
