import ContentColumns from '@aziontech/webkit/content-columns'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import ContentColumns from '@aziontech/webkit/content-columns'"

const ITEMS = [
  { title: 'Routed', description: 'The request lands at the location closest to the user.' },
  {
    title: 'Executed',
    description: 'Your code runs at that same location, with no region to warm up.'
  },
  { title: 'Cached', description: 'The response is held there, ready for the next request.' }
]

/** @type {import('@storybook/vue3').Meta<typeof ContentColumns>} */
const meta = {
  title: 'Components/Marketing/ContentColumns',
  component: ContentColumns,
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
          'A titled band whose body is two or three columns of short copy, drawn in one collapsed-rule grid so the columns read as a single framed surface. It is the plainest way to state a few parallel points under one section header.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The columns, in reading order; each item is `{ title, description }` where `title` is the point and `description` the sentence that develops it.',
      table: {
        category: 'props',
        type: { summary: 'ContentColumnItem[]' },
        defaultValue: { summary: '[]' }
      }
    },
    title: {
      control: 'text',
      description: 'Headline of the band, rendered as its `h2` above the columns.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    description: {
      control: 'text',
      description: 'Supporting sentence under the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    eyebrow: {
      control: 'text',
      description: 'Short uppercase overline rendered above the headline.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    columns: {
      control: 'inline-radio',
      options: [2, 3],
      description:
        'How many columns the grid holds from the medium breakpoint up; below it the columns stack.',
      table: {
        category: 'props',
        type: { summary: '2 | 3' },
        defaultValue: { summary: '3' }
      }
    }
  },
  args: {
    items: ITEMS,
    title: 'Every request is handled at the edge.',
    description:
      'One platform runs the routing, the code and the cache in the same place, so a request never leaves the network to be answered.',
    eyebrow: 'How it works',
    columns: 3
  }
}

export default meta

const Template = (args) => ({
  components: { ContentColumns },
  setup() {
    return { args }
  },
  template: '<ContentColumns v-bind="args" />'
})

const DEFAULT_MARKUP = `<ContentColumns
  eyebrow="How it works"
  title="Every request is handled at the edge."
  description="One platform runs the routing, the code and the cache in the same place, so a request never leaves the network to be answered."
  :columns="3"
  :items="[
    { title: 'Routed', description: 'The request lands at the location closest to the user.' },
    { title: 'Executed', description: 'Your code runs at that same location, with no region to warm up.' },
    { title: 'Cached', description: 'The response is held there, ready for the next request.' }
  ]"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ContentColumns>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'A header band over three peer points. The column titles are written in parallel grammar because they are read across, not down, and each description stays at one sentence so the grid does not stretch to a single long column. Edit `items` in the Controls panel to see the band grow or shrink — with `items` emptied the band renders its header and no grid at all.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const COLUMNS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <ContentColumns
    eyebrow="Where it runs"
    title="Two places your code can live."
    :columns="2"
    :items="[
      { title: 'At the edge', description: 'Code runs in the location that answered the request.' },
      { title: 'At the origin', description: 'Code runs where your data is, reached only when the edge cannot answer.' }
    ]"
  />
  <ContentColumns
    eyebrow="What you get"
    title="Three properties every deployment inherits."
    :columns="3"
    :items="[
      { title: 'Distributed', description: 'Each deployment is live in every location at once.' },
      { title: 'Isolated', description: 'Each request runs in its own sandbox, with no shared state.' },
      { title: 'Observable', description: 'Each request is logged with its latency, status and location.' }
    ]"
  />
</div>`

/** @type {import('@storybook/vue3').StoryObj<typeof ContentColumns>} */
export const Columns = {
  render: () => ({ components: { ContentColumns }, template: COLUMNS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Both `columns` values, one band under the other, each filled to its own count: two columns for a contrast, three for three peers. The grid only splits from the medium breakpoint up — narrow the canvas and both bands collapse to a single column in DOM order, so the points keep the order they were written in.'
      },
      source: { code: toSfc(IMPORT, COLUMNS_TEMPLATE) }
    }
  }
}
