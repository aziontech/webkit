import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ArticleIndexBlog from '@aziontech/webkit/sections/article-index-blog'
import ArticleIndexResourceHub from '@aziontech/webkit/sections/article-index-resource-hub'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION as BLOG_SECTION } from './_sections/article-index-blog'
import { SITE_SECTION as HUB_SECTION } from './_sections/article-index-resource-hub'

const BLOG_IMPORT = "import ArticleIndexBlog from '@aziontech/webkit/sections/article-index-blog'"
const HUB_IMPORT =
  "import ArticleIndexResourceHub from '@aziontech/webkit/sections/article-index-resource-hub'"

const source = (tag, importLine, section) => {
  const { body, script } = sectionMarkup(tag, section.props)
  return toSfc([...COLUMN_IMPORTS, importLine, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Listings/ArticleIndex',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const BlogTemplate = (args) => ({
  components: { SectionContainer, SectionGap, ArticleIndexBlog },
  setup() {
    return { args }
  },
  template: inColumn('<ArticleIndexBlog v-bind="args" />')
})

const HubTemplate = (args) => ({
  components: { SectionContainer, SectionGap, ArticleIndexResourceHub },
  setup() {
    return { args }
  },
  template: inColumn('<ArticleIndexResourceHub v-bind="args" />')
})

export const AllArticles = {
  render: BlogTemplate,
  args: BLOG_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          "The Blog page's list at rest: All articles selected and no search, rows in the byline layout, and the load-more button."
      },
      source: { code: source('ArticleIndexBlog', BLOG_IMPORT, BLOG_SECTION) }
    }
  }
}

export const AllArticlesJson = {
  tags: ['!dev'],
  ...siteJsonStory(BLOG_SECTION)
}

export const ResourceHub = {
  render: HubTemplate,
  args: HUB_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          "The Resource Hub's list: a headline beside three facet dropdowns, rows in the centered layout."
      },
      source: { code: source('ArticleIndexResourceHub', HUB_IMPORT, HUB_SECTION) }
    }
  }
}

export const ResourceHubJson = {
  tags: ['!dev'],
  ...siteJsonStory(HUB_SECTION)
}
