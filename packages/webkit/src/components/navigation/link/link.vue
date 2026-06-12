<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type LinkSize = 'large' | 'medium'
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
    'group relative inline-flex shrink-0 items-center whitespace-nowrap',
    'min-h-10 h-10 rounded-[var(--shape-button)] text-[var(--text-link)]',
    'transition-colors duration-150 ease-out motion-reduce:transition-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]',
    'focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]',
    'data-[size=large]:text-button-lg',
    'data-[size=medium]:text-button-md',
    'data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed',
    'data-[disabled]:!text-[var(--text-disabled)] data-[disabled]:[&_.link-ghost]:hidden',
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
      class="link-ghost pointer-events-none absolute top-1/2 -translate-y-1/2 -left-[var(--spacing-xs)] -right-[var(--spacing-xs)] h-8 rounded-[var(--shape-button)] bg-[var(--bg-surface-raised)] opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100 before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:opacity-0 before:transition-opacity before:duration-150 before:ease-out before:content-[''] motion-reduce:before:transition-none group-hover:before:opacity-100 group-focus-visible:before:opacity-100 before:bg-[var(--bg-hover)] group-active:before:bg-[var(--bg-active)]"
      aria-hidden="true"
      :data-testid="`${testId}__ghost`"
    />
    <span
      class="relative z-[1] inline-flex flex-nowrap items-center gap-[var(--spacing-xs)]"
      :data-testid="`${testId}__content`"
    >
      <span
        class="inline leading-none"
        :data-testid="`${testId}__label`"
      >
        {{ label }}
      </span>
      <i
        v-if="showIcon"
        :class="icon"
        class="inline-flex size-[var(--spacing-sm)] shrink-0 items-center justify-center text-[length:inherit] leading-none"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      />
    </span>
  </a>
</template>
