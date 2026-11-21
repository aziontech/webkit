<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import TableCellId from '@aziontech/webkit/table-cell-id'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onUnmounted, ref, useId } from 'vue'

  import ShellConsole from '../shell-console.vue'

  type AccountType = 'organization' | 'group' | 'workspace'

  type AccountTypeMeta = {
    label: string
    icon: string
    severity?: TagSeverity
    variant?: TagVariant
  }

  type Account = {
    id: string
    clientId: string
    name: string
    type: AccountType
    parentId: string | null
  }

  type AccountRow = Account & {
    depth: number
    hasChildren: boolean
    expanded: boolean
    typeLabel: string
    typeIcon: string
    typeSeverity?: TagSeverity
    typeVariant?: TagVariant
  }

  export interface AccountSwitchProps {
    /** Why the account list failed to load; set, a danger alert with Retry replaces the table. */
    error?: string
  }

  withDefaults(defineProps<AccountSwitchProps>(), {
    error: ''
  })

  const emit = defineEmits<{
    'sign-out': [event: MouseEvent | KeyboardEvent]
    retry: [event: MouseEvent]
  }>()

  const switchOpen = defineModel<boolean>('open', { default: false })

  const accountTypes: Record<AccountType, AccountTypeMeta> = {
    organization: { label: 'Organization', icon: 'az az-building', variant: 'primary' },
    group: { label: 'Group', icon: 'az az-users', severity: 'info' },
    workspace: { label: 'Workspace', icon: 'az az-layout-grid', severity: 'neutral' }
  }

  const accounts: Account[] = [
    {
      id: '1001',
      clientId: '7f3a1',
      name: 'Acme Inc.',
      type: 'organization',
      parentId: null
    },
    { id: '1140', clientId: '7f3b9', name: 'Retail', type: 'group', parentId: '1001' },
    { id: '2201', clientId: '8a0c2', name: 'Storefront EU', type: 'workspace', parentId: '1140' },
    { id: '2202', clientId: '8a0c7', name: 'Storefront US', type: 'workspace', parentId: '1140' },
    { id: '1150', clientId: '7f3c4', name: 'Media', type: 'group', parentId: '1001' },
    { id: '2310', clientId: '8b114', name: 'Video platform', type: 'workspace', parentId: '1150' },
    { id: '3001', clientId: '9c201', name: 'Acme Labs', type: 'organization', parentId: null },
    { id: '3105', clientId: '9c2e8', name: 'Research', type: 'workspace', parentId: '3001' }
  ]

  const childrenOf = (id: string | null) => accounts.filter((entry) => entry.parentId === id)

  const currentAccountId = ref('2201')
  const currentAccount = computed(
    () => accounts.find((entry) => entry.id === currentAccountId.value) ?? accounts[0]
  )

  const searchId = useId()
  const accountQuery = ref('')
  const collapsed = ref(new Set<string>())
  const shortcut = ref('Ctrl+O')

  const matchesQuery = (entry: Account, needle: string) =>
    [entry.name, entry.id, entry.clientId].some((value) => value.toLowerCase().includes(needle))

  const subtreeMatches = (entry: Account, needle: string): boolean =>
    matchesQuery(entry, needle) ||
    childrenOf(entry.id).some((child) => subtreeMatches(child, needle))

  const accountRows = computed(() => {
    const needle = accountQuery.value.trim().toLowerCase()
    const rows: AccountRow[] = []
    const walk = (parentId: string | null, depth: number) => {
      for (const entry of childrenOf(parentId)) {
        if (needle && !subtreeMatches(entry, needle)) continue
        const hasChildren = childrenOf(entry.id).length > 0
        const expanded = Boolean(needle) || !collapsed.value.has(entry.id)
        rows.push({
          ...entry,
          depth,
          hasChildren,
          expanded,
          typeLabel: accountTypes[entry.type].label,
          typeIcon: accountTypes[entry.type].icon,
          typeSeverity: accountTypes[entry.type].severity,
          typeVariant: accountTypes[entry.type].variant
        })
        if (hasChildren && expanded) walk(entry.id, depth + 1)
      }
    }
    walk(null, 0)
    return rows
  })

  const accountColumns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 },
    { accessorKey: 'typeLabel', header: 'Type', minWidth: 140 },
    { accessorKey: 'id', header: 'ID', minWidth: 120 },
    { accessorKey: 'clientId', header: 'Client ID', minWidth: 120 }
  ]

  const toggleAccount = (row: AccountRow) => {
    const next = new Set(collapsed.value)
    if (next.has(row.id)) next.delete(row.id)
    else next.add(row.id)
    collapsed.value = next
  }

  const accountsLoading = ref(false)
  let loadTimer: ReturnType<typeof setTimeout> | undefined

  const loadAccounts = () => {
    accountsLoading.value = true
    clearTimeout(loadTimer)
    loadTimer = setTimeout(() => {
      accountsLoading.value = false
    }, 600)
  }

  const openSwitch = () => {
    accountQuery.value = ''
    switchOpen.value = true
    loadAccounts()
    nextTick(() => document.getElementById(searchId)?.focus())
  }

  const chooseAccount = (row: Account) => {
    switchOpen.value = false
    if (row.id === currentAccountId.value) {
      toast.info(`You are already on ${row.name}.`)
      return
    }
    currentAccountId.value = row.id
    toast.success(`Switched to ${row.name}.`, {
      description: `ID ${row.id} · Client ID ${row.clientId}`
    })
  }

  const isMac = () => /mac/i.test(navigator.platform || navigator.userAgent || '')

  const onShortcut = (event: KeyboardEvent) => {
    if (event.key?.toLowerCase() !== 'o' || event.altKey || event.shiftKey) return
    if (!(isMac() ? event.metaKey : event.ctrlKey)) return
    event.preventDefault()
    if (switchOpen.value) switchOpen.value = false
    else openSwitch()
  }

  onMounted(() => {
    if (isMac()) shortcut.value = '⌘O'
    document.addEventListener('keydown', onShortcut)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', onShortcut)
    clearTimeout(loadTimer)
  })

  const ACCOUNT_BUTTON_CLASS =
    'flex h-10 w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'

  const ACCOUNT_BUTTON_COMPACT_CLASS =
    'flex h-7 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <div>
    <ShellConsole @sign-out="(event) => emit('sign-out', event)">
      <template #sidebar-header="{ compact }">
        <Tooltip
          v-if="!compact"
          :content="`Switch account (${shortcut})`"
          side="end"
          class="w-full"
        >
          <button
            type="button"
            :aria-label="`Account: ${currentAccount.name}. Switch account`"
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+O Meta+O"
            :class="ACCOUNT_BUTTON_CLASS"
            @click="openSwitch"
          >
            <Avatar
              :label="currentAccount.name"
              size="small"
              variant="square"
            />
            <span class="min-w-0 flex-1 truncate text-start text-label-sm text-(--text-default)">{{
              currentAccount.name
            }}</span>
            <i
              class="az az-sort shrink-0 text-body-xs text-(--text-muted)"
              aria-hidden="true"
            />
          </button>
        </Tooltip>
      </template>

      <template #header-leading="{ compact }">
        <Tooltip
          v-if="compact"
          :content="`Switch account (${shortcut})`"
          side="bottom"
        >
          <button
            type="button"
            :aria-label="`Account: ${currentAccount.name}. Switch account`"
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+O Meta+O"
            :class="ACCOUNT_BUTTON_COMPACT_CLASS"
            @click="openSwitch"
          >
            <Avatar
              :label="currentAccount.name"
              size="small"
              variant="square"
            />
            <i
              class="az az-chevron-down shrink-0 text-body-xs text-(--text-muted)"
              aria-hidden="true"
            />
          </button>
        </Tooltip>
      </template>
    </ShellConsole>

    <Dialog
      v-model:open="switchOpen"
      size="large"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Switch account</DialogTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <DialogDescription>
              Pick the account to work in. Search matches a name, an ID or a client ID.
            </DialogDescription>
            <Input
              :id="searchId"
              v-model="accountQuery"
              placeholder="Search accounts"
              aria-label="Search accounts"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
            <Alert
              v-if="error"
              severity="danger"
              size="medium"
              :label="error"
              action-label="Retry"
              @action="(event: MouseEvent) => emit('retry', event)"
            />
            <Card
              v-else
              :padded="false"
            >
              <template #default>
                <DataTable
                  :data="accountRows"
                  :columns="accountColumns"
                  row-key="id"
                  :bordered="false"
                  paginated
                  :page-size="10"
                  :loading="accountsLoading"
                  aria-label="Accounts"
                >
                  <template #cell-name="{ row }">
                    <div
                      :data-depth="row.depth"
                      class="flex w-full min-w-0 items-center gap-(--spacing-2xs) data-[depth=1]:ps-(--spacing-lg) data-[depth=2]:ps-(--spacing-2xl)"
                    >
                      <IconButton
                        v-if="row.hasChildren"
                        :icon="row.expanded ? 'az az-chevron-down' : 'az az-chevron-right'"
                        variant="ghost"
                        size="small"
                        :aria-label="row.expanded ? `Collapse ${row.name}` : `Expand ${row.name}`"
                        :aria-expanded="row.expanded"
                        :disabled="Boolean(accountQuery.trim())"
                        @click="toggleAccount(row)"
                      />
                      <span
                        v-else
                        class="size-7 shrink-0"
                        aria-hidden="true"
                      />
                      <i
                        :class="row.typeIcon"
                        class="shrink-0 text-body-sm text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <Button
                        :label="row.name"
                        variant="link"
                        size="small"
                        class="min-w-0"
                        :aria-current="row.id === currentAccountId ? 'true' : undefined"
                        @click="chooseAccount(row)"
                      />
                      <Tag
                        v-if="row.id === currentAccountId"
                        label="Current"
                        severity="success"
                        size="small"
                      />
                    </div>
                  </template>
                  <template #cell-typeLabel="{ row }">
                    <TableCellStatus
                      :label="row.typeLabel"
                      :icon="row.typeIcon"
                      :variant="row.typeVariant"
                      :severity="row.typeSeverity"
                    />
                  </template>
                  <template #cell-id="{ value }">
                    <TableCellId
                      :value="value"
                      resource="account"
                    />
                  </template>
                  <template #cell-clientId="{ value }">
                    <TableCellId
                      :value="value"
                      resource="client"
                    />
                  </template>
                  <template #empty>
                    <EmptyState
                      size="small"
                      icon="az az-search"
                      title="No accounts match your search"
                      :description="`Nothing in this tree matches “${accountQuery}”.`"
                    >
                      <template #actions>
                        <Button
                          label="Clear search"
                          variant="outline"
                          size="small"
                          @click="accountQuery = ''"
                        />
                      </template>
                    </EmptyState>
                  </template>
                </DataTable>
              </template>
            </Card>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full min-w-0 flex-wrap items-center gap-(--spacing-sm)">
            <div class="flex min-w-0 flex-1 items-center gap-(--spacing-sm)">
              <Avatar
                :label="currentAccount.name"
                size="medium"
                variant="square"
              />
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-label-sm text-(--text-default)">{{
                  currentAccount.name
                }}</span>
                <span class="text-body-xs text-(--text-muted)"
                  >Current · ID {{ currentAccount.id }} · Client ID
                  {{ currentAccount.clientId }}</span
                >
              </div>
            </div>
            <Button
              label="Account settings"
              variant="outline"
              size="medium"
              href="/settings"
            />
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
