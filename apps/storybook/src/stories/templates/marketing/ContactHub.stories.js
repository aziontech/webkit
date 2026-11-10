import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ContactHub from '@aziontech/webkit/contact-hub'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/contact-hub'

const IMPORT = "import ContactHub from '@aziontech/webkit/contact-hub'"

const source = (section) => {
  const { body, script } = sectionMarkup('ContactHub', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Content/ContactHub',
  component: ContactHub,
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
  components: { SectionContainer, SectionGap, ContactHub },
  setup() {
    return { args }
  },
  template: inColumn('<ContactHub v-bind="args" />')
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'Sales and Support lanes over three self-serve channels: emergency attack mitigation, the Discord community and the documentation.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
