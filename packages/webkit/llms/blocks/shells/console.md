# Console (`shells/console`)

> The console shell as one component: `ConsoleLayout`, composed once in the app around RouterView, so a console page is only its body. Its `navigation` is the Azion console tree as data (Overview, Workloads, Deployments; Build, Secure, Store, Observe; Marketplace and the Settings drill-in), each row with an `href` the layout follows with the app's router, and the active row follows the route; it renders the resizable, collapsible rail with the wordmark and the account at its foot, the header with breadcrumbs, the search trigger, the app's actions and the avatar, the ⌘K palette listing every navigation page, and the single main. Below 768 px of its own width the rail becomes a drawer opened from the header's menu button. This block fills the slots: Create (`Button`) and Agent (`ButtonHighlight`), icon-only (`IconButton` with a `Tooltip`) while compact; Recents and Actions as `Command` groups; the account menu (`DropdownMenu` with `ThemeSwitcher`, Upgrade to Pro and `StatusIndicator`). The body is a stand-in list page (`PageHeader`, Filter, a search `Input`, the toolbar and a `Card`) for platform/view/table-view; a page opens the same palette with useConsoleLayout().openSearch().

- Surface: product
- Source: `blocks/shells/console/console.vue` in `@aziontech/webkit`
- MCP: `get_pattern("shells/console")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Badge](../../components/badge.md), [Button](../../components/button.md), [ButtonHighlight](../../components/button-highlight.md), [Card](../../components/card.md), [Command](../../components/command.md), [ConsoleLayout](../../components/console-layout.md), [ConsoleLayout](../../components/console-layout.md), [Dialog](../../components/dialog.md), `DialogClose`, `DialogContent`, `DialogDescription`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [Select](../../components/select.md), `type`, [StatusIndicator](../../components/status-indicator.md), [Table](../../components/table.md), `type`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [ThemeSwitcher](../../components/theme-switcher.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

platform shell; console shell; app shell; sidebar layout; navigation rail; dashboard layout; admin layout; app layout with sidebar; estrutura do console; layout com menu lateral; menu lateral; console; console layout; layout do console; notifications panel; notifications drawer; notification center; central de notificações; painel de notificações; switch account; account switcher; organization switcher; change organization; trocar conta; trocar organização; selecionar conta; console layout component; ConsoleLayout; app layout with router view; layout do console com RouterView

The application shell every signed-in page renders inside. The user browses and moves laterally between modules, so the shell keeps the whole product one step away: the navigation rail (wordmark, grouped navigation with drill-in levels, the account at its foot), one global header (breadcrumbs, search, the app's actions, the avatar) and the ⌘K palette. All of that is one component, `ConsoleLayout`: this block is the app's `App.vue` — compose it once around `RouterView` and every console page is only the body rendered through its default slot. The body here is a stand-in for `platform/view/table-view`.

## When to use

- The root of a console app: every browse page (first-level lists, Home and dashboards, resource details with their tabs, settings) renders inside it.

## When not to use

- Create, edit and deploy flows: use the focused shell headed by `headers/creation-header`, with no rail.
- Signed-out screens: `platform/auth` with `headers/auth-header`.
- Documentation and marketing: `shells/documentation`, `shells/website`.
- A page needing the resizable split panel: compose `AppLayout` directly for that page.

## Building blocks

### A. Shell — `ConsoleLayout` (required)

Composed once in `App.vue` around `RouterView` (imported from `console-layout-root`). `navigation` is the console tree as data: groups of rows `{ id, label, icon, href }` (an in-app `href` is followed with the app's router, an external one loads normally; `kind: 'drill'` with `groups` for Settings; `tagValue` for a `Preview` badge). The active row follows the current route; leave `active-id` empty in the app (this block sets it only because its preview has no router). `breadcrumbs` takes a static trail from the route meta (`{ label, href }`); a page that owns its trail renders `ConsoleLayout.Breadcrumbs` instead, and a workspace page puts `data-layout-fill` on its root. `account` is the signed-in user. The layout renders the rail (resizable and collapsible, a drawer below 768 px of its own width), the header, the `SearchTrigger` wired to the ⌘K `Command` palette (every navigation page is listed), the avatar, and the single `<main>`; a page opens the same palette with `useConsoleLayout().openSearch()`.

### B. Actions — `Button` (required)

In the `actions` slot: Create (`primary`, `medium`, with its icon) while not compact. In the page body: Documentation (`outlined`) and the create action, and Upgrade to Pro (`secondary`) in the account menu.

### C. Agent — `ButtonHighlight` (required)

The AI assistant entry in the `actions` slot, after Create, while not compact.

### D. Hints — `Tooltip` (required)

Names every icon-only control: the compact Create and Agent, the page toolbar icons.

### E. Icon actions — `IconButton` (required)

Create and Agent while the `actions` slot's `compact` is true; the page toolbar (Refresh, Download CSV, Columns).

### F. Palette groups — `Command` (required)

In the `search` slot: Recents (only while the query is empty) and Actions, as `Command.Group`s of `Command.Item`s; their selection arrives as `search-select`. The navigation pages are added by the layout.

### G. Account menu — `DropdownMenu` (required)

In the `account-menu` slot, as `DropdownMenu.Group`s: identity, Account settings and Personal tokens, the theme, Docs, Log out, and the Upgrade to Pro and system status foot. The layout opens it from the rail footer and from the header avatar.

### H. Theme — `ThemeSwitcher` (required)

Inside the account menu, labelled `Theme`.

### I. System status — `StatusIndicator` (required)

At the foot of the account menu: `All systems normal` with `success` severity; switch severity and label when the status page reports an incident.

### J. Page title — `PageHeader` (stand-in body)

The list page's title and description, with Documentation and the create action in its `actions` slot.

### K. Search field — `Input` (stand-in body)

The list's search, with a leading icon and an `aria-label`, growing between Filter and the toolbar icons.

### L. Table frame — `Card` (stand-in body)

Flush (`:padded="false"`), holding the table; the card is the only border.

## Do

- Compose `ConsoleLayout` once in `App.vue` and render every browse page through its default slot; replace this block's stand-in body with `<RouterView />`.
- Keep the navigation in one data file shared by the app; the rail and the palette both read it.
- Give every row an `href` (never `to` or `path`); derive a static `breadcrumbs` trail from the route.
- Let a detail page set its own trail, control crumb included, with `ConsoleLayout.Breadcrumbs`.
- Frame a list or form body with `layout-boundary` + `layout-column`; open a detail body flush on `PageTabs`.

## Don't

- Don't render `AppLayout`, `Sidebar`, `GlobalHeader`, `SearchTrigger`, a `Command` palette or a `<main>` in a page; the layout owns them.
- Don't put a page's control crumb in `App.vue`, or size a body with `calc(100dvh - …)`.
- Don't render the rail on create, edit or deploy pages.
- Don't add page actions to the global header; they belong to the page's header, controls row or tab row.
- Don't hide the avatar when the rail is collapsed or in the drawer.
- Don't open the notifications region as a popover over the page; it is the layout's tools region beside the content.

## Copy

- **Palette groups:** `Recents`, `Actions`; the layout's placeholder `Search pages and commands` and its empty line come from the locale catalog.
- **Navigation and menu items:** nouns as the module pages are titled (`Personal tokens`, `Activity history`, `Build and deployment`, `Account settings`); Azion product names keep theirs (`Edge DNS`, `Real-Time Metrics`). No ampersand.
- **Status:** a short state, not a sentence: `All systems normal`.
- **Header actions:** `Create`, `Agent`.
- **Module create:** `Create` plus the entity: `Create Application`.

## Accessibility

- One `main` (the layout's), one `banner` (the header), the rail as a labelled navigation (`Main navigation`); the page body starts with its `h1` (`PageHeader`).
- ⌘K / Ctrl K opens the palette, announced through `aria-keyshortcuts` on the search; focus returns to the trigger on close.
- The rail's drawer traps focus while open, closes on `Escape` and when a row is chosen, and returns focus to the menu button.
- Icon-only controls have both an `aria-label` and a tooltip.
- The bell is a toggle (`aria-pressed`) and names the unread count; unread items carry a visually hidden `Unread:` prefix, not colour alone.

## States

- ListPage: a first-level list page in the `ConsoleLayout` default slot: no breadcrumb on a first level, the page opens on its `PageHeader` (title, description, Documentation and the create action) and its controls row (Filter, search, Refresh, Download CSV, Columns) over the table.
- DetailPage: a resource detail page rendered through `ConsoleLayout`. The page body sets its own trail with `ConsoleLayout.Breadcrumbs`: Applications and the application as `items`, then the environment in its slot, a `Select` with `kind="transparent"` and `size="small"` labelled `Switch environment` (a search `Input`, each environment tagged with its deployment policy, a muted line when nothing matches, Add Environment at its foot). The default slot is flush and opens on a full-bleed `PageTabs` (Overview, Deployments, Settings, the outlined Deploy in `#actions`), sticky at the top of the layout's scrolling region so it stays in view while the tab content scrolls under it; no `main` of its own, the layout owns it.
- Notifications: the ListPage through `ConsoleLayout` with the bell after Create and Agent in the `actions` slot; it toggles the layout's tools region (`v-model:tools-open`, `tools-label="Notifications"`), a region beside the content and a drawer when narrow. The `tools` slot holds the list: unread items raised, Edit and Redeploy on each deploy, Mark all as read, Clear all, and the EmptyState `You are all caught up` once cleared. The failed deploy also shows as a flash Alert (Edit, Redeploy) in the `notifications` slot above the page. The bell's `aria-label` carries the unread count, `aria-pressed` follows the region, and the `Badge` on it is hidden from assistive technology.
- AccountSwitch: the ListPage through `ConsoleLayout` with the current account in the `header-start` slot, before the breadcrumbs (square `Avatar` with its initials, the name, a chevron), `Switch account (Ctrl+O)` on its tooltip and `aria-keyshortcuts`; while the slot's `compact` is true it shows the avatar and the chevron only (the name stays in its `aria-label`). It and the shortcut open a large `Dialog`, rendered beside the layout, with a search `Input` (name, ID or client ID) over a `Table` of the account tree: organizations, groups and workspaces indented by depth, expand and collapse buttons with `aria-expanded`, each name a button that switches, `Current` on the active one, type as `Table.CellStatus`, ID and client ID as `Table.CellId`. Switching closes the dialog and toasts `Switched to <name>.` with the IDs; the footer shows the current account and Account settings. A search with no match shows Clear search.

