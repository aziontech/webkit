# Console (`shells/console`)

> The application shell every signed-in page renders inside: a full-height navigation rail on the left that the user resizes by its edge and collapses from its foot (the product wordmark, the ⌘K palette with its Recents, navigation, Actions and Account groups, the navigation Menu with its grouped sections and drill-in levels, and the account menu with the theme switch, the Upgrade to Pro action and the system status at its foot) and a content zone on the right whose global header carries the breadcrumb on every level (one unlinked crumb on a first-level list, which opens on its controls row with no page heading), the search affordance, the Create button, the Agent button and the account avatar. The search is `SearchTrigger` (`collapsible`): the field with its ⌘K / Ctrl K keycap while the bar’s content box is at least `--container-2xl` wide and the magnifier below it; every state is framed by `AppLayout`, which measures its own width: below 768px it becomes compact, the rail moves into the layout's navigation drawer opened from the hamburger that leads the wordmark, and choosing an item closes it. First-level lists, detail pages with their tabs and Home all render inside it. Built from `AppLayout`, `PageTabs`, `Sidebar`, `Menu`, `Command`, `DropdownMenu`, `ThemeSwitcher`, `StatusIndicator`, `Avatar`, `GlobalHeader`, `Breadcrumb`, `Button`, `ButtonHighlight`, `IconButton`, `Tooltip`, `SearchTrigger` and, per page, `Tabs`, `Select`, `Tag`, `Input` and `Card`; the page bodies here are stand-ins, the real ones are the TableView and DetailsPage templates.

