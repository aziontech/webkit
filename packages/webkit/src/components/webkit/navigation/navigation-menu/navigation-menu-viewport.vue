<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element.js'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context.js'
  import { navigationMenuTransitionClasses } from './presets/animations.js'

  defineOptions({ name: 'NavigationMenuViewport', inheritAttrs: false })

  interface Props {
    as?: string | object
  }

  withDefaults(defineProps<Props>(), {
    as: 'div'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const root = useNavigationMenuRoot()
  const viewportRef = ref<HTMLElement | null>(null)
  const viewportTargetRef = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__viewport'
  )

  const viewportClass = computed(() =>
    cn(navigationMenuTransitionClasses.viewport, attrs.class as string | undefined)
  )

  watch(
    viewportRef,
    (target) => {
      root.viewportEl.value = resolveHostElement(target)
    },
    { immediate: true }
  )

  watch(
    viewportTargetRef,
    (target) => {
      root.viewportTargetEl.value = resolveHostElement(target)
    },
    { immediate: true }
  )
</script>

<template>
  <component
    :is="as"
    ref="viewportRef"
    v-bind="attrs"
    :class="viewportClass"
    :data-testid="testId"
  >
    <div
      ref="viewportTargetRef"
      class="relative h-full w-full"
      :data-testid="`${testId}__target`"
    >
      <slot />
    </div>
  </component>
</template>
