import type { PromptInputMenuOption } from '@aziontech/webkit/prompt-input'
import type { SourcesItem } from '@aziontech/webkit/sources'
import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
import type { AiChatInterrupt, AiChatMessage } from '@aziontech/webkit/utils/ai-chat'

const at = (time: string): Date => new Date(`2026-11-19T${time}:00`)

const user = (id: string, text: string, time: string): AiChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', content: text }],
  createdAt: at(time)
})

const assistant = (
  id: string,
  text: string,
  time: string,
  extra: { reasoning?: string; reasoningSeconds?: number; sources?: SourcesItem[] } = {}
): AiChatMessage => ({
  id,
  role: 'assistant',
  parts: [
    ...(extra.reasoning ? [{ type: 'thinking' as const, content: extra.reasoning }] : []),
    { type: 'text', content: text }
  ],
  createdAt: at(time),
  metadata: { reasoningSeconds: extra.reasoningSeconds, sources: extra.sources }
})

const cacheAnswer = [
  'Use **Real-Time Purge** with the *URL* type. It removes one object from every data center in a few seconds [1].',
  '',
  '1. Open Real-Time Purge from the products menu.',
  '2. Choose **URL** and paste the address.',
  '3. Select Purge.',
  '',
  'The same purge from the Azion CLI [2]:',
  '',
  '```bash',
  'azion purge urls --urls https://www.example.com/styles.css',
  '```'
].join('\n')

const errorsAnswer = [
  'The **502** responses on storefront started at 14:05, when the TLS certificate of the origin `api.example.com` expired [1].',
  '',
  '| Time | 5xx rate | Cause |',
  '| --- | --- | --- |',
  '| 14:00 | 0.1% | — |',
  '| 14:05 | 38% | Origin certificate expired |',
  '',
  'Renew the certificate at the origin, or let the origin accept plain HTTP from the edge while you renew it.'
].join('\n')

export const sampleStreamingMessages: AiChatMessage[] = [
  user('m1', 'Why is storefront answering with 502 errors?', '14:12'),
  assistant('m2', errorsAnswer.slice(0, 120), '14:12', {
    reasoning:
      'The reader asks about errors on storefront. The error rate rose at 14:05; the certificate of the origin expired at the same minute.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Troubleshooting 502 responses',
        href: 'https://www.azion.com/en/documentation/',
        description: 'A 502 means the edge reached the origin but got no valid answer back.',
        site: 'Azion',
        icon: 'az az-azion',
        publisher: 'Azion Technologies',
        publishedAt: '2026-09-14'
      }
    ]
  })
]

export const sampleInterruptedMessages: AiChatMessage[] = [
  user('m1', 'How do I purge the cache of one URL?', '10:41'),
  assistant('m2', cacheAnswer.slice(0, 104), '10:41', {
    reasoning:
      'The question is about one URL, so a full purge would be too broad. Real-Time Purge by URL is the narrowest option, and the CLI does the same from a terminal.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Real-Time Purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Removes a cached object from every data center in a few seconds.',
        site: 'Azion',
        icon: 'az az-azion',
        publisher: 'Azion Technologies',
        publishedAt: '2026-03-02'
      },
      {
        title: 'aziontech/azion: purge',
        href: 'https://github.com/aziontech/azion',
        description: 'Purge URLs, wildcards and cache keys from a terminal.',
        site: 'GitHub',
        image: 'https://github.com/favicon.ico'
      }
    ]
  })
]
export const sampleInterruptedError = 'The connection was interrupted before the response finished.'

const history: [string, string][] = [
  [
    'Which domains does storefront answer on?',
    'storefront answers on **www.example.com** and **shop.example.com**.'
  ],
  [
    'Is the certificate of shop.example.com valid?',
    'Yes. It is a Let’s Encrypt certificate, valid until **14 January**.'
  ],
  [
    'Can it renew on its own?',
    'Yes. Automatic renewal is on for both domains, 30 days before expiry.'
  ],
  [
    'How do I check the certificate from a terminal?',
    [
      '### 1. Read the dates with OpenSSL',
      '',
      'Connect to the domain and print the validity window of `shop.example.com`:',
      '',
      '```bash',
      'openssl s_client -connect shop.example.com:443 -servername shop.example.com </dev/null \\',
      '  | openssl x509 -noout -dates',
      '```',
      '',
      'The output has two lines:',
      '',
      '- `notBefore`: when the certificate became valid.',
      '- `notAfter`: when it expires.',
      '  - Renewal starts 30 days before this date.',
      '',
      '### 2. Check it with curl',
      '',
      '```bash',
      'curl -vI https://shop.example.com 2>&1 | grep -i "expire date"',
      '```',
      '',
      '**Important:** run both from outside your network, so you read the certificate the edge serves.'
    ].join('\n')
  ],
  ['What is the cache hit ratio today?', '**91%** over the last 24 hours, up from 87% last week.'],
  [
    'Which paths miss the cache most?',
    'The search pages under `/search`, because every query string is a new cache key.'
  ],
  [
    'How do I fix that?',
    'Set *Cache by query string* to **Allowlist** and keep only `q` and `page` [1]. Campaign parameters such as `utm_source` then stop creating new cache keys [2][3].'
  ]
]

