<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import type { SidebarMenuGroupNode, SidebarMenuNode } from '@aziontech/webkit/sidebar-menu'
  import SidebarMenuRoot from '@aziontech/webkit/sidebar-menu-root'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellLink from '@aziontech/webkit/table-cell-link'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tabs from '@aziontech/webkit/tabs'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  import { sampleEntriesFor, samplePage, sampleSections } from './sample'

  /** Status of one entry of a sibling page. */
  export type SectionedResourceEntryStatus = 'Active' | 'Inactive'

  /** One row of the current sibling page. */
  export interface SectionedResourceEntry {
    /** Entry id, shown in the ID column. */
    id: string
    /** Entry name, the link to the entry. */
    name: string
    /** Whether the entry is in effect. */
    status: SectionedResourceEntryStatus
    /** Who changed it last. */
    owner: string
    /** When it changed last. */
    modifiedAt: Date
  }

  /** One sibling page of the open tab. */
  export interface SectionedResourceSibling {
    /** Route segment of the page, also its model value. */
    id: string
    /** Page name, plural, in sentence case. */
    label: string
    /** Noun of one entry, used in Add. */
    noun: string
  }

  /** A named group of sibling pages. */
  export interface SectionedResourceSection {
    /** Group label in the menu and the folded Select. */
    label: string
    /** The pages of the group. */
    items: SectionedResourceSibling[]
  }

  export interface SectionedResourceProps {
    /** The sibling pages of the open tab, in groups; 7 or fewer switch with a ToggleGroup. Left out, the sample renders. */
    sections?: SectionedResourceSection[]
    /** Entries of the current sibling page. Left out, the sample renders. */
    entries?: SectionedResourceEntry[]
    /** A request for the entries is in flight. */
    loading?: boolean
    /** Value of the tab this block renders the page of. */
    currentTab?: string
    /** Route of the resource; tabs and sibling pages hang under it. */
    basePath?: string
    /** How the heading names the resource, e.g. the acme-default policy. */
    resourceLabel?: string
  }

  const props = withDefaults(defineProps<SectionedResourceProps>(), {
    sections: undefined,
    entries: undefined,
    loading: false,
    currentTab: 'private-access',
    basePath: '/policies/acme-default',
    resourceLabel: 'the acme-default policy'
  })

  const emit = defineEmits<{
    /** Refresh was pressed. */
    refresh: [event: MouseEvent]
    /** Add in the heading or the empty page was pressed. */
    add: [event: MouseEvent, sibling: SectionedResourceSibling]
  }>()

  const page = defineModel<string>('page', { default: '' })

  const tabs = [
    { value: 'web-security', label: 'Web security' },
    { value: 'network-security', label: 'Network security' },
    { value: 'private-access', label: 'Private access' },
    { value: 'data-protection', label: 'Data protection' },
    { value: 'objects', label: 'Objects' },
    { value: 'settings', label: 'Settings' },
    { value: 'versions', label: 'Versions' }
  ]

  const activeTab = ref(props.currentTab)
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const sections = computed(() => props.sections ?? sampleSections)
  const siblings = computed(() => sections.value.flatMap((section) => section.items))
  const few = computed(() => siblings.value.length <= 7)

  const base = computed(() => `${props.basePath}/${props.currentTab}`)
  const hrefOf = (sibling: SectionedResourceSibling) => `${base.value}/${sibling.id}`

  const groups = computed<SidebarMenuGroupNode[]>(() =>
    sections.value.map((section) => ({
      label: section.label,
      items: section.items.map((sibling) => ({
        id: sibling.id,
        label: sibling.label,
        href: hrefOf(sibling)
      }))
    }))
  )

  const options = computed(() =>
    siblings.value.map((sibling) => ({ label: sibling.label, value: sibling.id }))
  )

  const pageId = computed(
    () => page.value || (props.sections ? (siblings.value[0]?.id ?? '') : samplePage)
  )
  const routePath = computed(() => `${base.value}/${pageId.value}`)

  const match = computed(() => siblings.value.find((sibling) => sibling.id === pageId.value))
  const current = computed(
    () => match.value ?? siblings.value[0] ?? { id: '', label: '', noun: '' }
  )

  const owners = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

  const entries = computed<SectionedResourceEntry[]>(
    () => props.entries ?? (props.loading ? [] : sampleEntriesFor(current.value))
  )

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] },
    { key: 'owner', label: 'Author', options: owners.map((owner) => ({ value: owner })) }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 104 },
    { accessorKey: 'modifiedAt', header: 'Last Modified', sortable: true, minWidth: 80 }
  ]

  const {
    tableProps,
    propertyFilterProps,
    status,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: () => entries.value,
    columns,
    filtering: { fields: ['name', 'id', 'status', 'owner'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10 }
  })

  const go = (id: string) => {
    if (id === pageId.value) return
    page.value = id
    clearFilters()
  }

  const navigate = (event: MouseEvent, node: SidebarMenuNode) => {
    if (!node.href || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    const sibling = siblings.value.find((item) => hrefOf(item) === node.href)
    if (sibling) go(sibling.id)
  }

  const pick = (value: string | undefined) => {
    if (value) go(value)
  }

  const labelOf = (value: string | undefined) =>
    siblings.value.find((sibling) => sibling.id === value)?.label ?? ''
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <section
      v-if="activeTab === currentTab"
      class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1"
    >
      <div class="layout-column layout-boundary @container/tab flex min-w-0 flex-col">
        <div
          :data-nav="few ? 'toggle' : 'menu'"
          class="flex min-w-0 flex-col gap-(--layout-group-gap) data-[nav=menu]:@3xl/tab:flex-row data-[nav=menu]:@3xl/tab:items-start data-[nav=menu]:@3xl/tab:gap-(--layout-section-gap)"
        >
          <div
            v-if="few"
            class="flex min-w-0"
          >
            <ToggleGroup
              :model-value="pageId"
              :options="options"
              size="medium"
              :aria-label="tabLabel"
              @update:model-value="pick"
            />
          </div>

          <div
            v-if="!few"
            class="hidden w-(--container-3xs) shrink-0 @3xl/tab:block"
          >
            <SidebarMenuRoot
              :groups="groups"
              :active-id="match?.id ?? ''"
              :aria-label="tabLabel"
              @navigate="navigate"
            />
          </div>

          <div
            v-if="!few"
            class="w-full max-w-(--layout-measure-control) @3xl/tab:hidden"
          >
            <Field>
              <Field.Label>{{ tabLabel }}</Field.Label>
              <Select
                :model-value="pageId"
                size="medium"
                :display-value="labelOf"
                @update:model-value="pick"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Group
                    v-for="section in sections"
                    :key="section.label"
                    :label="section.label"
                  >
                    <Select.Item
                      v-for="sibling in section.items"
                      :key="sibling.id"
                      :value="sibling.id"
                    >
                      {{ sibling.label }}
                    </Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select>
            </Field>
          </div>

          <div class="flex min-w-0 flex-1 flex-col">
            <PageHeader
              :title="current.label"
              :description="`${current.label} of ${resourceLabel}.`"
              size="small"
            >
              <template #actions>
                <Button
                  label="Documentation"
                  icon="ai ai-book"
                  variant="outline"
                  size="medium"
                  href="https://example.com/docs/private-access"
                  target="_blank"
                />
                <Button
                  :label="`Add ${current.noun}`"
                  icon="ai ai-plus"
                  variant="outline"
                  size="medium"
                  @click="emit('add', $event, current)"
                />
              </template>
            </PageHeader>
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-start gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow">
                  <PropertyFilter
                    v-bind="propertyFilterProps"
                    :placeholder="`Filter ${current.label.toLowerCase()}`"
                    :aria-label="`Filter ${current.label.toLowerCase()}`"
                  />
                </div>
                <Tooltip
                  content="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="ai ai-refresh"
                    variant="outline"
                    size="medium"
                    :loading="loading"
                    aria-label="Refresh"
                    @click="emit('refresh', $event)"
                  />
                </Tooltip>
              </header>
              <Card :padded="false">
                <template #default>
                  <DataTable
                    v-bind="tableProps"
                    :loading="loading || fetching"
                    sortable
                    :bordered="false"
                  >
                    <template #cell-name="{ row }">
                      <TableCellLink
                        :label="row.name"
                        :to="`${routePath}/${row.id}`"
                        :destination="current.label"
                      />
                    </template>
                    <template #cell-id="{ value }">
                      <TableCellId
                        :value="value"
                        :resource="current.noun.toLowerCase()"
                      />
                    </template>
                    <template #cell-status="{ value }">
                      <TableCellStatus
                        :label="value"
                        :severity="value === 'Active' ? 'success' : 'neutral'"
                      />
                    </template>
                    <template #cell-modifiedAt="{ row }">
                      <TableCellTime
                        :value="row.modifiedAt"
                        :author="row.owner"
                      />
                    </template>
                    <template #empty>
                      <EmptyState
                        key="empty-state-1"
                        v-if="status !== 'no-match'"
                        size="medium"
                        icon="ai ai-inbox"
                        :title="`No ${current.label.toLowerCase()} yet`"
                        :description="`Add the first ${current.noun.toLowerCase()} to this policy.`"
                      >
                        <template #actions>
                          <Button
                            :label="`Add ${current.noun}`"
                            icon="ai ai-plus"
                            variant="secondary"
                            size="small"
                            @click="emit('add', $event, current)"
                          />
                        </template>
                      </EmptyState>
                      <EmptyState
                        key="empty-state-2"
                        v-else
                        size="medium"
                        icon="ai ai-filter-off"
                        :title="`No matching ${current.label.toLowerCase()}`"
                        description="Nothing matches these filters."
                      >
                        <template #actions>
                          <Button
                            label="Clear filters"
                            variant="outline"
                            size="small"
                            @click="clearFilters"
                          />
                        </template>
                      </EmptyState>
                    </template>
                  </DataTable>
                </template>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </section>
    <section
      v-else
      class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1"
    >
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="layout-section-start">
          <EmptyState
            size="medium"
            icon="ai ai-external-link"
            :title="tabLabel"
            :description="`${tabLabel} opens on its own page of ${resourceLabel}.`"
          >
            <template #actions>
              <Button
                :label="`Open ${tabLabel}`"
                variant="outline"
                size="small"
                :href="`${basePath}/${activeTab}`"
              />
            </template>
          </EmptyState>
        </div>
      </div>
    </section>
  </div>
</template>
