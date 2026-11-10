import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import ClientQuotes from '@aziontech/webkit/client-quotes'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/client-quotes'

const IMPORT = "import ClientQuotes from '@aziontech/webkit/client-quotes'"

const source = (section) => {
  const { body, script } = sectionMarkup('ClientQuotes', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Social Proof/ClientQuotes',
  component: ClientQuotes,
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
  components: { SectionContainer, SectionGap, ClientQuotes },
  setup() {
    return { args }
  },
  template: inColumn('<ClientQuotes v-bind="args" />')
})

export const Default = {
  render: Template,
  args: withStoryAssets(SITE_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The Retail page row, led by Dafiti. Magalu, HeroSpark and Zoop use their colour logo files; Dafiti, Axur and Contabilizei use a registered mark drawn in the theme ink.'
      },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
