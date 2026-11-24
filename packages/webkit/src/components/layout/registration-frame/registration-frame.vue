<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'RegistrationFrame',
    inheritAttrs: false
  })

  /** A single edge of the frame. */
  export type RegistrationFrameSide = 'top' | 'right' | 'bottom' | 'left'
  /** A single corner of the frame. */
  export type RegistrationFrameCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Any way of naming a set of edges: a keyword, one edge, or an explicit list. */
  export type RegistrationFrameSides =
    'all' | 'none' | 'x' | 'y' | RegistrationFrameSide | RegistrationFrameSide[]
  /** Any way of naming a set of corners: a keyword, one corner, or an explicit list. */
  export type RegistrationFrameMarks =
    | 'all'
    | 'none'
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | RegistrationFrameCorner
    | RegistrationFrameCorner[]

  export interface RegistrationFrameProps {
    /** Which of the frame's own rules to draw. Takes a keyword (`all`, `none`, `x`, `y`), one side, or a list of sides. */
    borders?: RegistrationFrameSides
    /** Which corner registration squares to draw. Takes a keyword (`all`, `none`, `top`, `bottom`, `left`, `right`), one corner, or a list of corners. */
    marks?: RegistrationFrameMarks
    /** Show the frame's own linear hatch texture behind the content, faded toward the edges. Prefer `texture`'s `lines` kind for a ruled ground; `spacer` composes that instead. */
    hatch?: boolean
    /**
     * Which sides a neighbouring frame already draws, so this one does not draw them again. `true`
     * is shorthand for `top` (a vertical stack); use `left` for a horizontal row, or a list for a
     * grid cell.
     */
    flush?: boolean | RegistrationFrameSides
  }

  const props = withDefaults(defineProps<RegistrationFrameProps>(), {
    borders: 'all',
    marks: 'all',
    hatch: false,
    flush: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'registration-frame'
  )

  function resolveSides(value: boolean | RegistrationFrameSides): Set<RegistrationFrameSide> {
    if (value === true) return new Set<RegistrationFrameSide>(['top'])
    if (value === false || value === 'none') return new Set<RegistrationFrameSide>()
    if (value === 'all') return new Set<RegistrationFrameSide>(['top', 'right', 'bottom', 'left'])
    if (value === 'x') return new Set<RegistrationFrameSide>(['left', 'right'])
    if (value === 'y') return new Set<RegistrationFrameSide>(['top', 'bottom'])
    return new Set<RegistrationFrameSide>(Array.isArray(value) ? value : [value])
  }

  function resolveCorners(value: RegistrationFrameMarks): Set<RegistrationFrameCorner> {
    if (value === 'none') return new Set<RegistrationFrameCorner>()
    if (value === 'all')
      return new Set<RegistrationFrameCorner>([
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right'
      ])
    if (value === 'top') return new Set<RegistrationFrameCorner>(['top-left', 'top-right'])
    if (value === 'bottom') return new Set<RegistrationFrameCorner>(['bottom-left', 'bottom-right'])
    if (value === 'left') return new Set<RegistrationFrameCorner>(['top-left', 'bottom-left'])
    if (value === 'right') return new Set<RegistrationFrameCorner>(['top-right', 'bottom-right'])
    return new Set<RegistrationFrameCorner>(Array.isArray(value) ? value : [value])
  }

  const flushSides = computed(() => resolveSides(props.flush))

  const borderSides = computed(() => {
    const sides = resolveSides(props.borders)
    for (const side of flushSides.value) sides.delete(side)
    return sides
  })

  const markCorners = computed(() => resolveCorners(props.marks))

  const listAttr = (names: Set<string>) => (names.size > 0 ? [...names].join(' ') : 'none')

  const bordersAttr = computed(() => listAttr(borderSides.value))
  const marksAttr = computed(() => listAttr(markCorners.value))
  const flushAttr = computed(() =>
    flushSides.value.size > 0 ? [...flushSides.value].join(' ') : null
  )

  const hatchAttr = computed(
    () => props.hatch || (attrs['data-hatch'] as string | undefined) || null
  )

  const hasCorner = (corner: RegistrationFrameCorner) => markCorners.value.has(corner)

  const MARK_CLASS = 'pointer-events-none absolute z-20 m-1 block size-1.5 bg-(--border-default)'

  const ROOT_CLASS =
    'relative border-(--border-default) ' +
    'data-[borders~=bottom]:border-b data-[borders~=left]:border-s data-[borders~=right]:border-e data-[borders~=top]:border-t ' +
    '[[data-frame-edges]>&]:border-x-0! [[data-frame-edges]>&]:border-t-0!'

  const HATCH_CLASS =
    'pointer-events-none absolute inset-0 ' +
    '[background-image:repeating-linear-gradient(to_right,var(--border-default)_0,var(--border-default)_1px,transparent_1px,transparent_var(--spacing-lg))] ' +
    'mask-[radial-gradient(ellipse_at_center,black_35%,transparent_90%)]'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-borders="bordersAttr"
    :data-marks="marksAttr"
    :data-hatch="hatchAttr"
    :data-flush="flushAttr"
    :class="ROOT_CLASS"
  >
    <div
      v-if="hatch"
      aria-hidden="true"
      :class="HATCH_CLASS"
    />

    <span
      v-if="hasCorner('top-left')"
      aria-hidden="true"
      :class="[MARK_CLASS, 'start-0 top-0 [[data-frame-edges]>*>&]:hidden']"
    />
    <span
      v-if="hasCorner('top-right')"
      aria-hidden="true"
      :class="[MARK_CLASS, 'end-0 top-0 [[data-frame-edges]>*>&]:hidden']"
    />
    <span
      v-if="hasCorner('bottom-left')"
      aria-hidden="true"
      :class="[MARK_CLASS, 'start-0 bottom-0']"
    />
    <span
      v-if="hasCorner('bottom-right')"
      aria-hidden="true"
      :class="[MARK_CLASS, 'end-0 bottom-0']"
    />

    <div class="relative z-10 h-full">
      <slot />
    </div>
  </div>
</template>
