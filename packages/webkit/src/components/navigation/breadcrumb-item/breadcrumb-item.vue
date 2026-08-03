<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import {
    focusVisibleRingClasses,
    ghostLayerClasses
  } from '../../inputs/presets/interactive-states'

  defineOptions({
    name: 'BreadcrumbItem',
    inheritAttrs: false
  })

  interface Props {
    /** Visible segment label. */
    label?: string
    /** Destination when the segment is a link (ignored when `current` is true). */
    href?: string
    /** Marks the current page (last segment); renders as span with `aria-current="page"`. */
    current?: boolean
    /** When true, renders a leading PrimeIcons icon before the label. */
    showIcon?: boolean
    /** PrimeIcons class for the leading icon when `showIcon` is true. */
    icon?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: 'Page Name',
    href: '#',
    current: false,
    showIcon: false,
    icon: 'pi pi-box',
    disabled: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent, item: { label: string; href: string }]
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-breadcrumb-item'
  )

  const passthroughAttrs = computed(() => {
    const rest = { ...attrs }

    delete rest.class
    delete rest['data-testid']

    return rest
  })

  const handleClick = (event: MouseEvent) => {
    if (props.disabled) {
      event.preventDefault()
      return
    }

    emit('click', event, { label: props.label, href: props.href })
  }
</script>

<template>
  <component
    :is="current ? 'span' : 'a'"
    v-bind="passthroughAttrs"
    :href="current ? undefined : href"
    :class="
      cn(
        [
          // Block-level `flex`, not `inline-flex`: an inline-level box resolves its
          // width shrink-to-fit against its own max-content, so inside a
          // hand-composed `<li>` (which arrives with no class, hence a block) the
          // anchor stayed at its text width and spilled out of the item the row had
          // already shrunk — measured 134px of anchor inside a 92px `<li>`, with the
          // label never ellipsizing. A block-level flex box takes the width its
          // parent gives it, which is what lets the label below actually truncate.
          // In the data-driven mode the `<li>` is a flex container, so its child is
          // blockified either way and nothing changes there.
          'group/breadcrumb-item relative flex min-h-6 min-w-0 items-center justify-center',
          'gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)]',
          'text-label-md transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none',
          'text-[var(--text-muted)] hover:text-[var(--text-default)]',
          'aria-[current=page]:text-[var(--text-default)] aria-[current=page]:hover:text-[var(--text-default)]',
          'data-[current=true]:text-[var(--text-default)] data-[current=true]:hover:text-[var(--text-default)]',
          'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)]',
          ...ghostLayerClasses,
          ...focusVisibleRingClasses,
          'focus-visible:bg-[var(--bg-mask)] focus-visible:border focus-visible:border-[var(--border-default)]'
        ],
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
    :data-current="current ? 'true' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :aria-current="current ? 'page' : undefined"
    :aria-disabled="disabled ? true : undefined"
    :tabindex="current || disabled ? -1 : undefined"
    @click="handleClick"
  >
    <i
      v-if="showIcon"
      :class="icon"
      class="relative z-[1] size-[0.875rem]! shrink-0 text-[0.875rem]! leading-none"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <!-- `min-w-0` is the last link in the shrink chain. Without it the span keeps
         `min-width: auto`, refuses to go below its text width, and overflows the
         anchor instead of ellipsizing: measured 118px of text inside a 92px item,
         with no ellipsis. The list and the anchor already allow shrinking; this is
         where it stopped. -->
    <span
      class="relative z-[1] min-w-0 truncate"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>
  </component>
</template>
