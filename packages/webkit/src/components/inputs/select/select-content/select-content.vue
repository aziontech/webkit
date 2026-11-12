<script setup lang="ts">
  import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import LazyNodes from '../../../../composables/use-lazy-chunks/lazy-nodes'
  import { usePortalLocale } from '../../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../../composables/use-placement'
  import ScrollArea from '../../../layout/scroll-area/scroll-area.vue'
  import { selectContextKey } from '../injection-key'

  defineOptions({
    name: 'SelectContent',
    inheritAttrs: false
  })

  const ctx = inject(selectContextKey)
  if (!ctx) {
    throw new Error('SelectContent must be used inside <Select>.')
  }

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select-content')

  const root = ref<globalThis.HTMLDivElement | null>(null)
  const lazy = ref<{ revealAll: () => void; hasHidden: () => boolean } | null>(null)

  const { panelStyle } = usePlacement({
    triggerRef: ctx.triggerRef,
    panelRef: root,
    isOpen: ctx.open,
    placement: 'bottom-start',
    offset: 4,
    matchTriggerWidth: ctx.kind.value !== 'transparent'
  })

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      ctx.setOpen(false)
      return
    }
    if (event.key === 'Tab') {
      if (event.shiftKey) event.preventDefault()
      ctx.setOpen(false)
      ctx.triggerRef.value?.focus()
      return
    }
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    )
      return
    event.preventDefault()
    if (lazy.value?.hasHidden()) {
      lazy.value.revealAll()
      const key = event.key
      nextTick(() => moveFocus(key))
      return
    }
    moveFocus(event.key)
  }

  const moveFocus = (key: string) => {
    const el = root.value
    if (!el) return
    const options = Array.from(
      el.querySelectorAll<HTMLElement>('[role="option"]:not([data-disabled])')
    )
    if (options.length === 0) return
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const currentIndex = active ? options.indexOf(active) : -1
    let nextIndex = currentIndex
    if (key === 'ArrowDown') nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
    else if (key === 'ArrowUp') nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
    else if (key === 'Home') nextIndex = 0
    else if (key === 'End') nextIndex = options.length - 1
    options[nextIndex]?.focus()
  }

  const onDocumentPointerDown = (event: globalThis.PointerEvent) => {
    if (!ctx.open.value) return
    const el = root.value
    const target = event.target as Node | null
    if (!el || !target) return
    if (el.contains(target)) return
    const trigger = ctx.triggerRef.value
    if (trigger && trigger.contains(target)) return
    ctx.setOpen(false)
  }

  const focusInitial = () => {
    const el = root.value
    if (!el) return
    const search = el.querySelector<HTMLElement>(
      'input:not([type="checkbox"]):not([type="radio"]):not([disabled])'
    )
    const target =
      search ??
      el.querySelector<HTMLElement>('[role="option"][aria-selected="true"]:not([data-disabled])') ??
      el.querySelector<HTMLElement>('[role="option"]:not([data-disabled])')
    target?.focus()
  }

  watch(
    () => ctx.open.value,
    async (next) => {
      if (next) {
        await nextTick()
        focusInitial()
        document.addEventListener('pointerdown', onDocumentPointerDown, true)
      } else {
        const hadFocus = !!root.value?.contains(document.activeElement)
        document.removeEventListener('pointerdown', onDocumentPointerDown, true)
        if (hadFocus) {
          await nextTick()
          ctx.triggerRef.value?.focus()
        }
      }
    }
  )

  onMounted(() => {
    if (ctx.open.value) {
      document.addEventListener('pointerdown', onDocumentPointerDown, true)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  })

  const portalLocale = usePortalLocale()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="ctx.open.value"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        ref="root"
        v-bind="$attrs"
        :id="ctx.contentId"
        role="listbox"
        :aria-multiselectable="ctx.multiple.value || undefined"
        :data-testid="testId"
        :data-state="ctx.open.value ? 'open' : 'closed'"
        :data-mode="ctx.multiple.value ? 'multiple' : 'single'"
        :class="attrs.class"
        :style="panelStyle"
        :data-kind="ctx.kind.value"
        class="fixed z-(--z-input-overlay) flex max-h-[20rem] flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-xs) data-[kind=transparent]:min-w-(--container-3xs)"
        @keydown="onKeydown"
      >
        <div
          v-if="$slots['search']"
          class="flex shrink-0 items-center justify-center p-(--spacing-xxs)"
          :data-testid="`${testId}__search`"
        >
          <slot name="search" />
        </div>
        <ScrollArea
          class="group/options flex max-h-60 flex-col items-stretch px-(--spacing-xxs) py-(--spacing-xs)"
          :data-testid="`${testId}__list`"
        >
          <LazyNodes
            ref="lazy"
            :row-height="32"
          >
            <slot />
          </LazyNodes>
        </ScrollArea>
        <div
          v-if="$slots['footer']"
          class="flex shrink-0 items-center justify-center p-(--spacing-xxs)"
          :data-testid="`${testId}__footer`"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
