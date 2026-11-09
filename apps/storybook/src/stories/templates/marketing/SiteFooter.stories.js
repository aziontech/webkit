import SiteFooter from '@aziontech/webkit/sections/site-footer'

import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/site-footer'

const IMPORT = "import SiteFooter from '@aziontech/webkit/sections/site-footer'"

const source = (section) => {
  const { body, script } = sectionMarkup('SiteFooter', section.props)
  return toSfc([IMPORT, '', ...script], body)
}

const meta = {
  title: 'Templates/Marketing/Shell/SiteFooter',
  component: SiteFooter,
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
  components: { SiteFooter },
  setup() {
    return { args }
  },
  template: '<SiteFooter v-bind="args" />'
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The site’s own footer: four link columns, then the social row beside the status indicator and the language select. From `lg` the Azion mark leads the social row; below it the mark moves to the signature band.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
