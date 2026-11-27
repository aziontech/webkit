<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import LazyNodes from '../../../composables/use-lazy-chunks/lib/lazy-nodes'
  import { useOverlayLayer } from '../../../composables/use-overlay-layer'
  import { usePlacement } from '../../../composables/use-placement'
  import { useTeleportReady } from '../../../composables/use-teleport-ready'
  import { usePortalLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import Spinner from '../../feedback/spinner/spinner.vue'
  import Input from '../input/input.vue'
  import { useComboboxCommit } from './composables/use-combobox-commit'
  import { useComboboxKeyboard } from './composables/use-combobox-keyboard'
  import { useComboboxRows } from './composables/use-combobox-rows'
  import { useComboboxScroll } from './composables/use-combobox-scroll'
  import { isDisabledRow, optionLabel } from './lib/combobox-rows'
  import type { ComboboxOption, ComboboxSize } from './types'

  export type { ComboboxOption, ComboboxSize } from './types'

  defineOptions({ name: 'Combobox', inheritAttrs: false })

  export interface ComboboxProps {
    /** Suggestions: `{ value, label?, description?, group?, disabled? }`. */
    options?: ComboboxOption[]
    /** Placeholder of the field. */
    placeholder?: string
    /** Leading icon of the field. Empty shows none. */
    icon?: string
    /** Accessible name when no `Field` label names the field. */
    ariaLabel?: string
    /** Size token, as `Input`: 28 / 32 / 40 px. */
    size?: ComboboxSize
    /** Accepts a typed value that matches no option, offered as `Use "…"`. */
    allowCustom?: boolean
    /** Filters `options` by the typed text. Turn off when the server filters on `search`. */
    filter?: boolean
    /** Shows a clear button while the field has a value. */
    clearable?: boolean
    /** Shows a spinner and the loading row while options are fetched. */
    loading?: boolean
    /** Text of the list when nothing matches. Empty uses the locale catalog. */
    emptyTitle?: string
    /** Disables the field. */
    disabled?: boolean
    /** Shows the value without the list or editing. */
    readonly?: boolean
    /** Marks the field required (`aria-required`). */
    required?: boolean
    /** Marks the field invalid (`aria-invalid`, danger border). */
    invalid?: boolean
    /** Initial open state of the list when uncontrolled (v-model:open unbound). */
    defaultOpen?: boolean
  }
  const props = withDefaults(defineProps<ComboboxProps>(), {
    options: () => [],
    placeholder: '',
    icon: 'az az-search',
    ariaLabel: '',
    size: 'medium',
    allowCustom: true,
    filter: true,
    clearable: false,
    loading: false,
    emptyTitle: '',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    defaultOpen: false
  })

  const model = defineModel<string>({ default: '' })
  /** Whether the list is open (v-model:open); omit for uncontrolled, seeded by defaultOpen. The list shows while open and it has rows, is loading, or has a no-match row. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const emit = defineEmits<{
    search: [text: string]
    create: [event: MouseEvent | KeyboardEvent | FocusEvent, value: string]
  }>()

  defineSlots<{
    /** Replaces the content of one option row. */
    option(props: { option: ComboboxOption; active: boolean; selected: boolean }): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ combobox: en.combobox })
  const portalLocale = usePortalLocale()
  const uid = useId()
  const listId = `${uid}-listbox`

  const { invalid: isInvalid, disabled: isDisabled } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'combobox')

  const inputAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['class']
    delete rest['data-testid']
    return rest
  })

  const anchorEl = ref<HTMLElement | null>(null)
  const panelEl = ref<HTMLElement | null>(null)
  const open = computed<boolean>({
    get: () => openModel.value ?? props.defaultOpen,
    set: (next) => {
      if (next !== open.value) openModel.value = next
    }
  })
  const typing = ref(false)
  const active = ref(-1)
  const anchorWidth = ref(0)

  const displayOf = (value: string) => {
    const match = props.options.find((option) => option.value === value)
    return match ? optionLabel(match) : value
  }

  const text = ref(displayOf(model.value))

  watch(
    () => [model.value, props.options] as const,
    () => {
      if (!typing.value) text.value = displayOf(model.value)
    }
  )

  const query = computed(() => (typing.value ? text.value.trim() : ''))

  const { exactMatch, sections, rows } = useComboboxRows(props, query, locale, uid)

  const expanded = computed(
    () =>
      open.value &&
      (rows.value.length > 0 || props.loading || (typing.value && Boolean(query.value)))
  )

  useOverlayLayer(expanded, { element: panelEl, transient: true })

  const emptyLabel = computed(() => props.emptyTitle || t('combobox.noMatch'))

  const activeId = computed(() =>
    expanded.value && active.value >= 0 ? rows.value[active.value]?.id : undefined
  )

  const status = computed(() => {
    if (!expanded.value) return ''
    if (props.loading) return t('combobox.loading')
    if (!rows.value.length) return emptyLabel.value
    return t('combobox.count', { count: rows.value.length })
  })

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: anchorEl,
    panelRef: panelEl,
    isOpen: expanded,
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
    onDismiss: () => close()
  })

  const panelSizing = computed(() => [panelStyle.value, { minWidth: `${anchorWidth.value}px` }])

  const inputEl = () => anchorEl.value?.querySelector('input') ?? null

  const setOpen = (next: boolean) => {
    if (next && (isDisabled.value || props.readonly)) return
    if (next) anchorWidth.value = anchorEl.value?.offsetWidth ?? 0
    open.value = next
    if (!next) active.value = -1
  }

  const close = () => setOpen(false)

  const commit = useComboboxCommit(
    model,
    text,
    typing,
    props,
    exactMatch,
    displayOf,
    close,
    (event, value) => emit('create', event, value)
  )

  const { setLazy, scrollActiveIntoView } = useComboboxScroll(
    rows,
    activeId,
    panelEl,
    () => model.value,
    expanded,
    typing
  )

  const onInput = (value: string) => {
    text.value = value
    typing.value = true
    active.value = -1
    setOpen(true)
    emit('search', value)
  }

  const onBlur = (event: FocusEvent) => {
    commit.commitText(event)
    close()
  }

  const keyboard = useComboboxKeyboard(
    rows,
    active,
    open,
    expanded,
    typing,
    setOpen,
    scrollActiveIntoView,
    commit,
    () => text.value !== displayOf(model.value)
  )

  const onKeydown = (event: KeyboardEvent) => {
    if (!props.readonly) keyboard.onKeydown(event)
  }

  const clear = () => {
    commit.reset()
    emit('search', '')
    inputEl()?.focus()
  }

  const showClear = computed(
    () => props.clearable && Boolean(text.value) && !isDisabled.value && !props.readonly
  )

  const LISTBOX_CLASS =
    'fixed z-(--z-control-overlay) m-0 flex max-h-80 list-none flex-col gap-(--spacing-2xs) overflow-y-auto overscroll-contain rounded-(--shape-control) border border-(--border-default) ' +
    'bg-(--bg-surface-raised) p-(--spacing-2xs) shadow-(--shadow-xs)'

  const OPTION_CLASS =
    'flex min-h-8 cursor-pointer select-none items-center gap-(--spacing-sm) rounded-(--shape-control) border-y border-transparent bg-clip-padding ' +
    'forced-colors:border-y-0 px-(--spacing-sm) py-(--spacing-2xs) text-start text-label-sm text-(--text-default) transition-colors duration-150 ease-out ' +
    'hover:bg-(--bg-hover) ' +
    'data-[active]:bg-(--bg-hover) ' +
    'data-[selected]:bg-(--bg-selected) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) data-[disabled]:hover:bg-transparent ' +
    'motion-reduce:transition-none pointer-coarse:min-h-11'

  const teleportReady = useTeleportReady()
