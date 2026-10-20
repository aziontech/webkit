import { BLOG_ALL, BLOG_CATEGORIES, BLOG_FEATURED, BLOG_LABELS, BLOG_NEWSLETTER, BLOG_POSTS } from '../blog.js'
import { blogArticle, blogPostLink } from '../blog-articles.js'

const HIGHLIGHT_SIDE = 4

const metaOf = (post) => [post.categories?.[0], post.date].filter(Boolean).join(' · ')

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

const HIGHLIGHT = [BLOG_FEATURED, ...BLOG_POSTS.slice(0, HIGHLIGHT_SIDE)].map((post) => ({
  key: post.key,
  href: blogPostLink(post).href,
  image: post.image,
  meta: [post.categories?.[0], post.date].filter(Boolean).join(' • '),
  title: post.title,
  description: post.description,
  readTime: post.readTime
}))

const INDEX = BLOG_POSTS.map((post) => {
  const article = blogArticle(post.key)
  return {
    key: post.key,
    href: blogPostLink(post).href,
    title: post.title,
    description: post.description,
    categories: post.categories ?? [],
    meta: metaOf(post),
    authors: article?.authors ?? [],
    byline: [article?.author, post.readTime].filter(Boolean).join(' · ')
  }
})

export const BLOG_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    eyebrow: 'Resources',
    title: 'Blog',
    description: 'Insights, industry trends',
    actions: [{ label: 'See posts', href: '#posts', kind: 'secondary' }]
  },
  { section: 'ArticleHighlight', anchor: 'articles', items: HIGHLIGHT },
  {
    section: 'ArticleIndex',
    anchor: 'posts',
    items: INDEX,
    categories: BLOG_CATEGORIES,
    allLabel: BLOG_ALL,
    leading: HIGHLIGHT_SIDE,
    search: { placeholder: BLOG_LABELS.search, label: 'Search articles' },
    moreLabel: BLOG_LABELS.loadMore,
    empty: { title: 'No results found for these applied filters.', action: 'View all articles' }
  },
  BLOG_CLOSING
]
