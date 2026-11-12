<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  defineOptions({
    name: 'Citation',
    inheritAttrs: false
  })

  interface Props {
    /** 1-based number of the source, in the order the response first cites it. */
    index: number
    /** Title of the source, shown in the tooltip and read in the accessible name. */
    title?: string
    /** Where the reference points: `#<anchor>-source-<n>` for the `Sources` list under the response, or the source URL. Without it the number is plain text. */
    href?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    href: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ citation: en.citation })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'ai-citation'
  )
  const label = computed<string>(() =>
    props.title
      ? t('citation.label', { index: props.index, title: props.title })
      : t('citation.labelUntitled', { index: props.index })
  )
  const external = computed<boolean>(() => /^https?:\/\//i.test(props.href))
</script>

<template>
  <Tooltip
    :text="title || label"
    :disabled="!title"
  >
    <a
      v-if="href"
      v-bind="$attrs"
      :href="href"
      :target="external ? '_blank' : undefined"
      :rel="external ? 'noopener noreferrer' : undefined"
      :aria-label="label"
      :data-testid="testId"
      class="mx-0.5 inline-flex min-w-4 items-center justify-center rounded-(--shape-elements) bg-(--bg-surface-raised) px-1 align-super text-label-sm leading-none text-(--text-link) no-underline transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
    >
      {{ index }}
    </a>
    <span
      v-else
      v-bind="$attrs"
      :aria-label="label"
      role="note"
      :data-testid="testId"
      class="mx-0.5 inline-flex min-w-4 items-center justify-center rounded-(--shape-elements) bg-(--bg-surface-raised) px-1 align-super text-label-sm leading-none text-(--text-muted)"
    >
      {{ index }}
    </span>
  </Tooltip>
</template>
