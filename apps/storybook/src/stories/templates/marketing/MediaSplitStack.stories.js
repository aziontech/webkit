import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import MediaSplitStack from '@aziontech/webkit/sections/media-split-stack'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { ALTERNATING_SECTION, SOLUTIONS_SECTION } from './_sections/media-split-stack'

const IMPORT = "import MediaSplitStack from '@aziontech/webkit/sections/media-split-stack'"

const source = (section) => {
  const { body, script } = sectionMarkup('MediaSplitStack', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Solutions/MediaSplitStack',
  component: MediaSplitStack,
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
  components: { SectionContainer, SectionGap, MediaSplitStack },
  setup() {
    return { args }
  },
  template: inColumn('<MediaSplitStack v-bind="args" />')
})

export const Solutions = {
  render: Template,
  args: withStoryAssets(SOLUTIONS_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The five solution areas of Home under an optional large, centered section title: large, centered bands, every picture at the closing end, each with an outlined "Learn more" button.'
      },
      source: { code: source(SOLUTIONS_SECTION) }
    }
  }
}

export const SolutionsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SOLUTIONS_SECTION)
}

export const Alternating = {
  render: Template,
  args: withStoryAssets(ALTERNATING_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The Our Network run: a centered section title, then four bands alternating the picture between the opening and the closing end.'
      },
      source: { code: source(ALTERNATING_SECTION) }
    }
  }
}

export const AlternatingJson = {
  tags: ['!dev'],
  ...siteJsonStory(ALTERNATING_SECTION)
}
