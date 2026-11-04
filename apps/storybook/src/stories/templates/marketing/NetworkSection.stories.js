import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import NetworkSection from '@aziontech/webkit/sections/network-section'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { BENEFITS_SECTION, OUTCOMES_SECTION } from './_sections/network-section'

const IMPORT = "import NetworkSection from '@aziontech/webkit/sections/network-section'"

const source = (section) => {
  const { body, script } = sectionMarkup('NetworkSection', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Network/NetworkSection',
  component: NetworkSection,
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
  components: { SectionContainer, SectionGap, NetworkSection },
  setup() {
    return { args }
  },
  template: inColumn('<NetworkSection v-bind="args" />')
})

export const ClientQuotes = {
  render: Template,
  args: OUTCOMES_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'Four client outcomes on the floor, each a quote with its figure highlighted and signed by the client logo; Dafiti and Fourbank are drawn in one ink that follows the theme.'
      },
      source: { code: source(OUTCOMES_SECTION) }
    }
  }
}

export const ClientQuotesJson = {
  tags: ['!dev'],
  ...siteJsonStory(OUTCOMES_SECTION)
}

export const Benefits = {
  render: Template,
  args: BENEFITS_SECTION.props,
  parameters: {
    docs: {
      description: {
        story: 'Three network benefits on the floor, each an icon, a title and one sentence.'
      },
      source: { code: source(BENEFITS_SECTION) }
    }
  }
}

export const BenefitsJson = {
  tags: ['!dev'],
  ...siteJsonStory(BENEFITS_SECTION)
}
