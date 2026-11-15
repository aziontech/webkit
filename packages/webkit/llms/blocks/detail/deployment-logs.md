# DeploymentLogs (`detail/deployment-logs`)

> The deploy logs of a build or deploy run with known steps, wherever it is shown: `LogViewer.Steps` lists the pipeline as an Accordion of steps, each with its status glyph and the status in words for assistive technology, its title and sentence, its time and its own LogViewer, or every line as one continuous LogViewer in the Complete view, with a flush Progress on the bottom edge while it runs. On its own its toolbar row reports the step count and the step in flight, or the outcome Tag, the time and the Phased or Complete switch once it has settled. In a create flow (InCreateFlow) it sits in a Card titled Deployment that opens on a cloning splash (a source tile, a marching dashed connector and a large destination tile) with a Cloning StatusIndicator, and once a run fails the card header carries the view switch and its footer Edit and Redeploy. On a deployment page (DeploymentDetail, DeploymentError, DeploymentQueued) it is the Deployment logs card under a status banner and the Deployment details card. Built from `LogViewer` (`LogViewer.Steps`), `Tag`, `Card`, `StatusIndicator`, `ToggleGroup` and `Button`; the deployment pages add `Alert`, `Accordion`, `Avatar`, `CopyButton`, `DropdownMenu`, `IconButton`, `EmptyState` and `Tooltip`. The deployment pages are page bodies for ConsoleLayout.

