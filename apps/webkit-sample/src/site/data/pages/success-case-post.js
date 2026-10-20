import { BLOG_SHARE } from '../blog-articles.js'
import {
  loadSuccessCaseBody,
  successCaseArticle,
  successCaseLink,
  successCaseRelated
} from '../success-case-articles.js'
import { ARTICLE_RAIL } from './blog-post.js'
import { SUCCESS_CASES_CLOSING } from './success-cases.js'

const STORY_SHARE = { ...BLOG_SHARE, copyFeed: '', feed: '' }

export function successCasePostPage(slug) {
  const story = successCaseArticle(slug) ?? successCaseArticle('magalu')
  return [
    {
      section: 'ArticleBody',
      ...ARTICLE_RAIL,
      article: {
        title: story.title,
        description: story.description,
        date: story.date,
        readTime: story.readTime,
        href: story.href
      },
      trail: [
        { label: 'Success cases', href: '/site/success-cases' },
        {
          label: story.industry,
          href: `/site/success-cases?industry=${encodeURIComponent(story.industry)}`
        },
        { label: story.title, current: true }
      ],
      load: () => loadSuccessCaseBody(story.slug),
      share: STORY_SHARE
    },
    {
      section: 'ArticleCards',
      title: 'Related Success Cases',
      items: successCaseRelated(story).map((related) => ({
        key: related.key,
        ...successCaseLink(related),
        title: related.title,
        description: related.description,
        meta: `${related.date} • ${related.readTime}`,
        mark: related.client
      }))
    },
    SUCCESS_CASES_CLOSING
  ]
}
