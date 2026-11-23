<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, watch } from 'vue'

  import { resolveDirection } from '../../../composables/use-direction'
  import { useLocale } from '../../../composables/use-locale/use-locale'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Dialog from '../../overlay/dialog/dialog.vue'
  import DialogContent from '../../overlay/dialog/dialog-content.vue'
  import DialogDescription from '../../overlay/dialog/dialog-description.vue'
  import DialogTitle from '../../overlay/dialog/dialog-title.vue'
  import PanelBody from '../../overlay/panel/panel-body.vue'
  import PanelFooter from '../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../overlay/panel/panel-header.vue'
  import { imageFileName, type ImageGalleryItem, imageSource } from './lib/image-source'

  export type { ImageGalleryItem } from './lib/image-source'

  defineOptions({
    name: 'ImageGallery',
    inheritAttrs: false
  })

  export interface ImageGalleryProps {
    /** Images to show, each from a URL (`src`) or base64 `data` with its `mimeType`. */
    items?: ImageGalleryItem[]
    /** Images are still generating: placeholders fill the grid after the images already in `items`, up to `expectedCount`. */
    loading?: boolean
    /** Number of images expected while `loading`; the grid shows a placeholder for each one not in `items` yet. */
    expectedCount?: number
    /** Why the images could not load or generate. Set, the gallery shows the error state in place of the grid, with this text under its title. */
    error?: string
  }

  const props = withDefaults(defineProps<ImageGalleryProps>(), {
    items: () => [],
    loading: false,
    expectedCount: 1,
    error: ''
  })

  const emit = defineEmits<{
    /** Download in the viewer was pressed for `item`; call `preventDefault()` to download it another way. */
    download: [event: MouseEvent, item: ImageGalleryItem]
  }>()

  const attrs = useAttrs()
  const { t, formatNumber } = useLocale({ imageGallery: en.imageGallery })

  const open = ref(false)
  const activeIndex = ref(0)
  const brokenSources = ref<ReadonlySet<string>>(new Set())
  const announcement = ref<'' | 'loading' | 'ready'>('')
  const footerEl = ref<HTMLElement | null>(null)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'image-gallery'
  )

  const tiles = computed(() =>
    props.items.map((item, index) => {
      const source = imageSource(item)
      const position = index + 1
      return {
        item,
        key: item.key || `image-${position}`,
        source,
        alt: item.alt || '',
        fileName: imageFileName(item, position),
        position
      }
    })
  )

  const total = computed(() => tiles.value.length)

  const placeholderCount = computed(() =>
    props.loading ? Math.max(0, Math.floor(props.expectedCount) - total.value) : 0
  )

  const tileCount = computed(() => total.value + placeholderCount.value)

  const layout = computed(() =>
    tileCount.value === 1 ? 'single' : tileCount.value === 2 ? 'pair' : 'grid'
  )

  const empty = computed(() => !props.error && tileCount.value === 0)

  const active = computed(() => tiles.value[activeIndex.value])

  const statusText = computed(() =>
    announcement.value === 'loading'
      ? t('imageGallery.loading')
      : announcement.value === 'ready'
        ? t('imageGallery.ready')
        : ''
  )

  function nameOf(alt: string, position: number): string {
    return (
      alt ||
      t('imageGallery.image', {
        position: formatNumber(position),
        total: formatNumber(total.value)
      })
    )
  }

  function isBroken(source: string): boolean {
    return !source || brokenSources.value.has(source)
  }

  function markBroken(source: string) {
    brokenSources.value = new Set([...brokenSources.value, source])
  }

  function show(index: number) {
    activeIndex.value = index
    open.value = true
  }

  async function go(index: number, from?: 'previous' | 'next') {
    activeIndex.value = Math.min(Math.max(index, 0), total.value - 1)
    if (!from) return
    await nextTick()
    const used = footerEl.value?.querySelector<HTMLButtonElement>(`[data-slot="${from}"]`)
    if (!used?.disabled) return
    const other = from === 'next' ? 'previous' : 'next'
    footerEl.value?.querySelector<HTMLButtonElement>(`[data-slot="${other}"]`)?.focus()
  }

  function onViewerKeydown(event: KeyboardEvent) {
    const rtl = resolveDirection(event.currentTarget as Element) === 'rtl'
    const step =
      event.key === 'ArrowRight' ? (rtl ? -1 : 1) : event.key === 'ArrowLeft' ? (rtl ? 1 : -1) : 0
    if (step) {
      event.preventDefault()
      go(activeIndex.value + step)
    } else if (event.key === 'Home') {
      event.preventDefault()
      go(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      go(total.value - 1)
    }
  }

  function onDownload(event: MouseEvent) {
    if (active.value) emit('download', event, active.value.item)
  }

  watch(
    () => props.loading,
    (loading, wasLoading) => {
      announcement.value = loading ? 'loading' : wasLoading && total.value > 0 ? 'ready' : ''
    },
    { immediate: true }
  )

  watch(total, (count) => {
    if (count === 0) open.value = false
    else if (activeIndex.value > count - 1) activeIndex.value = count - 1
  })

  const ITEM_CLASS =
    'relative flex aspect-square w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-0 ' +
    'transition-colors duration-150 ease-out motion-reduce:transition-none hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 ' +
    'focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'in-data-[layout=single]:aspect-auto in-data-[layout=single]:data-[broken]:aspect-square'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-layout="layout"
    :data-loading="loading || null"
    :data-error="error ? '' : null"
    :data-empty="empty ? '' : null"
    :aria-busy="loading || undefined"
    class="@container/image-gallery flex min-w-0 flex-col"
  >
    <p
      role="status"
      class="sr-only"
      :data-testid="`${testId}__status`"
    >
      {{ statusText }}
    </p>
    <div
      role="alert"
      :data-testid="`${testId}__alert`"
    >
      <EmptyState
        v-if="error"
        :data-testid="`${testId}__error`"
        :title="t('imageGallery.error')"
        :description="error"
        icon="az az-triangle-alert"
        size="small"
      />
    </div>
    <EmptyState
      v-if="empty"
      :data-testid="`${testId}__empty`"
      :title="t('imageGallery.empty')"
      icon="az az-image"
      size="small"
    />
    <ul
      v-else-if="!error"
      :data-layout="layout"
      :aria-label="t('imageGallery.label')"
      class="m-0 grid w-full list-none grid-cols-2 gap-(--spacing-xs) p-0 data-[layout=single]:max-w-(--container-xs) data-[layout=single]:grid-cols-1 @md/image-gallery:data-[layout=grid]:grid-cols-3"
    >
      <li
        v-for="(tile, index) in tiles"
        :key="tile.key"
        class="min-w-0"
      >
        <button
          type="button"
          aria-haspopup="dialog"
          :data-testid="`${testId}__item`"
          :data-broken="isBroken(tile.source) ? '' : null"
          :class="ITEM_CLASS"
          @click="show(index)"
        >
          <template v-if="isBroken(tile.source)">
            <i
              class="az az-image text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="sr-only">{{ nameOf(tile.alt, tile.position) }}</span>
          </template>
          <img
            v-else
            :src="tile.source"
            :alt="nameOf(tile.alt, tile.position)"
            loading="lazy"
            decoding="async"
            class="block size-full object-contain in-data-[layout=single]:h-auto"
            @error="markBroken(tile.source)"
          />
        </button>
      </li>
      <li
        v-for="placeholder in placeholderCount"
        :key="`placeholder-${placeholder}`"
        aria-hidden="true"
        :data-testid="`${testId}__placeholder`"
        class="aspect-square min-w-0 overflow-hidden rounded-(--shape-card)"
      >
        <Skeleton
          width="100%"
          height="100%"
        />
      </li>
    </ul>

    <Dialog
      v-model:open="open"
      size="large"
      :data-testid="`${testId}__viewer`"
    >
      <DialogContent @keydown="onViewerKeydown">
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DialogTitle>
              <bdi>{{ active ? nameOf(active.alt, active.position) : '' }}</bdi>
            </DialogTitle>
            <DialogDescription
              v-if="total > 1"
              aria-live="polite"
              :data-testid="`${testId}__position`"
            >
              {{
                t('imageGallery.position', {
                  position: formatNumber(activeIndex + 1),
                  total: formatNumber(total)
                })
              }}
            </DialogDescription>
          </div>
        </PanelHeader>
        <PanelBody>
          <EmptyState
            v-if="active && isBroken(active.source)"
            :data-testid="`${testId}__broken`"
            data-broken=""
            :title="t('imageGallery.broken')"
            icon="az az-image"
            size="small"
          />
          <div
            v-else-if="active"
            class="flex items-center justify-center"
          >
            <img
              :key="active.key"
              :data-testid="`${testId}__image`"
              :src="active.source"
              :alt="nameOf(active.alt, active.position)"
              decoding="async"
              class="block max-h-[60dvh] max-w-full rounded-(--shape-card) object-contain"
              @error="markBroken(active.source)"
            />
          </div>
        </PanelBody>
        <PanelFooter class="flex-row items-center justify-between max-sm:*:flex-none">
          <div
            ref="footerEl"
            class="flex items-center gap-(--spacing-xs)"
          >
            <template v-if="total > 1">
              <IconButton
                data-slot="previous"
                :data-testid="`${testId}__previous`"
                icon="az az-chevron-left"
                :aria-label="t('imageGallery.previous')"
                variant="outline"
                :disabled="activeIndex === 0"
                @click="go(activeIndex - 1, 'previous')"
              />
              <IconButton
                data-slot="next"
                :data-testid="`${testId}__next`"
                icon="az az-chevron-right"
                :aria-label="t('imageGallery.next')"
                variant="outline"
                :disabled="activeIndex === total - 1"
                @click="go(activeIndex + 1, 'next')"
              />
            </template>
          </div>
          <Button
            v-if="active"
            :data-testid="`${testId}__download`"
            :href="active.source"
            :download="active.fileName"
            :label="t('imageGallery.download')"
            icon="az az-download"
            variant="outline"
            @click="onDownload"
          />
        </PanelFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
