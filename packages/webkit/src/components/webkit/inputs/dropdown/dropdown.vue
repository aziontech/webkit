<script setup>
  import {
    computed,
    nextTick,
    onMounted,
    onUnmounted,
    ref,
    useAttrs,
    useId,
    useSlots,
    watch
  } from 'vue'

  import Spinner from '../../utils/spinner/spinner.vue'

  defineOptions({
    name: 'Dropdown',
    inheritAttrs: false
  })

  const props = defineProps({
    modelValue: {
      type: null,
      default: undefined
    },
    options: {
      type: Array,
      default: () => []
    },
    optionLabel: {
      type: [String, Function],
      default: undefined
    },
    optionValue: {
      type: [String, Function],
      default: undefined
    },
    optionDisabled: {
      type: [String, Function],
      default: undefined
    },
    optionGroupLabel: {
      type: [String, Function],
      default: undefined
    },
    optionGroupChildren: {
      type: [String, Function],
      default: undefined
    },
    placeholder: {
      type: String,
      default: undefined
    },
    filter: {
      type: Boolean,
      default: false
    },
    filterPlaceholder: {
      type: String,
      default: undefined
    },
    showClear: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    autoFilterFocus: {
      type: Boolean,
      default: false
    },
    autoOptionFocus: {
      type: Boolean,
      default: false
    },
    resetFilterOnHide: {
      type: Boolean,
      default: false
    },
    appendTo: {
      type: [String, Object],
      default: 'body'
    },
    emptyMessage: {
      type: String,
      default: 'No available options'
    },
    filterIcon: {
      type: String,
      default: 'pi pi-search'
    },
    scrollHeight: {
      type: String,
      default: '14rem'
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => ['small', 'medium', 'large'].includes(value)
    },
    invalid: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:modelValue', 'change', 'filter', 'show', 'hide'])

  const slots = useSlots()
  const attrs = useAttrs()
  const listboxId = useId()

  const isOpen = ref(false)
  const filterValue = ref('')
  const highlightedIndex = ref(-1)
  const triggerRef = ref(null)
  const filterInputRef = ref(null)
  const panelStyle = ref({})

  const testId = computed(() => attrs['data-testid'] ?? 'input-dropdown')

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const resolveField = (data, field) => {
    if (field == null || field === '') {
      return data
    }

    if (typeof field === 'function') {
      return field(data)
    }

    return data?.[field]
  }

  const getOptionLabel = (option) => resolveField(option, props.optionLabel)
  const getOptionValue = (option) => resolveField(option, props.optionValue)

  const isOptionDisabled = (option) => {
    if (!props.optionDisabled) {
      return false
    }

    return Boolean(resolveField(option, props.optionDisabled))
  }

  const isOptionSelected = (option) => {
    const value = getOptionValue(option)

    return value === props.modelValue
  }

  const structuredOptions = computed(() => {
    if (!props.optionGroupChildren) {
      return props.options.map((option) => ({
        type: 'option',
        option,
        groupLabel: null
      }))
    }

    const items = []

    for (const group of props.options) {
      items.push({
        type: 'group',
        label: resolveField(group, props.optionGroupLabel),
        option: null,
        groupLabel: null
      })

      const children = resolveField(group, props.optionGroupChildren) ?? []

      for (const option of children) {
        items.push({
          type: 'option',
          option,
          groupLabel: resolveField(group, props.optionGroupLabel)
        })
      }
    }

    return items
  })

  const matchesFilter = (option) => {
    if (!props.filter || !filterValue.value.trim()) {
      return true
    }

    const label = String(getOptionLabel(option) ?? '').toLowerCase()
    const query = filterValue.value.trim().toLowerCase()

    return label.includes(query)
  }

  const filteredStructuredOptions = computed(() => {
    if (!props.filter || !filterValue.value.trim()) {
      return structuredOptions.value
    }

    if (!props.optionGroupChildren) {
      return structuredOptions.value.filter(
        (item) => item.type === 'option' && matchesFilter(item.option)
      )
    }

    const result = []

    for (const group of props.options) {
      const children = (resolveField(group, props.optionGroupChildren) ?? []).filter((option) =>
        matchesFilter(option)
      )

      if (children.length === 0) {
        continue
      }

      result.push({
        type: 'group',
        label: resolveField(group, props.optionGroupLabel),
        option: null,
        groupLabel: null
      })

      for (const option of children) {
        result.push({
          type: 'option',
          option,
          groupLabel: resolveField(group, props.optionGroupLabel)
        })
      }
    }

    return result
  })

  const selectableOptions = computed(() =>
    filteredStructuredOptions.value.filter(
      (item) => item.type === 'option' && !isOptionDisabled(item.option)
    )
  )

  const selectedOption = computed(() =>
    props.options
      .flatMap((option) => {
        if (props.optionGroupChildren) {
          const children = resolveField(option, props.optionGroupChildren) ?? []

          return children
        }

        return [option]
      })
      .find((option) => isOptionSelected(option))
  )

  const displayLabel = computed(() => {
    if (selectedOption.value) {
      return getOptionLabel(selectedOption.value)
    }

    return props.placeholder ?? ''
  })

  const hasValue = computed(
    () => props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
  )

  const useTeleport = computed(() => props.appendTo === 'body')

  const sharedTriggerClasses = [
    'relative inline-flex w-full min-w-0 items-center gap-spacing-elements-xs transition-all duration-150',
    'rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]',
    'before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit]',
    "before:opacity-0 before:transition-opacity before:content-['']",
    'before:bg-[var(--bg-hover)]',
    'hover:before:opacity-100',
    'focus-visible:before:opacity-0 active:before:opacity-0',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--ring-color)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
  ]

  const disabledTriggerClasses =
    'pointer-events-none border-transparent bg-[var(--bg-disabled)] text-[var(--text-disabled)] before:hidden'

  const sizeClasses = {
    small: 'h-8 px-[var(--spacing-elements-xs)]',
    medium: 'h-10 px-[var(--spacing-elements-sm)]',
    large: 'h-12 px-[var(--spacing-elements-md)]'
  }

  const labelSizeClasses = {
    small: 'text-label-sm',
    medium: 'text-label-md',
    large: 'text-label-lg'
  }

  const triggerClasses = computed(() => {
    const classes = [
      ...sharedTriggerClasses,
      sizeClasses[props.size] ?? sizeClasses.medium,
      labelSizeClasses[props.size] ?? labelSizeClasses.medium,
      'font-[family-name:var(--font-sans),ui-sans-serif,system-ui,sans-serif]',
      hasValue.value ? 'text-[var(--text-default)]' : 'text-[var(--text-muted)]'
    ]

    if (props.disabled) {
      classes.push(disabledTriggerClasses)
    }

    if (props.invalid) {
      classes.push('border-[var(--danger-border)] focus-visible:ring-[var(--danger)]')
    }

    if (attrs.class) {
      classes.push(attrs.class)
    }

    return classes
  })

  const panelClasses = [
    'webkit-dropdown-panel overflow-hidden rounded-[var(--shape-elements)]',
    'border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-lg',
    'font-[family-name:var(--font-sans),ui-sans-serif,system-ui,sans-serif]'
  ]

  const listClasses = [
    'webkit-dropdown-list overflow-y-auto p-spacing-elements-xxs',
    'text-[var(--text-default)]'
  ]

  const updatePanelPosition = () => {
    const trigger = triggerRef.value

    if (!trigger || !useTeleport.value) {
      panelStyle.value = {}
      return
    }

    const rect = trigger.getBoundingClientRect()

    panelStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 4}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: 1100
    }
  }

  const focusFilterInput = () => {
    if (!props.filter || !props.autoFilterFocus) {
      return
    }

    nextTick(() => {
      filterInputRef.value?.focus()
    })
  }

  const focusHighlightedOption = () => {
    if (!props.autoOptionFocus || selectableOptions.value.length === 0) {
      highlightedIndex.value = selectableOptions.value.length > 0 ? 0 : -1
      return
    }

    highlightedIndex.value = 0
  }

  const open = async () => {
    if (props.disabled || props.loading || isOpen.value) {
      return
    }

    isOpen.value = true
    emit('show')
    focusHighlightedOption()
    await nextTick()
    updatePanelPosition()
    focusFilterInput()
  }

  const close = () => {
    if (!isOpen.value) {
      return
    }

    isOpen.value = false
    highlightedIndex.value = -1

    if (props.resetFilterOnHide) {
      filterValue.value = ''
    }

    emit('hide')
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
    } else {
      open()
    }
  }

  const selectOption = (option) => {
    if (isOptionDisabled(option)) {
      return
    }

    const value = getOptionValue(option)

    emit('update:modelValue', value)
    emit('change', value)
    close()
  }

  const clearValue = (event) => {
    event?.stopPropagation()
    emit('update:modelValue', undefined)
    emit('change', undefined)
  }

  const onFilterInput = (event) => {
    filterValue.value = event.target.value
    highlightedIndex.value = selectableOptions.value.length > 0 ? 0 : -1
    emit('filter', { value: filterValue.value, originalEvent: event })
  }

  const onTriggerKeydown = (event) => {
    if (props.disabled) {
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen.value) {
          open()
        } else if (highlightedIndex.value < selectableOptions.value.length - 1) {
          highlightedIndex.value += 1
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen.value) {
          open()
        } else if (highlightedIndex.value > 0) {
          highlightedIndex.value -= 1
        }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (!isOpen.value) {
          open()
        } else if (highlightedIndex.value >= 0) {
          selectOption(selectableOptions.value[highlightedIndex.value].option)
        }
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Home':
        if (isOpen.value) {
          event.preventDefault()
          highlightedIndex.value = 0
        }
        break
      case 'End':
        if (isOpen.value) {
          event.preventDefault()
          highlightedIndex.value = selectableOptions.value.length - 1
        }
        break
      default:
        break
    }
  }

  const onClickOutside = (event) => {
    const trigger = triggerRef.value
    const panel = document.getElementById(`${listboxId}-panel`)

    if (trigger?.contains(event.target) || panel?.contains(event.target)) {
      return
    }

    close()
  }

  const getSelectableIndex = (option) =>
    selectableOptions.value.findIndex((item) => item.option === option)

  const optionItemClasses = (option) => {
    const index = getSelectableIndex(option)
    const isHighlighted = isOpen.value && index === highlightedIndex.value
    const isSelected = isOptionSelected(option)
    const isDisabled = isOptionDisabled(option)

    return [
      'text-label-md flex w-full cursor-pointer items-center rounded-[var(--shape-elements)] px-[var(--spacing-elements-xs)] py-[var(--spacing-elements-xs)] text-left transition-colors duration-150',
      isDisabled && 'pointer-events-none text-[var(--text-disabled)]',
      !isDisabled &&
        !isSelected &&
        !isHighlighted &&
        'text-[var(--text-default)] hover:bg-[var(--bg-hover)]',
      !isDisabled && isHighlighted && 'bg-[var(--bg-hover)] text-[var(--text-default)]',
      !isDisabled && isSelected && 'bg-[var(--bg-selected)] text-[var(--text-default)]'
    ]
  }

  watch(isOpen, (open) => {
    if (open) {
      document.addEventListener('mousedown', onClickOutside)
      window.addEventListener('resize', updatePanelPosition)
      window.addEventListener('scroll', updatePanelPosition, true)
    } else {
      document.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('resize', updatePanelPosition)
      window.removeEventListener('scroll', updatePanelPosition, true)
    }
  })

  onMounted(() => {
    if (isOpen.value) {
      document.addEventListener('mousedown', onClickOutside)
    }
  })

  onUnmounted(() => {
    document.removeEventListener('mousedown', onClickOutside)
    window.removeEventListener('resize', updatePanelPosition)
    window.removeEventListener('scroll', updatePanelPosition, true)
  })
