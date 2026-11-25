# Deployment logs

The user started a deployment and wants to know where it is, whether it went live and, when it did not, exactly which step failed and why. This block shows the pipeline as ordered steps, each with its status, its one-line outcome, its time and its own log output, so the user can follow the run as it streams, then read the full output once it settles. It is the one deploy-log block: the same steps sit in the deploy card of a create flow and on a deployment's own page.

## When to use

- Use detail-deployment-logs wherever a build or deploy run with known steps is shown, in a create flow (InCreateFlow) or on a deployment page.
- Inside the deploy card of a create flow (a template deploy, an import from Git, a provisioning run), from the moment Deploy is pressed until the run finishes or fails.
- On a deployment's own page, under its status banner and Deployment details card (DeploymentDetail, DeploymentError, DeploymentQueued).
- Any build or deploy pipeline with a fixed, known list of steps whose output the user needs to read.

## When not to use

- A run of half a minute or more the user is expected to leave and come back to: use `state/state-async-submit`, which reports the outcome where the user returns (its logs card composes the same `LogViewer.Steps`).
- The outcome once a create flow's run has finished: hand the column to `create/create-deploy-success`; do not keep the finished card as the last screen.
- A dropped folder being uploaded before anything is built: use the Initializing overlay in `state/state-project-intake`.
- The overview of the resource the deployment belongs to: use `detail/detail-resource`.
- One function run with its request path and trace: use `detail/detail-invocations`.
- Events or logs explored over time with filters and a chart: use `view/view-events-explorer`.

## Building blocks

### A. Steps — `LogViewer.Steps` (required)

`LogViewer.Steps` (`@aziontech/webkit/log-viewer`, or `@aziontech/webkit/log-viewer-steps` on its own) takes the steps in run order, each with its key, title, one sentence of outcome, status (`done`, `running`, `failed`, `skipped`, `pending`), time and its own log lines. It draws a single collapsible `Accordion` with the status glyph, a visually hidden status word, the title, the sentence and the time per step, and a borderless `LogViewer` per open step. Only one step is open at a time: unbound, the running step opens, else the failed one; bind `v-model:open-step` to open the last step after a success. A failed step's sentence wraps in full in danger color; pending and skipped titles go muted; the running step's sentence shimmers only when motion is allowed. Put a step's outcome `Tag` (Failed, Skipped) in the `step-meta` slot and the skipped step's sentence in `step-empty`. Never rebuild this list by hand from `Accordion` and `LogViewer`.

### B. Toolbar row — `LogViewer.Steps` header slot, `Tag` (required)

