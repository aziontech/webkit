<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import MarqueeLoop from '../../marketing/marquee/marquee-loop.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'PhotoMarqueeSection',
    inheritAttrs: false
  })

  /** Width the description is capped at: `narrow` or `wide`. */
  export type PhotoMarqueeSectionDescriptionWidth = 'narrow' | 'wide'

  /** One photograph in the strip, in order. */
  export type PhotoMarqueeSectionPhoto = {
    /** Address of the image file. */
    src: string
    /** Text alternative of the photograph, read once. */
    alt: string
    /** Intrinsic width of the image in pixels, used to reserve its slot. */
    width: number
    /** Intrinsic height of the image in pixels, used to reserve its slot. */
    height: number
  }

  export interface PhotoMarqueeSectionProps {
    /** Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Paragraph beside the headline. */
    description?: string
    /** Width the description is capped at: `narrow` or `wide`. */
    descriptionWidth?: PhotoMarqueeSectionDescriptionWidth
    /** Accessible name of the scrolling region. */
    ariaLabel?: string
    /** Seconds one loop of the strip takes; `0` paces it at ten seconds per photo. */
    duration?: number
    /** The photographs, in order; each is `{ src, alt, width, height }`. */
    photos?: PhotoMarqueeSectionPhoto[]
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<PhotoMarqueeSectionProps>(), {
    title: '',
    description: '',
    descriptionWidth: 'narrow',
    ariaLabel: '',
    duration: 0,
    photos: () => [],
    anchor: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'photo-marquee-section'
  )

  const hasPhotos = computed(() => props.photos.length > 0)

  const loopDuration = computed(() =>
    props.duration > 0 ? props.duration : props.photos.length * 10
  )
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :label="title"
    :filled="hasPhotos"
    align="split"
    :title="title"
    :description="description"
    :description-width="descriptionWidth"
    marks="bottom"
  >
    <MarqueeLoop
      v-slot="{ copy, duplicate }"
      :duration="loopDuration"
      :aria-label="ariaLabel"
    >
      <ul
        :data-duplicate="duplicate || null"
        :aria-hidden="duplicate ? 'true' : undefined"
        class="m-0 flex shrink-0 list-none items-end gap-(--spacing-md) p-0 pe-(--spacing-md) motion-reduce:data-[duplicate]:hidden"
      >
        <li
          v-for="photo in photos"
          :key="photo.src + copy"
          :style="{ aspectRatio: `${photo.width} / ${photo.height}` }"
          class="h-80 shrink-0 overflow-hidden sm:h-112"
        >
          <img
            :src="photo.src"
            :alt="duplicate ? '' : photo.alt"
            :width="photo.width"
            :height="photo.height"
            draggable="false"
            decoding="async"
            class="size-full object-cover"
          />
        </li>
      </ul>
    </MarqueeLoop>
  </SectionBand>
</template>
