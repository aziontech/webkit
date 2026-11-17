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
    <template #breadcrumbs>
      <Breadcrumb :items="trail" />
    </template>
    <template #icon>
      <i class="az az-box" />
    </template>
    <template #meta>
      <Tag
        label="Active"
        severity="success"
        size="small"
      />
      <Tag
        label="production"
        severity="neutral"
        size="small"
      />
    </template>
    <template #actions>
      <Button
        label="Documentation"
        icon="az az-book"
        variant="outline"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
      />
      <Button
        label="Deploy"
        icon="az az-cloud-upload"
        variant="outline"
        size="medium"
      />
    </template>
    <template #tabs>
      <Tabs v-model="tab">
        <Tabs.List>
          <Tabs.Trigger
            value="overview"
            label="Overview"
          />
          <Tabs.Trigger
            value="settings"
            label="Settings"
          />
          <Tabs.Trigger
            value="logs"
            label="Logs"
          />
        </Tabs.List>
      </Tabs>
    </template>
  </PageHeader>
</template>
