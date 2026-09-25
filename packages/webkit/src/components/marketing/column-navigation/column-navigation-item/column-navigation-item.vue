<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ColumnNavigationItem',
    inheritAttrs: false
  })

  /** What a row hands its click listener, so a consumer can route without reading the DOM. */
  export interface ColumnNavigationItemTarget {
    /** The destination's name. */
    title: string
    /** The destination. */
    href: string
  }

  interface Props {
    /** Icon-font class for the destination's glyph. */
    icon?: string
    /** The destination's name, the row's first line. */
    title?: string
    /** One line of what the destination is. */
    description?: string
    /** The destination; empty renders a row that is not a link. */
    href?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    icon: '',
    title: '',
    description: '',
    href: ''
  })

  const emit = defineEmits<{
    click: [event: MouseEvent, item: ColumnNavigationItemTarget]
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-column-navigation-item'
  )

  const linked = computed(() => props.href.length > 0)

  const onClick = (event: MouseEvent) => {
    if (!linked.value) return
    emit('click', event, { title: props.title, href: props.href })
  }
</script>

<template>
  <li
    v-bind="$attrs"
    :data-testid="testId"
  >
    <!-- The hover plate is pulled past the text by the row's own padding PLUS its 1px
         border, which is what keeps the glyph on the heading's column. Leave the border
         out of that sum and every row sits 1px right of the column it belongs to. -->
    <component
      :is="linked ? 'a' : 'div'"
      :href="linked ? href : undefined"
      :data-linked="linked || null"
      :data-testid="`${testId}__row`"
      class="group mx-[calc((var(--spacing-xs)+1px)*-1)] flex min-h-11 items-center gap-(--spacing-md) rounded-(--shape-card) border border-transparent p-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) focus-visible:outline-none data-[linked]:hover:border-(--border-default) data-[linked]:hover:bg-(--bg-hover) motion-reduce:transition-none"
      @click="onClick"
    >
      <!-- The registration frame: a dashed hairline with a 4px inset, the marker the rest
           of the page language draws around a placed element. It holds still under the
           pointer — the plate behind the row is what answers it. -->
      <span
        class="flex shrink-0 items-center border border-dashed border-(--border-default) p-(--spacing-xxs)"
        aria-hidden="true"
      >
        <span class="flex size-[30px] items-center justify-center bg-(--bg-surface-raised)">
          <!-- The group condition goes INSIDE the bracket. Chaining two group variants
               (group-data-[linked]:group-hover:) compiles to two separate ancestors and
               only matches a row nested in a second group — silently never here. -->
          <i
            v-if="icon"
            :class="icon"
            class="text-body-md text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance group-[[data-linked]:hover]:text-(--primary) motion-reduce:transition-none"
          />
        </span>
      </span>

      <span class="flex min-w-0 flex-1 flex-col justify-center gap-(--spacing-xxs) break-words">
        <span
          :data-testid="`${testId}__title`"
          class="text-label-sm text-(--text-default)"
          >{{ title }}</span
        >
        <span
          v-if="description"
          :data-testid="`${testId}__description`"
          class="text-body-xs text-(--text-muted)"
          >{{ description }}</span
        >
      </span>
    </component>
  </li>
</template>
