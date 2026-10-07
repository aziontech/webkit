import Button from '@aziontech/webkit/button'
import Carousel from '@aziontech/webkit/carousel'
import CarouselItem from '@aziontech/webkit/carousel-item'
import CarouselNext from '@aziontech/webkit/carousel-next'
import CarouselPrevious from '@aziontech/webkit/carousel-previous'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'

import { COLUMN_IMPORTS, each, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const CAROUSEL_IMPORTS = [
  "import Carousel from '@aziontech/webkit/carousel'",
  "import CarouselItem from '@aziontech/webkit/carousel-item'",
  "import CarouselNext from '@aziontech/webkit/carousel-next'",
  "import CarouselPrevious from '@aziontech/webkit/carousel-previous'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'"
]

const STEPS_IMPORTS = CAROUSEL_IMPORTS

const AREAS_IMPORTS = ["import Button from '@aziontech/webkit/button'", ...CAROUSEL_IMPORTS]

const components = {
  Button,
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle
}

const STEPS = [
  {
    step: '1',
    title: 'Choose a challenge',
    description:
      'The first step is to choose which of our challenges drives you, then apply by registering your resume.'
  },
  {
    step: '2',
    title: 'Get in touch',
    description:
      'Time to get to know each other. There will be 3 steps: a quick alignment screening with one of our recruiters, a technical interview, and a cultural fit interview.'
  },
  {
    step: '3',
    title: 'Waiting for the match',
    description:
      "The candidate's information will go through an internal, calibrating committee to determine the perfect match for the position. We will then contact you with an offer or feedback."
  }
]

const AREAS = [
  {
    area: 'Engineering',
    description:
      'Improve your skills while building the future of computing and delivering mission-critical services to global customers.'
  },
  { area: 'Revenue', description: 'Create amazing stories with global customers.' },
  {
    area: 'Operations',
    description: 'Drive our business initiatives to successful outcomes on a global scale.'
  },
  {
    area: 'Security',
    description: 'Help us secure our applications, infrastructure, networks, devices, and data.'
  }
]

const cardCarousel = ({ header, label, cards }) =>
  inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
${header}
  </template>

  <FrameBox flush borders="y" marks="bottom">
    <Carousel aria-label="${label}" class="p-(--spacing-xl)">
      <template #controls>
        <CarouselPrevious />
        <CarouselNext />
      </template>

${cards}
    </Carousel>
  </FrameBox>
</SectionModule>`)

const STEPS_TEMPLATE = cardCarousel({
  header: `    <SectionTitle
      kind="centered"
      title="The candidate journey"
      description="A big and challenging dream gets everyone paddling in the same direction."
    />`,
  label: 'The candidate journey',
  cards: each(
    STEPS,
    (card) => `<CarouselItem class="w-[85%] md:w-(--container-xl)">
  <div class="flex flex-col gap-(--spacing-lg)">
    <span
      class="inline-flex size-8 items-center justify-center rounded-(--shape-flat) border border-(--border-default) bg-(--bg-surface) text-overline-md text-(--text-muted)"
    >
      ${card.step}
    </span>
    <div class="flex flex-col gap-(--spacing-sm)">
      <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
        ${card.title}
      </h3>
      <p class="m-0 text-pretty text-body-md text-(--text-muted)">
        ${card.description}
      </p>
    </div>
  </div>
</CarouselItem>`,
    3
  )
})

const AREAS_TEMPLATE = cardCarousel({
  header: `    <SectionTitle kind="left" title="Open job roles" />`,
  label: 'Open job roles',
  cards: each(
    AREAS,
    (card) => `<CarouselItem class="w-[85%] md:w-(--container-sm)">
  <div class="flex flex-col gap-(--spacing-xl)">
    <div class="flex flex-1 flex-col gap-(--spacing-sm)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">
        ${card.area}
      </h3>
      <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
        ${card.description}
      </p>
    </div>
    <div>
      <Button
        label="See jobs"
        kind="outlined"
        size="large"
        href="/careers/jobs?area=${encodeURIComponent(card.area)}"
        aria-label="See jobs: ${card.area}"
        icon="pi pi-chevron-right"
        icon-position="trailing"
        animated
      />
    </div>
  </div>
</CarouselItem>`,
    3
  )
})

const meta = {
  title: 'Templates/Marketing/Content/CardCarousel',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A titled row of cards that scrolls sideways: a section title, then a framed `Carousel` with its step controls above the track. The cards are sized on each `CarouselItem`, so a phone shows most of one card and the next one peeking in, and a desktop shows several. The Careers page renders it twice: the candidate journey as numbered steps, and the open job roles as one card per area, each linking to that area’s jobs. Built from `SectionModule`, `SectionTitle`, `FrameBox`, `Carousel`, `CarouselItem`, `CarouselPrevious`, `CarouselNext` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Steps = {
  render: () => ({ components, template: STEPS_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Careers page’s candidate journey: a centered title, then three wide cards, each led by its step number in a small framed tile, with the step’s name and what happens in it.'
      },
      source: { code: toSfc(STEPS_IMPORTS, STEPS_TEMPLATE) }
    }
  }
}

export const Areas = {
  render: () => ({ components, template: AREAS_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Careers page’s open roles: a title at the start edge, then one narrower card per area with a line about the work and an outlined `See jobs` link filtered to that area. Each link is named with its area for assistive technology, since every card shares the same visible label.'
      },
      source: { code: toSfc(AREAS_IMPORTS, AREAS_TEMPLATE) }
    }
  }
}
