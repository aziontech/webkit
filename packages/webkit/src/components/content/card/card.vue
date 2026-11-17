<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import { cn } from '../../../utils/cn'

  defineOptions({
    name: 'Card',
    inheritAttrs: false
  })

  export interface CardProps {
    /** Heading rendered in the header when the `header` slot is empty. */
    title?: string
    /** Pads the content region. Set false for flush, edge-to-edge content such as an ItemList with full-width dividers. */
    padded?: boolean
  }

  const props = withDefaults(defineProps<CardProps>(), {
    title: '',
    padded: true
  })

  defineSlots<{
    /** Replaces the default header layout (title + header-actions). */
    header(): unknown
    /** Actions aligned to the end of the default header; visible on header hover. */
    'header-actions'(): unknown
    /** Main card body. */
    default(): unknown
    /** Footer actions or metadata; omitted when empty. */
    footer(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'card')

  const hasHeaderSlot = () => Boolean(slots['header'])
  const hasHeaderActionsSlot = () => Boolean(slots['header-actions'])
  const hasFooterSlot = () => Boolean(slots['footer'])
  const hasContentSlot = () => Boolean(slots['default'])

  const showHeaderRegion = () =>
    hasHeaderSlot() || hasHeaderActionsSlot() || Boolean(props.title?.trim())

  const showDefaultHeader = () => showHeaderRegion() && !hasHeaderSlot()
</script>

<template>
  <section
    v-bind="$attrs"
    :class="
      cn(
        'flex flex-col overflow-clip bg-(--bg-surface) border border-(length:--border-width-default) border-(--border-default) rounded-(--shape-card)',
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
  >
    <header
      v-if="showHeaderRegion()"
      class="group flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) [&:has(+:empty:not([data-padded]))]:border-b-0 px-(--spacing-md) py-(--spacing-sm)"
      :data-testid="`${testId}__header`"
    >
      <slot
        v-if="hasHeaderSlot()"
        name="header"
      />
      <template v-else-if="showDefaultHeader()">
        <h2
          v-if="title"
          class="text-label-md text-(--text-default)"
          :data-testid="`${testId}__title`"
        >
          {{ title }}
        </h2>
        <div
          v-if="hasHeaderActionsSlot()"
          class="ms-auto opacity-0 transition-opacity motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100"
          :data-testid="`${testId}__header-actions`"
        >
          <slot name="header-actions" />
        </div>
      </template>
    </header>

    <div
      class="@container/card relative flex min-h-0 flex-1 flex-col not-data-[padded]:empty:hidden data-[padded]:p-(--spacing-md)"
      :data-padded="props.padded || null"
      :data-testid="`${testId}__content`"
    >
      <slot v-if="hasContentSlot()" />
    </div>

    <footer
      v-if="hasFooterSlot()"
      class="flex min-h-14 shrink-0 items-center justify-center gap-(--spacing-sm) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
      :data-testid="`${testId}__footer`"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>
