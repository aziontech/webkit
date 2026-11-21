# DetailInvocations (`detail/detail-invocations`)

> The Invocation page of one function run, as a page body for ConsoleLayout: one run end to end. A `PageHeader` titled Invocation opens on the invocation summary `Card` (the function `Link`, the copyable invocation ID with its `StatusIndicator`, Replay, the Recent switcher, an outlined `Button` whose `DropdownMenu` picks another invocation, the Invocation actions menu with Open in Real-Time Events and Function settings, the Started, Completed, Duration and Location facts, and the triggering request with its outcome). Below it the Request path is a `FlowDiagram` with one node per hop (service, resource, function, origin), each with its `Tag`, its facts and the time spent there; a node's `IconButton` selects its span in the `Trace` waterfall and scrolls it into view. The `LogViewer` lists what the function printed, timed on the same clock as the trace. The Error variant opens on a run the origin timed out, with the failing span selected; Running shows a run still in progress, its spans running and the lines printed so far under a Streaming indicator. Built from `PageHeader`, `Card`, `Tooltip`, `CopyButton`, `StatusIndicator`, `Button`, `DropdownMenu`, `IconButton`, `Link`, `Subheader`, `FlowDiagram`, `Tag`, `Trace`, `LogViewer` and `LogViewerContent`; Replay emits `replay`, which the page reports through `toast`.

- Surface: app
- Source: `blocks/detail/detail-invocations/detail-invocations.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-invocations")`
- Components: [Button](../../components/button.md), [Card](../../components/card.md), [CopyButton](../../components/copy-button.md), [DropdownMenu](../../components/dropdown-menu.md), [FlowDiagram](../../components/flow-diagram.md), [IconButton](../../components/icon-button.md), [Link](../../components/link.md), `LogViewerContent`, [LogViewer](../../components/log-viewer.md), [PageHeader](../../components/page-header.md), [StatusIndicator](../../components/status-indicator.md), [Subheader](../../components/subheader.md), [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md), [Trace](../../components/trace.md), `use-locale`
- Skills: `webkit-layout`, `webkit-ui-states`, `webkit-data-viz`

## Asked as

function invocations; invocation detail; function run; request path; trace waterfall; function logs; replay invocation; invocações da função; detalhe da invocação; execução da função; caminho da requisição; rastreamento; one invocation; invocation summary; function invocation; invocação de função

The page a user opens to understand one run of a function: did it work, how long did it take, where did the time go, and what did the code print. It reads top to bottom from the answer to the evidence: the invocation summary, the path the request travelled, the trace that measured each step, and the logs on the same clock. It is a page body for `ConsoleLayout`: the layout owns the rail, the header with the breadcrumb (Functions › the function › Invocations) and the `main`.

## When to use

- Use invocations for one function run end to end (summary, trace, logs).
- A function has run and the user needs one invocation end to end: its status, duration, request and outcome.
- The user arrives from a function's list of runs, from an alert, or from a failed request in an event log.
- Several services touch the request and the user must see which hop spent the time or failed.

## When not to use

- Testing code you are still editing: use the TestRun variant of `edit/edit-function`.
- Searching many requests or events across products: use an event log table, e.g. `view/view-table`.
- The overview of the function itself, its versions or deployments: use `detail/detail-resource`.
- Following a deployment as it builds: use `detail/detail-deployment-logs`.

## Building blocks

### A. Page heading — `PageHeader` (required)

A medium `PageHeader` titled Invocation, singular because the page is one run, with one sentence on what the page shows. The list of runs is the Recent switcher on this page, and the full list lives in Real-Time Events. The function is in the breadcrumb, never repeated as a heading.

### B. Invocation summary — `Card`, `Link`, `Tooltip`, `CopyButton`, `StatusIndicator`, `Button`, `DropdownMenu`, `IconButton` (required)

`Card :padded="false"` with three bands. The subject band holds the function `Link` (its `Tooltip` says where it goes), the invocation ID in code type with a `CopyButton`, and the run's `StatusIndicator` (loading while it runs); then Replay as a secondary `Button` (disabled while the run is still going), the Recent switcher, an outlined medium `Button` with the history glyph inside `DropdownMenu.Trigger` (its `Tooltip` inside the trigger, like the actions menu) that opens a `DropdownMenu` of the recent invocations with their status and start that swaps the page to the picked run, and the Invocation actions `IconButton` menu with Open in Real-Time Events and Function settings. The facts band lists Started, Completed, Duration and Location. The state band, on the canvas fill, shows the request that triggered the run with a `CopyButton` and its outcome, in danger color when it failed.

### C. Request path — `Subheader`, `FlowDiagram`, `Tag` (required)

