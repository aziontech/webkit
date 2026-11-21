<script setup lang="ts">
  import { ref, type StyleValue, useAttrs } from 'vue'

  import LazyNodes from '../../../../composables/use-lazy-chunks/lib/lazy-nodes'
  import {
    useListboxContent,
    type UseListboxContentOptions
  } from '../../../../composables/use-listbox-content'
  import { usePlacement, type UsePlacementOptions } from '../../../../composables/use-placement'
  import type { SelectRootContext } from '../../../../composables/use-select-root'
  import { usePortalLocale } from '../../../../composables/use-translate'
  import ScrollArea from '../../../layout/scroll-area/scroll-area.vue'

  defineOptions({
    name: 'SelectPanel',
    inheritAttrs: false
  })

  export interface SelectPanelProps {
    /** Context of the select root the panel belongs to. */
    ctx: SelectRootContext
    /** Test id of the panel; its inner parts derive theirs from it. */
    testId: string
    /** How the panel fits around the trigger; read once, when the panel is set up. */
    positioning?: Pick<UsePlacementOptions, 'collisionPadding' | 'matchTriggerWidth'>
    /** Width of the panel, read on every render; omitted when the positioning sets it. */
    panelWidth?: () => StyleValue
    /** Keyboard options of the list; read once, when the panel is set up. */
    listbox: Pick<
      UseListboxContentOptions,
      'textFieldSelector' | 'focusTarget' | 'holdTab' | 'keepFocusOnOpen'
    >
    /** Extra attributes of the list element, such as aria-multiselectable and aria-busy. */
    listAttrs?: Record<string, unknown>
  }
  const props = defineProps<SelectPanelProps>()

  defineSlots<{
    /** The options; left out while a row stands in for them. */
    default(): unknown
    /** Rows after the options, inside the list. */
    rows(): unknown
    /** Pinned above the list, for a search field. */
    search(): unknown
    /** Pinned below the list, for an action. */
    footer(): unknown
  }>()

  const attrs = useAttrs()

  const rootEl = ref<globalThis.HTMLDivElement | null>(null)
  const lazy = ref<{ revealAll: () => void; hasHidden: () => boolean } | null>(null)

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: props.ctx.triggerEl,
    panelRef: rootEl,
    isOpen: props.ctx.open,
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    ...props.positioning
  })

  const { onKeydown, navigate } = useListboxContent({
    ...props.ctx,
    ...props.listbox,
    root: rootEl,
    lazy
  })

  const portalLocale = usePortalLocale()

  defineExpose({
    /** Moves focus among the visible options: ArrowDown, ArrowUp, Home or End. */
    navigate,
    /** The lazy option renderer. */
    lazy
  })

  const ROOT_CLASS =
    'fixed z-(--z-control-overlay) flex max-h-[20rem] flex-col overflow-hidden rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-xs)'
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
        ref="rootEl"
        role="presentation"
        v-bind="$attrs"
        :data-testid="testId"
        data-state="open"
        :data-side="resolvedSide"
        :data-align="resolvedAlign"
        :style="[panelStyle, panelWidth?.()]"
        :class="[ROOT_CLASS, attrs.class]"
        @keydown="onKeydown"
      >
        <div
          v-if="$slots['search']"
          class="flex shrink-0 items-center justify-center p-(--spacing-2xs)"
          :data-testid="`${testId}__search`"
        >
          <slot name="search" />
        </div>
        <ScrollArea
          v-bind="listAttrs"
          :id="ctx.contentId"
          role="listbox"
          :aria-label="ctx.ariaLabel.value"
          :aria-labelledby="
            ctx.ariaLabel.value
              ? undefined
              : (ctx.ariaLabelledby.value ??
                ctx.labelledBy.value ??
                (listbox.focusTarget ?? ctx.triggerEl).value?.id)
          "
          class="group/options flex max-h-60 flex-col items-stretch px-(--spacing-2xs) py-(--spacing-xs)"
          :data-testid="`${testId}__list`"
        >
          <LazyNodes
            v-if="$slots['default']"
            ref="lazy"
            :row-height="32"
          >
            <slot />
          </LazyNodes>
          <slot name="rows" />
        </ScrollArea>
        <div
          v-if="$slots['footer']"
          class="flex shrink-0 items-center justify-center p-(--spacing-2xs)"
          :data-testid="`${testId}__footer`"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
