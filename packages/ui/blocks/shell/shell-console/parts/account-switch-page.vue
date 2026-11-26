<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import DialogContent from '@aziontech/ui/dialog-content'
  import DialogDescription from '@aziontech/ui/dialog-description'
  import Dialog from '@aziontech/ui/dialog-root'
  import DialogTitle from '@aziontech/ui/dialog-title'
  import Input from '@aziontech/ui/input'
  import Item from '@aziontech/ui/item-root'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelFooter from '@aziontech/ui/panel-footer'
  import PanelHeader from '@aziontech/ui/panel-header'
  import { toast } from '@aziontech/ui/toast'
  import Tooltip from '@aziontech/ui/tooltip'
  import { computed, nextTick, onMounted, onUnmounted, ref, useId } from 'vue'

  import {
    sampleAccountTypes as accountTypes,
    sampleSwitchAccounts as accounts,
    type ShellConsoleSwitchAccount as Account
  } from '../sample'
  import ShellConsole from '../shell-console.vue'
  import AccountSwitchTable, {
    type ShellConsoleAccountRow as AccountRow
  } from './account-switch-table.vue'

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
          <Item
            clickable
            variant="option"
            :aria-label="`Account: ${currentAccount.name}. Switch account`"
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+O Meta+O"
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
          </Item>
        </Tooltip>
      </template>

      <template #header-leading="{ compact }">
        <Tooltip
          v-if="compact"
          :content="`Switch account (${shortcut})`"
          side="bottom"
        >
          <Button
            variant="ghost"
            size="small"
            icon="az az-chevron-down"
            icon-position="trailing"
            :aria-label="`Account: ${currentAccount.name}. Switch account`"
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+O Meta+O"
            @click="openSwitch"
          >
            <template #leading>
              <Avatar
                :label="currentAccount.name"
                size="small"
                variant="square"
              />
            </template>
          </Button>
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
            <AccountSwitchTable
              v-else
              v-model:query="accountQuery"
              :rows="accountRows"
              :loading="accountsLoading"
              :current-id="currentAccountId"
              @toggle="(_event, row) => toggleAccount(row)"
              @choose="(_event, row) => chooseAccount(row)"
            />
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
