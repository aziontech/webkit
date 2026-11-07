import Avatar from '@aziontech/webkit/avatar'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import Checkbox from '@aziontech/webkit/checkbox'
import CopyButton from '@aziontech/webkit/copy-button'
import Currency from '@aziontech/webkit/currency'
import Dropdown from '@aziontech/webkit/dropdown'
import IconButton from '@aziontech/webkit/icon-button'
import Message from '@aziontech/webkit/message'
import Popover from '@aziontech/webkit/popover'
import TabView from '@aziontech/webkit/tab-view'
import Table from '@aziontech/webkit/table'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import { compound, declare, pageHeading, VUE_IMPORT, webkitImport } from './_account-markup'

const ACCOUNTS = [
  { id: 1, name: 'Azion', type: 'organization', parentId: null, labels: ['primary'] },
  { id: 812, name: 'Nebula Partners', type: 'organization', parentId: null },
  { id: 9032, name: 'Retail & Marketplace', type: 'group', parentId: 1 },
  { id: 9088, name: 'Digital Commerce', type: 'group', parentId: 1 },
  { id: 9140, name: 'Enterprise Accounts', type: 'group', parentId: 1 },
  {
    id: 6,
    name: 'Magalu',
    type: 'workspace',
    parentId: 9032,
    lastAccessed: '2 hours ago',
    status: 'active',
    charges: '1,284.00',
    labels: ['retail', 'prod']
  },
  {
    id: 33024,
    name: 'Madeira Madeira',
    type: 'workspace',
    parentId: 9032,
    lastAccessed: 'Yesterday',
    status: 'active',
    charges: '612.40'
  },
  {
    id: 29025,
    name: 'Tray',
    type: 'workspace',
    parentId: 9088,
    lastAccessed: '3 days ago',
    status: 'active',
    charges: '42.10'
  },
  { id: 5791, name: 'LWSA', type: 'workspace', parentId: 9088, status: 'active' },
  {
    id: 31204,
    name: 'iFood',
    type: 'workspace',
    parentId: 9140,
    lastAccessed: '1 week ago',
    status: 'active',
    labels: ['delivery']
  },
  {
    id: 28836,
    name: 'Caixa Econômica Federal',
    type: 'workspace',
    parentId: 9140,
    lastAccessed: '1 month ago',
    status: 'active',
    charges: '3,910.75'
  },
  { id: 21447, name: 'GPA', type: 'workspace', parentId: 9032, status: 'active' },
  { id: 18932, name: 'Renner', type: 'workspace', parentId: 9032, status: 'active' },
  { id: 40118, name: 'HeroSpark', type: 'workspace', parentId: 9088, status: 'active' },
  { id: 12903, name: 'Itaú', type: 'workspace', parentId: 9140, status: 'active' }
]

const ACCOUNT_TYPES = [
  {
    singular: 'organization',
    typeLabel: 'Organization',
    icon: 'pi pi-building',
    severity: 'accent'
  },
  { singular: 'group', typeLabel: 'Group', icon: 'pi pi-users', severity: 'info' },
  { singular: 'workspace', typeLabel: 'Workspace', icon: 'pi pi-th-large', severity: 'secondary' }
]

const INFO_TABS = [
  { value: 'permissions', label: 'Permissions' },
  { value: 'labels', label: 'Labels' }
]

const ROLE_BINDINGS = [
  { role: 'Owner', members: 2 },
  { role: 'Editor', members: 5 },
  { role: 'Viewer', members: 11 }
]

const STATUS_SEVERITY = { active: 'success', suspended: 'danger', pending: 'warning' }

const accountTypeOf = (type) =>
  ACCOUNT_TYPES.find((entry) => entry.singular === type) ?? ACCOUNT_TYPES[2]

const accountInitials = (name) => {
  const words = String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter((word) => /^[\p{L}\p{N}]/u.test(word))
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase()
  return (words[0] ?? '').slice(0, 2).toUpperCase()
}

