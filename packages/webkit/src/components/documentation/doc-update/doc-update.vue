<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useHeadingNav } from '../../../composables/use-heading-nav/index'
  import Tag from '../../tag/tag.vue'
  import { slugify } from './slugify'

  /**
   * One changelog entry: a sticky identity column on the left, the notes on the
   * right. There is deliberately no rss prop — this layer renders pages and
   * generates nothing, so the prop would be inert, worse than an absence.
   */
  defineOptions({ name: 'DocUpdate', inheritAttrs: false })

  interface Props {
    /** The entry's name — a date, a release name. Also its anchor. */
    label?: string
    /** Secondary line under the label; usually the version. */
    description?: string
    /** Short labels categorising the entry: a product, an area, a kind of change. */
    tags?: string[]
    /** Anchor override; wins over the slug derived from the label. Set it when two entries share a label. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    description: '',
    tags: () => [],
    anchor: ''
  })

  defineSlots<{
    /** The release notes: prose, lists, code, or any documentation component. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const nav = useHeadingNav()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-update')

  const anchorId = computed(() => props.anchor || slugify(props.label))
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchorId"
    data-doc-block
    data-doc-update
    :data-testid="testId"
    :aria-labelledby="`${anchorId}-label`"
    class="flex w-full scroll-mt-(--spacing-lg) flex-col gap-(--spacing-sm) md:flex-row md:gap-(--spacing-lg)"
  >
    <!-- Chrome, not prose: data-doc-chrome keeps DocProse from restyling the label
         heading it would otherwise size and space as a section heading. -->
    <div
      data-doc-chrome
      class="flex shrink-0 flex-col items-start gap-(--spacing-xxs) md:sticky md:top-(--spacing-lg) md:w-40 md:self-start"
    >
      <h2
        :id="`${anchorId}-label`"
        class="text-heading-xs text-(--text-default)"
      >
        <a
          :href="`#${anchorId}`"
          data-doc-anchor
          class="group/anchor rounded-(--shape-flat) text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
          @click="nav($event, { id: anchorId })"
        >
          <span
            class="underline-offset-4 decoration-(--border-strong) group-hover/anchor:underline"
            >{{ label }}</span
          >
          <i
            class="pi pi-link ml-(--spacing-xs) align-middle text-label-md text-(--text-muted) opacity-0 transition-opacity duration-150 ease-out group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </a>
      </h2>
      <span
        v-if="description"
        class="text-body-xs text-(--text-muted)"
        >{{ description }}</span
      >
      <div
        v-if="tags.length"
        class="flex flex-wrap gap-(--spacing-xxs) pt-(--spacing-xxs)"
      >
        <Tag
          v-for="tag in tags"
          :key="tag"
          :label="tag"
          severity="secondary"
          size="small"
          rounded
        />
      </div>
    </div>
    <!-- An entry that follows another pulls its rule up through the 24px block gap
         and pads the content back down, so the timeline reads as one continuous
         line instead of a dashed one; the first entry does not. -->
    <div
      class="min-w-0 flex-1 md:border-l md:border-(--border-default) md:pl-(--spacing-lg) md:[[data-doc-update]+[data-doc-update]_&]:-mt-6 md:[[data-doc-update]+[data-doc-update]_&]:pt-6 [&>*:first-child]:pt-0!"
    >
      <slot />
    </div>
  </section>
</template>
