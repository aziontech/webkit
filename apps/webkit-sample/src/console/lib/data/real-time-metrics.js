export const RTM_PERIODS = [
  { value: '1h', label: 'Last hour' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' }
]

export const RTM_DEFAULT_PERIOD = '24h'

export const rtmPeriodLabel = (value) =>
  RTM_PERIODS.find((period) => period.value === value)?.label ?? 'Last 24 hours'

const HOUR = 3_600_000

const TIMELINE = {
  '1h': { points: 12, step: HOUR / 12 },
  '24h': { points: 24, step: HOUR },
  '7d': { points: 28, step: HOUR * 6 },
  '30d': { points: 30, step: HOUR * 24 }
}

const COMPARISON = {
  '1h': 'vs previous hour',
  '24h': 'vs previous 24 hours',
  '7d': 'vs previous 7 days',
  '30d': 'vs previous 30 days'
}

const AGGREGATION_LABELS = { sum: 'Sum', avg: 'Average' }

const series = (id, name, base, options = {}) => ({ id, name, base, ...options })
const slices = (entries) => entries.map(([name, value]) => ({ name, value }))

const line = (id, label, description, options) => ({
  id,
  type: 'line',
  label,
  description,
  aggregation: 'sum',
  unit: 'count',
  columns: 6,
  ...options
})

const share = (id, label, description, options) => ({
  id,
  type: 'pie',
  label,
  description,
  aggregation: 'sum',
  unit: 'count',
  columns: 6,
  ...options
})

const ranking = (id, label, description, options) => ({
  id,
  type: 'ordered-bar',
  label,
  description,
  aggregation: 'sum',
  unit: 'count',
  columns: 6,
  ...options
})

const figure = (id, label, description, options) => ({
  id,
  type: 'big-numbers',
  label,
  description,
  aggregation: 'sum',
  unit: 'count',
  columns: 3,
  ...options
})

const breakdown = (id, label, description, options) => ({
  id,
  type: 'list',
  label,
  description,
  aggregation: 'sum',
  unit: 'count',
  columns: 6,
  ...options
})

const COUNTRIES = slices([
  ['Brazil', 48210],
  ['United States', 31620],
  ['Germany', 18930],
  ['India', 12480],
  ['Netherlands', 9870],
  ['China', 8420],
  ['Russia', 6310],
  ['France', 4980],
  ['Singapore', 3760],
  ['United Kingdom', 2940]
])

const HOSTS = [
  ['www.example.com', 720],
  ['api.example.com', 430],
  ['shop.example.com', 360],
  ['docs.example.com', 230],
  ['status.example.com', 140],
  ['cdn.example.com', 92],
  ['blog.example.com', 48]
].map(([name, base]) => series(name, name, base, { spread: 0.35 }))

const IPS = slices([
  ['45.155.205.233', 9120],
  ['185.220.101.47', 7640],
  ['193.32.162.159', 6210],
  ['91.240.118.172', 5480],
  ['80.82.77.139', 4360],
  ['162.142.125.221', 3790],
  ['198.235.24.130', 2810],
  ['71.6.199.23', 1960]
])

const UPSTREAM_ROWS = [
  [200, 200, 1_284_310],
  [304, 304, 214_880],
  [200, 0, 182_410],
  [404, 404, 41_620],
  [301, 301, 28_940],
  [206, 206, 19_330],
  [403, 0, 12_780],
  [502, 502, 3_410],
  [499, 0, 2_960],
  [503, 503, 1_870],
  [429, 0, 1_420],
  [500, 500, 960],
  [504, 504, 410],
  [302, 302, 8_210],
  [401, 401, 5_140]
].map(([status, upstreamStatus, requests]) => ({
  id: `${status}-${upstreamStatus}`,
  status,
  upstreamStatus: upstreamStatus || '—',
  requests
}))

const IP_ROWS = [
  ['177.71.142.10', 'AS16509 Amazon.com', 'Brazil', 'São Paulo', 84_120],
  ['189.40.91.212', 'AS26599 Telefônica Brasil', 'Brazil', 'Rio de Janeiro', 61_870],
  ['34.231.18.77', 'AS14618 Amazon.com', 'United States', 'Virginia', 48_310],
  ['200.147.67.142', 'AS7162 Universo Online', 'Brazil', 'São Paulo', 37_940],
  ['52.28.143.9', 'AS16509 Amazon.com', 'Germany', 'Hesse', 29_660],
  ['104.28.45.2', 'AS13335 Cloudflare', 'United States', 'California', 22_180],
  ['181.213.4.88', 'AS28573 Claro', 'Brazil', 'Minas Gerais', 18_420],
  ['13.248.169.48', 'AS16509 Amazon.com', 'India', 'Maharashtra', 12_870],
  ['80.239.137.12', 'AS1299 Arelion', 'Netherlands', 'North Holland', 9_350],
  ['186.192.81.5', 'AS28573 Claro', 'Brazil', 'Paraná', 7_210],
  ['66.249.66.1', 'AS15169 Google', 'United States', 'Oregon', 6_480],
  ['157.55.39.20', 'AS8075 Microsoft', 'United States', 'Washington', 4_120]
].map(([remoteAddress, asn, country, region, requests]) => ({
  id: remoteAddress,
  remoteAddress,
  asn,
  country,
  region,
  requests
}))

const DATA_TRANSFERRED = [
  line(
    'edge-cache',
    'Edge cache',
    'Sum of data transferred through Cache. Displays the data in bytes divided by Data Transferred, Data Transferred In, and Data Transferred Out.',
    {
      unit: 'bytes',
      series: [
        series('total', 'Data transferred total', 9.2e9),
        series('out', 'Data transferred out', 7.6e9),
        series('in', 'Data transferred in', 1.6e9)
      ]
    }
  ),
  line(
    'edge-offload',
    'Edge offload',
    'Percentage of data successfully delivered without fetching the content from the origin server. Displays the data in percentages.',
    {
      unit: 'percentage',
      aggregation: 'avg',
      variation: 'regular',
      max: 100,
      series: [series('offload', 'Offload', 82, { spread: 0.08 })]
    }
  ),
  line(
    'saved-data',
    'Saved data',
    'Sum of data delivered without fetching the content from the origin server. Displays the data in bytes.',
    { unit: 'bytes', variation: 'regular', series: [series('saved', 'Saved data', 6.1e9)] }
  ),
  line(
    'missed-data',
    'Missed data',
    'Amount of data delivered after fetching the content from the origin server. Displays the data in bytes.',
    { unit: 'bytes', variation: 'inverse', series: [series('missed', 'Missed data', 1.4e9)] }
  ),
  line(
    'bandwidth-total',
    'Total bandwidth usage',
    'Average of bandwidth used to deliver your content. Displays the total amount of bandwidth used.',
    {
      unit: 'bitsPerSecond',
      variation: 'regular',
      series: [series('bandwidth', 'Bandwidth total', 2.1e9)]
    }
  ),
  line(
    'bandwidth-offload',
    'Bandwidth offloaded',
    'Percentage of bandwidth successfully delivered without fetching the content from the origin server. Displays the data in percentages.',
    {
      unit: 'percentage',
      aggregation: 'avg',
      variation: 'regular',
      max: 100,
      series: [series('offload', 'Bandwidth offload', 79, { spread: 0.1 })]
    }
  ),
  line(
    'bandwidth-saved',
    'Saved bandwidth',
    'Average of bandwidth delivered without fetching the content from the origin server. Displays the average of bandwidth saved.',
    {
      unit: 'bitsPerSecond',
      variation: 'regular',
      series: [series('saved', 'Saved bandwidth', 1.6e9)]
    }
  ),
  line(
    'bandwidth-missed',
    'Missed bandwidth',
    'Average of bandwidth used by the origin server to search for content. Displays the average of bandwidth used.',
    {
      unit: 'bitsPerSecond',
      variation: 'inverse',
      series: [series('missed', 'Missed bandwidth', 4.4e8)]
    }
  )
]

const REQUESTS = [
  line(
    'total-requests',
    'Total requests',
    'Quantity of requests made to your domain. Displays the total amount of requests divided by Requests Total, Https Requests Total, and Http Requests Total.',
    {
      series: [
        series('edge', 'Requests total', 2.04e6),
        series('https', 'HTTPS requests total', 1.86e6),
        series('http', 'HTTP requests total', 1.8e5)
      ]
    }
  ),
  line(
    'requests-offloaded',
    'Requests offloaded',
    'Percentage of requests delivered without fetching the content from the origin server. Displays the data in percentages.',
    {
      unit: 'percentage',
      aggregation: 'avg',
      variation: 'regular',
      max: 100,
      series: [series('offloaded', 'Requests offloaded', 88, { spread: 0.06 })]
    }
  ),
  line(
    'saved-requests',
    'Saved requests',
    'Quantity of requests delivered without fetching the content from the origin server. Displays the total amount of requests saved.',
    { variation: 'regular', series: [series('saved', 'Saved requests', 1.79e6)] }
  ),
  line(
    'missed-requests',
    'Missed requests',
    'Amount of requests delivered after fetching the content from the origin server. Displays the sum of missed requests.',
    { variation: 'inverse', series: [series('missed', 'Missed requests', 2.5e5)] }
  ),
  line(
    'requests-per-second',
    'Total requests per second',
    'Average of requests per second made from customers to your domain. Displays the average number of requests per second.',
    {
      unit: 'perSecond',
      variation: 'regular',
      series: [series('rps', 'Requests per second', 566)]
    }
  ),
  line(
    'requests-per-second-offloaded',
    'Requests per second offloaded',
    'Percentage of requests per second delivered without fetching the content from the origin server. Displays the average number of offloaded requests per second in percentages.',
    {
      unit: 'percentage',
      aggregation: 'avg',
      variation: 'regular',
      max: 100,
      series: [series('offloaded', 'Requests per second offloaded', 87, { spread: 0.07 })]
    }
  ),
  line(
    'saved-requests-per-second',
    'Saved requests per second',
    'Average of requests per second delivered without fetching the content from the origin server. Displays the average number of saved requests delivered.',
    {
      unit: 'perSecond',
      variation: 'regular',
      series: [series('saved', 'Saved requests per second', 497)]
    }
  ),
  line(
    'missed-requests-per-second',
    'Missed requests per second',
    'Average of requests per second delivered after fetching the content from the origin server. Displays the average number of missed requests per second.',
    {
      unit: 'perSecond',
      variation: 'inverse',
      series: [series('missed', 'Missed requests per second', 69)]
    }
  ),
  line(
    'requests-by-method',
    'Requests by method',
    'Sum of requests for each HTTP method during the selected period. Displays the overall request count for each method.',
    {
      series: [
        series('GET', 'GET', 1.62e6),
        series('POST', 'POST', 2.9e5),
        series('HEAD', 'HEAD', 6.4e4),
        series('OPTIONS', 'OPTIONS', 4.1e4),
        series('PUT', 'PUT', 1.8e4),
        series('DELETE', 'DELETE', 6.2e3)
      ]
    }
  ),
  line(
    'average-request-time',
    'Average request time',
    'Average request duration over time. Displays how long requests take on average, in seconds.',
    {
      unit: 'seconds',
      aggregation: 'avg',
      variation: 'inverse',
      series: [series('duration', 'Request time', 0.184, { spread: 0.25 })]
    }
  ),
  line(
    'requests-by-scheme',
    'Requests by scheme',
    'Sum of requests, categorized by scheme, over the selected period.',
    {
      variation: 'inverse',
      series: [series('https', 'https', 1.86e6), series('http', 'http', 1.8e5)]
    }
  )
]

const STATUS_CODES = [
  line(
    'status-2xx',
    'HTTP status codes 2XX',
    'Indicates successful responses to user requests. Displays Request Status Code 200 and other 2xx status codes.',
    {
      series: [
        series('200', '200', 1.71e6),
        series('204', '204', 4.2e4),
        series('206', '206', 1.9e4)
      ]
    }
  ),
  line(
    'status-3xx',
    'HTTP status codes 3XX',
    'Indicates redirections that have occurred with user requests. Displays Request Status Code 300 and other 3xx status codes.',
    {
      series: [
        series('304', '304', 2.15e5),
        series('301', '301', 2.9e4),
        series('302', '302', 8.2e3)
      ]
    }
  ),
  line(
    'status-4xx',
    'HTTP status codes 4XX',
    "Indicates errors that have occurred with user's requests. Displays Requests Status Code 400, Requests Status Code 403, Requests Status Code 404, and Requests Status Code 4xx.",
    {
      series: [
        series('400', 'Status 400', 3.1e3),
        series('403', 'Status 403', 1.28e4),
        series('404', 'Status 404', 4.16e4),
        series('4xx', 'Other 4xx', 9.5e3)
      ]
    }
  ),
  line(
    'status-5xx',
    'HTTP status codes 5XX',
    'Indicates the server failed to deliver an apparently valid request. Displays Requests Status Code 500, Requests Status Code 502, Requests Status Code 503, and Requests Status Code 5xx.',
    {
      series: [
        series('500', 'Status 500', 960, { spread: 0.6 }),
        series('502', 'Status 502', 3410, { spread: 0.6 }),
        series('503', 'Status 503', 1870, { spread: 0.6 }),
        series('5xx', 'Other 5xx', 410, { spread: 0.6 })
      ]
    }
  ),
  breakdown(
    'status-upstream',
    'Requests by status and upstream status',
    'Sum of processed requests, broken down by the top status and upstream status categories responsible for the most flagged requests.',
    {
      variation: 'inverse',
      search: 'Search status codes',
      groups: ['2xx', '3xx', '4xx', '5xx'],
      groupOf: (row) => `${String(row.status)[0]}xx`,
      fields: [
        { id: 'status', header: 'Status' },
        { id: 'upstreamStatus', header: 'Upstream status' },
        { id: 'requests', header: 'Requests', align: 'end' }
      ],
      rows: UPSTREAM_ROWS
    }
  )
]

const BANDWIDTH_SAVING = [
  line(
    'bandwidth-saving',
    'Bandwidth saving',
    "Images that were processed and delivered by Image Processor. Displays domains' savings when transmitting images in bytes.",
    {
      unit: 'bytes',
      variation: 'regular',
      series: [series('saved', 'Image bandwidth saved', 2.4e9)]
    }
  )
]

const REQUEST_BREAKDOWN = [
  breakdown(
    'ip-information',
    'IP address information',
    'Displays the distribution of requests by region, country, ASN, and individual IP address.',
    {
      columns: 12,
      variation: 'inverse',
      search: 'Search addresses, ASNs or countries',
      fields: [
        { id: 'remoteAddress', header: 'IP address' },
        { id: 'asn', header: 'ASN' },
        { id: 'country', header: 'Country' },
        { id: 'region', header: 'Region' },
        { id: 'requests', header: 'Requests', align: 'end' }
      ],
      rows: IP_ROWS
    }
  )
]

const TIERED_CACHE = [
  line(
    'tiered-cache',
    'Tiered cache',
    'Sum of data transferred through Tiered Cache. Displays the data in bytes divided by Data Transferred Total, Data Transferred In, and Data Transferred Out.',
    {
      unit: 'bytes',
      series: [
        series('total', 'Data transferred total', 3.4e9),
        series('out', 'Data transferred out', 2.9e9),
        series('in', 'Data transferred in', 5.1e8)
      ]
    }
  ),
  line(
    'tiered-cache-offload',
    'Tiered cache offload',
    'Percentage of data successfully delivered by Tiered Cache without fetching the content from the origin server. Displays the average number of data in percentages.',
    {
      unit: 'percentage',
      aggregation: 'avg',
      variation: 'regular',
      max: 100,
      series: [series('offload', 'Tiered cache offload', 91, { spread: 0.05 })]
    }
  )
]

const INVOCATIONS = [
  line(
    'total-invocations',
    'Total invocations',
    'Quantity of times a function has been executed. Displays the total amount of invocations divided by Firewall Invocations and Application Invocations.',
    {
      columns: 12,
      series: [
        series('application', 'Application invocations', 4.8e5),
        series('firewall', 'Firewall invocations', 1.3e5)
      ]
    }
  )
]

const IMAGE_REQUESTS = [
  line(
    'image-requests',
    'Total requests',
    'Quantity of requests made to your content images being processed. Displays the total amount of requests.',
    { variation: 'regular', series: [series('requests', 'Images processed', 2.2e5)] }
  ),
  line(
    'image-requests-per-second',
    'Total requests per second',
    'Requests per second made to your content images being processed. Displays the average number of requests per second.',
    {
      unit: 'perSecond',
      variation: 'regular',
      series: [series('rps', 'Images processed per second', 61)]
    }
  )
]

const THREATS = [
  line(
    'threats-vs-requests',
    'Threats vs requests',
    'Sum of attacks processed by WAF. Displays the total amount of Waf Requests Blocked, Waf Requests Threats, and Waf Requests Allowed.',
    {
      series: [
        series('allowed', 'WAF requests allowed', 1.6e5, { color: 'success' }),
        series('blocked', 'WAF requests blocked', 4.9e4, { color: 'danger' }),
        series('threat', 'WAF requests threat', 1.3e4, { color: 'warning' })
      ]
    }
  ),
  line(
    'xss',
    'Cross-site scripting threats',
    'Sum of Cross-Site Scripting attacks against your domains. Displays the total amount of threats.',
    { variation: 'inverse', series: [series('xss', 'WAF requests XSS attacks', 3.6e3)] }
  ),
  line(
    'rfi',
    'Remote file inclusion threats',
    'Sum of Remote File Inclusion attacks against your domains. Displays the total amount of threats.',
    { variation: 'inverse', series: [series('rfi', 'WAF requests RFI attacks', 820)] }
  ),
  line(
    'sql-injection',
    'SQL injection threats',
    'Sum of SQL Injection attacks against your domains. Displays the total amount of threats.',
    { variation: 'inverse', series: [series('sql', 'WAF requests SQL attacks', 5.4e3)] }
  ),
  line(
    'other-threats',
    'Other threats',
    'Sum of other types of attacks blocked by WAF. Displays the total amount of threats.',
    { variation: 'inverse', series: [series('others', 'WAF requests other attacks', 2.9e3)] }
  ),
  share(
    'threats-by-country-share',
    'Top WAF threat requests by country',
    'Sum of requests identified as threats by WAF, broken down by the top countries responsible for the most flagged requests. Displays the data in percentages.',
    { variation: 'regular', slices: COUNTRIES }
  ),
  ranking(
    'threats-by-country',
    'Top WAF threat requests by country',
    'Sum of requests identified as threats by WAF, broken down by the top countries responsible for the most flagged requests. Displays the total amount of detected threats.',
    { variation: 'regular', slices: COUNTRIES }
  ),
  ranking(
    'threats-by-family',
    'WAF threat requests by family attack',
    'Sum of requests identified as threats by WAF, broken down by the top attack families responsible for the most flagged requests. Displays the total amount of detected threats.',
    {
      variation: 'regular',
      slices: slices([
        ['SQL injection', 41_820],
        ['Cross-site scripting', 28_140],
        ['Path traversal', 14_960],
        ['Remote file inclusion', 9_210],
        ['Unwanted access', 6_480],
        ['Evading tricks', 3_920],
        ['Identified attack', 1_870]
      ])
    }
  ),
  line(
    'threats-by-host',
    'WAF threat requests by host',
    'Sum of requests identified as threats by WAF, broken down by the top hosts responsible for the most flagged requests. Displays the total amount of detected threats.',
    { columns: 12, variation: 'inverse', series: HOSTS }
  )
]

const DNS_QUERIES = [
  line(
    'total-queries',
    'Total queries',
    'Quantity of queries your DNS received. Displays the total amount of queries.',
    { columns: 12, variation: 'regular', series: [series('queries', 'Queries', 3.8e5)] }
  )
]

const BOT_OVERVIEW = [
  figure('bad-bot-hits', 'Bad bot hits', 'Number of requests identified as bad bots.', {
    variation: 'inverse',
    base: 1.84e4
  }),
  figure('good-bot-hits', 'Good bot hits', 'Number of requests identified as good bots.', {
    variation: 'neutral',
    base: 9.6e3
  }),
  figure('bot-hits', 'Bot hits', 'Number of requests identified as bots.', {
    variation: 'inverse',
    base: 2.8e4
  }),
  figure('transactions', 'Transactions', 'Number of requests evaluated by Azion Bot Manager.', {
    variation: 'neutral',
    base: 3.1e5
  }),
  line(
    'bot-traffic',
    'Bot traffic',
    'Sum of requests grouped by identifying traffic as Legitimate, Bad Bot, Good Bot, and Under Evaluation.',
    {
      variation: 'regular',
      series: [
        series('legitimate', 'Legitimate', 1.1e4),
        series('bad', 'Bad bot', 760),
        series('good', 'Good bot', 400),
        series('evaluation', 'Under evaluation', 220)
      ]
    }
  ),
  share(
    'top-bot-traffic',
    'Top bot traffic',
    'Sum of requests grouped by identifying traffic as Legitimate, Bad Bot, Good Bot, and Under Evaluation.',
    {
      variation: 'regular',
      slices: slices([
        ['Legitimate', 264_300],
        ['Bad bot', 18_400],
        ['Good bot', 9_600],
        ['Under evaluation', 5_280]
      ])
    }
  ),
  share(
    'top-bot-action',
    'Top bot action',
    'Actions taken by Azion Bot Manager for requests identified as bots, displayed in both absolute values and percentages.',
    {
      variation: 'regular',
      slices: slices([
        ['Deny', 9_820],
        ['Captcha', 4_310],
        ['Drop', 2_140],
        ['Random delay', 1_160],
        ['Redirect', 620],
        ['Hold connection', 350]
      ])
    }
  ),
  line(
    'bot-captcha',
    'Bot CAPTCHA',
    'Sum of CAPTCHA challenge results returned for requests classified as bots.',
    {
      variation: 'inverse',
      series: [
        series('solved', 'Solved', 70),
        series('failed', 'Failed', 95),
        series('unanswered', 'Not answered', 44)
      ]
    }
  ),
  share(
    'top-bot-captcha',
    'Top bot CAPTCHA',
    'Sum of CAPTCHA challenge results returned for requests classified as bots.',
    {
      variation: 'regular',
      slices: slices([
        ['Failed', 2_280],
        ['Solved', 1_690],
        ['Not answered', 1_060]
      ])
    }
  ),
  ranking(
    'top-bot-classifications',
    'Top bot classifications',
    'Sum of requests classified according to the tactics used and the purpose of the bots.',
    {
      variation: 'regular',
      slices: slices([
        ['Scraper', 6_840],
        ['Credential stuffing', 4_120],
        ['Vulnerability scanner', 3_310],
        ['Search engine', 2_960],
        ['Monitoring', 1_420],
        ['Social media', 980],
        ['Card cracking', 410]
      ])
    }
  ),
  ranking(
    'bot-activity-by-country',
    'Bot activity map',
    'Sum of requests identified as bots, presented by the country of origin.',
    { columns: 12, variation: 'regular', slices: COUNTRIES }
  )
]

const BOT_BREAKDOWN = [
  figure(
    'impacted-urls',
    'Impacted URLs',
    'Sum of the detected bot actions, broken down by the affected URLs.',
    { variation: 'inverse', base: 1.27e3 }
  ),
  ranking(
    'top-bad-bot-ips',
    'Top bad bot IPs',
    'Sum of requests detected as bad bots, broken down by the highest-ranking IP addresses.',
    { variation: 'regular', slices: IPS }
  ),
  ranking(
    'top-impacted-urls',
    'Top impacted URLs',
    'Sum of the detected bot actions, broken down by the most affected URLs.',
    {
      variation: 'regular',
      slices: slices([
        ['/login', 5_410],
        ['/api/v1/cart', 3_820],
        ['/checkout', 2_760],
        ['/api/v1/products', 1_940],
        ['/account/reset', 1_210],
        ['/search', 870]
      ])
    }
  )
]

const THREATS_BREAKDOWN = [
  ranking(
    'threats-by-ip',
    'Top WAF threat requests by IP',
    'Sum of requests identified as threats by WAF, broken down by the top IP addresses responsible for the most flagged requests.',
    { columns: 12, variation: 'regular', slices: IPS }
  )
]

const DATA_STREAMED = [
  line(
    'data-streamed',
    'Total data streamed',
    'Quantity of data streamed to the configured connectors in bytes. Displays the total data sent to the stream.',
    { unit: 'bytes', variation: 'regular', series: [series('streamed', 'Data streamed', 1.9e8)] }
  ),
  line(
    'data-stream-requests',
    'Total requests',
    'Quantity of requests that were processed. Displays the total amount of requests.',
    { variation: 'regular', series: [series('requests', 'Requests streamed', 1.12e6)] }
  )
]

export const RTM_GROUPS = [
  {
    id: 'build',
    label: 'Build',
    pages: [
      {
        id: 'applications',
        label: 'Applications',
        description: 'Data transferred, requests and status codes across your applications.',
        dashboards: [
          {
            id: 'data-transferred',
            label: 'Data transferred',
            dataset: 'httpMetrics',
            reports: DATA_TRANSFERRED
          },
          { id: 'requests', label: 'Requests', dataset: 'httpMetrics', reports: REQUESTS },
          {
            id: 'status-codes',
            label: 'Status codes',
            dataset: 'httpMetrics',
            reports: STATUS_CODES
          },
          {
            id: 'bandwidth-saving',
            label: 'Bandwidth saving',
            dataset: 'httpMetrics',
            reports: BANDWIDTH_SAVING
          },
          {
            id: 'request-breakdown',
            label: 'Request breakdown',
            dataset: 'httpBreakdownMetrics',
            reports: REQUEST_BREAKDOWN
          }
        ]
      },
      {
        id: 'tiered-cache',
        label: 'Tiered Cache',
        description: 'Data the cache tiers served and how much of it never reached your origin.',
        dashboards: [
          {
            id: 'caching-offload',
            label: 'Caching offload',
            dataset: 'l2CacheMetrics',
            reports: TIERED_CACHE
          }
        ]
      },
      {
        id: 'functions',
        label: 'Functions',
        description: 'How often your functions ran, from applications and from firewalls.',
        dashboards: [
          {
            id: 'invocations',
            label: 'Invocations',
            dataset: 'edgeFunctionsMetrics',
            reports: INVOCATIONS
          }
        ]
      },
      {
        id: 'image-processor',
        label: 'Image Processor',
        description: 'Requests for images the Image Processor transformed.',
        dashboards: [
          {
            id: 'requests',
            label: 'Requests',
            dataset: 'imagesProcessedMetrics',
            reports: IMAGE_REQUESTS
          }
        ]
      }
    ]
  },
  {
    id: 'secure',
    label: 'Secure',
    pages: [
      {
        id: 'waf',
        label: 'WAF',
        description: 'Threats the WAF analyzed, by attack family, country and host.',
        dashboards: [{ id: 'threats', label: 'Threats', dataset: 'httpMetrics', reports: THREATS }]
      },
      {
        id: 'edge-dns',
        label: 'Edge DNS',
        description: 'Queries your hosted zones answered.',
        dashboards: [
          {
            id: 'standard-queries',
            label: 'Standard queries',
            dataset: 'idnsQueriesMetrics',
            reports: DNS_QUERIES
          }
        ]
      },
      {
        id: 'bot-manager',
        label: 'Bot Manager',
        description: 'Bot traffic Bot Manager classified and the actions it took.',
        dashboards: [
          {
            id: 'overview',
            label: 'Overview',
            dataset: 'botManagerMetrics',
            reports: BOT_OVERVIEW
          },
          {
            id: 'breakdown',
            label: 'Breakdown',
            dataset: 'botManagerBreakdownMetrics',
            reports: BOT_BREAKDOWN
          }
        ]
      },
      {
        id: 'threats-breakdown',
        label: 'Threats breakdown',
        description: 'The addresses behind the requests the WAF flagged.',
        dashboards: [
          {
            id: 'breakdown',
            label: 'Threats breakdown',
            dataset: 'httpBreakdownMetrics',
            reports: THREATS_BREAKDOWN
          }
        ]
      }
    ]
  },
  {
    id: 'observe',
    label: 'Observe',
    pages: [
      {
        id: 'data-stream',
        label: 'Data Stream',
        description: 'Data and requests streamed to your connectors.',
        dashboards: [
          {
            id: 'data-streamed',
            label: 'Data streamed',
            dataset: 'dataStreamedMetrics',
            reports: DATA_STREAMED
          }
        ]
      }
    ]
  }
]

export const RTM_PAGES = RTM_GROUPS.flatMap((group) => group.pages)

export const rtmPage = (id) => RTM_PAGES.find((page) => page.id === id) ?? null

const reportById = (pageId, dashboardId, reportId) => {
  const dashboard = rtmPage(pageId)?.dashboards.find((entry) => entry.id === dashboardId)
  const report = dashboard?.reports.find((entry) => entry.id === reportId)
  return report ? { ...report, dataset: dashboard.dataset } : null
}

export const RTM_HIGHLIGHTS = [
  { page: 'applications', dashboard: 'requests', report: 'total-requests' },
  { page: 'applications', dashboard: 'data-transferred', report: 'edge-cache' },
  { page: 'waf', dashboard: 'threats', report: 'threats-vs-requests' },
  { page: 'applications', dashboard: 'status-codes', report: 'status-upstream' },
  { page: 'applications', dashboard: 'status-codes', report: 'status-5xx' },
  { page: 'functions', dashboard: 'invocations', report: 'total-invocations', columns: 6 }
].map((entry) => {
  const report = reportById(entry.page, entry.dashboard, entry.report)
  return { ...entry, source: { ...report, columns: entry.columns ?? report.columns } }
})

export const RTM_SUMMARY = [
  {
    id: 'requests',
    label: 'Requests',
    unit: 'count',
    base: 2.04e6,
    variation: 'regular',
    page: 'applications',
    dashboard: 'requests'
  },
  {
    id: 'data-transferred',
    label: 'Data transferred',
    unit: 'bytes',
    base: 9.2e9,
    variation: 'regular',
    page: 'applications',
    dashboard: 'data-transferred'
  },
  {
    id: 'edge-offload',
    label: 'Edge offload',
    unit: 'percentage',
    aggregation: 'avg',
    base: 82,
    spread: 0.08,
    variation: 'regular',
    page: 'applications',
    dashboard: 'data-transferred'
  },
  {
    id: 'errors',
    label: 'Status 5xx',
    unit: 'count',
    base: 6.6e3,
    spread: 0.6,
    variation: 'inverse',
    page: 'applications',
    dashboard: 'status-codes'
  },
  {
    id: 'threats',
    label: 'Threats blocked',
    unit: 'count',
    base: 4.9e4,
    variation: 'neutral',
    page: 'waf',
    dashboard: 'threats'
  },
  {
    id: 'invocations',
    label: 'Function invocations',
    unit: 'count',
    base: 6.1e5,
    variation: 'regular',
    page: 'functions',
    dashboard: 'invocations'
  }
]

const hash = (seed) => {
  let h = 0x811c9dc5
  for (const char of seed) {
    h ^= char.charCodeAt(0)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b) >>> 0
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35) >>> 0
  return (h ^ (h >>> 16)) >>> 0 || 1
}

