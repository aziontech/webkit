import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import CompareSupportTiers from '@aziontech/webkit/sections/compare-support-tiers'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/compare-support-tiers'

const IMPORT = "import CompareSupportTiers from '@aziontech/webkit/sections/compare-support-tiers'"

const source = (section) => {
  const { body, script } = sectionMarkup('CompareSupportTiers', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Comparison/CompareSupportTiers',
  component: CompareSupportTiers,
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
  components: { SectionContainer, SectionGap, CompareSupportTiers },
  setup() {
    return { args }
  },
  template: inColumn('<CompareSupportTiers v-bind="args" />')
})

export const TierMatrix = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'Developer, Business, Enterprise and Mission-Critical across the Support and the Professional Services bands. Developer is the free tier, so its button starts a free account; the other three hand off to the contact page, with Enterprise as the recommended tier. Narrow the canvas below 1024px to see the tier picker; it opens on Enterprise.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const TierMatrixJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
