<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, useAttrs } from 'vue'

  import { useElementListener } from '../../../composables/use-element-listener'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import type { Severity } from '../../../utils/severity'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import { MESSAGE_DISMISS_MS } from './presets/transitions'

  export type AlertSeverity = Exclude<Severity, 'neutral'>
  export type AlertSize = 'small' | 'medium'

  defineOptions({
    name: 'Alert',
    inheritAttrs: false
  })

  export interface AlertProps {
    /** Visual severity variant. */
    severity?: AlertSeverity
    /** Size token. Drives the banner height, inline padding, copy scale, and the trailing control sizes. */
    size?: AlertSize
    /** Fallback message copy when the default slot is empty. */
    label?: string
    /** Bold heading above the message copy; hidden when empty. */
    title?: string
    /** Azion icon class override for the leading icon. */
    icon?: string
    /** Label for the built-in secondary action button; hidden when empty. */
    actionLabel?: string
    /** When true, shows a close control that dismisses the message. */
    closable?: boolean
    /** Duration in milliseconds before auto-dismiss; `0` disables auto-dismiss. */
    life?: number
  }

  const props = withDefaults(defineProps<AlertProps>(), {
    severity: 'info',
    size: 'medium',
    label: '',
    title: '',
    icon: '',
    actionLabel: '',
    closable: false,
    life: 0
  })

  const emit = defineEmits<{
    action: [event: MouseEvent]
    /** Dismissed, after the fade; carries the close click, the Escape key, or a `timeout` Event when life expires. */
    close: [event: Event]
  }>()

  const slots = defineSlots<{
    /** Alert copy: inline prose, or flow content such as paragraphs and a list. Falls back to label when empty. */
    default(): unknown
    /** Custom action control; replaces the built-in Button when provided. */
    actions(): unknown
  }>()

  const defaultIcons = {
    info: 'az az-circle-info',
    success: 'az az-check',
    warning: 'az az-triangle-alert',
    danger: 'az az-circle-alert'
  } as const

  const attrs = useAttrs()
  const { t } = useTranslate({ alert: en.alert })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'alert')

  type NormalizedSeverity = keyof typeof defaultIcons

  const normalizedSeverity = computed<NormalizedSeverity>(() => {
    const severity = String(props.severity || 'info').toLowerCase()

    if (
      severity === 'info' ||
      severity === 'success' ||
      severity === 'warning' ||
      severity === 'danger'
    ) {
      return severity
    }

    return 'info'
  })

  const resolvedIcon = computed(() => props.icon || defaultIcons[normalizedSeverity.value])

  const hasTrailingControl = () => Boolean(props.actionLabel || slots.actions || props.closable)

  const role = computed(() =>
    normalizedSeverity.value === 'danger' || normalizedSeverity.value === 'warning'
      ? 'alert'
      : 'status'
  )

  const visible = ref(true)
  const rootEl = ref<HTMLElement | null>(null)

  let dismissTimer: ReturnType<typeof setTimeout> | undefined
  let dismissEvent: Event | undefined
  let remainingLife = 0
  let timerStartedAt = 0
  let holds = 0

  const clearDismissTimer = () => {
    if (dismissTimer !== undefined) {
      clearTimeout(dismissTimer)
      dismissTimer = undefined
    }
  }

  const dismiss = (event?: Event) => {
    if (!visible.value) {
      return
    }

    dismissEvent = event
    clearDismissTimer()
    visible.value = false
  }

  const onAfterLeave = () => {
    emit('close', dismissEvent ?? new Event('timeout'))
  }

  const onAction = (event: MouseEvent) => {
    emit('action', event)
  }

  const onClose = (event: MouseEvent) => {
    event.stopPropagation()
    dismiss(event)
  }

  const onEscape = (event: KeyboardEvent) => {
    if (props.closable && event.key === 'Escape') {
      dismiss(event)
    }
  }

  const startDismissTimer = () => {
    if (remainingLife > 0 && dismissTimer === undefined && holds === 0) {
      timerStartedAt = Date.now()
      dismissTimer = setTimeout(() => dismiss(), remainingLife)
    }
  }

  const pauseDismissTimer = () => {
    holds += 1
    if (dismissTimer !== undefined) {
      clearDismissTimer()
      remainingLife -= Date.now() - timerStartedAt
    }
  }

  const resumeDismissTimer = () => {
    holds = Math.max(0, holds - 1)
    startDismissTimer()
  }

  useElementListener(rootEl, 'keydown', onEscape)
  useElementListener(rootEl, 'pointerenter', pauseDismissTimer)
  useElementListener(rootEl, 'pointerleave', resumeDismissTimer)
  useElementListener(rootEl, 'focusin', pauseDismissTimer)
  useElementListener(rootEl, 'focusout', resumeDismissTimer)

  onMounted(() => {
    remainingLife = props.life
    startDismissTimer()
  })

  onUnmounted(() => {
    clearDismissTimer()
  })

  const ROOT_CLASS =
    '@container/alert relative box-border flex w-full flex-wrap items-center gap-(--spacing-sm) break-words rounded-(--shape-button) border ' +
    'border-[length:var(--border-width-default,1px)] py-1.5 shadow-(--shadow-xs) ' +
    'data-[size=small]:min-h-8 data-[size=small]:px-(--spacing-xs) data-[size=medium]:min-h-9 data-[size=medium]:px-(--spacing-sm) ' +
    'data-[trailing]:pe-(--spacing-xs) ' +
    'border-(--border-default) bg-(--bg-surface-raised) data-[severity=success]:border-(--success-border) data-[severity=success]:bg-(--success-mask) ' +
    'data-[severity=warning]:border-(--warning-border) data-[severity=warning]:bg-(--warning-mask) data-[severity=danger]:border-(--danger-border) data-[severity=danger]:bg-(--danger-mask)'

  const ICON_CLASS =
    'size-3.5 text-label-md leading-none ' +
    'text-(--info-mark) data-[severity=success]:text-(--success-mark) data-[severity=warning]:text-(--warning-mark) ' +
    'data-[severity=danger]:text-(--danger-mark)'

  const CONTENT_CLASS =
    'm-0 min-w-0 text-(--text-default) ' +
    'data-[size=small]:text-label-sm data-[size=medium]:text-label-md ' +
    '[&_a]:text-link [&_a]:[--text-link-color:currentColor] [&_a]:[--text-link-hover:currentColor] [&_a]:underline [&_a]:underline-offset-2 [&_a]:motion-reduce:transition-none'
