<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import CopyButton from '../../action/copy-button/copy-button.vue'

  /** Heading scale: medium for a band heading, small for the smallest heading, a band nested inside another. */
  export type SubheaderSize = 'small' | 'medium'

  defineOptions({
    name: 'Subheader',
    inheritAttrs: false
  })

  export interface SubheaderProps {
    /** The band title, rendered as an h2. */
    title: string
    /** One sentence under the title. */
    description?: string
    /** Heading scale of the title. */
    size?: SubheaderSize
    /** Id of the h2 that a hash link targets; when set, a copy-link button appears beside the title on hover or focus. */
    anchor?: string
  }

  const props = withDefaults(defineProps<SubheaderProps>(), {
    description: '',
    size: 'medium',
    anchor: ''
  })

  defineSlots<{
    /** Rich description content (links, inline code); replaces the description prop. */
    description(): unknown
    /** The band's own actions, on the right of the copy. */
    actions(): unknown
    /** An affordance right after the title, outside the h2, such as a help button that opens the page's HelpPanel. */
    info(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ subheader: en.subheader })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'subheader')

  const anchorUrl = computed(() =>
    props.anchor ? `${globalThis.location?.href.split('#')[0] ?? ''}#${props.anchor}` : ''
  )

  const ANCHOR_CLASS =
    'shrink-0 opacity-0 transition-opacity duration-150 ease-out group-hover/heading:opacity-100 group-focus-within/heading:opacity-100 [@media(hover:none)]:opacity-100 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    class="group/heading @container/subheader flex flex-col"
  >
    <div class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)">
      <div class="flex min-w-0 grow flex-col gap-(--spacing-2xs)">
        <div class="flex min-w-0 items-center gap-(--spacing-2xs)">
          <h2
            :id="anchor || undefined"
            :data-testid="`${testId}__title`"
            :data-size="size"
            class="scroll-mt-(--spacing-xl) text-balance text-(--text-default) data-[size=medium]:text-heading-xs data-[size=small]:text-heading-2xs"
          >
            {{ title }}
          </h2>
          <span
            v-if="$slots['info']"
            :data-testid="`${testId}__info`"
            class="flex shrink-0 items-center"
          >
            <slot name="info" />
          </span>
          <span
            v-if="anchor"
            :class="ANCHOR_CLASS"
          >
            <CopyButton
              :value="anchorUrl"
              icon="az az-link"
              :data-testid="`${testId}__copy-link`"
              variant="ghost"
              size="small"
              :aria-label="t('subheader.copyLink', { title })"
              :copied-label="t('subheader.linkCopied')"
            />
          </span>
        </div>
        <p
          v-if="$slots['description'] || description"
          :data-testid="`${testId}__description`"
          class="text-pretty text-body-sm text-(--text-muted)"
        >
          <slot name="description">{{ description }}</slot>
        </p>
      </div>
      <div
        v-if="$slots['actions']"
        :data-testid="`${testId}__actions`"
        class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-xs) @md/subheader:w-auto @md/subheader:max-w-full"
      >
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
