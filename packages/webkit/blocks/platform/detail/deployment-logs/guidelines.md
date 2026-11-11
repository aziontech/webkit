# Deployment logs

The user started a deployment and wants to know where it is, whether it went live and, when it did not, exactly which step failed and why. This block shows the pipeline as ordered steps, each with its status, its one-line outcome, its time and its own log output, so the user can follow the run as it streams, then read the full output once it settles.

## When to use

- Inside the deploy flow card of a create flow, while the deployment runs and once it finishes.
- In the Deployment Logs card of a deployment detail page, for a run that has already settled.
- Any build or deploy pipeline with a fixed, known list of steps whose output the user needs to read.

## When not to use

- The whole deploy screen of a create flow, with its card, header and next steps: use `platform/create/deployment-flow`.
- The deployment page itself, with its status banner and facts: use the DeploymentDetail state of `platform/detail/details-page`.
- Events or logs explored over time with filters and a chart: use `platform/view/split-view`.
- A short async action that finishes in seconds: use the button's loading state from `platform/states/async-submit`.

## Building blocks

### A. Step list — `Accordion` (required)

A single, collapsible `Accordion` with one item per pipeline step, in run order. Each trigger holds a status glyph, the step title, one sentence of outcome and the step time. Only one step is open at a time: the running step while the run goes, the failed step after a failure, the last step after a success. A failed step's sentence wraps in full in danger color; pending and skipped titles go muted.

### B. Running indicator — `Spinner` (required)

The glyph of the step in flight. Done steps show a success check, a failed step a danger cross, skipped steps a muted minus and pending steps a dashed ring. The running step's sentence also shimmers, only when motion is allowed.

### C. Step output — `LogView`, `LogViewContent` (required)

Each open step shows its own borderless `LogView` with its lines, typed `text`, `success` or `warning`. A pending step shows the loading label "Waiting to start…" and `LogViewContent` gives an empty slot, "No log lines yet.". While the run goes, `:copyable="false"`; once it settles, every step log and the Complete view get a copy button. The Complete view replaces the accordion with one continuous `LogView` of every line printed, nothing from steps that never ran.

### D. Run progress — `Progress` (optional)

A small, flat `Progress` flush on the bottom edge with `aria-label="Deployment progress"`, only while the run goes. It is dropped on a deployment detail page and once the run settles.

## Do

- Show the Logs row with the step count and the step in flight, e.g. "3/8 steps" and "Build", while the run goes.
- Once settled, replace the count with the outcome `Tag`, the total time, and a medium `ToggleGroup` between Phased and Complete labelled "Log view".
- Open the failed step automatically and mark every step after it Skipped.
- Inside a deploy flow card, move the Logs row controls up to the card header; on a deployment page, drop the Logs row and progress and put the controls in the Deployment Logs card header.
- Keep step times in a code label at the end of each trigger.

## Don't

- Don't open several steps at once or auto-expand every step after a success.
- Don't show copy buttons while lines still stream.
- Don't print lines for steps that never ran in the Complete view.
- Don't summarize the error in a vague sentence; the failed step shows the reason in full.
- Don't animate the shimmer or the spinner when the user prefers reduced motion.

## Copy

- **Header:** "Deployment Logs".
- **Running status:** count and step, e.g. "3/8 steps", "Build".
- **Outcome tags:** a past-tense word, or the failure and its step, e.g. "Completed", "Failed on Routing Rules".
- **Run time:** past tense with the duration, e.g. "Deployed in 42s", "Failed after 42s".
- **Step titles:** a short noun phrase, e.g. "Install dependencies", "Routing Rules"; descriptions state the outcome without a period, e.g. "478 packages installed".
- **Waiting:** "Waiting to start…", the only place an ellipsis appears, because the step is in progress.
- **View switch:** "Phased" and "Complete".
- Follow `skills/webkit-microcopy` and `skills/webkit-errors`: say what failed and why, no "please", no exclamation in console copy.

## Accessibility

- Each step is an accordion trigger, a button that announces expanded or collapsed and is reachable by keyboard in run order.
- Status glyphs are `aria-hidden`; the step title, the outcome sentence and the outcome tag carry the status in words, so it never depends on color.
- The progress bar has `aria-label="Deployment progress"`; the view switch has `aria-label="Log view"`.
- Copy buttons on the logs announce what they copy.
- Shimmer and spinner animations stop under `prefers-reduced-motion`.

## States

- Running: the run is in flight; the Logs row shows 3/8 steps and Build, Build is open with the spinner and the progress bar runs along the bottom.
- Succeeded: every step checked, the last one open, a Completed tag with Deployed in 42s and the view switch, copy on every step log.
- Failed: the Routing Rules step is open on its error output with a Failed tag, the steps after it read Skipped and the Logs row names the failed step.
- CompleteView: a finished run in the Complete view, every line as one `LogView` with its copy button.
- FailedCompleteView: the failed run in the Complete view, the lines up to the error and nothing from the skipped steps.

## Related

- `platform/create/deployment-flow` — the deploy flow card that hosts this block in a create flow.
- `platform/detail/details-page` — the deployment page whose Deployment Logs card hosts it.
- `platform/create/deploy-success` — where a create flow lands once the run goes live.
- `LogView` — the log reader each step and the Complete view use; see `skills/webkit-ui-states` for the running and failed states.