## Related

- `headers/resource-header` — this shell's header on its own.
- `headers/creation-header` — the focused shell for create, edit and deploy.
- `platform/view/table-view`, `platform/detail/details-page`, `platform/dashboard/home-dashboard` — the page bodies rendered in the slot.

## Variants

- `ListPage` — primary (the code below)
- `DetailPage` — A resource detail page rendered through `ConsoleLayout`: the page body sets its own trail with `ConsoleLayout.Breadcrumbs` (Applications, the application) ending on its environment as a control crumb, a `Select` with `kind="transparent"` and `size="small"` that searches the environments, tags each with its deployment policy and offers Add Environment at its foot; the default slot opens flush on a full-bleed `PageTabs` with the Overview, Deployments and Settings tabs and the outlined Deploy action, which stays in view while the tab content scrolls under it.
- `Notifications` — The ListPage rendered through `ConsoleLayout` with a bell in its `actions` slot: the bell carries an unread `Badge` and toggles the layout's tools region (`v-model:tools-open`, titled Notifications, a drawer on a narrow screen), whose `tools` slot lists deploys, invitations and alerts with Mark all as read and Clear all and offers Edit and Redeploy on each deploy; a failed deploy also shows as a flash `Alert` in the `notifications` slot above the page, and an empty list reads You are all caught up through `EmptyState`.
- `AccountSwitch` — The ListPage rendered through `ConsoleLayout` with the account switcher in its `header-start` slot (square `Avatar`, the account name, a chevron; avatar and chevron only while compact; Ctrl+O or ⌘O): a large `Dialog` with search over the organization, group and workspace `Table` tree (expand and collapse, type, ID and client ID), the current account marked, a toast on switch, and Account settings in the footer.

