<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'

  defineOptions({ name: 'NavigationMenuPortal', inheritAttrs: false })

  interface Props {
    /** Teleport target (element or selector). Defaults to `document.body`. */
    container?: object | string
    /** Keep portal mounted when the menu is closed. */
    keepMounted?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    container: undefined,
    keepMounted: true
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const root = useNavigationMenuRoot()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__portal'
  )

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

  const portalClass = computed(() => cn(attrs.class as string | undefined))
</script>

<template>
  <Teleport
    v-if="shouldMount && teleportTarget"
    :to="teleportTarget"
  >
    <div
      :class="portalClass"
      :data-testid="testId"
    >
      <slot />
    </div>
  </Teleport>
</template>
