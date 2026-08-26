import DocPageHeader from '@aziontech/webkit/doc-page-header'

import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import DocPageHeader from '@aziontech/webkit/doc-page-header'"

const CRUMBS = [{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]
const SOURCE = '# Deploy an application\n\nTemplates are ready-made projects.'

/** @type {import('@storybook/vue3').Meta<typeof DocPageHeader>} */
const meta = {
  title: 'Components/Documentation/DocPageHeader',
  component: DocPageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "The masthead of a documentation page: where the reader is, what the page is, what they can do with it, the deck that says what they will have by the end, and when the content last changed. It closes on a rule spanning the column — without that edge the deck runs straight into the prose, with only a size change between them — and that rule is what gives every h2 below it something to be subordinate to. \"Last updated\" is the author's claim from the page's frontmatter, not the file's mtime."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The page title.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    description: {
      control: 'text',
      description: 'The deck under the title.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    breadcrumb: {
      control: 'object',
      description: 'Ancestor trail, current page last.',
      table: { type: { summary: 'DocCrumb[]' }, defaultValue: { summary: '[]' } }
    },
    copyable: {
      control: 'boolean',
      description: 'Shows the Copy Page control.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'true' } }
    },
    source: {
      control: 'text',
      description: 'The markdown handed to the clipboard by the primary action.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    lastUpdated: {
      control: 'text',
      description: "When the page's content last changed. ISO date, or a ready-made string.",
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" } }
    },
    onCopy: {
      action: 'copy',
      description: 'Fired when the primary Copy Page action runs.',
      table: { type: { summary: '(event: MouseEvent, source: string)' } }
    },
    onAction: {
      action: 'action',
      description: 'Fired when one of the attached AI actions is chosen.',
      table: { type: { summary: '(event, item: { label: string; value?: string })' } }
    }
  },
  args: {
    title: 'Deploy an application',
    description: 'Go from a template to a live edge application in a few clicks.',
    breadcrumb: CRUMBS,
    copyable: true,
    source: SOURCE,
    lastUpdated: '2026-06-30'
  }
}

export default meta

const DEFAULT_MARKUP = `<DocPageHeader
  title="Deploy an application"
  description="Go from a template to a live edge application in a few clicks."
  :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'Deploy an application' }]"
  last-updated="2026-06-30"
  :source="markdown"
  @copy="(event, source) => toast('Page copied')"
  @action="(event, item) => openIn(item.value)"
/>`

export const Default = {
  render: (args) => ({
    components: { DocPageHeader },
    setup: () => ({ props: args }),
    template: '<DocPageHeader v-bind="props" />'
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The full masthead. The ISO date is formatted for reading and rendered in UTC, so a bare `2026-06-30` does not become the 29th west of Greenwich.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}

const REGIONS_TEMPLATE = `<div class="flex flex-col gap-(--spacing-xxl)">
  <DocPageHeader
    title="No breadcrumb"
    description="The trail is optional; the masthead closes up rather than leaving a gap."
    last-updated="2026-06-30"
  />
  <DocPageHeader
    title="No deck"
    :breadcrumb="[{ label: 'Docs', href: '/docs' }, { label: 'No deck' }]"
    last-updated="Updated this morning"
  />
  <DocPageHeader
    title="Nothing to copy"
    description="With copyable false the control is removed, not disabled — a page with nothing to hand over should not advertise the action."
    :copyable="false"
  />
</div>`

export const Regions = {
  render: () => ({ components: { DocPageHeader }, template: REGIONS_TEMPLATE }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Every region is independently optional, and an absent one closes up instead of leaving an empty row. The middle example also shows that `lastUpdated` accepts a ready-made string when the author would rather write it themselves.'
      },
      source: { code: toSfc(IMPORT, REGIONS_TEMPLATE) }
    }
  }
}
