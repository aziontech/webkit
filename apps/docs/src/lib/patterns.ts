import data from '../../../../skills/patterns.json' with { type: 'json' }

export type PatternGroup =
  'screens' | 'forms' | 'data' | 'feedback' | 'navigation' | 'content' | 'ai' | 'azion'

export type PatternPage = {
  slug: string
  title: string
  summary: string
  group: PatternGroup
  markdown: string
}

export const PATTERN_GROUPS = data.groups as PatternGroup[]

export const PATTERNS: PatternPage[] = data.patterns.map((page) => ({
  slug: page.slug,
  title: page.title,
  summary: page.summary,
  group: page.group as PatternGroup,
  markdown: `skills/${page.skill}/SKILL.md`
}))

export const PATTERN_SLUGS = PATTERNS.map((page) => page.slug)

export const MOVED_FROM_FOUNDATIONS = ['azion-api', 'query-explorer', 'in-product-help', 'api-data']
