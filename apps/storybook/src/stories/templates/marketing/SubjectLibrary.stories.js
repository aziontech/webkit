import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SubjectLibrary from '@aziontech/webkit/sections/subject-library'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/subject-library'

const IMPORT = "import SubjectLibrary from '@aziontech/webkit/sections/subject-library'"

const { body, script } = sectionMarkup('SubjectLibrary', SITE_SECTION.props)

const meta = {
  title: 'Templates/Marketing/Listings/SubjectLibrary',
  component: SubjectLibrary,
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
  components: { SectionContainer, SectionGap, SubjectLibrary },
  setup() {
    return { args }
  },
  template: inColumn('<SubjectLibrary v-bind="args" />')
})

export const Default = {
  render: Template,
  parameters: {
    docs: {
      source: { code: toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body)) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
