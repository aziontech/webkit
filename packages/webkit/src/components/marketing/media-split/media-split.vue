<script setup lang="ts">
  import { computed, inject, onMounted, onScopeDispose, onUpdated, ref, useAttrs } from 'vue'

  import { safeHref } from '../../../utils/safe-href'
  import Eyebrow from '../../content/eyebrow/eyebrow.vue'
  import Texture, {
    type TextureFade,
    type TextureSize,
    type TextureVariant
  } from '../../content/texture/texture.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import { SplitStackInjectionKey } from '../../layout/split-stack/injection-key'

  defineOptions({
    name: 'MediaSplit',
    inheritAttrs: false
  })

  /** Which end of the band the media occupies. */
  export type MediaSplitVariant = 'media-end' | 'media-start'
  /** Axis the band splits on. */
  export type MediaSplitOrientation = 'horizontal' | 'vertical'
  /** The cells' fill. */
  export type MediaSplitFill = 'canvas' | 'surface'
  /** Level of the band's headline element. */
  export type MediaSplitHeadingLevel = 2 | 3
  /** Where the copy sits down its cell. */
  export type MediaSplitAlign = 'start' | 'center'
  /** Type scale of the copy. */
  export type MediaSplitSize = 'medium' | 'large'

  export interface MediaSplitProps {
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
    /** Which end the media sits on: the closing cell once the band splits, or the lower one when the band is vertical. `media-end` puts the copy first. */
    variant?: MediaSplitVariant
    /** Axis the band splits on. `horizontal` sets the cells side by side once the band is 60rem wide; `vertical` holds them stacked at every width. */
    orientation?: MediaSplitOrientation
    /** The copy cell's fill. `canvas` lets the band sit in the page column; `surface` lifts it onto its own plate. The media cell follows `mediaFill`. */
    fill?: MediaSplitFill
    /** The media cell's fill. `surface` sets the asset on its own plate, one step off the page; `canvas` lets the whole band sit on the page. */
    mediaFill?: MediaSplitFill
    /**
     * Draw the band's own registration frame: its top and bottom rules, with the copy and the media framed
     * as two cells, each with its four marks. Turn it off when the page already wraps the band in a frame.
     */
    framed?: boolean
    /** Draw the seam between the copy and the media. Turn it off for a band whose two halves should read as one plate. */
    divided?: boolean
    /** Level of the band's headline element. Drop it to 3 when the band is a sub-band of a section a module-header has already opened with its h2, so the document outline stays in order. */
    headingLevel?: MediaSplitHeadingLevel
    /** Texture the media half is grounded with; `none` leaves the cell bare. */
    texture?: TextureVariant
    /** Pitch of the ground's tiling — how far apart its cells sit. */
    textureSize?: TextureSize
    /** How the ground fades out before the cell's edges. */
    textureFade?: TextureFade
    /** Inset the media from the cell's edges. An exported asset carries its own air and runs flush; a screenshot or a composed panel wants the inset. */
    mediaPadded?: boolean
    /**
     * URL the band links to. With it set the media cell is one link named by the band's title, a click
     * anywhere else on the band follows it, and hovering the band reveals the chevron affordance and the
     * hover state of its link actions.
     */
    mediaHref?: string
    /**
     * Where the copy sits down its cell. `start` holds the copy at the cell's top and floors the actions
     * so consecutive bands align on them; `center` gathers the copy and its actions into one block on the
     * cell's vertical middle.
     */
    align?: MediaSplitAlign
    /**
     * Type scale and air of the copy. `medium` sets the headline at heading-md for a band beside other
     * content; `large` sets it at heading-xl with a larger description and pads the copy cell a step
     * wider, for a band that carries only its headline and actions.
     */
    size?: MediaSplitSize
  }

  const props = withDefaults(defineProps<MediaSplitProps>(), {
    description: '',
    eyebrow: '',
    src: '',
    alt: '',
    variant: 'media-end',
    orientation: 'horizontal',
    fill: 'canvas',
    mediaFill: 'surface',
    framed: false,
    divided: true,
    headingLevel: 2,
    texture: 'grid',
    textureSize: 'medium',
    textureFade: 'vignette',
    mediaPadded: false,
    mediaHref: '',
    align: 'start',
    size: 'medium'
  })

  const slots = defineSlots<{
    /** Description body; replaces the `description` prop when provided. */
    default?(): unknown
    /** Further copy-column content under the description — an inventory, a list of surfaces — inside the paragraph's own measure. */
    content?(): unknown
    /** The band's media; replaces the image built from `src`. */
    media?(): unknown
    /**
     * Optional controls under the copy, floored so consecutive bands align on them. Small
     * buttons: `variant="secondary"` for the action, `variant="outline"` for a second beside it,
     * `icon="az az-chevron-right"` + `icon-position="trailing"` + `animated` when it leaves the page.
     */
    actions?(): unknown
  }>()

  const attrs = useAttrs()
  const stack = inject(SplitStackInjectionKey, null)

  const rootEl = ref<globalThis.HTMLElement | null>(null)
  const actionsEl = ref<globalThis.HTMLElement | null>(null)
  const actionRepeatsMedia = ref(false)

  const EYEBROW_PREFIX = '//' as const

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'media-split')

  const hasMedia = () => Boolean(slots.media) || props.src.length > 0

  const hasDescription = () => Boolean(slots.default) || props.description.length > 0

  const mediaLink = computed<string | null>(() => safeHref(props.mediaHref))
  const isMediaLink = computed<boolean>(() => mediaLink.value !== null)

  const frame = computed(() => (props.framed ? RegistrationFrame : 'div'))
  const frameProps = computed(() =>
    props.framed ? { flush: true, borders: 'y', marks: 'none' } : {}
  )

  const framesCells = computed<boolean>(() => props.framed || Boolean(stack?.framesCells))
  const cellFrame = computed(() => (framesCells.value ? RegistrationFrame : 'div'))
  const cellFrameProps = computed(() =>
    framesCells.value ? { borders: 'none', marks: 'all' } : {}
  )

  onMounted(() => {
    rootEl.value?.addEventListener('click', followBand)
    syncActionRepeatsMedia()
  })
  onUpdated(syncActionRepeatsMedia)
  onScopeDispose(() => rootEl.value?.removeEventListener('click', followBand))

  function syncActionRepeatsMedia() {
    const href = mediaLink.value
    const links = actionsEl.value?.querySelectorAll<globalThis.HTMLAnchorElement>('a[href]') ?? []
    const target = href ? new globalThis.URL(href, globalThis.location.href).href : ''
    actionRepeatsMedia.value = target !== '' && [...links].some((link) => link.href === target)
  }

  function followBand(event: MouseEvent) {
    const href = mediaLink.value
    if (!href || event.defaultPrevented) return
    if ((event.target as globalThis.Element).closest('a, button, input, select, textarea, label'))
      return
    if (globalThis.getSelection()?.toString()) return
    if (event.metaKey || event.ctrlKey) {
      globalThis.open(href, '_blank', 'noopener')
      return
    }
    globalThis.location.assign(href)
  }

  const CELLS_CLASS =
    'grid h-full ' +
    'group-data-[divided]/split:gap-px group-data-[divided]/split:bg-(--border-default) ' +
    'group-data-[media]/split:data-[orientation=horizontal]:@min-[60rem]/media-split:grid-cols-2'

  const COPY_CLASS =
    'flex h-full flex-col justify-between gap-(--spacing-2xl) p-(--spacing-xl) ' +
    'group-data-[size=large]/split:p-(--spacing-2xl) ' +
    'group-data-[media]/split:group-data-[orientation=horizontal]/split:group-data-[size=large]/split:@min-[60rem]/media-split:@max-[72rem]/media-split:p-(--spacing-xl) ' +
    'group-data-[fill=canvas]/split:bg-(--bg-canvas) group-data-[fill=surface]/split:bg-(--bg-surface) ' +
    'group-data-[align=center]/split:justify-center'

  const ACTIONS_CLASS =
    'flex flex-wrap items-center gap-(--spacing-sm) ' +
    'group-data-[media-href]/split:group-hover/split:[&>a]:before:opacity-100 group-data-[media-href]/split:group-active/split:[&>a]:after:opacity-100 ' +
    'group-data-[media-href]/split:group-hover/split:[&>a_[data-animated]]:translate-x-0.5'

  const MEDIA_CLASS =
    'group/media relative flex h-full min-w-0 items-center justify-center overflow-hidden ' +
    'group-data-[media-fill=surface]/split:bg-(--bg-surface) group-data-[media-fill=canvas]/split:bg-(--bg-canvas) ' +
    'group-data-[media-padded]/split:p-(--spacing-xl) ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset'

  const MEDIA_AFFORDANCE_CLASS =
    'pointer-events-none absolute end-(--spacing-xl) bottom-(--spacing-xl) z-20 inline-flex h-7 min-w-7 translate-x-1 items-center justify-center rounded-(--shape-button) ' +
    'bg-(--secondary) px-(--spacing-xs) text-button-md text-(--secondary-foreground) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance ' +
    'group-hover/split:translate-x-0 group-hover/split:opacity-100 group-focus-visible/media:translate-x-0 group-focus-visible/media:opacity-100 rtl:-translate-x-1 ' +
    'rtl:group-hover/split:translate-x-0 rtl:group-focus-visible/media:translate-x-0 motion-reduce:transition-none'