const random = (seed) => {
  let h = hash(seed)
  return () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    h >>>= 0
    return (h % 10_000) / 10_000
  }
}

const SCALES_WITH_BUCKET = new Set(['count', 'bytes'])

const wave = (seed, points, base, spread) => {
  const next = random(seed)
  const phase = next() * Math.PI * 2
  return Array.from({ length: points }, (_, index) => {
    const swing = Math.sin(phase + (index / points) * Math.PI * 2)
    const noise = (next() - 0.5) * spread * 0.6
    return Math.max(0, base * (1 + spread * 0.6 * swing + noise))
  })
}

const timeline = (period) => {
  const { points, step } = TIMELINE[period] ?? TIMELINE[RTM_DEFAULT_PERIOD]
  const end = Math.floor(Date.now() / step) * step
  return Array.from({ length: points }, (_, index) => new Date(end - (points - 1 - index) * step))
}

const bucketFactor = (period, unit) => {
  if (!SCALES_WITH_BUCKET.has(unit)) return 1
  return (TIMELINE[period] ?? TIMELINE[RTM_DEFAULT_PERIOD]).step / HOUR
}

const periodFactor = (period) => ({ '1h': 1 / 24, '24h': 1, '7d': 7, '30d': 30 })[period] ?? 1

const variationOf = (seed) => (random(`variation:${seed}`)() - 0.45) * 36

