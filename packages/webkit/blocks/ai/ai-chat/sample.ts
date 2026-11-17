import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'

import type { AiChatMessage } from './ai-chat.vue'

const cacheAnswer = [
  'Use **Real-Time Purge** with the *URL* type. It removes one object from every edge location in a few seconds [1].',
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
  {
    id: 'm1',
    from: 'user',
    content: 'Why is storefront answering with 502 errors?',
    time: '14:12'
  },
  {
    id: 'm2',
    from: 'assistant',
    content: errorsAnswer.slice(0, 120),
    time: '14:12',
    reasoning:
      'The reader asks about errors on storefront. The error rate rose at 14:05; the certificate of the origin expired at the same minute.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Troubleshooting 502 responses',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation · Observe'
      }
    ]
  }
]

export const sampleInterruptedMessages: AiChatMessage[] = [
  {
    id: 'm1',
    from: 'user',
    content: 'How do I purge the cache of one URL?',
    time: '10:41'
  },
  {
    id: 'm2',
    from: 'assistant',
    content: cacheAnswer.slice(0, 104),
    time: '10:41',
    reasoning:
      'The question is about one URL, so a full purge would be too broad. Real-Time Purge by URL is the narrowest option, and the CLI does the same from a terminal.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Real-Time Purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation · Cache'
      },
      {
        title: 'Azion CLI: purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation · CLI'
      }
    ]
  }
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
  ['What is the cache hit ratio today?', '**91%** over the last 24 hours, up from 87% last week.'],
  [
    'Which paths miss the cache most?',
    'The search pages under `/search`, because every query string is a new cache key.'
  ],
  [
    'How do I fix that?',
    'Set *Cache by query string* to **Allowlist** and keep only `q` and `page`.'
  ]
]

export const sampleLongThread: AiChatMessage[] = history.flatMap(
  ([question, answer], index): AiChatMessage[] => [
    { id: `q${index}`, from: 'user', content: question, time: `09:${10 + index * 4}` },
    {
      id: `a${index}`,
      from: 'assistant',
      content: answer,
      time: `09:${11 + index * 4}`,
      reasoning: 'Reading the workload settings of storefront.',
      reasoningSeconds: 2,
      sources: []
    }
  ]
)

export const sampleLongThreadFollowUps: SuggestionGroupItem[] = [
  { id: 'apply', label: 'Apply the allowlist to storefront' },
  { id: 'ratio', label: 'How much would the hit ratio improve?' }
]

export const sampleSuggestions: SuggestionGroupItem[] = [
  { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'az az-bolt' },
  {
    id: 'errors',
    label: 'Why is storefront answering with 502 errors?',
    icon: 'az az-triangle-alert'
  },
  { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'az az-github' },
  { id: 'waf', label: 'Protect my site with a WAF', icon: 'az az-shield' }
]

export const sampleArtifactVersions: string[] = [
  'SELECT id, customer_id, total\nFROM orders\nORDER BY total DESC\nLIMIT 10;',
  "SELECT id, customer_id, total\nFROM orders\nWHERE created_at > now() - interval '7 days'\nORDER BY total DESC\nLIMIT 10;"
]

export const sampleArtifactThread: (AiChatMessage & { version?: number })[] = [
  { id: 'q1', from: 'user', content: 'Write a query for the ten biggest orders', time: '10:00' },
  {
    id: 'a1',
    from: 'assistant',
    content: 'Here is a query for the ten biggest orders, newest total first.',
    time: '10:01',
    version: 0
  },
  { id: 'q2', from: 'user', content: 'Only this week', time: '10:02' },
  {
    id: 'a2',
    from: 'assistant',
    content: 'Done. Version 2 keeps the orders of the last seven days.',
    time: '10:03',
    version: 1
  }
]

export const sampleArtifactFollowUps: SuggestionGroupItem[] = [
  { id: 'email', label: 'Show the customer email too' },
  { id: 'items', label: 'Count the items of each order' }
]