const treeRows = (list, expandedIds) => {
  const childrenOf = new Map()
  for (const account of list) {
    const parent = account.parentId ?? null
    if (!childrenOf.has(parent)) childrenOf.set(parent, [])
    childrenOf.get(parent).push(account)
  }
  const walk = (parentId, depth) => {
    const out = []
    for (const account of childrenOf.get(parentId) ?? []) {
      const expanded = expandedIds.has(account.id)
      out.push({
        ...account,
        depth,
        hasChildren: (childrenOf.get(account.id) ?? []).length > 0,
        typeLabel: accountTypeOf(account.type).typeLabel
      })
      if (expanded) out.push(...walk(account.id, depth + 1))
    }
    return out
  }
  return walk(null, 0)
}

const REVEAL_SCRIPT = [
  'const reducedMotion = () =>',
  "  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches",
  'const animateRowHeight = (el, done, reverse) => {',
  '  if (reducedMotion()) return done()',
  '  const frames = [',
  "    { height: '0px', opacity: 0 },",
  "    { height: el.offsetHeight + 'px', opacity: 1 }",
  '  ]',
  "  el.style.overflow = 'hidden'",
  '  const animation = el.animate(reverse ? [...frames].reverse() : frames, {',
  '    duration: 220,',
  "    easing: 'cubic-bezier(0.39, 0.57, 0.56, 1)'",
  '  })',
  '  animation.onfinish = () => {',
  "    el.style.overflow = ''",
  '    done()',
  '  }',
  '}',
  'const onRowEnter = (el, done) => animateRowHeight(el, done, false)',
  'const onRowLeave = (el, done) => animateRowHeight(el, done, true)'
]

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const animateRowHeight = (el, done, reverse) => {
  if (reducedMotion()) return done()
  const frames = [
    { height: '0px', opacity: 0 },
    { height: `${el.offsetHeight}px`, opacity: 1 }
  ]
  el.style.overflow = 'hidden'
  const animation = el.animate(reverse ? [...frames].reverse() : frames, {
    duration: 220,
    easing: 'cubic-bezier(0.39, 0.57, 0.56, 1)'
  })
  animation.onfinish = () => {
    el.style.overflow = ''
    done()
  }
}

const HEADING_ACTIONS = `<Tooltip text="Refresh">
  <IconButton icon="pi pi-refresh" kind="outlined" size="large" aria-label="Refresh resources" />
</Tooltip>
<Button
  :label="infoPanelOpen ? 'Hide info panel' : 'Show info panel'"
  :icon="infoPanelOpen ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left'"
  kind="text"
  size="large"
  @click="infoPanelOpen = !infoPanelOpen"
/>`

const TOOLBAR = `<div class="layout-section-start flex flex-wrap items-center gap-(--spacing-xs)">
  <Button label="Create Project" icon="pi pi-plus" kind="primary" size="medium" />
  <Button label="Create Folder" icon="pi pi-folder" kind="outlined" size="medium" />
  <div class="mx-(--spacing-xs) h-(--size-5) w-px bg-(--border-muted)" role="separator" aria-orientation="vertical" />
  <Button label="Move" icon="pi pi-arrow-right-arrow-left" kind="outlined" size="medium" :disabled="!hasSelection" />
  <Button label="Delete" icon="pi pi-trash" kind="outlined" size="medium" :disabled="!hasSelection" />
  <Button label="Tags" icon="pi pi-tag" kind="outlined" size="medium" :disabled="!hasSelection" />
</div>`

