<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type LinkSize = 'small' | 'medium' | 'large'
  export type LinkTarget = '_self' | '_blank'

  defineOptions({
    name: 'Link',
    inheritAttrs: false
  })

  interface Props {
    /** Visible label rendered inside the link. */
    label?: string
    /** Size token. Affects height, gap, and typography. */
    size?: LinkSize
    /** Disables interaction and applies disabled token set. */
    disabled?: boolean
    /** When true, renders the trailing icon. */
    showIcon?: boolean
    /** PrimeIcons class for the trailing icon (e.g. `pi pi-external-link`). */
    icon?: string
    /** Destination URL for the anchor. */
    href?: string
    /** Link target when navigating. */
    target?: LinkTarget
  }

  const props = withDefaults(defineProps<Props>(), {
    label: 'Learn More',
    size: 'large',
    disabled: false,
    showIcon: true,
    icon: 'pi pi-external-link',
    href: '#',
    target: '_self'
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'navigation-link')

  const rootClasses = computed(() => [
    'group inline-flex shrink-0 items-center whitespace-nowrap',
    'rounded-(--shape-button) text-(--text-link)',
    'transition-colors duration-150 ease-out motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)',
    'data-[size=large]:h-10 data-[size=large]:min-h-10 data-[size=large]:text-button-lg',
    'data-[size=medium]:h-8 data-[size=medium]:min-h-8 data-[size=medium]:text-button-md',
    'data-[size=small]:h-7 data-[size=small]:min-h-7 data-[size=small]:text-button-md',
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed',
    'data-[disabled]:text-(--text-disabled)!',
    attrs['class']
  ])

  const handleClick = (event: MouseEvent) => {
    if (props.disabled) {
      event.preventDefault()
      return
    }

    emit('click', event)
  }
</script>

<template>
  <a
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="rootClasses"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    :data-disabled="disabled || null"
    :data-size="size"
    :data-testid="testId"
    @click="handleClick"
  >
    <span
      class="inline-flex flex-nowrap items-center gap-(--spacing-xs)"
      :data-testid="`${testId}__content`"
    >
      <span
        class="inline leading-none underline-offset-4 group-hover:underline group-focus-visible:underline"
        :data-testid="`${testId}__label`"
      >
        {{ label }}
      </span>
      <i
        v-if="showIcon"
        :class="icon"
        class="inline-flex size-(--spacing-sm) shrink-0 items-center justify-center text-[length:inherit] leading-none"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      />
    </span>
  </a>
</template>
