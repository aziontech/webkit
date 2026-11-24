<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import Link from '@aziontech/webkit/link'
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

  const helpOpen = ref(false)
</script>

<template>
  <ConsoleLayout
    v-model:tools-open="helpOpen"
    :navigation="navigation"
    active-id="workloads"
    tools-label="Help"
  >
    <div class="layout-boundary">
      <div class="layout-column flex flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="Workloads"
          description="Group the domains, applications and firewalls that serve one site."
        >
          <template #meta>
            <ConsoleLayout.ToolsTrigger aria-label="Info about workloads" />
          </template>
        </PageHeader>
        <Card :padded="false">
          <div
            class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
          >
            The workloads table
          </div>
        </Card>
      </div>
    </div>

    <template #tools>
      <HelpPanel aria-label="Help: Workloads">
        <HelpPanel.Header
          title="Workloads"
          description="Where your domains meet the applications that answer them."
        />
        <HelpPanel.Group label="What is a workload?">
          <p>
            A workload binds one or more domains to an application and a firewall, so every request
            to app.example.com reaches the same rules.
          </p>
        </HelpPanel.Group>
        <HelpPanel.Group label="When do I create one?">
          <p>Create a workload for each site or API you serve, then add its domains.</p>
        </HelpPanel.Group>
        <HelpPanel.Footer>
          <Link
            label="Workloads documentation"
            href="https://example.com/docs/workloads"
            target="_blank"
          />
        </HelpPanel.Footer>
      </HelpPanel>
    </template>
  </ConsoleLayout>
</template>
