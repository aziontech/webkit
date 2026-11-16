# AsyncSubmit (`state/async-submit`)

> The async counterpart of the server rejection in the SectionRejected state of the FormValidation template: a deploy that runs for about half a minute, so the user walks away before it ends. The page heading carries the run status as a `Tag`: the page shows an `EmptyState` whose Deploy starts the run while idle, the deployment logs card while it runs, a danger `Alert` with Edit and Redeploy over the stopped logs when it fails, and a success `Alert` with Edit, Redeploy and Open service once it is live. Progress and the outcome also ride a toast wherever the user is: the app's one toast region (ToastPlugin, or one Toaster near the app root) shows it, never a Toaster in the page body; the Running frame shows the progress toast, and the failure (permanent) and success toasts carry Edit and Redeploy. Built from `PageHeader`, `Tag`, `Button`, `EmptyState`, `Alert`, and the deployment logs card of Templates/Platform/Detail/DeploymentLogs (`Card`, `StatusIndicator`, `LogViewer` with its `LogViewer.Steps` steps and progress bar, and `ToggleGroup` for the Phased or Complete log switch on failure). A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/state/async-submit/async-submit.vue` in `@aziontech/webkit`
- MCP: `get_block("state/async-submit")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [EmptyState](../../components/empty-state.md), [LogViewer](../../components/log-viewer.md), [PageHeader](../../components/page-header.md), [StatusIndicator](../../components/status-indicator.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md)
- Skills: `webkit-errors`, `webkit-ui-states`, `webkit-form`

## Asked as

async submit; long running action; background job status; deploy in progress; async deploy result; operation status; envio assíncrono; ação demorada; status da operação; result reaches me later

The async-action pattern, and the standard for every build and deploy screen. A long-running action the user is free to walk away from: a deploy that runs for about half a minute and asks nothing while it does. The user's job is to start it, go on working anywhere in the console, and learn how it ended without coming back to check. The page that started the run shows its status in the heading, the logs while it runs and an inline outcome when it ends; in a full app the run lives outside the page, so its progress and its outcome also travel with the user as a toast, on success and on failure.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`.

The run toast rides the app's one toast region, never the page's: the app installs `ToastPlugin` (`app.use(ToastPlugin, { position: 'bottom-end' })`) or mounts one `Toaster` near its root, beside `ConsoleLayout`, and this page body only imports `toast` from `@aziontech/webkit/toast`. A `Toaster` inside a page body is a second region for the whole app: only the first `Toaster` to mount is active, and it gives that up when it unmounts, so a page's copy is either inert or, when it mounted first, stops every toast once the user leaves the page, the opposite of a run toast that follows the user. The docs preview mounts one region around the block the way an app root does, so its frames show the toasts; a copy of the page shows them wherever the app has mounted the region.

The toasts are raised through `toast` with one id per run so each state replaces the last. Every outcome toast passes `actions: [{ label: 'Edit', onClick }, { label: 'Redeploy', onClick }]` and `closable: true`, so the app's `Toaster` renders both as `Toast.Action`s beside `Toast.Close`; the progress toast carries no action. The Running frame raises the progress toast, Error the permanent failure toast and Success the success toast; leaving the page dismisses the toast so the next story starts clean.

## When to use

- Use async-submit when the action runs long enough that the user leaves (build, deploy, import) and the result must reach them later.
- Any action that takes long enough to leave: build, deploy, redeploy, import, provision, a bulk change.
- When the outcome must reach the user on whatever page they are on when it lands.
- As the reference for the idle, running, failed and succeeded states of a run started from a page.

## When not to use

- A save that answers in about a second: use `state/form-validation`.
- A run the user watches to the end inside a create flow, or a deployment's own page: use `detail/deployment-logs` (InCreateFlow, DeploymentDetail).
- Confirming a finished deploy with next steps: use `create/deploy-success`.
- A deploy configured in a side panel: use `create/deploy-drawer`.

## Building blocks

### A. Actions — `Button` (required)

**Deploy**, the `EmptyState` action, emits `deploy`; the outcome `Alert`s carry Edit and Redeploy, which emit `edit` and `redeploy`, and the success `Alert` adds Open service.

### B. Page heading — `PageHeader` (required)

`size="large"`, the page title and one sentence on what the run does. Its `#actions` slot carries the run status as a `Tag`, so the state of the run is readable from the heading in every state.

