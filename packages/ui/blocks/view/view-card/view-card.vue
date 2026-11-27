<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import CardList from '@aziontech/ui/card-list'
  import CollectionPreferences from '@aziontech/ui/collection-preferences'
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import EmptyState from '@aziontech/ui/empty-state'
  import Link from '@aziontech/ui/link'
  import PageHeader from '@aziontech/ui/page-header'
  import Pagination from '@aziontech/ui/pagination-root'
  import PropertyFilter from '@aziontech/ui/property-filter'
  import Tag, { type TagSeverity } from '@aziontech/ui/tag'
  import { type FilteringProperty, useCollection } from '@aziontech/ui/use-collection'
  import { useLocale } from '@aziontech/ui/use-locale'
  import { computed, ref, watch } from 'vue'

  import { sampleApplications } from './sample'

  /** How an application is serving. */
  export type CardViewApplicationStatus = 'Active' | 'Degraded' | 'Inactive'

  /** One card of the list. */
  export interface CardViewApplication {
    /** Stable key, used in the link and the selection. */
    id: string
    /** Display name, linked to the application page. */
    name: string
    /** How the application is serving, shown as a tag. */
    status: CardViewApplicationStatus
    /** The domain it answers on. */
    domain: string
    /** The region it runs in. */
    region: string
    /** Requests in the last 24 hours, shown in compact notation. */
    requests: number
    /** Who owns it. */
    owner: string
  }

  export interface CardViewProps {
    /** The applications to list; filtered and paged in the browser. Left out, the sample renders. */
    applications?: CardViewApplication[]
    /** A request is in flight: with no cards it is the first load, with cards a refresh. */
    loading?: boolean
    /** Why the applications could not load; a danger alert with Retry replaces the cards. */
    error?: string
  }

  const props = withDefaults(defineProps<CardViewProps>(), {
    applications: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    create: [event: MouseEvent]
    retry: [event: MouseEvent]
    delete: [event: Event, applications: CardViewApplication[]]
  }>()

  interface Field {
    id: Exclude<keyof CardViewApplication, 'id' | 'name'>
    header: string
  }

  const FIELD_HEADERS: Record<Field['id'], string> = {
    status: 'Status',
    domain: 'Domain',
    region: 'Region',
    requests: 'Requests in 24h',
    owner: 'Owner'
  }
  const fields = (Object.keys(FIELD_HEADERS) as Field['id'][]).map((id): Field => ({
    id,
    header: FIELD_HEADERS[id]
  }))

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'status',
      label: 'Status',
      options: [{ value: 'Active' }, { value: 'Degraded' }, { value: 'Inactive' }]
    },
    {
      key: 'region',
      label: 'Region',
      options: [{ value: 'sa-east' }, { value: 'us-east' }, { value: 'eu-west' }]
    },
    { key: 'requests', label: 'Requests in 24h', type: 'number' }
  ]

  const source = computed<CardViewApplication[]>(
    () => props.applications ?? (props.loading || props.error ? [] : sampleApplications)
  )
  const items = ref<CardViewApplication[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const blocked = computed(() => (props.loading && items.value.length === 0) || props.error !== '')

  const {
    cardListProps,
    paginationProps,
    propertyFilterProps,
    preferencesProps,
    preferences,
    status,
    totalCount,
    selectedCount,
    selectedItems,
    clearSelection,
    clearFilters
  } = useCollection({
    items,
    columns: fields,
    filtering: { fields: ['name', 'domain', 'owner'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 12, pageSizeOptions: [12, 24, 48] },
    selection: { mode: 'multiple' },
    preferences: {
      storageKey: 'applications-cards',
      defaults: { columns: [{ id: 'owner', visible: false }] }
    },
    url: true
  })

  const shownFields = computed(() =>
    preferences.value.columns
      .filter((column) => column.visible)
      .map((column) => fields.find((field) => field.id === column.id))
      .filter((field): field is Field => field !== undefined)
  )

  const { formatNumber } = useLocale()

  const requestsFormat = (value: number) => formatNumber(value, { notation: 'compact' })
  const severityOf = (value: CardViewApplicationStatus): TagSeverity =>
    value === 'Active' ? 'success' : value === 'Degraded' ? 'warning' : 'neutral'

  const deleteOpen = ref(false)
  const deleteNoun = computed(() =>
    selectedCount.value === 1 ? 'application' : `${selectedCount.value} applications`
  )
  const deleteConsequence = computed(() =>
    selectedCount.value === 1
      ? 'The selected application will be deleted, along with its domains and settings:'
      : 'The selected applications will be deleted, along with their domains and settings:'
  )
  const deletePhrase = computed(() =>
    selectedCount.value === 1 ? (selectedItems.value[0]?.name ?? '') : 'delete'
  )

  const confirmDelete = (event: Event) => {
    const deleted = [...selectedItems.value]
    const doomed = new Set(deleted.map((item) => item.id))
    items.value = items.value.filter((item) => !doomed.has(item.id))
    clearSelection()
    deleteOpen.value = false
    emit('delete', event, deleted)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Applications"
        description="View and manage your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/applications"
            target="_blank"
          />
          <Button
            v-if="error || loading || status !== 'empty'"
            label="Create Application"
            icon="az az-plus"
            variant="primary"
            size="medium"
            @click="(event: MouseEvent) => emit('create', event)"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter applications"
                aria-label="Filter applications"
                :disabled="blocked"
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <ConfirmDialog
                v-model:open="deleteOpen"
                :title="`Delete ${deleteNoun}`"
                size="medium"
                :confirm-label="selectedCount === 1 ? 'Delete application' : 'Delete applications'"
                :confirmation-phrase="deletePhrase"
                @confirm="confirmDelete"
              >
                <template #trigger>
                  <Button
                    :label="selectedCount ? `Delete (${selectedCount})` : 'Delete'"
                    icon="az az-trash"
                    variant="outline"
                    size="medium"
                    :disabled="blocked || !selectedCount"
                  />
                </template>
                <div class="flex flex-col gap-(--spacing-md)">
                  <Alert
                    severity="warning"
                    label="Once confirmed, this action can't be reversed."
                  />
                  <p class="m-0 text-body-sm text-(--text-muted)">
                    {{ deleteConsequence }}
                    <bdi class="text-(--text-default)">{{
                      selectedItems.map((item) => item.name).join(', ')
                    }}</bdi
                    >.
                  </p>
                </div>
              </ConfirmDialog>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Card preferences"
                :sections="['page-size', 'columns']"
                :disabled="blocked"
              />
            </div>
          </header>

          <Alert
            v-if="error"
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="(event: MouseEvent) => emit('retry', event)"
          />
          <Card
            v-else-if="status === 'empty' && !loading"
            :padded="false"
          >
            <template #default>
              <EmptyState
                size="medium"
                icon="az az-layout-grid"
                title="No applications yet"
                description="Create an application to start serving traffic."
              >
                <template #actions>
                  <Button
                    label="Create Application"
                    icon="az az-plus"
                    variant="primary"
                    size="medium"
                    @click="(event: MouseEvent) => emit('create', event)"
                  />
                </template>
              </EmptyState>
            </template>
          </Card>

          <template v-else>
            <CardList
              v-bind="cardListProps"
              :loading="loading"
              aria-label="Applications"
            >
              <template #header="{ item }">
                <Link
                  :label="item.name"
                  :href="`/applications/${item.id}`"
                  class="min-w-0"
                />
              </template>
              <template #default="{ item }">
                <dl
                  class="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-(--spacing-sm) gap-y-(--spacing-xs)"
                >
                  <template
                    v-for="field in shownFields"
                    :key="field.id"
                  >
                    <dt class="truncate text-label-sm text-(--text-muted)">{{ field.header }}</dt>
                    <dd class="min-w-0 truncate">
                      <Tag
                        v-if="field.id === 'status'"
                        :label="item.status"
                        :severity="severityOf(item.status)"
                        size="small"
                      />
                      <bdi v-else-if="field.id === 'domain'">{{ item.domain }}</bdi>
                      <span
                        v-else-if="field.id === 'requests'"
                        class="tabular-nums"
                        >{{ requestsFormat(item.requests) }}</span
                      >
                      <template v-else>{{ item[field.id] }}</template>
                    </dd>
                  </template>
                </dl>
              </template>
              <template #empty>
                <EmptyState
                  size="medium"
                  icon="az az-filter-off"
                  title="No matching applications"
                  description="No application matches these filters."
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
            </CardList>
            <Pagination
              v-if="totalCount > 0"
              v-bind="paginationProps"
            />
          </template>
        </section>
      </section>
    </div>
  </div>
</template>
