# DetailVersion (`detail/detail-version`)

> One version of a resource, opened from its Versions tab, as a page body for ConsoleLayout: the layout's last crumb is a transparent select that switches between the resource versions, each with its state Tag, or creates a new one (the page sets it with `ConsoleLayout.Breadcrumb`; below md the body's own row carries it with a Back button); the root carries `data-layout-fill`, so the layout's main gives the workspace the height under the header. In the body a horizontal `Resizable` holds the version workspace, a tab bar with Settings, Source, Device Groups, Cache Settings, Functions Instances and Rules Engine carrying the state Tag and a Version actions menu, the open tab in a fading `ScrollArea`, and the version bar pinned to the bottom that names the state and holds the Save and deploy `SplitButton` on a draft or Add Version and Redeploy on a built version, and a collapsible Version history pane with the current version, its changes and the earlier built versions. The primary opens on the Settings tab; the Source, Device Groups, Cache Settings and Functions Instances variants open on their tab (a list with the controls row and an add or edit `Drawer`), Creating draws the workspace as `Skeleton` wires while a new version is copied, NotFound is the `EmptyState` for a version that does not exist, and the Rules Engine tab is the `edit/edit-rule-builder` block. Built from `ConfirmDialog`, `PageHeader`, `PageTabs`, `SettingsGroup`, `SettingsRow`, `Select`, `Resizable`, `Tabs`, `Tag`, `DropdownMenu`, `ScrollArea`, `Card`, `Item`, `Input`, `Switch`, `SplitButton`, `Button`, `Avatar`, `Field`, `Textarea`, `DataTable`, `Drawer`, `MultiSelect`, `NumberInput`, `SchemaForm`, `CodeEditor`, `Breadcrumb` and `EmptyState`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body.

- Surface: app
- Source: `blocks/detail/detail-version/detail-version.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-version")`
- Components: [Avatar](../../components/avatar.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [CodeEditor](../../components/code-editor.md), [ConfirmDialog](../../components/confirm-dialog.md), [ConsoleLayout](../../components/console-layout.md), [DataTable](../../components/data-table.md), `DataTablePagination`, `DrawerContent`, `DrawerDescription`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), `FieldError`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Item](../../components/item.md), [Link](../../components/link.md), [MultiSelect](../../components/multi-select.md), [NumberInput](../../components/number-input.md), [PageHeader](../../components/page-header.md), [PageTabs](../../components/page-tabs.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Resizable](../../components/resizable.md), [SchemaForm](../../components/schema-form.md), [ScrollArea](../../components/scroll-area.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Skeleton](../../components/skeleton.md), [Spinner](../../components/spinner.md), [SplitButton](../../components/split-button.md), [Switch](../../components/switch.md), `TableCellLink`, `TableCellTime`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `webkit-layout`, `webkit-navigation`, `webkit-ui-states`

## Asked as

version detail; resource version; draft version; version history; version switcher; versioned settings; detalhe da versão; histórico de versões; versão rascunho; revert version; rollback version; reverter versão; revertir versión; environment switcher; environment crumb; switch environment; seletor de ambiente; creating version; version not found; device groups; cache settings list; functions instances; version source files; criando versão; versão não encontrada; grupos de dispositivos; instâncias de função

One version of a resource, opened from its Versions tab. The user is here to change a draft and ship it, or to read what a built version holds and redeploy it or branch a new version from it. The page keeps the version they are on in the breadcrumb, where they can switch to another, puts the version's settings in tabs, pins the state and the save or deploy action to the bottom, and opens the version history beside the work when they need to see what changed. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the breadcrumb, the ⌘K palette and the `main`. The workspace pins its own bars, so its root carries `data-layout-fill`: the layout's `main` stops scrolling, the root fills it (`h-dvh` only sizes a standalone preview) and its panes scroll.

## When to use

- A resource whose configuration is versioned: drafts are edited, built and deployed, and built versions are read-only.
- The user opens a row of the Versions tab of `detail/detail-resource`, or creates a new version.
- The version has several areas of settings (Settings, Source, Device Groups, Cache Settings, Functions Instances, Rules Engine) that share one save and deploy action.

## When not to use

- The overview of the resource itself, its domains and deployments: use `detail/detail-resource`.
- A resource without versions whose settings save in place: use `edit/edit-resource` or `settings/settings-form`.
- The Rules Engine tab content: use `edit/edit-rule-builder`.
- Deploying from a list without opening a version: use `create/create-deploy-drawer`.

## Building blocks

### A. Version switcher — `ConsoleLayout`, `Select`, `Input`, `Tag`, `IconButton`, `Tooltip` (required)

The page sets the trail with `ConsoleLayout.Breadcrumb`: `items` are the module and the resource, and the slot holds the version, a `Select` with `variant="ghost"`, `size="small"` and `aria-label="Switch version"`, no `w-full`. The version is part of the route, so picking one navigates. Its content has a small search `Input`, a Versions group where each option carries its state `Tag` (Draft, Deployed, Ready), a no-match line, and a footer option that creates a new version. The version is never a page title.

The layout hides its breadcrumbs while compact, so the body opens on a row (`md:hidden`, its own `nav` named Breadcrumb) that carries a Back `IconButton` to the resource's Versions tab and the same `Select` crumbs, full width: the version, and in EnvironmentCrumb the environment before it. A phone keeps every switch the desktop breadcrumb offers.

### B. Workspace — `Resizable` (required)

A horizontal `Resizable` named "Version workspace": the version settings pane, a handle named "Resize the version history", and the collapsible Version history pane. History is closed by default.

### C. Version tab bar — `PageTabs`, `Tabs`, `Tag`, `DropdownMenu`, `IconButton`, `EmptyState` (required)

`PageTabs` with one `Tabs.Trigger` per area: Settings, Source, Device Groups, Cache Settings, Functions Instances, Rules Engine. The tab row ends on the version's state `Tag` and an outlined Version actions `IconButton` whose `DropdownMenu` holds Edit version info and the toggle for Version history. Each tab is its own route: the open tab's panel goes in the slot named after the tab (`#source`, `#device-groups`, `#cache-settings`, `#functions-instances`, `#rules-engine`), and a tab with no slot shows an `EmptyState` with an Open link to its own page.

### D. Settings panel — `ScrollArea`, `PageHeader`, `SettingsGroup`, `Card`, `Item`, `SettingsRow`, `Input`, `Switch`, `Tooltip`, `Skeleton`, `Link` (required)

The open tab scrolls in a fading `ScrollArea`. A small `PageHeader` names the tab, then `SettingsGroup`s (General, Modules, Subscription modules) each hold a `Card :padded="false"` with an `Item.List` of `SettingsRow`s: a title, a one-sentence description and its control, an `Input` or a `Switch`. A module that needs a sales contact keeps its `Switch` disabled, explained by a `Tooltip`. On a built version the whole fieldset is disabled. While `creating`, `Skeleton` wires take the sections' place.

### E. Version bar — `Tag`, `SplitButton`, `Button`, `Spinner` (required)

A bar pinned to the bottom of the settings pane, aligned with the column above it. It names the state with a `Tag` and one sentence. On a draft it holds a primary medium `SplitButton` that saves and deploys, with Save and build and Save in its menu. On a built version it reads Viewing a deployed version with a Read-only tag and offers Add Version and Redeploy.

### F. Version history — `IconButton`, `Tag`, `Field`, `Textarea`, `Button`, `Avatar` (optional)

The side pane titled "Version history", closed with an `IconButton`. It starts on the current version with its `Tag`, its description, its author `Avatar` and a pencil that edits the description in place through a `Field` with a `Textarea` and Cancel and Save `Button`s. Then the changes entry, empty until something is saved, then the five newest earlier versions and Show older for the rest. Each earlier version is a link to that version's page, never a button; the one being viewed carries `aria-current="page"`.

### G. Revert — `ConfirmDialog`, `Button`, `Tag` (optional, on an earlier Ready version)

An earlier version opened from Version history keeps the page read-only and says Viewing an earlier version, with the entry in history marked by a Viewing `Tag` and `aria-current="page"`. The version bar's primary action is Revert to <id>, the trigger of a `ConfirmDialog` with `variant="primary"` and `size="medium"`. Its body is the diff against the deployed version: a bordered list of the settings that change, each with its old and new value in words, a line with the rules added and removed, and a description saying that reverting deploys <id> to Production and that the deployed version stays in history. Confirm closes the dialog and emits `revert`. The page then runs the state-async-submit pattern: it sets `reverting` (Revert loads, the bar reads "Reverting to <id>…") and raises one toast id that turns from a loading toast ("Reverting to <id>…", "It keeps running if you leave.") into the outcome, which stays until closed and carries **Edit** and **Redeploy**, never View deployments. On success it passes the version back with `state: 'deployed'`, so its `Tag` reads Deployed in the breadcrumb, the tab row and the history, and the bar offers Redeploy.

