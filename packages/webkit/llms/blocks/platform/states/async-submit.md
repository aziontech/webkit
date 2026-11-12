# AsyncSubmit (`platform/states/async-submit`)

> The async counterpart of the server rejection in the FormError template: a deploy that runs for about half a minute, so the user walks away before it ends. The page heading carries the run status as a `Tag`; a dashed simulation panel picks the ending with a `ToggleGroup` and starts the run; below it the page shows an `EmptyState` while idle, the deployment logs card while it runs, a danger `Alert` with Edit and Redeploy over the stopped logs when it fails, and a success `Alert` with Edit, Redeploy and Open service once it is live. Progress and the outcome also ride a toast wherever the user is: one `Toaster` is mounted with the page, the Running frame shows the progress toast, and the failure (permanent) and success toasts carry Edit and Redeploy. Built from `PageHeader`, the platform shell, `Tag`, `ToggleGroup`, `Button`, `EmptyState`, `Alert`, and the deployment logs card from Templates/Platform/Create/DeploymentFlow (`Card`, `StatusIndicator`, `Accordion`, `LogView`, `Spinner`, `Progress`).

- Surface: product
- Source: `blocks/platform/states/async-submit/async-submit.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/states/async-submit")`
- Components: [Accordion](../../../components/accordion.md), [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Brand](../../../components/brand.md), [Breadcrumb](../../../components/breadcrumb.md), [Button](../../../components/button.md), [ButtonHighlight](../../../components/button-highlight.md), [Card](../../../components/card.md), [Command](../../../components/command.md), [Drawer](../../../components/drawer.md), `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [GlobalHeader](../../../components/global-header.md), [IconButton](../../../components/icon-button.md), [LogView](../../../components/log-view.md), `LogViewContent`, [Menu](../../../components/menu.md), [PageHeader](../../../components/page-header.md), [Progress](../../../components/progress.md), [SearchTrigger](../../../components/search-trigger.md), [Sidebar](../../../components/sidebar.md), [Spinner](../../../components/spinner.md), [StatusIndicator](../../../components/status-indicator.md), [Tag](../../../components/tag.md), [ThemeSwitcher](../../../components/theme-switcher.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-errors`, `webkit-ui-states`, `webkit-form`

## Asked as

async submit; long running action; background job status; deploy in progress; async deploy result; operation status; envio assíncrono; ação demorada; status da operação

The async-action pattern, taken from the design sample (`/forms/async-deployment`), and the standard for every build and deploy screen. A long-running action the user is free to walk away from: a deploy that runs for about half a minute and asks nothing while it does. The user's job is to start it, go on working anywhere in the console, and learn how it ended without coming back to check. The page that started the run shows its status in the heading, the logs while it runs and an inline outcome when it ends; in a full app the run lives outside the page, so its progress and its outcome also travel with the user as a toast, on success and on failure.

## When to use

- Any action that takes long enough to leave: build, deploy, redeploy, import, provision, a bulk change.
- When the outcome must reach the user on whatever page they are on when it lands.
- As the reference for the idle, running, failed and succeeded states of a run started from a page.

## When not to use

- A save that answers in about a second: use `platform/states/form-validation`.
- The full deployment flow with its own steps and logs page: use `platform/create/deployment-flow` and `platform/detail/deployment-logs`.
- Confirming a finished deploy with next steps: use `platform/create/deploy-success`.
- A deploy configured in a side panel: use `platform/create/deploy-drawer`.

## Building blocks

The shell parts (A to O, T to W) are the console frame from `shells/console`; follow that block for their rules. They are listed here because the run must keep reporting while the user moves through them.

### A. Navigation rail — `Sidebar` (required)

The console's side navigation, collapsible to a rail at `md` and up. Opening any module from it while a run is in progress must not cancel the run.

### B. Product mark — `Brand` (required)

In the rail's head and in the global header, inside a link to Home.

### C. Search and commands — `Command` (required)

The palette in the rail: resources, pages, actions (theme, collapse the sidebar) and account, with `Command.Empty` copy when nothing matches.

### D. Module menu — `Menu` (required)

