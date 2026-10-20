<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import { computed, nextTick, onMounted, onScopeDispose, ref, useId, watch } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import SectionAction from './SectionAction.vue'

  defineOptions({ name: 'ArticleHighlight' })

  export interface ArticleHighlightItem {
    /** Stable key of the article. */
    key: string
    /** Destination of the article. */
    href: string
    /** Cover image URL. */
    image: string
    /** Overline above the title: category and date. */
    meta: string
    /** The article's headline. */
    title: string
    /** The article's deck. */
    description: string
    /** Read time under the deck. */
    readTime: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** The highlight articles in wall order; the first is selected on load. */
    items: ArticleHighlightItem[]
    /** Label of the selected article's action. */
    actionLabel?: string
    /** Accessible name of the wall of titles. */
    ariaLabel?: string
    /** Milliseconds each article is held before the band advances. */
    interval?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    actionLabel: 'Read article',
    ariaLabel: 'Highlight articles',
    interval: 6000
  })

  const TICK_MS = 100
  const baseId = useId()
  const panelId = `${baseId}-panel`
  const tabId = (index: number) => `${baseId}-tab-${index}`

  const { follow } = useSiteLink()

  const selected = ref(0)
  const direction = ref<'forward' | 'back'>('forward')
  const elapsed = ref(0)
  const pointerInside = ref(false)
  const focusInside = ref(false)
  const reducedMotion = ref(false)
  const tabs: Array<HTMLElement | null> = []
  let pendingDirection: 'forward' | 'back' | null = null
  let ticker: ReturnType<typeof globalThis.setInterval> | null = null
  let motionQuery: globalThis.MediaQueryList | null = null

  const current = computed(() => props.items[selected.value])
  const autoPlay = computed(() => props.items.length > 1 && !reducedMotion.value)
  const running = computed(() => autoPlay.value && !pointerInside.value && !focusInside.value)
  const progress = computed(() => Math.min(100, (elapsed.value / props.interval) * 100))

  watch(selected, (next, previous) => {
    direction.value = pendingDirection ?? (next > previous ? 'forward' : 'back')
    pendingDirection = null
    elapsed.value = 0
  })
  watch(running, (on) => (on ? start() : stop()))

  const syncMotion = () => (reducedMotion.value = Boolean(motionQuery?.matches))

  onMounted(() => {
    motionQuery = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)') ?? null
    syncMotion()
    motionQuery?.addEventListener('change', syncMotion)
    if (running.value) start()
  })

  onScopeDispose(() => {
    stop()
    motionQuery?.removeEventListener('change', syncMotion)
  })

  function start() {
    stop()
    ticker = globalThis.setInterval(tick, TICK_MS)
  }

  function stop() {
    if (ticker === null) return
    globalThis.clearInterval(ticker)
    ticker = null
  }

  function tick() {
    elapsed.value += TICK_MS
    if (elapsed.value < props.interval) return
    pendingDirection = 'forward'
    select((selected.value + 1) % props.items.length)
  }

  function select(index: number) {
    elapsed.value = 0
    selected.value = index
  }

  function onTabClick(index: number) {
    pointerInside.value = false
    select(index)
  }

  function onFocusIn(event: globalThis.FocusEvent) {
    focusInside.value = (event.target as HTMLElement).matches(':focus-visible')
  }

  async function onKeydown(event: globalThis.KeyboardEvent) {
    const last = props.items.length - 1
    const keys: Record<string, [number, 'forward' | 'back' | null]> = {
      ArrowRight: [selected.value >= last ? 0 : selected.value + 1, 'forward'],
      ArrowLeft: [selected.value <= 0 ? last : selected.value - 1, 'back'],
      Home: [0, null],
      End: [last, null]
    }
    const entry = keys[event.key]
    if (!entry) return
    event.preventDefault()
    const [next, way] = entry
    if (next !== selected.value) {
      pendingDirection = way
      select(next)
    }
    await nextTick()
    tabs[next]?.focus()
  }
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
    class="scroll-mt-(--spacing-xxl)"
  >
    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <div
        v-if="current"
        :data-autoplay="running || null"
        class="flex flex-col"
        @pointerenter="pointerInside = true"
        @pointerleave="pointerInside = false"
        @focusin="onFocusIn"
        @focusout="focusInside = false"
      >
        <FrameBox
          :id="panelId"
          borders="bottom"
          marks="all"
          role="tabpanel"
          :aria-labelledby="tabId(selected)"
          :data-direction="direction"
          class="group/panel relative bg-(--bg-canvas)"
        >
          <div class="grid *:col-start-1 *:row-start-1">
            <div
              aria-hidden="true"
              inert
              class="pointer-events-none grid opacity-0 *:col-start-1 *:row-start-1"
            >
              <div
                v-for="item in items"
                :key="item.key"
                class="grid lg:grid-cols-2"
              >
                <span class="block aspect-video lg:aspect-4/3" />
                <div class="flex flex-col gap-(--spacing-sm) p-(--spacing-xl) lg:p-(--spacing-xxl)">
                  <span class="text-overline-sm">{{ item.meta }}</span>
                  <span class="text-heading-lg">{{ item.title }}</span>
                  <span class="line-clamp-3 text-body-md">{{ item.description }}</span>
                  <span class="text-body-sm">{{ item.readTime }}</span>
                  <span class="h-10" />
                </div>
              </div>
            </div>

            <Transition
              mode="out-in"
              enter-active-class="transition-[translate,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none motion-reduce:duration-0"
              enter-from-class="opacity-0 group-data-[direction=forward]/panel:translate-x-(--spacing-xl) group-data-[direction=back]/panel:-translate-x-(--spacing-xl) motion-reduce:translate-x-0"
              leave-active-class="pointer-events-none transition-[translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none motion-reduce:duration-0"
              leave-to-class="opacity-0 group-data-[direction=forward]/panel:-translate-x-(--spacing-xl) group-data-[direction=back]/panel:translate-x-(--spacing-xl) motion-reduce:translate-x-0"
            >
              <article
                :key="current.key"
                class="group/article relative grid min-w-0 lg:grid-cols-2"
              >
                <div
                  class="block aspect-video overflow-hidden border-b border-(--border-default) bg-(--bg-surface) lg:aspect-4/3 lg:border-r lg:border-b-0"
                >
                  <img
                    :src="current.image"
                    alt=""
                    decoding="async"
                    class="size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/article:scale-105 motion-reduce:transition-none"
                  />
                </div>
                <div
                  class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) p-(--spacing-xl) transition-colors duration-fast-02 ease-productive-entrance group-hover/article:bg-(--bg-surface-raised) motion-reduce:transition-none lg:p-(--spacing-xxl)"
                >
                  <span class="text-overline-sm text-(--text-muted)">{{ current.meta }}</span>
                  <h2 class="m-0 text-balance text-heading-lg text-(--text-default)">
                    <a
                      :href="current.href"
                      class="text-inherit no-underline after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                      @click="follow($event, current.href)"
                    >
                      {{ current.title }}
                    </a>
                  </h2>
                  <p class="m-0 line-clamp-3 text-pretty text-body-md text-(--text-muted)">
                    {{ current.description }}
                  </p>
                  <span class="text-body-sm text-(--text-muted)">{{ current.readTime }}</span>
                  <SectionAction
                    :action="{ label: actionLabel, href: current.href, trailing: true }"
                    class="relative mt-(--spacing-sm) self-start"
                  />
                </div>
              </article>
            </Transition>
          </div>

          <span
            v-if="autoPlay"
            aria-hidden="true"
            :style="{ width: `${progress}%` }"
            class="absolute bottom-0 left-0 h-px bg-(--primary) transition-[width] duration-fast-01 ease-linear motion-reduce:transition-none"
          />
        </FrameBox>

        <CardGrid
          kind="frame"
          flush
          :columns="3"
          :mobile-columns="1"
          role="tablist"
          :aria-label="ariaLabel"
          class="sm:grid-cols-2! lg:grid-cols-5!"
          @keydown="onKeydown"
        >
          <CardGridCell
            v-for="(item, index) in items"
            :key="item.key"
            kind="canvas"
            :padded="false"
            role="presentation"
          >
            <button
              :id="tabId(index)"
              :ref="(element) => (tabs[index] = element as HTMLElement | null)"
              type="button"
              role="tab"
              :aria-selected="selected === index ? 'true' : 'false'"
              :aria-controls="panelId"
              :tabindex="selected === index ? 0 : -1"
              :data-active="selected === index || null"
              class="relative isolate flex h-full w-full cursor-pointer flex-col items-start gap-(--spacing-xs) p-(--spacing-lg) text-left transition-colors duration-moderate-01 ease-out before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-fast-02 before:ease-productive-entrance before:content-[''] hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) data-[active]:bg-(--bg-selected) data-[active]:before:hidden motion-reduce:transition-none motion-reduce:before:transition-none"
              @click="onTabClick(index)"
            >
              <span class="text-overline-sm text-(--text-muted)">{{ item.meta }}</span>
              <span class="line-clamp-3 text-balance text-heading-xxs text-(--text-default)">
                {{ item.title }}
              </span>
            </button>
          </CardGridCell>
        </CardGrid>
      </div>
    </FrameBox>
  </SectionModule>
</template>
