import Carousel from '@aziontech/webkit/carousel'
import CarouselItem from '@aziontech/webkit/carousel-item'
import CarouselNext from '@aziontech/webkit/carousel-next'
import CarouselPrevious from '@aziontech/webkit/carousel-previous'
import Quote from '@aziontech/webkit/quote'

import { toSfc } from '../_shared/story-source'

const components = { Carousel, CarouselItem, CarouselNext, CarouselPrevious, Quote }

const IMPORT = [
  "import Carousel from '@aziontech/webkit/carousel'",
  "import CarouselItem from '@aziontech/webkit/carousel-item'",
  "import CarouselNext from '@aziontech/webkit/carousel-next'",
  "import CarouselPrevious from '@aziontech/webkit/carousel-previous'",
  "import Quote from '@aziontech/webkit/quote'"
]

/** @type {import('@storybook/vue3').Meta<typeof Carousel>} */
const meta = {
  title: 'Marketing/Carousel',
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
          'A horizontally scrollable track of cards with snap points and a pair of step controls. It is built on native scrolling and CSS scroll snap rather than a carousel runtime, so it is draggable, swipeable and keyboard-scrollable by default, and it never moves on its own. The unit is Carousel, then a `CarouselItem` card, then its content — usually a `Quote`. The cards sit edge to edge with no gutter, each hairline landing on the next, and the row fades at whichever end still has cards past it. Size the cards yourself on `CarouselItem`: they are deliberately unsized, so one page can show a single card on mobile and three on desktop.'
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
      description: 'The cards, composed as `CarouselItem` elements in reading order.',
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

const TESTIMONIALS = [
  {
    text: 'With Azion, we scale proprietary AI models without managing infrastructure — inspecting millions of websites daily and automating the fastest threat takedown in the market.',
    name: 'Fabio Ramos',
    jobTitle: 'CEO, Axur'
  },
  {
    text: 'Filing season triples our traffic in a week. Azion absorbs it without a capacity conversation, and we ship changes to the edge in minutes.',
    name: 'Vitor Torres',
    jobTitle: 'CEO, Contabilizei'
  },
  {
    text: 'Magalu guarantees high availability for hundreds of global-scale applications, even during campaigns like Liquidação Fantástica and Black das Blacks.',
    name: 'Allan Monteiro',
    jobTitle: 'CISO & Head of Technology, Magalu'
  },
  {
    text: 'One of the best CDN and WAF solutions I have ever used. Easy to implement and integrate, with the speed and low latency that make a real difference for our customers.',
    name: 'Julian H',
    jobTitle: 'IT OPS, SRE & SEC Manager, Dafiti'
  },
  {
    text: 'We block more than four million threats in six months without a single rule running on our own servers, and the security team reads one dashboard instead of five.',
    name: 'Renata Alves',
    jobTitle: 'Head of Information Security, Netshoes'
  }
]

// The snippet has to be paste-and-run, so every card is spelled out rather than looped.
const cards = (width) =>
  TESTIMONIALS.map(
    (item) => `  <CarouselItem class="${width}">
    <Quote
      text="${item.text}"
      name="${item.name}"
      job-title="${item.jobTitle}"
    />
  </CarouselItem>`
  ).join('\n')

const DEFAULT_TEMPLATE = `<Carousel aria-label="Customer testimonials">
  <template #controls>
    <CarouselPrevious />
    <CarouselNext />
  </template>
${cards('w-[85vw] max-w-120 sm:w-120')}
</Carousel>`

/** @type {import('@storybook/vue3').StoryObj<typeof Carousel>} */
export const Default = {
  render: () => ({ components, template: DEFAULT_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Five quote cards at the width the home page uses, wider together than the row, so the track scrolls and both controls are live. The cards meet with no gutter and the row fades at the end that continues. Drag the track, swipe it, or focus it and use the arrow keys: the step controls are one way in, not the only one. Each control disables itself at its end of the track, so a reader is never offered a step that does nothing.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_TEMPLATE) }
    }
  }
}

const PEEK_TEMPLATE = `<Carousel aria-label="Customer testimonials">
  <template #controls>
    <CarouselPrevious />
    <CarouselNext />
  </template>
${cards('w-72')}
</Carousel>`

/** @type {import('@storybook/vue3').StoryObj<typeof Carousel>} */
export const Peek = {
  render: () => ({ components, template: PEEK_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Narrower cards, so one lands part-way across the trailing edge under the fade. That partial card is the whole point: it tells a reader the track continues before they have touched a control. Narrow the viewport and the peek stays. The card width is fixed, so the row simply shows fewer of them.'
      },
      source: { code: toSfc(IMPORT, PEEK_TEMPLATE) }
    }
  }
}