const NAME_CELL = `<Table.Cell principal :style="nameColumnStyle">
  <span class="flex min-w-0 items-center gap-(--spacing-xxs)" :style="{ paddingLeft: 'calc(var(--spacing-md) * ' + row.depth + ')' }">
    <Tooltip v-if="row.hasChildren" :text="isExpanded(row.id) ? 'Collapse' : 'Expand'">
      <IconButton
        :icon="isExpanded(row.id) ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
        kind="outlined"
        size="small"
        :aria-label="isExpanded(row.id) ? 'Collapse' : 'Expand'"
        :aria-expanded="isExpanded(row.id)"
        @click.stop="toggle(row.id)"
      />
    </Tooltip>
    <span v-else class="size-(--size-7) shrink-0" aria-hidden="true" />
    <Avatar
      v-if="row.type === 'group' || row.type === 'workspace'"
      :label="accountInitials(row.name)"
      size="small"
      kind="square"
    />
    <i v-else :class="accountTypeOf(row.type).icon" class="shrink-0 text-body-sm text-(--text-muted)" aria-hidden="true" />
    <span class="truncate text-label-sm text-(--text-default)">
      {{ row.name }}
    </span>
    <i v-if="row.id === currentAccountId" class="pi pi-check shrink-0 text-body-xs text-(--text-muted)" aria-hidden="true" />
  </span>
</Table.Cell>`

const ID_CELL = `<Table.Cell :grow="1">
  <span v-if="row.type === 'organization'" class="text-body-sm text-(--text-muted)">—</span>
  <div v-else class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <span class="min-w-0 flex-1 truncate tabular-nums">{{ row.id }}</span>
    <CopyButton kind="outlined" :value="String(row.id)" :aria-label="'Copy ' + row.typeLabel.toLowerCase() + ' ID'" />
  </div>
</Table.Cell>`

const LABELS_CELL = `<Table.Cell :style="labelsColumnStyle">
  <span v-if="!row.labels?.length" class="text-body-sm text-(--text-muted)">—</span>
  <span v-else class="relative flex w-full min-w-0 items-center gap-(--spacing-xs)">
    <i class="pi pi-tag shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
    <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
      <Tag severity="secondary" size="medium" rounded class="min-w-0 max-w-full">
        <span class="min-w-0 truncate">{{ row.labels[0] }}</span>
      </Tag>
    </span>
    <Popover v-if="row.labels.length > 1" placement="bottom-start" width="small">
      <Popover.Trigger @click.stop>
        <Tooltip :text="'Show all ' + row.labels.length + ' labels'">
          <Tag
            :label="'+' + (row.labels.length - 1)"
            :aria-label="'Show all ' + row.labels.length + ' labels'"
            severity="secondary"
            size="small"
            class="shrink-0 cursor-pointer"
          />
        </Tooltip>
      </Popover.Trigger>
      <Popover.Content @click.stop>
        <div class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)">
          <p class="text-label-sm text-(--text-muted)">
            {{ row.labels.length }} labels
          </p>
        </div>
        <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
          <span
            v-for="(item, index) in row.labels"
            :key="index"
            class="block truncate rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
          >{{ item }}</span>
        </div>
      </Popover.Content>
    </Popover>
  </span>
</Table.Cell>`

const ACTIONS_CELL = `<Table.Cell kind="action">
  <span @click.stop>
    <Dropdown placement="bottom-end" @select="(event, value) => onRowAction(event, value, row)">
      <Dropdown.Trigger>
        <Tooltip text="Resource actions">
          <IconButton icon="pi pi-ellipsis-v" kind="outlined" size="small" aria-label="Resource actions" />
        </Tooltip>
      </Dropdown.Trigger>
      <Dropdown.Group>
        <Dropdown.Option value="view" label="View details" />
        <Dropdown.Option v-if="row.hasChildren" value="expand" :label="isExpanded(row.id) ? 'Collapse' : 'Expand'" />
      </Dropdown.Group>
      <Dropdown.Group>
        <Dropdown.Option value="move" label="Move" />
        <Dropdown.Option value="delete" label="Delete" />
      </Dropdown.Group>
    </Dropdown>
  </span>
</Table.Cell>`

