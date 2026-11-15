<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { usePortalLocale } from '../../../../composables/use-locale/use-translate'
  import { useHoverCardContext } from '../injection-key'

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

  function setPanelRef(el: unknown) {
    ctx.panelRef.value = el instanceof HTMLElement ? el : null
  }

  function onPointerleave(event: globalThis.PointerEvent) {
    if (event.pointerType === 'touch') return
    ctx.scheduleClose()
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
        :ref="setPanelRef"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :data-testid="testId"
        :data-state="ctx.isOpen.value ? 'open' : 'closed'"
        :data-placement="ctx.placement.value"
        :style="ctx.panelStyle.value"
        class="flex w-max min-w-(--container-3xs) max-w-(--container-xs) flex-col gap-(--spacing-sm) overflow-y-auto rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-md) text-body-sm text-(--text-default) shadow-(--shadow-sm) [transform-origin:var(--popup-origin,top_left)]"
        @pointerenter="ctx.cancelClose()"
        @pointerleave="onPointerleave"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
