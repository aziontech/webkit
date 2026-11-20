<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, useAttrs } from 'vue'

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

  let dismissTimer: ReturnType<typeof setTimeout> | undefined
  let dismissEvent: Event | undefined

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

  onMounted(() => {
    if (props.life > 0) {
      dismissTimer = setTimeout(() => dismiss(), props.life)
    }
  })

  onUnmounted(() => {
    clearDismissTimer()
  })
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
      v-bind="$attrs"
      :role="role"
      :data-testid="testId"
      :data-severity="normalizedSeverity"
      :data-size="size"
      :data-trailing="hasTrailingControl() || null"
      :data-titled="title ? true : null"
      tabindex="-1"
      class="@container/alert relative box-border flex w-full flex-wrap items-center gap-(--spacing-sm) break-words rounded-(--shape-button) border border-[length:var(--border-width-default,1px)] py-1.5 shadow-(--shadow-xs) data-[size=small]:min-h-8 data-[size=small]:px-(--spacing-xs) data-[size=medium]:min-h-9 data-[size=medium]:px-(--spacing-sm) data-[trailing]:pe-(--spacing-xs) data-[severity=info]:border-(--info-border) data-[severity=info]:bg-(--info) data-[severity=success]:border-(--success-border) data-[severity=success]:bg-(--success) data-[severity=warning]:border-(--warning-border) data-[severity=warning]:bg-(--warning) data-[severity=danger]:border-(--danger-border) data-[severity=danger]:bg-(--danger)"
      @keydown="onEscape"
    >
      <div class="flex min-w-0 flex-1 items-start gap-(--spacing-sm)">
        <span
          :data-size="size"
          class="flex shrink-0 items-center data-[size=small]:h-4.5 data-[size=medium]:h-5.25"
        >
          <i
            :class="resolvedIcon"
            :data-severity="normalizedSeverity"
            class="size-3.5 text-label-md leading-none data-[severity=info]:text-(--info-foreground) data-[severity=success]:text-(--success-foreground) data-[severity=warning]:text-(--warning-foreground) data-[severity=danger]:text-(--danger-foreground)"
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
            class="m-0 min-w-0 text-(--text-default) data-[size=small]:text-label-sm data-[size=medium]:text-label-md [&_a]:text-link [&_a]:[--text-link-color:currentColor] [&_a]:[--text-link-hover:currentColor] [&_a]:underline [&_a]:underline-offset-2 [&_a]:motion-reduce:transition-none"
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
