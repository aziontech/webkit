// Every blog article rebuilt as a /site page. The listing data (title, deck, date, image) is
// data/blog.js; the byline and related articles are data/blog-article-meta.js; the body is the
// source article, verbatim, as markdown in ../content/blog/<slug>.md, loaded on demand.
import { BLOG_FEATURED, BLOG_ORIGIN, BLOG_POSTS } from './blog.js'
import { BLOG_ARTICLE_META } from './blog-article-meta.js'

const BODIES = import.meta.glob('../content/blog/*.md', { query: '?raw', import: 'default' })
const bodyPath = (slug) => `../content/blog/${slug}.md`

const RELATED_SHOWN = 3

/** The article for a slug, or null when none is rebuilt. */
export function blogArticle(slug) {
  const post = [BLOG_FEATURED, ...BLOG_POSTS].find((entry) => entry.key === slug)
  const meta = BLOG_ARTICLE_META[slug]
  if (!post || !meta || !BODIES[bodyPath(slug)]) return null
  return {
    ...post,
    authors: meta.authors,
    author: meta.authors.map((person) => person.name).join(', '),
    related: meta.related
  }
}

/** The article's markdown body. */
export const loadBlogBody = (slug) => BODIES[bodyPath(slug)]()

// The article rail, in the source's order and wording: Copy page and its menu, the three share
// controls, then the community links.
export const BLOG_COPY_PAGE = {
  label: 'Copy page',
  menu: [
    { value: 'link', label: 'Get page link', icon: 'pi pi-link' },
    { value: 'markdown', label: 'View page as markdown', icon: 'pi pi-eye' },
    { value: 'google', label: 'Open in Google AI', icon: 'pi pi-external-link' },
    { value: 'perplexity', label: 'Open in Perplexity', icon: 'pi pi-external-link' },
    { value: 'claude', label: 'Open in Claude', icon: 'pi pi-external-link' },
    { value: 'chatgpt', label: 'Open in ChatGPT', icon: 'pi pi-external-link' },
    { value: 'grok', label: 'Open in Grok', icon: 'pi pi-external-link' }
  ]
}

/** Where each "Open in" action sends the reader, with the article URL as the prompt. */
export const BLOG_ASSISTANTS = {
  google: (q) => `https://www.google.com/search?udm=50&q=${q}`,
  perplexity: (q) => `https://www.perplexity.ai/search?q=${q}`,
  claude: (q) => `https://claude.ai/new?q=${q}`,
  chatgpt: (q) => `https://chatgpt.com/?q=${q}`,
  grok: (q) => `https://grok.com/?q=${q}`
}

export const BLOG_SHARE = {
  title: 'Share this article',
  copyLink: 'Copy link',
  copyFeed: 'Copy RSS feed link',
  shareX: 'Share on X',
  shareLinkedIn: 'Share on LinkedIn',
  copiedLink: 'Link copied to clipboard',
  copiedFeed: 'RSS feed link copied to clipboard',
  copiedPage: 'Article copied as Markdown',
  feed: `${BLOG_ORIGIN}/en/blog/feed/index.xml`,
  xIntent: (url) => `https://x.com/intent/tweet?url=${url}&via=aziontech`,
  linkedInShare: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}

export const BLOG_COMMUNITY = {
  title: 'Community',
  links: [
    { label: 'Join us on Discord', href: 'https://discord.com/invite/Yp9N7RMVZy', icon: 'pi pi-discord' },
    { label: 'Read our blog posts', href: '/site/blog', icon: 'pi pi-comment' },
    { label: 'Follow us on X', href: 'https://twitter.com/aziontech', icon: 'ai ai-x' }
  ]
}

/** Where a post opens: its /site article when one is rebuilt, otherwise azion.com. */
export const blogPostLink = (post) =>
  blogArticle(post.key)
    ? { href: `/site/blog/${post.key}`, external: false }
    : { href: post.href, external: true }

/** The first related articles the source lists that exist in the index, as many as are shown. */
export const blogRelated = (article) =>
  article.related
    .map((key) => [BLOG_FEATURED, ...BLOG_POSTS].find((post) => post.key === key))
    .filter(Boolean)
    .slice(0, RELATED_SHOWN)
