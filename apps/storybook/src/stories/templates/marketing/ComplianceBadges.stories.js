import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ComplianceBadges from '@aziontech/webkit/compliance-badges'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/compliance-badges'

const IMPORT = "import ComplianceBadges from '@aziontech/webkit/compliance-badges'"

const source = (section) => {
  const { body, script } = sectionMarkup('ComplianceBadges', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Social Proof/ComplianceBadges',
  component: ComplianceBadges,
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
  components: { SectionContainer, SectionGap, ComplianceBadges },
  setup() {
    return { args }
  },
  template: inColumn('<ComplianceBadges v-bind="args" />')
})

export const Default = {
  render: Template,
  args: withStoryAssets(SITE_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The five certifications the solution pages list, SOC 2 and 3, PCI DSS, LGPD, GDPR and CCPA, plus a See more cell in the sixth slot.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