A small `Subheader`, then a horizontally scrolling surface holding a `FlowDiagram` with one unstyled `FlowDiagram.Node` per hop: service, resource, function and origin, the last one `terminal`. Each node card has an eyebrow with its glyph and a status `Tag`, its name, and a short list of facts ending on the time spent there. A node measured by a span carries an outlined small `IconButton` named "Show <name> in the trace" that selects that span and scrolls the trace into view, honoring reduced motion.

### D. Trace — `Trace` (required)

A small `Subheader` over the `Trace` waterfall of the run, its spans nested by `parentId` with a service word and glyph, bound with `v-model:selected-key` so a node of the request path and a row of the waterfall are one selection. A failed span carries `status: 'error'` and its `message`; a span still going carries `status: 'running'`.

### E. Logs — `Subheader`, `StatusIndicator`, `LogViewer`, `LogViewerContent` (required)

A small `Subheader` over a copyable `LogViewer` whose lines are timed from the run's zero (+16 ms), the same clock as the trace. Warnings and errors use the warning line type and keep the level word in the message; the last line of a completed run is a success line. While the run is going the lines printed so far stay on screen and a loading `StatusIndicator` reading Streaming sits in the section header; the view shows its own loading state only while no line has arrived yet, and `LogViewerContent` holds the empty text.

## Data

The block takes the function and its recent invocations through props, owns the open invocation and the selected span as models, and emits its actions; it fetches nothing. `InvocationsFunction`, `InvocationsInvocation`, `InvocationsLog` and `InvocationsProps` are exported from `detail-invocations.vue`, and `sample.ts` holds the sample function and runs the block renders when they are left out.

| Prop / model         | Type                      | What it does                                                                                       |
| -------------------- | ------------------------- | -------------------------------------------------------------------------------------------------- |
| `edgeFunction`       | `InvocationsFunction`     | The function (name, ID, runtime) and the path its requests take (service, resource, rule, origin). |
| `invocations`        | `InvocationsInvocation[]` | Recent runs, newest first: their status, times, request, outcome, logs and trace spans.            |
| `v-model:invocation` | `string`                  | The ID of the open run; empty opens the first. Picking one in Recent updates it.                   |
| `v-model:span`       | `string`                  | The selected trace span; empty selects none. A request path node's jump sets it.                   |

| Event               | Payload               | When                                                                   |
| ------------------- | --------------------- | ---------------------------------------------------------------------- |
| `replay`            | `(event, invocation)` | Replay; the page starts the run and reports it through `toast`.        |
| `invocation-action` | `(event, value)`      | Open in Real-Time Events (`events`) or Function settings (`settings`). |

To go live, render the block from a page that owns the request and the route:

