<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import PageHeader from '@aziontech/webkit/page-header'

  const crumbs = [{ label: 'Workloads', href: '#' }, { label: 'Domains' }]
</script>

<template>
  <div class="h-dvh">
    <AppLayout>
      <template #header>
        <GlobalHeader aria-label="Console">
          <GlobalHeader.Left />
          <GlobalHeader.Middle />
          <GlobalHeader.Right />
        </GlobalHeader>
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
            icon="pi pi-globe"
          >
            <template #actions>
              <Button
                kind="primary"
                label="Add domain"
              />
            </template>
          </EmptyState>
        </div>
      </main>
    </AppLayout>
  </div>
</template>