Each variant is the same screen in another state: `get_pattern("shells/console", { variant })`, or the file under `blocks/shells/console/variants/`.

## Code (`ListPage`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'ai ai-deploy-pillar',
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
          icon: 'ai ai-edge-application',
          href: '/applications'
        },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' },
        { id: 'variables', label: 'Variables', icon: 'ai ai-variables', href: '/variables' },
        {
          id: 'connectors',
          label: 'Connectors',
          icon: 'ai ai-edge-connectors',
          href: '/connectors'
        },
        {
          id: 'custom-pages',
          label: 'Custom Pages',
          icon: 'ai ai-custom-pages',
          href: '/custom-pages'
        }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'firewall', label: 'Firewall', icon: 'ai ai-edge-firewall', href: '/firewall' },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns', href: '/edge-dns' },
        { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules', href: '/waf-rules' },
        {
          id: 'certificate-manager',
          label: 'Certificate Manager',
          icon: 'ai ai-certificate-manager',
          href: '/certificate-manager'
        },
        {
          id: 'network-lists',
          label: 'Network Lists',
          icon: 'ai ai-network-lists',
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
          icon: 'ai ai-edge-storage',
          href: '/object-storage'
        },
        {
          id: 'sql-database',
          label: 'SQL Database',
          icon: 'ai ai-edge-sql',
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
          icon: 'ai ai-data-stream',
          href: '/data-stream'
        },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse', href: '/edge-pulse' },
        {
          id: 'real-time-metrics',
          label: 'Real-Time Metrics',
          icon: 'ai ai-real-time-metrics',
          href: '/real-time-metrics'
        },
        {
          id: 'real-time-events',
          label: 'Real-Time Events',
          icon: 'ai ai-real-time-events',
          href: '/real-time-events'
        },
        {
          id: 'real-time-purge',
          label: 'Real-Time Purge',
          icon: 'ai ai-real-time-purge',
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
          icon: 'ai ai-marketplace',
          href: '/marketplace'
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

  const account = { name: 'Ana Souza', email: 'ana.souza@example.com' }

  const recents = [
    { id: 'azion-site', label: 'azion-site', icon: 'ai ai-edge-application', type: 'Application' },
    { id: 'edge-auth', label: 'edge-auth', icon: 'ai ai-edge-functions', type: 'Function' },
    { id: 'shop-assets', label: 'shop-assets', icon: 'ai ai-edge-storage', type: 'Bucket' }
  ]

  const theme = ref<ThemeSwitcherValue>('system')
  const search = ref('')

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:theme') theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :account="account"
    active-id="applications"
    @search-select="onSearchSelect"
  >
    <template #actions="{ compact }">
      <template v-if="compact">
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
      </template>
      <template v-else>
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
      </template>
    </template>

    <template #search="{ query }">
      <Command.Group
        v-if="!query"
        heading="Recents"
      >
        <Command.Item
          v-for="row in recents"
          :key="row.id"
          :value="`recent:${row.id}`"
        >
          <template #prefix>
            <i
              :class="row.icon"
              aria-hidden="true"
            />
          </template>
          {{ row.label }}
          <template #suffix>
            <span class="text-label-sm text-(--text-muted)">{{ row.type }}</span>
          </template>
        </Command.Item>
      </Command.Group>
      <Command.Group heading="Actions">
        <Command.Item value="action:create">
          <template #prefix>
            <i
              class="pi pi-plus-circle"
              aria-hidden="true"
            />
          </template>
          Create Application
        </Command.Item>
        <Command.Item value="action:theme">
          <template #prefix>
            <i
              class="pi pi-moon"
              aria-hidden="true"
            />
          </template>
          Switch theme
        </Command.Item>
      </Command.Group>
    </template>

    <template #account-menu>
      <DropdownMenu.Group>
        <template #top>
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
            <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
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
          <span class="flex-1 truncate text-start text-label-sm text-(--text-default)">Theme</span>
          <ThemeSwitcher
            v-model="theme"
            aria-label="Theme"
          />
        </div>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
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
    </template>

    <div class="layout-boundary">
      <div class="layout-column flex flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="Applications"
          description="Build, deploy, and manage your applications."
        >
          <template #actions>
            <Button
              label="Documentation"
              icon="pi pi-book"
              kind="outlined"
              size="medium"
              href="https://www.azion.com/en/documentation/"
              target="_blank"
            />
            <Button
              label="Create Application"
              icon="pi pi-plus"
              kind="outlined"
              size="medium"
            />
          </template>
        </PageHeader>

        <div class="flex items-center gap-(--spacing-xs)">
          <Button
            label="Filter"
            kind="outlined"
            size="medium"
            icon="pi pi-filter"
          />
          <div class="flex min-w-0 flex-1">
            <Input
              v-model="search"
              size="medium"
              placeholder="Search"
              aria-label="Search applications"
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
          <Tooltip text="Refresh">
            <IconButton
              icon="pi pi-refresh"
              kind="outlined"
              size="medium"
              ariaLabel="Refresh"
            />
          </Tooltip>
          <Tooltip text="Download CSV">
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
        </div>

        <Card :padded="false">
          <template #content>
            <div
              class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
            >
              The page body: platform/view/table-view
            </div>
          </template>
        </Card>
      </div>
    </div>
  </ConsoleLayout>
</template>
```
