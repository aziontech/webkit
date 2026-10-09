// Every success story rebuilt as a /site article, on the blog article's layout. The library entry
// (client, industry, products) is data/success-cases.js; the headline, deck and date are
// data/success-case-article-meta.js; the body is the source story, verbatim, as markdown in
// ../content/success-cases/<slug>.md, loaded on demand.
import { SUCCESS_CASE_ARTICLE_META } from './success-case-article-meta.js'
import { SUCCESS_CASES } from './success-cases.js'

const BODIES = import.meta.glob('../content/success-cases/*.md', { query: '?raw', import: 'default' })
const bodyPath = (slug) => `../content/success-cases/${slug}.md`

const RELATED_SHOWN = 3

/** A library entry's article slug: its key without the `case-` prefix. */
export const successCaseSlug = (story) => story.key.replace(/^case-/, '')

/** The article for a slug, or null when none is rebuilt. */
export function successCaseArticle(slug) {
  const story = SUCCESS_CASES.find((entry) => successCaseSlug(entry) === slug)
  const meta = SUCCESS_CASE_ARTICLE_META[slug]
  if (!story || !meta || !BODIES[bodyPath(slug)]) return null
  return { ...story, ...meta, slug }
}

/** The article's markdown body. */
export const loadSuccessCaseBody = (slug) => BODIES[bodyPath(slug)]()

/** Where a story opens: its /site article when one is rebuilt, otherwise azion.com. */
export const successCaseLink = (story) =>
  successCaseArticle(successCaseSlug(story))
    ? { href: `/site/success-cases/${successCaseSlug(story)}`, external: false }
    : { href: story.href, external: true }

// The source prints no related stories, so the article closes on the library's own order:
// the next stories in the same industry, then the ones after it in the library.
export function successCaseRelated(article) {
  const others = SUCCESS_CASES.filter(
    (story) => story.key !== article.key && successCaseArticle(successCaseSlug(story))
  )
  const at = SUCCESS_CASES.findIndex((story) => story.key === article.key)
  const after = [...others.filter((_, i) => i >= at), ...others.filter((_, i) => i < at)]
  const sameIndustry = after.filter((story) => story.industry === article.industry)
  return [...new Set([...sameIndustry, ...after])]
    .slice(0, RELATED_SHOWN)
    .map((story) => successCaseArticle(successCaseSlug(story)))
}
