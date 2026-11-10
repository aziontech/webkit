import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ComparePlans from '@aziontech/webkit/compare-plans'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/compare-plans'

const IMPORT = "import ComparePlans from '@aziontech/webkit/compare-plans'"

const source = (section) => {
  const { body, script } = sectionMarkup('ComparePlans', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Comparison/ComparePlans',
  component: ComparePlans,
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
  components: { SectionContainer, SectionGap, ComparePlans },
  setup() {
    return { args }
  },
  template: inColumn('<ComparePlans v-bind="args" />')
})

export const PlanMatrix = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'Hobby, Pro and Enterprise across four of the Pricing product sections. Each plan button repeats the action of its card, and the last row links to the on-demand rates. Narrow the canvas below 1024px to see the plan picker, which opens on Pro.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const PlanMatrixJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
