<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConsoleLayoutRoot, {
    type ConsoleLayoutNavGroup
  } from '@aziontech/webkit/console-layout-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'
  import { defineComponent, h } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'az az-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'az az-workloads', href: '/workloads' },
        { id: 'functions', label: 'Functions', icon: 'az az-functions', href: '/functions' }
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
          icon: 'az az-search',
          variant: 'outline',
          size: 'medium',
          onClick: openSearch
        })
    }
  })
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    active-id="workloads"
  >
    <div class="layout-boundary">
      <div class="layout-column flex flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="Workloads"
          description="Find a workload by name, domain or tag."
        >
          <template #actions>
            <FindWorkload />
          </template>
        </PageHeader>
      </div>
    </div>
  </ConsoleLayoutRoot>
</template>