const cacheKeySources: SourcesItem[] = [
  {
    title: 'Cache settings',
    href: 'https://www.azion.com/en/documentation/',
    description: 'Choose which query string parameters build the cache key of each path.',
    site: 'Azion',
    icon: 'az az-azion',
    publisher: 'Azion Technologies',
    publishedAt: '2026-08-21'
  },
  {
    title: 'aziontech/azion',
    href: 'https://github.com/aziontech/azion',
    description: 'Change the cache settings of an application from a terminal.',
    site: 'GitHub',
    publisher: 'aziontech',
    image: 'https://github.com/favicon.ico'
  },
  {
    title: 'HTTP Caching (RFC 9111)',
    href: 'https://www.w3.org/Protocols/',
    description: 'Every distinct URL, query string included, is a separate entry in a cache.',
    site: 'W3C',
    image: 'https://www.w3.org/favicon.ico',
    publisher: 'World Wide Web Consortium',
    publishedAt: '2022-06-01'
  },
  {
    title: 'cache-control',
    href: 'https://www.npmjs.com/package/cache-control',
    description: 'Writes Cache-Control headers from a route table.',
    cited: false
  }
]

export const sampleLongThread: AiChatMessage[] = history.flatMap(
  ([question, answer], index): AiChatMessage[] => [
    user(`q${index}`, question, `09:${10 + index * 4}`),
    assistant(`a${index}`, answer, `09:${11 + index * 4}`, {
      reasoning: 'Reading the workload settings of storefront.',
      reasoningSeconds: 2,
      sources: index === history.length - 1 ? cacheKeySources : []
    })
  ]
)

export const sampleLongThreadFollowUps: SuggestionGroupItem[] = [
  { id: 'apply', label: 'Apply the allowlist to storefront', icon: 'az az-bolt' },
  { id: 'ratio', label: 'How much would the hit ratio improve?', icon: 'az az-chart-line' }
]

export const sampleSuggestions: SuggestionGroupItem[] = [
  { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'az az-bolt' },
  {
    id: 'errors',
    label: 'Why is storefront answering with 502 errors?',
    icon: 'az az-triangle-alert'
  },
  { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'az az-github' }
]

export const sampleArtifactVersions: string[] = [
  'SELECT id, customer_id, total\nFROM orders\nORDER BY total DESC\nLIMIT 10;',
  "SELECT id, customer_id, total\nFROM orders\nWHERE created_at > now() - interval '7 days'\nORDER BY total DESC\nLIMIT 10;"
]

export const sampleArtifactThread: (AiChatMessage & { version?: number })[] = [
  user('q1', 'Write a query for the ten biggest orders', '10:00'),
  {
    ...assistant('a1', 'Here is a query for the ten biggest orders, newest total first.', '10:01'),
    version: 0
  },
  user('q2', 'Only this week', '10:02'),
  {
    ...assistant('a2', 'Done. Version 2 keeps the orders of the last seven days.', '10:03'),
    version: 1
  }
]

export const sampleArtifactFollowUps: SuggestionGroupItem[] = [
  { id: 'email', label: 'Show the customer email too', icon: 'az az-mail' },
  { id: 'items', label: 'Count the items of each order', icon: 'az az-list' }
]

export const sampleReportCsv =
  'ZGF0ZSxyZXF1ZXN0cyxjYWNoZSBoaXQgcmF0aW8KMjAyNi0xMS0xNiwxMjA0MzMxLDkwJQoyMDI2LTExLTE3LDExODcyMDIsOTElCjIwMjYtMTEtMTgsMTI1MTk0MCw5MiUK'

