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
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

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
    if (filter.value === 'all') return items.value
    if (filter.value === 'deploying')
      return items.value.filter((item) => item.status === 'deploying' || item.status === 'queued')
    return items.value.filter((item) => item.status === filter.value)
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
    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
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
