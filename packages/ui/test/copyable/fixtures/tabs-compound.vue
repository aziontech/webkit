<script setup lang="ts">
  import AppHeader, { type AppHeaderVariant } from '@aziontech/webkit/app-header'
  import Breadcrumb, { type BreadcrumbItemData } from '@aziontech/webkit/breadcrumb'
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
  const headerKind: AppHeaderVariant = 'content'
  const menu = ref<NavigationMenuValue>(null)
  const closeTab = (value: TabsValue | string): void => {
    active.value = value
  }
</script>

<template>
  <Tabs v-model="active">
    <Tabs.List :align="align">
      <Tabs.Trigger
        v-for="view in views"
        :key="view.value"
        :value="view.value"
        :label="view.label"
        closable
        @close="(_event, value) => closeTab(value)"
      />
    </Tabs.List>
    <div class="relative isolate w-full">
      <Tabs.Content value="overview">Overview</Tabs.Content>
    </div>
  </Tabs>

  <!-- @vue-expect-error a tab value is a string or a number -->
  <Tabs.Trigger :value="true" />

  <!-- @vue-expect-error align is start or center -->
  <Tabs.List align="end" />

  <Breadcrumb :items="crumbs" />
  <AppHeader :variant="headerKind" />
  <NavigationMenu.Root v-model="menu" />
</template>