export const sampleAgentMessages: AiChatMessage[] = [
  user('q1', 'Find why checkout got slower this week', '15:20'),
  {
    id: 'act1',
    role: 'activity',
    parts: [
      {
        type: 'activity',
        activityType: 'search',
        content: { title: 'Reading the metrics of acme-store', status: 'success' }
      },
      {
        type: 'activity',
        activityType: 'compare',
        content: {
          title: 'Comparing the last two deployments',
          status: 'success',
          detail: 'Builds 1041 and 1042'
        }
      }
    ]
  },
  {
    id: 'a1',
    role: 'assistant',
    parts: [
      {
        type: 'activity',
        activityType: 'wait',
        content: { title: 'Waiting for your answer', status: 'pending' }
      },
      {
        type: 'subagent',
        subagent: {
          id: 'researcher-1',
          name: 'researcher',
          description: 'Comparing the two deployments',
          status: 'finished',
          input: { application: 'acme-store', builds: [1041, 1042] },
          messages: [
            {
              id: 'r1',
              role: 'assistant',
              parts: [
                {
                  type: 'text',
                  content:
                    'Build **1042** added a function on `/checkout` that calls `api.example.com` on every request.'
                }
              ]
            }
          ]
        }
      },
      {
        type: 'text',
        content:
          'Checkout slowed down when build 1042 went live: its new function waits on the origin for every request. I can cache the origin response or roll back to build 1041.'
      }
    ],
    createdAt: at('15:21')
  }
]

export const sampleAgentInterrupts: AiChatInterrupt[] = [
  {
    kind: 'generic',
    id: 'question-fix',
    message: 'How should I fix checkout?',
    metadata: {
      options: [
        { value: 'cache', label: 'Cache the origin response for 60 seconds' },
        { value: 'rollback', label: 'Roll back to build 1041' }
      ]
    },
    status: 'pending',
    errors: []
  }
]

export interface AiChatProject {
  id: string
  code: string
  title: string
  kind: 'workload' | 'dns' | 'firewall' | 'function' | 'storage'
  icon: string
  pinned?: boolean
  inCloud?: boolean
}

export interface AiChatProduct {
  label: string
  icon: string
}

export interface AiChatThreadChange {
  ref: string
  title: string
}

export interface AiChatThread {
  id: string
  title: string
  projectId: string
  updatedAt: string
  age: string
  environment: string
  modelLabel: string
  providerIcon: string
  products: string[]
  version?: string
  draft?: boolean
  snoozed?: boolean
  settled?: boolean
  changes?: AiChatThreadChange[]
}

export const sampleHistoryNow = '2026-11-19T12:00:00Z'

export const sampleProducts: Record<string, AiChatProduct> = {
  applications: { label: 'Applications', icon: 'az az-applications' },
  firewall: { label: 'Firewall', icon: 'az az-firewall' },
  functions: { label: 'Functions', icon: 'az az-functions' },
  waf: { label: 'WAF', icon: 'az az-waf' },
  'real-time-purge': { label: 'Real-Time Purge', icon: 'az az-real-time-purge' },
  'sql-database': { label: 'SQL Database', icon: 'az az-sql-database' },
  'edge-dns': { label: 'Edge DNS', icon: 'az az-edge-dns' },
  'object-storage': { label: 'Object Storage', icon: 'az az-object-storage' },
  'image-processor': { label: 'Image Processor', icon: 'az az-image-processor' }
}

export const sampleProjects: AiChatProject[] = [
  {
    id: 'workloads',
    code: 'WL',
    title: 'Workloads',
    kind: 'workload',
    icon: 'az az-workloads',
    pinned: true
  },
  { id: 'edge-dns', code: 'DN', title: 'Edge DNS', kind: 'dns', icon: 'az az-edge-dns' },
  { id: 'firewall', code: 'FW', title: 'Firewall', kind: 'firewall', icon: 'az az-firewall' },
  {
    id: 'functions',
    code: 'FN',
    title: 'Functions',
    kind: 'function',
    icon: 'az az-functions',
    inCloud: true
  },
  {
    id: 'storage',
    code: 'OS',
    title: 'Object Storage',
    kind: 'storage',
    icon: 'az az-object-storage',
    inCloud: true
  }
]

