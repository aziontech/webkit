# Invocations (`detail/invocations`)

> The Invocation page of one function run, as a page body for ConsoleLayout: one run end to end. A `PageHeader` titled Invocation opens on the invocation summary `Card` (the function `Link`, the copyable invocation ID with its `StatusIndicator`, Replay, the Recent switcher, an outlined `Button` whose `DropdownMenu` picks another invocation, the Invocation actions menu with Open in Real-Time Events and Function settings, the Started, Completed, Duration and Location facts, and the triggering request with its outcome). Below it the Request path is a `Flow` with one node per hop (service, resource, function, origin), each with its `Tag`, its facts and the time spent there; a node's `IconButton` selects its span in the `Trace` waterfall and scrolls it into view. The `LogView` lists what the function printed, timed on the same clock as the trace. The Error variant opens on a run the origin timed out, with the failing span selected; Running shows a run still in progress, its spans running and the lines printed so far under a Streaming indicator. Built from `PageHeader`, `Card`, `Tooltip`, `CopyButton`, `StatusIndicator`, `Button`, `DropdownMenu`, `IconButton`, `Link`, `SectionHeader`, `Flow`, `Tag`, `Trace`, `LogView` and `LogViewContent`; Replay reports through `toast`.

- Surface: app
- Source: `blocks/detail/invocations/invocations.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/invocations")`
- Components: [Button](../../components/button.md), [Card](../../components/card.md), [CopyButton](../../components/copy-button.md), [DropdownMenu](../../components/dropdown-menu.md), [Flow](../../components/flow.md), [IconButton](../../components/icon-button.md), [Link](../../components/link.md), `LogViewContent`, [LogView](../../components/log-view.md), [PageHeader](../../components/page-header.md), [SectionHeader](../../components/section-header.md), [StatusIndicator](../../components/status-indicator.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), [Trace](../../components/trace.md)
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

- Testing code you are still editing: use the TestRun variant of `edit/function-editor`.
- Searching many requests or events across products: use an event log table, e.g. `view/table-view`.
- The overview of the function itself, its versions or deployments: use `detail/resource-detail`.
- Following a deployment as it builds: use `detail/deployment-logs`.

## Building blocks

### A. Page heading — `PageHeader` (required)

A medium `PageHeader` titled Invocation, singular because the page is one run, with one sentence on what the page shows. The list of runs is the Recent switcher on this page, and the full list lives in Real-Time Events. The function is in the breadcrumb, never repeated as a heading.

### B. Invocation summary — `Card`, `Link`, `Tooltip`, `CopyButton`, `StatusIndicator`, `Button`, `DropdownMenu`, `IconButton` (required)

`Card :padded="false"` with three bands. The subject band holds the function `Link` (its `Tooltip` says where it goes), the invocation ID in code type with a `CopyButton`, and the run's `StatusIndicator` (loading while it runs); then Replay as a secondary `Button` (disabled while the run is still going), the Recent switcher, an outlined medium `Button` with the history glyph inside `DropdownMenu.Trigger` (its `Tooltip` inside the trigger, like the actions menu) that opens a `DropdownMenu` of the recent invocations with their status and start that swaps the page to the picked run, and the Invocation actions `IconButton` menu with Open in Real-Time Events and Function settings. The facts band lists Started, Completed, Duration and Location. The state band, on the canvas fill, shows the request that triggered the run with a `CopyButton` and its outcome, in danger color when it failed.

### C. Request path — `SectionHeader`, `Flow`, `Tag` (required)

A small `SectionHeader`, then a horizontally scrolling surface holding a `Flow` with one unstyled `Flow.Node` per hop: service, resource, function and origin, the last one `terminal`. Each node card has an eyebrow with its glyph and a status `Tag`, its name, and a short list of facts ending on the time spent there. A node measured by a span carries an outlined small `IconButton` named "Show <name> in the trace" that selects that span and scrolls the trace into view, honoring reduced motion.

### D. Trace — `Trace` (required)

A small `SectionHeader` over the `Trace` waterfall of the run, its spans nested by `parentId` with a service word and glyph, bound with `v-model:selected` so a node of the request path and a row of the waterfall are one selection. A failed span carries `status: 'error'` and its `message`; a span still going carries `status: 'running'`.

### E. Logs — `SectionHeader`, `StatusIndicator`, `LogView`, `LogViewContent` (required)

A small `SectionHeader` over a copyable `LogView` whose lines are timed from the run's zero (+16 ms), the same clock as the trace. Warnings and errors use the warning line type and keep the level word in the message; the last line of a completed run is a success line. While the run is going the lines printed so far stay on screen and a loading `StatusIndicator` reading Streaming sits in the section header; the view shows its own loading state only while no line has arrived yet, and `LogViewContent` holds the empty text.

