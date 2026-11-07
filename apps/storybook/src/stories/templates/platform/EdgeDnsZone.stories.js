import Avatar from '@aziontech/webkit/avatar'
import Badge from '@aziontech/webkit/badge'
import Button from '@aziontech/webkit/button'
import CalendarRoot from '@aziontech/webkit/calendar-root'
import CardBox from '@aziontech/webkit/card-box'
import Chip from '@aziontech/webkit/chip'
import CopyButton from '@aziontech/webkit/copy-button'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownRoot from '@aziontech/webkit/dropdown-root'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import HelperText from '@aziontech/webkit/helper-text'
import Hint from '@aziontech/webkit/hint'
import IconButton from '@aziontech/webkit/icon-button'
import InputGroupRoot from '@aziontech/webkit/input-group-root'
import InputText from '@aziontech/webkit/input-text'
import ItemActions from '@aziontech/webkit/item-actions'
import ItemContent from '@aziontech/webkit/item-content'
import ItemDescription from '@aziontech/webkit/item-description'
import ItemList from '@aziontech/webkit/item-list'
import ItemRoot from '@aziontech/webkit/item-root'
import ItemTitle from '@aziontech/webkit/item-title'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverRoot from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import Switch from '@aziontech/webkit/switch'
import TabView from '@aziontech/webkit/tab-view'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, reactive, ref, useId } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  APPLIED_CHIPS,
  constLine,
  controlsRow,
  exportButton,
  idCell,
  LIST_COMPONENT_IMPORTS,
  listStateScript,
  mergeImports,
  pageHeading,
  rowActions,
  searchField,
  useListPage
} from './_lists-markup'

const components = {
  Avatar,
  Badge,
  Button,
  CalendarRoot,
  CardBox,
  Chip,
  CopyButton,
  DropdownRoot,
  DropdownGroup,
  DropdownOption,
  DropdownTrigger,
  HelperText,
  Hint,
  IconButton,
  InputGroupRoot,
  InputText,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemList,
  ItemRoot,
  ItemTitle,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  Switch,
  TabView,
  'TabView.List': TabView.List,
  'TabView.Item': TabView.Item,
  TableRoot,
  Tag,
  Tooltip
}

const TABS = [
  { value: 'main-settings', label: 'Main Settings' },
  { value: 'records', label: 'Records' }
]

const NAMESERVERS = ['ns1.aziondns.net', 'ns2.aziondns.com', 'ns3.aziondns.org']

const DNSSEC_KEYS = [
  {
    label: 'Key tag',
    value: '34505',
    description:
      'Unique identifier for the DNSSEC key used to sign your zone. Use this value with your domain provider.'
  },
  {
    label: 'Algorithm',
    value: '13 (ECDSA Curve P-256 with SHA-256)',
    description: 'Specifies the algorithm used to generate the DNSSEC key.'
  },
  {
    label: 'Digest Type',
    value: '2 (SHA-256)',
    description: 'Indicates the hash function used for the DNSSEC digest.'
  },
  {
    label: 'Digest',
    value: '8A9E1F2C3B4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F',
    description:
      'Cryptographic hash of the public key for DNSSEC validation. Provide this to your provider.'
  }
]

const RECORD_COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'id', header: 'ID', enableSorting: true, minWidth: 80 },
  { accessorKey: 'type', header: 'Type', enableSorting: true, minWidth: 104 },
  { accessorKey: 'value', header: 'Value', grow: 2 },
  { accessorKey: 'ttl', header: 'TTL (seconds)', enableSorting: true, minWidth: 80 },
  { accessorKey: 'policy', header: 'Policy', minWidth: 80 },
  { accessorKey: 'weight', header: 'Weight', minWidth: 80 },
  { accessorKey: 'description', header: 'Description', grow: 2 },
  { id: 'actions', kind: 'action', hideable: false }
]

const RECORDS = [
  {
    id: '423916',
    name: 'sasas',
    type: 'A',
    value: '192.0.2.1',
    ttl: 3600,
    policy: 'simple',
    weight: 255,
    description: 'Cryptographic digest of this zone’s key, as your provider expects it.'
  }
]

const POLICY_TYPES = [
  { value: 'simple', label: 'Simple' },
  { value: 'weighted', label: 'Weighted' }
]

