# Async submit

A long-running action the user is free to walk away from: a deploy that runs for about half a minute and asks nothing while it does. The user's job is to start it, go on working anywhere in the console, and learn how it ended without coming back to check. The page that started the run shows its status in the heading, the logs while it runs and an inline outcome when it ends; in a full app the run lives outside the page, so its progress and its outcome also travel with the user as a toast, on success and on failure.

## When to use

- Any action that takes long enough to leave: build, deploy, redeploy, import, provision, a bulk change.
- When the outcome must reach the user on whatever page they are on when it lands.
- As the reference for the idle, running, failed and succeeded states of a run started from a page.

## When not to use

- A save that answers in about a second: use `platform/states/form-validation`.
- The full deployment flow with its own steps and logs page: use `platform/create/deployment-flow` and `platform/detail/deployment-logs`.
- Confirming a finished deploy with next steps: use `platform/create/deploy-success`.
- A deploy configured in a side panel: use `platform/create/deploy-drawer`.

## Building blocks

The shell parts (A to O, T to W) are the console frame from `shells/console`; follow that block for their rules. They are listed here because the run must keep reporting while the user moves through them.

### A. Navigation rail — `Sidebar` (required)

The console's side navigation, collapsible to a rail at `md` and up. Opening any module from it while a run is in progress must not cancel the run.

### B. Product mark — `Brand` (required)

In the rail's head and in the global header, inside a link to Home.

### C. Search and commands — `Command` (required)

The palette in the rail: resources, pages, actions (theme, collapse the sidebar) and account, with `Command.Empty` copy when nothing matches.

### D. Module menu — `Menu` (required)

The rail's grouped navigation (Build, Security, Data, Observability), with drill-in modules and `Menu.Back`.

### E. Account avatar — `Avatar` (required)

The signed-in user at the foot of the rail and in the header.

### F. Account menu — `DropdownMenu` (required)

Opens from the account trigger with account options, the theme switch and the plan.

### G. Hint — `Tooltip` (required)

Names every icon-only control in the shell (Account menu, the rail toggle, search, help).

### H. Icon action — `IconButton` (required)

Icon-only shell controls, each with an `aria-label` equal to its tooltip.

### I. Theme — `ThemeSwitcher` (required)

Inside the account menu.

### J. Actions — `Button` (required)

In the shell (Create, the plan entry) and on the page: **Deploy** starts the run and shows `loading` while it runs, **Reset scenario** (`kind="transparent"`) belongs to the simulation only, and the `EmptyState` repeats **Deploy** as its action.

### K. Plan status — `StatusIndicator` (required)

The status dot in the account menu's plan entry.

### L. Top bar — `GlobalHeader` (required)

`aria-label="Console"`, with the rail toggle, brand and location on the start side and search, help, Create and the avatar on the end side.

### M. Location — `Breadcrumb` (required)

Where the page sits in the console.

### N. Shortcut — `Kbd` (required)

The search shortcut shown in the header.

### O. Upgrade — `ButtonHighlight` (required)

The plan call to action in the header.

### P. Page heading — `PageHeader` (required)

`size="large"`, the page title and one sentence on what the run does. Its `#actions` slot carries the run status as a `Tag`, so the state of the run is readable from the heading in every state.

### Q. Run status — `Tag` (required)

In the heading: `Idle` (`secondary`), `Deploying` (`info`), `Failed` (`danger`), `Deployed` (`success`). One to two words, never a sentence. In the simulation panel a `secondary` tag names the repository.

### R. Simulated ending — `ToggleGroup` (simulation only)

`Succeeds` or `Fails`, in a dashed `aside` labelled `Scenario simulation`, disabled while a run is in progress. The ending is kept in the URL (`?outcome=`) so a run is linkable. It is a story device: a real page has no such control.

### S. Nothing running — `EmptyState` (idle only)

`bordered`, the deploy glyph, a title, one sentence and **Deploy** as its only action. It gives way to the logs card once a run starts.

### T. Mobile navigation — `Drawer` (below `md`)

The rail rendered in a drawer on small screens.

### U. Drawer layer — `DrawerPortal` (below `md`)

Mounts the drawer at the document root.

### V. Drawer backdrop — `DrawerOverlay` (below `md`)

Dims the page behind the open drawer.

### W. Drawer panel — `DrawerContent` (below `md`)

Holds the `Sidebar`, labelled `aria-label="Navigation"`; choosing an item closes it.

### X. Run toast — `Toast` (required)

