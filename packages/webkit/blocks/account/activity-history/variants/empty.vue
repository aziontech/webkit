<script setup lang="ts">
  import type { DateRangeValue } from '@aziontech/webkit/date-range-picker'
  import { ref } from 'vue'

  import ActivityHistory from '../activity-history.vue'

  const range = ref<DateRangeValue>({
    type: 'relative',
    amount: 15,
    unit: 'minute',
    key: 'last-15-minutes'
  })
</script>

<template>
  <ActivityHistory v-model:range="range" />
</template>
