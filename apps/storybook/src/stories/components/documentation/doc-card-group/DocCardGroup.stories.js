import DocCard from '@aziontech/webkit/doc-card'
import DocCardGroup from '@aziontech/webkit/doc-card-group'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import DocCard from '@aziontech/webkit/doc-card'",
  "import DocCardGroup from '@aziontech/webkit/doc-card-group'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocCardGroup>} */
const meta = {
  title: 'Components/Documentation/DocCardGroup',
  component: DocCardGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'The framed, responsive grid a `DocCard` set sits in. The group is the frame, not each card: `FrameBox` draws the perimeter and the corner registration marks once around the whole set, the grid keeps 1px gaps, and every cell paints a ring into them — so neighbours share one hairline and an incomplete last row stays simply empty. `cols` names the widest column count; the grid always steps down toward one column on a phone unless a set of mark-plus-a-word cells opts into two with `mobileCols`.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    cols: {
      control: 'inline-radio',
      options: [1, 2, 3, 4],
      description: 'Column count at the large breakpoint.',
      table: { type: { summary: '1 | 2 | 3 | 4' }, defaultValue: { summary: '2' } }
    },
    mobileCols: {
      control: 'inline-radio',
      options: [1, 2],
      description: 'Column count on a phone. Two only pays when the cells are a mark plus a word.',
      table: { type: { summary: '1 | 2' }, defaultValue: { summary: '1' } }
    },
    default: { description: 'The DocCard children.', table: { type: { summary: 'slot' } } }
  },
  args: { cols: 2, mobileCols: 1 }
}

export default meta

const DEFAULT_CARDS = `<DocCard title="Start from a template" icon="pi pi-th-large" href="#templates">
    Ready-made projects that go live in a few clicks. No local tooling.
  </DocCard>
  <DocCard title="Import from GitHub" icon="pi pi-github" href="#github">
    Connect a repository and let Azion build it on every push.
  </DocCard>`

const DEFAULT_MARKUP = `<DocCardGroup :cols="2">
  ${DEFAULT_CARDS}
</DocCardGroup>`

export const Default = {
  render: (args) => ({
    components: { DocCard, DocCardGroup },
    setup: () => ({ props: args }),
    template: `<DocCardGroup v-bind="props">${DEFAULT_CARDS}</DocCardGroup>`
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Two linked cards on the default two-column grid. The frame belongs to the group; the hairline between the cells is the shared 1px gap, painted by the cells themselves.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const COLUMNS_TEMPLATE = `<DocCardGroup :cols="3">
  <DocCard title="Start from a template" icon="pi pi-th-large" href="#templates">
    Ready-made projects that go live in a few clicks. No local tooling.
  </DocCard>
  <DocCard title="Import from GitHub" icon="pi pi-github" href="#github">
    Connect a repository and let Azion build it on every push.
  </DocCard>
  <DocCard title="Deploy with the CLI" icon="pi pi-desktop" href="#cli">
    Ship the project already open in your editor.
  </DocCard>
</DocCardGroup>`

export const Columns = {
  render: () => ({ components: { DocCard, DocCardGroup }, template: COLUMNS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The `cols` axis at three: one column on a phone, two at the small breakpoint, three at the large one. The ring-per-cell rules stay correct at every width, and an incomplete last row is simply empty rather than a rule-coloured hole.'
      },
      source: { code: toSfc(IMPORT, COLUMNS_TEMPLATE) }
    }
  }
}
