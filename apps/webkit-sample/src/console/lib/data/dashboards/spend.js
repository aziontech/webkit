export const SPEND_MONTHS = [
  'Dec',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov'
]

export const SPEND_RANGES = [
  { label: 'Last 12 months', value: '12m' },
  { label: 'Last 6 months', value: '6m' },
  { label: 'This year', value: 'ytd' }
]

export const SPEND_DEFAULT_RANGE = '12m'

export const SPEND_COMPARISON = 'vs previous month'

export const SPEND_FORMS = [
  { label: 'Area', value: 'area' },
  { label: 'Bar', value: 'bar' }
]

export const SPEND_EMPTY = {
  title: 'No spend in this range',
  description: 'Nothing was billed to the account in the selected period.'
}

const CATEGORIES = [
  {
    id: 'applications',
    name: 'Applications',
    icon: 'ai ai-edge-application',
    values: [
      11_800, 12_100, 12_400, 12_900, 13_300, 13_700, 14_200, 14_600, 15_100, 15_500, 16_200, 16_900
    ]
  },
  {
    id: 'functions',
    name: 'Functions',
    icon: 'ai ai-edge-functions',
    values: [7_200, 7_300, 7_500, 7_600, 7_800, 8_000, 8_100, 8_300, 8_600, 8_800, 9_100, 9_400]
  },
  {
    id: 'object-storage',
    name: 'Object Storage',
    icon: 'ai ai-edge-storage',
    values: [4_100, 4_300, 4_400, 4_600, 4_800, 5_000, 5_100, 5_300, 5_500, 5_600, 5_800, 6_000]
  },
  {
    id: 'waf',
    name: 'WAF',
    icon: 'ai ai-waf-rules',
    values: [3_000, 2_900, 3_100, 3_200, 3_400, 3_300, 3_500, 3_700, 3_600, 3_800, 3_900, 4_100]
  },
  {
    id: 'data-stream',
    name: 'Data Stream',
    icon: 'ai ai-data-stream',
    values: [1_500, 1_500, 1_600, 1_600, 1_700, 1_700, 1_800, 1_800, 1_900, 1_900, 2_000, 2_100]
  }
]

const LAST = SPEND_MONTHS.length - 1

const RANGE_START = {
  '12m': 0,
  '6m': SPEND_MONTHS.length - 6,
  ytd: SPEND_MONTHS.indexOf('Jan')
}

const percentChange = (current, previous) =>
  previous ? Math.round(((current - previous) / previous) * 10_000) / 100 : 0

const TOTALS = SPEND_MONTHS.map((_, index) =>
  CATEGORIES.reduce((sum, category) => sum + category.values[index], 0)
)

const TOTAL = TOTALS[LAST]

const CATEGORY_OF = Object.fromEntries(CATEGORIES.map((category) => [category.id, category]))

const CONTRIBUTORS = [
  ['azion-com-prod', 'applications', 6_200, 5_900],
  ['storefront-checkout', 'applications', 5_900, 5_600],
  ['image-resizer', 'functions', 5_400, 5_100],
  ['payments-api', 'applications', 4_800, 4_700],
  ['auth-middleware', 'functions', 4_000, 4_000],
  ['media-assets', 'object-storage', 3_700, 3_400],
  ['azion-com-firewall', 'waf', 2_600, 2_500],
  ['build-artifacts', 'object-storage', 2_300, 2_400],
  ['access-logs-stream', 'data-stream', 2_100, 2_000],
  ['payments-firewall', 'waf', 1_500, 1_400]
].map(([name, category, amount, previous], index) => ({
  id: name,
  rank: index + 1,
  name,
  icon: CATEGORY_OF[category].icon,
  category: CATEGORY_OF[category].name,
  amount,
  share: Math.round((amount / TOTAL) * 1_000) / 10,
  change: percentChange(amount, previous)
}))

export const SPEND_CONTRIBUTOR_COLUMNS = [
  {
    id: 'rank',
    accessorKey: 'rank',
    header: 'Rank',
    align: 'start',
    enableSorting: true,
    minWidth: 64
  },
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
    id: 'category',
    accessorKey: 'category',
    header: 'Product',
    align: 'start',
    enableSorting: true,
    minWidth: 120
  },
  {
    id: 'amount',
    accessorKey: 'amount',
    header: 'Amount',
    align: 'end',
    enableSorting: true,
    minWidth: 104
  },
  {
    id: 'share',
    accessorKey: 'share',
    header: 'Share of total',
    align: 'start',
    enableSorting: true,
    minWidth: 160
  },
  {
    id: 'change',
    accessorKey: 'change',
    header: 'Change',
    align: 'end',
    enableSorting: true,
    minWidth: 104
  }
]

const spendFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1
})

const amountFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
})

export const SPEND_FORMATTERS = {
  spend: (value) => spendFormat.format(value),
  amount: (value) => amountFormat.format(value),
  share: (value) => `${value.toFixed(1)}%`,
  change: (value) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export const changeSeverity = (change) =>
  change > 0 ? 'danger' : change < 0 ? 'success' : 'secondary'

export const changeIcon = (change) =>
  change > 0 ? 'pi pi-arrow-up-right' : change < 0 ? 'pi pi-arrow-down-right' : 'pi pi-minus'

const startOf = (range) => RANGE_START[range] ?? 0

export const resolveSpendLabels = (range) => SPEND_MONTHS.slice(startOf(range))

const figureOf = (id, label, description, values, range) => ({
  id,
  label,
  description,
  value: values[LAST],
  delta: percentChange(values[LAST], values[LAST - 1]),
  trend: values.slice(startOf(range))
})

export const resolveSpendFigures = (range, { empty = false } = {}) => {
  const figures = [
    figureOf('total', 'Total spend', 'Everything billed to the account this month.', TOTALS, range),
    ...CATEGORIES.slice(0, 3).map((category) =>
      figureOf(
        category.id,
        category.name,
        `Spend on ${category.name} this month, the share of the total it carries.`,
        category.values,
        range
      )
    )
  ]
  return empty
    ? figures.map((figure) => ({ ...figure, value: null, delta: null, trend: [] }))
    : figures
}

export const resolveSpendSeries = (range, { empty = false } = {}) =>
  empty
    ? []
    : CATEGORIES.map(({ id, name, values }) => ({ id, name, values: values.slice(startOf(range)) }))

export const resolveSpendSplit = ({ empty = false } = {}) =>
  empty ? [] : CATEGORIES.map(({ id, name, values }) => ({ id, name, values: [values[LAST]] }))

export const resolveSpendContributors = ({ empty = false } = {}) => (empty ? [] : CONTRIBUTORS)
