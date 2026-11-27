<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import Select from '@aziontech/ui/select'
  import Timestamp from '@aziontech/ui/timestamp'
  import { ref } from 'vue'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
  const zone = ref('UTC')
  const zones = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/Los_Angeles', label: 'Los Angeles' },
    { value: 'America/New_York', label: 'New York' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Asia/Tokyo', label: 'Tokyo' }
  ]
  const events = [
    { id: 'e1', label: 'Deployment finished', at: '2026-11-14T12:04:31Z' },
    { id: 'e2', label: 'Certificate renewed', at: '2026-11-14T03:15:00Z' },
    { id: 'e3', label: 'API key created', at: 1794524400000000 }
  ]
</script>

<template>
  <ConfigProvider
    :now="NOW"
    :time-zone="zone"
  >
    <div class="flex max-w-(--container-sm) flex-col gap-(--spacing-md)">
      <Select
        v-model="zone"
        aria-label="Time zone"
        size="medium"
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Item
            v-for="option in zones"
            :key="option.value"
            :value="option.value"
            >{{ option.label }}</Select.Item
          >
        </Select.Content>
      </Select>
      <ul class="flex flex-col gap-(--spacing-xs) text-body-sm text-(--text-default)">
        <li
          v-for="event in events"
          :key="event.id"
          class="flex flex-wrap items-baseline justify-between gap-(--spacing-sm)"
        >
          <span>{{ event.label }}</span>
          <Timestamp :value="event.at" />
        </li>
      </ul>
    </div>
  </ConfigProvider>
</template>
