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
    position: {
      control: 'inline-radio',
      options: ['left', 'right', 'top', 'bottom'],
      description:
        "Which side of the media the tabs sit on. Left and right stack them beside the media and hold up to three; top and bottom lay them in one row and hold up to five. Below the large breakpoint every position stacks, with the active tab's media inside its row.",
      table: {
        category: 'props',
        type: { summary: "'left' | 'right' | 'top' | 'bottom'" },
        defaultValue: { summary: "'left'" }
      }
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description:
        "Height each row is held to beside the media, as a multiple of the band's own padding step — three, four and a half, six. Copy longer than that grows its row, and the media column is always as tall as the stack. In a row of tabs, small sets the title and description two steps down and tightens the inset.",
      table: {
        category: 'props',
        type: { summary: "'small' | 'medium' | 'large'" },
        defaultValue: { summary: "'medium'" }
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
    position: 'left',
    size: 'medium',
    selectOn: 'hover',
    autoPlay: true,
    autoPlayInterval: 5000,
    showProgress: true
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

const USE_CASES = [
  {
    title: 'Run AI models close to users',
    description: 'Answer in under 30 ms from the location closest to the user who asked.'
  },
  {
    title: 'Watch every request live',
    description: 'Traces arrive as the traffic does, with no agent to install.'
  },
  {
    title: 'Deploy secure MCP servers',
    description: 'Put a server next to every user, behind the same policies.'
  },
  {
    title: 'Ship modern frontends',
    description: 'Render pages beside the reader and keep the origin quiet.'
  },
  {
    title: 'Deliver media at scale',
    description: 'Serve video and images from a cache that is already warm.'
  }
]

const USE_CASE_SCENES = [
  'ai-applications',
  'live-debugging',
  'deploy-secure-mcp-server',
  'modern-frontends',
  'content-and-media-delivery'
]

const POSITIONS_SCRIPT = [
  ...IMPORT,
  '',
  `const scenes = [${USE_CASE_SCENES.map((scene) => `'${scene}'`).join(', ')}]`,
  '',
  'const items = [',
  USE_CASES.map(
    (item) => `  {\n    title: '${item.title}',\n    description: '${item.description}'\n  }`
  ).join(',\n'),
  ']'
]

const POSITIONS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaTabs position="left" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
  <MediaTabs position="right" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
  <MediaTabs position="top" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
  <MediaTabs position="bottom" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTabs>} */
export const Positions = {
  render: () => ({
    components: { Illustration, MediaTabs },
    setup() {
      return { items: USE_CASES, scenes: USE_CASE_SCENES }
    },
    template: POSITIONS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every `position` value, one band under the other, with the same five use cases on each. Left and right stack the tabs beside the media and hold the first three; top and bottom lay all five in one row, each carrying its own title, description and progress hairline, with the one medium running the full width on the other side. The seam between the tabs and the media is one hairline wherever the tabs sit. Below the large breakpoint every position stacks and the active tab carries its media inside its row.'
      },
      source: { code: toSfc(POSITIONS_SCRIPT, POSITIONS_TEMPLATE) }
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
          "Every `size` value beside the media, one band under the other with the same three claims on each, so the only thing that changes is the height of a row. That height is the component's own — three, four and a half, and six times the padding step inside the row — and the media column matches the stack beside it to the pixel. It is a floor rather than a ceiling: at `small` this copy is taller than three padding steps, so the rows keep their text and the media grows with them instead of the text being squeezed. In a row of tabs (`top` or `bottom`) `small` sets the title and description two steps down and tightens the inset, which is what keeps five claims from filling the band."
      },
      source: { code: toSfc(SCRIPT, SIZES_TEMPLATE) }
    }
  }
}

const TAB_COUNTS_SCRIPT = [
  ...IMPORT,
  '',
  `const scenes = [${USE_CASE_SCENES.map((scene) => `'${scene}'`).join(', ')}]`,
  '',
  'const items = [',
  USE_CASES.map(
    (item) => `  {\n    title: '${item.title}',\n    description: '${item.description}'\n  }`
  ).join(',\n'),
  ']'
]

const TAB_COUNTS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <MediaTabs position="left" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
  <MediaTabs position="top" size="small" :auto-play="false" :items="items">
  ${MEDIA_SLOT}
  </MediaTabs>
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTabs>} */
export const TabCounts = {
  render: () => ({
    components: { Illustration, MediaTabs },
    setup() {
      return { items: USE_CASES, scenes: USE_CASE_SCENES }
    },
    template: TAB_COUNTS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The two counts the band is built for, both handed the same five claims. Beside the media (`left` or `right`) the band keeps the first three, stacked, each row one height and each title at the same heading size. In a row (`top` or `bottom`) it keeps all five, each with its own title, description and progress hairline. Items past the limit are not rendered, so pick the position from how many claims the page has.'
      },
      source: { code: toSfc(TAB_COUNTS_SCRIPT, TAB_COUNTS_TEMPLATE) }
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

const PLACEHOLDER_MEDIA_SLOT = `  <template #media>
    <Illustration />
  </template>`

const PLACEHOLDER_SCRIPT = [
  ...IMPORT,
  '',
  'const items = [',
  ITEMS.map(
    (item) => `  {\n    title: '${item.title}',\n    description:\n      '${item.description}'\n  }`
  ).join(',\n'),
  ']'
]

const PLACEHOLDER_MARKUP = `<MediaTabs :items="items">\n${PLACEHOLDER_MEDIA_SLOT}\n</MediaTabs>`

/** @type {import('@storybook/vue3').StoryObj<typeof MediaTabs>} */
export const Placeholder = {
  render: () => ({
    components: { Illustration, MediaTabs },
    setup() {
      return { items: ITEMS }
    },
    template: PLACEHOLDER_MARKUP
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The band with the library placeholder as the media of every tab. An `Illustration` with no `name` draws the placeholder from the asset library, so the media frame holds its size while the artwork for each claim is still to be made. Name a scene per tab through the `media` slot scope when the artwork lands.'
      },
      source: { code: toSfc(PLACEHOLDER_SCRIPT, PLACEHOLDER_MARKUP) }
    }
  }
}
