# Deploy progress dialog

The modal progress of one deploy that sends several Deployment Settings live, each on its own, and the drop-to-deploy confirm that starts it. The user dropped a folder (or started a deploy whose environment deploys through several Deployment Settings) and wants to see each one go live, know which failed and why, and retry only those. The page behind the dialog is a page body for `ConsoleLayout` (the layout owns the rail, the header and the `main`); the dialog teleports over it.

**The toast stays the standard.** Every deploy reports through one toast with Edit and Redeploy (`state/async-submit`). This dialog is only for the drop-to-deploy path and for a deploy that fans out to several Deployment Settings; even there the outcome still reaches the user through the toast, so they can close the dialog and leave.

## When to use

- A folder dropped on a service deploys straight to an environment.
- One deploy sends several Deployment Settings live that can succeed or fail independently.

## When not to use

- A deploy of one service or project: use `create/deploy-drawer`, which closes and reports through the toast.
- A deploy with build steps and logs: use `detail/deployment-logs`.
- Reviewing what a multi-resource release reaches before it runs: use `create/release-impact`.

## Building blocks

### A. Drop confirm — `Dialog`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `Tag`, `PanelFooter`, `Button` (required on the drop path)

Titled "New production deployment" (the environment in lower case), with the dialog's own close button in the header. The service name with the environment as a secondary `Tag`, one sentence on what the files replace and how many Deployment Settings the environment deploys with, then the dropped folder: its file count and total size, and a scrollable list (focusable, named "Dropped files") of the first 100 paths in code type with their sizes, and an "and N more" line for the rest. Sizes go through `Intl.NumberFormat` with `style: 'unit'`. The footer has Cancel (transparent) and "Deploy to Production" (primary).

### B. Progress frame — `Dialog`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `OutcomeIcon` (required)

`size="medium"` and always `dismissible`: the run keeps going in the background, and the toast reports it once the dialog is hidden. The title counts: "Deploying 2 of 5…" while running, "Deployed 5 Deployment Settings" or "Deployed 4 of 5 Deployment Settings" once settled. The description is the tally and the rule that the ones that succeeded stay live. Once settled a large `OutcomeIcon` stands before the title: success when all deployed, warning when some failed.

### C. Progress — `PanelBody`, `Progress` (required)

The share of settled settings, named "Deploy progress", with "Deploying <name>" under it while one runs.

### D. Filter — `ToggleGroup` (required)

Small, named "Filter deploys by status": All, Deploying n (running and queued), Failed n, Done n. An empty filter shows a small `EmptyState` ("Nothing failed.").

### E. Rows — `Item`, `OutcomeIcon`, `Spinner`, `Tag`, `EmptyState` (required)

An `Item.List` with one small `Item variant="outline"` per Deployment Setting: its name, the environments and projects it reaches, and, when it failed, the reason in danger text. A queued or running row leads with the settings glyph; a settled row leads with a small `OutcomeIcon`. On the end side a `Spinner` while deploying and a status `Tag`: Queued, Deploying, Done, Failed.

### F. Footer — `PanelFooter`, `Button` (required)

Retry failed (outlined) appears only when the run settled with failures; the primary button reads Hide while the run goes on and Close once it settled; both close the dialog, and Show progress reopens it.

### Outcome toast — through `toast`

One toast id for the run: `toast.loading` with "It keeps running if you leave." when it starts, then `toast.success` or `toast.error` (`duration: 0`, `closable`) with **Edit** and **Redeploy**. Edit reopens the dialog on the failed rows; Redeploy runs every setting again. Never View deployments. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so the page never renders a `Toaster`.

## Do

- Let each Deployment Setting settle on its own and keep the ones that succeeded live.
- Say why a row failed on the row itself.
- Offer Retry failed for the failed rows only.
- Report the outcome through the toast as well, so the user can close the dialog.

## Don't

- Don't use this dialog for a single deploy; the toast is enough.
- Don't trap the user in the dialog while the run goes on; let them hide it (the toast keeps reporting) and reopen it with Show progress.
- Don't roll back the settings that succeeded because another failed.

## Copy

- **Drop:** "New production deployment", "Dropped files", "Deploy to Production".
- **Title:** "Deploying 2 of 5…", "Deployed 5 Deployment Settings", "Deployed 4 of 5 Deployment Settings".
- **Tally:** "4 succeeded, 1 failed. Each Deployment Setting deploys on its own, and the ones that succeeded stay live."
- **Tags:** Queued, Deploying, Done, Failed. **Actions:** Retry failed, Hide (while running), Close.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, the progressive verb with `…`.

## Accessibility

- The dialog traps focus and is named by its title and described by the tally.
- The `Progress` bar is named; a `role="status"` line announces the outcome once settled.
- `OutcomeIcon` names its outcome; tags give the state in words, glyphs are `aria-hidden`.
- The dropped files list is a focusable scroll region with an `aria-label`; paths are `dir="ltr"`.
- Motion: the marks honour reduced motion and the `Spinner` stops under it.

## States

- Running: two settled, one deploying, two queued; advances to its outcome.
- Drop: the confirm that starts a drop-to-deploy run.
- PartialError: settled with one failure, Retry failed, error toast.
- Success: every setting deployed, success toast.

## Related

- `state/async-submit` — the toast rule this block follows.
- `create/deploy-drawer` — the standard way to deploy.
- `create/release-impact` — what a release reaches, before it runs.
- `OutcomeIcon` — the settled mark.
