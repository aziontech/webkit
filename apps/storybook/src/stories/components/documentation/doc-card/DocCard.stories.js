import DocCard from '@aziontech/webkit/doc-card'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocCard from '@aziontech/webkit/doc-card'"

/** @type {import('@storybook/vue3').Meta<typeof DocCard>} */
const meta = {
  title: 'Components/Documentation/DocCard',
  component: DocCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'One cell of the grid a documentation page scans across: a leading glyph, an optional overline, the title, the copy, and an optional call-to-action row at the foot. It renders as an anchor when it has an `href` and as a plain block when it does not — the root element switches on data, never on an `as` prop — so a card is either a destination or a statement, and never a dead link. A card that leaves the documentation swaps the chevron for a diagonal arrow.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Card heading.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    overline: {
      control: 'text',
      description: 'Small muted line above the title.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    icon: {
      control: 'text',
      description: 'PrimeIcons class for the leading glyph.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    href: {
      control: 'text',
      description: 'Destination; when set the whole card becomes the link.',
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
    link: {
      control: 'text',
      description: 'Call-to-action text; when set the card closes on a link row.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    default: { description: 'Card copy.', table: { type: { summary: 'slot' } } }
  },
  args: {
    title: 'Edge Application',
    overline: '',
    icon: 'pi pi-server',
    href: '/docs/edge-application',
    target: '_self',
    label: '',
    link: 'Read the guide'
  }
}

export default meta

const DEFAULT_MARKUP = `<DocCard
  title="Edge Application"
  icon="pi pi-server"
  href="/docs/edge-application"
  link="Read the guide"
>
  Serve and cache your application at the edge, close to the people using it.
</DocCard>`

export const Default = {
  render: (args) => ({
    components: { DocCard },
    setup: () => ({ props: args }),
    template: `<DocCard v-bind="props">Serve and cache your application at the edge, close to the people using it.</DocCard>`
  }),
  parameters: {
    docs: {
      description: {
        story: 'A linked card: glyph, title, copy, and the call-to-action row it closes on.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const VARIANTS_TEMPLATE = `<div class="grid gap-(--spacing-md) sm:grid-cols-2">
  <DocCard title="Edge Application" icon="pi pi-server" href="/docs/edge-application" link="Read the guide">
    The plain shape: a glyph, a title, copy and a call to action.
  </DocCard>
  <DocCard overline="Azion CLI" title="Deploy from your terminal" icon="pi pi-desktop" href="/docs/cli">
    An overline says who or when, for a title that does not carry it.
  </DocCard>
  <DocCard title="Community templates" href="https://github.com/aziontech" target="_blank" link="Browse on GitHub">
    A card that leaves the documentation trades the chevron for a diagonal arrow.
  </DocCard>
  <DocCard title="Not a destination">
    With no href the root is a plain block, so it is neither focusable nor announced as a link.
  </DocCard>
</div>`

export const Variants = {
  render: () => ({ components: { DocCard }, template: VARIANTS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The axes that change the anatomy: with and without an overline, an external destination, and a card with no `href` at all — whose root element is a block rather than an anchor.'
      },
      source: { code: toSfc(IMPORT, VARIANTS_TEMPLATE) }
    }
  }
}
