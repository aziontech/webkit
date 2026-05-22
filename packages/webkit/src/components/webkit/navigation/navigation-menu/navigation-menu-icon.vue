<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useNavigationMenuItem } from './composables/use-navigation-menu-context.js'

  defineOptions({ name: 'NavigationMenuIcon', inheritAttrs: false })

  interface Props {
    /** Polymorphic icon wrapper. */
    as?: string | object
  }

  withDefaults(defineProps<Props>(), {
    as: 'span'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const item = useNavigationMenuItem()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__icon'
  )

  const iconClass = computed(() =>
    cn(
      'inline-flex transition-transform duration-200 motion-reduce:transition-none',
      'data-[open]:rotate-180',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <component
    :is="as"
    :class="iconClass"
    aria-hidden="true"
    :data-testid="testId"
    :data-open="item.itemOpen.value ? '' : undefined"
    :data-state="item.itemOpen.value ? 'open' : 'closed'"
  >
    <slot />
  </component>
</template>
