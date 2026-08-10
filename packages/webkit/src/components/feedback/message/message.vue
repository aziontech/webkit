<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import {
    getMessageDismissTransitionStyle,
    MESSAGE_DISMISS_MS,
    messageDismissTransitionClasses
  } from './presets/transitions'

  export type MessageSeverity = 'info' | 'success' | 'warning' | 'danger' | 'error'
  export type MessageSize = 'small' | 'medium'

  defineOptions({
    name: 'Message',
    inheritAttrs: false
  })

  interface Props {
    /** Visual severity variant (maps Error to danger). */
    severity?: MessageSeverity
    /** Size token. Drives the banner height, inline padding, copy scale, and the trailing control sizes. */
    size?: MessageSize
    /** Fallback message copy when the default slot is empty. */
    label?: string
    /** PrimeIcons class override for the leading icon. */
    icon?: string
    /** Label for the built-in secondary action button; hidden when empty. */
    actionLabel?: string
    /** When true, shows a close control that dismisses the message. */
    closable?: boolean
    /** Duration in milliseconds before auto-dismiss; `0` disables auto-dismiss. */
    life?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    severity: 'info',
    size: 'medium',
    label: '',
    icon: '',
    actionLabel: '',
    closable: false,
    life: 0
  })

  const emit = defineEmits<{
    action: [event: MouseEvent]
    close: []
  }>()

  const slots = defineSlots<{
    default(): unknown
    action(): unknown
  }>()

  const defaultIcons = {
    info: 'pi pi-info-circle',
    success: 'pi pi-check',
    warning: 'pi pi-exclamation-triangle',
    danger: 'pi pi-exclamation-circle'
  } as const

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feedback-message')

  type NormalizedSeverity = keyof typeof defaultIcons

  const normalizedSeverity = computed<NormalizedSeverity>(() => {
    const severity = String(props.severity || 'info').toLowerCase()

    if (severity === 'error') {
      return 'danger'
    }

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

  // A trailing control (action button or close) brings its own inline padding, so the
  // banner tightens its end edge to keep the optical inset even.
  const hasTrailingControl = computed(() =>
    Boolean(props.actionLabel || slots.action || props.closable)
  )

  const role = computed(() =>
    normalizedSeverity.value === 'danger' || normalizedSeverity.value === 'warning'
      ? 'alert'
      : 'status'
  )

  const dismissTransitionStyle = getMessageDismissTransitionStyle()

  const visible = ref(true)

  let dismissTimer: ReturnType<typeof setTimeout> | undefined

  const clearDismissTimer = () => {
    if (dismissTimer !== undefined) {
      clearTimeout(dismissTimer)
      dismissTimer = undefined
    }
  }

  const dismiss = () => {
    if (!visible.value) {
      return
    }

    clearDismissTimer()
    visible.value = false
  }

  const handleAfterLeave = () => {
    emit('close')
  }

  const handleAction = (event: MouseEvent) => {
    emit('action', event)
  }

  const handleClose = (event: MouseEvent) => {
    event.stopPropagation()
    dismiss()
  }

  const handleEscape = (event: { key?: string }) => {
    if (props.closable && event.key === 'Escape') {
      dismiss()
    }
  }

  onMounted(() => {
    if (props.life > 0) {
      dismissTimer = setTimeout(dismiss, props.life)
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
    :leave-active-class="messageDismissTransitionClasses.join(' ')"
    @after-leave="handleAfterLeave"
  >
    <div
      v-if="visible"
      v-bind="$attrs"
      :role="role"
      :data-testid="testId"
      :data-severity="normalizedSeverity"
      :data-size="size"
      :data-trailing="hasTrailingControl || null"
      :style="dismissTransitionStyle"
      tabindex="-1"
      class="relative box-border flex w-full flex-wrap items-center gap-(--spacing-sm) break-words rounded-(--shape-button) border border-[length:var(--border-width-default,1px)] py-1.5 shadow-(--shadow-xs) data-[size=small]:min-h-8 data-[size=small]:px-(--spacing-xs) data-[size=medium]:min-h-9 data-[size=medium]:px-(--spacing-sm) data-[trailing]:pr-(--spacing-xs) data-[severity=info]:border-(--info-border) data-[severity=info]:bg-(--info) data-[severity=success]:border-(--success-border) data-[severity=success]:bg-(--success) data-[severity=warning]:border-(--warning-border) data-[severity=warning]:bg-(--warning) data-[severity=danger]:border-(--danger-border) data-[severity=danger]:bg-(--danger)"
      @keydown="handleEscape"
    >
      <i
        :class="resolvedIcon"
        :data-severity="normalizedSeverity"
        class="size-3.5 shrink-0 text-label-md leading-none data-[severity=info]:text-(--info-contrast) data-[severity=success]:text-(--success-contrast) data-[severity=warning]:text-(--warning-contrast) data-[severity=danger]:text-(--danger-contrast)"
        aria-hidden="true"
      />
      <p
        :data-size="size"
        class="m-0 min-w-0 flex-1 text-(--text-default) data-[size=small]:text-label-sm data-[size=medium]:text-label-md [&_a]:text-link [&_a]:underline [&_a]:underline-offset-2 [&_a]:motion-reduce:transition-none"
        :data-testid="`${testId}__content`"
      >
        <slot v-if="$slots['default']" />
        <template v-else>{{ label }}</template>
      </p>
      <slot name="action">
        <Button
          v-if="actionLabel"
          kind="secondary"
          :size="size"
          :label="actionLabel"
          :data-testid="`${testId}__action`"
          @click="handleAction"
        />
      </slot>
      <IconButton
        v-if="closable"
        icon="pi pi-times"
        kind="transparent"
        :size="size"
        ariaLabel="Close message"
        :data-testid="`${testId}__close`"
        @click="handleClose"
      />
    </div>
  </Transition>
</template>
