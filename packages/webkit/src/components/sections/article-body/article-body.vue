<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import IconButton from '../../actions/icon-button/icon-button.vue'
  import type { SplitButtonItem } from '../../actions/split-button/split-button.vue'
  import SplitButton from '../../actions/split-button/split-button.vue'
  import DocOnThisPage from '../../documentation/doc-on-this-page/doc-on-this-page.vue'
  import DocProse from '../../documentation/doc-prose/doc-prose.vue'
  import Divider from '../../layout/divider/divider.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import HeroTitle from '../../marketing/hero/hero-title/hero-title.vue'
  import SectionContainer from '../../marketing/section-container/section-container.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({
    name: 'ArticleBody',
    inheritAttrs: false
  })

  /** The piece being read. */
  export type ArticleBodyArticle = {
    /** Headline of the article, the page h1. */
    title: string
    /** Lead sentence under the headline. */
    description?: string
    /** Publication date shown in the byline. */
    date?: string
    /** Read time shown in the byline. */
    readTime?: string
    /** Canonical URL of the article, shared and copied. */
    href: string
  }

  /** One breadcrumb entry. */
  export type ArticleBodyCrumb = {
    /** Visible label of the entry. */
    label: string
    /** Destination of the entry. */
    href?: string
    /** Marks the entry as the current page. */
    current?: boolean
  }

  /** Labels of the share group. */
  export type ArticleBodyShare = {
    /** Heading of the group, which also names the left rail. */
    title: string
    /** Label of the copy-link button. */
    copyLink: string
    /** Label of the share-on-X link. */
    shareX: string
    /** Label of the share-on-LinkedIn link. */
    shareLinkedIn: string
  }

  /** One community link. */
  export type ArticleBodyCommunityLink = {
    /** Visible label of the link. */
    label: string
    /** Destination; a full URL opens in a new tab. */
    href: string
    /** Icon class drawn before the label. */
    icon: string
  }

  /** The community group. */
  export type ArticleBodyCommunity = {
    /** Heading of the group. */
    title: string
    /** The links, in order. */
    links: ArticleBodyCommunityLink[]
  }

  /** The copy-page split button. */
  export type ArticleBodyCopyPage = {
    /** Label of the main action, which copies the body. */
    label: string
    /** The menu entries; the `link` entry copies the article URL. */
    menu: SplitButtonItem[]
  }

  /** One rendered block of the body. */
  export type ArticleBodyBlock =
    | { kind: 'heading'; depth: 2 | 3; id: string; text: string }
    | { kind: 'list'; items: string[] }
    | { kind: 'paragraph'; text: string }

  interface Props {
    /** Overline above the headline. */
    eyebrow?: string
    /** The piece being read: its `title` (the page h1), `description`, `date`, `readTime` and canonical `href`. */
    article: ArticleBodyArticle
    /** The breadcrumb over the headline, each a `label` and an `href`, the last one marked `current`. */
    trail?: ArticleBodyCrumb[]
    /** The article as markdown; its `##` and `###` headings feed the outline. */
    body?: string
    /** URL of the image over the masthead; the banner frame is omitted when empty. */
    banner?: string
    /** Labels of the share group: its `title`, `copyLink`, `shareX` and `shareLinkedIn`; the group is omitted when absent. */
    share?: ArticleBodyShare
    /** The community group: a `title` and `links`, each a `label`, an `href` and an `icon`; omitted when absent. */
    community?: ArticleBodyCommunity
    /** The copy-page split button: its `label` and a `menu` of entries, each a `value`, a `label` and an `icon`; omitted when absent. */
    copyPage?: ArticleBodyCopyPage
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    trail: () => [],
    body: '',
    banner: '',
    share: undefined,
    community: undefined,
    copyPage: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-body'
  )

  const slug = (text: string): string =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const blocks = computed<ArticleBodyBlock[]>(() =>
    props.body
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter((block) => block.length > 0)
      .map((block): ArticleBodyBlock => {
        const heading = /^(#{2,3})\s+(.+)$/.exec(block)
        if (heading) {
          const text = (heading[2] ?? '').trim()
          return { kind: 'heading', depth: heading[1] === '###' ? 3 : 2, id: slug(text), text }
        }
        const lines = block.split('\n').map((line) => line.trim())
        if (lines.every((line) => line.startsWith('- '))) {
          return { kind: 'list', items: lines.map((line) => line.slice(2)) }
        }
        return { kind: 'paragraph', text: lines.join(' ') }
      })
  )

  const headings = computed(() =>
    blocks.value.flatMap((block) =>
      block.kind === 'heading' ? [{ id: block.id, text: block.text, depth: block.depth }] : []
    )
  )

  const byline = computed(() =>
    [props.article.date, props.article.readTime].filter((part) => part).join(' • ')
  )

  const shareX = computed(
    () => `https://x.com/intent/tweet?url=${props.article.href}&via=aziontech`
  )

  const shareLinkedIn = computed(
    () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.article.href)}`
  )

  const hasRail = computed(() => Boolean(props.share || props.community || props.copyPage))

  const isExternal = (href: string): boolean => !href.startsWith('/')

  const copy = async (text: string): Promise<void> => {
    try {
      await globalThis.navigator.clipboard.writeText(text)
    } catch {
      return
    }
  }

  const copyLink = (): void => {
    void copy(props.article.href)
  }

  const copyBody = (): void => {
    void copy(props.body)
  }

  const onMenu = (_event: MouseEvent | KeyboardEvent, item: SplitButtonItem): void => {
    if ((item.value ?? item.label) === 'link') copyLink()
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionContainer max-width="site">
      <SectionModule
        :divided="false"
        :padded="false"
      >
        <FrameBox
          v-if="banner"
          flush
          borders="y"
          marks="all"
        >
          <div
            aria-hidden="true"
            class="relative aspect-3/1 overflow-hidden bg-(--bg-canvas) lg:aspect-4/1"
          >
            <div class="absolute inset-x-0 top-1/2 aspect-video -translate-y-1/2">
              <img
                :src="banner"
                alt=""
                class="block size-full max-w-none"
              />
            </div>
          </div>
        </FrameBox>
        <FrameBox
          flush
          borders="y"
          marks="all"
        >
          <div
            class="grid gap-(--spacing-xl) p-(--spacing-xl) pb-(--spacing-xxl) lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-2xl))_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr]"
          >
            <header class="flex min-w-0 flex-col gap-(--spacing-lg) lg:col-start-2">
              <Breadcrumb
                v-if="trail.length > 0"
                :items="trail"
              />
              <HeroTitle
                :eyebrow="eyebrow"
                eyebrow-prefix="//"
                size="medium"
                max-width="2xl"
                :title="article.title"
                :description="article.description ?? ''"
              />
              <div
                v-if="byline"
                class="flex items-center gap-(--spacing-sm)"
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                  <p class="m-0 text-body-sm text-(--text-muted)">
                    {{ byline }}
                  </p>
                </div>
              </div>
            </header>

            <Divider class="lg:col-start-2" />

            <article
              class="min-w-0 lg:col-start-2 [&_h2]:scroll-mt-(--spacing-xxl) [&_h3]:scroll-mt-(--spacing-xxl)"
            >
              <DocProse>
                <template
                  v-for="(block, index) in blocks"
                  :key="index"
                >
                  <h2
                    v-if="block.kind === 'heading' && block.depth === 2"
                    :id="block.id"
                  >
                    {{ block.text }}
                  </h2>
                  <h3
                    v-else-if="block.kind === 'heading'"
                    :id="block.id"
                  >
                    {{ block.text }}
                  </h3>
                  <ul v-else-if="block.kind === 'list'">
                    <li
                      v-for="(item, itemIndex) in block.items"
                      :key="itemIndex"
                    >
                      {{ item }}
                    </li>
                  </ul>
                  <p v-else>
                    {{ block.text }}
                  </p>
                </template>
              </DocProse>
            </article>

            <aside
              v-if="hasRail"
              :aria-label="share?.title || community?.title || copyPage?.label"
              class="hidden lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:block"
            >
              <div
                class="sticky top-[calc(3.5rem+var(--spacing-xl))] flex max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] flex-col gap-(--spacing-xl) overflow-y-auto pb-(--spacing-lg)"
              >
                <section
                  v-if="share"
                  class="flex flex-col gap-(--spacing-sm)"
                  :aria-label="share.title"
                >
                  <p class="m-0 text-heading-xs text-(--text-default)">{{ share.title }}</p>
                  <div class="flex items-center gap-(--spacing-sm)">
                    <Tooltip :text="share.copyLink">
                      <IconButton
                        kind="outlined"
                        size="medium"
                        icon="pi pi-link"
                        :ariaLabel="share.copyLink"
                        @click="copyLink"
                      />
                    </Tooltip>
                    <Tooltip :text="share.shareX">
                      <IconButton
                        kind="outlined"
                        size="medium"
                        icon="ai ai-x"
                        :ariaLabel="share.shareX"
                        :href="shareX"
                        target="_blank"
                      />
                    </Tooltip>
                    <Tooltip :text="share.shareLinkedIn">
                      <IconButton
                        kind="outlined"
                        size="medium"
                        icon="pi pi-linkedin"
                        :ariaLabel="share.shareLinkedIn"
                        :href="shareLinkedIn"
                        target="_blank"
                      />
                    </Tooltip>
                  </div>
                </section>

                <section
                  v-if="community"
                  class="flex flex-col gap-(--spacing-sm)"
                  :aria-label="community.title"
                >
                  <p class="m-0 text-heading-xs text-(--text-default)">{{ community.title }}</p>
                  <ul
                    role="list"
                    class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
                  >
                    <li
                      v-for="link in community.links"
                      :key="link.href"
                    >
                      <a
                        :href="link.href"
                        :target="isExternal(link.href) ? '_blank' : undefined"
                        :rel="isExternal(link.href) ? 'noopener' : undefined"
                        class="flex items-center gap-(--spacing-sm) rounded-(--shape-flat) py-(--spacing-xxs) text-body-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
                      >
                        <i
                          :class="link.icon"
                          class="w-4 shrink-0 text-center leading-none"
                          aria-hidden="true"
                        />
                        {{ link.label }}
                      </a>
                    </li>
                  </ul>
                </section>

                <SplitButton
                  v-if="copyPage"
                  kind="outlined"
                  size="medium"
                  icon="pi pi-copy"
                  :label="copyPage.label"
                  :model="copyPage.menu"
                  class="self-start"
                  @click="copyBody"
                  @item-click="onMenu"
                />
              </div>
            </aside>

            <aside
              v-if="headings.length > 0"
              class="hidden lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:block"
            >
              <div
                class="sticky top-[calc(3.5rem+var(--spacing-xl))] max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] overflow-y-auto pb-(--spacing-lg)"
              >
                <DocOnThisPage
                  :items="headings"
                  :active-id="headings[0]?.id ?? ''"
                />
              </div>
            </aside>
          </div>
        </FrameBox>
      </SectionModule>
    </SectionContainer>
  </div>
</template>
