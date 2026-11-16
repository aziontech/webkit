# Version detail

One version of a resource, opened from its Versions tab. The user is here to change a draft and ship it, or to read what a built version holds and redeploy it or branch a new version from it. The page keeps the version they are on in the breadcrumb, where they can switch to another, puts the version's settings in tabs, pins the state and the save or deploy action to the bottom, and opens the version history beside the work when they need to see what changed. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the breadcrumb, the ⌘K palette and the `main`. The workspace pins its own bars, so its root carries `data-layout-fill`: the layout's `main` stops scrolling, the root fills it (`h-dvh` only sizes a standalone preview) and its panes scroll.

## When to use

- A resource whose configuration is versioned: drafts are edited, built and deployed, and built versions are read-only.
- The user opens a row of the Versions tab of `detail/resource-detail`, or creates a new version.
- The version has several areas of settings (Settings, Source, Device Groups, Cache Settings, Functions Instances, Rules Engine) that share one save and deploy action.

## When not to use

- The overview of the resource itself, its domains and deployments: use `detail/resource-detail`.
- A resource without versions whose settings save in place: use `edit/edit-resource` or `settings/settings-form`.
- The Rules Engine tab content: use `edit/rule-builder`.
- Deploying from a list without opening a version: use `create/deploy-drawer`.

## Building blocks

### A. Version switcher — `ConsoleLayout`, `Select`, `Input`, `Tag`, `IconButton`, `Tooltip` (required)

The page sets the trail with `ConsoleLayout.Breadcrumb`: `items` are the module and the resource, and the slot holds the version, a `Select` with `variant="ghost"`, `size="small"` and `aria-label="Switch version"`, no `w-full`. The version is part of the route, so picking one navigates. Its content has a small search `Input`, a Versions group where each option carries its state `Tag` (Draft, Deployed, Ready), a no-match line, and a footer option that creates a new version. The version is never a page title.

The layout hides its breadcrumbs while compact, so the body opens on a row (`md:hidden`, its own `nav` named Breadcrumb) that carries a Back `IconButton` to the resource's Versions tab and the same `Select` crumbs, full width: the version, and in EnvironmentCrumb the environment before it. A phone keeps every switch the desktop breadcrumb offers.

### B. Workspace — `Resizable` (required)

A horizontal `Resizable` named "Version workspace": the version settings pane, a handle named "Resize the version history", and the collapsible Version history pane. History is closed by default.

### C. Version tab bar — `PageTabs`, `Tabs`, `Tag`, `DropdownMenu`, `IconButton`, `EmptyState` (required)

`PageTabs` with one `Tabs.Trigger` per area: Settings, Source, Device Groups, Cache Settings, Functions Instances, Rules Engine. The tab row ends on the version's state `Tag` and an outlined Version actions `IconButton` whose `DropdownMenu` holds Edit version info and the toggle for Version history. Each tab is its own route: the open tab's panel goes in the slot named after the tab (`#source`, `#device-groups`, `#cache-settings`, `#functions-instances`, `#rules-engine`), and a tab with no slot shows an `EmptyState` with an Open link to its own page.

### D. Settings panel — `ScrollArea`, `PageHeader`, `SettingsSection`, `Card`, `Item`, `SettingsRow`, `Input`, `Switch`, `Tooltip`, `Skeleton` (required)

The open tab scrolls in a fading `ScrollArea`. A small `PageHeader` names the tab, then `SettingsSection`s (General, Modules, Subscription modules) each hold a `Card :padded="false"` with an `Item.List` of `SettingsRow`s: a title, a one-sentence description and its control, an `Input` or a `Switch`. A module that needs a sales contact keeps its `Switch` disabled, explained by a `Tooltip`. On a built version the whole fieldset is disabled. While `creating`, `Skeleton` wires take the sections' place.

### E. Version bar — `Tag`, `SplitButton`, `Button`, `Spinner` (required)

A bar pinned to the bottom of the settings pane, aligned with the column above it. It names the state with a `Tag` and one sentence. On a draft it holds a primary medium `SplitButton` that saves and deploys, with Save and build and Save in its menu. On a built version it reads Viewing a deployed version with a Read-only tag and offers Add Version and Redeploy.

### F. Version history — `IconButton`, `Tag`, `Field`, `Textarea`, `Button`, `Avatar` (optional)

