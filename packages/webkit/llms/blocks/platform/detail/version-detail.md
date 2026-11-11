# VersionDetail (`platform/detail/version-detail`)

> One version of a resource, opened from its Versions tab: the platform shell whose last breadcrumb is a Select that switches between the resource versions, each with its state Tag, or creates a new one. Under it a horizontal `Resizable` holds the version workspace, a tab bar with Settings, Source, Variables, Cache Settings, Custom Code and Rules carrying the state Tag and a Version actions menu, the open tab in a fading `ScrollArea`, and the version bar pinned to the bottom that names the state and holds the Save and deploy `SplitButton` on a draft or Add Version and Redeploy on a built version, and a collapsible Version history pane with the current version, its changes and the earlier built versions. The stories open on the Settings tab; the Rules tab is the Edit/RuleBuilder template, and the Source, Variables, Cache Settings and Custom Code panels are not plotted here. Built from `ConfirmDialog`, `Toaster`, `PageHeader`, `PageTabs`, `SettingsSection`, `SettingRow`, the platform shell, `Breadcrumb`, `Select`, `Resizable`, `Tabs`, `Tag`, `DropdownMenu`, `ScrollArea`, `Card`, `Item`, `Input`, `Switch`, `SplitButton`, `Button`, `Avatar`, `Field` and `Textarea`.

