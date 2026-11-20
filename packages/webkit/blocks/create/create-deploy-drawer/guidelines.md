# Deploy drawer

The drawer a platform deploys from, opened by Deploy on a service or a project. The user is about to put a version into traffic and needs to confirm exactly what goes out (each resource and dependency at a version), where it goes (a project and one of its environments) and what else it reaches (every project that shares the environment's Deployment Settings). One Deploy at the foot commits all of it.

## When to use

- A service or a project has a ready version and the user deploys it from its page or list.
- The deploy reaches more than the resource itself: dependencies at their own versions, or other projects through shared Deployment Settings.
- A service deploys to a project that may not exist yet; the Project section creates it in place.

## When not to use

- A release of several resources reviewed together: use `create/create-release-impact`. This drawer is the canonical surface for deploying one service or one project.

- Creating or editing an item inside a resource: use `create/create-drawer`.
- The first deploy at the end of a create flow: use `create/create-deploy-template` or `create/create-wizard` (CreateAndDeploy), which stream the create-flow card of `detail/detail-deployment-logs` in the page.
- Reading what a past deploy did: use `detail/detail-deployment-logs` or `detail/detail-version`.
- Binding one resource to another without deploying: use `create/create-resource-picker`.

## Building blocks

### A. Trigger and frame — `Drawer`, `DrawerTrigger`, `Button`, `DrawerContent` (required)

An outlined medium `Button` reading Deploy inside `DrawerTrigger`, on the service or project page. The `Drawer` is `size="large"`, portals over the page with an overlay and holds one `form` with an `aria-label` equal to the title.

### B. Panel header — `PanelHeader`, `DrawerTitle` (required)

`DrawerTitle` reads Deploy, or Build and deployment while a version is being built first. The drawer's own close button sits on the right; no Cancel anywhere.

### C. Sections — `PanelBody`, `SettingsGroup`, `Skeleton`, `Alert`, `Spinner` (required)

`PanelBody` holds one `fieldset` of `SettingsGroup` bands, each with a title and a `hint`: Resources, Project, Environment, Projects impacted on a service; Resources and Environment on a project. The order is the order of the decision: what, where, then what else it reaches. While the deploy targets load, `Skeleton` blocks stand in for Resources and Environment; a failed load is a danger `Alert` with Retry; a build in progress is one row with its version `Tag` and a `Spinner` in place of Resources.

### D. Resources card — `Card`, `Separator`, `Item`, `Tag`, `DropdownMenu`, `Input`, `Avatar`, `Button` (required)

`Card :padded="false"` with one small inline `Item` per resource, split by `Separator`s. Each row shows a small `Tag` reading Ready, or a warning tag when no version is ready, and the picked version. Change version, an outlined small `Button`, opens a `DropdownMenu`: the summary and a search `Input` in its top slot, one `DropdownMenu.Item` per version (the author `Avatar` on the left, the name with an Active `Tag`, the age on the right, the picked one `selected`), and a transparent Load more `Button` in its bottom slot. The menu gives the rows their roles, arrow-key movement, hover and focus, so the block never re-types them. Disable Change version when there is nothing to change to. On a phone the row title wraps (type, name and tag), the domain links truncate before their +N count, and Change version and the project Change menu move under the row instead of drawing over it.

### E. Dependencies — `Accordion`, `Item`, `Tag`, `DropdownMenu` (required)

A small `Accordion` below the resource rows, collapsed, listing the modules and integrations the service references, each with its own version and Change version menu. Dependencies go out with the deploy, so they are shown even when the user does not change them.

### F. Project — `ToggleGroup`, `Item`, `Tag`, `Link`, `Tooltip`, `Popover`, `DropdownMenu` (required on a service)

A full-width `ToggleGroup` in the card header switches between Use existing and Create new. The project is an outlined `Item`: its name, a New `Tag` when it will be created, and its domains grouped by environment, the first one a small `Link` (`target="_blank"`, with its external glyph) under a `Tooltip` that says it opens in a new tab, the rest behind a `+N` `Tag` whose `Popover.Trigger` is named "N more domains" and opens a searchable `Popover` listing each domain as a `Link`. Never hand-roll the anchors. Change opens a `DropdownMenu` of the projects grouped by how they relate to the service.

### G. Environment — `RadioGroup`, `Tag` (required)

Choice cards, a `RadioGroup` with `variant="card"` and one item per environment of the project, each with one sentence on how it serves traffic and a small `Tag` such as Last used. The group carries an `aria-label`.

### H. Projects impacted and commit — `Item`, `Tag`, `Link`, `Tooltip`, `Popover`, `PanelFooter`, `Button` (required on a service)

Every project the chosen environment's shared Deployment Settings deploy to, grouped by environment, the current one tagged Selected, with its domains shown like the Project card. `PanelFooter` holds one primary medium `Button` reading Deploy on the right, of `type="submit"`. On its left, once a version differs from the live one, one muted line counts the changes and names the environment they go live in.

### I. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

The block takes the deploy targets through props and emits every action; it fetches and deploys nothing. The record types (`DeployDrawerResource`, `DeployDrawerProjectGroup`, `DeployDrawerEnvironment`, `DeployDrawerImpact`, `DeployDrawerBuild`, `DeployDrawerValues`) and `DeployDrawerProps` are exported from `create-deploy-drawer.vue`, and `sample.ts` holds the sample records the Service drawer renders when they are left out (never while `loading` or `error` is set).

| Prop            | Type                          | What it does                                                                           |
| --------------- | ----------------------------- | -------------------------------------------------------------------------------------- |
| `resources`     | `DeployDrawerResource[]`      | The resources with their Ready versions and the dependencies they reference.           |
| `projectGroups` | `DeployDrawerProjectGroup[]`  | The projects Use existing offers, in groups.                                           |
| `newProject`    | `DeployDrawerProject`         | The project Create new makes.                                                          |
| `environments`  | `DeployDrawerEnvironment[]`   | The environments to go live in, the first selected by default.                         |
| `impacted`      | `DeployDrawerImpact[]`        | The projects the shared Deployment Settings reach, per environment.                    |
| `defaultValues` | `Partial<DeployDrawerValues>` | The versions, project and environment every open resets to.                            |
| `build`         | `DeployDrawerBuild`           | A build in progress: a Building row replaces Resources, the rest is inert, Deploy off. |
| `loading`       | `boolean`                     | The deploy targets are loading; `Skeleton` blocks, Deploy disabled.                    |
| `error`         | `string`                      | Why they failed to load, in a danger `Alert` with Retry; Deploy disabled.              |
| `v-model:open`  | `boolean`                     | Whether the drawer shows; the trigger opens it and Deploy closes it.                   |

| Event    | Payload           | When                                                                                     |
| -------- | ----------------- | ---------------------------------------------------------------------------------------- |
| `submit` | `(event, values)` | Deploy; `values` carry the picked version per resource, the project and the environment. |
| `retry`  | `(event)`         | Retry in the load error.                                                                 |

To go live, render the block from a page that owns the request and the deploy:

```vue
<script setup lang="ts">
  import CreateDeployDrawer, { type DeployDrawerValues } from './create-deploy-drawer.vue'

  const { data, pending, error, refresh } = useDeployTargets(serviceId)
  const { deploy } = useDeploy()
  const loadError = "The deploy targets couldn't be loaded. Check your connection and try again."
</script>

<template>
  <CreateDeployDrawer
    :resources="data?.resources ?? []"
    :project-groups="data?.projectGroups ?? []"
    :new-project="data?.newProject"
    :environments="data?.environments ?? []"
    :impacted="data?.impacted ?? []"
    :default-values="data?.defaults ?? {}"
    :loading="pending"
    :error="error ? loadError : ''"
    @retry="refresh"
    @submit="(_event, values: DeployDrawerValues) => deploy(values)"
  />
</template>
```

Then delete `sample.ts` and its import. The page reports the run through the toast (`state/state-async-submit`).

## Do

- Show every resource and dependency with the version that will go out, even when the user changes nothing.
- Preselect the last used project and environment, and say so with a tag.
- List every project a shared Deployment Setting reaches before the user deploys, not after.
- When no version is pinned, open as Build and deployment with a Building row, keep the other sections faded and `inert`, and disable Deploy until the build lands.
- On a project, warn with an `Alert` above the environments when its Deployment Settings also deploy elsewhere.
- Keep an environment that Strict Deployment Settings lock visible but disabled, with a Strict tag and one sentence naming the settings and the service they keep bound.
- Tag an environment Also deploys (warning) when the chosen environment's shared settings reach it, and say once, in a warning `Alert`, how many environments go live at once.
- Say in an info `Alert` when the deploy replaces another service on the chosen project, naming both.
- When a choice changes what the deploy reaches, reload that section in place: `Skeleton` rows, `aria-busy` on the region and one `role="status"` line; never clear the whole drawer.
- Tag a dependency other services reference as Shared, name them in a `Tooltip`, and say once that a shared dependency deploys at one version.
- Resolve the drawer in place: while the resources and environments load, keep the section titles and render `Skeleton` blocks shaped like the Resources card and the environment cards, with `aria-busy` and one status line, and Deploy disabled.
- When the targets fail to load, replace the sections with one danger `Alert` saying what failed and an outlined Retry; Deploy stays disabled.
- When the project has no environment, show the Environment section as a bordered small `EmptyState` with Add environment, and say in the footer why Deploy is disabled. A Resources card with nothing bound says so in one line instead of disappearing.
- When a dependency has no ready version, disable Deploy and say why in the footer, next to the button it disables.
- After Deploy, follow `state/state-async-submit`: the drawer closes and one toast per run turns from Deploying… into the outcome, with Edit (reopens the drawer with the same choices) and Redeploy.
- Raise toasts with `toast` only; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so this page body never renders a `Toaster`.

## Don't

- Don't deploy one service from a dialog, or ask for confirmation after Deploy; the drawer is the review. This is the one confirmation rule across the deploy surfaces: the surface that shows what goes live is the review, and nothing confirms it again. A release of several resources is reviewed on a page (`create/create-release-impact`, whose single `ConfirmDialog` states the reach); a dropped folder is reviewed in the Drop confirm of `create/create-deploy-progress-dialog`.
- Don't hide dependencies or impacted projects behind a second step.
- Don't let Change version list hundreds of versions at once; search plus Load more.
- Don't add a second commit such as Save as draft; one Deploy.
- Don't print the shared-settings warning on each impacted row; it belongs once, above them.
- Don't hide a locked environment, or let it be picked and fail at deploy time.
- Don't offer View deployments in the outcome toast; it carries Edit and Redeploy.

## Copy

- **Trigger, title, commit:** "Deploy" on all three; "Build and deployment" as the title only while a build runs first.
- **Section hints:** one sentence on what the section decides, e.g. "The project whose domains serve the service."
- **Version control:** "Change version", named "Change version of <resource>" for assistive technology; search placeholder and `aria-label` "Search versions"; footer "Load 10 more".
- **Project modes:** "Use existing" and "Create new".
- **Environment descriptions:** one sentence on how it serves, e.g. "Live traffic. One version serves the domain, and deploying replaces it."
- **Footer summary:** "1 change goes live in Production." or "3 changes go live in Production."
- **Load failure:** "The deploy targets for project-01 couldn't be loaded. Check your connection and try again." with "Retry".
- **No environment:** "No environment on this project", one sentence on why there is no target, and "Add environment"; footer "Add an environment to deploy."
- **Tags:** one or two words, e.g. "Ready", "Active", "Last used", "Selected", "New".
- **In progress:** the progressive verb with `…`, e.g. "Building…".
- **Run toast:** "Deploying web-app…" with "<version> to <environments>. It keeps running if you leave."; the outcome "web-app is live in Production." or "web-app wasn't deployed." with what failed and that nothing changed; actions "Edit" and "Redeploy".
- **Locks and reach:** "<settings> is Strict, so <service> stays bound to <environment>."; "Also deploys"; "<settings> is shared, so it deploys at one version."
- Follow `skills/webkit-microcopy`: Deploy, never publish or activate; sentence case; no em dash.

## Accessibility

- The drawer traps focus while open and returns it to the Deploy trigger on close.
- Opening the drawer moves focus to its first control.
- **⌘ Enter deploys (`Ctrl Enter` off Apple)** through the form's submit, the same path as Deploy. It stays inert while Deploy is disabled (loading, load error, a build running, no environment); Deploy carries `aria-keyshortcuts` and an `aria-hidden` `Kbd`, and the `?` dialog lists it under Drawer.
- The `form` and the `ToggleGroup` carry `aria-label`s; the environment group is named by its `aria-label`.
- The version menu is a `role="menu"` moved with the arrow keys, each version a `menuitem` named by its version, author and age; the current one carries `aria-current`; search inputs have an `aria-label` that matches the placeholder.
- Each impacted environment group has an `aria-label` with its count, e.g. "Projects impacted in Production (3)".
- Faded sections during a build are `inert`, so keyboard users cannot reach controls that do nothing yet.
- A section that reloads carries `aria-busy="true"` with its `Skeleton` rows `aria-hidden`, and a `role="status"` line reads Loading the projects this deployment reaches, or Loading dependencies.
- A locked environment's radio is `disabled`; its reason is the card's description, so it is read with the choice.
- The Shared tag sits in a focusable wrapper so its `Tooltip` opens from the keyboard, and its name already says who else references it.
- A disabled Deploy is described by the footer line that explains why (`aria-describedby`).
- Run progress and outcome reach screen readers through the toast region, so the user hears them from any page.
- Glyphs in rows are decorative and carry `aria-hidden="true"`; tags give the state in words.

## States

- Service: a service deploying environment first (the records passed in, or the sample); Resources, Project with the last used project, Environment and Projects impacted, and the footer counting the one version change that goes live in Production.
- Building: no pinned version (`build` is set); titled Build and deployment with a Building row in place of Resources, the other sections faded and inert, Deploy disabled.
- ServiceProjectFirst: the project-first flow, its own SFC on the sample resources; Resources, the Project card with the last used project and a Change popover, then every environment.
- Project: deploying a project; its service and storage in Resources, Production and Preview, and a warning about other projects that share its storefront settings.
- Environment: a locked Strict environment, an Also deploys tag, the replace and multi-environment `Alert`s, Projects impacted grouped per environment and reloaded on switch; the run ends in a success toast with Edit and Redeploy.
- Loading: the resources and environments resolving (`loading` on the Service drawer; this variant shows the project drawer); `Skeleton` blocks under the Resources and Environment titles, an `aria-busy` region with a status line, Deploy disabled.
- LoadError: the deploy targets failed to load (`error` on the Service drawer, with `retry`; this variant shows the project drawer); a danger `Alert` with Retry, which reloads them as Skeletons, and Deploy disabled.
- NoEnvironment: nothing bound and no environment; a one-line empty Resources card, an `EmptyState` with Add environment, and Deploy disabled with the reason in the footer.
- Dependencies: the open Dependencies disclosure with a Shared dependency, a not-versioned integration and a dependency with no ready version that blocks Deploy; changing the service version reloads the list. The first run fails and its toast offers Edit and Redeploy; Redeploy succeeds.

## Related

- `create/create-drawer` — the drawer that creates items rather than deploying.
- `detail/detail-deployment-logs` — the run a deploy streams once it starts.
- `state/state-async-submit` — the toast and outcome rule every deploy started here follows.
- `detail/detail-deployment-logs` — the logs of a deploy after it ran.
- `detail/detail-version` — what a version contains before it is deployed.
- `create/create-resource-picker` — the Existing or New pattern the Project section follows.
- `SettingsGroup` — the band each section uses; see `skills/webkit-create-surface` for the drawer commit model.
