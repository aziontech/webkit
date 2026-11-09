import ListingBrowser from '@aziontech/webkit/sections/listing-browser'

import { toSfc } from '../../../_shared/story-source'
import { SITE_SECTION } from '../../../templates/marketing/_sections/listing-browser'

const IMPORT = "import ListingBrowser from '@aziontech/webkit/sections/listing-browser'"

const prop = (control, summary, defaultValue, description) => ({
  control,
  description,
  table: {
    category: 'props',
    type: { summary },
    defaultValue: { summary: defaultValue }
  }
})

/** @type {import('@storybook/vue3').Meta<typeof ListingBrowser>} */
const meta = {
  title: 'Components/Sections/ListingBrowser',
  component: ListingBrowser,
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
          "The full, browsable listing of a page such as the Careers jobs list: a headline over a toolbar (a search field, one select per facet and one for the order) and every row under its group, as a table from the small breakpoint up and as a list of items below it, with an empty state when nothing matches. Search, facets and order are local state over the rows the page carries; a facet is seeded from `?<key>=` in the URL when the value is one the page offers. It is a page section — the site places it from a `{ _id: 'listing-browser', props }` entry and binds `props` straight onto it — so its whole API is the props below."
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    anchor: prop('text', 'string', "''", 'In-page `id` of the band, the target of a `#hash` link.'),
    title: prop(
      'text',
      'string',
      "''",
      'Headline over the listing, rendered by the section title as its `h2` and naming the band.'
    ),
    columns: prop(
      'object',
      'ListingBrowserColumn[]',
      '[]',
      'The columns, left to right; each is `{ key, label, grow?, align? }`. The first names the row and links it, the second describes it on phones.'
    ),
    rows: prop(
      'object',
      'ListingBrowserRow[]',
      '[]',
      'Every row, in source order; each is `{ href, group, values, facets }` where `values` and `facets` are keyed by column and facet.'
    ),
    groups: prop(
      'object',
      'string[]',
      '[]',
      'The groups the rows are listed under, in order; a group with no matching row is not shown.'
    ),
    facets: prop(
      'object',
      'ListingBrowserFacet[]',
      '[]',
      'The facet selects; each is `{ key, label, allLabel, options }` where `key` matches a row facet and seeds it from `?key=` in the URL, and every option is `{ value, label }`.'
    ),
    sorts: prop(
      'object',
      'ListingBrowserSort[]',
      '[]',
      'The orders, the first the default; each is `{ value, label, by? }` where `by` is the column it sorts on and an empty `by` keeps the source order.'
    ),
    sortAriaLabel: prop('text', 'string', "''", 'Accessible name of the order select.'),
    search: prop(
      'object',
      'ListingBrowserSearch',
      'undefined',
      'The search field; `{ placeholder, shortPlaceholder, label }` where `shortPlaceholder` is used below the large breakpoint and `label` names the field. Omitted when absent.'
    ),
    empty: prop(
      'object',
      'ListingBrowserEmpty',
      'undefined',
      'The state shown when nothing matches; `{ title, description, clearLabel }` where `clearLabel` is the button that clears the search and every facet. Omitted when absent.'
    )
  },
  args: SITE_SECTION.props
}

export default meta

const Template = (args) => ({
  components: { ListingBrowser },
  setup() {
    return { args }
  },
  template: '<ListingBrowser v-bind="args" />'
})

const DEFAULT_MARKUP = `<ListingBrowser
  title="Open positions"
  :columns="[
    { key: 'role', label: 'Role', grow: 2 },
    { key: 'team', label: 'Team and location', grow: 2 },
    { key: 'type', label: 'Work type', align: 'end' }
  ]"
  :rows="[
    {
      href: '/careers/software-engineer-go',
      group: 'Engineering',
      values: { role: 'Software Engineer (Go)', team: 'Engineering · Porto Alegre', type: 'Hybrid · Full-time' },
      facets: { area: ['Engineering'], location: ['Porto Alegre'] }
    },
    {
      href: '/careers/grc-analyst',
      group: 'Security',
      values: { role: 'GRC Analyst (Governance, Risk & Compliance)', team: 'Compliance and Corporate IT · Porto Alegre / São Paulo', type: 'Hybrid · Full-time' },
      facets: { area: ['Security'], location: ['Porto Alegre', 'São Paulo'] }
    }
  ]"
  :groups="['Engineering', 'Security']"
  :facets="[
    {
      key: 'area',
      label: 'Department',
      allLabel: 'All departments',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Security', label: 'Security' }
      ]
    },
    {
      key: 'location',
      label: 'Location',
      allLabel: 'All locations',
      options: [
        { value: 'São Paulo', label: 'São Paulo, Brazil' },
        { value: 'Porto Alegre', label: 'Porto Alegre, Brazil' }
      ]
    }
  ]"
  :sorts="[
    { value: 'newest', label: 'Newest posted', by: '' },
    { value: 'title', label: 'Title (A–Z)', by: 'role' }
  ]"
  sort-aria-label="Sort positions"
  :search="{ placeholder: 'Search by title, team, or location', shortPlaceholder: 'Search positions', label: 'Search positions' }"
  :empty="{ title: 'Nothing here yet', description: 'No open positions match your search.', clearLabel: 'View all open positions' }"
/>`

/** @type {import('@storybook/vue3').StoryObj<typeof ListingBrowser>} */
export const Default = {
  render: Template,
  parameters: {
    docs: {
      description: {
        story:
          'The Careers jobs list at rest: every department and location, newest first, with Engineering and Security as the groups shown. Type in the search field, pick a department or a location, or switch the order — pick Marketing to reach the empty state and clear it from its button.'
      },
      source: { code: toSfc(IMPORT, DEFAULT_MARKUP) }
    }
  }
}
