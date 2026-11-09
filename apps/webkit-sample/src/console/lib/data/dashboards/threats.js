import { resolveReport, resolveSummary } from '../real-time-metrics'

const series = (id, name, base, options = {}) => ({ id, name, base, ...options })
const slices = (entries) => entries.map(([name, value]) => ({ name, value }))

export const THREAT_FIGURES = [
  {
    id: 'threats-blocked',
    label: 'Threats blocked',
    description:
      'Requests the WAF identified as attacks and blocked before they reached a workload.',
    unit: 'count',
    base: 2040,
    spread: 0.4,
    variation: 'inverse'
  },
  {
    id: 'requests-inspected',
    label: 'Requests inspected',
    description: 'Requests the WAF analyzed across every workload with a firewall.',
    unit: 'count',
    base: 9.4e4,
    spread: 0.3,
    variation: 'regular'
  },
  {
    id: 'block-rate',
    label: 'Block rate',
    description: 'Share of inspected requests the WAF blocked as threats.',
    unit: 'percentage',
    base: 2.2,
    spread: 0.25,
    aggregation: 'avg',
    variation: 'inverse'
  }
]

export const THREAT_REPORTS = [
  {
    id: 'threats-over-time',
    type: 'line',
    label: 'Threats over time',
    description: 'Threats the WAF blocked, and threats it logged without blocking.',
    aggregation: 'sum',
    unit: 'count',
    columns: 8,
    dataset: 'httpMetrics',
    variation: 'inverse',
    series: [
      series('blocked', 'Blocked', 2040, { color: 'danger', spread: 0.4 }),
      series('logged', 'Logged', 560, { color: 'warning', spread: 0.5 })
    ]
  },
  {
    id: 'threats-by-family',
    type: 'ordered-bar',
    label: 'Threats by attack family',
    description: 'Blocked requests, broken down by the attack family the WAF matched.',
    aggregation: 'sum',
    unit: 'count',
    columns: 6,
    dataset: 'httpMetrics',
    variation: 'inverse',
    slices: slices([
      ['SQL injection', 18_420],
      ['Cross-site scripting', 12_960],
      ['Path traversal', 7_310],
      ['Remote file inclusion', 4_180],
      ['Unwanted access', 3_240],
      ['Evading tricks', 1_870]
    ])
  },
  {
    id: 'threats-by-country',
    type: 'pie',
    label: 'Threats by country',
    description: 'Blocked requests, broken down by the country they came from.',
    aggregation: 'sum',
    unit: 'count',
    columns: 6,
    dataset: 'httpMetrics',
    variation: 'inverse',
    slices: slices([
      ['Brazil', 14_820],
      ['United States', 10_640],
      ['Germany', 6_130],
      ['Netherlands', 4_270],
      ['India', 3_480],
      ['Singapore', 2_190],
      ['France', 1_460]
    ])
  },
  {
    id: 'top-source-ips',
    type: 'list',
    label: 'Top source IPs by blocked requests',
    description: 'The addresses the WAF blocked most often, with their network and main attack.',
    aggregation: 'sum',
    unit: 'count',
    columns: 12,
    dataset: 'httpMetrics',
    variation: 'inverse',
    search: 'Search addresses, networks or attacks',
    fields: [
      { id: 'remoteAddress', header: 'IP address' },
      { id: 'asn', header: 'Network' },
      { id: 'country', header: 'Country' },
      { id: 'family', header: 'Main attack' },
      { id: 'requests', header: 'Blocked requests', align: 'end' }
    ],
    rows: [
      ['45.155.205.233', 'AS204428 SS-Net', 'Netherlands', 'SQL injection', 4_120],
      ['185.220.101.47', 'AS208294 Tor exit', 'Germany', 'Cross-site scripting', 3_640],
      ['193.32.162.159', 'AS47890 Unmanaged', 'Romania', 'Path traversal', 2_910],
      ['91.240.118.172', 'AS49870 Alsycon', 'Netherlands', 'SQL injection', 2_480],
      ['80.82.77.139', 'AS202425 IP Volume', 'Seychelles', 'Unwanted access', 1_960],
      ['162.142.125.221', 'AS398324 Censys', 'United States', 'Evading tricks', 1_390],
      ['198.235.24.130', 'AS396982 Google Cloud', 'United States', 'Remote file inclusion', 1_120],
      ['71.6.199.23', 'AS10439 CariNet', 'United States', 'Cross-site scripting', 860]
    ].map(([remoteAddress, asn, country, family, requests]) => ({
      id: remoteAddress,
      remoteAddress,
      asn,
      country,
      family,
      requests
    }))
  }
]

export const THREAT_ATTENTION = [
  {
    id: 'log-only',
    icon: 'pi pi-eye',
    title: 'WAF logs threats it does not block',
    description: 'Shop runs WAF in log-only mode: 1.2K threats passed.',
    severity: 'warning',
    tag: 'Log only',
    action: { label: 'Review WAF rules', href: '/waf-rules' }
  },
  {
    id: 'spike',
    icon: 'pi pi-chart-line',
    title: 'Threat spike on api.example.com',
    description: 'SQL injection on the API rose 64% in the last hour.',
    severity: 'danger',
    tag: 'Spike',
    action: { label: 'Open threat metrics', href: '/real-time-metrics?dashboard=waf' }
  },
  {
    id: 'no-waf',
    icon: 'pi pi-shield',
    title: 'Firewall without a WAF rule set',
    description: 'The docs workload has a firewall but no WAF rule set.',
    severity: 'warning',
    tag: 'No WAF',
    action: { label: 'Open Firewall', href: '/firewall' }
  }
]

export const resolveThreatFigures = (period, { empty = false } = {}) =>
  THREAT_FIGURES.map((entry) => resolveSummary(entry, period, { empty }))

export const resolveThreatReports = (period, { empty = false } = {}) =>
  THREAT_REPORTS.map((report) => resolveReport(report, period, { empty }))
