# HomeDashboard (`platform/dashboard/home-dashboard`)

> The whole Home page inside the platform shell, in both of its states. **Populated** (once the account owns a resource): a greeting heading, a usage band with four chartless StatTiles joined in one StatTileGroup card (each label explained in a Tooltip in the tile’s aside slot, each figure beside its unit and delta Tag) next to the dismissible agent onboarding card, and a five-column resources grid with the Projects, Resources, Domains and Recents panels, every row a full-width link with a hover-revealed actions DropdownMenu. **Empty** (a brand-new account): the first-access screen, a greeting under a centred headline, the command prompt that opens the shell’s palette on click or Enter, and the three doors (ship something new, add a domain with its availability check, onboard your agent). The first-access content on its own is the Onboarding template; while either screen arrives, the PageWires Overview and Onboarding wires hold the page. Built from `StatTileGroup`, `StatTile`, `Card`, `Tooltip`, `IconButton`, `Item`, `DropdownMenu`, `SearchTrigger`, `Popover`, `Spinner`, `Illustration`, `Button` and the agent marks from the webkit assets.

- Surface: product
- Source: `blocks/platform/dashboard/home-dashboard/home-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/home-dashboard")`
- Components: `claudeMark`, `codexMark`, `cursorMark`, `geminiMark`, [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Button](../../../components/button.md), [ButtonHighlight](../../../components/button-highlight.md), [Card](../../../components/card.md), [Command](../../../components/command.md), [Drawer](../../../components/drawer.md), `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, [DropdownMenu](../../../components/dropdown-menu.md), [GlobalHeader](../../../components/global-header.md), [IconButton](../../../components/icon-button.md), [Illustration](../../../components/illustration.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Menu](../../../components/menu.md), [Popover](../../../components/popover.md), [SearchTrigger](../../../components/search-trigger.md), [Sidebar](../../../components/sidebar.md), [Spinner](../../../components/spinner.md), [StatTile](../../../components/stat-tile.md), [StatTileGroup](../../../components/stat-tile-group.md), [StatusIndicator](../../../components/status-indicator.md), [ThemeSwitcher](../../../components/theme-switcher.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-layout`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

home; home page; home dashboard; console home; usage overview; página inicial; início do console; first access; home empty state; new account home; welcome screen; first run; brand-new account; getting started home; primeiro acesso; tela de boas-vindas; home vazia

The Console's Home page inside the platform shell: the first screen a signed-in user lands on. Its job
is to get them back to work fast. For an account that owns resources it shows a short usage band and
the resources they touch most (projects, resources, domains, recents), every row a link. For a
brand-new account it becomes the first-access screen: a greeting, the command prompt and three doors
to a first project, a first domain and a coding agent. It is not an analytics page; detail lives on
each resource's own dashboard.

## When to use

- The landing page after sign-in in the Console.
- The reader needs to resume work (open a recent resource) more than to analyse data.
- The same page must serve both a populated and a brand-new account.

## When not to use

- Analysing traffic or usage: use `platform/dashboard/analytics-dashboard` or
  `platform/dashboard/data-dashboard`.
- The empty first page of one resource list: use `platform/states/first-use`.
- Only the shell, with another page inside: use `shells/console`.
- A placeholder while Home loads: use the Overview and Onboarding wires of `platform/states/page-wires`.

## Building blocks

### A. Navigation rail — `Sidebar` (required)

The shell's rail with the navigation groups (Home, Projects, Deployments, …). On small screens it
moves into the navigation drawer (R–U). Collapse, expand and resize controls carry their own labels.

### B. Wordmark — `Brand` (required)

The product mark at the top of the rail and the header, inside a link labelled `Azion home`.

### C. Command palette — `Command` (required)

Opened from the rail search or ⌘K: `Search resources, pages and commands`, with `Recents`, the
navigation groups, `Actions` and `Account`. On a new account it is also what the Home prompt opens.

### D. Navigation — `Menu` (required)

The grouped navigation items inside the rail, and the account row at its foot. Each node's destination
is `href` (never `path`, which is the drill stack); `@navigate` calls `event.preventDefault()` on a
plain click and routes in the app, so the rows stay real links.

### E. Account identity — `Avatar` (required)

The user's initials in the account row and the header's account button.

### F. Account and row actions — `DropdownMenu` (required)