</script>

<template>
  <div
    class="relative w-full"
    :data-testid="testId"
    v-bind="passthroughAttrs"
  >
    <div
      ref="triggerRef"
      :class="triggerClasses"
    >
      <button
        type="button"
        role="combobox"
        class="relative z-[1] flex min-w-0 flex-1 items-center gap-spacing-elements-xs border-0 bg-transparent p-0 text-left outline-none disabled:cursor-not-allowed"
        :disabled="disabled || loading"
        :aria-expanded="isOpen"
        aria-haspopup="listbox"
        :aria-controls="`${listboxId}-panel`"
        :data-testid="`${testId}__trigger`"
        @click="toggle"
        @keydown="onTriggerKeydown"
      >
        <span class="min-w-0 flex-1 truncate">
          <slot
            v-if="slots.value && hasValue"
            name="value"
            :value="modelValue"
            :placeholder="placeholder"
          />
          <template v-else>
            {{ displayLabel }}
          </template>
        </span>

        <Spinner
          v-if="loading"
          class="size-4 shrink-0 text-[var(--text-muted)]"
          :data-testid="`${testId}__loading`"
        />

        <span
          v-else
          class="inline-flex shrink-0 items-center text-[var(--text-muted)]"
          aria-hidden="true"
        >
          <slot name="dropdownicon">
            <i
              class="pi pi-chevron-down text-[0.75rem] transition-transform duration-150"
              :class="isOpen && 'rotate-180'"
            />
          </slot>
        </span>
      </button>

      <button
        v-if="showClear && hasValue && !disabled && !loading"
        type="button"
        class="relative z-[1] inline-flex shrink-0 items-center justify-center border-0 bg-transparent p-0 text-[var(--text-muted)] hover:text-[var(--text-default)]"
        :aria-label="`Clear ${placeholder ?? 'selection'}`"
        :data-testid="`${testId}__clear`"
        @click="clearValue"
      >
        <i
          class="pi pi-times text-[length:inherit]"
          aria-hidden="true"
        />
      </button>
    </div>

    <Teleport
      to="body"
      :disabled="!useTeleport"
    >
      <Transition name="webkit-dropdown-panel">
        <div
          v-if="isOpen"
          :id="`${listboxId}-panel`"
          role="listbox"
          :class="[
            ...panelClasses,
            'webkit-dropdown-panel-motion',
            !useTeleport && 'absolute left-0 top-full z-10 mt-1 w-full'
          ]"
          :style="useTeleport ? panelStyle : undefined"
          :data-testid="`${testId}__panel`"
        >
          <slot name="header" />

          <div
            v-if="filter"
            class="border-b border-[var(--border-default)] p-spacing-elements-xs"
            :data-testid="`${testId}__filter`"
          >
            <span class="relative flex w-full items-center">
              <i
                :class="[
                  filterIcon,
                  'pointer-events-none absolute left-[var(--spacing-elements-xs)] text-[var(--text-muted)]'
                ]"
                aria-hidden="true"
              />
              <input
                ref="filterInputRef"
                :value="filterValue"
                type="text"
                class="h-8 w-full rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] pl-8 pr-[var(--spacing-elements-xs)] text-[length:var(--text-body-sm-font-size)] text-[var(--text-default)] outline-none placeholder:text-[var(--text-muted)] focus-visible:ring-1 focus-visible:ring-[var(--ring-color)]"
                :placeholder="filterPlaceholder ?? 'Search'"
                :data-testid="`${testId}__filter-input`"
                @input="onFilterInput"
                @keydown.stop
              />
            </span>
          </div>

          <ul
            :id="listboxId"
            :class="listClasses"
            :style="{ maxHeight: scrollHeight }"
            :data-testid="`${testId}__list`"
          >
            <template
              v-for="(item, index) in filteredStructuredOptions"
              :key="`${item.type}-${index}-${item.type === 'option' ? getOptionValue(item.option) : item.label}`"
            >
              <li
                v-if="item.type === 'group'"
                role="presentation"
                class="text-overline-sm px-[var(--spacing-elements-xs)] py-[var(--spacing-elements-xxs)] text-[var(--text-muted)]"
                :data-testid="`${testId}__group`"
              >
                {{ item.label }}
              </li>

              <li
                v-else
                role="option"
                :aria-selected="isOptionSelected(item.option)"
                :aria-disabled="isOptionDisabled(item.option) || undefined"
              >
                <button
                  type="button"
                  :class="optionItemClasses(item.option)"
                  :disabled="isOptionDisabled(item.option)"
                  :data-testid="`${testId}__option`"
                  @click="selectOption(item.option)"
                  @mouseenter="highlightedIndex = getSelectableIndex(item.option)"
                >
                  <slot
                    name="option"
                    :option="item.option"
                    :index="getSelectableIndex(item.option)"
                  >
                    {{ getOptionLabel(item.option) }}
                  </slot>
                </button>
              </li>
            </template>

            <li
              v-if="selectableOptions.length === 0"
              role="presentation"
              class="text-label-md px-[var(--spacing-elements-xs)] py-[var(--spacing-elements-sm)] text-center text-[var(--text-muted)]"
              :data-testid="`${testId}__empty`"
            >
              <slot name="empty">
                {{ emptyMessage }}
              </slot>
            </li>
          </ul>

          <slot name="footer" />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
  .webkit-dropdown-panel-motion {
    transform-origin: top center;
  }

  .webkit-dropdown-panel-enter-active,
  .webkit-dropdown-panel-leave-active {
    transition:
      opacity 150ms ease,
      transform 150ms ease;
  }

  .webkit-dropdown-panel-enter-from,
  .webkit-dropdown-panel-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }

  .webkit-dropdown-panel-enter-to,
  .webkit-dropdown-panel-leave-from {
    opacity: 1;
    transform: scale(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .webkit-dropdown-panel-enter-active,
    .webkit-dropdown-panel-leave-active {
      transition: opacity 100ms ease;
    }

    .webkit-dropdown-panel-enter-from,
    .webkit-dropdown-panel-leave-to {
      transform: none;
    }
  }
</style>
