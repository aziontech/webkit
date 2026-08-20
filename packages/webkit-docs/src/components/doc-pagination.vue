<script setup lang="ts">
  /**
   * The previous / next pair that closes every documentation page. Each side is
   * a link carrying an eyebrow and the destination's title; a side with no
   * destination simply leaves its half of the row empty, so the remaining link
   * stays anchored to its edge.
   */
  defineOptions({ name: 'DocPagination' })

  /** A neighbouring page. */
  export type DocPageLink = {
    /** The page title shown on the link. */
    title: string
    /** The destination. */
    href: string
  }

  interface Props {
    /** The page before this one. */
    previous?: DocPageLink | null
    /** The page after this one. */
    next?: DocPageLink | null
    /** Eyebrow over the previous link. */
    previousLabel?: string
    /** Eyebrow over the next link. */
    nextLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    previous: null,
    next: null,
    previousLabel: 'Previous',
    nextLabel: 'Next'
  })

  const emit = defineEmits<{
    /** Fired when either neighbour is activated. */
    navigate: [event: MouseEvent, page: DocPageLink]
  }>()
</script>

<template>
  <nav
    data-testid="doc-pagination"
    aria-label="Page navigation"
    class="flex w-full items-start justify-between gap-(--spacing-md)"
  >
    <a
      v-if="previous"
      :href="previous.href"
      data-testid="doc-pagination-previous"
      class="group flex flex-col items-start gap-(--spacing-xxs) rounded-(--shape-elements) p-(--spacing-xs) no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="emit('navigate', $event, previous)"
    >
      <span class="pl-5 text-label-sm text-(--text-muted)">{{ previousLabel }}</span>
      <span class="flex items-center gap-(--spacing-xxs)">
        <i
          class="pi pi-chevron-left size-4 text-label-sm text-(--text-default) transition-transform duration-150 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
        <span class="text-label-md text-(--text-default)">{{ previous.title }}</span>
      </span>
    </a>
    <span v-else />
    <a
      v-if="next"
      :href="next.href"
      data-testid="doc-pagination-next"
      class="group flex flex-col items-end gap-(--spacing-xxs) rounded-(--shape-elements) p-(--spacing-xs) no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="emit('navigate', $event, next)"
    >
      <span class="pr-5 text-label-sm text-(--text-muted)">{{ nextLabel }}</span>
      <span class="flex items-center gap-(--spacing-xxs)">
        <span class="text-label-md text-(--text-default)">{{ next.title }}</span>
        <i
          class="pi pi-chevron-right size-4 text-label-sm text-(--text-default) transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </span>
    </a>
    <span v-else />
  </nav>
</template>