const aggregate = (values, aggregation) => {
  if (!values.length) return 0
  const sum = values.reduce((total, value) => total + value, 0)
  return aggregation === 'avg' ? sum / values.length : sum
}

const BYTE_STEPS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
const BIT_STEPS = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps']

const scaled = (value, steps) => {
  let current = value
  let index = 0
  while (Math.abs(current) >= 1000 && index < steps.length - 1) {
    current /= 1000
    index += 1
  }
  const digits = current >= 100 || index === 0 ? 0 : 1
  return `${current.toFixed(digits)} ${steps[index]}`
}

const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const plain = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })

export const formatCount = (value) =>
  Math.abs(value) < 1000 ? plain.format(Math.round(value * 100) / 100) : compact.format(value)

export const rtmFormatter = (unit) => {
  if (unit === 'bytes') return (value) => scaled(value, BYTE_STEPS)
  if (unit === 'bitsPerSecond') return (value) => scaled(value, BIT_STEPS)
  if (unit === 'percentage') return (value) => `${value.toFixed(value >= 10 ? 0 : 1)}%`
  if (unit === 'seconds') return (value) => `${(value * 1000).toFixed(0)} ms`
  if (unit === 'perSecond') return (value) => `${formatCount(value)}/s`
  return formatCount
}

