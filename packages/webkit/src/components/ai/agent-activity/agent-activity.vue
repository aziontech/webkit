<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs, useId, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Spinner from '../../feedback/spinner/spinner.vue'

  defineOptions({
    name: 'AgentActivity',
    inheritAttrs: false
  })

  /** Where a step stands, from the shared status set. */
  export type AgentActivityStatus =
    'pending' | 'running' | 'success' | 'error' | 'canceled' | 'skipped'

  /** One step of the agent's work. */
  export interface AgentActivityStep {
    /** Stable identity of the step. */
    key: string
    /** What the step does in the reader's words (`Searching the docs`). */
    title: string
    /** Where the step stands. */
    status: AgentActivityStatus
    /** A detail under the title, such as the file being read. */
    description?: string
  }

  export interface AgentActivityProps {
    /**
     * The steps of the work, in order: each has a `key`, a `title`, a `status` from the shared
     * status set and an optional `description`. The current step is the first running one, else the
     * first failed one, else the last canceled one of a stopped run, else the last one that is not
     * pending.
     */
    steps?: AgentActivityStep[]
    /** Initial open state of the step list when uncontrolled; collapsed shows only the current step. */
    defaultOpen?: boolean
    /** Accessible name of the activity. Empty uses the locale catalog (`Agent activity`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<AgentActivityProps>(), {
    steps: () => [],
    defaultOpen: false,
    ariaLabel: ''
  })

  /** Controlled open state of the step list. Use with `v-model:open`; while unbound it follows `defaultOpen` and toggles locally. */
  const open = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const { t } = useTranslate({ agentActivity: en.agentActivity })
  const uid = useId()
  const listId = `${uid}-steps`

  const announcement = ref<string>('')
  let timer: ReturnType<typeof setTimeout> | undefined

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'agent-activity'
  )
  const isOpen = computed<boolean>(() => open.value ?? props.defaultOpen)
  const expandable = computed<boolean>(() => props.steps.length > 1)
  const currentIndex = computed<number>(() => {
    const running = props.steps.findIndex((step) => step.status === 'running')
    if (running !== -1) return running
    const failedAt = props.steps.findIndex((step) => step.status === 'error')
    if (failedAt !== -1) return failedAt
    if (props.steps.every((step) => step.status !== 'pending')) {
      const canceledAt = props.steps.findLastIndex((step) => step.status === 'canceled')
      if (canceledAt !== -1) return canceledAt
    }
    const reached = props.steps.findLastIndex((step) => step.status !== 'pending')
    return reached === -1 ? 0 : reached
  })
  const current = computed<AgentActivityStep | undefined>(() => props.steps[currentIndex.value])
  const visibleSteps = computed<{ step: AgentActivityStep; index: number }[]>(() =>
    props.steps
      .map((step, index) => ({ step, index }))
      .filter(({ index }) => isOpen.value || !expandable.value || index === currentIndex.value)
  )
  const failed = computed<AgentActivityStep | undefined>(() =>
    props.steps.find((step) => step.status === 'error')
  )
  const settled = computed<boolean>(
    () =>
      props.steps.length > 0 &&
      !failed.value &&
      props.steps.every((step) => step.status !== 'running' && step.status !== 'pending')
  )
  const stopped = computed<boolean>(
    () => settled.value && props.steps.some((step) => step.status === 'canceled')
  )
  const doneCount = computed<number>(
    () => props.steps.filter((step) => step.status === 'success').length
  )
  const runningKey = computed<string>(() =>
    current.value?.status === 'running' ? `${current.value.key}:${current.value.title}` : ''
  )
  const outcomeKey = computed<string>(
    () =>
      failed.value?.key ??
      (settled.value ? `${stopped.value ? 'stopped' : 'finished'}:${props.steps.length}` : '')
  )

  watch(runningKey, scheduleAnnouncement)
  watch(outcomeKey, announceOutcome)
  onMounted(scheduleAnnouncement)
  onScopeDispose(clearTimer)

  function onClick(): void {
    open.value = !isOpen.value
  }

  function clearTimer(): void {
    if (timer) clearTimeout(timer)
    timer = undefined
  }

  function scheduleAnnouncement(): void {
    clearTimer()
    if (!runningKey.value) return
    const title = current.value?.title ?? ''
    timer = setTimeout(() => {
      announcement.value = title
    }, 1000)
  }

  function announceOutcome(outcome: string): void {
    if (!outcome) return
    announcement.value = failed.value
      ? t('agentActivity.failed', { title: failed.value.title })
      : t(stopped.value ? 'agentActivity.stopped' : 'agentActivity.finished', {
          count: doneCount.value
        })
  }

  const TOGGLE_CLASS =
    'inline-flex min-h-6 w-fit items-center gap-(--spacing-xs) rounded-(--shape-control) text-label-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) pointer-coarse:min-h-11'

  const STEP_TITLE_CLASS =
    'text-start text-body-sm text-(--text-default) wrap-anywhere ' +
    'data-[status=canceled]:text-(--text-muted) data-[status=pending]:text-(--text-muted) data-[status=skipped]:text-(--text-muted)'
