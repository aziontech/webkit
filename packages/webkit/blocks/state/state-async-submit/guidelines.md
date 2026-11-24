# Async submit

The async-action pattern, and the standard for every build and deploy screen. A long-running action the user is free to walk away from: a deploy that runs for about half a minute and asks nothing while it does. The user's job is to start it, go on working anywhere in the console, and learn how it ended without coming back to check. The page that started the run shows its status in the heading, the logs while it runs and an inline outcome when it ends; in a full app the run lives outside the page, so its progress travels with the user as a toast, and its outcome comes back as a toast when the user is not looking at this page, on success and on failure.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

The run toast rides the app's one toast region, never the page's: the app installs `ToastPlugin` (`app.use(ToastPlugin, { position: 'bottom-end' })`) or mounts one `Toaster` near its root, beside `ConsoleLayout`, and this page body only imports `toast` from `@aziontech/webkit/toast`. A `Toaster` inside a page body is a second region for the whole app: only the first `Toaster` to mount is active, and it gives that up when it unmounts, so a page's copy is either inert or, when it mounted first, stops every toast once the user leaves the page, the opposite of a run toast that follows the user. The docs preview mounts one region around the block the way an app root does, so its frames show the toasts; a copy of the page shows them wherever the app has mounted the region.

The toasts are raised through `toast` with one id per run so each state replaces the last. Every outcome toast passes `actions: [{ label: 'Edit', onClick }, { label: 'Redeploy', onClick }]` and `closable: true`, so the app's `Toaster` renders both as `Toast.Action`s beside `Toast.Close`; the progress toast carries no action. The Running frame raises the progress toast. When the run ends while this page is on screen, the outcome `Alert` is the outcome and the progress toast is dismissed: a toast repeating the Alert would cover the failed step on a phone. When the page is out of view (`document.visibilityState === 'hidden'`), Error raises the permanent failure toast and Success the success toast; in an app, the run store raises them the same way when the user has moved to another page. Leaving the page dismisses the toast so the next story starts clean.

## When to use

- Use state-async-submit when the action runs long enough that the user leaves (build, deploy, import) and the result must reach them later.
- Any action that takes long enough to leave: build, deploy, redeploy, import, provision, a bulk change.
- When the outcome must reach the user on whatever page they are on when it lands.
- As the reference for the idle, running, failed and succeeded states of a run started from a page.

## When not to use

- A save that answers in about a second: use `state/state-form-validation`.
- A run the user watches to the end inside a create flow, or a deployment's own page: use `detail/detail-deployment-logs` (InCreateFlow, DeploymentDetail).
- Confirming a finished deploy with next steps: use `create/create-deploy-success`.
- A deploy configured in a side panel: use `create/create-deploy-drawer`.

## Building blocks

### A. Actions — `Button` (required)

**Deploy**, the `EmptyState` action, emits `deploy`; the outcome `Alert`s carry Edit and Redeploy, which emit `edit` and `redeploy`, and the success `Alert` adds Open service.

### B. Page heading — `PageHeader` (required)

`size="large"`, the page title and one sentence on what the run does. Its `#meta` slot carries the run status as a `Tag` beside the title, at its own width, so the state of the run is readable from the heading in every state and never stretches into a button-like bar on a phone (`#actions` is for buttons).

### C. Run status — `Tag` (required)

In the heading: `Idle` (`secondary`), `Deploying` (`info`), `Failed` (`danger`), `Deployed` (`success`). One to two words, never a sentence.

### D. Nothing running — `EmptyState` (idle only)

`bordered`, the deploy glyph, a title, one sentence and **Deploy** as its only action. It gives way to the logs card once a run starts.

### E. Outcome — `Alert` (error and success only)

Under the heading, with a scale-in entrance: `severity="danger"` with the `error` text and Edit and Redeploy when the run failed, `severity="success"` naming the address and the attempts with Edit, Redeploy and Open service when it is live.

### F. Deployment logs — `Card`, `StatusIndicator`, `LogViewer`, `ToggleGroup` (running and error only)

A flush `Card` titled Deployment holding `LogViewer.Steps` over the `steps` prop. While the run is in flight the header carries a loading `StatusIndicator` (Building), the logs header counts the finished steps and names the running one, and a progress bar runs along the bottom edge. After a failure the header carries a `ToggleGroup` for the Phased or Complete view, the logs header a danger `Tag` naming the failed step, the failed step opens, and the skipped steps say where the run stopped.

## Data

The block takes the run through props and emits every action; it fetches nothing and runs no timer. `AsyncSubmitStep`, `AsyncSubmitDeployment` and `AsyncSubmitProps` are exported from `state-async-submit.vue`, and `sample.ts` holds the running and failed steps, the failure reason and the deployment the variants pass.

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
  import StateAsyncSubmit from './state-async-submit.vue'

  const run = useDeployRun('web-app')
</script>

<template>
  <StateAsyncSubmit
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
- Report the end wherever the user is, on success and on failure: inline when they are on the page that started the run, as a toast when they are not. A failure toast is permanent (`duration: 0`) and `closable`; a success toast is `closable` with the default 6 second duration.
- Raise the toasts through `toast` only; the app mounts the region once (`ToastPlugin` or one `Toaster` at its root), so the page body never renders a `Toaster`.
- Give both toasts the same two actions through `toast()`'s `actions` option: **Edit** for the item that was deployed, and **Redeploy**. Don't rebuild the toast body in the `Toaster` slot to get two actions.
- On the page that started the run, show the outcome inline instead of a toast, with the same two actions the toast would carry: a danger `Alert` with the reason, **Edit** and **Redeploy** over the stopped logs, or a success `Alert` naming the new address with **Edit**, **Redeploy** and **Open service**.
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

- `state/state-form-validation` — the synchronous counterpart: field, section and toast placement for a save that answers right away.
- `detail/detail-deployment-logs` — the deployment logs card (`LogViewer.Steps`) the Running and Error states reuse, and the full logs of a run the page Edit or a failure leads into.
- `create/create-deploy-success` — the confirmation page after a deploy completes.
- `shell/shell-console` — the layout this body renders in, which the user moves through while the run reports back.
