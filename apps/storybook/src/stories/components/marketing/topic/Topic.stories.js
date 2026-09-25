import CardGrid from '@aziontech/webkit/card-grid'
import CardGridCell from '@aziontech/webkit/card-grid-cell'
import Topic from '@aziontech/webkit/topic'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Topic from '@aziontech/webkit/topic'"

const GRID_IMPORTS = [
  "import CardGrid from '@aziontech/webkit/card-grid'",
  "import CardGridCell from '@aziontech/webkit/card-grid-cell'",
  "import Topic from '@aziontech/webkit/topic'"
]

/** @type {import('@storybook/vue3').Meta<typeof Topic>} */
const meta = {
  title: 'Components/Marketing/Topic',
  component: Topic,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One claim stated in three parts: a glyph, a short headline, and a sentence that explains it. It is the repeated unit of a marketing claim grid — the content of a cell, not the cell itself, so it carries no surface, no padding and no rules of its own and reads the same dropped into a card-grid cell, a bento-grid cell, or a column the page lays out by hand.'
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

const IN_GRID_TEMPLATE = `<CardGrid kind="frame" :columns="3">
  <CardGridCell kind="canvas">
    <Topic
      icon="ai ai-edge-nodes"
      title="Consistent global speed"
      description="Serve content across hundreds of locations with median latency under 30 ms."
    />
  </CardGridCell>
  <CardGridCell kind="canvas">
    <Topic
      icon="ai ai-load-balancer"
      title="Safer high-traffic launches"
      description="Scale from routine traffic to campaign spikes without cold starts."
    />
  </CardGridCell>
  <CardGridCell kind="canvas">
    <Topic
      icon="pi pi-code"
      title="Compatible with your framework"
      description="Deploy any modern framework or build tool, from Next.js to Astro."
    />
  </CardGridCell>
</CardGrid>`

/** @type {import('@storybook/vue3').StoryObj<typeof Topic>} */
export const InGrid = {
  render: () => ({
    components: { CardGrid, CardGridCell, Topic },
    template: IN_GRID_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The division of labour the component exists for: the grid draws the rules, the cell carries the fill and the padding, and the topic carries only the copy.'
      },
      source: { code: toSfc(GRID_IMPORTS, IN_GRID_TEMPLATE) }
    }
  }
}