### C. Run status — `Tag` (required)

In the heading: `Idle` (`secondary`), `Deploying` (`info`), `Failed` (`danger`), `Deployed` (`success`). One to two words, never a sentence.

### D. Nothing running — `EmptyState` (idle only)

`bordered`, the deploy glyph, a title, one sentence and **Deploy** as its only action. It gives way to the logs card once a run starts.

### E. Outcome — `Alert` (error and success only)

Under the heading, with a scale-in entrance: `severity="danger"` with the `error` text and Edit and Redeploy when the run failed, `severity="success"` naming the address and the attempts with Edit, Redeploy and Open service when it is live.

### F. Deployment logs — `Card`, `StatusIndicator`, `LogViewer`, `ToggleGroup` (running and error only)

A flush `Card` titled Deployment holding `LogViewer.Steps` over the `steps` prop. While the run is in flight the header carries a loading `StatusIndicator` (Building), the logs header counts the finished steps and names the running one, and a progress bar runs along the bottom edge. After a failure the header carries a `ToggleGroup` for the Phased or Complete view, the logs header a danger `Tag` naming the failed step, the failed step opens, and the skipped steps say where the run stopped.

## Data

The block takes the run through props and emits every action; it fetches nothing and runs no timer. `AsyncSubmitStep`, `AsyncSubmitDeployment` and `AsyncSubmitProps` are exported from `async-submit.vue`, and `sample.ts` holds the running and failed steps, the failure reason and the deployment the variants pass.

| Prop           | Type                    | What it does                                                                                                |
| -------------- | ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| `loading`      | `boolean`               | A run is in flight: the heading reads Deploying, the logs card streams and the progress toast shows.        |
| `error`        | `string`                | Why the run failed, in the danger `Alert`; the heading reads Failed and the permanent failure toast shows.  |
| `errorSummary` | `string`                | One line for the failure toast; left empty, the toast names the failed step.                                |
| `deployment`   | `AsyncSubmitDeployment` | The finished run (`domain`, `attempts`): the heading reads Deployed and the success `Alert` and toast show. |
| `steps`        | `AsyncSubmitStep[]`     | The steps of the current or the failed run, with their log lines; `[]` by default.                          |

With none of them set the block is Idle. `loading` wins over `error`, and `error` over `deployment`, so a redeploy after a failure reads Deploying.

| Event          | Payload   | When                                                   |
| -------------- | --------- | ------------------------------------------------------ |
| `deploy`       | `(event)` | Deploy in the idle `EmptyState`.                       |
| `redeploy`     | `(event)` | Redeploy in an outcome `Alert` or toast.               |
| `edit`         | `(event)` | Edit in an outcome `Alert` or toast; the toast closes. |
| `open-service` | `(event)` | Open service in the success `Alert`.                   |

To go live, keep the run in a store that outlives the page and pass its state:

```vue
<script setup lang="ts">
  import AsyncSubmit from './async-submit.vue'

  const run = useDeployRun('web-app')
</script>

<template>
  <AsyncSubmit
    :loading="run.running"
    :error="run.error ?? ''"
    :deployment="run.deployment"
    :steps="run.steps"
    @deploy="run.start"
    @redeploy="run.start"
    @edit="openSettings"
  />
</template>
```

Then delete `sample.ts`; the variants are the only files that import it.

## Do

- Keep the run and its outcome outside the page component (a small module-scope store) and pass its state in, so leaving the page never cancels it or loses the result.
- Show progress as a `loading` toast (no duration, not closable) that follows the user through the app while the run lasts.
- Report the end wherever the user is, on success and on failure. A failure toast is permanent (`duration: 0`) and `closable`; a success toast is `closable` with the default 6 second duration.
- Raise the toasts through `toast` only; the app mounts the region once (`ToastPlugin` or one `Toaster` at its root), so the page body never renders a `Toaster`.
- Give both toasts the same two actions through `toast()`'s `actions` option: **Edit** for the item that was deployed, and **Redeploy**. Don't rebuild the toast body in the `Toaster` slot to get two actions.
- On the page that started the run, show the outcome inline as well, with the same two actions as the toast: a danger `Alert` with the reason, **Edit** and **Redeploy** over the stopped logs, or a success `Alert` naming the new address with **Edit**, **Redeploy** and **Open service**.
- Disable Deploy and the controls that would change the run while it is in progress, with Deploy in `loading`.
- Use one toast id per run, so the progress toast turns into the outcome toast in place, and a Redeploy turns it back into progress.
- Apply this to every build and deploy screen (deploy drawers, deployment flows, redeploys from a list, imports): the run lives outside the page, the page shows the status `Tag` and the outcome `Alert`, and the toast reports wherever the user is.

