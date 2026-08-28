import DocPagination from '@aziontech/webkit/doc-pagination'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocPagination from '@aziontech/webkit/doc-pagination'"

/** @type {import('@storybook/vue3').Meta<typeof DocPagination>} */
const meta = {
  title: 'Components/Documentation/DocPagination',
  component: DocPagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The previous / next pair that closes a documentation page. Each side carries an eyebrow and the destination's real title — the title is what tells the reader whether they want to go. A side with no neighbour leaves its half of the row empty, so the remaining link stays anchored to its own edge instead of drifting to the centre. It is not the data `Paginator`: this links two named documents and knows nothing about a total."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    previous: {
      control: 'object',
      description: 'The page before this one.',
      table: { type: { summary: 'DocPageLink | null' }, defaultValue: { summary: 'null' } }
    },
    next: {
      control: 'object',
      description: 'The page after this one.',
      table: { type: { summary: 'DocPageLink | null' }, defaultValue: { summary: 'null' } }
    },
    previousLabel: {
      control: 'text',
      description: 'Eyebrow over the previous link.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Previous' } }
    },
    nextLabel: {
      control: 'text',
      description: 'Eyebrow over the next link.',
      table: { type: { summary: 'string' }, defaultValue: { summary: 'Next' } }
    },
    onNavigate: {
      action: 'navigate',
      description: 'Fired when either neighbour is activated.',
      table: { type: { summary: '(event: MouseEvent, page: DocPageLink)' } }
    }
  },
  args: {
    previous: { title: 'Deploy an application', href: '/docs/deploy' },
    next: { title: 'Bind a domain', href: '/docs/domains' },
    previousLabel: 'Previous',
    nextLabel: 'Next'
  }
}

export default meta

const DEFAULT_MARKUP = `<DocPagination
  :previous="{ title: 'Deploy an application', href: '/docs/deploy' }"
  :next="{ title: 'Bind a domain', href: '/docs/domains' }"
  @navigate="(event, page) => router.push(page.href)"
/>`

export const Default = {
  render: (args) => ({
    components: { DocPagination },
    setup: () => ({ props: args }),
    template: '<DocPagination v-bind="props" />'
  }),
  parameters: {
    docs: {
      description: {
        story: 'Both neighbours present. Hover either side and the chevron travels outward.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

// Two nav landmarks on one page must not share an accessible name (axe
// landmark-unique), so each is named for the end of the series it shows. On a real
// page there is one pagination and the default name is right.
const ENDS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xl)">
  <DocPagination
    aria-label="First page navigation"
    :next="{ title: 'Deploy an application', href: '/docs/deploy' }"
  />
  <DocPagination
    aria-label="Last page navigation"
    :previous="{ title: 'Bind a domain', href: '/docs/domains' }"
  />
</div>`

export const Ends = {
  name: 'Ends of the series',
  render: () => ({ components: { DocPagination }, template: ENDS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The first and last pages of a series. The one remaining link stays anchored to its own edge — an absent side leaves a placeholder rather than collapsing, so a lone "Next" never drifts into the middle of the row. Each is given its own `aria-label` here because two nav landmarks may not share an accessible name; a real page carries one pagination and takes the default.'
      },
      source: { code: toSfc(IMPORT, ENDS_TEMPLATE) }
    }
  }
}
