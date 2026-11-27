<script setup lang="ts">
  import ConfigProvider from '@aziontech/ui/config-provider'

  export interface CustomerClockProps {
    /** A fixed reference time for every countdown and relative time inside; the sample also reads its dates in UTC; left out, the page reads the real clock and zone or the app provider's. */
    now?: string | number | Date
  }

  withDefaults(defineProps<CustomerClockProps>(), { now: undefined })

  defineSlots<{
    /** The page body. */
    default(): unknown
  }>()
</script>

<template>
  <ConfigProvider
    :now="now"
    :time-zone="now === undefined ? undefined : 'UTC'"
    class="min-w-0 flex-1"
  >
    <slot />
  </ConfigProvider>
</template>
