<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' }
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
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' }
      ]
    },
    {
      label: 'Store',
      items: [
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
      label: 'More',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
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
  <ConsoleLayout
    :navigation="navigation"
    :breadcrumbs="[{ label: 'Workloads', href: '/workloads' }, { label: 'edge-shop' }]"
    :account="{ name: 'Jane Doe', email: 'jane.doe@example.com' }"
    active-id="workloads"
    @account-select="onAccountSelect"
  >
    <template #actions="{ compact }">
      <Tooltip
        v-if="compact"
        text="Create"
        placement="bottom"
      >
        <IconButton
          icon="pi pi-plus-circle"
          kind="primary"
          size="medium"
          aria-label="Create"
        />
      </Tooltip>
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
    </template>

    <template #search="{ query }">
      <Command.Group
        v-if="!query"
        heading="Recents"
      >
        <Command.Item value="recent:edge-shop">edge-shop</Command.Item>
        <Command.Item value="recent:auth-handler">auth-handler</Command.Item>
      </Command.Group>
    </template>

    <template #account-menu>
      <DropdownMenu.Group>
        <DropdownMenu.Option
          value="settings"
          label="Account settings"
        />
        <DropdownMenu.Option
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
  </ConsoleLayout>
</template>
