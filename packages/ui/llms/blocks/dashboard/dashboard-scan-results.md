# DashboardScanResults (`dashboard/dashboard-scan-results`)

> A scan results dashboard: items sent for analysis, the verdict each one received and what is still waiting. A page heading with a Refresh IconButton sits over a row of six StatTiles (submitted, in analysis, last 24 hours, flagged, held for a verdict and open alerts), each with a Hint that defines it. Below, three cards share a row: a DonutChart of the verdicts (Clean, Suspicious, Flagged and Pending, in their status hues) with the item count in its center, a BarList of the sources the items came from, and a Card that sums up the deliveries held for a verdict and the items delivered before they were flagged, each with a Link to its list. A Submissions card across the full width holds the filter row (an Input search and Selects for status, verdict and source) over a paginated DataTable: name, the verdict Tag, category, score, type, size, source, first submitter and last seen. Built from `PageHeader`, `StatTile`, `DonutChart`, `BarList`, `ChartCard`, `Card`, `DataTable`, `TableCellStatus`, `Link`, `Input`, `Select`, `Hint`, `IconButton`, `Skeleton` and `EmptyState`. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/dashboard/dashboard-scan-results/dashboard-scan-results.vue` in `@aziontech/ui`
- MCP: `get_block("dashboard/dashboard-scan-results")`
- Components: [Alert](../../components/alert.md), [BarList](../../components/bar-list.md), [Card](../../components/card.md), [ChartCard](../../components/chart-card.md), [DataTable](../../components/data-table.md), `DataTablePagination`, [DonutChart](../../components/donut-chart.md), [EmptyState](../../components/empty-state.md), [Hint](../../components/hint.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Link](../../components/link.md), [PageHeader](../../components/page-header.md), [Select](../../components/select.md), [Skeleton](../../components/skeleton.md), [StatTile](../../components/stat-tile.md), `TableCellStatus`, `use-collection`, `use-locale`
- Skills: `azion-ui-data-viz`, `azion-ui-tables`, `azion-ui-states`

## Asked as

scan results; scan dashboard; analysis verdicts; malware scan; flagged items; submissions in analysis; resultados da análise; painel de varredura; itens sinalizados; waiting for a verdict; asynchronous analysis results

The page for a pipeline that sends items (files, attachments, packages) for analysis and gives each a
verdict. The reader checks what was submitted, what is still waiting, what was flagged, and above all
two exceptions: deliveries held until a verdict arrives, and items that were delivered before they
were flagged. It ends in the submissions table, where the reader finds a specific item.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- Use dashboard-scan-results when items wait for a verdict from an asynchronous analysis.
- Items get a verdict from an asynchronous analysis (Clean, Suspicious, Flagged, Pending).
- Some items are held or released depending on that verdict, and the exceptions need follow-up.
- The reader needs to look up a specific item by name or submitter.

## When not to use

- A continuous score rather than a verdict per item: use `dashboard/dashboard-health-score`.
- Alerts triaged by severity: use `dashboard/dashboard-alerts`.
- Requests decided by rules in real time: use `dashboard/dashboard-security`.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Scan results` with one sentence on what it covers.

### B. Refresh — `IconButton` (optional)

Re-reads the results, `aria-label="Refresh"`. Analysis is asynchronous, so the reader needs a way to
pull new verdicts without reloading the page.

### C. Summary tiles — `StatTile` (required)

Six tiles in a region labelled `Summary`: `Submitted`, `In analysis`, `Last 24 hours`, `Flagged`,
`Held for a verdict`, `Open alerts`.

### D. Definitions — `Hint` (required)

One sentence on every tile and card title.

### E. Verdicts and sources — `ChartCard` (required)

Two cards in a row with the summary card: verdicts and sources.

### F. Verdicts — `DonutChart` (required)

Clean, Suspicious and Flagged in the success, warning and danger status hues (the color means the
verdict) and Pending in the neutral Other hue, with the
item count in the center (`Items`).

### G. Sources — `BarList` (required)

Where the items came from (`Inline scan`, `API submission`, `Manual upload`, `Scheduled scan`), largest
first.

### H. Held and flagged — `Card` (required)

Two sentences with counts: deliveries held for a verdict, and alerts for items delivered before they
were flagged. Each is followed by a link to its list. A card, not a chart, because these are
exceptions to act on.

