<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'

  defineOptions({
    name: 'AppHeaderBrand',
    inheritAttrs: false
  })

  export interface AppHeaderBrandProps {
    /** When set, the brand renders as an anchor link to this URL. */
    href?: string
    /** Accessible name for the brand link. Empty uses the locale catalog (`Azion home`) when href is set. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<AppHeaderBrandProps>(), {
    href: '',
    ariaLabel: ''
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ appHeader: en.appHeader })

  const isLink = computed(() => props.href.length > 0)

  const accessibleName = computed(() =>
    isLink.value ? props.ariaLabel || t('appHeader.home') : props.ariaLabel || undefined
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'app-header-brand')
</script>

<template>
  <component
    :is="isLink ? 'a' : 'div'"
    v-bind="$attrs"
    :href="isLink ? href : undefined"
    :aria-label="accessibleName"
    :data-testid="testId"
    :data-link="isLink || null"
    class="flex shrink-0 items-center [&_svg]:block [&_svg]:h-[18px] [&_svg]:w-auto [&_svg]:max-w-full data-[link]:min-h-10 data-[link]:self-center data-[link]:rounded-(--shape-control) data-[link]:transition-opacity data-[link]:duration-fast-02 data-[link]:ease-productive-entrance data-[link]:hover:opacity-80 data-[link]:focus-visible:outline-none data-[link]:focus-visible:ring-2 data-[link]:focus-visible:ring-(--ring-color) data-[link]:focus-visible:ring-offset-2 data-[link]:focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none pointer-coarse:data-[link]:min-h-11"
  >
    <slot />
  </component>
</template>
