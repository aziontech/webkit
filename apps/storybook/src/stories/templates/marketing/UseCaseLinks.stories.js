import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import UseCaseLinks from '@aziontech/webkit/sections/use-case-links'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/use-case-links'

const IMPORT = "import UseCaseLinks from '@aziontech/webkit/sections/use-case-links'"

const source = (section) => {
  const { body, script } = sectionMarkup('UseCaseLinks', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Use Cases/UseCaseLinks',
  component: UseCaseLinks,
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
  components: { SectionContainer, SectionGap, UseCaseLinks },
  setup() {
    return { args }
  },
  template: inColumn('<UseCaseLinks v-bind="args" />')
})

export const Topics = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'Six linked cells from the Application Accelerator page. Each cell shows an arrow on its headline because it has a link.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const TopicsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