const RESOURCES_TABLE = `<CardBox :padded="false">
  <template #content>
    <Table max-height="calc(100dvh - 20rem)" :border="false">
      <Table.Header frozen>
        <Table.Row>
          <Table.HeadCell kind="checkbox">
            <Checkbox
              binary
              :model-value="allVisibleSelected"
              :indeterminate="someVisibleSelected"
              aria-label="Select all resources"
              @update:model-value="toggleSelectAll"
            />
          </Table.HeadCell>
          <Table.HeadCell principal :style="nameColumnStyle">Name</Table.HeadCell>
          <Table.HeadCell :grow="1">ID</Table.HeadCell>
          <Table.HeadCell :style="tagColumnWideStyle">Type</Table.HeadCell>
          <Table.HeadCell :grow="1">Last accessed</Table.HeadCell>
          <Table.HeadCell :style="tagColumnStyle">Status</Table.HeadCell>
          <Table.HeadCell :grow="1" align="end">
            <span class="inline-flex items-center gap-(--spacing-xxs)">
              Charges
              <Tooltip text="Estimated month-to-date charges.">
                <i class="pi pi-question-circle text-body-xs text-(--text-muted)" aria-hidden="true" />
              </Tooltip>
            </span>
          </Table.HeadCell>
          <Table.HeadCell :style="labelsColumnStyle">Labels</Table.HeadCell>
          <Table.HeadCell kind="action" />
        </Table.Row>
      </Table.Header>

      <Table.Body>
        <TransitionGroup :css="false" @enter="onRowEnter" @leave="onRowLeave">
          <div v-for="row in visibleRows" :key="row.id">
            <Table.Row :selected="!!rowSelection[String(row.id)]" class="cursor-pointer" @click="toggleRow(row)">
              <Table.Cell kind="checkbox">
                <Checkbox
                  binary
                  :model-value="!!rowSelection[String(row.id)]"
                  :aria-label="'Select ' + row.name"
                  @click.stop
                  @update:model-value="(value) => setRowSelected(row, value)"
                />
              </Table.Cell>

${indent(NAME_CELL, 7)}

${indent(ID_CELL, 7)}

              <Table.Cell :style="tagColumnWideStyle">
                <Tag
                  :label="row.typeLabel"
                  :icon="accountTypeOf(row.type).icon"
                  :severity="accountTypeOf(row.type).severity"
                  size="small"
                />
              </Table.Cell>

              <Table.Cell :grow="1">
                <span class="text-body-sm text-(--text-muted)">
                  {{ row.lastAccessed || '—' }}
                </span>
              </Table.Cell>

              <Table.Cell :style="tagColumnStyle">
                <Tag
                  v-if="row.status"
                  :label="row.status[0].toUpperCase() + row.status.slice(1)"
                  :severity="statusSeverity[row.status] ?? 'secondary'"
                  size="medium"
                />
                <span v-else class="text-body-sm text-(--text-muted)">—</span>
              </Table.Cell>

              <Table.Cell :grow="1" align="end">
                <Currency v-if="row.charges" :value="row.charges" size="small" />
                <span v-else class="text-body-sm text-(--text-muted)">—</span>
              </Table.Cell>

${indent(LABELS_CELL, 7)}

${indent(ACTIONS_CELL, 7)}
            </Table.Row>
          </div>
        </TransitionGroup>
      </Table.Body>
    </Table>
  </template>
</CardBox>`

