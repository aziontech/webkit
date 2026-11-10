import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ListingTable from '@aziontech/webkit/sections/listing-table'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/listing-table'

const IMPORT = "import ListingTable from '@aziontech/webkit/sections/listing-table'"

const source = (section) => {
  const { body, script } = sectionMarkup('ListingTable', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Listings/ListingTable',
  component: ListingTable,
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
  components: { SectionContainer, SectionGap, ListingTable },
  setup() {
    return { args }
  },
  template: inColumn('<ListingTable v-bind="args" />')
})

export const LatestRoles = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          "The Careers page's six latest roles: role, team and location, and work type aligned to the end, with the button into all 23 roles in the table's footer."
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const LatestRolesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
