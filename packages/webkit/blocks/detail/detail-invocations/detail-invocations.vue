<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import LogViewerContent from '@aziontech/webkit/log-viewer-content'
  import LogViewer, { type LogViewerLine } from '@aziontech/webkit/log-viewer-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import Trace, { type TraceSpan } from '@aziontech/webkit/trace'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, ref } from 'vue'

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

  interface PathNode {
    key: string
    eyebrow: string
    icon: string
    title: string
    label: string
    severity: TagSeverity
    spanId: string
    fields: { label: string; value: string }[]
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
  const formatTime = (value: Date) =>
    `${formatDate(value, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
      timeZone: 'UTC'
    })} UTC`

  const formatDuration = (ms: number) =>
    ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`

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
      message: `${entry.level.toUpperCase()} ${entry.message}`
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

  const FOOTER_BAND_CLASS =
    '@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) ' +
    'py-(--spacing-xs)'

  const FLOW_NODE_CARD_CLASS =
    'flex w-full min-w-0 flex-col ' +
    'in-data-[direction=row]:w-(--size-56) ' +
    'rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) transition-colors duration-moderate-01 ease-productive-entrance ' +
    'hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none'
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
        <Card
          v-if="run"
          :padded="false"
        >
          <template #default>
            <div
              class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
            >
              <div
                class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
              >
                <i
                  class="az az-functions shrink-0 text-body-lg text-(--text-muted)"
                  aria-hidden="true"
                />
                <div class="flex min-w-0">
                  <Tooltip
                    :content="`Open ${fn.name} in Functions`"
                    class="w-full"
                  >
                    <Link
                      :label="fn.name"
                      :href="`/functions/${fn.id}`"
                      size="small"
                    />
                  </Tooltip>
                </div>
                <span
                  class="shrink-0 text-(--text-muted)"
                  aria-hidden="true"
                  >/</span
                >
                <span class="truncate text-label-code-sm text-(--text-muted)">{{ run.id }}</span>
                <CopyButton
                  variant="outline"
                  :value="run.id"
                  aria-label="Copy invocation ID"
                  class="shrink-0"
                  size="small"
                />
                <StatusIndicator
                  :severity="severity"
                  :loading="running"
                  :label="run.status"
                  class="shrink-0"
                />
              </div>

              <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
                <Button
                  label="Replay"
                  variant="secondary"
                  size="medium"
                  icon="az az-replay"
                  :disabled="running"
                  @click="replay"
                />

                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="(_event, value) => pickRun(String(value))"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip content="Pick another invocation of this function">
                      <Button
                        label="Recent"
                        variant="outline"
                        size="medium"
                        icon="az az-history"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Group label="Recent invocations">
                    <DropdownMenu.Item
                      v-for="option in runs"
                      :key="option.id"
                      :value="option.id"
                      :label="option.id"
                      :selected="option.id === run.id"
                    >
                      <template #trailing>
                        <span class="text-label-sm text-(--text-muted)">
                          {{ option.status }} · {{ formatTime(option.startedAt) }}
                        </span>
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>

                <DropdownMenu
                  side="bottom"
                  align="end"
                  @select="(event, value) => emit('invocation-action', event, value)"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip content="Invocation actions">
                      <IconButton
                        icon="az az-ellipsis"
                        variant="outline"
                        size="medium"
                        aria-label="Invocation actions"
                      />
                    </Tooltip>
                  </DropdownMenu.Trigger>

                  <DropdownMenu.Group>
                    <DropdownMenu.Item
                      value="events"
                      label="Open in Real-Time Events"
                    >
                      <template #leading>
                        <i
                          class="az az-real-time-events"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      value="settings"
                      label="Function settings"
                    >
                      <template #leading>
                        <i
                          class="az az-settings"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </div>
            </div>

            <div
              class="grid grid-cols-2 gap-(--spacing-sm) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) sm:grid-cols-4"
            >
              <div
                v-for="fact in facts"
                :key="fact.label"
                class="flex min-w-0 flex-col gap-(--spacing-2xs)"
              >
                <span class="text-label-sm text-(--text-muted)">{{ fact.label }}</span>
                <div class="flex min-h-7 min-w-0 items-center">
                  <span class="truncate text-body-sm tabular-nums text-(--text-default)">
                    {{ fact.value }}
                  </span>
                </div>
              </div>
            </div>

            <div :class="FOOTER_BAND_CLASS">
              <div
                class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
              >
                <i
                  :data-severity="severity"
                  class="az az-arrow-right shrink-0 text-(--text-muted) data-[severity=danger]:text-(--danger-foreground)"
                  aria-hidden="true"
                />
                <span class="truncate text-label-code-sm text-(--text-muted)">{{
                  run.trigger
                }}</span>
                <CopyButton
                  variant="outline"
                  :value="run.trigger"
                  aria-label="Copy the request that triggered this invocation"
                  class="shrink-0"
                  size="small"
                />
              </div>
              <span
                :data-severity="severity"
                class="min-w-0 text-body-xs text-(--text-muted) data-[severity=danger]:text-(--danger-foreground)"
              >
                {{ run.outcome }}
              </span>
            </div>
          </template>
        </Card>

        <section
          v-if="run"
          aria-label="Request path"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <Subheader
            title="Request path"
            description="The resources this invocation travelled, and the time it spent in each one."
            size="small"
          />
          <div
            class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
          >
            <FlowDiagram
              align="start"
              aria-label="Request path"
            >
              <FlowDiagram.Node
                v-for="node in path"
                :key="node.key"
                unstyled
                :terminal="node.key === 'origin'"
              >
                <div :class="FLOW_NODE_CARD_CLASS">
                  <FlowDiagram.Anchor>
                    <div
                      class="flex w-full items-center gap-(--spacing-2xs) px-(--spacing-md) pt-(--spacing-sm) pb-(--spacing-2xs)"
                    >
                      <i
                        :class="node.icon"
                        aria-hidden="true"
                        class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                      />
                      <span class="truncate text-label-sm text-(--text-muted)">{{
                        node.eyebrow
                      }}</span>
                      <span class="ms-auto flex shrink-0">
                        <Tag
                          :severity="node.severity"
                          :label="node.label"
                          size="small"
                        />
                      </span>
                    </div>
                  </FlowDiagram.Anchor>
                  <div
                    class="flex min-h-8 min-w-0 items-center gap-(--spacing-xs) px-(--spacing-md) pb-(--spacing-sm)"
                  >
                    <span class="min-w-0 truncate text-label-sm text-(--text-default)">{{
                      node.title
                    }}</span>
                    <span
                      v-if="node.spanId"
                      class="ms-auto flex shrink-0 items-center"
                    >
                      <Tooltip :content="`Show ${node.title} in the trace`">
                        <IconButton
                          icon="az az-align-left"
                          variant="outline"
                          size="small"
                          :aria-label="`Show ${node.title} in the trace`"
                          @click="showSpan(node.spanId)"
                        />
                      </Tooltip>
                    </span>
                  </div>
                  <dl
                    class="m-0 flex flex-col gap-(--spacing-sm) border-t border-(--border-muted) p-(--spacing-md)"
                  >
                    <div
                      v-for="field in node.fields"
                      :key="field.label"
                      class="flex min-w-0 flex-col gap-(--spacing-2xs)"
                    >
                      <dt class="text-label-sm text-(--text-muted)">{{ field.label }}</dt>
                      <dd class="m-0 truncate text-body-xs text-(--text-default)">
                        {{ field.value }}
                      </dd>
                    </div>
                  </dl>
                </div>
              </FlowDiagram.Node>
            </FlowDiagram>
          </div>
        </section>

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
