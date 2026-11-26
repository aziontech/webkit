<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Countdown from '@aziontech/webkit/countdown'

  const NOW = Date.UTC(2026, 10, 24, 9, 0)
</script>

<template>
  <ConfigProvider :now="NOW">
    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
      <Countdown
        deadline="2026-12-24T09:00:00Z"
        type="expiry"
        label="Certificate"
      />
      <Countdown
        deadline="2026-11-25T09:00:00Z"
        type="expiry"
        label="API key"
        :warning-threshold="2 * 86_400_000"
      />
      <Countdown
        deadline="2026-11-23T09:00:00Z"
        type="expiry"
        label="Trial"
      />
    </div>
  </ConfigProvider>
</template>
