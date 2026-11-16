<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DataTable from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import HighlightButton from '@aziontech/webkit/highlight-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Table from '@aziontech/webkit/table'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'
  import { computed, nextTick, onMounted, onUnmounted, ref, useId } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'ai ai-deploy-pillar',
          href: '/deployments'
        }
      ]
    },
    {
      label: 'Build',
      items: [
        {
          id: 'applications',
          label: 'Applications',
          icon: 'ai ai-edge-application',
          href: '/applications'
        },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' },
        { id: 'variables', label: 'Variables', icon: 'ai ai-variables', href: '/variables' },
        {
          id: 'connectors',
          label: 'Connectors',
          icon: 'ai ai-edge-connectors',
          href: '/connectors'
        },
        {
          id: 'custom-pages',
          label: 'Custom Pages',
          icon: 'ai ai-custom-pages',
          href: '/custom-pages'
        }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'firewall', label: 'Firewall', icon: 'ai ai-edge-firewall', href: '/firewall' },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns', href: '/edge-dns' },
        { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules', href: '/waf-rules' },
        {
          id: 'certificate-manager',
          label: 'Certificate Manager',
          icon: 'ai ai-certificate-manager',
          href: '/certificate-manager'
        },
        {
          id: 'network-lists',
          label: 'Network Lists',
          icon: 'ai ai-network-lists',
          href: '/network-lists'
        }
      ]
    },
    {
      label: 'Store',
      items: [
        {
          id: 'object-storage',
          label: 'Object Storage',
          icon: 'ai ai-edge-storage',
          href: '/object-storage'
        },
        {
          id: 'sql-database',
          label: 'SQL Database',
          icon: 'ai ai-edge-sql',
          href: '/sql-database',
          tagValue: 'Preview'
        }
      ]
    },
    {
      label: 'Observe',
      items: [
        {
          id: 'data-stream',
          label: 'Data Stream',
          icon: 'ai ai-data-stream',
          href: '/data-stream'
        },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse', href: '/edge-pulse' },
        {
          id: 'real-time-metrics',
          label: 'Real-Time Metrics',
          icon: 'ai ai-real-time-metrics',
          href: '/real-time-metrics'
        },
        {
          id: 'real-time-events',
          label: 'Real-Time Events',
          icon: 'ai ai-real-time-events',
          href: '/real-time-events'
        },
        {
          id: 'real-time-purge',
          label: 'Real-Time Purge',
          icon: 'ai ai-real-time-purge',
          href: '/real-time-purge'
        }
      ]
    },
    {
      label: 'More',
      items: [
        {
          id: 'marketplace',
          label: 'Marketplace',
          icon: 'ai ai-marketplace',
          href: '/marketplace'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'ai ai-settings',
          type: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', href: '/settings' },
                {
                  id: 'settings-build',
                  label: 'Build and deployment',
                  href: '/settings/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  href: '/settings/environments'
                },
                { id: 'settings-users', label: 'Users management', href: '/settings/users' },
                { id: 'settings-teams', label: 'Teams and permissions', href: '/settings/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', href: '/settings/tokens' },
                { id: 'settings-credentials', label: 'Credentials', href: '/settings/credentials' },
                { id: 'settings-mfa', label: 'Multi-factor auth', href: '/settings/mfa' },
                { id: 'settings-sessions', label: 'Active sessions', href: '/settings/sessions' },
                { id: 'settings-activity', label: 'Activity history', href: '/settings/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', href: '/settings/billing' },
                { id: 'settings-invoices', label: 'Invoices', href: '/settings/invoices' }
              ]
            }
          ]
        }
      ]
    }
  ]

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }

  const recents = [
    { id: 'azion-site', label: 'azion-site', icon: 'ai ai-edge-application', type: 'Application' },
    { id: 'edge-auth', label: 'edge-auth', icon: 'ai ai-edge-functions', type: 'Function' },
    { id: 'shop-assets', label: 'shop-assets', icon: 'ai ai-edge-storage', type: 'Bucket' }
  ]

  const { mode: theme } = useColorMode()

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:theme') theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

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

  const accountTypes: Record<AccountType, AccountTypeMeta> = {
    organization: { label: 'Organization', icon: 'ai ai-building', variant: 'primary' },
    group: { label: 'Group', icon: 'ai ai-users', severity: 'info' },
    workspace: { label: 'Workspace', icon: 'ai ai-layout-grid', severity: 'neutral' }
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
  const switchOpen = ref(true)
  const loadFailed = ref(true)
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

  const retryLoad = () => {
    loadFailed.value = false
  }

  const toggleAccount = (row: AccountRow) => {
    const next = new Set(collapsed.value)
    if (next.has(row.id)) next.delete(row.id)
    else next.add(row.id)
    collapsed.value = next
  }

  const openSwitch = () => {
    accountQuery.value = ''
    switchOpen.value = true
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

  onUnmounted(() => document.removeEventListener('keydown', onShortcut))
</script>

<template>
  <div>
    <ConsoleLayout
      :navigation="navigation"
      :account="account"
      active-id="applications"
      @search-select="onSearchSelect"
    >
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
            class="flex h-10 w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
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
              class="ai ai-sort shrink-0 text-body-xs text-(--text-muted)"
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
            class="flex h-7 min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="openSwitch"
          >
            <Avatar
              :label="currentAccount.name"
              size="small"
              variant="square"
            />
            <i
              class="ai ai-chevron-down shrink-0 text-body-xs text-(--text-muted)"
              aria-hidden="true"
            />
          </button>
        </Tooltip>
      </template>

      <template #actions="{ compact }">
        <template v-if="compact">
          <Tooltip
            content="Create"
            side="bottom"
          >
            <IconButton
              icon="ai ai-circle-plus"
              variant="primary"
              size="medium"
              aria-label="Create"
            />
          </Tooltip>
          <Tooltip
            content="Agent"
            side="bottom"
          >
            <IconButton
              icon="ai ai-ask-azion"
              variant="outline"
              size="medium"
              aria-label="Agent"
            />
          </Tooltip>
        </template>
        <template v-else>
          <Button
            label="Create"
            variant="primary"
            size="medium"
            icon="ai ai-circle-plus"
          />
          <HighlightButton
            label="Agent"
            size="medium"
            icon="ai ai-ask-azion"
          />
        </template>
      </template>

      <template #search="{ query }">
        <Command.Group
          v-if="!query"
          label="Recents"
        >
          <Command.Item
            v-for="row in recents"
            :key="row.id"
            :value="`recent:${row.id}`"
          >
            <template #leading>
              <i
                :class="row.icon"
                aria-hidden="true"
              />
            </template>
            {{ row.label }}
            <template #trailing>
              <span class="text-label-sm text-(--text-muted)">{{ row.type }}</span>
            </template>
          </Command.Item>
        </Command.Group>
        <Command.Group label="Actions">
          <Command.Item value="action:create">
            <template #leading>
              <i
                class="ai ai-circle-plus"
                aria-hidden="true"
              />
            </template>
            Create Application
          </Command.Item>
          <Command.Item value="action:theme">
            <template #leading>
              <i
                class="ai ai-moon"
                aria-hidden="true"
              />
            </template>
            Switch theme
          </Command.Item>
        </Command.Group>
      </template>

      <template #account-menu>
        <DropdownMenu.Group>
          <template #header>
            <div class="flex min-w-0 flex-col">
              <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
              <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
            </div>
          </template>
          <DropdownMenu.Item
            value="settings"
            label="Account settings"
          >
            <template #trailing>
              <i
                class="ai ai-settings"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="personal-tokens"
            label="Personal tokens"
          >
            <template #trailing>
              <i
                class="ai ai-key"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <div
            class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-2xs)"
          >
            <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
              >Theme</span
            >
            <ThemeSwitcher
              v-model="theme"
              aria-label="Theme"
            />
          </div>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            value="docs"
            label="Docs"
          >
            <template #trailing>
              <i
                class="ai ai-book"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="logout"
            label="Log out"
          >
            <template #trailing>
              <i
                class="ai ai-log-out"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-2xs) py-(--spacing-2xs)">
            <Button
              label="Upgrade to Pro"
              variant="secondary"
              size="medium"
              class="w-full"
            />
            <div class="flex justify-center px-(--spacing-xs)">
              <StatusIndicator
                severity="success"
                label="All systems operational"
              />
            </div>
          </div>
        </DropdownMenu.Group>
      </template>

      <div class="layout-boundary">
        <div class="layout-column flex flex-col gap-(--layout-group-gap)">
          <PageHeader
            title="Applications"
            description="Build, deploy, and manage your applications."
          >
            <template #actions>
              <Button
                label="Documentation"
                icon="ai ai-book"
                variant="outline"
                size="medium"
                href="https://www.azion.com/en/documentation/"
                target="_blank"
              />
              <Button
                label="Create Application"
                icon="ai ai-plus"
                variant="outline"
                size="medium"
              />
            </template>
          </PageHeader>

          <Card :padded="false">
            <template #default>
              <div
                class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
              >
                The page body: view/table-view
              </div>
            </template>
          </Card>
        </div>
      </div>
    </ConsoleLayout>

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
                  class="ai ai-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
            <Alert
              v-if="loadFailed"
              severity="danger"
              size="medium"
              label="The account list could not be loaded."
              action-label="Retry"
              @action="retryLoad"
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
                  aria-label="Accounts"
                >
                  <template #cell-name="{ row }">
                    <div
                      :data-depth="row.depth"
                      class="flex w-full min-w-0 items-center gap-(--spacing-2xs) data-[depth=1]:ps-(--spacing-lg) data-[depth=2]:ps-(--spacing-2xl)"
                    >
                      <IconButton
                        v-if="row.hasChildren"
                        :icon="row.expanded ? 'ai ai-chevron-down' : 'ai ai-chevron-right'"
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
                    <Table.CellStatus
                      :label="row.typeLabel"
                      :icon="row.typeIcon"
                      :variant="row.typeVariant"
                      :severity="row.typeSeverity"
                    />
                  </template>
                  <template #cell-id="{ value }">
                    <Table.CellId
                      :value="value"
                      resource="account"
                    />
                  </template>
                  <template #cell-clientId="{ value }">
                    <Table.CellId
                      :value="value"
                      resource="client"
                    />
                  </template>
                  <template #empty>
                    <EmptyState
                      size="small"
                      icon="ai ai-search"
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

    <Toaster position="bottom-right" />
  </div>
</template>