## Don't

- Don't tie the run to the component that started it; unmounting a page is not an event the run hears.
- Don't let a failure toast expire; the user was not there when it arrived.
- Don't point the toast at a list of runs ("View deployments"); it carries **Edit** and **Redeploy**.
- Don't block the page with a modal or overlay while the run is in progress; the user must be able to leave.
- Don't claim an outcome before the server confirms it; the heading reads `Deploying` until it does.

## Copy

- **Page heading:** names the action and the resource, sentence case: `Deploy web-app`. Lead: what the run does and that the user may leave: `Builds acme/web-app and publishes it to production. A deploy takes about half a minute and keeps running if you leave this page; the result reports back wherever you are.`
- **Status tag:** one or two words: `Idle`, `Deploying`, `Failed`, `Deployed`.
- **Empty state:** title states the fact, description says what to do: `No deployment running` / `Start one above. It takes about 25 seconds.`
- **Progress toast:** present progressive with the single-character ellipsis, names the item: `Deploying web-app…`; description names the source and that the user may leave: `acme/web-app. It keeps running if you leave.`
- **Failure toast:** what failed and why, then the ways out: `web-app wasn't deployed.` / `The routing rules were refused.` Actions: `Edit`, `Redeploy`.
- **Success toast:** past tense, names the item and where it is live: `web-app is live.` / `It is available at web-app.example.com.` Actions: `Edit`, `Redeploy`.
- **Failure Alert:** the reason the server gave, as full sentences, with `Edit` and `Redeploy`.
- **Success Alert:** names the address and the attempts: `web-app is live at web-app.example.com. It took 1 attempt.`, with `Edit`, `Redeploy` and `Open service`.
- **Actions:** `Deploy`, `Redeploy` (never "Retry deploy" or "Try again"), `Edit`, `Open service`.

## Accessibility

- The run status is text in the heading's `Tag`, not color alone.
- Toasts are announced by the app's `Toaster`, politely except the failure toast (`danger`), which interrupts; the progress toast must not steal focus.
- The failure toast's actions and close button are reachable by keyboard, and it stays until closed.
- The logs card (Running and Error) streams into a `LogViewer`; do not announce every log line.
- Page entrance and the outcome `Alert` animate with `motion-reduce:animate-none`.

## States

- Idle: no prop set, nothing running; the heading reads Idle and the `EmptyState` offers Deploy.
- Running: `loading` with the running `steps`; the heading reads Deploying, the logs card streams under the Building status and the progress toast reads `Deploying web-app…`.
- Error: `error` and the failed `steps`, the routing rules were refused; the heading reads Failed, the danger `Alert` carries the reason with Edit and Redeploy, the permanent failure toast carries the same two actions, and the logs stay open on the failed step.
- Success: `deployment` is set, the run is live; the heading reads Deployed, the success `Alert` names the new address with Edit, Redeploy and Open service, the success toast carries Edit and Redeploy, and the logs card is gone.

## Related

- `state/form-validation` — the synchronous counterpart: field, section and toast placement for a save that answers right away.
- `detail/deployment-logs` — the deployment logs card (`LogViewer.Steps`) the Running and Error states reuse, and the full logs of a run the page Edit or a failure leads into.
- `create/deploy-success` — the confirmation page after a deploy completes.
- `shell/console` — the layout this body renders in, which the user moves through while the run reports back.

## Variants

- `Idle` — primary (the code below)
- `Running` — Mid-run: the progress toast reads Deploying web-app…, the heading reads Deploying, and the logs card streams under the Building status.
- `Error` — The routing rules were refused: the heading reads Failed, the danger Alert carries the reason with Edit and Redeploy, the permanent failure toast carries the same two actions, and the logs card stays open on the failed step with the Phased or Complete switch.
- `Success` — The run is live: the heading reads Deployed and the success Alert names the new address with Edit, Redeploy and Open service, the success toast carries Edit and Redeploy, and the logs card is gone.

