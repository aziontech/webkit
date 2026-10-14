import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownRoot from '@aziontech/webkit/dropdown-root'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import IconButton from '@aziontech/webkit/icon-button'
import TableBody from '@aziontech/webkit/table-body'
import TableCell from '@aziontech/webkit/table-cell'
import TableHeadCell from '@aziontech/webkit/table-head-cell'
import TableHeader from '@aziontech/webkit/table-header'
import TableRoot from '@aziontech/webkit/table-root'
import TableRow from '@aziontech/webkit/table-row'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { toSfc } from '../../_shared/story-source'

const text = (value) => `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  if (typeof value === 'string') return text(value)
  if (typeof value !== 'object' || value === null) return String(value)
  const pad = '  '.repeat(depth + 1)
  const close = '  '.repeat(depth)
  if (Array.isArray(value)) {
    return `[\n${value.map((item) => `${pad}${literal(item, depth + 1)}`).join(',\n')}\n${close}]`
  }
  const entries = Object.entries(value).map(([key, item]) => `${key}: ${literal(item, depth + 1)}`)
  const inline = `{ ${entries.join(', ')} }`
  if (inline.length <= 88) return inline
  return `{\n${entries.map((entry) => `${pad}${entry}`).join(',\n')}\n${close}}`
}

const declare = (name, value) => `const ${name} = ${literal(value)}`

const TAG_COLUMN = 104

const TAG_COLUMN_WIDE = 136

const CERTIFICATE_COLUMN_WIDTH = 200

const COLUMNS = {
  domainColumn: { flex: '2 1 0' },
  environmentColumn: { flex: `0 0 ${TAG_COLUMN_WIDE}px` },
  policyColumn: { flex: `0 0 ${TAG_COLUMN}px` },
  certificateColumn: { flex: `0 0 ${CERTIFICATE_COLUMN_WIDTH}px` }
}

const DOMAINS = [
  {
    id: 'generated',
    domain: 'storefront-7f3a.map.azionedge.net',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Azion (free)',
    generated: true
  },
  {
    id: 'shop',
    domain: 'shop.example.com',
    environment: 'Production',
    policy: 'Single',
    certificate: 'Azion (free)',
    generated: false
  },
  {
    id: 'preview',
    domain: 'preview.example.com',
    environment: 'Stage',
    policy: 'Versioned',
    certificate: '*.example.com',
    generated: false
  }
]

const TEMPLATE = `<CardBox :padded="false">
  <template #content>
    <div class="flex min-w-0 flex-col">
      <TableRoot :border="false">
        <TableHeader>
          <TableRow>
            <TableHeadCell principal :style="domainColumn">Domain</TableHeadCell>
            <TableHeadCell :style="environmentColumn">Environment</TableHeadCell>
            <TableHeadCell :style="policyColumn">Policy</TableHeadCell>
            <TableHeadCell :style="certificateColumn">Certificate</TableHeadCell>
            <TableHeadCell kind="action" />
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow v-for="entry in domains" :key="entry.id">
            <TableCell principal :style="domainColumn">{{ entry.domain }}</TableCell>
            <TableCell :style="environmentColumn">
              <Tag severity="secondary" size="small" rounded icon="ai ai-layers" :label="entry.environment" />
            </TableCell>
            <TableCell :style="policyColumn">
              <Tag severity="secondary" size="small" rounded :label="entry.policy" />
            </TableCell>
            <TableCell :style="certificateColumn">
              <Tag severity="secondary" size="small" rounded icon="pi pi-verified" :label="entry.certificate" />
            </TableCell>
            <TableCell kind="action">
              <DropdownRoot v-if="!entry.generated" placement="bottom-end">
                <DropdownTrigger>
                  <Tooltip text="Row actions">
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="outlined"
                      size="small"
                      :aria-label="\`Actions for \${entry.domain}\`"
                    />
                  </Tooltip>
                </DropdownTrigger>
                <DropdownGroup>
                  <DropdownOption value="edit" label="Edit">
                    <template #left><i class="pi pi-pencil" aria-hidden="true" /></template>
                  </DropdownOption>
                </DropdownGroup>
                <DropdownGroup>
                  <DropdownOption value="delete" label="Delete">
                    <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
                  </DropdownOption>
                </DropdownGroup>
              </DropdownRoot>
            </TableCell>
          </TableRow>
        </TableBody>
      </TableRoot>

      <div class="flex flex-wrap items-center justify-between gap-(--spacing-xs) border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-sm)">
        <span class="text-body-xs text-(--text-muted)">{{ domains.length }} domains</span>
        <Button label="Add Domain" kind="outlined" size="medium" icon="pi pi-plus" />
      </div>
    </div>
  </template>
</CardBox>`

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import DropdownRoot from '@aziontech/webkit/dropdown-root'",
  "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
  "import DropdownOption from '@aziontech/webkit/dropdown-option'",
  "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import TableBody from '@aziontech/webkit/table-body'",
  "import TableCell from '@aziontech/webkit/table-cell'",
  "import TableHeadCell from '@aziontech/webkit/table-head-cell'",
  "import TableHeader from '@aziontech/webkit/table-header'",
  "import TableRow from '@aziontech/webkit/table-row'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  '',
  ...Object.entries(COLUMNS).map(([name, value]) => declare(name, value)),
  '',
  declare('domains', DOMAINS)
]

const components = {
  Button,
  CardBox,
  DropdownRoot,
  DropdownGroup,
  DropdownOption,
  DropdownTrigger,
  IconButton,
  TableRoot,
  TableBody,
  TableCell,
  TableHeadCell,
  TableHeader,
  TableRow,
  Tag,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Detail/DomainsSection',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Domains card in a resource settings tab: a borderless table of the addresses the resource answers on, each with its environment, deployment policy and certificate as rounded tags and a row actions menu, over a footer that counts them and adds one. Rendered under Domains on the Application Settings and Workload Settings pages. Built from `CardBox`, `Table`, `Tag`, `Dropdown`, `IconButton`, `Tooltip` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ ...COLUMNS, domains: DOMAINS }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Three domains: the generated hostname, which carries no actions menu, and two custom domains with Edit and Delete in their row menu.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
