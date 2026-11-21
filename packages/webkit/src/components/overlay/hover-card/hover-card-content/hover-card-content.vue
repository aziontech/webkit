<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useElementListener } from '../../../../composables/use-element-listener'
  import { usePortalLocale } from '../../../../composables/use-translate'
  import { useHoverCardContext } from '../composables/use-hover-card-context'
  import { HOVER_CARD_FOCUSABLE } from '../injection-key'

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
    () => (attrs['data-testid'] as string | undefined) ?? 'hover-card-content'
  )

  const panelEl = ref<globalThis.HTMLElement | null>(null)

  function setPanelEl(el: unknown) {
    panelEl.value = el instanceof HTMLElement ? el : null
    ctx.panelEl.value = panelEl.value
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

  useElementListener(panelEl, 'pointerenter', () => ctx.cancelClose())
  useElementListener(panelEl, 'pointerleave', onPointerleave)
  useElementListener(panelEl, 'focusin', () => ctx.cancelClose())
  useElementListener(panelEl, 'focusout', onFocusout)
  useElementListener(panelEl, 'keydown', onKeydown)

  const portalLocale = usePortalLocale()

  const PANEL_CLASS =
    'flex w-max min-w-(--container-3xs) max-w-(--container-xs) flex-col gap-(--spacing-sm) overflow-y-auto rounded-(--shape-control) border border-(--border-default) ' +
    'bg-(--bg-surface-raised) p-(--spacing-md) text-body-sm text-(--text-default) shadow-(--shadow-sm) [transform-origin:var(--popup-origin,top_left)]'
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
        :data-side="ctx.side.value"
        :data-align="ctx.align.value"
        :style="ctx.panelStyle.value"
        :class="PANEL_CLASS"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
