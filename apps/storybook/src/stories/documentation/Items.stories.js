import DocItem from '@aziontech/webkit-docs/doc-item'
import DocItemGroup from '@aziontech/webkit-docs/doc-item-group'

import { toSfc } from '../_shared/story-source'

const IMPORT = [
  "import DocItem from '@aziontech/webkit-docs/doc-item'",
  "import DocItemGroup from '@aziontech/webkit-docs/doc-item-group'"
]

/** @type {import('@storybook/vue3').Meta<typeof DocItemGroup>} */
const meta = {
  title: 'Documentation/Items',
  component: DocItemGroup,
  subcomponents: { DocItem },
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A one-column list of glyph, name and sentence — the "Related products" band a page ends on. It is the design system\'s in-card list: a `CardBox` holding an `ItemList`, so the card draws the single box and full-width dividers rule between rows flush to its edges. Reach for it instead of `DocCardGroup` when each entry needs a sentence to be understood — the list reads every description at the page measure rather than squeezing it into a grid cell. A row with `href` is a link end to end, with a trailing arrow; a row without one is inert and draws no hover.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {},
  args: {}
}

export default meta

const RELATED_TEMPLATE = `<DocItemGroup>
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
</DocItemGroup>`

export const Default = {
  name: 'Items',
  render: () => ({
    components: { DocItem, DocItemGroup },
    template: RELATED_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Three linked rows — the band that sends the reader to the next page. The link wraps the name and stretches over the row, so the whole card row is the hit area with one tab stop per entry, and the trailing arrow says it travels.'
      },
      source: { code: toSfc(IMPORT, RELATED_TEMPLATE) }
    }
  }
}

const STATIC_TEMPLATE = `<DocItemGroup>
  <DocItem
    title="Workload"
    icon="pi pi-server"
  >
    The unit of deployment: a domain, an application, and the locations that serve it.
  </DocItem>
  <DocItem
    title="Rule"
    icon="pi pi-filter"
  >
    A condition and the behaviors it runs, evaluated at request or at response time.
  </DocItem>
  <DocItem title="Binding">
    A named connection from a function to the resource it reads — a database, a bucket, a cache.
  </DocItem>
</DocItemGroup>`

export const Static = {
  name: 'Without links',
  render: () => ({
    components: { DocItem, DocItemGroup },
    template: STATIC_TEMPLATE
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The same card used to introduce a set of concepts. With no `href` the rows are inert — no hover, no arrow — and the glyph is optional, as the last row shows.'
      },
      source: { code: toSfc(IMPORT, STATIC_TEMPLATE) }
    }
  }
}
