# Deploy progress dialog

The modal progress of one deploy that activates several Deployment Settings, each on its own, and the drop-to-deploy confirm that starts it. The user dropped a folder (or started a deploy whose environment publishes through several Deployment Settings) and wants to see each one activate, know which failed and why, and retry only those. The page behind the dialog is a page body for `ConsoleLayout` (the layout owns the rail, the header and the `main`); the dialog teleports over it.

**The toast stays the standard.** Every deploy reports through one toast with Edit and Redeploy (`platform/states/async-submit`). This dialog is only for the drop-to-deploy path and for a deploy that fans out to several Deployment Settings; even there the outcome still reaches the user through the toast, so they can close the dialog and leave.

## When to use

- A folder dropped on a service deploys straight to an environment.
- One deploy activates several Deployment Settings that can succeed or fail independently.

## When not to use

- A deploy of one service or project: use `platform/create/deploy-drawer`, which closes and reports through the toast.
- A deploy with build steps and logs: use `platform/create/deployment-flow` and `platform/detail/deployment-logs`.
- Reviewing what a multi-resource release reaches before it runs: use `platform/create/release-impact`.

## Building blocks

### A. Drop confirm — `Dialog`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `Tag`, `PanelFooter`, `Button` (required on the drop path)

Titled "New production deployment" (the environment in lower case), with a `DialogClose` in the header. The service name with the environment as a secondary `Tag`, one sentence on what the files replace and how many Deployment Settings the environment publishes with, then the dropped folder: its file count and total size, and a scrollable list (focusable, named "Dropped files") of paths in code type with their sizes. Sizes go through `Intl.NumberFormat` with `style: 'unit'`. The footer has Cancel (transparent) and "Deploy to Production" (primary).

### B. Progress frame — `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `OutcomeMark` (required)

`size="medium"`, `dismissible` only once settled. The title counts: "Deploying 2 of 5…" while running, "Deployed 5 Deployment Settings" or "Deployed 4 of 5 Deployment Settings" once settled. The description is the tally and the rule that the ones that succeeded stay live. Once settled a large `OutcomeMark` stands before the title: success when all deployed, warning when some failed.

### C. Progress — `PanelContent`, `Progress` (required)

The share of settled settings, named "Deploy progress", with "Activating <name>" under it while one runs.

### D. Filter — `ToggleGroup` (required)

Small, named "Filter deploys by status": All, Deploying n (running and queued), Failed n, Done n. An empty filter says so in one line.

### E. Rows — `OutcomeMark`, `Spinner`, `Tag` (required)

One bordered row per Deployment Setting: its name, the environments and projects it reaches, and, when it failed, the reason in danger text. A queued or running row leads with the settings glyph; a settled row leads with a small `OutcomeMark`. On the end side a `Spinner` while deploying and a status `Tag`: Queued, Deploying, Done, Failed.

### F. Footer — `PanelFooter`, `Button` (required)

Retry failed (outlined) appears only when the run settled with failures; Close (primary) is disabled while the run goes on.

### Outcome toast — through `toast`

One toast id for the run: `toast.loading` with "It keeps running if you leave." when it starts, then `toast.success` or `toast.error` (`duration: 0`, `closable`) with **Edit** and **Redeploy**. Edit reopens the dialog on the failed rows; Redeploy runs every setting again. Never View deployments. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Let each Deployment Setting settle on its own and keep the ones that succeeded live.
- Say why a row failed on the row itself.
- Offer Retry failed for the failed rows only.
- Report the outcome through the toast as well, so the user can close the dialog.

## Don't

- Don't use this dialog for a single deploy; the toast is enough.
- Don't let the dialog be dismissed while the run goes on, or the user loses the only view of it.
- Don't roll back the settings that succeeded because another failed.

## Copy

- **Drop:** "New production deployment", "Dropped files", "Deploy to Production".
- **Title:** "Deploying 2 of 5…", "Deployed 5 Deployment Settings", "Deployed 4 of 5 Deployment Settings".
- **Tally:** "4 succeeded, 1 failed. Each Deployment Setting activates on its own, and the ones that succeeded stay live."
- **Tags:** Queued, Deploying, Done, Failed. **Actions:** Retry failed, Close.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, the progressive verb with `…`.

## Accessibility

- The dialog traps focus and is named by its title and described by the tally.
- The `Progress` bar is named; a `role="status"` line announces the outcome once settled.
- `OutcomeMark` names its outcome; tags give the state in words, glyphs are `aria-hidden`.
- The dropped files list is a focusable scroll region with an `aria-label`; paths are `dir="ltr"`.
- Motion: the marks honour reduced motion and the `Spinner` stops under it.

## States

- Running: two settled, one deploying, two queued; advances to its outcome.
- Drop: the confirm that starts a drop-to-deploy run.
- PartialFailure: settled with one failure, Retry failed, error toast.
- Succeeded: every setting deployed, success toast.

## Related

- `platform/states/async-submit` — the toast rule this block follows.
- `platform/create/deploy-drawer` — the standard way to deploy.
- `platform/create/release-impact` — what a release reaches, before it runs.
- `OutcomeMark` — the settled mark.
