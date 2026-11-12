<script setup>
  import Alert from '@aziontech/webkit/alert'
  import Badge from '@aziontech/webkit/badge'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  const navigation = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', to: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', to: '/workloads' },
        { id: 'deployments', label: 'Deployments', icon: 'ai ai-deploy-pillar', to: '/deployments' }
      ]
    },
    {
      label: 'Build',
      items: [
        {
          id: 'applications',
          label: 'Applications',
          icon: 'ai ai-edge-application',
          to: '/applications'
        },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', to: '/functions' },
        { id: 'variables', label: 'Variables', icon: 'ai ai-variables', to: '/variables' },
        { id: 'connectors', label: 'Connectors', icon: 'ai ai-edge-connectors', to: '/connectors' },
        {
          id: 'custom-pages',
          label: 'Custom Pages',
          icon: 'ai ai-custom-pages',
          to: '/custom-pages'
        }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'firewall', label: 'Firewall', icon: 'ai ai-edge-firewall', to: '/firewall' },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns', to: '/edge-dns' },
        { id: 'waf-rules', label: 'WAF Rules', icon: 'ai ai-waf-rules', to: '/waf-rules' },
        {
          id: 'certificate-manager',
          label: 'Certificate Manager',
          icon: 'ai ai-certificate-manager',
          to: '/certificate-manager'
        },
        {
          id: 'network-lists',
          label: 'Network Lists',
          icon: 'ai ai-network-lists',
          to: '/network-lists'
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
          to: '/object-storage'
        },
        {
          id: 'sql-database',
          label: 'SQL Database',
          icon: 'ai ai-edge-sql',
          to: '/sql-database',
          tagValue: 'Preview'
        }
      ]
    },
    {
      label: 'Observe',
      items: [
        { id: 'data-stream', label: 'Data Stream', icon: 'ai ai-data-stream', to: '/data-stream' },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse', to: '/edge-pulse' },
        {
          id: 'real-time-metrics',
          label: 'Real-Time Metrics',
          icon: 'ai ai-real-time-metrics',
          to: '/real-time-metrics'
        },
        {
          id: 'real-time-events',
          label: 'Real-Time Events',
          icon: 'ai ai-real-time-events',
          to: '/real-time-events'
        },
        {
          id: 'real-time-purge',
          label: 'Real-Time Purge',
          icon: 'ai ai-real-time-purge',
          to: '/real-time-purge'
        }
      ]
    },
    {
      label: 'More',
      items: [
        { id: 'marketplace', label: 'Marketplace', icon: 'ai ai-marketplace', to: '/marketplace' },
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', to: '/settings' },
                {
                  id: 'settings-build',
                  label: 'Build and deployment',
                  to: '/settings/build-deployment'
                },
                {
                  id: 'settings-environments',
                  label: 'Environments',
                  to: '/settings/environments'
                },
                { id: 'settings-users', label: 'Users management', to: '/settings/users' },
                { id: 'settings-teams', label: 'Teams and permissions', to: '/settings/teams' }
              ]
            },
            {
              label: 'Access',
              items: [
                { id: 'settings-tokens', label: 'Personal tokens', to: '/settings/tokens' },
                { id: 'settings-credentials', label: 'Credentials', to: '/settings/credentials' },
                { id: 'settings-mfa', label: 'Multi-factor auth', to: '/settings/mfa' },
                { id: 'settings-sessions', label: 'Active sessions', to: '/settings/sessions' },
                { id: 'settings-activity', label: 'Activity history', to: '/settings/activity' }
              ]
            },
            {
              label: 'Billing',
              items: [
                { id: 'settings-billing', label: 'Billing and plan', to: '/settings/billing' },
                { id: 'settings-invoices', label: 'Invoices', to: '/settings/invoices' }
              ]
            }
          ]
        }
      ]
    }
  ]

  const account = { name: 'Ana Souza', email: 'ana.souza@example.com' }

  const recents = [
    { id: 'azion-site', label: 'azion-site', icon: 'ai ai-edge-application', type: 'Application' },
    { id: 'edge-auth', label: 'edge-auth', icon: 'ai ai-edge-functions', type: 'Function' },
    { id: 'shop-assets', label: 'shop-assets', icon: 'ai ai-edge-storage', type: 'Bucket' }
  ]

  const theme = ref('system')
  const search = ref('')

  const onSearchSelect = (_event, value) => {
    if (value === 'action:theme') theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const icons = {
    'deploy-failed': { icon: 'pi pi-times-circle', tone: 'text-(--danger)' },
    'deploy-succeeded': { icon: 'pi pi-check-circle', tone: 'text-(--success)' },
    info: { icon: 'pi pi-info-circle', tone: 'text-(--text-muted)' }
  }

  const notifications = ref([
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

  const clearAll = () => {
    notifications.value = []
  }

  const markRead = (id) => {
    notifications.value = notifications.value.map((item) =>
      item.id === id ? { ...item, read: true } : item
    )
  }
</script>

<template>
  <ConsoleLayout
    v-model:tools-open="notificationsOpen"
    :navigation="navigation"
    :account="account"
    active-id="applications"
    tools-label="Notifications"
    @search-select="onSearchSelect"
  >
    <template #actions="{ compact }">
      <template v-if="compact">
        <Tooltip
          text="Create"
          placement="bottom"
        >
          <IconButton
            icon="pi pi-plus-circle"
            kind="primary"
            size="medium"
            ariaLabel="Create"
          />
        </Tooltip>
        <Tooltip
          text="Agent"
          placement="bottom"
        >
          <IconButton
            icon="ai ai-ask-azion"
            kind="outlined"
            size="medium"
            ariaLabel="Agent"
          />
        </Tooltip>
      </template>
      <template v-else>
        <Button
          label="Create"
          kind="primary"
          size="medium"
          icon="pi pi-plus-circle"
        />
        <ButtonHighlight
          label="Agent"
          size="medium"
          icon="ai ai-ask-azion"
        />
      </template>
      <span class="relative inline-flex">
        <Tooltip
          text="Notifications"
          placement="bottom"
        >
          <IconButton
            icon="pi pi-bell"
            kind="outlined"
            size="medium"
            :ariaLabel="bellLabel"
            :aria-pressed="notificationsOpen"
            @click="notificationsOpen = !notificationsOpen"
          />
        </Tooltip>
        <span
          v-if="unread"
          aria-hidden="true"
          class="pointer-events-none absolute -end-(--spacing-xxs) -top-(--spacing-xxs)"
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
        heading="Recents"
      >
        <Command.Item
          v-for="row in recents"
          :key="row.id"
          :value="`recent:${row.id}`"
        >
          <template #prefix>
            <i
              :class="row.icon"
              aria-hidden="true"
            />
          </template>
          {{ row.label }}
          <template #suffix>
            <span class="text-label-sm text-(--text-muted)">{{ row.type }}</span>
          </template>
        </Command.Item>
      </Command.Group>
      <Command.Group heading="Actions">
        <Command.Item value="action:create">
          <template #prefix>
            <i
              class="pi pi-plus-circle"
              aria-hidden="true"
            />
          </template>
          Create Application
        </Command.Item>
        <Command.Item value="action:theme">
          <template #prefix>
            <i
              class="pi pi-moon"
              aria-hidden="true"
            />
          </template>
          Switch theme
        </Command.Item>
      </Command.Group>
    </template>

    <template #account-menu>
      <DropdownMenu.Group>
        <template #top>
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
            <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
          </div>
        </template>
        <DropdownMenu.Option
          value="settings"
          label="Account settings"
        >
          <template #right>
            <i
              class="pi pi-cog"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Option>
        <DropdownMenu.Option
          value="personal-tokens"
          label="Personal tokens"
        >
          <template #right>
            <i
              class="pi pi-key"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Option>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
        <div
          class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs)"
        >
          <span class="flex-1 truncate text-start text-label-sm text-(--text-default)">Theme</span>
          <ThemeSwitcher
            v-model="theme"
            aria-label="Theme"
          />
        </div>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
        <DropdownMenu.Option
          value="docs"
          label="Docs"
        >
          <template #right>
            <i
              class="pi pi-book"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Option>
        <DropdownMenu.Option
          value="logout"
          label="Log out"
        >
          <template #right>
            <i
              class="pi pi-sign-out"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Option>
      </DropdownMenu.Group>
      <DropdownMenu.Group>
        <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-xxs) py-(--spacing-xxs)">
          <Button
            label="Upgrade to Pro"
            kind="secondary"
            size="medium"
            class="w-full"
          />
          <div class="flex justify-center px-(--spacing-xs)">
            <StatusIndicator
              severity="success"
              label="All systems normal"
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
        <template #action>
          <div class="flex shrink-0 items-center gap-(--spacing-xs)">
            <Button
              label="Edit"
              kind="outlined"
              size="small"
            />
            <Button
              label="Redeploy"
              kind="primary"
              size="small"
              icon="pi pi-refresh"
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
          <div class="flex items-center gap-(--spacing-xxs)">
            <Button
              label="Mark all as read"
              kind="transparent"
              size="small"
              :disabled="!unread"
              @click="markAllRead"
            />
            <Button
              label="Clear all"
              kind="transparent"
              size="small"
              @click="clearAll"
            />
          </div>
        </div>

        <ul
          v-if="notifications.length"
          class="m-0 flex list-none flex-col p-0"
        >
          <li
            v-for="item in notifications"
            :key="item.id"
            :data-unread="!item.read || null"
            class="flex gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm) data-[unread]:bg-(--bg-surface-raised)"
          >
            <i
              :class="`${icons[item.kind].icon} ${icons[item.kind].tone}`"
              class="mt-(--spacing-xxs) shrink-0"
              aria-hidden="true"
            />
            <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
              <p class="m-0 text-label-md text-(--text-default)">
                <span
                  v-if="!item.read"
                  class="sr-only"
                  >Unread:
                </span>
                {{ item.title }}
              </p>
              <p class="m-0 text-body-sm text-(--text-muted)">{{ item.description }}</p>
              <span class="text-label-sm text-(--text-muted)">{{ item.time }}</span>
              <div
                v-if="item.kind !== 'info'"
                class="flex flex-wrap items-center gap-(--spacing-xs) pt-(--spacing-xxs)"
              >
                <Button
                  label="Edit"
                  kind="outlined"
                  size="small"
                  @click="markRead(item.id)"
                />
                <Button
                  label="Redeploy"
                  kind="outlined"
                  size="small"
                  icon="pi pi-refresh"
                  @click="markRead(item.id)"
                />
              </div>
            </div>
          </li>
        </ul>

        <div
          v-else
          class="flex flex-1 items-center justify-center p-(--spacing-md)"
        >
          <EmptyState
            title="You are all caught up"
            description="Deploys, invitations and alerts for this account show up here."
            icon="pi pi-bell"
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
              icon="pi pi-book"
              kind="outlined"
              size="medium"
              href="https://www.azion.com/en/documentation/"
              target="_blank"
            />
            <Button
              label="Create Application"
              icon="pi pi-plus"
              kind="outlined"
              size="medium"
            />
          </template>
        </PageHeader>

        <div class="flex items-center gap-(--spacing-xs)">
          <Button
            label="Filter"
            kind="outlined"
            size="medium"
            icon="pi pi-filter"
          />
          <div class="flex min-w-0 flex-1">
            <Input
              v-model="search"
              size="medium"
              placeholder="Search"
              aria-label="Search applications"
              class="w-full"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
          <Tooltip text="Refresh">
            <IconButton
              icon="pi pi-refresh"
              kind="outlined"
              size="medium"
              ariaLabel="Refresh"
            />
          </Tooltip>
          <Tooltip text="Download CSV">
            <IconButton
              icon="pi pi-download"
              kind="outlined"
              size="medium"
              ariaLabel="Download CSV"
            />
          </Tooltip>
          <Tooltip text="Columns">
            <IconButton
              icon="ai ai-column"
              kind="outlined"
              size="medium"
              ariaLabel="Columns"
            />
          </Tooltip>
        </div>

        <Card :padded="false">
          <template #content>
            <div
              class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
            >
              The page body: platform/view/table-view
            </div>
          </template>
        </Card>
      </div>
    </div>
  </ConsoleLayout>
</template>
