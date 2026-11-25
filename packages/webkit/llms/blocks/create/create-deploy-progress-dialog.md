# CreateDeployProgressDialog (`create/create-deploy-progress-dialog`)

> The modal progress of one deploy that sends several Deployment Settings live, each on its own, and the drop-to-deploy confirm that starts it. The `Dialog` is titled Deploying… 2 of 5 done while it runs, can be hidden at any time (Hide while running, Close once settled; the toast keeps reporting and Show progress reopens it); under the title the tally says how many succeeded and failed and that the ones that succeeded stay live. A `Progress` bar and Deploying <name> track the run, a `ToggleGroup` filters All, Remaining, Failed and Done with their counts, and each row names the settings and the environments and projects it reaches, with a `Spinner` and a status `Tag` while it deploys and an `OutcomeIcon` once it settles. When the run settles the header gains a large `OutcomeIcon` and the outcome reports through one toast with Edit and Redeploy, as every async action does, raised only while the dialog is hidden so it never covers the dialog's footer; a failed row says why and the footer offers Retry failed. The toast stays the standard for deploys: this dialog is only for the drop-to-deploy and multi-settings path. Built from `Dialog`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Progress`, `ToggleGroup`, `Spinner`, `Tag`, `OutcomeIcon`, `Button`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. The page behind it is a page body for ConsoleLayout.

