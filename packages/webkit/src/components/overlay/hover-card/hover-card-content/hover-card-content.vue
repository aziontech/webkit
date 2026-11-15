<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { usePortalLocale } from '../../../../composables/use-translate'
  import { HOVER_CARD_FOCUSABLE, useHoverCardContext } from '../injection-key'

  defineOptions({
    name: 'HoverCardContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useHoverCardContext()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__content`
  )

  function setPanelEl(el: unknown) {
    ctx.panelEl.value = el instanceof HTMLElement ? el : null
  }

  function onPointerleave(event: globalThis.PointerEvent) {
    if (event.pointerType === 'touch') return
    ctx.scheduleClose()
  }

  function onFocusout(event: globalThis.FocusEvent) {
    const next = event.relatedTarget as globalThis.Node | null
    if (next && (ctx.panelEl.value?.contains(next) || ctx.triggerEl.value?.contains(next))) return
    ctx.scheduleClose()
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    if (event.key !== 'Tab') return
    const items = ctx.panelEl.value?.querySelectorAll(HOVER_CARD_FOCUSABLE) ?? []
    if (event.target !== items[event.shiftKey ? 0 : items.length - 1]) return
    if (event.shiftKey) event.preventDefault()
    ctx.focusTrigger()
  }

  const portalLocale = usePortalLocale()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="ctx.isOpen.value"
        v-bind="attrs"
        :id="ctx.contentId"
        :ref="setPanelEl"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :data-testid="testId"
        :data-state="ctx.isOpen.value ? 'open' : 'closed'"
        :data-placement="ctx.placement.value"
        :style="ctx.panelStyle.value"
        class="flex w-max min-w-(--container-3xs) max-w-(--container-xs) flex-col gap-(--spacing-sm) overflow-y-auto rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-md) text-body-sm text-(--text-default) shadow-(--shadow-sm) [transform-origin:var(--popup-origin,top_left)]"
        @pointerenter="ctx.cancelClose()"
        @pointerleave="onPointerleave"
        @focusin="ctx.cancelClose()"
        @focusout="onFocusout"
        @keydown="onKeydown"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