## List tabs

Source, Device Groups, Cache Settings and Functions Instances are lists inside the version: a small `PageHeader` with an outlined add action, the controls row of `view/view-table` (search, Refresh, Download CSV, Columns) and a flush `DataTable` in a `Card`, paginated at 10. Its `#empty` slot tells a search that matches nothing (No matching, with Clear search) apart from a list with nothing yet (the add action). The name cell is a button that opens the edit `Drawer`, the same drawer the add action opens, built as in `create/create-drawer`: `SettingsGroup`s of `Field`s (Device Groups, Functions Instances) or of `SettingsRow`s in a `Card` (Cache Settings, reusing the rows of `edit/edit-resource#CacheSettings` plus Adaptive delivery and a Device groups `MultiSelect`). Functions Instances renders the arguments as a `SchemaForm` when the function declares a schema and as a JSON `CodeEditor` when it does not, and its function `Select` ends on Create Function. Source embeds the file browser: Upload Files in the heading, Open in Object Storage in the controls row, the folder path as a `Breadcrumb` and an `EmptyState` with Upload Files and Open Bucket. Saving a drawer changes the draft only; the version bar still deploys it.

## Creating and not found

While Add Version copies a built version into a new draft (`creating`), the workspace is drawn as `Skeleton` wires in a busy status region named "Creating a new version from <id>." and the version bar shows a `Spinner`, "Creating new version…", the copy line, Add Version loading and Redeploy disabled. A version link that points nowhere keeps the trail and renders a bordered `EmptyState` with View Versions.

## Data

The block takes its versions and settings through props and emits every action; it fetches nothing. `VersionDetailVersion`, `VersionDetailSettings`, `VersionDetailProps` and the other record types are exported from `detail-version.vue`, and `sample.ts` holds the sample resource, versions, settings and revert diff the block renders when those props are left out. The viewed version's `state` decides the page: `draft` is editable, `deployed` is read-only with Redeploy, `ready` is an earlier version with Revert.

| Prop / model           | Type                         | What it does                                                                                                 |
| ---------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `resource`             | `VersionDetailResource`      | The resource name and link, used in the trail, the Back link and the page links.                             |
| `versions`             | `VersionDetailVersion[]`     | Every version, newest first; the trail lists them and the history shows the ones older than the current one. |
| `settings`             | `VersionDetailSettings`      | The Settings tab values of the viewed version; the form keeps a local draft of them.                         |
| `revertDiff`           | `VersionDetailRevertDiff`    | What the revert dialog lists against the deployed version.                                                   |
| `environments`         | `VersionDetailEnvironment[]` | When set, the trail starts with an environment crumb and each version option says where it is live.          |
| `creating`             | `boolean`                    | A new version is being copied from the viewed one: wires in the workspace, the version bar busy.             |
| `reverting`            | `boolean`                    | The revert is running: Revert loads and the bar reads Reverting to the version.                              |
| `v-model:version-id`   | `string`                     | The viewed version; picking one in the trail updates it. Empty shows the first version.                      |
| `v-model:tab`          | `VersionDetailTab`           | The open tab, `main-settings` by default.                                                                    |
| `v-model:history-open` | `boolean`                    | Whether the Version history pane is open.                                                                    |
| `v-model:environment`  | `string`                     | The environment crumb; picking one moves the version crumb to the version live there.                        |

| Event              | Payload                         | When                                                                       |
| ------------------ | ------------------------------- | -------------------------------------------------------------------------- |
| `save`             | `(event, { action, settings })` | The Save split button on a draft; `action` is `deploy`, `build` or `save`. |
| `save-description` | `(event, description)`          | Save under the description editor in the history.                          |
| `add-version`      | `(event)`                       | Add Version in the bar or the version picker footer.                       |
| `add-environment`  | `(event)`                       | Add Environment in the environment picker footer.                          |
| `redeploy`         | `(event)`                       | Redeploy on a deployed version.                                            |
| `revert`           | `(event, version)`              | The revert dialog was confirmed.                                           |

To go live, render the block from the version route and pass what the API returns:

```vue
<script setup lang="ts">
  import DetailVersion from './detail-version.vue'

  const { versionId, versions, settings, saveVersion, revertTo, reverting } = useVersion()
</script>

<template>
  <DetailVersion
    v-model:version-id="versionId"
    :versions="versions"
    :settings="settings"
    :reverting="reverting"
    @save="(event, { action, settings }) => saveVersion(action, settings)"
    @revert="(event, version) => revertTo(version.id)"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep one primary action on the page, in the version bar; the tabs share it.
- Lock the settings fieldset, not each control one by one, when the version is built.
- Let the user switch versions from the breadcrumb without going back to the list.
- Set the trail from the page with `ConsoleLayout.Breadcrumb`, and mark the root with `data-layout-fill`.
- Show the state in three places that agree: the breadcrumb option, the tab row tag and the version bar.
- Keep the history pane collapsible and resizable so the settings keep their width when it is closed.
- Show what a revert changes before it runs: the settings with old and new values, and the rules added and removed.
- Report a revert like any deploy: on `revert`, one toast that turns into the outcome, with Edit and Redeploy.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't let a built version look editable; disable the fieldset and say Read-only.
- Don't size the body with `calc(100dvh - …)`.
- Don't put Save or Deploy in the tab row or the page header.
- Don't name a tab in the breadcrumb.
- Don't list every earlier version at once; show five and Show older.
- Don't save a description edit without Cancel and Save buttons.
- Don't edit a list row in place or on a new page; open the drawer, and let the version bar deploy.
- Don't show the settings form while a new version is still being copied; draw the wires.
- Don't revert without a confirmation, and don't make the diff depend on an arrow glyph or color alone.
- Don't delete or hide the version a revert replaces; it stays in history.
- Don't offer View deployments on the revert toast.

## Copy

- **Version state tags:** one word, e.g. "Draft", "Deployed", "Ready", "Editable", "Read-only".
- **Version bar:** one sentence on what the user can do, e.g. "This version is open for editing. Deploy it when ready." or "Viewing a deployed version".
- **Save actions:** verb first, three words or fewer, e.g. "Save and deploy", "Save and build", "Save".
- **Built version actions:** "Add Version", "Redeploy"; on an earlier version "Revert to <id>".
- **Revert:** bar "Viewing an earlier version"; dialog title "Revert to <id>?", description "Reverting deploys <id> to Production in place of <deployed>. <deployed> stays in the version history, so you can redeploy it later."; diff heading "What changes against <deployed>"; toasts "Reverting to <id>…" then "<id> is deployed.", actions "Edit" and "Redeploy".
- **List tabs:** add actions name the object, e.g. "Add Device Group", "Add Cache Settings", "Add Functions Instance"; drawer titles "Add …" or "Edit …"; success toasts "Device group \"mobile\" saved." with "The change is part of this draft until you deploy it."
- **Creating and not found:** "Creating new version…", "Copying <id> into a new draft."; "Version not found" with "View Versions".
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

- Draft: the default render, a version with `state: 'draft'` on its Settings tab, with the Editable tag and the Save and deploy split button in the version bar.
- Deployed: `version-id` on the version with `state: 'deployed'`, read-only, the fieldset disabled and the version bar offering Add Version and Redeploy.
- Revert: `version-id` on an earlier version with `state: 'ready'` and `history-open`, read-only, Revert to <id> in the bar and a confirmation with the `revertDiff`; `reverting` shows the run.
- VersionHistory: `history-open` on the draft, the current version, the empty changes entry and the five newest earlier versions.
- EnvironmentCrumb: `environments` set, for a resource that is deployed to several environments. The page's `ConsoleLayout.Breadcrumb` ends on two control crumbs, environment then version, each a small transparent `Select` with a search field (`Switch environment`, `Switch version`). Environments carry their deployment policy as a `Tag` and Add Environment in the footer; picking an environment moves the version crumb to the version live there, and each version option says where it is live (Live in Production). The environment always comes before the version, because a version is chosen within an environment.
- Creating: `creating` on the deployed AEO25I38, the workspace as `Skeleton` wires and the version bar busy.
- NotFound: a version that does not exist, a bordered `EmptyState` with View Versions.
- Source: `tab="source"` with its panel in the `#source` slot, the file list of the version bucket with its folder path and Open in Object Storage.
- DeviceGroups: `tab="device-groups"` with its panel in the `#device-groups` slot, the groups table and the add or edit drawer with the User-Agent expression.
- CacheSettings: `tab="cache-settings"` with its panel in the `#cache-settings` slot, the cache settings table and the add or edit drawer with Adaptive delivery and Device groups.
- FunctionsInstances: `tab="functions-instances"` with its panel in the `#functions-instances` slot, the instances table and the add or edit drawer with the function `Select` and its arguments.