- Surface: product
- Source: `blocks/platform/detail/version-detail/version-detail.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/version-detail")`
- Components: [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [ButtonHighlight](../../../components/button-highlight.md), [Card](../../../components/card.md), [Command](../../../components/command.md), [ConfirmDialog](../../../components/confirm-dialog.md), [Drawer](../../../components/drawer.md), `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, [DropdownMenu](../../../components/dropdown-menu.md), [Field](../../../components/field.md), [GlobalHeader](../../../components/global-header.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [Kbd](../../../components/kbd.md), [Menu](../../../components/menu.md), [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), [Resizable](../../../components/resizable.md), [ScrollArea](../../../components/scroll-area.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [Sidebar](../../../components/sidebar.md), [SplitButton](../../../components/split-button.md), [StatusIndicator](../../../components/status-indicator.md), [Switch](../../../components/switch.md), [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [ThemeSwitcher](../../../components/theme-switcher.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-ui-states`

## Asked as

version detail; resource version; draft version; version history; version switcher; versioned settings; detalhe da versão; histórico de versões; versão rascunho; revert version; rollback version; reverter versão; revertir versión; environment switcher; environment crumb; switch environment; seletor de ambiente

One version of a resource, opened from its Versions tab. The user is here to change a draft and ship it, or to read what a built version holds and redeploy it or branch a new version from it. The page keeps the version they are on in the breadcrumb, where they can switch to another, puts the version's settings in tabs, pins the state and the save or deploy action to the bottom, and opens the version history beside the work when they need to see what changed.

## When to use

- A resource whose configuration is versioned: drafts are edited, built and deployed, and built versions are read-only.
- The user opens a row of the Versions tab of `platform/detail/details-page`, or creates a new version.
- The version has several areas of settings (Settings, Source, Variables, Cache Settings, Custom Code, Rules) that share one save and deploy action.

## When not to use

- The overview of the resource itself, its domains and deployments: use `platform/detail/details-page`.
- A resource without versions whose settings save in place: use `platform/edit/edit-resource` or `platform/settings/settings-form`.
- The Rules tab content: use `platform/edit/rule-builder`.
- Deploying from a list without opening a version: use `platform/create/deploy-drawer`.

## Building blocks

### A. Console shell — `Sidebar`, `Brand`, `Command`, `Menu`, `Avatar`, `DropdownMenu`, `Tooltip`, `IconButton`, `ThemeSwitcher`, `Button`, `StatusIndicator`, `GlobalHeader`, `Kbd`, `ButtonHighlight`, `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

The persistent console shell from `skills/webkit-navigation`: the collapsible `Sidebar` with the brand, the `Command` palette, the module `Menu` and the account menu, and one `GlobalHeader` with Search, Create, Agent and the account avatar. Below md the sidebar moves into a left `Drawer`.

### B. Version switcher — `Breadcrumb`, `Select`, `Input`, `Tag` (required)

The breadcrumb reads module, resource, then the version as a `Select` with `aria-label="Switch version"`. Its content has a small search `Input`, a Versions group where each option carries its state `Tag` (Draft, Deployed, Ready), a no-match line, and a footer option that creates a new version. The version is never a page title.

### C. Workspace — `Resizable` (required)

A horizontal `Resizable` named "Version workspace": the version settings pane, a handle named "Resize the version history", and the collapsible Version history pane. History is closed by default.

### D. Version tab bar — `PageTabs`, `Tabs`, `Tag`, `DropdownMenu`, `IconButton` (required)

`PageTabs` with one `Tabs.Item` per area: Settings, Source, Variables, Cache Settings, Custom Code, Rules. The tab row ends on the version's state `Tag` and an outlined Version actions `IconButton` whose `DropdownMenu` holds Edit version info and the toggle for Version history.

### E. Settings panel — `ScrollArea`, `PageHeader`, `SettingsSection`, `Card`, `Item`, `SettingRow`, `Input`, `Switch`, `Tooltip` (required)

The open tab scrolls in a fading `ScrollArea`. A small `PageHeader` names the tab, then `SettingsSection`s (General, Modules, Subscription modules) each hold a `Card :padded="false"` with an `Item.List` of `SettingRow`s: a title, a one-sentence description and its control, an `Input` or a `Switch`. A module that needs a sales contact keeps its `Switch` disabled, explained by a `Tooltip`. On a built version the whole fieldset is disabled.

### F. Version bar — `Tag`, `SplitButton`, `Button` (required)

A bar pinned to the bottom of the settings pane, aligned with the column above it. It names the state with a `Tag` and one sentence. On a draft it holds a primary medium `SplitButton` that saves and deploys, with Save and build and Save in its menu. On a built version it reads Viewing a deployed version with a Read-only tag and offers Add Version and Redeploy.

### G. Version history — `IconButton`, `Tag`, `Field`, `Textarea`, `Button`, `Avatar` (optional)

The side pane titled "Version history", closed with an `IconButton`. It starts on the current version with its `Tag`, its description, its author `Avatar` and a pencil that edits the description in place through a `Field` with a `Textarea` and Cancel and Save `Button`s. Then the changes entry, empty until something is saved, then the five newest earlier versions and Show older for the rest.

### H. Revert — `Button`, `Tag` (optional, on an earlier Ready version)

An earlier version opened from Version history keeps the page read-only and says Viewing an earlier version, with the entry in history marked by a Viewing `Tag` and `aria-current`. The version bar's primary action is Revert to <id>, the trigger of a `ConfirmDialog` with `kind="primary"` and `size="medium"`. Its body is the diff against the deployed version: a bordered list of the settings that change, each with its old and new value in words, a line with the rules added and removed, and a description saying that reverting deploys <id> to Production and that the deployed version stays in history. Confirm closes the dialog and starts the async-submit run: one toast id that turns from a loading toast ("Reverting to <id>…", "It keeps running if you leave.") into the outcome, which stays until closed and carries **Edit** and **Redeploy**, never View deployments. On success the version's `Tag` reads Deployed in the breadcrumb, the tab row and the history, and the bar offers Redeploy.

## Do

- Keep one primary action on the page, in the version bar; the tabs share it.
- Lock the settings fieldset, not each control one by one, when the version is built.
- Let the user switch versions from the breadcrumb without going back to the list.
- Show the state in three places that agree: the breadcrumb option, the tab row tag and the version bar.
- Keep the history pane collapsible and resizable so the settings keep their width when it is closed.
- Show what a revert changes before it runs: the settings with old and new values, and the rules added and removed.
- Report a revert like any deploy: one toast that turns into the outcome, with Edit and Redeploy.

## Don't

- Don't let a built version look editable; disable the fieldset and say Read-only.
- Don't put Save or Deploy in the tab row or the page header.
- Don't name a tab in the breadcrumb.
- Don't list every earlier version at once; show five and Show older.
- Don't save a description edit without Cancel and Save buttons.
- Don't revert without a confirmation, and don't make the diff depend on an arrow glyph or color alone.
- Don't delete or hide the version a revert replaces; it stays in history.
- Don't offer View deployments on the revert toast.

## Copy

- **Version state tags:** one word, e.g. "Draft", "Deployed", "Ready", "Editable", "Read-only".
- **Version bar:** one sentence on what the user can do, e.g. "This version is open for editing. Deploy it when ready." or "Viewing a deployed version".
- **Save actions:** verb first, three words or fewer, e.g. "Save and deploy", "Save and build", "Save".
- **Built version actions:** "Add Version", "Redeploy"; on an earlier version "Revert to <id>".
- **Revert:** bar "Viewing an earlier version"; dialog title "Revert to <id>?", description "Reverting deploys <id> to Production in place of <deployed>. <deployed> stays in the version history, so you can redeploy it later."; diff heading "What changes against <deployed>"; toasts "Reverting to <id>…" then "<id> is deployed.", actions "Edit" and "Redeploy".
- **Version picker:** search placeholder "Search versions", no-match line `No versions match "<query>".`, footer "Add Version".
- **Setting rows:** a noun title and one sentence with a period, e.g. "Active" with "When disabled, the resource stops serving traffic."
- **History:** "Current version", an empty changes line, e.g. "No changes yet. Each change you save shows up here.", description placeholder "What changed in this version?".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark holds the workspace; the Settings `PageHeader` title is its heading, and the history pane is a region labelled by its "Version history" `h2`.
- The resize handle has an `aria-label` and works with arrow keys.
- The version `Select` trigger is named "Switch version"; its search input is named "Search versions".
- Every `Switch` and `Input` in a setting row has an `aria-label` that matches the row title.
- A disabled control with a reason gets a `Tooltip` that the keyboard can reach.
- The revert dialog traps focus, is named by its title and returns focus to Revert on close. Each changed setting carries a visually hidden sentence ("changes from On to Off"); the struck-through values and the arrow are `aria-hidden`. The toasts live in the `Toaster` region, and the bar's status line announces "Reverting to <id>…".
- Icon-only buttons (Version actions, Close version history, Edit version info) have an `aria-label`; decorative icons are `aria-hidden`.

## States

- Draft: the editable draft on its Settings tab, with the Editable tag and the Save and deploy split button in the version bar.
- Deployed: the deployed version, read-only, the fieldset disabled and the version bar offering Add Version and Redeploy.
- Revert: an earlier Ready version, read-only, with history open, Revert to <id> in the bar, a confirmation with the diff, and the revert reported by a toast with Edit and Redeploy.
- VersionHistory: the draft with Version history open beside it, the current version, the empty changes entry and the five newest earlier versions.
- EnvironmentCrumb: a resource that is deployed to several environments. The breadcrumb ends on two crumbs, environment then version, each a small `Select` with a search field (`Switch environment`, `Switch version`). Environments carry their deployment policy as a `Tag` and Add Environment in the footer; picking an environment moves the version crumb to the version live there, and each version option says where it is live (Live in Production). The environment always comes before the version, because a version is chosen within an environment.

## Related

- `platform/detail/details-page` — its Versions tab lists the versions that open here.
- `platform/edit/rule-builder` — the content of the Rules tab.
- `platform/create/deploy-drawer` — deploying a version outside this page.
- `platform/states/async-submit` — how the version bar locks while Save and deploy runs.
- `SettingRow` — the row primitive of every settings section; see `skills/webkit-form` and `skills/webkit-layout`.

## Variants

- `Draft` — primary (the code below)
- `Deployed` — The deployed version, read-only: the creation date beside the Deployed Tag, the settings fieldset disabled, and the version bar reading Viewing a deployed version and Read-only with its description, Add Version and Redeploy.
- `VersionHistory` — The draft with Version history open beside it: the current version with its description, author and the pencil that edits it in place, the empty changes entry, and the five newest earlier versions with Show older for the rest.
- `Revert` — An earlier Ready version opened from Version history, read-only, the history pane open with the entry marked Viewing. The version bar reads Viewing an earlier version and offers Add Version and a primary Revert to AK7D0ZX4, which opens a `ConfirmDialog` with the diff against the deployed version: each changed setting from its old value to the new one, the rules added and removed, and that the deployed version stays in history. Confirm runs the revert as an async action: one toast turns from Reverting to AK7D0ZX4… into the outcome with Edit and Redeploy, and the version's Tag becomes Deployed.
- `EnvironmentCrumb` — The same version page reached from an environment: the breadcrumb reads Resources, the resource, then two `Select` crumbs. The environment crumb searches the environments, tags each with its deployment policy and offers Add Environment at its foot; picking one moves the version crumb to the version that environment serves. The version crumb marks each version with the environments it is live in, beside its state `Tag`.

Each variant is the same screen in another state: `get_pattern("platform/detail/version-detail", { variant })`, or the file under `blocks/platform/detail/version-detail/variants/`.

## Code (`Draft`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SplitButton from '@aziontech/webkit/split-button'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
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

  const tabs = [
    { value: 'main-settings', label: 'Settings' },
    { value: 'source', label: 'Source' },
    { value: 'variables', label: 'Variables' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'custom-code', label: 'Custom Code' },
    { value: 'rules', label: 'Rules' }
  ]
  const versions = [
    {
      id: 'ADA8FMMR',
      name: 'ADA8FMMR',
      state: 'draft',
      tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
      comment: 'Cache static assets for 30 days',
      author: 'Herbert Júlio',
      createdAgo: '14 hours ago'
    },
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule "Legacy load balancer"',
      author: 'Rafael Umman',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Marcus Grando',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function "ab-test" arguments',
      author: 'Bruno Germano',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable "API_URL"',
      author: 'Gab Lisboa',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Robson Junior',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule "Legacy load balancer"',
      author: 'Isaque Böck',
      createdAgo: '1 week ago'
    }
  ]
  const version = {
    id: 'ADA8FMMR',
    name: 'ADA8FMMR',
    state: 'draft',
    tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
    comment: 'Cache static assets for 30 days',
    author: 'Herbert Júlio',
    createdAgo: '14 hours ago'
  }
  const earlier = [
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule "Legacy load balancer"',
      author: 'Rafael Umman',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Marcus Grando',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function "ab-test" arguments',
      author: 'Bruno Germano',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable "API_URL"',
      author: 'Gab Lisboa',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Robson Junior',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule "Legacy load balancer"',
      author: 'Isaque Böck',
      createdAgo: '1 week ago'
    }
  ]
  const defaultModules = [
    {
      key: 'protocol_optimization',
      title: 'Protocol Optimization',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Detect device types to configure responsive rules.'
    },
    {
      key: 'custom_code',
      title: 'Custom Code',
      description: 'Run your own code on every request.'
    },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'load_balancing',
      title: 'Load Balancing',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]
  const saveOptions = [
    { label: 'Save and deploy', value: 'deploy' },
    { label: 'Save and build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]

  const versionId = ref('ADA8FMMR')
  const query = ref('')
  const activeTab = ref('main-settings')
  const settings = reactive({
    name: 'web-app',
    active: true,
    modules: {
      protocol_optimization: true,
      cache: true,
      device_detection: false,
      custom_code: true,
      image_optimization: false,
      load_balancing: false,
      web_socket_proxy: false
    }
  })
  const saveAction = ref('deploy')
  const historyCollapsed = ref(true)
  const historyBasis = ref(348)
  const description = ref('Cache static assets for 30 days')
  const draftText = ref('')
  const editing = ref(false)
  const shown = ref(5)

  const matches = computed(() =>
    versions.filter((entry) => entry.name.toLowerCase().includes(query.value.trim().toLowerCase()))
  )

  const openHistory = (event, value) => {
    if (value === 'history' && !historyCollapsed.value) {
      historyCollapsed.value = true
      return
    }
    editing.value = value === 'edit'
    if (editing.value) draftText.value = description.value
    historyCollapsed.value = false
  }
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

              <div class="-ms-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
                <Breadcrumb
                  :items="[]"
                  class="w-full"
                >
                  <Breadcrumb.List>
                    <li class="inline-flex items-center">
                      <Breadcrumb.Item
                        label="Resources"
                        href="/resources"
                      />
                    </li>
                    <Breadcrumb.Separator />
                    <li class="inline-flex items-center">
                      <Breadcrumb.Item
                        label="web-app"
                        href="/resources/1784552864?tab=versions"
                      />
                    </li>
                    <Breadcrumb.Separator />
                    <li class="inline-flex min-w-0 items-center">
                      <div class="min-w-0">
                        <Select
                          :model-value="versionId"
                          :display-value="
                            (id) =>
                              versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
                          "
                          class="w-full"
                          @update:open="
                            (open) => {
                              if (!open) query = ''
                            }
                          "
                        >
                          <Select.Trigger aria-label="Switch version" />
                          <Select.Content>
                            <template #search>
                              <Input
                                v-model="query"
                                size="small"
                                placeholder="Search versions"
                                aria-label="Search versions"
                                @keydown.stop
                              >
                                <template #iconLeft>
                                  <i
                                    class="pi pi-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </template>
                            <Select.Group label="Versions">
                              <Select.Option
                                v-for="entry in matches"
                                :key="entry.id"
                                :value="entry.id"
                              >
                                {{ entry.name }}
                                <template #tag>
                                  <Tag
                                    :label="entry.tag.label"
                                    :severity="entry.tag.severity"
                                    :icon="entry.tag.icon"
                                    size="small"
                                  />
                                </template>
                              </Select.Option>
                              <p
                                v-if="!matches.length"
                                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                              >
                                No versions match "{{ query }}".
                              </p>
                            </Select.Group>
                            <template #footer>
                              <Select.Option
                                value="__create-version__"
                                class="w-full"
                              >
                                <span class="flex items-center gap-(--spacing-xs)">
                                  <i
                                    class="pi pi-plus-circle"
                                    aria-hidden="true"
                                  />
                                  Add Version
                                </span>
                              </Select.Option>
                            </template>
                          </Select.Content>
                        </Select>
                      </div>
                    </li>
                  </Breadcrumb.List>
                </Breadcrumb>
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
              class="hidden h-8 w-56 shrink-0 cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-start text-(--text-default) transition-colors duration-moderate-01 ease-productive-entrance [--input-ring-offset:var(--bg-surface)] [&:not(:focus-visible)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--input-ring-offset,var(--bg-canvas))] motion-reduce:transition-none @min-[47rem]:flex"
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
        <div class="grid h-full min-h-0">
          <Resizable
            orientation="horizontal"
            aria-label="Version workspace"
          >
            <Resizable.Pane aria-label="Version settings">
              <main class="flex min-h-0 min-w-0 flex-1 flex-col">
                <PageTabs v-model="activeTab">
                  <Tabs.Item
                    v-for="tab in tabs"
                    :key="tab.value"
                    :value="tab.value"
                    :label="tab.label"
                  />
                  <template #actions>
                    <Tag
                      label="Draft"
                      severity="warning"
                      icon="pi pi-file-edit"
                      size="medium"
                    />
                    <DropdownMenu
                      placement="bottom-end"
                      @select="openHistory"
                    >
                      <DropdownMenu.Trigger>
                        <IconButton
                          icon="pi pi-ellipsis-h"
                          kind="transparent"
                          size="small"
                          aria-label="Version actions"
                        />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Group>
                        <DropdownMenu.Option
                          value="edit"
                          label="Edit version info"
                        >
                          <template #left>
                            <i
                              class="pi pi-pencil"
                              aria-hidden="true"
                            />
                          </template>
                        </DropdownMenu.Option>
                        <DropdownMenu.Option
                          value="history"
                          :label="
                            historyCollapsed ? 'Show version history' : 'Hide version history'
                          "
                        >
                          <template #left>
                            <i
                              class="pi pi-history"
                              aria-hidden="true"
                            />
                          </template>
                        </DropdownMenu.Option>
                      </DropdownMenu.Group>
                    </DropdownMenu>
                  </template>
                </PageTabs>

                <section
                  class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
                >
                  <ScrollArea
                    aria-label="Version settings"
                    fade
                  >
                    <div class="flex min-h-full flex-col">
                      <fieldset class="contents">
                        <legend class="sr-only">web-app ADA8FMMR</legend>
                        <form
                          class="flex min-h-full flex-col"
                          aria-label="Main settings"
                          novalidate
                          @submit.prevent
                        >
                          <div
                            class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
                          >
                            <PageHeader
                              title="Settings"
                              description="Core configuration for this resource."
                              size="small"
                            />

                            <fieldset
                              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
                            >
                              <legend class="sr-only">Main settings</legend>

                              <SettingsSection
                                title="General"
                                hint="How this resource is identified across the console, and whether it is serving traffic."
                                anchor="general"
                              >
                                <Card :padded="false">
                                  <template #content>
                                    <Item.List>
                                      <SettingRow
                                        title="Name"
                                        description="A unique and descriptive name to identify the resource."
                                      >
                                        <Input
                                          v-model="settings.name"
                                          size="large"
                                          class="w-full"
                                          aria-label="Name"
                                        />
                                      </SettingRow>
                                      <SettingRow
                                        title="Active"
                                        description="When disabled, the resource stops serving traffic."
                                        kind="compact"
                                      >
                                        <Switch
                                          v-model="settings.active"
                                          aria-label="Active"
                                        />
                                      </SettingRow>
                                    </Item.List>
                                  </template>
                                </Card>
                              </SettingsSection>

                              <SettingsSection
                                title="Modules"
                                hint="The capabilities this resource runs with, each of which can be toggled here."
                                anchor="modules"
                              >
                                <Card :padded="false">
                                  <template #content>
                                    <Item.List>
                                      <SettingRow
                                        v-for="mod in defaultModules"
                                        :key="mod.key"
                                        :title="mod.title"
                                        :description="mod.description"
                                        kind="compact"
                                      >
                                        <Switch
                                          v-model="settings.modules[mod.key]"
                                          :aria-label="mod.title"
                                        />
                                      </SettingRow>
                                    </Item.List>
                                  </template>
                                </Card>
                              </SettingsSection>

                              <SettingsSection
                                title="Subscription modules"
                                hint="Paid add-ons that are activated with sales, not from this page."
                                anchor="subscription-modules"
                              >
                                <Card :padded="false">
                                  <template #content>
                                    <Item.List>
                                      <SettingRow
                                        title="WebSocket Proxy"
                                        kind="compact"
                                      >
                                        <template #description>
                                          Enhance real-time data exchange between your resource and
                                          backend services using the WebSocket protocol.
                                          <a
                                            href="https://example.com/contact-sales"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                                          >
                                            Contact sales
                                            <i
                                              class="pi pi-external-link shrink-0 text-body-sm leading-none"
                                              aria-hidden="true"
                                            />
                                          </a>
                                        </template>
                                        <Tooltip text="Contact sales to activate this module.">
                                          <Switch
                                            v-model="settings.modules.web_socket_proxy"
                                            disabled
                                            aria-label="WebSocket Proxy"
                                          />
                                        </Tooltip>
                                      </SettingRow>
                                    </Item.List>
                                  </template>
                                </Card>
                              </SettingsSection>
                            </fieldset>
                          </div>
                        </form>
                      </fieldset>
                    </div>
                  </ScrollArea>
                </section>

                <Transition
                  appear
                  enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
                  enter-from-class="translate-y-2 opacity-0"
                >
                  <footer
                    class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
                    data-testid="version-detail-bar"
                  >
                    <div
                      class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
                    >
                      <span
                        class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
                        aria-hidden="true"
                      >
                        <i class="pi pi-file-edit text-body-sm text-(--text-default)" />
                      </span>
                      <div
                        class="flex min-w-0 flex-1 flex-col"
                        role="status"
                      >
                        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <span class="truncate text-body-sm text-(--text-default)">Draft</span>
                          <span class="hidden shrink-0 sm:inline-flex">
                            <Tag
                              label="Editable"
                              severity="info"
                              size="small"
                            />
                          </span>
                        </div>
                        <p
                          class="hidden truncate text-body-xs text-(--text-muted) data-dirty:text-(--text-default) md:block"
                          title="This version is open for editing. Deploy it when ready."
                        >
                          This version is open for editing. Deploy it when ready.
                        </p>
                      </div>

                      <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                        <SplitButton
                          :label="saveOptions.find((option) => option.value === saveAction).label"
                          :icon="saveAction === 'deploy' ? 'pi pi-cloud-upload' : ''"
                          kind="primary"
                          size="medium"
                          :model="saveOptions"
                          @item-click="(event, item) => (saveAction = item.value)"
                        />
                      </div>
                    </div>
                  </footer>
                </Transition>
              </main>
            </Resizable.Pane>
            <Resizable.Handle
              v-if="!historyCollapsed"
              aria-label="Resize the version history"
            />
            <Resizable.Pane
              v-model:basis="historyBasis"
              v-model:collapsed="historyCollapsed"
              collapsible
              :min="280"
              :max="560"
              aria-label="Version history"
            >
              <aside
                :inert="historyCollapsed"
                aria-labelledby="version-history-title"
                class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
                data-testid="version-detail-history"
                @keydown.esc="historyCollapsed = true"
              >
                <header
                  class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm)"
                >
                  <h2
                    id="version-history-title"
                    class="truncate text-label-lg text-(--text-default)"
                  >
                    Version history
                  </h2>
                  <IconButton
                    icon="pi pi-times"
                    kind="transparent"
                    size="small"
                    aria-label="Close version history"
                    @click="historyCollapsed = true"
                  />
                </header>
                <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
                  <ol class="flex flex-col">
                    <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
                      <span
                        class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                        aria-hidden="true"
                      />
                      <span
                        class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-contrast)"
                        aria-hidden="true"
                      >
                        <i class="pi pi-file-edit text-body-xs" />
                      </span>
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <span class="truncate text-label-md text-(--text-default)">
                            {{ version.name }}
                          </span>
                          <span class="flex shrink-0">
                            <Tag
                              :label="version.tag.label"
                              :severity="version.tag.severity"
                              size="small"
                            />
                          </span>
                          <span
                            v-if="!editing"
                            class="ms-auto shrink-0"
                          >
                            <IconButton
                              icon="pi pi-pencil"
                              kind="transparent"
                              size="small"
                              aria-label="Edit version info"
                              @click="
                                () => {
                                  draftText = description
                                  editing = true
                                }
                              "
                            />
                          </span>
                        </div>
                        <p class="text-label-sm text-(--text-muted)">Current version</p>

                        <div
                          v-if="editing"
                          class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)"
                        >
                          <Field>
                            <Field.Label>Description</Field.Label>
                            <Textarea
                              v-model="draftText"
                              placeholder="What changed in this version?"
                            />
                            <Field.Description
                              >Shows in the version list and on the deployment.</Field.Description
                            >
                          </Field>
                          <div class="flex justify-end gap-(--spacing-xs)">
                            <Button
                              label="Cancel"
                              kind="outlined"
                              size="small"
                              @click="editing = false"
                            />
                            <Button
                              label="Save"
                              kind="primary"
                              size="small"
                              @click="
                                () => {
                                  description = draftText.trim()
                                  editing = false
                                }
                              "
                            />
                          </div>
                        </div>
                        <template v-else>
                          <p
                            :data-empty="!description || null"
                            class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
                          >
                            {{ description || 'No description' }}
                          </p>
                          <span
                            class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                          >
                            <span class="flex shrink-0">
                              <Avatar
                                :alt="version.author"
                                :label="version.author"
                                size="small"
                                kind="square"
                              />
                            </span>
                            <span class="truncate"
                              >{{ version.author }} · {{ version.createdAgo }}</span
                            >
                          </span>
                        </template>
                      </div>
                    </li>

                    <li class="relative flex flex-col pb-(--spacing-lg)">
                      <span
                        class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                        aria-hidden="true"
                      />
                      <p class="flex gap-(--spacing-sm)">
                        <span
                          class="relative flex size-7 shrink-0 items-center justify-center"
                          aria-hidden="true"
                        >
                          <span
                            class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)"
                          />
                        </span>
                        <span class="pt-1 text-body-sm text-(--text-muted)">
                          No changes yet. Each change you save shows up here.
                        </span>
                      </p>
                    </li>

                    <li
                      v-for="(entry, index) in earlier.slice(0, shown)"
                      :key="entry.id"
                      class="relative flex pb-(--spacing-lg) last:pb-0"
                    >
                      <span
                        v-if="index < earlier.slice(0, shown).length - 1"
                        class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                        aria-hidden="true"
                      />
                      <button
                        type="button"
                        class="group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                      >
                        <span
                          class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                          aria-hidden="true"
                        >
                          <i class="pi pi-code text-body-xs" />
                        </span>
                        <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <span
                              class="truncate text-label-md text-(--text-default) group-hover:underline"
                            >
                              {{ entry.name }}
                            </span>
                            <span class="flex shrink-0">
                              <Tag
                                :label="entry.tag.label"
                                :severity="entry.tag.severity"
                                size="small"
                              />
                            </span>
                          </span>
                          <span class="line-clamp-2 text-body-sm text-(--text-muted)">
                            {{ entry.comment }}
                          </span>
                          <span
                            class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                          >
                            <span class="flex shrink-0">
                              <Avatar
                                :alt="entry.author"
                                :label="entry.author"
                                size="small"
                                kind="square"
                              />
                            </span>
                            <span class="truncate"
                              >{{ entry.author }} · {{ entry.createdAgo }}</span
                            >
                          </span>
                        </span>
                      </button>
                    </li>
                  </ol>

                  <div
                    v-if="earlier.length > shown"
                    class="pt-(--spacing-sm)"
                  >
                    <Button
                      label="Show older"
                      kind="transparent"
                      size="small"
                      @click="shown += 5"
                    />
                  </div>
                </div>
              </aside>
            </Resizable.Pane>
          </Resizable>
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
