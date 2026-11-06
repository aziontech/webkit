import SiteNav from '@aziontech/webkit/sections/site-nav'

import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/site-nav'

const IMPORT = "import SiteNav from '@aziontech/webkit/sections/site-nav'"

const source = (section) => {
  const { body, script } = sectionMarkup('SiteNav', section.props)
  return toSfc([IMPORT, '', ...script], body)
}

const meta = {
  title: 'Templates/Marketing/Shell/SiteNav',
  component: SiteNav,
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
  components: { SiteNav },
  setup() {
    return { args }
  },
  template: '<SiteNav v-bind="args" />'
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
