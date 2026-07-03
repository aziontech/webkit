<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableRefreshButton',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Disables the control (in addition to the injected loading state). */
      disabled?: boolean
    }>(),
    {
      disabled: false
    }
  )

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__refresh-button` : 'data-table__refresh-button')
  )

  // Context-aware: signals a refresh (the root emits `refresh`; the app refetches).
  // Disabled while loading so a refresh can't stack mid-fetch.
  const isDisabled = computed<boolean>(() => props.disabled || (ctx?.loading.value ?? false))
  const onClick = (): void => ctx?.reload()
</script>

<template>
  <IconButton
    v-bind="$attrs"
    :data-testid="testId"
    icon="pi pi-refresh"
    ariaLabel="Refresh"
    kind="outlined"
    size="medium"
    :disabled="isDisabled"
    @click="onClick"
  />
</template>