- Surface: product
- Source: `blocks/shells/console/console.vue` in `@aziontech/webkit`
- MCP: `get_pattern("shells/console")`
- Components: [Alert](../../components/alert.md), [AppLayout](../../components/app-layout.md), [Avatar](../../components/avatar.md), [Badge](../../components/badge.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [ButtonHighlight](../../components/button-highlight.md), [Card](../../components/card.md), [Command](../../components/command.md), [Dialog](../../components/dialog.md), `DialogClose`, `DialogContent`, `DialogDescription`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Menu](../../components/menu.md), [PageTabs](../../components/page-tabs.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [SearchTrigger](../../components/search-trigger.md), [Select](../../components/select.md), [Sidebar](../../components/sidebar.md), [StatusIndicator](../../components/status-indicator.md), [Table](../../components/table.md), `type`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [ThemeSwitcher](../../components/theme-switcher.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

platform shell; console shell; app shell; sidebar layout; navigation rail; dashboard layout; admin layout; app layout with sidebar; estrutura do console; layout com menu lateral; menu lateral; console; console layout; layout do console; notifications panel; notifications drawer; notification center; central de notificações; painel de notificações; switch account; account switcher; organization switcher; change organization; trocar conta; trocar organização; selecionar conta

The application shell every signed-in page renders inside, built on `AppLayout`. The user browses and moves laterally between modules, so the shell keeps the whole product one step away: a navigation rail on the left (wordmark, the ⌘K palette, the grouped navigation, the account menu) and a content zone on the right headed by one global header (search, Create, Agent, the avatar). Pages render only their own content in the zone; this block's page bodies are stand-ins for `platform/view/table-view` and `platform/detail/details-page`.

## When to use

- Every browse page: first-level lists, Home and dashboards, resource details with their tabs, settings.

## When not to use

- Create, edit and deploy flows: use the focused shell headed by `headers/creation-header`, with no rail.
- Signed-out screens: `platform/auth` with `headers/auth-header`.
- Documentation and marketing: `shells/documentation`, `shells/website`.

## Building blocks

### A. Rail — `Sidebar` (required)

Full height, `resizable` by its edge and `collapsible` from its foot, with labelled resize and collapse controls (`Resize sidebar`, `Collapse sidebar`, `Expand sidebar`). Header holds the wordmark and the palette, body the navigation, footer the account. While compact the same `Sidebar` renders inside the `AppLayout` navigation drawer (block S).

### B. Wordmark — `Brand` (required)

At the top of the rail and at the start of the header, each linked home with `aria-label="Azion home"`.

### C. Palette — `Command` (required)

The ⌘K palette: `Command.Input`, then Recents (only while the query is empty), the navigation groups, Actions and Account, separated by `Command.Separator`, and `Command.Empty` for no match. Opened from the header search and the shortcut.

### D. Navigation — `Menu` (required)

The grouped sections with drill-in levels and `Menu.Back`, driven by `groups` and `active-id`. The active item is the current module.

### E. Identity — `Avatar` (required)

Twice: in the rail footer next to the user's name, and in the header inside a button labelled `Account settings`. The user is never shown signed out, even with the rail collapsed.

### F. Account menu — `DropdownMenu` (required)

Opens upward from the rail footer: identity, then Account settings and Personal tokens, the theme, links out (Home page, Changelog, Feedback, Docs), Log out, and the Upgrade to Pro and system status foot.

### G. Hints — `Tooltip` (required)

Names every icon-only control: the account menu, the navigation trigger, the collapsed Create and Agent, the toolbar icons.

### H. Icon actions — `IconButton` (required)

The account menu trigger, the navigation trigger while compact, Create and Agent while compact, and the page toolbar (Refresh, Download CSV, Columns).

### I. Theme — `ThemeSwitcher` (required)

Inside the account menu, labelled `Theme`.

### J. Buttons — `Button` (required)

Upgrade to Pro (`secondary`) in the account menu; Create (`primary`) in the header while not compact; the page's own actions in the stand-in body.

### K. System status — `StatusIndicator` (required)

At the foot of the account menu: `All systems normal` with `success` severity; switch severity and label when the status page reports an incident.

### L. Header — `GlobalHeader` (required)

One header, inside the content zone (an `@container`), `aria-label="Console"`. The breadcrumb names the location on every level while not compact: one unlinked crumb on a first-level page, the module and the resource from the second level (see the DetailPage state).

### M. Search — `SearchTrigger` (required)

The header search, first in the end cluster: the field (`Search` with the ⌘K / Ctrl K keycap) while the bar is at least `--container-2xl` wide, the magnifier alone below that (`collapsible`, inside the header's `@container`). It emits `open` on click and on the shortcut and opens the `Command` palette. Never hand-rolled (rule `webkit-header-search`).

### N. Agent — `ButtonHighlight` (required)

The AI assistant entry in the header while not compact.

### O. Location — `Breadcrumb` (required)

In the header while not compact: `Resources` alone on the ListPage, with no link; module, resource and the environment `Select` on the DetailPage. A tab is never a crumb.

### P. Search field — `Input` (stand-in body)

The sample list's search, with a leading icon and an `aria-label`. The ListPage has no `PageHeader`: per `skills/webkit-navigation` the crumb names the first-level list and the page opens on its controls row, search and Filter on the start side, the toolbar icons, Documentation (outlined) and Create Resource (primary, large, the page's only large control) on the end side.

### Q. Table frame — `Card` (stand-in body)

Flush (`:padded="false"`), holding the table; the card is the only border.

### R. Frame — `AppLayout` (required)

Every state renders inside one `AppLayout`: the rail in `#navigation`, the header in `#header`, the page in the default slot (which scrolls on its own), flash messages in `#notifications` and the notifications list in `#tools`. The layout measures its own width, not the viewport's, so the shell turns compact in a narrow host (a split view, an embedded preview) the same way it does on a phone.

### S. Compact navigation — `AppLayout` navigation drawer (required below `compactBelow`)

While compact, `AppLayout` renders the same `Sidebar` inside its navigation drawer, named `Navigation`; the `#navigation` scope's `drawer` flag drops the rail-only resize and collapse controls there. The header scope's `compact` swaps the breadcrumb for the hamburger and wordmark and `openNavigation` opens the drawer. Choosing a `Menu` item calls `closeNavigation` from the `#navigation` scope, so the drawer closes on every navigation. No page composes its own `Drawer` for the rail.

## Do

- Compose this shell once in the app and render every browse page through its default slot.
- Keep the rail's navigation and the palette's navigation groups built from the same data.
- Keep exactly one `GlobalHeader` per page, inside the content zone.
- Apply the content inset once in the shell; pages never re-pad.

## Don't

- Don't render the rail on create, edit or deploy pages.
- Don't add page actions to the global header; they belong to the page's controls row or tab row.
- Don't hide the avatar when the rail is collapsed or in the drawer.
- Don't open the notifications region as a popover over the page; it is a region beside the content that the reader keeps open while working.

## Copy

- **Palette placeholder:** what can be searched: `Search resources, pages and commands`. **Empty:** a full sentence: `No resource, page or command matches your search.`
- **Navigation and menu items:** nouns as the module pages are titled, in sentence case (`Personal tokens`, `Activity history`, `Build and deployment`, `Account settings`); Azion product names keep theirs (`Edge DNS`). No ampersand.
- **Status:** a short state, not a sentence: `All systems normal`.
- **Header actions:** `Create`, `Agent`, `Search`.
- **Module create:** `Create` plus the entity, on the controls row: `Create Resource`.

## Accessibility

- The rail is a labelled navigation (`Main navigation`); its resize handle and collapse control have names and work by keyboard.
- ⌘K opens the palette and is announced with `aria-keyshortcuts="Meta+K"`; focus returns to the trigger on close.
- The drawer traps focus while open and returns it to the navigation trigger.
- Icon-only controls have both an `aria-label` and a tooltip.
- The bell is a toggle (`aria-pressed`) and names the unread count; unread items carry a visually hidden `Unread:` prefix, not colour alone.

## States

- ListPage: a first-level list page in the `AppLayout` default slot; the header carries the single unlinked `Resources` crumb and the page opens on its controls row.
- DetailPage: a resource detail page in the same `AppLayout` frame. The breadcrumb reads module, resource, then the environment as a small `Select` labelled `Switch environment` (a search `Input`, each environment tagged with its deployment policy, a muted line when nothing matches, Add Environment at its foot). The default slot holds one `main` with a full-bleed `PageTabs` (Overview, Deployments, Settings, the outlined Deploy in `#actions`) that stays in view while the tab content scrolls under it.
- Notifications: the bell opens the notifications region beside the content (a drawer when narrow), with unread items raised, Edit and Redeploy on each deploy, Mark all as read, Clear all, and the EmptyState once cleared; the failed deploy also shows as a flash Alert above the page. The flash sits in `#notifications` and the list in `#tools`, so both the rail and the list become drawers in a narrow host. The bell's `aria-label` carries the unread count and the `Badge` on it is hidden from assistive technology.
- AccountSwitch: the header starts with the current account (square `Avatar` with its initials, the name, a chevron), `Switch account (Ctrl+O)` on its tooltip and `aria-keyshortcuts`; while compact it shows the avatar and the chevron only (the name stays in its `aria-label`), and the wordmark hides when the header is narrower than `--container-sm`, so the header fits 320 px; it and the shortcut open a large `Dialog` with a search `Input` (name, ID or client ID) over a `Table` of the account tree: organizations, groups and workspaces indented by depth, expand and collapse buttons with `aria-expanded`, each name a button that switches, `Current` on the active one, type as `Table.CellStatus`, ID and client ID as `Table.CellId`. Switching closes the dialog and toasts `Switched to <name>.` with the IDs; the footer shows the current account and Account settings. A search with no match shows Clear search.

## Related

- `headers/resource-header` — this shell's header on its own.
- `headers/creation-header` — the focused shell for create, edit and deploy.
- `platform/view/table-view`, `platform/detail/details-page`, `platform/dashboard/home-dashboard` — the real page bodies.

## Variants

- `ListPage` — primary (the code below)
- `DetailPage` — A resource detail page on `AppLayout`: the breadcrumb reads Resources, the resource, then its environment, whose last crumb is a Select that searches the resource’s environments, tags each with its deployment policy and offers Add Environment at its foot; a full-bleed Tabs bar under the header carries the Overview, Deployments and Settings tabs with the outlined Deploy action, and the content scrolls beneath it.
- `Notifications` — The same ListPage frame built on `AppLayout`: the bell in the header carries an unread `Badge` and opens the notifications region on the right (the tools region of the layout, a Drawer on a narrow screen), which lists deploys, invitations and alerts with Mark all as read and Clear all, and offers Edit and Redeploy on each deploy; a failed deploy also shows as a flash `Alert` above the page in the layout's notifications slot, and an empty list reads You are all caught up.
- `AccountSwitch` — The account switcher in the header (square Avatar, account name, Ctrl+O or ⌘O): a large Dialog with search over the organization, group and workspace tree (expand and collapse, type, ID and client ID), the current account marked, a toast on switch, and Account settings in the footer.

Each variant is the same screen in another state: `get_pattern("shells/console", { variant })`, or the file under `blocks/shells/console/variants/`.

## Code (`ListPage`)

```vue
<script setup lang="ts">
  import AppLayout from '@aziontech/webkit/app-layout'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Menu, { type MenuNode } from '@aziontech/webkit/menu'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

  interface NavNode extends Omit<MenuNode, 'children' | 'groups'> {
    path?: string
    query?: Record<string, string>
    children?: NavNode[]
    groups?: NavGroup[]
  }
  interface NavGroup {
    label?: string
    items: NavNode[]
  }

  const navGroups: NavGroup[] = [
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

  const activeId = ref('resources')
  const paletteOpen = ref(false)
  const paletteQuery = ref('')
  const theme = ref<ThemeSwitcherValue>('system')
  const railWidth = ref<number | null>(null)
  const railCollapsed = ref(false)
  const search = ref('')
  const crumbs = [{ label: 'Resources' }]

  watch(paletteOpen, () => {
    paletteQuery.value = ''
  })

  const leaves = (items: NavNode[]): NavNode[] =>
    items.flatMap((item) =>
      item.groups
        ? leaves(item.groups.flatMap((group) => group.items))
        : item.children
          ? leaves(item.children)
          : [item]
    )

  const paletteGroups = navGroups.flatMap((group, groupIndex) => {
    const blocks: { key: string; heading: string; items: NavNode[] }[] = []
    let run: NavNode[] = []
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

  const onNavigate = (node: MenuNode, closeNavigation: () => void) => {
    activeId.value = node.id
    closeNavigation()
  }

  const onPaletteSelect = (_event: Event, value: string | number) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'nav') activeId.value = id
    if (scope === 'res') {
      activeId.value = recentRows.find((row) => row.key === id)?.navId ?? activeId.value
    }
    if (id === 'theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
    if (id === 'sidebar') railCollapsed.value = !railCollapsed.value
  }
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
                  @update:model-value="(value: string) => (paletteQuery = value)"
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
              @navigate="(_event, node) => onNavigate(node, closeNavigation)"
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
                      ariaLabel="Account menu"
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
                      ariaLabel="Open navigation"
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
              <SearchTrigger
                collapsible
                @open="paletteOpen = true"
              />

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
                    ariaLabel="Create"
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
                    ariaLabel="Agent"
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

      <div class="layout-boundary animate-page-enter motion-reduce:animate-none">
        <main class="layout-column flex min-h-full flex-col">
          <section class="flex min-w-0 flex-col gap-(--layout-section-gap)">
            <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex flex-wrap items-center gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
                  <Button
                    label="Filter"
                    kind="outlined"
                    size="medium"
                    icon="pi pi-filter"
                  />
                  <div class="flex min-w-36 grow basis-(--container-2xs)">
                    <Input
                      v-model="search"
                      size="medium"
                      placeholder="Search resources"
                      aria-label="Search resources"
                      class="w-full"
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </div>
                </div>
                <div class="flex flex-wrap items-center gap-(--spacing-xs)">
                  <Tooltip
                    text="Refresh"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="pi pi-refresh"
                      kind="outlined"
                      size="medium"
                      ariaLabel="Refresh"
                    />
                  </Tooltip>
                  <Tooltip
                    text="Download CSV"
                    class="shrink-0"
                  >
                    <IconButton
                      icon="pi pi-download"
                      kind="outlined"
                      size="medium"
                      ariaLabel="Download CSV"
                    />
                  </Tooltip>
                  <Tooltip text="Columns">
                    <IconButton
                      icon="ai ai-column"
                      kind="outlined"
                      size="medium"
                      ariaLabel="Columns"
                    />
                  </Tooltip>
                  <Button
                    label="Documentation"
                    icon="pi pi-book"
                    kind="outlined"
                    size="medium"
                    href="https://example.com/docs/resources"
                    target="_blank"
                  />
                  <Button
                    label="Create Resource"
                    icon="pi pi-plus"
                    kind="primary"
                    size="large"
                  />
                </div>
              </header>

              <section class="flex min-h-0 flex-col">
                <Card :padded="false">
                  <template #content>
                    <div
                      class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
                    >
                      Table
                    </div>
                  </template>
                </Card>
              </section>
            </section>
          </section>
        </main>
      </div>
    </AppLayout>
  </div>
</template>
```
