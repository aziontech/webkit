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
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'

  type DeployStatus = 'queued' | 'deploying' | 'done' | 'failed'

  interface Scenario {
    settled: number
    failing: string[]
  }

  interface DeployItem {
    id: string
    name: string
    environments: string
    status: DeployStatus
    message: string
  }

  interface StatusMeta {
    label: string
    severity: TagSeverity
  }

  const SCENARIO: Scenario = {
    settled: 0,
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
    }
  ]

  const droppedFiles = [
    { path: 'dist/index.html', size: 4812 },
    { path: 'dist/assets/app-3f9c2a.js', size: 186_204 },
    { path: 'dist/assets/app-3f9c2a.css', size: 23_517 },
    { path: 'dist/assets/logo.svg', size: 2_946 },
    { path: 'dist/robots.txt', size: 68 }
  ]

  const { formatNumber } = useLocale()

  const sizeFormat = (value: number) =>
    formatNumber(value, {
      style: 'unit',
      unit: 'kilobyte',
      unitDisplay: 'short',
      maximumFractionDigits: 1
    })

  const formatSize = (bytes: number) => sizeFormat(bytes / 1000)

  const FILE_LIMIT = 100
  const shownFiles = droppedFiles.slice(0, FILE_LIMIT)
  const hiddenFileCount = droppedFiles.length - shownFiles.length

  const manifest = `${droppedFiles.length} files · ${formatSize(
    droppedFiles.reduce((total, file) => total + file.size, 0)
  )}`

  const FAILURE = 'A rule points at an integration that does not exist, so it kept its version.'

  const STATUS_TAG: Record<DeployStatus, StatusMeta> = {
    queued: { label: 'Queued', severity: 'neutral' },
    deploying: { label: 'Deploying', severity: 'info' },
    done: { label: 'Done', severity: 'success' },
    failed: { label: 'Failed', severity: 'danger' }
  }

  const MARK: Partial<Record<DeployStatus, OutcomeIconSeverity>> = {
    done: 'success',
    failed: 'danger'
  }

  const items = reactive(
    settings.map((entry, index): DeployItem => ({
      ...entry,
      status: index < SCENARIO.settled ? outcomeOf(entry.id) : 'queued',
      message: index < SCENARIO.settled && SCENARIO.failing.includes(entry.id) ? FAILURE : ''
    }))
  )

  function outcomeOf(id: string): DeployStatus {
    return SCENARIO.failing.includes(id) ? 'failed' : 'done'
  }

  const open = ref(false)
  const dropOpen = ref(false)
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

  const noun = (count: number) => (count === 1 ? 'Deployment Setting' : 'Deployment Settings')

  const title = computed(() => {
    const { total, done, failed, settled } = counts.value
    if (running.value) return `Deploying ${settled} of ${total}…`
    if (failed) return `Deployed ${done} of ${total} ${noun(total)}`
    return `Deployed ${total} ${noun(total)}`
  })

  const tally = computed(
    () =>
      `${counts.value.done} succeeded, ${counts.value.failed} failed. Each Deployment Setting deploys on its own, and the ones that succeeded stay live.`
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

  const deployDropped = () => {
    dropOpen.value = false
    open.value = true
    run()
  }

  onMounted(() => {
    dropOpen.value = true
  })

  onBeforeUnmount(() => {
    clearTimeout(stepTimer)
    toast.dismiss(RUN_TOAST)
  })
</script>

<template>
  <div class="layout-column-form layout-boundary flex min-w-0 flex-col gap-(--layout-group-gap)">
    <header class="flex min-w-0 flex-col gap-(--spacing-2xs)">
      <h1 class="text-balance text-heading-lg text-(--text-default)">web-app</h1>
      <p class="text-body-md text-(--text-muted)">
        Deploys to {{ items.length }} {{ noun(items.length) }}, each going live on its own.
      </p>
    </header>
    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
      <Button
        label="Deploy a folder"
        variant="outline"
        size="medium"
        icon="az az-upload"
        @click="dropOpen = true"
      />
    </div>

    <Dialog
      v-model:open="dropOpen"
      size="medium"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>New production deployment</DialogTitle>
        </PanelHeader>

        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <span class="truncate text-body-sm text-(--text-default)">web-app</span>
                <Tag
                  label="Production"
                  severity="neutral"
                  size="small"
                  class="shrink-0"
                />
              </div>
              <DialogDescription>
                These files ship as the new production version of web-app, replacing the one serving
                now. Production deploys with {{ items.length }} {{ noun(items.length) }}.
              </DialogDescription>
            </div>

            <div
              class="flex min-w-0 flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm)"
            >
              <div class="flex min-w-0 items-center gap-(--spacing-sm)">
                <i
                  class="az az-folder shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                />
                <div class="flex min-w-0 flex-col">
                  <span class="truncate text-body-sm text-(--text-default)">Dropped files</span>
                  <span class="text-body-xs text-(--text-muted)">{{ manifest }}</span>
                </div>
              </div>
              <ul
                aria-label="Dropped files"
                tabindex="0"
                class="m-0 flex max-h-64 min-w-0 list-none flex-col gap-(--spacing-2xs) overflow-auto overscroll-contain p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
              >
                <li
                  v-for="file in shownFiles"
                  :key="file.path"
                  class="flex min-w-0 items-center gap-(--spacing-sm) rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
                >
                  <i
                    class="az az-file shrink-0 text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span
                    dir="ltr"
                    class="min-w-0 truncate text-body-code-sm text-(--text-default)"
                    :title="file.path"
                  >
                    {{ file.path }}
                  </span>
                  <span class="ms-auto shrink-0 text-body-xs tabular-nums text-(--text-muted)">
                    {{ formatSize(file.size) }}
                  </span>
                </li>
                <li
                  v-if="hiddenFileCount > 0"
                  class="px-(--spacing-sm) py-(--spacing-xs) text-body-xs text-(--text-muted)"
                >
                  and {{ hiddenFileCount }} more
                </li>
              </ul>
            </div>
          </div>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Cancel"
                variant="ghost"
                size="medium"
                @click="dropOpen = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                label="Deploy to Production"
                variant="primary"
                size="medium"
                icon="az az-cloud-upload"
                @click="deployDropped"
              />
            </div>
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>

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
              :animated="settledOnce"
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
                    :animated="settledOnce || running"
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
                variant="outline"
                size="medium"
                icon="az az-refresh"
                @click="retryFailed"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                :label="running ? 'Hide' : 'Close'"
                variant="primary"
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
