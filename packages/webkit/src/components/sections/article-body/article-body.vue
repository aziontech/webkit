<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../i18n/messages/en'
  import IconButton from '../../actions/icon-button/icon-button.vue'
  import type { SplitButtonItem } from '../../actions/split-button/split-button.vue'
  import SplitButton from '../../actions/split-button/split-button.vue'
  import Avatar from '../../content/avatar/avatar.vue'
  import DocOnThisPage from '../../documentation/doc-on-this-page/doc-on-this-page.vue'
  import DocProse from '../../documentation/doc-prose/doc-prose.vue'
  import { toast } from '../../feedback/toast/composables/use-toast-store'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import Separator from '../../layout/separator/separator.vue'
  import HeroTitle from '../../marketing/hero/hero-title/hero-title.vue'
  import SectionContainer from '../../marketing/section-container/section-container.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.vue'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({
    name: 'ArticleBody',
    inheritAttrs: false
  })

  /** One writer of the article, drawn as an avatar in the byline. */
  export type ArticleBodyAuthor = {
    /** The writer's name, the avatar's initials and alternative text. */
    name: string
    /** URL of the writer's photo; without one the avatar shows the initials. */
    avatar?: string
  }

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
    /** Names of the writers, shown above the date and read time. */
    author?: string
    /** The writers, drawn as overlapping avatars leading the byline. */
    authors?: ArticleBodyAuthor[]
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
    /** Label of the copy-feed button; the button is omitted without it or without `feed`. */
    copyFeed?: string
    /** URL of the feed the copy-feed button copies. */
    feed?: string
    /** Toast message after the link is copied. */
    copiedLink?: string
    /** Toast message after the feed is copied. */
    copiedFeed?: string
    /** Toast message after the page is copied as markdown. */
    copiedPage?: string
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

  /** One inline run of a paragraph or list item. */
  export type ArticleBodyRun =
    | { kind: 'text' | 'strong' | 'em' | 'code'; text: string }
    | { kind: 'link'; text: string; href: string }

  /** One rendered block of the body. */
  export type ArticleBodyBlock =
    | { kind: 'heading'; depth: 2 | 3; id: string; text: string }
    | { kind: 'list'; items: string[]; ordered?: boolean; runs?: ArticleBodyRun[][] }
    | { kind: 'paragraph'; text: string; runs?: ArticleBodyRun[] }
    | { kind: 'code'; text: string; lang?: string }

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
    /** URL templates of the assistants the copy-page menu opens, keyed by menu value; `{prompt}` is replaced by the encoded prompt. */
    assistants?: Record<string, string>
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    trail: () => [],
    body: '',
    banner: '',
    share: undefined,
    community: undefined,
    copyPage: undefined,
    assistants: () => ({}),
    anchor: ''
  })

  const attrs = useAttrs()

  const { t } = useTranslate({ articleBody: en.articleBody })

  const TRIP_LINE = 120

  const proseEl = ref<HTMLElement | null>(null)

  const spiedId = ref('')

  const EYEBROW_PREFIX = '//' as const

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-body'
  )

  const slug = (text: string): string =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const INLINE = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*/g

  const runsOf = (text: string): ArticleBodyRun[] => {
    const runs: ArticleBodyRun[] = []
    let last = 0
    for (const match of text.matchAll(INLINE)) {
      const index = match.index ?? 0
      if (index > last) runs.push({ kind: 'text', text: text.slice(last, index) })
      if (match[1] !== undefined) runs.push({ kind: 'link', text: match[1], href: match[2] ?? '' })
      else if (match[3] !== undefined) runs.push({ kind: 'strong', text: match[3] })
      else if (match[4] !== undefined) runs.push({ kind: 'code', text: match[4] })
      else runs.push({ kind: 'em', text: match[5] ?? '' })
      last = index + match[0].length
    }
    if (last < text.length) runs.push({ kind: 'text', text: text.slice(last) })
    return runs
  }

  const plainOf = (runs: ArticleBodyRun[]): string => runs.map((run) => run.text).join('')

  const FENCE = /^```(\w*)\s*$/
  const HEADING = /^(#{2,3})\s+(.+)$/
  const BULLET = /^[-*]\s+(.*)$/
  const NUMBERED = /^\d+\.\s+(.*)$/

  const startsBlock = (line: string): boolean =>
    FENCE.test(line) || HEADING.test(line) || BULLET.test(line) || NUMBERED.test(line)

  const blocks = computed<ArticleBodyBlock[]>(() => {
    const lines = props.body.split('\n').map((line) => line.trimEnd())
    const out: ArticleBodyBlock[] = []
    let index = 0
    while (index < lines.length) {
      const line = (lines[index] ?? '').trim()
      if (!line) {
        index += 1
        continue
      }
      const fence = FENCE.exec(line)
      if (fence) {
        const code: string[] = []
        index += 1
        while (index < lines.length && !/^```\s*$/.test((lines[index] ?? '').trim())) {
          code.push(lines[index] ?? '')
          index += 1
        }
        index += 1
        out.push({ kind: 'code', text: code.join('\n'), lang: fence[1] || undefined })
        continue
      }
      const heading = HEADING.exec(line)
      if (heading) {
        const text = (heading[2] ?? '').trim()
        out.push({ kind: 'heading', depth: heading[1] === '###' ? 3 : 2, id: slug(text), text })
        index += 1
        continue
      }
      const pattern = BULLET.test(line) ? BULLET : NUMBERED.test(line) ? NUMBERED : null
      if (pattern) {
        const runs: ArticleBodyRun[][] = []
        while (index < lines.length) {
          const item = pattern.exec((lines[index] ?? '').trim())
          if (!item) break
          runs.push(runsOf(item[1] ?? ''))
          index += 1
        }
        out.push({ kind: 'list', items: runs.map(plainOf), ordered: pattern === NUMBERED, runs })
        continue
      }
      const paragraph: string[] = []
      while (index < lines.length) {
        const next = (lines[index] ?? '').trim()
        if (!next || (paragraph.length > 0 && startsBlock(next))) break
        paragraph.push(next)
        index += 1
      }
      const runs = runsOf(paragraph.join(' '))
      out.push({ kind: 'paragraph', text: plainOf(runs), runs })
    }
    return out
  })

  const headings = computed(() =>
    blocks.value.flatMap((block) =>
      block.kind === 'heading' ? [{ id: block.id, text: block.text, depth: block.depth }] : []
    )
  )

  const activeId = computed(() => spiedId.value || headings.value[0]?.id || '')

  const authors = computed(() => props.article.authors ?? [])

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

  const hasFeed = computed(() => Boolean(props.share?.copyFeed && props.share?.feed))

  const isExternal = (href: string): boolean => !href.startsWith('/')

  const isRemote = (href: string): boolean => /^https?:/.test(href)

  const pageUrl = (): string => globalThis.location?.href || props.article.href

  const pageMarkdown = (): string =>
    [`# ${props.article.title}`, props.article.description ?? '', props.body]
      .filter((part) => part)
      .join('\n\n')

  const copy = async (message: string, text: string): Promise<void> => {
    try {
      await globalThis.navigator.clipboard.writeText(text)
    } catch {
      toast.error(t('articleBody.copyFailed'), { description: t('articleBody.copyFailedHint') })
      return
    }
    toast.success(message)
  }

  const copyLink = (): void => {
    void copy(props.share?.copiedLink || t('articleBody.copiedLink'), pageUrl())
  }

  const copyFeed = (): void => {
    void copy(props.share?.copiedFeed || t('articleBody.copiedFeed'), props.share?.feed ?? '')
  }

  const copyBody = (): void => {
    void copy(props.share?.copiedPage || t('articleBody.copiedPage'), pageMarkdown())
  }

  const viewMarkdown = (): void => {
    const url = URL.createObjectURL(new Blob([pageMarkdown()], { type: 'text/plain' }))
    window.open(url, '_blank', 'noopener')
    setTimeout(() => URL.revokeObjectURL(url), 10000)
  }

  const onMenu = (_event: MouseEvent | KeyboardEvent, item: SplitButtonItem): void => {
    const value = item.value ?? item.label
    if (value === 'link') return copyLink()
    if (value === 'markdown') return viewMarkdown()
    const template = typeof value === 'string' ? props.assistants[value] : undefined
    if (!template) return
    const prompt = encodeURIComponent(t('articleBody.assistantPrompt', { url: props.article.href }))
    window.open(template.replace('{prompt}', prompt), '_blank', 'noopener')
  }

  const spy = (): void => {
    const nodes = proseEl.value?.querySelectorAll<HTMLElement>('h2[id], h3[id]') ?? []
    let current = ''
    for (const node of nodes) {
      if (node.getBoundingClientRect().top <= TRIP_LINE) current = node.id
      else break
    }
    spiedId.value = current
  }

  const goToHeading = (event: MouseEvent, item: { id: string }): void => {
    const target = proseEl.value?.querySelector<HTMLElement>(`#${CSS.escape(item.id)}`)
    if (!target) return
    event.preventDefault()
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
    window.history.replaceState(null, '', `#${item.id}`)
    spiedId.value = item.id
  }

  useEventListener(globalThis.window, 'scroll', spy, { passive: true })

  onMounted(spy)
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
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
            class="grid gap-(--spacing-xl) p-(--spacing-xl) pb-(--spacing-2xl) lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--container-2xl))_minmax(0,1fr)] lg:grid-rows-[auto_auto_1fr]"
          >
            <header class="flex min-w-0 flex-col gap-(--spacing-lg) lg:col-start-2">
              <Breadcrumb
                v-if="trail.length > 0"
                :items="trail"
              />
              <HeroTitle
                :eyebrow="eyebrow"
                :eyebrow-prefix="EYEBROW_PREFIX"
                size="medium"
                max-width="2xl"
                :title="article.title"
                :description="article.description ?? ''"
              />
              <div
                v-if="byline || article.author || authors.length > 0"
                class="flex items-center gap-(--spacing-sm)"
              >
                <div
                  v-if="authors.length > 0"
                  class="flex shrink-0 -space-x-(--spacing-sm)"
                >
                  <Avatar
                    v-for="person in authors"
                    :key="person.name"
                    kind="circle"
                    size="large"
                    :src="person.avatar || undefined"
                    :label="person.avatar ? undefined : person.name"
                    :alt="person.name"
                    class="ring-2 ring-(--bg-canvas)"
                  />
                </div>
                <div class="flex min-w-0 flex-col gap-(--spacing-xs)">
                  <p
                    v-if="article.author"
                    class="m-0 text-body-sm text-(--text-default)"
                  >
                    {{ article.author }}
                  </p>
                  <p
                    v-if="byline"
                    class="m-0 text-body-sm text-(--text-muted)"
                  >
                    {{ byline }}
                  </p>
                </div>
              </div>
            </header>

            <Separator class="lg:col-start-2" />

            <article
              ref="prose"
              class="min-w-0 lg:col-start-2 [&_h2]:scroll-mt-(--spacing-2xl) [&_h3]:scroll-mt-(--spacing-2xl)"
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
                  <pre
                    v-else-if="block.kind === 'code'"
                    dir="ltr"
                  ><code :data-lang="block.lang || undefined">{{ block.text }}</code></pre>
                  <component
                    :is="block.ordered ? 'ol' : 'ul'"
                    v-else-if="block.kind === 'list'"
                  >
                    <li
                      v-for="(item, itemIndex) in block.items"
                      :key="itemIndex"
                    >
                      <template
                        v-for="(run, runIndex) in block.runs?.[itemIndex] ?? [
                          { kind: 'text', text: item }
                        ]"
                        :key="runIndex"
                      >
                        <a
                          v-if="run.kind === 'link'"
                          :href="run.href"
                          :target="isRemote(run.href) ? '_blank' : undefined"
                          :rel="isRemote(run.href) ? 'noopener' : undefined"
                          >{{ run.text }}</a
                        >
                        <strong v-else-if="run.kind === 'strong'">{{ run.text }}</strong>
                        <em v-else-if="run.kind === 'em'">{{ run.text }}</em>
                        <code v-else-if="run.kind === 'code'">{{ run.text }}</code>
                        <template v-else>{{ run.text }}</template>
                      </template>
                    </li>
                  </component>
                  <p v-else>
                    <template
                      v-for="(run, runIndex) in block.runs ?? [{ kind: 'text', text: block.text }]"
                      :key="runIndex"
                    >
                      <a
                        v-if="run.kind === 'link'"
                        :href="run.href"
                        :target="isRemote(run.href) ? '_blank' : undefined"
                        :rel="isRemote(run.href) ? 'noopener' : undefined"
                        >{{ run.text }}</a
                      >
                      <strong v-else-if="run.kind === 'strong'">{{ run.text }}</strong>
                      <em v-else-if="run.kind === 'em'">{{ run.text }}</em>
                      <code v-else-if="run.kind === 'code'">{{ run.text }}</code>
                      <template v-else>{{ run.text }}</template>
                    </template>
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
                        icon="ai ai-link"
                        :ariaLabel="share.copyLink"
                        @click="copyLink"
                      />
                    </Tooltip>
                    <Tooltip
                      v-if="hasFeed"
                      :text="share.copyFeed ?? ''"
                    >
                      <IconButton
                        kind="outlined"
                        size="medium"
                        icon="ai ai-rss"
                        :ariaLabel="share.copyFeed ?? ''"
                        @click="copyFeed"
                      />
                    </Tooltip>
                    <Tooltip :text="share.shareX">
                      <IconButton
                        kind="outlined"
                        size="medium"
                        icon="ai ai-x-brand"
                        :ariaLabel="share.shareX"
                        :href="shareX"
                        target="_blank"
                      />
                    </Tooltip>
                    <Tooltip :text="share.shareLinkedIn">
                      <IconButton
                        kind="outlined"
                        size="medium"
                        icon="ai ai-linkedin"
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
                        class="flex items-center gap-(--spacing-sm) rounded-(--shape-flat) py-(--spacing-2xs) text-body-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none"
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
                  icon="ai ai-copy"
                  :label="copyPage.label"
                  :items="copyPage.menu"
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
                  :active-id="activeId"
                  @select="goToHeading"
                />
              </div>
            </aside>
          </div>
        </FrameBox>
      </SectionModule>
    </SectionContainer>
  </div>
</template>
