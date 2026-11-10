import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/logo-wall-quote'

const IMPORT = "import LogoWallQuote from '@aziontech/webkit/logo-wall-quote'"

const source = (section) => {
  const { body, script } = sectionMarkup('LogoWallQuote', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Social Proof/LogoWallQuote',
  component: LogoWallQuote,
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
  components: { SectionContainer, SectionGap, LogoWallQuote },
  setup() {
    return { args }
  },
  template: inColumn('<LogoWallQuote v-bind="args" />')
})

export const Default = {
  render: Template,
  args: withStoryAssets(SITE_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'Nine client logos, each linked to its success case, beside a Zoop quote. A linked logo lifts and shows Read story on hover and focus.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
