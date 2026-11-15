<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'

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
          kind: 'drill',
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
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :account="account"
    active-id="applications"
    @search-select="onSearchSelect"
  >
    <template #actions="{ compact }">
      <template v-if="compact">
        <Tooltip
          text="Create"
          placement="bottom"
        >
          <IconButton
            icon="ai ai-circle-plus"
            kind="primary"
            size="medium"
            aria-label="Create"
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
            aria-label="Agent"
          />
        </Tooltip>
      </template>
      <template v-else>
        <Button
          label="Create"
          kind="primary"
          size="medium"
          icon="ai ai-circle-plus"
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
              class="ai ai-circle-plus"
              aria-hidden="true"
            />
          </template>
          Create Application
        </Command.Item>
        <Command.Item value="action:theme">
          <template #prefix>
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
        <template #top>
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
          <span class="flex-1 truncate text-start text-label-sm text-(--text-default)">Theme</span>
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
            kind="secondary"
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
              kind="outlined"
              size="medium"
              href="https://www.azion.com/en/documentation/"
              target="_blank"
            />
            <Button
              label="Create Application"
              icon="ai ai-plus"
              kind="outlined"
              size="medium"
            />
          </template>
        </PageHeader>

        <Card :padded="false">
          <template #content>
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
</template>
