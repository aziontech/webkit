<script setup lang="ts">
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import DocTableOfContents, {
    type DocTableOfContentsItem
  } from '../../../docs/doc-table-of-contents/doc-table-of-contents.vue'

  defineOptions({ name: 'ArticleBodySectionOutline', inheritAttrs: false })

  defineProps<{
    items: DocTableOfContentsItem[]
    activeId: string
  }>()

  const emit = defineEmits<{
    select: [event: MouseEvent, item: DocTableOfContentsItem]
  }>()

  const { t } = useTranslate({ docTableOfContents: en.docTableOfContents })

  const SUMMARY_CLASS =
    'flex cursor-pointer list-none items-center justify-between gap-(--spacing-sm) px-(--spacing-md) py-(--spacing-sm) text-label-md text-(--text-default) ' +
    'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--ring-color) [&::-webkit-details-marker]:hidden'
</script>

<template>
  <details
    v-bind="$attrs"
    data-slot="outline"
    class="group/outline min-w-0 rounded-(--shape-card) border border-(--border-default) lg:hidden"
  >
    <summary :class="SUMMARY_CLASS">
      {{ t('docTableOfContents.title') }}
      <i
        aria-hidden="true"
        class="az az-chevron-down leading-none transition-transform duration-moderate-01 ease-productive-entrance group-open/outline:rotate-180 motion-reduce:transition-none"
      />
    </summary>
    <div class="px-(--spacing-md) pb-(--spacing-md) [&_[data-toc-title]]:sr-only">
      <DocTableOfContents
        :items="items"
        :active-id="activeId"
        @select="(event, item) => emit('select', event, item)"
      />
    </div>
  </details>
</template>
