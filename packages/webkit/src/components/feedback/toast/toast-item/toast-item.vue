<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import Spinner from '../../../utils/spinner/spinner.vue'
  import { ToastInjectionKey } from '../injection-key'
  import type { ToastSeverity } from '../use-toast-store'

  defineOptions({
    name: 'ToastItem',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Severity / lifecycle variant; drives the leading icon and its color. */
      severity?: ToastSeverity
    }>(),
    {
      severity: 'default'
    }
  )

  defineSlots<{
    /** Title + description column. */
    default(): unknown
    /** Trailing region, right-aligned and vertically centered (e.g. the action button). */
    trailing(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-toast__item'
  )

  const inToaster = inject(ToastInjectionKey, null) !== null

  const role = computed(() => {
    if (inToaster) return undefined
    return props.severity === 'danger' ? 'alert' : 'status'
  })

  const icons: Record<ToastSeverity, string> = {
    default: '',
    success: 'ai ai-check',
    info: 'ai ai-circle-info',
    warning: 'ai ai-triangle-alert',
    danger: 'ai ai-circle-alert',
    loading: ''
  }
  const icon = computed(() => icons[props.severity])
</script>

<template>
  <div
    v-bind="$attrs"
    :role="role"
    :data-testid="testId"
    :data-severity="severity"
    class="group pointer-events-auto relative flex w-full items-start gap-(--spacing-sm) rounded-(--shape-control) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm) text-(--text-default) shadow-(--shadow-sm)"
  >
    <div class="flex min-w-0 flex-1 items-start gap-(--spacing-sm)">
      <span
        v-if="severity === 'loading' || icon"
        class="flex h-[1lh] shrink-0 items-center text-label-md"
        aria-hidden="true"
      >
        <Spinner
          v-if="severity === 'loading'"
          class="size-4 text-(--text-muted)"
        />
        <i
          v-else
          :class="icon"
          :data-severity="severity"
          class="leading-none text-(--text-muted) data-[severity=success]:text-(--success-foreground) data-[severity=info]:text-(--info-foreground) data-[severity=warning]:text-(--warning-foreground) data-[severity=danger]:text-(--danger-foreground)"
        />
      </span>
      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
        <slot />
      </div>
    </div>
    <div
      v-if="$slots['trailing']"
      class="-my-(--spacing-2xs) -me-(--spacing-xs) flex shrink-0 items-center gap-(--spacing-2xs)"
    >
      <slot name="trailing" />
    </div>
  </div>
</template>
