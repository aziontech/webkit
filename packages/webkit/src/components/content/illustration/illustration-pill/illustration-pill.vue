<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useIllustrationContext } from '../composables/use-illustration-context'
  import type { IllustrationSize } from '../injection-key'

  defineOptions({
    name: 'IllustrationPill',
    inheritAttrs: false
  })

  interface Props {
    /** Scale of the capsule; inherits the scene scale when omitted. */
    size?: IllustrationSize
    /** Lights the capsule with the brand rim; inherits the scene emphasis when omitted. */
    active?: boolean
    /** Icon class pair from the icon library, e.g. 'ai ai-real-time-metrics'. */
    icon?: string
    /** Label text; the default slot overrides it. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    size: undefined,
    active: undefined,
    icon: '',
    label: ''
  })

  defineSlots<{
    /** Replaces the label text; falls back to `label`. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const { size, active } = useIllustrationContext(
    () => props.size,
    () => props.active
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-illustration-pill'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }
    delete rest.class
    delete rest['data-testid']
    return rest
  })

  // The glyph inherits the label's font-size (the icon font renders at 1em), so it always
  // matches the label instead of needing a size of its own per step.
  const ROOT_CLASS =
    'inline-flex w-fit shrink-0 items-center whitespace-nowrap border-solid border-transparent text-overline-sm text-[var(--text-default)] shadow-[var(--shadow-sm)] [background-image:var(--illustration-rim-layers)] [background-origin:var(--illustration-rim-boxes)] [background-clip:var(--illustration-rim-boxes)] transition-[background-image] duration-150 ease-out motion-reduce:transition-none data-[active]:[background-image:var(--illustration-rim-layers-active)] data-[size=small]:gap-[var(--spacing-xxs)] data-[size=small]:rounded-[var(--shape-elements)] data-[size=small]:border-[length:var(--illustration-rim-width-hairline)] data-[size=small]:px-[var(--spacing-xs)] data-[size=small]:py-[var(--spacing-xxs)] data-[size=small]:text-[length:var(--illustration-label-small)] data-[size=medium]:gap-[var(--spacing-xxs)] data-[size=medium]:rounded-[var(--shape-elements)] data-[size=medium]:border-[length:var(--illustration-rim-width-hairline)] data-[size=medium]:px-[var(--spacing-xs)] data-[size=medium]:py-[var(--spacing-xxs)] data-[size=large]:gap-[var(--spacing-xxs)] data-[size=large]:rounded-[var(--shape-card)] data-[size=large]:border-[length:var(--illustration-rim-width)] data-[size=large]:p-[var(--spacing-xs)]'

  const rootClass = computed(() => cn(ROOT_CLASS, attrs.class as string | undefined))
</script>

<template>
  <span
    :data-testid="testId"
    :data-size="size"
    :data-active="active || null"
    :class="rootClass"
    v-bind="passthroughAttrs"
  >
    <i
      v-if="icon"
      aria-hidden="true"
      :class="icon"
      class="leading-none"
    />
    <span :data-testid="`${testId}__label`">
      <slot>{{ label }}</slot>
    </span>
  </span>
</template>
