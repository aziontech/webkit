import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ListingBrowser from '@aziontech/webkit/sections/listing-browser'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/listing-browser'

const IMPORT = "import ListingBrowser from '@aziontech/webkit/sections/listing-browser'"

const { body, script } = sectionMarkup('ListingBrowser', SITE_SECTION.props)

const meta = {
  title: 'Templates/Marketing/Listings/ListingBrowser',
  component: ListingBrowser,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { SectionContainer, SectionGap, ListingBrowser },
  setup() {
    return { args }
  },
  template: inColumn('<ListingBrowser v-bind="args" />')
})

export const OpenPositions = {
  render: Template,
  parameters: {
    docs: {
      source: { code: toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body)) }
    }
  }
}

export const OpenPositionsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
