<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationBranch',
    inheritAttrs: false
  })

  export type IllustrationBranchKind = 'solid' | 'dashed'

  export type IllustrationBranchDirection = 'up' | 'down'

  interface Props {
    /** Stroke style of the line. */
    kind?: IllustrationBranchKind
    /** Whether the tributary leaves the trunk upward or downward. */
    direction?: IllustrationBranchDirection
    /** Draws the branch in the brand color; inherits the scene emphasis when omitted. */
    active?: boolean
    /** Draws the branch in the accent color — the one branch that is somewhere else entirely. */
    accent?: boolean
    /** Marches the dashes to suggest flow; only meaningful when `kind` is `dashed`. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'solid',
    direction: 'up',
    active: undefined,
    accent: false,
    animated: false
  })

  const attrs = useAttrs()

  // A branch spans the gap between a trunk and a label, so its box comes from the scene.
  const { size, active } = useIllustrationContext(
    () => undefined,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-branch'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // A cubic with horizontal tangents at both ends, so the tributary leaves the trunk and meets
  // its label flat — the shape a branch diagram reads as. The viewBox is a unit square stretched
  // to the box (`preserveAspectRatio="none"`) so one curve serves every span; `non-scaling-stroke`
  // keeps the hairline and the dash pattern uniform under that stretch.
  const path = computed(() =>
    props.direction === 'up' ? 'M0 100 C50 100 50 0 100 0' : 'M0 0 C50 0 50 100 100 100'
  )

  const dashArray = computed(() => (props.kind === 'dashed' ? '2 2' : undefined))

  const ROOT_CLASS =
    'group/branch block shrink-0 overflow-visible data-[size=small]:[--illustration-connector-length:1.5rem] data-[size=medium]:[--illustration-connector-length:3rem] data-[size=large]:[--illustration-connector-length:6rem] h-[var(--illustration-connector-length)] w-[var(--illustration-connector-length)]'

  const PATH_CLASS =
    'fill-none stroke-[var(--border-default)] [stroke-width:var(--illustration-rim-width-hairline)] [vector-effect:non-scaling-stroke] transition-colors duration-150 ease-out motion-reduce:transition-none group-data-[active]/branch:stroke-[var(--primary)] group-data-[accent]/branch:stroke-[var(--accent)] group-data-[animated]/branch:motion-safe:animate-flow-dash motion-reduce:animate-none'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <svg
    aria-hidden="true"
    focusable="false"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-direction="direction"
    :data-active="active || null"
    :data-accent="accent || null"
    :data-animated="(animated && kind === 'dashed') || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <path
      :d="path"
      :stroke-dasharray="dashArray"
      :class="PATH_CLASS"
    />
  </svg>
</template>
