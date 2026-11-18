<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useInlineCodeCopy } from '../../../composables/use-inline-code-copy'
  import { usePortalLocale } from '../../../composables/use-translate'

  defineOptions({ name: 'DocProse', inheritAttrs: false })

  defineSlots<{
    /** The document body: markdown-rendered HTML or hand-written markup. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const proseEl = ref<HTMLElement | null>(null)
  const { tipFor, tipLabel, tipLeft, tipTop, announcement } = useInlineCodeCopy(proseEl)

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-prose')

  const portalLocale = usePortalLocale()
</script>

<template>
  <div
    ref="proseEl"
    v-bind="$attrs"
    :data-testid="testId"
    data-code-copy
    class="w-full text-(--text-default) [&>*:first-child]:mt-0! [&>*:first-child:not([data-doc-chrome])]:pt-0! [&>*:first-child>*:first-child]:mt-0! [&>*:first-child>*:first-child:not([data-doc-chrome])]:pt-0! [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-2xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xl [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-md [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-lg [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:md:text-heading-sm [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xl) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-lg) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xs [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_em:not([data-doc-chrome],[data-doc-chrome]_*)]:italic [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link)/40 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline-offset-4 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:transition-colors [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:duration-150 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:ease-out [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link-hover) [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link-hover) [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-offset-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-(--ring-color) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:motion-reduce:transition-none [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:block [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-md) [&_pre:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-md) [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-sm [&_td:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:w-max [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:max-w-full [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:overflow-x-auto [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:border-collapse [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:border-b [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-sm) [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:py-(--spacing-xs) [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:text-start [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:align-top [&_th:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-control) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:inset-ring [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:inset-ring-(--border-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:forced-colors:border [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:bg-(--bg-hover) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-2xs) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-label-code-sm [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:wrap-anywhere [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:box-decoration-clone [&_:not(a)>code:not([data-testid])]:cursor-pointer [&_:not(a)>code:not([data-testid])]:hover:ring-1 [&_:not(a)>code:not([data-testid])]:hover:ring-(--border-default) [&_code[data-command]]:outline-none [&_code[data-command]:focus-visible]:ring-2 [&_code[data-command]:focus-visible]:ring-(--ring-color) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:list-disc [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:list-decimal [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:ps-(--spacing-lg) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:ps-(--spacing-lg) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:marker:text-(--text-muted) [&_li+li:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_li>p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-lg) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-s-2 [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-strong) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:ps-(--spacing-lg) [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-0 [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-12 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-0 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-t [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_[data-doc-block]]:mt-(--spacing-lg) [&_:is(h1,h2)+:is(h2,h3,h4):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_h3+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_h4+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_h3+[data-doc-block]]:mt-(--spacing-sm) [&_h4+[data-doc-block]]:mt-(--spacing-xs)"
  >
    <slot />

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <span
          v-if="tipFor"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          role="tooltip"
          :data-testid="`${testId}__copy-tip`"
          :style="{ left: `${tipLeft}px`, top: `${tipTop}px` }"
          class="pointer-events-none fixed z-(--z-control-overlay) -translate-x-1/2 -translate-y-[calc(100%+var(--spacing-2xs))] rounded-(--shape-control) bg-(--bg-contrast) px-(--spacing-xs) py-(--spacing-2xs) text-body-xs whitespace-nowrap text-(--text-contrast)"
          >{{ tipLabel }}</span
        >
      </Transition>
      <span
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        aria-live="polite"
        class="sr-only"
        :data-testid="`${testId}__copy-status`"
        >{{ announcement }}</span
      >
    </Teleport>
  </div>
</template>
