<script setup lang="ts">
  import { useIntervalFn, useMediaQuery, useMounted } from '@vueuse/core'
  import { computed, nextTick, ref, useAttrs, useId, watch } from 'vue'

  import { eventDirection, logicalArrowKey } from '../../../composables/use-direction'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import Button from '../../action/button/button.vue'
  import IconButton from '../../action/icon-button/icon-button.vue'
  import type { CardGridColumns } from '../../layout/card-grid/card-grid.vue'
  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'ArticleHighlightSection',
    inheritAttrs: false
  })

  /** One highlight article, a title on the wall and the panel while selected. */
  export type ArticleHighlightSectionItem = {
    /** Stable identity of the article within the band. */
    key: string
    /** Destination of the article. */
    href: string
    /** URL of the cover. */
    image: string
    /** URL of a cover cropped for the panel; wins over image. */
    highlightImage?: string
    /** Eyebrow, usually the category and the date. */
    meta: string
    /** Headline of the article. */
    title: string
    /** Deck under the headline, clamped to three lines. */
    description: string
    /** Read time shown under the deck. */
    readTime: string
  }

  export interface ArticleHighlightSectionProps {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /**
     * The highlight articles in wall order, the one at the bound index (the first by default) selected on
     * load; each is `{ key, href, image, highlightImage?, meta, title, description, readTime }`.
     */
    items?: ArticleHighlightSectionItem[]
    /** Label of the button into the selected article; the button is omitted when empty. */
    actionLabel?: string
    /** Accessible name of the wall of titles. */
    ariaLabel?: string
    /** Advances to the next article every `autoplayInterval`, with a visible pause control, pausing under hover and keyboard focus; off under reduced motion and with one article. */
    autoplay?: boolean
    /** Milliseconds each article is held before the band advances. */
    autoplayInterval?: number
    /** From `lg` up, the band fills the first viewport under the sticky site header. */
    fill?: boolean
  }

  const props = withDefaults(defineProps<ArticleHighlightSectionProps>(), {
    anchor: '',
    items: () => [],
    actionLabel: '',
    ariaLabel: '',
    autoplay: false,
    autoplayInterval: 6000,
    fill: false
  })

  /** Index of the selected article, bound with v-model; left unbound the band starts on the first article. */
  const model = defineModel<number>({ default: 0 })

  const attrs = useAttrs()

  const baseId = useId()

  const wallEl = ref<HTMLElement | null>(null)

  const TICK_MS = 100

  const direction = ref<'forward' | 'back'>('forward')

  const elapsed = ref(0)

  const pointerInside = ref(false)

  const focusInside = ref(false)

  let pendingDirection: 'forward' | 'back' | null = null

  const mounted = useMounted()

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'article-highlight-section'
  )

  const selected = computed(() =>
    Math.min(Math.max(Math.trunc(model.value) || 0, 0), Math.max(props.items.length - 1, 0))
  )

  const current = computed(() => props.items[selected.value] ?? props.items[0])

  const panelId = computed(() => `${baseId}-panel`)

  const wallColumns = computed<CardGridColumns>(() => {
    const count = props.items.length
    if (count >= 5) return 5
    return count === 4 ? 4 : 3
  })

  const autoplaying = computed(
    () => mounted.value && props.autoplay && props.items.length > 1 && !reducedMotion.value
  )

  const paused = ref(false)
  const { t } = useTranslate({ common: en.common })
  const pauseLabel = computed(() =>
    paused.value ? t('common.resumeRotation') : t('common.pauseRotation')
  )

  const running = computed(
    () => autoplaying.value && !paused.value && !pointerInside.value && !focusInside.value
  )

  const progress = computed(() =>
    Math.min(100, (elapsed.value / Math.max(props.autoplayInterval, TICK_MS)) * 100)
  )

  const tabId = (index: number): string => `${baseId}-tab-${index}`

  const select = (index: number): void => {
    elapsed.value = 0
    model.value = index
  }

  const { pause, resume } = useIntervalFn(
    () => {
      elapsed.value += TICK_MS
      if (elapsed.value < props.autoplayInterval) return
      pendingDirection = 'forward'
      select((selected.value + 1) % props.items.length)
    },
    TICK_MS,
    { immediate: false }
  )

  watch(
    running,
    (on) => {
      if (on) resume()
      else pause()
    },
    { immediate: true }
  )

  watch(selected, (next, previous) => {
    direction.value = pendingDirection ?? (next > previous ? 'forward' : 'back')
    pendingDirection = null
    elapsed.value = 0
  })

  const onFocusin = (event: FocusEvent): void => {
    focusInside.value = (event.target as Element | null)?.matches(':focus-visible') ?? false
  }

  const onFocusout = (): void => {
    focusInside.value = false
  }

  const focusTab = async (index: number): Promise<void> => {
    const count = props.items.length
    const next = ((index % count) + count) % count
    select(next)
    await nextTick()
    wallEl.value?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
  }

  const onKeydown = (event: KeyboardEvent, index: number): void => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: props.items.length - 1
    }
    const key = logicalArrowKey(event.key, eventDirection(event))
    const target = moves[key]
    if (target === undefined) return
    event.preventDefault()
    if (key === 'ArrowRight' || key === 'ArrowDown') pendingDirection = 'forward'
    if (key === 'ArrowLeft' || key === 'ArrowUp') pendingDirection = 'back'
    void focusTab(target)
  }

  const ARTICLE_ENTER_FROM_CLASS =
    'opacity-0 ' +
    'group-data-[direction=forward]/panel:translate-x-(--spacing-xl) group-data-[direction=back]/panel:-translate-x-(--spacing-xl) ' +
    'rtl:group-data-[direction=forward]/panel:-translate-x-(--spacing-xl) rtl:group-data-[direction=back]/panel:translate-x-(--spacing-xl) motion-reduce:translate-x-0'

  const ARTICLE_LEAVE_TO_CLASS =
    'opacity-0 ' +
    'group-data-[direction=forward]/panel:-translate-x-(--spacing-xl) group-data-[direction=back]/panel:translate-x-(--spacing-xl) ' +
    'rtl:group-data-[direction=forward]/panel:translate-x-(--spacing-xl) rtl:group-data-[direction=back]/panel:-translate-x-(--spacing-xl) motion-reduce:translate-x-0'

  const ARTICLE_MEDIA_CLASS =
    'relative block aspect-video overflow-hidden border-b border-(--border-default) bg-(--bg-canvas) ' +
    'lg:aspect-4/3 lg:group-data-[fill]/highlight:aspect-auto lg:border-e lg:border-b-0'

  const ARTICLE_COPY_CLASS =
    'flex min-w-0 flex-col justify-center gap-(--spacing-sm) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance ' +
    'group-hover/article:bg-(--bg-surface-raised) motion-reduce:transition-none lg:p-(--spacing-2xl) lg:[@media(max-height:50rem)]:group-data-[fill]/highlight:py-(--spacing-lg)'

  const ARTICLE_TITLE_LINK_CLASS =
    "text-inherit no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset " +
    'focus-visible:after:ring-(--ring-color)'

  const TAB_CLASS =
    'relative isolate flex h-full w-full cursor-pointer flex-col items-start gap-(--spacing-xs) p-(--spacing-lg) text-start transition-colors duration-moderate-01 ease-out ' +
    'before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-fast-02 ' +
    "before:ease-productive-entrance before:content-[''] hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset " +
    'focus-visible:ring-(--ring-color) ' +
    'data-[active]:bg-(--bg-selected) data-[active]:before:hidden ' +
    'motion-reduce:transition-none motion-reduce:before:transition-none'
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :filled="Boolean(current)"
  >
    <div
      :data-autoplay="running || null"
      :data-paused="(autoplaying && paused) || null"
      :data-fill="fill || null"
      class="group/highlight relative flex flex-col lg:data-[fill]:h-[calc(100dvh-var(--layout-header-height)-var(--spacing-2xl)*2)]"
      @pointerenter="pointerInside = true"
      @pointerleave="pointerInside = false"
      @focusin="onFocusin"
      @focusout="onFocusout"
    >
      <IconButton
        v-if="autoplaying"
        :icon="paused ? 'az az-play' : 'az az-pause'"
        :aria-label="pauseLabel"
        variant="outline"
        size="small"
        class="absolute end-(--spacing-xs) top-(--spacing-xs) z-20"
        @click="paused = !paused"
      />
      <RegistrationFrame
        :id="panelId"
        borders="bottom"
        marks="all"
        role="tabpanel"
        :aria-labelledby="tabId(selected)"
        :data-direction="direction"
        class="group/panel relative bg-(--bg-canvas) lg:group-data-[fill]/highlight:min-h-0 lg:group-data-[fill]/highlight:flex-1"
      >
        <div class="grid *:col-start-1 *:row-start-1 lg:group-data-[fill]/highlight:h-full">
          <div
            aria-hidden="true"
            inert
            class="pointer-events-none grid min-w-0 opacity-0 *:col-start-1 *:row-start-1"
          >
            <div
              v-for="item in items"
              :key="item.key"
              class="grid min-w-0 lg:grid-cols-2"
            >
              <span
                class="block min-w-0 aspect-video lg:aspect-4/3 lg:group-data-[fill]/highlight:aspect-auto"
              />
              <div
                class="flex flex-col gap-(--spacing-sm) p-(--spacing-xl) lg:p-(--spacing-2xl) lg:[@media(max-height:50rem)]:group-data-[fill]/highlight:py-(--spacing-lg)"
              >
                <span class="text-overline-sm">{{ item.meta }}</span>
                <span class="text-heading-lg">{{ item.title }}</span>
                <span
                  class="line-clamp-3 text-body-md lg:[@media(max-height:50rem)]:group-data-[fill]/highlight:hidden"
                  >{{ item.description }}</span
                >
                <span class="text-body-sm">{{ item.readTime }}</span>
                <span class="h-10" />
              </div>
            </div>
          </div>

          <Transition
            mode="out-in"
            enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
            :enter-from-class="ARTICLE_ENTER_FROM_CLASS"
            leave-active-class="pointer-events-none transition-[translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
            :leave-to-class="ARTICLE_LEAVE_TO_CLASS"
          >
            <article
              :key="current.key"
              class="group/article relative grid min-w-0 lg:grid-cols-2"
            >
              <div :class="ARTICLE_MEDIA_CLASS">
                <img
                  :src="current.highlightImage || current.image"
                  alt=""
                  decoding="async"
                  class="absolute inset-0 size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/article:scale-105 motion-reduce:transition-none"
                />
              </div>
              <div :class="ARTICLE_COPY_CLASS">
                <span class="text-overline-sm text-(--text-muted)">{{ current.meta }}</span>
                <h2 class="m-0 text-balance text-heading-lg text-(--text-default)">
                  <a
                    :href="safeHref(current.href) ?? undefined"
                    :class="ARTICLE_TITLE_LINK_CLASS"
                  >
                    {{ current.title }}
                  </a>
                </h2>
                <p
                  class="m-0 line-clamp-3 text-pretty text-body-md text-(--text-muted) lg:[@media(max-height:50rem)]:group-data-[fill]/highlight:hidden"
                >
                  {{ current.description }}
                </p>
                <span class="text-body-sm text-(--text-muted)">{{ current.readTime }}</span>
                <Button
                  v-if="actionLabel"
                  :label="actionLabel"
                  variant="secondary"
                  size="large"
                  :href="current.href"
                  icon="az az-chevron-right"
                  icon-position="trailing"
                  animated
                  class="relative mt-(--spacing-sm) self-start"
                />
              </div>
            </article>
          </Transition>
        </div>

        <span
          v-if="autoplaying"
          aria-hidden="true"
          :data-testid="`${testId}__progress`"
          :style="{ width: `${progress}%` }"
          class="absolute bottom-0 start-0 h-px bg-(--primary) transition-[width] duration-fast-01 ease-linear motion-reduce:transition-none"
        />
      </RegistrationFrame>

      <div ref="wallEl">
        <CardGrid
          variant="frame"
          flush
          :columns="wallColumns"
          :mobile-columns="1"
          role="tablist"
          :aria-label="ariaLabel || undefined"
        >
          <CardGridCell
            v-for="(item, index) in items"
            :key="item.key"
            variant="canvas"
            :padded="false"
            role="presentation"
          >
            <button
              :id="tabId(index)"
              type="button"
              role="tab"
              :aria-selected="index === selected ? 'true' : 'false'"
              :aria-controls="panelId"
              :tabindex="index === selected ? 0 : -1"
              :data-active="index === selected || undefined"
              :class="TAB_CLASS"
              @click="select(index)"
              @keydown="onKeydown($event, index)"
            >
              <span class="text-overline-sm text-(--text-muted)">{{ item.meta }}</span>
              <span class="line-clamp-2 text-balance text-heading-2xs text-(--text-default)">
                {{ item.title }}
              </span>
            </button>
          </CardGridCell>
        </CardGrid>
      </div>
    </div>
  </SectionBand>
</template>