## Related

- `detail/detail-resource` — its Versions tab lists the versions that open here.
- `edit/edit-rule-builder` — the content of the Rules Engine tab.
- `view/view-file-browser` — the full storage page the Source tab embeds.
- `edit/edit-resource` — its CacheSettings variant holds the rows the Cache Settings drawer reuses.
- `create/create-drawer` — the add and edit drawers of the list tabs.
- `state/state-page-skeleton` — the skeleton wires Creating draws.
- `create/create-deploy-drawer` — deploying a version outside this page.
- `state/state-async-submit` — how the version bar locks while Save and deploy runs.
- `SettingsRow` — the row primitive of every settings section; see `skills/webkit-form` and `skills/webkit-layout`.

## Variants

- `Draft` — primary (the code below)
- `Deployed` — The deployed version, read-only: the creation date beside the Deployed Tag, the settings fieldset disabled, and the version bar reading Viewing a deployed version and Read-only with its description, Add Version and Redeploy.
- `VersionHistory` — The draft with Version history open beside it: the current version with its description, author and the pencil that edits it in place, the empty changes entry, and the five newest earlier versions with Show older for the rest.
- `Revert` — An earlier Ready version opened from Version history, read-only, the history pane open with the entry marked Viewing. The version bar reads Viewing an earlier version and offers Add Version and a primary Revert to AK7D0ZX4, which opens a `ConfirmDialog` with the diff against the deployed version: each changed setting from its old value to the new one, the rules added and removed, and that the deployed version stays in history. Confirm emits `revert` with the version; while the parent runs it, `reverting` puts Revert in its loading state and the bar reads Reverting to AK7D0ZX4…, and the parent reports the outcome with one toast that carries Edit and Redeploy.
- `EnvironmentCrumb` — The same version page reached from an environment: the trail reads Resources, the resource, then two `Select` crumbs (the page's `ConsoleLayout.Breadcrumb` from md up, the body's own row below md). The environment crumb searches the environments, tags each with its deployment policy and offers Add Environment at its foot; picking one moves the version crumb to the version that environment serves. The version crumb marks each version with the environments it is live in, beside its state `Tag`.
- `Creating` — A new version being copied from the deployed AEO25I38: the workspace is drawn as `Skeleton` wires (a heading band, then sectioned cards of rows with a trailing switch) inside a polite busy status, and the version bar shows a `Spinner`, reads Creating new version… and Copying AEO25I38 into a new draft., with Add Version loading and Redeploy disabled.
- `NotFound` — A version link that points nowhere: the trail ends on the missing version and the body is a bordered `EmptyState`, Version not found, saying the version may have been deleted, with View Versions back to the Versions tab.
- `Source` — The draft on its Source tab: a small Source heading with Upload Files, the controls row (search in folder, Refresh, Download CSV, Columns and Open in Object Storage), a `Breadcrumb` of the folder path from the bucket, and the files table whose folders open in place and whose empty state offers Upload Files and Open Bucket.
- `DeviceGroups` — The draft on its Device Groups tab: a small heading with Add Device Group, the controls row and the groups table (name, User-Agent match, last modified). A name opens the edit `Drawer`, the same one Add Device Group opens, with the Name and the User-Agent regular expression `Textarea`, validated on submit.
- `CacheSettings` — The draft on its Cache Settings tab: the cache settings table (browser cache, edge cache, a tiered cache `Tag`, last modified) and the add or edit `Drawer` that holds the cache-settings rows of `edit/edit-resource`: Browser cache, Edge cache with stale, large file and tiered cache, and a collapsible Advanced cache key that ends on Adaptive delivery and a Device groups `MultiSelect`.
- `FunctionsInstances` — The draft on its Functions Instances tab: the instances table with the runtime glyph and a link to each function, its arguments and status, and the add or edit `Drawer` with the Name, a function `Select` whose footer is Create Function, and the arguments as a `SchemaForm` when the function declares a schema or a JSON `CodeEditor` when it does not.

Each variant is the same screen in another state: `get_block("detail/detail-version", { variant })`, or the file under `blocks/detail/detail-version/variants/`.

