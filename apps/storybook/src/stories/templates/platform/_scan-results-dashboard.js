import BarList from '@aziontech/webkit/bar-list'
import CardBox from '@aziontech/webkit/card-box'
import ChartCard, {
  ChartCardContent,
  ChartCardControls,
  ChartCardHeader,
  ChartCardTitle
} from '@aziontech/webkit/chart-card'
import DonutChart from '@aziontech/webkit/donut-chart'
import EmptyState from '@aziontech/webkit/empty-state'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import Link from '@aziontech/webkit/link'
import Select from '@aziontech/webkit/select'
import Skeleton from '@aziontech/webkit/skeleton'
import StatTile from '@aziontech/webkit/stat-tile'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import { computed, ref } from 'vue'

export const SCAN_COMPONENTS = {
  BarList,
  CardBox,
  ChartCard,
  'ChartCard.Header': ChartCardHeader,
  'ChartCard.Title': ChartCardTitle,
  'ChartCard.Controls': ChartCardControls,
  'ChartCard.Content': ChartCardContent,
  DonutChart,
  EmptyState,
  Hint,
  IconButton,
  InputText,
  Link,
  Select,
  'Select.Trigger': Select.Trigger,
  'Select.Content': Select.Content,
  'Select.Option': Select.Option,
  Skeleton,
  StatTile,
  TableRoot,
  Tag
}

const IMPORTS = [
  "import BarList from '@aziontech/webkit/bar-list'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import ChartCard from '@aziontech/webkit/chart-card'",
  "import DonutChart from '@aziontech/webkit/donut-chart'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import Hint from '@aziontech/webkit/hint'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Link from '@aziontech/webkit/link'",
  "import Select from '@aziontech/webkit/select'",
  "import Skeleton from '@aziontech/webkit/skeleton'",
  "import StatTile from '@aziontech/webkit/stat-tile'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { computed, ref } from 'vue'"
]

const VERDICTS = {
  clean: { label: 'Clean', severity: 'success', color: 'success' },
  suspicious: { label: 'Suspicious', severity: 'warning', color: 'warning' },
  flagged: { label: 'Flagged', severity: 'danger', color: 'danger' },
  pending: { label: 'Pending', severity: 'secondary', color: 'other' }
}

const SOURCES = {
  inline: 'Inline scan',
  api: 'API submission',
  upload: 'Manual upload',
  scheduled: 'Scheduled scan'
}

const SUBMISSIONS = [
  [
    'quarterly-report.pdf',
    'clean',
    'Document',
    4,
    'PDF',
    2_480_000,
    'inline',
    'ana.ribeiro',
    '2026-11-10 13:42'
  ],
  [
    'installer-setup.exe',
    'flagged',
    'Trojan',
    96,
    'Executable',
    18_300_000,
    'inline',
    'mark.chen',
    '2026-11-10 13:18'
  ],
  [
    'invoice-0425.docm',
    'suspicious',
    'Macro',
    71,
    'Office document',
    184_000,
    'upload',
    'lucia.alves',
    '2026-11-10 12:57'
  ],
  [
    'build-artifacts.zip',
    'pending',
    '—',
    null,
    'Archive',
    46_700_000,
    'api',
    'ci-runner',
    '2026-11-10 12:51'
  ],
  [
    'team-photo.png',
    'clean',
    'Image',
    1,
    'Image',
    3_120_000,
    'inline',
    'sam.okafor',
    '2026-11-10 12:33'
  ],
  [
    'update-helper.dll',
    'flagged',
    'Ransomware',
    99,
    'Library',
    912_000,
    'api',
    'ci-runner',
    '2026-11-10 11:46'
  ],
  [
    'pricing-model.xlsx',
    'clean',
    'Spreadsheet',
    6,
    'Office document',
    640_000,
    'upload',
    'priya.nair',
    '2026-11-10 11:20'
  ],
  [
    'run-me.sh',
    'suspicious',
    'Script',
    63,
    'Script',
    4_200,
    'inline',
    'david.kim',
    '2026-11-10 10:58'
  ],
  [
    'meeting-notes.txt',
    'clean',
    'Text',
    0,
    'Text',
    12_800,
    'scheduled',
    'scheduler',
    '2026-11-10 10:12'
  ],
  [
    'browser-extension.crx',
    'suspicious',
    'Adware',
    58,
    'Extension',
    1_740_000,
    'inline',
    'mark.chen',
    '2026-11-10 09:47'
  ],
  [
    'backup-2026-11.tar.gz',
    'pending',
    '—',
    null,
    'Archive',
    128_000_000,
    'scheduled',
    'scheduler',
    '2026-11-10 09:30'
  ],
  [
    'driver-package.msi',
    'clean',
    'Installer',
    9,
    'Installer',
    22_600_000,
    'api',
    'ci-runner',
    '2026-11-10 08:54'
  ]
].map(([name, verdict, category, score, type, size, source, submitter, lastSeen], index) => ({
  id: `submission-${String(index + 1).padStart(2, '0')}`,
  name,
  verdict,
  category,
  score,
  type,
  size,
  source,
  submitter,
  lastSeen
}))

