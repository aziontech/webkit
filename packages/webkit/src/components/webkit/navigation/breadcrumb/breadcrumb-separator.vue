<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'

  defineOptions({
    name: 'BreadcrumbSeparator',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-breadcrumb-separator'
  )
</script>

<template>
  <li
    role="presentation"
    aria-hidden="true"
    :class="
      cn(
        'inline-flex shrink-0 items-center text-[var(--text-muted)]',
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
  >
    <slot>
      <i
        class="pi pi-chevron-right size-[0.875rem] text-[length:inherit] leading-none"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      />
    </slot>
  </li>
</template>
