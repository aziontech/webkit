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
    <component
      :is="linked ? 'a' : 'div'"
      :href="linked ? href : undefined"
      :data-linked="linked || null"
      :data-testid="`${testId}__row`"
      class="group mx-[calc((var(--spacing-xs)+1px)*-1)] flex min-h-11 items-center gap-(--spacing-md) rounded-(--shape-card) border border-transparent p-(--spacing-xs) transition-colors duration-fast-02 ease-productive-entrance focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) focus-visible:outline-none data-[linked]:hover:border-(--border-default) data-[linked]:hover:bg-(--bg-hover) motion-reduce:transition-none"
      @click="onClick"
    >
      <span
        class="flex size-10 shrink-0 items-center border border-dashed border-(--border-default) p-(--spacing-xxs)"
        aria-hidden="true"
      >
        <span class="flex size-full items-center justify-center bg-(--bg-surface-raised)">
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
