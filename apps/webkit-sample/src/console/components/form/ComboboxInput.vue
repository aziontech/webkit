<script setup>
  // A field that SUGGESTS without closing the set: the reader types, the catalog
  // narrows under the cursor, and anything typed stands whether it is offered or not.
  //
  // This is the shape an open vocabulary needs. A Rules Engine variable is the case that
  // forces it — `${arg_}`, `${cookie_}` and `${http_}` are prefixes the reader completes,
  // so a Select could only ever offer the stem of a name and never the name. A plain text
  // field is the other half of the same failure: it asks for a vocabulary it does not
  // show.
  //
  // The panel is teleported and anchored (webkit's `use-placement`), not absolutely
  // positioned in the field's own box, because this field lives inside a Drawer: an
  // in-flow panel would be clipped by the drawer's scroll container and painted under its
  // surface. Anchored at `--z-input-overlay` it behaves exactly as `Select.Content` does
  // in the same row.
  import InputText from '@aziontech/webkit/input-text'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import { usePlacement } from '@aziontech/webkit/use-placement'
  import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useId, watch } from 'vue'

  defineOptions({ name: 'ComboboxInput', inheritAttrs: false })

  const props = defineProps({
    /** Suggestions offered under the field: `{ value, label? }`. `label` is the human name. */
    options: { type: Array, default: () => [] },
    /** Placeholder shown while the field is empty. */
    placeholder: { type: String, default: '' },
    /** Accessible name for the field. */
    ariaLabel: { type: String, default: '' },
    /** Field height: small=28px, medium=32px, large=40px. */
    size: { type: String, default: 'large' },
    /** Disables the field and prevents the panel from opening. */
    disabled: { type: Boolean, default: false },
    /** Marks the field as required (amber border). */
    required: { type: Boolean, default: false },
    /** Marks the field as invalid (red border). */
    invalid: { type: Boolean, default: false },
    /** Line shown in place of the list when nothing matches. */
    emptyText: { type: String, default: 'No match' }
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

  // The field's width is the panel's FLOOR, not its measure. A suggestion that carries a
  // human name beside the value needs more room than the column the field sits in, and a
  // list that truncates both halves stops distinguishing the rows it is offering — three
  // `${header_accept…}` reading identically is a list that cannot be picked from.
  const panelSizing = computed(() => [panelStyle.value, { minWidth: `${anchorWidth.value}px` }])

  // FOCUS OFFERS EVERYTHING; TYPING NARROWS. A field opened on a value it already holds is
  // a reader looking for a different one, and the value they hold is routinely one the list
  // cannot contain (`${http_x_maintenance}` completes `${http_}`) — filtering by it would
  // answer that with an empty panel. The query only applies once they type into it.
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

  // A field with nothing to suggest never renders a panel, so it never claims one.
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

  // A prefix suggestion is a stem, not an answer: picking `${arg_}` leaves the caret
  // inside the braces so the reader keeps typing the name instead of hunting for the
  // position the value is missing.
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
    // Escape belongs to the open panel first. Left to bubble it would close the Drawer
    // this field is written in, losing the rule to dismiss a list.
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
          class="fixed z-(--z-input-overlay) flex max-h-[20rem] flex-col overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-xs)"
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
