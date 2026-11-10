import HeroBand from '@aziontech/webkit/hero-band'
import HeroCopyOnTopArt from '@aziontech/webkit/hero-copy-on-top-art'

import { sectionMarkup } from '../../_shared/section-source'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'
import {
  CENTERED_SECTION,
  COPY_BESIDE_ART_SECTION,
  PIXEL_FLOOR_SECTION,
  TITLE_BAND_CAROUSEL_SECTION,
  TITLE_BAND_SECTION,
  TITLE_BAND_SMALL_SECTION
} from './_sections/hero-band'
import { SITE_SECTION as COPY_ON_TOP_ART_SECTION } from './_sections/hero-copy-on-top-art'

const HERO_BAND_IMPORT = "import HeroBand from '@aziontech/webkit/hero-band'"
const COPY_ON_TOP_ART_IMPORT =
  "import HeroCopyOnTopArt from '@aziontech/webkit/hero-copy-on-top-art'"

const source = (tag, importLine, section) => {
  const { body, script } = sectionMarkup(tag, section.props)
  return toSfc([importLine, ...(script.length ? ['', ...script] : [])], body)
}

const meta = {
  title: 'Templates/Marketing/Heroes/Hero',
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

const HeroBandTemplate = (args) => ({
  components: { HeroBand },
  setup() {
    return { args }
  },
  template: '<HeroBand v-bind="args" />'
})

const CopyOnTopArtTemplate = (args) => ({
  components: { HeroCopyOnTopArt },
  setup() {
    return { args }
  },
  template: '<HeroCopyOnTopArt v-bind="args" />'
})

export const CenteredCarousel = {
  render: HeroBandTemplate,
  args: CENTERED_SECTION.props,
  parameters: {
    docs: {
      source: { code: source('HeroBand', HERO_BAND_IMPORT, CENTERED_SECTION) }
    }
  }
}

export const CenteredCarouselJson = {
  tags: ['!dev'],
  ...siteJsonStory(CENTERED_SECTION)
}

export const TitleBand = {
  render: HeroBandTemplate,
  args: TITLE_BAND_SECTION.props,
  parameters: {
    docs: {
      source: { code: source('HeroBand', HERO_BAND_IMPORT, TITLE_BAND_SECTION) }
    }
  }
}

export const TitleBandJson = {
  tags: ['!dev'],
  ...siteJsonStory(TITLE_BAND_SECTION)
}

export const TitleBandSmall = {
  render: HeroBandTemplate,
  args: TITLE_BAND_SMALL_SECTION.props,
  parameters: {
    docs: {
      description: {
        story:
          'The title band at the medium height, for a page whose bands start right under the headline (Contact).'
      },
      source: { code: source('HeroBand', HERO_BAND_IMPORT, TITLE_BAND_SMALL_SECTION) }
    }
  }
}

export const TitleBandSmallJson = {
  tags: ['!dev'],
  ...siteJsonStory(TITLE_BAND_SMALL_SECTION)
}

export const TitleBandCarousel = {
  render: HeroBandTemplate,
  args: TITLE_BAND_CAROUSEL_SECTION.props,
  parameters: {
    docs: {
      source: { code: source('HeroBand', HERO_BAND_IMPORT, TITLE_BAND_CAROUSEL_SECTION) }
    }
  }
}

export const TitleBandCarouselJson = {
  tags: ['!dev'],
  ...siteJsonStory(TITLE_BAND_CAROUSEL_SECTION)
}

export const PixelFloor = {
  render: HeroBandTemplate,
  args: PIXEL_FLOOR_SECTION.props,
  parameters: {
    docs: {
      source: { code: source('HeroBand', HERO_BAND_IMPORT, PIXEL_FLOOR_SECTION) }
    }
  }
}

export const PixelFloorJson = {
  tags: ['!dev'],
  ...siteJsonStory(PIXEL_FLOOR_SECTION)
}

export const CopyBesideArt = {
  render: HeroBandTemplate,
  args: COPY_BESIDE_ART_SECTION.props,
  parameters: {
    docs: {
      source: { code: source('HeroBand', HERO_BAND_IMPORT, COPY_BESIDE_ART_SECTION) }
    }
  }
}

export const CopyBesideArtJson = {
  tags: ['!dev'],
  ...siteJsonStory(COPY_BESIDE_ART_SECTION)
}

export const CopyOnTopArt = {
  render: CopyOnTopArtTemplate,
  args: COPY_ON_TOP_ART_SECTION.props,
  parameters: {
    docs: {
      source: {
        code: source('HeroCopyOnTopArt', COPY_ON_TOP_ART_IMPORT, COPY_ON_TOP_ART_SECTION)
      }
    }
  }
}

export const CopyOnTopArtJson = {
  tags: ['!dev'],
  ...siteJsonStory(COPY_ON_TOP_ART_SECTION)
}
