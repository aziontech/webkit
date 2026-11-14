<script setup>
  import Timestamp from '@aziontech/webkit/timestamp'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'

  const NOW = Date.UTC(2026, 10, 14, 12, 10)
  const VALUE = '2026-11-14T12:04:31Z'
</script>

<template>
  <WebkitProvider
    :now="NOW"
    time-zone="America/New_York"
  >
    <dl
      class="grid grid-cols-[auto_1fr] items-baseline gap-x-(--spacing-md) gap-y-(--spacing-sm) text-body-sm text-(--text-default)"
    >
      <dt class="text-label-sm text-(--text-muted)">Local</dt>
      <dd><Timestamp :value="VALUE" /></dd>
      <dt class="text-label-sm text-(--text-muted)">UTC</dt>
      <dd>
        <Timestamp
          :value="VALUE"
          format="utc"
        />
      </dd>
      <dt class="text-label-sm text-(--text-muted)">Relative</dt>
      <dd>
        <Timestamp
          :value="VALUE"
          format="relative"
        />
      </dd>
    </dl>
  </WebkitProvider>
</template>
