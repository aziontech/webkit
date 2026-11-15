<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { SidebarInjectionKey } from './injection-key'

  defineOptions({
    name: 'SidebarGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Section overline label; omit for unlabeled groups (e.g. top-level links). */
    label?: string
  }

  withDefaults(defineProps<Props>(), {
    label: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(SidebarInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'layout-sidebar'}__group`
  )
</script>

<template>
  <section
    :class="cn('flex w-full min-w-0 shrink-0 flex-col', attrs.class as string | undefined)"
    :aria-label="label || undefined"
    :data-testid="testId"
  >
    <div
      v-if="label"
      :data-rail="ctx?.rail ? '' : undefined"
      class="relative flex h-7 w-full shrink-0 items-center ps-(--spacing-xxs) pe-(--spacing-xs) py-(--spacing-xxs) text-(--text-muted) data-[rail]:hidden"
      :data-testid="`${testId}__label`"
    >
      <span class="min-w-0 flex-1 truncate text-overline-xs">{{ label }}</span>
    </div>
    <ul
      class="m-0 flex w-full list-none flex-col p-0"
      :data-testid="`${testId}__list`"
    >
      <slot />
    </ul>
  </section>
</template>
