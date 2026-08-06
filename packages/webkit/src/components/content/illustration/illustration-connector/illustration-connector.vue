<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationConnector',
    inheritAttrs: false
  })

  export type IllustrationConnectorKind = 'solid' | 'dashed'

  export type IllustrationConnectorOrientation = 'horizontal' | 'vertical'

  interface Props {
    /** Stroke style of the line. */
    kind?: IllustrationConnectorKind
    /** Axis the line runs along. */
    orientation?: IllustrationConnectorOrientation
    /** Strokes the line in the brand color; inherits the scene emphasis when omitted. */
    active?: boolean
    /** Marches the dashes to suggest flow; only meaningful when `kind` is `dashed`. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'solid',
    orientation: 'horizontal',
    active: undefined,
    animated: false
  })

  const attrs = useAttrs()

  // A connector has no `size` prop — its length is a property of the scene it spans, so it
  // reads the scale from context only. A consumer that wants it to fill instead adds `grow`.
  const { size, active } = useIllustrationContext(
    () => undefined,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-connector'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  const isVertical = computed(() => props.orientation === 'vertical')

  // The SVG carries no viewBox, so one user unit is one CSS pixel: the dash pattern is exactly
  // 2px on / 2px off and never distorts with the container. The cycle of 4 divides the 24-unit
  // travel of `flowDash`, so the marching loop has no visible seam.
  const dashArray = computed(() => (props.kind === 'dashed' ? '2 2' : undefined))

  // Intrinsic length is ~1.5x the box it spans, per scene scale — an asset composes parts
  // and gets sane proportions without sizing each line by hand. A scene that needs an exact
  // run sets `--illustration-connector-length` inline (an inline style beats the variant),
  // the same per-instance escape `--popup-origin` uses on overlays.
  const ROOT_CLASS =
    'block shrink-0 overflow-visible data-[size=small]:[--illustration-connector-length:1.5rem] data-[size=medium]:[--illustration-connector-length:3rem] data-[size=large]:[--illustration-connector-length:6rem] data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:w-[var(--illustration-connector-length)] data-[orientation=vertical]:w-1 data-[orientation=vertical]:h-[var(--illustration-connector-length)]'

  const LINE_CLASS =
    'stroke-[var(--border-default)] [stroke-width:var(--illustration-rim-width-hairline)] transition-colors duration-150 ease-out motion-reduce:transition-none group-data-[active]/connector:stroke-[var(--primary)] group-data-[animated]/connector:motion-safe:animate-flow-dash motion-reduce:animate-none'

  const rootClass = computed(() =>
    cn(ROOT_CLASS, 'group/connector', attrs.class as string | undefined)
  )
</script>

<template>
  <svg
    aria-hidden="true"
    focusable="false"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-orientation="orientation"
    :data-active="active || null"
    :data-animated="(animated && kind === 'dashed') || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <line
      :x1="isVertical ? '50%' : '0'"
      :y1="isVertical ? '0' : '50%'"
      :x2="isVertical ? '50%' : '100%'"
      :y2="isVertical ? '100%' : '50%'"
      :stroke-dasharray="dashArray"
      :class="LINE_CLASS"
    />
  </svg>
</template>
