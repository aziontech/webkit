<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { type TableColumn } from '@aziontech/webkit/table'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref, watch } from 'vue'

  import CreateTokenDrawer from './parts/create-token-drawer.vue'
  import TokenSecretDialog from './parts/token-secret-dialog.vue'
  import TokensTable, { type PersonalTokensRow } from './parts/tokens-table.vue'
  import { sampleNow, sampleTokens } from './sample'

  /** One personal token of the signed-in person. */
  export interface PersonalTokensToken {
    /** Stable key. */
    id: string
    /** Display name. */
    name: string
    /** What the token is for; empty reads No description. */
    description: string
    /** When it was created. */
    createdAt: Date
    /** Who created it, shown under the creation time. */
    createdBy: string
    /** When it stops working. */
    expiresAt: Date
    /** The last request it signed, or null when it was never used. */
    lastUsedAt: Date | null
    /** Whether it was revoked. */
    revoked: boolean
  }

  /** What Create Personal Token sends: the name, the description and the lifetime in days. */
  export interface PersonalTokensCreateValues {
    /** Trimmed name, unique in the list. */
    name: string
    /** Trimmed description, may be empty. */
    description: string
    /** Days until the token expires, rounded up. */
    expiresInDays: number
    /** The moment the token expires; send it as an ISO 8601 string. */
    expiresAt: Date
  }

  /** The token the create request returned, shown once in the reveal dialog. */
  export interface PersonalTokensSecret {
    /** The token's name. */
    name: string
    /** The secret value. */
    secret: string
  }

  export interface PersonalTokensProps {
    /** The tokens to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    tokens?: PersonalTokensToken[]
    /** A request is in flight: with no tokens it is the first load, with tokens a refresh. */
    loading?: boolean
    /** Why the tokens could not load; a danger alert with Retry replaces the table. */
    error?: string
    /** The create request is in flight; the drawer's fields lock and its submit spins. */
    creating?: boolean
    /** The moment statuses and the expiry hint count from. Left out, the sample clock. */
    now?: Date
  }

  const props = withDefaults(defineProps<PersonalTokensProps>(), {
    tokens: undefined,
    loading: false,
    error: '',
    creating: false,
    now: undefined
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    create: [event: Event, values: PersonalTokensCreateValues]
    revoke: [event: MouseEvent, token: PersonalTokensToken]
    delete: [event: MouseEvent, token: PersonalTokensToken]
  }>()

  const secretModel = defineModel<PersonalTokensSecret | null>('secret', { default: null })

  interface TokenStatus {
    label: string
    severity: TagSeverity
  }

  const DAY = 86_400_000
  const referenceTime = computed(() => (props.now ?? sampleNow).getTime())
  const daysFrom = (days: number) => new Date(referenceTime.value + days * DAY)

  const { formatDate: formatLocaleDate } = useLocale()

  const formatDate = (date: Date) =>
    formatLocaleDate(date, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    })

  const source = computed<PersonalTokensToken[]>(
    () => props.tokens ?? (props.loading || props.error ? [] : sampleTokens)
  )
  const items = ref<PersonalTokensToken[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const statusOf = (token: PersonalTokensToken): TokenStatus => {
    if (token.revoked) return { label: 'Revoked', severity: 'neutral' }
    const left = Math.ceil((token.expiresAt.getTime() - referenceTime.value) / DAY)
    if (left <= 0) return { label: 'Expired', severity: 'danger' }
    if (left <= 7)
      return { label: `Expires in ${left} ${left === 1 ? 'day' : 'days'}`, severity: 'warning' }
    return { label: 'Active', severity: 'success' }
  }

  const rows = computed<PersonalTokensRow[]>(() =>
    items.value.map((token) => ({
      ...token,
      status: statusOf(token).label,
      expires: formatDate(token.expiresAt)
    }))
  )

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'description', header: 'Description', grow: 2, minWidth: 200 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 160 },
    { accessorKey: 'expires', header: 'Expires', minWidth: 130 },
    { accessorKey: 'lastUsedAt', header: 'Last used', minWidth: 140 },
    { accessorKey: 'createdAt', header: 'Created', sortable: true, minWidth: 160 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      options: [...new Set(rows.value.map((row) => row.status))].sort().map((value) => ({ value }))
    }
  ])

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters
  } = useCollection({
    items: rows,
    columns,
    filtering: { fields: ['name', 'description', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: { storageKey: 'personal-tokens' }
  })

  const tokensTableEl = ref<InstanceType<typeof TokensTable> | null>(null)
  const exportCsv = () => tokensTableEl.value?.exportCsv()

  const loadFailed = computed(() => props.error !== '')
  const refreshing = computed(() => props.loading && items.value.length > 0)

  const createOpen = ref(false)
  const submitting = computed(() => props.creating)

  const openCreate = () => {
    createOpen.value = true
  }

  watch(secretModel, (next) => {
    if (next) createOpen.value = false
  })

  const pending = ref<PersonalTokensToken | null>(null)
  const revokeOpen = ref(false)
  const deleteOpen = ref(false)

  const onAction = (value: DropdownMenuItemValue, row: PersonalTokensRow) => {
    pending.value = items.value.find((token) => token.id === row.id) ?? null
    if (value === 'revoke') revokeOpen.value = true
    if (value === 'delete') deleteOpen.value = true
  }

  const revoke = (event: MouseEvent) => {
    const token = pending.value
    if (!token) return
    items.value = items.value.map((item) =>
      item.id === token.id ? { ...item, revoked: true } : item
    )
    revokeOpen.value = false
    emit('revoke', event, token)
  }

  const remove = (event: MouseEvent) => {
    const token = pending.value
    if (!token) return
    items.value = items.value.filter((item) => item.id !== token.id)
    deleteOpen.value = false
    emit('delete', event, token)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Personal tokens"
        description="Tokens let scripts and tools call the API as you. Each one is shown only once, right after you create it."
      >
        <template #actions>
          <Button
            label="Documentation"
            aria-label="Documentation (opens in a new tab)"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/personal-tokens"
            target="_blank"
          />
          <Button
            label="Create Personal Token"
            icon="az az-plus"
            variant="primary"
            size="medium"
            @click="openCreate"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header
          v-if="!loadFailed && (loading || status !== 'empty')"
          class="flex flex-wrap items-start gap-(--layout-group-gap)"
        >
          <div class="flex min-w-0 grow basis-(--container-2xs)">
            <PropertyFilter
              v-bind="propertyFilterProps"
              placeholder="Filter tokens"
              aria-label="Filter tokens"
            />
          </div>
          <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs)">
            <Tooltip
              content="Refresh"
              class="shrink-0"
            >
              <IconButton
                icon="az az-refresh"
                variant="outline"
                size="medium"
                :loading="refreshing"
                aria-label="Refresh"
                @click="emit('refresh', $event)"
              />
            </Tooltip>
            <Tooltip
              content="Download CSV"
              class="shrink-0"
            >
              <IconButton
                icon="az az-download"
                variant="outline"
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

        <Alert
          v-if="loadFailed"
          severity="danger"
        >
          {{ error }}
          <template #actions>
            <Button
              label="Retry"
              variant="secondary"
              size="small"
              @click="emit('retry', $event)"
            />
          </template>
        </Alert>

        <Card
          key="card-1"
          v-else-if="!loading && status === 'empty'"
          :padded="false"
        >
          <template #default>
            <EmptyState
              size="medium"
              icon="az az-key"
              title="No personal tokens yet"
              description="Create a token to call the API from a script, a CI job or the CLI."
            >
              <template #actions>
                <Button
                  label="Create Personal Token"
                  icon="az az-plus"
                  variant="secondary"
                  size="small"
                  @click="openCreate"
                />
              </template>
            </EmptyState>
          </template>
        </Card>

        <TokensTable
          key="card-2"
          v-else
          ref="tokensTableEl"
          :table-props="tableProps"
          :pagination-props="paginationProps"
          :loading="loading"
          :status-of="statusOf"
          @action="onAction"
          @clear="clearFilters"
        />
      </section>
    </div>

    <CreateTokenDrawer
      v-model:open="createOpen"
      :submitting="submitting"
      :names="items.map((token) => token.name)"
      :format-date="formatDate"
      :days-from="daysFrom"
      @create="(event, values) => emit('create', event, values)"
    />

    <TokenSecretDialog v-model:secret="secretModel" />

    <ConfirmDialog
      v-model:open="revokeOpen"
      title="Revoke token"
      :description="`Scripts and tools that use “${pending?.name ?? ''}” stop working right away. You cannot undo this.`"
      confirm-label="Revoke token"
      size="small"
      @confirm="revoke"
    />

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete token"
      :description="`“${pending?.name ?? ''}” no longer works; deleting removes it from this list.`"
      confirm-label="Delete token"
      size="small"
      @confirm="remove"
    />
  </div>
</template>
