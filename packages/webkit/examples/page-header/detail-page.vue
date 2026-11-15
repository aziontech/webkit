<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const trail = [{ label: 'Resources', href: '/resources' }, { label: 'acme-store' }]
  const tab = ref('overview')
</script>

<template>
  <PageHeader
    title="acme-store"
    description="Storefront for Acme Inc., served from three regions."
  >
    <template #breadcrumb>
      <Breadcrumb :items="trail" />
    </template>
    <template #icon>
      <i class="ai ai-box" />
    </template>
    <template #meta>
      <Tag
        label="Active"
        severity="success"
        size="small"
      />
      <Tag
        label="production"
        severity="secondary"
        size="small"
      />
    </template>
    <template #actions>
      <Button
        label="Documentation"
        icon="ai ai-book"
        kind="outlined"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
      />
      <Button
        label="Deploy"
        icon="ai ai-cloud-upload"
        kind="outlined"
        size="medium"
      />
    </template>
    <template #tabs>
      <Tabs.Root v-model="tab">
        <Tabs.List>
          <Tabs.Item
            value="overview"
            label="Overview"
          />
          <Tabs.Item
            value="settings"
            label="Settings"
          />
          <Tabs.Item
            value="logs"
            label="Logs"
          />
        </Tabs.List>
      </Tabs.Root>
    </template>
  </PageHeader>
</template>