const RECORD_FIELDS = [
  {
    id: 'type',
    label: 'Type',
    kind: 'options',
    options: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map((value) => ({ value, label: value })),
    match: (record, values) => values.includes(record.type)
  },
  {
    id: 'policy',
    label: 'Policy',
    kind: 'options',
    options: POLICY_TYPES,
    match: (record, values) => values.includes(record.policy)
  }
]

const FIELDS_SCRIPT = [
  constLine('POLICY_TYPES', POLICY_TYPES),
  '',
  'const policyLabel = (value) => POLICY_TYPES.find((policy) => policy.value === value)?.label ?? \'\'',
  '',
  'const filterFields = [',
  '  {',
  "    id: 'type',",
  "    label: 'Type',",
  "    kind: 'options',",
  "    options: ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS'].map((value) => ({ value, label: value })),",
  '    match: (record, values) => values.includes(record.type)',
  '  },',
  '  {',
  "    id: 'policy',",
  "    label: 'Policy',",
  "    kind: 'options',",
  '    options: POLICY_TYPES,',
  '    match: (record, values) => values.includes(record.policy)',
  '  }',
  ']'
]

const SECTION_CLASS =
  'grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]'

const ANCHOR_CLASS =
  'absolute -left-(--size-6) flex size-5 shrink-0 items-center justify-center rounded-(--shape-button) text-(--text-muted) opacity-0 transition-opacity duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 motion-reduce:transition-none'

const slug = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const section = ({ title, hint, rows }) => `<section data-stacked class="${SECTION_CLASS}">
  <div
    data-stacked
    class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
  >
    <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
      <button
        type="button"
        aria-label="Copy link to the ${title} section"
        class="${ANCHOR_CLASS}"
        @click="copyLink('${slug(title)}')"
      >
        <i class="pi pi-link text-body-xs" aria-hidden="true" />
      </button>
      <h2 id="${slug(title)}" class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)">
        <span class="flex items-center gap-(--spacing-xs)">${title}</span>
      </h2>
      <Hint text="${hint}" class="shrink-0" />
    </div>
  </div>
  <div
    data-open
    class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
  >
    <div class="min-w-0 data-collapsible:overflow-hidden">
      <div
        data-open
        class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
      >
        <CardBox :padded="false">
          <template #content>
            <ItemList>
${indent(rows, 7)}
            </ItemList>
          </template>
        </CardBox>
      </div>
    </div>
  </div>
</section>`

const fieldRow = ({ title, description, control, message = '', vFor = '' }) => `<ItemRoot${vFor} size="small" class="items-start">
  <ItemContent>
    <ItemTitle>${title}</ItemTitle>
    <ItemDescription>${description}</ItemDescription>
  </ItemContent>
  <ItemActions class="flex-1 justify-end max-w-(--container-3xs)">
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
${indent(control, 3)}${message ? `\n${indent(message, 3)}` : ''}
    </div>
  </ItemActions>
</ItemRoot>`

const compactRow = ({ title, description, control }) => `<ItemRoot size="small" class="items-start">
  <ItemContent>
    <ItemTitle>${title}</ItemTitle>
    <ItemDescription>${description}</ItemDescription>
  </ItemContent>
  <ItemActions class="justify-end">
${indent(control, 2)}
  </ItemActions>
</ItemRoot>`

const requiredInput = (key, label) => `<InputText
  v-model="settings.${key}"
  size="large"
  class="w-full"
  aria-label="${label}"
  autocomplete="off"
  :required="!!errors.${key}"
  :aria-describedby="errors.${key} ? ${key}MessageId : undefined"
  :disabled="saving"
  @update:model-value="errors.${key} = ''"
/>`

const requiredMessage = (key) =>
  `<HelperText v-if="errors.${key}" :id="${key}MessageId" kind="required" :label="errors.${key}" />`

const GENERAL = section({
  title: 'General',
  hint: 'How this zone is identified across the console.',
  rows: [
    fieldRow({
      title: 'Name',
      description: 'Give a unique and descriptive name to identify your zone.',
      control: requiredInput('name', 'Name'),
      message: requiredMessage('name')
    }),
    fieldRow({
      title: 'Domain Name',
      description: 'Provide the domain name you want to host. Example: mydomain.com.',
      control: requiredInput('domain', 'Domain Name'),
      message: requiredMessage('domain')
    })
  ].join('\n\n')
})

