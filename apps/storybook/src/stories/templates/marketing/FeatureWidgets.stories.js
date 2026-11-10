import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import FeatureWidgets from '@aziontech/webkit/feature-widgets'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/feature-widgets'

const IMPORT = "import FeatureWidgets from '@aziontech/webkit/feature-widgets'"

const source = (section) => {
  const { body, script } = sectionMarkup('FeatureWidgets', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Features/FeatureWidgets',
  component: FeatureWidgets,
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
  components: { SectionContainer, SectionGap, FeatureWidgets },
  setup() {
    return { args }
  },
  template: inColumn('<FeatureWidgets v-bind="args" />')
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Functions Get started band: three cells, each a path from a prompt to a deployed function, one ending in a copy button and two in a docs link.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
