import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import RecognitionMarquee from '@aziontech/webkit/sections/recognition-marquee'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/recognition-marquee'

const IMPORT = "import RecognitionMarquee from '@aziontech/webkit/sections/recognition-marquee'"

const source = (section) => {
  const { body, script } = sectionMarkup('RecognitionMarquee', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Social Proof/RecognitionMarquee',
  component: RecognitionMarquee,
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
  components: { SectionContainer, SectionGap, RecognitionMarquee },
  setup() {
    return { args }
  },
  template: inColumn('<RecognitionMarquee v-bind="args" />')
})

export const Default = {
  render: Template,
  args: withStoryAssets(SITE_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The seven recognitions Home runs, at twelve seconds per card. Each firm logo has a reversed file for dark and a colour file for light; G2 uses one colour file on both.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
