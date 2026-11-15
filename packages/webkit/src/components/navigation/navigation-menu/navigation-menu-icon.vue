<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useNavigationMenuItem } from './composables/use-navigation-menu-context'

  defineOptions({ name: 'NavigationMenuIcon', inheritAttrs: false })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-navigation-menu__icon'
  )

  const item = useNavigationMenuItem()

  const ROOT_CLASS =
    'inline-flex transition-transform duration-moderate-02 ease-productive-entrance motion-reduce:transition-none ' +
    'data-[state=open]:rotate-180'
</script>

<template>
  <span
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    aria-hidden="true"
    :data-testid="testId"
    :data-state="item.itemOpen.value ? 'open' : 'closed'"
  >
    <slot />
  </span>
</template>
