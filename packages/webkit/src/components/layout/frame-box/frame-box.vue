<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FrameBox',
    inheritAttrs: false
  })

  /** A single edge of the frame. */
  export type FrameBoxSide = 'top' | 'right' | 'bottom' | 'left'
  /** A single corner of the frame. */
  export type FrameBoxCorner = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Any way of naming a set of edges: a keyword, one edge, or an explicit list. */
  export type FrameBoxSides = 'all' | 'none' | 'x' | 'y' | FrameBoxSide | FrameBoxSide[]
  /** Any way of naming a set of corners: a keyword, one corner, or an explicit list. */
  export type FrameBoxMarks =
    'all' | 'none' | 'top' | 'bottom' | 'left' | 'right' | FrameBoxCorner | FrameBoxCorner[]

  interface Props {
    /** Which of the frame's own rules to draw. Takes a keyword (`all`, `none`, `x`, `y`), one side, or a list of sides. */
    borders?: FrameBoxSides
    /** Which corner registration squares to draw. Takes a keyword (`all`, `none`, `top`, `bottom`, `left`, `right`), one corner, or a list of corners. */
    marks?: FrameBoxMarks
    /** Show the frame's own linear hatch texture behind the content, faded toward the edges. Prefer `texture-material`'s `lines` kind for a ruled ground; `section-gap` composes that instead. */
    hatch?: boolean
    /** Which sides a neighbouring frame already draws, so this one does not draw them again. `true` is shorthand for `top` (a vertical stack); use `left` for a horizontal row, or a list for a grid cell. */
    flush?: boolean | FrameBoxSides
  }

  const props = withDefaults(defineProps<Props>(), {
    borders: 'all',
    marks: 'all',
    hatch: false,
    flush: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-frame-box')

  function resolveSides(value: boolean | FrameBoxSides): Set<FrameBoxSide> {
    if (value === true) return new Set<FrameBoxSide>(['top'])
    if (value === false || value === 'none') return new Set<FrameBoxSide>()
    if (value === 'all') return new Set<FrameBoxSide>(['top', 'right', 'bottom', 'left'])
    if (value === 'x') return new Set<FrameBoxSide>(['left', 'right'])
    if (value === 'y') return new Set<FrameBoxSide>(['top', 'bottom'])
    return new Set<FrameBoxSide>(Array.isArray(value) ? value : [value])
  }

  function resolveCorners(value: FrameBoxMarks): Set<FrameBoxCorner> {
    if (value === 'none') return new Set<FrameBoxCorner>()
    if (value === 'all')
      return new Set<FrameBoxCorner>(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
    if (value === 'top') return new Set<FrameBoxCorner>(['top-left', 'top-right'])
    if (value === 'bottom') return new Set<FrameBoxCorner>(['bottom-left', 'bottom-right'])
    if (value === 'left') return new Set<FrameBoxCorner>(['top-left', 'bottom-left'])
    if (value === 'right') return new Set<FrameBoxCorner>(['top-right', 'bottom-right'])
    return new Set<FrameBoxCorner>(Array.isArray(value) ? value : [value])
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

  const hasCorner = (corner: FrameBoxCorner) => markCorners.value.has(corner)

  const MARK_CLASS = 'pointer-events-none absolute z-20 m-1 block size-1.5 bg-(--border-default)'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-borders="bordersAttr"
    :data-marks="marksAttr"
    :data-hatch="hatchAttr"
    :data-flush="flushAttr"
    class="relative border-(--border-default) data-[borders~=bottom]:border-b data-[borders~=left]:border-l data-[borders~=right]:border-r data-[borders~=top]:border-t"
  >
    <div
      v-if="hatch"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(to_right,var(--border-default)_0,var(--border-default)_1px,transparent_1px,transparent_var(--spacing-lg))] mask-[radial-gradient(ellipse_at_center,black_35%,transparent_90%)]"
    />

    <span
      v-if="hasCorner('top-left')"
      aria-hidden="true"
      :class="[MARK_CLASS, 'left-0 top-0']"
    />
    <span
      v-if="hasCorner('top-right')"
      aria-hidden="true"
      :class="[MARK_CLASS, 'right-0 top-0']"
    />
    <span
      v-if="hasCorner('bottom-left')"
      aria-hidden="true"
      :class="[MARK_CLASS, 'left-0 bottom-0']"
    />
    <span
      v-if="hasCorner('bottom-right')"
      aria-hidden="true"
      :class="[MARK_CLASS, 'right-0 bottom-0']"
    />

    <div class="relative z-10 h-full">
      <slot />
    </div>
  </div>
</template>
