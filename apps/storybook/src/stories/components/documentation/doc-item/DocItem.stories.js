import DocItem from '@aziontech/webkit/doc-item'
import FrameBox from '@aziontech/webkit/frame-box'
import ItemList from '@aziontech/webkit/item-list'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = [
  "import DocItem from '@aziontech/webkit/doc-item'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import ItemList from '@aziontech/webkit/item-list'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocItem>} */
const meta = {
  title: 'Components/Documentation/DocItem',
  component: DocItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One row of the documentation\'s related-content list: a leading glyph in a framed 32px tile, the row\'s name, and the sentence that says what the thing is. When it has an `href` the title becomes an anchor stretched over the whole row — one tab stop, the full row as the hit area — closed by a trailing chevron, or a diagonal arrow when the destination leaves the documentation. Rows compose inside a `FrameBox` holding an `ItemList`: the frame draws the single box, the list rules between the rows, and its `role="list"` is what makes each row\'s `role="listitem"` valid. That composition IS the documented group pattern — there is no separate group component.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: "The row's name — what the reader is choosing.",
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading glyph.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    href: {
      control: 'text',
      description: 'Destination; when set the whole row becomes the link.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    target: {
      control: 'inline-radio',
      options: ['_self', '_blank'],
      description: 'Where the link opens.',
      table: { type: { summary: "'_self' | '_blank'" }, defaultValue: { summary: '_self' } }
    },
    label: {
      control: 'text',
      description: 'Fallback copy when the default slot is empty.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    default: {
      description: "The row's copy: one or two sentences of inline prose.",
      table: { type: { summary: 'slot' } }
    }
  }
}

export default meta

const DEFAULT_TEMPLATE = `<FrameBox class="w-full bg-(--bg-surface)">
  <ItemList>
    <DocItem
      title="Edge Functions"
      icon="pi pi-code"
      href="#edge-functions"
    >
      Build serverless applications on Azion's global network. Workloads integrate with functions natively, through a binding.
    </DocItem>
    <DocItem
      title="Edge SQL"
      icon="pi pi-database"
      href="#edge-sql"
    >
      Store relational data across the network. A workload reads it from the location that served the request.
    </DocItem>
    <DocItem
      title="Edge Cache"
      icon="pi pi-bolt"
      href="#edge-cache"
    >
      Decide what is cached, for how long, and by which key.
    </DocItem>
  </ItemList>
</FrameBox>`

export const Default = {
  render: () => ({
    components: { DocItem, FrameBox, ItemList },
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Three linked rows in the documented composition — a `FrameBox` holding an `ItemList`. The link wraps the name and stretches over the row, so the whole row is the hit area with one tab stop per entry, and the trailing chevron says it travels.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_TEMPLATE) }
    }
  }
}

const VARIANTS_TEMPLATE = `<FrameBox class="w-full bg-(--bg-surface)">
  <ItemList>
    <DocItem
      title="Community templates"
      icon="pi pi-github"
      href="https://github.com/aziontech"
      target="_blank"
    >
      A row that leaves the documentation trades the chevron for a diagonal arrow.
    </DocItem>
    <DocItem
      title="Rule"
      icon="pi pi-filter"
    >
      With no href the row is inert — no hover, no anchor, no trailing arrow.
    </DocItem>
    <DocItem title="Binding">
      The glyph is optional too: a named connection from a function to the resource it reads.
    </DocItem>
  </ItemList>
</FrameBox>`

export const Variants = {
  render: () => ({
    components: { DocItem, FrameBox, ItemList },
    template: VARIANTS_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The axes that change the anatomy: an external destination (diagonal arrow, `rel="noreferrer"`), an inert row with no `href` — whose title is plain text and whose trailing glyph region disappears — and a row with no glyph at all.'
      },
      source: { code: toSfc(IMPORT, VARIANTS_TEMPLATE) }
    }
  }
}
