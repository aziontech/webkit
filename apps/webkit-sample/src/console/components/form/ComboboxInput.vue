<script setup lang="ts">
  import InputText from '@aziontech/webkit/input-text'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import { usePlacement } from '@aziontech/webkit/use-placement'
  import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useId, watch } from 'vue'

  defineOptions({ name: 'ComboboxInput', inheritAttrs: false })

  interface Props {
    options?: unknown[]
    placeholder?: string
    ariaLabel?: string
    size?: string
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    emptyText?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    options: () => [],
    placeholder: '',
    ariaLabel: '',
    size: 'large',
    disabled: false,
    required: false,
    invalid: false,
    emptyText: 'No match'
  })

  const model = defineModel({ type: String, default: '' })

  const attrs = useAttrs()
  const listId = useId()

  const anchor = ref(null)
  const panel = ref(null)
  const input = ref(null)
  const open = ref(false)
  const activeIndex = ref(-1)
  const anchorWidth = ref(0)
  const typing = ref(false)

  const { panelStyle } = usePlacement({
    triggerRef: anchor,
    panelRef: panel,
    isOpen: open,
    placement: 'bottom-start',
    offset: 4
  })

  const panelSizing = computed(() => [panelStyle.value, { minWidth: `${anchorWidth.value}px` }])

  const matches = computed(() => {
    const query = typing.value ? model.value.trim().toLowerCase() : ''
    if (!query) return props.options
    return props.options.filter(
      (option) =>
        option.value.toLowerCase().includes(query) ||
        (option.label ?? '').toLowerCase().includes(query)
    )
  })

  const optionId = (index) => `${listId}-option-${index}`

  const activeId = computed(() =>
    open.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined
  )

  const expanded = computed(() => open.value && props.options.length > 0)

  const setOpen = (next) => {
    if (props.disabled) return
    if (next) anchorWidth.value = anchor.value?.offsetWidth ?? 0
    open.value = next
    if (!next) activeIndex.value = -1
  }

  const scrollActiveIntoView = () => {
    nextTick(() => {
      const options = panel.value?.querySelectorAll('[role="option"]')
      options?.[activeIndex.value]?.scrollIntoView({ block: 'nearest' })
    })
  }

  const move = (step) => {
    if (!open.value) {
      setOpen(true)
      return
    }
    const total = matches.value.length
    if (!total) return
    activeIndex.value = (activeIndex.value + step + total) % total
    scrollActiveIntoView()
  }

  const select = (option) => {
    model.value = option.value
    typing.value = false
    setOpen(false)
    nextTick(() => {
      const field = input.value
      if (!field) return
      field.focus()
      const caret = option.value.endsWith('_}') ? option.value.length - 1 : option.value.length
      field.setSelectionRange(caret, caret)
    })
  }

  const onFocus = (event) => {
    input.value = event.target
    typing.value = false
    setOpen(true)
  }

  const onInput = () => {
    activeIndex.value = -1
    typing.value = true
    setOpen(true)
  }

  const onKeydown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      move(event.key === 'ArrowDown' ? 1 : -1)
      return
    }
    if (event.key === 'Enter' && open.value && activeIndex.value >= 0) {
      event.preventDefault()
      select(matches.value[activeIndex.value])
      return
    }
    if (event.key === 'Escape' && open.value) {
      event.preventDefault()
      event.stopPropagation()
      setOpen(false)
      return
    }
    if (event.key === 'Tab') setOpen(false)
  }

  const onDocumentPointerDown = (event) => {
    if (!open.value) return
    const target = event.target
    if (anchor.value?.contains(target) || panel.value?.contains(target)) return
    setOpen(false)
  }

  watch(open, (next) => {
    if (next) document.addEventListener('pointerdown', onDocumentPointerDown, true)
    else document.removeEventListener('pointerdown', onDocumentPointerDown, true)
  })

  onBeforeUnmount(() => document.removeEventListener('pointerdown', onDocumentPointerDown, true))
</script>

<template>
  <div
    ref="anchor"
    class="w-full"
  >
    <InputText
      v-model="model"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :invalid="invalid"
      :class="['w-full', attrs.class]"
      role="combobox"
      autocomplete="off"
      aria-autocomplete="list"
      :aria-label="ariaLabel || undefined"
      :aria-expanded="expanded"
      :aria-controls="listId"
      :aria-activedescendant="activeId"
      @focus="onFocus"
      @input="onInput"
      @keydown="onKeydown"
    >
      <template #iconLeft>
        <i
          class="pi pi-search"
          aria-hidden="true"
        />
      </template>
    </InputText>

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="open && options.length"
          :id="listId"
          ref="panel"
          role="listbox"
          :style="panelSizing"
          class="fixed z-(--z-input-overlay) flex max-h-(--size-80) flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-xs)"
        >
          <ScrollArea
            class="flex max-h-60 flex-col items-stretch px-(--spacing-xxs) py-(--spacing-xs)"
          >
            <div
              v-for="(option, index) in matches"
              :id="optionId(index)"
              :key="option.value"
              role="option"
              :aria-selected="model === option.value"
              :data-active="index === activeIndex || null"
              :data-selected="model === option.value || null"
              class="flex h-8 cursor-pointer select-none items-center gap-(--spacing-xs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-default) transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) data-active:bg-(--bg-hover) data-selected:bg-(--bg-selected)"
              @mousedown.prevent="select(option)"
              @mousemove="activeIndex = index"
            >
              <span class="min-w-0 flex-auto truncate text-left">{{ option.value }}</span>
              <span
                v-if="option.label"
                class="shrink-0 text-body-sm text-(--text-muted)"
              >
                {{ option.label }}
              </span>
            </div>
            <p
              v-if="!matches.length"
              class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
            >
              {{ emptyText }}
            </p>
          </ScrollArea>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
