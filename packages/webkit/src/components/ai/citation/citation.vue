<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({
    name: 'Citation',
    inheritAttrs: false
  })

  export interface CitationProps {
    /** 1-based number of the source, in the order the response first cites it. */
    index: number
    /** Title of the source, shown in the tooltip and read in the accessible name; the chip shows it, cut to fit, when `site` is empty. */
    title?: string
    /** Site of the source without `www.` (`example.com`), the text of the chip. */
    site?: string
    /**
     * Where the reference points: `#<anchor>-source-<n>` for the `Sources` list under the response,
     * or the source URL. Without it, or when it is not a safe URL (javascript, data and other
     * script schemes), the chip is plain text.
     */
    href?: string
  }

  const props = withDefaults(defineProps<CitationProps>(), {
    title: '',
    site: '',
    href: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ citation: en.citation })

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'citation')
  const label = computed<string>(() => {
    if (props.site)
      return t('citation.labelWithSite', {
        index: props.index,
        site: props.site,
        title: props.title || props.site
      })
    return props.title
      ? t('citation.label', { index: props.index, title: props.title })
      : t('citation.labelUntitled', { index: props.index })
  })
  const text = computed<string>(() => props.site || props.title || String(props.index))
  const linkHref = computed<string | null>(() => safeHref(props.href))
  const external = computed<boolean>(() => /^https?:\/\//i.test(linkHref.value ?? ''))

  const CHIP_CLASS =
    'mx-0.5 inline-flex h-5 max-w-48 items-center rounded-full bg-(--bg-surface-raised) px-(--spacing-xs) align-middle text-label-sm text-(--text-muted) no-underline ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'data-[linked]:hover:bg-(--bg-hover) data-[linked]:hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)'
</script>

<template>
  <Tooltip
    :content="title || label"
    :disabled="!title"
  >
    <a
      v-if="linkHref"
      v-bind="$attrs"
      :href="linkHref ?? undefined"
      :target="external ? '_blank' : undefined"
      :rel="external ? 'noopener noreferrer' : undefined"
      :aria-label="label"
      :data-testid="testId"
      data-slot="citation"
      data-linked
      :class="CHIP_CLASS"
    >
      <span class="truncate">{{ text }}</span>
    </a>
    <span
      v-else
      v-bind="$attrs"
      :aria-label="label"
      role="note"
      :data-testid="testId"
      data-slot="citation"
      :class="CHIP_CLASS"
    >
      <span class="truncate">{{ text }}</span>
    </span>
  </Tooltip>
</template>