export const variationTone = (delta, variation) => {
  if (variation === 'neutral' || Math.abs(delta) < 0.01) return 'secondary'
  const rising = delta > 0
  const good = variation === 'inverse' ? !rising : rising
  return good ? 'success' : 'danger'
}

export const aggregationLabel = (aggregation) => AGGREGATION_LABELS[aggregation] ?? 'Sum'

export const comparisonLabel = (period) => COMPARISON[period] ?? COMPARISON[RTM_DEFAULT_PERIOD]

const resolveSeries = (report, period, labels, empty) =>
  empty
    ? []
    : report.series.map((entry) => ({
        id: entry.id,
        name: entry.name,
        color: entry.color,
        values: wave(
          `${report.id}:${entry.id}:${period}`,
          labels.length,
          entry.base * bucketFactor(period, report.unit),
          entry.spread ?? 0.3
        ).map((value) => (report.max ? Math.min(value, report.max) : value))
      }))

const resolveSlices = (report, period, empty) =>
  empty
    ? []
    : report.slices.map((slice) => ({
        id: slice.name,
        name: slice.name,
        values: [Math.round(slice.value * periodFactor(period))]
      }))

const resolveRows = (report, period, empty) =>
  empty
    ? []
    : report.rows.map((row) => ({
        ...row,
        requests: Math.max(1, Math.round(row.requests * periodFactor(period)))
      }))