const INFO_PANEL = `<aside v-if="infoPanelOpen" class="hidden w-(--container-xs) shrink-0 lg:block" aria-label="Resource details">
  <CardBox>
    <template #content>
      <div class="flex flex-col gap-(--spacing-md)">
        <h2 class="text-heading-xs text-(--text-default)">{{ selectionTitle }}</h2>

        <TabView v-model:value="infoTab">
          <TabView.List>
            <TabView.Item v-for="tab in infoTabs" :key="tab.value" :value="tab.value" :label="tab.label" />
          </TabView.List>
        </TabView>

        <Message v-if="!hasSelection" severity="info" label="Select at least one resource." />

        <template v-else-if="infoTab === 'permissions'">
          <div v-if="focused" class="flex flex-col gap-(--spacing-md)">
            <div class="flex items-center gap-(--spacing-xs)">
              <Tag
                :label="focused.typeLabel ?? accountTypeOf(focused.type).typeLabel"
                :icon="accountTypeOf(focused.type).icon"
                :severity="accountTypeOf(focused.type).severity"
                size="small"
              />
              <span class="truncate text-label-md text-(--text-default)">
                {{ focused.name }}
              </span>
            </div>
            <ul class="flex flex-col gap-(--spacing-xs)">
              <li
                v-for="binding in roleBindings"
                :key="binding.role"
                class="flex items-center justify-between rounded-(--shape-elements) bg-(--bg-surface-raised) px-(--spacing-sm) py-(--spacing-xs)"
              >
                <span class="text-label-sm text-(--text-default)">{{ binding.role }}</span>
                <span class="text-body-xs text-(--text-muted)">
                  {{ binding.members }} member{{ binding.members === 1 ? '' : 's' }}
                </span>
              </li>
            </ul>
          </div>
          <Message v-else severity="info" label="Select a single resource to view its role bindings." />
        </template>

        <template v-else>
          <div v-if="focused && focused.labels?.length" class="flex flex-wrap gap-(--spacing-xs)">
            <Tag v-for="label in focused.labels" :key="label" :label="label" severity="secondary" size="medium" />
          </div>
          <Message v-else-if="focused" severity="info" label="This resource has no labels." />
          <Message v-else severity="info" label="Select a single resource to view its labels." />
        </template>
      </div>
    </template>
  </CardBox>
</aside>`

const TEMPLATE = `<div class="flex h-screen flex-col bg-(--bg-canvas)">
  <div class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto layout-boundary">
    <main class="flex h-full min-h-0 flex-col">
${indent(
  pageHeading({
    title: 'Manage Resources',
    description: 'Organize accounts into a hierarchy of brands, resellers, groups, and clients.',
    documentation: 'https://www.azion.com/en/documentation/',
    actions: HEADING_ACTIONS
  }),
  3
)}

${indent(TOOLBAR, 3)}

      <div class="layout-group-start flex min-h-0 flex-1 gap-(--spacing-lg)">
        <section class="flex min-w-0 flex-1 flex-col gap-(--spacing-sm)">
          <div class="flex items-center justify-between">
            <h2 class="text-heading-xs text-(--text-default)">Resources</h2>
            <Button v-if="hasSelection" label="Clear selection" kind="text" size="small" @click="rowSelection = {}" />
          </div>

${indent(RESOURCES_TABLE, 5)}

          <button
            type="button"
            class="self-start text-label-sm text-(--text-link) transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
          >
            Resources pending deletion
          </button>
        </section>

${indent(INFO_PANEL, 4)}
      </div>
    </main>
  </div>
</div>`