- Surface: app
- Source: `blocks/create/create-deploy-progress-dialog/create-deploy-progress-dialog.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-deploy-progress-dialog")`
- Components: [Button](../../components/button.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, [EmptyState](../../components/empty-state.md), [Item](../../components/item.md), [OutcomeIcon](../../components/outcome-icon.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Progress](../../components/progress.md), [Spinner](../../components/spinner.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToggleGroup](../../components/toggle-group.md), `use-locale`
- Skills: `webkit-ui-states`, `webkit-errors`, `webkit-microcopy`

## Asked as

deploy progress; deploy progress dialog; drop to deploy; deploy a folder; multi deploy progress; progresso do deploy; arrastar e implantar; progreso del despliegue

The modal progress of one deploy that sends several Deployment Settings live, each on its own, and the drop-to-deploy confirm that starts it. The user dropped a folder (or started a deploy whose environment deploys through several Deployment Settings) and wants to see each one go live, know which failed and why, and retry only those. The page behind the dialog is a page body for `ConsoleLayout` (the layout owns the rail, the header and the `main`); the dialog teleports over it.

**The toast stays the standard.** Every deploy reports through one toast with Edit and Redeploy (`state/state-async-submit`). This dialog is only for the drop-to-deploy path and for a deploy that fans out to several Deployment Settings; even there the outcome still reaches the user through the toast, so they can close the dialog and leave.

## When to use

- A folder dropped on a service deploys straight to an environment.
- One deploy sends several Deployment Settings live that can succeed or fail independently.

## When not to use

- A deploy of one service or project: use `create/create-deploy-drawer`, which closes and reports through the toast.
- A deploy with build steps and logs: use `detail/detail-deployment-logs`.
- Reviewing what a multi-resource release reaches before it runs: use `create/create-release-impact`.

## Building blocks

### A. Drop confirm — `Dialog`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `Tag`, `PanelFooter`, `Button` (required on the drop path)

Titled "New production deployment" (the environment in lower case), with the dialog's own close button in the header. The service name with the environment as a secondary `Tag`, one sentence on what the files replace and how many Deployment Settings the environment deploys with, then the dropped folder: its file count and total size, and a scrollable list (focusable, named "Dropped files") of the first 100 paths in code type with their sizes, and an "and N more" line for the rest. Sizes go through `Intl.NumberFormat` with `style: 'unit'`. The footer has Cancel (transparent) and "Deploy to Production" (primary).

### B. Progress frame — `Dialog`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `OutcomeIcon` (required)

`size="medium"` and always `dismissible`: the run keeps going in the background, and the toast reports it once the dialog is hidden. The title counts: "Deploying… 2 of 5 done" while running (the settled count, never the position of the one in progress), "Deployed 5 Deployment Settings" or "Deployed 4 of 5 Deployment Settings" once settled. The description is the tally and, while running or after a failure, the rule that the ones that succeeded stay live; a run where every deploy succeeded just says they are all live. Once settled a large `OutcomeIcon` stands before the title: success when all deployed, warning when some failed.

### C. Progress — `PanelBody`, `Progress` (required)

The share of settled settings while the run goes on, named "Deploy progress", with "Deploying <name>" under it while one runs. Once settled the bar shows the share that succeeded, so a partial failure never reads as a full, successful bar.

### D. Filter — `ToggleGroup` (required)

Small, named "Filter deploys by status": All, Remaining n (deploying and queued), Failed n, Done n. It shows while the run goes on and after a failure; a run where everything succeeded has nothing to filter, so it hides. An empty filter shows a small `EmptyState` ("Nothing failed.").

### E. Rows — `Item`, `OutcomeIcon`, `Spinner`, `Tag`, `EmptyState` (required)

An `Item.List` with one small `Item variant="outline"` per Deployment Setting: its name, the environments and projects it reaches, and, when it failed, the reason in danger text. A queued or running row leads with the settings glyph; a settled row leads with a small `OutcomeIcon`. On the end side a `Spinner` while deploying and a status `Tag`: Queued, Deploying, Done, Failed.

### F. Footer — `PanelFooter`, `Button` (required)

Retry failed appears only when the run settled with failures, and is then the primary action with Close outlined beside it; otherwise the primary button reads Hide while the run goes on and Close once it settled; both close the dialog, and Show progress reopens it.

### Outcome toast — through `toast`

One toast id for the run, raised only while the dialog is hidden, so it never covers the dialog's own footer: `toast.loading` with "It keeps running if you leave." while the run goes on, then `toast.success` or `toast.error` (`duration: 0`, `closable`) with **Edit** and **Redeploy** when it settles. Opening the dialog dismisses the toast; a run that settled while the dialog was open already showed its outcome there, so closing it raises no toast. Edit reopens the dialog on the failed rows; Redeploy emits `redeploy` so the page runs every setting again. Never View deployments. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes the run through props and emits every action; it runs no deploy and fakes no progress. `DeployProgressDialogItem` and `DeployProgressDialogProps` are exported from `create-deploy-progress-dialog.vue`, and `sample.ts` holds the sample runs (`sampleRunningItems` renders when `items` is left out; `sampleDeployedItems` and `samplePartialItems` are what the variants pass). The page updates each row's `status` as the deploy reports it; the title, the bar, the filter counts and the toast follow from the rows.

| Prop           | Type                         | What it does                                                                                                       |
| -------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `items`        | `DeployProgressDialogItem[]` | Every Deployment Setting of the run with its `status` (queued, deploying, done, failed) and the failure `message`. |
| `resourceName` | `string`                     | The resource being deployed, the page heading and the toast description.                                           |
| `v-model:open` | `boolean`                    | Whether the dialog shows; `true` by default, Hide and Close set it to `false`.                                     |

| Event      | Payload          | When                                                       |
| ---------- | ---------------- | ---------------------------------------------------------- |
| `retry`    | `(event, items)` | Retry failed; `items` are the failed rows to deploy again. |
| `redeploy` | `(event)`        | Redeploy in the outcome toast; deploy every setting again. |

| Slot      | What it holds                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `actions` | The page actions under the heading; left empty, Show progress. Drop puts Deploy a folder there instead. |

A run whose rows are all queued has not started: the block raises no toast for it. Drop renders the block with its two Deployment Settings queued, opens its own confirm beside it, and on Deploy to Production opens the progress dialog and moves the rows through the run.

To go live, render the block from a page that owns the deploy and pass its rows as they change:

```vue
<script setup lang="ts">
  import CreateDeployProgressDialog from './create-deploy-progress-dialog.vue'

  const { settings, retry, redeploy } = useDeployRun(deploymentId)
</script>

<template>
  <CreateDeployProgressDialog
    :items="settings"
    resource-name="web-app"
    @retry="(event, failed) => retry(failed)"
    @redeploy="redeploy"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Let each Deployment Setting settle on its own and keep the ones that succeeded live.
- Say why a row failed on the row itself.
- Offer Retry failed for the failed rows only.
- Report the run through the toast while the dialog is hidden, so the user can hide it and leave; never raise the toast over the open dialog.

## Don't

- Don't use this dialog for a single deploy; the toast is enough.
- Don't trap the user in the dialog while the run goes on; let them hide it (the toast keeps reporting) and reopen it with Show progress.
- Don't roll back the settings that succeeded because another failed.

## Copy

- **Drop:** "New production deployment", "Dropped files", "Deploy to Production".
- **Title:** "Deploying… 2 of 5 done", "Deployed 5 Deployment Settings", "Deployed 4 of 5 Deployment Settings".
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

- Running: `items` has two settled, one deploying and two queued; it advances as the page updates their `status`.
- Drop: the confirm that starts a drop-to-deploy run.
- PartialError: `items` settled with one failed row and its `message`; Retry failed. The dialog shows the outcome, so no toast covers it; the error toast appears only for a run that settles while the dialog is hidden.
- Success: every row in `items` is done; the dialog shows the outcome, and the success toast appears only for a run that settles while the dialog is hidden.

## Related

- `state/state-async-submit` — the toast rule this block follows.
- `create/create-deploy-drawer` — the standard way to deploy.
- `create/create-release-impact` — what a release reaches, before it runs.
- `OutcomeIcon` — the settled mark.

## Variants

- `Running` — primary (the code below)
- `Drop` — The drop-to-deploy confirm: New production deployment, the service with a Production `Tag`, what the files replace, and the dropped folder with its file count, total size and a scrollable list of up to 100 paths (an 'and N more' line counts the rest) with sizes formatted by `Intl.NumberFormat`. Cancel closes; Deploy to Production opens the progress dialog and starts the run.
- `PartialError` — Settled with one failure: Deployed 4 of 5 Deployment Settings with a warning `OutcomeIcon`, staging-settings marked Failed with the reason, the bar at the 4 of 5 that succeeded, Retry failed as the primary action beside an outlined Close, and no toast while the dialog shows the outcome; a run that settles while the dialog is hidden raises an error toast with Edit (reopens the dialog on the failed rows) and Redeploy.
- `Success` — Every Deployment Setting deployed: a large animated success `OutcomeIcon` beside Deployed 5 Deployment Settings, every row Done, no filter (nothing to filter), Close enabled, and no toast while the dialog shows the outcome; a run that settles while the dialog is hidden raises a success toast with Edit and Redeploy.

Each variant is the same screen in another state: `get_block("create/create-deploy-progress-dialog", { variant })`, or the file under `blocks/create/create-deploy-progress-dialog/variants/`.

## Code (`Running`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Item from '@aziontech/webkit/item'
  import OutcomeIcon, { type OutcomeIconSeverity } from '@aziontech/webkit/outcome-icon'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Progress from '@aziontech/webkit/progress'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import { sampleRunningItems } from './sample'

  /** Where one Deployment Setting is in the run. */
  export type DeployProgressDialogStatus = 'queued' | 'deploying' | 'done' | 'failed'

  /** One Deployment Setting the run deploys. */
  export interface DeployProgressDialogItem {
    /** Stable key. */
    id: string
    /** The Deployment Setting name. */
    name: string
    /** The environments and projects it reaches, already phrased. */
    environments: string
    /** Where it is in the run. */
    status: DeployProgressDialogStatus
    /** Why it failed, shown under the row; empty otherwise. */
    message?: string
  }

  export interface DeployProgressDialogProps {
    /** The resource being deployed, shown as the page heading. */
    resourceName?: string
    /** Every Deployment Setting of the run with its status. Left out, the sample renders. */
    items?: DeployProgressDialogItem[]
  }

  interface StatusMeta {
    label: string
    severity: TagSeverity
  }

  const props = withDefaults(defineProps<DeployProgressDialogProps>(), {
    resourceName: 'web-app',
    items: undefined
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent, items: DeployProgressDialogItem[]]
    redeploy: [event: MouseEvent]
  }>()

  const open = defineModel<boolean>('open', { default: true })

  defineSlots<{
    /** The page actions under the heading; left empty, Show progress. */
    actions?(): unknown
  }>()

  const RUN_TOAST = 'deploy-progress-dialog-run'

  const STATUS_TAG: Record<DeployProgressDialogStatus, StatusMeta> = {
    queued: { label: 'Queued', severity: 'neutral' },
    deploying: { label: 'Deploying', severity: 'info' },
    done: { label: 'Done', severity: 'success' },
    failed: { label: 'Failed', severity: 'danger' }
  }

  const MARK: Partial<Record<DeployProgressDialogStatus, OutcomeIconSeverity>> = {
    done: 'success',
    failed: 'danger'
  }

  const items = computed<DeployProgressDialogItem[]>(() => props.items ?? sampleRunningItems)

  const filter = ref('all')

  const counts = computed(() => {
    const total = items.value.length
    const done = items.value.filter((item) => item.status === 'done').length
    const failed = items.value.filter((item) => item.status === 'failed').length
    return { total, done, failed, settled: done + failed }
  })

  const running = computed(() => counts.value.settled < counts.value.total)

  const started = computed(() => items.value.some((item) => item.status !== 'queued'))

  const activeName = computed(
    () => items.value.find((item) => item.status === 'deploying')?.name ?? ''
  )

  const percent = computed(() => {
    const { total, settled, done } = counts.value
    if (!total) return 0
    return Math.round(((running.value ? settled : done) / total) * 100)
  })

  const partial = computed(() => !running.value && counts.value.failed > 0)

  const filterOptions = computed(() => [
    { value: 'all', label: 'All' },
    { value: 'remaining', label: `Remaining ${counts.value.total - counts.value.settled}` },
    { value: 'failed', label: `Failed ${counts.value.failed}` },
    { value: 'done', label: `Done ${counts.value.done}` }
  ])

  const visibleItems = computed(() => {
    if (filter.value === 'all') return items.value
    if (filter.value === 'remaining')
      return items.value.filter((item) => item.status === 'deploying' || item.status === 'queued')
    return items.value.filter((item) => item.status === filter.value)
  })

  const noun = (count: number) => (count === 1 ? 'Deployment Setting' : 'Deployment Settings')

  const title = computed(() => {
    const { total, done, failed, settled } = counts.value
    if (running.value) return `Deploying… ${settled} of ${total} done`
    if (failed) return `Deployed ${done} of ${total} ${noun(total)}`
    return `Deployed ${total} ${noun(total)}`
  })

  const tally = computed(() =>
    counts.value.failed || running.value
      ? `${counts.value.done} succeeded, ${counts.value.failed} failed. Each Deployment Setting deploys on its own, and the ones that succeeded stay live.`
      : `All ${counts.value.done} succeeded and are live.`
  )

  const outcomeSeverity = computed(() => (counts.value.failed ? 'warning' : 'success'))

  const emptyLabel = computed(() =>
    filter.value === 'failed' ? 'Nothing failed.' : 'Nothing in this state.'
  )

  const edit = () => {
    toast.dismiss(RUN_TOAST)
    filter.value = counts.value.failed ? 'failed' : 'all'
    open.value = true
  }

  const redeploy = (event: MouseEvent) => {
    filter.value = 'all'
    open.value = true
    emit('redeploy', event)
  }

  const retryFailed = (event: MouseEvent) => {
    const failed = items.value.filter((item) => item.status === 'failed')
    filter.value = 'all'
    emit('retry', event, failed)
  }

  const outcomeSeen = ref(false)

  const report = () => {
    const { total, done, failed } = counts.value
    if (!started.value) {
      toast.dismiss(RUN_TOAST)
      return
    }
    if (running.value) outcomeSeen.value = false
    if (open.value) {
      toast.dismiss(RUN_TOAST)
      if (!running.value) outcomeSeen.value = true
      return
    }
    if (running.value) {
      toast.loading(title.value, {
        description: `${props.resourceName} to every project these settings reach. It keeps running if you leave.`,
        id: RUN_TOAST
      })
      return
    }
    if (outcomeSeen.value) return
    const actions = [
      { label: 'Edit', onClick: edit },
      { label: 'Redeploy', onClick: redeploy }
    ]
    if (failed) {
      toast.error(`Deployed ${done} of ${total} ${noun(total)}.`, {
        description: `${failed} failed and kept its version. The ones that succeeded stay live.`,
        duration: 0,
        closable: true,
        actions,
        id: RUN_TOAST
      })
      return
    }
    toast.success(`Deployed ${total} ${noun(total)}.`, {
      description: `${props.resourceName} serves every project they reach.`,
      duration: 0,
      closable: true,
      actions,
      id: RUN_TOAST
    })
  }

  watch([started, running, open], report)

  const actionsEl = ref<HTMLElement | null>(null)

  watch(open, async (now, before) => {
    if (now || !before) return
    await nextTick()
    await nextTick()
    const active = document.activeElement
    if (active && active !== document.body && active.isConnected) return
    actionsEl.value?.querySelector<HTMLElement>('button, a[href]')?.focus()
  })

  onMounted(report)

  onBeforeUnmount(() => {
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="layout-column-form layout-boundary flex min-w-0 flex-col gap-(--layout-group-gap)">
    <header class="flex min-w-0 flex-col gap-(--spacing-2xs)">
      <h1 class="text-balance text-heading-lg text-(--text-default)">{{ resourceName }}</h1>
      <p class="text-body-md text-(--text-muted)">
        Deploys to {{ items.length }} {{ noun(items.length) }}, each going live on its own.
      </p>
    </header>
    <div
      ref="actionsEl"
      class="flex flex-wrap items-center gap-(--spacing-sm)"
    >
      <slot name="actions">
        <Button
          label="Show progress"
          variant="outline"
          size="medium"
          icon="az az-list"
          @click="open = true"
        />
      </slot>
    </div>

    <Dialog
      v-model:open="open"
      size="medium"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <div class="flex min-w-0 items-start gap-(--spacing-sm)">
            <OutcomeIcon
              v-if="!running"
              :severity="outcomeSeverity"
              size="large"
              animated
              :aria-label="counts.failed ? 'Some failed' : 'Succeeded'"
              class="shrink-0"
            />
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DialogTitle>{{ title }}</DialogTitle>
              <DialogDescription>
                {{ tally }}
              </DialogDescription>
            </div>
          </div>
        </PanelHeader>

        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
              <Progress
                :value="percent"
                data-testid="create-deploy-progress-dialog__progress"
                aria-label="Deploy progress"
                size="small"
              />
              <p
                v-if="activeName"
                class="truncate text-body-sm text-(--text-muted)"
              >
                Deploying {{ activeName }}
              </p>
            </div>

            <ToggleGroup
              v-if="running || counts.failed"
              v-model="filter"
              :options="filterOptions"
              aria-label="Filter deploys by status"
              size="small"
              class="self-start"
            />

            <Item.List
              v-if="visibleItems.length"
              aria-label="Deployment Settings"
            >
              <Item
                v-for="item in visibleItems"
                :key="item.id"
                variant="outline"
                size="small"
              >
                <Item.Media>
                  <OutcomeIcon
                    v-if="MARK[item.status]"
                    :severity="MARK[item.status]"
                    size="small"
                    animated
                    :aria-label="STATUS_TAG[item.status].label"
                  />
                  <i
                    v-else
                    class="az az-sliders-horizontal text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ item.name }}</Item.Title>
                  <Item.Description>{{ item.environments }}</Item.Description>
                  <span
                    v-if="item.message"
                    class="text-body-xs text-(--danger-foreground)"
                  >
                    {{ item.message }}
                  </span>
                </Item.Content>
                <Item.Actions>
                  <span
                    v-if="item.status === 'deploying'"
                    class="flex size-4 shrink-0 text-(--text-muted)"
                  >
                    <Spinner class="w-full" />
                  </span>
                  <Tag
                    :label="STATUS_TAG[item.status].label"
                    :severity="STATUS_TAG[item.status].severity"
                    size="small"
                  />
                </Item.Actions>
              </Item>
            </Item.List>
            <EmptyState
              v-else
              size="small"
              icon="az az-filter"
              :title="emptyLabel"
            />
            <span
              class="sr-only"
              role="status"
            >
              {{ running ? '' : title }}
            </span>
          </div>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <div
              v-if="counts.failed && !running"
              class="w-full md:w-fit"
            >
              <Button
                class="w-full"
                label="Retry failed"
                variant="primary"
                size="medium"
                icon="az az-refresh"
                @click="retryFailed"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                :label="running ? 'Hide' : 'Close'"
                :variant="partial ? 'outline' : 'primary'"
                size="medium"
                @click="open = false"
              />
            </div>
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
```

## `sample.ts`

```ts
import type { DeployProgressDialogItem } from './create-deploy-progress-dialog.vue'

const failure = 'A rule points at an integration that does not exist, so it kept its version.'

const settings = [
  {
    id: 'production-settings',
    name: 'production-settings',
    environments: 'Production and Preview · 3 projects'
  },
  {
    id: 'storefront-settings',
    name: 'storefront-settings',
    environments: 'Production · 2 projects'
  },
  { id: 'docs-settings', name: 'docs-settings', environments: 'Production · 1 project' },
  { id: 'staging-settings', name: 'staging-settings', environments: 'Staging · 2 projects' },
  { id: 'preview-settings', name: 'preview-settings', environments: 'Preview · 1 project' }
]

export const sampleRunningItems: DeployProgressDialogItem[] = settings.map((entry, index) => ({
  ...entry,
  status: index < 2 ? 'done' : index === 2 ? 'deploying' : 'queued',
  message: ''
}))

export const sampleDeployedItems: DeployProgressDialogItem[] = settings.map((entry) => ({
  ...entry,
  status: 'done',
  message: ''
}))

export const samplePartialItems: DeployProgressDialogItem[] = settings.map((entry) =>
  entry.id === 'staging-settings'
    ? { ...entry, status: 'failed', message: failure }
    : { ...entry, status: 'done', message: '' }
)

export const sampleDropItems: DeployProgressDialogItem[] = settings.slice(0, 2).map((entry) => ({
  ...entry,
  status: 'queued',
  message: ''
}))

export const sampleDroppedFiles = [
  { path: 'dist/index.html', size: 4812 },
  { path: 'dist/assets/app-3f9c2a.js', size: 186_204 },
  { path: 'dist/assets/app-3f9c2a.css', size: 23_517 },
  { path: 'dist/assets/logo.svg', size: 2_946 },
  { path: 'dist/robots.txt', size: 68 }
]
```
