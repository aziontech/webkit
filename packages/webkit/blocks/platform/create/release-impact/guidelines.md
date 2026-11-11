# Release impact

The Review and deploy page of a release that carries several resources at once: a service, the policy in front of it, its storage, its error page and every dependency they reference. The user is about to put all of it into traffic and needs to see, before deploying, which version of each resource goes out, which dependencies go with it, and every Deployment Setting, environment and project the release reaches. One Deploy release at the foot commits it, after one confirmation.

## When to use

- A release spans several resources that deploy together, each at its own version.
- The release reaches projects through shared Deployment Settings, and the user must see how far it goes before it goes.
- Dependencies are detected from the resources and may be shared between them.

## When not to use

- Deploying one service or project from its page: use `platform/create/deploy-drawer`, which is the default way to deploy.
- Watching several Deployment Settings activate after a deploy started: use `platform/create/deploy-progress-dialog`.
- Reading what a past deploy did: use `platform/detail/deployment-logs`.
- Switching one resource back to an earlier version: use `platform/detail/version-detail` (Revert).

## Building blocks

The page opens with an `h1` reading Review and deploy and one sentence on what the page is for. No breadcrumb of its own; the shell gives it.

### A. Outcome — `Alert`, `Button` (required after a run)

When a run ends, one `Alert` above the columns says how it ended: `severity="danger"` with what was refused and that nothing changed in traffic, or `severity="success"` with what serves now. Both carry **Edit** and **Redeploy** in the `action` slot, the same two actions as the toast.

### B. Resource cards — `Switch`, `Tag`, `Tooltip` (required)

One bordered card per resource, in the order of the request path (service, policy, storage, error page). The header has the type icon and label and, on the end side, a Required `Tag` (warning), a Read-only `Tag` with a lock when the release keeps the active version, or an include `Switch` named by `aria-label` and explained by a `Tooltip` ("Leave edge-policy out of this release"). A left-out resource collapses to one sentence saying what keeps serving.

### C. Resource and version — `Field`, `Select`, `Tag` (required)

Two `Field`s side by side from `sm` up: the resource (read-only box) and its version. The version `Select` offers Track latest Ready first (with "resolves at deploy") and a Pin a ready version group, each option with a Current `Tag` and its age. When the version tracks the latest, the `Field.Description` names the version it resolves to now. When nothing is Ready, the `Select` is disabled and `invalid`, `Field.Error` gives the reason, and a transparent Build a version `Button` links to its versions.

### D. Dependencies — `Badge`, `Accordion`, `Alert`, `Tag`, `Tooltip`, `Select` (required when a resource references others)

A box under the resource fields headed Dependencies with a count `Badge`. A `type="multiple"` `Accordion`, open by default, groups them by type (Modules, Integrations) with a count each. Each dependency has its own version `Select` labelled "Version of <name>" for screen readers. A dependency referenced by other resources carries a Shared `Tag` whose `Tooltip` names them, and its group opens with one info `Alert`: a shared dependency deploys at one version.

### E. Impact — `Card`, `ToggleGroup`, `Spinner`, `Skeleton`, `Alert`, `Button` (required)

The right column, sticky from `xl`. The `Card` header has the title Impact and, once ready, a small `ToggleGroup` named Impact view with Tree and Flow.

- **Tree** — a nested list: each Deployment Setting with its domain count, its environments with their project count, and the projects with theirs. Rails are drawn with logical borders, so they mirror under RTL.
- **Flow** — the same data left to right: the setting as a raised card, an arrow, then one card per environment listing its projects. It is plain lists and cards, not `Flow`: `Flow` still carries `aria-required-parent` and `aria-required-children` findings, and this view has nothing to connect beyond one level.
- **Loading** — Computing impact… with a `Spinner` and three `Skeleton` lines; the region is `aria-busy` and a status line announces it.
- **Unavailable** — a warning `Alert` saying the impact is unknown, how many settings are selected, and Retry. Deploying stays possible.
- **Partial** — the list was truncated: a warning `Alert` above the tree.

The `Card` footer sums the reach in one sentence: projects, environments and Deployment Settings.

### F. Footer and commit — `Button`, `ConfirmDialog`, `Toaster` (required)

A sticky bar: the hint on the start side; on the end side the blocker (if any) with a warning icon, Cancel (outlined, back to the service) and Deploy release (primary, cloud icon). Deploy release opens a `ConfirmDialog` (`kind="primary"`) titled "Deploy this release?" that lists every resource and version and the reach. Confirm closes it and starts the run as an async action (`platform/states/async-submit`): one toast id turns from `toast.loading` ("Deploying release…", with "It keeps running if you leave.") into `toast.success` or `toast.error`, `duration: 0`, `closable`, with **Edit** and **Redeploy**. Never View deployments.

## Do

- Show every resource and dependency with the version that goes out, including the ones the user did not touch.
- Say what tracking the latest Ready version resolves to now.
- Block Deploy release only for something the user can fix here, and say what it is in the footer.
- Keep Deploy possible when the impact cannot be computed; say the impact is unknown.
- Report the outcome through the toast and the page `Alert`, both with Edit and Redeploy.

## Don't

- Don't hide shared dependencies; changing one changes it everywhere in the release.
- Don't confirm twice: the page is the review, the `ConfirmDialog` is the only step before the run.
- Don't keep the user on the page while it runs; the run reports wherever they are.
- Don't draw the Flow view with `Flow` until its list semantics pass axe.

## Copy

- **Title:** "Review and deploy". **Commit:** "Deploy release"; in progress "Deploying…".
- **Confirmation:** "Deploy this release?" and one sentence with the resources, versions and reach.
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
- The `ConfirmDialog` traps focus and returns it to Deploy release.

## States

- Ready: every resource with a version, the impact computed, Tree view.
- Loading: the impact being computed.
- Unavailable: the impact could not be read; Retry lands on a truncated list.
- MissingVersion: a resource without a Ready version blocks the deploy.
- Failed: the last run was refused; Edit and Redeploy on the toast and the page `Alert`.

## Related

- `platform/create/deploy-drawer` — deploying one service or project.
- `platform/create/deploy-progress-dialog` — several Deployment Settings activating after the deploy.
- `platform/states/async-submit` — the toast rule every deploy follows.
- `platform/detail/version-detail` — one version, its history and revert.
