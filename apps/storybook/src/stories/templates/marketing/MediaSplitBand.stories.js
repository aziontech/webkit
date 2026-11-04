import BrandGlobeScene from '@aziontech/webkit/assets/brand-globe-scene'
import MediaSplit from '@aziontech/webkit/media-split'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const components = {
  BrandGlobeScene,
  MediaSplit,
  SectionContainer,
  SectionGap,
  SectionModule
}

const VALUES_IMPORTS = [
  "import BrandGlobeScene from '@aziontech/webkit/assets/brand-globe-scene'",
  "import MediaSplit from '@aziontech/webkit/media-split'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const VALUES = {
  eyebrow: 'Our values',
  title: 'Four values shape every role at Azion',
  description:
    'Quality, Drive, Accountability, and Innovation. They guide how we work every day: we set high standards and measure what we deliver, take on hard problems with persistence, own our commitments and mistakes, and use AI and new technology to solve problems in new ways. Together, they help us earn and keep the trust of our customers.'
}

const VALUES_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <MediaSplit
    framed
    align="center"
    size="large"
    media-fill="surface"
    texture="pixelate"
    texture-size="small"
    texture-fade="top"
    eyebrow="${VALUES.eyebrow}"
    title="${VALUES.title}"
    description="${VALUES.description}"
  >
    <template #media>
      <BrandGlobeScene />
    </template>
  </MediaSplit>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Solutions/MediaSplitBand',
  excludeStories: ['SITE_SECTION_VALUES'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Values = {
  name: 'Our values',
  ...editable(() => ({ components, template: VALUES_TEMPLATE })),
  parameters: {
    visual: false,
    docs: {
      source: { code: toSfc(VALUES_IMPORTS, VALUES_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_VALUES = {
  _id: 'media-split-band',
  props: {
    ...VALUES,
    size: 'large',
    scene: { component: 'BrandGlobeScene' }
  }
}

export const ValuesJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_VALUES)
}