### I. Loading lines — `Skeleton` (required)

Holds the summary card's sentences while the results load.

### J. Exception links — `Link` (required)

`Held deliveries` and `Early delivery alerts`, each to the list that resolves it.

### K. Search — `Input` (required)

`Search by name or submitter`, in the Submissions card's filter row.

### L. Filters — `Select` (required)

Status, verdict and source, each with an "Any" option (`Any status`, `Any verdict`, `Any source`) and
an `aria-label`.

### M. Submissions — `DataTable` (required)

Paginated: name, verdict, category, score, type, size, source, first submitter and last seen. Score,
size and dates in tabular figures. The table sets `stackable`: on a phone each submission becomes a
card of label and value lines, so the verdict is never cut off.

### N. Empty regions — `EmptyState` (required)

`No verdict yet` / `Verdicts appear once the first item finishes its analysis.` in the donut,
`No items yet` in sources, and `No matching items` / `Change the search or the filters.` in the table.

### O. Verdict — `TableCellStatus` (required)

The verdict of each row, in the same hue as its donut slice.

### P. Load failure — `Alert` (required)

When `error` is set, one danger `Alert` under the page heading says `Couldn't load <page>.` followed by the message, with Retry, which emits `retry`. Every region keeps its header and shows a quiet `Not available.` line in place of its content, and each tile shows a dash over a neutral `Couldn't load` band, so one failed request reads as one problem instead of a wall of red banners.

## Data

The block takes its records through props and emits every action; it fetches nothing. `ScanResultsSubmission`, `ScanResultsSummary`, `ScanResultsVerdict`, `ScanResultsSource` and `ScanResultsDashboardProps` are exported from `dashboard-scan-results.vue`, and `sample.ts` holds the sample figures, splits and submissions the block renders when a data prop is left out (and never while `loading` or `error` is set).

| Prop           | Type                      | What it does                                                                                                                   |
| -------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `summary`      | `ScanResultsSummary`      | The six tiles and the Held and flagged card. All zeros is the nothing-submitted state.                                         |
| `verdictSplit` | `ChartSeries[]`           | One donut slice per verdict, each with its status color. `[]` shows `No verdict yet`.                                          |
| `sources`      | `BarListItem[]`           | One bar per source. `[]` shows `No items yet`.                                                                                 |
| `submissions`  | `ScanResultsSubmission[]` | The Submissions rows; the search and the filters run on them in the browser. `[]` shows `No items yet`.                        |
| `loading`      | `boolean`                 | The period is loading: every region shows its Skeleton.                                                                        |
| `error`        | `string`                  | Why the period could not load; one danger `Alert` under the heading shows it with Retry, and the regions show `Not available.` |

| Event     | Payload   | When                             |
| --------- | --------- | -------------------------------- |
| `refresh` | `(event)` | Refresh in the page heading.     |
| `retry`   | `(event)` | Retry in the page's error alert. |

The `Held deliveries` and `Early delivery alerts` links point at `#held` and `#alerts`; point them at your pages. To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import DashboardScanResults from './dashboard-scan-results.vue'

  const { data, pending, error, refresh } = useScanResults()
</script>

<template>
  <DashboardScanResults
    :summary="data?.summary"
    :verdict-split="data?.verdicts ?? []"
    :sources="data?.sources ?? []"
    :submissions="data?.submissions ?? []"
    :loading="pending"
    :error="error ? 'Check your connection and retry.' : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep verdict colors identical in the donut and the table.
- Put the exceptions (held, delivered then flagged) in sentences with links, so each leads to an action.
- Offer an "Any" option on every filter so the default is the whole set.
- When nothing was ever submitted, replace the filters and the table with one empty state.

## Don't

- Don't show Pending as a failure; it is an unknown, not a verdict.
- Don't use the verdict hues for sources or categories.
- Don't keep filters visible over a table that can never have rows.

## Copy

- **Title:** `Scan results`.
- **Tile labels:** short noun phrases. `Held for a verdict`, `In analysis`.
- **Verdicts:** one word. `Clean`, `Suspicious`, `Flagged`, `Pending`.
- **Exception sentences:** count first, past tense, period. `12 deliveries held for a verdict now, 4 in the last 24 hours.`
- **Links:** the destination, not "Click here". `Held deliveries`.
- **No-match state:** `No matching items` / `Change the search or the filters.`

