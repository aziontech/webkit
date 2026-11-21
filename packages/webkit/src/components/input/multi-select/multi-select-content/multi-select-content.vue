<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Spinner from '../../../feedback/spinner/spinner.vue'
  import { pendingLabelNodes } from '../../select/lib/pending-labels'
  import SelectPanel from '../../select/parts/select-panel.vue'
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

  const PendingLabels = () => pendingLabelNodes(slots.default?.(), ctx.isSelected)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'multi-select-content'
  )

  const panel = ref<InstanceType<typeof SelectPanel> | null>(null)

  const navigate = (key: string) => panel.value?.navigate(key)

  const focusTarget = computed(() => ctx.controlEl.value ?? ctx.triggerEl.value)
  const typed = () => ctx.searchable.value
  const listbox = {
    textFieldSelector: 'input:not([type="checkbox"]), textarea',
    focusTarget,
    holdTab: typed,
    keepFocusOnOpen: typed
  }

  ctx.navigate.value = navigate

  onBeforeUnmount(() => {
    if (ctx.navigate.value === navigate) ctx.navigate.value = null
  })

  watch(
    () => ctx.query.value,
    (text) => {
      const lazy = panel.value?.lazy
      if (text.trim() && lazy?.hasHidden()) lazy.revealAll()
    }
  )

  const showOptions = computed(() => !ctx.loading.value && !ctx.error.value)
  const forwardedSlots = () =>
    (['default', 'search', 'footer'] as const).filter(
      (name) => slots[name] && (showOptions.value || name !== 'default')
    )
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

  const CREATE_CLASS =
    'flex h-8 pointer-coarse:min-h-11 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-default) outline-none transition-colors duration-150 ease-out ' +
    'motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)'
</script>

<template>
  <SelectPanel
    ref="panel"
    v-bind="$attrs"
    :ctx="ctx"
    :test-id="testId"
    :positioning="{ matchTriggerWidth: true }"
    :listbox="listbox"
    :list-attrs="{ 'aria-multiselectable': true, 'aria-busy': ctx.loading.value || undefined }"
  >
    <template
      v-for="slot in forwardedSlots()"
      #[slot]
    >
      <slot :name="slot" />
    </template>
    <template #rows>
      <div
        v-if="showOptions && ctx.showCreate.value"
        role="option"
        tabindex="-1"
        aria-selected="false"
        data-variant="create"
        :data-testid="`${testId}__create`"
        :class="CREATE_CLASS"
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
    </template>
  </SelectPanel>
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
