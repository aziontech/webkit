# VersionDetail (`platform/detail/version-detail`)

> One version of a resource, opened from its Versions tab, as a page body for ConsoleLayout: the layout's last crumb is a transparent select that switches between the resource versions, each with its state Tag, or creates a new one (the page sets it with `ConsoleLayout.Breadcrumbs`; below md the body's own row carries it with a Back button); the root carries `data-layout-fill`, so the layout's main gives the workspace the height under the header. In the body a horizontal `Resizable` holds the version workspace, a tab bar with Settings, Source, Variables, Cache Settings, Custom Code and Rules carrying the state Tag and a Version actions menu, the open tab in a fading `ScrollArea`, and the version bar pinned to the bottom that names the state and holds the Save and deploy `SplitButton` on a draft or Add Version and Redeploy on a built version, and a collapsible Version history pane with the current version, its changes and the earlier built versions. The stories open on the Settings tab; the Rules tab is the Edit/RuleBuilder template, and the Source, Variables, Cache Settings and Custom Code panels are not plotted here. Built from `ConfirmDialog`, `PageHeader`, `PageTabs`, `SettingsSection`, `SettingRow`, `Select`, `Resizable`, `Tabs`, `Tag`, `DropdownMenu`, `ScrollArea`, `Card`, `Item`, `Input`, `Switch`, `SplitButton`, `Button`, `Avatar`, `Field` and `Textarea`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body.

