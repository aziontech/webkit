<script setup lang="ts">
  import { type ComponentPublicInstance } from 'vue'

  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = usePopoverContext()

  const setPanelRef = (el: globalThis.Element | ComponentPublicInstance | null) => {
    ctx.panelRef.value = el instanceof HTMLElement ? el : null
  }
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="ctx.isOpen.value"
        :id="ctx.contentId"
        :ref="setPanelRef"
        role="dialog"
        tabindex="-1"
        aria-modal="false"
        :aria-labelledby="ctx.hasTitle.value ? ctx.titleId : undefined"
        :aria-describedby="ctx.hasDescription.value ? ctx.descriptionId : undefined"
        :data-testid="`${ctx.testId}__panel`"
        :data-state="ctx.isOpen.value ? 'open' : 'closed'"
        :data-placement="ctx.placement.value"
        :data-width="ctx.width.value || null"
        :style="ctx.panelStyle.value"
        class="flex min-w-(--container-3xs) max-w-(--container-xs) flex-col rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm) outline-none data-[width=small]:min-w-(--container-xs) data-[width=small]:max-w-(--container-xs) data-[width=medium]:min-w-(--container-sm) data-[width=medium]:max-w-(--container-sm) data-[width=large]:min-w-(--container-md) data-[width=large]:max-w-(--container-md)"
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
