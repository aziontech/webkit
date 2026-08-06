<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'

  defineOptions({
    name: 'IllustrationNode',
    inheritAttrs: false
  })

  export type IllustrationNodeKind = 'solid' | 'dashed'

  /** How loudly the junction reads. `strong` marks a structural corner rather than a hop. */
  export type IllustrationNodeEmphasis = 'default' | 'strong'

  interface Props {
    /** Edge style of the junction. */
    kind?: IllustrationNodeKind
    /** How loudly the junction reads against the scene. */
    emphasis?: IllustrationNodeEmphasis
    /** Lights the node with the selected border; inherits the scene emphasis when omitted. */
    active?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'solid',
    emphasis: 'default',
    active: undefined
  })

  const attrs = useAttrs()

  const { active } = useIllustrationContext(
    () => undefined,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-node'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // A node is a joint, not a scaled part: it stays 8px at every scene size. It uses a real
  // border rather than the rim light, because a dashed edge cannot be painted as a background.
  const ROOT_CLASS =
    'block size-2 shrink-0 rounded-[var(--illustration-shape-node)] border-[length:var(--illustration-rim-width-hairline)] border-[var(--border-default)] bg-[var(--bg-surface)] transition-colors duration-150 ease-out motion-reduce:transition-none data-[kind=solid]:border-solid data-[kind=dashed]:border-dashed data-[emphasis=strong]:border-[var(--border-strong)] data-[active]:border-[var(--border-selected)]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <span
    :data-testid="testId"
    :data-kind="kind"
    :data-emphasis="emphasis"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  />
</template>
