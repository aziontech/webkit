<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { type TabViewContext, TabViewInjectionKey, type TabViewValue } from './injection-key'

  defineOptions({
    name: 'TabViewItem',
    inheritAttrs: false
  })

  interface Props {
    /** Tab identifier (required inside TabView). */
    value?: TabViewValue
    /** Visible label when the default slot is empty. */
    label?: string
    /** Selected state for standalone usage (Highlight). */
    selected?: boolean
    /** Disables interaction. */
    disabled?: boolean
    /** Shows a close affordance (Figma variant set). */
    closable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    label: 'Tab Item',
    selected: false,
    disabled: false,
    closable: false
  })

  const emit = defineEmits<{
    click: [payload: globalThis.MouseEvent]
    close: [payload: globalThis.MouseEvent | globalThis.KeyboardEvent]
  }>()

  defineSlots<{
    default(): unknown
    leading(): unknown
    trailing(): unknown
  }>()

  const attrs = useAttrs()
  const buttonRef = ref<HTMLElement | null>(null)
  const resolvedValue = computed(() => props.value ?? props.label)

  const context = inject(TabViewInjectionKey, null) as TabViewContext | null

  const isSelected = computed(() => {
    if (context) {
      return context.value.value === resolvedValue.value
    }

    return Boolean(props.selected)
  })

  const isDisabled = computed(() => props.disabled ?? false)

  const tabIndex = computed(() => (isSelected.value && !isDisabled.value ? 0 : -1))

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-tab-view-item'
  )

  const tabId = computed(() =>
    context ? context.tabId(resolvedValue.value) : `${testId.value}__tab`
  )

  const panelId = computed(() => (context ? context.panelId(resolvedValue.value) : undefined))

  const itemSharedClasses = [
    'relative z-[1] inline-flex h-[30px] shrink-0 cursor-pointer items-center',
    'gap-spacing-elements-xs rounded-[var(--shape-elements)]',
    'px-[var(--spacing-elements-sm)] py-[var(--spacing-elements-xs)]',
    'text-label-md transition-colors motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]'
  ]

  const itemClasses = computed(() =>
    cn(
      itemSharedClasses,
      isDisabled.value &&
        'pointer-events-none bg-[var(--bg-disabled)] text-[var(--text-disabled)] opacity-60',
      !isDisabled.value &&
        context &&
        !isSelected.value &&
        'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]',
      !isDisabled.value &&
        context &&
        isSelected.value &&
        'bg-transparent text-[var(--secondary-contrast)]',
      !context &&
        isSelected.value &&
        'bg-[var(--secondary-selected)] text-[var(--secondary-contrast)]',
      !context &&
        !isSelected.value &&
        'bg-transparent text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)]',
      attrs.class as string | undefined
    )
  )

  const iconClasses =
    'flex size-3.5 shrink-0 items-center justify-center text-[inherit] [&_i]:text-body-xs'

  const closeClasses =
    'flex size-3.5 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[inherit] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]'

  const activate = (event: globalThis.MouseEvent) => {
    if (isDisabled.value) {
      return
    }

    context?.setValue(resolvedValue.value)
    emit('click', event)
  }

  const onCloseClick = (event: globalThis.MouseEvent | globalThis.KeyboardEvent) => {
    event.stopPropagation()

    if (isDisabled.value) {
      return
    }

    emit('close', event)
  }

  onMounted(() => {
    if (!context || props.value === undefined) {
      return
    }

    context.registerTab({
      value: props.value,
      disabled: props.disabled,
      el: buttonRef
    })
  })

  onBeforeUnmount(() => {
    if (!context || props.value === undefined) {
      return
    }

    context.unregisterTab(props.value)
  })
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    role="tab"
    :id="tabId"
    :class="itemClasses"
    :data-testid="testId"
    :data-state="isSelected ? 'active' : 'inactive'"
    :data-disabled="isDisabled ? '' : undefined"
    :aria-selected="isSelected"
    :aria-controls="panelId"
    :tabindex="tabIndex"
    :disabled="isDisabled"
    @click="activate"
  >
    <span
      v-if="$slots['leading']"
      :class="iconClasses"
      aria-hidden="true"
      :data-testid="`${testId}__leading`"
    >
      <slot name="leading" />
    </span>
    <span :data-testid="`${testId}__label`">
      <slot>{{ label }}</slot>
    </span>
    <span
      v-if="$slots['trailing']"
      :class="iconClasses"
      aria-hidden="true"
      :data-testid="`${testId}__trailing`"
    >
      <slot name="trailing" />
    </span>
    <span
      v-if="closable"
      :class="closeClasses"
      :data-testid="`${testId}__close`"
      role="button"
      tabindex="-1"
      aria-label="Close tab"
      @click.stop="onCloseClick"
      @keydown.enter.prevent.stop="onCloseClick"
      @keydown.space.prevent.stop="onCloseClick"
    >
      <i
        class="pi pi-times"
        aria-hidden="true"
      />
    </span>
  </button>
</template>