const NAMESERVER = section({
  title: 'Configure your nameserver',
  hint: 'Set Azion Edge DNS as the authoritative DNS server for the domain.',
  rows: fieldRow({
    title: 'Nameservers',
    description:
      'Set Azion Edge DNS as the authoritative DNS server for a domain by copying the nameservers values.',
    control: `<div class="flex w-full flex-col gap-(--spacing-xs)">
  <InputGroupRoot v-for="(ns, index) in nameservers" :key="ns">
    <InputText
      :model-value="ns"
      size="large"
      class="flex-1 font-code"
      :aria-label="'Nameserver ' + (index + 1)"
      readonly
    />
    <CopyButton kind="transparent" :value="ns" :aria-label="'Copy nameserver ' + (index + 1)" />
  </InputGroupRoot>
</div>`,
    message:
      '<HelperText :id="nameserverMessageId" kind="helper" label="Add the nameservers in your domain provider." />'
  })
})

const DNSSEC = section({
  title: 'DNSSEC',
  hint: 'Signs the zone so resolvers can detect spoofed answers.',
  rows: `${compactRow({
    title: 'Enable DNSSEC',
    description:
      'Enable DNSSEC to secure your DNS zone against cache poisoning and spoofing attacks. Configure the Key Tag and Digest values in your domain provider to complete the setup.',
    control: '<Switch v-model="settings.dnssec" aria-label="Enable DNSSEC" :disabled="saving" />'
  })}

<template v-if="settings.dnssec">
${indent(
  fieldRow({
    vFor: ' v-for="key in dnssecKeys" :key="key.label"',
    title: '{{ key.label }}',
    description: '{{ key.description }}',
    control: `<InputGroupRoot class="w-full">
  <InputText :model-value="key.value" size="large" class="flex-1 font-code" :aria-label="key.label" readonly />
  <CopyButton kind="transparent" :value="key.value" :aria-label="'Copy ' + key.label" />
</InputGroupRoot>`
  })
)}
</template>`
})

const STATUS = section({
  title: 'Status',
  hint: 'A zone can be held inactive while its records are being built.',
  rows: compactRow({
    title: 'Active',
    description: 'When active, the zone answers authoritative DNS queries for the domain.',
    control: '<Switch v-model="settings.active" aria-label="Active" :disabled="saving" />'
  })
})

const SAVE_BAR = `<Transition
  enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
  enter-from-class="translate-y-2 opacity-0"
  leave-active-class="transition-[translate,opacity] duration-fast-02 ease-productive-exit motion-reduce:transition-none"
  leave-to-class="translate-y-2 opacity-0"
>
  <footer v-if="dirty || saving" class="sticky bottom-0 z-10 shrink-0">
    <div class="border-t border-(--border-default) bg-(--bg-canvas) lg:h-14">
      <div class="layout-boundary-inline flex min-w-0 flex-col gap-(--spacing-sm) py-(--spacing-sm) lg:h-full lg:flex-row lg:flex-wrap lg:items-center lg:justify-between lg:gap-x-(--spacing-xl) lg:py-0">
        <div class="flex min-w-0 items-start gap-(--spacing-xs)">
          <i class="pi pi-info-circle mt-0.5 shrink-0 text-body-sm text-(--text-muted)" aria-hidden="true" />
          <p class="min-w-0 text-body-sm text-(--text-default)">You have unsaved changes.</p>
        </div>
        <div class="flex flex-col-reverse gap-(--spacing-xs) lg:ml-auto lg:shrink-0 lg:flex-row lg:items-center lg:gap-(--spacing-sm)">
          <Button type="button" label="Discard" kind="outlined" size="medium" :disabled="saving" @click="discard" />
          <Button type="submit" label="Save" kind="primary" size="medium" :loading="saving" />
        </div>
      </div>
    </div>
  </footer>
</Transition>`

const MAIN_SETTINGS = `<section
  v-if="activeTab === 'main-settings'"
  class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col overflow-auto"
>
  <form class="flex min-h-full min-w-0 flex-col" aria-label="Zone settings" novalidate @submit.prevent="save">
    <div class="layout-column-form layout-boundary flex min-w-0 flex-1 flex-col">
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0" :disabled="saving">
          <legend class="sr-only">Zone settings</legend>
${indent([GENERAL, NAMESERVER, DNSSEC, STATUS].join('\n\n'), 5)}
        </fieldset>
      </section>
    </div>
${indent(SAVE_BAR, 2)}
  </form>
</section>`

