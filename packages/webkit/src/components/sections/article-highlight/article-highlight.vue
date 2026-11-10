<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'ArticleHighlight',
    inheritAttrs: false
  })

  /** One highlight article, a title on the wall and the panel while selected. */
  export type ArticleHighlightItem = {
    /** Stable identity of the article within the band. */
    key: string
    /** Destination of the article. */
    href: string
    /** URL of the cover. */
    image: string
    /** URL of a cover cropped for the panel; wins over image. */
    highlightImage?: string
    /** Overline, usually the category and the date. */
    meta: string
    /** Headline of the article. */
    title: string
    /** Deck under the headline, clamped to three lines. */
    description: string
    /** Read time shown under the deck. */
    readTime: string
  }

  interface Props {
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** The highlight articles in wall order, the first selected on load; each is `{ key, href, image, highlightImage?, meta, title, description, readTime }`. */
    items?: ArticleHighlightItem[]
    /** Label of the button into the selected article; the button is omitted when empty. */
    actionLabel?: string
    /** Accessible name of the wall of titles. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    anchor: '',
    items: () => [],
    actionLabel: '',
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const baseId = useId()

  const selected = ref(0)

  const wall = ref<HTMLElement | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-highlight'
  )

  const current = computed(() => props.items[selected.value] ?? props.items[0])

  const panelId = computed(() => `${baseId}-panel`)

  const tabId = (index: number): string => `${baseId}-tab-${index}`

  const select = (index: number): void => {
    selected.value = index
  }

  const focusTab = async (index: number): Promise<void> => {
    const count = props.items.length
    const next = ((index % count) + count) % count
    select(next)
    await nextTick()
    wall.value?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
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
    const target = moves[event.key]
    if (target === undefined) return
    event.preventDefault()
    void focusTab(target)
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-xxl)"
  >
    <SectionModule
      v-if="current"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <div class="flex flex-col">
          <FrameBox
            :id="panelId"
            borders="bottom"
            marks="all"
            role="tabpanel"
            :aria-labelledby="tabId(selected)"
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
                  <div
                    class="flex flex-col gap-(--spacing-sm) p-(--spacing-xl) lg:p-(--spacing-xxl)"
                  >
                    <span class="text-overline-sm">{{ item.meta }}</span>
                    <span class="text-heading-lg">{{ item.title }}</span>
                    <span class="line-clamp-3 text-body-md">{{ item.description }}</span>
                    <span class="text-body-sm">{{ item.readTime }}</span>
                    <span class="h-10" />
                  </div>
                </div>
              </div>

              <article class="group/article relative grid min-w-0 lg:grid-cols-2">
                <div
                  class="relative block aspect-video overflow-hidden border-b border-(--border-default) bg-(--bg-canvas) lg:aspect-4/3 lg:border-r lg:border-b-0"
                >
                  <img
                    :src="current.highlightImage || current.image"
                    alt=""
                    decoding="async"
                    class="absolute inset-0 size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/article:scale-105 motion-reduce:transition-none"
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
                    >
                      {{ current.title }}
                    </a>
                  </h2>
                  <p class="m-0 line-clamp-3 text-pretty text-body-md text-(--text-muted)">
                    {{ current.description }}
                  </p>
                  <span class="text-body-sm text-(--text-muted)">{{ current.readTime }}</span>
                  <Button
                    v-if="actionLabel"
                    :label="actionLabel"
                    kind="secondary"
                    size="large"
                    :href="current.href"
                    icon="pi pi-chevron-right"
                    icon-position="trailing"
                    animated
                    class="relative mt-(--spacing-sm) self-start"
                  />
                </div>
              </article>
            </div>
          </FrameBox>

          <div ref="wall">
            <CardGrid
              kind="frame"
              flush
              :columns="items.length >= 4 ? 4 : 3"
              :mobile-columns="1"
              role="tablist"
              :aria-label="ariaLabel || undefined"
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
                  type="button"
                  role="tab"
                  :aria-selected="index === selected ? 'true' : 'false'"
                  :aria-controls="panelId"
                  :tabindex="index === selected ? 0 : -1"
                  :data-active="index === selected || undefined"
                  class="relative isolate flex h-full w-full cursor-pointer flex-col items-start gap-(--spacing-xs) p-(--spacing-lg) text-left transition-colors duration-moderate-01 ease-out before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-fast-02 before:ease-productive-entrance before:content-[''] hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) data-[active]:bg-(--bg-selected) data-[active]:before:hidden motion-reduce:transition-none motion-reduce:before:transition-none"
                  @click="select(index)"
                  @keydown="onKeydown($event, index)"
                >
                  <span class="text-overline-sm text-(--text-muted)">{{ item.meta }}</span>
                  <span class="line-clamp-3 text-balance text-heading-xxs text-(--text-default)">
                    {{ item.title }}
                  </span>
                </button>
              </CardGridCell>
            </CardGrid>
          </div>
        </div>
      </FrameBox>
    </SectionModule>
  </section>
</template>
