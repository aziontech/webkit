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
      /** Pads the content region. Set false for flush, edge-to-edge content such as an ItemList with full-width dividers. */
      padded?: boolean
    }>(),
    {
      title: '',
      padded: true
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
      'bg-(--bg-surface)',
      'border border-(length:--border-width-default) border-(--border-default)',
      'rounded-(--shape-card)',
      attrs.class as string | undefined
    )
  )

  // One inset for the whole card. The header's horizontal padding matches the
  // content's `p-(--spacing-md)` and the footer's `px-(--spacing-md)`, so the title
  // sits on the same vertical line as the first thing under it — and, in a flush
  // card, as the rows of whatever fills it (an ItemList, an Accordion and a LogView
  // are all inset `--spacing-md`). It used to be `--spacing-sm`, which put every
  // card header 4px left of its own body.
  const headerClasses =
    'group flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)'

  const titleClasses = 'text-label-md text-(--text-default)'

  const contentClasses = 'flex min-h-0 flex-1 flex-col data-[padded]:p-(--spacing-md)'

  const footerClasses =
    'flex min-h-14 shrink-0 items-center justify-center gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm)'
</script>

<template>
  <section
    v-bind="$attrs"
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
      :data-padded="props.padded || null"
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