const RECORDS_TABLE = `<CardBox :padded="false">
  <template #content>
    <TableRoot
      ref="tableRef"
      v-model:pagination="pagination"
      v-model:globalFilter="search"
      v-model:columnVisibility="columnVisibility"
      :data="visibleRows"
      :columns="columns"
      row-key="id"
      enable-sorting
      paginated
      :page-size="8"
      :border="false"
      :loading="loading"
    >
      <template #cell-name="{ value }">
        <span class="min-w-0 truncate">{{ value }}</span>
      </template>
${indent(idCell('record'), 3)}
      <template #cell-type="{ value }">
        <Tag :label="value" severity="secondary" size="medium" />
      </template>
      <template #cell-value="{ value }">
        <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
          <span class="min-w-0 truncate">{{ value }}</span>
          <CopyButton kind="outlined" :value="value" aria-label="Copy record value" class="ml-auto shrink-0" @click.stop />
        </div>
      </template>
      <template #cell-policy="{ value }">
        <span class="min-w-0 truncate">{{ policyLabel(value) }}</span>
      </template>
      <template #cell-weight="{ value }">
        <span class="min-w-0 truncate">{{ value ?? '—' }}</span>
      </template>
      <template #cell-description="{ value }">
        <span class="min-w-0 truncate">{{ value || '—' }}</span>
      </template>
${indent(
  rowActions({
    groups: [
      [{ value: 'edit', label: 'Edit', icon: 'pi pi-pencil' }],
      [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }]
    ]
  }),
  3
)}
    </TableRoot>
  </template>
</CardBox>`

const RECORDS_TAB = `<section v-else class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto">
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
${indent(
  pageHeading({
    title: 'Records',
    description: 'The authoritative records this zone answers with.',
    size: 'small',
    docs: 'https://www.azion.com/en/documentation/products/secure/edge-dns/',
    action: 'Add Record'
  }),
  2
)}
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(
  controlsRow({
    search: searchField('Search records'),
    exportButton: exportButton('dns-records.csv')
  }),
  4
)}
${indent(APPLIED_CHIPS, 4)}
${indent(RECORDS_TABLE, 4)}
      </section>
    </section>
  </div>
</section>`

const TEMPLATE = `<div class="flex h-dvh flex-col bg-(--bg-canvas)">
  <main class="flex h-full min-h-0 flex-col">
    <div class="border-b border-(--border-default)">
      <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
        <TabView v-model:value="activeTab" class="-ml-(--spacing-xs) min-w-0 flex-1">
          <TabView.List>
            <TabView.Item v-for="tab in tabs" :key="tab.value" :value="tab.value" :label="tab.label" />
          </TabView.List>
        </TabView>
      </div>
    </div>

${indent(MAIN_SETTINGS, 2)}

${indent(RECORDS_TAB, 2)}
  </main>
</div>`

const SETTINGS_SCRIPT = [
  "const zone = { name: 'test', domain: 'edgeflow.com' }",
  '',
  constLine('tabs', TABS),
  '',
  constLine('nameservers', NAMESERVERS),
  '',
  constLine('dnssecKeys', DNSSEC_KEYS),
  '',
  "const errors = reactive({ name: '', domain: '' })",
  'const settings = reactive({ name: zone.name, domain: zone.domain, dnssec: true, active: true })',
  'const saving = ref(false)',
  'const baseline = ref(JSON.stringify(settings))',
  'const dirty = computed(() => JSON.stringify(settings) !== baseline.value)',
  'const nameMessageId = useId()',
  'const domainMessageId = useId()',
  'const nameserverMessageId = useId()',
  '',
  'const validate = () => {',
  "  errors.name = settings.name.trim() ? '' : 'This field is required.'",
  "  errors.domain = settings.domain.trim() ? '' : 'This field is required.'",
  '  return !errors.name && !errors.domain',
  '}',
  '',
  'const save = () => {',
  '  if (saving.value || !validate()) return',
  '  saving.value = true',
  '  setTimeout(() => {',
  '    baseline.value = JSON.stringify(settings)',
  '    saving.value = false',
  '  }, 900)',
  '}',
  '',
  'const discard = () => {',
  '  Object.assign(settings, JSON.parse(baseline.value))',
  "  errors.name = ''",
  "  errors.domain = ''",
  '}',
  '',
  'const copyLink = (id) =>',
  '  globalThis.navigator?.clipboard?.writeText(`${location.origin}${location.pathname}#${id}`)'
]

