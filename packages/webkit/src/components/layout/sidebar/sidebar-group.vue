<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import MenuItem from '../../navigation/menu-item/menu-item.vue'
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
    label: undefined
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

  const sectionClasses = computed(() => cn('flex w-full min-w-0 shrink-0 flex-col', attrs.class))
</script>

<template>
  <section
    :class="sectionClasses"
    :aria-label="label || undefined"
    :data-testid="testId"
  >
    <MenuItem
      v-if="label"
      kind="group"
      :label="label"
      :data-testid="`${testId}__label`"
    />
    <ul
      class="m-0 flex w-full list-none flex-col p-0"
      :data-testid="`${testId}__list`"
    >
      <slot />
    </ul>
  </section>
</template>
