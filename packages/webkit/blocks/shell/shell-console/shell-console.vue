<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayoutRoot, {
    type ConsoleLayoutNavGroup
  } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import HighlightButton from '@aziontech/webkit/highlight-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'

  export interface ShellConsoleProps {
    /** Accessible name of the tools region the tools slot fills. */
    toolsLabel?: string
  }

  withDefaults(defineProps<ShellConsoleProps>(), {
    toolsLabel: ''
  })

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const toolsOpen = defineModel<boolean>('toolsOpen', { default: false })

  defineSlots<{
    /** The page body; a stand-in list page when empty. */
    default(): unknown
    /** Header actions after Create and Agent. */
    actions(props: { compact: boolean }): unknown
    /** Content before the breadcrumbs in the header. */
    'header-leading'(props: { compact: boolean }): unknown
    /** Content under the wordmark in the rail. */
    'sidebar-header'(props: { compact: boolean }): unknown
    /** Flash messages above the page body. */
    notifications(): unknown
    /** The tools region beside the content. */
    tools(): unknown
  }>()

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

  const onAccountSelect = (event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'logout') emit('sign-out', event)
    else if (value === 'theme:system' || value === 'theme:dark' || value === 'theme:light')
      theme.value = value.slice('theme:'.length) as typeof theme.value
  }
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    :account="account"
    active-id="applications"
    v-model:tools-open="toolsOpen"
    :tools-label="toolsLabel"
    @search-select="onSearchSelect"
    @account-select="onAccountSelect"
  >
    <template
      v-if="$slots['sidebar-header']"
      #sidebar-header="{ compact }"
    >
      <slot
        name="sidebar-header"
        :compact="compact"
      />
    </template>

    <template
      v-if="$slots['header-leading']"
      #header-leading="{ compact }"
    >
      <slot
        name="header-leading"
        :compact="compact"
      />
    </template>

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
      <slot
        name="actions"
        :compact="compact"
      />
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
      <DropdownMenu.Group label="Theme">
        <DropdownMenu.Item
          value="theme:system"
          label="System"
          type="radio"
          :selected="theme === 'system'"
        >
          <template #trailing>
            <i
              class="az az-desktop"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          value="theme:dark"
          label="Dark"
          type="radio"
          :selected="theme === 'dark'"
        >
          <template #trailing>
            <i
              class="az az-moon"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
        <DropdownMenu.Item
          value="theme:light"
          label="Light"
          type="radio"
          :selected="theme === 'light'"
        >
          <template #trailing>
            <i
              class="az az-sun"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
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
        <DropdownMenu.Item
          value="upgrade"
          label="Upgrade to Pro"
        >
          <template #trailing>
            <i
              class="az az-sparkles"
              aria-hidden="true"
            />
          </template>
        </DropdownMenu.Item>
        <div class="flex justify-center px-(--spacing-xs) py-(--spacing-2xs)">
          <StatusIndicator
            severity="success"
            label="All systems operational"
          />
        </div>
      </DropdownMenu.Group>
    </template>

    <template
      v-if="$slots.notifications"
      #notifications
    >
      <slot name="notifications" />
    </template>

    <template
      v-if="$slots.tools"
      #tools
    >
      <slot name="tools" />
    </template>

    <slot>
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
    </slot>
    <Toaster position="bottom-end" />
  </ConsoleLayoutRoot>
</template>
