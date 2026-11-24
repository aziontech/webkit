<script setup lang="ts">
  import ConfigProvider from '@aziontech/webkit/config-provider'

  export interface CustomerClockProps {
    /** A fixed reference time for every countdown and relative time inside; left out, the page reads the real clock and keeps the app's own provider. */
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
    v-if="now !== undefined"
    :now="now"
    class="min-w-0 flex-1"
  >
    <slot />
  </ConfigProvider>
  <slot v-else />
</template>
