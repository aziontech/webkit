import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import PhotoMarquee from '@aziontech/webkit/photo-marquee'

import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import { SITE_SECTION } from './_sections/photo-marquee'

const IMPORT = "import PhotoMarquee from '@aziontech/webkit/photo-marquee'"

const source = (section) => {
  const { body, script } = sectionMarkup('PhotoMarquee', section.props)
  return toSfc([...COLUMN_IMPORTS, IMPORT, '', ...script], inColumn(body))
}

const meta = {
  title: 'Templates/Marketing/Social Proof/PhotoMarquee',
  component: PhotoMarquee,
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
  components: { SectionContainer, SectionGap, PhotoMarquee },
  setup() {
    return { args }
  },
  template: inColumn('<PhotoMarquee v-bind="args" />')
})

export const Default = {
  render: Template,
  args: SITE_SECTION.props,
  parameters: {
    docs: {
      description: { story: 'The six office photos Careers runs, at ten seconds per photo.' },
      source: { code: source(SITE_SECTION) }
    }
  }
}

export const DefaultJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
