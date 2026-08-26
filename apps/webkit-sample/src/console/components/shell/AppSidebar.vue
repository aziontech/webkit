<script setup>
  // The app's standard left rail: navigation, and only navigation.
  //
  // …plus, at the top of its header, the ACCOUNT SWITCHER (`tenancy`) — the mark and
  // name of the account being operated, opening the roster (./AccountSwitcher.vue).
  //
  // It has moved twice. It began here, went to the app-wide header when identity was
  // separated from navigation, and came back when the header moved INTO the content
  // zone (see AppLayout.vue). The reason is the content-zone bar's leading edge: it now
  // has to carry the breadcrumb on the page column's own vertical, so the chain cannot
  // sit in front of it. The rail's top is the next place that reads outermost-inward —
  // which tenant you are acting as, then the way into everything inside it — and it is
  // where Cloudflare's console puts the same control.
  //
  // What that costs: identity goes away with a collapsed rail, and below `md` the rail
  // is not on screen at all. So the shell keeps the switcher in the header itself below
  // `md` (AppLayout's `isMobile` branch) and mounts it here only from `md` up — never
  // both, since the switcher owns the global ⌘O binding.
  //
  // What the rail carries: the full Azion Console navigation as the default body
  // (grouped by product area, mirroring the console; a page can override it via
  // the default slot), and the footer — avatar + user name + the account menu, a
  // Dropdown anchored to the overflow (⋮) button with a single account "Settings"
  // entry (the per-category links are rows in the rail's own Settings level, each
  // one its own page), a personal section with an identity header carrying the
  // account's plan tag, the theme control, the prototype's own "Sample preset"
  // entry, and Logout.
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

  import { SAMPLE_MODES } from '../../lib/state/sample-mode.js'
  import { nextPlanUp, useSamplePreset } from '../../lib/state/sample-preset.js'
  import { expireSession } from '../../lib/state/session.js'
  import { reportNavLevel, setNavPath, setNavScroll, useSidebar } from '../../lib/state/sidebar.js'
  import AccountSwitcher from './AccountSwitcher.vue'

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
    // Turns this instance into the RAIL: `Sidebar` then owns its own width and the
    // whole gesture — the drag handle on its trailing edge, the collapse trigger at
    // the bottom of the footer, the keyboard nudge, and the edge affordance that
    // brings a collapsed rail back. Off inside the mobile drawer, where there is
    // nothing to collapse and the drawer owns the width.
    collapsible: { type: Boolean, default: false },
    // Fills its host's width instead of carrying the rail's own. On for the copy inside
    // the mobile drawer, where the drawer panel is what decides how wide navigation is.
    fluid: { type: Boolean, default: false },
    // Whether this copy OWNS the ⌘K palette. Off for the copy inside the mobile drawer:
    // the palette has to outlive the drawer (closing it unmounts everything inside,
    // palette included), so exactly one copy holds it — the RAIL's, which stays mounted
    // at every width. The TRIGGER is not here at all any more: it is the bar's centre
    // control (@shared/ui/HeaderSearch.vue), and the shell forwards the click to this
    // copy through `showPalette` — see AppLayout's `openPalette`.
    palette: { type: Boolean, default: true },
    // Global shortcut that opens the command palette. Only ONE mounted sidebar
    // may own it — the shell passes an empty string to the drawer copy so ⌘K
    // never opens two palettes at once.
    shortcut: { type: String, default: 'meta+k' },
    // Whether this copy carries the TENANCY SWITCHER at the top of its header, above
    // the search field — the shape the console takes once the app bar moves into the
    // content zone (see AppLayout.vue): the bar's leading edge belongs to the
    // breadcrumb, so identity moves to the top of the rail.
    //
    // Only ONE mounted copy may carry it: the switcher owns the global ⌘O binding, so
    // a second instance would toggle a second panel on the same keystroke — the same
    // reason `palette` / `shortcut` exist. The shell mounts it on the rail from `md`
    // up, and in the header itself below `md`, where the rail is off screen.
    //
    // PARKED FOR NOW: the shell passes `false` at every width while account switching
    // is off (AppLayout.vue's `ACCOUNT_SWITCHING`), so the rail's header currently
    // opens on the search field. The prop stays because the row does — flipping the
    // shell's flag is the whole way back.
    tenancy: { type: Boolean, default: false }
  })

  // `logout` fires when the Logout entry is chosen; `select` fires for any other
  // account-menu entry; `navigate` fires when a nav item is activated; `create`
  // fires from the header's Create button and the palette's Create command — one
  // event for both, so the shell has a single way into the creation center. All
  // are event-first per the activation-payload convention.
  const emit = defineEmits(['logout', 'select', 'navigate', 'create'])

  // Azion Console navigation.
  //
  // Three top-level destinations, then the product areas as LABELLED GROUPS, then More. A
  // product area is a section title, not a control: every product in the console is one click
  // from the rail, so the areas exist to separate the rows — not to fold them. Nothing at the
  // root nests, so nothing has to be opened before it can be reached.
  // Items with a `path` route; the rest highlight only.
  const NAV_TREE = [
    // The destinations come first, unlabeled — the block itself carries the separation from
    // the titled areas below it. Three rows sit here: where the tenant stands (Overview), what
    // it serves (Workloads), and what it has shipped (Deployments). Everything else is a
    // product area, and the areas are titled — so an untitled row at the top means "this is
    // not one product", which is true of exactly these three.
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
    // One group per product area, its name as the section title. The rows are flat, so each
    // product keeps its icon and sits in the same column as every other row in the rail.
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
    // More: where the tenant gets more to run (Marketplace) and how it is configured
    // (Settings). Neither is a product area, so neither sits under a product title — and the
    // block is titled all the same, because an untitled block at the BOTTOM of a titled list
    // reads as leftovers rather than as its own area.
    //
    // Drill: `kind: 'drill'` replaces the whole menu with Settings' own menu instead of
    // expanding under it — the console's second-level pattern. The Back row that returns from
    // it is declared once on the Menu below and renders nothing at the root level.
    //
    // Settings is a DESTINATION as well as a level: activating it opens the level and routes to
    // its landing row (General) in the same action, so nobody is left reading the page they came
    // from while a new menu is on screen. It carries an icon for the same reason the rows above
    // it do — it is one of the rail's destinations, on their column. An inline trigger would
    // not: that one heads the rows it expands beneath it, and the column belongs to them.
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
          // A drilled level takes the same `groups` shape as the root, so the second level is
          // a real menu with its own sections. Its rows are FLAT and icon-less: a second level
          // is already a narrowed context, so condensing inside it would ask for a third
          // decision to reach a setting, and an icon column there competes with the titles
          // that do the separating.
          // Every row that names a real settings category carries its own `path`: the
          // categories are PAGES (`/account`, `/account/users`, …), not tabs on one page, so
          // this level is the only second-level navigation the module has. The rows without a
          // path are the areas the prototype does not build yet; they highlight and stay put.
          groups: [
            {
              items: [
                // The level's LANDING row: activating Settings itself routes here (see
                // `onNavigate`), so opening the level and arriving somewhere are one action.
                { id: 'settings-general', label: 'General', path: '/account' },
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
                // The audit trail this level pointed at IS the Activity History page, so the
                // row takes that page's name rather than a second name for one thing.
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

  // No row in this rail expands in place any more: the product areas are titles, and the
  // Settings level is flat — so the whole navigation is reachable without opening anything
  // first, and the only view state left is the drill stack, which `Menu` owns.
  //
  // The `expanded` model stays bound to the sidebar singleton because that is the integration
  // `Menu` asks for: the root owns the set, and a shell whose rail remounts on every route
  // (this one does — each page renders its own AppLayout) has to hand it back or a condensed
  // row would collapse on navigation. It is empty today; wiring it is what keeps adding one
  // back a data change rather than a plumbing change.
  // `navPath` is the drill stack, and it lives in the singleton because activating Settings
  // also navigates: the rail remounts on that navigation, so a level held in the component
  // would close the instant it opened. `navEntering` says whether that remount is an ENTRANCE
  // (Settings itself) or a move between rows inside the level — the one thing `Menu` cannot
  // work out for itself, and what stops the slide replaying on every settings page.
  // `collapsed` and `railWidth` are handed straight to `Sidebar`'s own models: the rail
  // gesture belongs to the component now, and this shell only persists its outcome. They stay
  // in the singleton because every page renders its own AppLayout — held here, the reader's
  // rail width and collapsed state would reset on every navigation.
  const { collapsed, railWidth, expanded, navPath, navEntering, navScroll } = useSidebar()

  // The app theme singleton — read by the footer's ThemeSwitcher and by the
  // palette's theme command, which names the outcome rather than the toggle.
  const { theme } = useTheme()

  // The display name for the footer row and the account menu's identity block: the `name` prop
  // when the shell supplies one, otherwise the email's local part.
  const userName = computed(() => props.name || props.user.split('@')[0])

  const navGroups = computed(() => NAV_TREE)

  // Forwarded from `Sidebar`: a rail measured while `display: none` reports 0, so the shell
  // re-measures once a viewport change brings it back on screen.
  const sidebarRef = ref(null)

  // ── Keeping the reader's place in the rail ────────────────────────────────
  // Every page renders its own AppLayout, so navigating REMOUNTS this rail and its scroll
  // container comes back at the top. The offset therefore has to live outside the component
  // (../../sidebar.js) and be handed back on mount, exactly like the drill level does.
  //
  // The scroll surface is `Sidebar`'s own nav region, addressed by the testid the component
  // derives for it — the addressable handle the testid rule exists to provide, rather than a
  // structural `nav > div` walk that a DS refactor would silently break. It is looked up from
  // the document rather than off `sidebarRef.$el` because `Sidebar` renders TWO roots (the rail
  // and the collapsed-edge affordance), so its `$el` is the fragment anchor, not the <aside> —
  // the same reason SessionWire.vue reaches the rail this way.
  //
  // Only the RAIL takes part (`collapsible`): the mobile drawer mounts a second copy of this
  // component over the same singleton, and a drawer opening at the top of the list would
  // otherwise overwrite the rail's offset with 0. Its <aside> is the one carrying the resize
  // handle, which is the gesture only a rail has.
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
    // Before paint: the rows are already in the DOM at this point, so reading scrollHeight
    // here settles layout and the restored offset never shows as a jump.
    navScrollEl.scrollTop = navScroll.value
    navScrollEl.addEventListener('scroll', onNavScroll, { passive: true })
  })

  onBeforeUnmount(() => {
    navScrollEl?.removeEventListener('scroll', onNavScroll)
    navScrollEl = null
  })

  // THE PALETTE lives here; its TRIGGER does not. The rail used to open on a readonly
  // search field carrying the ⌘K hint — that control is now the centre of the global bar
  // (@shared/ui/HeaderSearch.vue), because search is the way PAST the navigation tree
  // rather than part of it, and a trigger inside the rail is only reachable while the
  // rail is. What stays here is the palette itself: its list is this component's own
  // navigation — same groups, same order as the rows below — plus the app-level
  // commands, so hosting it anywhere else would mean building that tree twice. The shell
  // opens it by calling `showPalette` (exposed below), and ⌘K opens it directly.
  const paletteOpen = ref(false)
  const showPalette = () => {
    paletteOpen.value = true
  }
  // The brand goes home — the same destination and the same path as the Overview row, so
  // it routes through the SHELL's `navigate` handler like every other row here rather than
  // reaching for a router of its own. That also lets the rail mark Overview as it lands,
  // which is where the reader ends up.
  const onBrand = (event) => {
    event.preventDefault()
    emit('navigate', event, { id: 'overview', label: 'Overview', path: '/home' })
  }

  // `showPalette` is exposed so the SHELL can open this copy's palette: the bar's centre
  // search calls it, and so does the Overview hero's own field, both through AppLayout.
  defineExpose({ measure: () => sidebarRef.value?.measure(), showPalette })

  // Flat lookup for resolving a `nav:<id>` palette value back to its nav item. Containers are
  // not destinations — offering "Build" or "Settings" as a result would navigate nowhere — so
  // this walks to the leaves (`menuLeaves`, shared with the docs shell's palette).
  const navItems = computed(() => navGroups.value.flatMap((group) => menuLeaves(group.items)))

  // The rail's LEVEL follows the page, derived from the active row rather than remembered.
  // Every row of the Settings level is its own page now, so a settings page can be linked,
  // reloaded, or reached from the ⌘K palette — and on a cold arrival the stack is empty, which
  // would show the root menu with nothing marked while the reader is looking at Billing. So the
  // rail walks the tree to the active id and pushes the drill levels above it; a root-level page
  // resolves to an empty stack, which pops the level back. `Menu` restores a stack supplied this
  // way with its Back label and its trigger intact, so this costs nothing at the level itself.
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
      // The singleton owns the comparison, because it is the only thing that outlives this
      // remount: it sets the stack and derives whether arriving here was a journey between
      // levels (which animates) or a move inside one (which does not).
      reportNavLevel(id, levels)
    },
    { immediate: true }
  )

  // A drill row is a destination as well as a level: `Menu` emits `navigate` for it, and the
  // rail resolves it to the level's LANDING row — the first leaf inside it — before handing it
  // up. So hitting Settings opens the Settings menu AND lands on General, instead of opening a
  // second-level menu while the user is still looking at the page they came from. Resolving to
  // the leaf (not the container) is also what makes the right row read as active on arrival:
  // the shell highlights whatever id it is given, and a container is not a destination.
  const landingOf = (node) => (node.groups || node.children ? menuLeaves([node])[0] : node)

  // Nothing here decides whether the level animates: that is derived from the PAGE the shell
  // routes to (see the `reportNavLevel` watch above), so the header's account menu, the palette
  // and a pasted link all animate the same entrance this row does.
  const onNavigate = (event, node) => {
    const target = landingOf(node)
    if (target) emit('navigate', event, target)
  }

  // The palette mirrors the rail: consecutive plain destinations share their group's title as
  // the heading (blank for the untitled top block), and each container — the Settings drill —
  // becomes its own heading instead. A container's leaves have to be headed by the container:
  // read under "More", "General" and "Billing and plan" say nothing about which area they
  // configure, and the rail's own second level is the only place that context exists.
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
      label: 'Create resource',
      icon: 'pi pi-plus-circle',
      // Same event as the header's Create button — not a `navigate` with a
      // synthetic nav item, which would also mark a non-existent rail item active.
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
      : []),
    // The simulation, reachable from wherever the reader is: kill the token on
    // THIS page and watch the console tear it down (wire → sign out → Sign In with
    // "Session expired"). Nothing in this app expires on its own, so this command
    // and the `?ttl=<seconds>` knob are the only two ways in — see
    // ../../lib/session.js. It lives in the palette (and in the account menu
    // beside Log Out) rather than on the page, because it is a thing you DO to the
    // demo, not part of any screen it runs on.
    {
      id: 'expire-session',
      label: 'Expire session token',
      icon: 'pi pi-clock',
      run: () => expireSession()
    }
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
    // The prototype's own configuration, reachable without hunting for the ⋮ menu —
    // the same reason "Expire session token" is in here.
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

  // CommandMenu emits (event, value). Values are namespaced (`nav:` / `cmd:`) so a
  // nav id can never collide with a command id — the console has both a `home` nav
  // item and a `home` account entry. The palette closes itself on select.
  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') {
      const item = navItems.value.find((entry) => entry.id === id)
      if (item) emit('navigate', event, item)
      return
    }
    const command = [...actionCommands.value, ...accountCommands].find((entry) => entry.id === id)
    command?.run(event)
  }

  // The account menu is controlled so custom (non-Option) rows — the identity
  // header's Settings shortcut and the "Upgrade to Pro" CTA — can close it too.
  const accountMenuOpen = ref(false)

  // Which customer this prototype is pretending to be (../../lib/sample-preset.js).
  // The menu reads it for two things — the preset summarised on the row that opens
  // the panel, and which tier the upgrade CTA should sell — but it does NOT tag the
  // identity block with the plan: the contract belongs to the organization, and the
  // organization's own switcher carries it. The panel itself is hosted by the shell
  // (the rail and the mobile drawer are two copies of this component).
  const { planInfo, mode: sampleMode } = useSamplePreset()

  // Two words, not three: the row is a menu row, and the summary shares it with the
  // label — a longer string truncates "Sample preset" instead of itself. Plan and
  // contents are the two the reader cannot see from where they are standing; whether
  // the account switcher is on is legible in the header behind the menu. "Empty
  // account" contributes only its first word, which is the whole distinction.
  const presetSummary = computed(() => {
    const version = SAMPLE_MODES.find((option) => option.value === sampleMode.value)
    return [planInfo.value.name, version?.label.split(' ')[0]].filter(Boolean).join(' · ')
  })

  // The upgrade CTA sells the NEXT tier up, and nothing at the top of the ladder:
  // an Enterprise account offered an upgrade to Enterprise is the prototype
  // admitting it does not know which account it is showing.
  const upgradePlan = computed(() => nextPlanUp())

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
    // Handled here, not bubbled: expiring the token needs no router — the session
    // module owns the whole sequence and already holds it.
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
  <!--
    `Sidebar` IS the rail: it owns its width, the drag on its trailing edge, the collapse
    trigger at the bottom of the footer, and the affordance that brings it back — so there is
    no wrapper here and no gesture code in this app. The width class is only the NATURAL width
    the rail is seeded with before the reader ever drags it; once sized, the model's inline
    width takes over. `h-full` because the shell's row owns the height.

    The rail width belongs to the RAIL. A `fluid` copy takes `w-full` instead: inside the
    mobile drawer the PANEL owns the width — full-bleed below `md`, 384px at `md` — and a
    288px rail in it would leave dead panel beside every nav row.
  -->
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
    :class="['h-full', fluid ? 'w-full' : 'w-(--container-2xs)']"
  >
    <template #header>
      <!-- The rail's header region: the brand, then the account switcher when this copy
             carries it — fixed, so they stay put while the nav below them scrolls.
             SEARCH IS NOT HERE any more. It was the row under this one (a readonly field
             carrying the ⌘K hint), and it is now the centre of the global bar
             (@shared/ui/HeaderSearch.vue) — search reaches everything, and a control that
             reaches everything should not be reachable only while the rail is. The
             palette it opens is still this component's, teleported to the body; the shell
             forwards the click. -->
      <div class="flex flex-col">
        <!-- THE BRAND, at the top of the rail — where Cloudflare's console puts its own
             mark, and where this one belongs now that the bar below it starts at the
             content zone and opens with the breadcrumb.

             The DS `Brand` component, not the raw `svg/azion/*` asset: the lockup and its
             sizes are the component's contract, so the rail cannot drift to a height
             nobody else uses (this one was hand-pinned to 18px, which matched no other
             header). `kind="default"` is the wordmark lockup and `size="small"` is 16px —
             the SAME pair every other header in the app renders (site nav, docs bar, hub
             bar and rail), so one brand reads at one size across the whole prototype.

             It is a link home, so the brand does what a brand in a console is expected to
             do; `routeActivation` is the shell's job, so the anchor emits and the shell
             routes, like every other nav row here. -->
        <a
          href="/home"
          aria-label="Azion home"
          class="flex h-6 w-fit items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
          @click="onBrand"
        >
          <Brand
            kind="default"
            size="small"
          />
        </a>

        <!-- Identity under the brand — the rail reads outermost-inward: whose product
             this is, then which tenant you are acting as, then the tree itself. The
             switcher is a full-width row here (`fluid`) so it reads as part of the same
             header block rather than as a control dropped above the nav. -->
        <AccountSwitcher
          v-if="tenancy"
          fluid
        />

        <!-- The palette: the rail's navigation groups first (same labels, same
               order), then the app-level commands. Groups whose items are all
               filtered out hide themselves. Only the copy that OWNS it renders it
               (see the `palette` prop) — one palette per app, never one per copy.
               It renders here because the LIST is here, not because the trigger is:
               the trigger is the bar's centre control. -->
        <CommandMenu
          v-if="palette"
          v-model:open="paletteOpen"
          :shortcut="shortcut"
          @select="onPaletteSelect"
        >
          <CommandMenu.Input placeholder="Search navigation and commands" />
          <CommandMenu.List>
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
      <!-- Data-driven mode: `navGroups` is already the tree shape Menu takes, and
             hand-composing it would mean re-implementing the recursion here.
             `role="presentation"` because Sidebar already renders the <nav> landmark. -->
      <Menu
        :path="navPath"
        v-model:expanded="expanded"
        @update:path="setNavPath"
        :groups="navGroups"
        :active-id="active"
        :enter-on-mount="navEntering"
        role="presentation"
        @navigate="onNavigate"
      >
        <!-- Renders nothing until a drill level is pushed. -->
        <Menu.Back />
      </Menu>
    </slot>

    <template #footer>
      <!--
          No `pt` here. `Sidebar`'s footer region is the row, and its collapse trigger is a
          SIBLING of this content centred in that row — top padding on this side alone drops
          the avatar and the ⋮ button below the trigger they are supposed to line up with.
          The spacing above the footer belongs to the region, not to one item inside it.
        -->
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

          <!-- Account identity + the account's own links: Account Settings and
                 Personal Tokens (the account's tokens) sit directly under the
                 identity block. -->
          <Dropdown.Group>
            <!-- Identity only. NO PLAN TAG HERE: a plan is a contract between Azion
                 and an ORGANIZATION, not a property of the person signed in — the
                 same user is on three different contracts in three organizations, and
                 a tier tagged onto their name claims otherwise. It rides the
                 organization instead — the top tier of the account tree the switcher
                 at the top of this rail opens (./AccountSwitcher.vue), which is the
                 thing the contract is actually against. -->
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

          <!-- Theme row: not a selectable menuitem, but mirrors the Option's
                 height/padding so its inline control aligns with the rows. -->
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

          <!-- The one entry in this console that is about the console rather than
               about the account: which customer the prototype is pretending to be —
               plan, whether the account owns anything, whether it can switch
               accounts. It opens a panel (hosted by the shell) instead of listing
               the knobs here: three unrelated choices as menu rows would read as
               three account settings, which is exactly what they are not. The row
               states the preset in force, so the menu answers "which sample am I
               looking at" without opening anything. -->
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

          <!-- Ending the session, both ways: the one the operator chooses, and the
               one that happens TO them. "Expire session token" is the sample's
               simulation of a dead access token (wire → sign out → Sign In with
               "Session expired"), and it sits here because it belongs to the same
               question as Log Out — how this session ends. -->
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

          <!-- Upgrade CTA + platform status. The CTA names the next tier up and is
               absent on the top one — there is nothing left to sell an Enterprise
               account, and a button that offers it anyway is the console failing to
               know its own customer. The status line stays either way. -->
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
        <!-- No collapse button here: `Sidebar` renders its own, trailing this row. -->
      </div>
    </template>
  </Sidebar>
</template>
