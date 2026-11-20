# ShellConsole (`shell/shell-console`)

> The console shell as one component: `ConsoleLayout`, composed once in the app around RouterView, so a console page is only its body. Its `navigation` is the Azion console tree as data (Overview, Workloads, Deployments; Build, Secure, Store, Observe; Marketplace and the Settings drill-in), each row with an `href` the layout follows with the app's router, and the active row follows the route; it renders the resizable, collapsible rail with the wordmark and the account at its foot, the header with breadcrumbs, the search trigger, the app's actions and the avatar, the ⌘K palette listing every navigation page, and the single main. Below 768 px of its own width the rail becomes a drawer opened from the header's menu button. This block fills the slots: Create (`Button`) and Agent (`HighlightButton`), icon-only (`IconButton` with a `Tooltip`) while compact; Recents and Actions as `Command` groups; the account menu (`DropdownMenu` whose theme choice is a group of radio items and Upgrade to Pro an item, over a `StatusIndicator`). The body is a stand-in list page (`PageHeader` and a `Card`) for view/view-table, which owns the controls row and the table; a page opens the same palette with useConsoleLayout().openSearch(). The shell mounts the app's one `Toaster`, and the other states render it and fill its slots (the body, `actions`, `sidebar-header`, `header-leading`, `notifications`, `tools`, with `v-model:tools-open`) instead of copying it.

- Surface: app
- Source: `blocks/shell/shell-console/shell-console.vue` in `@aziontech/webkit`
- MCP: `get_block("shell/shell-console")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Badge](../../components/badge.md), [Button](../../components/button.md), [Card](../../components/card.md), [Command](../../components/command.md), [ConsoleLayout](../../components/console-layout.md), `ConsoleLayoutRoot`, [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [HighlightButton](../../components/highlight-button.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Select](../../components/select.md), [StatusIndicator](../../components/status-indicator.md), `TableCellId`, `TableCellStatus`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-color-mode`
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

platform shell; console shell; app shell; sidebar layout; navigation rail; dashboard layout; admin layout; app layout with sidebar; estrutura do console; layout com menu lateral; menu lateral; console; console layout; layout do console; notifications panel; notifications drawer; notification center; central de notificações; painel de notificações; switch account; account switcher; organization switcher; change organization; trocar conta; trocar organização; selecionar conta; console layout component; ConsoleLayout; app layout with router view; layout do console com RouterView; account list failed to load; switch account error; erro ao carregar contas

