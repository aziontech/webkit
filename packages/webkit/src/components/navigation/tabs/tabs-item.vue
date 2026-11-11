<script setup lang="ts">
  import { computed, inject, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'
  import { type TabsContext, TabsInjectionKey, type TabsValue } from './injection-key'

  defineOptions({
    name: 'TabsItem',
    inheritAttrs: false
  })

  interface Props {
    /** Tab identifier (required inside Tabs). */
    value?: TabsValue
    /** Visible label when the default slot is empty. */
    label?: string
    /** Selected state for standalone usage (Highlight). */
    selected?: boolean
    /** Disables interaction. */
    disabled?: boolean
    /** Shows a close affordance (Figma variant set). */
    closable?: boolean
    /** Marks the tab as holding unsaved changes: a dot after the label and a hidden "Unsaved changes". */
    dirty?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: undefined,
    label: 'Tab Item',
    selected: false,
    disabled: false,
    closable: false,
    dirty: false
  })

  const emit = defineEmits<{
    click: [event: globalThis.MouseEvent, value: TabsValue | string]
    close: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, value: TabsValue | string]
  }>()

  defineSlots<{
    default(): unknown
    leading(): unknown
    trailing(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ tabs: en.tabs })
  const buttonRef = ref<HTMLElement | null>(null)
  const resolvedValue = computed(() => props.value ?? props.label)

  const context = inject(TabsInjectionKey, null) as TabsContext | null

  const isSelected = computed(() => {
    if (context) {
      return context.value.value === resolvedValue.value
    }

    return Boolean(props.selected)
  })

  const isDisabled = computed(() => props.disabled ?? false)

  const tabIndex = computed(() => (isSelected.value && !isDisabled.value ? 0 : -1))

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-tabs-item'
  )

  const tabId = computed(() =>
    context ? context.tabId(resolvedValue.value) : `${testId.value}__tab`
  )

  const panelId = computed(() =>
    context?.panels.value.includes(resolvedValue.value)
      ? context.panelId(resolvedValue.value)
      : undefined
  )

  const itemSharedClasses = [
    'relative z-1 inline-flex h-(--size-8) shrink-0 cursor-pointer items-center',
    'gap-(--spacing-xs) rounded-(--shape-button)',
    'px-(--spacing-xs) py-(--spacing-xs)',
    'text-label-md transition-colors motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)'
  ]

  const itemClasses = computed(() =>
    cn(
      itemSharedClasses,
      isDisabled.value &&
        'pointer-events-none bg-(--bg-disabled) text-(--text-disabled) opacity-60',
      !isDisabled.value &&
        context &&
        !isSelected.value &&
        'bg-transparent text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-default)',
      !isDisabled.value && context && isSelected.value && 'bg-transparent text-(--text-default)',
      !context &&
        isSelected.value &&
        'border-(length:--border-width-default) border-(--border-muted) bg-(--secondary-mask) text-(--text-default) shadow-(--shadow-xs)',
      !context &&
        !isSelected.value &&
        'bg-transparent text-(--text-muted) hover:bg-(--bg-hover) hover:text-(--text-default)',
      attrs.class as string | undefined
    )
  )

  const iconClasses =
    'flex size-3.5 shrink-0 items-center justify-center text-[inherit] [&_i]:text-body-xs'

  const closeClasses =
    'flex size-3.5 shrink-0 items-center justify-center rounded-(--shape-button) text-[inherit] hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'

  const activate = (event: globalThis.MouseEvent) => {
    if (isDisabled.value) {
      return
    }

    context?.setValue(resolvedValue.value)
    emit('click', event, resolvedValue.value)
  }

  const onCloseClick = (event: globalThis.MouseEvent | globalThis.KeyboardEvent) => {
    event.stopPropagation()

    if (isDisabled.value) {
      return
    }

    emit('close', event, resolvedValue.value)
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
    :role="context ? 'tab' : undefined"
    :id="tabId"
    :class="itemClasses"
    :data-testid="testId"
    :data-state="isSelected ? 'active' : 'inactive'"
    :data-disabled="isDisabled ? '' : undefined"
    :data-dirty="dirty ? '' : undefined"
    :aria-selected="context ? isSelected : undefined"
    :aria-pressed="context ? undefined : isSelected"
    :aria-controls="panelId"
    :tabindex="context ? tabIndex : undefined"
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
      v-if="dirty"
      class="size-1.5 shrink-0 rounded-full bg-(--warning-contrast) forced-colors:bg-[CanvasText]"
      aria-hidden="true"
      :data-testid="`${testId}__dirty`"
    />
    <span
      v-if="dirty"
      class="sr-only"
      >{{ t('tabs.unsaved') }}</span
    >
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
      :aria-label="t('tabs.close')"
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
