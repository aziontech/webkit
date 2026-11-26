<script setup lang="ts">
  import Command from '@aziontech/webkit/command'
  import ConsoleLayoutRoot, {
    type ConsoleLayoutNavGroup
  } from '@aziontech/webkit/console-layout-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import { ref } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'az az-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'az az-workloads', href: '/workloads' },
        { id: 'functions', label: 'Functions', icon: 'az az-functions', href: '/functions' }
      ]
    }
  ]

  const navigationOpen = ref(true)

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:sidebar') navigationOpen.value = !navigationOpen.value
  }
</script>

<template>
  <ConsoleLayoutRoot
    v-model:navigation-open="navigationOpen"
    :navigation="navigation"
    active-id="workloads"
    @search-select="onSearchSelect"
  >
    <template #search>
      <Command.Group label="Actions">
        <Command.Item value="action:sidebar">
          <template #leading>
            <i
              :class="navigationOpen ? 'az az-chevrons-left' : 'az az-chevrons-right'"
              aria-hidden="true"
            />
          </template>
          {{ navigationOpen ? 'Collapse sidebar' : 'Expand sidebar' }}
        </Command.Item>
      </Command.Group>
    </template>

    <div class="layout-boundary">
      <div class="layout-column">
        <PageHeader
          title="Workloads"
          description="Applications and functions running in this account."
        />
      </div>
    </div>
  </ConsoleLayoutRoot>
</template>
