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
    /** Prints the live value in the middle instead of the label, so the number follows the arc. */
    showValue?: boolean
    /** Draws the ring in the brand color instead of its severity; inherits the scene emphasis. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 100,
    severity: 'success',
    label: '',
    showValue: false,
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

  // A unit-square viewBox so the ring follows whatever box the scene gives it. `pathLength="100"`
  // renormalizes the circumference to 100 units, so the dash that draws the arc IS the value —
  // no 2πr arithmetic, and the arc can be driven straight from the CSS variable below.
  const RADIUS = 40

  // Whole numbers only: the value seeds a CSS counter (`.illustration-gauge-readout`), and a
  // counter cannot print a fraction.
  const clamped = computed(() => Math.round(Math.min(100, Math.max(0, props.value))))

  // The prop is the RESTING value, written as the fallback of `--illustration-gauge-target` so a
  // scene above can raise it — hover a card, the target lands here, and the transition on the
  // root counts the arc and the readout up together. Declaring it here (rather than reading the
  // target further down) is what makes that work: a var() inside a custom property resolves where
  // it is DECLARED, so the parts below inherit an already-animating number.
  const rootStyle = computed(() => ({
    '--illustration-gauge-value': `var(--illustration-gauge-target, ${clamped.value})`
  }))

  const ARC_STYLE = { strokeDasharray: 'var(--illustration-gauge-value) 100' }

  const ROOT_CLASS =
    'relative grid shrink-0 place-items-center transition-[--illustration-gauge-value] duration-700 ease-out motion-reduce:transition-none data-[size=small]:size-6 data-[size=medium]:size-8 data-[size=large]:size-12'

  const TRACK_CLASS = 'fill-none stroke-[var(--border-default)] [stroke-width:8]'

  const ARC_CLASS =
    'fill-none [stroke-width:8] [stroke-linecap:round] transition-colors duration-150 ease-out motion-reduce:transition-none group-data-[severity=success]/gauge:stroke-[var(--success-contrast)] group-data-[severity=warning]/gauge:stroke-[var(--warning-contrast)] group-data-[severity=danger]/gauge:stroke-[var(--danger-contrast)] group-data-[severity=info]/gauge:stroke-[var(--info-contrast)] group-data-[active]/gauge:stroke-[var(--primary)]'

  const LABEL_CLASS =
    'text-label-code-sm pointer-events-none absolute text-[length:var(--illustration-label-small)] leading-none text-[var(--text-default)]'

  // The readout prints from the counter the theme utility seeds, so its digits come from the same
  // variable as the arc and cannot drift from it while the value moves.
  const READOUT_CLASS = `illustration-gauge-readout ${LABEL_CLASS}`

  const rootClass = computed(() => cn(ROOT_CLASS, 'group/gauge', attrs.class as string | undefined))
</script>

<template>
  <span
    :data-testid="testId"
    :data-size="size"
    :data-severity="severity"
    :data-active="active || null"
    :class="rootClass"
    :style="rootStyle"
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
        pathLength="100"
        :class="ARC_CLASS"
        :style="ARC_STYLE"
      />
    </svg>
    <span
      v-if="showValue"
      :data-testid="`${testId}__value`"
      :class="READOUT_CLASS"
    />
    <span
      v-else-if="label"
      :class="LABEL_CLASS"
      >{{ label }}</span
    >
  </span>
</template>