- Surface: app
- Source: `blocks/detail/deployment-logs/deployment-logs.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/deployment-logs")`
- Components: [Accordion](../../components/accordion.md), [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [CopyButton](../../components/copy-button.md), [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [LogViewer](../../components/log-viewer.md), [StatusIndicator](../../components/status-indicator.md), [Tag](../../components/tag.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-ui-states`, `webkit-errors`, `webkit-layout`

## Asked as

deployment logs; deploy logs; build logs; pipeline steps; log viewer; phased logs; logs do deploy; logs de build; etapas do pipeline; deployment progress; creation progress; deployment status; build pipeline; deploy failed; status da implantação; deploy flow; fluxo de deploy; first deploy; primeiro deploy; deployment detail; deployment failed; deployment queued; deployment page; página da implantação; implantação na fila

The user started a deployment and wants to know where it is, whether it went live and, when it did not, exactly which step failed and why. This block shows the pipeline as ordered steps, each with its status, its one-line outcome, its time and its own log output, so the user can follow the run as it streams, then read the full output once it settles. It is the one deploy-log block: the same steps sit in the deploy card of a create flow and on a deployment's own page.

## When to use

- Use deployment-logs wherever a build or deploy run with known steps is shown, in a create flow (InCreateFlow) or on a deployment page.
- Inside the deploy card of a create flow (a template deploy, an import from Git, a provisioning run), from the moment Deploy is pressed until the run finishes or fails.
- On a deployment's own page, under its status banner and Deployment details card (DeploymentDetail, DeploymentError, DeploymentQueued).
- Any build or deploy pipeline with a fixed, known list of steps whose output the user needs to read.

## When not to use

- A run of half a minute or more the user is expected to leave and come back to: use `state/async-submit`, which reports the outcome where the user returns (its logs card composes the same `LogViewer.Steps`).
- The outcome once a create flow's run has finished: hand the column to `create/deploy-success`; do not keep the finished card as the last screen.
- A dropped folder being uploaded before anything is built: use the Initializing overlay in `state/project-intake`.
- The overview of the resource the deployment belongs to: use `detail/resource-detail`.
- One function run with its request path and trace: use `detail/invocations`.
- Events or logs explored over time with filters and a chart: use `view/split-view`.

## Building blocks

### A. Steps — `LogViewer.Steps` (required)

`LogViewer.Steps` (`@aziontech/webkit/log-viewer`, or `@aziontech/webkit/log-viewer-steps` on its own) takes the steps in run order, each with its key, title, one sentence of outcome, status (`done`, `running`, `failed`, `skipped`, `pending`), time and its own log lines. It draws a single collapsible `Accordion` with the status glyph, a visually hidden status word, the title, the sentence and the time per step, and a borderless `LogViewer` per open step. Only one step is open at a time: unbound, the running step opens, else the failed one; bind `v-model:open-step` to open the last step after a success. A failed step's sentence wraps in full in danger color; pending and skipped titles go muted; the running step's sentence shimmers only when motion is allowed. Put a step's outcome `Tag` (Failed, Skipped) in the `step-meta` slot and the skipped step's sentence in `step-empty`. Never rebuild this list by hand from `Accordion` and `LogViewer`.

### B. Toolbar row — `LogViewer.Steps` header slot (required)

The `header` slot starts the toolbar row with a level-2 "Deployment logs" heading (or "Logs" inside a card). While the run goes it holds the step count and the step in flight, computed from the steps, in a `role="status"` region, with `:view-switch="false"`, `:copyable="false"` and `progress` for the flush progress bar on the bottom edge. Once settled it holds the outcome Tag and the total time, and the built-in Phased or Complete switch (`v-model:view`) ends the row; the Complete view shows every line printed as one `LogViewer`, nothing from steps that never ran.

## Create-flow card (InCreateFlow, InCreateFlowError)

`Card :padded="false"` at the full width of the flow's column, titled Deployment (Provisioning when the flow provisions rather than deploys). Its header carries the run status opposite the title: a loading `StatusIndicator` with `severity="info"`, Cloning during the splash, then Building (or Creating). The content opens on the cloning splash, which fades in: a small source tile (the Git provider glyph), a dashed connector whose dashes march toward the destination (`animate-flow-dash`, still under `motion-reduce`) and a large destination tile, with one polite live line naming the repository and the scope. Once the first step starts, the content becomes the steps with their controls moved up to the card header: after a failure the header swaps the indicator for the Phased or Complete `ToggleGroup` bound to `v-model:view` (`:view-switch="false"` on the steps) and the footer holds Edit (outlined, back to the form with the values kept) and Redeploy (primary, with its loading state and a Redeploying indicator). Every deploy surface ends a failure with the same two actions (`create/deploy-drawer`, `create/deploy-progress-dialog`, `state/async-submit`, `create/release-impact`).

## Deployment page (DeploymentDetail, DeploymentError, DeploymentQueued)

A page body for `ConsoleLayout`, with no tabs: a status banner (success; danger with Redeploy; info while queued), the Deployment details card with every fact and its Deployment Settings band, then the Deployment logs card. The logs card header carries the duration or the status and the Phased or Complete switch; the steps drop their own toolbar row and progress. Visit stays disabled until the deployment is live. A queued run shows a not-started `EmptyState` in place of the steps, with no switch.

## Do

- Show a step's time only once it has run (done, running, failed); a pending or skipped step shows none.
- Open the failed step automatically and mark every step after it Skipped.
- Show copy buttons only once the run has settled.
- In a create flow, open on the cloning splash the moment Deploy is pressed, so the column never goes blank between the form and the first log line, and hand over to `create/deploy-success` a beat after the last line prints.
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
- **Outcome tags:** a past-tense word, or the failure and its step, e.g. "Completed", "Failed on Routing Rules".
- **Run time:** past tense with the duration, e.g. "Deployed in 42s", "Failed after 42s".
- **Step titles:** a short noun phrase in sentence case, keeping a product name as written, e.g. "Access token", "Install dependencies", "Routing Rules"; descriptions state the outcome without a period, e.g. "478 packages installed".
- **Skipped step:** two sentences, never a dash, e.g. "Never ran. The deployment stopped at Routing Rules."
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

- Running: the run is in flight; the toolbar shows 3/8 steps and Build, Build is open with the spinner and the progress bar runs along the bottom.
- Success: every step checked, the last one open, a Completed tag with Deployed in 42s and the view switch, copy on every step log.
- Error: the Routing Rules step is open on its error output with a Failed tag, the steps after it read Skipped and the toolbar names the failed step.
- ContinuousLog: a finished run in the Complete view, every line as one `LogViewer` with its copy button.
- ContinuousLogError: the failed run in the Complete view, the lines up to the error and nothing from the skipped steps.
- InCreateFlow: Deploy was just pressed in a create flow; the Deployment card with a Cloning indicator on the cloning splash.
- InCreateFlowError: the create-flow card after a failure, the switch in the header, the failed step open and Edit and Redeploy in the footer.
- DeploymentDetail: a deployment that went live, the success banner, the Deployment details card and the Deployment logs card.
- DeploymentError: a deployment the rules rejected, the danger banner with Redeploy, Visit disabled and the logs open on the failed step.
- DeploymentQueued: a deployment waiting for a runner, the info banner, Visit disabled, Queued in the details and the logs header, and a not-started `EmptyState` in the logs card.

## Related

- `create/deploy-template` — the template flow that streams the create-flow card after Deploy.
- `create/deploy-success` — where a create flow lands once the run goes live.
- `state/async-submit` — a long run the user leaves and comes back to, with the same steps in its logs card.
- `detail/resource-detail` — the overview of the resource a deployment belongs to; its Deployments tab links here.
- `LogViewer` — `LogViewer.Steps` draws the steps; see `skills/webkit-ui-states` for the running and failed states.

## Variants

- `Running` — primary (the code below)
- `Success` — A run that went live: every step checked, the last one open, a Completed Tag with Deployed in 42s and the view switch in the Logs row, and copy on every step log.
- `Error` — A run whose routing rules were rejected: that step is open on its error output with a Failed Tag and the reason in full, the steps behind it read Skipped, and the Logs row names the failed step beside the view switch.
- `ContinuousLog` — The Complete view of a finished run: every line the pipeline printed as one continuous LogViewer with its copy button.
- `ContinuousLogError` — The Complete view of the failed run: the lines up to the error, as one LogViewer, nothing from the steps that never ran.
- `InCreateFlow` — Deploy was just pressed in a create flow: the Deployment Card with a Cloning StatusIndicator in its header, opening on the cloning splash (the Git provider tile, a dashed connector marching toward a large destination tile, still under reduced motion) with one polite screen-reader line naming the repository and the scope; the steps replace the splash as the first one starts.
- `InCreateFlowError` — The create-flow card after the routing rules were rejected: the Deployment header swaps the status for the Phased or Complete switch, the Logs row names the failed step, that step is open on its error output with a Failed Tag, the steps behind it read Skipped, and the card footer offers Edit (back to the form, values kept) and Redeploy.
- `DeploymentDetail` — A deployment that went live: the success banner, the Deployment details card with every fact and its Deployment Settings band for Default, and the Deployment logs card with the run duration and the Phased or Complete switch over the steps.
- `DeploymentError` — A deployment the rules rejected: the danger banner with Redeploy, Visit disabled until the deployment is live, and the Deployment logs card with the Error status, open on the failed step with the rest skipped.
- `DeploymentQueued` — A deployment waiting for a runner: the info banner, Visit disabled until the deployment is live, the Deployment details card with Queued as its status and Not started as its duration, and the Deployment logs card with a Queued `StatusIndicator` in its header and a not-started `EmptyState` in place of the steps, with no Phased or Complete switch.

Each variant is the same screen in another state: `get_block("detail/deployment-logs", { variant })`, or the file under `blocks/detail/deployment-logs/variants/`.

## Code (`Running`)

```vue
<script setup lang="ts">
  import LogViewer, { type LogViewerStep } from '@aziontech/webkit/log-viewer'
  import { computed, ref } from 'vue'

  const steps: LogViewerStep[] = [
    {
      id: 'token',
      title: 'Access token',
      description: 'Deploy token created and added to the CLI',
      status: 'success',
      duration: '3s',
      lines: [
        {
          id: '0',
          time: '13:47:33',
          type: 'success',
          message: '[TASK] - #. Deploy started successfully!'
        },
        {
          id: '1',
          time: '13:47:33',
          type: 'text',
          message: '[TASK] - #. Creating access token!'
        },
        {
          id: '2',
          time: '13:47:35',
          type: 'text',
          message: '[TASK] - #. Adding token to the CLI!'
        },
        {
          id: '3',
          time: '13:47:36',
          type: 'success',
          message: '[TASK] - #. Token added successfully!'
        }
      ]
    },
    {
      id: 'clone',
      title: 'Clone template',
      description: 'Template cloned into the GitHub scope',
      status: 'success',
      duration: '4s',
      lines: [
        {
          id: '0',
          time: '13:47:37',
          type: 'text',
          message: '[TASK] - # Current directory: vue/vue3-vite-static/'
        },
        { id: '1', time: '13:47:38', type: 'text', message: '[TASK] - #. Cloning template!' },
        {
          id: '2',
          time: '13:47:39',
          type: 'text',
          message: 'Receiving objects: 100% (312/312), 1.14 MiB'
        },
        {
          id: '3',
          time: '13:47:40',
          type: 'success',
          message: '[TASK] - #. Template cloned successfully!'
        }
      ]
    },
    {
      id: 'install',
      title: 'Install dependencies',
      description: '478 packages installed',
      status: 'success',
      duration: '9s',
      lines: [
        { id: '0', time: '13:47:41', type: 'text', message: '[TASK] - # npm install' },
        {
          id: '1',
          time: '13:47:45',
          type: 'text',
          message: 'npm warn deprecated inflight@1.0.6: this module is not supported'
        },
        {
          id: '2',
          time: '13:47:48',
          type: 'text',
          message: 'added 478 packages, and audited 479 packages in 9s'
        },
        {
          id: '3',
          time: '13:47:48',
          type: 'text',
          level: 'warn',
          message: '24 vulnerabilities (5 low, 7 moderate, 10 high, 2 critical)'
        },
        {
          id: '4',
          time: '13:47:49',
          type: 'success',
          message: '[TASK] - # Dependencies installed successfully!'
        }
      ]
    },
    {
      id: 'build',
      title: 'Build',
      description: 'Project built into dist/',
      status: 'running',
      duration: '8s',
      lines: [
        { id: '0', time: '13:47:50', type: 'text', message: '[TASK] - # Build template' },
        {
          id: '1',
          time: '13:47:52',
          type: 'text',
          message: 'vite v6.0.7 building for production...'
        },
        {
          id: '2',
          time: '13:47:56',
          type: 'text',
          message: '214 modules transformed · dist/assets 1.2 MB'
        },
        {
          id: '3',
          time: '13:47:57',
          type: 'success',
          message: '[TASK] - # Build completed successfully!'
        }
      ]
    },
    {
      id: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to storage',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      id: 'service',
      title: 'Service',
      description: 'Service and cache settings created',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      id: 'rules',
      title: 'Routing Rules',
      description: 'Request rules and cache policies applied',
      status: 'pending',
      duration: '',
      lines: []
    },
    {
      id: 'deploy',
      title: 'Publish',
      description: 'Repository wired and the deploy published',
      status: 'pending',
      duration: '',
      lines: []
    }
  ]

  const openStep = ref('build')

  const doneCount = computed(() => steps.filter((step) => step.status === 'success').length)
  const currentStep = computed(
    () => steps.find((step) => step.status === 'running' || step.status === 'error')?.title ?? ''
  )
</script>

<template>
  <LogViewer.Steps
    :steps="steps"
    v-model:open-step="openStep"
    :copyable="false"
    :view-switch="false"
    progress
  >
    <template #header>
      <h2 class="m-0 shrink-0 text-heading-2xs text-(--text-default)">Deployment logs</h2>
      <div
        role="status"
        class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)"
      >
        <span class="shrink-0 text-label-sm text-(--text-default)"
          >{{ doneCount }}/{{ steps.length }} steps</span
        >
        <span class="truncate text-label-sm text-(--text-muted)">{{ currentStep }}</span>
      </div>
    </template>
  </LogViewer.Steps>
</template>
```