## Code (`Draft`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Resizable from '@aziontech/webkit/resizable'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref, watch } from 'vue'

  import { usePhoneWidth } from './composables/use-phone-width'
  import { ADD_ENVIRONMENT, ADD_VERSION, VERSION_TABS as tabs } from './detail-version-states'
  import CreatingWire from './parts/creating-wire.vue'
  import EnvironmentSwitcher from './parts/environment-switcher.vue'
  import SettingsPanel from './parts/settings-panel.vue'
  import VersionBar from './parts/version-bar.vue'
  import VersionHistory from './parts/version-history.vue'
  import VersionSwitcher from './parts/version-switcher.vue'
  import VersionTabBar from './parts/version-tab-bar.vue'
  import { sampleResource, sampleRevertDiff, sampleSettings, sampleVersions } from './sample'

  /** Where a version is in its life: an editable draft, the deployed one, or an earlier built one. */
  export type VersionDetailState = 'draft' | 'deployed' | 'ready'

  /** A tab of the version workspace. */
  export type VersionDetailTab =
    | 'main-settings'
    | 'source'
    | 'device-groups'
    | 'cache-settings'
    | 'functions-instances'
    | 'rules-engine'

  /** The resource the version belongs to. */
  export interface VersionDetailResource {
    /** Resource name, shown in the trail and in the page links. */
    name: string
    /** Link to the resource page. */
    href: string
  }

  /** One version of the resource. */
  export interface VersionDetailVersion {
    /** Version id, used in the route. */
    id: string
    /** Version name shown in the trail and the history. */
    name: string
    /** Lifecycle state; it decides whether the page is editable. */
    state: VersionDetailState
    /** The version description. */
    comment: string
    /** Who created the version. */
    author: string
    /** Relative creation time, such as 1 day ago. */
    createdAgo: string
    /** Creation date shown in the tab row of a built version. */
    createdOn?: string
  }

  /** The values of the Settings tab. */
  export interface VersionDetailSettings {
    /** Resource name. */
    name: string
    /** Whether the resource serves traffic. */
    active: boolean
    /** Module switches, keyed by module key. */
    modules: Record<string, boolean>
  }

  /** One setting a revert changes. */
  export interface VersionDetailChange {
    /** Setting name. */
    setting: string
    /** Value on the deployed version. */
    from: string
    /** Value after the revert. */
    to: string
  }

  /** What reverting to the viewed version changes against the deployed one. */
  export interface VersionDetailRevertDiff {
    /** The settings that change. */
    settings: VersionDetailChange[]
    /** Rules the revert adds. */
    rulesAdded: number
    /** Rules the revert removes. */
    rulesRemoved: number
    /** One sentence on the rules that change. */
    rulesNote: string
  }

  /** An environment the resource deploys to. */
  export interface VersionDetailEnvironment {
    /** Environment name. */
    name: string
    /** Deployment policy shown as its tag. */
    policy: string
    /** Id of the version live there, or an empty string. */
    serves: string
  }

  /** The payload of a save from the version bar. */
  export interface VersionDetailSave {
    /** The save action picked in the split button. */
    action: string
    /** The settings as edited. */
    settings: VersionDetailSettings
  }

  export interface VersionDetailProps {
    /** The resource; left out, the sample resource renders. */
    resource?: VersionDetailResource
    /** Every version, newest first; left out, the sample versions render. */
    versions?: VersionDetailVersion[]
    /** The Settings tab values of the viewed version; left out, the sample settings render. */
    settings?: VersionDetailSettings
    /** The diff the revert dialog shows; left out, the sample diff renders. */
    revertDiff?: VersionDetailRevertDiff
    /** The environments; when set, the trail starts with an environment crumb. */
    environments?: VersionDetailEnvironment[]
    /** A new version is being copied from the viewed one. */
    creating?: boolean
    /** A revert to the viewed version is running. */
    reverting?: boolean
  }

  const props = withDefaults(defineProps<VersionDetailProps>(), {
    resource: undefined,
    versions: undefined,
    settings: undefined,
    revertDiff: undefined,
    environments: undefined,
    creating: false,
    reverting: false
  })

  const emit = defineEmits<{
    save: [event: MouseEvent, payload: VersionDetailSave]
    'save-description': [event: MouseEvent, description: string]
    'add-version': [event: MouseEvent | KeyboardEvent]
    'add-environment': [event: MouseEvent | KeyboardEvent]
    redeploy: [event: MouseEvent]
    revert: [event: MouseEvent, version: VersionDetailVersion]
  }>()

  const versionId = defineModel<string>('versionId', { default: '' })
  const activeTab = defineModel<VersionDetailTab>('tab', { default: 'main-settings' })
  const historyExpanded = defineModel<boolean>('historyOpen', { default: false })
  const environment = defineModel<string>('environment', { default: '' })

  defineSlots<{
    /** The Source tab panel; the fallback links to its own page. */
    source?(props: { label: string }): unknown
    /** The Device Groups tab panel. */
    'device-groups'?(props: { label: string }): unknown
    /** The Cache Settings tab panel. */
    'cache-settings'?(props: { label: string }): unknown
    /** The Functions Instances tab panel. */
    'functions-instances'?(props: { label: string }): unknown
    /** The Rules Engine tab panel. */
    'rules-engine'?(props: { label: string }): unknown
  }>()

  const resource = computed(() => props.resource ?? sampleResource)
  const versions = computed(() => props.versions ?? sampleVersions)
  const revertDiff = computed(() => props.revertDiff ?? sampleRevertDiff)
  const environments = computed(() => props.environments ?? [])
  const viewed = computed<VersionDetailVersion>(
    () =>
      versions.value.find((entry) => entry.id === versionId.value) ??
      versions.value[0] ?? {
        name: versionId.value,
        id: versionId.value,
        state: 'ready',
        comment: '',
        author: '',
        createdAgo: ''
      }
  )
  const isDraft = computed(() => viewed.value.state === 'draft')
  const deployed = computed(() => versions.value.find((entry) => entry.state === 'deployed'))
  const version = computed(() =>
    viewed.value.state === 'ready' ? (deployed.value ?? viewed.value) : viewed.value
  )
  const earlier = computed(() =>
    versions.value.slice(versions.value.findIndex((entry) => entry.id === version.value.id) + 1)
  )
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const query = ref('')
  const environmentQuery = ref('')
  const form = reactive<VersionDetailSettings>({ name: '', active: false, modules: {} })
  const historyBasis = ref(348)
  const phone = usePhoneWidth()
  const description = ref('')
  const draftText = ref('')
  const editing = ref(false)

  const environmentName = computed(() => environment.value || environments.value[0]?.name || '')

  watch(
    () => props.settings ?? sampleSettings,
    (next) => {
      form.name = next.name
      form.active = next.active
      form.modules = { ...next.modules }
    },
    { immediate: true }
  )
  watch(
    () => version.value.comment,
    (next) => {
      description.value = next
    },
    { immediate: true }
  )

  const pickVersion = (value: unknown) => {
    if (value !== ADD_VERSION && value !== undefined && value !== null)
      versionId.value = String(value)
  }
  const pickEnvironment = (value: unknown) => {
    if (value === ADD_ENVIRONMENT || value === undefined || value === null) return
    environment.value = String(value)
    const served = environments.value.find((entry) => entry.name === value)?.serves
    if (served) versionId.value = served
  }

  const openHistory = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
    if (value === 'history' && historyExpanded.value) {
      historyExpanded.value = false
      return
    }
    editing.value = value === 'edit'
    if (editing.value) draftText.value = description.value
    historyExpanded.value = true
  }
  const saveDescription = (event: MouseEvent) => {
    description.value = draftText.value.trim()
    editing.value = false
    emit('save-description', event, description.value)
  }
  const save = (event: MouseEvent, action: string) =>
    emit('save', event, {
      action,
      settings: { ...form, modules: { ...form.modules } }
    })
  const confirmRevert = (event: MouseEvent) => emit('revert', event, viewed.value)

  const TAB_PANEL_CLASS =
    'grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ' +
    'ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none'
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <ConsoleLayout.Breadcrumb
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: resource.name, href: resource.href }
      ]"
    >
      <EnvironmentSwitcher
        v-if="environments.length"
        v-model:query="environmentQuery"
        variant="ghost"
        size="small"
        :environments="environments"
        :environment-name="environmentName"
        @pick="pickEnvironment"
        @add="(event) => emit('add-environment', event)"
      />
      <VersionSwitcher
        v-model:query="query"
        variant="ghost"
        size="small"
        :versions="versions"
        :environments="environments"
        :viewed-id="viewed.id"
        @pick="pickVersion"
        @add="(event) => emit('add-version', event)"
      />
    </ConsoleLayout.Breadcrumb>
    <nav
      aria-label="Breadcrumb"
      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
    >
      <Tooltip :content="`Back to ${resource.name} versions`">
        <IconButton
          icon="az az-arrow-left"
          variant="ghost"
          size="medium"
          :href="`${resource.href}?tab=versions`"
          :aria-label="`Back to ${resource.name} versions`"
        />
      </Tooltip>
      <div
        v-if="environments.length"
        class="min-w-0 flex-1"
      >
        <EnvironmentSwitcher
          v-model:query="environmentQuery"
          class="w-full"
          :environments="environments"
          :environment-name="environmentName"
          @pick="pickEnvironment"
          @add="(event) => emit('add-environment', event)"
        />
      </div>
      <div class="min-w-0 flex-1">
        <VersionSwitcher
          v-model:query="query"
          class="w-full"
          :versions="versions"
          :environments="environments"
          :viewed-id="viewed.id"
          @pick="pickVersion"
          @add="(event) => emit('add-version', event)"
        />
      </div>
    </nav>
    <div class="grid min-h-0 flex-1">
      <Resizable
        :orientation="phone ? 'vertical' : 'horizontal'"
        aria-label="Version workspace"
      >
        <Resizable.Pane aria-label="Version settings">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <VersionTabBar
              v-model:tab="activeTab"
              :viewed="viewed"
              :history-expanded="historyExpanded"
              @select="openHistory"
            />

            <SettingsPanel
              v-if="activeTab === 'main-settings' && !creating"
              :form="form"
              :resource-name="resource.name"
              :version-name="viewed.name"
              :is-draft="isDraft"
            />
            <CreatingWire
              v-else-if="activeTab === 'main-settings'"
              :version-name="viewed.name"
            />
            <section
              v-else-if="$slots[activeTab]"
              :class="TAB_PANEL_CLASS"
            >
              <slot
                :name="activeTab"
                :label="tabLabel"
              />
            </section>
            <section
              v-else
              :class="TAB_PANEL_CLASS"
            >
              <div class="layout-column layout-boundary flex min-w-0 flex-col">
                <div class="layout-section-start">
                  <EmptyState
                    size="medium"
                    icon="az az-external-link"
                    :title="tabLabel"
                    :description="`${tabLabel} opens on its own page.`"
                  >
                    <template #actions>
                      <Button
                        :label="`Open ${tabLabel}`"
                        variant="outline"
                        size="small"
                        :href="`/resources/${resource.name}/${activeTab}`"
                      />
                    </template>
                  </EmptyState>
                </div>
              </div>
            </section>

            <VersionBar
              :viewed="viewed"
              :version="version"
              :revert-diff="revertDiff"
              :creating="creating"
              :reverting="reverting"
              @save="save"
              @add-version="(event) => emit('add-version', event)"
              @redeploy="(event) => emit('redeploy', event)"
              @revert="confirmRevert"
            />
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="historyExpanded"
          aria-label="Resize the version history"
        />
        <Resizable.Pane
          v-model:basis="historyBasis"
          v-model:open="historyExpanded"
          collapsible
          :min="280"
          :max="560"
          aria-label="Version history"
          @keydown.esc="historyExpanded = false"
        >
          <VersionHistory
            v-model:open="historyExpanded"
            v-model:editing="editing"
            v-model:draft-text="draftText"
            :resource-name="resource.name"
            :viewed-id="viewed.id"
            :version="version"
            :earlier="earlier"
            :description="description"
            @save="saveDescription"
          />
        </Resizable.Pane>
      </Resizable>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { SchemaFormSchema } from '@aziontech/webkit/schema-form'

import type {
  VersionDetailEnvironment,
  VersionDetailResource,
  VersionDetailRevertDiff,
  VersionDetailSettings,
  VersionDetailVersion
} from './detail-version.vue'
import { blankSetting, type CacheSetting } from './detail-version-cache'

export const sampleResource: VersionDetailResource = {
  name: 'web-app',
  href: '/resources/1784552864'
}

