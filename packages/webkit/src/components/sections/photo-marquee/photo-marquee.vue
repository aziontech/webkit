<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import TickerLoop from '../../marketing/ticker/ticker-loop.vue'

  defineOptions({
    name: 'PhotoMarquee',
    inheritAttrs: false
  })

  /** Width the description is capped at: `narrow` or `wide`. */
  export type PhotoMarqueeDescriptionWidth = 'narrow' | 'wide'

  /** One photograph in the strip, in order. */
  export type PhotoMarqueePhoto = {
    /** Address of the image file. */
    src: string
    /** Text alternative of the photograph, read once. */
    alt: string
    /** Intrinsic width of the image in pixels, used to reserve its slot. */
    width: number
    /** Intrinsic height of the image in pixels, used to reserve its slot. */
    height: number
  }

  interface Props {
    /** Headline of the band, rendered by the horizontal section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Paragraph beside the headline. */
    description?: string
    /** Width the description is capped at: `narrow` or `wide`. */
    descriptionWidth?: PhotoMarqueeDescriptionWidth
    /** Accessible name of the scrolling region. */
    ariaLabel?: string
    /** Seconds one loop of the strip takes; `0` paces it at ten seconds per photo. */
    duration?: number
    /** The photographs, in order; each is `{ src, alt, width, height }`. */
    photos?: PhotoMarqueePhoto[]
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
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
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-photo-marquee'
  )

  const hasPhotos = computed(() => props.photos.length > 0)

  const loopDuration = computed(() =>
    props.duration > 0 ? props.duration : props.photos.length * 10
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
  >
    <SectionModule
      v-if="hasPhotos"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <SectionTitle
          kind="horizontal"
          :title="title"
          :description="description"
          :description-width="descriptionWidth"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <TickerLoop
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
        </TickerLoop>
      </FrameBox>
    </SectionModule>
  </section>
</template>
