<script setup lang="ts">
  import {
    Comment,
    computed,
    Fragment,
    inject,
    isVNode,
    onBeforeUnmount,
    ref,
    useAttrs,
    type VNode,
    type VNodeArrayChildren,
    watch
  } from 'vue'

  import LazyNodes from '../../../../composables/use-lazy-chunks/lib/lazy-nodes'
  import { useListboxContent } from '../../../../composables/use-listbox-content'
  import { usePlacement } from '../../../../composables/use-placement'
  import { usePortalLocale, useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Spinner from '../../../feedback/spinner/spinner.vue'
  import ScrollArea from '../../../layout/scroll-area/scroll-area.vue'
  import { MultiSelectInjectionKey } from '../injection-key'

  defineOptions({
    name: 'MultiSelectContent',
    inheritAttrs: false
  })

  const ctx = inject(MultiSelectInjectionKey)
  if (!ctx) {
    throw new Error('MultiSelectContent must be used inside MultiSelect.')
  }

  const slots = defineSlots<{
    /** The options (MultiSelectItem). */
    default(): unknown
    /** Pinned above the list, for a search field. */
    search(): unknown
    /** Pinned below the list, for an action such as Clear. */
    footer(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ multiSelect: en.multiSelect })

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

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'multi-select-content'
  )

  const rootEl = ref<globalThis.HTMLDivElement | null>(null)
  const lazy = ref<{ revealAll: () => void; hasHidden: () => boolean } | null>(null)

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: ctx.triggerEl,
    panelRef: rootEl,
    isOpen: ctx.open,
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    matchTriggerWidth: true
  })

  const focusTarget = computed(() => ctx.controlEl.value ?? ctx.triggerEl.value)

  const { onKeydown, navigate } = useListboxContent({
    root: rootEl,
    lazy,
    open: ctx.open,
    setOpen: ctx.setOpen,
    triggerEl: ctx.triggerEl,
    pendingFocus: ctx.pendingFocus,
    textFieldSelector: 'input:not([type="checkbox"]), textarea',
    focusTarget,
    holdTab: ctx.searchable,
    keepFocusOnOpen: ctx.searchable
  })

  ctx.navigate.value = navigate

  onBeforeUnmount(() => {
    if (ctx.navigate.value === navigate) ctx.navigate.value = null
  })

  watch(
    () => ctx.query.value,
    (text) => {
      if (text.trim() && lazy.value?.hasHidden()) lazy.value.revealAll()
    }
  )

  const listLabel = computed(() => ctx.ariaLabel.value)
  const listLabelledby = computed(() =>
    listLabel.value
      ? undefined
      : (ctx.ariaLabelledby.value ?? ctx.labelledBy.value ?? focusTarget.value?.id ?? undefined)
  )

  const showOptions = computed(() => !ctx.loading.value && !ctx.error.value)
  const empty = computed(
    () => showOptions.value && ctx.visibleCount.value === 0 && !ctx.showCreate.value
  )

  const status = computed(() => {
    if (!ctx.open.value) return ''
    if (ctx.loading.value) return t('multiSelect.loading')
    if (ctx.error.value) return ctx.error.value
    if (!ctx.query.value.trim()) return ''
    if (empty.value) return ctx.emptyTitle.value || t('multiSelect.noMatch')
    return t('multiSelect.count', { count: ctx.visibleCount.value })
  })

  const onCreateKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      ctx.create(event)
      ctx.focusControl()
    }
  }

  const onCreateClick = (event: globalThis.MouseEvent) => {
    ctx.create(event)
    ctx.focusControl()
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
        v-if="ctx.open.value"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        ref="rootEl"
        v-bind="$attrs"
        :data-testid="testId"
        :data-state="ctx.open.value ? 'open' : 'closed'"
        :class="attrs.class"
        :data-side="resolvedSide"
        :data-align="resolvedAlign"
        :style="panelStyle"
        class="fixed z-(--z-control-overlay) flex max-h-[20rem] flex-col overflow-hidden rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-xs)"
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
          aria-multiselectable="true"
          :aria-label="listLabel"
          :aria-labelledby="listLabelledby"
          :aria-busy="ctx.loading.value || undefined"
          class="group/options flex max-h-60 flex-col items-stretch px-(--spacing-2xs) py-(--spacing-xs)"
          :data-testid="`${testId}__list`"
        >
          <LazyNodes
            v-if="showOptions"
            ref="lazy"
            :row-height="32"
          >
            <slot />
          </LazyNodes>
          <div
            v-if="showOptions && ctx.showCreate.value"
            role="option"
            tabindex="-1"
            aria-selected="false"
            data-variant="create"
            :data-testid="`${testId}__create`"
            class="flex h-8 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-default) outline-none transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
            @click="onCreateClick"
            @keydown="onCreateKeydown"
          >
            <i
              class="az az-plus shrink-0 text-body-xs text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1 truncate text-start"
              ><bdi>{{ t('multiSelect.add', { value: ctx.query.value.trim() }) }}</bdi></span
            >
          </div>
          <div
            v-if="ctx.loading.value"
            role="presentation"
            :data-testid="`${testId}__loading`"
            class="flex min-h-8 items-center gap-(--spacing-xs) px-(--spacing-xs) text-body-sm text-(--text-muted)"
          >
            <Spinner class="size-3.5" />
            {{ t('multiSelect.loading') }}
          </div>
          <div
            v-else-if="ctx.error.value"
            role="presentation"
            :data-testid="`${testId}__error`"
            class="flex min-h-8 items-center gap-(--spacing-xs) px-(--spacing-xs) text-body-sm text-(--text-default)"
          >
            <i
              class="az az-circle-alert shrink-0 text-(--danger)"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1">{{ ctx.error.value }}</span>
          </div>
          <div
            v-else-if="empty"
            role="presentation"
            :data-testid="`${testId}__empty`"
            class="flex min-h-8 items-center px-(--spacing-xs) text-body-sm text-(--text-muted)"
          >
            {{ ctx.emptyTitle.value || t('multiSelect.noMatch') }}
          </div>
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
  <span
    class="sr-only"
    role="status"
    aria-live="polite"
    :data-testid="`${testId}__status`"
    >{{ status }}</span
  >
  <div
    v-if="!ctx.open.value && ctx.labelsPending.value"
    hidden
    :data-testid="`${testId}__labels`"
  >
    <PendingLabels />
  </div>
</template>
