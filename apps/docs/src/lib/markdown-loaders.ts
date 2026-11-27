import type { MarkdownDoc } from './types'

export const foundationDocs = import.meta.glob<MarkdownDoc>(
  [
    '../../../../rules/*.md',
    '../../../../packages/ui/README.md',
    '../../../../packages/ui/docs/AI.md',
    '../../../../skills/azion-ui-ai-surfaces/SKILL.md',
    '../../../../skills/azion-ui-api-data/SKILL.md',
    '../../../../skills/azion-ui-azion-api/SKILL.md',
    '../../../../skills/azion-ui-create-surface/SKILL.md',
    '../../../../skills/azion-ui-data-viz/SKILL.md',
    '../../../../skills/azion-ui-errors/SKILL.md',
    '../../../../skills/azion-ui-form/SKILL.md',
    '../../../../skills/azion-ui-in-product-help/SKILL.md',
    '../../../../skills/azion-ui-layout/SKILL.md',
    '../../../../skills/azion-ui-lists/SKILL.md',
    '../../../../skills/azion-ui-microcopy/SKILL.md',
    '../../../../skills/azion-ui-navigation/SKILL.md',
    '../../../../skills/azion-ui-product-screens/SKILL.md',
    '../../../../skills/azion-ui-query-explorer/SKILL.md',
    '../../../../skills/azion-ui-site-pages/SKILL.md',
    '../../../../skills/azion-ui-tables/SKILL.md',
    '../../../../skills/azion-ui-states/SKILL.md'
  ],
  { query: '?markdown', import: 'default' }
)
