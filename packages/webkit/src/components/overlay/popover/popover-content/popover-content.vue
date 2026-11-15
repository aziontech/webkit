<script setup lang="ts">
  import { type ComponentPublicInstance } from 'vue'

  import { usePortalLocale } from '../../../../composables/use-translate'
  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = usePopoverContext()

  const setPanelEl = (el: globalThis.Element | ComponentPublicInstance | null) => {
    ctx.panelEl.value = el instanceof HTMLElement ? el : null
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
        :data-testid="`${ctx.testId}__panel`"
        :data-state="ctx.isOpen.value ? 'open' : 'closed'"
        :data-placement="ctx.placement.value"
        :data-size="ctx.size.value || null"
        :data-width="ctx.size.value || null"
        :style="ctx.panelStyle.value"
        class="flex min-w-(--container-3xs) max-w-(--container-xs) flex-col overflow-y-auto rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm) outline-none data-[size=small]:min-w-(--container-xs) data-[size=small]:max-w-(--container-xs) data-[size=medium]:min-w-(--container-sm) data-[size=medium]:max-w-(--container-sm) data-[size=large]:min-w-(--container-md) data-[size=large]:max-w-(--container-md)"
      >
        <div
          :data-testid="`${ctx.testId}__body`"
          class="flex flex-col"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
