<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Spinner from '../../../utils/spinner/spinner.vue'
  import type { ToastType } from '../use-toast-store'

  defineOptions({
    name: 'ToastItem',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Severity / lifecycle variant; drives the leading icon color. */
      type?: ToastType
    }>(),
    {
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

  // Assertive surfaces (error / warning) announce as alerts; the rest are status.
  const role = computed(() =>
    props.type === 'error' || props.type === 'warning' ? 'alert' : 'status'
  )

  // No leading icon for the neutral `default` toast — only the typed variants.
  // `default` shows no icon; `loading` renders the spinning <Spinner/> (below),
  // not a glyph — so both map to an empty glyph here.
  const icons: Record<ToastType, string> = {
    default: '',
    success: 'pi pi-check-circle',
    info: 'pi pi-info-circle',
    warning: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle',
    loading: ''
  }
  const icon = computed(() => icons[props.type])
</script>

<template>
  <div
    v-bind="$attrs"
    :role="role"
    :data-testid="testId"
    :data-type="type"
    class="group pointer-events-auto relative flex w-full items-center gap-[var(--spacing-sm)] rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] py-[var(--spacing-sm)] pl-[var(--spacing-sm)] pr-[var(--spacing-md)] text-[var(--text-default)] shadow-[var(--shadow-md)]"
  >
    <Spinner
      v-if="type === 'loading'"
      class="size-4 shrink-0 text-[var(--text-muted)]"
    />
    <i
      v-else-if="icon"
      :class="icon"
      :data-type="type"
      class="size-4 shrink-0 leading-none text-[var(--text-muted)] data-[type=success]:text-[var(--success-contrast)] data-[type=info]:text-[var(--info-contrast)] data-[type=warning]:text-[var(--warning-contrast)] data-[type=error]:text-[var(--danger-contrast)]"
      aria-hidden="true"
    />
    <div class="flex min-w-0 flex-1 flex-col gap-[var(--spacing-xxs)]">
      <slot />
    </div>
    <div
      v-if="$slots['trailing']"
      class="flex shrink-0 items-center gap-[var(--spacing-xxs)]"
    >
      <slot name="trailing" />
    </div>
  </div>
</template>
