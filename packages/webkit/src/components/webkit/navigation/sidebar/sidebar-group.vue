<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import ScrollArea from '../../layout/scroll-area/scroll-area.vue'
  import MenuItem from '../menu-item/menu-item.vue'
  import { SidebarInjectionKey } from './injection-key'

  defineOptions({
    name: 'SidebarGroup',
    inheritAttrs: false
  })

  interface Props {
    /** Section overline label; omit for unlabeled groups (e.g. top-level links). */
    label?: string
    /**
     * When true, renders a scrollable full-height container for nested groups.
     * Use a single outer `SidebarGroup` with `scroll` wrapping all menu sections.
     */
    scroll?: boolean
  }

  withDefaults(defineProps<Props>(), {
    label: undefined,
    scroll: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(SidebarInjectionKey)

  const testId = computed(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      `${ctx?.testId ?? 'navigation-sidebar'}__group`
  )

  const scrollClasses = computed(() =>
    cn('flex h-full min-h-0 flex-1 flex-col gap-spacing-elements-md', attrs.class)
  )

  const sectionClasses = computed(() => cn('flex w-full min-w-0 shrink-0 flex-col', attrs.class))
</script>

<template>
  <ScrollArea
    v-if="scroll"
    :class="scrollClasses"
    :data-testid="`${testId}__scroll`"
  >
    <slot />
  </ScrollArea>
  <section
    v-else
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