</script>

<template>
  <Transition
    :duration="{ enter: 0, leave: MESSAGE_DISMISS_MS }"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    leave-active-class="transition-opacity duration-fast-02 ease-productive-exit motion-reduce:transition-none"
    @after-leave="onAfterLeave"
  >
    <div
      v-if="visible"
      ref="rootEl"
      v-bind="$attrs"
      :role="role"
      :data-testid="testId"
      :data-severity="normalizedSeverity"
      :data-size="size"
      :data-trailing="hasTrailingControl() || null"
      :data-titled="title ? true : null"
      tabindex="-1"
      :class="ROOT_CLASS"
    >
      <div class="flex min-w-0 flex-1 items-start gap-(--spacing-sm)">
        <span
          :data-size="size"
          class="flex shrink-0 items-center data-[size=small]:h-4.5 data-[size=medium]:h-5.25"
        >
          <i
            :data-severity="normalizedSeverity"
            :class="[ICON_CLASS, resolvedIcon]"
            aria-hidden="true"
          />
        </span>
        <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
          <div
            v-if="title"
            class="text-title-sm text-(--text-default)"
            :data-testid="`${testId}__title`"
          >
            {{ title }}
          </div>
          <div
            v-if="$slots['default'] || label || !title"
            :data-size="size"
            :class="CONTENT_CLASS"
            :data-testid="`${testId}__content`"
          >
            <slot v-if="$slots['default']" />
            <template v-else>{{ label }}</template>
          </div>
        </div>
      </div>
      <div
        v-if="$slots['actions'] || actionLabel"
        data-slot="alert-actions"
        class="contents @max-sm/alert:order-last @max-sm/alert:flex @max-sm/alert:basis-full"
      >
        <slot name="actions">
          <Button
            variant="secondary"
            :size="size"
            :label="actionLabel"
            :data-testid="`${testId}__action`"
            @click="onAction"
          />
        </slot>
      </div>
      <IconButton
        v-if="closable"
        icon="az az-x"
        variant="ghost"
        :size="size"
        :ariaLabel="t('alert.close')"
        :data-testid="`${testId}__close`"
        @click="onClose"
      />
    </div>
  </Transition>
</template>
