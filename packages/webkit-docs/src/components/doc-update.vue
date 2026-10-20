<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'
  import { computed, useAttrs } from 'vue'

  import { useHeadingNav } from '../lib/heading-nav'
  import { slugify } from '../lib/mdx'

  defineOptions({ name: 'DocUpdate', inheritAttrs: false })

  interface Props {
    /** The entry's name — a date, a release name. Also its anchor. */
    label?: string
    /** The release's heading, shown above the notes. The label becomes the date beside it. */
    title?: string
    /** Secondary line under the label; usually the version. */
    description?: string
    /** Short labels categorising the entry: a product, an area, a kind of change. */
    tags?: string[]
    /** Anchor override. The parser sets it when two entries share a label. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    title: '',
    description: '',
    tags: () => [],
    anchor: ''
  })

  defineSlots<{
    /** The release notes: prose, lists, code, or any documentation component. */
    default(): unknown
  }>()

  const nav = useHeadingNav()
  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-update')

  const anchorId = computed(
    () => props.anchor || slugify(props.title ? `${props.label} ${props.title}` : props.label)
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchorId"
    data-doc-block
    data-doc-update
    :data-titled="title ? '' : null"
    :data-testid="testId"
    :aria-labelledby="`${anchorId}-label`"
    class="flex w-full scroll-mt-(--spacing-lg) flex-col gap-(--spacing-sm) md:flex-row md:gap-(--spacing-lg)"
  >
    <div
      data-doc-chrome
      class="flex shrink-0 flex-col items-start gap-(--spacing-xxs) md:sticky md:top-(--spacing-lg) md:self-start md:w-40"
    >
      <div
        v-if="title"
        class="flex min-h-[1lh] items-center text-heading-md"
      >
        <span class="whitespace-nowrap text-heading-xxs text-(--text-default)">{{ label }}</span>
      </div>
      <h2
        v-else
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
        class="text-label-code-sm text-(--text-muted)"
        >{{ description }}</span
      >
      <div
        v-if="tags.length && !title"
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
      class="relative min-w-0 flex-1 md:border-l md:border-(--border-default) md:pl-(--spacing-lg) md:data-titled:pl-(--spacing-xl) md:[[data-doc-update]+[data-doc-update]_&]:-mt-6 md:[[data-doc-update]+[data-doc-update]_&]:pt-6 data-titled:[[data-doc-update]:has(+[data-doc-update])_&]:pb-(--spacing-xl) [&>*:first-child]:pt-0!"
      :data-titled="title ? '' : null"
    >
      <div
        v-if="title"
        data-doc-chrome
        class="relative flex flex-col items-start gap-(--spacing-md) pb-(--spacing-lg)"
      >
        <span
          aria-hidden="true"
          class="absolute top-[0.5lh] left-[calc(var(--spacing-xl)*-1)] hidden size-3 -translate-x-1/2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-strong) bg-(--bg-canvas) text-heading-md md:block"
        />
        <h2
          :id="`${anchorId}-label`"
          class="text-heading-xl text-(--text-default) sm:text-heading-md"
        >
          <a
            :href="`#${anchorId}`"
            data-doc-anchor
            class="group/anchor rounded-(--shape-flat) text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)"
            @click="nav($event, { id: anchorId })"
          >
            <span
              class="underline-offset-4 decoration-(--border-strong) group-hover/anchor:underline"
              >{{ title }}</span
            >
            <i
              class="pi pi-link ml-(--spacing-xs) align-middle text-label-md text-(--text-muted) opacity-0 transition-opacity duration-150 ease-out group-hover/anchor:opacity-100 group-focus-visible/anchor:opacity-100 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </a>
        </h2>
        <div
          v-if="tags.length"
          class="flex flex-wrap gap-(--spacing-xs)"
        >
          <Tag
            v-for="tag in tags"
            :key="tag"
            :label="tag"
            severity="secondary"
            size="medium"
          />
        </div>
      </div>
      <div class="[&>*:first-child]:pt-0!">
        <slot />
      </div>
    </div>
  </section>
</template>
