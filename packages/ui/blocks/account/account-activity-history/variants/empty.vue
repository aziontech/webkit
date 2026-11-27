<script setup lang="ts">
  import type { DateRangeValue } from '@aziontech/ui/date-range-picker'
  import { ref } from 'vue'

  import AccountActivityHistory from '../account-activity-history.vue'

  const range = ref<DateRangeValue>({
    type: 'relative',
    amount: 15,
    unit: 'minute',
    key: 'last-15-minutes'
  })
</script>

<template>
  <AccountActivityHistory v-model:range="range" />
</template>