## Accessibility

- Refresh, search and every filter have an `aria-label`.
- The donut and the bar list have `aria-label`s (`Verdicts`, `Sources`).
- Verdicts are words in a `Tag`, never color alone.
- Loading regions set `aria-busy="true"`; figures use `tabular-nums`.

## States

- Default: results with verdicts, exceptions and the submissions table.
- Loading: `loading`; tiles, donut and bar list render their own `Skeleton`, the summary card holds Skeleton lines and the table shows Skeleton rows.
- Empty: nothing submitted yet (a zero `summary`, `[]` splits and `submissions`); tiles read zero, verdicts and sources keep their box with an `EmptyState`, and the Submissions card drops the filters and the table for one `EmptyState`.
- Error: `error` is set; one danger `Alert` under the heading names what did not load, carries the message and offers Retry; tiles show a dash over a quiet band and every region keeps its header over `Not available.`

## Related

- `dashboard/dashboard-alerts` — the early delivery alerts as a triage queue.
- `dashboard/dashboard-security` — decisions made in real time.
- `view/view-table` — the submissions table on its own page.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the results load, the tiles, the donut and the bar list render their own Skeleton, the summary holds Skeleton lines and the table shows Skeleton rows, so the page does not reflow when data arrives.
- `Empty` — Nothing has been sent for analysis yet. The tiles read zero, the verdicts and sources keep their box with an EmptyState, and the Submissions card drops the filters and the table for one EmptyState that says what fills it.
- `Error` — The request for the period failed: one danger `Alert` under the page heading names what did not load and offers Retry; the tiles read as dashes over a quiet band and every card keeps its header over a quiet `Not available.` line.

