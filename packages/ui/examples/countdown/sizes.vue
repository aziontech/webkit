<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import Countdown from '@aziontech/ui/countdown'

  const NOW = Date.UTC(2026, 10, 24, 14, 45)
</script>

<template>
  <ConfigProvider :now="NOW">
    <div class="flex flex-wrap items-center gap-(--spacing-sm)">
      <Countdown
        deadline="2026-11-24T17:00:00Z"
        size="small"
      />
      <Countdown deadline="2026-11-24T17:00:00Z" />
    </div>
  </ConfigProvider>
</template>