## Do

- Lead with the outcome: the status and the outcome line come before any chart.
- Keep one clock for the trace and the logs, so a line and a span can be read against each other.
- Let a request path node jump to its span; never make the user search the waterfall for it.
- Keep the run switcher in the summary, so the user moves between invocations without leaving the page.
- Disable Replay while a run is still going, and report Replay through `toast`.

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

- Completed: a run that served its response, every node tagged Active or Answered, the trace with no error and the logs ending on a success line.
- Error: a run the origin timed out, the danger status and outcome, the function and origin nodes failed, the origin-response span selected with its message, and warning lines in the logs.
- Running: a run in progress, the loading status, Replay disabled, Completed reading Not yet, running spans, and the lines printed so far with a Streaming indicator in the Logs header.

## Related

- `edit/function-editor` — its TestRun variant runs the function before it ships, with the same trace and logs.
- `detail/resource-detail` — the overview of the function; this page owns the invocation summary card.
- `detail/deployment-logs` — the step logs of a deployment.
- `shell/console` — the `ConsoleLayout` this page body renders in; see `skills/webkit-layout`.

## Variants

- `Completed` — primary (the code below)
- `Error` — A run the origin timed out: the danger status, the outcome in danger color, the function and origin nodes tagged Failed and Timed out, the failing origin-response span selected in the trace with its message, and the warning lines in the logs.
- `Running` — A run still in progress: a loading Running status, Replay disabled, Completed reading Not yet, the function and origin nodes tagged Running and Waiting, the spans running in the trace and the lines printed so far kept on screen, with a loading Streaming `StatusIndicator` in the Logs header.

Each variant is the same screen in another state: `get_block("detail/invocations", { variant })`, or the file under `blocks/detail/invocations/variants/`.

