<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import BrandDefault from '../../../svg/azion/default/default.vue'
  import BrandReduced from '../../../svg/azion/min/min.vue'
  import BrandExtended from '../../../svg/azion/technologies/technologies.vue'

  export type BrandVariant = 'default' | 'reduced' | 'extended'

  export type BrandSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'Brand',
    inheritAttrs: false
  })

  export interface BrandProps {
    /** Brand lockup to render: `default` (AZION wordmark), `reduced` (the "A" glyph for tight spaces), `extended` (wordmark with the "move to the edge technologies" tagline). */
    variant?: BrandVariant
    /** Size token; sets the lockup height (16 / 24 / 32 px) while width scales automatically so each `variant` keeps its own aspect ratio. */
    size?: BrandSize
    /** Hides the mark from assistive tech when visible text beside it already says Azion. */
    decorative?: boolean
  }

  const props = withDefaults(defineProps<BrandProps>(), {
    variant: 'default',
    size: 'medium',
    decorative: false
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'brand')

  const asset = computed(() => {
    if (props.variant === 'reduced') return BrandReduced
    if (props.variant === 'extended') return BrandExtended
    return BrandDefault
  })
</script>

<template>
  <span
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : 'Azion'"
    :aria-hidden="decorative ? 'true' : undefined"
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :data-size="size"
    :class="attrs.class"
    class="inline-flex items-center [&>svg]:w-auto [&[data-size=small]>svg]:h-4 [&[data-size=medium]>svg]:h-6 [&[data-size=large]>svg]:h-8"
  >
    <component
      :is="asset"
      aria-hidden="true"
    />
  </span>
</template>
