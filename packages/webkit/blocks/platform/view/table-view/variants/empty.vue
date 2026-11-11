<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Skeleton from '@aziontech/webkit/skeleton'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { ref } from 'vue'

  const avatars = {
    'Robson Junior': 'https://ca.slack-edge.com/TDVATDGUU-UDW2MSZAP-81cad567c9a1-512',
    'Isaque Böck': 'https://ca.slack-edge.com/TDVATDGUU-U09745PDX6D-971b0e576ab1-512',
    'Rafael Garbinatto': 'https://ca.slack-edge.com/TDVATDGUU-ULU0NHDSM-5c3d561a39e1-512',
    'Herbert Júlio': 'https://ca.slack-edge.com/TDVATDGUU-U036GK4J347-399781903ba3-512',
    'Rafael Umman': 'https://ca.slack-edge.com/TDVATDGUU-UDUPJUL1E-d70389018587-512',
    'Marcus Grando': 'https://ca.slack-edge.com/TDVATDGUU-UDVG1K05Q-g75bb0e36e1c-512',
    'Bruno Germano': 'https://ca.slack-edge.com/TDVATDGUU-U08HZ0M4P1D-16b5a8e0519a-512',
    'Gab Lisboa': 'https://ca.slack-edge.com/TDVATDGUU-U0279S2BC12-d09077d857f7-512'
  }

  const properties = [
    { key: 'name', label: 'Name' },
    {
      key: 'owner',
      label: 'Author',
      options: Object.keys(avatars).map((owner) => ({ value: owner }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Live' }, { value: 'Inactive' }] },
    { key: 'domain', label: 'Domain' }
  ]

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const rows = []

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: rows,
    columns,
    filtering: { fields: ['name', 'id', 'domain', 'owner', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'resources-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

  const loading = ref(false)
  let refreshTimer
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const exportCsv = () =>
    downloadCsv(
      'resources.csv',
      toCsv({
        columns: columns
          .filter((column) => column.kind !== 'action')
          .map((column) => ({ id: column.accessorKey, header: column.header })),
        rows: matchingItems.value
      })
    )

  const DOMAIN_PAGE = 10
  const WIRE_WIDTHS = ['92%', '74%', '86%', '68%', '90%', '78%', '84%', '70%', '88%', '76%']
  const domainQuery = ref({})
  const domainShown = ref({})
  const domainLoading = ref({})
  const matchingDomains = (row) => {
    const needle = (domainQuery.value[row.id] ?? '').trim().toLowerCase()
    return needle
      ? row.domains.filter((domain) => domain.toLowerCase().includes(needle))
      : row.domains
  }
  const visibleDomains = (row) =>
    matchingDomains(row).slice(0, domainShown.value[row.id] ?? DOMAIN_PAGE)
  const remainingDomains = (row) => matchingDomains(row).length - visibleDomains(row).length
  const nextDomains = (row) => Math.min(DOMAIN_PAGE, remainingDomains(row))
  const domainSummary = (row) => {
    const total = row.domains.length
    const shown = visibleDomains(row).length
    const matched = matchingDomains(row).length
    const searching = Boolean(domainQuery.value[row.id])
    if (remainingDomains(row)) {
      return searching ? `${shown} of ${matched} matching domains` : `${shown} of ${total} domains`
    }
    return searching ? `${matched} of ${total} domains` : `${total} domains`
  }
  const searchDomains = (row, value) => {
    domainQuery.value = { ...domainQuery.value, [row.id]: value }
    domainShown.value = { ...domainShown.value, [row.id]: DOMAIN_PAGE }
    domainLoading.value = { ...domainLoading.value, [row.id]: false }
  }
  const openDomains = (row, open) => {
    if (open) searchDomains(row, '')
  }
  const loadMoreDomains = (row) => {
    if (domainLoading.value[row.id] || !remainingDomains(row)) return
    domainLoading.value = { ...domainLoading.value, [row.id]: true }
    setTimeout(() => {
      domainShown.value = {
        ...domainShown.value,
        [row.id]: (domainShown.value[row.id] ?? DOMAIN_PAGE) + DOMAIN_PAGE
      }
      domainLoading.value = { ...domainLoading.value, [row.id]: false }
    }, 420)
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Resources"
        description="View and manage your resources."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/resources"
            target="_blank"
          />
          <Button
            label="Create Resource"
            icon="pi pi-plus"
            kind="outlined"
            size="medium"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter resources"
                aria-label="Filter resources"
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Tooltip
                text="Refresh"
                class="shrink-0"
              >
                <IconButton
                  icon="pi pi-refresh"
                  kind="outlined"
                  size="medium"
                  :loading="loading"
                  aria-label="Refresh"
                  @click="refresh"
                />
              </Tooltip>
              <Tooltip
                text="Download CSV"
                class="shrink-0"
              >
                <IconButton
                  icon="pi pi-download"
                  kind="outlined"
                  size="medium"
                  :disabled="!matchingItems.length"
                  aria-label="Download CSV"
                  @click="exportCsv"
                />
              </Tooltip>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Table preferences"
              />
            </div>
          </header>
          <section class="flex min-h-0 flex-col">
            <Card
              v-if="status === 'empty'"
              :padded="false"
            >
              <template #content>
                <EmptyState
                  size="medium"
                  icon="pi pi-box"
                  title="No resources yet"
                  description="Create a resource to start serving traffic on your domains."
                >
                  <template #actions>
                    <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                      <Button
                        label="Create Resource"
                        icon="pi pi-plus"
                        kind="secondary"
                        size="small"
                      />
                      <Button
                        label="Docs"
                        icon="pi pi-book"
                        kind="outlined"
                        size="small"
                        href="https://example.com/docs/resources"
                        target="_blank"
                      />
                    </div>
                  </template>
                </EmptyState>
              </template>
            </Card>
            <Card
              v-else
              :padded="false"
            >
              <template #content>
                <TableRoot
                  v-bind="tableProps"
                  :loading="loading || fetching"
                  enable-sorting
                  :bordered="false"
                >
                  <template #cell-name="{ value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-box shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
                    </div>
                  </template>
                  <template #cell-id="{ value }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <span class="min-w-0 flex-1 truncate tabular-nums">{{ value }}</span>
                      <CopyButton
                        v-if="value"
                        kind="outlined"
                        :value="value"
                        aria-label="Copy resource ID"
                      />
                    </div>
                  </template>
                  <template #cell-domain="{ row, value }">
                    <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                      <i
                        class="pi pi-globe shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <div class="min-w-0">
                        <Tooltip
                          :text="'Open ' + value + ' in a new tab'"
                          class="w-full"
                        >
                          <a
                            :href="'https://' + value"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-link
                            class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                            @click.stop
                          >
                            <span
                              dir="ltr"
                              class="truncate underline-offset-2 group-hover/link:underline"
                              >{{ value }}</span
                            >
                            <span class="sr-only">(opens in a new tab)</span>
                            <i
                              class="pi pi-external-link shrink-0 text-body-xs leading-none"
                              aria-hidden="true"
                            />
                          </a>
                        </Tooltip>
                      </div>
                      <PopoverRoot
                        v-if="row.domainCount"
                        placement="bottom-start"
                        width="small"
                        @update:open="(open) => openDomains(row, open)"
                      >
                        <PopoverTrigger @click.stop>
                          <div class="shrink-0 cursor-pointer">
                            <Tag
                              :label="'+' + row.domainCount"
                              severity="secondary"
                              size="small"
                            />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent @click.stop>
                          <div
                            class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                          >
                            <p class="text-label-sm text-(--text-muted)">
                              {{ domainSummary(row) }}
                            </p>
                            <Input
                              v-if="row.domains.length > 10"
                              :model-value="domainQuery[row.id] ?? ''"
                              size="medium"
                              placeholder="Search domains"
                              aria-label="Search domains"
                              @update:model-value="(value) => searchDomains(row, value)"
                            >
                              <template #iconLeft>
                                <i
                                  class="pi pi-search"
                                  aria-hidden="true"
                                />
                              </template>
                            </Input>
                          </div>
                          <div
                            class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
                          >
                            <a
                              v-for="domain in visibleDomains(row)"
                              :key="domain"
                              :href="'https://' + domain"
                              target="_blank"
                              rel="noopener noreferrer"
                              class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                              @click.stop
                            >
                              <span class="truncate">{{ domain }}</span>
                              <i
                                class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
                                aria-hidden="true"
                              />
                            </a>
                            <div v-if="domainLoading[row.id]">
                              <div
                                v-for="index in nextDomains(row)"
                                :key="index"
                                class="flex h-7 items-center px-(--spacing-xs)"
                              >
                                <Skeleton
                                  height="var(--size-3)"
                                  :width="WIRE_WIDTHS[(index - 1) % WIRE_WIDTHS.length]"
                                />
                              </div>
                            </div>
                            <p
                              v-if="!matchingDomains(row).length"
                              class="px-(--spacing-xs) py-(--spacing-sm) text-center text-body-sm text-(--text-muted)"
                            >
                              No domain matches “{{ domainQuery[row.id] }}”.
                            </p>
                          </div>
                          <div
                            v-if="remainingDomains(row)"
                            class="border-t border-(--border-default) p-(--spacing-xxs)"
                          >
                            <Button
                              :label="'Load ' + nextDomains(row) + ' more'"
                              kind="transparent"
                              size="small"
                              :loading="domainLoading[row.id]"
                              class="w-full"
                              @click.stop="loadMoreDomains(row)"
                            />
                          </div>
                          <span
                            class="sr-only"
                            role="status"
                          >
                            {{
                              domainLoading[row.id]
                                ? 'Loading ' + nextDomains(row) + ' more domains'
                                : domainSummary(row)
                            }}
                          </span>
                        </PopoverContent>
                      </PopoverRoot>
                      <div class="shrink-0 ms-auto">
                        <CopyButton
                          kind="outlined"
                          :value="value"
                          aria-label="Copy domain name"
                        />
                      </div>
                    </div>
                  </template>
                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="value === 'Live' ? 'success' : 'secondary'"
                      size="medium"
                    />
                  </template>
                  <template #cell-lastModified="{ row, value }">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <Tooltip
                        v-if="row.owner"
                        :text="row.owner"
                      >
                        <Avatar
                          :src="avatars[row.owner]"
                          :alt="row.owner"
                          :label="row.owner"
                          size="small"
                          kind="square"
                        />
                      </Tooltip>
                      <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
                    </div>
                  </template>
                  <template #cell-actions>
                    <DropdownMenuRoot placement="bottom-end">
                      <DropdownMenuTrigger>
                        <Tooltip text="Row actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Row actions"
                          />
                        </Tooltip>
                      </DropdownMenuTrigger>
                      <DropdownMenuGroup>
                        <DropdownMenuOption
                          value="deploy"
                          label="Deploy"
                        >
                          <template #left
                            ><i
                              class="pi pi-cloud-upload"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                        <DropdownMenuOption
                          value="view"
                          label="View details"
                        >
                          <template #left
                            ><i
                              class="pi pi-eye"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                        <DropdownMenuOption
                          value="duplicate"
                          label="Clone"
                        >
                          <template #left
                            ><i
                              class="pi pi-clone"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuOption
                          value="delete"
                          label="Delete"
                        >
                          <template #left
                            ><i
                              class="pi pi-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                      </DropdownMenuGroup>
                    </DropdownMenuRoot>
                  </template>
                  <template #empty>
                    <EmptyState
                      size="medium"
                      icon="pi pi-filter-slash"
                      title="No matching resources"
                      description="No resource matches these filters."
                    >
                      <template #actions>
                        <Button
                          label="Clear filters"
                          kind="outlined"
                          size="small"
                          @click="clearFilters"
                        />
                      </template>
                    </EmptyState>
                  </template>
                </TableRoot>
              </template>
            </Card>
          </section>
        </section>
      </section>
    </main>
  </div>
</template>