The rail's grouped navigation (Build, Security, Data, Observability), with drill-in modules and `Menu.Back`.

### E. Account avatar — `Avatar` (required)

The signed-in user at the foot of the rail and in the header.

### F. Account menu — `DropdownMenu` (required)

Opens from the account trigger with account options, the theme switch and the plan.

### G. Hint — `Tooltip` (required)

Names every icon-only control in the shell (Account menu, the rail toggle, search, help).

### H. Icon action — `IconButton` (required)

Icon-only shell controls, each with an `aria-label` equal to its tooltip.

### I. Theme — `ThemeSwitcher` (required)

Inside the account menu.

### J. Actions — `Button` (required)

In the shell (Create, the plan entry) and on the page: **Deploy** starts the run and shows `loading` while it runs, **Reset scenario** (`kind="transparent"`) belongs to the simulation only, and the `EmptyState` repeats **Deploy** as its action.

### K. Plan status — `StatusIndicator` (required)

The status dot in the account menu's plan entry.

### L. Top bar — `GlobalHeader` (required)

`aria-label="Console"`, with the rail toggle, brand and location on the start side and search, help, Create and the avatar on the end side.

### M. Location — `Breadcrumb` (required)

Where the page sits in the console.

### N. Search — `SearchTrigger` (required)

