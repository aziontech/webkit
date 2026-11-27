import type { MarkdownDoc } from './types'

export const foundationDocs = import.meta.glob<MarkdownDoc>(
  [
    '../../../../rules/*.md',
    '../../../../packages/webkit/README.md',
    '../../../../packages/webkit/docs/AI.md',
    '../../../../skills/webkit-ai-surfaces/SKILL.md',
    '../../../../skills/webkit-api-data/SKILL.md',
    '../../../../skills/webkit-azion-api/SKILL.md',
    '../../../../skills/webkit-create-surface/SKILL.md',
    '../../../../skills/webkit-data-viz/SKILL.md',
    '../../../../skills/webkit-errors/SKILL.md',
    '../../../../skills/webkit-form/SKILL.md',
    '../../../../skills/webkit-in-product-help/SKILL.md',
    '../../../../skills/webkit-layout/SKILL.md',
    '../../../../skills/webkit-lists/SKILL.md',
    '../../../../skills/webkit-microcopy/SKILL.md',
    '../../../../skills/webkit-navigation/SKILL.md',
    '../../../../skills/webkit-product-screens/SKILL.md',
    '../../../../skills/webkit-query-explorer/SKILL.md',
    '../../../../skills/webkit-site-pages/SKILL.md',
    '../../../../skills/webkit-tables/SKILL.md',
    '../../../../skills/webkit-ui-states/SKILL.md'
  ],
  { query: '?markdown', import: 'default' }
)
