<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../utils/cn'

  defineOptions({
    name: 'CardBox',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Heading rendered in the header when the `header` slot is empty. */
      title?: string
    }>(),
    {
      title: ''
    }
  )

  defineSlots<{
    /** Replaces the default header layout (title + header-action). */
    header(): unknown
    /** Actions aligned to the end of the default header; visible on header hover. */
    'header-action'(): unknown
    /** Main card body. */
    content(): unknown
    /** Footer actions or metadata; omitted when empty. */
    footer(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-card-box')

  const hasHeaderSlot = computed(() => Boolean(slots['header']))
  const hasHeaderActionSlot = computed(() => Boolean(slots['header-action']))
  const hasFooterSlot = computed(() => Boolean(slots['footer']))
  const hasContentSlot = computed(() => Boolean(slots['content']))

  const showHeaderRegion = computed(
    () => hasHeaderSlot.value || hasHeaderActionSlot.value || Boolean(props.title?.trim())
  )

  const showDefaultHeader = computed(() => showHeaderRegion.value && !hasHeaderSlot.value)

  const rootClasses = computed(() =>
    cn(
      'flex flex-col overflow-clip',
      'bg-[var(--bg-surface)]',
      'border border-[length:var(--border-width-default)] border-[var(--border-muted)]',
      'rounded-[var(--shape-card)]',
      attrs.class as string | undefined
    )
  )

  const headerClasses =
    'group flex min-h-14 shrink-0 items-center justify-between gap-[var(--spacing-xs)] border-b border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)]'

  const titleClasses = 'text-label-md text-[var(--text-default)]'

  const contentClasses = 'flex min-h-0 flex-1 flex-col'

  const footerClasses =
    'flex min-h-14 shrink-0 items-center justify-center gap-[var(--spacing-sm)] border-t border-[var(--border-muted)] px-[var(--spacing-md)] py-[var(--spacing-sm)]'
</script>

<template>
  <section
    :class="rootClasses"
    :data-testid="testId"
  >
    <header
      v-if="showHeaderRegion"
      :class="headerClasses"
      :data-testid="`${testId}__header`"
    >
      <slot
        v-if="hasHeaderSlot"
        name="header"
      />
      <template v-else-if="showDefaultHeader">
        <h2
          v-if="title"
          :class="titleClasses"
          :data-testid="`${testId}__title`"
        >
          {{ title }}
        </h2>
        <div
          v-if="hasHeaderActionSlot"
          class="ml-auto opacity-0 transition-opacity motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100"
          :data-testid="`${testId}__header-action`"
        >
          <slot name="header-action" />
        </div>
      </template>
    </header>

    <div
      :class="contentClasses"
      :data-testid="`${testId}__content`"
    >
      <slot
        v-if="hasContentSlot"
        name="content"
      />
    </div>

    <footer
      v-if="hasFooterSlot"
      :class="footerClasses"
      :data-testid="`${testId}__footer`"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>
