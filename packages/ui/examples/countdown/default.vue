<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import Countdown from '@aziontech/ui/countdown'

  const NOW = Date.UTC(2026, 10, 24, 14, 45)
  const HOUR = 3_600_000
</script>

<template>
  <ConfigProvider :now="NOW">
    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
      <Countdown
        :deadline="NOW + 5 * HOUR"
        label="First reply"
      />
      <Countdown
        :deadline="NOW + 0.75 * HOUR"
        label="First reply"
      />
      <Countdown
        :deadline="NOW - 0.25 * HOUR"
        label="First reply"
      />
    </div>
  </ConfigProvider>
</template>
