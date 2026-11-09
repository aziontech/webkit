import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ResourceGrid from '@aziontech/webkit/sections/resource-grid'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SCROLLABLE_SECTION, SITE_SECTION } from './_sections/resource-grid'

const IMPORT = "import ResourceGrid from '@aziontech/webkit/sections/resource-grid'"

const source = (section) => {
  const { body, script } = sectionMarkup('ResourceGrid', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Content/ResourceGrid',
  component: ResourceGrid,
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
  components: { SectionContainer, SectionGap, ResourceGrid },
  setup() {
    return { args }
  },
  template: inColumn('<ResourceGrid v-bind="args" />')
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Financial Services band: four resource cards beside the copy and the See all guides button.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

export const Scrollable = {
  render: Template,
  args: SCROLLABLE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story: 'The Technology band: six cards, so the grid scrolls inside the band.'
      },
      source: { code: source(SCROLLABLE_SECTION) }
    }
  }
}

export const ScrollableJson = {
  tags: ['!dev'],
  ...siteJsonStory(SCROLLABLE_SECTION)
}
