# DeployProgressDialog (`platform/create/deploy-progress-dialog`)

> The modal progress of one deploy that activates several Deployment Settings, each on its own, and the drop-to-deploy confirm that starts it. The `Dialog` is titled Deploying 2 of 5… while it runs, cannot be dismissed and keeps Close disabled; under the title the tally says how many succeeded and failed and that the ones that succeeded stay live. A `Progress` bar and Activating <name> track the run, a `ToggleGroup` filters All, Deploying, Failed and Done with their counts, and each row names the settings and the environments and projects it reaches, with a `Spinner` and a status `Tag` while it deploys and an `OutcomeMark` once it settles. When the run settles the header gains a large `OutcomeMark` and the outcome reports through one toast with Edit and Redeploy, as every async action does; a failed row says why and the footer offers Retry failed. The toast stays the standard for deploys: this dialog is only for the drop-to-deploy and multi-settings path. Built from `Dialog`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Progress`, `ToggleGroup`, `Spinner`, `Tag`, `OutcomeMark`, `Button` and `Toaster`.

- Surface: product
- Source: `blocks/platform/create/deploy-progress-dialog/deploy-progress-dialog.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/create/deploy-progress-dialog")`
- Components: [Button](../../../components/button.md), [Dialog](../../../components/dialog.md), `DialogClose`, `DialogContent`, `DialogDescription`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, [OutcomeMark](../../../components/outcome-mark.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [Progress](../../../components/progress.md), [Spinner](../../../components/spinner.md), [Tag](../../../components/tag.md), [Toast](../../../components/toast.md), [ToggleGroup](../../../components/toggle-group.md)
- Skills: `webkit-ui-states`, `webkit-errors`, `webkit-microcopy`

## Asked as

deploy progress; deploy progress dialog; drop to deploy; deploy a folder; multi deploy progress; progresso do deploy; arrastar e implantar; progreso del despliegue

The modal progress of one deploy that activates several Deployment Settings, each on its own, and the drop-to-deploy confirm that starts it. The user dropped a folder (or started a deploy whose environment publishes through several Deployment Settings) and wants to see each one activate, know which failed and why, and retry only those.

**The toast stays the standard.** Every deploy reports through one toast with Edit and Redeploy (`platform/states/async-submit`). This dialog is only for the drop-to-deploy path and for a deploy that fans out to several Deployment Settings; even there the outcome still reaches the user through the toast, so they can close the dialog and leave.

## When to use

- A folder dropped on a service deploys straight to an environment.
- One deploy activates several Deployment Settings that can succeed or fail independently.

## When not to use

- A deploy of one service or project: use `platform/create/deploy-drawer`, which closes and reports through the toast.
- A deploy with build steps and logs: use `platform/create/deployment-flow` and `platform/detail/deployment-logs`.
- Reviewing what a multi-resource release reaches before it runs: use `platform/create/release-impact`.

## Building blocks

### A. Drop confirm — `Dialog`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `Tag`, `PanelFooter`, `Button` (required on the drop path)

Titled "New production deployment" (the environment in lower case), with a `DialogClose` in the header. The service name with the environment as a secondary `Tag`, one sentence on what the files replace and how many Deployment Settings the environment publishes with, then the dropped folder: its file count and total size, and a scrollable list (focusable, named "Dropped files") of paths in code type with their sizes. Sizes go through `Intl.NumberFormat` with `style: 'unit'`. The footer has Cancel (transparent) and "Deploy to Production" (primary).

### B. Progress frame — `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `PanelHeader`, `DialogTitle`, `DialogDescription`, `OutcomeMark` (required)

`size="medium"`, `dismissible` only once settled. The title counts: "Deploying 2 of 5…" while running, "Deployed 5 Deployment Settings" or "Deployed 4 of 5 Deployment Settings" once settled. The description is the tally and the rule that the ones that succeeded stay live. Once settled a large `OutcomeMark` stands before the title: success when all deployed, warning when some failed.

### C. Progress — `PanelContent`, `Progress` (required)

The share of settled settings, named "Deploy progress", with "Activating <name>" under it while one runs.

### D. Filter — `ToggleGroup` (required)

Small, named "Filter deploys by status": All, Deploying n (running and queued), Failed n, Done n. An empty filter says so in one line.

### E. Rows — `OutcomeMark`, `Spinner`, `Tag` (required)

One bordered row per Deployment Setting: its name, the environments and projects it reaches, and, when it failed, the reason in danger text. A queued or running row leads with the settings glyph; a settled row leads with a small `OutcomeMark`. On the end side a `Spinner` while deploying and a status `Tag`: Queued, Deploying, Done, Failed.

### F. Footer — `PanelFooter`, `Button` (required)

Retry failed (outlined) appears only when the run settled with failures; Close (primary) is disabled while the run goes on.

### G. Outcome toast — `Toaster` (required)

One toast id for the run: `toast.loading` with "It keeps running if you leave." when it starts, then `toast.success` or `toast.error` (`duration: 0`, `closable`) with **Edit** and **Redeploy**. Edit reopens the dialog on the failed rows; Redeploy runs every setting again. Never View deployments.

## Do

- Let each Deployment Setting settle on its own and keep the ones that succeeded live.
- Say why a row failed on the row itself.
- Offer Retry failed for the failed rows only.
- Report the outcome through the toast as well, so the user can close the dialog.

## Don't

- Don't use this dialog for a single deploy; the toast is enough.
- Don't let the dialog be dismissed while the run goes on, or the user loses the only view of it.
- Don't roll back the settings that succeeded because another failed.

## Copy

- **Drop:** "New production deployment", "Dropped files", "Deploy to Production".
- **Title:** "Deploying 2 of 5…", "Deployed 5 Deployment Settings", "Deployed 4 of 5 Deployment Settings".
- **Tally:** "4 succeeded, 1 failed. Each Deployment Setting activates on its own, and the ones that succeeded stay live."
- **Tags:** Queued, Deploying, Done, Failed. **Actions:** Retry failed, Close.
- Follow `skills/webkit-microcopy`: sentence case, no em dash, the progressive verb with `…`.

## Accessibility

- The dialog traps focus and is named by its title and described by the tally.
- The `Progress` bar is named; a `role="status"` line announces the outcome once settled.
- `OutcomeMark` names its outcome; tags give the state in words, glyphs are `aria-hidden`.
- The dropped files list is a focusable scroll region with an `aria-label`; paths are `dir="ltr"`.
- Motion: the marks honour reduced motion and the `Spinner` stops under it.

## States

- Running: two settled, one deploying, two queued; advances to its outcome.
- Drop: the confirm that starts a drop-to-deploy run.
- PartialFailure: settled with one failure, Retry failed, error toast.
- Succeeded: every setting deployed, success toast.

## Related

- `platform/states/async-submit` — the toast rule this block follows.
- `platform/create/deploy-drawer` — the standard way to deploy.
- `platform/create/release-impact` — what a release reaches, before it runs.
- `OutcomeMark` — the settled mark.

## Variants

- `Running` — primary (the code below)
- `Drop` — The drop-to-deploy confirm: New production deployment, the service with a Production `Tag`, what the files replace, and the dropped folder with its file count, total size and a scrollable list of paths with sizes formatted by `Intl.NumberFormat`. Cancel closes; Deploy to Production opens the progress dialog and starts the run.
- `PartialFailure` — Settled with one failure: Deployed 4 of 5 Deployment Settings with a warning `OutcomeMark`, staging-settings marked Failed with the reason, Retry failed beside Close, and an error toast with Edit (reopens the dialog on the failed rows) and Redeploy.
- `Succeeded` — Every Deployment Setting deployed: a large animated success `OutcomeMark` beside Deployed 5 Deployment Settings, every row Done, Close enabled, and a success toast with Edit and Redeploy.

Each variant is the same screen in another state: `get_pattern("platform/create/deploy-progress-dialog", { variant })`, or the file under `blocks/platform/create/deploy-progress-dialog/variants/`.

## Code (`Running`)

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import OutcomeMark from '@aziontech/webkit/outcome-mark'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Progress from '@aziontech/webkit/progress'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

  const SCENARIO = {
    settled: 2,
    failing: []
  }

  const RUN_TOAST = 'deploy-progress-dialog-run'
  const STEP_MS = 1400

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

  const FAILURE = 'A rule points at an integration that does not exist, so it kept its version.'

  const STATUS_TAG = {
    queued: { label: 'Queued', severity: 'secondary' },
    deploying: { label: 'Deploying', severity: 'info' },
    done: { label: 'Done', severity: 'success' },
    failed: { label: 'Failed', severity: 'danger' }
  }

  const MARK = { done: 'success', failed: 'danger' }

  const items = reactive(
    settings.map((entry, index) => ({
      ...entry,
      status: index < SCENARIO.settled ? outcomeOf(entry.id) : 'queued',
      message: index < SCENARIO.settled && SCENARIO.failing.includes(entry.id) ? FAILURE : ''
    }))
  )

  function outcomeOf(id) {
    return SCENARIO.failing.includes(id) ? 'failed' : 'done'
  }

  const open = ref(false)
  const filter = ref('all')
  const settledOnce = ref(false)

  let stepTimer = 0

  const counts = computed(() => {
    const total = items.length
    const done = items.filter((item) => item.status === 'done').length
    const failed = items.filter((item) => item.status === 'failed').length
    return { total, done, failed, settled: done + failed }
  })

  const running = computed(() => counts.value.settled < counts.value.total)

  const activeName = computed(() => items.find((item) => item.status === 'deploying')?.name ?? '')

  const percent = computed(() =>
    counts.value.total ? Math.round((counts.value.settled / counts.value.total) * 100) : 0
  )

  const filterOptions = computed(() => [
    { value: 'all', label: 'All' },
    { value: 'deploying', label: `Deploying ${counts.value.total - counts.value.settled}` },
    { value: 'failed', label: `Failed ${counts.value.failed}` },
    { value: 'done', label: `Done ${counts.value.done}` }
  ])

  const visibleItems = computed(() => {
    if (filter.value === 'all') return items
    if (filter.value === 'deploying')
      return items.filter((item) => item.status === 'deploying' || item.status === 'queued')
    return items.filter((item) => item.status === filter.value)
  })

  const noun = (count) => (count === 1 ? 'Deployment Setting' : 'Deployment Settings')

  const title = computed(() => {
    const { total, done, failed, settled } = counts.value
    if (running.value) return `Deploying ${settled} of ${total}…`
    if (failed) return `Deployed ${done} of ${total} ${noun(total)}`
    return `Deployed ${total} ${noun(total)}`
  })

  const tally = computed(
    () =>
      `${counts.value.done} succeeded, ${counts.value.failed} failed. Each Deployment Setting activates on its own, and the ones that succeeded stay live.`
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

  const report = () => {
    const { total, done, failed } = counts.value
    const actions = [
      { label: 'Edit', onClick: edit },
      { label: 'Redeploy', onClick: redeploy }
    ]
    if (failed) {
      toast.error(`Deployed ${done} of ${total} ${noun(total)}.`, {
        id: RUN_TOAST,
        description: `${failed} failed and kept its version. The ones that succeeded stay live.`,
        duration: 0,
        closable: true,
        actions
      })
      return
    }
    toast.success(`Deployed ${total} ${noun(total)}.`, {
      id: RUN_TOAST,
      description: 'web-app serves every project they reach.',
      duration: 0,
      closable: true,
      actions
    })
  }

  const step = () => {
    const active = items.find((item) => item.status === 'deploying')
    if (active) {
      active.status = outcomeOf(active.id)
      active.message = active.status === 'failed' ? FAILURE : ''
    }
    const next = items.find((item) => item.status === 'queued')
    if (next) {
      next.status = 'deploying'
      stepTimer = setTimeout(step, STEP_MS)
      return
    }
    settledOnce.value = true
    report()
  }

  const run = () => {
    clearTimeout(stepTimer)
    if (!running.value) {
      settledOnce.value = true
      report()
      return
    }
    toast.loading(title.value, {
      id: RUN_TOAST,
      description: 'web-app to every project these settings reach. It keeps running if you leave.'
    })
    const next = items.find((item) => item.status === 'queued')
    if (next) next.status = 'deploying'
    stepTimer = setTimeout(step, STEP_MS)
  }

  const redeploy = () => {
    items.forEach((item) => {
      item.status = 'queued'
      item.message = ''
    })
    SCENARIO.failing.splice(0)
    filter.value = 'all'
    settledOnce.value = false
    open.value = true
    run()
  }

  const retryFailed = () => {
    items.forEach((item) => {
      if (item.status !== 'failed') return
      item.status = 'queued'
      item.message = ''
    })
    SCENARIO.failing.splice(0)
    filter.value = 'all'
    settledOnce.value = false
    run()
  }

  onMounted(() => {
    open.value = true
    run()
  })

  onBeforeUnmount(() => {
    clearTimeout(stepTimer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <main class="layout-column-form layout-boundary flex min-w-0 flex-col gap-(--layout-group-gap)">
      <header class="flex min-w-0 flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-lg text-(--text-default)">web-app</h1>
        <p class="text-body-md text-(--text-muted)">
          Deploys to {{ items.length }} {{ noun(items.length) }}, each activating on its own.
        </p>
      </header>
      <div class="flex flex-wrap items-center gap-(--spacing-sm)">
        <Button
          label="Show progress"
          kind="outlined"
          size="medium"
          icon="pi pi-list"
          @click="open = true"
        />
      </div>
    </main>

    <Dialog
      v-model:open="open"
      size="medium"
      :dismissible="!running"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <div class="flex min-w-0 items-start gap-(--spacing-sm)">
              <OutcomeMark
                v-if="!running"
                :severity="outcomeSeverity"
                size="large"
                :animated="settledOnce"
                :aria-label="counts.failed ? 'Some failed' : 'Succeeded'"
                class="shrink-0"
              />
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DialogTitle>{{ title }}</DialogTitle>
                <DialogDescription>
                  {{ tally }}
                </DialogDescription>
              </div>
            </div>
          </PanelHeader>

          <PanelContent>
            <div class="flex flex-col gap-(--spacing-md)">
              <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                <Progress
                  :value="percent"
                  aria-label="Deploy progress"
                />
                <p
                  v-if="activeName"
                  class="truncate text-body-sm text-(--text-muted)"
                >
                  Activating {{ activeName }}
                </p>
              </div>

              <ToggleGroup
                v-model="filter"
                :options="filterOptions"
                aria-label="Filter deploys by status"
                size="small"
                class="self-start"
              />

              <ul
                aria-label="Deployment Settings"
                class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xs) p-0"
              >
                <li
                  v-for="item in visibleItems"
                  :key="item.id"
                  class="flex min-w-0 items-start justify-between gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-muted) p-(--spacing-sm)"
                >
                  <span class="flex min-w-0 items-start gap-(--spacing-xs)">
                    <span class="mt-0.5 flex shrink-0">
                      <OutcomeMark
                        v-if="MARK[item.status]"
                        :severity="MARK[item.status]"
                        size="small"
                        :animated="settledOnce || running"
                        :aria-label="STATUS_TAG[item.status].label"
                      />
                      <i
                        v-else
                        class="pi pi-sliders-h text-(--text-muted)"
                        aria-hidden="true"
                      />
                    </span>
                    <span class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                      <span class="truncate text-label-sm text-(--text-default)">
                        {{ item.name }}
                      </span>
                      <span class="truncate text-body-xs text-(--text-muted)">
                        {{ item.environments }}
                      </span>
                      <span
                        v-if="item.message"
                        class="text-body-xs text-(--danger-contrast)"
                      >
                        {{ item.message }}
                      </span>
                    </span>
                  </span>
                  <span class="flex shrink-0 items-center gap-(--spacing-xs)">
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
                  </span>
                </li>
                <li
                  v-if="!visibleItems.length"
                  class="p-(--spacing-sm) text-body-sm text-(--text-muted)"
                >
                  {{ emptyLabel }}
                </li>
              </ul>
              <span
                class="sr-only"
                role="status"
              >
                {{ running ? '' : title }}
              </span>
            </div>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
              <div
                v-if="counts.failed && !running"
                class="w-full md:w-fit"
              >
                <Button
                  class="w-full"
                  label="Retry failed"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-refresh"
                  @click="retryFailed"
                />
              </div>
              <div class="w-full md:w-fit">
                <Button
                  class="w-full"
                  label="Close"
                  kind="primary"
                  size="medium"
                  :disabled="running"
                  @click="open = false"
                />
              </div>
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
    <Toaster position="bottom-right" />
  </div>
</template>
```
