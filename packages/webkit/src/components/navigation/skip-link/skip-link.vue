<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'

  defineOptions({
    name: 'SkipLink',
    inheritAttrs: false
  })

  export interface SkipLinkProps {
    /** Visible label, the default slot's fallback. Empty uses the locale catalog (`Skip to content`). */
    label?: string
    /** In-page hash of the element to jump to; the element with that `id` receives focus on activation. */
    href?: string
  }

  const props = withDefaults(defineProps<SkipLinkProps>(), {
    label: '',
    href: '#main'
  })

  defineSlots<{
    /** The link text; falls back to `label`, then the locale catalog. */
    default(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ skipLink: en.skipLink })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'skip-link')

  const FOCUSABLE =
    'a[href], button, input, select, textarea, summary, [tabindex], [contenteditable]'

  const focusTarget = () => {
    if (!props.href.startsWith('#') || props.href.length < 2) return
    let id = props.href.slice(1)
    try {
      id = decodeURIComponent(id)
    } catch {
      return
    }
    const target = document.getElementById(id)
    if (!target) return
    if (!target.matches(FOCUSABLE)) {
      target.setAttribute('tabindex', '-1')
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
    }
    target.focus()
  }

  const ROOT_CLASS =
    'fixed start-(--spacing-sm) top-(--spacing-sm) z-(--z-control-overlay) inline-flex min-h-10 max-w-[calc(100vw_-_2*var(--spacing-sm))] items-center rounded-(--shape-button) border ' +
    'border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xs) text-button-md text-(--text-default) shadow-(--shadow-md) underline-offset-4 ' +
    'hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
    'pointer-coarse:min-h-11 not-focus:sr-only'
</script>

<template>
  <a
    :href="safeHref(href) ?? undefined"
    v-bind="$attrs"
    :data-testid="testId"
    :class="ROOT_CLASS"
    @click="focusTarget"
  >
    <slot>{{ label || t('skipLink.label') }}</slot>
  </a>
</template>
