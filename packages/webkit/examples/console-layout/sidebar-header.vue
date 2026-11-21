<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import ConsoleLayoutRoot, {
    type ConsoleLayoutNavGroup
  } from '@aziontech/webkit/console-layout-root'
  import PageHeader from '@aziontech/webkit/page-header'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'az az-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'az az-workloads', href: '/workloads' },
        { id: 'functions', label: 'Functions', icon: 'az az-functions', href: '/functions' }
      ]
    }
  ]

  const organization = 'Acme Inc.'

  const ACCOUNT_BUTTON_CLASS =
    'flex h-10 w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'

  const COMPACT_ACCOUNT_BUTTON_CLASS =
    'flex h-7 shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-2xs) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    active-id="workloads"
  >
    <template #sidebar-header="{ compact }">
      <button
        v-if="!compact"
        type="button"
        :aria-label="`Account: ${organization}. Switch account`"
        aria-haspopup="dialog"
        :class="ACCOUNT_BUTTON_CLASS"
      >
        <Avatar
          :label="organization"
          pattern="marble"
          size="small"
          variant="square"
        />
        <span class="min-w-0 flex-1 truncate text-start text-label-sm text-(--text-default)">{{
          organization
        }}</span>
        <i
          class="az az-sort shrink-0 text-body-xs text-(--text-muted)"
          aria-hidden="true"
        />
      </button>
    </template>

    <template #header-leading="{ compact }">
      <button
        v-if="compact"
        type="button"
        :aria-label="`Account: ${organization}. Switch account`"
        aria-haspopup="dialog"
        :class="COMPACT_ACCOUNT_BUTTON_CLASS"
      >
        <Avatar
          :label="organization"
          pattern="marble"
          size="small"
          variant="square"
        />
        <i
          class="az az-chevron-down shrink-0 text-body-xs text-(--text-muted)"
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
  </ConsoleLayoutRoot>
</template>
