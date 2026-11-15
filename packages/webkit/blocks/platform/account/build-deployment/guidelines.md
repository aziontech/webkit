# Build and deployment

How every deploy in the account routes. A Deployment Setting holds a binding policy (whether a version locks the resource IDs it shipped with) and a deployment policy (one live version, or a URL per version); every environment of every service publishes with exactly one, linked automatically to a setting that matches its own deployment policy. On this page an admin sets the defaults the next service starts with, sees which environment publishes with which setting, points two environments at the same setting so one deploy reaches both, and manages the settings themselves. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Account-wide defaults for how new resources deploy, saved together.
- An overview of which environment uses which shared configuration, with a way to rebind each one in place.
- Managing a list of reusable deployment or routing configurations.

## When not to use

- The deployment settings of one service: use `platform/edit/edit-resource#DeployableSettings`.
- Only the create form: use `platform/create/create-in-drawer#DeploymentSettings`.
- Running a deploy: use `platform/create/deploy-drawer`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Build and deployment` and one sentence that says every environment is linked automatically. Actions: Documentation and the primary `Create Deployment Setting` at `size="large"`, which opens the drawer (G).

### B. What a Deployment Setting is — `Alert` (required)

A small info `Alert`, closable, that explains the binding policy, the deployment policy, the automatic link and what sharing a setting does. It closes for the session.

### C. New service defaults — `SettingsSection`, `Card`, `Item`, `SettingRow`, `Select`, `Switch`, `SaveBar` (required)

A `SettingsSection` with an anchor around a flush `Card` and an `Item.List` of `SettingRow`s: Binding policy and Deployment policy as large `Select`s whose value reads the policy label, then `Apply to existing Deployment Settings` as a compact `Switch`. Changing any of them raises a `SaveBar` (entering and leaving with a short translate and fade, none under reduced motion) that says `You have unsaved changes.` with Discard and Save. Save spins, keeps the values, turns Apply off again and toasts what changed: with Apply on, how many settings now use the binding policy (Default is never changed).

### D. All services — `Accordion`, `Input`, `Tag`, `Select`, `Pagination` (required)

A `SettingsSection` around a flush `Card` with one collapsible `Accordion` item, closed at first, its trigger a level 3 heading: `All services`, the count and a warning `Tag` with how many services use a shared setting. Inside: a search `Input` over service and setting names (`v-bind="filterProps"` from a `useCollection` over the services), then a list named Services, ten services per page with a `Pagination` under it when more match, so an account with hundreds of services never mounts hundreds of `Select`s, with one entry per service (its name links to the service) and one row per environment: the environment and its deployment policy as small `Tag`s, a `Select` named `Deployment Setting for <service> <environment>` that offers only the settings with the same deployment policy (inactive ones disabled), `Linked automatically` while the link was never changed, and `Shared · N services` when the setting reaches more than one. A rebind applies at once and toasts; when the new setting is shared, the toast is a warning that says how many services a deploy now reaches. A search with no match shows a small `EmptyState` (`No matching services`) with Clear search, inside a polite status region.

### E. Deployment Settings controls — `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

