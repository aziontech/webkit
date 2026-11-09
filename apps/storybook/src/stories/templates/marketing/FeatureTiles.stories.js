import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import FeatureTiles from '@aziontech/webkit/feature-tiles'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { ARTWORK_SECTION, ILLUSTRATED_SECTION } from './_sections/feature-tiles'

const IMPORT = "import FeatureTiles from '@aziontech/webkit/feature-tiles'"

const source = (section) => {
  const { body, script } = sectionMarkup('FeatureTiles', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Features/FeatureTiles',
  component: FeatureTiles,
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
  components: { SectionContainer, SectionGap, FeatureTiles },
  setup() {
    return { args }
  },
  template: inColumn('<FeatureTiles v-bind="args" />')
})

export const Artwork = {
  render: Template,
  args: withStoryAssets(ARTWORK_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The Why Azion band: an eyebrow, a title and a description over four tiles, each picture an image URL.'
      },
      source: { code: source(ARTWORK_SECTION) }
    }
  }
}

export const ArtworkJson = {
  tags: ['!dev'],
  ...siteJsonStory(ARTWORK_SECTION)
}

export const Illustrated = {
  render: Template,
  args: withStoryAssets(ILLUSTRATED_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The Pricing band: three tiles with no heading, each picture a registered illustration scaled per tile.'
      },
      source: { code: source(ILLUSTRATED_SECTION) }
    }
  }
}

export const IllustratedJson = {
  tags: ['!dev'],
  ...siteJsonStory(ILLUSTRATED_SECTION)
}