Each variant is the same screen in another state: `get_block("state/async-submit", { variant })`, or the file under `blocks/state/async-submit/variants/`.

## Code (`Idle`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import LogViewer, {
    type LogViewerStep,
    type LogViewerStepsView
  } from '@aziontech/webkit/log-viewer'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  /** Where the run stands, read from the props. */
  export type AsyncSubmitStatus = 'idle' | 'running' | 'error' | 'success'

  /** A label and color for a status tag. */
  export interface AsyncSubmitTag {
    /** Tag text. */
    label: string
    /** Tag color. */
    severity: TagSeverity
  }

  /** One step of the deployment logs. */
  export interface AsyncSubmitStep extends LogViewerStep {
    /** A tag beside the step name, such as Failed or Skipped. */
    tag?: AsyncSubmitTag
  }

  /** The finished deployment, shown in the success Alert. */
  export interface AsyncSubmitDeployment {
    /** The address the service answers on. */
    domain: string
    /** How many runs it took. */
    attempts: number
  }

  export interface AsyncSubmitProps {
    /** A run is in flight: the heading reads Deploying and the logs card streams the steps. */
    loading?: boolean
    /** Why the run failed, shown in the danger Alert with Edit and Redeploy. */
    error?: string
    /** One line for the failure toast; left empty, the toast names the failed step. */
    errorSummary?: string
    /** The finished run: the heading reads Deployed and the success Alert names the address. */
    deployment?: AsyncSubmitDeployment
    /** The steps of the current or the failed run, streamed in the logs card. */
    steps?: AsyncSubmitStep[]
  }

  const props = withDefaults(defineProps<AsyncSubmitProps>(), {
    loading: false,
    error: '',
    errorSummary: '',
    deployment: undefined,
    steps: () => []
  })

  const emit = defineEmits<{
    deploy: [event: MouseEvent]
    redeploy: [event: MouseEvent]
    edit: [event: MouseEvent]
    'open-service': [event: MouseEvent]
  }>()

  const REPO = { name: 'web-app', scope: 'acme' }
  const RUN_TOAST = 'async-submit-run'
  const logViews = [
    { label: 'Phased', value: 'phased' },
    { label: 'Complete', value: 'complete' }
  ]

  const status = computed<AsyncSubmitStatus>(() => {
    if (props.loading) return 'running'
    if (props.error) return 'error'
    if (props.deployment) return 'success'
    return 'idle'
  })

  const statusTag = computed<AsyncSubmitTag>(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'neutral' }
  })

  const runningStep = computed(() => props.steps.find((step) => step.status === 'running'))
  const failedStep = computed(() => props.steps.find((step) => step.status === 'error'))
  const doneCount = computed(() => props.steps.filter((step) => step.status === 'success').length)
  const failedTitle = computed(() => failedStep.value?.title.toLowerCase() ?? '')

  const logViewer = ref<LogViewerStepsView>('phased')
  const openStep = ref<string | undefined>()
  watch(
    () => (status.value === 'running' ? runningStep.value?.id : failedStep.value?.id),
    (next) => {
      openStep.value = next
    },
    { immediate: true }
  )

  const stepTag = (key: string) => props.steps.find((step) => step.id === key)?.tag

  const edit = (event: MouseEvent) => {
    toast.dismiss(RUN_TOAST)
    emit('edit', event)
  }

  const redeploy = (event: MouseEvent) => emit('redeploy', event)

  const deploy = (event: MouseEvent) => {
    if (props.loading) return
    emit('deploy', event)
  }

  const reportRunning = () =>
    toast.loading(`Deploying ${REPO.name}…`, {
      description: `${REPO.scope}/${REPO.name}. It keeps running if you leave.`,
      id: RUN_TOAST
    })

  const reportFailure = () =>
    toast.error(`${REPO.name} wasn't deployed.`, {
      description: props.errorSummary || `${failedStep.value?.title ?? 'The deploy'} failed.`,
      id: RUN_TOAST,
      duration: 0,
      closable: true,
      actions: [
        { label: 'Edit', onClick: edit },
        { label: 'Redeploy', onClick: redeploy }
      ]
    })

  const reportSuccess = (deployment: AsyncSubmitDeployment) =>
    toast.success(`${REPO.name} is live.`, {
      description: `It is available at ${deployment.domain}.`,
      id: RUN_TOAST,
      closable: true,
      actions: [
        { label: 'Edit', onClick: edit },
        { label: 'Redeploy', onClick: redeploy }
      ]
    })

  const report = (next: AsyncSubmitStatus) => {
    if (next === 'running') reportRunning()
    else if (next === 'error') reportFailure()
    else if (next === 'success' && props.deployment) reportSuccess(props.deployment)
  }

  onMounted(() => report(status.value))
  watch(status, report)

  onBeforeUnmount(() => toast.dismiss(RUN_TOAST))
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column-focused flex min-h-full flex-col">
      <PageHeader
        title="Deploy web-app"
        description="Builds acme/web-app and publishes it to production. A deploy takes about half a minute and keeps running if you leave this page; the result reports back wherever you are."
        size="large"
      >
        <template #actions>
          <Tag
            :label="statusTag.label"
            :severity="statusTag.severity"
            size="medium"
          />
        </template>
      </PageHeader>

      <div
        v-if="status === 'error'"
        key="status-failed"
        class="[--popup-origin:top] layout-section-start animate-popup-scale-in motion-reduce:animate-none"
      >
        <Alert
          severity="danger"
          :label="error"
        >
          <template #actions>
            <div class="flex items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                variant="ghost"
                size="medium"
                @click="edit"
              />
              <Button
                label="Redeploy"
                variant="secondary"
                size="medium"
                icon="ai ai-refresh"
                @click="redeploy"
              />
            </div>
          </template>
        </Alert>
      </div>

      <div
        v-else-if="status === 'success' && deployment"
        key="status-live"
        class="[--popup-origin:top] layout-section-start animate-popup-scale-in motion-reduce:animate-none"
      >
        <Alert
          severity="success"
          :label="`${REPO.name} is live at ${deployment.domain}. It took ${deployment.attempts} attempt${deployment.attempts > 1 ? 's' : ''}.`"
        >
          <template #actions>
            <div class="flex items-center gap-(--spacing-xs)">
              <Button
                label="Edit"
                variant="ghost"
                size="medium"
                @click="edit"
              />
              <Button
                label="Redeploy"
                variant="ghost"
                size="medium"
                icon="ai ai-refresh"
                @click="redeploy"
              />
              <Button
                label="Open service"
                variant="secondary"
                size="medium"
                @click="emit('open-service', $event)"
              />
            </div>
          </template>
        </Alert>
      </div>

      <div
        v-if="status === 'running' || (status === 'error' && steps.length)"
        class="layout-section-start"
      >
        <Card :padded="false">
          <template #header>
            <p class="truncate text-heading-xs text-(--text-default)">Deployment</p>
            <StatusIndicator
              v-if="status === 'running'"
              loading
              severity="info"
              label="Building"
            />
            <ToggleGroup
              v-else
              v-model="logViewer"
              :options="logViews"
              class="shrink-0"
              aria-label="Log view"
            />
          </template>

          <template #default>
            <LogViewer.Steps
              v-model:view="logViewer"
              v-model:open-step="openStep"
              :steps="steps"
              :copyable="status !== 'running'"
              :view-switch="false"
              :progress="status === 'running'"
            >
              <template #header>
                <p class="shrink-0 text-heading-2xs text-(--text-default)">Logs</p>
                <div class="ms-auto flex min-w-0 items-center gap-(--spacing-sm)">
                  <template v-if="status === 'running'">
                    <span class="shrink-0 text-label-sm text-(--text-default)"
                      >{{ doneCount }}/{{ steps.length }} steps</span
                    >
                    <span
                      v-if="runningStep"
                      class="truncate text-label-sm text-(--text-muted)"
                      >{{ runningStep.title }}</span
                    >
                  </template>
                  <Tag
                    v-else
                    :label="`Failed on ${failedTitle}`"
                    severity="danger"
                  />
                </div>
              </template>
              <template #step-meta="{ step }">
                <Tag
                  v-if="stepTag(step.id)"
                  v-bind="stepTag(step.id)"
                  size="small"
                />
              </template>
              <template
                v-if="status === 'error'"
                #step-empty="{ step }"
              >
                {{
                  step.status === 'skipped'
                    ? `Never ran. The deployment stopped at ${failedTitle}.`
                    : 'No log lines yet.'
                }}
              </template>
            </LogViewer.Steps>
          </template>
        </Card>
      </div>

      <div
        v-if="status === 'idle'"
        class="layout-section-start"
      >
        <EmptyState
          bordered
          icon="ai ai-cloud-upload"
          title="No deployment running"
          description="Deploy web-app to build it and publish it to production. It takes about 25 seconds, and you can leave this page while it runs."
        >
          <template #actions>
            <Button
              label="Deploy"
              variant="primary"
              size="medium"
              icon="ai ai-play"
              @click="deploy"
            />
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { AsyncSubmitDeployment, AsyncSubmitStep } from './async-submit.vue'

