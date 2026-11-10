import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ArticleCards from '@aziontech/webkit/article-cards'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import {
  ARTICLES_SECTION,
  CENTERED_SECTION,
  SUCCESS_CASES_SECTION
} from './_sections/article-cards'

const IMPORT = "import ArticleCards from '@aziontech/webkit/article-cards'"

const source = (section) => {
  const { body, script } = sectionMarkup('ArticleCards', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Articles/ArticleCards',
  component: ArticleCards,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const Template = (args) => ({
  components: { SectionContainer, SectionGap, ArticleCards },
  setup() {
    return { args }
  },
  template: inColumn('<ArticleCards v-bind="args" />')
})

export const RelatedArticles = {
  render: Template,
  args: withStoryAssets(ARTICLES_SECTION.props),
  parameters: {
    docs: {
      description: {
        story: "The blog post's closing band: three related posts, each with its cover image."
      },
      source: { code: source(ARTICLES_SECTION) }
    }
  }
}

export const RelatedArticlesJson = {
  tags: ['!dev'],
  ...siteJsonStory(ARTICLES_SECTION)
}

export const RelatedSuccessCases = {
  render: Template,
  args: withStoryAssets(SUCCESS_CASES_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          "The Magalu story's closing band: three Retail stories, each card drawing its client's mark."
      },
      source: { code: source(SUCCESS_CASES_SECTION) }
    }
  }
}

export const RelatedSuccessCasesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SUCCESS_CASES_SECTION)
}

export const Centered = {
  render: Template,
  args: withStoryAssets(CENTERED_SECTION.props),
  parameters: {
    docs: {
      description: {
        story: 'The heading centred under an overline over the cards, as a landing-page band.'
      },
      source: { code: source(CENTERED_SECTION) }
    }
  }
}

export const CenteredJson = {
  tags: ['!dev'],
  ...siteJsonStory(CENTERED_SECTION)
}