</script>

<template>
  <div
    :class="attrs.class"
    :data-testid="testId"
    :data-state="expanded ? 'open' : 'closed'"
    :data-disabled="isDisabled || null"
    :data-invalid="isInvalid || null"
    class="relative w-full min-w-0"
  >
    <div
      ref="anchorEl"
      class="relative w-full"
    >
      <Input
        v-bind="inputAttrs"
        :model-value="text"
        :size="size"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :invalid="invalid"
        :spellcheck="false"
        autocomplete="off"
        role="combobox"
        aria-autocomplete="list"
        :aria-label="ariaLabel || undefined"
        :aria-expanded="expanded"
        :aria-controls="listId"
        :aria-activedescendant="activeId"
        :data-testid="`${testId}__input`"
        :class="showClear ? 'pe-9' : ''"
        @update:model-value="onInput"
        @focus="setOpen(true)"
        @blur="onBlur"
        @keydown="onKeydown"
      >
        <template
          v-if="icon"
          #leading
        >
          <i
            :class="icon"
            class="text-(--text-muted)"
            aria-hidden="true"
          />
        </template>
        <template
          v-if="loading"
          #trailing
        >
          <Spinner
            class="size-3.5 text-(--text-muted)"
            :data-testid="`${testId}__spinner`"
          />
        </template>
      </Input>
      <IconButton
        v-if="showClear"
        icon="az az-x"
        :ariaLabel="t('combobox.clear')"
        variant="ghost"
        size="small"
        class="absolute end-(--spacing-2xs) top-1/2 -translate-y-1/2"
        :data-testid="`${testId}__clear`"
        @click="clear"
      />
    </div>
    <span
      class="sr-only"
      role="status"
      aria-live="polite"
      :data-testid="`${testId}__status`"
      >{{ status }}</span
    >
    <Teleport
      to="body"
      :disabled="!teleportReady"
    >
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <ul
          v-show="expanded"
          :id="listId"
          ref="panelEl"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          role="listbox"
          :aria-label="ariaLabel || t('combobox.suggestions')"
          :aria-busy="loading || undefined"
          :data-testid="`${testId}__listbox`"
          :data-side="resolvedSide"
          :data-align="resolvedAlign"
          :style="panelSizing"
          :class="LISTBOX_CLASS"
          @mousedown.prevent
        >
          <li
            v-for="section in sections"
            :key="section.id"
            role="presentation"
            class="flex flex-col"
          >
            <span
              v-if="section.title"
              :id="section.id"
              class="flex min-h-7 items-center px-(--spacing-sm) text-label-sm text-(--text-muted)"
              :data-testid="`${testId}__group`"
              ><bdi>{{ section.title }}</bdi></span
            >
            <ul
              :role="section.title ? 'group' : 'presentation'"
              :aria-labelledby="section.title ? section.id : undefined"
              class="m-0 flex list-none flex-col p-0"
            >
              <LazyNodes
                :ref="setLazy"
                :row-height="32"
              >
                <li
                  v-for="row in section.rows"
                  :id="row.id"
                  :key="row.id"
                  role="option"
                  tabindex="-1"
                  :aria-selected="row.kind === 'option' && row.option.value === model"
                  :aria-disabled="isDisabledRow(row) || undefined"
                  :data-active="(activeId === row.id && !isDisabledRow(row)) || null"
                  :data-selected="(row.kind === 'option' && row.option.value === model) || null"
                  :data-disabled="isDisabledRow(row) || null"
                  :data-type="row.kind"
                  :data-testid="`${testId}__option`"
                  :class="OPTION_CLASS"
                  @click="commit.commitRow($event, row)"
                  @keydown.enter.prevent="commit.commitRow($event, row)"
                  @mousemove="active = isDisabledRow(row) ? active : rows.indexOf(row)"
                >
                  <template v-if="row.kind === 'option'">
                    <slot
                      name="option"
                      :option="row.option"
                      :active="activeId === row.id"
                      :selected="row.option.value === model"
                    >
                      <span class="min-w-0 flex-1 truncate"
                        ><bdi>{{ optionLabel(row.option) }}</bdi></span
                      >
                      <span
                        v-if="row.option.description"
                        class="shrink-0 truncate text-label-sm text-(--text-muted)"
                        >{{ row.option.description }}</span
                      >
                    </slot>
                    <i
                      v-if="row.option.value === model"
                      class="az az-check shrink-0 text-body-xs text-(--text-default)"
                      aria-hidden="true"
                    />
                  </template>
                  <template v-else>
                    <i
                      class="az az-plus shrink-0 text-body-xs text-(--text-muted)"
                      aria-hidden="true"
                    />
                    <span class="min-w-0 flex-1 truncate">{{
                      t('combobox.useValue', { value: row.value })
                    }}</span>
                  </template>
                </li>
              </LazyNodes>
            </ul>
          </li>
          <li
            v-if="loading"
            role="presentation"
            class="flex min-h-8 items-center gap-(--spacing-sm) px-(--spacing-sm) text-body-sm text-(--text-muted)"
            :data-testid="`${testId}__loading`"
          >
            <Spinner class="size-3.5" />
            {{ t('combobox.loading') }}
          </li>
          <li
            v-else-if="!rows.length"
            role="presentation"
            class="flex min-h-8 items-center px-(--spacing-sm) text-body-sm text-(--text-muted)"
            :data-testid="`${testId}__empty`"
          >
            {{ emptyLabel }}
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>
