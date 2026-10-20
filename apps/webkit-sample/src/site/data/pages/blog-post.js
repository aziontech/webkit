import { BLOG_FEATURED } from '../blog.js'
import {
  BLOG_ASSISTANTS,
  BLOG_COMMUNITY,
  BLOG_COPY_PAGE,
  BLOG_SHARE,
  blogArticle,
  blogPostLink,
  blogRelated,
  loadBlogBody
} from '../blog-articles.js'
import { BLOG_CLOSING } from './blog.js'

export const ARTICLE_RAIL = {
  community: BLOG_COMMUNITY,
  copyPage: BLOG_COPY_PAGE,
  assistants: BLOG_ASSISTANTS
}

const articleOf = (article) => ({
  title: article.title,
  description: article.description,
  date: article.date,
  readTime: article.readTime,
  href: article.href,
  author: article.author ?? '',
  authors: article.authors ?? []
})

export function blogPostPage(slug) {
  const article = blogArticle(slug) ?? blogArticle(BLOG_FEATURED.key)
  const category = article.categories?.[0]
  return [
    {
      section: 'ArticleBody',
      ...ARTICLE_RAIL,
      article: articleOf(article),
      trail: [
        { label: 'Blog', href: '/site/blog' },
        ...(category
          ? [{ label: category, href: `/site/blog?category=${encodeURIComponent(category)}` }]
          : []),
        { label: article.title, current: true }
      ],
      load: () => loadBlogBody(article.key),
      share: BLOG_SHARE
    },
    {
      section: 'ArticleCards',
      title: 'Related Articles',
      items: blogRelated(article).map((post) => ({
        key: post.key,
        ...blogPostLink(post),
        title: post.title,
        description: post.description,
        meta: `${post.date} • ${post.readTime}`,
        image: post.image
      }))
    },
    BLOG_CLOSING
  ]
}
