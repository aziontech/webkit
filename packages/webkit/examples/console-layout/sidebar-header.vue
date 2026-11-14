<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'
  import PageHeader from '@aziontech/webkit/page-header'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' }
      ]
    }
  ]

  const organization = 'Acme Inc.'
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    active-id="workloads"
  >
    <template #sidebar-header="{ compact }">
      <button
        v-if="!compact"
        type="button"
        :aria-label="`Account: ${organization}. Switch account`"
        aria-haspopup="dialog"
        class="flex h-10 w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
      >
        <Avatar
          :label="organization"
          pattern="marble"
          size="small"
          kind="square"
        />
        <span class="min-w-0 flex-1 truncate text-start text-label-sm text-(--text-default)">{{
          organization
        }}</span>
        <i
          class="pi pi-sort shrink-0 text-body-xs text-(--text-muted)"
          aria-hidden="true"
        />
      </button>
    </template>

    <template #header-start="{ compact }">
      <button
        v-if="compact"
        type="button"
        :aria-label="`Account: ${organization}. Switch account`"
        aria-haspopup="dialog"
        class="flex h-7 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
      >
        <Avatar
          :label="organization"
          pattern="marble"
          size="small"
          kind="square"
        />
        <i
          class="pi pi-chevron-down shrink-0 text-body-xs text-(--text-muted)"
          aria-hidden="true"
        />
      </button>
    </template>

    <div class="layout-boundary">
      <div class="layout-column">
        <PageHeader
          title="Workloads"
          description="The account switcher sits in the rail under the wordmark, and in the header when the layout is compact."
        />
      </div>
    </div>
  </ConsoleLayout>
</template>
