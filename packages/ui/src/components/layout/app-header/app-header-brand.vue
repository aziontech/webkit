<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'

  defineOptions({
    name: 'AppHeaderBrand',
    inheritAttrs: false
  })

  export interface AppHeaderBrandProps {
    /** When set, the brand renders as an anchor link to this URL. */
    href?: string
    /** Accessible name for the brand link. Empty uses the locale catalog (`Azion home`) when href is set. */
    ariaLabel?: string
    /** Product name drawn beside the mark as an uppercase outlined label. Empty draws no label. */
    label?: string
  }

  const props = withDefaults(defineProps<AppHeaderBrandProps>(), {
    href: '',
    ariaLabel: '',
    label: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ appHeader: en.appHeader })

  const isLink = computed(() => safeHref(props.href) !== null)

  const hasLabel = computed(() => props.label.length > 0)

  const linkName = computed(() =>
    hasLabel.value ? t('appHeader.productHome', { product: props.label }) : t('appHeader.home')
  )

  const accessibleName = computed(() =>
    isLink.value ? props.ariaLabel || linkName.value : props.ariaLabel || undefined
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'app-header-brand')

  const ROOT_CLASS =
    'flex shrink-0 items-center ' +
    'data-[label]:gap-(--spacing-xs) ' +
    '[&_svg]:block [&_svg]:h-[18px] [&_svg]:w-auto [&_svg]:max-w-full ' +
    'data-[link]:min-h-10 data-[link]:self-center data-[link]:rounded-(--shape-control) data-[link]:transition-opacity data-[link]:duration-fast-02 data-[link]:ease-productive-entrance ' +
    'data-[link]:hover:opacity-80 data-[link]:focus-visible:outline-none data-[link]:focus-visible:ring-2 data-[link]:focus-visible:ring-(--ring-color) ' +
    'data-[link]:focus-visible:ring-offset-2 data-[link]:focus-visible:ring-offset-(--bg-surface) ' +
    'motion-reduce:transition-none pointer-coarse:data-[link]:min-h-11'
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :aria-label="accessibleName"
    :data-testid="testId"
    :data-link="isLink || null"
    :data-label="hasLabel || null"
    :class="ROOT_CLASS"
  >
    <slot />
    <span
      v-if="hasLabel"
      :aria-hidden="isLink || undefined"
      :data-testid="`${testId}__label`"
      class="rounded-(--shape-control) border border-(--border-muted) px-(--spacing-2xs) text-overline-sm text-(--text-muted)"
      >{{ label }}</span
    >
  </component>
</template>
