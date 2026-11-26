<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import IconButton from '@aziontech/ui/icon-button'
  import PageTabs from '@aziontech/ui/page-tabs'
  import Tabs from '@aziontech/ui/tabs'
  import Tooltip from '@aziontech/ui/tooltip'
  import { ref } from 'vue'

  import EnvironmentBreadcrumb from '../parts/environment-breadcrumb.vue'
  import ShellConsole from '../shell-console.vue'

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const activeTab = ref('overview')
</script>

<template>
  <ShellConsole @sign-out="(event) => emit('sign-out', event)">
    <EnvironmentBreadcrumb />

    <div
      class="flex min-h-(--size-14) min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs)"
    >
      <div class="shrink-0 md:hidden">
        <Tooltip content="Back to Applications">
          <IconButton
            icon="az az-arrow-left"
            variant="ghost"
            size="medium"
            href="/applications"
            aria-label="Back to Applications"
          />
        </Tooltip>
      </div>
      <h1 class="min-w-0 truncate text-title-nested text-(--text-default)">azion-site</h1>
    </div>

    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
        <template #actions>
          <Button
            label="Deploy"
            variant="outline"
            size="medium"
            icon="az az-cloud-upload"
          />
        </template>
      </PageTabs>
    </div>

    <div class="layout-boundary">
      <div class="layout-column flex min-w-0 flex-col">
        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
          <Card :padded="false">
            <template #default>
              <div
                class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
              >
                The page body: detail/detail-resource
              </div>
            </template>
          </Card>
        </section>
      </div>
    </div>
  </ShellConsole>
</template>
