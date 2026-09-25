<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'

  defineOptions({
    name: 'MediaTile',
    inheritAttrs: false
  })

  /** Register of the tile. */
  export type MediaTileKind = 'frame' | 'plain'

  interface Props {
    /** Register of the tile: frame draws the page's frame around the media alone, plain draws no rules and makes the tile itself the cell a divider grid separates. */
    kind?: MediaTileKind
    /** The caption's run-in lead, naming what the panel above it shows. */
    title: string
    /** The sentence continuing the caption after the lead; overridden by the default slot. */
    description?: string
    /** URL of the tile's media image; ignored when the `media` slot is filled. */
    src?: string
    /** Alternative text describing what the image shows; empty keeps it decorative. */
    alt?: string
    /** Inset the media — inside the frame in the `frame` register, from the cell's edges in `plain`. Turn it off for an asset that should run to the cell's edges; the caption keeps its own inset either way. */
    padded?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'frame',
    description: '',
    src: '',
    alt: '',
    padded: true
  })

  const slots = defineSlots<{
    /** The caption body after the lead; replaces the `description` prop. */
    default?(): unknown
    /** The scene the frame holds; replaces the `src` image. */
    media?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-media-tile'
  )

  const hasMedia = computed<boolean>(() => Boolean(slots.media) || props.src.length > 0)

  const hasDescription = computed<boolean>(
    () => Boolean(slots.default) || props.description.length > 0
  )
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-media="hasMedia || null"
    :data-described="hasDescription || null"
    :data-padded="padded || null"
    class="m-0 flex h-full flex-col gap-(--spacing-lg) data-[kind=plain]:bg-(--bg-canvas)"
  >
    <component
      :is="kind === 'frame' ? FrameBox : 'div'"
      :data-testid="`${testId}__frame`"
      :data-kind="kind"
      :data-padded="padded || null"
      class="overflow-hidden data-[kind=frame]:min-h-64 data-[kind=plain]:min-h-32 [--illustration-fill:var(--bg-canvas)] data-[kind=frame]:bg-(--bg-canvas) data-[kind=frame]:data-[padded]:p-(--spacing-xl) data-[kind=plain]:data-[padded]:px-(--spacing-lg) data-[kind=plain]:data-[padded]:pt-(--spacing-lg)"
    >
      <div class="flex h-full w-full items-center justify-center">
        <slot name="media">
          <img
            v-if="src"
            :src="src"
            :alt="alt"
            :aria-hidden="alt ? undefined : 'true'"
            loading="lazy"
            decoding="async"
            class="max-h-full w-full object-contain"
          />
        </slot>
      </div>
    </component>

    <figcaption
      :data-kind="kind"
      class="m-0 text-pretty text-body-md text-(--text-muted) data-[kind=plain]:px-(--spacing-lg) data-[kind=plain]:pb-(--spacing-lg)"
    >
      <strong class="font-medium text-(--text-default)">{{ title }}</strong>
      <template v-if="hasDescription"
        >{{ ' ' }}<slot>{{ description }}</slot></template
      >
    </figcaption>
  </figure>
</template>
