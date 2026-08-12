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
    /** Show the linear hatch texture behind the content, faded toward the edges. Reserved for `section-gap`, whose identity it is. */
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

  // Every "which parts" prop resolves to a set of side / corner names, so a keyword, a single
  // name and an explicit list are the same thing by the time anything renders. `flush` is the
  // one that also accepts `true`, because a bare `flush` attribute is how a vertical stack
  // reads and `top` is what that means.
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

  // `flush` is a subtraction, not an override: a side a neighbour already draws is simply not
  // in this frame's set. That is what makes it work on both axes — dropping `left` for a frame
  // in a horizontal row is the same operation as dropping `top` in a vertical stack — and it
  // means a shared edge is one rule at one colour, never two hairlines meeting.
  const borderSides = computed(() => {
    const sides = resolveSides(props.borders)
    for (const side of flushSides.value) sides.delete(side)
    return sides
  })

  const markCorners = computed(() => resolveCorners(props.marks))

  // Space-separated so a Tailwind `data-[borders~=top]:` variant can match one name out of the
  // list; `none` keeps the attribute readable (and unmatchable) when the set is empty.
  const listAttr = (names: Set<string>) => (names.size > 0 ? [...names].join(' ') : 'none')

  const bordersAttr = computed(() => listAttr(borderSides.value))
  const marksAttr = computed(() => listAttr(markCorners.value))
  const flushAttr = computed(() =>
    flushSides.value.size > 0 ? [...flushSides.value].join(' ') : null
  )

  const hasCorner = (corner: FrameBoxCorner) => markCorners.value.has(corner)

  // Each square is anchored to a corner and inset from both rules by its own margin,
  // so the mark sits INSIDE the frame instead of straddling the border line. At 6px
  // filled it reads as a tick in the corner, not as a second, competing border.
  const MARK_CLASS = 'pointer-events-none absolute z-20 m-1 block size-1.5 bg-(--border-default)'
</script>

<template>
  <!-- Rules, corner marks and hatch are all `--border-default`, an OPAQUE step of the surface
       palette — so a rule has one identity on every backdrop and two of them meeting cannot
       composite into a brighter line, which is what made a stacked junction read as a double
       rule. Sides and corners are addressed individually: `data-borders` carries the resolved
       side list and each edge matches its own `data-[borders~=…]` variant. -->
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-borders="bordersAttr"
    :data-marks="marksAttr"
    :data-hatch="hatch || null"
    :data-flush="flushAttr"
    class="relative border-(--border-default) data-[borders~=bottom]:border-b data-[borders~=left]:border-l data-[borders~=right]:border-r data-[borders~=top]:border-t"
  >
    <!-- Linear hatch texture — vertical rules at a fixed pitch, faded toward the edges by the
         radial mask alone, so the line colour is the texture's full strength at the centre.
         It is the design asset that gives a SectionGap its identity; see that component. -->
    <div
      v-if="hatch"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(to_right,var(--border-default)_0,var(--border-default)_1px,transparent_1px,transparent_var(--spacing-lg))] mask-[radial-gradient(ellipse_at_center,black_35%,transparent_90%)]"
    />

    <!-- Corner registration squares, one per corner. Stacked or abutting frames share an edge,
         so drawing both neighbours' ticks puts two squares a few pixels apart on one line;
         addressing corners individually is what lets a stack read as one mark per corner, the
         same way `flush` gives it one rule per shared edge. -->
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

    <!-- Content sits above the hatch texture. `h-full` is what lets a frame used as a
         grid cell hand its stretched height down to the content: against an auto-height
         frame it resolves to auto, but when the grid stretches the frame to the tallest
         cell in the row, the content fills it — so a cell can push its footer onto the
         row's bottom edge and align with its neighbours. -->
    <div class="relative z-10 h-full">
      <slot />
    </div>
  </div>
</template>