export const sampleVersions: VersionDetailVersion[] = [
  {
    id: 'ADA8FMMR',
    name: 'ADA8FMMR',
    state: 'draft',
    comment: 'Cache static assets for 30 days',
    author: 'John Smith',
    createdAgo: '14 hours ago',
    createdOn: 'Nov 11, 2026'
  },
  {
    id: 'AEO25I38',
    name: 'AEO25I38',
    state: 'deployed',
    comment: 'Remove rule "Legacy load balancer"',
    author: 'Sam Lee',
    createdAgo: '1 day ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AG1VVDJP',
    name: 'AG1VVDJP',
    state: 'ready',
    comment: 'Enable image optimization',
    author: 'Priya Patel',
    createdAgo: '3 days ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AHFPL906',
    name: 'AHFPL906',
    state: 'ready',
    comment: 'Update function"ab-test" arguments',
    author: 'Chris Taylor',
    createdAgo: '3 days ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AITJB4GN',
    name: 'AITJB4GN',
    state: 'ready',
    comment: 'Add variable "API_URL"',
    author: 'Riley Carter',
    createdAgo: '4 days ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'AK7D0ZX4',
    name: 'AK7D0ZX4',
    state: 'ready',
    comment: 'Cache static assets for 30 days',
    author: 'Ethan Brooks',
    createdAgo: '6 days ago',
    createdOn: 'Nov 5, 2026'
  },
  {
    id: 'ALL6QVDL',
    name: 'ALL6QVDL',
    state: 'ready',
    comment: 'Remove rule "Legacy load balancer"',
    author: 'Jordan Kim',
    createdAgo: '1 week ago',
    createdOn: 'Nov 5, 2026'
  }
]

export const sampleSettings: VersionDetailSettings = {
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
}

export const sampleEarlierSettings: VersionDetailSettings = {
  ...sampleSettings,
  modules: { ...sampleSettings.modules, device_detection: true, load_balancing: true }
}

export const sampleRevertDiff: VersionDetailRevertDiff = {
  settings: [
    { setting: 'Device Detection', from: 'Off', to: 'On' },
    { setting: 'Load Balancing', from: 'Off', to: 'On' },
    { setting: 'Image Optimization', from: 'On', to: 'Off' }
  ],
  rulesAdded: 1,
  rulesRemoved: 0,
  rulesNote: 'The rule "Legacy load balancer" comes back.'
}

export const sampleEnvironments: VersionDetailEnvironment[] = [
  { name: 'Production', policy: 'Single', serves: 'AEO25I38' },
  { name: 'Preview', policy: 'Versioned', serves: 'AG1VVDJP' },
  { name: 'Staging', policy: 'Versioned', serves: '' }
]

export type DeviceGroup = {
  id: string
  name: string
  userAgent: string
  author: string
  modifiedAgo: string
}

export const sampleDeviceGroups: DeviceGroup[] = [
  {
    id: '3101',
    name: 'mobile',
    userAgent: '(Mobile|iP(hone|od)|Android|IEMobile)',
    author: 'Jane Doe',
    modifiedAgo: '2 days ago'
  },
  {
    id: '3102',
    name: 'tablet',
    userAgent: '(iPad|Tablet|Kindle|Silk)',
    author: 'Alex Morgan',
    modifiedAgo: '1 week ago'
  },
  {
    id: '3103',
    name: 'crawlers',
    userAgent: '(Googlebot|Bingbot|DuckDuckBot)',
    author: 'Sam Lee',
    modifiedAgo: '3 weeks ago'
  }
]

export type FunctionOption = {
  value: string
  label: string
  schema: SchemaFormSchema | null
}

export type FunctionInstance = {
  id: string
  name: string
  functionId: string
  args: Record<string, unknown>
  active: boolean
  author: string
  modifiedAgo: string
}

export const sampleFunctionOptions: FunctionOption[] = [
  {
    value: 'image-resizer',
    label: 'image-resizer',
    schema: {
      type: 'object',
      required: ['width'],
      properties: {
        width: {
          type: 'integer',
          title: 'Width',
          description: 'The width in pixels images are resized to.',
          minimum: 16,
          maximum: 4096
        },
        quality: {
          type: 'integer',
          title: 'Quality',
          description: 'JPEG and WebP quality, from 1 to 100.',
          minimum: 1,
          maximum: 100
        },
        format: {
          type: 'string',
          title: 'Format',
          description: 'The format served to browsers that accept it.',
          enum: ['webp', 'avif', 'jpeg']
        }
      }
    }
  },
  {
    value: 'maintenance-page',
    label: 'maintenance-page',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          title: 'Message',
          description: 'The text visitors read while the site is down.',
          maxLength: 120
        },
        retryAfter: {
          type: 'integer',
          title: 'Retry after in seconds',
          description: 'Sent in the Retry-After header.',
          minimum: 0
        }
      }
    }
  },
  { value: 'header-rewrite', label: 'header-rewrite', schema: null }
]

export const sampleFunctionInstances: FunctionInstance[] = [
  {
    id: '5201',
    name: 'product-images',
    functionId: 'image-resizer',
    args: { width: 640, quality: 80, format: 'webp' },
    active: true,
    author: 'Priya Patel',
    modifiedAgo: '5 hours ago'
  },
  {
    id: '5202',
    name: 'security-headers',
    functionId: 'header-rewrite',
    args: { set: { 'strict-transport-security': 'max-age=31536000' } },
    active: true,
    author: 'John Smith',
    modifiedAgo: '3 days ago'
  },
  {
    id: '5203',
    name: 'planned-maintenance',
    functionId: 'maintenance-page',
    args: { message: 'We are upgrading the store. Back soon.', retryAfter: 1800 },
    active: false,
    author: 'Alex Morgan',
    modifiedAgo: '2 weeks ago'
  }
]

type SourceFile = { size: string; ext: string; modifiedAt: string; author: string }
type SourceFolder = { children: SourceTree }
export type SourceTreeEntry = SourceFile | SourceFolder
export interface SourceTree {
  [name: string]: SourceTreeEntry
}

export const isSourceFolder = (entry: SourceTreeEntry | undefined): entry is SourceFolder =>
  Boolean(entry && 'children' in entry)

export const sampleBucket = 'web-app-assets'
const file = (size: string, ext: string, author: string): SourceFile => ({
  size,
  ext,
  modifiedAt: '2026-11-12T14:02:38Z',
  author
})
export const sampleSourceTree: SourceTree = {
  'assets/': {
    children: {
      'index-4f2a91.js': file('182.4 KB', 'js', 'Jane Doe'),
      'index-8c03de.css': file('24.1 KB', 'css', 'Jane Doe'),
      'logo.svg': file('3.2 KB', 'svg', 'Sam Lee')
    }
  },
  'images/': {
    children: {
      'hero.webp': file('412.7 KB', 'webp', 'Sam Lee'),
      'og-card.png': file('96.3 KB', 'png', 'Sam Lee')
    }
  },
  '404.html': file('4.8 KB', 'html', 'Jane Doe'),
  'favicon.svg': file('1.2 KB', 'svg', 'Jane Doe'),
  'index.html': file('6.0 KB', 'html', 'Jane Doe'),
  'robots.txt': file('64 B', 'txt', 'Alex Morgan')
}

export const sampleCacheSettings: CacheSetting[] = [
  {
    ...blankSetting(),
    id: '7101',
    name: 'static-assets',
    browserBehavior: 'override',
    browserMaxAge: 604800,
    edgeMaxAge: 2592000,
    staleCache: true,
    tieredCache: true,
    queryStringBehavior: 'allowlist',
    queryStringFields: 'v, lang',
    author: 'Jane Doe',
    modifiedAgo: '14 hours ago'
  },
  {
    ...blankSetting(),
    id: '7102',
    name: 'product-pages',
    edgeMaxAge: 3600,
    deviceBehavior: 'allowlist',
    deviceGroups: ['mobile', 'tablet'],
    author: 'Priya Patel',
    modifiedAgo: '2 days ago'
  },
  {
    ...blankSetting(),
    id: '7103',
    name: 'api-bypass',
    browserBehavior: 'no-cache',
    edgeBehavior: 'honor',
    author: 'Sam Lee',
    modifiedAgo: '1 week ago'
  }
]
```

## `detail-version-cache.ts`

```ts
/** One cache setting of the version. */
export type CacheSetting = {
  id: string
  name: string
  browserBehavior: string
  browserMaxAge: number
  edgeBehavior: string
  edgeMaxAge: number
  staleCache: boolean
  largeFileCache: boolean
  largeFileOffset: number
  tieredCache: boolean
  tieredTopology: string
  varyByMethod: string[]
  queryStringBehavior: string
  queryStringFields: string
  cookieBehavior: string
  cookieNames: string
  deviceBehavior: string
  deviceGroups: string[]
  author: string
  modifiedAgo: string
}

/** The fields the drawer edits. */
export type CacheSettingForm = Omit<CacheSetting, 'id' | 'author' | 'modifiedAgo'>

