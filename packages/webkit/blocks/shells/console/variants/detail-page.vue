<script setup lang="ts">
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Select from '@aziontech/webkit/select'
  import type { SelectValue } from '@aziontech/webkit/select-root'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

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
          icon: 'pi pi-cog',
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

  const account = { name: 'Ana Souza', email: 'ana.souza@example.com' }

  const recents = [
    { id: 'azion-site', label: 'azion-site', icon: 'ai ai-edge-application', type: 'Application' },
    { id: 'edge-auth', label: 'edge-auth', icon: 'ai ai-edge-functions', type: 'Function' },
    { id: 'shop-assets', label: 'shop-assets', icon: 'ai ai-edge-storage', type: 'Bucket' }
  ]

  const theme = ref<ThemeSwitcherValue>('system')

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:theme') theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const leadingCrumbs = [
    { label: 'Applications', href: '/applications' },
    { label: 'azion-site', href: '/applications/azion-site' }
  ]

  const environments = [
    { name: 'Production', policy: 'Single' },
    { name: 'Preview', policy: 'Versioned' }
  ]

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const activeTab = ref('overview')
  const environment = ref('Production')
  const environmentQuery = ref('')

  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((entry) => entry.name.toLowerCase().includes(needle))
  })

  const environmentLabel = (value: unknown) => String(value ?? '')

  const pickEnvironment = (value: SelectValue) => {
    if (typeof value === 'string' && value !== '__create-environment__') environment.value = value
  }

  const onEnvironmentOpen = (open: boolean) => {
    if (!open) environmentQuery.value = ''
  }
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :account="account"
    active-id="applications"
    @search-select="onSearchSelect"
  >
    <template #breadcrumbs>
      <Breadcrumb class="w-full">
        <Breadcrumb.List>
          <template
            v-for="(item, index) in leadingCrumbs"
            :key="item.label + '-' + index"
          >
            <li class="inline-flex items-center">
              <Breadcrumb.Item
                :label="item.label"
                :href="item.href"
              />
            </li>
            <Breadcrumb.Separator />
          </template>
          <li class="inline-flex min-w-0 items-center">
            <div class="min-w-0">
              <Select
                :model-value="environment"
                :display-value="environmentLabel"
                size="small"
                class="w-full"
                @update:model-value="pickEnvironment"
                @update:open="onEnvironmentOpen"
              >
                <Select.Trigger aria-label="Switch environment" />
                <Select.Content>
                  <template #search>
                    <Input
                      v-model="environmentQuery"
                      size="small"
                      placeholder="Search environments"
                      aria-label="Search environments"
                      @keydown.stop
                    >
                      <template #iconLeft>
                        <i
                          class="pi pi-search"
                          aria-hidden="true"
                        />
                      </template>
                    </Input>
                  </template>
                  <Select.Group label="Environments">
                    <Select.Option
                      v-for="entry in environmentMatches"
                      :key="entry.name"
                      :value="entry.name"
                    >
                      {{ entry.name }}
                      <template #tag>
                        <Tag
                          :label="entry.policy"
                          severity="secondary"
                          size="small"
                        />
                      </template>
                    </Select.Option>
                    <p
                      v-if="!environmentMatches.length"
                      class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
                    >
                      No environments match "{{ environmentQuery }}".
                    </p>
                  </Select.Group>
                  <template #footer>
                    <Select.Option
                      value="__create-environment__"
                      class="w-full"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">
                        <i
                          class="pi pi-plus-circle"
                          aria-hidden="true"
                        />
                        Add Environment
                      </span>
                    </Select.Option>
                  </template>
                </Select.Content>
              </Select>
            </div>
          </li>
        </Breadcrumb.List>
      </Breadcrumb>
    </template>

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

    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
        <template #actions>
          <Button
            label="Deploy"
            kind="outlined"
            size="medium"
            icon="pi pi-cloud-upload"
          />
        </template>
      </PageTabs>
    </div>

    <div class="layout-boundary">
      <div class="layout-column flex min-w-0 flex-col">
        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
          <Card :padded="false">
            <template #content>
              <div
                class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
              >
                The page body: platform/detail/details-page
              </div>
            </template>
          </Card>
        </section>
      </div>
    </div>
  </ConsoleLayout>
</template>
