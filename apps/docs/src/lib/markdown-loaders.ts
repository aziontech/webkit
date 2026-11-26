import type { MarkdownDoc } from './types'

export const foundationDocs = import.meta.glob<MarkdownDoc>(
  [
    '../../../../rules/*.md',
    '../../../../packages/webkit/README.md',
    '../../../../packages/webkit/docs/AI.md',
    '../../../../skills/webkit-azion-api/SKILL.md',
    '../../../../skills/webkit-query-explorer/SKILL.md',
    '../../../../skills/webkit-in-product-help/SKILL.md',
    '../../../../skills/webkit-api-data/SKILL.md'
  ],
  { query: '?markdown', import: 'default' }
)
