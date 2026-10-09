import Button from '@aziontech/webkit/button'
import FrameBox from '@aziontech/webkit/frame-box'
import Item from '@aziontech/webkit/item'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import Table from '@aziontech/webkit/table'

import { COLUMN_IMPORTS, each, inColumn, indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  "import Item from '@aziontech/webkit/item'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import Table from '@aziontech/webkit/table'"
]

const components = {
  Button,
  FrameBox,
  Item,
  'Item.Content': Item.Content,
  'Item.Description': Item.Description,
  'Item.List': Item.List,
  'Item.Title': Item.Title,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  Table,
  'Table.Body': Table.Body,
  'Table.Cell': Table.Cell,
  'Table.Footer': Table.Footer,
  'Table.HeadCell': Table.HeadCell,
  'Table.Header': Table.Header,
  'Table.Row': Table.Row
}

const ROLES = [
  {
    href: '/careers/senior-platform-engineer',
    role: 'Senior Platform Engineer',
    team: 'Delivery Engineering · Porto Alegre',
    type: 'Hybrid · Full-time'
  },
  {
    href: '/careers/senior-quality-automation-engineer',
    role: 'Senior Quality Automation Engineer',
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
    href: '/careers/software-engineer-rust',
    role: 'Software Engineer (Rust and/or C/C++)',
    team: 'Platform Engineering · Porto Alegre / São Paulo',
    type: 'Hybrid · Full-time'
  },
  {
    href: '/careers/senior-infrastructure-analyst',
    role: 'Senior Infrastructure Analyst',
    team: 'SRE · Porto Alegre / São Paulo',
    type: 'Hybrid · Full-time'
  },
  {
    href: '/careers/software-engineer-frontend',
    role: 'Software Engineer (Frontend)',
    team: 'UX Engineering · Porto Alegre',
    type: 'Hybrid · Full-time'
  }
]

const SEE_ALL = (extra = '') => `<Button
  label="See all 23 roles"
  kind="outlined"
  size="large"
  href="/careers/jobs"
  icon="pi pi-chevron-right"
  icon-position="trailing"
  animated${extra}
/>`

const PHONE_LIST = `<div class="sm:hidden">
  <Item.List>
${each(
  ROLES,
  (role) => `<Item class="relative px-(--spacing-xl)! py-(--spacing-lg)! hover:bg-(--bg-hover)">
  <Item.Content class="gap-(--spacing-xs)">
    <Item.Title>
      <a
        href="${role.href}"
        class="text-pretty text-label-lg text-(--text-default) after:absolute after:inset-0 after:content-['']"
      >
        ${role.role}
      </a>
    </Item.Title>
    <Item.Description class="line-clamp-none! text-overline-sm! text-pretty">
      ${role.team}
    </Item.Description>
  </Item.Content>
</Item>`,
  2
)}
  </Item.List>
  <div class="flex border-t border-(--border-default) px-(--spacing-xl) py-(--spacing-lg)">
${indent(SEE_ALL('\n  class="w-full"'), 2)}
  </div>
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

  <Table.Body>
${each(
  ROLES,
  (role) => `<Table.Row class="cursor-pointer hover:[--table-row-bg:var(--bg-hover)]!">
  <Table.Cell :grow="2" principal class="py-(--spacing-lg)! pl-(--spacing-xl)!">
    <a href="${role.href}" class="min-w-0 whitespace-normal text-pretty text-label-lg text-(--text-default)">${role.role}</a>
  </Table.Cell>
  <Table.Cell :grow="2" class="py-(--spacing-lg)! text-overline-sm! text-(--text-muted)">
    <span class="min-w-0 truncate" title="${role.team}">${role.team}</span>
  </Table.Cell>
  <Table.Cell align="end" class="py-(--spacing-lg)! pr-(--spacing-xl)! text-overline-sm! text-(--text-muted)">
    <span class="min-w-0 truncate" title="${role.type}">${role.type}</span>
  </Table.Cell>
</Table.Row>`,
  2
)}
  </Table.Body>

  <template #footer>
    <Table.Footer>
      <div class="flex justify-end px-(--spacing-xl) py-(--spacing-lg)">
${indent(SEE_ALL(), 4)}
      </div>
    </Table.Footer>
  </template>
</Table>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle kind="left" title="Latest roles" />
  </template>

  <FrameBox flush borders="y" marks="bottom">
${indent(PHONE_LIST, 2)}

${indent(TABLE, 2)}
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Content/ListingTable',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A titled preview of a longer listing: a few linked rows in columns, and one outlined button into the full list. The column headers are set in the overline face, as on the pricing matrix and the jobs list, and every value after the first column in the small overline face. Each row is one link, named by its first column; the whole row is clickable with the pointer, and the title link is the keyboard and screen-reader path. Below `sm` the columns cannot fit, so the same rows become a list of items whose titles wrap, with the second column as the description and the button going full width. Careers uses it for its latest roles. Built from `SectionModule`, `SectionTitle`, `FrameBox`, `Table` and, on phones, `Item`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const LatestRoles = {
  render: () => ({ components, template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The Careers page’s six latest roles: role, team and location, and work type aligned to the end, with the button into all 23 roles in the table’s footer.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
