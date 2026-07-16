<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import BrandDefault from '../../../svg/azion/default/default.vue'
  import BrandReduced from '../../../svg/azion/min/min.vue'
  import BrandExtended from '../../../svg/azion/technologies/technologies.vue'

  export type BrandKind = 'default' | 'reduced' | 'extended'

  export type BrandSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'Brand',
    inheritAttrs: false
  })

  interface Props {
    /** Brand lockup to render: `default` (AZION wordmark), `reduced` (the "A" glyph for tight spaces), `extended` (wordmark with the "move to the edge technologies" tagline). */
    kind?: BrandKind
    /** Size token; sets the lockup height (16 / 24 / 32 px) while width scales automatically so each `kind` keeps its own aspect ratio. */
    size?: BrandSize
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'default',
    size: 'medium'
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-brand')

  const asset = computed(() => {
    if (props.kind === 'reduced') return BrandReduced
    if (props.kind === 'extended') return BrandExtended
    return BrandDefault
  })
</script>

<template>
  <span
    role="img"
    aria-label="Azion"
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
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
