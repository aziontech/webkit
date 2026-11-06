import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import PricingPlans from '@aziontech/webkit/sections/pricing-plans'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/pricing-plans'

const IMPORT = "import PricingPlans from '@aziontech/webkit/sections/pricing-plans'"

const source = (section) => {
  const { body, script } = sectionMarkup('PricingPlans', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Pricing/PricingPlans',
  component: PricingPlans,
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
  components: { SectionContainer, SectionGap, PricingPlans },
  setup() {
    return { args }
  },
  template: inColumn('<PricingPlans v-bind="args" />')
})

export const Plans = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'Hobby, Pro and Enterprise. Only the Pro price changes with the toggle: 25 a month billed monthly, 20 billed annually. The Enterprise button points at the page contact band.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const PlansJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
