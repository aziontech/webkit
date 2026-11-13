<script setup lang="ts">
  import { type MaybeElement, onClickOutside } from '@vueuse/core'
  import { computed, type CSSProperties, shallowRef, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element'
  import { useNavigationMenuRoot } from './composables/use-navigation-menu-context'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root'

  defineOptions({ name: 'NavigationMenuPopup', inheritAttrs: false })

  /** Surface treatment: the raised surface, or the theme's inverted one. */
  export type NavigationMenuPopupKind = 'default' | 'contrast'

  interface Props {
    /** Surface treatment. */
    kind?: NavigationMenuPopupKind
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'default'
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__popup'
  )

  const root = useNavigationMenuRoot()
  const popupHostRef = shallowRef<MaybeElement>(null)

  const ROOT_CLASS =
    'w-[var(--popup-width,auto)] h-[var(--popup-height,auto)] [transform-origin:var(--popup-origin,top_left)] ' +
    'transition-[opacity,scale,width,height] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none ' +
    'data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[starting-style]:transition-none ' +
    'data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:transition-[opacity,scale] ' +
    'relative overflow-hidden rounded-(--shape-card) border border-solid border-(--border-default) ' +
    'bg-(--bg-surface-raised) shadow-(--shadow-lg) ' +
    'max-h-[var(--available-height,100vh)] max-w-[var(--available-width,100vw)] ' +
    'data-[kind=contrast]:[--bg-surface-raised:var(--bg-contrast)] ' +
    'data-[kind=contrast]:[--border-default:color-mix(in_srgb,var(--text-contrast)_20%,var(--bg-contrast))] ' +
    'data-[kind=contrast]:[--text-default:var(--text-contrast)] ' +
    'data-[kind=contrast]:[--text-muted:color-mix(in_srgb,var(--text-contrast)_60%,var(--bg-contrast))] ' +
    'data-[kind=contrast]:[--bg-hover:color-mix(in_srgb,var(--text-contrast)_8%,transparent)] ' +
    'data-[kind=contrast]:[--bg-canvas:var(--bg-contrast)]'

  const popupHidden = computed(() => !root.menuPopupMounted.value)

  const popupDataAttrs = computed(() => ({
    'data-kind': props.kind,
    'data-open': root.menuOpen.value ? '' : undefined,
    'data-closed': !root.menuOpen.value ? '' : undefined,
    'data-starting-style': root.popupTransitionStatus.value === 'starting' ? '' : undefined,
    'data-ending-style': root.popupTransitionStatus.value === 'ending' ? '' : undefined
  }))

  const popupStyle = computed((): CSSProperties => ({
    '--transform-origin': 'var(--transform-origin, center)',
    ...(root.menuOpen.value ? {} : { pointerEvents: 'none' })
  }))

  watch(
    popupHostRef,
    (target) => {
      root.setPopupEl(resolveHostElement(target))
    },
    { immediate: true }
  )

  onClickOutside(popupHostRef, (event) => {
    if (!root.menuOpen.value) {
      return
    }

    root.setValue(null, createChangeEventDetails('outside-press', event, undefined))
  })

  const onPointerEnter = () => {
    root.cancelTimers()
  }

  const onPointerLeave = (event: globalThis.PointerEvent) => {
    root.scheduleClose(createChangeEventDetails('trigger-hover', event, undefined))
  }
</script>

<template>
  <nav
    ref="popupHostRef"
    :hidden="popupHidden"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :style="popupStyle"
    :data-testid="testId"
    v-bind="popupDataAttrs"
    role="navigation"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @keydown="root.onPopupKeydown"
  >
    <slot />
  </nav>
</template>
