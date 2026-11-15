<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Select from '@aziontech/webkit/select'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        {
          id: 'applications',
          label: 'Applications',
          icon: 'ai ai-edge-application',
          href: '/applications'
        }
      ]
    }
  ]

  const environments = [
    { value: 'production', label: 'Production', policy: 'Single' },
    { value: 'preview', label: 'Preview', policy: 'Versioned' }
  ]

  const environment = ref('production')
  const tab = ref('overview')
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :breadcrumbs="[{ label: 'Applications', href: '/applications' }]"
    active-id="applications"
  >
    <ConsoleLayout.Breadcrumb
      :items="[
        { label: 'Applications', href: '/applications' },
        { label: 'azion-site', href: '/applications/azion-site' }
      ]"
    >
      <Select
        v-model="environment"
        variant="ghost"
        size="small"
        :display-value="(value) => environments.find((entry) => entry.value === value)?.label ?? ''"
      >
        <Select.Trigger aria-label="Switch environment" />
        <Select.Content>
          <Select.Group label="Environments">
            <Select.Item
              v-for="entry in environments"
              :key="entry.value"
              :value="entry.value"
            >
              {{ entry.label }}
              <template #tag>
                <Tag
                  :label="entry.policy"
                  severity="neutral"
                  size="small"
                />
              </template>
            </Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumb>

    <PageTabs v-model="tab">
      <Tabs.Trigger
        value="overview"
        label="Overview"
      />
      <Tabs.Trigger
        value="settings"
        label="Settings"
      />
    </PageTabs>
    <div class="layout-boundary">
      <div class="layout-column flex flex-col">
        <Card>
          <template #default>
            <p class="m-0 text-body-sm text-(--text-muted)">
              The page owns its trail and ends it on the environment it shows.
            </p>
          </template>
        </Card>
      </div>
    </div>
  </ConsoleLayout>
</template>
