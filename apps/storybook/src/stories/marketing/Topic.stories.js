import CardGrid from '@aziontech/webkit/card-grid'
import Topic from '@aziontech/webkit/topic'

import { toSfc } from '../_shared/story-source'

const IMPORT = "import Topic from '@aziontech/webkit/topic'"

const GRID_IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import Topic from '@aziontech/webkit/topic'"
]

/** @type {import('@storybook/vue3').Meta<typeof Topic>} */
const meta = {
  title: 'Marketing/Topic',
  component: Topic,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One claim stated in three parts: a glyph, a short headline, and a sentence that explains it. It is the repeated unit of a marketing claim grid — the content of a cell, not the cell itself, so it carries no surface, no padding and no rules of its own and reads the same dropped into a card-grid cell, a bento-grid cell, or a column the page lays out by hand. Given an href the whole claim becomes the link, and its headline closes on a trailing arrow, so a band of claims needs no separate row of "learn more" controls.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: "The claim, rendered as the topic's heading.",
      table: { category: 'props', type: { summary: 'string' } }
    },
    description: {
      control: 'text',
      description: 'One sentence explaining the claim; overridden by the default slot.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    icon: {
      control: 'text',
      description: 'Icon class for the glyph above the copy.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    href: {
      control: 'text',
      description:
        'When set, the whole claim renders as an anchor link to this URL and its headline closes on a trailing arrow.',
      table: { category: 'props', type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    headingLevel: {
      control: 'inline-radio',
      options: [2, 3, 4],
      description:
        'Level of the heading element. Keep 2 when the band has no headline of its own; drop it to 3 when a section-title has already opened the section, so the document outline stays in order.',
      table: { category: 'props', type: { summary: '2 | 3 | 4' }, defaultValue: { summary: '2' } }
    },
    default: {
      description: 'Description body; replaces the `description` prop when provided.',
      table: { category: 'slots' }
    }
  },
  args: {
    title: 'Consistent global speed',
    description:
      'Serve content and run web apps across hundreds of locations with median latency under 30 ms. No infra to manage.',
    icon: 'ai ai-edge-nodes',
    href: '',
    headingLevel: 2
  }
}

export default meta

const Template = (args) => ({
  components: { Topic },
  setup: () => ({ props: args }),
  template: '<Topic v-bind="props" />'
})

const DEFAULT_MARKUP = `<Topic
  icon="ai ai-edge-nodes"
  title="Consistent global speed"
  description="Serve content and run web apps across hundreds of locations with median latency under 30 ms. No infra to manage."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Topic>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story: 'A glyph, a headline and one sentence — the unit a claim grid repeats.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const WITHOUT_ICON_MARKUP = `<Topic
  title="Frontend and API logic together"
  description="Deploy your frontend and backend API as a single, simple project — in one deploy."
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Topic>} */
export const WithoutIcon = {
  render: () => ({ components: { Topic }, template: WITHOUT_ICON_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Without an icon the headline leads. Drop the glyph for a band whose claims are not glyph-led rather than reaching for one that says nothing.'
      },
      source: { code: toSfc(IMPORT, WITHOUT_ICON_MARKUP) }
    }
  }
}

const LINKED_MARKUP = `<Topic
  icon="ai ai-tiered-cache"
  title="Accelerate API responses"
  description="Cache API responses on a distributed architecture to reduce latency and origin load."
  href="/products/cache"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof Topic>} */
export const Linked = {
  render: () => ({ components: { Topic }, template: LINKED_MARKUP }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'With an href the whole claim is the link and its headline closes on an arrow — so a band of claims carries no row of "learn more" buttons under it.'
      },
      source: { code: toSfc(IMPORT, LINKED_MARKUP) }
    }
  }
}

const IN_GRID_TEMPLATE = `<CardGrid kind="divider" :columns="3">
  <div class="bg-(--bg-canvas) p-(--spacing-xl)">
    <Topic
      icon="ai ai-edge-nodes"
      title="Consistent global speed"
      description="Serve content across hundreds of locations with median latency under 30 ms."
      href="/products/edge-application"
    />
  </div>
  <div class="bg-(--bg-canvas) p-(--spacing-xl)">
    <Topic
      icon="ai ai-load-balancer"
      title="Safer high-traffic launches"
      description="Scale from routine traffic to campaign spikes without cold starts."
      href="/products/load-balancer"
    />
  </div>
  <div class="bg-(--bg-canvas) p-(--spacing-xl)">
    <Topic
      icon="pi pi-code"
      title="Compatible with your framework"
      description="Deploy any modern framework or build tool, from Next.js to Astro."
      href="/products/build"
    />
  </div>
</CardGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof Topic>} */
export const InGrid = {
  render: () => ({
    components: { CardGrid, Topic },
    template: IN_GRID_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The division of labour the component exists for: the grid rules the cells with its own hairline gaps, each cell paints the fill and the padding, and the topic carries only the copy — and its link.'
      },
      source: { code: toSfc(GRID_IMPORTS, IN_GRID_TEMPLATE) }
    }
  }
}
