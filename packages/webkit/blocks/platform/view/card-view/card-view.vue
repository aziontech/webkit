<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Cards from '@aziontech/webkit/cards'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Pagination from '@aziontech/webkit/pagination-root'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Tag from '@aziontech/webkit/tag'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, useId, watch } from 'vue'

  const app = (n, name, status, domain, region, requests, owner) => ({
    id: `app-${String(n).padStart(2, '0')}`,
    name,
    status,
    domain,
    region,
    requests,
    owner
  })

  const applications = [
    app(1, 'storefront', 'Active', 'shop.example.com', 'sa-east', 1240000, 'Robson Junior'),
    app(2, 'checkout', 'Active', 'pay.example.com', 'us-east', 310000, 'Isaque Böck'),
    app(3, 'blog', 'Inactive', 'blog.example.com', 'eu-west', 0, 'Gab Lisboa'),
    app(4, 'docs', 'Active', 'docs.example.com', 'sa-east', 88000, 'Marcus Grando'),
    app(5, 'status-page', 'Active', 'status.example.com', 'us-east', 42000, 'Bruno Germano'),
    app(6, 'image-resizer', 'Active', 'img.example.com', 'eu-west', 2900000, 'Herbert Júlio'),
    app(7, 'auth-gateway', 'Degraded', 'auth.example.com', 'sa-east', 520000, 'Rafael Umman'),
    app(8, 'landing', 'Inactive', 'www.example.com', 'us-east', 0, 'Rafael Garbinatto'),
    app(9, 'api', 'Active', 'api.example.com', 'eu-west', 4100000, 'Robson Junior'),
    app(10, 'search', 'Active', 'search.example.com', 'sa-east', 760000, 'Isaque Böck'),
    app(11, 'webhooks', 'Degraded', 'hooks.example.com', 'us-east', 12000, 'Gab Lisboa'),
    app(12, 'reports', 'Active', 'reports.example.com', 'eu-west', 9000, 'Marcus Grando'),
    app(13, 'media', 'Active', 'media.example.com', 'sa-east', 1800000, 'Bruno Germano'),
    app(14, 'admin', 'Inactive', 'admin.example.com', 'us-east', 300, 'Herbert Júlio')
  ]

  const fields = [
    { id: 'status', header: 'Status' },
    { id: 'domain', header: 'Domain' },
    { id: 'region', header: 'Region' },
    { id: 'requests', header: 'Requests in 24h' },
    { id: 'owner', header: 'Owner' }
  ]

  const properties = [
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
    { key: 'requests', label: 'Requests', type: 'number' }
  ]

  const items = ref([...applications])

  const {
    cardsProps,
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
    selection: { mode: 'multi' },
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
      .filter(Boolean)
  )

  const requestsFormat = new Intl.NumberFormat('en-US', { notation: 'compact' })
  const severityOf = (value) =>
    value === 'Active' ? 'success' : value === 'Degraded' ? 'warning' : 'secondary'

  const CONFIRM_WORD = 'delete'
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const deleteNoun = computed(() =>
    selectedCount.value === 1 ? 'application' : `${selectedCount.value} applications`
  )
  const deleteConsequence = computed(() =>
    selectedCount.value === 1
      ? 'The selected application will be deleted, along with its domains and settings:'
      : 'The selected applications will be deleted, along with their domains and settings:'
  )
  const canDelete = computed(() => confirmation.value.trim().toLowerCase() === CONFIRM_WORD)

  watch(deleteOpen, (isOpen) => {
    if (isOpen) confirmation.value = ''
  })

  const confirmDelete = () => {
    if (!canDelete.value) return
    const doomed = new Set(selectedItems.value.map((item) => item.id))
    items.value = items.value.filter((item) => !doomed.has(item.id))
    clearSelection()
    deleteOpen.value = false
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Applications"
        description="Every application on this account, as cards."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/applications"
            target="_blank"
          />
          <Button
            label="Create Application"
            icon="pi pi-plus"
            kind="primary"
            size="large"
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
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <ConfirmDialog
                v-model:open="deleteOpen"
                :title="`Delete ${deleteNoun}`"
                size="medium"
              >
                <template #trigger>
                  <Button
                    :label="selectedCount ? `Delete (${selectedCount})` : 'Delete'"
                    icon="pi pi-trash"
                    kind="outlined"
                    size="medium"
                    :disabled="!selectedCount"
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
                  <p
                    :id="confirmLabelId"
                    class="m-0 text-body-sm text-(--text-default)"
                  >
                    Type <code class="text-label-code-sm">{{ CONFIRM_WORD }}</code> to confirm.
                  </p>
                  <Input
                    v-model="confirmation"
                    :aria-labelledby="confirmLabelId"
                    autocomplete="off"
                    class="w-full"
                    @keydown.enter="confirmDelete"
                  />
                </div>
                <template #actions="{ close }">
                  <Button
                    label="Cancel"
                    kind="outlined"
                    size="medium"
                    @click="close"
                  />
                  <Button
                    :label="selectedCount === 1 ? 'Delete application' : 'Delete applications'"
                    kind="danger"
                    size="medium"
                    :disabled="!canDelete"
                    @click="confirmDelete"
                  />
                </template>
              </ConfirmDialog>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Card preferences"
                :sections="['page-size', 'columns']"
              />
            </div>
          </header>

          <EmptyState
            v-if="status === 'empty'"
            size="medium"
            icon="pi pi-th-large"
            title="No applications yet"
            description="Create an application to start serving traffic."
          >
            <template #actions>
              <Button
                label="Create Application"
                icon="pi pi-plus"
                kind="secondary"
                size="small"
              />
            </template>
          </EmptyState>

          <template v-else>
            <Cards
              v-bind="cardsProps"
              aria-label="Applications"
            >
              <template #header="{ item }">
                <a
                  :href="'/applications/' + item.id"
                  class="truncate text-(--text-default) no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                  >{{ item.name }}</a
                >
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
                        >{{ requestsFormat.format(item.requests) }}</span
                      >
                      <template v-else>{{ item[field.id] }}</template>
                    </dd>
                  </template>
                </dl>
              </template>
              <template #empty>
                <EmptyState
                  size="medium"
                  icon="pi pi-filter-slash"
                  title="No matching applications"
                  description="No application matches these filters."
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
            </Cards>
            <Pagination
              v-if="totalCount > 0"
              v-bind="paginationProps"
            />
          </template>
        </section>
      </section>
    </main>
  </div>
</template>