Each variant is the same screen in another state: `get_block("dashboard/dashboard-scan-results", { variant })`, or the file under `blocks/dashboard/dashboard-scan-results/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import BarList, { type BarListItem } from '@aziontech/ui/bar-list'
  import type { ChartSeries } from '@aziontech/ui/chart'
  import ChartCard from '@aziontech/ui/chart-card'
  import DonutChart from '@aziontech/ui/donut-chart'
  import EmptyState from '@aziontech/ui/empty-state'
  import Hint from '@aziontech/ui/hint'
  import IconButton from '@aziontech/ui/icon-button'
  import PageHeader from '@aziontech/ui/page-header'
  import StatTile from '@aziontech/ui/stat-tile'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed } from 'vue'

  import HeldFlaggedCard from './parts/held-flagged-card.vue'
  import SubmissionsTable from './parts/submissions-table.vue'
  import { sampleSources, sampleSubmissions, sampleSummary, sampleVerdictSplit } from './sample'
  import { scanFigures } from './scan-results-config'
  /** The verdict an item received; pending while its analysis runs. */
  export type ScanResultsVerdict = 'clean' | 'suspicious' | 'flagged' | 'pending'
  /** Where an item came from. */
  export type ScanResultsSource = 'inline' | 'api' | 'upload' | 'scheduled'

  /** One row of the Submissions table. */
  export interface ScanResultsSubmission {
    /** Stable key. */
    id: string
    /** File name. */
    name: string
    /** The verdict it received. */
    verdict: ScanResultsVerdict
    /** What the analysis classified it as; a dash while pending. */
    category: string
    /** Risk score from 0 to 100; null while pending. */
    score: number | null
    /** File type in words. */
    type: string
    /** Size in bytes. */
    size: number
    /** Where it came from. */
    source: ScanResultsSource
    /** Who sent it first. */
    submitter: string
    /** When it was seen last, as an ISO-like date and time. */
    lastSeen: string
  }

  /** The figures of the summary tiles and the Held and flagged card. */
  export interface ScanResultsSummary {
    /** Items sent for analysis in the period. */
    submitted: number
    /** Items waiting for a verdict now. */
    analyzing: number
    /** Items submitted in the last 24 hours. */
    last24h: number
    /** Items flagged as harmful. */
    flagged: number
    /** Deliveries held for a verdict now. */
    held: number
    /** Deliveries held in the last 24 hours. */
    heldLast24h: number
    /** Early delivery alerts nobody has reviewed. */
    alertsOpen: number
    /** Every early delivery alert in the period. */
    alertsTotal: number
  }

  export interface ScanResultsDashboardProps {
    /** The summary figures. Left out, the sample renders. */
    summary?: ScanResultsSummary
    /** One donut slice per verdict. Left out, the sample renders. */
    verdictSplit?: ChartSeries[]
    /** One bar per source. Left out, the sample renders. */
    sources?: BarListItem[]
    /** The Submissions rows, filtered in the browser; pass an empty list when none exists. Left out, the sample renders. */
    submissions?: ScanResultsSubmission[]
    /** The period is loading. */
    loading?: boolean
    /** Why the period could not load, shown after what did not load in each danger alert. */
    error?: string
  }

  const props = withDefaults(defineProps<ScanResultsDashboardProps>(), {
    summary: undefined,
    verdictSplit: undefined,
    sources: undefined,
    submissions: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()

  const blocked = computed(() => props.loading || props.error !== '')
  const summary = computed<ScanResultsSummary | null>(
    () => props.summary ?? (blocked.value ? null : sampleSummary)
  )
  const verdictSplit = computed(
    () => props.verdictSplit ?? (blocked.value ? [] : sampleVerdictSplit)
  )
  const sourceItems = computed(() => props.sources ?? (blocked.value ? [] : sampleSources))
  const submissions = computed(() => props.submissions ?? (blocked.value ? [] : sampleSubmissions))

  const { formatNumber } = useLocale()

  const formatCount = (value: number) => formatNumber(value)

  const formatCompact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Scan results"
        description="Items sent for analysis inline and through the API, their verdicts, the deliveries held for a verdict and the items delivered before they were flagged."
      >
        <template #actions>
          <IconButton
            icon="az az-refresh"
            variant="outline"
            size="medium"
            aria-label="Refresh"
            @click="(event: MouseEvent) => emit('refresh', event)"
          />
        </template>
      </PageHeader>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load the scan results. ${error}`"
        action-label="Retry"
        data-testid="dashboard-scan-results__error"
        @action="(event: MouseEvent) => emit('retry', event)"
      />

      <section aria-label="Summary">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <li
            v-for="figure in scanFigures"
            :key="figure.key"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="error ? null : (summary?.[figure.key] ?? null)"
              :format-value="formatCompact"
              :loading="loading"
              :error="error"
            >
              <template #aside>
                <Hint :content="figure.description" />
              </template>
            </StatTile>
          </li>
        </ul>
      </section>

      <div
        class="grid grid-cols-1 items-stretch gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Verdicts</ChartCard.Title>
              <Hint content="Every item analyzed in the period, by the verdict it received." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <p
              v-if="error"
              class="text-body-sm text-(--text-muted)"
            >
              Not available.
            </p>
            <DonutChart
              v-else
              :series="verdictSplit"
              :format-value="formatCompact"
              size="small"
              total-label="Items"
              empty-title="No verdict yet"
              empty-description="Verdicts appear once the first item finishes its analysis."
              :loading="loading"
              aria-label="Verdicts"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Sources</ChartCard.Title>
              <Hint
                content="Where the items came from: scanned inline, sent through the API, uploaded by hand or picked up by a scheduled scan."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <p
              v-if="error"
              class="text-body-sm text-(--text-muted)"
            >
              Not available.
            </p>
            <BarList
              v-else
              :items="sourceItems"
              :format-value="formatCompact"
              empty-title="No items yet"
              :loading="loading"
              aria-label="Sources"
            />
          </ChartCard.Content>
        </ChartCard>

        <HeldFlaggedCard
          :summary="summary"
          :loading="loading"
          :error="error"
          :format-count="formatCount"
        />

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
              <ChartCard.Title>Submissions</ChartCard.Title>
              <Hint
                content="Every item sent for analysis, newest first, with its verdict and where it came from."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <p
              v-if="error"
              class="text-body-sm text-(--text-muted)"
            >
              Not available.
            </p>
            <SubmissionsTable
              v-else-if="loading || submissions.length"
              :submissions="submissions"
              :loading="loading"
            />
            <EmptyState
              v-else
              size="small"
              icon="az az-file"
              title="No items yet"
              description="Items sent for analysis inline or through the API appear here."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>
```

## `sample.ts`

```ts
import type { BarListItem } from '@aziontech/ui/bar-list'
import type { ChartSeries } from '@aziontech/ui/chart'

