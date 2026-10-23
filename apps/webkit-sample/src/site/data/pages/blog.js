import { BLOG_ALL, BLOG_CATEGORIES, BLOG_LABELS, BLOG_NEWSLETTER, BLOG_POSTS } from '../blog.js'
import { blogArticle, blogPostLink } from '../blog-articles.js'
import { COMPANY_CLOSING } from '../product-pages.js'

const HIGHLIGHT_KEYS = [
  'ship-portfolio-two-commands-azion-cli',
  'how-to-reduce-ai-agent-latency',
  'cloudflare-alternatives-and-competitors',
  'which-azion-plan-is-right-for-your-project'
]

const HIGHLIGHT_POSTS = HIGHLIGHT_KEYS.map((key) => BLOG_POSTS.find((post) => post.key === key))

const ORDERED_POSTS = [
  ...HIGHLIGHT_POSTS,
  ...BLOG_POSTS.filter((post) => !HIGHLIGHT_KEYS.includes(post.key))
]

const metaOf = (post) => [post.categories?.[0], post.date].filter(Boolean).join(' • ')

export const BLOG_CLOSING = {
  section: 'ClosingCallToAction',
  kind: 'newsletter',
  eyebrow: BLOG_NEWSLETTER.eyebrow,
  title: BLOG_NEWSLETTER.title,
  description: BLOG_NEWSLETTER.description,
  form: {
    label: 'Email',
    placeholder: BLOG_NEWSLETTER.placeholder,
    submit: BLOG_NEWSLETTER.submit,
    success: BLOG_NEWSLETTER.success,
    required: 'Enter your email address.',
    invalid: 'Enter an email address like name@example.com.'
  }
}

const HIGHLIGHT = HIGHLIGHT_POSTS.map((post) => ({
  key: post.key,
  href: blogPostLink(post).href,
  image: post.image,
  highlightImage: post.highlightImage,
  meta: metaOf(post),
  title: post.title,
  description: post.description,
  readTime: post.readTime
}))

const INDEX = ORDERED_POSTS.map((post) => {
  const article = blogArticle(post.key)
  return {
    key: post.key,
    href: blogPostLink(post).href,
    image: post.image,
    title: post.title,
    description: post.description,
    categories: post.categories ?? [],
    meta: metaOf(post),
    authors: article?.authors ?? [],
    byline: [article?.author, post.readTime].filter(Boolean).join(' · ')
  }
})

export const BLOG_PAGE = [
  { section: 'ArticleHighlight', anchor: 'articles', gap: 'small', fill: true, items: HIGHLIGHT },
  {
    section: 'ArticleIndex',
    anchor: 'posts',
    gap: 'small',
    items: INDEX,
    categories: BLOG_CATEGORIES,
    allLabel: BLOG_ALL,
    search: { placeholder: BLOG_LABELS.search, label: 'Search articles' },
    moreLabel: BLOG_LABELS.loadMore,
    empty: { title: 'No articles match these filters', action: 'View all articles' }
  },
  COMPANY_CLOSING
]
