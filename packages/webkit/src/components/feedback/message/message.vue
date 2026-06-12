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

  defineOptions({
    name: 'Message',
    inheritAttrs: false
  })

  interface Props {
    /** Visual severity variant (maps Error to danger). */
    severity?: MessageSeverity
    /** Primary message heading. */
    title: string
    /** Supporting body copy below the title. */
    description?: string
    /** PrimeIcons class override for the leading icon. */
    icon?: string
    /** Label for the built-in text action button; hidden when empty. */
    actionLabel?: string
    /** When true, shows a close control that dismisses the message. */
    closable?: boolean
    /** Duration in milliseconds before auto-dismiss; `0` disables auto-dismiss. */
    life?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    severity: 'info',
    description: '',
    icon: '',
    actionLabel: '',
    closable: false,
    life: 0
  })

  const emit = defineEmits<{
    action: [event: MouseEvent]
    close: []
  }>()

  defineSlots<{
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
      :style="dismissTransitionStyle"
      tabindex="-1"
      class="flex min-h-14 items-center gap-[var(--spacing-sm)] rounded-[var(--shape-button)] border border-[length:var(--border-width-default,1px)] p-[var(--spacing-sm)] shadow-[var(--shadow-xs)] data-[severity=info]:border-[var(--info-border)] data-[severity=info]:bg-[var(--info)] data-[severity=success]:border-[var(--success-border)] data-[severity=success]:bg-[var(--success)] data-[severity=warning]:border-[var(--warning-border)] data-[severity=warning]:bg-[var(--warning)] data-[severity=danger]:border-[var(--danger-border)] data-[severity=danger]:bg-[var(--danger)]"
      @keydown="handleEscape"
    >
      <slot v-if="$slots['default']" />
      <template v-else>
        <i
          :class="resolvedIcon"
          :data-severity="normalizedSeverity"
          class="size-4 mt-0.5 self-start shrink-0 text-[length:inherit] leading-none data-[severity=info]:text-[var(--info-contrast)] data-[severity=success]:text-[var(--success-contrast)] data-[severity=warning]:text-[var(--warning-contrast)] data-[severity=danger]:text-[var(--danger-contrast)]"
          aria-hidden="true"
        />
        <div class="flex min-w-0 flex-1 flex-col">
          <p
            class="text-body-xs text-[var(--text-default)]"
            :data-testid="`${testId}__title`"
          >
            {{ title }}
          </p>
          <p
            v-if="description"
            class="text-body-xs text-[var(--text-muted)]"
            :data-testid="`${testId}__description`"
          >
            {{ description }}
          </p>
        </div>
      </template>
      <slot name="action">
        <Button
          v-if="actionLabel"
          kind="text"
          size="medium"
          :label="actionLabel"
          :data-testid="`${testId}__action`"
          @click="handleAction"
        />
      </slot>
      <IconButton
        v-if="closable"
        icon="pi pi-times"
        kind="transparent"
        size="small"
        ariaLabel="Close message"
        :data-testid="`${testId}__close`"
        @click="handleClose"
      />
    </div>
  </Transition>
</template>
