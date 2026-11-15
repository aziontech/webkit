<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, useAttrs, watch } from 'vue'

  import { cn } from '../../../utils/cn'
  import {
    useNavigationMenuContext,
    useOptionalNavigationMenuItemContext
  } from './composables/use-navigation-menu-context'
  import { useNavigationMenuListHighlightContext } from './composables/use-navigation-menu-list-highlight-context'
  import { createChangeEventDetails } from './composables/use-navigation-menu-root'
  import { resolveHostElement } from './lib/host-element'

  defineOptions({ name: 'NavigationMenuTrigger', inheritAttrs: false })

  export interface NavigationMenuTriggerProps {
    /** Renders as a plain link when set. */
    href?: string
    /** Marks the link as the current page. */
    active?: boolean
    /** Closes the menu when the link is clicked. */
    closeOnClick?: boolean
  }

  const props = withDefaults(defineProps<NavigationMenuTriggerProps>(), {
    href: '',
    active: false,
    closeOnClick: false
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const passthroughAttrs = computed(() => {
    const { class: omittedClass, ...rest } = attrs
    void omittedClass
    return rest
  })
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-navigation-menu__trigger'
  )

  const root = useNavigationMenuContext()
  const listHighlight = useNavigationMenuListHighlightContext()
  const itemContext = useOptionalNavigationMenuItemContext()
  const controlEl = ref<HTMLElement | null>(null)

  const isLink = computed(() => props.href !== '')

  const itemOpen = computed(() => itemContext?.open.value ?? false)
  const itemValueResolved = computed(() => itemContext?.itemValue.value ?? '')
  const controlsId = computed(() =>
    !isLink.value && itemOpen.value ? itemContext?.contentId : undefined
  )

  const componentTag = computed(() => (isLink.value ? 'a' : 'button'))

  const ROOT_CLASS =
    'relative z-1 inline-flex cursor-pointer items-center gap-(--spacing-xs) ' +
    'rounded-(--shape-button) bg-transparent px-(--spacing-sm) py-(--spacing-xs) ' +
    'no-underline transition-colors duration-moderate-02 ease-in-out motion-reduce:transition-none ' +
    'text-label-md text-(--text-default) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'data-[popup-open]:text-(--text-default) data-[pressed]:text-(--text-default) data-[active]:text-(--text-default)'

  const resolveElement = () => resolveHostElement(controlEl.value)

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

  const onPointerenter = (event: globalThis.PointerEvent) => {
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

  const onPointerleave = (event: globalThis.PointerEvent) => {
    listHighlight?.onTargetPointerleave(event, resolveElement())

    if (isLink.value) {
      return
    }

    root.scheduleClose(
      createChangeEventDetails('trigger-hover', event, resolveElement() ?? undefined)
    )
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (isLink.value) {
      return
    }

    root.onTriggerKeydown(event)
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

  watch(controlEl, syncTriggerRegistration)
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
    ref="controlEl"
    v-bind="passthroughAttrs"
    :href="isLink ? href : undefined"
    :type="isLink ? undefined : 'button'"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-testid="testId"
    :aria-expanded="!isLink ? itemOpen : undefined"
    :aria-controls="controlsId"
    :aria-current="isLink && active ? 'page' : undefined"
    :data-active="isLink && active ? '' : undefined"
    :data-popup-open="!isLink && itemOpen ? '' : undefined"
    :data-pressed="!isLink && itemOpen ? '' : undefined"
    @pointerenter="onPointerenter"
    @pointerleave="onPointerleave"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
    <span
      v-if="!isLink"
      class="inline-flex transition-[rotate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none data-[state=open]:rotate-180"
      aria-hidden="true"
      data-testid="navigation-navigation-menu__icon"
      :data-state="itemOpen ? 'open' : 'closed'"
    >
      <i class="ai ai-chevron-down" />
    </span>
  </component>
</template>
