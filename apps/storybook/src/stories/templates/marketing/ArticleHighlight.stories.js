import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ArticleHighlight from '@aziontech/webkit/sections/article-highlight'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/article-highlight'

const IMPORT = "import ArticleHighlight from '@aziontech/webkit/sections/article-highlight'"

const source = (section) => {
  const { body, script } = sectionMarkup('ArticleHighlight', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Articles/ArticleHighlight',
  component: ArticleHighlight,
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
  components: { SectionContainer, SectionGap, ArticleHighlight },
  setup() {
    return { args }
  },
  template: inColumn('<ArticleHighlight v-bind="args" />')
})

export const Featured = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          "The Blog page's band: its four newest posts, the first featured over the wall of titles."
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const FeaturedJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
