<script setup lang="ts">
  import Breadcrumb, { type BreadcrumbItemData } from '@aziontech/webkit/breadcrumb'
  import GlobalHeader, { type GlobalHeaderKind } from '@aziontech/webkit/global-header'
  import NavigationMenu, { type NavigationMenuValue } from '@aziontech/webkit/navigation-menu'
  import Tabs, { type TabsListAlign, type TabsValue } from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const active = ref<TabsValue>('overview')
  const align: TabsListAlign = 'center'
  const views: { value: TabsValue; label: string }[] = [
    { value: 'overview', label: 'Overview' },
    { value: 2, label: 'Logs' }
  ]
  const crumbs: BreadcrumbItemData[] = []
  const headerKind: GlobalHeaderKind = 'content'
  const menu = ref<NavigationMenuValue>(null)
  const closeTab = (value: TabsValue | string): void => {
    active.value = value
  }
</script>

<template>
  <Tabs.Root v-model="active">
    <Tabs.List :align="align">
      <Tabs.Item
        v-for="view in views"
        :key="view.value"
        :value="view.value"
        :label="view.label"
        closable
        @close="(_event, value) => closeTab(value)"
      />
    </Tabs.List>
    <Tabs.Content>
      <Tabs.Panel value="overview">Overview</Tabs.Panel>
    </Tabs.Content>
  </Tabs.Root>

  <!-- @vue-expect-error a tab value is a string or a number -->
  <Tabs.Item :value="true" />

  <!-- @vue-expect-error align is start or center -->
  <Tabs.List align="end" />

  <Breadcrumb :items="crumbs" />
  <GlobalHeader :kind="headerKind" />
  <NavigationMenu.Root v-model="menu" />
</template>
