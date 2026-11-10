import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import FaqSection from '@aziontech/webkit/faq-section'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { PLAIN_SECTION, RICH_ANSWERS_SECTION, WITH_LINK_SECTION } from './_sections/faq-section'

const IMPORT = "import FaqSection from '@aziontech/webkit/faq-section'"

const source = (section) => {
  const { body, script } = sectionMarkup('FaqSection', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Content/FaqSection',
  component: FaqSection,
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
  components: { SectionContainer, SectionGap, FaqSection },
  setup() {
    return { args }
  },
  template: inColumn('<FaqSection v-bind="args" />')
})

export const WithLink = {
  render: Template,
  args: WITH_LINK_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Retail page questions. The second answer carries a markdown link inside its sentence.'
      },
      source: { code: source(WITH_LINK_SECTION) }
    }
  }
}

export const WithLinkJson = {
  tags: ['!dev'],
  ...siteJsonStory(WITH_LINK_SECTION)
}

export const Plain = {
  render: Template,
  args: PLAIN_SECTION.props,
  parameters: {
    docs: {
      description: {
        story: 'The Functions page questions, every answer plain text.'
      },
      source: { code: source(PLAIN_SECTION) }
    }
  }
}

export const PlainJson = {
  tags: ['!dev'],
  ...siteJsonStory(PLAIN_SECTION)
}

export const RichAnswers = {
  render: Template,
  args: RICH_ANSWERS_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The GDPR page questions. Each answer runs to several paragraphs, one of them a bullet list, written as markdown in the answer string.'
      },
      source: { code: source(RICH_ANSWERS_SECTION) }
    }
  }
}

export const RichAnswersJson = {
  tags: ['!dev'],
  ...siteJsonStory(RICH_ANSWERS_SECTION)
}