export const sampleRunningSteps: AsyncSubmitStep[] = [
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
    status: 'running',
    duration: '',
    lines: [
      { id: '0', time: '13:47:41', type: 'text', message: '[TASK] - # npm install' },
      {
        id: '1',
        time: '13:47:45',
        type: 'text',
        message: 'npm warn deprecated inflight@1.0.6: this module is not supported'
      }
    ]
  },
  {
    id: 'build',
    title: 'Build',
    description: 'Project built into dist/',
    status: 'pending',
    duration: '',
    lines: []
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
    title: 'Routing rules',
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

export const sampleFailedSteps: AsyncSubmitStep[] = [
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
    status: 'success',
    duration: '8s',
    lines: [
      { id: '0', time: '13:47:50', type: 'text', message: '[TASK] - # Build template' },
      {
        id: '1',
        time: '13:47:52',
        type: 'text',
        message: 'vite v6.0.7 building for production…'
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
    status: 'success',
    duration: '5s',
    lines: [
      {
        id: '0',
        time: '13:47:58',
        type: 'text',
        message: '[TASK] - # Uploading static assets to storage'
      },
      { id: '1', time: '13:47:59', type: 'text', message: 'create mode 100644 src/main.js' },
      {
        id: '2',
        time: '13:47:59',
        type: 'text',
        message: 'create mode 100644 src/router/index.js'
      },
      {
        id: '3',
        time: '13:48:01',
        type: 'text',
        message: '[TASK] - # 24 files uploaded (1.2 MB)'
      },
      {
        id: '4',
        time: '13:48:02',
        type: 'success',
        message: '[TASK] - # Upload completed successfully!'
      }
    ]
  },
  {
    id: 'service',
    title: 'Service',
    description: 'Service and cache settings created',
    status: 'success',
    duration: '5s',
    lines: [
      { id: '0', time: '13:48:03', type: 'text', message: '[TASK] - # Creating service' },
      {
        id: '1',
        time: '13:48:05',
        type: 'text',
        message: '[TASK] - # Cache Setting __DEFAULT__ created'
      },
      {
        id: '2',
        time: '13:48:07',
        type: 'success',
        message: '[TASK] - # Service created successfully!'
      }
    ]
  },
  {
    id: 'rules',
    title: 'Routing rules',
    description: 'Request rules and cache policies applied',
    status: 'error',
    duration: '4s',
    tag: { label: 'Failed', severity: 'danger' },
    lines: [
      {
        id: '0',
        time: '13:48:08',
        type: 'text',
        message: '[TASK] - # Configuring routing rules and cache policies'
      },
      {
        id: '1',
        time: '13:48:09',
        type: 'text',
        level: 'warn',
        message: '[ERROR] - # Routing rules rejected the configuration'
      },
      {
        id: '2',
        time: '13:48:10',
        type: 'text',
        message: "409 Conflict: rule 'default-cache' already bound to this domain"
      },
      {
        id: '3',
        time: '13:48:11',
        type: 'text',
        level: 'warn',
        message: '[ERROR] - # Deploy finalized with errors. Nothing was published.'
      }
    ]
  },
  {
    id: 'deploy',
    title: 'Publish',
    description: 'Repository wired and the deploy published',
    status: 'skipped',
    duration: '',
    tag: { label: 'Skipped', severity: 'neutral' },
    lines: []
  }
]

export const sampleError =
  'The template built, its assets were uploaded and the service was created, but a rule with the same behavior is already bound to this domain, so the routing rules were refused. Nothing was published, so a redeploy starts from the same commit.'

export const sampleDeployment: AsyncSubmitDeployment = {
  domain: 'web-app.example.com',
  attempts: 1
}
```
