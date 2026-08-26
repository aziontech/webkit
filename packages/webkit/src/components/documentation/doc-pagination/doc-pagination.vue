<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /**
   * The previous / next pair that closes every documentation page. Each side is
   * a link carrying an eyebrow and the destination's title; a side with no
   * destination simply leaves its half of the row empty, so the remaining link
   * stays anchored to its edge.
   */
  defineOptions({ name: 'DocPagination', inheritAttrs: false })

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

  const attrs = useAttrs()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-pagination')

  /*
   * The landmark's name has to be overridable, and a static attribute after
   * `v-bind="$attrs"` would win over the consumer's instead of losing to it. Two
   * nav landmarks sharing one accessible name is an axe `landmark-unique`
   * violation, so a page that genuinely carries two paginations must be able to
   * tell them apart.
   */
  const ariaLabel = computed(() => (attrs['aria-label'] as string) ?? 'Page navigation')
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
      class="group flex flex-col items-start gap-(--spacing-xxs) rounded-(--shape-elements) p-(--spacing-xs) no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="emit('navigate', $event, previous)"
    >
      <span class="pl-5 text-label-sm text-(--text-muted)">{{ previousLabel }}</span>
      <span class="flex items-center gap-(--spacing-xxs)">
        <i
          class="pi pi-chevron-left size-4 text-label-sm text-(--text-default) transition-[translate] duration-150 ease-out group-hover:-translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
        <span class="text-label-md text-(--text-default)">{{ previous.title }}</span>
      </span>
    </a>
    <span v-else />
    <a
      v-if="next"
      :href="next.href"
      :data-testid="`${testId}__next`"
      class="group flex flex-col items-end gap-(--spacing-xxs) rounded-(--shape-elements) p-(--spacing-xs) no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
      @click="emit('navigate', $event, next)"
    >
      <span class="pr-5 text-label-sm text-(--text-muted)">{{ nextLabel }}</span>
      <span class="flex items-center gap-(--spacing-xxs)">
        <span class="text-label-md text-(--text-default)">{{ next.title }}</span>
        <i
          class="pi pi-chevron-right size-4 text-label-sm text-(--text-default) transition-[translate] duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </span>
    </a>
    <span v-else />
  </nav>
</template>
