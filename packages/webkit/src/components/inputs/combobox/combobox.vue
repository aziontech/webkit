<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { usePortalLocale, useTranslate } from '../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../composables/use-placement'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Spinner from '../../utils/spinner/spinner.vue'
  import Input from '../input/input.vue'

  /** One suggestion of the Combobox. */
  export type ComboboxOption = {
    /** The committed value; also matched by the typed text. */
    value: string
    /** Text shown instead of the value. */
    label?: string
    /** Muted text at the end of the row. */
    description?: string
    /** Title of the group the option sits under. */
    group?: string
    /** Shown but not selectable. */
    disabled?: boolean
  }

  /** Size token, as `Input`: 28 / 32 / 40 px. */
  export type ComboboxSize = 'small' | 'medium' | 'large'

  type Row =
    | { kind: 'option'; id: string; option: ComboboxOption }
    | { kind: 'custom'; id: string; value: string }

  type Section = { id: string; title: string; rows: Row[] }

  defineOptions({
    name: 'Combobox',
    inheritAttrs: false
  })

  interface Props {
    /** The committed value. Supports v-model. Changes on pick, Enter, Tab, blur and clear. */
    modelValue?: string
    /** Suggestions: `{ value, label?, description?, group?, disabled? }`. */
    options?: ComboboxOption[]
    /** Placeholder of the field. */
    placeholder?: string
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
    emptyText?: string
    /** Disables the field. */
    disabled?: boolean
    /** Shows the value without the list or editing. */
    readonly?: boolean
    /** Marks the field required (`aria-required`). */
    required?: boolean
    /** Marks the field invalid (`aria-invalid`, danger border). */
    invalid?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    options: () => [],
    placeholder: '',
    ariaLabel: '',
    size: 'medium',
    allowCustom: true,
    filter: true,
    clearable: false,
    loading: false,
    emptyText: '',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    search: [text: string]
    create: [value: string]
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

  const anchorRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const open = ref(false)
  const typing = ref(false)
  const active = ref(-1)
  const anchorWidth = ref(0)

  const labelOf = (option: ComboboxOption) => option.label || option.value

  const displayOf = (value: string) => {
    const match = props.options.find((option) => option.value === value)
    return match ? labelOf(match) : value
  }

  const text = ref(displayOf(props.modelValue))

  watch(
    () => [props.modelValue, props.options] as const,
    () => {
      if (!typing.value) text.value = displayOf(props.modelValue)
    }
  )

  const fold = (value: string) =>
    value
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLocaleLowerCase(locale.value)

  const query = computed(() => (typing.value ? text.value.trim() : ''))

  const exactMatch = (value: string) => {
    const needle = fold(value)
    return props.options.find(
      (option) =>
        !option.disabled && (fold(option.value) === needle || fold(labelOf(option)) === needle)
    )
  }

  const matches = computed(() => {
    if (!props.filter || !query.value) return props.options
    const needle = fold(query.value)
    return props.options.filter(
      (option) => fold(option.value).includes(needle) || fold(labelOf(option)).includes(needle)
    )
  })

  const showCustom = computed(
    () => props.allowCustom && Boolean(query.value) && !exactMatch(query.value)
  )

  const sections = computed<Section[]>(() => {
    const order: string[] = []
    const byGroup = new Map<string, Row[]>()
    matches.value.forEach((option, index) => {
      const key = option.group ?? ''
      if (!byGroup.has(key)) {
        byGroup.set(key, [])
        order.push(key)
      }
      byGroup.get(key)?.push({ kind: 'option', id: `${uid}-option-${index}`, option })
    })
    const ordered = [...order.filter((key) => !key), ...order.filter((key) => key)]
    const out: Section[] = ordered.map((key, index) => ({
      id: `${uid}-group-${index}`,
      title: key,
      rows: byGroup.get(key) ?? []
    }))
    if (showCustom.value) {
      out.push({
        id: `${uid}-custom`,
        title: '',
        rows: [{ kind: 'custom', id: `${uid}-option-custom`, value: query.value }]
      })
    }
    return out
  })

  const rows = computed(() => sections.value.flatMap((section) => section.rows))

  const isDisabledRow = (row: Row) => row.kind === 'option' && Boolean(row.option.disabled)

  const expanded = computed(
    () =>
      open.value &&
      (rows.value.length > 0 || props.loading || (typing.value && Boolean(query.value)))
  )

  const activeId = computed(() =>
    expanded.value && active.value >= 0 ? rows.value[active.value]?.id : undefined
  )

  const status = computed(() => {
    if (!expanded.value) return ''
    if (props.loading) return t('combobox.loading')
    if (!rows.value.length) return props.emptyText || t('combobox.empty')
    return t('combobox.count', { count: rows.value.length })
  })

  const { panelStyle } = usePlacement({
    triggerRef: anchorRef,
    panelRef,
    isOpen: expanded,
    placement: 'bottom-start',
    offset: 4,
    onDismiss: () => close()
  })

  const panelSizing = computed(() => [panelStyle.value, { minWidth: `${anchorWidth.value}px` }])

  const inputEl = () => anchorRef.value?.querySelector('input') ?? null

  const setOpen = (next: boolean) => {
    if (next && (isDisabled.value || props.readonly)) return
    if (next) anchorWidth.value = anchorRef.value?.offsetWidth ?? 0
    open.value = next
    if (!next) active.value = -1
  }

  function close() {
    setOpen(false)
  }

  const setModel = (value: string) => {
    if (value !== props.modelValue) emit('update:modelValue', value)
  }

  const commitOption = (option: ComboboxOption) => {
    if (option.disabled) return
    typing.value = false
    text.value = labelOf(option)
    setModel(option.value)
    close()
  }

  const commitCustom = (value: string) => {
    typing.value = false
    text.value = value
    if (value !== props.modelValue) {
      setModel(value)
      emit('create', value)
    }
    close()
  }

  const commitRow = (row: Row) => {
    if (row.kind === 'option') commitOption(row.option)
    else commitCustom(row.value)
  }

  const restore = () => {
    typing.value = false
    text.value = displayOf(props.modelValue)
  }

  const commitText = () => {
    if (!typing.value) return
    const value = text.value.trim()
    if (!value) {
      typing.value = false
      text.value = ''
      setModel('')
      return
    }
    const match = exactMatch(value)
    if (match) commitOption(match)
    else if (props.allowCustom) commitCustom(value)
    else restore()
  }

  const scrollActiveIntoView = () => {
    nextTick(() => {
      const id = activeId.value
      if (id) globalThis.document?.getElementById(id)?.scrollIntoView?.({ block: 'nearest' })
    })
  }

  const moveTo = (start: number, step: 1 | -1) => {
    const total = rows.value.length
    if (!total) return
    let index = start
    for (let i = 0; i < total; i += 1) {
      index = (index + total) % total
      const row = rows.value[index]
      if (row && !isDisabledRow(row)) {
        active.value = index
        scrollActiveIntoView()
        return
      }
      index += step
    }
  }

  const onInput = (value: string) => {
    text.value = value
    typing.value = true
    active.value = -1
    setOpen(true)
    emit('search', value)
  }

  const onFocus = () => {
    setOpen(true)
  }

  const onBlur = () => {
    commitText()
    close()
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (props.readonly) return
    const key = event.key
    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      if (event.altKey) {
        setOpen(key === 'ArrowDown')
        return
      }
      if (!open.value) {
        setOpen(true)
        nextTick(() =>
          moveTo(key === 'ArrowDown' ? 0 : rows.value.length - 1, key === 'ArrowDown' ? 1 : -1)
        )
        return
      }
      if (key === 'ArrowDown') moveTo(active.value < 0 ? 0 : active.value + 1, 1)
      else moveTo(active.value < 0 ? rows.value.length - 1 : active.value - 1, -1)
      return
    }
    if ((key === 'Home' || key === 'End') && expanded.value && active.value >= 0) {
      event.preventDefault()
      if (key === 'Home') moveTo(0, 1)
      else moveTo(rows.value.length - 1, -1)
      return
    }
    if (key === 'Enter') {
      const row = active.value >= 0 && expanded.value ? rows.value[active.value] : undefined
      if (row) {
        event.preventDefault()
        commitRow(row)
        return
      }
      if (typing.value) {
        event.preventDefault()
        commitText()
        close()
      }
      return
    }
    if (key === 'Escape') {
      if (expanded.value) {
        event.preventDefault()
        event.stopPropagation()
        close()
        return
      }
      if (text.value !== displayOf(props.modelValue)) {
        event.preventDefault()
        event.stopPropagation()
        restore()
      }
      return
    }
    if (key === 'Tab') {
      const row = active.value >= 0 && expanded.value ? rows.value[active.value] : undefined
      if (row) commitRow(row)
      else commitText()
      close()
    }
  }

  const clear = () => {
    typing.value = false
    text.value = ''
    setModel('')
    emit('search', '')
    inputEl()?.focus()
  }

  const showClear = computed(
    () => props.clearable && Boolean(text.value) && !isDisabled.value && !props.readonly
  )
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
      ref="anchorRef"
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
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      >
        <template #iconLeft>
          <i
            class="pi pi-search text-(--text-muted)"
            aria-hidden="true"
          />
        </template>
        <template
          v-if="loading"
          #iconRight
        >
          <Spinner
            class="size-3.5 text-(--text-muted)"
            :data-testid="`${testId}__spinner`"
          />
        </template>
      </Input>
      <IconButton
        v-if="showClear"
        icon="pi pi-times"
        :ariaLabel="t('combobox.clear')"
        kind="transparent"
        size="small"
        class="absolute end-(--spacing-xxs) top-1/2 -translate-y-1/2"
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
    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <ul
          v-show="expanded"
          :id="listId"
          ref="panelRef"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          role="listbox"
          :aria-label="ariaLabel || t('combobox.suggestions')"
          :aria-busy="loading || undefined"
          :data-testid="`${testId}__listbox`"
          :style="panelSizing"
          class="fixed z-(--z-input-overlay) m-0 flex max-h-80 list-none flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-xxs) shadow-(--shadow-xs)"
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
              class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0"
            >
              <li
                v-for="row in section.rows"
                :id="row.id"
                :key="row.id"
                role="option"
                :aria-selected="row.kind === 'option' && row.option.value === modelValue"
                :aria-disabled="isDisabledRow(row) || undefined"
                :data-active="(activeId === row.id && !isDisabledRow(row)) || null"
                :data-selected="(row.kind === 'option' && row.option.value === modelValue) || null"
                :data-disabled="isDisabledRow(row) || null"
                :data-kind="row.kind"
                :data-testid="`${testId}__option`"
                class="flex min-h-8 cursor-pointer select-none items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xxs) text-start text-label-sm text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) data-[active]:bg-(--bg-hover) data-[selected]:bg-(--bg-selected) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) data-[disabled]:hover:bg-transparent motion-reduce:transition-none pointer-coarse:min-h-11"
                @click="commitRow(row)"
                @keydown.enter.prevent="commitRow(row)"
                @mousemove="active = isDisabledRow(row) ? active : rows.indexOf(row)"
              >
                <template v-if="row.kind === 'option'">
                  <slot
                    name="option"
                    :option="row.option"
                    :active="activeId === row.id"
                    :selected="row.option.value === modelValue"
                  >
                    <span class="min-w-0 flex-1 truncate"
                      ><bdi>{{ labelOf(row.option) }}</bdi></span
                    >
                    <span
                      v-if="row.option.description"
                      class="shrink-0 truncate text-body-sm text-(--text-muted)"
                      >{{ row.option.description }}</span
                    >
                  </slot>
                  <i
                    v-if="row.option.value === modelValue"
                    class="pi pi-check shrink-0 text-body-xs text-(--text-default)"
                    aria-hidden="true"
                  />
                </template>
                <template v-else>
                  <i
                    class="pi pi-plus shrink-0 text-body-xs text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="min-w-0 flex-1 truncate">{{
                    t('combobox.useValue', { value: row.value })
                  }}</span>
                </template>
              </li>
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
            {{ emptyText || t('combobox.empty') }}
          </li>
        </ul>
      </Transition>
    </Teleport>
  </div>
</template>
