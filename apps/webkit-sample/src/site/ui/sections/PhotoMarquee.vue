<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  defineOptions({ name: 'PhotoMarquee' })

  export interface MarqueePhoto {
    /** Image URL. */
    src: string
    /** Alternative text. */
    alt: string
    /** Intrinsic width, in pixels; sets the slide's aspect ratio. */
    width: number
    /** Intrinsic height, in pixels; sets the slide's aspect ratio. */
    height: number
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** The band's headline. */
    title: string
    /** The paragraph beside the headline. */
    description?: string
    /** Photos the band loops through, in order. */
    photos: MarqueePhoto[]
    /** Accessible name of the photo row. */
    ariaLabel?: string
    /** Seconds one full pass of the row takes. */
    duration?: number
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    description: '',
    ariaLabel: '',
    duration: 90
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        kind="horizontal"
        :title="title"
        :description="description"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div
        class="group/loop overflow-hidden motion-reduce:overflow-x-auto"
        role="region"
        :aria-label="ariaLabel || title"
      >
        <div
          :style="{ animationDuration: `${duration}s` }"
          class="flex w-max animate-brand-marquee group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
        >
          <ul
            v-for="copy in 2"
            :key="copy"
            :aria-hidden="copy > 1 ? 'true' : undefined"
            :data-duplicate="copy > 1 || null"
            class="m-0 flex shrink-0 list-none items-end gap-(--spacing-md) p-0 pr-(--spacing-md) motion-reduce:data-[duplicate]:hidden"
          >
            <li
              v-for="photo in photos"
              :key="`${copy}-${photo.src}`"
              class="h-80 shrink-0 overflow-hidden sm:h-112"
              :style="{ aspectRatio: `${photo.width} / ${photo.height}` }"
            >
              <img
                :src="photo.src"
                :alt="copy > 1 ? '' : photo.alt"
                :width="photo.width"
                :height="photo.height"
                draggable="false"
                decoding="async"
                class="size-full object-cover"
              />
            </li>
          </ul>
        </div>
      </div>
    </FrameBox>
  </SectionModule>
</template>
