<script setup>
  // The Site's article layout, shared by the blog and the success stories so both read as one
  // page: the Figma brand banner, then breadcrumb, title, deck and byline over one centred
  // reading column, the share / community / Copy page rail on its left and the `DocOnThisPage`
  // outline on its right. The body is markdown rendered by the docs layer's prose stack. The
  // bands that follow the article (related posts, the closing CTA) come in the default slot.
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Divider from '@aziontech/webkit/divider'
  import FrameBox from '@aziontech/webkit/frame-box'
  import HeroTitle from '@aziontech/webkit/hero-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'
  import SplitButton from '@aziontech/webkit/split-button'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import DocMarkdown from '@aziontech/webkit-docs/doc-markdown'
  import DocOnThisPage from '@aziontech/webkit-docs/doc-on-this-page'
  import DocProse from '@aziontech/webkit-docs/doc-prose'
  import { provideHeadingNav } from '@aziontech/webkit-docs/heading-nav'
  import { collectHeadings, parseMdx } from '@aziontech/webkit-docs/mdx'
  import { useScrollSpy } from '@aziontech/webkit-docs/use-scroll-spy'
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  import { BLOG_ASSISTANTS, BLOG_COMMUNITY, BLOG_COPY_PAGE, BLOG_SHARE } from '../data/blog-articles.js'
  import BlogHeaderArt from './BlogHeaderArt.vue'

  const props = defineProps({
    /** The article: `title`, `description`, `date`, `readTime`, `href`, optional `author` and `authors` ({ name, avatar }). */
    article: { type: Object, required: true },
    /** Breadcrumb items, the last one `current`. */
    trail: { type: Array, required: true },
    /** The markdown body; empty while it loads. */
    source: { type: String, default: '' },
    /** Offers the blog's RSS feed among the share actions. */
    feed: { type: Boolean, default: false }
  })

  const router = useRouter()

  // The outline and the scroll-spy follow the body only once it is in the DOM, so the spy
  // measures real headings.
  const headings = computed(() => collectHeadings(parseMdx(props.source).nodes))
  const spyItems = ref([])
  watch(
    () => props.source,
    async () => {
      spyItems.value = []
      if (!props.source) return
      await nextTick()
      spyItems.value = headings.value
    },
    { immediate: true }
  )

  // This page scrolls the window, not a docs column, so the rail and each heading's anchor use
  // a native scroll; the headings' scroll-margin clears the sticky nav, and the spy's reading
  // line sits just under where a heading lands.
  const body = ref(null)
  const { activeId } = useScrollSpy(body, spyItems, { tripLine: 120 })
  function goToHeading(event, item) {
    const target = body.value?.querySelector(`#${globalThis.CSS.escape(item.id)}`)
    if (!target) return
    event?.preventDefault()
    const reduced = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    globalThis.history?.replaceState(null, '', `#${item.id}`)
  }
  provideHeadingNav(goToHeading)

  function goToTrail(event, href) {
    event.preventDefault()
    router.push(href)
  }

  // The rail's actions confirm through the design system's toast, mounted once at the app root.
  async function copy(message, text) {
    try {
      await globalThis.navigator?.clipboard?.writeText(text)
    } catch {
      toast.error('Could not copy', { description: 'Your browser blocked clipboard access.' })
      return
    }
    toast.success(message)
  }
  const pageUrl = () => globalThis.location?.href ?? props.article.href
  const shareActions = computed(() => [
    {
      label: BLOG_SHARE.copyLink,
      icon: 'pi pi-link',
      copy: pageUrl,
      copied: BLOG_SHARE.copiedLink
    },
    ...(props.feed
      ? [
          {
            label: BLOG_SHARE.copyFeed,
            icon: 'ai ai-rss',
            copy: () => BLOG_SHARE.feed,
            copied: BLOG_SHARE.copiedFeed
          }
        ]
      : []),
    { label: BLOG_SHARE.shareX, icon: 'ai ai-x', href: BLOG_SHARE.xIntent(props.article.href) },
    {
      label: BLOG_SHARE.shareLinkedIn,
      icon: 'pi pi-linkedin',
      href: BLOG_SHARE.linkedInShare(props.article.href)
    }
  ])
  const pageMarkdown = () =>
    `# ${props.article.title}\n\n${props.article.description}\n\n${props.source}`

  function viewMarkdown() {
    const blob = new globalThis.Blob([pageMarkdown()], { type: 'text/plain' })
    const url = globalThis.URL.createObjectURL(blob)
    globalThis.open(url, '_blank', 'noopener')
    globalThis.setTimeout(() => globalThis.URL.revokeObjectURL(url), 10000)
  }

  function onCopyPageMenu(event, item) {
    if (item.value === 'link') return copy(BLOG_SHARE.copiedLink, pageUrl())
    if (item.value === 'markdown') return viewMarkdown()
    const prompt = encodeURIComponent(`Read ${props.article.href} so I can ask questions about it.`)
    globalThis.open(BLOG_ASSISTANTS[item.value](prompt), '_blank', 'noopener')
  }