The header search, first in the end cluster: the field (`Search` with the ⌘K / Ctrl K keycap) while the bar is at least `--container-2xl` wide, the magnifier alone below that (`collapsible`, inside the header's `@container`). It emits `open` on click and on the shortcut and opens the `Command` palette. Never hand-rolled (rule `webkit-header-search`).

### O. Upgrade — `ButtonHighlight` (required)

The plan call to action in the header.

### P. Page heading — `PageHeader` (required)

`size="large"`, the page title and one sentence on what the run does. Its `#actions` slot carries the run status as a `Tag`, so the state of the run is readable from the heading in every state.

### Q. Run status — `Tag` (required)

In the heading: `Idle` (`secondary`), `Deploying` (`info`), `Failed` (`danger`), `Deployed` (`success`). One to two words, never a sentence. In the simulation panel a `secondary` tag names the repository.

### R. Simulated ending — `ToggleGroup` (simulation only)

`Succeeds` or `Fails`, in a dashed `aside` labelled `Scenario simulation`, disabled while a run is in progress. The ending is kept in the URL (`?outcome=`) so a run is linkable. It is a story device: a real page has no such control.

### S. Nothing running — `EmptyState` (idle only)

`bordered`, the deploy glyph, a title, one sentence and **Deploy** as its only action. It gives way to the logs card once a run starts.

### T. Mobile navigation — `Drawer` (below `md`)

The rail rendered in a drawer on small screens.

### U. Drawer layer — `DrawerPortal` (below `md`)

Mounts the drawer at the document root.

### V. Drawer backdrop — `DrawerOverlay` (below `md`)

Dims the page behind the open drawer.

### W. Drawer panel — `DrawerContent` (below `md`)

Holds the `Sidebar`, labelled `aria-label="Navigation"`; choosing an item closes it.

### X. Run toast — `Toaster` (required)

One `Toaster` (named export of `@aziontech/webkit/toast`, beside `toast`) mounted with the page, `position="bottom-right"`, with no slot of its own, raised through `toast` with one id per run so each state replaces the last. Every outcome toast passes `actions: [{ label: 'Edit', onClick }, { label: 'Redeploy', onClick }]` and `closable: true`, so the `Toaster` renders both as `Toast.Action`s beside `Toast.Close`; the progress toast carries no action. The Running frame raises the progress toast, Failed the permanent failure toast and Succeeded the success toast; leaving the page dismisses the story's toast so the next story starts clean.

## Do

- Keep the run, its timer and its outcome outside the page component (a small module-scope store), so leaving the page never cancels it or loses the result.
- Show progress as a `loading` toast (no duration, not closable) that follows the user through the app while the run lasts.
- Report the end wherever the user is, on success and on failure. A failure toast is permanent (`duration: 0`) and `closable`; a success toast is `closable` with the default 6 second duration.
- Give both toasts the same two actions through `toast()`'s `actions` option: **Edit** for the item that was deployed, and **Redeploy**. Don't rebuild the toast body in the `Toaster` slot to get two actions.
- On the page that started the run, show the outcome inline as well, with the same two actions as the toast: a danger `Alert` with the reason, **Edit** and **Redeploy** over the stopped logs, or a success `Alert` naming the new address with **Edit**, **Redeploy** and **Open service**.
- Disable Deploy and the controls that would change the run while it is in progress, with Deploy in `loading`.
- Use one toast id per run, so the progress toast turns into the outcome toast in place, and a Redeploy turns it back into progress.
- Apply this to every build and deploy screen (deploy drawers, deployment flows, redeploys from a list, imports): the run lives outside the page, the page shows the status `Tag` and the outcome `Alert`, and the toast reports wherever the user is.

## Don't

- Don't tie the run to the component that started it; unmounting a page is not an event the run hears.
- Don't let a failure toast expire; the user was not there when it arrived.
- Don't point the toast at a list of runs ("View deployments"); it carries **Edit** and **Redeploy**.
- Don't block the page with a modal or overlay while the run is in progress; the whole point is that the user can leave.
- Don't claim an outcome before the server confirms it; the heading reads `Deploying` until it does.

## Copy

- **Page heading:** names the action, sentence case: `Async deployment`. Lead: what the run does and that the user may leave: `A deploy runs for half a minute and asks nothing of you while it does.`
- **Status tag:** one or two words: `Idle`, `Deploying`, `Failed`, `Deployed`.
- **Empty state:** title states the fact, description says what to do: `No deployment running` / `Start one above. It takes about 25 seconds.`
- **Progress toast:** present progressive with the single-character ellipsis, names the item: `Deploying web-app…`; description names the source and that the user may leave: `acme/web-app. It keeps running if you leave.`
- **Failure toast:** what failed and why, then the ways out: `web-app wasn't deployed.` / `The routing rules were refused.` Actions: `Edit`, `Redeploy`.
- **Success toast:** past tense, names the item and where it is live: `web-app is live.` / `It is available at web-app.example.com.` Actions: `Edit`, `Redeploy`.
- **Failure Alert:** the reason the server gave, as full sentences, with `Edit` and `Redeploy`.
- **Success Alert:** names the address and the attempts: `web-app is live at web-app.example.com. It took 1 attempt.`, with `Edit`, `Redeploy` and `Open service`.
- **Simulation panel:** a colon, never a dash: `Simulation: how this deploy ends`.
- **Actions:** `Deploy`, `Redeploy` (never "Retry deploy" or "Try again"), `Edit`, `Open service`.

## Accessibility

- The run status is text in the heading's `Tag`, not color alone.
- Toasts are announced politely by the `Toaster`; the progress toast must not steal focus.
- The failure toast's actions and close button are reachable by keyboard, and it stays until closed.
- The simulation panel is an `aside` with its own label so screen reader users can skip it.
- The logs card (Running and Failed) streams into a `LogView`; do not announce every log line.
- Page entrance and the outcome `Alert` animate with `motion-reduce:animate-none`.

## States

- Idle: nothing running; the heading reads Idle and the `EmptyState` offers Deploy.
- Running: mid-run; the heading reads Deploying, the simulation controls are disabled, Deploy shows `loading`, the logs card streams under the Building status and the progress toast reads `Deploying web-app…`.
- Failed: the routing rules were refused; the heading reads Failed, the danger `Alert` carries the reason with Edit and Redeploy, the permanent failure toast carries the same two actions, and the logs stay open on the failed step.
- Succeeded: the run is live; the heading reads Deployed, the success `Alert` names the new address with Edit, Redeploy and Open service, the success toast carries Edit and Redeploy, and the logs card is gone.

## Related

- `platform/states/form-validation` — the synchronous counterpart: field, section and toast placement for a save that answers right away.
- `platform/create/deployment-flow` — the deployment logs card the Running and Failed states reuse.
- `platform/detail/deployment-logs` — the full logs of a run, the page Edit or a failure leads into.
- `platform/create/deploy-success` — the confirmation page after a deploy completes.
- `shells/console` — the frame the user moves through while the run reports back.

## Variants

- `Idle` — primary (the code below)
- `Running` — Mid-run: the progress toast reads Deploying web-app…, the heading reads Deploying, the simulation controls are disabled while Deploy shows its loading state, and the logs card streams under the Building status.
- `Failed` — The routing rules were refused: the heading reads Failed, the danger Alert carries the reason with Edit and Redeploy, the permanent failure toast carries the same two actions, and the logs card stays open on the failed step with the Phased or Complete switch.
- `Succeeded` — The run is live: the heading reads Deployed and the success Alert names the new address with Edit, Redeploy and Open service, the success toast carries Edit and Redeploy, and the logs card is gone.

Each variant is the same screen in another state: `get_pattern("platform/states/async-submit", { variant })`, or the file under `blocks/platform/states/async-submit/variants/`.

## Code (`Idle`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Command from '@aziontech/webkit/command'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import PageHeader from '@aziontech/webkit/page-header'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Sidebar from '@aziontech/webkit/sidebar'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'

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

  const breadcrumb = [{ label: 'Deployments', href: '/deployments' }, { label: 'Async deployment' }]

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

  const REPO = { name: 'web-app', scope: 'acme' }

  const outcome = ref('success')
  const status = ref('idle')
  const running = computed(() => status.value === 'running')

  const outcomes = computed(() =>
    [
      { label: 'Succeeds', value: 'success' },
      { label: 'Fails', value: 'error' }
    ].map((option) => ({ ...option, disabled: running.value }))
  )

  const statusTag = computed(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'secondary' }
  })

  const RUN_TOAST = 'async-submit-run'

  onBeforeUnmount(() => toast.dismiss(RUN_TOAST))
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
                  :items="breadcrumb"
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
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto layout-boundary"
      >
        <main class="layout-column-focused flex min-h-full flex-col">
          <PageHeader
            title="Async deployment"
            description="A deploy runs for half a minute and asks nothing of you while it does. Start one, then open any module in the sidebar. The run keeps going and reports back through the toast, wherever you are."
            size="large"
          >
            <template #actions>
              <Tag
                :label="statusTag.label"
                :severity="statusTag.severity"
                size="medium"
              />
            </template>
          </PageHeader>

          <aside
            aria-label="Scenario simulation"
            class="layout-section-start flex flex-col gap-(--spacing-md) rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-lg)"
          >
            <div class="flex flex-wrap items-center justify-between gap-(--spacing-sm)">
              <p class="m-0 text-overline-sm text-(--text-muted)">
                Simulation: how this deploy ends
              </p>
              <Tag
                :label="`${REPO.scope}/${REPO.name}`"
                severity="secondary"
                size="medium"
              />
            </div>
            <p class="m-0 text-body-sm text-(--text-muted)">
              The ending is held in the URL (<code class="text-label-code-sm">?outcome=</code>), so
              a run is linkable and survives a reload. Select one, press Deploy, and leave the page.
              The toast follows you and settles wherever you are.
            </p>
            <div class="flex flex-wrap items-center gap-(--spacing-sm)">
              <ToggleGroup
                v-model="outcome"
                :options="outcomes"
                aria-label="Simulated deployment outcome"
              />
              <Button
                label="Deploy"
                kind="primary"
                size="medium"
                icon="pi pi-play"
                :loading="running"
                :disabled="running"
              />
              <Button
                label="Reset scenario"
                kind="transparent"
                size="medium"
                :disabled="running"
              />
            </div>
          </aside>

          <div class="layout-section-start">
            <EmptyState
              bordered
              icon="pi pi-cloud-upload"
              title="No deployment running"
              description="Start one above. It takes about 25 seconds, long enough to walk away from, which is the whole point."
            >
              <template #actions>
                <Button
                  label="Deploy"
                  kind="primary"
                  size="medium"
                />
              </template>
            </EmptyState>
          </div>
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

    <Toaster position="bottom-right" />
  </div>
</template>
```
