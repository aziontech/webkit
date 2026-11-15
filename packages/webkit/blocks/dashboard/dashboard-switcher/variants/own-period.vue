<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import BarList, { type BarListItem } from '@aziontech/webkit/bar-list'
  import Chart, { type ChartColor, type ChartSeries } from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import FilterMenu, {
    type FilterMenuField,
    type FilterMenuModel
  } from '@aziontech/webkit/filter-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import ToggleGroup, { type ToggleGroupOption } from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, onScopeDispose, ref, watch } from 'vue'

  type Period = '1h' | '24h' | '7d' | '30d'
  type Format = 'count' | 'bytes' | 'ms' | 'percent' | 'usd'
  type MarkForm = 'area' | 'bar' | 'line'

  interface Figure {
    id: string
    label: string
    hint: string
    base: number
    format: Format
    delta: number
    inverse?: boolean
  }

  interface SeriesSpec {
    id: string
    name: string
    base: number
    color?: ChartColor
  }

  interface Dashboard {
    value: string
    label: string
    group: string
    ownPeriod?: boolean
    figures: Figure[]
    chart: { title: string; hint: string; form: MarkForm; format: Format; series: SeriesSpec[] }
    breakdown: { title: string; hint: string; format: Format; items: BarListItem[] }
  }

  const periods: Array<{ value: Period; label: string; comparison: string; factor: number }> = [
    { value: '1h', label: 'Last hour', comparison: 'vs previous hour', factor: 1 / 24 },
    { value: '24h', label: 'Last 24 hours', comparison: 'vs previous 24 hours', factor: 1 },
    { value: '7d', label: 'Last 7 days', comparison: 'vs previous 7 days', factor: 7 },
    { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days', factor: 30 }
  ]

  const defaultPeriod: Period = '24h'

  const timelines: Record<Period, { points: number; stepHours: number }> = {
    '1h': { points: 12, stepHours: 1 / 12 },
    '24h': { points: 24, stepHours: 1 },
    '7d': { points: 28, stepHours: 6 },
    '30d': { points: 30, stepHours: 24 }
  }

  const quarters: ToggleGroupOption[] = [
    { label: 'Q2 2026', value: 'q2' },
    { label: 'Q3 2026', value: 'q3' },
    { label: 'Q4 2026', value: 'q4' }
  ]

  const quarterFactor: Record<string, number> = { q2: 0.86, q3: 0.94, q4: 1 }

  const dashboards: Dashboard[] = [
    {
      value: 'traffic',
      label: 'Traffic',
      group: 'Platform',
      figures: [
        {
          id: 'requests',
          label: 'Requests',
          hint: 'Requests served by every workload.',
          base: 4_820_000,
          format: 'count',
          delta: 6.4
        },
        {
          id: 'data',
          label: 'Data transferred',
          hint: 'Bytes delivered to users.',
          base: 912_000_000_000,
          format: 'bytes',
          delta: 3.1
        },
        {
          id: 'cache',
          label: 'Cache hit ratio',
          hint: 'Share of requests served from cache.',
          base: 87.4,
          format: 'percent',
          delta: 1.2
        },
        {
          id: 'errors',
          label: '5xx errors',
          hint: 'Requests that ended with a server error.',
          base: 1_240,
          format: 'count',
          delta: -8.5,
          inverse: true
        }
      ],
      chart: {
        title: 'Requests over time',
        hint: 'Requests per interval, cached and served by the origin.',
        form: 'area',
        format: 'count',
        series: [
          { id: 'cached', name: 'Cached', base: 168_000 },
          { id: 'origin', name: 'Origin', base: 32_000 }
        ]
      },
      breakdown: {
        title: 'Top hosts',
        hint: 'Hosts that served the most requests in the period.',
        format: 'count',
        items: [
          { name: 'www.example.com', value: 2_140_000 },
          { name: 'api.example.com', value: 1_380_000 },
          { name: 'app.example.com', value: 820_000 },
          { name: 'docs.example.com', value: 310_000 },
          { name: 'status.example.com', value: 170_000 }
        ]
      }
    },
    {
      value: 'usage',
      label: 'Usage',
      group: 'Platform',
      figures: [
        {
          id: 'bandwidth',
          label: 'Bandwidth',
          hint: 'Bytes billed for delivery.',
          base: 1_420_000_000_000,
          format: 'bytes',
          delta: 4.8
        },
        {
          id: 'invocations',
          label: 'Function invocations',
          hint: 'Times a function ran.',
          base: 2_310_000,
          format: 'count',
          delta: 9.2
        },
        {
          id: 'storage',
          label: 'Storage',
          hint: 'Bytes stored across buckets at the end of the period.',
          base: 318_000_000_000,
          format: 'bytes',
          delta: 2.4
        },
        {
          id: 'images',
          label: 'Images processed',
          hint: 'Images resized or converted on request.',
          base: 486_000,
          format: 'count',
          delta: -1.6
        }
      ],
      chart: {
        title: 'Bandwidth over time',
        hint: 'Bytes billed per interval, by delivery tier.',
        form: 'bar',
        format: 'bytes',
        series: [
          { id: 'standard', name: 'Standard', base: 44_000_000_000 },
          { id: 'premium', name: 'Premium', base: 15_000_000_000 }
        ]
      },
      breakdown: {
        title: 'Usage by workload',
        hint: 'Bandwidth billed per workload in the period.',
        format: 'bytes',
        items: [
          { name: 'acme-store', value: 640_000_000_000 },
          { name: 'docs-site', value: 310_000_000_000 },
          { name: 'site-assets', value: 260_000_000_000 },
          { name: 'staging', value: 120_000_000_000 },
          { name: 'production-api', value: 90_000_000_000 }
        ]
      }
    },
    {
      value: 'health',
      label: 'Edge health',
      group: 'Platform',
      figures: [
        {
          id: 'availability',
          label: 'Availability',
          hint: 'Share of health checks that passed.',
          base: 99.96,
          format: 'percent',
          delta: 0.02
        },
        {
          id: 'latency',
          label: 'p95 latency',
          hint: 'Time to first byte for 95 percent of requests.',
          base: 182,
          format: 'ms',
          delta: -4.1,
          inverse: true
        },
        {
          id: 'error-rate',
          label: 'Error rate',
          hint: 'Share of requests that ended with a 5xx.',
          base: 0.08,
          format: 'percent',
          delta: -12.0,
          inverse: true
        },
        {
          id: 'alerts',
          label: 'Open alerts',
          hint: 'Alerts firing now.',
          base: 3,
          format: 'count',
          delta: 50.0,
          inverse: true
        }
      ],
      chart: {
        title: 'Latency over time',
        hint: 'Time to first byte per interval, median and 95th percentile.',
        form: 'line',
        format: 'ms',
        series: [
          { id: 'p50', name: 'p50', base: 64 },
          { id: 'p95', name: 'p95', base: 182 }
        ]
      },
      breakdown: {
        title: 'Slowest regions',
        hint: 'p95 latency per region in the period.',
        format: 'ms',
        items: [
          { name: 'South America', value: 241 },
          { name: 'Asia Pacific', value: 228 },
          { name: 'Africa', value: 214 },
          { name: 'Europe', value: 156 },
          { name: 'North America', value: 132 }
        ]
      }
    },
    {
      value: 'score',
      label: 'Health score',
      group: 'Platform',
      figures: [
        {
          id: 'score',
          label: 'Health score',
          hint: 'Weighted score of availability, latency and errors, out of 100.',
          base: 92,
          format: 'count',
          delta: 2.2
        },
        {
          id: 'healthy',
          label: 'Healthy workloads',
          hint: 'Workloads scoring 90 or more.',
          base: 41,
          format: 'count',
          delta: 5.1
        },
        {
          id: 'degraded',
          label: 'Degraded workloads',
          hint: 'Workloads scoring under 90.',
          base: 6,
          format: 'count',
          delta: -14.3,
          inverse: true
        },
        {
          id: 'incidents',
          label: 'Incidents',
          hint: 'Incidents opened in the period.',
          base: 2,
          format: 'count',
          delta: 0
        }
      ],
      chart: {
        title: 'Score over time',
        hint: 'Average health score per interval.',
        form: 'line',
        format: 'count',
        series: [{ id: 'score', name: 'Health score', base: 92 }]
      },
      breakdown: {
        title: 'Lowest scores',
        hint: 'Workloads with the lowest health score in the period.',
        format: 'count',
        items: [
          { name: 'staging', value: 71 },
          { name: 'production-api', value: 84 },
          { name: 'site-assets', value: 88 },
          { name: 'docs-site', value: 93 },
          { name: 'acme-store', value: 96 }
        ]
      }
    },
    {
      value: 'threats',
      label: 'Threats',
      group: 'Security',
      figures: [
        {
          id: 'threats',
          label: 'Threats blocked',
          hint: 'Requests the firewall blocked.',
          base: 38_400,
          format: 'count',
          delta: 12.6,
          inverse: true
        },
        {
          id: 'bots',
          label: 'Bot requests',
          hint: 'Requests classified as automated.',
          base: 214_000,
          format: 'count',
          delta: 4.3,
          inverse: true
        },
        {
          id: 'challenged',
          label: 'Challenged',
          hint: 'Requests sent a challenge before being served.',
          base: 9_800,
          format: 'count',
          delta: -2.1
        },
        {
          id: 'ddos',
          label: 'DDoS events',
          hint: 'Volumetric attacks mitigated.',
          base: 1,
          format: 'count',
          delta: 0
        }
      ],
      chart: {
        title: 'Threats over time',
        hint: 'Requests per interval by firewall decision.',
        form: 'bar',
        format: 'count',
        series: [
          { id: 'blocked', name: 'Blocked', base: 1_600, color: 'danger' },
          { id: 'challenged', name: 'Challenged', base: 410, color: 'warning' }
        ]
      },
      breakdown: {
        title: 'Attack families',
        hint: 'Blocked requests per attack family.',
        format: 'count',
        items: [
          { name: 'SQL injection', value: 14_200 },
          { name: 'Cross-site scripting', value: 9_600 },
          { name: 'Path traversal', value: 6_100 },
          { name: 'Remote file inclusion', value: 4_800 },
          { name: 'Scanner', value: 3_700 }
        ]
      }
    },
    {
      value: 'activity',
      label: 'Activity outcomes',
      group: 'Security',
      figures: [
        {
          id: 'requests',
          label: 'Requests',
          hint: 'Requests the rules evaluated.',
          base: 18_600,
          format: 'count',
          delta: 7.9
        },
        {
          id: 'allowed',
          label: 'Allowed',
          hint: 'Requests the rules let through.',
          base: 16_900,
          format: 'count',
          delta: 8.4
        },
        {
          id: 'blocked',
          label: 'Blocked',
          hint: 'Requests the rules refused.',
          base: 1_420,
          format: 'count',
          delta: 3.6,
          inverse: true
        },
        {
          id: 'held',
          label: 'Held',
          hint: 'Requests held for a person to approve.',
          base: 280,
          format: 'count',
          delta: -6.0,
          inverse: true
        }
      ],
      chart: {
        title: 'Outcomes over time',
        hint: 'Requests per interval by the outcome the rules decided.',
        form: 'bar',
        format: 'count',
        series: [
          { id: 'allowed', name: 'Allowed', base: 700, color: 'success' },
          { id: 'blocked', name: 'Blocked', base: 60, color: 'danger' },
          { id: 'held', name: 'Held', base: 12, color: 'warning' }
        ]
      },
      breakdown: {
        title: 'Actors',
        hint: 'Requests per actor, every outcome included.',
        format: 'count',
        items: [
          { name: 'billing-agent', value: 6_400 },
          { name: 'support-agent', value: 5_200 },
          { name: 'Jane Doe', value: 3_100 },
          { name: 'deploy-bot', value: 2_600 },
          { name: 'Alex Morgan', value: 1_300 }
        ]
      }
    },
    {
      value: 'scans',
      label: 'Scan results',
      group: 'Security',
      figures: [
        {
          id: 'findings',
          label: 'Open findings',
          hint: 'Findings not yet resolved.',
          base: 64,
          format: 'count',
          delta: -9.8,
          inverse: true
        },
        {
          id: 'critical',
          label: 'Critical',
          hint: 'Open findings rated critical.',
          base: 3,
          format: 'count',
          delta: -25.0,
          inverse: true
        },
        {
          id: 'scanned',
          label: 'Assets scanned',
          hint: 'Assets covered by the last scan.',
          base: 412,
          format: 'count',
          delta: 2.0
        },
        {
          id: 'fixed',
          label: 'Fixed',
          hint: 'Findings resolved in the period.',
          base: 27,
          format: 'count',
          delta: 17.4
        }
      ],
      chart: {
        title: 'Findings over time',
        hint: 'Open findings per interval by severity.',
        form: 'area',
        format: 'count',
        series: [
          { id: 'high', name: 'High', base: 18, color: 'severity-high' },
          { id: 'medium', name: 'Medium', base: 29, color: 'severity-medium' },
          { id: 'low', name: 'Low', base: 14, color: 'severity-low' }
        ]
      },
      breakdown: {
        title: 'Findings by asset',
        hint: 'Open findings per asset.',
        format: 'count',
        items: [
          { name: 'api.example.com', value: 21 },
          { name: 'app.example.com', value: 17 },
          { name: 'www.example.com', value: 12 },
          { name: 'docs.example.com', value: 8 },
          { name: 'status.example.com', value: 6 }
        ]
      }
    },
    {
      value: 'summary',
      label: 'Executive summary',
      group: 'Business',
      ownPeriod: true,
      figures: [
        {
          id: 'revenue',
          label: 'Revenue',
          hint: 'Recognized revenue in the quarter.',
          base: 4_200_000,
          format: 'usd',
          delta: 11.2
        },
        {
          id: 'customers',
          label: 'Active customers',
          hint: 'Accounts with traffic in the quarter.',
          base: 1_840,
          format: 'count',
          delta: 6.8
        },
        {
          id: 'churn',
          label: 'Churn',
          hint: 'Share of accounts that left in the quarter.',
          base: 1.9,
          format: 'percent',
          delta: -10.5,
          inverse: true
        },
        {
          id: 'nps',
          label: 'NPS',
          hint: 'Net promoter score from the quarterly survey.',
          base: 48,
          format: 'count',
          delta: 4.3
        }
      ],
      chart: {
        title: 'Revenue over the quarter',
        hint: 'Recognized revenue per week, new and expansion.',
        form: 'bar',
        format: 'usd',
        series: [
          { id: 'new', name: 'New', base: 210_000 },
          { id: 'expansion', name: 'Expansion', base: 110_000 }
        ]
      },
      breakdown: {
        title: 'Revenue by plan',
        hint: 'Recognized revenue per plan in the quarter.',
        format: 'usd',
        items: [
          { name: 'Enterprise', value: 2_600_000 },
          { name: 'Business', value: 1_100_000 },
          { name: 'Pro', value: 420_000 },
          { name: 'Starter', value: 80_000 }
        ]
      }
    },
    {
      value: 'spend',
      label: 'Spend',
      group: 'Business',
      ownPeriod: true,
      figures: [
        {
          id: 'spend',
          label: 'Total spend',
          hint: 'Charges accrued in the quarter.',
          base: 182_000,
          format: 'usd',
          delta: 5.4,
          inverse: true
        },
        {
          id: 'forecast',
          label: 'Forecast',
          hint: 'Projected charges at the end of the quarter.',
          base: 196_000,
          format: 'usd',
          delta: 3.2,
          inverse: true
        },
        {
          id: 'budget',
          label: 'Budget used',
          hint: 'Share of the quarterly budget spent.',
          base: 72,
          format: 'percent',
          delta: 4.0,
          inverse: true
        },
        {
          id: 'savings',
          label: 'Savings',
          hint: 'Charges avoided by committed use.',
          base: 21_400,
          format: 'usd',
          delta: 8.1
        }
      ],
      chart: {
        title: 'Spend over the quarter',
        hint: 'Charges per week by category.',
        form: 'bar',
        format: 'usd',
        series: [
          { id: 'delivery', name: 'Delivery', base: 7_400 },
          { id: 'compute', name: 'Compute', base: 4_900 },
          { id: 'storage', name: 'Storage', base: 1_700 }
        ]
      },
      breakdown: {
        title: 'Spend by category',
        hint: 'Charges per category in the quarter.',
        format: 'usd',
        items: [
          { name: 'Delivery', value: 96_000 },
          { name: 'Compute', value: 63_000 },
          { name: 'Storage', value: 22_000 },
          { name: 'Support', value: 1_000 }
        ]
      }
    },
    {
      value: 'funnel',
      label: 'Funnel and cohorts',
      group: 'Business',
      figures: [
        {
          id: 'visits',
          label: 'Visits',
          hint: 'Sessions that reached the landing page.',
          base: 128_000,
          format: 'count',
          delta: 5.6
        },
        {
          id: 'signups',
          label: 'Sign-ups',
          hint: 'Visitors who created an account.',
          base: 3_420,
          format: 'count',
          delta: 9.1
        },
        {
          id: 'activated',
          label: 'Activated',
          hint: 'Accounts that deployed a first workload.',
          base: 1_180,
          format: 'count',
          delta: 4.7
        },
        {
          id: 'conversion',
          label: 'Conversion',
          hint: 'Share of visits that activated.',
          base: 0.92,
          format: 'percent',
          delta: -0.8
        }
      ],
      chart: {
        title: 'Sign-ups over time',
        hint: 'Sign-ups and activations per interval.',
        form: 'line',
        format: 'count',
        series: [
          { id: 'signups', name: 'Sign-ups', base: 140 },
          { id: 'activated', name: 'Activated', base: 49 }
        ]
      },
      breakdown: {
        title: 'Funnel steps',
        hint: 'People at each step of the funnel.',
        format: 'count',
        items: [
          { name: 'Visited', value: 128_000 },
          { name: 'Signed up', value: 3_420 },
          { name: 'Verified email', value: 2_610 },
          { name: 'Activated', value: 1_180 },
          { name: 'Upgraded', value: 214 }
        ]
      }
    },
    {
      value: 'project',
      label: 'Project status',
      group: 'Business',
      ownPeriod: true,
      figures: [
        {
          id: 'projects',
          label: 'Active projects',
          hint: 'Projects with work in the quarter.',
          base: 14,
          format: 'count',
          delta: 7.7
        },
        {
          id: 'on-track',
          label: 'On track',
          hint: 'Projects meeting their milestones.',
          base: 10,
          format: 'count',
          delta: 11.1
        },
        {
          id: 'at-risk',
          label: 'At risk',
          hint: 'Projects behind a milestone.',
          base: 3,
          format: 'count',
          delta: -25.0,
          inverse: true
        },
        {
          id: 'done',
          label: 'Milestones done',
          hint: 'Milestones closed in the quarter.',
          base: 38,
          format: 'count',
          delta: 18.8
        }
      ],
      chart: {
        title: 'Milestones over the quarter',
        hint: 'Milestones closed and opened per week.',
        form: 'bar',
        format: 'count',
        series: [
          { id: 'closed', name: 'Closed', base: 3 },
          { id: 'opened', name: 'Opened', base: 2 }
        ]
      },
      breakdown: {
        title: 'Open milestones by team',
        hint: 'Milestones still open per team.',
        format: 'count',
        items: [
          { name: 'Platform', value: 9 },
          { name: 'Security', value: 7 },
          { name: 'Billing', value: 5 },
          { name: 'Docs', value: 3 }
        ]
      }
    },
    {
      value: 'custom',
      label: 'Custom',
      group: 'Yours',
      figures: [
        {
          id: 'requests',
          label: 'Requests',
          hint: 'Requests served by every workload.',
          base: 4_820_000,
          format: 'count',
          delta: 6.4
        },
        {
          id: 'threats',
          label: 'Threats blocked',
          hint: 'Requests the firewall blocked.',
          base: 38_400,
          format: 'count',
          delta: 12.6,
          inverse: true
        },
        {
          id: 'latency',
          label: 'p95 latency',
          hint: 'Time to first byte for 95 percent of requests.',
          base: 182,
          format: 'ms',
          delta: -4.1,
          inverse: true
        },
        {
          id: 'spend',
          label: 'Spend',
          hint: 'Charges accrued in the period.',
          base: 6_100,
          format: 'usd',
          delta: 5.4,
          inverse: true
        }
      ],
      chart: {
        title: 'Requests and threats',
        hint: 'Requests and blocked threats per interval.',
        form: 'line',
        format: 'count',
        series: [
          { id: 'requests', name: 'Requests', base: 200_000 },
          { id: 'threats', name: 'Threats blocked', base: 1_600 }
        ]
      },
      breakdown: {
        title: 'Top countries',
        hint: 'Countries that sent the most requests in the period.',
        format: 'count',
        items: [
          { name: 'United States', value: 1_920_000 },
          { name: 'Germany', value: 640_000 },
          { name: 'Japan', value: 520_000 },
          { name: 'Brazil', value: 410_000 },
          { name: 'India', value: 380_000 }
        ]
      }
    }
  ]

  const groups = [...new Set(dashboards.map((entry) => entry.group))].map((label) => ({
    label,
    views: dashboards.filter((entry) => entry.group === label)
  }))

  const view = ref('summary')
  const active = computed(
    () => dashboards.find((entry) => entry.value === view.value) ?? dashboards[0]
  )
  const viewLabel = (value: string) =>
    dashboards.find((entry) => entry.value === value)?.label ?? ''

  const filterFields: FilterMenuField[] = [
    {
      id: 'period',
      label: 'Period',
      type: 'single',
      options: periods.map((entry) => ({ value: entry.value, label: entry.label }))
    }
  ]
  const filters = ref<FilterMenuModel>({ period: [defaultPeriod] })
  const period = computed<Period>(() => {
    const picked = filters.value.period?.[0]
    return periods.some((entry) => entry.value === picked) ? (picked as Period) : defaultPeriod
  })
  const periodInfo = computed(
    () => periods.find((entry) => entry.value === period.value) ?? periods[1]
  )
  const quarter = ref('q4')

  const loading = ref(false)
  const failed = false
  const empty = false
  const refetching = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  const settle = (state: typeof loading, delay: number) => {
    clearTimeout(timer)
    loading.value = false
    refetching.value = false
    state.value = true
    timer = setTimeout(() => {
      state.value = false
    }, delay)
  }

  watch(view, () => settle(loading, 500))
  watch([period, quarter], () => settle(refetching, 600))
  onScopeDispose(() => clearTimeout(timer))

  const refresh = () => settle(refetching, 600)

  const { formatNumber } = useLocale()

  const formatCount = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })

  const formatters: Record<Format, (value: number) => string> = {
    count: formatCount,
    bytes: (value) => {
      const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
      let scaled = value
      let unit = 0
      while (scaled >= 1000 && unit < units.length - 1) {
        scaled /= 1000
        unit += 1
      }
      return `${scaled.toFixed(scaled >= 100 ? 0 : 1)} ${units[unit]}`
    },
    ms: (value) => `${Math.round(value)} ms`,
    percent: (value) => `${value.toFixed(value < 1 ? 2 : 1)}%`,
    usd: (value) =>
      formatNumber(value, {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        maximumFractionDigits: 1
      })
  }

  const scalesWithPeriod: ReadonlySet<Format> = new Set(['count', 'bytes', 'usd'])

  const scale = computed(() =>
    active.value.ownPeriod ? (quarterFactor[quarter.value] ?? 1) : periodInfo.value.factor
  )

  const end = Date.UTC(2026, 10, 14, 12)

  const labels = computed(() => {
    if (active.value.ownPeriod) return Array.from({ length: 13 }, (_, index) => `Week ${index + 1}`)
    const { points, stepHours } = timelines[period.value]
    const step = stepHours * 3_600_000
    return Array.from({ length: points }, (_, index) => new Date(end - (points - 1 - index) * step))
  })

  const wave = (seed: number, index: number) =>
    1 + 0.22 * Math.sin(index * 0.7 + seed) + 0.08 * Math.cos(index * 1.9 + seed * 2)

  const seedOf = (text: string) =>
    [...text].reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0) % 97

  const figures = computed(() =>
    active.value.figures.map((figure) => {
      const seed = seedOf(`${active.value.value}:${figure.id}`)
      const factor = scalesWithPeriod.has(figure.format) ? scale.value : 1
      return {
        ...figure,
        value: figure.base * factor,
        trend: Array.from({ length: 12 }, (_, index) =>
          Math.round(figure.base * wave(seed, index) * 100)
        )
      }
    })
  )

  const series = computed<ChartSeries[]>(() => {
    const points = labels.value.length
    const per = active.value.ownPeriod ? 1 : timelines[period.value].stepHours
    const factor =
      scalesWithPeriod.has(active.value.chart.format) && !active.value.ownPeriod
        ? Math.max(per, 1 / 12)
        : 1
    return active.value.chart.series.map((entry) => {
      const seed = seedOf(`${active.value.value}:${entry.id}`)
      return {
        id: entry.id,
        name: entry.name,
        ...(entry.color ? { color: entry.color } : {}),
        values: Array.from(
          { length: empty ? 0 : points },
          (_, index) => Math.round(entry.base * factor * wave(seed, index) * 100) / 100
        )
      }
    })
  })

  const breakdown = computed(() =>
    (empty ? [] : active.value.breakdown.items).map((item) => ({
      ...item,
      value: scalesWithPeriod.has(active.value.breakdown.format)
        ? Math.round(item.value * scale.value)
        : item.value
    }))
  )

  const activeIndex = ref<number | null>(null)
  watch(view, () => {
    activeIndex.value = null
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Dashboards"
        description="Traffic, security and business views across every workload, plus a layout of your own."
      />

      <section
        aria-label="Dashboard controls"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
          <div class="w-full min-w-0 sm:w-(--container-3xs)">
            <Select
              v-model="view"
              size="medium"
              :display-value="viewLabel"
            >
              <Select.Trigger aria-label="Dashboard">
                <template #leading>
                  <i
                    class="ai ai-chart-bar text-(--text-muted)"
                    aria-hidden="true"
                  />
                </template>
              </Select.Trigger>
              <Select.Content>
                <Select.Group
                  v-for="group in groups"
                  :key="group.label"
                  :label="group.label"
                >
                  <Select.Item
                    v-for="option in group.views"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
                </Select.Group>
              </Select.Content>
            </Select>
          </div>

          <FilterMenu
            v-if="!active.ownPeriod"
            v-model="filters"
            :fields="filterFields"
            size="medium"
            class="shrink-0"
          />

          <ToggleGroup
            v-else
            v-model="quarter"
            :options="quarters"
            size="medium"
            aria-label="Quarter"
          />

          <div class="ms-auto flex shrink-0 items-center">
            <Tooltip content="Refresh">
              <IconButton
                icon="ai ai-refresh"
                variant="outline"
                size="medium"
                aria-label="Refresh"
                :loading="refetching"
                @click="refresh"
              />
            </Tooltip>
          </div>
        </div>

        <FilterMenu.ChipGroup
          v-if="!active.ownPeriod"
          v-model="filters"
          :fields="filterFields"
        />
      </section>

      <section
        :key="active.value"
        :aria-label="active.label"
        :aria-busy="loading || refetching || undefined"
        class="flex min-w-0 flex-col gap-(--spacing-md)"
      >
        <ul
          aria-label="Key figures"
          class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4"
        >
          <li
            v-for="figure in figures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="failed || empty ? null : figure.value"
              :format-value="formatters[figure.format]"
              :delta="failed || empty ? null : figure.delta"
              :delta-label="active.ownPeriod ? 'vs previous quarter' : periodInfo.comparison"
              :inverse="figure.inverse"
              :trend="failed || empty ? [] : figure.trend"
              :loading="loading"
            >
              <template #aside>
                <Hint :content="figure.hint" />
              </template>
            </StatTile>
          </li>
        </ul>

        <div
          class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
        >
          <ChartCard :span="8">
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <ChartCard.Title>{{ active.chart.title }}</ChartCard.Title>
                <Hint :content="active.chart.hint" />
              </span>
            </ChartCard.Header>
            <ChartCard.Content>
              <Alert
                v-if="failed"
                severity="danger"
                :label="`Couldn't load ${active.chart.title.toLowerCase()}. Check your connection and retry.`"
                action-label="Retry"
                @action="refresh"
              />
              <Chart
                v-else
                v-model:active-index="activeIndex"
                :series="series"
                :labels="labels"
                :format-value="formatters[active.chart.format]"
                time-zone="UTC"
                :loading="loading"
                :refetching="refetching"
                empty-title="No data in this period"
                empty-description="Widen the period to see more."
              >
                <Chart.Grid />
                <Chart.Axis type="y" />
                <Chart.Axis type="x" />
                <Chart.Bar
                  v-if="active.chart.form === 'bar'"
                  stacked
                />
                <Chart.Area v-else-if="active.chart.form === 'area'" />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip :total="active.chart.series.length > 1" />
                <Chart.Legend total />
              </Chart>
            </ChartCard.Content>
          </ChartCard>

          <ChartCard :span="4">
            <ChartCard.Header>
              <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
                <ChartCard.Title>{{ active.breakdown.title }}</ChartCard.Title>
                <Hint :content="active.breakdown.hint" />
              </span>
            </ChartCard.Header>
            <ChartCard.Content>
              <Alert
                v-if="failed"
                severity="danger"
                :label="`Couldn't load ${active.breakdown.title.toLowerCase()}. Check your connection and retry.`"
                action-label="Retry"
                @action="refresh"
              />
              <BarList
                v-else
                :items="breakdown"
                :format-value="formatters[active.breakdown.format]"
                :loading="loading"
                empty-title="No data in this period"
                :aria-label="active.breakdown.title"
              />
            </ChartCard.Content>
          </ChartCard>
        </div>
      </section>
    </div>
  </div>
</template>