const SUMMARY = {
  submitted: 18_420,
  analyzing: 37,
  last24h: 1_284,
  flagged: 212,
  held: 9,
  heldLast24h: 46,
  alertsOpen: 3,
  alertsTotal: 14,
  verdicts: { clean: 16_930, suspicious: 1_241, flagged: 212, pending: 37 },
  sources: { inline: 11_640, api: 4_380, upload: 1_620, scheduled: 780 }
}

const FIGURES = [
  {
    id: 'submitted',
    label: 'Submitted',
    description: 'Items sent for analysis in the selected period.',
    key: 'submitted'
  },
  {
    id: 'analyzing',
    label: 'In analysis',
    description: 'Items waiting for a verdict right now.',
    key: 'analyzing'
  },
  {
    id: 'last-24h',
    label: 'Last 24 hours',
    description: 'Items submitted in the last 24 hours.',
    key: 'last24h'
  },
  {
    id: 'flagged',
    label: 'Flagged',
    description: 'Items whose verdict marks them as harmful.',
    key: 'flagged'
  },
  {
    id: 'held',
    label: 'Held for a verdict',
    description: 'Deliveries paused until their analysis finishes.',
    key: 'held'
  },
  {
    id: 'alerts',
    label: 'Open alerts',
    description: 'Items delivered before they were flagged that nobody has reviewed yet.',
    key: 'alertsOpen'
  }
]