One `Toaster` (the default export of `@aziontech/webkit/toast`) mounted with the page, `position="bottom-right"`, raised through `toast` with one id per run so each state replaces the last. Its default slot renders each entry as `Toast.Item` with `Toast.Title` and `Toast.Description`, and gives every outcome toast two `Toast.Action`s, **Edit** and **Redeploy**, beside `Toast.Close`; the progress toast carries no action. The Running frame raises the progress toast, Failed the permanent failure toast and Succeeded the success toast; leaving the page dismisses the story's toast so the next story starts clean.

## Do

- Keep the run, its timer and its outcome outside the page component (a small module-scope store), so leaving the page never cancels it or loses the result.
- Show progress as a `loading` toast (no duration, not closable) that follows the user through the app while the run lasts.
- Report the end wherever the user is, on success and on failure. A failure toast is permanent (`duration: 0`) and `closable`; a success toast is `closable` with the default 6 second duration.
- Give both toasts the same two actions: **Edit** for the item that was deployed, and **Redeploy**.
- On the page that started the run, show the outcome inline as well, with the same two actions as the toast: a danger `Alert` with the reason, **Edit** and **Redeploy** over the stopped logs, or a success `Alert` naming the new address with **Edit**, **Redeploy** and **Open service**.
- Disable Deploy and the controls that would change the run while it is in progress, with Deploy in `loading`.

## Don't

- Don't tie the run to the component that started it; unmounting a page is not an event the run hears.
- Don't let a failure toast expire; the user was not there when it arrived.
- Don't point the toast at a list of runs ("View deployments"); it carries **Edit** and **Redeploy**.
- Don't block the page with a modal or overlay while the run is in progress; the whole point is that the user can leave.
- Don't claim an outcome before the server confirms it; the heading reads `Deploying` until it does.

## Copy

- **Page heading:** names the action, sentence case: `Async deployment`. Lead: what the run does and that the user may leave: `A deploy runs for half a minute and asks nothing of you while it does.`
- **Status tag:** one or two words: `Idle`, `Deploying`, `Failed`, `Deployed`.
- **Empty state:** title states the fact, description says what to do: `No deployment running` / `Start one above. It takes about 25 seconds.`
- **Progress toast:** present progressive with the single-character ellipsis, names the item: `Deploying web-app…`
- **Failure toast:** what failed and why, then the ways out: `web-app wasn't deployed.` / `The routing rules were refused.` Actions: `Edit`, `Redeploy`.
- **Success toast:** past tense, names the item and where it is live: `web-app is live.` / `It is available at web-app.example.com.` Actions: `Edit`, `Redeploy`.
- **Failure Alert:** the reason the server gave, as full sentences, with `Edit` and `Redeploy`.
- **Success Alert:** names the address and the attempts: `web-app is live at web-app.example.com. It took 1 attempt.`, with `Edit`, `Redeploy` and `Open service`.
- **Simulation panel:** a colon, never a dash: `Simulation: how this deploy ends`.
- **Actions:** `Deploy`, `Redeploy` (never "Retry deploy" or "Try again"), `Edit`, `Open service`.

## Accessibility

- The run status is text in the heading's `Tag`, not color alone.
- Toasts are announced politely by the `Toaster`; the progress toast must not steal focus.
- The failure toast's actions and close button are reachable by keyboard, and it stays until closed.
- The simulation panel is an `aside` with its own label so screen reader users can skip it.
- The logs card (Running and Failed) streams into a `LogView`; do not announce every log line.
- Page entrance and the outcome `Alert` animate with `motion-reduce:animate-none`.

## States

- Idle: nothing running; the heading reads Idle and the `EmptyState` offers Deploy.
- Running: mid-run; the heading reads Deploying, the simulation controls are disabled, Deploy shows `loading`, the logs card streams under the Building status and the progress toast reads `Deploying web-app…`.
- Failed: the routing rules were refused; the heading reads Failed, the danger `Alert` carries the reason with Edit and Redeploy, the permanent failure toast carries the same two actions, and the logs stay open on the failed step.
- Succeeded: the run is live; the heading reads Deployed, the success `Alert` names the new address with Edit, Redeploy and Open service, the success toast carries Edit and Redeploy, and the logs card is gone.

## Related

- `platform/states/form-validation` — the synchronous counterpart: field, section and toast placement for a save that answers right away.
- `platform/create/deployment-flow` — the deployment logs card the Running and Failed states reuse.
- `platform/detail/deployment-logs` — the full logs of a run, the page Edit or a failure leads into.
- `platform/create/deploy-success` — the confirmation page after a deploy completes.
- `shells/console` — the frame the user moves through while the run reports back.
