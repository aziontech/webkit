<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import SegmentedButton from '../../../actions/segmented-button/segmented-button.vue'
  import type { LogViewLine } from '../../../code/log-view/injection-key'
  import LogView from '../../../code/log-view/log-view.vue'
  import LogViewContent from '../../../code/log-view/log-view-content.vue'
  import ProgressBar from '../../../feedback/progress-bar/progress-bar.vue'
  import Tag from '../../../tag/tag.vue'
  import Spinner from '../../../utils/spinner/spinner.vue'
  import Accordion from '../../accordion/index'
  import {
    DEFAULT_DEPLOYMENT_STEPS,
    type DeploymentLogTuple,
    type DeploymentLogView,
    type DeploymentStep,
    LOG_VIEWS,
    STEP_GAP_MS
  } from '../data/deployment-steps'

  defineOptions({ name: 'DeploymentLogs' })

  type DeploymentPhase = 'running' | 'finished' | 'failed'
  type DeploymentStepStatus = 'done' | 'running' | 'failed' | 'skipped' | 'pending'

  interface Props {
    /** Steps of the deployment, each with its log lines. */
    steps?: DeploymentStep[]
    /** Streams through the steps instead of drawing a settled deployment. */
    live?: boolean
    /** Milliseconds between revealed log lines. */
    interval?: number
    /** Key of the step that failed. */
    failAt?: string
    /** Key of the step a settled deployment is currently on. */
    activeAt?: string
    /** Wall-clock of the whole deployment, when known. */
    totalLabel?: string
    /** Milliseconds already elapsed when the view mounts. */
    seek?: number
    /** Heading on the logs row. */
    label?: string
    /** Draws the logs row. */
    header?: boolean
    /** Offers the per-step copy control. */
    copyable?: boolean
    /** Draws the flush progress bar while the run is in flight. */
    progressBar?: boolean
    /** Draws the view switch and the wall-clock on the logs row. */
    controls?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    steps: () => DEFAULT_DEPLOYMENT_STEPS,
    live: false,
    interval: 200,
    failAt: '',
    activeAt: '',
    totalLabel: '',
    seek: 0,
    label: 'Deployment Logs',
    header: true,
    copyable: true,
    progressBar: true,
    controls: true
  })

  const emit = defineEmits<{
    /** Fires once the live run has finished every step. */
    finished: []
    /** Fires when the live run stops on its failing step. */
    failed: [key: string]
  }>()

  const view = defineModel<DeploymentLogView>('view', { default: 'phased' })

  const tuplesFor = (step: DeploymentStep): DeploymentLogTuple[] => {
    if (step.key !== props.failAt || !step.failLogs?.length) return step.logs
    return step.failLogs.map(([time, message]) => [
      time,
      message,
      message.includes('[ERROR]') ? 'warning' : 'text'
    ])
  }

  const stepList = computed(() => props.steps.map((step) => ({ ...step, logs: tuplesFor(step) })))
  const lastIndex = computed(() => stepList.value.length - 1)
  const failIndex = computed(() =>
    props.failAt ? stepList.value.findIndex((step) => step.key === props.failAt) : -1
  )
  const activeAtIndex = props.activeAt
    ? props.steps.findIndex((step) => step.key === props.activeAt)
    : -1

  const settledIndex = failIndex.value !== -1 ? failIndex.value : activeAtIndex
  const staticStep = settledIndex !== -1 ? settledIndex : lastIndex.value

  const phase = ref<DeploymentPhase>(
    props.live || activeAtIndex !== -1 ? 'running' : failIndex.value !== -1 ? 'failed' : 'finished'
  )
  const settled = computed(() => phase.value !== 'running')
  const activeStep = ref(props.live ? -1 : staticStep)
  const revealed = ref(
    stepList.value.map((step, i) => (props.live || i > staticStep ? 0 : step.logs.length))
  )
  const measured = ref(stepList.value.map(() => 0))
  const openStep = ref<string | null>(props.live ? null : (stepList.value[staticStep]?.key ?? null))

  const totalDuration = stepList.value.reduce((n, step) => n + (step.duration ?? 0), 0)
  const elapsed = ref(props.live ? Math.round(props.seek / 1000) : totalDuration)
  const stepStartedAt = ref(0)

  const timers: ReturnType<typeof globalThis.setTimeout>[] = []
  const after = (ms: number, fn: () => void) => timers.push(globalThis.setTimeout(fn, ms))

  let tick: ReturnType<typeof globalThis.setInterval> | null = null
  let stream: ReturnType<typeof globalThis.setInterval> | null = null

  const clearAll = () => {
    timers.forEach((timer) => globalThis.clearTimeout(timer))
    timers.length = 0
    if (tick) globalThis.clearInterval(tick)
    if (stream) globalThis.clearInterval(stream)
  }

  const stepStatus = (i: number): DeploymentStepStatus => {
    if (phase.value === 'failed') {
      if (i < activeStep.value) return 'done'
      return i === activeStep.value ? 'failed' : 'skipped'
    }
    if (phase.value === 'finished' || i < activeStep.value) return 'done'
    if (i === activeStep.value && phase.value === 'running') return 'running'
    return 'pending'
  }

  const STEP_TAGS: Partial<
    Record<DeploymentStepStatus, { label: string; severity: 'danger' | 'secondary' }>
  > = {
    failed: { label: 'Failed', severity: 'danger' },
    skipped: { label: 'Skipped', severity: 'secondary' }
  }
  const stepTag = (i: number) => STEP_TAGS[stepStatus(i)] ?? null

  const formatDuration = (s: number) => (s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`)

  const durationLabel = (i: number) => {
    const step = stepList.value[i]
    if (!step) return ''
    if (step.durationLabel) return step.durationLabel
    const seconds = props.live ? (measured.value[i] ?? 0) : (step.duration ?? 0)
    return seconds > 0 ? formatDuration(seconds) : ''
  }

  const toLine = ([time, message, type]: DeploymentLogTuple, i: number): LogViewLine => ({
    id: String(i),
    time,
    type:
      type ??
      (message.includes('vulnerabilit')
        ? 'warning'
        : /successfully|finalized/.test(message)
          ? 'success'
          : 'text'),
    message
  })

  const linesByStep = computed(() =>
    stepList.value.map((step, i) => step.logs.slice(0, revealed.value[i]).map(toLine))
  )

  const views = LOG_VIEWS

  const allLines = computed(() =>
    linesByStep.value.flatMap((lines, step) =>
      lines.map((line) => ({ ...line, id: `${step}-${line.id}` }))
    )
  )

  const totalLines = computed(() => stepList.value.reduce((n, step) => n + step.logs.length, 0))
  const progress = computed(() => {
    if (phase.value === 'finished') return 100
    const done = revealed.value.reduce((sum, n) => sum + n, 0)
    return Math.round((done / totalLines.value) * 100)
  })

  const failedTitle = computed(() => stepList.value[failIndex.value]?.title ?? '')

  const elapsedLabel = computed(() => formatDuration(elapsed.value))
  const activeTitle = computed(() => stepList.value[activeStep.value]?.title ?? '')

  const doneCount = computed(
    () => stepList.value.filter((_step, i) => stepStatus(i) === 'done').length
  )
  const progressLabel = computed(() => `${doneCount.value}/${stepList.value.length} steps`)

  const timeLabel = computed(() => {
    if (props.totalLabel) return props.totalLabel
    return props.live || totalDuration > 0 ? elapsedLabel.value : ''
  })

  const outcomeLabel = computed(() => {
    const time = timeLabel.value
    if (phase.value === 'finished') return time ? `Deployed in ${time}` : 'Deployed'
    if (phase.value === 'failed') return time ? `Failed after ${time}` : 'Failed'
    return time
  })

  const failOn = (i: number) => {
    measured.value[i] = Math.max(1, elapsed.value - stepStartedAt.value)
    phase.value = 'failed'
    emit('failed', stepList.value[i]?.key ?? '')
  }

  const runStep = (i: number, from = 0) => {
    const step = stepList.value[i]
    if (!step) return
    activeStep.value = i
    openStep.value = step.key
    stepStartedAt.value = elapsed.value
    revealed.value[i] = from

    stream = globalThis.setInterval(() => {
      if ((revealed.value[i] ?? 0) < step.logs.length) {
        revealed.value[i] = (revealed.value[i] ?? 0) + 1
        return
      }

      if (stream) globalThis.clearInterval(stream)
      stream = null

      if (i === failIndex.value) {
        failOn(i)
        return
      }

      measured.value[i] = Math.max(1, elapsed.value - stepStartedAt.value)

      if (i + 1 < stepList.value.length) {
        after(STEP_GAP_MS, () => runStep(i + 1))
      } else {
        phase.value = 'finished'
        after(500, () => {
          openStep.value = null
        })
        after(2200, () => emit('finished'))
      }
    }, props.interval)
  }

  const resumeFrom = (ms: number) => {
    let remaining = Math.floor(ms / props.interval)

    for (let i = 0; i < stepList.value.length; i++) {
      const step = stepList.value[i]
      if (!step) return
      const count = step.logs.length
      if (remaining < count) {
        runStep(i, remaining)
        return
      }
      revealed.value[i] = count
      measured.value[i] = step.duration ?? 1
      remaining -= count

      if (i === failIndex.value) {
        activeStep.value = i
        openStep.value = step.key
        phase.value = 'failed'
        emit('failed', step.key)
        return
      }
    }

    runStep(lastIndex.value, stepList.value[lastIndex.value]?.logs.length ?? 0)
  }

  onMounted(() => {
    if (!props.live) return
    tick = globalThis.setInterval(() => {
      if (phase.value === 'running') elapsed.value += 1
    }, 1000)
    if (props.seek > 0) resumeFrom(props.seek)
    else runStep(0)
  })

  onBeforeUnmount(clearAll)
</script>

<template>
  <div class="flex w-full flex-col">
    <div
      v-if="header"
      class="flex min-h-12 items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <p
        v-if="label"
        class="shrink-0 text-heading-xxs text-(--text-default)"
      >
        {{ label }}
      </p>

      <div class="ml-auto flex min-w-0 items-center gap-(--spacing-sm)">
        <template v-if="!settled">
          <span class="shrink-0 text-label-sm text-(--text-default)">{{ progressLabel }}</span>
          <span
            v-if="activeTitle"
            class="truncate text-label-sm text-(--text-muted)"
          >
            {{ activeTitle }}
          </span>
        </template>

        <Tag
          v-else-if="phase === 'finished'"
          key="finished"
          label="Completed"
          severity="success"
        />
        <Tag
          v-else
          key="failed"
          :label="failedTitle ? `Failed on ${failedTitle}` : 'Failed'"
          severity="danger"
        />

        <template v-if="controls && settled">
          <span class="text-label-sm text-(--text-muted)">{{ outcomeLabel }}</span>
          <SegmentedButton
            v-model="view"
            :options="views"
            size="medium"
            aria-label="Log view"
          />
        </template>
      </div>
    </div>

    <Accordion
      v-if="view === 'phased'"
      v-model:value="openStep"
      type="single"
      collapsible
    >
      <Accordion.Item
        v-for="(step, i) in stepList"
        :key="step.key"
        :value="step.key"
      >
        <Accordion.Trigger>
          <span class="flex min-h-10 flex-1 items-center gap-(--spacing-sm)">
            <span class="flex size-5 shrink-0 items-center justify-center">
              <i
                v-if="stepStatus(i) === 'done'"
                class="pi pi-check-circle text-(--success-contrast)"
                aria-hidden="true"
              />
              <i
                v-else-if="stepStatus(i) === 'failed'"
                class="pi pi-times-circle text-(--danger-contrast)"
                aria-hidden="true"
              />
              <i
                v-else-if="stepStatus(i) === 'skipped'"
                class="pi pi-minus-circle text-(--text-muted) opacity-60"
                aria-hidden="true"
              />
              <Spinner
                v-else-if="stepStatus(i) === 'running'"
                key="running"
                class="size-4 text-(--text-default)"
              />
              <span
                v-else
                class="size-3.5 rounded-full border border-dashed border-(--border-default)"
              />
            </span>

            <span
              :data-state="stepStatus(i)"
              class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-left data-[state=failed]:flex-wrap"
            >
              <span
                :data-state="stepStatus(i)"
                class="shrink-0 text-label-md text-(--text-default) data-[state=pending]:text-(--text-muted) data-[state=skipped]:text-(--text-muted)"
              >
                {{ step.title }}
              </span>
              <Tag
                v-if="stepTag(i)"
                :label="stepTag(i)?.label"
                :severity="stepTag(i)?.severity"
                size="small"
              />
              <span
                :data-state="stepStatus(i)"
                class="min-w-0 truncate text-body-sm text-(--text-muted) data-[state=failed]:whitespace-normal data-[state=failed]:text-pretty data-[state=failed]:text-(--danger-contrast) data-[state=running]:text-(--text-default)"
              >
                {{ step.description }}
              </span>
            </span>

            <span class="ml-auto flex shrink-0 items-center">
              <span
                v-if="durationLabel(i)"
                class="text-label-code-md text-(--text-muted)"
              >
                {{ durationLabel(i) }}
              </span>
            </span>
          </span>
        </Accordion.Trigger>
        <Accordion.Content>
          <LogView
            :lines="linesByStep[i]"
            :border="false"
            :show-copy="copyable && settled"
            :loading="stepStatus(i) === 'pending'"
            loading-label="Waiting to start…"
          >
            <LogViewContent>
              <template #empty>
                <template v-if="stepStatus(i) === 'skipped'">
                  Never ran — the deployment stopped at
                  {{ failedTitle || 'an earlier step' }}.
                </template>
                <template v-else>No log lines yet.</template>
              </template>
            </LogViewContent>
          </LogView>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>

    <LogView
      v-else
      :lines="allLines"
      :border="false"
      :show-copy="settled"
      :loading="!settled && !allLines.length"
      loading-label="Waiting to start…"
    >
      <LogViewContent>
        <template #empty>No log lines yet.</template>
      </LogViewContent>
    </LogView>

    <ProgressBar
      v-if="progressBar && !settled"
      :value="progress"
      :max="100"
      size="small"
      shape="flat"
      class="w-full"
      aria-label="Deployment progress"
    />
  </div>
</template>