```vue
<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'

  import DetailInvocations, { type InvocationsInvocation } from './detail-invocations.vue'

  const route = useRoute()
  const { fn, invocations } = useInvocations(route.params.functionId)
  const open = ref(String(route.params.invocationId ?? ''))
  const replay = async (_event: MouseEvent, invocation: InvocationsInvocation) => {
    const next = await replayInvocation(invocation.id)
    toast.info(`Replaying ${invocation.id}`)
    open.value = next.id
  }
</script>

<template>
  <DetailInvocations
    v-if="fn && invocations"
    v-model:invocation="open"
    :edge-function="fn"
    :invocations="invocations"
    @replay="replay"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Lead with the outcome: the status and the outcome line come before any chart.
- Keep one clock for the trace and the logs, so a line and a span can be read against each other.
- Let a request path node jump to its span; never make the user search the waterfall for it.
- Keep the run switcher in the summary, so the user moves between invocations without leaving the page.
- Disable Replay while a run is still going; Replay emits `replay` and the page reports it through `toast`.

## Don't

- Don't color the outcome without words; the status and the outcome sentence carry the meaning.
- Don't put Replay or the run switcher in the page heading.
- Don't scroll smoothly when the user prefers reduced motion.
- Don't show raw stack traces in the summary; they belong in the failing span and the logs.

## Copy

- **Heading:** "Invocation", with "One run of this function, end to end: the path the request took and what each step cost."
- **Facts:** "Started", "Completed" ("Not yet" while running), "Duration", "Location".
- **Durations:** milliseconds under a second ("412 ms"), seconds with two decimals above ("1.24 s"); log times relative ("+16 ms").
- **Outcome:** the status code and one sentence, e.g. "502, the origin did not answer within the 1 s budget."
- **Node actions:** "Show <name> in the trace".
- **Menu:** "Open in Real-Time Events", "Function settings"; switcher "Recent", group "Recent invocations".
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- The body renders no landmark of its own; the Request path, Trace and Logs are sections named by their headings.
- The invocation ID and the request each have a `CopyButton` with an `aria-label` that names what is copied.
- Status uses `StatusIndicator` and `Tag` with words, never color alone; decorative glyphs are `aria-hidden`.
- The request path node facts are a description list; each jump `IconButton` has an `aria-label` and a matching `Tooltip`.
- The trace is the `Trace` grid, named "Trace of <id>", operable with the keyboard; selecting from the path moves its selection, and the scroll respects `prefers-reduced-motion`.

## States

- Completed: the open invocation (`invocation`, the first by default) is a run that served its response, every node tagged Active or Answered, the trace with no error and the logs ending on a success line.
- Error: the open invocation (`invocation="inv_7d41be02"`, `span="response"`) is a run the origin timed out, the danger status and outcome, the function and origin nodes failed, the origin-response span selected with its message, and warning lines in the logs.
- Running: the open invocation (`invocation="inv_6a90c3f7"`) is a run in progress, the loading status, Replay disabled, Completed reading Not yet, running spans, and the lines printed so far with a Streaming indicator in the Logs header.

## Related

- `edit/edit-function` — its TestRun variant runs the function before it ships, with the same trace and logs.
- `detail/detail-resource` — the overview of the function; this page owns the invocation summary card.
- `detail/detail-deployment-logs` — the step logs of a deployment.
- `shell/shell-console` — the `ConsoleLayout` this page body renders in; see `skills/webkit-layout`.

## Variants

- `Completed` — primary (the code below)
- `Error` — A run the origin timed out: the danger status, the outcome in danger color, the function and origin nodes tagged Failed and Timed out, the failing origin-response span selected in the trace with its message, and the warning lines in the logs.
- `Running` — A run still in progress: a loading Running status, Replay disabled, Completed reading Not yet, the function and origin nodes tagged Running and Waiting, the spans running in the trace and the lines printed so far kept on screen, with a loading Streaming `StatusIndicator` in the Logs header.

Each variant is the same screen in another state: `get_block("detail/detail-invocations", { variant })`, or the file under `blocks/detail/detail-invocations/variants/`.

## Code (`Completed`)

```vue
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
```

## `sample.ts`

```ts
import type { InvocationsFunction, InvocationsInvocation } from './detail-invocations.vue'

export const sampleFunction: InvocationsFunction = {
  id: '40122',
  name: 'image-resizer',
  runtime: 'JavaScript',
  service: 'storefront-prod',
  serviceAddress: 'storefront.example.com',
  resource: 'storefront',
  rule: 'Optimize images',
  phase: 'Request',
  origin: 'origin-assets',
  originHost: 'assets.example.com'
}

