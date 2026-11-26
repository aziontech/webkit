<script setup lang="ts">
  import { type ComponentPublicInstance, computed, useAttrs } from 'vue'

  import { useTeleportReady } from '../../../../composables/use-teleport-ready'
  import { usePortalLocale } from '../../../../composables/use-translate'
  import { usePopoverContext } from '../composables/use-popover-context'

  defineOptions({
    name: 'PopoverContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = usePopoverContext()
  const testId = computed(() => String(attrs['data-testid'] ?? 'popover-content'))

  const setPanelEl = (el: globalThis.Element | ComponentPublicInstance | null) => {
    ctx.panelEl.value = el instanceof HTMLElement ? el : null
  }

  const portalLocale = usePortalLocale()

  const PANEL_CLASS =
    'flex min-w-[min(var(--container-3xs),calc(100vw_-_var(--spacing-md)))] max-w-[min(var(--container-xs),calc(100vw_-_var(--spacing-md)))] flex-col overflow-y-auto ' +
    'rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm) outline-none ' +
    'data-[size=small]:min-w-[min(var(--container-xs),calc(100vw_-_var(--spacing-md)))] data-[size=small]:max-w-[min(var(--container-xs),calc(100vw_-_var(--spacing-md)))] ' +
    'data-[size=medium]:min-w-[min(var(--container-sm),calc(100vw_-_var(--spacing-md)))] data-[size=medium]:max-w-[min(var(--container-sm),calc(100vw_-_var(--spacing-md)))] ' +
    'data-[size=large]:min-w-[min(var(--container-md),calc(100vw_-_var(--spacing-md)))] data-[size=large]:max-w-[min(var(--container-md),calc(100vw_-_var(--spacing-md)))]'

  const teleportReady = useTeleportReady()
</script>

<template>
  <Teleport
    to="body"
    :disabled="!teleportReady"
  >
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="ctx.isOpen.value"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :id="ctx.contentId"
        :ref="setPanelEl"
        role="dialog"
        tabindex="-1"
        aria-modal="false"
        :aria-labelledby="
          ctx.hasTitle.value ? ctx.titleId : ctx.triggerEl.value?.id || ctx.triggerId
        "
        :aria-describedby="ctx.hasDescription.value ? ctx.descriptionId : undefined"
        :data-testid="testId"
        :data-state="ctx.isOpen.value ? 'open' : 'closed'"
        :data-side="ctx.side.value"
        :data-align="ctx.align.value"
        :data-size="ctx.size.value || null"
        :data-width="ctx.size.value || null"
        :style="ctx.panelStyle.value"
        :class="PANEL_CLASS"
      >
        <div
          :data-testid="`${testId}__body`"
          class="flex flex-col"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
