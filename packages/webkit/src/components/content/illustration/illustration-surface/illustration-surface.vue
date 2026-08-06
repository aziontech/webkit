<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationSurface',
    inheritAttrs: false
  })

  /** `filled` is a raised panel that holds other parts; `outline` is a bare frame. */
  export type IllustrationSurfaceKind = 'filled' | 'outline'

  /** Corner treatment. A square frame reads as scaffolding; a rounded one as a real panel. */
  export type IllustrationSurfaceShape = 'rounded' | 'square'

  interface Props {
    /** Whether the panel carries a fill or is an outline only. */
    kind?: IllustrationSurfaceKind
    /** Corner treatment. */
    shape?: IllustrationSurfaceShape
    /** Lights the edge with the brand rim; inherits the scene emphasis when omitted. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'filled',
    shape: 'rounded',
    active: undefined
  })

  defineSlots<{
    /** Parts the panel holds. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  // A panel is sized by what it holds or by the scene that places it, so it takes no `size`.
  const { size, active } = useIllustrationContext(
    () => undefined,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-surface'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // The plainest part in the system: a rectangle with an edge. It is what everything that is
  // not a box, a window or a pill is made of — the tray behind a pair of gauges, the ghost
  // frames a scene is arranged against.
  //
  // Both kinds carry the rim light, by two different routes, because neither route covers both.
  //
  // A `filled` panel uses the three-layer stack every other part uses: its own opaque fill is
  // what hides the ramp from the interior, and that follows `border-radius` for free.
  //
  // An `outline` has no fill to hide behind, so it paints the ramp with `border-image`, which
  // renders only in the border box. `border-image` ignores `border-radius` — which is exactly
  // why an outline is `square` by default here, and why a `rounded` outline falls back to the
  // flat hairline rather than silently losing its corners. (The `mask-composite: exclude` trick
  // would cover both, but it did not composite reliably in the target browsers.)
  const ROOT_CLASS =
    'block shrink-0 border-[length:var(--illustration-rim-width-hairline)] border-solid border-[var(--border-default)] transition-colors duration-150 ease-out motion-reduce:transition-none data-[shape=square]:rounded-none data-[shape=rounded]:data-[kind=filled]:rounded-[var(--illustration-shape-medium)] data-[shape=rounded]:data-[kind=outline]:rounded-[var(--illustration-shape-small)] data-[kind=filled]:border-transparent data-[kind=filled]:bg-[var(--bg-surface-raised)] data-[kind=filled]:[background-image:var(--illustration-rim-layers)] data-[kind=filled]:[background-origin:var(--illustration-rim-boxes)] data-[kind=filled]:[background-clip:var(--illustration-rim-boxes)] data-[kind=filled]:data-[active]:[background-image:var(--illustration-rim-layers-active)] data-[kind=outline]:bg-transparent data-[shape=square]:data-[kind=outline]:[border-image:var(--illustration-rim)_1] data-[shape=square]:data-[kind=outline]:data-[active]:[border-image:var(--illustration-rim-active)_1] data-[kind=outline]:data-[active]:border-[var(--primary)]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <span
    :data-testid="testId"
    :data-kind="kind"
    :data-shape="shape"
    :data-size="size"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <slot />
  </span>
</template>
