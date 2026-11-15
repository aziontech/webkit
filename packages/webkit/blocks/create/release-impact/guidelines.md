# Release impact

The Review and deploy page of a release that carries several resources at once: a service, the policy in front of it, its storage, its error page and every dependency they reference. The user is about to put all of it into traffic and needs to see, before deploying, which version of each resource goes out, which dependencies go with it, and every Deployment Setting, environment and project the release reaches. One Deploy release at the foot commits it, after one confirmation.

## When to use

- A release spans several resources that deploy together, each at its own version.
- The release reaches projects through shared Deployment Settings, and the user must see how far it goes before it goes.
- Dependencies are detected from the resources and may be shared between them.

## When not to use

- Deploying one service or project from its page: use `create/deploy-drawer`, which is the default way to deploy.
- Watching several Deployment Settings activate after a deploy started: use `create/deploy-progress-dialog`.
- Reading what a past deploy did: use `detail/deployment-logs`.
- Switching one resource back to an earlier version: use `detail/version-detail` (Revert).

## Building blocks

### A. Page heading — `PageHeader` (required)

The page opens with a large `PageHeader` (its `h1` reads Review and deploy) and one sentence on what the page is for. No breadcrumb of its own; the shell gives it.

### B. Outcome — `Alert`, `Button` (required after a run)

When a run ends, one `Alert` above the columns says how it ended: `severity="danger"` with what was refused and that nothing changed in traffic, or `severity="success"` with what serves now. Both carry **Edit** and **Redeploy** in the `action` slot. The page `Alert` is the persistent outcome; the run's toast auto-dismisses and carries no actions, so the user never meets the same pair twice.

### C. Resource cards — `Card`, `Switch`, `Tag`, `Tooltip` (required)

One flush `Card` per resource (a named `section`, its `header` slot holding the type, the tags and the switch), in the order of the request path (service, policy, storage, error page). The header has the type icon and label and, on the end side, a Required `Tag` (warning), a Read-only `Tag` with a lock when the release keeps the active version, or an include `Switch` named by `aria-label` and explained by a `Tooltip` ("Leave edge-policy out of this release"). A left-out resource collapses to one sentence saying what keeps serving.

### D. Resource and version — `Field`, `Input`, `Select`, `Tag` (required)

Two `Field`s side by side from `sm` up: the resource as a `readonly` `Input` (so its `Field.Label` names a real control) and its version. The version `Select` offers Track latest Ready first (with "resolves at deploy") and a Pin a ready version group, each option with a Current `Tag` and its age. When the version tracks the latest, the `Field.Description` names the version it resolves to now. When nothing is Ready, the `Select` is disabled and `invalid`, `Field.Error` gives the reason, and a transparent Build a version `Button` links to its versions.

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

`SaveBar variant="docked"` at the bottom of the page: the hint on the start side; on the end side the blocker (if any) with a warning icon, Cancel (outlined, back to the service) and Deploy release (primary, cloud icon). Deploy release opens a `ConfirmDialog` (`variant="primary"`) titled "Deploy this release?" that lists every resource and version and the reach. Confirm closes it and starts the run as an async action (`state/async-submit`): one toast id turns from `toast.loading` ("Deploying release…", with "It keeps running if you leave.") into `toast.success` or `toast.error`, `duration: 0`, `closable`, with **Edit** and **Redeploy**. Never View deployments. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so the page never renders a `Toaster`.

### Before the review: choosing the Deployment Settings

When the release starts from the settings rather than from a service, a ChooseSettings step comes first, with the same page frame and footer. One sentence says what a Deployment Setting binds and that picking one deploys into everything that uses it. Below it, a large search `Input` counting the settings, and on the end side the number selected with transparent Select all and Clear. The settings are horizontal `Field` choice cards with a `Checkbox`, grouped under a small heading (Your Deployment Settings, Managed): the name with a Shared (warning) or Managed `Tag`, the policy line, up to three environment `Tag`s and an `OverflowCount` chip (+N) that names the rest from the keyboard and to screen readers, and the workloads it affects, a `Skeleton` while that count loads. An inactive setting cannot be picked: it sits in its own group as a dashed note with an Inactive `Tag`, one sentence and a link to activate it. A search with no match shows a small `EmptyState` with Clear search. Continue (primary) stays disabled, with the reason in the footer hint, until one setting is selected.

## Do

- Show every resource and dependency with the version that goes out, including the ones the user did not touch.
- Say what tracking the latest Ready version resolves to now.
- Block Deploy release only for something the user can fix here, and say what it is in the footer.
- Keep Deploy possible when the impact cannot be computed; say the impact is unknown.
- Report the outcome in the page `Alert` with Edit and Redeploy; the toast only announces it and dismisses itself.

## Don't

- Don't hide shared dependencies; changing one changes it everywhere in the release.
- Don't confirm twice: the page is the review, the `ConfirmDialog` is the only step before the run. Deploying one service or one project is `create/deploy-drawer`, which confirms nothing after Deploy; this page is only for a release of several resources.
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

## States

- ChooseSettings: the step before the review; grouped checkbox choice cards with search, Select all and Clear, a loading workloads count, an inactive setting with its activate link, and Continue disabled until one is selected.
- Ready: every resource with a version, the impact computed, Tree view.
- Loading: the impact being computed.
- Unavailable: the impact could not be read; Retry lands on a truncated list.
- MissingVersion: a resource without a Ready version blocks the deploy.
- Error: the last run was refused; an error toast announces it, and Edit and Redeploy sit on the page `Alert`.

## Related

- `create/deploy-drawer` — deploying one service or project.
- `create/deploy-progress-dialog` — several Deployment Settings activating after the deploy.
- `state/async-submit` — the toast rule every deploy follows.
- `detail/version-detail` — one version, its history and revert.
