<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import Spinner from '../../../utils/spinner/spinner.vue'
  import { ToastInjectionKey } from '../injection-key'
  import type { ToastSeverity, ToastType } from '../use-toast-store'

  defineOptions({
    name: 'ToastItem',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Severity / lifecycle variant; drives the leading icon and its color. */
      severity?: ToastSeverity
      /**
       * Legacy severity, with `error` for `danger`; read only when `severity` is left at `default`.
       * @deprecated since 6.0 — use `severity`. Removed in 7.0.
       */
      type?: ToastType
    }>(),
    {
      severity: 'default',
      type: 'default'
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

  const resolvedSeverity = computed<ToastSeverity>(() => {
    if (props.severity !== 'default') return props.severity
    return props.type === 'error' ? 'danger' : props.type
  })

  const role = computed(() => {
    if (inToaster) return undefined
    return resolvedSeverity.value === 'danger' || resolvedSeverity.value === 'warning'
      ? 'alert'
      : 'status'
  })

  const icons: Record<ToastSeverity, string> = {
    default: '',
    success: 'pi pi-check',
    info: 'pi pi-info-circle',
    warning: 'pi pi-exclamation-triangle',
    danger: 'pi pi-exclamation-circle',
    loading: ''
  }
  const icon = computed(() => icons[resolvedSeverity.value])
</script>

<template>
  <div
    v-bind="$attrs"
    :role="role"
    :data-testid="testId"
    :data-severity="resolvedSeverity"
    :data-type="resolvedSeverity === 'danger' ? 'error' : resolvedSeverity"
    class="group pointer-events-auto relative flex w-full items-start gap-(--spacing-sm) rounded-(--shape-elements) border-solid border-[length:var(--border-width-default,1px)] border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm) text-(--text-default) shadow-(--shadow-sm)"
  >
    <div class="flex min-w-0 flex-1 items-start gap-(--spacing-sm)">
      <span
        v-if="resolvedSeverity === 'loading' || icon"
        class="flex h-[1lh] shrink-0 items-center text-label-md"
        aria-hidden="true"
      >
        <Spinner
          v-if="resolvedSeverity === 'loading'"
          class="size-4 text-(--text-muted)"
        />
        <i
          v-else
          :class="icon"
          :data-severity="resolvedSeverity"
          class="leading-none text-(--text-muted) data-[severity=success]:text-(--success-contrast) data-[severity=info]:text-(--info-contrast) data-[severity=warning]:text-(--warning-contrast) data-[severity=danger]:text-(--danger-contrast)"
        />
      </span>
      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
        <slot />
      </div>
    </div>
    <div
      v-if="$slots['trailing']"
      class="-my-(--spacing-xxs) -me-(--spacing-xs) flex shrink-0 items-center gap-(--spacing-xxs)"
    >
      <slot name="trailing" />
    </div>
  </div>
</template>
