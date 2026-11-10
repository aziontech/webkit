import ArticleBody from '@aziontech/webkit/article-body'

import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/article-body'

const IMPORT = "import ArticleBody from '@aziontech/webkit/article-body'"

const source = (section) => {
  const { body, script } = sectionMarkup('ArticleBody', section.props)
  return toSfc([IMPORT, '', ...script], body)
}

const meta = {
  title: 'Templates/Marketing/Articles/ArticleBody',
  component: ArticleBody,
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
  components: { ArticleBody },
  setup() {
    return { args }
  },
  template: '<ArticleBody v-bind="args" />'
})

export const SuccessStory = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Magalu success story under Success cases › Retail: the byline is the date and read time, and the outline lists the three sections of the prose.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const SuccessStoryJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