import type { ScanResultsSubmission, ScanResultsSummary } from './dashboard-scan-results.vue'

export const sampleSummary: ScanResultsSummary = {
  submitted: 18420,
  analyzing: 37,
  last24h: 1284,
  flagged: 212,
  held: 9,
  heldLast24h: 46,
  alertsOpen: 3,
  alertsTotal: 14
}

export const sampleEmptySummary: ScanResultsSummary = {
  submitted: 0,
  analyzing: 0,
  last24h: 0,
  flagged: 0,
  held: 0,
  heldLast24h: 0,
  alertsOpen: 0,
  alertsTotal: 0
}

export const sampleVerdictSplit: ChartSeries[] = [
  {
    id: 'clean',
    name: 'Clean',
    color: 'success',
    values: [16930]
  },
  {
    id: 'suspicious',
    name: 'Suspicious',
    color: 'warning',
    values: [1241]
  },
  {
    id: 'flagged',
    name: 'Flagged',
    color: 'danger',
    values: [212]
  },
  {
    id: 'pending',
    name: 'Pending',
    color: 'other',
    values: [37]
  }
]

export const sampleSources: BarListItem[] = [
  {
    id: 'inline',
    name: 'Inline scan',
    value: 11640
  },
  {
    id: 'api',
    name: 'API submission',
    value: 4380
  },
  {
    id: 'upload',
    name: 'Manual upload',
    value: 1620
  },
  {
    id: 'scheduled',
    name: 'Scheduled scan',
    value: 780
  }
]

export const sampleSubmissions: ScanResultsSubmission[] = [
  {
    id: 'submission-01',
    name: 'quarterly-report.pdf',
    verdict: 'clean',
    category: 'Document',
    score: 4,
    type: 'PDF',
    size: 2480000,
    source: 'inline',
    submitter: 'ava.wilson',
    lastSeen: '2026-11-10 13:42'
  },
  {
    id: 'submission-02',
    name: 'installer-setup.exe',
    verdict: 'flagged',
    category: 'Trojan',
    score: 96,
    type: 'Executable',
    size: 18300000,
    source: 'inline',
    submitter: 'mark.chen',
    lastSeen: '2026-11-10 13:18'
  },
  {
    id: 'submission-03',
    name: 'invoice-0425.docm',
    verdict: 'suspicious',
    category: 'Macro',
    score: 71,
    type: 'Office document',
    size: 184000,
    source: 'upload',
    submitter: 'lisa.martin',
    lastSeen: '2026-11-10 12:57'
  },
  {
    id: 'submission-04',
    name: 'build-artifacts.zip',
    verdict: 'pending',
    category: '—',
    score: null,
    type: 'Archive',
    size: 46700000,
    source: 'api',
    submitter: 'ci-runner',
    lastSeen: '2026-11-10 12:51'
  },
  {
    id: 'submission-05',
    name: 'team-photo.png',
    verdict: 'clean',
    category: 'Image',
    score: 1,
    type: 'Image',
    size: 3120000,
    source: 'inline',
    submitter: 'sam.okafor',
    lastSeen: '2026-11-10 12:33'
  },
  {
    id: 'submission-06',
    name: 'update-helper.dll',
    verdict: 'flagged',
    category: 'Ransomware',
    score: 99,
    type: 'Library',
    size: 912000,
    source: 'api',
    submitter: 'ci-runner',
    lastSeen: '2026-11-10 11:46'
  },
  {
    id: 'submission-07',
    name: 'pricing-model.xlsx',
    verdict: 'clean',
    category: 'Spreadsheet',
    score: 6,
    type: 'Office document',
    size: 640000,
    source: 'upload',
    submitter: 'priya.nair',
    lastSeen: '2026-11-10 11:20'
  },
  {
    id: 'submission-08',
    name: 'run-me.sh',
    verdict: 'suspicious',
    category: 'Script',
    score: 63,
    type: 'Script',
    size: 4200,
    source: 'inline',
    submitter: 'david.kim',
    lastSeen: '2026-11-10 10:58'
  },
  {
    id: 'submission-09',
    name: 'meeting-notes.txt',
    verdict: 'clean',
    category: 'Text',
    score: 0,
    type: 'Text',
    size: 12800,
    source: 'scheduled',
    submitter: 'scheduler',
    lastSeen: '2026-11-10 10:12'
  },
  {
    id: 'submission-10',
    name: 'browser-extension.crx',
    verdict: 'suspicious',
    category: 'Adware',
    score: 58,
    type: 'Extension',
    size: 1740000,
    source: 'inline',
    submitter: 'mark.chen',
    lastSeen: '2026-11-10 09:47'
  },
  {
    id: 'submission-11',
    name: 'backup-2026-11.tar.gz',
    verdict: 'pending',
    category: '—',
    score: null,
    type: 'Archive',
    size: 128000000,
    source: 'scheduled',
    submitter: 'scheduler',
    lastSeen: '2026-11-10 09:30'
  },
  {
    id: 'submission-12',
    name: 'driver-package.msi',
    verdict: 'clean',
    category: 'Installer',
    score: 9,
    type: 'Installer',
    size: 22600000,
    source: 'api',
    submitter: 'ci-runner',
    lastSeen: '2026-11-10 08:54'
  }
]
```

## `parts/filter-select.vue`

```ts
<script setup lang="ts">
  import Select from '@aziontech/ui/select'

  import type { ScanFilterOption } from '../scan-results-config'

  export interface FilterSelectProps {
    /** Accessible name of the filter. */
    label: string
    /** The options; the first one keeps every row. */
    options: ScanFilterOption[]
  }

  const props = defineProps<FilterSelectProps>()

  const value = defineModel<string>({ required: true })

  const displayValue = (current: unknown) =>
    props.options.find((option) => option.value === current)?.label ?? String(current)