const SUBMISSION_COLUMNS = [
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

const STATUS_OPTIONS = [
  { value: 'all', label: 'Any status' },
  { value: 'analyzing', label: 'In analysis' },
  { value: 'completed', label: 'Completed' }
]

const VERDICT_OPTIONS = [
  { value: 'all', label: 'Any verdict' },
  ...Object.entries(VERDICTS)
    .filter(([value]) => value !== 'pending')
    .map(([value, { label }]) => ({ value, label }))
]

const SOURCE_OPTIONS = [
  { value: 'all', label: 'Any source' },
  ...Object.entries(SOURCES).map(([value, label]) => ({ value, label }))
]

const count = new Intl.NumberFormat('en-US')

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

const UNITS = ['B', 'KB', 'MB', 'GB']

export const formatters = {
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

const FORMATTERS_SOURCE = `const count = new Intl.NumberFormat('en-US')

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
    return \`\${size.toFixed(unit ? 1 : 0)} \${UNITS[unit]}\`
  }
}`

const STATES = {
  default: { loading: false, empty: false },
  loading: { loading: true, empty: false },
  empty: { loading: false, empty: true }
}

const dataFor = (state) => {
  const { loading, empty } = STATES[state]
  const summary = empty
    ? {
        ...Object.fromEntries(Object.keys(SUMMARY).map((key) => [key, 0])),
        verdicts: {},
        sources: {}
      }
    : SUMMARY
  return {
    loading,
    summary: {
      held: summary.held,
      heldLast24h: summary.heldLast24h,
      alertsOpen: summary.alertsOpen,
      alertsTotal: summary.alertsTotal
    },
    figures: FIGURES.map(({ key, ...figure }) => ({ ...figure, value: summary[key] })),
    verdictSplit: Object.entries(summary.verdicts).map(([id, value]) => ({
      id,
      name: VERDICTS[id].label,
      color: VERDICTS[id].color,
      values: [value]
    })),
    sourceItems: Object.entries(summary.sources).map(([id, value]) => ({
      id,
      name: SOURCES[id],
      value
    })),
    submissions: empty ? [] : SUBMISSIONS,
    submissionColumns: SUBMISSION_COLUMNS,
    verdicts: VERDICTS,
    sources: SOURCES,
    statusOptions: STATUS_OPTIONS,
    verdictOptions: VERDICT_OPTIONS,
    sourceOptions: SOURCE_OPTIONS
  }
}

const matches = (submissions, status, verdict, source) =>
  submissions.filter(
    (row) =>
      (status === 'all' || (status === 'analyzing') === (row.verdict === 'pending')) &&
      (verdict === 'all' || row.verdict === verdict) &&
      (source === 'all' || row.source === source)
  )

const MATCHES_SOURCE = `const rows = computed(() =>
  submissions.filter(
    (row) =>
      (status.value === 'all' || (status.value === 'analyzing') === (row.verdict === 'pending')) &&
      (verdict.value === 'all' || row.verdict === verdict.value) &&
      (source.value === 'all' || row.source === source.value)
  )
)`

export const scanSetup = (state) => () => {
  const data = dataFor(state)
  const search = ref('')
  const status = ref('all')
  const verdict = ref('all')
  const source = ref('all')
  const rows = computed(() => matches(data.submissions, status.value, verdict.value, source.value))
  return { ...data, formatters, search, status, verdict, source, rows }
}

const literal = (name, value) => `const ${name} = ${JSON.stringify(value, null, 2)}`

export const scanScript = (state) => {
  const data = dataFor(state)
  return [
    ...IMPORTS,
    '',
    `const loading = ${data.loading}`,
    "const search = ref('')",
    "const status = ref('all')",
    "const verdict = ref('all')",
    "const source = ref('all')",
    '',
    literal('summary', data.summary),
    '',
    literal('figures', data.figures),
    '',
    literal('verdictSplit', data.verdictSplit),
    '',
    literal('sourceItems', data.sourceItems),
    '',
    literal('verdicts', data.verdicts),
    '',
    literal('sources', data.sources),
    '',
    literal('statusOptions', data.statusOptions),
    '',
    literal('verdictOptions', data.verdictOptions),
    '',
    literal('sourceOptions', data.sourceOptions),
    '',
    literal('submissions', data.submissions),
    '',
    literal('submissionColumns', data.submissionColumns),
    '',
    MATCHES_SOURCE,
    '',
    FORMATTERS_SOURCE
  ]
}

const cardHeader = (title, description) => `<ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>${title}</ChartCard.Title>
            <Hint text="${description}" />
          </span>
        </ChartCard.Header>`

const filterSelect = (model, options, label) => `<div class="w-full sm:w-44">
                <Select
                  v-model="${model}"
                  size="medium"
                  :display-value="(value) => ${options}.find((option) => option.value === value)?.label ?? value"
                >
                  <Select.Trigger aria-label="${label}" />
                  <Select.Content>
                    <Select.Option v-for="option in ${options}" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </Select.Option>
                  </Select.Content>
                </Select>
              </div>`

export const SCAN_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex flex-col gap-(--layout-group-gap)">
    <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
      <div class="flex min-w-0 grow basis-(--container-md) flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-sm text-(--text-default)">Scan results</h1>
        <p class="text-pretty text-body-sm text-(--text-muted)">
          Items sent for analysis inline and through the API, their verdicts, the deliveries held for a verdict and the items delivered before they were flagged.
        </p>
      </div>
      <IconButton icon="pi pi-refresh" kind="outlined" size="medium" aria-label="Refresh" />
    </header>

    <section aria-label="Summary">
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <li v-for="figure in figures" :key="figure.id" class="flex min-w-0 flex-col">
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

    <div class="grid grid-cols-1 items-stretch gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]">
      <ChartCard :span="4">
        ${cardHeader('Verdicts', 'Every item analyzed in the period, by the verdict it received.')}
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
        ${cardHeader('Sources', 'Where the items came from: scanned inline, sent through the API, uploaded by hand or picked up by a scheduled scan.')}
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

      <CardBox title="Held and flagged" class="lg:col-span-4">
        <template #content>
          <div v-if="loading" aria-busy="true" class="flex flex-col gap-(--spacing-sm)">
            <Skeleton width="90%" height="1rem" />
            <Skeleton width="30%" height="1rem" />
            <Skeleton width="80%" height="1rem" />
            <Skeleton width="40%" height="1rem" />
          </div>
          <div v-else class="flex flex-col gap-(--spacing-md)">
            <div class="flex flex-col items-start gap-(--spacing-xxs)">
              <p class="text-pretty text-body-sm text-(--text-default)">
                {{ formatters.count(summary.held) }} deliveries held for a verdict now, {{ formatters.count(summary.heldLast24h) }} in the last 24 hours.
              </p>
              <Link label="Held deliveries" href="#held" size="small" :show-icon="false" />
            </div>
            <div class="flex flex-col items-start gap-(--spacing-xxs)">
              <p class="text-pretty text-body-sm text-(--text-default)">
                {{ formatters.count(summary.alertsOpen) }} open alerts of {{ formatters.count(summary.alertsTotal) }} for items delivered before they were flagged.
              </p>
              <Link label="Early delivery alerts" href="#alerts" size="small" :show-icon="false" />
            </div>
          </div>
        </template>
      </CardBox>

      <ChartCard :span="12">
        ${cardHeader('Submissions', 'Every item sent for analysis, newest first, with its verdict and where it came from.')}
        <ChartCard.Content>
          <div v-if="loading || submissions.length" class="flex min-w-0 flex-col gap-(--spacing-sm)">
            <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
              <div class="min-w-36 grow basis-(--container-3xs)">
                <InputText
                  v-model="search"
                  size="medium"
                  placeholder="Search by name or submitter"
                  aria-label="Search by name or submitter"
                >
                  <template #iconLeft>
                    <i class="pi pi-search" aria-hidden="true" />
                  </template>
                </InputText>
              </div>
              ${filterSelect('status', 'statusOptions', 'Status')}
              ${filterSelect('verdict', 'verdictOptions', 'Verdict')}
              ${filterSelect('source', 'sourceOptions', 'Source')}
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
              border
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
                  <i class="pi pi-file shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
                  <span class="truncate">{{ row.name }}</span>
                </div>
              </template>
              <template #cell-verdict="{ row }">
                <Tag :label="verdicts[row.verdict].label" :severity="verdicts[row.verdict].severity" size="small" />
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
                <time class="tabular-nums" :datetime="row.lastSeen">{{ row.lastSeen }}</time>
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
</div>`
