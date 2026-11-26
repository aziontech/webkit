<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { computed, onMounted, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import type { SplitButtonItem } from '../../action/split-button/split-button.vue'
  import Avatar from '../../content/avatar/avatar.vue'
  import DocProse from '../../docs/doc-prose/doc-prose.vue'
  import DocTableOfContents from '../../docs/doc-table-of-contents/doc-table-of-contents.vue'
  import Container from '../../layout/container/container.vue'
  import Module from '../../layout/module/module.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import Separator from '../../layout/separator/separator.vue'
  import HeroTitle from '../../marketing/hero/hero-title/hero-title.vue'
  import type { BreadcrumbItemData } from '../../navigation/breadcrumb/breadcrumb.vue'
  import Breadcrumb from '../../navigation/breadcrumb/breadcrumb.vue'
  import { parseArticleBody } from './lib/parse-article-body'
  import ArticleBodySectionOutline from './parts/article-body-section-outline.vue'
  import ArticleBodySectionShareRail from './parts/article-body-section-share-rail.vue'

  defineOptions({
    name: 'ArticleBodySection',
    inheritAttrs: false
  })

  export type { BreadcrumbItemData }

  /** One writer of the article, drawn as an avatar in the byline. */
  export type ArticleBodySectionAuthor = {
    /** The writer's name, the avatar's initials and alternative text. */
    name: string
    /** URL of the writer's photo; without one the avatar shows the initials. */
    avatar?: string
  }

  /** The piece being read. */
  export type ArticleBodySectionArticle = {
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
    authors?: ArticleBodySectionAuthor[]
  }

  /** Labels of the share group. */
  export type ArticleBodySectionShare = {
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
  export type ArticleBodySectionCommunityLink = {
    /** Visible label of the link. */
    label: string
    /** Destination; a full URL opens in a new tab. */
    href: string
    /** Icon class drawn before the label. */
    icon: string
  }

  /** The community group. */
  export type ArticleBodySectionCommunity = {
    /** Heading of the group. */
    title: string
    /** The links, in order. */
    links: ArticleBodySectionCommunityLink[]
  }

  /** The copy-page split button. */
  export type ArticleBodySectionCopyPage = {
    /** Label of the main action, which copies the body. */
    label: string
    /** The menu entries; the `link` entry copies the article URL. */
    menu: SplitButtonItem[]
  }

  /** One inline run of a paragraph or list item. */
  export type ArticleBodySectionRun =
    | { kind: 'text' | 'strong' | 'em' | 'code'; text: string }
    | { kind: 'link'; text: string; href: string }

  /** One rendered block of the body. */
  export type ArticleBodySectionBlock =
    | { kind: 'heading'; depth: 2 | 3; id: string; text: string }
    | { kind: 'list'; items: string[]; ordered?: boolean; runs?: ArticleBodySectionRun[][] }
    | { kind: 'paragraph'; text: string; runs?: ArticleBodySectionRun[] }
    | { kind: 'code'; text: string; lang?: string }

  export interface ArticleBodySectionProps {
    /** Eyebrow above the headline. */
    eyebrow?: string
    /** The piece being read: its `title` (the page h1), `description`, `date`, `readTime` and canonical `href`. */
    article: ArticleBodySectionArticle
    /** The breadcrumb over the headline, each a `label` and an `href`, the last one marked `active`. */
    trail?: BreadcrumbItemData[]
    /** The article as markdown; its `##` and `###` headings feed the outline. */
    body?: string
    /** URL of the image over the masthead; the banner frame is omitted when empty. */
    banner?: string
    /** Labels of the share group: its `title`, `copyLink`, `shareX` and `shareLinkedIn`; the group is omitted when absent. */
    share?: ArticleBodySectionShare
    /** The community group: a `title` and `links`, each a `label`, an `href` and an `icon`; omitted when absent. */
    community?: ArticleBodySectionCommunity
    /** The copy-page split button: its `label` and a `menu` of entries, each a `value`, a `label` and an `icon`; omitted when absent. */
    copyPage?: ArticleBodySectionCopyPage
    /** URL templates of the assistants the copy-page menu opens, keyed by menu value; `{prompt}` is replaced by the encoded prompt. */
    assistants?: Record<string, string>
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<ArticleBodySectionProps>(), {
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

  const { t } = useTranslate({ common: en.common })

  const TRIP_LINE = 120

  const proseEl = ref<HTMLElement | null>(null)

  const spiedId = ref('')

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'article-body-section'
  )

  const blocks = computed<ArticleBodySectionBlock[]>(() => parseArticleBody(props.body))

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

  const isRemote = (href: string): boolean => /^https?:/.test(href)

  const hasRail = computed(() => Boolean(props.share || props.community || props.copyPage))

  const parentCrumb = computed(() =>
    [...props.trail].reverse().find((crumb) => !crumb.active && safeHref(crumb.href) !== null)
  )

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

  const BACK_LINK_CLASS =
    'inline-flex min-h-10 items-center gap-(--spacing-2xs) self-start rounded-(--shape-control) text-body-sm text-(--text-muted) no-underline ' +
    'transition-colors duration-150 ease-out hover:text-(--text-default) motion-reduce:transition-none ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) sm:hidden'

  const ARTICLE_GRID_CLASS =
    'grid gap-(--spacing-xl) p-(--spacing-xl) pb-(--spacing-2xl) lg:grid-cols-[minmax(var(--size-44),1fr)_minmax(0,var(--container-2xl))_minmax(var(--size-44),1fr)] ' +
    'lg:grid-rows-[auto_auto_1fr]'
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
    :data-testid="testId"
  >
    <Container max-width="site">
      <Module
        :divided="false"
        :padded="false"
      >
        <RegistrationFrame
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
        </RegistrationFrame>
        <RegistrationFrame
          flush
          borders="y"
          marks="all"
        >
          <div :class="ARTICLE_GRID_CLASS">
            <header class="flex min-w-0 flex-col gap-(--spacing-lg) lg:col-start-2">
              <Breadcrumb
                v-if="trail.length > 0"
                :items="trail"
                :class="parentCrumb ? 'max-sm:hidden' : undefined"
              />
              <a
                v-if="parentCrumb"
                :href="safeHref(parentCrumb.href) ?? undefined"
                :data-testid="`${testId}__back`"
                :class="BACK_LINK_CLASS"
              >
                <i
                  class="az az-chevron-left"
                  aria-hidden="true"
                />
                {{ parentCrumb.label }}
              </a>
              <HeroTitle
                :eyebrow="eyebrow"
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
                    variant="circle"
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

            <ArticleBodySectionOutline
              v-if="headings.length > 0"
              :items="headings"
              :active-id="activeId"
              @select="goToHeading"
            />

            <article
              ref="proseEl"
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
                          >{{ run.text
                          }}<span
                            v-if="isRemote(run.href)"
                            class="sr-only"
                            >{{ ' ' + t('common.newTab') }}</span
                          ></a
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
                        >{{ run.text
                        }}<span
                          v-if="isRemote(run.href)"
                          class="sr-only"
                          >{{ ' ' + t('common.newTab') }}</span
                        ></a
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

            <ArticleBodySectionShareRail
              v-if="hasRail"
              :article="article"
              :body="body"
              :share="share"
              :community="community"
              :copy-page="copyPage"
              :assistants="assistants"
            />

            <aside
              v-if="headings.length > 0"
              class="hidden lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:block"
            >
              <div
                class="sticky top-[calc(3.5rem+var(--spacing-xl))] max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] overflow-y-auto pb-(--spacing-lg)"
              >
                <DocTableOfContents
                  :items="headings"
                  :active-id="activeId"
                  @select="goToHeading"
                />
              </div>
            </aside>
          </div>
        </RegistrationFrame>
      </Module>
    </Container>
  </div>
</template>
