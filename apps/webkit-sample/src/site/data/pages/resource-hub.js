import { BLOG_POSTS } from '../blog.js'
import { blogPostLink } from '../blog-articles.js'
import {
  RESOURCE_HUB_FACETS,
  RESOURCE_HUB_HERO,
  RESOURCE_HUB_LISTING,
  RESOURCE_HUB_NEWSLETTER,
  RESOURCES
} from '../resource-hub.js'
import { successCaseLink } from '../success-case-articles.js'
import { SUCCESS_CASES } from '../success-cases.js'

const path = (href) => new URL(href).pathname.replace(/\/?$/, '/')
const byPath = (list) => new Map(list.map((entry) => [path(entry.href), entry]))

const POSTS = byPath(BLOG_POSTS)
const STORIES = byPath(SUCCESS_CASES)

// The competitor guides this Site rebuilds, by the source's landing-page slug.
const GUIDES = ['akamai', 'aws', 'cloudflare', 'fastly', 'vercel']
const guideLink = (href) => {
  const vendor = path(href).match(/\/lp\/([a-z0-9]+)-to-azion-alternative-guide\/$/)?.[1]
  return GUIDES.includes(vendor) ? { href: `/site/guides/${vendor}-alternative` } : null
}

const linkOf = (resource) => {
  const post = POSTS.get(path(resource.href))
  if (post) return blogPostLink(post)
  const story = STORIES.get(path(resource.href))
  if (story) return successCaseLink(story)
  return guideLink(resource.href) ?? { href: resource.href, external: true }
}

const INDEX = RESOURCES.map((resource, index) => ({
  key: `${index}-${path(resource.href)}`,
  ...linkOf(resource),
  image: resource.image,
  mark: resource.image ? null : (STORIES.get(path(resource.href))?.client ?? null),
  meta: [resource.contentType, resource.date].join(' • '),
  title: resource.title,
  description: resource.description,
  categories: resource.categories,
  facets: {
    contentType: [resource.contentType],
    categories: resource.categories,
    industry: resource.industry ? [resource.industry] : []
  }
}))

export const RESOURCE_HUB_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    eyebrow: RESOURCE_HUB_HERO.eyebrow,
    eyebrowPrefix: '//',
    title: RESOURCE_HUB_HERO.title,
    description: RESOURCE_HUB_HERO.description,
    actions: [
      { label: 'Start for free', href: '/signup', kind: 'secondary' },
      { label: 'Talk to a specialist', href: '/site/contact', kind: 'outlined', trailing: true }
    ]
  },
  {
    section: 'ArticleIndex',
    anchor: 'resources',
    gap: false,
    title: RESOURCE_HUB_LISTING.title,
    items: INDEX,
    facets: RESOURCE_HUB_FACETS,
    rowKind: 'centered',
    moreLabel: RESOURCE_HUB_LISTING.moreLabel,
    empty: RESOURCE_HUB_LISTING.empty,
    ariaLabel: 'Resources'
  },
  {
    section: 'ClosingCallToAction',
    kind: 'newsletter',
    eyebrow: RESOURCE_HUB_NEWSLETTER.eyebrow,
    title: RESOURCE_HUB_NEWSLETTER.title,
    description: RESOURCE_HUB_NEWSLETTER.description,
    form: {
      label: 'Email',
      placeholder: RESOURCE_HUB_NEWSLETTER.placeholder,
      submit: RESOURCE_HUB_NEWSLETTER.submit,
      success: RESOURCE_HUB_NEWSLETTER.success,
      required: 'Enter your email address.',
      invalid: 'Enter an email address like name@example.com.'
    }
  }
]
