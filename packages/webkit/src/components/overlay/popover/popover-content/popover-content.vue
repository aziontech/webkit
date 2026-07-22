<script setup lang="ts">
  import { usePopoverContext } from '../injection-key'

  defineOptions({
    name: 'PopoverContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const ctx = usePopoverContext()

  // Assign the panel element to the root-owned context ref (function ref), so the root's
  // placement / focus / Esc+Tab / outside-click logic keeps operating on `ctx.panelRef`.
  const setPanelRef = (el: globalThis.Element | null) => {
    ctx.panelRef.value = (el as globalThis.HTMLElement | null) ?? null
  }
</script>

<template>
  <!--
    The panel + its content render together in ONE teleported subtree (the Select /
    Tooltip pattern), so Vue's <Transition> scales the whole thing on enter/leave. The
    root owns state/placement/focus and reads this element through `ctx.panelRef`.
  -->
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
        class="flex min-w-[var(--container-3xs)] max-w-[var(--container-xs)] flex-col rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-sm)] outline-none data-[width=small]:min-w-[var(--container-xs)] data-[width=small]:max-w-[var(--container-xs)] data-[width=medium]:min-w-[var(--container-sm)] data-[width=medium]:max-w-[var(--container-sm)] data-[width=large]:min-w-[var(--container-md)] data-[width=large]:max-w-[var(--container-md)]"
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
