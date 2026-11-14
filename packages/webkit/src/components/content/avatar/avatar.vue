<script setup lang="ts">
  import { computed, defineAsyncComponent, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import { cn } from '../../../utils/cn'

  defineOptions({
    name: 'Avatar',
    inheritAttrs: false
  })

  export type AvatarKind = 'circle' | 'square'
  export type AvatarSize = 'small' | 'medium' | 'large'
  /** Generated fallback drawn when there is no image. */
  export type AvatarPattern = 'marble'

  interface Props {
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
  }

  const props = withDefaults(defineProps<Props>(), {
    src: '',
    alt: '',
    label: '',
    icon: 'pi pi-user',
    kind: 'circle',
    size: 'medium',
    pattern: undefined,
    colors: () => ['var(--text-primary)', 'var(--primary)', 'var(--warning)']
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ avatar: en.avatar })

  const AvatarMarble = defineAsyncComponent(() => import('./avatar-marble.vue'))

  const imageRef = ref<HTMLImageElement | null>(null)
  const imageFailed = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-avatar')

  const normalizedLabel = computed(() => {
    const value = props.label.trim()
    if (!value) return ''
    return value.slice(0, 2).toUpperCase()
  })

  const content = computed(() => {
    if (props.src && !imageFailed.value) return 'image'
    if (props.pattern === 'marble') return 'pattern'
    return normalizedLabel.value ? 'label' : 'icon'
  })

  const hasImage = computed(() => content.value === 'image')
  const showPattern = computed(() => content.value === 'pattern')

  const imageAlt = computed(() => props.alt.trim() || normalizedLabel.value || t('avatar.imageAlt'))

  const accessibleLabel = computed(() => {
    if (props.alt.trim()) return props.alt.trim()
    if (showPattern.value && props.label.trim()) return props.label.trim()
    if (normalizedLabel.value) return normalizedLabel.value
    return t('avatar.fallbackLabel')
  })

  const patternSeed = computed(() => props.label.trim() || props.alt.trim() || '')

  watch(
    () => props.src,
    () => {
      imageFailed.value = false
    }
  )

  onMounted(() => {
    if (imageRef.value?.complete && !imageRef.value.naturalWidth) imageFailed.value = true
  })

  function onImageError() {
    imageFailed.value = true
  }
</script>

<template>
  <span
    v-bind="$attrs"
    :class="
      cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden bg-(--bg-surface-raised) text-(--text-default) uppercase select-none text-label-sm rounded-full size-8 data-[kind=square]:rounded-(--shape-button) data-[size=small]:size-6 data-[size=large]:size-12 data-[size=large]:text-label-md data-[content=label]:border data-[content=label]:border-(--border-default)',
        attrs.class as string | undefined
      )
    "
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-content="content"
    :data-pattern="showPattern ? pattern : undefined"
    :role="hasImage ? undefined : 'img'"
    :aria-label="hasImage ? undefined : accessibleLabel"
  >
    <img
      v-if="hasImage"
      ref="imageRef"
      :src="src"
      :alt="imageAlt"
      :data-testid="`${testId}__image`"
      class="size-full object-cover rounded-[inherit]"
      @error="onImageError"
    />
    <AvatarMarble
      v-else-if="showPattern"
      :seed="patternSeed"
      :colors="colors"
      :test-id="testId"
    />
    <span
      v-else-if="content === 'label'"
      :data-testid="`${testId}__label`"
      class="leading-none"
    >
      {{ normalizedLabel }}
    </span>
    <i
      v-else
      :class="[icon, 'text-[length:inherit] leading-none']"
      :data-testid="`${testId}__icon`"
      aria-hidden="true"
    />
  </span>
</template>
