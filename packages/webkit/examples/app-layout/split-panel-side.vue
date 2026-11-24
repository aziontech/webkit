<script setup>
  import AppLayout from '@aziontech/webkit/app-layout'
  import Item from '@aziontech/webkit/item'
  import KeyValueList from '@aziontech/webkit/key-value-list'
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
  <div class="h-dvh">
    <AppLayout
      v-model:split-panel-open="splitPanelOpen"
      split-panel-position="side"
      :split-panel-title="selected ? selected.id : ''"
      storage-key="example-services-layout"
    >
      <main class="flex flex-col gap-(--spacing-lg) p-(--spacing-md)">
        <PageHeader
          title="Services"
          description="Select a service to see its details beside the list."
        />
        <ul
          aria-label="Services"
          class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0"
        >
          <li
            v-for="service in services"
            :key="service.id"
          >
            <Item
              variant="outline"
              size="small"
              clickable
              :aria-pressed="selectedId === service.id"
              @click="selectedId = service.id"
            >
              <Item.Content>
                <Item.Title>{{ service.id }}</Item.Title>
              </Item.Content>
              <Item.Actions>
                <StatusIndicator
                  :severity="service.status"
                  :label="service.label"
                />
              </Item.Actions>
            </Item>
          </li>
        </ul>
      </main>

      <template #split-panel>
        <KeyValueList
          v-if="selected"
          aria-label="Service details"
        >
          <KeyValueList.Item label="Status">
            <StatusIndicator
              :severity="selected.status"
              :label="selected.label"
            />
          </KeyValueList.Item>
          <KeyValueList.Item label="Domain">{{ selected.domain }}</KeyValueList.Item>
        </KeyValueList>
      </template>
    </AppLayout>
  </div>
</template>
