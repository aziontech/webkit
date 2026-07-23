<script setup lang="ts">
  import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import ScrollArea from '../../../layout/scroll-area/scroll-area.vue'
  import { multiSelectContextKey } from '../injection-key'

  defineOptions({
    name: 'MultiSelectContent',
    inheritAttrs: false
  })

  const ctx = inject(multiSelectContextKey)
  if (!ctx) {
    throw new Error('MultiSelectContent must be used inside MultiSelect.')
  }

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'multi-select-content'
  )

  const root = ref<globalThis.HTMLDivElement | null>(null)

  const position = ref({ top: 0, left: 0, width: 0 })

  const updatePosition = () => {
    const trigger = ctx.triggerRef.value
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    position.value = {
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    }
  }

  const positionStyle = computed(() => ({
    top: `${position.value.top}px`,
    left: `${position.value.left}px`,
    width: `${position.value.width}px`,
    '--popup-origin': 'top'
  }))

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      ctx.setOpen(false)
      return
    }
    if (event.key === 'Tab') {
      ctx.setOpen(false)
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
    const el = root.value
    if (!el) return
    const options = Array.from(
      el.querySelectorAll<HTMLElement>('[role="option"]:not([data-disabled])')
    )
    if (options.length === 0) return
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const currentIndex = active ? options.indexOf(active) : -1
    let nextIndex = currentIndex
    if (event.key === 'ArrowDown')
      nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0
    else if (event.key === 'ArrowUp')
      nextIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1
    else if (event.key === 'Home') nextIndex = 0
    else if (event.key === 'End') nextIndex = options.length - 1
    options[nextIndex]?.focus()
  }

  const onDocumentPointerDown = (event: globalThis.PointerEvent) => {
    if (!ctx.open.value) return
    const el = root.value
    const target = event.target as Node | null
    if (!el || !target) return
    if (el.contains(target)) return
    ctx.setOpen(false)
  }

  watch(
    () => ctx.open.value,
    async (next) => {
      if (next) {
        await nextTick()
        updatePosition()
        document.addEventListener('pointerdown', onDocumentPointerDown, true)
        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition, true)
      } else {
        document.removeEventListener('pointerdown', onDocumentPointerDown, true)
        window.removeEventListener('resize', updatePosition)
        window.removeEventListener('scroll', updatePosition, true)
      }
    }
  )

  onMounted(() => {
    if (ctx.open.value) {
      updatePosition()
      document.addEventListener('pointerdown', onDocumentPointerDown, true)
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    }
  })

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', onDocumentPointerDown, true)
    window.removeEventListener('resize', updatePosition)
    window.removeEventListener('scroll', updatePosition, true)
  })
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="ctx.open.value"
        ref="root"
        v-bind="$attrs"
        :id="ctx.contentId"
        role="listbox"
        aria-multiselectable="true"
        :data-testid="testId"
        :data-state="ctx.open.value ? 'open' : 'closed'"
        :class="attrs.class"
        :style="positionStyle"
        class="fixed z-[var(--z-input-overlay)] flex max-h-[20rem] flex-col overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-xs)]"
        @keydown="onKeydown"
      >
        <div
          v-if="$slots['search']"
          class="flex shrink-0 items-center justify-center p-[var(--spacing-xxs)]"
          :data-testid="`${testId}__search`"
        >
          <slot name="search" />
        </div>
        <ScrollArea
          class="flex max-h-60 flex-col items-stretch p-[var(--spacing-xxs)]"
          :data-testid="`${testId}__list`"
        >
          <slot />
        </ScrollArea>
        <div
          v-if="$slots['footer']"
          class="flex shrink-0 items-center justify-center p-[var(--spacing-xxs)]"
          :data-testid="`${testId}__footer`"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
