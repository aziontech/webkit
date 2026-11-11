<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'

  defineOptions({ name: 'NavigationMenuPortal', inheritAttrs: false })

  interface Props {
    /** Teleport container element or selector. */
    container?: object | string
    /** Keeps portal mounted when the popup is closed. */
    keepMounted?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    container: undefined,
    keepMounted: true
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__portal'
  )

  const root = useNavigationMenuRoot()

  const teleportTarget = computed(() => props.container ?? 'body')

  const shouldMount = computed(() => props.keepMounted || root.menuPopupMounted.value)

  const portalClasses = computed(() => cn(attrs.class as string | undefined))
</script>

<template>
  <Teleport
    v-if="shouldMount"
    :to="teleportTarget"
  >
    <div
      :class="portalClasses"
      :data-testid="testId"
    >
      <slot />
    </div>
  </Teleport>
</template>
