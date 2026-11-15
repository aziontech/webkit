# AsyncSubmit (`platform/states/async-submit`)

> The async counterpart of the server rejection in the SectionRejected state of the FormValidation template: a deploy that runs for about half a minute, so the user walks away before it ends. The page heading carries the run status as a `Tag`: the page shows an `EmptyState` whose Deploy starts the run while idle, the deployment logs card while it runs, a danger `Alert` with Edit and Redeploy over the stopped logs when it fails, and a success `Alert` with Edit, Redeploy and Open service once it is live. Progress and the outcome also ride a toast wherever the user is: the app's one toast region (ToastPlugin, or one Toaster near the app root) shows it, never a Toaster in the page body; the Running frame shows the progress toast, and the failure (permanent) and success toasts carry Edit and Redeploy. Built from `PageHeader`, `Tag`, `Button`, `EmptyState`, `Alert`, and the deployment logs card of Templates/Platform/Detail/DeploymentLogs (`Card`, `StatusIndicator`, `LogView` with its `LogView.Steps` steps and progress bar, and `ToggleGroup` for the Phased or Complete log switch on failure). A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/states/async-submit/async-submit.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/states/async-submit")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [EmptyState](../../../components/empty-state.md), [LogView](../../../components/log-view.md), [PageHeader](../../../components/page-header.md), [StatusIndicator](../../../components/status-indicator.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-errors`, `webkit-ui-states`, `webkit-form`

## Asked as

async submit; long running action; background job status; deploy in progress; async deploy result; operation status; envio assíncrono; ação demorada; status da operação; result reaches me later

The async-action pattern, and the standard for every build and deploy screen. A long-running action the user is free to walk away from: a deploy that runs for about half a minute and asks nothing while it does. The user's job is to start it, go on working anywhere in the console, and learn how it ended without coming back to check. The page that started the run shows its status in the heading, the logs while it runs and an inline outcome when it ends; in a full app the run lives outside the page, so its progress and its outcome also travel with the user as a toast, on success and on failure.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

The run toast rides the app's one toast region, never the page's: the app installs `ToastPlugin` (`app.use(ToastPlugin, { position: 'bottom-right' })`) or mounts one `Toaster` near its root, beside `ConsoleLayout`, and this page body only imports `toast` from `@aziontech/webkit/toast`. A `Toaster` inside a page body is a second region for the whole app: only the first `Toaster` to mount is active, and it gives that up when it unmounts, so a page's copy is either inert or, when it mounted first, stops every toast once the user leaves the page, the opposite of a run toast that follows the user. The docs preview mounts one region around the block the way an app root does, so its frames show the toasts; a copy of the page shows them wherever the app has mounted the region.

The toasts are raised through `toast` with one id per run so each state replaces the last. Every outcome toast passes `actions: [{ label: 'Edit', onClick }, { label: 'Redeploy', onClick }]` and `closable: true`, so the app's `Toaster` renders both as `Toast.Action`s beside `Toast.Close`; the progress toast carries no action. The Running frame raises the progress toast, Failed the permanent failure toast and Succeeded the success toast; leaving the page dismisses the story's toast so the next story starts clean.

## When to use

- Use async-submit when the action runs long enough that the user leaves (build, deploy, import) and the result must reach them later.
- Any action that takes long enough to leave: build, deploy, redeploy, import, provision, a bulk change.
- When the outcome must reach the user on whatever page they are on when it lands.
- As the reference for the idle, running, failed and succeeded states of a run started from a page.

## When not to use

- A save that answers in about a second: use `platform/states/form-validation`.
- A run the user watches to the end inside a create flow, or a deployment's own page: use `platform/detail/deployment-logs` (InCreateFlow, DeploymentDetail).
- Confirming a finished deploy with next steps: use `platform/create/deploy-success`.
- A deploy configured in a side panel: use `platform/create/deploy-drawer`.

## Building blocks

### A. Actions — `Button` (required)

**Deploy**, the `EmptyState` action, starts the run and shows `loading` while it runs; the outcome `Alert`s carry Edit and Redeploy.

### B. Page heading — `PageHeader` (required)

`size="large"`, the page title and one sentence on what the run does. Its `#actions` slot carries the run status as a `Tag`, so the state of the run is readable from the heading in every state.

### C. Run status — `Tag` (required)

