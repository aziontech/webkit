<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import DocTableOfContents, {
    type DocTableOfContentsGroup,
    type DocTableOfContentsItem
  } from '../../doc-table-of-contents/doc-table-of-contents.vue'

  defineOptions({ name: 'DocLayoutOutlineDisclosure', inheritAttrs: false })

  interface DocLayoutOutlineDisclosureProps {
    /** The registered headings, in document order. */
    items: DocTableOfContentsItem[]
    /** Complementary link groups under the outline. */
    groups: DocTableOfContentsGroup[]
    /** Id of the heading in view. */
    activeId: string
  }

  defineProps<DocLayoutOutlineDisclosureProps>()

  const emit = defineEmits<{
    /** An outline entry was chosen. */
    select: [event: MouseEvent, item: DocTableOfContentsItem]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ docTableOfContents: en.docTableOfContents })
  const detailsEl = ref<HTMLDetailsElement | null>(null)

  const testId = computed(() => String(attrs['data-testid'] ?? 'doc-layout-outline-disclosure'))

  const onSelect = (event: MouseEvent, item: DocTableOfContentsItem) => {
    if (detailsEl.value) detailsEl.value.open = false
    emit('select', event, item)
  }

  const SUMMARY_CLASS =
    'flex min-h-10 cursor-pointer list-none items-center justify-between gap-(--spacing-xs) rounded-(--shape-control) text-label-md text-(--text-default) ' +
    'pointer-coarse:min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) [&::-webkit-details-marker]:hidden'
</script>

<template>
  <details
    ref="detailsEl"
    v-bind="$attrs"
    :data-testid="testId"
    class="group/outline border-b border-(--border-default) px-(--layout-boundary-inline) py-(--spacing-2xs)"
  >
    <summary :class="SUMMARY_CLASS">
      {{ t('docTableOfContents.title') }}
      <i
        class="az az-chevron-down text-(--text-muted) transition-[rotate] duration-fast-02 ease-productive-entrance group-open/outline:rotate-180 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </summary>
    <DocTableOfContents
      :items="items"
      :groups="groups"
      :active-id="activeId"
      class="pt-(--spacing-xs) pb-(--spacing-sm) [&_[data-toc-title]]:hidden"
      @select="onSelect"
    />
  </details>
</template>
