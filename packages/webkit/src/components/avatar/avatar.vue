<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { cn } from '../../utils/cn'

  export type AvatarKind = 'circle' | 'square'
  export type AvatarSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'Avatar',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Image URL. When set, renders a photo and takes precedence over label and icon. */
      src?: string
      /** Accessible description for the image. Use when `src` is set. */
      alt?: string
      /** Initials shown when no image (normalized to two uppercase characters). */
      label?: string
      /** Icon class for the fallback when no image or label (PrimeIcons class). */
      icon?: string
      /** Visual shape of the avatar container. */
      kind?: AvatarKind
      /** Size preset matching Figma sm / md / lg (24 / 32 / 48 px). */
      size?: AvatarSize
    }>(),
    {
      src: undefined,
      alt: undefined,
      label: undefined,
      icon: 'pi pi-user',
      kind: 'circle',
      size: 'medium'
    }
  )

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-avatar')

  const normalizedLabel = computed(() => {
    const value = props.label?.trim()
    if (!value) return ''
    return value.slice(0, 2).toUpperCase()
  })

  const hasImage = computed(() => Boolean(props.src))

  const showLabel = computed(() => !hasImage.value && Boolean(normalizedLabel.value))

  const showIcon = computed(() => !hasImage.value && !showLabel.value)

  const imageAlt = computed(() => props.alt?.trim() || normalizedLabel.value || 'Avatar')

  const accessibleLabel = computed(() => {
    if (hasImage.value) return imageAlt.value
    if (normalizedLabel.value) return normalizedLabel.value
    return 'User avatar'
  })

  const kindClasses: Record<AvatarKind, string> = {
    circle: 'rounded-full',
    square: 'rounded-[var(--shape-button)]'
  }

  const sizeClasses: Record<AvatarSize, string> = {
    small: 'size-6',
    medium: 'size-8',
    large: 'size-12'
  }

  const typographyClasses: Record<AvatarSize, string> = {
    small: 'text-label-sm',
    medium: 'text-label-sm',
    large: 'text-label-md'
  }

  const rootClasses = computed(() =>
    cn(
      'inline-flex shrink-0 items-center justify-center overflow-hidden',
      'bg-[var(--bg-surface-raised)] text-[var(--text-default)]',
      'uppercase select-none',
      kindClasses[props.kind],
      sizeClasses[props.size],
      !hasImage.value && typographyClasses[props.size],
      showLabel.value && 'border border-[var(--border-default)]',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <span
    :class="rootClasses"
    :data-testid="testId"
    :role="hasImage ? undefined : 'img'"
    :aria-label="hasImage ? undefined : accessibleLabel"
  >
    <img
      v-if="hasImage"
      :src="src"
      :alt="imageAlt"
      :data-testid="`${testId}__image`"
      class="size-full object-cover rounded-[inherit]"
    />
    <span
      v-else-if="showLabel"
      :data-testid="`${testId}__label`"
      class="leading-none"
    >
      {{ normalizedLabel }}
    </span>
    <i
      v-else-if="showIcon"
      :class="[icon, 'text-[length:inherit] leading-none']"
      :data-testid="`${testId}__icon`"
      aria-hidden="true"
    />
  </span>
</template>