export const sampleThreads: AiChatThread[] = [
  {
    id: 'h1',
    title: 'Why does storefront return 502 errors?',
    projectId: 'workloads',
    updatedAt: '2026-11-19T11:48:00Z',
    age: '12m',
    environment: 'prod-us-east',
    modelLabel: 'Claude Opus 4.5',
    providerIcon: 'az az-claude',
    products: ['applications', 'firewall', 'functions'],
    draft: true,
    changes: [
      { ref: '#1170', title: 'feat(workload): renew origin TLS cert for api.example.com' },
      { ref: '#1200', title: 'fix(cache): allowlist q and page query params on /search' },
      { ref: '#1203', title: 'chore(edge): enable stale-while-revalidate fallback' }
    ]
  },
  {
    id: 'h7',
    title:
      'Checkout on acme-store times out for customers in the EU region after the latest deploy',
    projectId: 'workloads',
    updatedAt: '2026-11-19T11:05:00Z',
    age: '55m',
    environment: 'prod-eu-west',
    modelLabel: 'Azion Auto',
    providerIcon: 'az az-azion',
    products: ['applications', 'functions']
  },
  {
    id: 'h2',
    title: 'Purge the cache after a deploy',
    projectId: 'workloads',
    updatedAt: '2026-11-19T09:40:00Z',
    age: '2h',
    environment: 'prod-us-east',
    modelLabel: 'Gemini 4 Neon',
    providerIcon: 'az az-gemini',
    products: ['real-time-purge'],
    changes: [{ ref: '#1170', title: 'ci(purge): trigger Real-Time Purge on release tag' }]
  },
  {
    id: 'h3',
    title: 'A WAF rule for login attempts',
    projectId: 'firewall',
    updatedAt: '2026-11-18T17:15:00Z',
    age: '1d',
    environment: 'edge-global',
    modelLabel: 'Claude Sonnet 4',
    providerIcon: 'az az-claude',
    products: ['waf'],
    version: 'v42',
    changes: [{ ref: '#1142', title: 'sec(waf): rate-limit /auth/login to 20 req/min' }]
  },
  {
    id: 'h4',
    title: 'Top orders query for acme-store',
    projectId: 'functions',
    updatedAt: '2026-11-16T10:20:00Z',
    age: '3d',
    environment: 'edge-sql-eu',
    modelLabel: 'GPT-5.2',
    providerIcon: 'az az-openai',
    products: ['sql-database'],
    version: 'v7'
  },
  {
    id: 'h5',
    title: 'Move DNS records to Azion',
    projectId: 'edge-dns',
    updatedAt: '2026-11-04T14:05:00Z',
    age: '2w',
    environment: 'dns-anycast',
    modelLabel: 'Gemini 4 Carbon',
    providerIcon: 'az az-gemini',
    products: ['edge-dns']
  },
  {
    id: 'h6',
    title: 'Image optimization for docs-site',
    projectId: 'storage',
    updatedAt: '2026-09-28T08:30:00Z',
    age: '1mo',
    environment: 'media-bucket',
    modelLabel: 'Azion Auto',
    providerIcon: 'az az-azion',
    products: ['image-processor', 'object-storage'],
    settled: true
  }
]

export const sampleProviders: PromptInputMenuOption[] = [
  { value: 'azion', label: 'Azion AI', icon: 'az az-azion' },
  { value: 'google', label: 'Google', icon: 'az az-gemini' },
  { value: 'anthropic', label: 'Anthropic', icon: 'az az-claude' },
  { value: 'openai', label: 'OpenAI', icon: 'az az-openai' },
  { value: 'meta', label: 'Meta', icon: 'az az-meta' }
]

export const sampleModels: PromptInputMenuOption[] = [
  {
    value: 'gemini-4-neon',
    label: 'Gemini 4 Neon',
    provider: 'google',
    icon: 'az az-gemini',
    shortcut: '⌘1'
  },
  {
    value: 'gemini-4-carbon',
    label: 'Gemini 4 Carbon',
    provider: 'google',
    icon: 'az az-gemini',
    shortcut: '⌘2'
  },
  {
    value: 'gemini-3-8-flash',
    label: 'Gemini 3.8 Flash',
    provider: 'google',
    icon: 'az az-gemini',
    shortcut: '⌘3'
  },
  {
    value: 'claude-opus-4-5',
    label: 'Claude Opus 4.5',
    provider: 'anthropic',
    icon: 'az az-claude',
    shortcut: '⌘4'
  },
  {
    value: 'claude-sonnet-4',
    label: 'Claude Sonnet 4',
    provider: 'anthropic',
    icon: 'az az-claude',
    shortcut: '⌘5'
  },
  { value: 'gpt-5-2', label: 'GPT-5.2', provider: 'openai', icon: 'az az-openai', shortcut: '⌘6' },
  {
    value: 'gpt-5-mini',
    label: 'GPT-5 Mini',
    provider: 'openai',
    icon: 'az az-openai',
    shortcut: '⌘7'
  },
  {
    value: 'llama-4-maverick',
    label: 'Llama 4 Maverick',
    provider: 'meta',
    icon: 'az az-meta',
    shortcut: '⌘8'
  },
  {
    value: 'auto',
    label: 'Azion Auto',
    provider: 'azion',
    icon: 'az az-azion',
    description: 'AI Gateway router'
  }
]

export const sampleModes: PromptInputMenuOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'extra', label: 'Extra' }
]

export const sampleContexts: PromptInputMenuOption[] = [
  { value: 'acme-store', label: 'acme-store', description: 'Storefront and checkout' },
  { value: 'docs-site', label: 'docs-site', description: 'Product documentation' }
]

export const sampleTools: PromptInputMenuOption[] = [
  { value: 'web-search', label: 'Web search', icon: 'az az-globe' },
  { value: 'deep-research', label: 'Deep research', icon: 'az az-lightbulb' },
  { value: 'create-image', label: 'Create image', icon: 'az az-image' }
]