- Surface: product
- Source: `blocks/platform/detail/version-detail/version-detail.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/version-detail")`
- Components: [Avatar](../../../components/avatar.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [ConfirmDialog](../../../components/confirm-dialog.md), [ConsoleLayout](../../../components/console-layout.md), [DropdownMenu](../../../components/dropdown-menu.md), [Field](../../../components/field.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Item](../../../components/item.md), [PageHeader](../../../components/page-header.md), [PageTabs](../../../components/page-tabs.md), [Resizable](../../../components/resizable.md), [ScrollArea](../../../components/scroll-area.md), [Select](../../../components/select.md), [SettingRow](../../../components/setting-row.md), [SettingsSection](../../../components/settings-section.md), [SplitButton](../../../components/split-button.md), [Switch](../../../components/switch.md), [Tabs](../../../components/tabs.md), [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-ui-states`

## Asked as

version detail; resource version; draft version; version history; version switcher; versioned settings; detalhe da versão; histórico de versões; versão rascunho; revert version; rollback version; reverter versão; revertir versión; environment switcher; environment crumb; switch environment; seletor de ambiente

One version of a resource, opened from its Versions tab. The user is here to change a draft and ship it, or to read what a built version holds and redeploy it or branch a new version from it. The page keeps the version they are on in the breadcrumb, where they can switch to another, puts the version's settings in tabs, pins the state and the save or deploy action to the bottom, and opens the version history beside the work when they need to see what changed. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the breadcrumb, the ⌘K palette and the `main`. The workspace pins its own bars, so its root carries `data-layout-fill`: the layout's `main` stops scrolling, the root fills it (`h-dvh` only sizes a standalone preview) and its panes scroll.

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

### A. Version switcher — `ConsoleLayout`, `Select`, `Input`, `Tag`, `IconButton`, `Tooltip` (required)

The page sets the trail with `ConsoleLayout.Breadcrumbs`: `items` are the module and the resource, and the slot holds the version, a `Select` with `kind="transparent"`, `size="small"` and `aria-label="Switch version"`, no `w-full`. The version is part of the route, so picking one navigates. Its content has a small search `Input`, a Versions group where each option carries its state `Tag` (Draft, Deployed, Ready), a no-match line, and a footer option that creates a new version. The version is never a page title.

The layout hides its breadcrumbs while compact, so the body opens on a row (`md:hidden`, its own `nav` named Breadcrumb) that carries a Back `IconButton` to the resource's Versions tab and the same `Select` crumbs, full width: the version, and in EnvironmentCrumb the environment before it. A phone keeps every switch the desktop breadcrumb offers.

### B. Workspace — `Resizable` (required)

A horizontal `Resizable` named "Version workspace": the version settings pane, a handle named "Resize the version history", and the collapsible Version history pane. History is closed by default.

### C. Version tab bar — `PageTabs`, `Tabs`, `Tag`, `DropdownMenu`, `IconButton` (required)

`PageTabs` with one `Tabs.Item` per area: Settings, Source, Variables, Cache Settings, Custom Code, Rules. The tab row ends on the version's state `Tag` and an outlined Version actions `IconButton` whose `DropdownMenu` holds Edit version info and the toggle for Version history.

### D. Settings panel — `ScrollArea`, `PageHeader`, `SettingsSection`, `Card`, `Item`, `SettingRow`, `Input`, `Switch`, `Tooltip` (required)

The open tab scrolls in a fading `ScrollArea`. A small `PageHeader` names the tab, then `SettingsSection`s (General, Modules, Subscription modules) each hold a `Card :padded="false"` with an `Item.List` of `SettingRow`s: a title, a one-sentence description and its control, an `Input` or a `Switch`. A module that needs a sales contact keeps its `Switch` disabled, explained by a `Tooltip`. On a built version the whole fieldset is disabled.

### E. Version bar — `Tag`, `SplitButton`, `Button` (required)

A bar pinned to the bottom of the settings pane, aligned with the column above it. It names the state with a `Tag` and one sentence. On a draft it holds a primary medium `SplitButton` that saves and deploys, with Save and build and Save in its menu. On a built version it reads Viewing a deployed version with a Read-only tag and offers Add Version and Redeploy.

### F. Version history — `IconButton`, `Tag`, `Field`, `Textarea`, `Button`, `Avatar` (optional)

The side pane titled "Version history", closed with an `IconButton`. It starts on the current version with its `Tag`, its description, its author `Avatar` and a pencil that edits the description in place through a `Field` with a `Textarea` and Cancel and Save `Button`s. Then the changes entry, empty until something is saved, then the five newest earlier versions and Show older for the rest.

### G. Revert — `Button`, `Tag` (optional, on an earlier Ready version)

An earlier version opened from Version history keeps the page read-only and says Viewing an earlier version, with the entry in history marked by a Viewing `Tag` and `aria-current`. The version bar's primary action is Revert to <id>, the trigger of a `ConfirmDialog` with `kind="primary"` and `size="medium"`. Its body is the diff against the deployed version: a bordered list of the settings that change, each with its old and new value in words, a line with the rules added and removed, and a description saying that reverting deploys <id> to Production and that the deployed version stays in history. Confirm closes the dialog and starts the async-submit run: one toast id that turns from a loading toast ("Reverting to <id>…", "It keeps running if you leave.") into the outcome, which stays until closed and carries **Edit** and **Redeploy**, never View deployments. On success the version's `Tag` reads Deployed in the breadcrumb, the tab row and the history, and the bar offers Redeploy.

## Do

- Keep one primary action on the page, in the version bar; the tabs share it.
- Lock the settings fieldset, not each control one by one, when the version is built.
- Let the user switch versions from the breadcrumb without going back to the list.
- Set the trail from the page with `ConsoleLayout.Breadcrumbs`, and mark the root with `data-layout-fill`.
- Show the state in three places that agree: the breadcrumb option, the tab row tag and the version bar.
- Keep the history pane collapsible and resizable so the settings keep their width when it is closed.
- Show what a revert changes before it runs: the settings with old and new values, and the rules added and removed.
- Report a revert like any deploy: one toast that turns into the outcome, with Edit and Redeploy.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so this page body never renders a `Toaster`.

## Don't

- Don't let a built version look editable; disable the fieldset and say Read-only.
- Don't size the body with `calc(100dvh - …)`.
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

- The body renders no `main`: the layout's single `main` holds the workspace; the Settings `PageHeader` title is its heading, and the history pane is a region labelled by its "Version history" `h2`.
- The resize handle has an `aria-label` and works with arrow keys.
- The version `Select` trigger is named "Switch version"; its search input is named "Search versions".
- Every `Switch` and `Input` in a setting row has an `aria-label` that matches the row title.
- A disabled control with a reason gets a `Tooltip` that the keyboard can reach.
- The revert dialog traps focus, is named by its title and returns focus to Revert on close. Each changed setting carries a visually hidden sentence ("changes from On to Off"); the struck-through values and the arrow are `aria-hidden`. The toasts live in the app's one `Toaster` region (the app mounts it; the page body only calls `toast`), and the bar's status line announces "Reverting to <id>…".
- Icon-only buttons (Version actions, Close version history, Edit version info) have an `aria-label`; decorative icons are `aria-hidden`.

## States

- Draft: the editable draft on its Settings tab, with the Editable tag and the Save and deploy split button in the version bar.
- Deployed: the deployed version, read-only, the fieldset disabled and the version bar offering Add Version and Redeploy.
- Revert: an earlier Ready version, read-only, with history open, Revert to <id> in the bar, a confirmation with the diff, and the revert reported by a toast with Edit and Redeploy.
- VersionHistory: the draft with Version history open beside it, the current version, the empty changes entry and the five newest earlier versions.
- EnvironmentCrumb: a resource that is deployed to several environments. The page's `ConsoleLayout.Breadcrumbs` ends on two control crumbs, environment then version, each a small transparent `Select` with a search field (`Switch environment`, `Switch version`). Environments carry their deployment policy as a `Tag` and Add Environment in the footer; picking an environment moves the version crumb to the version live there, and each version option says where it is live (Live in Production). The environment always comes before the version, because a version is chosen within an environment.

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
- `EnvironmentCrumb` — The same version page reached from an environment: the trail reads Resources, the resource, then two `Select` crumbs (the page's `ConsoleLayout.Breadcrumbs` from md up, the body's own row below md). The environment crumb searches the environments, tags each with its deployment policy and offers Add Environment at its foot; picking one moves the version crumb to the version that environment serves. The version crumb marks each version with the environments it is live in, beside its state `Tag`.

Each variant is the same screen in another state: `get_pattern("platform/detail/version-detail", { variant })`, or the file under `blocks/platform/detail/version-detail/variants/`.

## Code (`Draft`)

```vue
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import SplitButton from '@aziontech/webkit/split-button'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'

  type VersionEntry = {
    id: string
    name: string
    state: string
    tag: { label: string; severity: TagSeverity; icon: string }
    comment: string
    author: string
    createdAgo: string
  }

  const tabs = [
    { value: 'main-settings', label: 'Settings' },
    { value: 'source', label: 'Source' },
    { value: 'variables', label: 'Variables' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'custom-code', label: 'Custom Code' },
    { value: 'rules', label: 'Rules' }
  ]
  const versions: VersionEntry[] = [
    {
      id: 'ADA8FMMR',
      name: 'ADA8FMMR',
      state: 'draft',
      tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
      comment: 'Cache static assets for 30 days',
      author: 'John Smith',
      createdAgo: '14 hours ago'
    },
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Sam Lee',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Priya Patel',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Chris Taylor',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Riley Carter',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Ethan Brooks',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Jordan Kim',
      createdAgo: '1 week ago'
    }
  ]
  const version: VersionEntry = {
    id: 'ADA8FMMR',
    name: 'ADA8FMMR',
    state: 'draft',
    tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
    comment: 'Cache static assets for 30 days',
    author: 'John Smith',
    createdAgo: '14 hours ago'
  }
  const earlier: VersionEntry[] = [
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Sam Lee',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Priya Patel',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Chris Taylor',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Riley Carter',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Ethan Brooks',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Jordan Kim',
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
  const settings = reactive<{ name: string; active: boolean; modules: Record<string, boolean> }>({
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
  const saveAction = ref<string | undefined>('deploy')
  const historyCollapsed = ref(true)
  const historyBasis = ref(348)
  const description = ref('Cache static assets for 30 days')
  const draftText = ref('')
  const editing = ref(false)
  const shown = ref(5)

  const matches = computed(() =>
    versions.filter((entry) => entry.name.toLowerCase().includes(query.value.trim().toLowerCase()))
  )

  const openHistory = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuOptionValue) => {
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
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <ConsoleLayout.Breadcrumbs
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: 'web-app', href: '/resources/1784552864' }
      ]"
    >
      <Select
        kind="transparent"
        size="small"
        :model-value="versionId"
        :display-value="(id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')"
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
              No versions match"{{ query }}".
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
    </ConsoleLayout.Breadcrumbs>
    <nav
      aria-label="Breadcrumb"
      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
    >
      <Tooltip text="Back to web-app versions">
        <IconButton
          icon="pi pi-arrow-left"
          kind="transparent"
          size="medium"
          href="/resources/1784552864?tab=versions"
          aria-label="Back to web-app versions"
        />
      </Tooltip>
      <div class="min-w-0 flex-1">
        <Select
          :model-value="versionId"
          :display-value="
            (id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
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
                No versions match"{{ query }}".
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
    </nav>
    <div class="grid min-h-0 flex-1">
      <Resizable
        orientation="horizontal"
        aria-label="Version workspace"
      >
        <Resizable.Pane aria-label="Version settings">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
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
                      :label="historyCollapsed ? 'Show version history' : 'Hide version history'"
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
                      :label="saveOptions.find((option) => option.value === saveAction)?.label"
                      :icon="saveAction === 'deploy' ? 'pi pi-cloud-upload' : ''"
                      kind="primary"
                      size="medium"
                      :model="saveOptions"
                      @item-click="(_event, item) => (saveAction = item.value)"
                    />
                  </div>
                </div>
              </footer>
            </Transition>
          </div>
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
                        <span class="truncate">{{ entry.author }} · {{ entry.createdAgo }}</span>
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
</template>
```
