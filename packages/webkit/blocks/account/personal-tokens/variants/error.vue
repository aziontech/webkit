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
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Table, { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, reactive, ref } from 'vue'

  interface Token {
    id: string
    name: string
    description: string
    createdAt: Date
    createdBy: string
    expiresAt: Date
    lastUsedAt: Date | null
    revoked: boolean
  }
  type TokenRow = Token & { status: string; expires: string }
  interface TokenStatus {
    label: string
    severity: TagSeverity
  }

  const DAY = 86_400_000
  const referenceTime = Date.UTC(2026, 10, 10, 12)
  const daysFrom = (days: number) => new Date(referenceTime + days * DAY)

  const { formatDate: formatLocaleDate } = useLocale()

  const formatDate = (date: Date) =>
    formatLocaleDate(date, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    })

  const seedTokens: Token[] = [
    {
      id: 'tok-7c1e',
      name: 'Local CLI',
      description: 'Development laptop',
      createdAt: daysFrom(-40),
      createdBy: 'grace.hall@example.com',
      expiresAt: daysFrom(50),
      lastUsedAt: daysFrom(-0.1),
      revoked: false
    },
    {
      id: 'tok-3a90',
      name: 'Deploy pipeline',
      description: 'CI job that publishes the storefront',
      createdAt: daysFrom(-85),
      createdBy: 'grace.hall@example.com',
      expiresAt: daysFrom(5),
      lastUsedAt: daysFrom(-1),
      revoked: false
    },
    {
      id: 'tok-b412',
      name: 'Infrastructure as code',
      description: 'Provider for the staging stack',
      createdAt: daysFrom(-120),
      createdBy: 'grace.hall@example.com',
      expiresAt: daysFrom(-30),
      lastUsedAt: daysFrom(-31),
      revoked: false
    },
    {
      id: 'tok-55d2',
      name: 'Nightly export',
      description: 'Retired reporting script',
      createdAt: daysFrom(-200),
      createdBy: 'grace.hall@example.com',
      expiresAt: daysFrom(160),
      lastUsedAt: null,
      revoked: true
    }
  ]

  const tokens = ref<Token[]>([])

  const statusOf = (token: Token): TokenStatus => {
    if (token.revoked) return { label: 'Revoked', severity: 'neutral' }
    const left = Math.ceil((token.expiresAt.getTime() - referenceTime) / DAY)
    if (left <= 0) return { label: 'Expired', severity: 'danger' }
    if (left <= 7)
      return { label: `Expires in ${left} ${left === 1 ? 'day' : 'days'}`, severity: 'warning' }
    return { label: 'Active', severity: 'success' }
  }

  const rows = computed<TokenRow[]>(() =>
    tokens.value.map((token) => ({
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
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const statusOptions = [...new Set(rows.value.map((row) => row.status))]
    .sort()
    .map((value) => ({ value }))

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status', options: statusOptions }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, status, matchingItems, clearFilters } =
    useCollection({
      items: rows,
      columns,
      filtering: { fields: ['name', 'description', 'status'] },
      propertyFiltering: { properties },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'personal-tokens' }
    })

  const tokensTable = ref<TableExposed<TokenRow> | null>(null)
  const exportCsv = () => tokensTable.value?.exportCsv({ filename: 'personal-tokens.csv' })

  const loading = ref(false)
  const loadFailed = ref(true)
  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      loading.value = false
      tokens.value = seedTokens
    }, 700)
  }

  const refreshing = ref(false)
  const refresh = () => {
    if (refreshing.value) return
    refreshing.value = true
    setTimeout(() => {
      refreshing.value = false
    }, 700)
  }

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
  const submitting = ref(false)
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

  const revealOpen = ref(false)
  const revealed = reactive({ name: '', secret: '' })

  const makeSecret = () => {
    const bytes = new Uint8Array(24)
    globalThis.crypto?.getRandomValues?.(bytes)
    return `pat_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
  }

  const submit = () => {
    if (submitting.value) return
    const name = form.name.trim()
    if (!name) errors.name = 'This field is required.'
    else if (tokens.value.some((token) => token.name.toLowerCase() === name.toLowerCase())) {
      errors.name = 'A token with this name already exists. Use another name.'
    } else errors.name = ''
    if (errors.name) {
      focusById('token-name')
      return
    }
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      tokens.value = [
        {
          id: `tok-${Math.random().toString(16).slice(2, 6)}`,
          name,
          description: form.description.trim(),
          createdAt: new Date(),
          createdBy: 'grace.hall@example.com',
          expiresAt: daysFrom(Number(form.expiresIn)),
          lastUsedAt: null,
          revoked: false
        },
        ...tokens.value
      ]
      Object.assign(revealed, { name, secret: makeSecret() })
      createOpen.value = false
      revealOpen.value = true
    }, 700)
  }

  const copied = ref(false)
  const onCopied = () => {
    copied.value = true
  }
  const closeReveal = () => {
    revealOpen.value = false
    copied.value = false
    revealed.secret = ''
  }

  const pending = ref<Token | null>(null)
  const revokeOpen = ref(false)
  const deleteOpen = ref(false)
  const working = ref(false)

  const onAction = (value: DropdownMenuOptionValue, row: Token) => {
    pending.value = row
    if (value === 'revoke') revokeOpen.value = true
    if (value === 'delete') deleteOpen.value = true
  }

  const revoke = () => {
    const row = pending.value
    if (!row || working.value) return
    working.value = true
    setTimeout(() => {
      working.value = false
      tokens.value = tokens.value.map((token) =>
        token.id === row.id ? { ...token, revoked: true } : token
      )
      revokeOpen.value = false
      toast.success(`Token "${row.name}" revoked. Requests that use it are now refused.`)
    }, 600)
  }

  const remove = () => {
    const row = pending.value
    if (!row) return
    tokens.value = tokens.value.filter((token) => token.id !== row.id)
    deleteOpen.value = false
    toast.success(`Token "${row.name}" deleted.`)
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
            kind="outlined"
            size="medium"
            href="https://example.com/docs/personal-tokens"
            target="_blank"
          />
          <Button
            label="Create Personal Token"
            icon="ai ai-plus"
            kind="primary"
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
                kind="outlined"
                size="medium"
                :loading="refreshing"
                aria-label="Refresh"
                @click="refresh"
              />
            </Tooltip>
            <Tooltip
              content="Download CSV"
              class="shrink-0"
            >
              <IconButton
                icon="ai ai-download"
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

        <Alert
          v-if="loadFailed"
          severity="danger"
        >
          The tokens could not be loaded. Nothing was changed; try again.
          <template #actions>
            <Button
              label="Retry"
              kind="secondary"
              size="small"
              @click="retryLoad"
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
                  kind="secondary"
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
              ref="tokensTable"
              v-bind="tableProps"
              :loading="loading || refreshing"
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
                <Table.CellStatus
                  :label="row.status"
                  :severity="statusOf(row).severity"
                />
              </template>
              <template #cell-lastUsedAt="{ value }">
                <Table.CellTime
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
                <Table.CellTime
                  :value="row.createdAt"
                  :author="row.createdBy"
                />
              </template>
              <template #header-actions>
                <span class="sr-only">Actions</span>
              </template>
              <template #cell-actions="{ row }">
                <Table.CellActions
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
                </Table.CellActions>
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
                      kind="outlined"
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

          <PanelContent>
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
                      <Select.Option
                        v-for="option in expiryOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Option>
                    </Select.Content>
                  </Select>
                  <HelperText
                    id="token-expiry-hint"
                    kind="helper"
                    >{{ expiryHint }}</HelperText
                  >
                </Field>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
              <Button
                label="Cancel"
                kind="outlined"
                size="medium"
                type="button"
                :disabled="submitting"
                @click="createOpen = false"
              />
              <Button
                label="Create Personal Token"
                kind="primary"
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
        <PanelContent>
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
                  kind="outlined"
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
        </PanelContent>
        <PanelFooter>
          <div class="flex w-full justify-end">
            <Button
              :label="copied ? 'Done' : 'I copied the token'"
              kind="primary"
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
      :loading="working"
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
