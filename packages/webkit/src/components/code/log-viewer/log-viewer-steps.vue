<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import Accordion from '../../content/accordion/index'
  import Progress from '../../feedback/progress/progress.vue'
  import Spinner from '../../feedback/spinner/spinner.vue'
  import type {
    LogViewerLine,
    LogViewerStep,
    LogViewerStepStatus,
    LogViewerStepsView
  } from './injection-key'
  import LogViewer from './log-viewer.vue'
  import LogViewerContent from './log-viewer-content.vue'

  defineOptions({
    name: 'LogViewerSteps',
    inheritAttrs: false
  })

  export interface LogViewerStepsProps {
    /** The steps of the run, in order, each with its own log lines. */
    steps?: LogViewerStep[]
    /** Shows the copy control on each step's log and on the complete log. */
    copyable?: boolean
    /** Shows the Phased or Complete switch at the end of the toolbar row. */
    viewSwitch?: boolean
    /** Shows a flush progress bar on the bottom edge, valued by the share of steps done. */
    progress?: boolean
  }

  const props = withDefaults(defineProps<LogViewerStepsProps>(), {
    steps: () => [],
    copyable: true,
    viewSwitch: true,
    progress: false
  })

  /** Phased shows one collapsible log per step; complete shows every line in one log. */
  const view = defineModel<LogViewerStepsView>('view', { default: 'phased' })
  /** Key of the open step; unbound, the running step opens, else the failed one. */
  const openStep = defineModel<string | undefined>('openStep', { default: undefined })

  const slots = defineSlots<{
    /** Start of the toolbar row: the run's title, outcome and time. */
    header(): unknown
    /** Beside a step's title, such as an outcome Tag. */
    'step-meta'(props: { step: LogViewerStep }): unknown
    /** Replaces the empty state of a step with no line. */
    'step-empty'(props: { step: LogViewerStep }): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ logViewer: en.logViewer })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'log-viewer-steps')

  const statusLabels = computed<Record<LogViewerStepStatus, string>>(() => ({
    success: t('logViewer.stepDone'),
    error: t('logViewer.stepFailed'),
    skipped: t('logViewer.stepSkipped'),
    running: t('logViewer.stepRunning'),
    pending: t('logViewer.stepPending')
  }))

  const views = computed(() => [
    { label: t('logViewer.stepsPhased'), value: 'phased' },
    { label: t('logViewer.stepsComplete'), value: 'complete' }
  ])

  const autoOpen = computed(
    () =>
      (
        props.steps.find((step) => step.status === 'running') ??
        props.steps.find((step) => step.status === 'error')
      )?.id ?? ''
  )

  const expanded = computed<string>({
    get: () => openStep.value ?? autoOpen.value,
    set: (next) => {
      openStep.value = next
    }
  })

  const completeLines = computed<LogViewerLine[]>(() =>
    props.steps.flatMap((step) =>
      step.lines.map((line) => ({ ...line, id: `${step.id}-${line.id}` }))
    )
  )

  const percent = computed(() => {
    if (!props.steps.length) return 0
    const done = props.steps.filter((step) => step.status === 'success').length
    return Math.round((done / props.steps.length) * 100)
  })

  const hasToolbar = () => Boolean(slots.header) || props.viewSwitch

  const onAccordion = (next: unknown) => {
    expanded.value = typeof next === 'string' ? next : ''
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-view="view"
    class="flex w-full min-w-0 flex-col"
  >
    <div
      v-if="hasToolbar()"
      :data-testid="`${testId}__toolbar`"
      class="flex min-h-12 flex-wrap items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
    >
      <div class="flex min-w-0 flex-1 flex-wrap items-center gap-(--spacing-sm)">
        <slot name="header" />
      </div>
      <ToggleGroup
        v-if="viewSwitch"
        v-model="view"
        :options="views"
        size="medium"
        :aria-label="t('logViewer.stepsView')"
        :data-testid="`${testId}__view-switch`"
        class="ms-auto shrink-0"
      />
    </div>

    <Accordion
      v-if="view === 'phased'"
      :model-value="expanded"
      type="single"
      collapsible
      @update:model-value="onAccordion"
    >
      <Accordion.Item
        v-for="step in steps"
        :key="step.id"
        :value="step.id"
        :data-testid="`${testId}__step`"
        :data-status="step.status"
      >
        <Accordion.Trigger>
          <span class="flex min-h-10 min-w-0 flex-1 items-center gap-(--spacing-sm)">
            <span
              class="flex size-5 shrink-0 items-center justify-center"
              aria-hidden="true"
            >
              <i
                v-if="step.status === 'success'"
                class="az az-circle-check text-(--success-foreground)"
              />
              <i
                v-else-if="step.status === 'error'"
                class="az az-circle-x text-(--danger-foreground)"
              />
              <i
                v-else-if="step.status === 'skipped'"
                class="az az-circle-minus text-(--text-muted)"
              />
              <Spinner v-else-if="step.status === 'running'" />
              <span
                v-else
                class="size-3.5 rounded-full border border-dashed border-(--border-default)"
              />
            </span>
            <span class="sr-only">{{ statusLabels[step.status] }}</span>
            <span
              :data-status="step.status"
              class="flex min-w-0 flex-1 items-baseline gap-(--spacing-xs) text-start data-[status=error]:flex-wrap"
            >
              <span
                :data-status="step.status"
                class="shrink-0 text-label-md text-(--text-default) data-[status=pending]:text-(--text-muted) data-[status=skipped]:text-(--text-muted)"
              >
                {{ step.title }}
              </span>
              <slot
                name="step-meta"
                :step="step"
              />
              <span
                v-if="step.description"
                :data-status="step.status"
                class="min-w-0 truncate text-body-sm text-(--text-muted) data-[status=error]:whitespace-normal data-[status=error]:text-pretty data-[status=error]:text-(--danger-foreground) data-[status=running]:motion-safe:bg-[linear-gradient(90deg,var(--text-muted)_0%,var(--text-muted)_35%,var(--text-default)_50%,var(--text-muted)_65%,var(--text-muted)_100%)] data-[status=running]:motion-safe:bg-[length:200%_100%] data-[status=running]:motion-safe:bg-clip-text data-[status=running]:motion-safe:text-transparent data-[status=running]:motion-safe:animate-shimmer motion-reduce:animate-none"
              >
                {{ step.description }}
              </span>
            </span>
            <span
              v-if="step.duration"
              class="ms-auto shrink-0 text-label-code-md text-(--text-muted)"
            >
              {{ step.duration }}
            </span>
          </span>
        </Accordion.Trigger>
        <Accordion.Content :padded="false">
          <LogViewer
            :lines="step.lines"
            :bordered="false"
            :copyable="copyable"
            :loading="step.status === 'pending'"
            :loading-label="t('logViewer.stepsWaiting')"
            :data-testid="`${testId}__step-log`"
          >
            <LogViewerContent>
              <template
                v-if="slots['step-empty'] || step.status === 'skipped'"
                #empty
              >
                <slot
                  name="step-empty"
                  :step="step"
                  >{{ t('logViewer.stepsNeverRan') }}</slot
                >
              </template>
            </LogViewerContent>
          </LogViewer>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>

    <LogViewer
      v-else
      :lines="completeLines"
      :bordered="false"
      :copyable="copyable"
      :data-testid="`${testId}__complete`"
    >
      <LogViewerContent />
    </LogViewer>

    <Progress
      v-if="progress"
      :value="percent"
      size="small"
      variant="flat"
      :aria-label="t('logViewer.stepsProgress')"
      :data-testid="`${testId}__progress`"
      class="w-full"
    />
  </div>
</template>
