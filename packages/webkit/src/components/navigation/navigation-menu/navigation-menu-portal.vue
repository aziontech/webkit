<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
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

  const teleportTarget = computed(() => {
    if (props.container && typeof props.container !== 'string') {
      return props.container
    }

    if (typeof props.container === 'string' && typeof document !== 'undefined') {
      return document.querySelector(props.container)
    }

    return typeof document !== 'undefined' ? document.body : null
  })

  const shouldMount = computed(() => props.keepMounted || root.menuPopupMounted.value)

  const portalClasses = computed(() => cn(attrs.class as string | undefined))
</script>

<template>
  <Teleport
    v-if="shouldMount && teleportTarget"
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