export const browserBehaviors = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' },
  { value: 'no-cache', label: 'No cache' }
]
export const edgeBehaviors = [
  { value: 'honor', label: 'Honor origin cache headers' },
  { value: 'override', label: 'Override cache settings' }
]
export const topologies = [
  { value: 'nearest-region', label: 'Nearest region' },
  { value: 'north-america', label: 'North America' },
  { value: 'europe', label: 'Europe' }
]
export const varyBehaviors = [
  { value: 'ignore', label: 'Ignore all, best cache rate' },
  { value: 'all', label: 'Vary by all' },
  { value: 'allowlist', label: 'Vary by some (allowlist)' },
  { value: 'denylist', label: 'Vary by all except some (denylist)' }
]
export const deviceBehaviors = [
  { value: 'ignore', label: 'Ignore all, best cache rate' },
  { value: 'allowlist', label: 'Vary by some device groups (allowlist)' }
]
export const methods = [
  { value: 'POST', label: 'POST' },
  { value: 'OPTIONS', label: 'OPTIONS' }
]
export const deviceGroupOptions = [
  { value: 'mobile', label: 'mobile' },
  { value: 'tablet', label: 'tablet' },
  { value: 'crawlers', label: 'crawlers' }
]

export const labelOf = (options: { value: string; label: string }[]) => (value: unknown) =>
  options.find((option) => option.value === value)?.label ?? String(value ?? '')
export const methodsLabel = (values: unknown[] | undefined) =>
  values?.length ? values.join(', ') : ''
export const deviceGroupsLabel = (values: unknown[] | undefined) =>
  values?.length ? values.join(', ') : ''

export const cacheSummary = (behavior: string, maxAge: number) => {
  if (behavior === 'honor') return 'Origin headers'
  if (behavior === 'no-cache') return 'No cache'
  if (maxAge % 86400 === 0) return `${maxAge / 86400} ${maxAge === 86400 ? 'day' : 'days'}`
  if (maxAge % 3600 === 0) return `${maxAge / 3600} ${maxAge === 3600 ? 'hour' : 'hours'}`
  return `${maxAge} seconds`
}

export const blankSetting = (): CacheSettingForm => ({
  name: '',
  browserBehavior: 'honor',
  browserMaxAge: 0,
  edgeBehavior: 'override',
  edgeMaxAge: 60,
  staleCache: false,
  largeFileCache: false,
  largeFileOffset: 1024,
  tieredCache: false,
  tieredTopology: 'nearest-region',
  varyByMethod: [],
  queryStringBehavior: 'ignore',
  queryStringFields: '',
  cookieBehavior: 'ignore',
  cookieNames: '',
  deviceBehavior: 'ignore',
  deviceGroups: []
})
```

## `detail-version-states.ts`

```ts
import type { TagSeverity, TagVariant } from '@aziontech/webkit/tag'

import type {
  VersionDetailState,
  VersionDetailTab,
  VersionDetailVersion
} from './detail-version.vue'

/** How a version state reads as a tag. */
export interface VersionDetailStateTag {
  /** Tag label. */
  label: string
  /** Tag severity. */
  severity?: TagSeverity
  /** Tag variant. */
  variant?: TagVariant
  /** Tag glyph, or an empty string. */
  icon: string
}

const STATE_TAGS: Record<VersionDetailState, VersionDetailStateTag> = {
  draft: { label: 'Draft', severity: 'warning', icon: 'az az-file-pen' },
  deployed: { label: 'Deployed', variant: 'primary', icon: '' },
  ready: { label: 'Ready', severity: 'success', icon: '' }
}

export const tagFor = (entry: VersionDetailVersion): VersionDetailStateTag =>
  STATE_TAGS[entry.state]

export const VERSION_TABS: { value: VersionDetailTab; label: string }[] = [
  { value: 'main-settings', label: 'Settings' },
  { value: 'source', label: 'Source' },
  { value: 'device-groups', label: 'Device Groups' },
  { value: 'cache-settings', label: 'Cache Settings' },
  { value: 'functions-instances', label: 'Functions Instances' },
  { value: 'rules-engine', label: 'Rules Engine' }
]

export const ADD_VERSION = '__create-version__'
export const ADD_ENVIRONMENT = '__create-environment__'
```

## `parts/creating-wire.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Skeleton from '@aziontech/webkit/skeleton'

  export interface CreatingWireProps {
    /** Name of the version being copied. */
    versionName: string
  }

  defineProps<CreatingWireProps>()

  const wireSections = [
    { id: 'general', rows: ['62%', '48%'] },
    { id: 'modules', rows: ['54%', '66%', '44%'] }
  ]
</script>

<template>
  <section
    class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
  >
    <ScrollArea
      aria-label="Version settings"
      fade
    >
      <div
        role="status"
        aria-busy="true"
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap) animate-fade-in motion-reduce:animate-none"
        data-testid="version-detail-wire"
      >
        <span class="sr-only">Creating a new version from {{ versionName }}.</span>
        <div
          class="flex flex-col gap-(--spacing-xs)"
          aria-hidden="true"
        >
          <Skeleton
            width="8rem"
            height="1.25rem"
          />
          <Skeleton
            width="18rem"
            height="0.875rem"
          />
        </div>
        <div
          class="mt-(--layout-section-gap) flex flex-col gap-(--layout-section-gap)"
          aria-hidden="true"
        >
          <div
            v-for="section in wireSections"
            :key="section.id"
            class="flex flex-col gap-(--layout-group-gap)"
          >
            <Skeleton
              width="6rem"
              height="1rem"
            />
            <Card :padded="false">
              <template #default>
                <div class="flex flex-col divide-y divide-(--border-default)">
                  <div
                    v-for="(width, index) in section.rows"
                    :key="index"
                    class="flex items-center gap-(--spacing-md) p-(--spacing-md)"
                  >
                    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                      <Skeleton
                        width="7rem"
                        height="0.875rem"
                      />
                      <Skeleton
                        :width="width"
                        height="0.75rem"
                      />
                    </div>
                    <span class="flex shrink-0">
                      <Skeleton
                        width="2.25rem"
                        height="1.25rem"
                      />
                    </span>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  </section>
</template>
```

## `parts/environment-switcher.vue`

```ts
<script setup lang="ts">
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { VersionDetailEnvironment } from '../detail-version.vue'
  import { ADD_ENVIRONMENT } from '../detail-version-states'

  export interface EnvironmentSwitcherProps {
    /** Every environment of the resource. */
    environments: VersionDetailEnvironment[]
    /** The environment the page is on. */
    environmentName: string
  }

  const props = defineProps<EnvironmentSwitcherProps>()

  const emit = defineEmits<{
    pick: [value: unknown]
    add: [event: MouseEvent | KeyboardEvent]
  }>()

  const environmentQuery = defineModel<string>('query', { required: true })

  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return props.environments
    return props.environments.filter((entry) => entry.name.toLowerCase().includes(needle))
  })
</script>

<template>
  <Select
    :model-value="environmentName"
    :display-value="(value) => String(value ?? '')"
    @update:model-value="(value) => emit('pick', value)"
    @update:open="
      (open) => {
        if (!open) environmentQuery = ''
      }
    "
  >
    <Select.Trigger aria-label="Switch environment" />
    <Select.Content>
      <template #search>
        <Input
          v-model="environmentQuery"
          size="small"
          placeholder="Search environments"
          aria-label="Search environments"
          @keydown.stop
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </template>
      <Select.Group label="Environments">
        <Select.Item
          v-for="entry in environmentMatches"
          :key="entry.name"
          :value="entry.name"
        >
          {{ entry.name }}
          <template #tag>
            <Tag
              :label="entry.policy"
              severity="neutral"
              size="small"
            />
          </template>
        </Select.Item>
        <p
          v-if="!environmentMatches.length"
          class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
        >
          No environments match"{{ environmentQuery }}".
        </p>
      </Select.Group>
      <template #footer>
        <Select.Item
          :value="ADD_ENVIRONMENT"
          class="w-full"
          @click="(event: MouseEvent) => emit('add', event)"
          @keydown.enter="(event: KeyboardEvent) => emit('add', event)"
        >
          <span class="flex items-center gap-(--spacing-xs)">
            <i
              class="az az-circle-plus"
              aria-hidden="true"
            />
            Add Environment
          </span>
        </Select.Item>
      </template>
    </Select.Content>
  </Select>
