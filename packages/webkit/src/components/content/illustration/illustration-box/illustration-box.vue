<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'
  import type { IllustrationSize } from '../injection-key'

  defineOptions({
    name: 'IllustrationBox',
    inheritAttrs: false
  })

  /** Corner treatment. A square box reads as scaffolding; a rounded one as a real surface. */
  export type IllustrationBoxShape = 'rounded' | 'square'

  interface Props {
    /** Scale of the box; inherits the scene scale when omitted. */
    size?: IllustrationSize
    /** Corner treatment. */
    shape?: IllustrationBoxShape
    /** Lights the box with the brand rim; inherits the scene emphasis when omitted. */
    active?: boolean
    /** Icon class pair from the icon library, e.g. 'ai ai-edge-application'. */
    icon?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: undefined,
    shape: 'rounded',
    active: undefined,
    icon: ''
  })

  defineSlots<{
    /** Replaces the glyph; falls back to `icon`. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const { size, active } = useIllustrationContext(
    () => props.size,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-box'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  const ROOT_CLASS =
    'data-[shape=square]:rounded-none relative inline-flex shrink-0 items-center justify-center border-solid border-transparent text-[var(--text-default)] shadow-[var(--shadow-sm)] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)] transition-[background-image] duration-150 ease-out motion-reduce:transition-none data-[active]:[background-image:var(--illustration-rim-layers-active)] data-[size=small]:size-8 data-[shape=rounded]:data-[size=small]:rounded-[var(--illustration-shape-small)] data-[size=small]:border-[length:var(--illustration-rim-width-hairline)] data-[size=small]:text-[length:var(--size-4)] data-[size=medium]:size-16 data-[shape=rounded]:data-[size=medium]:rounded-[var(--illustration-shape-medium)] data-[size=medium]:border-[length:var(--illustration-rim-width)] data-[size=medium]:text-[length:var(--size-8)] data-[size=large]:size-32 data-[shape=rounded]:data-[size=large]:rounded-[var(--illustration-shape-large)] data-[size=large]:border-[length:var(--illustration-rim-width)] data-[size=large]:text-[length:var(--size-12)]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <span
    :data-testid="testId"
    :data-size="size"
    :data-shape="shape"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <slot>
      <i
        v-if="icon"
        aria-hidden="true"
        :class="icon"
        class="leading-none"
      />
    </slot>
  </span>
</template>
