<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { FooterInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FooterLink',
    inheritAttrs: false
  })

  interface Props {
    /** Destination URL of the link. */
    href: string
  }

  defineProps<Props>()

  defineSlots<{
    /** The link label. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FooterInjectionKey, null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'layout-footer'}__link`
  )
</script>

<template>
  <a
    v-bind="$attrs"
    :href="href"
    :data-testid="testId"
    class="inline-flex w-fit items-center gap-(--spacing-xs) text-label-sm text-(--text-default) transition-colors duration-150 ease-out outline-none hover:text-(--text-muted) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
  >
    <slot />
  </a>
</template>
