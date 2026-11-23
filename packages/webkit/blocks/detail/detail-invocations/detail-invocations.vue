<script setup lang="ts">
  import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import LogViewerContent from '@aziontech/webkit/log-viewer-content'
  import LogViewer, { type LogViewerLine } from '@aziontech/webkit/log-viewer-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'
  import Trace, { type TraceSpan } from '@aziontech/webkit/trace'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, ref } from 'vue'

  import {
    formatInvocationDuration as formatDuration,
    formatInvocationTime
  } from './invocations-format'
  import InvocationRequestPath, {
    type InvocationPathNode as PathNode
  } from './parts/invocation-request-path.vue'
  import InvocationSummaryCard from './parts/invocation-summary-card.vue'
  import { sampleFunction, sampleInvocations } from './sample'

  /** How an invocation ended, or that it is still running. */
  export type InvocationsStatus = 'Completed' | 'Failed' | 'Running'

  /** The level of a log line. */
  export type InvocationsLogLevel = 'debug' | 'info' | 'warn' | 'error'

  /** One line the function printed. */
  export interface InvocationsLog {
    /** Milliseconds since the invocation started. */
    at: number
    /** The log level, printed before the message. */
    level: InvocationsLogLevel
    /** What was printed. */
    message: string
  }

  /** One run of the function. */
  export interface InvocationsInvocation {
    /** The invocation ID, shown in the subject band and the Recent menu. */
    id: string
    /** How it ended, or Running. */
    status: InvocationsStatus
    /** When it started. */
    startedAt: Date
    /** When it ended; null while it runs. */
    completedAt: Date | null
    /** Milliseconds it took, or has taken so far. */
    duration: number
    /** Where it ran, e.g. a city and country. */
    location: string
    /** The request that triggered it, method and URL. */
    trigger: string
    /** One sentence on what it answered. */
    outcome: string
    /** What the function printed, in order. */
    logs: InvocationsLog[]
    /** The trace spans; the root span is the function, origin the origin fetch. */
    spans: TraceSpan[]
  }

  /** The function and the path its requests take. */
  export interface InvocationsFunction {
    /** The function ID, used in its link. */
    id: string
    /** The function name. */
    name: string
    /** Its runtime, e.g. JavaScript. */
    runtime: string
    /** The service that received the request. */
    service: string
    /** The address the service answers on. */
    serviceAddress: string
    /** The resource whose rule ran the function. */
    resource: string
    /** The rule that matched. */
    rule: string
    /** The phase the rule runs in. */
    phase: string
    /** The origin the function fetches from. */
    origin: string
    /** The origin host. */
    originHost: string
  }

  export interface InvocationsProps {
    /** The function and its request path. Left out, the sample renders. */
    edgeFunction?: InvocationsFunction
    /** Recent invocations, newest first; the Recent menu lists them. Left out, the sample renders. */
    invocations?: InvocationsInvocation[]
  }

  const props = withDefaults(defineProps<InvocationsProps>(), {
    edgeFunction: undefined,
    invocations: undefined
  })

  const emit = defineEmits<{
    replay: [event: MouseEvent, invocation: InvocationsInvocation]
    'invocation-action': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuItemValue
    ]
  }>()

  const invocationId = defineModel<string>('invocation', { default: '' })
  const selectedSpan = defineModel<string>('span', { default: '' })

  const fn = computed<InvocationsFunction>(() => props.edgeFunction ?? sampleFunction)
  const runs = computed<InvocationsInvocation[]>(() => props.invocations ?? sampleInvocations)

  const severities: Record<InvocationsStatus, StatusIndicatorSeverity> = {
    Completed: 'success',
    Failed: 'danger',
    Running: 'warning'
  }

  const { formatDate } = useLocale()
  const formatTime = (value: Date) => formatInvocationTime(formatDate, value)

  const run = computed<InvocationsInvocation | undefined>(
    () => runs.value.find((entry) => entry.id === invocationId.value) ?? runs.value[0]
  )
  const severity = computed(() => severities[run.value?.status ?? 'Running'])
  const running = computed(() => run.value?.status === 'Running')
  const facts = computed(() =>
    run.value
      ? [
          { label: 'Started', value: formatTime(run.value.startedAt) },
          {
            label: 'Completed',
            value: run.value.completedAt ? formatTime(run.value.completedAt) : 'Not yet'
          },
          { label: 'Duration', value: formatDuration(run.value.duration) },
          { label: 'Location', value: run.value.location }
        ]
      : []
  )

  const spanTime = (id: string) => {
    const span = run.value?.spans.find((entry) => entry.id === id)
    return span ? formatDuration(span.duration) : 'Not reached'
  }
  const path = computed<PathNode[]>(() => {
    const failed = run.value?.status === 'Failed'
    return [
      {
        key: 'service',
        eyebrow: 'Service',
        icon: 'az az-globe',
        title: fn.value.service,
        label: 'Live',
        severity: 'success',
        spanId: '',
        fields: [
          { label: 'Address', value: fn.value.serviceAddress },
          { label: 'Location', value: run.value?.location ?? '' }
        ]
      },
      {
        key: 'resource',
        eyebrow: 'Resource',
        icon: 'az az-box',
        title: fn.value.resource,
        label: 'Active',
        severity: 'success',
        spanId: '',
        fields: [
          { label: 'Matched rule', value: fn.value.rule },
          { label: 'Phase', value: fn.value.phase }
        ]
      },
      {
        key: 'function',
        eyebrow: 'Function',
        icon: 'az az-functions',
        title: fn.value.name,
        label: failed ? 'Failed' : running.value ? 'Running' : 'Active',
        severity: failed ? 'danger' : running.value ? 'warning' : 'success',
        spanId: 'root',
        fields: [
          { label: 'Runtime', value: fn.value.runtime },
          { label: 'Time in function', value: spanTime('root') }
        ]
      },
      {
        key: 'origin',
        eyebrow: 'Origin',
        icon: 'az az-server',
        title: fn.value.origin,
        label: failed ? 'Timed out' : running.value ? 'Waiting' : 'Answered',
        severity: failed ? 'danger' : running.value ? 'warning' : 'success',
        spanId: 'origin',
        fields: [
          { label: 'Host', value: fn.value.originHost },
          { label: 'Time at origin', value: spanTime('origin') }
        ]
      }
    ]
  })

  const lines = computed<LogViewerLine[]>(() => {
    const current = run.value
    if (!current) return []
    return current.logs.map((entry, index) => ({
      id: `${current.id}-${index}`,
      time: `+${formatDuration(entry.at)}`,
      type:
        index === current.logs.length - 1 && current.status === 'Completed' ? 'success' : 'text',
      level: entry.level,
      message: entry.message
    }))
  })

  const traceEl = ref<HTMLElement | null>(null)
  const showSpan = async (spanId: string) => {
    selectedSpan.value = spanId
    await nextTick()
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    traceEl.value?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  const pickRun = (id: string) => {
    invocationId.value = id
    selectedSpan.value = ''
  }

  const replay = (event: MouseEvent) => {
    if (run.value) emit('replay', event, run.value)
  }
</script>

<template>
  <div class="layout-boundary flex min-h-0 w-full flex-1 flex-col">
    <div class="layout-column flex min-w-0 flex-col pb-(--layout-section-gap)">
      <PageHeader
        title="Invocation"
        description="One run of this function, end to end: the path the request took and what each step cost."
        size="medium"
      />

      <div class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <InvocationSummaryCard
          v-if="run"
          :run="run"
          :fn="fn"
          :runs="runs"
          :severity="severity"
          :running="running"
          :facts="facts"
          @replay="replay"
          @pick="pickRun"
          @invocation-action="(event, value) => emit('invocation-action', event, value)"
        />

        <InvocationRequestPath
          v-if="run"
          :path="path"
          @show-span="showSpan"
        />

        <section
          v-if="run"
          ref="traceEl"
          aria-label="Trace"
          class="flex min-w-0 scroll-mt-(--spacing-lg) flex-col gap-(--layout-group-gap)"
        >
          <Subheader
            title="Trace"
            description="One row per span, placed against the run's own clock. Select a row to read what it measured."
            size="small"
          />
          <Trace
            :key="run.id"
            v-model:selected-key="selectedSpan"
            :spans="run.spans"
            :aria-label="`Trace of ${run.id}`"
          />
        </section>

        <section
          v-if="run"
          aria-label="Logs"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <Subheader
            title="Logs"
            description="What the function printed while it ran, on the same clock as the trace."
            size="small"
          >
            <template
              v-if="running"
              #actions
            >
              <StatusIndicator
                severity="warning"
                loading
                label="Streaming"
              />
            </template>
          </Subheader>
          <LogViewer
            :lines="lines"
            :loading="running && !lines.length"
            loading-label="Waiting for the function to finish…"
            copyable
          >
            <LogViewerContent>
              <template #empty>No log lines yet.</template>
            </LogViewerContent>
          </LogViewer>
        </section>
      </div>
    </div>
  </div>
</template>
