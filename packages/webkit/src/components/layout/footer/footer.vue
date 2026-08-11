<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { FooterInjectionKey } from './injection-key'

  defineOptions({
    name: 'Footer',
    inheritAttrs: false
  })

  interface Props {
    /** Accessible name for the contentinfo landmark. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Footer'
  })

  const slots = defineSlots<{
    /** The Footer.Column items; laid out as a 2-column grid that becomes 4 columns at md. */
    default(): unknown
    /** Leading cluster of the social bar (brand + social icon buttons). */
    'social-start'(): unknown
    /** Trailing cluster of the social bar (status indicator + language select). */
    'social-end'(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'layout-footer')

  const hasSocialBar = computed(() => Boolean(slots['social-start'] || slots['social-end']))

  provide(FooterInjectionKey, {
    testId: testId.value
  })
</script>

<template>
  <footer
    v-bind="$attrs"
    :aria-label="ariaLabel"
    :data-testid="testId"
    class="w-full bg-(--bg-canvas)"
  >
    <div class="mx-auto flex w-full max-w-(--container-5xl) flex-col">
      <div
        :data-testid="`${testId}__columns`"
        class="grid w-full grid-cols-2 gap-y-(--spacing-lg) md:grid-cols-4 md:gap-y-0"
      >
        <slot />
      </div>
      <div
        v-if="hasSocialBar"
        :data-testid="`${testId}__social`"
        class="flex w-full flex-col-reverse gap-(--spacing-md) border-t border-(length:--border-width-default) border-(--border-default) px-(--spacing-lg) py-(--spacing-md) md:h-14 md:flex-row md:items-center md:justify-between md:py-0"
      >
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-md)">
          <slot name="social-start" />
        </div>
        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-lg) md:justify-end">
          <slot name="social-end" />
        </div>
      </div>
    </div>
  </footer>
</template>
