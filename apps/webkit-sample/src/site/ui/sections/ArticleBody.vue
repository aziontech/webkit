<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Divider from '@aziontech/webkit/divider'
  import DocOnThisPage from '@aziontech/webkit/doc-on-this-page'
  import DocProse from '@aziontech/webkit/doc-prose'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
  import SplitButton from '@aziontech/webkit/split-button'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
  import { provideHeadingNav } from '@aziontech/webkit-docs/heading-nav'
  import { collectHeadings, parseMdx } from '@aziontech/webkit-docs/mdx'
  import { useScrollSpy } from '@aziontech/webkit-docs/use-scroll-spy'
  import { computed, nextTick, ref, watch } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { SiteLink } from './types'

  defineOptions({ name: 'ArticleBody' })

  export interface ArticleBodyAuthor {
    /** The writer's name. */
    name: string
    /** Photo URL; without one the avatar shows initials. */
    avatar?: string
  }

  export interface ArticleBodyArticle {
    /** The article's headline, the page's h1. */
    title: string
    /** The deck under the headline. */
    description: string
    /** Publication date. */
    date: string
    /** Read time beside the date. */
    readTime: string
    /** Canonical URL, shared and handed to the assistants. */
    href: string
    /** Names of the writers, in byline order. */
    author?: string
    /** The writers, drawn as overlapping photos. */
    authors?: ArticleBodyAuthor[]
  }

  export interface ArticleBodyCrumb {
    /** Visible label. */
    label: string
    /** Destination; the current page has none. */
    href?: string
    /** Marks the page itself. */
    current?: boolean
  }

  export interface ArticleBodyShare {
    /** Heading of the share group. */
    title: string
    /** Label of the copy-link action. */
    copyLink: string
    /** Toast after the link is copied. */
    copiedLink: string
    /** Label of the copy-feed action; empty hides it. */
    copyFeed?: string
    /** Toast after the feed is copied. */
    copiedFeed?: string
    /** URL of the feed. */
    feed?: string
    /** Label of the share-on-X action. */
    shareX: string
    /** Label of the share-on-LinkedIn action. */
    shareLinkedIn: string
    /** Toast after the page is copied as markdown. */
    copiedPage: string
  }

  export interface ArticleBodyCommunityLink extends SiteLink {
    /** Leading glyph, as an icon class. */
    icon: string
  }

  export interface ArticleBodyCommunity {
    /** Heading of the community group. */
    title: string
    /** The community links. */
    links: ArticleBodyCommunityLink[]
  }

  export interface ArticleBodyMenuItem {
    /** Stable value of the entry: link, markdown, or an assistant key. */
    value: string
    /** Visible label. */
    label: string
    /** Leading glyph, as an icon class. */
    icon: string
  }

  export interface ArticleBodyCopyPage {
    /** Label of the split button. */
    label: string
    /** The menu under the split button. */
    menu: ArticleBodyMenuItem[]
  }

  interface Props {
    /** The article being read. */
    article: ArticleBodyArticle
    /** Breadcrumb trail, the last entry current. */
    trail: ArticleBodyCrumb[]
    /** Loads the markdown body. */
    load: () => Promise<string>
    /** Banner image over the masthead. */
    banner?: string
    /** Copy of the share group. */
    share: ArticleBodyShare
    /** Copy of the community group. */
    community: ArticleBodyCommunity
    /** Copy of the copy-page control. */
    copyPage: ArticleBodyCopyPage
    /** URL builders for each assistant, keyed by menu value. */
    assistants?: Record<string, (prompt: string) => string>
  }

  const props = withDefaults(defineProps<Props>(), {
    banner: '/blog/banner.svg',
    assistants: () => ({})
  })

  const { follow } = useSiteLink()

  const source = ref('')
  const spyItems = ref<ReturnType<typeof collectHeadings>>([])
  const body = ref<HTMLElement | null>(null)

  const headings = computed(() => collectHeadings(parseMdx(source.value).nodes))
  const { activeId } = useScrollSpy(body, spyItems, { tripLine: 120 })

  const shareActions = computed(() => [
    { label: props.share.copyLink, icon: 'pi pi-link', copy: pageUrl, copied: props.share.copiedLink },
    ...(props.share.copyFeed && props.share.feed
      ? [
          {
            label: props.share.copyFeed,
            icon: 'ai ai-rss',
            copy: () => props.share.feed ?? '',
            copied: props.share.copiedFeed ?? ''
          }
        ]
      : []),
    {
      label: props.share.shareX,
      icon: 'ai ai-x',
      href: `https://x.com/intent/tweet?url=${props.article.href}&via=aziontech`
    },
    {
      label: props.share.shareLinkedIn,
      icon: 'pi pi-linkedin',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.article.href)}`
    }
  ])

  watch(
    () => props.load,
    async (load) => {
      source.value = ''
      spyItems.value = []
      const markdown = await load()
      if (load !== props.load) return
      source.value = markdown
      await nextTick()
      spyItems.value = headings.value
    },
    { immediate: true }
  )

  provideHeadingNav(goToHeading)

  function goToHeading(event: globalThis.Event | null, item: { id: string }) {
    const target = body.value?.querySelector(`#${globalThis.CSS.escape(item.id)}`)
    if (!target) return
    event?.preventDefault()
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    globalThis.history?.replaceState(null, '', `#${item.id}`)
  }

  function pageUrl() {
    return globalThis.location?.href ?? props.article.href
  }

  function pageMarkdown() {
    return `# ${props.article.title}\n\n${props.article.description}\n\n${source.value}`
  }

  async function copy(message: string, text: string) {
    try {
      await globalThis.navigator?.clipboard?.writeText(text)
    } catch {
      toast.error('Could not copy', { description: 'Your browser blocked clipboard access.' })
      return
    }
    toast.success(message)
  }

  function viewMarkdown() {
    const blob = new globalThis.Blob([pageMarkdown()], { type: 'text/plain' })
    const url = globalThis.URL.createObjectURL(blob)
    globalThis.open(url, '_blank', 'noopener')
    globalThis.setTimeout(() => globalThis.URL.revokeObjectURL(url), 10000)
  }

  function onCopyPageMenu(_event: globalThis.Event, item: ArticleBodyMenuItem) {
    if (item.value === 'link') return copy(props.share.copiedLink, pageUrl())
    if (item.value === 'markdown') return viewMarkdown()
    const assistant = props.assistants[item.value]
    if (!assistant) return
    const prompt = encodeURIComponent(`Read ${props.article.href} so I can ask questions about it.`)
    globalThis.open(assistant(prompt), '_blank', 'noopener')
  }
