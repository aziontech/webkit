<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
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
    click: [event: MouseEvent]
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

    emit('click', event)
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
          'group/breadcrumb-item relative inline-flex min-h-10 shrink-0 items-center justify-center',
          'gap-[var(--spacing-2)] rounded-[var(--shape-elements)] px-[var(--spacing-2)] py-[var(--spacing-1)]',
          'text-label-lg transition-colors duration-150 ease-out motion-reduce:transition-none',
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
      class="relative z-[1] size-[0.875rem] shrink-0 text-[length:inherit] leading-none"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <span
      class="relative z-[1] whitespace-nowrap"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>
  </component>
</template>
