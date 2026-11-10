import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import MediaSplitBand from '@aziontech/webkit/media-split-band'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/media-split-band'

const IMPORT = "import MediaSplitBand from '@aziontech/webkit/media-split-band'"

const source = (section) => {
  const { body, script } = sectionMarkup('MediaSplitBand', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Solutions/MediaSplitBand',
  component: MediaSplitBand,
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
  components: { SectionContainer, SectionGap, MediaSplitBand },
  setup() {
    return { args }
  },
  template: inColumn('<MediaSplitBand v-bind="args" />')
})

export const Values = {
  name: 'Our values',
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    visual: false,
    docs: {
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const ValuesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
