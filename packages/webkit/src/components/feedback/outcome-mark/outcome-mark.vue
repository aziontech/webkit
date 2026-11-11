<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'

  export type OutcomeMarkSeverity = 'success' | 'danger' | 'warning' | 'neutral'

  export type OutcomeMarkSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'OutcomeMark',
    inheritAttrs: false
  })

  interface Props {
    /** The outcome the mark shows: a check, a cross, an exclamation or a dash. */
    severity?: OutcomeMarkSeverity
    /** Size token: 16, 20 or 48 px. */
    size?: OutcomeMarkSize
    /** Scales the disc in and draws the glyph when it appears or its severity changes; static under reduced motion. */
    animated?: boolean
    /** Accessible name. Empty uses the locale catalog name of the severity. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    severity: 'success',
    size: 'medium',
    animated: false,
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ outcomeMark: en.outcomeMark })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-outcome-mark'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )
  const label = computed<string>(() => props.ariaLabel || t(`outcomeMark.${props.severity}`))

  const GLYPHS: Record<OutcomeMarkSeverity, string> = {
    success: 'M6 10.25l2.75 2.75L14.25 7.5',
    danger: 'M7.25 7.25l5.5 5.5M12.75 7.25l-5.5 5.5',
    warning: 'M10 5.5v5.25M10 14.25v.25',
    neutral: 'M6.5 10h7'
  }
  const glyph = computed<string>(() => GLYPHS[props.severity])

  const settled = ref<boolean>(!props.animated)
  let frame = 0

  const reducedMotion = (): boolean =>
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const play = (): void => {
    globalThis.cancelAnimationFrame?.(frame)
    if (!props.animated || reducedMotion() || !globalThis.requestAnimationFrame) {
      settled.value = true
      return
    }
    settled.value = false
    frame = globalThis.requestAnimationFrame(() => {
      frame = globalThis.requestAnimationFrame(() => {
        settled.value = true
      })
    })
  }

  onMounted(play)
  watch(() => [props.severity, props.animated], play)
  onBeforeUnmount(() => globalThis.cancelAnimationFrame?.(frame))
</script>

<template>
  <svg
    v-bind="rootAttrs"
    viewBox="0 0 20 20"
    fill="none"
    role="img"
    :aria-label="label"
    :data-testid="testId"
    :data-severity="severity"
    :data-size="size"
    :data-state="settled ? 'settled' : 'pending'"
    :data-animated="animated || null"
    class="group shrink-0 overflow-visible data-[size=small]:size-4 data-[size=medium]:size-5 data-[size=large]:size-12"
  >
    <circle
      cx="10"
      cy="10"
      r="9.5"
      :data-testid="`${testId}__disc`"
      class="origin-center fill-(--success) [transform-box:fill-box] group-data-[severity=danger]:fill-(--danger) group-data-[severity=warning]:fill-(--warning) group-data-[severity=neutral]:fill-(--bg-surface-raised) group-data-[severity=neutral]:stroke-(--border-default) group-data-[state=pending]:scale-50 group-data-[state=pending]:opacity-0 group-data-[animated]:transition-[scale,opacity] group-data-[animated]:duration-moderate-02 group-data-[animated]:ease-expressive-entrance motion-reduce:transition-none"
    />
    <path
      :d="glyph"
      pathLength="1"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      :data-testid="`${testId}__glyph`"
      class="stroke-(--success-contrast) [stroke-dasharray:1] group-data-[severity=danger]:stroke-(--danger-contrast) group-data-[severity=warning]:stroke-(--warning-contrast) group-data-[severity=neutral]:stroke-(--text-muted) group-data-[state=pending]:[stroke-dashoffset:1] group-data-[animated]:transition-[stroke-dashoffset] group-data-[animated]:delay-150 group-data-[animated]:duration-slow-01 group-data-[animated]:ease-expressive-entrance motion-reduce:transition-none"
    />
  </svg>
</template>