The account menu (`Account settings`, `Personal tokens`, theme, `Home page`, `Changelog`, `Feedback`,
`Docs`, `Log out`, `Upgrade to Pro`, system status) and, on each resource row, the hover-revealed
actions (`View details`, `Edit`, `Delete`).

### G. Control labels and metric definitions — `Tooltip` (required)

Names every icon-only control, and in each usage tile's aside slot explains the metric
(`Share of traffic served from cache instead of your origin.`). Also labels `Dismiss` on the agent card.

### H. Icon-only controls — `IconButton` (required)

Open navigation, search, row actions and dismiss. Each has an `aria-label` that names its target
(`Actions for my-app`, `Dismiss agent setup`).

### I. Theme — `ThemeSwitcher` (required)

Inside the account menu, labelled `Theme`.

### J. Create and upgrade — `Button` (required)

`Create` in the header, `Upgrade to Pro` in the account menu.

### K. System status — `StatusIndicator` (required)

`All systems normal` at the foot of the account menu, in words, with its status color.

### L. Top bar — `GlobalHeader` (required)

The header labelled `Console`: navigation toggle on small screens, wordmark, search, `Create`,
`Agent` and the account button.

### M. Search — `SearchTrigger` (required)

The header search, first in the end cluster: the field (`Search` with the ⌘K / Ctrl K keycap) while the bar is at least `--container-2xl` wide, the magnifier alone below that (`collapsible`, inside the header's `@container`). It emits `open` on click and on the shortcut and opens the `Command` palette. Never hand-rolled (rule `webkit-header-search`).

### N. Agent — `ButtonHighlight` (optional)

`Agent` in the header, the one emphasized entry to the coding agent. Only one highlighted button per
screen.

### O. Usage band — `StatTileGroup`, `StatTile` (required)

Four chartless tiles joined in one `StatTileGroup` card (the group draws the surface and the dividers),
in an aside labelled `Usage`, each with a numeric `value`, a unit and a numeric `delta`. Beside them,
the dismissible `Set up your coding agent` card. Home shows at most these four figures; the rest
belongs on a dashboard.

### P. Agent onboarding — `Card` (optional)

A whole-card button: the agent marks, `Set up your coding agent` and one sentence. A mono mark is a
CSS mask whose `url('…')` is quoted: the build inlines the SVG as a `data:` URI, and unquoted it breaks
the declaration and the mark renders as a solid square. Its dismiss
`IconButton` sits outside the button so the two actions never nest.

### Q. Resource rows — `Item` (required)

The `Projects`, `Resources`, `Domains` and `Recents` panels in a region labelled `Resources`. Every row
is one full-width link to the resource, with its actions menu revealed on hover and focus. An empty
panel says `Nothing here yet.` (`Nothing opened here yet.` for Recents).

### R. Navigation drawer — `Drawer` (required on small screens)

Holds the rail on narrow viewports, opened from the header's navigation toggle.

### S. Drawer layer — `DrawerPortal` (required with the drawer)

Renders the drawer at the document root so it stacks over the page.

### T. Drawer scrim — `DrawerOverlay` (required with the drawer)

Dims the page and closes the drawer on click.

### U. Drawer panel — `DrawerContent` (required with the drawer)

The labelled panel (`Navigation`) that contains the `Sidebar`.

## Do

- Greet by first name in a muted heading; it is the only personal line on the page.
- Make every resource row a single link with the actions menu as a separate control.
- Let the user dismiss the agent card for good.
- Show the first-access screen, not a grid of empty panels, when the account owns nothing.

## Don't

- Don't add charts to Home; link to the dashboard that has them.
- Don't put more than four usage tiles in the band.
- Don't hand-build the band's card, grid or dividers around the tiles; `StatTileGroup` draws them.
- Don't pass figures as strings or flags as `'true'` / `'false'`: a tile's `value` and `delta` are
  numbers, and the string `'false'` is truthy.
- Don't nest the dismiss button inside the card's button.
- Don't show a second highlighted button next to `Agent`.

## Copy

- **Greeting:** time of day and first name. `Good morning, Alex`.
- **Tile labels:** the metric in sentence case. `Data transferred`, `Requests per second`.
- **Tile tooltips:** one sentence with a period. `Total bytes delivered across all your resources.`
- **Agent card:** imperative title plus one sentence. `Set up your coding agent` / `Give your editor a prompt that teaches it to build and deploy here.`
- **Empty panel:** `Nothing here yet.`
- **Palette placeholder:** `Search resources, pages and commands`.

## Accessibility

- The header is labelled `Console`, the rail `Main navigation`, the usage band `Usage`, the panels `Resources`, the drawer `Navigation`.
- Every icon-only control has an `aria-label` and a `Tooltip`.
- Row actions are reachable by keyboard: the menu trigger appears on focus as well as hover.
- The command palette opens with ⌘K and from the search affordance; the shortcut is shown by `SearchTrigger`.
- Entrance animations and the card's dismiss transition honour `prefers-reduced-motion`.

## States

- Default: populated Home for an account that owns resources (usage band, agent card, resource panels).
- Empty: a brand-new account; the first-access screen with the greeting, the command prompt that opens the palette, and the three doors (create a project, add a domain with an availability check, set up an agent).

## Related

- `shells/console` — the shell Home renders inside.
- `platform/states/page-wires` — the Overview and Onboarding wires that hold Home while it loads.
- `platform/states/first-use` — the first-use state of one resource list.
- `platform/dashboard/analytics-dashboard` — where usage detail lives.

## Variants

- `Default` — primary (the code below)
- `Empty` — Home for a brand-new account: the first-access screen in the shell. Click the prompt (or press Enter on it) to open the command palette; type a domain such as example.com (taken) or my-new-site.dev (available) into the second door to run the availability check.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/home-dashboard", { variant })`, or the file under `blocks/platform/dashboard/home-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup>
  import claudeMark from '@aziontech/webkit/assets/claude-symbol-color.svg'
  import codexMark from '@aziontech/webkit/assets/codex-symbol-mono.svg'
  import cursorMark from '@aziontech/webkit/assets/cursor-symbol-mono.svg'
  import geminiMark from '@aziontech/webkit/assets/gemini-symbol-color.svg'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import Menu from '@aziontech/webkit/menu'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatTile from '@aziontech/webkit/stat-tile'
  import StatTileGroup from '@aziontech/webkit/stat-tile-group'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

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

  const activeId = ref('home')
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
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.button > 0
    if (node.href && !modified) event.preventDefault()
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

  const metrics = [
    {
      label: 'Data transferred',
      value: 842,
      unit: 'GB',
      delta: 12.4,
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      label: 'Requests per second',
      value: 1240,
      unit: '/s',
      delta: 3.8,
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      label: 'Bandwidth saving',
      value: 588,
      unit: 'GB',
      delta: 6.2,
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      label: 'Data offload',
      value: 70,
      unit: '%',
      delta: -1.5,
      hint: 'Share of traffic served from cache instead of your origin.'
    }
  ]

  const panels = [
    {
      key: 'projects',
      label: 'Projects',
      path: '/projects',
      recent: false,
      marked: true,
      resources: [
        {
          id: '4410203040',
          type: 'projects',
          typeLabel: 'Project',
          name: 'marketing-site',
          presetIcon: 'ai-cor ai-astro',
          presetLabel: 'Astro'
        },
        {
          id: '6630405070',
          type: 'projects',
          typeLabel: 'Project',
          name: 'docs-site',
          presetIcon: 'ai-cor ai-next',
          presetLabel: 'Next.js'
        },
        {
          id: '5520304060',
          type: 'projects',
          typeLabel: 'Project',
          name: 'black-friday-2026',
          presetIcon: 'ai-cor ai-next',
          presetLabel: 'Next.js'
        },
        {
          id: '2041778390',
          type: 'projects',
          typeLabel: 'Project',
          name: 'hello-world',
          presetIcon: 'ai-cor ai-js',
          presetLabel: 'JavaScript'
        },
        {
          id: '1784552864',
          type: 'projects',
          typeLabel: 'Project',
          name: 'web-app',
          presetIcon: 'ai-cor ai-vue',
          presetLabel: 'Vue'
        }
      ]
    },
    {
      key: 'resources',
      label: 'Resources',
      path: '/resources',
      recent: false,
      marked: false,
      resources: [
        { id: '1020655', type: 'resources', typeLabel: 'Resource', name: 'resource-01' },
        { id: '1031410003', type: 'resources', typeLabel: 'Resource', name: 'resource-02' },
        { id: '1031410001', type: 'resources', typeLabel: 'Resource', name: 'resource-03' }
      ]
    },
    {
      key: 'domains',
      label: 'Domains',
      path: '',
      recent: false,
      marked: false,
      resources: [
        { id: 'domain-1020655', type: 'domains', typeLabel: 'Domain', name: 'app.example.com' },
        {
          id: 'domain-1031410003',
          type: 'domains',
          typeLabel: 'Domain',
          name: '*.preview.example.com'
        },
        { id: 'domain-1031410001', type: 'domains', typeLabel: 'Domain', name: 'www.example.com' },
        { id: 'domain-1031410002', type: 'domains', typeLabel: 'Domain', name: 'api.example.com' }
      ]
    },
    {
      key: 'recents',
      label: 'Recents',
      path: '',
      recent: true,
      marked: false,
      resources: [
        { id: '1020655', type: 'resources', typeLabel: 'Resource', name: 'resource-01' },
        { id: 'domain-1020655', type: 'domains', typeLabel: 'Domain', name: 'app.example.com' },
        {
          id: '4410203040',
          type: 'projects',
          typeLabel: 'Project',
          name: 'marketing-site',
          presetIcon: 'ai-cor ai-astro',
          presetLabel: 'Astro'
        },
        {
          id: '6630405070',
          type: 'projects',
          typeLabel: 'Project',
          name: 'docs-site',
          presetIcon: 'ai-cor ai-next',
          presetLabel: 'Next.js'
        },
        {
          id: '5520304060',
          type: 'projects',
          typeLabel: 'Project',
          name: 'black-friday-2026',
          presetIcon: 'ai-cor ai-next',
          presetLabel: 'Next.js'
        }
      ]
    }
  ]

  const agentMarks = [
    { name: 'claude', src: claudeMark, mono: false },
    { name: 'codex', src: codexMark, mono: true },
    { name: 'gemini', src: geminiMark, mono: false },
    { name: 'cursor', src: cursorMark, mono: true }
  ]

  const agentOnboardingVisible = ref(true)
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
        <div
          class="layout-column layout-boundary relative flex min-h-full flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start"
        >
          <header class="flex items-center">
            <h1 class="text-heading-sm text-(--text-muted)">
              Good morning,
              <span class="text-(--text-default)">Alex</span>
            </h1>
          </header>

          <main
            class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
          >
            <aside
              class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
              aria-label="Usage"
            >
              <div class="min-w-0 xl:flex-1">
                <StatTileGroup>
                  <StatTile
                    v-for="metric in metrics"
                    :key="metric.label"
                    :label="metric.label"
                    :value="metric.value"
                    :unit="metric.unit"
                    :delta="metric.delta"
                  >
                    <template #aside>
                      <Tooltip :text="metric.hint">
                        <i
                          class="pi pi-info-circle text-body-sm text-(--text-muted)"
                          aria-hidden="true"
                        />
                      </Tooltip>
                    </template>
                  </StatTile>
                </StatTileGroup>
              </div>

              <Transition
                leave-active-class="transition-[scale,translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
                leave-to-class="scale-95 translate-y-(--spacing-xs) opacity-0"
              >
                <div
                  v-if="agentOnboardingVisible"
                  class="relative w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)"
                >
                  <Card
                    :padded="false"
                    class="w-full"
                  >
                    <template #content>
                      <button
                        type="button"
                        class="group relative flex h-full w-full flex-col items-start gap-(--spacing-md) rounded-(--shape-card) p-(--spacing-md) text-start transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
                      >
                        <span
                          class="flex items-center [&>*+*]:-ms-2 [&>*+*]:transition-[margin-left] [&>*+*]:duration-moderate-01 [&>*+*]:ease-productive-entrance group-hover:[&>*+*]:-ms-1.5 group-focus-visible:[&>*+*]:-ms-1.5 motion-reduce:[&>*+*]:transition-none"
                          aria-hidden="true"
                        >
                          <span
                            v-for="agent in agentMarks"
                            :key="agent.name"
                            class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <span
                              v-if="agent.mono"
                              class="size-(--size-4) shrink-0 bg-current text-(--text-default) mask-(--agent-mark) mask-contain mask-center mask-no-repeat"
                              :style="{ '--agent-mark': `url('${agent.src}')` }"
                            />
                            <img
                              v-else
                              :src="agent.src"
                              alt=""
                              class="size-(--size-4) shrink-0"
                            />
                          </span>
                        </span>

                        <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                          <span class="text-heading-xxs text-(--text-default)"
                            >Set up your coding agent</span
                          >
                          <span class="text-pretty text-body-sm text-(--text-muted)"
                            >Give your editor a prompt that teaches it to build and deploy
                            here.</span
                          >
                        </span>
                      </button>
                    </template>
                  </Card>
                  <div class="absolute end-(--spacing-xs) top-(--spacing-xs)">
                    <Tooltip
                      text="Dismiss"
                      placement="top"
                    >
                      <IconButton
                        icon="pi pi-times"
                        kind="transparent"
                        size="small"
                        aria-label="Dismiss agent setup"
                        @click="agentOnboardingVisible = false"
                      />
                    </Tooltip>
                  </div>
                </div>
              </Transition>
            </aside>

            <section
              class="animate-content-enter motion-reduce:animate-none mt-(--spacing-lg) grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap) [--content-enter-delay:var(--transition-duration-fast-01)]"
              aria-label="Resources"
            >
              <div
                v-for="panel in panels"
                :key="panel.key"
                class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
                :class="panel.recent ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
              >
                <h2
                  class="flex min-h-(--size-6) items-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
                >
                  <span
                    v-if="panel.marked || panel.recent"
                    class="shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    v-if="panel.path"
                    :href="panel.path"
                    class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                  >
                    {{ panel.label }}
                    <i
                      class="pi pi-chevron-right text-body-xs leading-none text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </a>
                  <span v-else>{{ panel.label }}</span>
                </h2>

                <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
                  <Item.List
                    v-if="panel.resources.length"
                    key="panel-rows"
                  >
                    <Item
                      v-for="resource in panel.resources"
                      :key="resource.type + '-' + resource.id"
                      role="listitem"
                      size="small"
                    >
                      <Item.Content>
                        <Item.Title class="w-full">
                          <template v-if="panel.recent">
                            <span
                              class="flex shrink-0 items-center justify-center"
                              aria-hidden="true"
                            >
                              <i
                                class="pi pi-history text-body-xs leading-none text-(--text-muted)"
                              />
                            </span>
                            <span
                              class="min-w-(--size-24) shrink-0 text-body-sm text-(--text-muted)"
                              >{{ resource.typeLabel }} /</span
                            >
                          </template>

                          <span
                            v-else-if="panel.marked"
                            class="flex shrink-0 items-center justify-center"
                            aria-hidden="true"
                          >
                            <i
                              v-if="resource.presetIcon"
                              :class="resource.presetIcon"
                              class="text-body-lg leading-none"
                              :title="resource.presetLabel"
                            />
                          </span>
                          <button
                            type="button"
                            data-row-link
                            class="min-w-0 cursor-pointer truncate text-start text-label-md text-(--text-default) outline-none group-hover/item:underline focus-visible:underline after:absolute after:inset-0 after:content-['']"
                          >
                            {{ resource.name }}
                          </button>
                        </Item.Title>
                      </Item.Content>

                      <div class="relative z-10 grid size-(--size-7) place-items-center">
                        <Item.Actions class="w-full">
                          <div
                            class="col-start-1 row-start-1 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-100 group-focus-within/item:opacity-100"
                          >
                            <DropdownMenu placement="bottom-end">
                              <DropdownMenu.Trigger>
                                <Tooltip text="Resource actions">
                                  <IconButton
                                    icon="pi pi-ellipsis-h"
                                    kind="transparent"
                                    size="small"
                                    :aria-label="'Actions for ' + resource.name"
                                  />
                                </Tooltip>
                              </DropdownMenu.Trigger>

                              <DropdownMenu.Group>
                                <DropdownMenu.Option
                                  value="view"
                                  label="View details"
                                />
                                <DropdownMenu.Option
                                  value="edit"
                                  label="Edit"
                                />
                              </DropdownMenu.Group>

                              <DropdownMenu.Group>
                                <DropdownMenu.Option
                                  value="delete"
                                  label="Delete"
                                >
                                  <template #left>
                                    <i
                                      class="pi pi-trash"
                                      aria-hidden="true"
                                    />
                                  </template>
                                </DropdownMenu.Option>
                              </DropdownMenu.Group>
                            </DropdownMenu>
                          </div>

                          <i
                            class="pi pi-chevron-right col-start-1 row-start-1 shrink-0 text-body-xs text-(--text-muted) transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-0 group-focus-within/item:opacity-0"
                            aria-hidden="true"
                          />
                        </Item.Actions>
                      </div>
                    </Item>
                  </Item.List>

                  <p
                    v-else
                    class="px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                  >
                    {{ panel.recent ? 'Nothing opened here yet.' : 'Nothing here yet.' }}
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
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
```
