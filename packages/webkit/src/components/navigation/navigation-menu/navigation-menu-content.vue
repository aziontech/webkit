<script setup lang="ts">
  import { computed, type CSSProperties, nextTick, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element'
  import {
    useNavigationMenuItem,
    useNavigationMenuRoot
  } from './composables/use-navigation-menu-context'
  import { useTransitionStatus } from './composables/use-transition-status'
  import { navigationMenuTransitionClasses, waitForCloseTransition } from './presets/animations'
  import { navigationMenuContentPaddingClasses } from './presets/styles'

  defineOptions({ name: 'NavigationMenuContent', inheritAttrs: false })

  interface Props {
    /** Keeps content mounted when closed. */
    keepMounted?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    keepMounted: false
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

  const exitWidth = ref<number | null>(null)

  const contentDataAttrs = computed(() => ({
    'data-open': contentOpen.value ? '' : undefined,
    'data-closed': !contentOpen.value ? '' : undefined,
    'data-starting-style': transitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': transitionStatus.value === 'ending' ? '' : undefined,
    'data-activation-direction': root.activationDirection.value ?? undefined
  }))

  const contentStyle = computed((): CSSProperties | undefined =>
    isExiting.value
      ? {
          position: 'absolute',
          top: '0',
          left: '0',
          width: exitWidth.value != null ? `${exitWidth.value}px` : '100%'
        }
      : undefined
  )

  const shouldRender = computed(() => mounted.value || props.keepMounted)

  watch(contentRef, (target) => {
    const element = resolveHostElement(target)

    if (contentOpen.value && element) {
      root.setCurrentContentEl(element)
    }
  })

  watch(contentOpen, (open) => {
    const element = resolveHostElement(contentRef.value)

    if (open && element) {
      root.setCurrentContentEl(element)
      return
    }

    if (!open && element) {
      exitWidth.value = element.getBoundingClientRect().width || null
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
    <div
      ref="contentRef"
      :class="contentClasses"
      :style="contentStyle"
      :data-testid="testId"
      v-bind="contentDataAttrs"
      role="region"
    >
      <slot />
    </div>
  </Teleport>
</template>
