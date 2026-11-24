# Release impact

The Review and deploy page of a release that carries several resources at once: a service, the policy in front of it, its storage, its error page and every dependency they reference. The user is about to put all of it into traffic and needs to see, before deploying, which version of each resource goes out, which dependencies go with it, and every Deployment Setting, environment and project the release reaches. One Deploy release at the foot commits it, after one confirmation.

## When to use

- A release spans several resources that deploy together, each at its own version.
- The release reaches projects through shared Deployment Settings, and the user must see how far it goes before it goes.
- Dependencies are detected from the resources and may be shared between them.

## When not to use

- Deploying one service or project from its page: use `create/create-deploy-drawer`, which is the default way to deploy.
- Watching several Deployment Settings activate after a deploy started: use `create/create-deploy-progress-dialog`.
- Reading what a past deploy did: use `detail/detail-deployment-logs`.
- Switching one resource back to an earlier version: use `detail/detail-version` (Revert).

## Building blocks

### A. Page heading — `PageHeader` (required)

The page opens with a large `PageHeader` (its `h1` reads Review and deploy) and one sentence on what the page is for. No breadcrumb of its own; the shell gives it.

### B. Outcome — `Alert`, `Button` (required after a run)

When a run ends, one `Alert` above the columns says how it ended: `severity="danger"` with what was refused and that nothing changed in traffic, or `severity="success"` with what serves now. Both carry **Edit** and **Redeploy** in the `action` slot. The page `Alert` is the outcome; when the run ends the loading toast is dismissed and no outcome toast is raised, so nothing covers the docked bar and the user never meets the same message twice.

### C. Resource cards — `Card`, `Switch`, `Tag`, `Tooltip` (required)

One flush `Card` per resource (a named `section`, its `header` slot holding the type, the tags and the switch), in the order of the request path (service, policy, storage, error page). The header has the type icon and label and, on the end side, a Required `Tag` (warning), a Read-only `Tag` with a lock when the release keeps the active version, or an include `Switch` named by `aria-label` and explained by a `Tooltip` ("Leave edge-policy out of this release"). A left-out resource collapses to one sentence saying what keeps serving.

### D. Resource and version — `KeyValueList`, `Field`, `Select`, `Tag` (required)

Side by side from `sm` up: the resource name as text in a `KeyValueList` (it is fixed, so it is not a field and takes no Tab stop) and its version `Field`. A Read-only resource shows both the name and the kept version as text in one two-column `KeyValueList`; its header already carries the Read-only `Tag`, so no disabled `Select` is drawn. The version `Select` offers Track latest Ready first (with "resolves at deploy") and a Pin a ready version group, each option with a Current `Tag` and its age. When the version tracks the latest, the `Field.Description` names the version it resolves to now. When nothing is Ready, the `Select` is disabled and `invalid`, `Field.Error` gives the reason, and a transparent Build a version `Button` links to its versions.

### E. Dependencies — `Badge`, `Accordion`, `Alert`, `Tag`, `Tooltip`, `Select` (required when a resource references others)

A box under the resource fields headed Dependencies with a count `Badge`. A `type="multiple"` `Accordion`, open by default, groups them by type (Modules, Integrations) with a count each. Each dependency has its own version `Select` labelled "Version of <name>" for screen readers. A dependency referenced by other resources carries a Shared `Tag` whose `Tooltip` names them, and its group opens with one info `Alert`: a shared dependency deploys at one version.

### F. Impact — `Card`, `ToggleGroup`, `Spinner`, `Skeleton`, `Alert`, `Button` (required)

The right column, sticky from `xl`. The `Card` header has the title Impact and, once ready, a small `ToggleGroup` named Impact view with Tree and Flow.

- **Tree** — a nested list: each Deployment Setting with its domain count, its environments with their project count, and the projects with theirs. Rails are drawn with logical borders, so they mirror under RTL. It is a static read-out, not `Tree`: `Tree` is an interactive `role="tree"` (arrow keys, expand and select), and a tree role with nothing to operate would announce controls that do nothing. Use `Tree` once the impact becomes navigable.
- **Flow** — the same data left to right: the setting as a raised card, an arrow, then one card per environment listing its projects. It is plain lists and cards, not `FlowDiagram`: `FlowDiagram` still carries `aria-required-parent` and `aria-required-children` findings, and this view has nothing to connect beyond one level.
- **Loading** — Computing impact… with a `Spinner` and three `Skeleton` lines; the region is `aria-busy` and a status line announces it.
- **Unavailable** — a warning `Alert` saying the impact is unknown, how many settings are selected, and Retry. Deploying stays possible.
- **Partial** — the list was truncated: a warning `Alert` above the tree.