The application shell every signed-in page renders inside. The user browses and moves laterally between modules, so the shell keeps the whole product one step away: the navigation rail (wordmark, grouped navigation with drill-in levels, the account at its foot), one global header (breadcrumbs, search, the app's actions, the avatar) and the ⌘K palette. All of that is one component, `ConsoleLayout`: this block is the app's `App.vue` — compose it once around `RouterView` and every console page is only the body rendered through its default slot. The body here is a stand-in for `view/view-table`.

## When to use

- The root of a console app: every browse page (first-level lists, Home and dashboards, resource details with their tabs, settings) renders inside it.

## When not to use

- Create, edit and deploy flows: use the focused shell headed by `top-bar/top-bar-creation`, with no rail.
- Signed-out screens: `auth/auth-sign-in` with `top-bar/top-bar-auth`.
- Documentation and marketing: `shell/shell-docs`, `shell/shell-site`.
- A page needing the resizable split panel: compose `AppLayout` directly for that page.

## Building blocks

### A. Shell — `ConsoleLayoutRoot` (required)

Composed once in `App.vue` around `RouterView` (imported from `console-layout-root` and bound as `ConsoleLayoutRoot`, the PascalCase of the path, since the root has no dot-notation parts; a page that renders `ConsoleLayout.Breadcrumb`, as DetailPage does, imports the compound `console-layout` instead). `navigation` is the console tree as data: groups of rows `{ id, label, icon, href }` (an in-app `href` is followed with the app's router, an external one loads normally; `type: 'drill'` with `groups` for Settings; `tagValue` for a `Preview` badge). The active row follows the current route; leave `active-id` empty in the app (this block sets it only because its preview has no router). `breadcrumbs` takes a static trail from the route meta (`{ label, href? }`, the last crumb, the current page, without `href`; empty on a first-level page); a page that owns its trail renders `ConsoleLayout.Breadcrumb` instead, and a workspace page puts `data-layout-fill` on its root. `account` is the signed-in user. The layout renders the rail (resizable and collapsible, a drawer below 768 px of its own width), the header, the `SearchTrigger` wired to the ⌘K `Command` palette (every navigation page is listed), the avatar, and the single `<main>`; a page opens the same palette with `useConsoleLayout().openSearch()`.

### B. Actions — `Button` (required)

In the `actions` slot: Create (`primary`, `medium`, with its icon) while not compact. In the page body: Documentation (`outline`) and the create action, and Upgrade to Pro as an item of the account menu.

### C. Agent — `HighlightButton` (required)

The AI assistant entry in the `actions` slot, after Create, while not compact.

### D. Hints — `Tooltip` (required)

Names every icon-only control: the compact Create and Agent, and the bell.

### E. Icon actions — `IconButton` (required)

Create and Agent while the `actions` slot's `compact` is true; the bell in Notifications.

### F. Palette groups — `Command` (required)

In the `search` slot: Recents (only while the query is empty) and Actions, as `Command.Group`s of `Command.Item`s; their selection arrives as `search-select`. The navigation pages are added by the layout.

### G. Account menu — `DropdownMenu` (required)

In the `account-menu` slot, as `DropdownMenu.Group`s: identity, Account settings and Personal tokens, the theme, Docs, Log out, and the Upgrade to Pro item over the system status foot. Every control in it is a `DropdownMenu.Item`, so the arrow keys reach all of them: a button or a segmented control inside a menu is skipped by the arrows and breaks the menu pattern. The layout opens it from the rail footer and from the header avatar. The layout emits `account-select` `(event, value)` for each item; the block answers `logout` by emitting `sign-out` `(event)`, sets the theme on `theme:system`, `theme:dark` and `theme:light`, and clears nothing itself.

### H. Theme — `DropdownMenu.Item` radios (required)

Inside the account menu, a `DropdownMenu.Group` labelled `Theme` with three `type="radio"` items, System, Dark and Light, bound to `useColorMode()`. Not a `ThemeSwitcher`: its buttons are not menu items, so the keyboard cannot reach them inside the menu.

### I. System status — `StatusIndicator` (required)

At the foot of the account menu: `All systems operational` with `success` severity; switch severity and label when the status page reports an incident.

### J. Page title — `PageHeader` (stand-in body)

The list page's title and description, with Documentation and the create action in its `actions` slot.

### K. Table frame — `Card` (stand-in body)

Flush (`:padded="false"`), standing in for the page body; the list page's controls row and table come from `view/view-table` (Table toolbar parts), never a hand-built row of buttons in the shell.

### L. Toast region — `Toaster` (required)

The app's one toast region, at `bottom-end`, mounted once by the shell because it is the app root. Pages and the other states only call `toast`; none renders a `Toaster` of its own.

## Data

`navigation`, `account` and the recents are the shell's own constants, which the app replaces with its navigation file and signed-in user. The states render the shell and fill its slots instead of copying it:

| Slot             | Scope         | What goes in it                                                               |
| ---------------- | ------------- | ----------------------------------------------------------------------------- |
| default          |               | The page body (`<RouterView />` in the app); a stand-in list page when empty. |
| `actions`        | `{ compact }` | Header actions after Create and Agent (the Notifications bell).               |
| `sidebar-header` | `{ compact }` | Content under the wordmark in the rail (the AccountSwitch switcher).          |
| `header-leading` | `{ compact }` | Content before the breadcrumbs in the header (the switcher while compact).    |
| `notifications`  |               | Flash messages above the page body.                                           |
| `tools`          |               | The tools region beside the content (the notification list).                  |

`v-model:tools-open` opens and closes the tools region, and `tools-label` names it. It emits one event:

| Event      | Payload   | When                                    |
| ---------- | --------- | --------------------------------------- |
| `sign-out` | `(event)` | Log out in the account menu was chosen. |

Handle it where the session lives: clear the token (`sessionStorage.removeItem`, the in-memory ref) and route to sign-in (`router.push('/login')`). When this block is the app's `App.vue`, there is no parent to listen, so either mount it with the handler (`createApp(App, { onSignOut })`) or render it from a thin `App.vue` (`<ConsoleShell @sign-out="signOut" />`). Never leave Log out as a menu item that does nothing.

## Do

- Compose `ConsoleLayoutRoot` once in `App.vue` and render every browse page through its default slot; replace this block's stand-in body with `<RouterView />`.
- Keep the navigation in one data file shared by the app; the rail and the palette both read it.
- Give every row an `href` (never `to` or `path`); derive a static `breadcrumbs` trail from the route.
- Let a detail page set its own trail, control crumb included, with `ConsoleLayout.Breadcrumb`.
- Frame a list or form body with `layout-boundary` + `layout-column`; open a detail body flush on `PageTabs`.

## Don't

- Don't render `AppLayout`, `Sidebar`, `AppHeader`, `SearchTrigger`, a `Command` palette or a `<main>` in a page; the layout owns them.
- Don't put a page's control crumb in `App.vue`, or size a body with `calc(100dvh - …)`.
- Don't render the rail on create, edit or deploy pages.
- Don't add page actions to the global header; they belong to the page's header, controls row or tab row.
- Don't hide the avatar when the rail is collapsed or in the drawer.
- Don't render the account switcher in both `sidebar-header` and `header-leading` at once; pick by the slots' `compact`.
- Don't leave an empty account table when the list fails to load; show the danger `Alert` with Retry in its place.
- Don't open the notifications region as a popover over the page; it is the layout's tools region beside the content.

## Copy

- **Palette groups:** `Recents`, `Actions`; the layout's placeholder `Search pages and commands` and its empty line come from the locale catalog.
- **Navigation and menu items:** nouns as the module pages are titled (`Personal tokens`, `Activity history`, `Build and deployment`, `Account settings`); Azion product names keep theirs (`Edge DNS`, `Real-Time Metrics`). No ampersand.
- **Status:** a short state, not a sentence: `All systems operational`.
- **Load failure:** what failed, as a sentence: `The account list could not be loaded.`; the action is `Retry`, the word every block uses (auth included).
- **Header actions:** `Create`, `Agent`.
- **Module create:** `Create` plus the entity: `Create Application`.

## Accessibility

- One `main` (the layout's), one `banner` (the header), the rail as a labelled navigation (`Main navigation`); the page body starts with its `h1` (`PageHeader`).
- ⌘K / Ctrl K opens the palette, announced through `aria-keyshortcuts` on the search; focus returns to the trigger on close.
- The rail's drawer traps focus while open, closes on `Escape` and when a row is chosen, and returns focus to the menu button.
- Icon-only controls have both an `aria-label` and a tooltip.
- The bell is a toggle (`aria-pressed`) and names the unread count; unread items carry a visually hidden `Unread:` prefix, not colour alone.

## States

- ListPage: a first-level list page in the `ConsoleLayout` default slot: no breadcrumb on a first level, the page opens on its `PageHeader` (title, description, Documentation and the create action) over the page body. The controls row and the table belong to `view/view-table`, which builds them from the Table toolbar parts; the shell does not draw them.
- DetailPage: a resource detail page rendered through `ConsoleLayout`. The page body sets its own trail with `ConsoleLayout.Breadcrumb`: Applications and the application as `items`, then the environment in its slot, a `Select` with `variant="ghost"` and `size="small"` labelled `Switch environment` (a search `Input`, each environment tagged with its deployment policy, a muted line when nothing matches, Add Environment at its foot). While compact the header hides the crumbs but keeps the environment `Select` in place of the brand, so Deploy always has its target in view; the body repeats the rest of the trail under `md` in its own `nav` row named Application (a ghost back `IconButton` to Applications and the application name). The default slot is flush and opens on a full-bleed `PageTabs` (Overview, Deployments, Settings, the outlined Deploy in `#actions`), sticky at the top of the layout's scrolling region so it stays in view while the tab content scrolls under it; no `main` of its own, the layout owns it.
- Notifications: the ListPage through `ConsoleLayout` with the bell after Create and Agent in the `actions` slot; it toggles the layout's tools region (`v-model:tools-open`, `tools-label="Notifications"`), a region beside the content and a drawer when narrow. The `tools` slot holds the list as `Item.List` of `Item` rows (`Item.Media type="icon"` toned through `data-type`, title, description, time, `Item.Actions`), five at a time with `Show older` for the rest: unread items marked with a `New` tag (and a visually hidden `Unread:` prefix), Edit and Redeploy on each deploy, Mark all as read, Clear all (it empties the list and toasts `Notifications cleared.` with Undo, which brings them back), and the EmptyState `You are all caught up` once cleared. The failed deploy also shows as a flash Alert (Edit, Redeploy) in the `notifications` slot above the page. The bell's `aria-label` carries the unread count, `aria-pressed` follows the region, and the `Badge` on it is hidden from assistive technology.
- AccountSwitch: the ListPage through `ConsoleLayout` with the current account in the `sidebar-header` slot, full width in the rail under the wordmark (square `Avatar` with its initials, the name, a sort glyph), `Switch account (Ctrl+O)` on its tooltip (to the right) and `aria-keyshortcuts`; the rail slot renders nothing while `compact` is true, and the same switcher moves to the `header-leading` slot, before the breadcrumbs, with the avatar and the chevron only (the name stays in its `aria-label`). It and the shortcut open a large `Dialog`, rendered beside the layout, with a search `Input` (name, ID or client ID) over a `Table` of the account tree: organizations, groups and workspaces indented by depth, expand and collapse buttons with `aria-expanded`, each name a button that switches, `Current` on the active one, type as `TableCellStatus`, ID and client ID as `TableCellId`. Each name is a `Button` with `variant="link"`. The table pages ten rows at a time (`paginated`), and while the list loads on open it shows the `Table` loading rows. Switching closes the dialog and toasts `Switched to <name>.` with the IDs; the footer shows the current account and Account settings. A search with no match shows Clear search. The search `Input` takes its `id` from `useId()` so the dialog can focus it on open.
- AccountSwitchError: the AccountSwitch dialog when the account list fails to load. A danger `Alert` (`The account list could not be loaded.`, action `Retry`) takes the place of the account `Table` under the search; the search, the title and the footer stay. Retry loads the list again and shows the table.

## Related

- `top-bar/top-bar-creation` — the focused shell for create, edit and deploy.
- `view/view-table`, `detail/detail-resource`, `dashboard/dashboard-home` — the page bodies rendered in the slot.

## Variants

- `ListPage` — primary (the code below)
- `DetailPage` — A resource detail page rendered through `ConsoleLayout`: the page body sets its own trail with `ConsoleLayout.Breadcrumb` (Applications, the application) ending on its environment as a control crumb, a `Select` with `variant="ghost"` and `size="small"` that searches the environments, tags each with its deployment policy and offers Add Environment at its foot; while compact the header hides the crumbs but keeps the environment `Select` in place of the brand, and below `md` the body repeats the rest of the trail in its own row (back to Applications, the application name); the default slot opens flush on a full-bleed `PageTabs` with the Overview, Deployments and Settings tabs and the outlined Deploy action, which stays in view while the tab content scrolls under it.
- `Notifications` — The ListPage rendered through `ConsoleLayout` with a bell in its `actions` slot: the bell carries an unread `Badge` and toggles the layout's tools region (`v-model:tools-open`, titled Notifications, a drawer on a narrow screen), whose `tools` slot lists deploys, invitations and alerts with Mark all as read and Clear all and offers Edit and Redeploy on each deploy; a failed deploy also shows as a flash `Alert` in the `notifications` slot above the page, and an empty list reads You are all caught up through `EmptyState`.
- `AccountSwitch` — The ListPage rendered through `ConsoleLayout` with the account switcher in its `sidebar-header` slot, full width in the rail under the wordmark (square `Avatar`, the account name, a sort glyph; tooltip on the right; Ctrl+O or ⌘O), and in its `header-start` slot while compact (avatar and chevron only): a large `Dialog` with search over the organization, group and workspace `Table` tree (expand and collapse, type, ID and client ID), the current account marked, a toast on switch, and Account settings in the footer.
- `AccountSwitchError` — The AccountSwitch dialog when the account list fails to load: a danger `Alert`, The account list could not be loaded., with Retry replaces the account `Table` under the search; Retry loads the tree.

Each variant is the same screen in another state: `get_block("shell/shell-console", { variant })`, or the file under `blocks/shell/shell-console/variants/`.

## Code (`ListPage`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayoutRoot, {
    type ConsoleLayoutNavGroup
  } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import HighlightButton from '@aziontech/webkit/highlight-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'

  export interface ShellConsoleProps {
    /** Accessible name of the tools region the tools slot fills. */
    toolsLabel?: string
  }

  withDefaults(defineProps<ShellConsoleProps>(), {
    toolsLabel: ''
  })

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const toolsOpen = defineModel<boolean>('toolsOpen', { default: false })

  defineSlots<{
    /** The page body; a stand-in list page when empty. */
    default(): unknown
    /** Header actions after Create and Agent. */
    actions(props: { compact: boolean }): unknown
    /** Content before the breadcrumbs in the header. */
    'header-leading'(props: { compact: boolean }): unknown
    /** Content under the wordmark in the rail. */
    'sidebar-header'(props: { compact: boolean }): unknown
    /** Flash messages above the page body. */
    notifications(): unknown
    /** The tools region beside the content. */
    tools(): unknown
  }>()

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'az az-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'az az-workloads', href: '/workloads' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'az az-deploy-pillar',
          href: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        {
          id: 'applications',
          label: 'Applications',
          icon: 'az az-applications',
          href: '/applications'
        },
        { id: 'functions', label: 'Functions', icon: 'az az-functions', href: '/functions' },
        { id: 'variables', label: 'Variables', icon: 'az az-variables', href: '/variables' },
        {
          id: 'connectors',
          label: 'Connectors',
          icon: 'az az-connectors',
          href: '/connectors'
        },
        {
          id: 'custom-pages',
          label: 'Custom Pages',
          icon: 'az az-custom-pages',
          href: '/custom-pages'
        }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'firewall', label: 'Firewall', icon: 'az az-firewall', href: '/firewall' },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'az az-edge-dns', href: '/edge-dns' },
        { id: 'waf-rules', label: 'WAF Rules', icon: 'az az-waf', href: '/waf-rules' },
        {
          id: 'certificate-manager',
          label: 'Certificate Manager',
          icon: 'az az-certificate-manager',
          href: '/certificate-manager'
        },
        {
          id: 'network-lists',
          label: 'Network Lists',
          icon: 'az az-network-lists',
          href: '/network-lists'
        }
      ]
    },
    {
      label: 'Store',
      items: [
        {
          id: 'object-storage',
          label: 'Object Storage',
          icon: 'az az-object-storage',
          href: '/object-storage'
        },
        {
          id: 'sql-database',
          label: 'SQL Database',
          icon: 'az az-sql-database',
          href: '/sql-database',
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
          icon: 'az az-data-stream',
          href: '/data-stream'
        },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'az az-edge-pulse', href: '/edge-pulse' },
        {
          id: 'real-time-metrics',
          label: 'Real-Time Metrics',
          icon: 'az az-real-time-metrics',
          href: '/real-time-metrics'
        },
        {
          id: 'real-time-events',
          label: 'Real-Time Events',
          icon: 'az az-real-time-events',
          href: '/real-time-events'
        },
        {
          id: 'real-time-purge',
          label: 'Real-Time Purge',
          icon: 'az az-real-time-purge',
          href: '/real-time-purge'
        }
      ]
    },
    {
      label: 'More',
      items: [
        {
          id: 'marketplace',
          label: 'Marketplace',
          icon: 'az az-marketplace',
          href: '/marketplace'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'az az-settings',
          type: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', href: '/settings' },
                {
                  id: 'settings-build',
                  label: 'Build and deployment',
                  href: '/settings/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  href: '/settings/environments'
                },
                { id: 'settings-users', label: 'Users management', href: '/settings/users' },
                { id: 'settings-teams', label: 'Teams and permissions', href: '/settings/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', href: '/settings/tokens' },
                { id: 'settings-credentials', label: 'Credentials', href: '/settings/credentials' },
                { id: 'settings-mfa', label: 'Multi-factor auth', href: '/settings/mfa' },
                { id: 'settings-sessions', label: 'Active sessions', href: '/settings/sessions' },
                { id: 'settings-activity', label: 'Activity history', href: '/settings/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', href: '/settings/billing' },
                { id: 'settings-invoices', label: 'Invoices', href: '/settings/invoices' }
              ]
            }
          ]
        }
      ]
    }
  ]

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }

  const recents = [
    { id: 'azion-site', label: 'azion-site', icon: 'az az-applications', type: 'Application' },
    { id: 'edge-auth', label: 'edge-auth', icon: 'az az-functions', type: 'Function' },
    { id: 'shop-assets', label: 'shop-assets', icon: 'az az-object-storage', type: 'Bucket' }
  ]

  const { mode: theme } = useColorMode()

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:theme') theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const onAccountSelect = (event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'logout') emit('sign-out', event)
    else if (value === 'theme:system' || value === 'theme:dark' || value === 'theme:light')
      theme.value = value.slice('theme:'.length) as typeof theme.value
  }
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    :account="account"
    active-id="applications"
    v-model:tools-open="toolsOpen"
    :tools-label="toolsLabel"
    @search-select="onSearchSelect"
    @account-select="onAccountSelect"
  >
    <template
      v-if="$slots['sidebar-header']"
      #sidebar-header="{ compact }"
    >
      <slot
        name="sidebar-header"
        :compact="compact"
      />
    </template>

    <template
      v-if="$slots['header-leading']"
      #header-leading="{ compact }"
    >
      <slot
        name="header-leading"
        :compact="compact"
      />
    </template>

    <template #actions="{ compact }">
      <template v-if="compact">
        <Tooltip
          content="Create"
          side="bottom"
        >
          <IconButton
            icon="az az-circle-plus"
            variant="primary"
            size="medium"
            aria-label="Create"
          />
        </Tooltip>
        <Tooltip
          content="Agent"
          side="bottom"
        >
          <IconButton
            icon="az az-ask-azion"
            variant="outline"
            size="medium"
            aria-label="Agent"
          />
        </Tooltip>
      </template>
      <template v-else>
        <Button
          label="Create"
          variant="primary"
          size="medium"
          icon="az az-circle-plus"
        />
        <HighlightButton
          label="Agent"
          size="medium"
          icon="az az-ask-azion"
        />
      </template>
      <slot
        name="actions"
        :compact="compact"
      />
    </template>

    <template #search="{ query }">
      <Command.Group
        v-if="!query"
        label="Recents"
      >
        <Command.Item
          v-for="row in recents"
          :key="row.id"
          :value="`recent:${row.id}`"
        >
          <template #leading>
            <i
              :class="row.icon"
              aria-hidden="true"
            />
          </template>
          {{ row.label }}
          <template #trailing>
            <span class="text-label-sm text-(--text-muted)">{{ row.type }}</span>
          </template>
        </Command.Item>
      </Command.Group>
      <Command.Group label="Actions">
        <Command.Item value="action:create">
          <template #leading>
            <i
              class="az az-circle-plus"
              aria-hidden="true"
            />
          </template>
          Create Application
        </Command.Item>
        <Command.Item value="action:theme">
          <template #leading>
            <i
              class="az az-moon"
              aria-hidden="true"
            />
          </template>
          Switch theme
        </Command.Item>
      </Command.Group>
    </template>

    <template #account-menu>
      <DropdownMenu.Group>
        <template #header>
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
            <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
          </div>
        </template>
        <DropdownMenu.Item
          value="settings"
          label="Account settings"
        >
          <template #trailing>
            <i
              class="az az-settings"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          value="personal-tokens"
          label="Personal tokens"
        >
          <template #trailing>
            <i
              class="az az-key"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Group label="Theme">
        <DropdownMenu.Item
          value="theme:system"
          label="System"
          type="radio"
          :selected="theme === 'system'"
        >
          <template #trailing>
            <i
              class="az az-desktop"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          value="theme:dark"
          label="Dark"
          type="radio"
          :selected="theme === 'dark'"
        >
          <template #trailing>
            <i
              class="az az-moon"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          value="theme:light"
          label="Light"
          type="radio"
          :selected="theme === 'light'"
        >
          <template #trailing>
            <i
              class="az az-sun"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
        <DropdownMenu.Item
          value="docs"
          label="Docs"
        >
          <template #trailing>
            <i
              class="az az-book"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          value="logout"
          label="Log out"
        >
          <template #trailing>
            <i
              class="az az-log-out"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
        <DropdownMenu.Item
          value="upgrade"
          label="Upgrade to Pro"
        >
          <template #trailing>
            <i
              class="az az-sparkles"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
        <div class="flex justify-center px-(--spacing-xs) py-(--spacing-2xs)">
          <StatusIndicator
            severity="success"
            label="All systems operational"
          />
        </div>
      </DropdownMenu.Group>
    </template>

    <template
      v-if="$slots.notifications"
      #notifications
    >
      <slot name="notifications" />
    </template>

    <template
      v-if="$slots.tools"
      #tools
    >
      <slot name="tools" />
    </template>

    <slot>
      <div class="layout-boundary">
        <div class="layout-column flex flex-col gap-(--layout-group-gap)">
          <PageHeader
            title="Applications"
            description="Build, deploy, and manage your applications."
          >
            <template #actions>
              <Button
                label="Documentation"
                icon="az az-book"
                variant="outline"
                size="medium"
                href="https://www.azion.com/en/documentation/"
                target="_blank"
              />
              <Button
                label="Create Application"
                icon="az az-plus"
                variant="outline"
                size="medium"
              />
            </template>
          </PageHeader>

          <Card :padded="false">
            <template #default>
              <div
                class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
              >
                The page body: view/view-table
              </div>
            </template>
          </Card>
        </div>
      </div>
    </slot>
    <Toaster position="bottom-end" />
  </ConsoleLayoutRoot>
</template>
```
