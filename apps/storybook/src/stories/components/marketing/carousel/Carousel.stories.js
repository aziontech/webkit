import Carousel from '@aziontech/webkit/carousel'
import CarouselItem from '@aziontech/webkit/carousel-item'
import CarouselNext from '@aziontech/webkit/carousel-next'
import CarouselPrevious from '@aziontech/webkit/carousel-previous'

import { toSfc } from '../../../_shared/story-source'

const components = { Carousel, CarouselItem, CarouselNext, CarouselPrevious }

const IMPORT = [
  "import Carousel from '@aziontech/webkit/carousel'",
  "import CarouselItem from '@aziontech/webkit/carousel-item'",
  "import CarouselNext from '@aziontech/webkit/carousel-next'",
  "import CarouselPrevious from '@aziontech/webkit/carousel-previous'"
]

/** @type {import('@storybook/vue3').Meta<typeof Carousel>} */
const meta = {
  title: 'Components/Marketing/Carousel',
  component: Carousel,
  subcomponents: { CarouselItem, CarouselPrevious, CarouselNext },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'A horizontally scrollable track of slides with snap points and a pair of step controls. It is built on native scrolling and CSS scroll snap rather than a carousel runtime, so it is draggable, swipeable and keyboard-scrollable by default, and it never moves on its own. Size the slides yourself on `CarouselItem` — the slide is deliberately unsized so one page can show a single slide on mobile and three on desktop.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the scrollable track, announced before its contents.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    default: {
      control: false,
      description: 'The slides, composed as `CarouselItem` elements in reading order.',
      table: { category: 'slots' }
    },
    controls: {
      control: false,
      description:
        'The step controls, composed as `CarouselPrevious` and `CarouselNext`; rendered above the track.',
      table: { category: 'slots' }
    }
  }
}

export default meta

const DEFAULT_TEMPLATE = `<Carousel aria-label="Customer stories">
  <template #controls>
    <CarouselPrevious />
    <CarouselNext />
  </template>
  <CarouselItem class="w-72">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Shipped in an afternoon</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">A checkout rewrite went live the same day it was merged, with no pipeline to assemble first.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-72">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Black Friday without a war room</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Peak traffic was absorbed where it arrived, so there was no region to size ahead of the sale.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-72">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">One console for the whole stack</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Events, metrics and the application itself live in one place, with no second tool to wire up.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-72">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Half the infrastructure bill</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Billing follows requests and compute time, so an idle environment costs nothing to keep running.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-72">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Migrated without a freeze</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Traffic moved over a weekend, one route at a time, with the old origin still answering behind it.</p>
    </div>
  </CarouselItem>
</Carousel>`

/** @type {import('@storybook/vue3').StoryObj<typeof Carousel>} */
export const Default = {
  render: () => ({ components, template: DEFAULT_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Five slides at a fixed `w-72`, wider together than the row that holds them, so the track scrolls and both controls are live. Drag the track, swipe it, or focus it and use the arrow keys — the step controls are one way in, not the only one. Each control disables itself at its end of the track, so a reader is never offered a step that does nothing.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_TEMPLATE) }
    }
  }
}

const PEEK_TEMPLATE = `<Carousel aria-label="Platform capabilities">
  <template #controls>
    <CarouselPrevious />
    <CarouselNext />
  </template>
  <CarouselItem class="w-56">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Edge Application</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Serve every request from the location closest to the user.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-56">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Edge Functions</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Run code on the request path without a server to keep alive.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-56">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Edge SQL</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Query a database that sits beside the application, not a region away.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-56">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Edge Storage</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Keep objects where they are read, with no bucket to replicate by hand.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-56">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Web Application Firewall</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Filter traffic before it reaches the application, on the same path.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-56">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Real-Time Metrics</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Watch requests, errors and latency as they happen, per application.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-56">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Data Stream</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Ship every event to the tool that already holds your logs.</p>
    </div>
  </CarouselItem>
  <CarouselItem class="w-56">
    <div class="h-full rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg)">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Bot Manager</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">Separate automated traffic from readers before either is served.</p>
    </div>
  </CarouselItem>
</Carousel>`

/** @type {import('@storybook/vue3').StoryObj<typeof Carousel>} */
export const Peek = {
  render: () => ({ components, template: PEEK_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Narrower slides, and more of them, so one lands part-way across the trailing edge. That partial slide is the whole point: it is what tells a reader the track continues, before they have touched a control. Narrow the viewport and the peek stays — the slide width is fixed, so the row simply shows fewer of them.'
      },
      source: { code: toSfc(IMPORT, PEEK_TEMPLATE) }
    }
  }
}