</template>
```

## `parts/revert-diff.vue`

```ts
<script setup lang="ts">
  import type { VersionDetailRevertDiff } from '../detail-version.vue'

  export interface RevertDiffProps {
    /** What the revert changes. */
    revertDiff: VersionDetailRevertDiff
    /** Name of the deployed version the diff is against. */
    deployedName: string
  }

  defineProps<RevertDiffProps>()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-md) pt-(--spacing-md)">
    <section
      aria-labelledby="revert-settings-title"
      class="flex min-w-0 flex-col gap-(--spacing-xs)"
    >
      <h3
        id="revert-settings-title"
        class="text-label-md text-(--text-default)"
      >
        What changes against {{ deployedName }}
      </h3>
      <ul
        class="flex min-w-0 flex-col divide-y divide-(--border-muted) rounded-(--shape-control) border border-(--border-default)"
      >
        <li
          v-for="change in revertDiff.settings"
          :key="change.setting"
          class="flex min-w-0 items-center justify-between gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)"
        >
          <span class="truncate text-body-sm text-(--text-default)">{{ change.setting }}</span>
          <span class="sr-only">{{ `changes from ${change.from} to ${change.to}` }}</span>
          <span
            class="flex shrink-0 items-center gap-(--spacing-xs) text-body-sm"
            aria-hidden="true"
          >
            <span class="text-(--text-muted) line-through">{{ change.from }}</span>
            <i class="az az-arrow-right text-body-xs text-(--text-muted)" />
            <span class="text-(--text-default)">{{ change.to }}</span>
          </span>
        </li>
      </ul>
    </section>
    <p class="text-body-sm text-(--text-default)">
      Rules: {{ revertDiff.rulesAdded }} added, {{ revertDiff.rulesRemoved }} removed.
      {{ revertDiff.rulesNote }}
    </p>
  </div>
</template>
```

## `parts/settings-panel.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { VersionDetailSettings } from '../detail-version.vue'

  export interface SettingsPanelProps {
    /** Resource name, read in the fieldset legend. */
    resourceName: string
    /** Version name, read in the fieldset legend. */
    versionName: string
    /** Whether the version is an editable draft. */
    isDraft: boolean
  }

  defineProps<SettingsPanelProps>()

  const form = defineModel<VersionDetailSettings>('form', { required: true })

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
</script>

<template>
  <section
    class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
  >
    <ScrollArea
      aria-label="Version settings"
      fade
    >
      <div class="flex min-h-full flex-col">
        <fieldset
          :disabled="!isDraft"
          class="contents"
        >
          <legend class="sr-only">
            {{ resourceName }} {{ versionName }}{{ isDraft ? '' : ', read-only' }}
          </legend>
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

              <fieldset class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0">
                <legend class="sr-only">Main settings</legend>

                <SettingsGroup
                  label="General"
                  hint="How this resource is identified across the console, and whether it is serving traffic."
                  anchor="general"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          title="Name"
                          description="A unique and descriptive name to identify the resource."
                        >
                          <Input
                            v-model="form.name"
                            size="large"
                            class="w-full"
                            aria-label="Name"
                          />
                        </SettingsRow>
                        <SettingsRow
                          title="Active"
                          description="When disabled, the resource stops serving traffic."
                          variant="compact"
                        >
                          <Switch
                            v-model="form.active"
                            aria-label="Active"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Modules"
                  hint="The capabilities this resource runs with, each of which can be toggled here."
                  anchor="modules"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          v-for="mod in defaultModules"
                          :key="mod.key"
                          :title="mod.title"
                          :description="mod.description"
                          variant="compact"
                        >
                          <Switch
                            v-model="form.modules[mod.key]"
                            :aria-label="mod.title"
                          />
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>

                <SettingsGroup
                  label="Subscription modules"
                  hint="Paid add-ons that are activated with sales, not from this page."
                  anchor="subscription-modules"
                >
                  <Card :padded="false">
                    <template #default>
                      <Item.List>
                        <SettingsRow
                          title="WebSocket Proxy"
                          variant="compact"
                        >
                          <template #description>
                            Enhance real-time data exchange between your resource and backend
                            services using the WebSocket protocol.
                            <Link
                              href="https://example.com/contact-sales"
                              target="_blank"
                              inline
                              >Contact sales</Link
                            >
                          </template>
                          <Tooltip content="Contact sales to activate this module.">
                            <Switch
                              v-model="form.modules.web_socket_proxy"
                              disabled
                              aria-label="WebSocket Proxy"
                            />
                          </Tooltip>
                        </SettingsRow>
                      </Item.List>
                    </template>
                  </Card>
                </SettingsGroup>
              </fieldset>
            </div>
          </form>
        </fieldset>
      </div>
    </ScrollArea>
  </section>
