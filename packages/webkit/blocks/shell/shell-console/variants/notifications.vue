<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayoutRoot, {
    type ConsoleLayoutNavGroup
  } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import HighlightButton from '@aziontech/webkit/highlight-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'
  import { computed, ref } from 'vue'

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'az az-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'az az-workloads', href: '/workloads' },
        {
          id: 'deployments',
          label: 'Deployments',
          icon: 'az az-deploy-pillar',
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
          icon: 'az az-applications',
          href: '/applications'
        },
        { id: 'functions', label: 'Functions', icon: 'az az-functions', href: '/functions' },
        { id: 'variables', label: 'Variables', icon: 'az az-variables', href: '/variables' },
        {
          id: 'connectors',
          label: 'Connectors',
          icon: 'az az-connectors',
          href: '/connectors'
        },
        {
          id: 'custom-pages',
          label: 'Custom Pages',
          icon: 'az az-custom-pages',
          href: '/custom-pages'
        }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'firewall', label: 'Firewall', icon: 'az az-firewall', href: '/firewall' },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'az az-edge-dns', href: '/edge-dns' },
        { id: 'waf-rules', label: 'WAF Rules', icon: 'az az-waf', href: '/waf-rules' },
        {
          id: 'certificate-manager',
          label: 'Certificate Manager',
          icon: 'az az-certificate-manager',
          href: '/certificate-manager'
        },
        {
          id: 'network-lists',
          label: 'Network Lists',
          icon: 'az az-network-lists',
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
          icon: 'az az-object-storage',
          href: '/object-storage'
        },
        {
          id: 'sql-database',
          label: 'SQL Database',
          icon: 'az az-sql-database',
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
          icon: 'az az-data-stream',
          href: '/data-stream'
        },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'az az-edge-pulse', href: '/edge-pulse' },
        {
          id: 'real-time-metrics',
          label: 'Real-Time Metrics',
          icon: 'az az-real-time-metrics',
          href: '/real-time-metrics'
        },
        {
          id: 'real-time-events',
          label: 'Real-Time Events',
          icon: 'az az-real-time-events',
          href: '/real-time-events'
        },
        {
          id: 'real-time-purge',
          label: 'Real-Time Purge',
          icon: 'az az-real-time-purge',
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
          icon: 'az az-marketplace',
          href: '/marketplace'
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'az az-settings',
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
    { id: 'azion-site', label: 'azion-site', icon: 'az az-applications', type: 'Application' },
    { id: 'edge-auth', label: 'edge-auth', icon: 'az az-functions', type: 'Function' },
    { id: 'shop-assets', label: 'shop-assets', icon: 'az az-object-storage', type: 'Bucket' }
  ]

  const { mode: theme } = useColorMode()

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:theme') theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  type NotificationKind = 'deploy-failed' | 'deploy-succeeded' | 'info'

  type Notification = {
    id: string
    kind: NotificationKind
    title: string
    description: string
    time: string
    read: boolean
  }

  const icons: Record<NotificationKind, string> = {
    'deploy-failed': 'az az-circle-x',
    'deploy-succeeded': 'az az-circle-check',
    info: 'az az-circle-info'
  }

  const PAGE_SIZE = 5

  const notifications = ref<Notification[]>([
    {
      id: 'run-4182',
      kind: 'deploy-failed',
      title: 'azion-site failed to deploy',
      description: 'The build stopped at step 3 of 5: a module could not be resolved.',
      time: '2 min ago',
      read: false
    },
    {
      id: 'run-4181',
      kind: 'deploy-succeeded',
      title: 'edge-auth is live',
      description: 'Deployed to production in 48 seconds.',
      time: '25 min ago',
      read: false
    },
    {
      id: 'invite-77',
      kind: 'info',
      title: 'Sam joined the team',
      description: 'Sam accepted your invitation and can now edit applications.',
      time: 'Yesterday',
      read: true
    }
  ])
  const notificationsOpen = ref(true)
  const flashOpen = ref(true)

  const unread = computed(() => notifications.value.filter((item) => !item.read).length)
  const bellLabel = computed(() =>
    unread.value ? `Notifications, ${unread.value} unread` : 'Notifications'
  )

  const markAllRead = () => {
    notifications.value = notifications.value.map((item) => ({ ...item, read: true }))
  }

  const shown = ref(PAGE_SIZE)
  const visibleNotifications = computed(() => notifications.value.slice(0, shown.value))
  const hiddenCount = computed(() => Math.max(notifications.value.length - shown.value, 0))

  const showOlder = () => {
    shown.value += PAGE_SIZE
  }

  const clearAll = () => {
    const cleared = notifications.value
    notifications.value = []
    toast.info('Notifications cleared.', {
      id: 'notifications-cleared',
      action: {
        label: 'Undo',
        onClick: () => {
          notifications.value = cleared
        }
      }
    })
  }

  const markRead = (id: string) => {
    notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, read: true } : item
    )
  }

  const onAccountSelect = (event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'logout') emit('sign-out', event)
  }
</script>

