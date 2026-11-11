<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import KeyValuePairs from '@aziontech/webkit/key-value-pairs'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { computed, ref } from 'vue'

  const services = [
    { id: 'web-app-prod', domain: 'shop.example.com', status: 'success', label: 'Active' },
    { id: 'payments-api', domain: 'pay.example.com', status: 'success', label: 'Active' },
    { id: 'status-page', domain: 'status.example.com', status: 'warning', label: 'Degraded' }
  ]

  const selectedId = ref('web-app-prod')
  const selected = computed(() => services.find((service) => service.id === selectedId.value))
  const splitPanelOpen = computed({
    get: () => Boolean(selected.value),
    set: (open) => {
      if (!open) selectedId.value = ''
    }
  })
</script>

<template>
  <AppLayout
    v-model:split-panel-open="splitPanelOpen"
    split-panel-position="side"
    :split-panel-title="selected ? selected.id : ''"
    storage-key="example-services-layout"
    class="h-dvh"
  >
    <main class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
      <PageHeader
        title="Services"
        description="Select a service to see its details beside the list."
      />
      <ul
        aria-label="Services"
        class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0"
      >
        <li
          v-for="service in services"
          :key="service.id"
        >
          <button
            type="button"
            :aria-pressed="selectedId === service.id"
            class="flex w-full items-center justify-between gap-(--spacing-sm) rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-md text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) aria-pressed:border-(--accent) motion-reduce:transition-none"
            @click="selectedId = service.id"
          >
            <span class="min-w-0 truncate">{{ service.id }}</span>
            <StatusIndicator
              :severity="service.status"
              :label="service.label"
            />
          </button>
        </li>
      </ul>
    </main>

    <template #split-panel>
      <KeyValuePairs
        v-if="selected"
        aria-label="Service details"
      >
        <KeyValuePairs.Item label="Status">
          <StatusIndicator
            :severity="selected.status"
            :label="selected.label"
          />
        </KeyValuePairs.Item>
        <KeyValuePairs.Item label="Domain">{{ selected.domain }}</KeyValuePairs.Item>
      </KeyValuePairs>
    </template>
  </AppLayout>
</template>