export const resolveReport = (report, period, { empty = false } = {}) => {
  const labels = timeline(period)
  const delta = variationOf(`${report.id}:${period}`)
  const base = { ...report, period, delta, labels, format: rtmFormatter(report.unit) }

  if (report.type === 'line') {
    const resolved = resolveSeries(report, period, labels, empty)
    const total = aggregate(
      resolved.flatMap((entry) => aggregate(entry.values, report.aggregation)),
      report.aggregation === 'avg' ? 'avg' : 'sum'
    )
    return { ...base, series: resolved, total }
  }

  if (report.type === 'pie' || report.type === 'ordered-bar') {
    const resolved = resolveSlices(report, period, empty)
    return {
      ...base,
      series: resolved,
      total: aggregate(
        resolved.map((s) => s.values[0]),
        'sum'
      )
    }
  }

  if (report.type === 'list') {
    const rows = resolveRows(report, period, empty)
    return {
      ...base,
      rows,
      total: aggregate(
        rows.map((row) => row.requests),
        'sum'
      )
    }
  }

  const trend = empty
    ? []
    : wave(`${report.id}:trend:${period}`, labels.length, report.base / 24, report.spread ?? 0.3)
  return { ...base, value: empty ? 0 : report.base * periodFactor(period), trend }
}

export const resolveSummary = (entry, period, { empty = false } = {}) => {
  const labels = timeline(period)
  const trend = empty
    ? []
    : wave(
        `summary:${entry.id}:${period}`,
        labels.length,
        entry.base * bucketFactor(period, entry.unit),
        entry.spread ?? 0.3
      )
  const value = empty ? 0 : aggregate(trend, entry.aggregation ?? 'sum')
  return {
    ...entry,
    value,
    trend,
    delta: variationOf(`summary:${entry.id}:${period}`),
    format: rtmFormatter(entry.unit)
  }
}
