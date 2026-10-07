import BandStack from '@aziontech/webkit/band-stack'
import Illustration from '@aziontech/webkit/illustration'
import MediaSplit from '@aziontech/webkit/media-split'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import BandStack from '@aziontech/webkit/band-stack'",
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaSplit from '@aziontech/webkit/media-split'"
]

const BANDS = [
  {
    title: 'Build and Run Applications',
    description: 'Deploy applications and static sites straight from Git.',
    scene: 'ai-applications'
  },
  {
    title: 'Secure Applications and Networks',
    description: 'Stop DDoS attacks, bots and exploits before they reach your origin.',
    scene: 'deploy-secure-mcp-server'
  },
  {
    title: 'Observe Every Request',
    description: 'Follow logs, metrics and events from every location as they happen.',
    scene: 'live-debugging'
  }
]

const BANDS_MARKUP = BANDS.map(
  (band) => `  <MediaSplit
    title="${band.title}"
    description="${band.description}"
    size="large"
    align="center"
    :heading-level="3"
  >
    <template #media>
      <Illustration name="${band.scene}" />
    </template>
  </MediaSplit>`
).join('\n')

/** @type {import('@storybook/vue3').Meta<typeof BandStack>} */
const meta = {
  title: 'Components/Marketing/BandStack',
  component: BandStack,
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
          'A run of framed bands that follow one another down the page, each one drawn as two registration frames, its left half and its right half, sharing a hairline with the next. With `sticky` on, each band pins under the site header a step lower than the band before it, so the run piles up as the reader scrolls and every band already read stays visible as a ledge above the one being read. The stack owns the band rules, the shared hairlines and the pin offsets, and by default every band is split into two frames: a `MediaSplit` in the stack frames its copy cell and its media cell, each with its four marks. Each direct child of the default slot becomes one band, and the stack carries no copy, heading or media of its own.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    sticky: {
      control: 'boolean',
      description:
        'Pin each band under the site header from `lg` up, a step lower than the band before it, so the run piles up as the page scrolls.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    flush: {
      control: 'boolean',
      description:
        "Drop the first band's top rule, for a stack sitting directly under an element that already draws one.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' }
      }
    },
    default: {
      control: false,
      description:
        'The bands. Each direct child, including every child a `v-for` renders, is wrapped in its own frame and becomes one band; comment nodes are skipped.',
      table: { category: 'slots' }
    }
  },
  args: {
    sticky: false,
    flush: false
  }
}

export default meta

const Template = (args) => ({
  components: { BandStack, Illustration, MediaSplit },
  setup() {
    return { args }
  },
  template: `<BandStack v-bind="args">\n${BANDS_MARKUP}\n</BandStack>`
})

const DEFAULT_MARKUP = `<BandStack>\n${BANDS_MARKUP}\n</BandStack>`

/** @type {import('@storybook/vue3').StoryObj<typeof BandStack>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Three `MediaSplit` bands at `size="large"`, not pinned, so the frames and the shared hairlines are the only thing on show. Each band is two frames, left and right, with a registration mark in every corner of both halves. Every band after the first pulls up one pixel, so neighbouring rules overlap into a single hairline. Turn on `sticky` or `flush` in the Controls panel to see the pinned run or the first band without its top rule.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const STICKY_TEMPLATE = `<BandStack sticky flush>\n${BANDS_MARKUP}\n</BandStack>`

/** @type {import('@storybook/vue3').StoryObj<typeof BandStack>} */
export const Sticky = {
  render: () => ({
    components: { BandStack, Illustration, MediaSplit },
    template: STICKY_TEMPLATE
  }),
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same run with `sticky` and `flush` on. From `lg` up each band pins under the site header one spacing step lower than the band before it, so the bands already read stay visible as ledges above the one being read; below `lg` they stack in normal flow. A story cannot scroll itself, so the canvas shows the resting state — scroll the Docs page to see the pile form.'
      },
      source: { code: toSfc(IMPORT, STICKY_TEMPLATE) }
    }
  }
}