The side pane titled "Version history", closed with an `IconButton`. It starts on the current version with its `Tag`, its description, its author `Avatar` and a pencil that edits the description in place through a `Field` with a `Textarea` and Cancel and Save `Button`s. Then the changes entry, empty until something is saved, then the five newest earlier versions and Show older for the rest. Each earlier version is a link to that version's page, never a button; the one being viewed carries `aria-current="page"`.

### G. Revert — `ConfirmDialog`, `Button`, `Tag` (optional, on an earlier Ready version)

An earlier version opened from Version history keeps the page read-only and says Viewing an earlier version, with the entry in history marked by a Viewing `Tag` and `aria-current="page"`. The version bar's primary action is Revert to <id>, the trigger of a `ConfirmDialog` with `variant="primary"` and `size="medium"`. Its body is the diff against the deployed version: a bordered list of the settings that change, each with its old and new value in words, a line with the rules added and removed, and a description saying that reverting deploys <id> to Production and that the deployed version stays in history. Confirm closes the dialog and emits `revert`. The page then runs the async-submit pattern: it sets `reverting` (Revert loads, the bar reads "Reverting to <id>…") and raises one toast id that turns from a loading toast ("Reverting to <id>…", "It keeps running if you leave.") into the outcome, which stays until closed and carries **Edit** and **Redeploy**, never View deployments. On success it passes the version back with `state: 'deployed'`, so its `Tag` reads Deployed in the breadcrumb, the tab row and the history, and the bar offers Redeploy.

## List tabs

Source, Device Groups, Cache Settings and Functions Instances are lists inside the version: a small `PageHeader` with an outlined add action, the controls row of `view/table-view` (search, Refresh, Download CSV, Columns) and a flush `DataTable` in a `Card`, paginated at 10. Its `#empty` slot tells a search that matches nothing (No matching, with Clear search) apart from a list with nothing yet (the add action). The name cell is a button that opens the edit `Drawer`, the same drawer the add action opens, built as in `create/create-drawer`: `SettingsSection`s of `Field`s (Device Groups, Functions Instances) or of `SettingsRow`s in a `Card` (Cache Settings, reusing the rows of `edit/edit-resource#CacheSettings` plus Adaptive delivery and a Device groups `MultiSelect`). Functions Instances renders the arguments as a `SchemaForm` when the function declares a schema and as a JSON `CodeEditor` when it does not, and its function `Select` ends on Create Function. Source embeds the file browser: Upload Files in the heading, Open in Object Storage in the controls row, the folder path as a `Breadcrumb` and an `EmptyState` with Upload Files and Open Bucket. Saving a drawer changes the draft only; the version bar still deploys it.

## Creating and not found

While Add Version copies a built version into a new draft (`creating`), the workspace is drawn as `Skeleton` wires in a busy status region named "Creating a new version from <id>." and the version bar shows a `Spinner`, "Creating new version…", the copy line, Add Version loading and Redeploy disabled. A version link that points nowhere keeps the trail and renders a bordered `EmptyState` with View Versions.

## Data

The block takes its versions and settings through props and emits every action; it fetches nothing. `VersionDetailVersion`, `VersionDetailSettings`, `VersionDetailProps` and the other record types are exported from `version-detail.vue`, and `sample.ts` holds the sample resource, versions, settings and revert diff the block renders when those props are left out. The viewed version's `state` decides the page: `draft` is editable, `deployed` is read-only with Redeploy, `ready` is an earlier version with Revert.

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
  import VersionDetail from './version-detail.vue'

  const { versionId, versions, settings, saveVersion, revertTo, reverting } = useVersion()
</script>

<template>
  <VersionDetail
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
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so this page body never renders a `Toaster`.

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

- `detail/resource-detail` — its Versions tab lists the versions that open here.
- `edit/rule-builder` — the content of the Rules Engine tab.
- `view/file-browser` — the full storage page the Source tab embeds.
- `edit/edit-resource` — its CacheSettings variant holds the rows the Cache Settings drawer reuses.
- `create/create-drawer` — the add and edit drawers of the list tabs.
- `state/page-skeleton` — the skeleton wires Creating draws.
- `create/deploy-drawer` — deploying a version outside this page.
- `state/async-submit` — how the version bar locks while Save and deploy runs.
- `SettingsRow` — the row primitive of every settings section; see `skills/webkit-form` and `skills/webkit-layout`.