The `header` slot starts the toolbar row with a level-2 "Deployment logs" heading (or "Logs" inside a card). While the run goes it holds the step count and the step in flight, computed from the steps, in a `role="status"` region, with `:view-switch="false"`, `:copyable="false"` and `progress` for the flush progress bar on the bottom edge. Once settled it holds the outcome `Tag` (Completed, or "Failed:" and the failed step's title) and the total time, and the built-in Phased or Complete switch (`v-model:view`) ends the row; the Complete view shows every line printed as one `LogViewer`, nothing from steps that never ran.

## Create-flow card (InCreateFlow, InCreateFlowError)

`Card :padded="false"` at the full width of the flow's column, titled Deployment (Provisioning when the flow provisions rather than deploys). Its header carries the run status opposite the title: a loading `StatusIndicator` with `severity="info"`, Cloning during the splash, then Building (or Creating). The content opens on the cloning splash, which fades in: a small source tile (the Git provider glyph), a dashed connector whose dashes march toward the destination (`animate-flow-dash`, still under `motion-reduce`) and a large destination tile, with one polite live line naming the repository and the scope. Once the first step starts, the content becomes the steps with their controls moved up to the card header: after a failure the header swaps the indicator for the Phased or Complete `ToggleGroup` bound to `v-model:view` (`:view-switch="false"` on the steps) and the footer holds Edit (outlined, back to the form with the values kept) and Redeploy (primary, with its loading state and a Redeploying indicator). Every deploy surface ends a failure with the same two actions (`create/create-deploy-drawer`, `create/create-deploy-progress-dialog`, `state/state-async-submit`, `create/create-release-impact`).

## Deployment page (DeploymentDetail, DeploymentError, DeploymentQueued)

A page body for `ConsoleLayout`, with no tabs: a status banner (success; danger with Redeploy; info while queued), the Deployment details card with every fact and its Deployment Settings band, then the Deployment logs card. The logs card header carries the duration or the status and the Phased or Complete switch; the steps drop their own toolbar row and progress. Visit stays disabled until the deployment is live. A queued run shows a not-started `EmptyState` in place of the steps, with no switch.

## Data

The block takes the run through props; it fetches nothing and has no actions of its own. `DeploymentLogsStep` and `DeploymentLogsProps` are exported from `detail-deployment-logs.vue`, and `sample.ts` holds the sample runs (running, succeeded, failed) the block renders when `steps` is left out. Running or settled, the outcome, the counts, the open step and the step tags all follow from the step statuses.

| Prop / model        | Type                   | What it does                                                                                                                                       |
| ------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `steps`             | `DeploymentLogsStep[]` | The steps in run order, each with its status and lines. A `running` or `pending` step keeps the run in flight; an `error` step is where it failed. |
| `duration`          | `string`               | How long the settled run took, shown as Deployed in or Failed after. Empty shows no time.                                                          |
| `v-model:view`      | `DeploymentLogsView`   | `phased` (one log per step) or `complete` (every line as one log). Starts at `phased`.                                                             |
| `v-model:open-step` | `string`               | Key of the open step. Unbound, the running step opens, else the failed one, else the last.                                                         |

To go live, pass the steps the deployment API streams and refresh them as lines arrive:

```vue
<script setup lang="ts">
  import DetailDeploymentLogs from './detail-deployment-logs.vue'

  const { data } = useDeploymentRun(deploymentId)
</script>

<template>
  <DetailDeploymentLogs
    :steps="data?.steps ?? []"
    :duration="data?.duration ?? ''"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Show a step's time only once it has run (done, running, failed); a pending or skipped step shows none.
- Open the failed step automatically and mark every step after it Skipped.
- Show copy buttons only once the run has settled.
- In a create flow, open on the cloning splash the moment Deploy is pressed, so the column never goes blank between the form and the first log line, and hand over to `create/create-deploy-success` a beat after the last line prints.
- Inside a card, move the toolbar controls up to the card header.

## Don't

- Don't hand-build the step list from `Accordion`, `LogViewer` and status glyphs; compose `LogViewer.Steps`.
- Don't open several steps at once or auto-expand every step after a success.
- Don't print lines for steps that never ran in the Complete view.
- Don't summarize the error in a vague sentence; the failed step shows the reason in full.
- Don't put the run status in a toast while the user watches it; it belongs in the toolbar row or the card header.
- Don't auto-advance to the success screen after a failure, or add a Cancel to the card while the run goes.

## Copy

- **Header:** "Deployment logs"; inside a card, "Logs" under a card titled "Deployment" or "Provisioning".
- **Running status:** count and step, e.g. "3/8 steps", "Build"; the card indicator a progressive word, e.g. "Cloning", "Building".
- **Outcome tags:** a past-tense word, or the failure and its step, e.g. "Completed", "Failed: Routing rules".
- **Run time:** past tense with the duration, e.g. "Deployed in 42s", "Failed after 42s".
- **Step titles:** a short noun phrase in sentence case, keeping a product name as written, e.g. "Access token", "Install dependencies", "Routing rules"; descriptions state the outcome without a period, e.g. "478 packages installed".
- **Skipped step:** two sentences, never a dash, e.g. "Never ran. The deployment stopped at Routing rules."
- **Splash line:** names source and destination in fragments, e.g. "Cloning acme/web-app to acme".
- Follow `skills/webkit-microcopy` and `skills/webkit-errors`: say what failed and why, no "please", no exclamation in console copy.

## Accessibility

- Each step is an accordion trigger, a button that announces expanded or collapsed and is reachable by keyboard in run order; opening a step does not move focus.
- Status glyphs are `aria-hidden`; `LogViewer.Steps` gives each step trigger its status as screen-reader text, and the outcome tag carries the run's, so it never depends on color.
- While the run goes, the step count and step in flight sit in one `role="status"` region, so a screen reader hears each step as it starts; new log lines do not announce one by one.
- The progress bar and the view switch carry the accessible names `LogViewer.Steps` gives them; copy buttons announce what they copy.
- The splash tiles and connector are one `aria-hidden` group; its meaning is the visually hidden live line.
- Shimmer, spinner and connector animations stop under `prefers-reduced-motion`.

## States

- Running: the run is in flight (a step is `running` or `pending`); the toolbar shows 3/8 steps and Build, Build is open with the spinner and the progress bar runs along the bottom.
- Success: every step checked (every `steps` status is `success`, `duration` set), the last one open, a Completed tag with Deployed in 42s and the view switch, copy on every step log.
- Error: a step has status `error`; the Routing rules step is open on its error output with a Failed tag, the steps after it read Skipped and the toolbar names the failed step.
- ContinuousLog: a finished run in the Complete view (`view` is `complete`), every line as one `LogViewer` with its copy button.
- ContinuousLogError: the failed run in the Complete view (`view` is `complete`), the lines up to the error and nothing from the skipped steps.
- InCreateFlow: Deploy was just pressed in a create flow; the Deployment card with a Cloning indicator on the cloning splash.
- InCreateFlowError: the create-flow card after a failure, the switch in the header, the failed step open and Edit and Redeploy in the footer.
- DeploymentDetail: a deployment that went live, the success banner, the Deployment details card and the Deployment logs card.
- DeploymentError: a deployment the rules rejected, the danger banner with Redeploy, Visit disabled and the logs open on the failed step.
- DeploymentQueued: a deployment waiting for a runner, the info banner, Visit disabled, Queued in the details and the logs header, and a not-started `EmptyState` in the logs card.

## Related

- `create/create-deploy-template` — the template flow that streams the create-flow card after Deploy.
- `create/create-deploy-success` — where a create flow lands once the run goes live.
- `state/state-async-submit` — a long run the user leaves and comes back to, with the same steps in its logs card.
- `detail/detail-resource` — the overview of the resource a deployment belongs to; its Deployments tab links here.
- `LogViewer` — `LogViewer.Steps` draws the steps; see `skills/webkit-ui-states` for the running and failed states.
