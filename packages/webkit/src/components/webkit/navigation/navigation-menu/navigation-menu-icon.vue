<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useNavigationMenuItem } from './composables/use-navigation-menu-context.js'
  import { navigationMenuIconClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuIcon', inheritAttrs: false })

  interface Props {
    /** Polymorphic icon wrapper element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    as: 'span'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__icon'
  )

  const item = useNavigationMenuItem()

  const iconClasses = computed(() =>
    cn(navigationMenuIconClasses, attrs.class as string | undefined)
  )
</script>

<template>
  <component
    :is="props.as"
    :class="iconClasses"
    aria-hidden="true"
    :data-testid="testId"
    :data-open="item.itemOpen.value ? '' : undefined"
  >
    <slot />
  </component>
</template>
