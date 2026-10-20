import azionHighlight from '@aziontech/webkit/assets/azion-highlight.svg'
import branches from '@aziontech/webkit/assets/branches.svg'
import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'
import usageChart from '@aziontech/webkit/assets/usage-chart.svg'
import CardGrid from '@aziontech/webkit/card-grid'
import FrameBox from '@aziontech/webkit/frame-box'
import Illustration from '@aziontech/webkit/illustration'
import MediaTile from '@aziontech/webkit/media-tile'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const ARTWORK_IMPORTS = [
  "import azionHighlight from '@aziontech/webkit/assets/azion-highlight.svg'",
  "import branches from '@aziontech/webkit/assets/branches.svg'",
  "import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'",
  "import usageChart from '@aziontech/webkit/assets/usage-chart.svg'",
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import MediaTile from '@aziontech/webkit/media-tile'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const ILLUSTRATED_IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaTile from '@aziontech/webkit/media-tile'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'"
]

const components = {
  CardGrid,
  'CardGrid.Cell': CardGrid.Cell,
  FrameBox,
  Illustration,
  MediaTile,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const setup = () => ({ azionHighlight, branches, personalTokens, usageChart })

const REASONS = [
  {
    src: 'branches',
    title: 'Faster to publish.',
    description:
      'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
  },
  {
    src: 'personalTokens',
    title: 'Secure by default.',
    description:
      'Every endpoint carries its own keys, rate limits and instant revocation, managed from a single console.'
  },
  {
    src: 'azionHighlight',
    title: 'Simpler to operate.',
    description:
      'Deploys, gateways and observability sit on one platform, so there is no second console to reconcile when something breaks.'
  },
  {
    src: 'usageChart',
    title: 'Faster applications.',
    description:
      'Caching and image processing run at the edge, so every response is served from the location closest to the request.'
  }
]

const PRICING_REASONS = [
  {
    illustration: 'no-idle-no-waste',
    scale: 0.7,
    title: 'No idle. No waste.',
    description:
      'Why pay for infrastructure doing nothing? Azion is built around actual consumption, so you pay for what your applications use — not infrastructure sitting idle waiting for demand.'
  },
  {
    illustration: 'stay-in-control',
    scale: 1,
    title: 'Stay in control.',
    description:
      'Scale without losing control of your bill. Track consumption, set spending limits, and keep costs predictable as your applications grow.'
  },
  {
    illustration: 'white-gloves-when-it-matters',
    scale: 0.8,
    title: 'White-glove when it matters.',
    description:
      'Self-service when you want it. Experts when you need them. Azion specialists and partners are there to help you build, migrate, optimize, and scale with confidence.'
  }
]

const ARTWORK_TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      eyebrow="Why Azion"
      title="From commit to observability, on one platform"
      description="Build, ship and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
    />
  </template>

  <FrameBox flush borders="y" marks="all">
    <CardGrid flush kind="frame" :columns="4">
${each(
  REASONS,
  (reason) => `<CardGrid.Cell kind="canvas" :padded="false">
  <MediaTile
    kind="plain"
    :src="${reason.src}"
    title="${reason.title}"
    description="${reason.description}"
  />
</CardGrid.Cell>`,
  3
)}
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const ILLUSTRATED_TEMPLATE =
  inColumn(`<SectionModule id="why-pricing" :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <CardGrid flush kind="frame" :columns="3">
${each(
  PRICING_REASONS,
  (reason) => `<CardGrid.Cell kind="canvas" :padded="false">
  <MediaTile
    kind="plain"
    title="${reason.title}"
    description="${reason.description}"
    :media-scale="${reason.scale}"
    fluid
  >
    <template #media>
      <Illustration name="${reason.illustration}" />
    </template>
  </MediaTile>
</CardGrid.Cell>`,
  3
)}
    </CardGrid>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Media/FeatureTiles',
  excludeStories: ['SITE_SECTION_ARTWORK', 'SITE_SECTION_ILLUSTRATED'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Artwork = {
  render: () => ({ components, setup, template: ARTWORK_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(ARTWORK_IMPORTS, ARTWORK_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_ARTWORK = {
  _id: 'feature-tiles-artwork',
  props: {
    eyebrow: 'Why Azion',
    title: 'From commit to observability, on one platform',
    description:
      'Build, ship and run an application on the same platform that serves it — one place to deploy from, one place to watch it from.',
    tiles: [
      {
        image: '/marketing-components/illustrations/branches.svg',
        title: 'Faster to publish.',
        description:
          'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
      },
      {
        image: '/marketing-components/illustrations/personal-tokens.svg',
        title: 'Secure by default.',
        description:
          'Every endpoint carries its own keys, rate limits and instant revocation, managed from a single console.'
      }
    ]
  }
}

export const ArtworkJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_ARTWORK)
}

export const Illustrated = {
  render: () => ({ components, template: ILLUSTRATED_TEMPLATE }),
  parameters: {
    docs: {
      source: { code: toSfc(ILLUSTRATED_IMPORTS, ILLUSTRATED_TEMPLATE) }
    }
  }
}

export const SITE_SECTION_ILLUSTRATED = {
  _id: 'feature-tiles-illustrated',
  props: {
    tiles: [
      {
        illustration: 'no-idle-no-waste',
        title: 'No idle. No waste',
        description:
          'Why pay for infrastructure doing nothing? Azion is built around actual consumption: you pay for what your workloads use, not for idle capacity.'
      },
      {
        illustration: 'stay-in-control',
        title: 'Stay in control',
        description:
          'Scale without losing control of your bill. Track consumption, set spending limits, and keep costs predictable as your applications grow.'
      },
      {
        illustration: 'white-gloves-when-it-matters',
        title: 'White-glove when it matters',
        description:
          'Self-service when you want it. Experts when you need them. Azion specialists and partners help you build, migrate, optimize, and scale with confidence.'
      }
    ]
  }
}

export const IllustratedJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION_ILLUSTRATED)
}