</template>
```

## `parts/version-bar.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Spinner from '@aziontech/webkit/spinner'
  import SplitButton from '@aziontech/webkit/split-button'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import type { VersionDetailRevertDiff, VersionDetailVersion } from '../detail-version.vue'
  import RevertDiff from './revert-diff.vue'

  export interface VersionBarProps {
    /** The version the page is on. */
    viewed: VersionDetailVersion
    /** The version a revert replaces: the deployed one. */
    version: VersionDetailVersion
    /** What the revert changes. */
    revertDiff: VersionDetailRevertDiff
    /** A new version is being copied from the viewed one. */
    creating: boolean
    /** A revert to the viewed version is running. */
    reverting: boolean
  }

  const props = defineProps<VersionBarProps>()

  const emit = defineEmits<{
    save: [event: MouseEvent, action: string]
    'add-version': [event: MouseEvent]
    redeploy: [event: MouseEvent]
    revert: [event: MouseEvent]
  }>()

  const saveOptions = [
    { label: 'Save and deploy', value: 'deploy' },
    { label: 'Save and build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]

  const saveAction = ref<string | undefined>('deploy')
  const confirmOpen = ref(false)

  const isDraft = computed(() => props.viewed.state === 'draft')
  const statusLabel = computed(() => {
    if (props.creating) return 'Creating new version…'
    if (props.reverting) return `Reverting to ${props.viewed.name}…`
    if (isDraft.value) return 'Draft'
    return props.viewed.state === 'deployed'
      ? 'Viewing a deployed version'
      : 'Viewing an earlier version'
  })
  const statusLine = computed(() => {
    if (props.creating) return `Copying ${props.viewed.name} into a new draft.`
    if (isDraft.value) return 'This version is open for editing. Deploy it when ready.'
    return props.viewed.comment
  })

  const save = (event: MouseEvent) => emit('save', event, saveAction.value ?? 'deploy')
  const confirmRevert = (event: MouseEvent) => {
    confirmOpen.value = false
    emit('revert', event)
  }
</script>

<template>
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
          v-if="creating || isDraft"
          class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
          aria-hidden="true"
        >
          <span
            v-if="creating"
            class="flex size-4"
          >
            <Spinner class="w-full" />
          </span>
          <i
            v-else
            class="az az-file-pen text-body-sm text-(--text-default)"
          />
        </span>
        <div
          class="flex min-w-0 flex-1 flex-col"
          role="status"
        >
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <span class="truncate text-body-sm text-(--text-default)">{{ statusLabel }}</span>
            <span
              v-if="!creating"
              class="hidden shrink-0 sm:inline-flex"
            >
              <Tag
                :label="isDraft ? 'Editable' : 'Read-only'"
                :severity="isDraft ? 'info' : 'neutral'"
                :icon="isDraft ? '' : 'az az-lock'"
                size="small"
              />
            </span>
          </div>
          <p
            class="hidden truncate text-body-xs text-(--text-muted) md:block"
            :title="statusLine"
          >
            {{ statusLine }}
          </p>
        </div>

        <div class="flex shrink-0 items-center gap-(--spacing-xs)">
          <SplitButton
            v-if="isDraft && !creating"
            :label="saveOptions.find((option) => option.value === saveAction)?.label"
            :icon="saveAction === 'deploy' ? 'az az-cloud-upload' : ''"
            variant="primary"
            size="medium"
            :items="saveOptions"
            @click="save"
            @item-click="(_event, item) => (saveAction = item.value)"
          />
          <template v-else>
            <Button
              label="Add Version"
              variant="outline"
              size="medium"
              icon="az az-plus"
              :loading="creating"
              @click="(event: MouseEvent) => emit('add-version', event)"
            />
            <Button
              v-if="viewed.state !== 'ready'"
              label="Redeploy"
              variant="outline"
              size="medium"
              icon="az az-refresh"
              :disabled="creating"
              @click="(event: MouseEvent) => emit('redeploy', event)"
            />
            <ConfirmDialog
              v-else
              v-model:open="confirmOpen"
              :title="`Revert to ${viewed.name}?`"
              :description="`Reverting deploys ${viewed.name} to Production in place of ${version.name}. ${version.name} stays in the version history, so you can redeploy it later.`"
              :confirm-label="`Revert to ${viewed.name}`"
              variant="primary"
              size="medium"
              @confirm="confirmRevert"
            >
              <template #trigger>
                <Button
                  :label="`Revert to ${viewed.name}`"
                  variant="primary"
                  size="medium"
                  icon="az az-undo"
                  :loading="reverting"
                />
              </template>
              <RevertDiff
                :revert-diff="revertDiff"
                :deployed-name="version.name"
              />
            </ConfirmDialog>
          </template>
        </div>
      </div>
    </footer>
  </Transition>
</template>
```

## `parts/version-history.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item-root'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { ref } from 'vue'

  import type { VersionDetailVersion } from '../detail-version.vue'
  import { tagFor } from '../detail-version-states'

  export interface VersionHistoryProps {
    /** Resource name, used in the version links. */
    resourceName: string
    /** Id of the version the page is on. */
    viewedId: string
    /** The current version the history starts on. */
    version: VersionDetailVersion
    /** The built versions older than the current one, newest first. */
    earlier: VersionDetailVersion[]
    /** The current version description. */
    description: string
  }

  defineProps<VersionHistoryProps>()

  const emit = defineEmits<{
    save: [event: MouseEvent]
  }>()

  const historyExpanded = defineModel<boolean>('open', { required: true })
  const editing = defineModel<boolean>('editing', { required: true })
  const draftText = defineModel<string>('draftText', { required: true })

  const shown = ref(5)

  const VERSION_LINK_CLASS = 'flex w-full min-w-0 gap-(--spacing-sm) text-start'
</script>

<template>
  <aside
    :inert="!historyExpanded"
    aria-labelledby="version-history-title"
    class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
    data-testid="version-detail-history"
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
        icon="az az-x"
        variant="ghost"
        size="small"
        aria-label="Close version history"
        @click="historyExpanded = false"
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
            class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground)"
            aria-hidden="true"
          >
            <i
              :class="version.state === 'draft' ? 'az az-file-pen' : 'az az-code'"
              class="text-body-xs"
            />
          </span>
          <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-0.5">
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <span class="truncate text-label-md text-(--text-default)">
                {{ version.name }}
              </span>
              <span class="flex shrink-0">
                <Tag
                  :label="tagFor(version).label"
                  :variant="tagFor(version).variant"
                  :severity="tagFor(version).severity"
                  size="small"
                />
              </span>
              <span
                v-if="version.state === 'draft' && !editing"
                class="ms-auto shrink-0"
              >
                <IconButton
                  icon="az az-pencil"
                  variant="ghost"
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
              v-if="version.state === 'draft' && editing"
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
                  variant="outline"
                  size="small"
                  @click="editing = false"
                />
                <Button
                  label="Save"
                  variant="primary"
                  size="small"
                  @click="(event: MouseEvent) => emit('save', event)"
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
                    variant="square"
                  />
                </span>
                <span class="truncate">{{ version.author }} · {{ version.createdAgo }}</span>
              </span>
            </template>
          </div>
        </li>

        <li
          v-if="version.state === 'draft'"
          class="relative flex flex-col pb-(--spacing-lg)"
        >
          <span
            class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
            aria-hidden="true"
          />
          <p class="flex gap-(--spacing-sm)">
            <span
              class="relative flex size-7 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <span class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)" />
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
          <Item
            :href="`/resources/${resourceName}/versions/${entry.name}`"
            :aria-current="entry.id === viewedId ? 'page' : undefined"
            variant="inline"
          >
            <span :class="VERSION_LINK_CLASS">
              <span
                class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                aria-hidden="true"
              >
                <i class="az az-code text-body-xs" />
              </span>
              <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs) pt-0.5">
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span
                    class="truncate text-label-md text-(--text-default) group-hover/item:underline"
                  >
                    {{ entry.name }}
                  </span>
                  <span class="flex shrink-0">
                    <Tag
                      :label="tagFor(entry).label"
                      :variant="tagFor(entry).variant"
                      :severity="tagFor(entry).severity"
                      size="small"
                    />
                  </span>
                  <span
                    v-if="entry.id === viewedId"
                    class="flex shrink-0"
                  >
                    <Tag
                      label="Viewing"
                      severity="info"
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
                      variant="square"
                    />
                  </span>
                  <span class="truncate">{{ entry.author }} · {{ entry.createdAgo }}</span>
                </span>
              </span>
            </span>
          </Item>
        </li>
      </ol>

      <div
        v-if="earlier.length > shown"
        class="pt-(--spacing-sm)"
      >
        <Button
          label="Show older"
          variant="ghost"
          size="small"
          @click="shown += 5"
        />
      </div>
    </div>
  </aside>
</template>
```

## `parts/version-switcher.vue`

```ts
<script setup lang="ts">
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { VersionDetailEnvironment, VersionDetailVersion } from '../detail-version.vue'
  import { ADD_VERSION, tagFor } from '../detail-version-states'

  export interface VersionSwitcherProps {
    /** Every version, newest first. */
    versions: VersionDetailVersion[]
    /** The environments; each version names the ones it is live in. */
    environments: VersionDetailEnvironment[]
    /** Id of the version the page is on. */
    viewedId: string
  }

  const props = defineProps<VersionSwitcherProps>()

  const emit = defineEmits<{
    pick: [value: unknown]
    add: [event: MouseEvent | KeyboardEvent]
  }>()

  const query = defineModel<string>('query', { required: true })

  const matches = computed(() =>
    props.versions.filter((entry) =>
      entry.name.toLowerCase().includes(query.value.trim().toLowerCase())
    )
  )
  const servedIn = (id: string) =>
    props.environments.filter((entry) => entry.serves === id).map((entry) => entry.name)
</script>

<template>
  <Select
    :model-value="viewedId"
    @update:model-value="(value) => emit('pick', value)"
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
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </template>
      <Select.Group label="Versions">
        <Select.Item
          v-for="entry in matches"
          :key="entry.id"
          :value="entry.id"
        >
          {{ entry.name }}
          <span
            v-if="servedIn(entry.id).length"
            class="text-body-xs text-(--text-muted)"
            >Live in {{ servedIn(entry.id).join(', ') }}</span
          >
          <template #tag>
            <Tag
              :label="tagFor(entry).label"
              :variant="tagFor(entry).variant"
              :severity="tagFor(entry).severity"
              :icon="tagFor(entry).icon"
              size="small"
            />
          </template>
        </Select.Item>
        <p
          v-if="!matches.length"
          class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
        >
          No versions match"{{ query }}".
        </p>
      </Select.Group>
      <template #footer>
        <Select.Item
          :value="ADD_VERSION"
          class="w-full"
          @click="(event: MouseEvent) => emit('add', event)"
          @keydown.enter="(event: KeyboardEvent) => emit('add', event)"
        >
          <span class="flex items-center gap-(--spacing-xs)">
            <i
              class="az az-circle-plus"
              aria-hidden="true"
            />
            Add Version
          </span>
        </Select.Item>
      </template>
    </Select.Content>
  </Select>
</template>
```

## `parts/version-tab-bar.vue`

```ts
<script setup lang="ts">
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  import type { VersionDetailTab, VersionDetailVersion } from '../detail-version.vue'
  import { tagFor, VERSION_TABS as tabs } from '../detail-version-states'

  export interface VersionTabBarProps {
    /** The version the page is on. */
    viewed: VersionDetailVersion
    /** Whether Version history is open. */
    historyExpanded: boolean
  }

  const props = defineProps<VersionTabBarProps>()

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue]
  }>()

  const activeTab = defineModel<VersionDetailTab>('tab', { required: true })

  const isDraft = computed(() => props.viewed.state === 'draft')
</script>

<template>
  <PageTabs v-model="activeTab">
    <Tabs.Trigger
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
    <template #actions>
      <span
        v-if="!isDraft && viewed.createdOn"
        class="hidden text-body-sm text-(--text-muted) md:inline"
      >
        Created {{ viewed.createdOn }}
      </span>
      <Tag
        :label="tagFor(viewed).label"
        :variant="tagFor(viewed).variant"
        :severity="tagFor(viewed).severity"
        :icon="tagFor(viewed).icon"
        size="medium"
      />
      <DropdownMenu
        side="bottom"
        align="end"
        @select="(event, value) => emit('select', event, value)"
      >
        <DropdownMenu.Trigger>
          <IconButton
            icon="az az-ellipsis"
            variant="ghost"
            size="small"
            aria-label="Version actions"
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            v-if="isDraft"
            value="edit"
            label="Edit version info"
          >
            <template #leading>
              <i
                class="az az-pencil"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="history"
            :label="historyExpanded ? 'Hide version history' : 'Show version history'"
          >
            <template #leading>
              <i
                class="az az-history"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>
    </template>
  </PageTabs>
</template>
```
