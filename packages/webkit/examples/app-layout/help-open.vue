<script setup>
  import AppHeader from '@aziontech/webkit/app-header'
  import AppLayout from '@aziontech/webkit/app-layout'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import HelpPanel from '@aziontech/webkit/help-panel'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import { onMounted, ref } from 'vue'

  const toolsOpen = ref(false)

  onMounted(() => {
    toolsOpen.value = window.matchMedia('(min-width: 48rem)').matches
  })

  const crumbs = [{ label: 'Workloads', href: '#' }, { label: 'Firewall' }]
</script>

<template>
  <div class="h-dvh">
    <AppLayout
      v-model:tools-open="toolsOpen"
      tools-label="Help: Firewall"
    >
      <template #header="{ toggleTools }">
        <AppHeader aria-label="Console">
          <AppHeader.Start />
          <AppHeader.Center />
          <AppHeader.End>
            <IconButton
              icon="az az-circle-help"
              aria-label="Help"
              variant="outline"
              size="medium"
              :aria-pressed="toolsOpen"
              @click="toggleTools"
            />
          </AppHeader.End>
        </AppHeader>
      </template>

      <template #breadcrumbs>
        <Breadcrumb :items="crumbs" />
      </template>

      <main class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <PageHeader
          title="Firewall"
          description="The rules that decide which requests reach your workloads."
        />
      </main>

      <template #tools>
        <HelpPanel aria-label="Help: Firewall">
          <HelpPanel.Header
            title="Firewall"
            description="Rules run in order, before the request reaches your code."
          />
          <HelpPanel.Group label="How rules are matched">
            <p>The first rule whose criteria match the request runs its behaviors.</p>
          </HelpPanel.Group>
          <HelpPanel.Footer>
            <Link
              label="Firewall documentation"
              href="https://example.com/docs"
              target="_blank"
            />
          </HelpPanel.Footer>
        </HelpPanel>
      </template>
    </AppLayout>
  </div>
</template>
