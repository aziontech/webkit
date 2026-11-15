<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { directionalIconClass } from '../../../utils/directional-icons'

  export type LinkSize = 'small' | 'medium' | 'large'
  export type LinkTarget = '_self' | '_blank'

  defineOptions({
    name: 'Link',
    inheritAttrs: false
  })

  export interface LinkProps {
    /** Visible label, the default slot's fallback. Empty uses the locale catalog (`Learn more`). */
    label?: string
    /** Size token. Affects height, gap, and typography. */
    size?: LinkSize
    /** Disables interaction and applies disabled token set. */
    disabled?: boolean
    /** Azion icon class for the trailing icon; set shows it. Empty shows the external-link glyph only for `_blank` targets. */
    icon?: string
    /** Destination URL for the anchor. Empty renders `#`. */
    href?: string
    /** Link target when navigating. */
    target?: LinkTarget
  }

  const props = withDefaults(defineProps<LinkProps>(), {
    label: '',
    size: 'large',
    disabled: false,
    icon: '',
    href: '',
    target: '_self'
  })

  const emit = defineEmits<{
    click: [event: MouseEvent]
  }>()

  defineSlots<{
    /** The link text; falls back to `label`, then the locale catalog. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ link: en.link })

  const EXTERNAL_ICON = 'ai ai-external-link'

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'navigation-link')

  const resolvedIcon = computed(() => {
    if (props.icon) return props.icon
    return props.target === '_blank' ? EXTERNAL_ICON : ''
  })

  const onClick = (event: MouseEvent) => {
    if (props.disabled) {
      event.preventDefault()
      return
    }

    emit('click', event)
  }
</script>

<template>
  <a
    :href="href || '#'"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    v-bind="$attrs"
    :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined"
    :data-disabled="disabled || null"
    :data-size="size"
    :data-testid="testId"
    class="group inline-flex shrink-0 items-center whitespace-nowrap rounded-(--shape-button) text-(--text-link) transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[size=large]:h-10 data-[size=large]:min-h-10 data-[size=large]:text-button-lg data-[size=medium]:h-8 data-[size=medium]:min-h-8 data-[size=medium]:text-button-md data-[size=small]:h-7 data-[size=small]:min-h-7 data-[size=small]:text-button-md data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled)!"
    @click="onClick"
  >
    <span
      class="inline-flex flex-nowrap items-center gap-(--spacing-xs)"
      :data-testid="`${testId}__content`"
    >
      <span
        class="inline leading-none underline-offset-4 group-hover:underline group-focus-visible:underline"
        :data-testid="`${testId}__label`"
      >
        <slot>{{ label || t('link.label') }}</slot>
      </span>
      <i
        v-if="resolvedIcon"
        :class="[resolvedIcon, directionalIconClass(resolvedIcon)]"
        class="inline-flex size-(--spacing-sm) shrink-0 items-center justify-center text-[length:inherit] leading-none"
        aria-hidden="true"
        :data-testid="`${testId}__icon`"
      />
    </span>
  </a>
</template>