export const sampleInvocations: InvocationsInvocation[] = [
  {
    id: 'inv_8f2c1a9d',
    status: 'Completed',
    startedAt: new Date(Date.UTC(2026, 10, 12, 14, 2, 11)),
    completedAt: new Date(Date.UTC(2026, 10, 12, 14, 2, 11)),
    duration: 412,
    location: 'San Francisco, US',
    trigger: 'GET https://images.example.com/hero-4k.jpg?format=avif',
    outcome: '200 OK, served from the transform, then written to cache.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started: GET /hero-4k.jpg?format=avif' },
      { at: 4, level: 'debug', message: 'args { defaultFormat: "avif", quality: 80 }' },
      { at: 16, level: 'info', message: 'Cache miss, fetching assets.example.com' },
      { at: 61, level: 'debug', message: 'TLS 1.3 established, cipher TLS_AES_128_GCM_SHA256' },
      { at: 202, level: 'info', message: 'Origin answered 200, image/jpeg, 2.4 MB' },
      { at: 256, level: 'debug', message: 'Decoded 3840x2160, re-encoding to avif q80' },
      { at: 348, level: 'info', message: 'Encoded 412 KB, 83% smaller' },
      { at: 386, level: 'info', message: 'Cached for 86400 s' },
      { at: 412, level: 'info', message: 'Invocation completed with 200' }
    ],
    spans: [
      {
        id: 'root',
        name: 'image-resizer',
        service: 'Function',
        icon: 'az az-functions',
        start: 0,
        duration: 412
      },
      {
        id: 'parse',
        parentId: 'root',
        name: 'parse-request',
        service: 'Compute',
        icon: 'az az-code',
        start: 4,
        duration: 12
      },
      {
        id: 'origin',
        parentId: 'root',
        name: 'fetch-origin',
        service: 'Network',
        icon: 'az az-send',
        start: 16,
        duration: 186
      },
      {
        id: 'dns',
        parentId: 'origin',
        name: 'dns-lookup',
        service: 'Network',
        icon: 'az az-send',
        start: 16,
        duration: 14
      },
      {
        id: 'tls',
        parentId: 'origin',
        name: 'tls-handshake',
        service: 'Security',
        icon: 'az az-lock',
        start: 30,
        duration: 31
      },
      {
        id: 'response',
        parentId: 'origin',
        name: 'origin-response',
        service: 'Network',
        icon: 'az az-send',
        start: 61,
        duration: 141
      },
      {
        id: 'decode',
        parentId: 'root',
        name: 'decode',
        service: 'Compute',
        icon: 'az az-code',
        start: 202,
        duration: 54
      },
      {
        id: 'transform',
        parentId: 'root',
        name: 'transform',
        service: 'Compute',
        icon: 'az az-code',
        start: 256,
        duration: 92
      },
      {
        id: 'cache',
        parentId: 'root',
        name: 'put-cache',
        service: 'Storage',
        icon: 'az az-object-storage',
        start: 348,
        duration: 38
      }
    ]
  },
  {
    id: 'inv_7d41be02',
    status: 'Failed',
    startedAt: new Date(Date.UTC(2026, 10, 12, 13, 50, 27)),
    completedAt: new Date(Date.UTC(2026, 10, 12, 13, 50, 28)),
    duration: 1240,
    location: 'Chicago, US',
    trigger: 'GET https://images.example.com/gallery-12.jpg?format=webp',
    outcome: '502, the origin did not answer within the 1 s budget.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started: GET /gallery-12.jpg?format=webp' },
      { at: 4, level: 'debug', message: 'args { defaultFormat: "webp", quality: 80 }' },
      { at: 15, level: 'info', message: 'Cache miss, fetching assets.example.com' },
      { at: 61, level: 'debug', message: 'TLS 1.3 established, waiting on response headers' },
      { at: 1061, level: 'warn', message: 'Origin silent for 1000 ms, read budget exhausted' },
      { at: 1216, level: 'error', message: 'ConnectionTimeout: read timed out after 1000 ms' },
      { at: 1240, level: 'error', message: 'Invocation failed with 502' }
    ],
    spans: [
      {
        id: 'root',
        name: 'image-resizer',
        service: 'Function',
        icon: 'az az-functions',
        start: 0,
        duration: 1240,
        status: 'error'
      },
      {
        id: 'parse',
        parentId: 'root',
        name: 'parse-request',
        service: 'Compute',
        icon: 'az az-code',
        start: 4,
        duration: 11
      },
      {
        id: 'origin',
        parentId: 'root',
        name: 'fetch-origin',
        service: 'Network',
        icon: 'az az-send',
        start: 15,
        duration: 1201,
        status: 'error'
      },
      {
        id: 'dns',
        parentId: 'origin',
        name: 'dns-lookup',
        service: 'Network',
        icon: 'az az-send',
        start: 15,
        duration: 12
      },
      {
        id: 'tls',
        parentId: 'origin',
        name: 'tls-handshake',
        service: 'Security',
        icon: 'az az-lock',
        start: 27,
        duration: 34
      },
      {
        id: 'response',
        parentId: 'origin',
        name: 'origin-response',
        service: 'Network',
        icon: 'az az-send',
        start: 61,
        duration: 1155,
        status: 'error',
        message: 'Read timed out after 1000 ms.'
      }
    ]
  },
  {
    id: 'inv_6a90c3f7',
    status: 'Running',
    startedAt: new Date(Date.UTC(2026, 10, 12, 14, 2, 40)),
    completedAt: null,
    duration: 168,
    location: 'San Francisco, US',
    trigger: 'GET https://images.example.com/product-88.jpg?format=avif',
    outcome: 'Still running, the origin has not answered yet.',
    logs: [
      { at: 0, level: 'info', message: 'Invocation started: GET /product-88.jpg?format=avif' },
      { at: 3, level: 'debug', message: 'args { defaultFormat: "avif", quality: 80 }' },
      { at: 13, level: 'info', message: 'Cache miss, fetching assets.example.com' }
    ],
    spans: [
      {
        id: 'root',
        name: 'image-resizer',
        service: 'Function',
        icon: 'az az-functions',
        start: 0,
        duration: 168,
        status: 'running'
      },
      {
        id: 'parse',
        parentId: 'root',
        name: 'parse-request',
        service: 'Compute',
        icon: 'az az-code',
        start: 3,
        duration: 10
      },
      {
        id: 'origin',
        parentId: 'root',
        name: 'fetch-origin',
        service: 'Network',
        icon: 'az az-send',
        start: 13,
        duration: 155,
        status: 'running'
      }
    ]
  }
]
```
