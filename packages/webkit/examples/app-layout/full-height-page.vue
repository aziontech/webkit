<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import AppLayout from '@aziontech/webkit/app-layout'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import PageHeader from '@aziontech/webkit/page-header'

  const crumbs = [{ label: 'Workloads', href: '#' }, { label: 'Domains' }]
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

      <template #breadcrumbs>
        <Breadcrumb :items="crumbs" />
      </template>

      <main class="flex min-h-full flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <PageHeader
          title="Domains"
          description="The addresses this workload answers on."
        />
        <div class="flex flex-1 items-center justify-center">
          <EmptyState
            title="No domain yet"
            description="Add a domain to route its traffic to this workload."
            icon="az az-globe"
          >
            <template #actions>
              <Button
                variant="primary"
                label="Add domain"
              />
            </template>
          </EmptyState>
        </div>
      </main>
    </AppLayout>
  </div>
</template>
