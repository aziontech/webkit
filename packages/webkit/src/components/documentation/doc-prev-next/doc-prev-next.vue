<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'

  /**
   * The previous / next pair closing a docs page. A side with no destination
   * leaves its half of the row empty, so the remaining link stays on its edge.
   */
  defineOptions({ name: 'DocPrevNext', inheritAttrs: false })

  /** A neighbouring page. */
  export type DocPrevNextLink = {
    /** The text of the link: the page title. */
    label: string
    /** The destination. */
    href: string
  }

  export interface DocPrevNextProps {
    /** The page before this one. */
    previous?: DocPrevNextLink | null
    /** The page after this one. */
    next?: DocPrevNextLink | null
    /** Eyebrow over the previous link. Empty uses the locale catalog (`Previous`). */
    previousLabel?: string
    /** Eyebrow over the next link. Empty uses the locale catalog (`Next`). */
    nextLabel?: string
  }

  withDefaults(defineProps<DocPrevNextProps>(), {
    previous: null,
    next: null,
    previousLabel: '',
    nextLabel: ''
  })

  const emit = defineEmits<{
    /** Fired when either neighbour is activated. */
    navigate: [event: MouseEvent, page: DocPrevNextLink]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ docPrevNext: en.docPrevNext })

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-prev-next')

  const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? t('docPrevNext.label'))
</script>

<template>
  <nav
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="ariaLabel"
    class="flex w-full items-start justify-between gap-(--spacing-md)"
  >
    <a
      v-if="previous"
      :href="previous.href"
      :data-testid="`${testId}__previous`"
      class="group flex flex-col items-start gap-(--spacing-2xs) rounded-(--shape-control) p-(--spacing-xs) no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="emit('navigate', $event, previous)"
    >
      <span class="ps-5 text-label-sm text-(--text-muted)">{{
        previousLabel || t('docPrevNext.previous')
      }}</span>
      <span class="flex items-center gap-(--spacing-2xs)">
        <i
          class="ai ai-chevron-left size-4 text-label-sm text-(--text-default) transition-[translate] duration-150 ease-out group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100"
          aria-hidden="true"
        />
        <span class="text-label-md text-(--text-default)">{{ previous.label }}</span>
      </span>
    </a>
    <span v-else />
    <a
      v-if="next"
      :href="next.href"
      :data-testid="`${testId}__next`"
      class="group flex flex-col items-end gap-(--spacing-2xs) rounded-(--shape-control) p-(--spacing-xs) no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="emit('navigate', $event, next)"
    >
      <span class="pe-5 text-label-sm text-(--text-muted)">{{
        nextLabel || t('docPrevNext.next')
      }}</span>
      <span class="flex items-center gap-(--spacing-2xs)">
        <span class="text-label-md text-(--text-default)">{{ next.label }}</span>
        <i
          class="ai ai-chevron-right size-4 text-label-sm text-(--text-default) transition-[translate] duration-150 ease-out group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 motion-reduce:transition-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </span>
    </a>
    <span v-else />
  </nav>
</template>