## Code (`Completed`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Flow from '@aziontech/webkit/flow'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import LogViewContent from '@aziontech/webkit/log-view-content'
  import LogView, { type LogViewLine } from '@aziontech/webkit/log-view-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import SectionHeader from '@aziontech/webkit/section-header'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import Trace, { type TraceSpan } from '@aziontech/webkit/trace'
  import { computed, nextTick, ref } from 'vue'

  type RunStatus = 'Completed' | 'Failed' | 'Running'
  type LogLevel = 'debug' | 'info' | 'warn' | 'error'
  type Run = {
    id: string
    status: RunStatus
    started: string
    completed: string
    duration: number
    location: string
    trigger: string
    outcome: string
    logs: { at: number; level: LogLevel; message: string }[]
    spans: TraceSpan[]
  }
  type PathNode = {
    key: string
    eyebrow: string
    icon: string
    title: string
    label: string
    severity: TagSeverity
    spanId: string
    fields: { label: string; value: string }[]
  }

  const FUNCTION = { id: '40122', name: 'image-resizer', runtime: 'JavaScript' }

  const runs: Run[] = [
    {
      id: 'inv_8f2c1a9d',
      status: 'Completed',
      started: 'Nov 12, 14:02:11 UTC',
      completed: 'Nov 12, 14:02:11 UTC',
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
          icon: 'ai ai-edge-functions',
          start: 0,
          duration: 412
        },
        {
          id: 'parse',
          parentId: 'root',
          name: 'parse-request',
          service: 'Compute',
          icon: 'ai ai-code',
          start: 4,
          duration: 12
        },
        {
          id: 'origin',
          parentId: 'root',
          name: 'fetch-origin',
          service: 'Network',
          icon: 'ai ai-send',
          start: 16,
          duration: 186
        },
        {
          id: 'dns',
          parentId: 'origin',
          name: 'dns-lookup',
          service: 'Network',
          icon: 'ai ai-send',
          start: 16,
          duration: 14
        },
        {
          id: 'tls',
          parentId: 'origin',
          name: 'tls-handshake',
          service: 'Security',
          icon: 'ai ai-lock',
          start: 30,
          duration: 31
        },
        {
          id: 'response',
          parentId: 'origin',
          name: 'origin-response',
          service: 'Network',
          icon: 'ai ai-send',
          start: 61,
          duration: 141
        },
        {
          id: 'decode',
          parentId: 'root',
          name: 'decode',
          service: 'Compute',
          icon: 'ai ai-code',
          start: 202,
          duration: 54
        },
        {
          id: 'transform',
          parentId: 'root',
          name: 'transform',
          service: 'Compute',
          icon: 'ai ai-code',
          start: 256,
          duration: 92
        },
        {
          id: 'cache',
          parentId: 'root',
          name: 'put-cache',
          service: 'Storage',
          icon: 'ai ai-edge-storage',
          start: 348,
          duration: 38
        }
      ]
    },
    {
      id: 'inv_7d41be02',
      status: 'Failed',
      started: 'Nov 12, 13:50:27 UTC',
      completed: 'Nov 12, 13:50:28 UTC',
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
          icon: 'ai ai-edge-functions',
          start: 0,
          duration: 1240,
          status: 'error'
        },
        {
          id: 'parse',
          parentId: 'root',
          name: 'parse-request',
          service: 'Compute',
          icon: 'ai ai-code',
          start: 4,
          duration: 11
        },
        {
          id: 'origin',
          parentId: 'root',
          name: 'fetch-origin',
          service: 'Network',
          icon: 'ai ai-send',
          start: 15,
          duration: 1201,
          status: 'error'
        },
        {
          id: 'dns',
          parentId: 'origin',
          name: 'dns-lookup',
          service: 'Network',
          icon: 'ai ai-send',
          start: 15,
          duration: 12
        },
        {
          id: 'tls',
          parentId: 'origin',
          name: 'tls-handshake',
          service: 'Security',
          icon: 'ai ai-lock',
          start: 27,
          duration: 34
        },
        {
          id: 'response',
          parentId: 'origin',
          name: 'origin-response',
          service: 'Network',
          icon: 'ai ai-send',
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
      started: 'Nov 12, 14:02:40 UTC',
      completed: '',
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
          icon: 'ai ai-edge-functions',
          start: 0,
          duration: 168,
          status: 'running'
        },
        {
          id: 'parse',
          parentId: 'root',
          name: 'parse-request',
          service: 'Compute',
          icon: 'ai ai-code',
          start: 3,
          duration: 10
        },
        {
          id: 'origin',
          parentId: 'root',
          name: 'fetch-origin',
          service: 'Network',
          icon: 'ai ai-send',
          start: 13,
          duration: 155,
          status: 'running'
        }
      ]
    }
  ]

  const severities: Record<RunStatus, StatusIndicatorSeverity> = {
    Completed: 'success',
    Failed: 'danger',
    Running: 'warning'
  }

  const formatDuration = (ms: number) =>
    ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`

  const runId = ref('inv_8f2c1a9d')
  const run = computed(() => runs.find((entry) => entry.id === runId.value) ?? runs[0])
  const severity = computed(() => severities[run.value.status])
  const running = computed(() => run.value.status === 'Running')
  const facts = computed(() => [
    { label: 'Started', value: run.value.started },
    { label: 'Completed', value: run.value.completed || 'Not yet' },
    { label: 'Duration', value: formatDuration(run.value.duration) },
    { label: 'Location', value: run.value.location }
  ])

  const spanTime = (id: string) => {
    const span = run.value.spans.find((entry) => entry.id === id)
    return span ? formatDuration(span.duration) : 'Not reached'
  }
  const path = computed<PathNode[]>(() => {
    const failed = run.value.status === 'Failed'
    return [
      {
        key: 'service',
        eyebrow: 'Service',
        icon: 'ai ai-globe',
        title: 'storefront-prod',
        label: 'Live',
        severity: 'success',
        spanId: '',
        fields: [
          { label: 'Address', value: 'storefront.example.com' },
          { label: 'Location', value: run.value.location }
        ]
      },
      {
        key: 'resource',
        eyebrow: 'Resource',
        icon: 'ai ai-box',
        title: 'storefront',
        label: 'Active',
        severity: 'success',
        spanId: '',
        fields: [
          { label: 'Matched rule', value: 'Optimize images' },
          { label: 'Phase', value: 'Request' }
        ]
      },
      {
        key: 'function',
        eyebrow: 'Function',
        icon: 'ai ai-edge-functions',
        title: FUNCTION.name,
        label: failed ? 'Failed' : running.value ? 'Running' : 'Active',
        severity: failed ? 'danger' : running.value ? 'warning' : 'success',
        spanId: 'root',
        fields: [
          { label: 'Runtime', value: FUNCTION.runtime },
          { label: 'Time in function', value: spanTime('root') }
        ]
      },
      {
        key: 'origin',
        eyebrow: 'Origin',
        icon: 'ai ai-server',
        title: 'origin-assets',
        label: failed ? 'Timed out' : running.value ? 'Waiting' : 'Answered',
        severity: failed ? 'danger' : running.value ? 'warning' : 'success',
        spanId: 'origin',
        fields: [
          { label: 'Host', value: 'assets.example.com' },
          { label: 'Time at origin', value: spanTime('origin') }
        ]
      }
    ]
  })

  const lines = computed<LogViewLine[]>(() =>
    run.value.logs.map((entry, index) => ({
      id: `${run.value.id}-${index}`,
      time: `+${formatDuration(entry.at)}`,
      type:
        index === run.value.logs.length - 1 && run.value.status === 'Completed'
          ? 'success'
          : 'text',
      level: entry.level,
      message: `${entry.level.toUpperCase()} ${entry.message}`
    }))
  )

  const selectedSpan = ref('')
  const traceEl = ref<HTMLElement | null>(null)
  const showSpan = async (spanId: string) => {
    selectedSpan.value = spanId
    await nextTick()
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    traceEl.value?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  const pickRun = (id: string) => {
    runId.value = id
    selectedSpan.value = ''
  }

  const replay = () =>
    toast.info(`Replaying ${run.value.id}`, {
      description: 'The same request runs again, and the new invocation opens here.'
    })
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
        <Card :padded="false">
          <template #default>
            <div
              class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
            >
              <div
                class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
              >
                <i
                  class="ai ai-edge-functions shrink-0 text-body-lg text-(--text-muted)"
                  aria-hidden="true"
                />
                <div class="flex min-w-0">
                  <Tooltip
                    :content="`Open ${FUNCTION.name} in Functions`"
                    class="w-full"
                  >
                    <Link
                      :label="FUNCTION.name"
                      :href="`/functions/${FUNCTION.id}`"
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
                  kind="outlined"
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
                  kind="secondary"
                  size="medium"
                  icon="ai ai-replay"
                  :disabled="running"
                  @click="replay"
                />

                <DropdownMenu
                  placement="bottom-end"
                  @select="(_event, value) => pickRun(String(value))"
                >
                  <DropdownMenu.Trigger>
                    <Tooltip content="Pick another invocation of this function">
                      <Button
                        label="Recent"
                        kind="outlined"
                        size="medium"
                        icon="ai ai-history"
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
                          {{ option.status }} · {{ option.started }}
                        </span>
                      </template>
                    </DropdownMenu.Item>
                  </DropdownMenu.Group>
                </DropdownMenu>

                <DropdownMenu placement="bottom-end">
                  <DropdownMenu.Trigger>
                    <Tooltip content="Invocation actions">
                      <IconButton
                        icon="ai ai-ellipsis"
                        kind="outlined"
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
                          class="ai ai-real-time-events"
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
                          class="ai ai-settings"
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

            <div
              class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs)"
            >
              <div
                class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
              >
                <i
                  :data-severity="severity"
                  class="ai ai-arrow-right shrink-0 text-(--text-muted) data-[severity=danger]:text-(--danger-foreground)"
                  aria-hidden="true"
                />
                <span class="truncate text-label-code-sm text-(--text-muted)">{{
                  run.trigger
                }}</span>
                <CopyButton
                  kind="outlined"
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
          aria-label="Request path"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <SectionHeader
            title="Request path"
            description="The resources this invocation travelled, and the time it spent in each one."
            size="small"
          />
          <div
            class="overflow-x-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
          >
            <Flow
              align="start"
              class="min-w-max"
            >
              <Flow.Node
                v-for="node in path"
                :key="node.key"
                unstyled
                :terminal="node.key === 'origin'"
                class="min-w-(--size-56) max-w-(--size-56)"
              >
                <div
                  class="flex w-full min-w-0 flex-col rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) transition-colors duration-moderate-01 ease-productive-entrance hover:border-(--border-strong) has-[:focus-visible]:border-(--border-strong) motion-reduce:transition-none"
                >
                  <Flow.Anchor>
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
                  </Flow.Anchor>
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
                          icon="ai ai-align-left"
                          kind="outlined"
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
              </Flow.Node>
            </Flow>
          </div>
        </section>

        <section
          ref="traceEl"
          aria-label="Trace"
          class="flex min-w-0 scroll-mt-(--spacing-lg) flex-col gap-(--layout-group-gap)"
        >
          <SectionHeader
            title="Trace"
            description="One row per span, placed against the run's own clock. Select a row to read what it measured."
            size="small"
          />
          <Trace
            :key="run.id"
            v-model:selected="selectedSpan"
            :spans="run.spans"
            :aria-label="`Trace of ${run.id}`"
          />
        </section>

        <section
          aria-label="Logs"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <SectionHeader
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
          </SectionHeader>
          <LogView
            :lines="lines"
            :loading="running && !lines.length"
            loading-label="Waiting for the function to finish…"
            copyable
          >
            <LogViewContent>
              <template #empty>No log lines yet.</template>
            </LogViewContent>
          </LogView>
        </section>
      </div>
    </div>
  </div>
</template>
```
