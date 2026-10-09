<script setup>
  // One success story as the blog's stacked post card, for a story article's related row. The
  // stories carry no cover image, so the 16:9 media slot holds the client's mark instead; the
  // whole card is the link.
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed } from 'vue'

  import { successCaseLink } from '../data/success-case-articles.js'

  const props = defineProps({
    /** The story, as successCaseArticle returns it. */
    story: { type: Object, required: true }
  })

  const link = computed(() => successCaseLink(props.story))
</script>

<template>
  <a
    :href="link.href"
    :target="link.external ? '_blank' : undefined"
    :rel="link.external ? 'noopener' : undefined"
    class="group/post flex h-full flex-col transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <span
      class="flex aspect-video items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface)"
    >
      <ClientMark
        :client="story.client"
        monochrome
        mark="h-8 w-auto max-w-40 object-contain transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/post:scale-105 motion-reduce:transition-none"
      />
    </span>
    <span class="flex flex-1 flex-col gap-(--spacing-sm) p-(--spacing-xl)">
      <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
        {{ story.title }}
      </h3>
      <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
        {{ story.description }}
      </p>
      <p class="m-0 mt-auto pt-(--spacing-sm) text-overline-sm text-(--text-muted)">
        {{ story.date }} • {{ story.readTime }}
      </p>
    </span>
  </a>
</template>