</script>

<template>
  <div
    v-bind="$attrs"
    role="group"
    :aria-label="ariaLabel || t('agentActivity.label')"
    :data-testid="testId"
    :data-status="current?.status"
    :data-state="expandable ? (isOpen ? 'open' : 'closed') : undefined"
    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
  >
    <button
      v-if="expandable"
      type="button"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :aria-controls="listId"
      :data-testid="`${testId}__toggle`"
      :class="TOGGLE_CLASS"
      @click="onClick"
    >
      <span
        class="flex w-4 shrink-0 justify-center"
        aria-hidden="true"
      >
        <i
          :data-state="isOpen ? 'open' : 'closed'"
          class="az az-chevron-down text-body-xs transition-transform duration-fast-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-180"
        />
      </span>
      <span>{{ t('agentActivity.steps', { count: steps.length }) }}</span>
    </button>
    <ol
      :id="listId"
      :data-testid="`${testId}__steps`"
      class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
    >
      <li
        v-for="{ step, index } in visibleSteps"
        :key="step.key"
        :aria-current="index === currentIndex ? 'step' : undefined"
        :data-status="step.status"
        :data-testid="`${testId}__step`"
        class="flex min-w-0 items-start gap-(--spacing-xs)"
      >
        <span
          class="flex h-5 w-4 shrink-0 items-center justify-center"
          aria-hidden="true"
        >
          <Spinner
            v-if="step.status === 'running'"
            class="size-3.5 text-(--text-muted)"
          />
          <i
            v-else-if="step.status === 'success'"
            class="az az-circle-check text-(--success-mark)"
          />
          <i
            v-else-if="step.status === 'error'"
            class="az az-circle-x text-(--danger-mark)"
          />
          <i
            v-else-if="step.status === 'canceled'"
            class="az az-circle-stop text-(--text-muted)"
          />
          <i
            v-else-if="step.status === 'skipped'"
            class="az az-circle-minus text-(--text-muted)"
          />
          <span
            v-else
            class="size-3.5 rounded-full border border-dashed border-(--text-muted)"
          />
        </span>
        <span class="flex min-w-0 flex-col">
          <span
            dir="auto"
            :data-status="step.status"
            :class="STEP_TITLE_CLASS"
          >
            {{ step.title }}<span class="sr-only">, {{ t(`agentActivity.${step.status}`) }}</span>
          </span>
          <span
            v-if="step.description"
            dir="auto"
            class="text-start text-body-sm text-(--text-muted) wrap-anywhere"
          >
            {{ step.description }}
          </span>
        </span>
      </li>
    </ol>
    <span
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__status`"
    >
      {{ announcement }}
    </span>
  </div>
</template>
