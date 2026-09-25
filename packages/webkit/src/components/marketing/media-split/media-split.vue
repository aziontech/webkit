<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import Overline from '../../overline/overline.vue'
  import TextureMaterial, {
    type TextureMaterialFade,
    type TextureMaterialKind,
    type TextureMaterialSize
  } from '../texture-material/texture-material.vue'

  defineOptions({
    name: 'MediaSplit',
    inheritAttrs: false
  })

  /** Which side of the band the media occupies from `lg` up. */
  export type MediaSplitKind = 'media-end' | 'media-start'
  /** The cells' fill. */
  export type MediaSplitFill = 'canvas' | 'surface'
  /** Level of the band's headline element. */
  export type MediaSplitHeadingLevel = 2 | 3

  interface Props {
    /** Headline of the band, rendered as its `h2`. */
    title: string
    /** Supporting paragraph under the headline; overridden by the default slot. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** URL of the band's image; ignored when the `media` slot is filled. */
    src?: string
    /** Alternative text describing what the image shows. */
    alt?: string
    /** Which side the media sits on from `lg` up; `media-end` puts the copy first. */
    kind?: MediaSplitKind
    /** The cells' fill. `canvas` lets the band sit in the page column; `surface` lifts it onto its own plate. */
    fill?: MediaSplitFill
    /** Draw the band's own registration frame. Turn it off when the page already wraps the band in a frame. */
    framed?: boolean
    /** Level of the band's headline element. Drop it to 3 when the band is a sub-band of a section a section-title has already opened with its h2, so the document outline stays in order. */
    headingLevel?: MediaSplitHeadingLevel
    /** Texture the media half is grounded with; `none` leaves the cell bare. */
    texture?: TextureMaterialKind
    /** Pitch of the ground's tiling — how far apart its cells sit. */
    textureSize?: TextureMaterialSize
    /** How the ground fades out before the cell's edges. */
    textureFade?: TextureMaterialFade
    /** Inset the media from the cell's edges. An exported asset carries its own air and runs flush; a screenshot or a composed panel wants the inset. */
    mediaPadded?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    description: '',
    eyebrow: '',
    src: '',
    alt: '',
    kind: 'media-end',
    fill: 'canvas',
    framed: false,
    headingLevel: 2,
    texture: 'grid',
    textureSize: 'medium',
    textureFade: 'vignette',
    mediaPadded: false
  })

  const slots = defineSlots<{
    /** Description body; replaces the `description` prop when provided. */
    default?(): unknown
    /** Further copy-column content under the description — an inventory, a list of surfaces — inside the paragraph's own measure. */
    content?(): unknown
    /** The band's media; replaces the image built from `src`. */
    media?(): unknown
    /**
     * Optional controls under the copy, floored so consecutive bands align on them. The
     * band's action pattern is small buttons: `kind="secondary"` for the action itself, and
     * `kind="outlined"` for a second one beside it.
     */
    actions?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-media-split'
  )

  const hasMedia = computed<boolean>(() => Boolean(slots.media) || props.src.length > 0)

  const hasDescription = computed<boolean>(
    () => Boolean(slots.default) || props.description.length > 0
  )

  const frame = computed(() => (props.framed ? FrameBox : 'div'))
  const frameProps = computed(() =>
    props.framed ? { flush: true, borders: 'y', marks: 'bottom' } : {}
  )
</script>

<template>
  <section
    v-bind="$attrs"
    class="group/split"
    :data-testid="testId"
    :data-kind="kind"
    :data-fill="fill"
    :data-media="hasMedia || null"
    :data-media-padded="mediaPadded || null"
    :aria-label="title"
  >
    <component
      :is="frame"
      v-bind="frameProps"
    >
      <!-- The seam is the grid's own gap over the rule fill, so neither cell draws a border
           and the hairline lands in the same place whichever side the media is on. -->
      <div
        :data-testid="`${testId}__cells`"
        class="grid gap-px bg-(--border-default) group-data-[media]/split:lg:grid-cols-2"
      >
        <div
          class="flex flex-col justify-between gap-(--spacing-xxl) p-(--spacing-xl) group-data-[fill=canvas]/split:bg-(--bg-canvas) group-data-[fill=surface]/split:bg-(--bg-surface) group-data-[kind=media-start]/split:lg:order-last"
        >
          <div class="flex flex-col gap-(--spacing-lg)">
            <Overline
              v-if="eyebrow"
              prefix="//"
              show-cursor
              >{{ eyebrow }}</Overline
            >

            <component
              :is="`h${headingLevel}`"
              class="m-0 text-balance text-heading-md text-(--text-default)"
            >
              {{ title }}
            </component>

            <p
              v-if="hasDescription"
              class="m-0 text-pretty text-body-md text-(--text-muted)"
            >
              <slot>{{ description }}</slot>
            </p>

            <slot name="content" />
          </div>

          <div
            v-if="slots.actions"
            class="flex flex-wrap items-center gap-(--spacing-sm)"
          >
            <slot name="actions" />
          </div>
        </div>

        <!-- The ground under the media, painted by the band rather than by the call site: the
             texture fades out before the cell's edges, so the seam and the frame stay the only
             hard lines. A call site quiets it further with `--texture-ink`, inherited from this
             root; an asset takes no padding, so the ground reaches the media's own air. -->
        <div
          v-if="hasMedia"
          class="relative flex min-w-0 items-center justify-center overflow-hidden group-data-[media-padded]/split:p-(--spacing-xl) group-data-[fill=canvas]/split:bg-(--bg-canvas) group-data-[fill=surface]/split:bg-(--bg-surface)"
        >
          <TextureMaterial
            :kind="texture"
            :size="textureSize"
            :fade="textureFade"
          />

          <div class="relative z-10 flex w-full min-w-0 items-center justify-center self-stretch">
            <slot name="media">
              <img
                v-if="src"
                :src="src"
                :alt="alt"
                :aria-hidden="alt ? undefined : 'true'"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover"
              />
            </slot>
          </div>
        </div>
      </div>
    </component>
  </section>
</template>
