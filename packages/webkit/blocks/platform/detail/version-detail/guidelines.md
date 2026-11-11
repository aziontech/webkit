# Version detail

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

A bar pinned to the bottom of the settings pane, aligned with the column above it. It names the state with a `Tag` and one sentence. On a draft it holds a primary medium `SplitButton` that saves and deploys, with Save and Build and Save in its menu. On a built version it reads Viewing a Deployed version with a Read Only tag and offers New Version and Redeploy.

### G. Version history — `IconButton`, `Tag`, `Field`, `Textarea`, `Button`, `Avatar` (optional)

The side pane titled "Version history", closed with an `IconButton`. It starts on the current version with its `Tag`, its description, its author `Avatar` and a pencil that edits the description in place through a `Field` with a `Textarea` and Cancel and Save `Button`s. Then the changes entry, empty until something is saved, then the five newest earlier versions and Show older for the rest.

## Do

- Keep one primary action on the page, in the version bar; the tabs share it.
- Lock the settings fieldset, not each control one by one, when the version is built.
- Let the user switch versions from the breadcrumb without going back to the list.
- Show the state in three places that agree: the breadcrumb option, the tab row tag and the version bar.
- Keep the history pane collapsible and resizable so the settings keep their width when it is closed.

## Don't

- Don't let a built version look editable; disable the fieldset and say Read Only.
- Don't put Save or Deploy in the tab row or the page header.
- Don't name a tab in the breadcrumb.
- Don't list every earlier version at once; show five and Show older.
- Don't save a description edit without Cancel and Save buttons.

## Copy

- **Version state tags:** one word, e.g. "Draft", "Deployed", "Ready", "Editable", "Read Only".
- **Version bar:** one sentence on what the user can do, e.g. "This version is open for editing. Deploy it when ready." or "Viewing a Deployed version".
- **Save actions:** verb first, three words or fewer, e.g. "Save and Deploy", "Save and Build", "Save".
- **Built version actions:** "New Version", "Redeploy".
- **Version picker:** search placeholder "Search versions", no-match line `No versions match "<query>".`, footer "Create new Version".
- **Setting rows:** a noun title and one sentence with a period, e.g. "Active" with "When disabled, the resource stops serving traffic."
- **History:** "Current version", an empty changes line, e.g. "No changes yet. Each change you save shows up here.", description placeholder "What changed in this version?".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- One `main` landmark holds the workspace; the Settings `PageHeader` title is its heading, and the history pane is a region labelled by its "Version history" `h2`.
- The resize handle has an `aria-label` and works with arrow keys.
- The version `Select` trigger is named "Switch version"; its search input is named "Search versions".
- Every `Switch` and `Input` in a setting row has an `aria-label` that matches the row title.
- A disabled control with a reason gets a `Tooltip` that the keyboard can reach.
- Icon-only buttons (Version actions, Close version history, Edit version info) have an `aria-label`; decorative icons are `aria-hidden`.

## States

- Draft: the editable draft on its Settings tab, with the Editable tag and the Save and Deploy split button in the version bar.
- Deployed: the deployed version, read-only, the fieldset disabled and the version bar offering New Version and Redeploy.
- VersionHistory: the draft with Version history open beside it, the current version, the empty changes entry and the five newest earlier versions.

## Related

- `platform/detail/details-page` — its Versions tab lists the versions that open here.
- `platform/edit/rule-builder` — the content of the Rules tab.
- `platform/create/deploy-drawer` — deploying a version outside this page.
- `platform/states/async-submit` — how the version bar locks while Save and Deploy runs.
- `SettingRow` — the row primitive of every settings section; see `skills/webkit-form` and `skills/webkit-layout`.