const useZoneSettings = () => {
  const zone = { name: 'test', domain: 'edgeflow.com' }
  const errors = reactive({ name: '', domain: '' })
  const settings = reactive({ name: zone.name, domain: zone.domain, dnssec: true, active: true })
  const saving = ref(false)
  const baseline = ref(JSON.stringify(settings))
  const dirty = computed(() => JSON.stringify(settings) !== baseline.value)
  const validate = () => {
    errors.name = settings.name.trim() ? '' : 'This field is required.'
    errors.domain = settings.domain.trim() ? '' : 'This field is required.'
    return !errors.name && !errors.domain
  }
  const save = () => {
    if (saving.value || !validate()) return
    saving.value = true
    setTimeout(() => {
      baseline.value = JSON.stringify(settings)
      saving.value = false
    }, 900)
  }
  const discard = () => {
    Object.assign(settings, JSON.parse(baseline.value))
    errors.name = ''
    errors.domain = ''
  }
  const copyLink = (id) =>
    globalThis.navigator?.clipboard?.writeText(`${location.origin}${location.pathname}#${id}`)
  return {
    tabs: TABS,
    nameservers: NAMESERVERS,
    dnssecKeys: DNSSEC_KEYS,
    errors,
    settings,
    saving,
    dirty,
    nameMessageId: useId(),
    domainMessageId: useId(),
    nameserverMessageId: useId(),
    save,
    discard,
    copyLink
  }
}

const script = (tab) => [
  ...mergeImports(LIST_COMPONENT_IMPORTS, [
    "import HelperText from '@aziontech/webkit/helper-text'",
    "import Hint from '@aziontech/webkit/hint'",
    "import InputGroupRoot from '@aziontech/webkit/input-group-root'",
    "import ItemActions from '@aziontech/webkit/item-actions'",
    "import ItemContent from '@aziontech/webkit/item-content'",
    "import ItemDescription from '@aziontech/webkit/item-description'",
    "import ItemList from '@aziontech/webkit/item-list'",
    "import ItemRoot from '@aziontech/webkit/item-root'",
    "import ItemTitle from '@aziontech/webkit/item-title'",
    "import TabView from '@aziontech/webkit/tab-view'"
  ]),
  "import { computed, nextTick, reactive, ref, useId, watch } from 'vue'",
  '',
  `const activeTab = ref('${tab}')`,
  '',
  ...SETTINGS_SCRIPT,
  '',
  ...FIELDS_SCRIPT,
  '',
  constLine('columns', RECORD_COLUMNS),
  '',
  constLine('rows', RECORDS),
  '',
  ...listStateScript({}, 8)
]

const setupWith = (tab) => () => ({
  activeTab: ref(tab),
  policyLabel: (value) => POLICY_TYPES.find((policy) => policy.value === value)?.label ?? '',
  ...useZoneSettings(),
  ...useListPage({ fields: RECORD_FIELDS, rows: RECORDS, columns: RECORD_COLUMNS, pageSize: 8 })
})

const meta = {
  title: 'Templates/Platform/Detail/EdgeDnsZone',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'An Edge DNS zone, opened from the Edge DNS index: a full-bleed tab bar with Main Settings and Records over a scrolling tab panel. Main Settings is a settings form in the form column: four stacked sections (General, Configure your nameserver, DNSSEC, Status), each an anchored heading with a `Hint` over a flush `CardBox` of `Item` rows. Name and Domain Name are required `InputText`s that show a required `HelperText` only after a failed save; the three nameservers and, while DNSSEC is on, the key tag, algorithm, digest type and digest are read-only code `InputText`s in an `InputGroup` with a transparent `CopyButton`; DNSSEC and Active are `Switch`es; editing anything raises the save bar at the bottom. Records is a small-heading list inside the tab (Documentation and Add Record actions) with the ListControls row (Type and Policy filters) and a records table: the value cell pins a copy button, Weight and Description fall back to an em dash, and the row menu carries Edit and Delete. Built from `TabView`, `CardBox`, `Item`, `InputText`, `InputGroup`, `CopyButton`, `Switch`, `HelperText`, `Hint`, `Button` and the ListControls and ResourceTable recipes.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const MainSettings = {
  render: () => ({ components, setup: setupWith('main-settings'), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The zone test on edgeflow.com with DNSSEC on: clear a required field and Save to see the required message, or turn DNSSEC off to drop the four key rows.'
      },
      source: { code: toSfc(script('main-settings'), TEMPLATE) }
    }
  }
}

export const Records = {
  render: () => ({ components, setup: setupWith('records'), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'The Records tab with the zone’s one A record, the ID column hidden by default.'
      },
      source: { code: toSfc(script('records'), TEMPLATE) }
    }
  }
}
