<script setup lang="ts">
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import { ref } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' }
      ]
    }
  ]

  const navigationExpanded = ref(true)

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:sidebar') navigationExpanded.value = !navigationExpanded.value
  }
</script>

<template>
  <ConsoleLayout
    v-model:navigation-expanded="navigationExpanded"
    :navigation="navigation"
    active-id="workloads"
    @search-select="onSearchSelect"
  >
    <template #search>
      <Command.Group heading="Actions">
        <Command.Item value="action:sidebar">
          <template #prefix>
            <i
              :class="navigationExpanded ? 'pi pi-angle-double-left' : 'pi pi-angle-double-right'"
              aria-hidden="true"
            />
          </template>
          {{ navigationExpanded ? 'Collapse sidebar' : 'Expand sidebar' }}
        </Command.Item>
      </Command.Group>
    </template>

    <div class="layout-boundary">
      <div class="layout-column">
        <PageHeader
          title="Workloads"
          description="Press ⌘K or Ctrl K and choose Collapse sidebar to fold the rail."
        />
      </div>
    </div>
  </ConsoleLayout>
</template>
