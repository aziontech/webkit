<script setup lang="ts">
  import { computed, defineAsyncComponent, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'

  export type AvatarKind = 'circle' | 'square'
  export type AvatarSize = 'small' | 'medium' | 'large'
  /** Generated fallback drawn when there is no image. */
  export type AvatarPattern = 'marble'

  defineOptions({
    name: 'Avatar',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Image URL. When set, renders a photo and takes precedence over label and icon. */
      src?: string
      /** Accessible name: the image's alt with `src`, and the name of the initials or icon fallback without it. */
      alt?: string
      /** Initials shown when no image (normalized to two uppercase characters). */
      label?: string
      /** Icon class for the fallback when no image or label (PrimeIcons class). */
      icon?: string
      /** Visual shape of the avatar container. */
      kind?: AvatarKind
      /** Size preset matching Figma sm / md / lg (24 / 32 / 48 px). */
      size?: AvatarSize
      /** Generated fallback drawn when there is no image: marble blends three soft shapes seeded by label (or alt). */
      pattern?: AvatarPattern
      /** CSS colors the generated pattern paints with, in order; theme tokens such as var(--primary). */
      colors?: string[]
    }>(),
    {
      src: undefined,
      alt: undefined,
      label: undefined,
      icon: 'pi pi-user',
      kind: 'circle',
      size: 'medium',
      pattern: undefined,
      colors: () => ['var(--text-primary)', 'var(--primary)', 'var(--warning)']
    }
  )

  const attrs = useAttrs()
  const { t } = useTranslate({ avatar: en.avatar })

  const AvatarMarble = defineAsyncComponent(() => import('./avatar-marble.vue'))

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-avatar')

  const normalizedLabel = computed(() => {
    const value = props.label?.trim()
    if (!value) return ''
    return value.slice(0, 2).toUpperCase()
  })

  const hasImage = computed(() => Boolean(props.src))

  const showPattern = computed(() => !hasImage.value && props.pattern === 'marble')

  const showLabel = computed(
    () => !hasImage.value && !showPattern.value && Boolean(normalizedLabel.value)
  )

  const showIcon = computed(() => !hasImage.value && !showPattern.value && !showLabel.value)

  const imageAlt = computed(
    () => props.alt?.trim() || normalizedLabel.value || t('avatar.imageAlt')
  )

  const accessibleLabel = computed(() => {
    if (hasImage.value) return imageAlt.value
    if (props.alt?.trim()) return props.alt.trim()
    if (showPattern.value && props.label?.trim()) return props.label.trim()
    if (normalizedLabel.value) return normalizedLabel.value
    return t('avatar.fallbackLabel')
  })

  const patternSeed = computed(() => props.label?.trim() || props.alt?.trim() || '')

  const kindClasses: Record<AvatarKind, string> = {
    circle: 'rounded-full',
    square: 'rounded-(--shape-button)'
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
      'bg-(--bg-surface-raised) text-(--text-default)',
      'uppercase select-none',
      kindClasses[props.kind],
      sizeClasses[props.size],
      !hasImage.value && typographyClasses[props.size],
      showLabel.value && 'border border-(--border-default)',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <span
    :class="rootClasses"
    :data-testid="testId"
    :data-pattern="showPattern ? pattern : undefined"
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
    <AvatarMarble
      v-else-if="showPattern"
      :seed="patternSeed"
      :colors="colors"
      :test-id="testId"
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
