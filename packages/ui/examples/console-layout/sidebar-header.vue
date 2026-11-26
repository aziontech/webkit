<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import ConsoleLayoutRoot, { type ConsoleLayoutNavGroup } from '@aziontech/ui/console-layout-root'
  import Item from '@aziontech/ui/item'
  import PageHeader from '@aziontech/ui/page-header'

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
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    active-id="workloads"
  >
    <template #sidebar-header="{ compact }">
      <Item
        v-if="!compact"
        size="small"
        clickable
        :aria-label="`Account: ${organization}. Switch account`"
        aria-haspopup="dialog"
      >
        <Item.Media>
          <Avatar
            :label="organization"
            pattern="marble"
            size="small"
            variant="square"
          />
        </Item.Media>
        <Item.Content>
          <Item.Title>{{ organization }}</Item.Title>
        </Item.Content>
        <Item.Actions>
          <i
            class="az az-sort text-body-xs text-(--text-muted)"
            aria-hidden="true"
          />
        </Item.Actions>
      </Item>
    </template>

    <template #header-leading="{ compact }">
      <Button
        v-if="compact"
        variant="ghost"
        size="small"
        icon="az az-chevron-down"
        icon-position="trailing"
        :aria-label="`Account: ${organization}. Switch account`"
        aria-haspopup="dialog"
      >
        <template #leading>
          <Avatar
            :label="organization"
            pattern="marble"
            size="small"
            variant="square"
          />
        </template>
      </Button>
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
