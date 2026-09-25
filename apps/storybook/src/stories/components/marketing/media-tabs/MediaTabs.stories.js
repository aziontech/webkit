import Illustration from '@aziontech/webkit/illustration'
import MediaTabs from '@aziontech/webkit/media-tabs'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import Illustration from '@aziontech/webkit/illustration'",
  "import MediaTabs from '@aziontech/webkit/media-tabs'"
]

const ITEMS = [
  {
    title: 'Run AI models close to users',
    description:
      'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.'
  },
  {
    title: 'Watch every inference as it happens',
    description:
      'Tokens, latency and error rate per model arrive as the traffic does, with no agent to install and no sampling window to wait out.'
  },
  {
    title: 'Ship a model the way you ship code',
    description:
      'One command puts a new revision in every location at once, and the one before it stays a rollback away.'
  }
]

const SCENES = ['ai-applications', 'live-debugging', 'deploy-secure-mcp-server']

const SCRIPT = [
  ...IMPORT,
  '',
  `const scenes = [${SCENES.map((scene) => `'${scene}'`).join(', ')}]`,
  '',
  'const items = [',
  ITEMS.map(
    (item) => `  {\n    title: '${item.title}',\n    description:\n      '${item.description}'\n  }`
  ).join(',\n'),
  ']'
]

const MEDIA_SLOT = `  <template #media="{ index }">
    <Illustration :name="scenes[index]" />
  </template>`

/** @type {import('@storybook/vue3').Meta<typeof MediaTabs>} */
const meta = {
  title: 'Components/Marketing/MediaTabs',
  component: MediaTabs,
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
          'A band split in two: a stack of claims on one side, one piece of media on the other, and only the selected claim’s media on screen. The selection moves on hover, on click, and on a timer, so the band reads on its own and still answers a reader who takes it over. Its height is its own — each row carries a height the component sets from `size`, and the media column is exactly as tall as the stack — so the band never inherits a height from the section it lands in.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The tabs, in order. Each item is `{ title, description, src, alt }`; `src` builds the image the band shows while that tab is active, and the `media` slot replaces it with anything richer.',
      table: {
        category: 'props',
        type: { summary: 'MediaTabsItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    selectOn: {
      control: 'inline-radio',
      options: ['hover', 'click'],
      description:
        'What moves the selection as the reader points at a row. A click always selects, on either setting — `click` only withholds the selection from the pointer passing over.',
      table: {
        category: 'props',
        type: { summary: "'hover' | 'click'" },
        defaultValue: { summary: "'hover'" }
      }
    },
    autoPlay: {
      control: 'boolean',
      description:
        'Advances to the next tab on a timer. It pauses under pointer or focus, stops for good on a click, and never starts under reduced motion.',
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    autoPlayInterval: {
      control: { type: 'number', min: 1000, step: 500 },
      description: 'Milliseconds each tab is held before the band advances.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '5000' }
      }
    },
    showProgress: {
      control: 'boolean',
      description:
        "Advances a hairline along the active row's bottom edge while the timer runs, so a reader can see why the band is about to move.",
      table: {
        category: 'props',
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description:
        "Height each row is held to, as a multiple of the band's own padding step — three, four and a half, six. Copy longer than that grows its row, and the media column is always as tall as the stack, so this is the one control over the band's proportions.",
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
      }
    },
    media: {
      control: false,
      description:
        "The tab's medium, receiving `{ item, index, active }`; replaces the image built from the item's own `src`.",
      table: { category: 'slots' }
    },
    onTabChange: {
      action: 'tab-change',
      description:
        "Fired when a reader's hover or click moves the selection; not fired on an autoplay tick.",
      table: { type: { summary: '(event: Event, index: number)' } }
    }
  },
  args: {
    items: ITEMS,
    selectOn: 'hover',
    autoPlay: true,
    autoPlayInterval: 5000,
    showProgress: true,
    size: 'medium'
  }
}

export default meta

const Template = (args) => ({
  components: { Illustration, MediaTabs },
  setup() {
    return { args, scenes: SCENES }
  },
  template: `<MediaTabs v-bind="args">\n${MEDIA_SLOT}\n</MediaTabs>`
})

const DEFAULT_MARKUP = `<MediaTabs :items="items">\n${MEDIA_SLOT}\n</MediaTabs>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTabs>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'Three peer claims and one media frame. The band opens on the first tab and advances on its own every five seconds, drawing a hairline along the active row as the interval runs down. Point at a row and the selection follows the pointer while the timer holds; click one and the timer stops for good, because a reader who has chosen should not be moved off their choice. Each row is a real button, so `Tab` reaches every claim and `Enter` selects it.'
      },
      source: { code: toSfc(SCRIPT, DEFAULT_MARKUP) }
    }
  }
}

const SIZES_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaTabs size="small" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
  <MediaTabs size="medium" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
  <MediaTabs size="large" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTabs>} */
export const Sizes = {
  render: () => ({
    components: { Illustration, MediaTabs },
    setup() {
      return { items: ITEMS, scenes: SCENES }
    },
    template: SIZES_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Every `size` value, one band under the other with the same three claims on each, so the only thing that changes is the height of a row. That height is the component's own — three, four and a half, and six times the padding step inside the row — and the media column matches the stack beside it to the pixel. It is a floor rather than a ceiling: at `small` this copy is taller than three padding steps, so the rows keep their text and the media grows with them instead of the text being squeezed. Nothing here is measured against the section, which is why the band's proportions hold wherever a page puts it."
      },
      source: { code: toSfc(SCRIPT, SIZES_TEMPLATE) }
    }
  }
}

const STATIC_TEMPLATE = `<MediaTabs select-on="click" :auto-play="false" :items="items">\n${MEDIA_SLOT}\n</MediaTabs>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTabs>} */
export const Static = {
  render: () => ({
    components: { Illustration, MediaTabs },
    setup() {
      return { items: ITEMS, scenes: SCENES }
    },
    template: STATIC_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The band at rest: no timer, and the pointer passing over changes nothing. Only a click moves the selection. Reach for this pairing where the reader is meant to choose rather than watch — a comparison they will scan back and forth over, or a band under a heading that already told them what to look for.'
      },
      source: { code: toSfc(SCRIPT, STATIC_TEMPLATE) }
    }
  }
}
