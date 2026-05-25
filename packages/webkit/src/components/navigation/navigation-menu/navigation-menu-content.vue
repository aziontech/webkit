<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element.js'
  import {
    useNavigationMenuItem,
    useNavigationMenuRoot
  } from './composables/use-navigation-menu-context.js'
  import { useTransitionStatus } from './composables/use-transition-status.js'
  import { navigationMenuTransitionClasses, waitForCloseTransition } from './presets/animations.js'
  import { navigationMenuContentPaddingClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuContent', inheritAttrs: false })

  interface Props {
    /** Keeps content mounted when closed. */
    keepMounted?: boolean
    /** Polymorphic content element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    keepMounted: false,
    as: 'div'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__content'
  )

  const root = useNavigationMenuRoot()
  const item = useNavigationMenuItem()
  const contentRef = ref<HTMLElement | null>(null)

  const contentOpen = computed(() => root.menuPopupMounted.value && item.itemOpen.value)

  const { mounted, setMounted, transitionStatus } = useTransitionStatus(() => contentOpen.value)

  const viewportTarget = computed(() => root.viewportTargetEl.value)

  const contentClasses = computed(() =>
    cn(
      navigationMenuTransitionClasses.content,
      navigationMenuContentPaddingClasses,
      attrs.class as string | undefined
    )
  )

  const isExiting = computed(() => !contentOpen.value && mounted.value)

  const contentDataAttrs = computed(() => ({
    'data-open': contentOpen.value ? '' : undefined,
    'data-closed': !contentOpen.value ? '' : undefined,
    'data-starting-style': transitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': transitionStatus.value === 'ending' ? '' : undefined,
    'data-activation-direction': root.activationDirection.value ?? undefined
  }))

  const contentStyle = computed(() =>
    isExiting.value
      ? {
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%'
        }
      : undefined
  )

  const shouldRender = computed(() => mounted.value || props.keepMounted)

  watch(contentRef, (target) => {
    const element = resolveHostElement(target)

    if (contentOpen.value && element) {
      root.currentContentEl.value = element
    }
  })

  watch(contentOpen, (open) => {
    if (open && resolveHostElement(contentRef.value)) {
      root.currentContentEl.value = resolveHostElement(contentRef.value)
    }
  })

  watch(
    () => transitionStatus.value,
    async (status) => {
      if (status !== 'ending') {
        return
      }

      await nextTick()
      await waitForCloseTransition(resolveHostElement(contentRef.value))

      if (!contentOpen.value) {
        setMounted(false)
      }
    }
  )

  watch(
    () => root.menuPopupMounted.value,
    (popupMounted) => {
      if (!popupMounted) {
        setMounted(false)
      }
    }
  )
</script>

<template>
  <Teleport
    v-if="viewportTarget && shouldRender"
    :to="viewportTarget"
  >
    <component
      :is="props.as"
      ref="contentRef"
      :class="contentClasses"
      :style="contentStyle"
      :data-testid="testId"
      v-bind="contentDataAttrs"
      role="region"
    >
      <slot />
    </component>
  </Teleport>
</template>
