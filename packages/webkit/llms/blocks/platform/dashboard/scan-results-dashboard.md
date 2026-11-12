# ScanResultsDashboard (`platform/dashboard/scan-results-dashboard`)

> A scan results dashboard: items sent for analysis, the verdict each one received and what is still waiting. A page heading with a Refresh IconButton sits over a row of six StatTiles (submitted, in analysis, last 24 hours, flagged, held for a verdict and open alerts), each with a Hint that defines it. Below, three cards share a row: a DonutChart of the verdicts (Clean, Suspicious, Flagged and Pending, in their status hues) with the item count in its center, a BarList of the sources the items came from, and a Card that sums up the deliveries held for a verdict and the items delivered before they were flagged, each with a Link to its list. A Submissions card across the full width holds the filter row (an Input search and Selects for status, verdict and source) over a paginated TableRoot: name, the verdict Tag, category, score, type, size, source, first submitter and last seen. Built from `PageHeader`, `StatTile`, `DonutChart`, `BarList`, `ChartCard`, `Card`, `TableRoot`, `Table.CellStatus`, `Link`, `Input`, `Select`, `Hint`, `IconButton`, `Skeleton` and `EmptyState`.

- Surface: product
- Source: `blocks/platform/dashboard/scan-results-dashboard/scan-results-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/scan-results-dashboard")`
- Components: [Alert](../../../components/alert.md), [BarList](../../../components/bar-list.md), [Card](../../../components/card.md), `ChartCard`, [DonutChart](../../../components/donut-chart.md), [EmptyState](../../../components/empty-state.md), [Hint](../../../components/hint.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [Link](../../../components/link.md), [PageHeader](../../../components/page-header.md), [Select](../../../components/select.md), [Skeleton](../../../components/skeleton.md), [StatTile](../../../components/stat-tile.md), [Table](../../../components/table.md), `TableRoot`
- Skills: `webkit-data-viz`, `webkit-tables`, `webkit-ui-states`

## Asked as

scan results; scan dashboard; analysis verdicts; malware scan; flagged items; submissions in analysis; resultados da análise; painel de varredura; itens sinalizados

The page for a pipeline that sends items (files, attachments, packages) for analysis and gives each a
verdict. The reader checks what was submitted, what is still waiting, what was flagged, and above all
two exceptions: deliveries held until a verdict arrives, and items that were delivered before they
were flagged. It ends in the submissions table, where the reader finds a specific item.

## When to use

- Items get a verdict from an asynchronous analysis (Clean, Suspicious, Flagged, Pending).
- Some items are held or released depending on that verdict, and the exceptions need follow-up.
- The reader needs to look up a specific item by name or submitter.

## When not to use

- A continuous score rather than a verdict per item: use `platform/dashboard/health-score-dashboard`.
- Alerts triaged by severity: use `platform/dashboard/alerts-dashboard`.
- Requests decided by rules in real time: use `platform/dashboard/activity-outcomes-dashboard`.

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

### M. Submissions — `TableRoot` (required)

Paginated: name, verdict, category, score, type, size, source, first submitter and last seen. Score,
size and dates in tabular figures.

### N. Empty regions — `EmptyState` (required)

`No verdict yet` / `Verdicts appear once the first item finishes its analysis.` in the donut,
`No items yet` in sources, and `No matching items` / `Change the search or the filters.` in the table.

### O. Verdict — `Table.CellStatus` (required)

The verdict of each row, in the same hue as its donut slice.

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
- Loading: tiles, donut and bar list render their own `Skeleton`, the summary card holds Skeleton lines and the table shows Skeleton rows.
- Empty: nothing submitted yet; tiles read zero, verdicts and sources keep their box with an `EmptyState`, and the Submissions card drops the filters and the table for one `EmptyState`.
- Failed: the request for the period failed; tiles show a dash, and every card keeps its header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/alerts-dashboard` — the early delivery alerts as a triage queue.
- `platform/dashboard/activity-outcomes-dashboard` — decisions made in real time.
- `platform/view/table-view` — the submissions table on its own page.

## Variants

- `Default` — primary (the code below)
- `Loading` — While the results load, the tiles, the donut and the bar list render their own Skeleton, the summary holds Skeleton lines and the table shows Skeleton rows, so the page does not reflow when data arrives.
- `Empty` — Nothing has been sent for analysis yet. The tiles read zero, the verdicts and sources keep their box with an EmptyState, and the Submissions card drops the filters and the table for one EmptyState that says what fills it.
- `Failed` — The request for the period failed: the tiles read as dashes, and every card keeps its header with a danger Alert that names what did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/scan-results-dashboard", { variant })`, or the file under `blocks/platform/dashboard/scan-results-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Card from '@aziontech/webkit/card'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Table from '@aziontech/webkit/table'
  import TableRoot from '@aziontech/webkit/table-root'
  import { computed, ref } from 'vue'

  const loading = false
  const search = ref('')
  const status = ref('all')
  const verdict = ref('all')
  const source = ref('all')

  const summary = {
    held: 9,
    heldLast24h: 46,
    alertsOpen: 3,
    alertsTotal: 14
  }

  const figures = [
    {
      id: 'submitted',
      label: 'Submitted',
      description: 'Items sent for analysis in the selected period.',
      value: 18420
    },
    {
      id: 'analyzing',
      label: 'In analysis',
      description: 'Items waiting for a verdict right now.',
      value: 37
    },
    {
      id: 'last-24h',
      label: 'Last 24 hours',
      description: 'Items submitted in the last 24 hours.',
      value: 1284
    },
    {
      id: 'flagged',
      label: 'Flagged',
      description: 'Items whose verdict marks them as harmful.',
      value: 212
    },
    {
      id: 'held',
      label: 'Held for a verdict',
      description: 'Deliveries paused until their analysis finishes.',
      value: 9
    },
    {
      id: 'alerts',
      label: 'Open alerts',
      description: 'Items delivered before they were flagged that nobody has reviewed yet.',
      value: 3
    }
  ]

  const verdictSplit = [
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

  const sourceItems = [
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

  const verdicts = {
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
      severity: 'secondary',
      color: 'other'
    }
  }

  const sources = {
    inline: 'Inline scan',
    api: 'API submission',
    upload: 'Manual upload',
    scheduled: 'Scheduled scan'
  }

  const statusOptions = [
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

  const verdictOptions = [
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

  const sourceOptions = [
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

  const submissions = [
    {
      id: 'submission-01',
      name: 'quarterly-report.pdf',
      verdict: 'clean',
      category: 'Document',
      score: 4,
      type: 'PDF',
      size: 2480000,
      source: 'inline',
      submitter: 'ana.ribeiro',
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
      submitter: 'lucia.alves',
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

  const submissionColumns = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      align: 'start',
      enableSorting: true,
      principal: true,
      grow: 2
    },
    {
      id: 'verdict',
      accessorKey: 'verdict',
      header: 'Verdict',
      align: 'start',
      enableSorting: true,
      minWidth: 112
    },
    {
      id: 'category',
      accessorKey: 'category',
      header: 'Category',
      align: 'start',
      enableSorting: true,
      minWidth: 112
    },
    {
      id: 'score',
      accessorKey: 'score',
      header: 'Score',
      align: 'end',
      enableSorting: true,
      minWidth: 80
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      align: 'start',
      enableSorting: true,
      minWidth: 128
    },
    {
      id: 'size',
      accessorKey: 'size',
      header: 'Size',
      align: 'end',
      enableSorting: true,
      minWidth: 88
    },
    {
      id: 'source',
      accessorKey: 'source',
      header: 'Source',
      align: 'start',
      enableSorting: true,
      minWidth: 128
    },
    {
      id: 'submitter',
      accessorKey: 'submitter',
      header: 'First submitter',
      align: 'start',
      enableSorting: true,
      minWidth: 128
    },
    {
      id: 'lastSeen',
      accessorKey: 'lastSeen',
      header: 'Last seen',
      align: 'start',
      enableSorting: true,
      minWidth: 136
    }
  ]

  const rows = computed(() =>
    submissions.filter(
      (row) =>
        (status.value === 'all' ||
          (status.value === 'analyzing') === (row.verdict === 'pending')) &&
        (verdict.value === 'all' || row.verdict === verdict.value) &&
        (source.value === 'all' || row.source === source.value)
    )
  )

  const count = new Intl.NumberFormat('en-US')

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const UNITS = ['B', 'KB', 'MB', 'GB']

  const formatters = {
    count: (value) => count.format(value),
    compact: (value) => compact.format(value),
    score: (value) => (value === null ? '—' : String(value)),
    size: (value) => {
      let size = value
      let unit = 0
      while (size >= 1000 && unit < UNITS.length - 1) {
        size /= 1000
        unit += 1
      }
      return `${size.toFixed(unit ? 1 : 0)} ${UNITS[unit]}`
    }
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Scan results"
        description="Items sent for analysis inline and through the API, their verdicts, the deliveries held for a verdict and the items delivered before they were flagged."
      >
        <template #actions>
          <IconButton
            icon="pi pi-refresh"
            kind="outlined"
            size="medium"
            aria-label="Refresh"
          />
        </template>
      </PageHeader>

      <section aria-label="Summary">
        <ul
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <li
            v-for="figure in figures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="figure.value"
              :format-value="formatters.compact"
              :loading="loading"
            >
              <template #aside>
                <Hint :text="figure.description" />
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Verdicts</ChartCard.Title>
              <Hint text="Every item analyzed in the period, by the verdict it received." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <DonutChart
              :series="verdictSplit"
              :format-value="formatters.compact"
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
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Sources</ChartCard.Title>
              <Hint
                text="Where the items came from: scanned inline, sent through the API, uploaded by hand or picked up by a scheduled scan."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="sourceItems"
              :format-value="formatters.compact"
              empty-title="No items yet"
              :loading="loading"
              aria-label="Sources"
            />
          </ChartCard.Content>
        </ChartCard>

        <div class="lg:col-span-4">
          <Card title="Held and flagged">
            <template #content>
              <div
                v-if="loading"
                aria-busy="true"
                class="flex flex-col gap-(--spacing-sm)"
              >
                <Skeleton
                  width="90%"
                  height="1rem"
                />
                <Skeleton
                  width="30%"
                  height="1rem"
                />
                <Skeleton
                  width="80%"
                  height="1rem"
                />
                <Skeleton
                  width="40%"
                  height="1rem"
                />
              </div>
              <div
                v-else
                class="flex flex-col gap-(--spacing-md)"
              >
                <div class="flex flex-col items-start gap-(--spacing-xxs)">
                  <p class="text-pretty text-body-sm text-(--text-default)">
                    {{ formatters.count(summary.held) }} deliveries held for a verdict now,
                    {{ formatters.count(summary.heldLast24h) }} in the last 24 hours.
                  </p>
                  <Link
                    label="Held deliveries"
                    href="#held"
                    size="small"
                    :show-icon="false"
                  />
                </div>
                <div class="flex flex-col items-start gap-(--spacing-xxs)">
                  <p class="text-pretty text-body-sm text-(--text-default)">
                    {{ formatters.count(summary.alertsOpen) }} open alerts of
                    {{ formatters.count(summary.alertsTotal) }} for items delivered before they were
                    flagged.
                  </p>
                  <Link
                    label="Early delivery alerts"
                    href="#alerts"
                    size="small"
                    :show-icon="false"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Submissions</ChartCard.Title>
              <Hint
                text="Every item sent for analysis, newest first, with its verdict and where it came from."
              />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <div
              v-if="loading || submissions.length"
              class="flex min-w-0 flex-col gap-(--spacing-sm)"
            >
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <div class="min-w-36 grow basis-(--container-3xs)">
                  <Input
                    v-model="search"
                    size="medium"
                    placeholder="Search by name or submitter"
                    aria-label="Search by name or submitter"
                  >
                    <template #iconLeft>
                      <i
                        class="pi pi-search"
                        aria-hidden="true"
                      />
                    </template>
                  </Input>
                </div>
                <div class="w-full sm:w-44">
                  <Select
                    v-model="status"
                    size="medium"
                    :display-value="
                      (value) =>
                        statusOptions.find((option) => option.value === value)?.label ?? value
                    "
                  >
                    <Select.Trigger aria-label="Status" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                </div>
                <div class="w-full sm:w-44">
                  <Select
                    v-model="verdict"
                    size="medium"
                    :display-value="
                      (value) =>
                        verdictOptions.find((option) => option.value === value)?.label ?? value
                    "
                  >
                    <Select.Trigger aria-label="Verdict" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in verdictOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                </div>
                <div class="w-full sm:w-44">
                  <Select
                    v-model="source"
                    size="medium"
                    :display-value="
                      (value) =>
                        sourceOptions.find((option) => option.value === value)?.label ?? value
                    "
                  >
                    <Select.Trigger aria-label="Source" />
                    <Select.Content>
                      <Select.Option
                        v-for="option in sourceOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                </div>
              </div>
              <TableRoot
                v-model:global-filter="search"
                :data="rows"
                :columns="submissionColumns"
                row-key="id"
                enable-sorting
                paginated
                :page-size="10"
                :rows-per-page-options="[10, 25, 50]"
                header-kind="compact"
                bordered
                :loading="loading"
              >
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="pi pi-search"
                    title="No matching items"
                    description="Change the search or the filters."
                  />
                </template>
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <i
                      class="pi pi-file shrink-0 text-body-lg text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="truncate">{{ row.name }}</span>
                  </div>
                </template>
                <template #cell-verdict="{ row }">
                  <Table.CellStatus
                    :label="verdicts[row.verdict].label"
                    :severity="verdicts[row.verdict].severity"
                  />
                </template>
                <template #cell-score="{ row }">
                  <span class="tabular-nums">{{ formatters.score(row.score) }}</span>
                </template>
                <template #cell-size="{ row }">
                  <span class="tabular-nums">{{ formatters.size(row.size) }}</span>
                </template>
                <template #cell-source="{ row }">
                  {{ sources[row.source] }}
                </template>
                <template #cell-lastSeen="{ row }">
                  <time
                    class="tabular-nums"
                    :datetime="row.lastSeen"
                    >{{ row.lastSeen }}</time
                  >
                </template>
              </TableRoot>
            </div>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-file"
              title="No items yet"
              description="Items sent for analysis inline or through the API appear here."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </main>
  </div>
</template>
```
