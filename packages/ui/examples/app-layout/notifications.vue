<script setup>
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import AppLayout from '@aziontech/webkit/app-layout'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import { ref } from 'vue'

  const maintenance = ref(true)
  const deployed = ref(true)

  const crumbs = [{ label: 'Services', href: '#' }, { label: 'web-app-prod' }]
</script>

<template>
  <div class="h-dvh">
    <AppLayout>
      <template #header>
        <AppHeader aria-label="Console">
          <AppHeader.Start />
          <AppHeader.Center />
          <AppHeader.End />
        </AppHeader>
      </template>

      <template #notifications>
        <Alert
          v-if="deployed"
          key="deployed"
          severity="success"
          closable
          @close="deployed = false"
        >
          web-app-prod was deployed. The new version is serving traffic.
        </Alert>
        <Alert
          v-if="maintenance"
          key="maintenance"
          severity="info"
          closable
          @close="maintenance = false"
        >
          Scheduled maintenance on Nov 20 from 02:00 to 03:00 UTC. Services keep serving traffic.
        </Alert>
      </template>

      <template #breadcrumbs>
        <Breadcrumb :items="crumbs" />
      </template>

      <main class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <PageHeader
          title="web-app-prod"
          description="The service that answers shop.example.com."
        />
      </main>
    </AppLayout>
  </div>
</template>