</script>

<template>
  <div class="w-full sm:w-44">
    <Select
      v-model="value"
      size="medium"
      :display-value="displayValue"
    >
      <Select.Trigger :aria-label="label" />
      <Select.Content>
        <Select.Item
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </Select.Item>
      </Select.Content>
    </Select>
  </div>
</template>
```

## `parts/held-flagged-card.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Link from '@aziontech/ui/link'
  import Skeleton from '@aziontech/ui/skeleton'

  import type { ScanResultsSummary } from '../dashboard-scan-results.vue'

  export interface HeldFlaggedCardProps {
    /** The summary figures; null holds the skeleton. */
    summary: ScanResultsSummary | null
    /** The period is loading. */
    loading: boolean
    /** Why the period could not load; shows a danger alert with Retry. */
    error: string
    /** Writes a count. */
    formatCount: (value: number) => string
  }

  defineProps<HeldFlaggedCardProps>()
</script>

<template>
  <div class="lg:col-span-4">
    <Card title="Held and flagged">
      <template #default>
        <p
          v-if="error"
          class="text-body-sm text-(--text-muted)"
        >
          Not available.
        </p>
        <div
          v-else-if="loading || !summary"
          aria-busy="true"
          class="flex flex-col gap-(--spacing-sm)"
        >
          <Skeleton
            v-for="width in ['90%', '30%', '80%', '40%']"
            :key="width"
            :width="width"
            height="1rem"
          />
        </div>
        <div
          v-else
          class="flex flex-col gap-(--spacing-md)"
        >
          <div class="flex flex-col items-start gap-(--spacing-2xs)">
            <p class="text-pretty text-body-sm text-(--text-default)">
              {{ formatCount(summary.held) }} deliveries held for a verdict now,
              {{ formatCount(summary.heldLast24h) }} in the last 24 hours.
            </p>
            <Link
              label="Held deliveries"
              href="#held"
              size="small"
            />
          </div>
          <div class="flex flex-col items-start gap-(--spacing-2xs)">
            <p class="text-pretty text-body-sm text-(--text-default)">
              {{ formatCount(summary.alertsOpen) }} open alerts of
              {{ formatCount(summary.alertsTotal) }} for items delivered before they were flagged.
            </p>
            <Link
              label="Early delivery alerts"
              href="#alerts"
              size="small"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
