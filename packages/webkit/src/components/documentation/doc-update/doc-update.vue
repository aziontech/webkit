<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useHeadingNav } from '../../../composables/use-heading-nav/index'
  import Tag from '../../tag/tag.vue'
  import { slugify } from './slugify'

  /**
   * One entry in a changelog: what shipped, when, and under which version.
   *
   * The anatomy is two columns — the entry's identity on the left (the date, the
   * version under it, the tags under that), the release notes on the right — and
   * a rule between them that runs the length of the entry. A changelog is read
   * the way a timeline is read, scanning the left edge for a date and stopping
   * where something looks relevant, so the label column is the only thing that
   * has to be legible at scanning speed and the notes are ordinary prose.
   *
   * THE LABEL IS THE ANCHOR. Every entry is a URL someone links to — a support
   * reply, a release tweet, an issue that says "fixed in the March release" — so
   * the label is a link to its own id, derived from the label itself, carrying
   * the same hover rule and chain glyph a heading carries. It is an `h2` for the
   * same reason it is an anchor: an entry is a section of the page, and the
   * outline should say so.
   *
   * THE LABEL COLUMN STICKS while its notes scroll past. An entry can be long,
   * and a reader halfway down a set of release notes has no way back to which
   * release they are in — the date pinned beside the prose is that answer, kept
   * where they are already looking.
   *
   * THE RULE BRIDGES THE GAP BETWEEN CONSECUTIVE ENTRIES. Block rhythm puts
   * 24px between blocks, which would cut the rule into one segment per entry and
   * make a continuous timeline read as a dashed one — so an entry that FOLLOWS
   * another extends its column up through that gap and pads the content back
   * down. The first entry does not, which is what keeps the line from starting
   * above the changelog.
   *
   * NO RSS. Mintlify's Update component also takes an `rss` prop, because
   * Mintlify generates the feed. This layer renders pages and generates nothing,
   * so the prop would be inert — an entry in the API that quietly does nothing
   * is worse than an absence. Feed generation belongs to whatever builds the
   * site.
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
    <!-- CHROME, NOT PROSE. The column is a label, a version and a row of tags —
         none of it is the document's copy, so `DocProse` has to keep its hands
         off the `h2` it would otherwise size at 32px and space by 40px. -->
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
    <div
      class="min-w-0 flex-1 md:border-l md:border-(--border-default) md:pl-(--spacing-lg) md:[[data-doc-update]+[data-doc-update]_&]:-mt-6 md:[[data-doc-update]+[data-doc-update]_&]:pt-6 [&>*:first-child]:pt-0!"
    >
      <slot />
    </div>
  </section>
</template>
