<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-avatar')
  const patternFilterId = `avatar-pattern-${useId()}`

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

  const patternLayers = computed(() => {
    const name = props.label?.trim() || props.alt?.trim() || ''
    let seed = 0
    for (let index = 0; index < name.length; index += 1) {
      seed = (seed << 5) - seed + name.charCodeAt(index)
      seed |= 0
    }
    seed = Math.abs(seed)
    const palette = props.colors.length ? props.colors : ['var(--primary)']
    const signed = (value: number, range: number, position?: number) => {
      const magnitude = value % range
      if (position && Math.floor((value / 10 ** position) % 10) % 2 === 0) return -magnitude
      return magnitude
    }
    return [0, 1, 2].map((index) => {
      const value = seed * (index + 1)
      return {
        fill: palette[(seed + index) % palette.length],
        transform: `translate(${signed(value, 8, 1)} ${signed(value, 8, 2)}) rotate(${signed(value, 360, 1)} 40 40) scale(${1.2 + signed(value, 4) / 10})`
      }
    })
  })

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
    <svg
      v-else-if="showPattern"
      :data-testid="`${testId}__pattern`"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      class="size-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter
          :id="patternFilterId"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect
        width="80"
        height="80"
        :style="{ fill: patternLayers[0].fill }"
      />
      <path
        :filter="`url(#${patternFilterId})`"
        :transform="patternLayers[1].transform"
        :style="{ fill: patternLayers[1].fill }"
        d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
      />
      <path
        :filter="`url(#${patternFilterId})`"
        :transform="patternLayers[2].transform"
        :style="{ fill: patternLayers[2].fill }"
        class="mix-blend-overlay"
        d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
      />
    </svg>
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
