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

  import { platformResources, searchPlatform } from '../../lib/data/search-index'
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
    // is off (AppLayout.vue's `ACCOUNT_SWITCHING`), so the rail's header region is the
    // brand band alone and ends exactly on the header's line. The prop stays because the
    // row does — flipping the shell's flag is the whole way back, and the switcher lands
    // UNDER that line so the band keeps the bar's 56.
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
    // Settings OPENS THE LEVEL AND NOTHING ELSE. It carries no `href`, so `MenuSubTrigger`
    // gives the whole row to the disclosure and the reader stays on the page they were reading
    // while the new column arrives — they pick where to go from it. (The docs rail's `Functions`
    // takes the other shape, because there the level has a product overview worth landing on:
    // an `href` splits that row into a link plus an arrow. Settings has no such page — `General`
    // is one category among several, not an overview of them.) It carries an icon for the same
    // reason the rows above it do — it is one of the rail's destinations, on their column. An
    // inline trigger would not: that one heads the rows it expands beneath it, and the column
    // belongs to them.
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
              // Titled with the level's own name, because this block is what the level
              // OPENS on: the Back row above it says where Back goes (the root rail), not
              // where the reader now is. Untitled, the three account rows read as loose
              // rows under an arrow while `Access` and `Billing` below them are named —
              // so the block the level lands in was the only one without a heading.
              label: 'Settings',
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

  // ── GLOBAL SEARCH: THE WHOLE PLATFORM, FROM ANY PAGE ──
  //
  // The palette indexes EVERY resource the account owns — sixteen types, from applications
  // and workloads down to buckets, DNS zones, variables and teams
  // (../../lib/data/search-index.js). Before this, it reached the reader's last three
  // resources and nothing else, so finding anything older meant first knowing which module
  // it lived in — the one thing a reader who is searching does not know.
  //
  // THE INDEX IS A COMPUTED because it is projected through the tenancy chain in force:
  // switching organization, account or workspace re-answers the search, and the sample's
  // EMPTY version searches an account that owns nothing.
  //
  // The results are CAPPED. Eight rows is what the panel can show without pushing the
  // navigation groups under it off the first screen, and the heading says how many matched
  // when there are more — a palette that silently truncates is a palette that lies about
  // what the account holds. Typing more narrows it; the ranking (name before second line,
  // whole word before mid-word) is what makes the first eight the right eight.
  const RESULT_LIMIT = 8

  // WHAT THE READER HAS TYPED, mirrored out of the palette. `CommandMenu.Input` owns the
  // query — it writes it straight into the palette's own context — and the root exposes no
  // `v-model:query`, so the listener below is how this component learns it: Vue merges a
  // consumer's `@update:model-value` with the field's own handler, so both run.
  //
  // It is what decides which groups are on screen at all: the trail at rest, the results
  // once there is something to search for. Never both — a recent resource that also
  // matches would otherwise be two rows carrying the same value, and the palette's roving
  // highlight keys on that value.
  const paletteQuery = ref('')
  const onPaletteQuery = (value) => {
    paletteQuery.value = String(value ?? '')
  }

  // The palette clears its own query when it opens (and never on close), so the mirror
  // follows it there rather than guessing.
  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })

  const searchResults = computed(() => searchPlatform(paletteQuery.value, RESULT_LIMIT))

  // "Resources" while it is showing all of them; "Resources · 8 of 34" while it is not.
  const resultsHeading = computed(() => {
    const { rows, total } = searchResults.value
    return total > rows.length ? `Resources · ${rows.length} of ${total}` : 'Resources'
  })

  // ── THE PALETTE'S RECENTS: THREE, AND THE PALETTE'S OWN NUMBER ──
  //
  // The trail the reader is most likely to be after, at the head of the list — off the
  // SAME index the search reads, so the trail spans the whole platform too: "what was I
  // just working on" is never a question about four types, and the palette's recents used
  // to be Overview's four (applications, workloads, domains, functions) purely because
  // that was the only normalized list there was.
  //
  // THREE, WHERE OVERVIEW SHOWS FIVE. The panel is a page's column, read on arrival with
  // the whole viewport to itself; this list opens OVER whatever the reader is doing, and
  // everything under it — the navigation tree, the actions, the account — is what the
  // palette is otherwise for. Five rows of trail push the first navigation heading off
  // the first screen, so the palette pays for the trail in the one currency it is short
  // of. It is the same question answered at two budgets, which is why the count lives on
  // each surface rather than in the module they share.
  const PALETTE_RECENTS = 3

  // Newest first, across every type. A resource is only indexed when it GOES somewhere
  // (../../lib/data/search-index.js), so every row here navigates.
  //
  // A row with no timestamp is not a recent one — a team carries no `modifiedAt`, and
  // three teams standing in for a trail is exactly what the sample's EMPTY account would
  // show (teams are an account resource, so they survive a projection that empties every
  // module). No trail is the honest answer there; the group hides itself.
  const recentRows = computed(() =>
    platformResources()
      .filter((row) => row.modifiedAt)
      .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))
      .slice(0, PALETTE_RECENTS)
  )

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

  // The row a container stands for: the first leaf inside it. `Menu` emits `navigate` only from
  // a row that HAS an `href`, and no container in this rail carries one — so nothing reaches
  // this today and `Settings` opens its level without moving the page. It stays because it is
  // the resolution any container-as-destination needs: the shell highlights whatever id it is
  // given, and lighting the container would mark a row that is not a page. Give `Settings` an
  // `href` and this is what makes the arrival land on `General` rather than on the container.
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

  // ── WHICH GROUPS SURVIVE THE QUERY ──
  //
  // The palette filters each item itself and hides a group whose items are all gone — but
  // a SEPARATOR has no items, so it survives every query and leaves a rule under the last
  // surviving group with nothing after it. Search makes that visible constantly: most
  // queries match resources and nothing else, so the panel ended on a stray line.
  //
  // So the shell asks the same question the palette asks, with the palette's own rule (a
  // case-insensitive substring of `value` + the row's text), and renders a separator only
  // when there is something on both sides of it.
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

  // CommandMenu emits (event, value). Values are namespaced (`nav:` / `cmd:` / `res:`) so
  // a nav id can never collide with a command id or a resource id — the console has both
  // a `home` nav item and a `home` account entry, and a resource id is a number from a
  // fixture. The palette closes itself on select.
  //
  // A resource value carries the index KEY (`res:certificates/cert-8801`), which is unique
  // across types — two modules do seed the same numeric id — and is resolved against the
  // whole index rather than against whichever group rendered the row, so the trail and the
  // search results route through one line.
  const onPaletteSelect = (event, value) => {
    const raw = String(value)
    const separator = raw.indexOf(':')
    const scope = raw.slice(0, separator)
    const id = raw.slice(separator + 1)
    if (scope === 'res') {
      const row = platformResources().find((entry) => entry.key === id)
      // The MODULE's nav id, not the resource's: the rail marks `Workloads` and the router
      // lands on the workload, which is exactly what a click in the module list does. The
      // `query` is what a settings page opens on — every module's own Edit action hands
      // over the same name (../../lib/data/search-index.js).
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
      <!-- THE PULL. `-m-(--spacing-md)` cancels the DS header region's own inset, and
             every block below re-declares the one it wants. It is here because the LINE
             under the brand has to be FULL BLEED and land on an exact pixel, and a border
             drawn inside the padded box can be neither: it would stop 16px short of both
             rail edges, and the region's own bottom padding would push it 16px below the
             bar's. `Sidebar` renders that region itself and it takes no class, so the pull
             is the only way at it — the same move RealTimeEvents.vue uses to bleed a table
             out of a padded panel. -->
      <div class="-m-(--spacing-md) flex flex-col">
        <!-- THE BRAND BAND — the rail's half of the header line.

             `h-14` is `GlobalHeader`'s own height and `border-b border-(--border-default)`
             its own bottom border (webkit's global-header.vue). There is no token for the
             bar's height, so the number is stated here as the literal the DS uses; if the
             bar ever changes height this band has to follow it in the same commit.

             Both boxes start at the top of the window and both are 56 tall with the border
             INSIDE (border-box), so the rail's 1px and the bar's 1px are the same pixel
             row: one rule across the full width of the window, and the rail's top reads as
             a block rather than as navigation that happens to start high. Measured at
             1440×900: bar 0→56, band 0→56, both lines at y 55→56, band 0→300 across.

             The inset comes back as `px-(--spacing-md)`, so the brand sits exactly where
             it did before the pull.

             THE BRAND, at the top of the rail — where Cloudflare's console puts its own
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

        <!-- Identity, now UNDER the line — the rail still reads outermost-inward (whose
             product this is, then which tenant you are acting as, then the tree itself),
             but the band above it belongs to the header now: anything else in it would
             push the line off the bar's. So the switcher opens the navigation column
             instead, in its own inset, still fixed while the tree below scrolls. It is a
             full-width row here (`fluid`) so it reads as part of the header block rather
             than as a control dropped above the nav. -->
        <div
          v-if="tenancy"
          class="p-(--spacing-md)"
        >
          <AccountSwitcher fluid />
        </div>

        <!-- The palette: the reader's RECENT RESOURCES first, then the rail's
               navigation groups (same labels, same order), then the app-level commands.
               Groups whose items are all filtered out hide themselves. Only the copy
               that OWNS it renders it (see the `palette` prop) — one palette per app,
               never one per copy. It renders here because the LIST is here, not because
               the trigger is: the trigger is the bar's centre control. -->
        <CommandMenu
          v-if="palette"
          v-model:open="paletteOpen"
          :shortcut="shortcut"
          @select="onPaletteSelect"
        >
          <!-- The field the palette owns. `@update:model-value` rides alongside the
               palette's own handler (Vue merges both) so this component can mirror the
               query — see `paletteQuery`. The placeholder says what the palette actually
               reaches now that it reaches everything; the trigger in the bar carries the
               short form (`Search`), because at 160px that is all that fits
               (@shared/ui/HeaderSearch.vue). -->
          <CommandMenu.Input
            placeholder="Search resources, pages and commands"
            @update:model-value="onPaletteQuery"
          />
          <CommandMenu.List>
            <!-- ── RESULTS, WHILE THERE IS SOMETHING TO SEARCH FOR ──
                 Every resource the account owns, across sixteen types
                 (../../lib/data/search-index.js) — ranked, capped at eight, and mounted
                 ONLY while the reader is typing. Mounting the index at rest would bury the
                 navigation groups under a hundred rows nobody asked for; mounting it on
                 the query costs one group appearing, and the palette roves in DOM order,
                 so a group that mounts late still leads the list it renders at the top of.

                 The row is icon + name + why-it-matched + type. The second line is the
                 module list's own (a workload's domain, a connector's address, a
                 certificate's subject), so the reader can see WHICH `api-primary` this is
                 instead of guessing from a bare name.

                 The row's whole `haystack` is rendered hidden because `CommandMenu.Item`
                 filters itself on its own text: a row matched on its subtitle or its type
                 would otherwise be matched by the index and then hidden by the palette,
                 leaving a count with nothing under it. `aria-hidden` keeps it out of the
                 accessibility tree — it is a search key, not content. -->
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

            <!-- ── RECENTS, AT THE HEAD OF THE LIST AT REST ──
                 Three rows (`PALETTE_RECENTS`), where Overview's own panel shows five:
                 this list opens over the page the reader is working on and everything
                 below it is what the palette is otherwise for, so the trail gets the
                 shortest honest answer rather than the fullest one.
                 It leads because it is the likeliest target — a reader who opens ⌘K
                 while working is more often going back to a resource than to a module —
                 and because a group that appears BELOW the navigation tree is a group
                 the reader has to scroll to find at rest.
                 It gives way to the RESULTS the moment there is a query: a recent that
                 also matches would be two rows carrying one value, and the roving
                 highlight keys on that value.
                 The row is icon + name + type: the icon is the type's own glyph, the
                 same one the rail and the module lists use, and the muted suffix names
                 the type in words because sixteen glyphs at 14px are not sixteen words. -->
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
                <!-- Gated, not always supplied: a drilled level's rows are icon-less by
                     design (the Settings level), and an unconditional `#prefix` would hand
                     the Item an empty glyph — which counts as a prefix, so the row would
                     carry the 16px box and its indent for nothing. -->
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

            <!-- The rule between the destinations above and the app's own commands —
                 rendered only when there is something on both sides of it. -->
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
      <!-- Data-driven mode: `navGroups` is already the tree shape Menu takes, and
             hand-composing it would mean re-implementing the recursion here.
             `role="presentation"` because Sidebar already renders the <nav> landmark.

             THE MENU STARTS WHERE THE PAGE STARTS. `pt-(--layout-boundary-start)` is the
             SAME token the page's `.layout-boundary` reads for its own top inset, so the
             first nav row and the page's first block open on one horizontal — 24 below the
             header line at this width, 16 below `sm`, and whatever the token becomes next
             without a second number to keep in step. `Sidebar`'s scroll region ships
             `pt-(--spacing-xxs)` (4) whenever a header slot is present and takes no class
             from the consumer, so the 4 is pulled back off with `-mt-(--spacing-xxs)`
             first: 24 is then the whole distance, not 24 stacked on someone else's 4.
             Measured at 1440×900: first row 56 → 80, page's first block 56 → 80.

             It rides the fallback content, so a page that REPLACES this slot owns its own
             start inset — there is nothing between `Sidebar`'s scroll region and the slot
             to hang it on. -->
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