The `Card` footer sums the reach in one sentence: projects, environments and Deployment Settings.

### G. Footer and commit — `SaveBar`, `Button`, `ConfirmDialog` (required)

`SaveBar variant="docked"` at the bottom of the page: the hint on the start side; on the end side the blocker (if any) with a warning icon, Cancel (outlined, back to the service) and Deploy release (primary, cloud icon). Deploy release opens a `ConfirmDialog` (`variant="primary"`) titled "Deploy this release?" that lists every resource and version and the reach. Confirm closes it and emits `deploy`; the parent sets `deploying`, then `deployed` or `deployError`, and the block shows the run as an async action (`state/state-async-submit`): one `toast.loading` ("Deploying release…", with "It keeps running if you leave.") follows the run, and when it ends that toast is dismissed and the page `Alert` takes over with **Edit** and **Redeploy**. Never View deployments. On a phone the hint is hidden and Cancel and Deploy release share one row, so the bar stays short. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

### Before the review: choosing the Deployment Settings

When the release starts from the settings rather than from a service, a ChooseSettings step comes first, with the same page frame and footer. One sentence says what a Deployment Setting binds and that picking one deploys into everything that uses it. Below it, a large search `Input` counting the settings, and on the end side the number selected with transparent Select all and Clear. The settings are horizontal `Field` choice cards with a `Checkbox`, grouped under a small heading (Your Deployment Settings, Managed): the name with a Shared (warning) or Managed `Tag`, the policy line, up to three environment `Tag`s and an `OverflowCount` chip (+N) that names the rest from the keyboard and to screen readers, and the workloads it affects, a `Skeleton` while that count loads. An inactive setting cannot be picked: it sits in its own group as a dashed note with an Inactive `Tag`, one sentence and a link to activate it. A search with no match shows a small `EmptyState` with Clear search. Continue (primary) stays disabled, with the reason in the footer hint, until one setting is selected.

### H. Shortcut keycap — `Kbd` (optional)

A small `Kbd` (`aria-hidden`) inside the primary button shows its keyboard shortcut (⌘ S to save, ⌘ Enter to submit or run, Ctrl off Apple); the button carries the same keys in `aria-keyshortcuts`.

## Data

The block takes the release and its impact through props and emits every action; it fetches nothing and runs no deploy of its own. `ReleaseImpactResource`, `ReleaseImpactSettings` and `ReleaseImpactProps` (with the version, dependency, environment and project types) are exported from `create-release-impact.vue`, and `sample.ts` holds the sample resources and Deployment Settings the block renders when `resources` or `impact` is left out (the impact sample never renders while `loading` or `error` is set). The switches and version selects edit a local copy of `resources`; `deploy` carries the included resources at the versions picked.

| Prop          | Type                      | What it does                                                                                            |
| ------------- | ------------------------- | ------------------------------------------------------------------------------------------------------- |
| `resources`   | `ReleaseImpactResource[]` | The resource cards; a resource with no `versions` blocks the deploy.                                    |
| `impact`      | `ReleaseImpactSettings[]` | The Deployment Settings the release reaches, with their environments and projects (Tree and Flow).      |
| `loading`     | `boolean`                 | The impact is being computed: the Impact card shows its skeleton and the footer says Computing impact…. |
| `error`       | `string`                  | Why the impact could not be read, shown in the warning alert with Retry. The release can still deploy.  |
| `truncated`   | `boolean`                 | The projects list came back truncated; a warning sits above the tree.                                   |
| `deploying`   | `boolean`                 | The run is in flight: Deploy release spins, the switches lock and the loading toast shows.              |
| `deployed`    | `boolean`                 | The last run deployed: the success `Alert` with Edit and Redeploy.                                      |
| `deployError` | `string`                  | Why the last run failed, shown in the danger `Alert` with Edit and Redeploy.                            |

| Event    | Payload              | When                                                                          |
| -------- | -------------------- | ----------------------------------------------------------------------------- |
| `deploy` | `(event, resources)` | The confirm dialog was accepted, or Redeploy pressed; the included resources. |
| `retry`  | `(event)`            | Retry in the unavailable impact alert.                                        |
| `edit`   | `(event)`            | Edit in the outcome alert; the alert closes and focus moves to Resources.     |

To go live, render the block from a page that owns the release, the impact request and the run:

```vue
<script setup lang="ts">
  import CreateReleaseImpact from './create-release-impact.vue'

  const { release } = useRelease()
  const { data: impact, pending, error, refresh } = useReleaseImpact(release)
  const { run, running, done, failure } = useDeployRelease()
  const impactError =
    'The projects that deploy with these settings could not be read, so the impact is unknown. Retry, or deploy without the preview.'
</script>

<template>
  <CreateReleaseImpact
    :resources="release"
    :impact="impact ?? []"
    :loading="pending"
    :error="error ? impactError : ''"
    :truncated="impact?.truncated"
    :deploying="running"
    :deployed="done"
    :deploy-error="failure ?? ''"
    @retry="refresh"
    @deploy="(event, resources) => run(resources)"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Show every resource and dependency with the version that goes out, including the ones the user did not touch.
- Say what tracking the latest Ready version resolves to now.
- Block Deploy release only for something the user can fix here, and say what it is in the footer.
- Keep Deploy possible when the impact cannot be computed; say the impact is unknown.
- Report the outcome in the page `Alert` with Edit and Redeploy; dismiss the loading toast when the run ends and raise no outcome toast over the docked bar.

## Don't

- Don't hide shared dependencies; changing one changes it everywhere in the release.
- Don't confirm twice: the page is the review, the `ConfirmDialog` is the only step before the run. Deploying one service or one project is `create/create-deploy-drawer`, which confirms nothing after Deploy; this page is only for a release of several resources.
- Don't keep the user on the page while it runs; the run reports wherever they are.
- Don't draw the Flow view with `FlowDiagram` until its list semantics pass axe.

## Copy

- **Title:** "Review and deploy". **Commit:** "Deploy release"; in progress "Deploying…".
- **Confirmation:** "Deploy this release?" and one sentence with the resources, versions and reach.
- **Selecting settings:** title "Select Deployment Settings"; search "Search 6 Deployment Settings"; "2 selected", "Select all", "Clear"; workloads "4 workloads affected" or "No workloads deploy with it yet"; no match "No Deployment Settings match" with "Clear search"; footer "Select at least one Deployment Setting to continue."
- **Versions:** "Track latest Ready", "resolves at deploy", "Pin a ready version", tag "Current".
- **Blockers:** "<name> has no Ready version, so the release cannot be deployed."
- **Outcome:** "Release deployed." / "The release wasn't deployed." with the cause and that nothing changed in traffic.
- Follow `skills/webkit-microcopy`: Deploy, never publish; sentence case; no em dash.

## Accessibility

- Each resource card is a `section` named by its type and resource; the Resources heading takes focus on Edit.
- Every `Select` is labelled through its `Field` (visible for the resource, `sr-only` for dependencies).
- The include `Switch` has an `aria-label`; its `Tooltip` repeats it for pointer users.
- The Shared `Tag` sits in a focusable wrapper so its `Tooltip` opens from the keyboard.
- The Impact region is `aria-busy` while loading and announces it in a `role="status"` line.
- In ChooseSettings each group is a `role="group"` named by its heading, each choice card is a `label` around its `Checkbox`, the selected count is a polite live region, and a loading workloads count is read as text rather than a bare `Skeleton`.
- The `ConfirmDialog` traps focus and returns it to Deploy release.
- `⌘ Enter` (`Ctrl Enter` off Apple) opens the deploy confirmation, the same as Deploy release, and does nothing while the release can't be deployed; the release is only deployed from the confirmation. Deploy release carries `aria-keyshortcuts` and a `Kbd` keycap.

## States

- ChooseSettings: the step before the review; grouped checkbox choice cards with search, Select all and Clear, a loading workloads count, an inactive setting with its activate link, and Continue disabled until one is selected.
- Ready: `resources` all have a version and `impact` is computed; Tree view.
- Loading: `loading` is set while the impact is computed.
- Unavailable: `error` says the impact could not be read; Retry emits `retry`, and a truncated answer sets `truncated`.
- MissingVersion: a resource in `resources` has no `versions`, which blocks the deploy.
- Error: `deployError` says the last run was refused; the danger page `Alert` announces it with Edit and Redeploy, and no toast covers the bar.

## Related

- `create/create-deploy-drawer` — deploying one service or project.
- `create/create-deploy-progress-dialog` — several Deployment Settings activating after the deploy.
- `state/state-async-submit` — the toast rule every deploy follows.
- `detail/detail-version` — one version, its history and revert.