</script>

<template>
  <section
    ref="rootEl"
    v-bind="$attrs"
    class="group/split @container/media-split data-[media-href]:cursor-pointer"
    :data-testid="testId"
    :data-variant="variant"
    :data-orientation="orientation"
    :data-fill="fill"
    :data-media-fill="mediaFill"
    :data-size="size"
    :data-media="hasMedia() || null"
    :data-divided="divided || null"
    :data-media-padded="mediaPadded || null"
    :data-media-href="isMediaLink || null"
    :data-align="align"
    :aria-label="title"
  >
    <component
      :is="frame"
      v-bind="frameProps"
      class="h-full"
    >
      <div
        :data-testid="`${testId}__cells`"
        :data-orientation="orientation"
        :class="CELLS_CLASS"
      >
        <component
          :is="cellFrame"
          v-bind="cellFrameProps"
          :data-testid="`${testId}__copy-cell`"
          :data-orientation="orientation"
          class="min-w-0 group-data-[variant=media-start]/split:@min-[60rem]/media-split:order-last group-data-[variant=media-start]/split:data-[orientation=vertical]:order-last"
        >
          <div :class="COPY_CLASS">
            <div
              class="flex max-w-(--container-md) flex-col gap-(--spacing-lg) group-data-[size=large]/split:max-w-(--container-lg)"
            >
              <Eyebrow
                v-if="eyebrow"
                :prefix="EYEBROW_PREFIX"
                cursor
                >{{ eyebrow }}</Eyebrow
              >

              <component
                :is="`h${headingLevel}`"
                class="m-0 text-balance text-(--text-default) group-data-[size=medium]/split:text-heading-md group-data-[size=large]/split:text-heading-xl"
              >
                {{ title }}
              </component>

              <p
                v-if="hasDescription()"
                class="m-0 text-pretty text-(--text-muted) group-data-[size=medium]/split:text-body-md group-data-[size=medium]/split:max-sm:text-body-sm group-data-[size=large]/split:text-body-lg"
              >
                <slot>{{ description }}</slot>
              </p>

              <slot name="content" />
            </div>

            <div
              v-if="slots.actions"
              ref="actionsEl"
              :class="ACTIONS_CLASS"
            >
              <slot name="actions" />
            </div>
          </div>
        </component>

        <component
          :is="cellFrame"
          v-if="hasMedia()"
          v-bind="cellFrameProps"
          :data-testid="`${testId}__media-cell`"
          class="min-w-0"
        >
          <component
            :is="isMediaLink ? 'a' : 'div'"
            :href="mediaLink ?? undefined"
            :aria-label="isMediaLink ? title : undefined"
            :tabindex="isMediaLink && actionRepeatsMedia ? -1 : undefined"
            :data-testid="`${testId}__media`"
            :class="MEDIA_CLASS"
          >
            <Texture
              :variant="texture"
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

            <span
              v-if="isMediaLink"
              aria-hidden="true"
              :data-testid="`${testId}__media-affordance`"
              :class="MEDIA_AFFORDANCE_CLASS"
            >
              <i class="az az-chevron-right text-[length:inherit] leading-none rtl:-scale-x-100" />
            </span>
          </component>
        </component>
      </div>
    </component>
  </section>
</template>
