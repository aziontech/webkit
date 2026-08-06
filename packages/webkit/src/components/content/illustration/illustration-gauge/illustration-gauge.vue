<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationGauge',
    inheritAttrs: false
  })

  export type IllustrationGaugeSeverity = 'success' | 'warning' | 'danger' | 'info'

  interface Props {
    /** Share of the ring that is filled, 0–100. */
    value?: number
    /** Which feedback role colors the filled arc. */
    severity?: IllustrationGaugeSeverity
    /** Text in the middle of the ring; empty renders the ring alone. */
    label?: string
    /** Draws the ring in the brand color instead of its severity; inherits the scene emphasis. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 100,
    severity: 'success',
    label: '',
    active: undefined
  })

  const attrs = useAttrs()

  const { size, active } = useIllustrationContext(
    () => undefined,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-gauge'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // A unit-square viewBox so the ring follows whatever box the scene gives it; the arc is drawn
  // by dashing the circumference, which is why the radius is the round 40 that makes 2πr ≈ 251.3.
  const RADIUS = 40
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  const clamped = computed(() => Math.min(100, Math.max(0, props.value)))

  const dashArray = computed(() => `${(clamped.value / 100) * CIRCUMFERENCE} ${CIRCUMFERENCE}`)

  const ROOT_CLASS =
    'relative grid shrink-0 place-items-center data-[size=small]:size-6 data-[size=medium]:size-8 data-[size=large]:size-12'

  const TRACK_CLASS = 'fill-none stroke-[var(--border-default)] [stroke-width:8]'

  const ARC_CLASS =
    'fill-none [stroke-width:8] [stroke-linecap:round] transition-colors duration-150 ease-out motion-reduce:transition-none group-data-[severity=success]/gauge:stroke-[var(--success-contrast)] group-data-[severity=warning]/gauge:stroke-[var(--warning-contrast)] group-data-[severity=danger]/gauge:stroke-[var(--danger-contrast)] group-data-[severity=info]/gauge:stroke-[var(--info-contrast)] group-data-[active]/gauge:stroke-[var(--primary)]'

  const LABEL_CLASS =
    'text-label-code-sm pointer-events-none absolute text-[length:var(--illustration-label-small)] leading-none text-[var(--text-default)]'

  const rootClass = computed(() => cn(ROOT_CLASS, 'group/gauge', attrs.class as string | undefined))
</script>

<template>
  <span
    :data-testid="testId"
    :data-size="size"
    :data-severity="severity"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 100 100"
      class="size-full -rotate-90"
    >
      <circle
        cx="50"
        cy="50"
        :r="RADIUS"
        :class="TRACK_CLASS"
      />
      <circle
        cx="50"
        cy="50"
        :r="RADIUS"
        :stroke-dasharray="dashArray"
        :class="ARC_CLASS"
      />
    </svg>
    <span
      v-if="label"
      :class="LABEL_CLASS"
      >{{ label }}</span
    >
  </span>
</template>
