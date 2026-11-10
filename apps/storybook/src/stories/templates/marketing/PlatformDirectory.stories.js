import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import PlatformDirectory from '@aziontech/webkit/platform-directory'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/platform-directory'

const IMPORT = "import PlatformDirectory from '@aziontech/webkit/platform-directory'"

const { body, script } = sectionMarkup('PlatformDirectory', SITE_SECTION.props)

const meta = {
  title: 'Templates/Marketing/Content/PlatformDirectory',
  component: PlatformDirectory,
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
  components: { SectionContainer, SectionGap, PlatformDirectory },
  setup() {
    return { args }
  },
  template: inColumn('<PlatformDirectory v-bind="args" />')
})

export const Primitives = {
  render: Template,
  parameters: {
    docs: {
      source: { code: toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body)) }
    }
  }
}

export const PrimitivesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
