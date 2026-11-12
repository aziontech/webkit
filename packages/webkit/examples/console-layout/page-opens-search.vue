<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'
  import PageHeader from '@aziontech/webkit/page-header'
  import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'
  import { defineComponent, h } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' }
      ]
    }
  ]

  const FindWorkload = defineComponent({
    name: 'FindWorkload',
    setup() {
      const { openSearch } = useConsoleLayout()
      return () =>
        h(Button, {
          label: 'Find a workload',
          icon: 'pi pi-search',
          kind: 'outlined',
          size: 'medium',
          onClick: openSearch
        })
    }
  })
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    active-id="workloads"
  >
    <div class="layout-boundary">
      <div class="layout-column flex flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="Workloads"
          description="Open the same palette as the header search, from the page."
        >
          <template #actions>
            <FindWorkload />
          </template>
        </PageHeader>
      </div>
    </div>
  </ConsoleLayout>
</template>
