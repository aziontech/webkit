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
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
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
              empty-title="No item yet"
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
                  <Tag
                    :label="verdicts[row.verdict].label"
                    :severity="verdicts[row.verdict].severity"
                    size="small"
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
              title="No item yet"
              description="Items sent for analysis inline or through the API appear here."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </main>
  </div>
</template>