const IMPORTS = [
  webkitImport('Avatar', 'avatar'),
  webkitImport('Button', 'button'),
  webkitImport('CardBox', 'card-box'),
  webkitImport('Checkbox', 'checkbox'),
  webkitImport('CopyButton', 'copy-button'),
  webkitImport('Currency', 'currency'),
  webkitImport('Dropdown', 'dropdown'),
  webkitImport('IconButton', 'icon-button'),
  webkitImport('Message', 'message'),
  webkitImport('Popover', 'popover'),
  webkitImport('TabView', 'tab-view'),
  webkitImport('Table', 'table'),
  webkitImport('Tag', 'tag'),
  webkitImport('Tooltip', 'tooltip'),
  VUE_IMPORT(['computed', 'ref']),
  '',
  declare('accounts', ACCOUNTS),
  declare('accountTypes', ACCOUNT_TYPES),
  declare('infoTabs', INFO_TABS),
  declare('roleBindings', ROLE_BINDINGS),
  declare('statusSeverity', STATUS_SEVERITY),
  'const currentAccountId = 28836',
  '',
  "const tagColumnStyle = { flex: '0 0 104px' }",
  "const tagColumnWideStyle = { flex: '0 0 136px' }",
  "const labelsColumnStyle = { flex: '0 0 112px' }",
  "const nameColumnStyle = { flex: '4 1 0' }",
  '',
  'const accountTypeOf = (type) =>',
  '  accountTypes.find((entry) => entry.singular === type) ?? accountTypes[2]',
  '',
  `const accountInitials = ${accountInitials}`,
  '',
  'const treeRows = (list, expandedIds) => {',
  '  const childrenOf = new Map()',
  '  for (const account of list) {',
  '    const parent = account.parentId ?? null',
  '    if (!childrenOf.has(parent)) childrenOf.set(parent, [])',
  '    childrenOf.get(parent).push(account)',
  '  }',
  '  const walk = (parentId, depth) => {',
  '    const out = []',
  '    for (const account of childrenOf.get(parentId) ?? []) {',
  '      const expanded = expandedIds.has(account.id)',
  '      out.push({',
  '        ...account,',
  '        depth,',
  '        hasChildren: (childrenOf.get(account.id) ?? []).length > 0,',
  '        typeLabel: accountTypeOf(account.type).typeLabel',
  '      })',
  '      if (expanded) out.push(...walk(account.id, depth + 1))',
  '    }',
  '    return out',
  '  }',
  '  return walk(null, 0)',
  '}',
  '',
  'const expanded = ref(new Set([0, 1, 4471, 9032]))',
  'const isExpanded = (id) => expanded.value.has(id)',
  'const toggle = (id) => {',
  '  const next = new Set(expanded.value)',
  '  if (next.has(id)) next.delete(id)',
  '  else next.add(id)',
  '  expanded.value = next',
  '}',
  'const visibleRows = computed(() => treeRows(accounts, expanded.value))',
  '',
  ...REVEAL_SCRIPT,
  '',
  'const rowSelection = ref({})',
  'const selectedRows = computed(() =>',
  '  accounts.filter((account) => rowSelection.value[String(account.id)])',
  ')',
  'const selectedCount = computed(() => selectedRows.value.length)',
  'const hasSelection = computed(() => selectedCount.value > 0)',
  'const setRowSelected = (row, selected) => {',
  '  const next = { ...rowSelection.value }',
  '  if (selected) next[String(row.id)] = true',
  '  else delete next[String(row.id)]',
  '  rowSelection.value = next',
  '}',
  'const toggleRow = (row) => setRowSelected(row, !rowSelection.value[String(row.id)])',
  'const allVisibleSelected = computed(',
  '  () =>',
  '    visibleRows.value.length > 0 &&',
  '    visibleRows.value.every((row) => rowSelection.value[String(row.id)])',
  ')',
  'const someVisibleSelected = computed(',
  '  () =>',
  '    !allVisibleSelected.value &&',
  '    visibleRows.value.some((row) => rowSelection.value[String(row.id)])',
  ')',
  'const toggleSelectAll = (selected) => {',
  '  const next = {}',
  '  if (selected) visibleRows.value.forEach((row) => (next[String(row.id)] = true))',
  '  rowSelection.value = next',
  '}',
  '',
  'const onRowAction = (event, value, row) => {',
  "  if (value === 'expand') toggle(row.id)",
  '}',
  '',
  'const infoPanelOpen = ref(true)',
  "const infoTab = ref('permissions')",
  'const selectionTitle = computed(() =>',
  '  selectedCount.value === 0',
  "    ? 'No resource selected'",
  "    : selectedCount.value + ' resource' + (selectedCount.value === 1 ? '' : 's') + ' selected'",
  ')',
  'const focused = computed(() => (selectedCount.value === 1 ? selectedRows.value[0] : null))'
]

