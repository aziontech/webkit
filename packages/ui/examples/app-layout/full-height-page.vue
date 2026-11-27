<script setup>
  import AppHeader from '@aziontech/ui/app-header'
  import AppLayout from '@aziontech/ui/app-layout'
  import Breadcrumb from '@aziontech/ui/breadcrumb-root'
  import Button from '@aziontech/ui/button'
  import EmptyState from '@aziontech/ui/empty-state'
  import PageHeader from '@aziontech/ui/page-header'

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
