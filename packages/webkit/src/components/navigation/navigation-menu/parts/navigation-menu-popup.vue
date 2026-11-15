<script setup lang="ts">
  import { type MaybeElement, onClickOutside } from '@vueuse/core'
  import { computed, type CSSProperties, shallowRef, useAttrs, watch } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useNavigationMenuContext } from '../composables/use-navigation-menu-context'
  import { createChangeEventDetails } from '../composables/use-navigation-menu-root'
  import { resolveHostElement } from '../lib/host-element'

  defineOptions({ name: 'NavigationMenuPopup', inheritAttrs: false })

  /** Surface treatment: the raised surface, or the theme's inverted one. */
  export type NavigationMenuPopupVariant = 'default' | 'contrast'

  interface Props {
    /** Surface treatment. */
    variant?: NavigationMenuPopupVariant
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'default'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-navigation-menu__popup'
  )

  const root = useNavigationMenuContext()
  const popupHostEl = shallowRef<MaybeElement>(null)

  const ROOT_CLASS =
    'w-[var(--navigation-menu-popup-width,auto)] h-[var(--navigation-menu-popup-height,auto)] [transform-origin:var(--popup-origin,top_left)] ' +
    'transition-[opacity,scale,width,height] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none ' +
    'data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[starting-style]:transition-none ' +
    'data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:transition-[opacity,scale] ' +
    'relative overflow-hidden rounded-(--shape-card) border border-solid border-(--border-default) ' +
    'bg-(--bg-surface-raised) shadow-(--shadow-lg) ' +
    'max-h-[var(--navigation-menu-available-height,100vh)] max-w-[var(--navigation-menu-available-width,100vw)] ' +
    'data-[variant=contrast]:[--bg-surface-raised:var(--bg-contrast)] ' +
    'data-[variant=contrast]:[--border-default:color-mix(in_srgb,var(--text-contrast)_20%,var(--bg-contrast))] ' +
    'data-[variant=contrast]:[--text-default:var(--text-contrast)] ' +
    'data-[variant=contrast]:[--text-muted:color-mix(in_srgb,var(--text-contrast)_60%,var(--bg-contrast))] ' +
    'data-[variant=contrast]:[--bg-hover:color-mix(in_srgb,var(--text-contrast)_8%,transparent)] ' +
    'data-[variant=contrast]:[--bg-canvas:var(--bg-contrast)]'

  const popupHidden = computed(() => !root.menuPopupMounted.value)

  const popupDataAttrs = computed(() => ({
    'data-variant': props.variant,
    'data-state': root.menuOpen.value ? 'open' : 'closed',
    'data-starting-style': root.popupTransitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': root.popupTransitionStatus.value === 'ending' ? '' : undefined
  }))

  const popupStyle = computed((): CSSProperties => ({
    ...(root.menuOpen.value ? {} : { pointerEvents: 'none' })
  }))

  watch(
    popupHostEl,
    (target) => {
      root.setPopupEl(resolveHostElement(target))
    },
    { immediate: true }
  )

  onClickOutside(popupHostEl, (event) => {
    if (!root.menuOpen.value) {
      return
    }

    root.setValue(null, createChangeEventDetails('outside-press', event, undefined))
  })

  const onPointerenter = () => {
    root.cancelTimers()
  }

  const onPointerleave = (event: globalThis.PointerEvent) => {
    root.scheduleClose(createChangeEventDetails('trigger-hover', event, undefined))
  }
</script>

<template>
  <nav
    ref="popupHostEl"
    :hidden="popupHidden"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :style="popupStyle"
    :data-testid="testId"
    v-bind="popupDataAttrs"
    role="navigation"
    @pointerenter="onPointerenter"
    @pointerleave="onPointerleave"
    @keydown="root.onPopupKeydown"
  >
    <slot />
  </nav>
</template>