</script>

<template>
  <!-- Vercel's article layout in our language, with no hero: the breadcrumb, title, deck and
       byline open the reading column (`--container-2xl`) itself, between the two rails, so
       every line of the page starts on one vertical. -->
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
        <BlogHeaderArt />
      </FrameBox>
      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <div
          class="grid gap-x-(--spacing-xl) gap-y-(--spacing-xl) p-(--spacing-xl) pb-(--spacing-xxl) lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-2xl))_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr]"
        >
          <header class="flex min-w-0 flex-col gap-(--spacing-lg) lg:col-start-2">
            <Breadcrumb
              :items="trail"
              @navigate="goToTrail"
            />
            <HeroTitle
              size="medium"
              max-width="2xl"
              :title="article.title"
              :description="article.description"
            />
            <!-- The signature: the author's photo (several overlap) beside the name and the date
                 line, which are held to the photo's height so its top meets the name's and its
                 bottom the date's. Without photos the two lines stand alone. -->
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
                class="flex min-w-0 flex-col gap-(--spacing-xs)"
                :class="article.authors?.length ? 'h-12 justify-between gap-0' : ''"
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

          <!-- Closes the masthead: the rule between the byline and the body, on its own row so
               the same gap sits above and below it. -->
          <Divider class="lg:col-start-2" />

          <article
            ref="body"
            class="min-w-0 lg:col-start-2 [&_h2]:scroll-mt-(--spacing-xxl)"
          >
            <DocProse>
              <DocMarkdown :source="source" />
            </DocProse>
          </article>

          <!-- Two rails spanning the header and the body, so both open level with the breadcrumb:
               share, community, then Copy page on the left and the outline on the right. Each
               is sticky and scrolls inside itself if it outgrows the viewport. -->
          <aside class="hidden lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:block">
            <div
              class="sticky top-[calc(3.5rem+var(--spacing-xl))] flex max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] flex-col gap-(--spacing-xl) overflow-y-auto pb-(--spacing-lg)"
            >
              <section
                class="flex flex-col gap-(--spacing-sm)"
                :aria-label="BLOG_SHARE.title"
              >
                <p class="m-0 text-heading-xs text-(--text-default)">
                  {{ BLOG_SHARE.title }}
                </p>
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
                :aria-label="BLOG_COMMUNITY.title"
              >
                <p class="m-0 text-heading-xs text-(--text-default)">
                  {{ BLOG_COMMUNITY.title }}
                </p>
                <ul
                  role="list"
                  class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0"
                >
                  <li
                    v-for="link in BLOG_COMMUNITY.links"
                    :key="link.label"
                  >
                    <a
                      :href="link.href"
                      :target="link.href.startsWith('/') ? undefined : '_blank'"
                      :rel="link.href.startsWith('/') ? undefined : 'noopener'"
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
                kind="outlined"
                size="medium"
                icon="pi pi-copy"
                :label="BLOG_COPY_PAGE.label"
                :model="BLOG_COPY_PAGE.menu"
                class="self-start"
                @click="copy(BLOG_SHARE.copiedPage, pageMarkdown())"
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

    <slot />
  </SectionContainer>
</template>
