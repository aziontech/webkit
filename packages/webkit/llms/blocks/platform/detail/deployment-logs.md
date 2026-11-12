# DeploymentLogs (`platform/detail/deployment-logs`)

> The deploy logs block on its own: a Logs row that reports the step count and the step in flight while the run goes, or the outcome Tag, the time and the Phased or Complete switch once it has settled; then the pipeline as an Accordion of steps, each with its status glyph, its title and sentence, its time and its own LogView, or every line as one continuous LogView in the Complete view; and a flush Progress on the bottom edge while it runs. Inside a deploy flow card it moves its controls up to the card header; on a deployment detail page it sits inside a Deployment logs card without its Logs row and progress bar. Built from Accordion, LogView, Spinner, Tag, ToggleGroup and Progress.

- Surface: product
- Source: `blocks/platform/detail/deployment-logs/deployment-logs.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/detail/deployment-logs")`
- Components: [Accordion](../../../components/accordion.md), [LogView](../../../components/log-view.md), `LogViewContent`, [Progress](../../../components/progress.md), [Spinner](../../../components/spinner.md), [Tag](../../../components/tag.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-ui-states`, `webkit-errors`

## Asked as

deployment logs; deploy logs; build logs; pipeline steps; log viewer; phased logs; logs do deploy; logs de build; etapas do pipeline

The user started a deployment and wants to know where it is, whether it went live and, when it did not, exactly which step failed and why. This block shows the pipeline as ordered steps, each with its status, its one-line outcome, its time and its own log output, so the user can follow the run as it streams, then read the full output once it settles.

## When to use

- Inside the deploy flow card of a create flow, while the deployment runs and once it finishes.
- In the Deployment logs card of a deployment detail page, for a run that has already settled.
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
- Inside a deploy flow card, move the Logs row controls up to the card header; on a deployment page, drop the Logs row and progress and put the controls in the Deployment logs card header.
- Keep step times in a code label at the end of each trigger.

## Don't

- Don't open several steps at once or auto-expand every step after a success.
- Don't show copy buttons while lines still stream.
- Don't print lines for steps that never ran in the Complete view.
- Don't summarize the error in a vague sentence; the failed step shows the reason in full.
- Don't animate the shimmer or the spinner when the user prefers reduced motion.

## Copy

- **Header:** "Deployment logs".
- **Running status:** count and step, e.g. "3/8 steps", "Build".
- **Outcome tags:** a past-tense word, or the failure and its step, e.g. "Completed", "Failed on Routing Rules".
- **Run time:** past tense with the duration, e.g. "Deployed in 42s", "Failed after 42s".
- **Step titles:** a short noun phrase in sentence case, keeping a product name as written, e.g. "Access token", "Install dependencies", "Routing Rules"; descriptions state the outcome without a period, e.g. "478 packages installed".
- **Waiting:** "Waiting to start…", the only place an ellipsis appears, because the step is in progress.
- **Skipped step:** two sentences, never a dash, e.g. "Never ran. The deployment stopped at Routing Rules."
- **View switch:** "Phased" and "Complete".
- Follow `skills/webkit-microcopy` and `skills/webkit-errors`: say what failed and why, no "please", no exclamation in console copy.

## Accessibility

- Each step is an accordion trigger, a button that announces expanded or collapsed and is reachable by keyboard in run order.
- Status glyphs are `aria-hidden`; each step trigger carries its status as screen-reader text (Done, Running, Failed, Skipped, Not started) before its title, and the outcome tag carries the run's, so it never depends on color.
- While the run goes, the Logs row's step count and step in flight sit in a `role="status"` region, so a screen reader hears each step as it starts.
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
- `platform/detail/details-page` — the deployment page whose Deployment logs card hosts it.
- `platform/create/deploy-success` — where a create flow lands once the run goes live.
- `LogView` — the log reader each step and the Complete view use; see `skills/webkit-ui-states` for the running and failed states.

## Variants

- `Running` — primary (the code below)
- `Succeeded` — A run that went live: every step checked, the last one open, a Completed Tag with Deployed in 42s and the view switch in the Logs row, and copy on every step log.
- `Failed` — A run whose routing rules were rejected: that step is open on its error output with a Failed Tag and the reason in full, the steps behind it read Skipped, and the Logs row names the failed step beside the view switch.
- `CompleteView` — The Complete view of a finished run: every line the pipeline printed as one continuous LogView with its copy button.
- `FailedCompleteView` — The Complete view of the failed run: the lines up to the error, as one LogView, nothing from the steps that never ran.

Each variant is the same screen in another state: `get_pattern("platform/detail/deployment-logs", { variant })`, or the file under `blocks/platform/detail/deployment-logs/variants/`.

## Code (`Running`)

```vue
<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import LogView, { type LogViewLine } from '@aziontech/webkit/log-view'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import Progress from '@aziontech/webkit/progress'
  import Spinner from '@aziontech/webkit/spinner'
  import { ref } from 'vue'

  type StepStatus = 'done' | 'failed' | 'skipped' | 'running' | 'pending'
  type DeployStep = {
    key: string
    title: string
    description: string
    status: StepStatus
    duration: string
    lines: LogViewLine[]
  }

  const steps: DeployStep[] = [
    {
      key: 'token',
      title: 'Access token',
      description: 'Deploy token created and added to the CLI',
      status: 'done',
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
      key: 'clone',
      title: 'Clone template',
      description: 'Template cloned into the GitHub scope',
      status: 'done',
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
      key: 'install',
      title: 'Install dependencies',
      description: '478 packages installed',
      status: 'done',
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
          type: 'warning',
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
      key: 'build',
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
      key: 'upload',
      title: 'Upload',
      description: 'Static assets uploaded to storage',
      status: 'pending',
      duration: '5s',
      lines: []
    },
    {
      key: 'service',
      title: 'Service',
      description: 'Service and cache settings created',
      status: 'pending',
      duration: '5s',
      lines: []
    },
    {
      key: 'rules',
      title: 'Routing Rules',
      description: 'Request rules and cache policies applied',
      status: 'pending',
      duration: '4s',
      lines: []
    },
    {
      key: 'deploy',
      title: 'Publish',
      description: 'Repository wired and the deploy published',
      status: 'pending',
      duration: '4s',
      lines: []
    }
  ]

  const openStep = ref('build')

  const stepStatusLabels: Record<StepStatus, string> = {
    done: 'Done',
    failed: 'Failed',
    skipped: 'Skipped',
    running: 'Running',
    pending: 'Not started'
  }
</script>

<template>
  <div class="flex w-full flex-col">
    <div
      class="flex min-h-12 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <p class="shrink-0 text-heading-xxs text-(--text-default)">Deployment logs</p>
      <div
        role="status"
        class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)"
      >
        <span class="shrink-0 text-label-sm text-(--text-default)">3/8 steps</span>
        <span class="truncate text-label-sm text-(--text-muted)">Build</span>
      </div>
    </div>
    <Accordion
      v-model="openStep"
      type="single"
      collapsible
    >
      <Accordion.Item
        v-for="step in steps"
        :key="step.key"
        :value="step.key"
      >
        <Accordion.Trigger>
          <span class="flex min-h-10 flex-1 items-center gap-(--spacing-sm)">
            <span class="flex size-5 shrink-0 items-center justify-center">
              <i
                v-if="step.status === 'done'"
                class="pi pi-check-circle text-(--success-contrast)"
                aria-hidden="true"
              />
              <i
                v-else-if="step.status === 'failed'"
                class="pi pi-times-circle text-(--danger-contrast)"
                aria-hidden="true"
              />
              <i
                v-else-if="step.status === 'skipped'"
                class="pi pi-minus-circle text-(--text-muted) opacity-60"
                aria-hidden="true"
              />
              <div
                v-else-if="step.status === 'running'"
                class="contents text-(--text-default)"
              >
                <Spinner />
              </div>
              <span
                v-else
                class="size-3.5 rounded-full border border-dashed border-(--border-default)"
              />
            </span>
            <span class="sr-only">{{ stepStatusLabels[step.status] }}</span>
            <span
              :data-state="step.status"
              class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-start data-[state=failed]:flex-wrap"
            >
              <span
                :data-state="step.status"
                class="shrink-0 text-label-md text-(--text-default) data-[state=pending]:text-(--text-muted) data-[state=skipped]:text-(--text-muted)"
              >
                {{ step.title }}
              </span>
              <span
                :data-state="step.status"
                class="min-w-0 truncate text-body-sm text-(--text-muted) data-[state=failed]:whitespace-normal data-[state=failed]:text-pretty data-[state=failed]:text-(--danger-contrast) data-[state=running]:motion-safe:bg-[linear-gradient(90deg,var(--text-muted)_0%,var(--text-muted)_35%,var(--text-default)_50%,var(--text-muted)_65%,var(--text-muted)_100%)] data-[state=running]:motion-safe:bg-[length:200%_100%] data-[state=running]:motion-safe:bg-clip-text data-[state=running]:motion-safe:text-transparent data-[state=running]:motion-safe:animate-(--animate-shimmer) motion-reduce:animate-none"
              >
                {{ step.description }}
              </span>
            </span>
            <span class="ms-auto flex shrink-0 items-center">
              <span
                v-if="step.duration"
                class="text-label-code-md text-(--text-muted)"
              >
                {{ step.duration }}
              </span>
            </span>
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <LogView
            :lines="step.lines"
            :bordered="false"
            :copyable="false"
            :loading="step.status === 'pending'"
            loading-label="Waiting to start…"
          >
            <LogViewContent>
              <template #empty>No log lines yet.</template>
            </LogViewContent>
          </LogView>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
    <Progress
      :value="55"
      :max="100"
      size="small"
      shape="flat"
      class="w-full"
      aria-label="Deployment progress"
    />
  </div>
</template>
```