In the heading: `Idle` (`secondary`), `Deploying` (`info`), `Failed` (`danger`), `Deployed` (`success`). One to two words, never a sentence.

### D. Nothing running — `EmptyState` (idle only)

`bordered`, the deploy glyph, a title, one sentence and **Deploy** as its only action. It gives way to the logs card once a run starts.

## Do

- Keep the run, its timer and its outcome outside the page component (a small module-scope store), so leaving the page never cancels it or loses the result.
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
- The logs card (Running and Failed) streams into a `LogView`; do not announce every log line.
- Page entrance and the outcome `Alert` animate with `motion-reduce:animate-none`.

## States

- Idle: nothing running; the heading reads Idle and the `EmptyState` offers Deploy.
- Running: mid-run; the heading reads Deploying, the logs card streams under the Building status and the progress toast reads `Deploying web-app…`.
- Failed: the routing rules were refused; the heading reads Failed, the danger `Alert` carries the reason with Edit and Redeploy, the permanent failure toast carries the same two actions, and the logs stay open on the failed step.
- Succeeded: the run is live; the heading reads Deployed, the success `Alert` names the new address with Edit, Redeploy and Open service, the success toast carries Edit and Redeploy, and the logs card is gone.

## Related

- `platform/states/form-validation` — the synchronous counterpart: field, section and toast placement for a save that answers right away.
- `platform/detail/deployment-logs` — the deployment logs card (`LogView.Steps`) the Running and Failed states reuse, and the full logs of a run the page Edit or a failure leads into.
- `platform/create/deploy-success` — the confirmation page after a deploy completes.
- `shells/console` — the layout this body renders in, which the user moves through while the run reports back.

## Variants

- `Idle` — primary (the code below)
- `Running` — Mid-run: the progress toast reads Deploying web-app…, the heading reads Deploying, and the logs card streams under the Building status.
- `Failed` — The routing rules were refused: the heading reads Failed, the danger Alert carries the reason with Edit and Redeploy, the permanent failure toast carries the same two actions, and the logs card stays open on the failed step with the Phased or Complete switch.
- `Succeeded` — The run is live: the heading reads Deployed and the success Alert names the new address with Edit, Redeploy and Open service, the success toast carries Edit and Redeploy, and the logs card is gone.

Each variant is the same screen in another state: `get_pattern("platform/states/async-submit", { variant })`, or the file under `blocks/platform/states/async-submit/variants/`.

## Code (`Idle`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, onBeforeUnmount, ref } from 'vue'

  interface StatusTag {
    label: string
    severity: TagSeverity
  }

  const REPO = { name: 'web-app', scope: 'acme' }

  const status = ref('idle')
  const running = computed(() => status.value === 'running')

  const statusTag = computed<StatusTag>(() => {
    if (status.value === 'running') return { label: 'Deploying', severity: 'info' }
    if (status.value === 'error') return { label: 'Failed', severity: 'danger' }
    if (status.value === 'success') return { label: 'Deployed', severity: 'success' }
    return { label: 'Idle', severity: 'neutral' }
  })

  const RUN_TOAST = 'async-submit-run'
  let runTimer: ReturnType<typeof setTimeout> | undefined

  const deploy = () => {
    if (running.value) return
    status.value = 'running'
    toast.loading(`Deploying ${REPO.name}…`, {
      id: RUN_TOAST,
      description: `${REPO.scope}/${REPO.name}. It keeps running if you leave.`
    })
    clearTimeout(runTimer)
    runTimer = setTimeout(() => {
      status.value = 'success'
      toast.success(`${REPO.name} is live.`, {
        id: RUN_TOAST,
        description: `It is available at ${REPO.name}.example.com.`,
        closable: true
      })
    }, 25000)
  }

  onBeforeUnmount(() => {
    clearTimeout(runTimer)
    toast.dismiss(RUN_TOAST)
  })
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

      <div class="layout-section-start">
        <EmptyState
          bordered
          icon="ai ai-cloud-upload"
          title="No deployment running"
          description="Deploy web-app to build it and publish it to production. It takes about 25 seconds, and you can leave this page while it runs."
        >
          <template #actions>
            <Button
              label="Deploy"
              kind="primary"
              size="medium"
              icon="ai ai-play"
              :loading="running"
              @click="deploy"
            />
          </template>
        </EmptyState>
      </div>
    </div>
  </div>
</template>
```
