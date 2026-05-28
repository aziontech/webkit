<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import IconButton from '../../icon-button/icon-button.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableRefreshButton',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Disables the refresh control. */
      disabled?: boolean
      /** Shows loading state. */
      loading?: boolean
    }>(),
    {
      disabled: false,
      loading: false
    }
  )

  const emit = defineEmits<{
    refresh: []
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__refresh`
  )
</script>

<template>
  <IconButton
    v-bind="attrs"
    icon="pi pi-refresh"
    ariaLabel="Refresh table"
    kind="outlined"
    size="small"
    :disabled="disabled"
    :loading="loading"
    :data-testid="testId"
    @click="emit('refresh')"
  />
</template>
