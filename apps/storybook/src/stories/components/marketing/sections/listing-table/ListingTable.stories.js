import ListingTable from '@aziontech/webkit/listing-table'

import { toSfc } from '../../../../_shared/story-source'
import { SITE_SECTION } from '../../../../templates/marketing/_sections/listing-table'

const IMPORT = "import ListingTable from '@aziontech/webkit/listing-table'"

/** @type {import('@storybook/vue3').Meta<typeof ListingTable>} */
const meta = {
  title: 'Components/Marketing/Sections/ListingTable',
  component: ListingTable,
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
          "A titled preview of a longer listing: a few linked rows in columns, and one outlined button into the full list. It is a page section — the site places it from a `{ _id: 'listing-table', props }` entry and binds `props` straight onto it — and it composes `section-module`, `section-title`, `frame-box`, `table` and, below `sm`, `item`. Each row is one link named by its first column; below `sm` the same rows become a list of items, the first column as the title and the second as the description."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: {
      control: 'text',
      description: 'In-page id set on the band so a `#hash` link can scroll to it.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    title: {
      control: 'text',
      description:
        'Headline of the band, rendered by the left-aligned section title as its `h2`; the band renders no header when empty.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "''" }
      }
    },
    columns: {
      control: 'object',
      description:
        'The columns left to right; each is `{ key, label, grow?, align? }` where `key` picks the row value, `grow` is the flex weight (1, 2 or 3) and `align` is `start` or `end`. The first column names the row and the second describes it on phones.',
      table: {
        category: 'props',
        type: { summary: 'ListingTableColumn[]' },
        defaultValue: { summary: '[]' }
      }
    },
    rows: {
      control: 'object',
      description:
        'The linked rows, in order; each is `{ href, values }` where `values` maps a column key to its text.',
      table: {
        category: 'props',
        type: { summary: 'ListingTableRow[]' },
        defaultValue: { summary: '[]' }
      }
    },
    primaryAction: {
      control: 'object',
      description:
        'Outlined button into the full listing, in the table footer; `{ label, href, trailing? }` where `trailing` adds the chevron. Omitted when absent.',
      table: {
        category: 'props',
        type: { summary: 'ListingTableAction' },
        defaultValue: { summary: 'undefined' }
      }
    }
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ListingTable },
  setup() {
    return { args }
  },
  template: '<ListingTable v-bind="args" />'
})

const DEFAULT_MARKUP = `<ListingTable
  title="Latest roles"
  :columns="[
    { key: 'role', label: 'Role', grow: 2 },
    { key: 'team', label: 'Team and location', grow: 2 },
    { key: 'type', label: 'Work type', align: 'end' }
  ]"
  :rows="[
    {
      href: '/careers/senior-platform-engineer',
      values: { role: 'Senior Platform Engineer', team: 'Delivery Engineering · Porto Alegre', type: 'Hybrid · Full-time' }
    },
    {
      href: '/careers/senior-quality-automation-engineer',
      values: { role: 'Senior Quality Automation Engineer', team: 'Delivery Engineering · Porto Alegre', type: 'Hybrid · Full-time' }
    },
    {
      href: '/careers/software-engineer-go',
      values: { role: 'Software Engineer (Go)', team: 'Engineering · Porto Alegre', type: 'Hybrid · Full-time' }
    },
    {
      href: '/careers/software-engineer-rust',
      values: { role: 'Software Engineer (Rust and/or C/C++)', team: 'Platform Engineering · Porto Alegre / São Paulo', type: 'Hybrid · Full-time' }
    },
    {
      href: '/careers/senior-infrastructure-analyst',
      values: { role: 'Senior Infrastructure Analyst', team: 'SRE · Porto Alegre / São Paulo', type: 'Hybrid · Full-time' }
    },
    {
      href: '/careers/software-engineer-frontend',
      values: { role: 'Software Engineer (Frontend)', team: 'UX Engineering · Porto Alegre', type: 'Hybrid · Full-time' }
    }
  ]"
  :primary-action="{ label: 'See all 23 roles', href: '/careers/jobs', trailing: true }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ListingTable>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          "The Careers page's latest roles, with the button into the full list in the table footer. Edit the props in the Controls panel — a band with no rows renders nothing, and one with no `primaryAction` drops its button."
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
