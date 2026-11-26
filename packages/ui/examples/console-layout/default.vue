<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Command from '@aziontech/ui/command'
  import ConsoleLayoutRoot, { type ConsoleLayoutNavGroup } from '@aziontech/ui/console-layout-root'
  import DropdownMenu from '@aziontech/ui/dropdown-menu'
  import EmptyState from '@aziontech/ui/empty-state'
  import HighlightButton from '@aziontech/ui/highlight-button'
  import IconButton from '@aziontech/ui/icon-button'
  import PageHeader from '@aziontech/ui/page-header'
  import Tooltip from '@aziontech/ui/tooltip'
  import { ref } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'az az-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'az az-workloads', href: '/workloads' }
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
        { id: 'functions', label: 'Functions', icon: 'az az-functions', href: '/functions' }
      ]
    },
    {
      label: 'Store',
      items: [
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
      label: 'More',
      items: [
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
                { id: 'settings-users', label: 'Users management', href: '/settings/users' }
              ]
            }
          ]
        }
      ]
    }
  ]

  const accountAction = ref('')

  const onAccountSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    accountAction.value =
      value === 'logout' ? 'Signing out of Acme Inc.' : 'Opening account settings'
  }
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    :breadcrumbs="[{ label: 'Workloads', href: '/workloads' }, { label: 'edge-shop' }]"
    :account="{ name: 'Jane Doe', email: 'jane.doe@example.com' }"
    active-id="workloads"
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
    </template>

    <template #search="{ query }">
      <Command.Group
        v-if="!query"
        label="Recents"
      >
        <Command.Item value="recent:edge-shop">edge-shop</Command.Item>
        <Command.Item value="recent:auth-handler">auth-handler</Command.Item>
      </Command.Group>
    </template>

    <template #account-menu>
      <DropdownMenu.Group>
        <DropdownMenu.Item
          value="settings"
          label="Account settings"
        />
        <DropdownMenu.Item
          value="logout"
          label="Log out"
        />
      </DropdownMenu.Group>
    </template>

    <div class="layout-boundary">
      <div class="layout-column flex flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="edge-shop"
          description="The workload that serves the storefront."
        />
        <p
          v-if="accountAction"
          role="status"
          class="text-body-sm text-(--text-muted)"
        >
          {{ accountAction }}
        </p>
        <EmptyState
          title="No deployments yet"
          description="Deploy the workload to see its history here."
        />
      </div>
    </div>
  </ConsoleLayoutRoot>
</template>
