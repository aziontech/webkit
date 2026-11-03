import FrameBox from '@aziontech/webkit/frame-box'
import InputText from '@aziontech/webkit/input-text'
import Item from '@aziontech/webkit/item'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import Select, { SelectContent, SelectOption, SelectTrigger } from '@aziontech/webkit/select'
import Table from '@aziontech/webkit/table'

import { editable } from '../../_shared/editable-content'
import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { siteJsonStory } from '../../_shared/site-json'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Item from '@aziontech/webkit/item'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import Select from '@aziontech/webkit/select'",
  "import Table from '@aziontech/webkit/table'"
]

const components = {
  FrameBox,
  InputText,
  Item,
  'Item.Content': Item.Content,
  'Item.Description': Item.Description,
  'Item.List': Item.List,
  'Item.Title': Item.Title,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  Select,
  'Select.Content': SelectContent,
  'Select.Option': SelectOption,
  'Select.Trigger': SelectTrigger,
  Table,
  'Table.Body': Table.Body,
  'Table.Cell': Table.Cell,
  'Table.HeadCell': Table.HeadCell,
  'Table.Header': Table.Header,
  'Table.Row': Table.Row
}

const GROUPS = [
  {
    name: 'Engineering',
    rows: [
      {
        href: '/careers/senior-platform-engineer',
        role: 'Senior Platform Engineer',
        team: 'Delivery Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      },
      {
        href: '/careers/software-engineer-go',
        role: 'Software Engineer (Go)',
        team: 'Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      },
      {
        href: '/careers/software-engineer-frontend',
        role: 'Software Engineer (Frontend)',
        team: 'UX Engineering · Porto Alegre',
        type: 'Hybrid · Full-time'
      }
    ]
  },
  {
    name: 'Security',
    rows: [
      {
        href: '/careers/defensive-security-engineer',
        role: 'Defensive Security Engineer (SOC)',
        team: 'Cybersecurity · Porto Alegre / São Paulo',
        type: 'Hybrid · Full-time'
      },
      {
        href: '/careers/grc-analyst',
        role: 'GRC Analyst (Governance, Risk & Compliance)',
        team: 'Compliance and Corporate IT · Porto Alegre / São Paulo',
        type: 'Hybrid · Full-time'
      }
    ]
  }
]

const FACETS = [
  {
    label: 'Department',
    all: 'All departments',
    options: ['Engineering', 'Marketing', 'Revenue', 'Operations', 'Security']
  },
  {
    label: 'Location',
    all: 'All locations',
    options: ['Palo Alto, USA', 'São Paulo, Brazil', 'Porto Alegre, Brazil']
  },
  { label: 'Sort positions', all: 'Newest posted', options: ['Newest posted', 'Title (A–Z)'] }
]

const facetSelect = (facet) => `<Select size="large" placeholder="${facet.all}">
  <Select.Trigger aria-label="${facet.label}" />
  <Select.Content>
${each(facet.options, (option) => `<Select.Option value="${option}">${option}</Select.Option>`, 2)}
  </Select.Content>
</Select>`

const TOOLBAR = `<div
  role="search"
  class="grid gap-(--spacing-md) border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-lg) lg:grid-cols-[minmax(0,4fr)_repeat(3,minmax(0,1fr))] lg:items-center"
>
  <InputText
    size="large"
    type="text"
    placeholder="Search by title, team, or location"
    aria-label="Search positions"
  >
    <template #iconLeft>
      <i class="pi pi-search text-(--text-muted)" />
    </template>
  </InputText>
${each(FACETS, facetSelect, 1)}
</div>`

const PHONE_LIST = `<div class="sm:hidden">
${each(
  GROUPS,
  (group, index) => `<section${index > 0 ? ' class="border-t border-(--border-default)"' : ''}>
  <h3
    class="sticky top-14 z-20 m-0 border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-xl) py-(--spacing-md) text-overline-md text-(--text-muted)"
  >
    ${group.name}
  </h3>
  <Item.List>
${each(
  group.rows,
  (row) => `<Item class="relative px-(--spacing-xl)! py-(--spacing-lg)! hover:bg-(--bg-hover)">
  <Item.Content class="gap-(--spacing-xs)">
    <Item.Title>
      <a
        href="${row.href}"
        class="text-pretty text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-['']"
      >
        ${row.role}
      </a>
    </Item.Title>
    <Item.Description class="line-clamp-none! text-overline-sm! text-pretty">
      ${row.team}
    </Item.Description>
  </Item.Content>
</Item>`,
  2
)}
  </Item.List>
</section>`,
  1
)}
</div>`

const TABLE = `<Table class="max-sm:hidden!">
  <Table.Header>
    <Table.Row>
      <Table.HeadCell :grow="2" class="pl-(--spacing-xl)!">
        <span class="text-overline-md text-(--text-muted)">Role</span>
      </Table.HeadCell>
      <Table.HeadCell :grow="2">
        <span class="text-overline-md text-(--text-muted)">Team and location</span>
      </Table.HeadCell>
      <Table.HeadCell align="end" class="pr-(--spacing-xl)!">
        <span class="text-overline-md text-(--text-muted)">Work type</span>
      </Table.HeadCell>
    </Table.Row>
  </Table.Header>

${each(
  GROUPS,
  (group, index) => `<Table.Body>
  <Table.Row class="sticky top-14 z-20 bg-(--bg-surface)${index > 0 ? ' border-t border-(--border-default)' : ''}">
    <Table.Cell :grow="3" class="pl-(--spacing-xl)!">
      <h3 class="m-0 text-overline-md text-(--text-default)">${group.name}</h3>
    </Table.Cell>
  </Table.Row>
${each(
  group.rows,
  (row) => `<Table.Row class="cursor-pointer hover:[--table-row-bg:var(--bg-hover)]!">
  <Table.Cell :grow="2" principal class="py-(--spacing-lg)! pl-(--spacing-xl)!">
    <a href="${row.href}" class="min-w-0 whitespace-normal text-pretty text-label-lg text-(--text-default)">${row.role}</a>
  </Table.Cell>
  <Table.Cell :grow="2" class="py-(--spacing-lg)! text-overline-sm! text-(--text-muted)">
    <span class="min-w-0 truncate" title="${row.team}">${row.team}</span>
  </Table.Cell>
  <Table.Cell align="end" class="py-(--spacing-lg)! pr-(--spacing-xl)! text-overline-sm! text-(--text-muted)">
    <span class="min-w-0 truncate" title="${row.type}">${row.type}</span>
  </Table.Cell>
</Table.Row>`,
  1
)}
</Table.Body>`,
  1
)}
</Table>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <FrameBox flush borders="y" marks="bottom">
    <SectionTitle
      kind="left"
      :framed="false"
      title="Open positions"
      class="border-b border-(--border-default) px-(--spacing-xl) py-(--spacing-xxl)"
    />

${indent(TOOLBAR, 2)}

${indent(PHONE_LIST, 2)}

${indent(TABLE, 2)}
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Listings/ListingBrowser',
  excludeStories: ['SITE_SECTION'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    docs: {
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const OpenPositions = {
  ...editable(() => ({ components, template: TEMPLATE })),
  parameters: {
    docs: {
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

export const SITE_SECTION = {
  _id: 'listing-browser',
  props: {
    title: 'Open positions',
    columns: [
      { key: 'role', label: 'Role', grow: 2 },
      { key: 'team', label: 'Team and location', grow: 2 },
      { key: 'type', label: 'Work type', align: 'end' }
    ],
    rows: GROUPS.flatMap((group) =>
      group.rows.map(({ href, role, team, type }) => ({
        href,
        group: group.name,
        values: { role, team, type },
        facets: { area: [group.name], location: team.split(' · ')[1].split(' / ') }
      }))
    ),
    groups: GROUPS.map((group) => group.name),
    facets: [
      {
        key: 'area',
        label: FACETS[0].label,
        allLabel: FACETS[0].all,
        options: FACETS[0].options.map((option) => ({ value: option, label: option }))
      },
      {
        key: 'location',
        label: FACETS[1].label,
        allLabel: FACETS[1].all,
        options: FACETS[1].options.map((option) => ({
          value: option.split(', ')[0],
          label: option
        }))
      }
    ],
    sorts: [
      { value: 'newest', label: FACETS[2].options[0], by: '' },
      { value: 'title', label: FACETS[2].options[1], by: 'role' }
    ],
    sortLabel: FACETS[2].label,
    search: {
      placeholder: 'Search by title, team, or location',
      shortPlaceholder: 'Search positions',
      label: 'Search positions'
    },
    empty: {
      title: 'Nothing here yet',
      description: 'No open positions match your search.',
      action: 'View all open positions'
    }
  }
}

export const OpenPositionsJson = {
  tags: ['!dev'],
  ...siteJsonStory(SITE_SECTION)
}
