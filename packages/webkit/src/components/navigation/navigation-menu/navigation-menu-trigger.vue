<script setup lang="ts">
  import {
    computed,
    type ComputedRef,
    inject,
    onMounted,
    onUnmounted,
    ref,
    useAttrs,
    watch
  } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { resolveHostElement } from './composables/resolve-host-element.js'
  import {
    NAVIGATION_MENU_ITEM_KEY,
    useNavigationMenuRoot
  } from './composables/use-navigation-menu-context.js'
  import { useNavigationMenuListHighlight } from './composables/use-navigation-menu-list-highlight-context.js'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root.js'
  import { useNavigationMenuViewportSize } from './composables/use-navigation-menu-viewport-size.js'
  import { getNavigationMenuTriggerClasses } from './presets/styles'

  interface NavigationMenuItemContext {
    itemValue: ComputedRef<string | number>
    open: ComputedRef<boolean>
  }

  interface NavigationMenuListHighlightContext {
    setTarget: (element: HTMLElement | null) => void
    handleTargetPointerLeave: (event: globalThis.Event, element: HTMLElement | null) => void
  }

  defineOptions({ name: 'NavigationMenuTrigger', inheritAttrs: false })

  interface Props {
    /** Renders as a plain link when set. */
    href?: string
    /** Marks the link as the current page. */
    active?: boolean
    /** Closes the menu when the link is clicked. */
    closeOnClick?: boolean
    /** Uses a native button element when not a link. */
    nativeButton?: boolean
    /** Polymorphic control element. */
    as?: string | object
  }

  const props = withDefaults(defineProps<Props>(), {
    href: undefined,
    active: false,
    closeOnClick: false,
    nativeButton: true,
    as: undefined
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const passthroughAttrs = computed(() => {
    const { class: omittedClass, ...rest } = attrs
    void omittedClass
    return rest
  })
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-menu__trigger'
  )

  const root = useNavigationMenuRoot()
  const listHighlight =
    useNavigationMenuListHighlight() as NavigationMenuListHighlightContext | null
  const itemContext = inject(NAVIGATION_MENU_ITEM_KEY, null) as NavigationMenuItemContext | null
  const controlRef = ref<HTMLElement | null>(null)

  const isLink = computed(() => props.href != null && props.href !== '')

  const itemOpen = computed(() => itemContext?.open.value ?? false)
  const itemValueResolved = computed(() => itemContext?.itemValue.value ?? '')

  const componentTag = computed(() => {
    if (props.as) {
      return props.as
    }

    if (isLink.value) {
      return 'a'
    }

    return props.nativeButton ? 'button' : 'div'
  })

  const controlClasses = computed(() =>
    cn(getNavigationMenuTriggerClasses(isLink.value), attrs.class as string | undefined)
  )

  const isActiveTrigger = computed(
    () => !isLink.value && itemContext != null && root.menuOpen.value && itemOpen.value
  )

  useNavigationMenuViewportSize(
    isActiveTrigger,
    root.popupEl,
    root.positionerEl,
    root.currentContentEl,
    root.menuValue,
    itemValueResolved
  )

  const resolveElement = () => resolveHostElement(controlRef.value)

  const syncHighlight = () => {
    if (isLink.value && props.active) {
      listHighlight?.setTarget(resolveElement())
    }
  }

  const syncTriggerRegistration = () => {
    if (isLink.value || !itemContext) {
      return
    }

    const element = resolveElement()

    if (!element) {
      return
    }

    root.registerTrigger(itemValueResolved.value, element)
  }

  const assertItemContext = () => {
    if (!itemContext) {
      throw new Error(
        'NavigationMenu.Trigger must be used within NavigationMenu.Item when opening a submenu.'
      )
    }
  }

  const onPointerEnter = (event: globalThis.PointerEvent) => {
    listHighlight?.setTarget(resolveElement())

    if (isLink.value) {
      return
    }

    assertItemContext()
    root.cancelTimers()
    root.scheduleOpen(
      itemValueResolved.value,
      createChangeEventDetails('trigger-hover', event, resolveElement() ?? undefined)
    )
  }

  const onPointerLeave = (event: globalThis.PointerEvent) => {
    listHighlight?.handleTargetPointerLeave(event, resolveElement())

    if (isLink.value) {
      return
    }

    root.scheduleClose(
      createChangeEventDetails('trigger-hover', event, resolveElement() ?? undefined)
    )
  }

  const onClick = (event: globalThis.MouseEvent) => {
    if (isLink.value) {
      if (!props.closeOnClick) {
        return
      }

      root.setValue(
        null,
        createChangeEventDetails(
          'link-press',
          event,
          resolveHostElement(event.currentTarget as HTMLElement | null) ?? undefined
        )
      )
      return
    }

    assertItemContext()
    root.cancelTimers()
    const nextValue = itemOpen.value ? null : itemValueResolved.value
    root.setValue(
      nextValue,
      createChangeEventDetails('trigger-press', event, resolveElement() ?? undefined)
    )
  }

  onMounted(() => {
    syncTriggerRegistration()
    syncHighlight()
  })

  watch(controlRef, syncTriggerRegistration)
  watch(() => props.active, syncHighlight)

  watch(itemOpen, (open) => {
    if (!isLink.value && open) {
      listHighlight?.setTarget(resolveElement())
    }
  })

  onUnmounted(() => {
    if (!isLink.value && itemContext) {
      root.unregisterTrigger(itemValueResolved.value)
    }
  })
</script>

<template>
  <component
    :is="componentTag"
    ref="controlRef"
    v-bind="passthroughAttrs"
    :href="isLink ? href : undefined"
    :type="!isLink && nativeButton ? 'button' : undefined"
    :class="controlClasses"
    :data-testid="testId"
    :aria-expanded="!isLink ? itemOpen : undefined"
    :aria-haspopup="!isLink ? true : undefined"
    :aria-current="isLink && active ? 'page' : undefined"
    :data-active="isLink && active ? '' : undefined"
    :data-popup-open="!isLink && itemOpen ? '' : undefined"
    :data-pressed="!isLink && itemOpen ? '' : undefined"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
    @click="onClick"
    @keydown="!isLink ? root.onTriggerKeydown : undefined"
  >
    <slot />
  </component>
</template>
