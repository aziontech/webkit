# Deployment flow

The card a create flow hands its column to once the user has pressed Deploy. The user waits here for the first deploy of what they just made: they need to know that it started, what it is doing now, how far it has gone and, if it stops, which step failed and why. The card opens on a cloning splash, then streams the pipeline steps with their logs, and either hands over to the success screen or stays open on the failure.

## When to use

- A create flow (a template deploy, an import from Git, a provision wizard) starts a build or a provisioning run the user should watch before the resource is usable.
- The run is long enough to need progress, and short enough that the user stays on the page for it.
- A failed run must keep the user in the flow, with the failing step open on its output.

## When not to use

- The logs of a deployment that already exists, read from its detail page: use `platform/detail/deployment-logs`.
- A run of half a minute or more the user is expected to leave and come back to: use `platform/states/async-submit`, which reports the status where the user returns.
- A dropped folder being uploaded before anything is built: use the Initializing overlay in `platform/states/project-intake`.
- The outcome once the run has finished: hand the column to `platform/create/deploy-success`; do not keep the finished card as the last screen.

## Building blocks

### A. Deployment card — `Card` (required)

`Card :padded="false"` at the full width of the flow's column. The header names the run in one word, Deployment, or Provisioning when the flow provisions rather than deploys. The content opens on the cloning splash: the source and the destination glyphs, then one line naming the repository and the scope it is cloned into. Once the first step starts, the content becomes the pipeline: a Logs row with the step count, one `Accordion` item per step with its status glyph, its time and its own `LogView`, and a flush `Progress` on the bottom edge while the run goes. Only the step in flight is open; finished steps collapse.

### B. Run status — `StatusIndicator` (required)

Sits in the card header, opposite the title. While the run goes it is a loading `StatusIndicator` with `severity="info"` and a progressive label, Building or Creating. When the run settles, the outcome moves to a `Tag` in the Logs row (Completed or Failed) and, after a failure, the header swaps the indicator for the Phased or Complete `ToggleGroup` so the user can read the logs step by step or as one console.

## Do

- Open on the cloning splash the moment Deploy is pressed, so the column never goes blank between the form and the first log line.
- Keep one step open at a time: the one running, or the one that failed.
- Show each step's time once it ends, and the step count in the Logs row while it runs.
- On failure, open the failing step on its error output and mark the steps behind it Skipped.
- Retire the progress bar when the run settles, then hand over to `platform/create/deploy-success` a beat after the last line prints.

## Don't

- Don't show a bare spinner with no words; the status label says what is happening.
- Don't put the run status in a toast; it belongs in the card header.
- Don't auto-advance to the success screen after a failure, or hide the logs that explain it.
- Don't expand every finished step; a long log pushes the step in flight out of view.
- Don't add a Cancel or a second action to the card; the flow around it owns navigation.

## Copy

- **Card title:** one noun naming the run, e.g. "Deployment" or "Provisioning".
- **Run status:** the progressive form of the verb with `…` only while in progress, e.g. "Building…" in prose, "Building" as an indicator label.
- **Splash line:** fragments naming source and destination, e.g. "Cloning acme/web-app to acme".
- **Outcome tag:** one or two words stating the result, e.g. "Completed", "Failed".
- **Pending steps:** say they have not started, e.g. "Waiting to start…".
- **Errors:** the log output says what failed; the step title names the step in sentence case, e.g. "Routing rules".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no exclamation marks.

## Accessibility

- The status label is text, not only a colour or a spinner; screen readers hear Building, then the outcome.
- The progress bar has an accessible name, e.g. "Deployment progress", and the logs region an `aria-label`.
- Decorative glyphs in the splash and in step rows carry `aria-hidden="true"`; the status of each step is also given in words.
- Step headers are keyboard-operable accordion triggers; opening a step does not move focus.
- New log lines do not steal focus or announce one by one; the step change and the outcome are what is announced.

## States

- Initial: Deploy was just pressed; the cloning splash with a Building indicator, before the first step starts.
- Running: two steps done with their times, the current step spinning and open on its lines, the step count shown and the progress bar on the bottom edge.
- Finished: every step checked and collapsed, a Completed tag, the progress bar retired, just before the success screen.
- Failed: the failing step open on its error output with a Failed tag, the later steps Skipped, and the Phased or Complete switch in the header.

## Related

- `platform/detail/deployment-logs` — the same logs as a standalone block on a deployment's detail page.
- `platform/create/deploy-success` — the screen the column hands over to once the run finishes.
- `platform/create/deploy-template` — the template flow that streams this card after Deploy.
- `platform/create/provision-wizard` — a create flow that titles the card Provisioning.
- `platform/states/async-submit` — a long run the user leaves and comes back to.
- `Card` — the container; see `skills/webkit-ui-states` for loading, progress and failure rendering.