const useManageResources = () => {
  const expanded = ref(new Set([0, 1, 4471, 9032]))
  const isExpanded = (id) => expanded.value.has(id)
  const toggle = (id) => {
    const next = new Set(expanded.value)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    expanded.value = next
  }
  const visibleRows = computed(() => treeRows(ACCOUNTS, expanded.value))
  const rowSelection = ref({})
  const selectedRows = computed(() =>
    ACCOUNTS.filter((account) => rowSelection.value[String(account.id)])
  )
  const selectedCount = computed(() => selectedRows.value.length)
  const hasSelection = computed(() => selectedCount.value > 0)
  const setRowSelected = (row, selected) => {
    const next = { ...rowSelection.value }
    if (selected) next[String(row.id)] = true
    else delete next[String(row.id)]
    rowSelection.value = next
  }
  const toggleRow = (row) => setRowSelected(row, !rowSelection.value[String(row.id)])
  const allVisibleSelected = computed(
    () =>
      visibleRows.value.length > 0 &&
      visibleRows.value.every((row) => rowSelection.value[String(row.id)])
  )
  const someVisibleSelected = computed(
    () =>
      !allVisibleSelected.value &&
      visibleRows.value.some((row) => rowSelection.value[String(row.id)])
  )
  const toggleSelectAll = (selected) => {
    const next = {}
    if (selected) visibleRows.value.forEach((row) => (next[String(row.id)] = true))
    rowSelection.value = next
  }
  const onRowAction = (event, value, row) => {
    if (value === 'expand') toggle(row.id)
  }
  const selectionTitle = computed(() =>
    selectedCount.value === 0
      ? 'No resource selected'
      : `${selectedCount.value} resource${selectedCount.value === 1 ? '' : 's'} selected`
  )
  const focused = computed(() => (selectedCount.value === 1 ? selectedRows.value[0] : null))
  return {
    infoTabs: INFO_TABS,
    roleBindings: ROLE_BINDINGS,
    statusSeverity: STATUS_SEVERITY,
    currentAccountId: 28836,
    tagColumnStyle: { flex: '0 0 104px' },
    tagColumnWideStyle: { flex: '0 0 136px' },
    labelsColumnStyle: { flex: '0 0 112px' },
    nameColumnStyle: { flex: '4 1 0' },
    accountTypeOf,
    accountInitials,
    isExpanded,
    toggle,
    visibleRows,
    onRowEnter: (el, done) => animateRowHeight(el, done, false),
    onRowLeave: (el, done) => animateRowHeight(el, done, true),
    rowSelection,
    hasSelection,
    setRowSelected,
    toggleRow,
    allVisibleSelected,
    someVisibleSelected,
    toggleSelectAll,
    onRowAction,
    infoPanelOpen: ref(true),
    infoTab: ref('permissions'),
    selectionTitle,
    focused
  }
}

const components = {
  Avatar,
  Button,
  CardBox,
  Checkbox,
  CopyButton,
  Currency,
  ...compound('Dropdown', Dropdown, ['Trigger', 'Group', 'Option']),
  IconButton,
  Message,
  ...compound('Popover', Popover, ['Trigger', 'Content']),
  ...compound('TabView', TabView, ['List', 'Item']),
  ...compound('Table', Table, ['Header', 'Body', 'Row', 'HeadCell', 'Cell']),
  Tag,
  Tooltip
}

const meta = {
  title: 'Templates/Platform/Account/ManageResources',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The Manage Resources page (`/resources`), as the console renders it inside the padded app shell: a page heading with Documentation, Refresh and the Hide or Show info panel toggle, a toolbar with Create Project, Create Folder and the selection-gated Move, Delete and Tags, then the Resources tree table beside the Resource details info panel. The table is the composed `Table` with a frozen header, a select-all `Checkbox`, and one row per organization, group or workspace, indented by depth with an expand toggle, an initials `Avatar` or type glyph, a copyable ID, type and status tags, month-to-date `Currency` charges, labels and a row menu; rows grow and shrink in height as a branch opens or closes. The info panel switches between Permissions and Labels for a single selected resource. Built from `Table`, `CardBox`, `Checkbox`, `IconButton`, `Tooltip`, `Avatar`, `CopyButton`, `Tag`, `Currency`, `Popover`, `Dropdown`, `TabView`, `Message` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const ManageResources = {
  render: () => ({
    components,
    setup: useManageResources,
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Azion and Retail & Marketplace expanded as the sample opens them, nothing selected, and the info panel asking for a selection; select a single workspace to see its role bindings or labels.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}
