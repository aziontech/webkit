<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { directionalIconClass } from '../../../../utils/directional-icons'

  defineOptions({
    name: 'BreadcrumbItem',
    inheritAttrs: false
  })

  interface Props {
    /** Visible segment label. */
    label?: string
    /** Destination when the segment is a link (ignored when `current` is true); empty renders `#`. */
    href?: string
    /** Marks the current page (last segment); renders as span with `aria-current="page"`. */
    current?: boolean
    /** When true, renders a leading icon before the label. */
    showIcon?: boolean
    /** Azion icon class for the leading icon when `showIcon` is true; empty shows `ai ai-box`. */
    icon?: string
    /** Disables interaction and applies disabled tokens. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    href: '',
    current: false,
    showIcon: false,
    icon: '',
    disabled: false
  })

  const emit = defineEmits<{
    click: [event: MouseEvent, item: { label: string; href: string }]
  }>()

  const attrs = useAttrs()

  const ROOT_CLASS =
    "group/breadcrumb-item relative flex min-h-6 min-w-0 items-center justify-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xxs) text-label-md transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none text-(--text-muted) hover:text-(--text-default) aria-[current=page]:text-(--text-default) aria-[current=page]:hover:text-(--text-default) data-[current=true]:text-(--text-default) data-[current=true]:hover:text-(--text-default) data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-(--bg-active) after:opacity-0 after:content-[''] after:transition-opacity after:duration-fast-02 after:ease-productive-entrance hover:before:opacity-100 active:after:opacity-100 motion-reduce:before:transition-none motion-reduce:after:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) focus-visible:bg-(--bg-mask) focus-visible:border focus-visible:border-(--border-default)"

  const resolvedIcon = computed(() => props.icon || 'ai ai-box')
  const resolvedHref = computed(() => props.href || '#')

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

    emit('click', event, { label: props.label, href: resolvedHref.value })
  }
</script>

<template>
  <component
    :is="current ? 'span' : 'a'"
    v-bind="passthroughAttrs"
    :href="current ? undefined : resolvedHref"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
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
      :class="[resolvedIcon, directionalIconClass(resolvedIcon)]"
      class="relative z-1 size-[0.875rem]! shrink-0 text-[0.875rem]! leading-none"
      aria-hidden="true"
      :data-testid="`${testId}__icon`"
    />
    <span
      class="relative z-1 min-w-0 truncate"
      :data-testid="`${testId}__label`"
    >
      {{ label }}
    </span>
  </component>
</template>
