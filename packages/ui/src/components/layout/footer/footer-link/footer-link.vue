<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { safeHref } from '../../../../utils/safe-href'

  defineOptions({
    name: 'FooterLink',
    inheritAttrs: false
  })

  export interface FooterLinkProps {
    /** Destination URL of the link. */
    href: string
  }

  defineProps<FooterLinkProps>()

  defineSlots<{
    /** The link label. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'footer-link')

  const ROOT_CLASS =
    'inline-flex w-fit items-center gap-(--spacing-xs) pointer-coarse:min-h-11 ' +
    'text-label-sm text-(--text-default) transition-colors duration-150 ease-out outline-none ' +
    'visited:text-(--text-default) hover:text-(--text-muted) active:text-(--text-muted) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 ' +
    'focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none'
</script>

<template>
  <a
    v-bind="$attrs"
    :href="safeHref(href) ?? undefined"
    :data-testid="testId"
    :class="ROOT_CLASS"
  >
    <slot />
  </a>
</template>
