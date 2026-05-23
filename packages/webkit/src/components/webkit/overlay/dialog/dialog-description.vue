<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { DialogInjectionKey } from './injection-key'

  defineOptions({
    name: 'DialogDescription',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DialogInjectionKey)

  const rootClasses = computed(() =>
    cn('text-body-xxs text-[var(--text-muted)]', attrs.class as string | undefined)
  )
</script>

<template>
  <p
    :id="ctx?.descriptionId"
    :class="rootClasses"
    :data-testid="`${ctx?.testId}__description`"
  >
    <slot />
  </p>
</template>
