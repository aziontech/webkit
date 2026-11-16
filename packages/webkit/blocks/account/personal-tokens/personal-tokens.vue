<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DataTable from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

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
    /** Days until the token expires. */
    expiresInDays: number
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

  type TokenRow = PersonalTokensToken & { status: string; expires: string }
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

  const rows = computed<TokenRow[]>(() =>
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

  const { tableProps, propertyFilterProps, preferencesProps, status, matchingItems, clearFilters } =
    useCollection({
      items: rows,
      columns,
      filtering: { fields: ['name', 'description', 'status'] },
      propertyFiltering: { properties },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'personal-tokens' }
    })

  const tokensTableEl = ref<TableExposed<TokenRow> | null>(null)
  const exportCsv = () => tokensTableEl.value?.exportCsv({ filename: 'personal-tokens.csv' })

  const loadFailed = computed(() => props.error !== '')
  const refreshing = computed(() => props.loading && items.value.length > 0)

  const expiryOptions = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' }
  ]
  const expiryLabel = (value: string) =>
    expiryOptions.find((option) => option.value === value)?.label ?? ''

  const createOpen = ref(false)
  const submitting = computed(() => props.creating)
  const form = reactive({ name: '', description: '', expiresIn: '30' })
  const errors = reactive({ name: '' })
  const expiryHint = computed(
    () =>
      `The token stops working on ${formatDate(daysFrom(Number(form.expiresIn)))}. Create a new one before then.`
  )

  const openCreate = () => {
    Object.assign(form, { name: '', description: '', expiresIn: '30' })
    errors.name = ''
    createOpen.value = true
  }

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const revealOpen = computed(() => secretModel.value !== null)
  const revealed = computed(() => secretModel.value ?? { name: '', secret: '' })
  watch(secretModel, (next) => {
    if (next) createOpen.value = false
  })

  const submit = (event: Event) => {
    if (submitting.value) return
    const name = form.name.trim()
    if (!name) errors.name = 'This field is required.'
    else if (items.value.some((token) => token.name.toLowerCase() === name.toLowerCase())) {
      errors.name = 'A token with this name already exists. Use another name.'
    } else errors.name = ''
    if (errors.name) {
      focusById('token-name')
      return
    }
    emit('create', event, {
      name,
      description: form.description.trim(),
      expiresInDays: Number(form.expiresIn)
    })
  }

  const copied = ref(false)
  const onCopied = () => {
    copied.value = true
  }
  const closeReveal = () => {
    secretModel.value = null
    copied.value = false
  }

  const pending = ref<PersonalTokensToken | null>(null)
  const revokeOpen = ref(false)
  const deleteOpen = ref(false)

  const onAction = (value: DropdownMenuItemValue, row: TokenRow) => {
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
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/personal-tokens"
            target="_blank"
          />
          <Button
            label="Create Personal Token"
            icon="ai ai-plus"
            variant="primary"
            size="large"
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
                icon="ai ai-refresh"
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
                icon="ai ai-download"
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
              icon="ai ai-key"
              title="No personal tokens yet"
              description="Create a token to call the API from a script, a CI job or the CLI."
            >
              <template #actions>
                <Button
                  label="Create Personal Token"
                  icon="ai ai-plus"
                  variant="secondary"
                  size="small"
                  @click="openCreate"
                />
              </template>
            </EmptyState>
          </template>
        </Card>

        <Card
          key="card-2"
          v-else
          :padded="false"
        >
          <template #default>
            <DataTable
              ref="tokensTableEl"
              v-bind="tableProps"
              :loading="loading"
              sortable
              :bordered="false"
              aria-label="Personal tokens"
            >
              <template #cell-name="{ value }">
                <span class="truncate text-label-sm text-(--text-default)">{{ value }}</span>
              </template>
              <template #cell-description="{ value }">
                <span
                  v-if="value"
                  class="truncate text-body-sm text-(--text-muted)"
                  >{{ value }}</span
                >
                <span
                  v-else
                  class="text-body-sm text-(--text-muted)"
                  >No description</span
                >
              </template>
              <template #cell-status="{ row }">
                <TableCellStatus
                  :label="row.status"
                  :severity="statusOf(row).severity"
                />
              </template>
              <template #cell-lastUsedAt="{ value }">
                <TableCellTime
                  v-if="value"
                  :value="value"
                />
                <span
                  v-else
                  class="text-body-sm text-(--text-muted)"
                  >Never used</span
                >
              </template>
              <template #cell-createdAt="{ row }">
                <TableCellTime
                  :value="row.createdAt"
                  :author="row.createdBy"
                />
              </template>
              <template #header-actions>
                <span class="sr-only">Actions</span>
              </template>
              <template #cell-actions="{ row }">
                <TableCellActions
                  :name="row.name"
                  @select="(_event, value) => onAction(value, row)"
                >
                  <DropdownMenu.Group
                    key="dropdown-menu.group-1"
                    v-if="!row.revoked && row.status !== 'Expired'"
                  >
                    <DropdownMenu.Item
                      value="revoke"
                      label="Revoke"
                    />
                  </DropdownMenu.Group>
                  <DropdownMenu.Group
                    key="dropdown-menu.group-2"
                    v-else
                  >
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete"
                    />
                  </DropdownMenu.Group>
                </TableCellActions>
              </template>
              <template #empty>
                <EmptyState
                  size="small"
                  icon="ai ai-search"
                  title="No matching tokens"
                  description="No token matches these filters."
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

    <Drawer
      v-model:open="createOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Personal Token"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Create Personal Token</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                The token acts as you, with your permissions, until it expires or you revoke it.
              </p>
            </div>
          </PanelHeader>

          <PanelBody>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Personal Token</legend>
              <SettingsSection
                title="General"
                hint="How you will recognise the token in this list."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-lg)">
                  <Field
                    :required="!!errors.name && !form.name.trim()"
                    :invalid="!!errors.name && !!form.name.trim()"
                  >
                    <Field.Label for="token-name">Name</Field.Label>
                    <Input
                      id="token-name"
                      v-model="form.name"
                      placeholder="deploy-pipeline"
                      autocomplete="off"
                      @update:model-value="errors.name = ''"
                    />
                    <Field.Description>{{
                      errors.name || 'Name it after where it is used, such as the job or the tool.'
                    }}</Field.Description>
                  </Field>
                  <Field>
                    <Field.Label for="token-description">Description</Field.Label>
                    <Textarea
                      id="token-description"
                      v-model="form.description"
                      :rows="3"
                    />
                  </Field>
                </div>
              </SettingsSection>
              <SettingsSection
                title="Expiration"
                hint="Shorter is safer. A token cannot be extended."
              >
                <Field>
                  <Field.Label for="token-expiry">Expires in</Field.Label>
                  <Select
                    v-model="form.expiresIn"
                    size="large"
                    class="w-full"
                    :display-value="expiryLabel"
                  >
                    <Select.Trigger
                      id="token-expiry"
                      aria-describedby="token-expiry-hint"
                    />
                    <Select.Content>
                      <Select.Item
                        v-for="option in expiryOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                  <FieldDescription id="token-expiry-hint">{{ expiryHint }}</FieldDescription>
                </Field>
              </SettingsSection>
            </fieldset>
          </PanelBody>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
              <Button
                label="Cancel"
                variant="outline"
                size="medium"
                type="button"
                :disabled="submitting"
                @click="createOpen = false"
              />
              <Button
                label="Create Personal Token"
                variant="primary"
                size="medium"
                type="submit"
                :loading="submitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <Dialog
      :open="revealOpen"
      size="medium"
      @update:open="(open) => !open && closeReveal()"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Copy your new token</DialogTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <DialogDescription>
              “{{ revealed.name }}” is ready. This is the only time the token is shown.
            </DialogDescription>
            <Alert
              severity="warning"
              size="small"
              label="Copy the token and store it somewhere safe, such as a secret manager. After you close this dialog, it cannot be shown again; create a new one if it is lost."
            />
            <Field>
              <Field.Label for="token-secret">Token</Field.Label>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <div class="min-w-0 grow">
                  <PasswordInput
                    id="token-secret"
                    :model-value="revealed.secret"
                    readonly
                    autocomplete="off"
                    class="w-full"
                  />
                </div>
                <CopyButton
                  :value="revealed.secret"
                  variant="outline"
                  size="large"
                  aria-label="Copy token"
                  copied-label="Token copied"
                  @copy="onCopied"
                />
              </div>
              <p
                v-if="copied"
                class="text-body-xs text-(--text-muted)"
                aria-hidden="true"
              >
                Copied to the clipboard.
              </p>
            </Field>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end">
            <Button
              :label="copied ? 'Done' : 'I copied the token'"
              variant="primary"
              size="medium"
              @click="closeReveal"
            />
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>

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
