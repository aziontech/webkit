<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'

  defineOptions({
    name: 'MediaTile',
    inheritAttrs: false
  })

  /** Register of the tile. */
  export type MediaTileVariant = 'frame' | 'plain'

  export interface MediaTileProps {
    /** Register of the tile: frame draws the page's frame around the media alone, plain draws no rules and makes the tile itself the cell a divider grid separates. */
    variant?: MediaTileVariant
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
    /** Stretch the media to the frame's full width with its aspect ratio locked, so it grows and shrinks with the tile; off, slotted media keeps its own size, centred. */
    fluid?: boolean
    /** Scale of the media inside its frame, around its centre. The frame keeps its size and clips whatever grows past it, so a scene drawn small on its canvas can be fitted to the tile without changing the band's rhythm. */
    mediaScale?: number
  }

  const props = withDefaults(defineProps<MediaTileProps>(), {
    variant: 'frame',
    description: '',
    src: '',
    alt: '',
    padded: true,
    fluid: false,
    mediaScale: 1
  })

  const slots = defineSlots<{
    /** The caption body after the lead; replaces the `description` prop. */
    default?(): unknown
    /** The scene the frame holds; replaces the `src` image. */
    media?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'media-tile')

  const hasMedia = () => Boolean(slots.media) || props.src.length > 0

  const hasDescription = () => Boolean(slots.default) || props.description.length > 0

  const mediaStyle = computed(() =>
    props.mediaScale === 1 ? undefined : { scale: String(props.mediaScale) }
  )
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :data-media="hasMedia() || null"
    :data-described="hasDescription() || null"
    :data-padded="padded || null"
    class="m-0 flex h-full flex-col gap-(--spacing-lg) data-[variant=plain]:bg-(--bg-canvas)"
  >
    <component
      :is="variant === 'frame' ? RegistrationFrame : 'div'"
      :data-testid="`${testId}__frame`"
      :data-variant="variant"
      :data-padded="padded || null"
      class="overflow-hidden data-[variant=frame]:min-h-64 data-[variant=plain]:min-h-32 [--console-mockup-fill:var(--bg-canvas)] data-[variant=frame]:bg-(--bg-canvas) data-[variant=frame]:data-[padded]:p-(--spacing-xl) data-[variant=plain]:data-[padded]:px-(--spacing-lg) data-[variant=plain]:data-[padded]:pt-(--spacing-lg)"
    >
      <div
        :data-testid="`${testId}__media`"
        :data-fluid="fluid || null"
        :style="mediaStyle"
        class="flex h-full w-full items-center justify-center data-[fluid]:*:h-auto data-[fluid]:*:w-full"
      >
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
      :data-variant="variant"
      class="m-0 text-pretty text-body-md text-(--text-muted) data-[variant=plain]:px-(--spacing-lg) data-[variant=plain]:pb-(--spacing-lg)"
    >
      <strong class="font-medium text-(--text-default)">{{ title }}</strong>
      <template v-if="hasDescription()"
        >{{ ' ' }}<slot>{{ description }}</slot></template
      >
    </figcaption>
  </figure>
</template>
