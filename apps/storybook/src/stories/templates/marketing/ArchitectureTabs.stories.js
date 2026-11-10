import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ArchitectureTabs from '@aziontech/webkit/sections/architecture-tabs'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { PLATFORM_SECTION, SITE_SECTION } from './_sections/architecture-tabs'

const IMPORT = "import ArchitectureTabs from '@aziontech/webkit/sections/architecture-tabs'"

const source = (section) => {
  const { body, script } = sectionMarkup('ArchitectureTabs', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Solutions/ArchitectureTabs',
  component: ArchitectureTabs,
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
  components: { SectionContainer, SectionGap, ArchitectureTabs },
  setup() {
    return { args }
  },
  template: inColumn('<ArchitectureTabs v-bind="args" />')
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The AI Gateway routing band: five architectures with the tabs at the bottom, each drawing its named diagram.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}

export const Platform = {
  render: Template,
  args: PLATFORM_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          "The base Azion architecture: one request crossing the platform, each tab drawing one product's starter diagram."
      },
      source: { code: source(PLATFORM_SECTION) }
    }
  }
}

export const PlatformJson = {
  tags: ['!dev'],
  ...siteJsonStory(PLATFORM_SECTION)
}
