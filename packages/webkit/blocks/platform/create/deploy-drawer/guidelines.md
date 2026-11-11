# Deploy drawer

The drawer a platform deploys from, opened by Deploy on a service or a project. The user is about to put a version into traffic and needs to confirm exactly what goes out (each resource and dependency at a version), where it goes (a project and one of its environments) and what else it reaches (every project that shares the environment's Deployment Settings). One Deploy at the foot commits all of it.

## When to use

- A service or a project has a ready version and the user deploys it from its page or list.
- The deploy reaches more than the resource itself: dependencies at their own versions, or other projects through shared Deployment Settings.
- A service deploys to a project that may not exist yet; the Project section creates it in place.

## When not to use

- Creating or editing an item inside a resource: use `platform/create/create-in-drawer`.
- The first deploy at the end of a create flow: use `platform/create/deploy-template` or `platform/create/provision-wizard`, which stream `platform/create/deployment-flow` in the page.
- Reading what a past deploy did: use `platform/detail/deployment-logs` or `platform/detail/version-detail`.
- Binding one resource to another without deploying: use `platform/create/resource-picker`.

## Building blocks

### A. Trigger and frame — `Drawer`, `DrawerTrigger`, `Button`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent` (required)

An outlined medium `Button` reading Deploy inside `DrawerTrigger`, on the service or project page. The `Drawer` is `size="medium"`, portals over the page with an overlay and holds one `form` with an `aria-label` equal to the title.

### B. Panel header — `PanelHeader`, `DrawerTitle`, `DrawerClose` (required)

`DrawerTitle` reads Deploy, or Build and deployment while a version is being built first. `DrawerClose` on the right; no Cancel anywhere.

### C. Sections — `PanelContent`, `SettingsSection` (required)

`PanelContent` holds one `fieldset` of `SettingsSection` bands, each with a title and a `hint`: Resources, Project, Environment, Projects impacted on a service; Resources and Environment on a project. The order is the order of the decision: what, where, then what else it reaches.

### D. Resources card — `Card`, `Separator`, `Item`, `Tag`, `DropdownMenu`, `Input`, `Avatar`, `Button` (required)

`Card :padded="false"` with one small inline `Item` per resource, split by `Separator`s. Each row shows a small `Tag` reading Ready, or a warning tag when no version is ready, and the picked version. Change version, an outlined small `Button`, opens a `DropdownMenu`: the summary and a search `Input` in its top slot, one `DropdownMenu.Option` per version (the author `Avatar` on the left, the name with an Active `Tag`, the age on the right, the picked one `selected`), and a transparent Load more `Button` in its bottom slot. The menu gives the rows their roles, arrow-key movement, hover and focus, so the block never re-types them. Disable Change version when there is nothing to change to.

### E. Dependencies — `Accordion`, `Item`, `Tag`, `DropdownMenu` (required)

A small `Accordion` below the resource rows, collapsed, listing the modules and integrations the service references, each with its own version and Change version menu. Dependencies go out with the deploy, so they are shown even when the user does not change them.

### F. Project — `ToggleGroup`, `Item`, `Tag`, `Tooltip`, `Popover`, `DropdownMenu` (required on a service)

A full-width `ToggleGroup` in the card header switches between Use existing and Create new. The project is an outlined `Item`: its name, a New `Tag` when it will be created, and its domains grouped by environment, the first one linked with a `Tooltip`, the rest behind a `+N` `Tag` that opens a searchable `Popover`. Change opens a `DropdownMenu` of the projects grouped by how they relate to the service.

### G. Environment — `Field`, `RadioButton`, `Tag` (required)

Choice cards, one horizontal `Field` with a `RadioButton` per environment of the project, each with one sentence on how it serves traffic and a small `Tag` such as Last used. The group carries an `aria-label`.

### H. Projects impacted and commit — `Item`, `Tag`, `Tooltip`, `Popover`, `PanelFooter`, `Button` (required on a service)

Every project the chosen environment's shared Deployment Settings publish to, grouped by environment, the current one tagged Selected, with its domains shown like the Project card. `PanelFooter` holds one primary medium `Button` reading Deploy, alone on the right, of `type="submit"`.

## Do

- Show every resource and dependency with the version that will go out, even when the user changes nothing.
- Preselect the last used project and environment, and say so with a tag.
- List every project a shared Deployment Setting reaches before the user deploys, not after.
- When no version is pinned, open as Build and deployment with a Building row, keep the other sections faded and `inert`, and disable Deploy until the build lands.
- On a project, warn with an `Alert` above the environments when its Deployment Settings also publish elsewhere.

## Don't

- Don't deploy from a dialog, or ask for confirmation after Deploy; the drawer is the review.
- Don't hide dependencies or impacted projects behind a second step.
- Don't let Change version list hundreds of versions at once; search plus Load more.
- Don't add a second commit such as Save as draft; one Deploy.
- Don't print the shared-settings warning on each impacted row; it belongs once, above them.

## Copy

- **Trigger, title, commit:** "Deploy" on all three; "Build and deployment" as the title only while a build runs first.
- **Section hints:** one sentence on what the section decides, e.g. "The project whose domains serve the service."
- **Version control:** "Change version"; search placeholder and `aria-label` "Search versions"; footer "Load 10 more".
- **Project modes:** "Use existing" and "Create new".
- **Environment descriptions:** one sentence on how it serves, e.g. "Live traffic. One version serves the domain, and deploying replaces it."
- **Tags:** one or two words, e.g. "Ready", "Active", "Last used", "Selected", "New".
- **In progress:** the progressive verb with `…`, e.g. "Building…".
- Follow `skills/webkit-microcopy`: Deploy, never publish or activate; sentence case; no em dash.

## Accessibility

- The drawer traps focus while open and returns it to the Deploy trigger on close.
- The `form` and the `ToggleGroup` carry `aria-label`s; the environment group is named by its `aria-label`.
- The version menu is a `role="menu"` moved with the arrow keys, each version a `menuitem` named by its version, author and age; the current one carries `aria-current`; search inputs have an `aria-label` that matches the placeholder.
- Each impacted environment group has an `aria-label` with its count, e.g. "Projects impacted in Production (3)".
- Faded sections during a build are `inert`, so keyboard users cannot reach controls that do nothing yet.
- Glyphs in rows are decorative and carry `aria-hidden="true"`; tags give the state in words.

## States

- Service: a service deploying environment first; Resources, Project with the last used project, Environment and Projects impacted.
- Building: no pinned version; titled Build and deployment with a Building row in place of Resources, the other sections faded and inert, Deploy disabled.
- ServiceProjectFirst: the project-first flow; Resources, the Project card with the last used project and a Change popover, then every environment.
- Project: deploying a project; its service and storage in Resources, Production and Preview, and a warning about other projects that share its storefront settings.

## Related

- `platform/create/create-in-drawer` — the drawer that creates items rather than deploying.
- `platform/create/deployment-flow` — the run a deploy streams once it starts.
- `platform/detail/deployment-logs` — the logs of a deploy after it ran.
- `platform/detail/version-detail` — what a version contains before it is deployed.
- `platform/create/resource-picker` — the Existing or New pattern the Project section follows.
- `SettingsSection` — the band each section uses; see `skills/webkit-create-surface` for the drawer commit model.
