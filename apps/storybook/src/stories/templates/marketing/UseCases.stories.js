import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import UseCases from '@aziontech/webkit/use-cases'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/use-cases'

const IMPORT = "import UseCases from '@aziontech/webkit/use-cases'"

const { body, script } = sectionMarkup('UseCases', SITE_SECTION.props)

const meta = {
  title: 'Templates/Marketing/Use Cases/UseCases',
  component: UseCases,
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
  components: { SectionContainer, SectionGap, UseCases },
  setup() {
    return { args }
  },
  template: inColumn('<UseCases v-bind="args" />')
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
