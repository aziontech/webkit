<script setup lang="ts">
  import {
    Comment,
    computed,
    Fragment,
    inject,
    isVNode,
    ref,
    useAttrs,
    type VNode,
    type VNodeArrayChildren
  } from 'vue'

  import LazyNodes from '../../../../composables/use-lazy-chunks/lib/lazy-nodes'
  import { useListboxContent } from '../../../../composables/use-listbox-content'
  import { usePlacement } from '../../../../composables/use-placement'
  import { usePortalLocale } from '../../../../composables/use-translate'
  import ScrollArea from '../../../layout/scroll-area/scroll-area.vue'
  import { SelectInjectionKey } from '../injection-key'

  defineOptions({
    name: 'SelectContent',
    inheritAttrs: false
  })

  const ctx = inject(SelectInjectionKey)
  if (!ctx) {
    throw new Error('SelectContent must be used inside <Select>.')
  }

  const slots = defineSlots<{
    /** The options (SelectItem, SelectGroup). */
    default(): unknown
    /** Pinned above the list, for a search field. */
    search(): unknown
    /** Pinned below the list, for an action such as Create. */
    footer(): unknown
  }>()

  const attrs = useAttrs()

  const pickPending = (nodes: VNodeArrayChildren): VNode[] =>
    nodes.flatMap((node): VNode[] => {
      if (Array.isArray(node)) return pickPending(node)
      if (!isVNode(node) || node.type === Comment) return []
      if (node.type === Fragment && Array.isArray(node.children)) {
        return pickPending(node.children as VNodeArrayChildren)
      }
      const props = node.props as Record<string, unknown> | null
      if (props && 'value' in props) return ctx.isSelected(props['value']) ? [node] : []
      return [node]
    })

  const PendingLabels = () => pickPending((slots.default?.() ?? []) as VNodeArrayChildren)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select-content')

  const rootEl = ref<globalThis.HTMLDivElement | null>(null)
  const lazy = ref<{ revealAll: () => void; hasHidden: () => boolean } | null>(null)

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: ctx.triggerEl,
    panelRef: rootEl,
    isOpen: ctx.open,
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    collisionPadding: ctx.variant.value === 'ghost' ? 8 : { x: 0, y: 8 }
  })

  const panelWidth = () =>
    ctx.variant.value === 'ghost'
      ? null
      : { minWidth: 'var(--container-3xs)', width: `${ctx.triggerEl.value?.offsetWidth ?? 0}px` }

  const { onKeydown } = useListboxContent({
    root: rootEl,
    lazy,
    open: ctx.open,
    setOpen: ctx.setOpen,
    triggerEl: ctx.triggerEl,
    pendingFocus: ctx.pendingFocus,
    textFieldSelector: 'input:not([type="checkbox"]):not([type="radio"]), textarea'
  })

  const listLabel = computed(() => ctx.ariaLabel.value)
  const listLabelledby = computed(() =>
    listLabel.value
      ? undefined
      : (ctx.ariaLabelledby.value ?? ctx.labelledBy.value ?? ctx.triggerEl.value?.id ?? undefined)
  )

  const portalLocale = usePortalLocale()

  const ROOT_CLASS =
    'fixed z-(--z-control-overlay) flex max-h-[20rem] flex-col overflow-hidden rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-xs) ' +
    'data-[variant=ghost]:min-w-(--container-3xs)'
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
        v-bind="$attrs"
        :data-testid="testId"
        :data-state="ctx.open.value ? 'open' : 'closed'"
        :data-side="resolvedSide"
        :data-align="resolvedAlign"
        :style="[panelStyle, panelWidth()]"
        :data-variant="ctx.variant.value"
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
          :id="ctx.contentId"
          role="listbox"
          :aria-label="listLabel"
          :aria-labelledby="listLabelledby"
          class="group/options flex max-h-60 flex-col items-stretch px-(--spacing-2xs) py-(--spacing-xs)"
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
          class="flex shrink-0 items-center justify-center p-(--spacing-2xs)"
          :data-testid="`${testId}__footer`"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
  <div
    v-if="!ctx.open.value && ctx.labelsPending.value"
    hidden
    :data-testid="`${testId}__labels`"
  >
    <PendingLabels />
  </div>
</template>