The table-view controls row (`platform/view/table-view`): a `PropertyFilter` over name, reach (Shared, Dedicated, Unused), binding policy and status, Refresh and Download CSV as outlined `IconButton`s with a `Tooltip` each (Download CSV writes every match through the table's `exportCsv`, disabled with no match), and `CollectionPreferences` for page size and visible columns.

### F. Deployment Settings table — `DataTable`, `Table`, `Card`, `Tag`, `DropdownMenu`, `ConfirmDialog`, `EmptyState`, `useCollection` (required)

`DataTable` with `v-bind="tableProps"` in a flush `Card`, newest change first. Name, with a `System` `Tag` on Default; Services, the count with a `Shared` `Tag` when more than one service uses it and the service names on a `Tooltip`; Type (System or Custom, hidden by default); Binding policy; Deployment policy; Status as `Table.CellStatus`; Last modified as `Table.CellTime` with the author. `Table.CellActions` named after the setting, absent on Default: Edit, Clone (a copy named `<name>-copy` with no environment), then Delete in its own group, which asks in a `ConfirmDialog` that says how many services fall back to Default. `No matching Deployment Settings` with Clear filters sits in the table's `#empty` slot.

### G. Create and edit drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `DrawerTitle`, `DrawerClose`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Field`, `Textarea`, `RadioButton` (required)

This page owns the Deployment Setting form, in a medium right `Drawer` (`platform/create/create-in-drawer#DeploymentSettings` should match it field for field): General (Name, required and unique; Description; Active `Switch`) and Routing and policy (binding policy and deployment policy as `RadioButton` groups with a description each, starting from the saved defaults). Edit opens the same form filled, titled `Edit Deployment Setting`, with the deployment policy locked because it cannot change after creation. Cancel and the primary `Create Deployment Setting` or `Save changes`, which spins; the drawer cannot be dismissed while it saves. A missing or taken name shows on the field after submit and focus moves to it.

### H. Loading and no services — `Skeleton` (conditional)

On the first load, `Skeleton`s take the place of the two default `Select`s and of the services card, and the table shows its loading rows. An account with no service shows a small `EmptyState` in All services that says each new environment is linked automatically.

### Outcomes — through `toast`

Saving defaults, rebinding, creating, editing, cloning and deleting end in a toast; a rebind onto a shared setting is a warning. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Offer only settings whose deployment policy matches the environment's; an environment cannot publish with any other.
- Say when a setting is shared, in the table and on every environment row, and warn when a rebind makes a deploy reach more services.
- Keep the defaults behind one SaveBar, and say that Default is never changed when Apply to existing is on.
- Say how many services fall back to Default before a setting is deleted.

## Don't

- Don't offer Edit, Clone or Delete on Default; every environment falls back to it.
- Don't apply the defaults to existing settings without the explicit switch.
- Don't let the deployment policy change on an existing setting; the environments bound to it depend on it.

## Copy

- **Title:** `Build and deployment`. **Action:** `Create Deployment Setting`; the drawer titles `Create Deployment Setting` and `Edit Deployment Setting`, the submits `Create Deployment Setting` and `Save changes`. The label does not change on the way in.
- **No match:** `No matching services`, `No service or setting matches “…”.`, `Clear search`.
- **Sections:** `New service defaults`, `All services`, `Deployment Settings`.
- **Policies:** `Strict`, `Flexible`; `Single`, `Versioned`.
- **Tags:** `System`, `Shared`, `Linked automatically`, `Shared · 2 services`, `1 on a shared setting`.
- **Toasts:** `Deployment defaults saved.`, `checkout-api · Production now publishes with storefront-production.`, `preview-versioned created.`, `legacy-rollout deleted.`
- **Errors:** `This field is required.`, `A Deployment Setting with this name already exists.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- Each section title is an h2 with an anchor; the services accordion trigger is an h3 under it.
- Every environment `Select` is named `Deployment Setting for <service> <environment>`; the default `Select`s and the Switch take their row's title as their name.
- The services search is named, and a search with no match is announced as a status.
- The filter is named Filter Deployment Settings; Refresh and Download CSV are icon buttons with an accessible name and a tooltip; the row menu is named `Actions for <setting>`.
- The Services cell is focusable so its tooltip with the service names is reachable by keyboard.
- The SaveBar motion has a `motion-reduce` fallback.

## States

- Default: four services and five settings (Default, one shared by two services, one versioned, one dedicated, one inactive) with defaults, rebinding, the property filter, Refresh, Download CSV, preferences, create, edit, clone and delete wired.
- UnsavedChanges: the binding policy default changed; the SaveBar with Discard and Save.
- Empty: no service yet; All services shows an EmptyState and the table holds only Default.
- Loading: the first load; Skeletons and the table's loading rows.

## Related

- `platform/create/create-in-drawer#DeploymentSettings` — the create form this page opens.
- `platform/edit/edit-resource#DeployableSettings` — the deployment settings of one service.
- `platform/view/table-view` — the list pattern of the Deployment Settings table.
- `platform/edit/edit-resource#UnsavedChanges` — the SaveBar pattern of the defaults.