<template>
  <ConsoleLayoutRoot
    v-model:tools-open="notificationsOpen"
    :navigation="navigation"
    :account="account"
    active-id="applications"
    tools-label="Notifications"
    @search-select="onSearchSelect"
    @account-select="onAccountSelect"
  >
    <template #actions="{ compact }">
      <template v-if="compact">
        <Tooltip
          content="Create"
          side="bottom"
        >
          <IconButton
            icon="az az-circle-plus"
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
            icon="az az-ask-azion"
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
          icon="az az-circle-plus"
        />
        <HighlightButton
          label="Agent"
          size="medium"
          icon="az az-ask-azion"
        />
      </template>
      <span class="relative inline-flex">
        <Tooltip
          content="Notifications"
          side="bottom"
        >
          <IconButton
            icon="az az-bell"
            variant="outline"
            size="medium"
            :aria-label="bellLabel"
            :aria-pressed="notificationsOpen"
            @click="notificationsOpen = !notificationsOpen"
          />
        </Tooltip>
        <span
          v-if="unread"
          aria-hidden="true"
          class="pointer-events-none absolute -end-(--spacing-2xs) -top-(--spacing-2xs)"
        >
          <Badge
            :label="String(unread)"
            severity="danger"
            size="small"
          />
        </span>
      </span>
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
              class="az az-circle-plus"
              aria-hidden="true"
            />
          </template>
          Create Application
        </Command.Item>
        <Command.Item value="action:theme">
          <template #leading>
            <i
              class="az az-moon"
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
              class="az az-settings"
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
              class="az az-key"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
        <div
          class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-2xs)"
        >
          <span class="flex-1 truncate text-start text-label-sm text-(--text-default)">Theme</span>
          <ThemeSwitcher
            v-model="theme"
            size="small"
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
              class="az az-book"
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
              class="az az-log-out"
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

    <template #notifications>
      <Alert
        v-if="flashOpen"
        severity="danger"
        closable
        @close="flashOpen = false"
      >
        azion-site failed to deploy. The version that was live keeps serving traffic.
        <template #actions>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Button
              label="Edit"
              variant="outline"
              size="small"
            />
            <Button
              label="Redeploy"
              variant="primary"
              size="small"
              icon="az az-refresh"
            />
          </div>
        </template>
      </Alert>
    </template>

    <template #tools>
      <section
        aria-label="Notification list"
        class="flex min-h-full flex-col"
      >
        <div
          v-if="notifications.length"
          class="flex shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)"
        >
          <span class="text-label-sm text-(--text-muted)">{{ unread }} unread</span>
          <div class="flex items-center gap-(--spacing-2xs)">
            <Button
              label="Mark all as read"
              variant="ghost"
              size="small"
              :disabled="!unread"
              @click="markAllRead"
            />
            <Button
              label="Clear all"
              variant="ghost"
              size="small"
              @click="clearAll"
            />
          </div>
        </div>

        <Item.List
          v-if="notifications.length"
          aria-label="Notifications"
        >
          <Item
            v-for="item in visibleNotifications"
            :key="item.id"
            size="small"
          >
            <Item.Media type="icon">
              <i
                :class="icons[item.kind]"
                :data-type="item.kind"
                class="data-[type=deploy-failed]:text-(--danger) data-[type=deploy-succeeded]:text-(--success) data-[type=info]:text-(--text-muted)"
                aria-hidden="true"
              />
            </Item.Media>
            <Item.Content>
              <Item.Title>
                <span
                  v-if="!item.read"
                  class="sr-only"
                  >Unread:
                </span>
                {{ item.title }}
                <Tag
                  v-if="!item.read"
                  label="New"
                  severity="info"
                  size="small"
                  aria-hidden="true"
                />
              </Item.Title>
              <Item.Description>{{ item.description }}</Item.Description>
              <span class="text-label-sm text-(--text-muted)">{{ item.time }}</span>
              <Item.Actions v-if="item.kind !== 'info'">
                <Button
                  label="Edit"
                  variant="outline"
                  size="small"
                  @click="markRead(item.id)"
                />
                <Button
                  label="Redeploy"
                  variant="outline"
                  size="small"
                  icon="az az-refresh"
                  @click="markRead(item.id)"
                />
              </Item.Actions>
            </Item.Content>
          </Item>
        </Item.List>
        <div
          v-if="hiddenCount"
          class="flex justify-center px-(--spacing-md) py-(--spacing-xs)"
        >
          <Button
            :label="`Show ${Math.min(hiddenCount, PAGE_SIZE)} older`"
            variant="ghost"
            size="small"
            @click="showOlder"
          />
        </div>

        <div
          v-else
          class="flex flex-1 items-center justify-center p-(--spacing-md)"
        >
          <EmptyState
            title="You are all caught up"
            description="Deploys, invitations and alerts for this account show up here."
            icon="az az-bell"
            size="small"
          />
        </div>
      </section>
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
              icon="az az-book"
              variant="outline"
              size="medium"
              href="https://www.azion.com/en/documentation/"
              target="_blank"
            />
            <Button
              label="Create Application"
              icon="az az-plus"
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
              The page body: view/view-table
            </div>
          </template>
        </Card>
      </div>
    </div>
  </ConsoleLayoutRoot>
  <Toaster position="bottom-end" />
</template>
