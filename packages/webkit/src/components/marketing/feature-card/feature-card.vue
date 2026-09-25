<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Overline from '../../overline/overline.vue'

  defineOptions({
    name: 'FeatureCard',
    inheritAttrs: false
  })

  interface Props {
    /** Headline of the tile, rendered as its `h3`. */
    title: string
    /** One sentence explaining the headline; overridden by the default slot. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** PrimeIcons class for the glyph above the copy. */
    icon?: string
    /** When set, the whole tile renders as an anchor link to this URL. */
    href?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    eyebrow: '',
    icon: '',
    href: ''
  })

  const slots = defineSlots<{
    /** Description body; replaces the `description` prop when provided. */
    default?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-feature-card'
  )

  const isLink = computed<boolean>(() => props.href.length > 0)

  const hasDescription = computed<boolean>(
    () => Boolean(slots.default) || props.description.length > 0
  )
</script>

<template>
  <component
    :is="isLink ? 'a' : 'article'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :data-testid="testId"
    :data-linked="isLink || null"
    class="flex h-full flex-col gap-(--spacing-sm) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) p-(--spacing-lg) transition-colors duration-150 ease-out motion-reduce:transition-none data-[linked]:hover:bg-(--bg-hover) data-[linked]:focus-visible:ring-2 data-[linked]:focus-visible:ring-(--ring-color) data-[linked]:focus-visible:ring-offset-2 data-[linked]:focus-visible:ring-offset-(--bg-canvas)"
  >
    <i
      v-if="icon"
      :class="icon"
      class="text-heading-sm text-(--primary)"
      aria-hidden="true"
    />
    <Overline
      v-if="eyebrow"
      prefix="//"
      show-cursor
      >{{ eyebrow }}</Overline
    >
    <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">{{ title }}</h3>
    <p
      v-if="hasDescription"
      class="m-0 text-pretty text-body-sm text-(--text-muted)"
    >
      <slot>{{ description }}</slot>
    </p>
  </component>
</template>
