<script setup lang="ts">
  import { computed, defineAsyncComponent, onMounted, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import { initials } from '../../../utils/initials'

  defineOptions({
    name: 'Avatar',
    inheritAttrs: false
  })

  export type AvatarVariant = 'circle' | 'square'
  export type AvatarSize = 'small' | 'medium' | 'large'
  /** Generated fallback drawn when there is no image. */
  export type AvatarPattern = 'marble'
  /** Whether the person is reachable now. */
  export type AvatarPresence = 'online' | 'away' | 'busy' | 'offline'

  export interface AvatarProps {
    /** Image URL. When set, renders a photo and takes precedence over label and icon. */
    src?: string
    /** Accessible name: the image's alt with `src`, and the name of the initials or icon fallback without it. */
    alt?: string
    /** Initials shown when no image: a full name becomes the first letters of its first and last words, one word its first two characters, uppercased. */
    label?: string
    /** Icon class for the fallback when no image or label (Azion icon class). */
    icon?: string
    /** Visual shape of the avatar container. */
    variant?: AvatarVariant
    /** Size preset matching Figma sm / md / lg (24 / 32 / 48 px). */
    size?: AvatarSize
    /** Generated fallback drawn when there is no image: marble blends three soft shapes seeded by label (or alt). */
    pattern?: AvatarPattern
    /** CSS colors the generated pattern paints with, in order; theme tokens such as var(--primary). */
    colors?: string[]
    /** Whether the person is reachable now, drawn as a dot on the bottom inline-end edge and added to the accessible name; empty draws no dot. */
    presence?: AvatarPresence | ''
  }

  const props = withDefaults(defineProps<AvatarProps>(), {
    src: '',
    alt: '',
    label: '',
    icon: 'az az-user',
    variant: 'circle',
    size: 'medium',
    pattern: undefined,
    colors: () => ['var(--primary)', 'var(--warning)', 'var(--brand-blue)'],
    presence: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ avatar: en.avatar })

  const AvatarMarble = defineAsyncComponent(() => import('./avatar-marble.vue'))

  const imageEl = ref<HTMLImageElement | null>(null)
  const imageFailed = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'avatar')

  const normalizedLabel = computed(() => initials(props.label))

  const content = computed(() => {
    if (props.src && !imageFailed.value) return 'image'
    if (props.pattern === 'marble') return 'pattern'
    return normalizedLabel.value ? 'label' : 'icon'
  })

  const hasImage = computed(() => content.value === 'image')
  const showPattern = computed(() => content.value === 'pattern')

  const PRESENCE_KEYS = {
    online: 'avatar.presenceOnline',
    away: 'avatar.presenceAway',
    busy: 'avatar.presenceBusy',
    offline: 'avatar.presenceOffline'
  } as const

  const withPresence = (name: string) =>
    props.presence
      ? t('avatar.withPresence', { name, presence: t(PRESENCE_KEYS[props.presence]) })
      : name

  const imageAlt = computed(() =>
    withPresence(props.alt.trim() || normalizedLabel.value || t('avatar.imageAlt'))
  )

  const baseLabel = computed(() => {
    if (props.alt.trim()) return props.alt.trim()
    if (showPattern.value && props.label.trim()) return props.label.trim()
    if (normalizedLabel.value) return normalizedLabel.value
    return t('avatar.fallbackLabel')
  })

  const accessibleLabel = computed(() => withPresence(baseLabel.value))

  const patternSeed = computed(() => props.label.trim() || props.alt.trim() || '')

  watch(
    () => props.src,
    () => {
      imageFailed.value = false
    }
  )

  onMounted(() => {
    if (imageEl.value?.complete && !imageEl.value.naturalWidth) imageFailed.value = true
  })

  function onImageError() {
    imageFailed.value = true
  }

  const ROOT_CLASS =
    'group/avatar relative inline-flex shrink-0 items-center justify-center bg-(--bg-surface-raised) text-(--text-default) uppercase select-none text-label-sm rounded-full size-8 ' +
    'data-[variant=square]:rounded-(--shape-button) ' +
    'data-[size=small]:size-6 data-[size=large]:size-12 data-[size=large]:text-label-md ' +
    'data-[content=label]:border data-[content=label]:border-(--border-default)'

  const PRESENCE_CLASS =
    'absolute bottom-0 end-0 size-3 overflow-hidden rounded-full border-2 border-current text-[color:var(--avatar-presence-ring,var(--bg-surface))] ' +
    'group-data-[size=small]/avatar:size-2.5 group-data-[size=large]/avatar:size-4 ' +
    'data-[presence=online]:bg-(--success-mark) data-[presence=away]:bg-(--warning-mark) data-[presence=busy]:bg-(--danger-mark) data-[presence=offline]:bg-(--text-muted)'

  const PRESENCE_GLYPH_CLASS =
    'absolute rounded-full bg-current ' +
    'data-[presence=away]:-top-[20%] data-[presence=away]:-start-[20%] data-[presence=away]:size-[80%] ' +
    'data-[presence=busy]:inset-x-[18%] data-[presence=busy]:top-[35%] data-[presence=busy]:h-[30%] ' +
    'data-[presence=offline]:inset-[25%]'
</script>

<template>
  <span
    v-bind="$attrs"
    :class="cn(ROOT_CLASS, attrs.class as string | undefined)"
    :data-testid="testId"
    :data-variant="variant"
    :data-size="size"
    :data-content="content"
    :data-pattern="showPattern ? pattern : undefined"
    :role="hasImage ? undefined : 'img'"
    :aria-label="
      hasImage ? undefined : (attrs['aria-label'] as string | undefined) || accessibleLabel
    "
    :data-presence="presence || undefined"
  >
    <span class="flex size-full items-center justify-center overflow-hidden rounded-[inherit]">
      <img
        v-if="hasImage"
        ref="imageEl"
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
    <span
      v-if="presence"
      data-slot="presence"
      :data-testid="`${testId}__presence`"
      :data-presence="presence"
      :class="PRESENCE_CLASS"
      aria-hidden="true"
    >
      <span
        v-if="presence !== 'online'"
        :data-presence="presence"
        :class="PRESENCE_GLYPH_CLASS"
      />
    </span>
  </span>
</template>
