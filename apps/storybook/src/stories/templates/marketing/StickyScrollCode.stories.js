import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import StickyScrollCode from '@aziontech/webkit/sections/sticky-scroll-code'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/sticky-scroll-code'

const IMPORT = "import StickyScrollCode from '@aziontech/webkit/sections/sticky-scroll-code'"

const source = (section) => {
  const { body, script } = sectionMarkup('StickyScrollCode', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Solutions/StickyScrollCode',
  component: StickyScrollCode,
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
  components: { SectionContainer, SectionGap, StickyScrollCode },
  setup() {
    return { args }
  },
  template: inColumn('<StickyScrollCode v-bind="args" />')
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The Web Apps band: five capabilities, each with a one-file code sample and a docs button under the open one.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
