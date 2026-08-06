<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationElbow',
    inheritAttrs: false
  })

  export type IllustrationElbowKind = 'solid' | 'dashed'

  /** Which corner of the box the bend turns through; the arms run along the edges meeting there. */
  export type IllustrationElbowCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

  interface Props {
    /** Stroke style of the line. */
    kind?: IllustrationElbowKind
    /** Corner the bend turns through. */
    corner?: IllustrationElbowCorner
    /** Draws the line in the brand color; inherits the scene emphasis when omitted. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'solid',
    corner: 'bottom-left',
    active: undefined
  })

  const attrs = useAttrs()

  // An elbow spans the gap between two parts, so its box comes from the scene, not a `size`.
  const { size, active } = useIllustrationContext(
    () => undefined,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-elbow'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // Drawn as two adjacent CSS borders with a radius on the corner between them, rather than an
  // SVG path: `d` takes neither `%` nor `calc()`, so a path would have to be recomputed from a
  // measured box. Two borders give a true circular arc, follow the box at any size for free, and
  // dash through the corner without the pattern distorting.
  const ROOT_CLASS =
    'block shrink-0 border-[length:var(--illustration-rim-width-hairline)] border-[var(--border-default)] transition-colors duration-150 ease-out motion-reduce:transition-none data-[size=small]:[--illustration-connector-length:1.5rem] data-[size=medium]:[--illustration-connector-length:3rem] data-[size=large]:[--illustration-connector-length:6rem] h-[var(--illustration-connector-length)] w-[var(--illustration-connector-length)] border-t-0 border-r-0 border-b-0 border-l-0 data-[kind=solid]:border-solid data-[kind=dashed]:border-dashed data-[corner=bottom-left]:rounded-bl-[var(--illustration-shape-large)] data-[corner=bottom-left]:border-l-[length:var(--illustration-rim-width-hairline)] data-[corner=bottom-left]:border-b-[length:var(--illustration-rim-width-hairline)] data-[corner=top-left]:rounded-tl-[var(--illustration-shape-large)] data-[corner=top-left]:border-l-[length:var(--illustration-rim-width-hairline)] data-[corner=top-left]:border-t-[length:var(--illustration-rim-width-hairline)] data-[corner=top-right]:rounded-tr-[var(--illustration-shape-large)] data-[corner=top-right]:border-t-[length:var(--illustration-rim-width-hairline)] data-[corner=top-right]:border-r-[length:var(--illustration-rim-width-hairline)] data-[corner=bottom-right]:rounded-br-[var(--illustration-shape-large)] data-[corner=bottom-right]:border-b-[length:var(--illustration-rim-width-hairline)] data-[corner=bottom-right]:border-r-[length:var(--illustration-rim-width-hairline)] data-[active]:border-[var(--primary)]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <span
    aria-hidden="true"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-corner="corner"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  />
</template>
