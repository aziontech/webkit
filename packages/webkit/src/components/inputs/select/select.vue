<script setup lang="ts">
  import {
    computed,
    nextTick,
    onMounted,
    onScopeDispose,
    provide,
    ref,
    toRef,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import {
    selectContextKey,
    type SelectOpenTarget,
    type SelectSize,
    type SelectValue
  } from './injection-key'

  defineOptions({
    name: 'Select',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound selection. Scalar in single mode; array in multi mode. */
    modelValue?: SelectValue
    /** When true, switches the component to multi-select. */
    multiple?: boolean
    /** Controlled open state for the dropdown. */
    open?: boolean
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
    /** Trigger placeholder shown when no option is selected. */
    placeholder?: string
    /** Size token; affects trigger height. */
    size?: SelectSize
    /** Disables the trigger and prevents opening. */
    disabled?: boolean
    /** Marks the field read-only; selection visible, dropdown locked. */
    readonly?: boolean
    /** Marks the field as required; sets aria-required on the trigger. */
    required?: boolean
    /** Applies invalid border + ring tokens and aria-invalid on the trigger. */
    invalid?: boolean
    /** Custom formatter for the trigger label; receives the current modelValue. */
    displayValue?: (value: unknown) => string
    /** Accessible name for the field when no visible label is associated with it. */
    ariaLabel?: string
    /** Id of the trigger, or of the native select; target it with a label for attribute. */
    inputId?: string
    /** Renders the platform select element: native picker, form submission and autofill. */
    native?: boolean
    /** Form field name; the selection is submitted under it with the surrounding form. */
    name?: string
    /** Autofill hint forwarded to the native select. */
    autocomplete?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    multiple: false,
    open: undefined,
    defaultOpen: false,
    placeholder: undefined,
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    displayValue: undefined,
    ariaLabel: '',
    inputId: '',
    native: false,
    name: '',
    autocomplete: ''
  })

  const emit = defineEmits<{
    'update:modelValue': [value: SelectValue]
    'update:open': [value: boolean]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const contentId = `select-${useId()}`
  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const listboxRef = ref<globalThis.HTMLElement | null>(null)
  const nativeRef = ref<globalThis.HTMLSelectElement | null>(null)
  const listboxLabel = ref<string>()
  const activeId = ref<string>()
  const navigating = ref(false)
  const nativeOptions = new Map<string, unknown>()

  let pendingTarget: SelectOpenTarget = 'selected'
  let pendingChar: string | undefined
  let typeaheadBuffer = ''
  let typeaheadTimer: ReturnType<typeof setTimeout> | undefined

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'select')

  const inputId = computed(() => props.inputId || `${contentId}-trigger`)

  const uncontrolledOpen = ref(props.defaultOpen)
  const openState = computed(() => (props.open !== undefined ? props.open : uncontrolledOpen.value))

  const setOpen = (value: boolean) => {
    if (props.disabled || props.readonly) return
    if (props.open === undefined) {
      uncontrolledOpen.value = value
    }
    emit('update:open', value)
  }

  const close = (restoreFocus: boolean) => {
    setOpen(false)
    if (restoreFocus) triggerRef.value?.focus({ preventScroll: true })
  }

  const openList = (target: SelectOpenTarget, char?: string) => {
    pendingTarget = target
    pendingChar = char
    setOpen(true)
  }

  watch(
    () => props.multiple,
    () => {
      const current = props.modelValue
      if (props.multiple && !Array.isArray(current) && current !== undefined) {
        emit('update:modelValue', current === '' ? [] : [current])
      } else if (!props.multiple && Array.isArray(current)) {
        emit('update:modelValue', current[0] as SelectValue)
      }
    }
  )

  const isSelected = (value: unknown): boolean => {
    const current = props.modelValue
    if (Array.isArray(current)) return current.includes(value)
    return current === value
  }

  const toggleValue = (value: unknown) => {
    if (props.disabled || props.readonly) return
    if (props.multiple) {
      const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
      const index = current.indexOf(value)
      if (index === -1) current.push(value)
      else current.splice(index, 1)
      emit('update:modelValue', current)
      return
    }
    emit('update:modelValue', value as SelectValue)
    close(true)
  }

  const filled = computed(() => {
    const current = props.modelValue
    if (Array.isArray(current)) return current.length > 0
    return current !== undefined && current !== '' && current !== null
  })

  const displayValueComputed = computed((): string => {
    const current = props.modelValue
    if (props.displayValue) return props.displayValue(current)
    if (Array.isArray(current)) return current.length === 0 ? '' : current.join(', ')
    if (current === undefined || current === null) return ''
    return String(current)
  })

  const hiddenValues = computed(() => {
    if (!props.name || props.native || !filled.value) return []
    const current = props.modelValue
    return (Array.isArray(current) ? current : [current]).map((value) => String(value))
  })

  const enabledOptions = () =>
    Array.from(
      listboxRef.value?.querySelectorAll<globalThis.HTMLElement>(
        '[role="option"]:not([aria-disabled="true"])'
      ) ?? []
    )

  const textOf = (element: globalThis.HTMLElement) =>
    (element.textContent ?? '').trim().toLowerCase()

  const resolveListboxLabel = () => {
    if (props.ariaLabel) return props.ariaLabel
    const trigger = triggerRef.value
    if (!trigger) return undefined
    const own = trigger.getAttribute('aria-label')
    if (own) return own
    const labelledBy = trigger.getAttribute('aria-labelledby')
    const sources = labelledBy
      ? labelledBy.split(/\s+/).map((id) => document.getElementById(id))
      : Array.from((trigger as globalThis.HTMLButtonElement).labels ?? [])
    const text = sources
      .map((node) => node?.textContent?.trim() ?? '')
      .filter(Boolean)
      .join(' ')
    return text || undefined
  }

  const typeahead = (char: string) => {
    if (typeaheadTimer) clearTimeout(typeaheadTimer)
    typeaheadBuffer += char.toLowerCase()
    typeaheadTimer = setTimeout(() => {
      typeaheadBuffer = ''
    }, 500)
    const options = enabledOptions()
    if (options.length === 0) return
    const current = options.findIndex((option) => option.id === activeId.value)
    const repeated = [...typeaheadBuffer].every((c) => c === typeaheadBuffer[0])
    const term = repeated ? typeaheadBuffer[0] : typeaheadBuffer
    const start = repeated ? current + 1 : Math.max(current, 0)
    for (let i = 0; i < options.length; i++) {
      const option = options[(start + i) % options.length]
      if (textOf(option).startsWith(term)) {
        activeId.value = option.id
        return
      }
    }
  }

  const isTypeaheadKey = (event: globalThis.KeyboardEvent) =>
    event.key.length === 1 &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    (event.key !== ' ' || typeaheadBuffer !== '')

  const moveActive = (to: (index: number, count: number) => number) => {
    const options = enabledOptions()
    if (options.length === 0) return
    const current = options.findIndex((option) => option.id === activeId.value)
    activeId.value = options[to(current, options.length)]?.id
  }

  const commitActive = () => {
    if (!activeId.value) return
    document.getElementById(activeId.value)?.click()
  }

  const onListKeydown = (event: globalThis.KeyboardEvent): boolean => {
    if (isTypeaheadKey(event)) {
      event.preventDefault()
      typeahead(event.key)
      return true
    }
    switch (event.key) {
      case 'ArrowDown':
        moveActive((index, count) => (index < count - 1 ? index + 1 : 0))
        break
      case 'ArrowUp':
        if (event.altKey && !props.multiple) {
          commitActive()
          break
        }
        moveActive((index, count) => (index > 0 ? index - 1 : count - 1))
        break
      case 'Home':
        moveActive(() => 0)
        break
      case 'End':
        moveActive((_index, count) => count - 1)
        break
      case 'Enter':
      case ' ':
        commitActive()
        break
      case 'Escape':
        close(true)
        break
      case 'Tab':
        close(true)
        return true
      default:
        return false
    }
    event.preventDefault()
    return true
  }

  const onOpened = async () => {
    const target = pendingTarget
    const char = pendingChar
    pendingTarget = 'selected'
    pendingChar = undefined
    listboxLabel.value = resolveListboxLabel()
    await nextTick()
    const options = enabledOptions()
    const selected = options.find((option) => option.getAttribute('aria-selected') === 'true')
    if (target === 'last') activeId.value = options[options.length - 1]?.id
    else if (target === 'first') activeId.value = options[0]?.id
    else activeId.value = (selected ?? options[0])?.id
    if (char) typeahead(char)
  }

  watch(openState, (next) => {
    if (next) {
      onOpened()
      return
    }
    activeId.value = undefined
    typeaheadBuffer = ''
  })

  onMounted(() => {
    if (openState.value) onOpened()
  })

  watch(activeId, async (id) => {
    if (!id) return
    await nextTick()
    document.getElementById(id)?.scrollIntoView({ block: 'nearest' })
  })

  onScopeDispose(() => {
    if (typeaheadTimer) clearTimeout(typeaheadTimer)
  })

  const registerNativeOption = (key: string, value: unknown) => {
    nativeOptions.set(key, value)
    return () => {
      if (nativeOptions.get(key) === value) nativeOptions.delete(key)
    }
  }

  const syncNative = () => {
    const select = nativeRef.value
    if (!select) return
    for (const option of Array.from(select.options)) {
      option.selected = nativeOptions.has(option.value)
        ? isSelected(nativeOptions.get(option.value))
        : !props.multiple && !filled.value
    }
  }

  const onNativeChange = async (event: globalThis.Event) => {
    const select = event.target as globalThis.HTMLSelectElement
    if (!props.readonly) {
      const picked = Array.from(select.selectedOptions)
        .filter((option) => nativeOptions.has(option.value))
        .map((option) => nativeOptions.get(option.value))
      emit('update:modelValue', (props.multiple ? picked : picked[0]) as SelectValue)
    }
    await nextTick()
    syncNative()
  }

  provide(selectContextKey, {
    contentId,
    inputId,
    ariaLabel: computed(() => props.ariaLabel),
    triggerRef,
    listboxRef,
    listboxLabel,
    open: openState,
    setOpen,
    openList,
    close,
    activeId,
    navigating,
    setNavigating: (value: boolean) => {
      navigating.value = value
    },
    onListKeydown,
    modelValue: toRef(props, 'modelValue'),
    toggleValue,
    isSelected,
    registerNativeOption,
    multiple: computed(() => props.multiple),
    native: computed(() => props.native),
    size: computed(() => props.size),
    disabled: computed(() => props.disabled),
    readonly: computed(() => props.readonly),
    invalid: computed(() => props.invalid),
    required: computed(() => props.required),
    placeholder: computed(() => props.placeholder),
    displayValue: displayValueComputed,
    filled
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="openState ? 'open' : 'closed'"
    :data-mode="multiple ? 'multiple' : 'single'"
    :data-size="size"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-filled="filled || null"
    :data-native="native || null"
    :class="attrs.class"
    class="relative inline-block w-full"
  >
    <template v-if="native">
      <select
        :id="inputId"
        ref="nativeRef"
        :name="name || undefined"
        :autocomplete="autocomplete || undefined"
        :multiple="multiple"
        :required="required"
        :disabled="disabled"
        :aria-label="ariaLabel || undefined"
        :aria-invalid="invalid || undefined"
        :aria-readonly="readonly || undefined"
        :data-testid="`${testId}__native`"
        :data-mode="multiple ? 'multiple' : 'single'"
        :data-size="size"
        :data-disabled="disabled || null"
        :data-readonly="readonly || null"
        :data-invalid="invalid || null"
        :data-filled="filled || null"
        class="w-full appearance-none rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[mode=single]:pr-(--spacing-xl) data-[mode=single]:data-[size=small]:h-7 data-[mode=single]:data-[size=medium]:h-8 data-[mode=single]:data-[size=large]:h-10 data-[mode=multiple]:py-(--spacing-xxs) data-[mode=single]:not-data-[filled]:text-(--text-muted) data-[invalid]:border-(--danger-border) data-[invalid]:focus-visible:ring-(--danger) data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:hover:border-(--border-default) data-[readonly]:cursor-default"
        @change="onNativeChange"
      >
        <option
          v-if="!multiple"
          value=""
          disabled
          hidden
          :selected="!filled"
        >
          {{ placeholder }}
        </option>
        <slot />
      </select>
      <i
        v-if="!multiple"
        class="pi pi-chevron-down pointer-events-none absolute right-(--spacing-sm) top-1/2 -translate-y-1/2 text-(--text-muted) data-[disabled]:text-(--text-disabled)"
        :data-disabled="disabled || null"
        aria-hidden="true"
        :data-testid="`${testId}__chevron`"
      />
    </template>
    <template v-else>
      <slot />
      <input
        v-for="(value, index) in hiddenValues"
        :key="`${index}-${value}`"
        type="hidden"
        :name="name"
        :value="value"
        :data-testid="`${testId}__value`"
      />
    </template>
  </div>
</template>