```

## `parts/submissions-table.vue`

```ts
<script setup lang="ts">
  import DataTable from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import EmptyState from '@aziontech/ui/empty-state'
  import Input from '@aziontech/ui/input'
  import TableCellStatus from '@aziontech/ui/table-cell-status'
  import { matchesText } from '@aziontech/ui/use-collection'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed, ref } from 'vue'

  import type { ScanResultsSubmission } from '../dashboard-scan-results.vue'
  import {
    formatScanScore,
    formatScanSize,
    scanColumns,
    scanSourceLabels,
    scanSourceOptions,
    scanStatusOptions,
    scanVerdictOptions,
    scanVerdicts
  } from '../scan-results-config'
  import FilterSelect from './filter-select.vue'

  export interface SubmissionsTableProps {
    /** Every submission of the period, filtered here. */
    submissions: ScanResultsSubmission[]
    /** The period is loading. */
    loading: boolean
  }

  const props = defineProps<SubmissionsTableProps>()

  const { formatNumber } = useLocale()

  const search = ref('')
  const status = ref('all')
  const verdict = ref('all')
  const source = ref('all')

  const rows = computed(() =>
    props.submissions.filter(
      (row) =>
        (status.value === 'all' ||
          (status.value === 'analyzing') === (row.verdict === 'pending')) &&
        (verdict.value === 'all' || row.verdict === verdict.value) &&
        (source.value === 'all' || row.source === source.value)
    )
  )
  const matchingRows = computed(() =>
    rows.value.filter((row) =>
      matchesText(
        row,
        search.value,
        scanColumns.flatMap((column) => column.accessorKey ?? [])
      )
    )
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
    <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <div class="min-w-36 grow basis-(--container-3xs)">
        <Input
          v-model="search"
          size="medium"
          placeholder="Search by name or submitter"
          aria-label="Search by name or submitter"
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </div>
      <FilterSelect
        v-model="status"
        label="Status"
        :options="scanStatusOptions"
      />
      <FilterSelect
        v-model="verdict"
        label="Verdict"
        :options="scanVerdictOptions"
      />
      <FilterSelect
        v-model="source"
        label="Source"
        :options="scanSourceOptions"
      />
    </div>
    <DataTable
      :data="matchingRows"
      :columns="scanColumns"
      row-key="id"
      sortable
      density="compact"
      stackable
      bordered
      :loading="loading"
    >
      <template #empty>
        <EmptyState
          size="small"
          icon="az az-search"
          title="No matching items"
          description="Change the search or the filters."
        />
      </template>
      <template #cell-name="{ row }">
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i
            class="az az-file shrink-0 text-body-lg text-(--text-muted)"
            aria-hidden="true"
          />
          <span class="truncate">{{ row.name }}</span>
        </div>
      </template>
      <template #cell-verdict="{ row }">
        <TableCellStatus
          :label="scanVerdicts[row.verdict].label"
          :severity="scanVerdicts[row.verdict].severity"
        />
      </template>
      <template #cell-score="{ row }">
        <span class="tabular-nums">{{ formatScanScore(row.score) }}</span>
      </template>
      <template #cell-size="{ row }">
        <span class="tabular-nums">{{ formatScanSize(row.size, formatNumber) }}</span>
      </template>
      <template #cell-source="{ row }">
        {{ scanSourceLabels[row.source] }}
      </template>
      <template #cell-lastSeen="{ row }">
        <time
          class="tabular-nums"
          :datetime="row.lastSeen"
          >{{ row.lastSeen }}</time
        >
      </template>
      <template #footer>
        <DataTablePagination
          :page-size="10"
          :page-size-options="[10, 25, 50]"
        />
      </template>
    </DataTable>
  </div>
</template>
```

## `scan-results-config.ts`

```ts
import type { ChartColor } from '@aziontech/ui/chart'
import type { TableColumn } from '@aziontech/ui/data-table'
import type { TagSeverity } from '@aziontech/ui/tag'

import type {
  ScanResultsSource,
  ScanResultsSummary,
  ScanResultsVerdict
} from './dashboard-scan-results.vue'

/** One option of a Submissions filter. */
export interface ScanFilterOption {
  /** The value the filter writes. */
  value: string
  /** The label the filter shows. */
  label: string
}

export const scanFigures: {
  key: keyof ScanResultsSummary
  label: string
  description: string
}[] = [
  {
    key: 'submitted',
    label: 'Submitted',
    description: 'Items sent for analysis in the selected period.'
  },
  {
    key: 'analyzing',
    label: 'In analysis',
    description: 'Items waiting for a verdict right now.'
  },
  {
    key: 'last24h',
    label: 'Last 24 hours',
    description: 'Items submitted in the last 24 hours.'
  },
  {
    key: 'flagged',
    label: 'Flagged',
    description: 'Items whose verdict marks them as harmful.'
  },
  {
    key: 'held',
    label: 'Held for a verdict',
    description: 'Deliveries paused until their analysis finishes.'
  },
  {
    key: 'alertsOpen',
    label: 'Open alerts',
    description: 'Items delivered before they were flagged that nobody has reviewed yet.'
  }
]

export const scanVerdicts: Record<
  ScanResultsVerdict,
  { label: string; severity: TagSeverity; color: ChartColor }
> = {
  clean: {
    label: 'Clean',
    severity: 'success',
    color: 'success'
  },
  suspicious: {
    label: 'Suspicious',
    severity: 'warning',
    color: 'warning'
  },
  flagged: {
    label: 'Flagged',
    severity: 'danger',
    color: 'danger'
  },
  pending: {
    label: 'Pending',
    severity: 'neutral',
    color: 'other'
  }
}

export const scanSourceLabels: Record<ScanResultsSource, string> = {
  inline: 'Inline scan',
  api: 'API submission',
  upload: 'Manual upload',
  scheduled: 'Scheduled scan'
}

export const scanStatusOptions: ScanFilterOption[] = [
  {
    value: 'all',
    label: 'Any status'
  },
  {
    value: 'analyzing',
    label: 'In analysis'
  },
  {
    value: 'completed',
    label: 'Completed'
  }
]

export const scanVerdictOptions: ScanFilterOption[] = [
  {
    value: 'all',
    label: 'Any verdict'
  },
  {
    value: 'clean',
    label: 'Clean'
  },
  {
    value: 'suspicious',
    label: 'Suspicious'
  },
  {
    value: 'flagged',
    label: 'Flagged'
  }
]

export const scanSourceOptions: ScanFilterOption[] = [
  {
    value: 'all',
    label: 'Any source'
  },
  {
    value: 'inline',
    label: 'Inline scan'
  },
  {
    value: 'api',
    label: 'API submission'
  },
  {
    value: 'upload',
    label: 'Manual upload'
  },
  {
    value: 'scheduled',
    label: 'Scheduled scan'
  }
]

export const scanColumns: TableColumn[] = [
  {
    accessorKey: 'name',
    id: 'name',
    header: 'Name',
    align: 'start',
    sortable: true,
    principal: true,
    grow: 2
  },
  {
    accessorKey: 'verdict',
    id: 'verdict',
    header: 'Verdict',
    align: 'start',
    sortable: true,
    minWidth: 112
  },
  {
    accessorKey: 'category',
    id: 'category',
    header: 'Category',
    align: 'start',
    sortable: true,
    minWidth: 112
  },
  {
    accessorKey: 'score',
    id: 'score',
    header: 'Score',
    align: 'end',
    sortable: true,
    minWidth: 80
  },
  {
    accessorKey: 'type',
    id: 'type',
    header: 'Type',
    align: 'start',
    sortable: true,
    minWidth: 128
  },
  {
    accessorKey: 'size',
    id: 'size',
    header: 'Size',
    align: 'end',
    sortable: true,
    minWidth: 88
  },
  {
    accessorKey: 'source',
    id: 'source',
    header: 'Source',
    align: 'start',
    sortable: true,
    minWidth: 128
  },
  {
    accessorKey: 'submitter',
    id: 'submitter',
    header: 'First submitter',
    align: 'start',
    sortable: true,
    minWidth: 128
  },
  {
    accessorKey: 'lastSeen',
    id: 'lastSeen',
    header: 'Last seen',
    align: 'start',
    sortable: true,
    minWidth: 136
  }
]

const sizeUnits = ['B', 'KB', 'MB', 'GB']

export const formatScanSize = (
  value: number,
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
): string => {
  let size = value
  let unit = 0
  while (size >= 1000 && unit < sizeUnits.length - 1) {
    size /= 1000
    unit += 1
  }
  return `${formatNumber(size, { minimumFractionDigits: unit ? 1 : 0, maximumFractionDigits: unit ? 1 : 0 })} ${sizeUnits[unit]}`
}

export const formatScanScore = (value: number | null): string =>
  value === null ? '—' : String(value)
```