</script>

<template>
  <SectionContainer max-width="site">
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
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
              :items="trail"
              @navigate="follow"
            />
            <HeroTitle
              size="medium"
              max-width="2xl"
              :title="article.title"
              :description="article.description"
            />
            <div class="flex items-center gap-(--spacing-sm)">
              <div
                v-if="article.authors?.length"
                class="flex shrink-0 -space-x-(--spacing-sm)"
              >
                <Avatar
                  v-for="person in article.authors"
                  :key="person.name"
                  kind="circle"
                  size="large"
                  :src="person.avatar || undefined"
                  :label="person.avatar ? undefined : person.name"
                  :alt="person.name"
                  class="ring-2 ring-(--bg-canvas)"
                />
              </div>
              <div
                :data-signed="article.authors?.length ? true : null"
                class="flex min-w-0 flex-col gap-(--spacing-xs) data-signed:h-12 data-signed:justify-between data-signed:gap-0"
              >
                <p
                  v-if="article.author"
                  class="m-0 text-body-sm text-(--text-default)"
                >
                  {{ article.author }}
                </p>
                <p class="m-0 text-body-sm text-(--text-muted)">
                  {{ article.date }} • {{ article.readTime }}
                </p>
              </div>
            </div>
          </header>

          <Divider class="lg:col-start-2" />

          <article
            ref="body"
            class="min-w-0 lg:col-start-2 [&_h2]:scroll-mt-(--spacing-xxl)"
          >
            <DocProse>
              <DocMarkdown :source="source" />
            </DocProse>
          </article>

          <aside class="hidden lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:block">
            <div
              class="sticky top-[calc(3.5rem+var(--spacing-xl))] flex max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] flex-col gap-(--spacing-xl) overflow-y-auto pb-(--spacing-lg)"
            >
              <section
                class="flex flex-col gap-(--spacing-sm)"
                :aria-label="share.title"
              >
                <p class="m-0 text-heading-xs text-(--text-default)">{{ share.title }}</p>
                <div class="flex items-center gap-(--spacing-sm)">
                  <Tooltip
                    v-for="action in shareActions"
                    :key="action.label"
                    :text="action.label"
                  >
                    <IconButton
                      kind="outlined"
                      size="medium"
                      :icon="action.icon"
                      :aria-label="action.label"
                      :href="action.href ?? ''"
                      :target="action.href ? '_blank' : '_self'"
                      @click="action.copy && copy(action.copied, action.copy())"
                    />
                  </Tooltip>
                </div>
              </section>

              <section
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
                    :key="link.label"
                  >
                    <a
                      :href="link.href"
                      :target="link.href.startsWith('/') ? undefined : '_blank'"
                      :rel="link.href.startsWith('/') ? undefined : 'noopener'"
                      class="flex items-center gap-(--spacing-sm) rounded-(--shape-flat) py-(--spacing-xxs) text-body-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
                      @click="follow($event, link.href)"
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
                kind="outlined"
                size="medium"
                icon="pi pi-copy"
                :label="copyPage.label"
                :model="copyPage.menu"
                class="self-start"
                @click="copy(share.copiedPage, pageMarkdown())"
                @item-click="onCopyPageMenu"
              />
            </div>
          </aside>

          <aside class="hidden lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:block">
            <div
              class="sticky top-[calc(3.5rem+var(--spacing-xl))] max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] overflow-y-auto pb-(--spacing-lg)"
            >
              <DocOnThisPage
                :items="headings"
                :active-id="activeId"
                @select="goToHeading"
              />
            </div>
          </aside>
        </div>
      </FrameBox>
    </SectionModule>
  </SectionContainer>
</template>
