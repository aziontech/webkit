import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import StoryLibrary from '@aziontech/webkit/sections/story-library'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { withStoryAssets } from '../../_shared/site-assets'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { NO_RESULTS_SECTION, STORY_LIBRARY_SECTION } from './_sections/story-library'

const IMPORT = "import StoryLibrary from '@aziontech/webkit/sections/story-library'"

const source = (section) => {
  const { body, script } = sectionMarkup('StoryLibrary', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Listings/StoryLibrary',
  component: StoryLibrary,
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
  components: { SectionContainer, SectionGap, StoryLibrary },
  setup() {
    return { args }
  },
  template: inColumn('<StoryLibrary v-bind="args" />')
})

export const Default = {
  render: Template,
  args: withStoryAssets(STORY_LIBRARY_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'The library at rest: no search and no facet applied, six stories in a three-column grid and the load-more button.'
      },
      source: { code: source(STORY_LIBRARY_SECTION) }
    }
  }
}

export const NoResults = {
  render: Template,
  args: withStoryAssets(NO_RESULTS_SECTION.props),
  parameters: {
    docs: {
      description: {
        story:
          'Nothing matches: the grid gives way to the empty state, whose action clears every filter.'
      },
      source: { code: source(NO_RESULTS_SECTION) }
    }
  }
}

export const StoryLibraryJson = {
  tags: ['!dev'],
  ...siteJsonStory(STORY_LIBRARY_SECTION)
}
