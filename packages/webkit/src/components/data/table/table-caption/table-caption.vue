<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, useAttrs } from 'vue'

  import { TableInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableCaption',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__caption` : 'data-table__caption')
  )

  const id = computed<string | undefined>(
    () => ctx?.captionId ?? (attrs['id'] as string | undefined)
  )
  const unregister = ctx?.registerCaption?.()
  onBeforeUnmount(() => unregister?.())
</script>

<template>
  <div
    v-bind="$attrs"
    :id="id"
    :data-testid="testId"
    class="px-(--spacing-sm) py-(--spacing-xs) text-label-sm text-(--text-muted)"
  >
    <slot />
  </div>
</template>
