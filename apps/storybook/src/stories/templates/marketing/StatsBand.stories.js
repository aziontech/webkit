import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import StatsBand from '@aziontech/webkit/sections/stats-band'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { PARTNERS_SECTION, REACH_SECTION } from './_sections/stats-band'

const IMPORT = "import StatsBand from '@aziontech/webkit/sections/stats-band'"

const source = (section) => {
  const { body, script } = sectionMarkup('StatsBand', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Network/StatsBand',
  component: StatsBand,
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
  components: { SectionContainer, SectionGap, StatsBand },
  setup() {
    return { args }
  },
  template: inColumn('<StatsBand v-bind="args" />')
})

export const Reach = {
  render: Template,
  args: REACH_SECTION.props,
  parameters: {
    docs: {
      description: {
        story: 'The Products page figures: each value has a unit beside it and no qualifier.'
      },
      source: { code: source(REACH_SECTION) }
    }
  }
}

export const ReachJson = {
  tags: ['!dev'],
  ...siteJsonStory(REACH_SECTION)
}

export const Partners = {
  render: Template,
  args: PARTNERS_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Partners page figures: two values open with a + qualifier and the third ends with a % unit.'
      },
      source: { code: source(PARTNERS_SECTION) }
    }
  }
}

export const PartnersJson = {
  tags: ['!dev'],
  ...siteJsonStory(PARTNERS_SECTION)
}
