<script setup lang="ts">
  import { computed } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { copyText } from '../../../../utils/clipboard'
  import { safeHref } from '../../../../utils/safe-href'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import SplitButton, { type SplitButtonItem } from '../../../action/split-button/split-button.vue'
  import { toast } from '../../../feedback/toast/composables/use-toast-store'
  import Tooltip from '../../../overlay/tooltip/tooltip.vue'
  import type {
    ArticleBodySectionArticle,
    ArticleBodySectionCommunity,
    ArticleBodySectionCopyPage,
    ArticleBodySectionShare
  } from '../article-body-section.vue'

  defineOptions({ name: 'ArticleBodySectionShareRail', inheritAttrs: false })

  const props = defineProps<{
    article: ArticleBodySectionArticle
    body: string
    share: ArticleBodySectionShare | undefined
    community: ArticleBodySectionCommunity | undefined
    copyPage: ArticleBodySectionCopyPage | undefined
    assistants: Record<string, string>
  }>()

  const { t } = useTranslate({ articleBodySection: en.articleBodySection })

  const RAIL_CLASS =
    'flex flex-col gap-(--spacing-xl) lg:sticky lg:top-[calc(3.5rem+var(--spacing-xl))] lg:max-h-[calc(100dvh-3.5rem-var(--spacing-xl))] lg:overflow-y-auto lg:pb-(--spacing-lg)'

  const shareX = computed(
    () => `https://x.com/intent/tweet?url=${props.article.href}&via=aziontech`
  )

  const shareLinkedIn = computed(
    () =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(props.article.href)}`
  )

  const hasFeed = computed(() => Boolean(props.share?.copyFeed && props.share?.feed))

  const isExternal = (href: string): boolean => !href.startsWith('/')

  const pageUrl = (): string => globalThis.location?.href || props.article.href

  const pageMarkdown = (): string =>
    [`# ${props.article.title}`, props.article.description ?? '', props.body]
      .filter((part) => part)
      .join('\n\n')

  const copy = async (message: string, text: string): Promise<void> => {
    if (!(await copyText(text))) {
      toast.error(t('articleBodySection.copyFailed'), {
        description: t('articleBodySection.copyFailedHint')
      })
      return
    }
    toast.success(message)
  }

  const copyLink = (): void => {
    void copy(props.share?.copiedLink || t('articleBodySection.linkCopied'), pageUrl())
  }

  const copyFeed = (): void => {
    void copy(
      props.share?.copiedFeed || t('articleBodySection.copiedFeed'),
      props.share?.feed ?? ''
    )
  }

  const copyBody = (): void => {
    void copy(props.share?.copiedPage || t('articleBodySection.copiedPage'), pageMarkdown())
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
    const prompt = encodeURIComponent(
      t('articleBodySection.assistantPrompt', { url: props.article.href })
    )
    const url = safeHref(template.replace('{prompt}', prompt))
    if (url) window.open(url, '_blank', 'noopener')
  }

  const COMMUNITY_LINK_CLASS =
    'flex items-center gap-(--spacing-sm) rounded-(--shape-flat) py-(--spacing-2xs) text-body-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance ' +
    'hover:text-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <aside
    :aria-label="share?.title || community?.title || copyPage?.label"
    data-slot="share-rail"
    class="min-w-0 max-lg:border-t max-lg:border-(--border-default) max-lg:pt-(--spacing-xl) lg:col-start-1 lg:row-span-3 lg:row-start-1"
  >
    <div :class="RAIL_CLASS">
      <section
        v-if="share"
        class="flex flex-col gap-(--spacing-sm)"
        :aria-label="share.title"
      >
        <p class="m-0 text-heading-xs text-(--text-default)">{{ share.title }}</p>
        <div class="flex flex-wrap items-center gap-(--spacing-sm)">
          <Tooltip :content="share.copyLink">
            <IconButton
              variant="outline"
              size="medium"
              icon="az az-link"
              :ariaLabel="share.copyLink"
              @click="copyLink"
            />
          </Tooltip>
          <Tooltip
            v-if="hasFeed"
            :content="share.copyFeed ?? ''"
          >
            <IconButton
              variant="outline"
              size="medium"
              icon="az az-rss"
              :ariaLabel="share.copyFeed ?? ''"
              @click="copyFeed"
            />
          </Tooltip>
          <Tooltip :content="share.shareX">
            <IconButton
              variant="outline"
              size="medium"
              icon="az az-x-brand"
              :ariaLabel="share.shareX"
              :href="shareX"
              target="_blank"
            />
          </Tooltip>
          <Tooltip :content="share.shareLinkedIn">
            <IconButton
              variant="outline"
              size="medium"
              icon="az az-linkedin"
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
              :href="safeHref(link.href) ?? undefined"
              :target="isExternal(link.href) ? '_blank' : undefined"
              :rel="isExternal(link.href) ? 'noopener' : undefined"
              :class="COMMUNITY_LINK_CLASS"
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
        variant="outline"
        size="medium"
        icon="az az-copy"
        :label="copyPage.label"
        :items="copyPage.menu"
        class="self-start"
        @click="copyBody"
        @item-click="onMenu"
      />
    </div>
  </aside>
</template>
