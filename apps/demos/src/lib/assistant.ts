import type { SourcesItem } from '@aziontech/webkit/sources'
import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'

export type Answer = {
  reasoning: string
  content: string
  sources: SourcesItem[]
  followUps: SuggestionGroupItem[]
}

const knowledge: { cache: Answer; errors: Answer } = {
  cache: {
    reasoning:
      'The question is about one URL, so a full purge would be too broad. Real-Time Purge by URL is the narrowest option, and the CLI does the same from a terminal.',
    content: [
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
    ].join('\n'),
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
    ],
    followUps: [
      { id: 'wildcard', label: 'How do I purge a whole folder?' },
      { id: 'ttl', label: 'What TTL should my images use?' },
      { id: 'origin', label: 'Why does my origin still get requests?' }
    ]
  },
  errors: {
    reasoning:
      'The reader asks about errors on storefront. The error rate rose at 14:05; the certificate of the origin expired at the same minute.',
    content: [
      'The **502** responses on storefront started at 14:05, when the TLS certificate of the origin `api.example.com` expired [1].',
      '',
      '| Time | 5xx rate | Cause |',
      '| --- | --- | --- |',
      '| 14:00 | 0.1% | — |',
      '| 14:05 | 38% | Origin certificate expired |',
      '',
      'Renew the certificate at the origin, or let the origin accept plain HTTP from the edge while you renew it.'
    ].join('\n'),
    sources: [
      {
        title: 'Troubleshooting 502 responses',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation · Observe'
      }
    ],
    followUps: [
      { id: 'renew', label: 'How do I renew the origin certificate?' },
      { id: 'alert', label: 'Alert me when the error rate goes over 5%' }
    ]
  }
}

export function answerFor(text: string): Answer {
  return /error|502|5xx|fail/i.test(text) ? knowledge.errors : knowledge.cache
}
