<script setup>
  // One blog post as a card, shared by the index and an article's related posts. The whole
  // card is the link: to the rebuilt /site article when there is one, otherwise to azion.com.
  // No author name or photo, by design.
  import { computed } from 'vue'

  import { blogPostLink } from '../data/blog-articles.js'

  const props = defineProps({
    /** The post, as listed in data/blog.js. */
    post: { type: Object, required: true },
    /** `stacked` (image over copy) or `inset` (framed image, date first, arrow corner). */
    kind: { type: String, default: 'stacked' }
  })

  const link = computed(() => blogPostLink(props.post))
</script>

<template>
  <!-- The inset card: the image sits framed inside the cell's own inset, a rule under
       it, then date → title → summary, and an arrow square docked in the corner. The
       whole card is the link, so the arrow is decoration, not a second target. -->
  <a
    v-if="kind === 'inset'"
    :href="link.href"
    :target="link.external ? '_blank' : undefined"
    :rel="link.external ? 'noopener' : undefined"
    class="group/post relative flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
  >
    <div class="border-b border-(--border-default) p-(--spacing-md)">
      <div class="aspect-video overflow-hidden bg-(--bg-surface)">
        <img
          :src="post.image"
          alt=""
          loading="lazy"
          class="size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/post:scale-105 motion-reduce:transition-none"
        />
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-xl) pt-(--spacing-xl) pb-(--spacing-xxl)">
      <p class="m-0 text-overline-sm text-(--text-muted)">
        {{ post.date }} • {{ post.readTime }}
      </p>
      <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
        {{ post.title }}
      </h3>
      <p class="m-0 line-clamp-3 text-pretty text-body-md text-(--text-muted)">
        {{ post.description }}
      </p>
    </div>
    <span
      aria-hidden="true"
      class="ml-auto flex aspect-square items-center justify-center border-t border-l border-(--border-default) p-(--spacing-lg) text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-hover/post:bg-(--bg-surface-raised) motion-reduce:transition-none"
    >
      <i
        class="pi pi-arrow-right leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/post:translate-x-0.5 motion-reduce:transition-none"
      />
    </span>
  </a>

  <a
    v-else
    :href="link.href"
    :target="link.external ? '_blank' : undefined"
    :rel="link.external ? 'noopener' : undefined"
    class="group/post flex h-full flex-col transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
  >
    <span class="block aspect-video overflow-hidden border-b border-(--border-default) bg-(--bg-surface)">
      <img
        :src="post.image"
        alt=""
        loading="lazy"
        class="size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/post:scale-105 motion-reduce:transition-none"
      />
    </span>
    <span class="flex flex-1 flex-col gap-(--spacing-sm) p-(--spacing-xl)">
      <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
        {{ post.title }}
      </h3>
      <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
        {{ post.description }}
      </p>
      <p class="m-0 mt-auto pt-(--spacing-sm) text-overline-sm text-(--text-muted)">
        {{ post.date }} • {{ post.readTime }}
      </p>
    </span>
  </a>
</template>
