<script setup lang="ts">
  import { useMutationObserver } from '@vueuse/core'
  import { computed, onMounted, reactive, ref, useAttrs } from 'vue'

  import { useInlineCodeCopy } from '../../../composables/use-inline-code-copy'
  import { focusableTables } from './lib/focusable-tables'
  import DocProseCopyTip from './parts/doc-prose-copy-tip.vue'

  defineOptions({ name: 'DocProse', inheritAttrs: false })

  defineSlots<{
    /** The document body: markdown-rendered HTML or hand-written markup. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const proseEl = ref<HTMLElement | null>(null)
  const copy = reactive(useInlineCodeCopy(proseEl))

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'doc-prose')

  onMounted(() => {
    if (proseEl.value) focusableTables(proseEl.value)
  })
  useMutationObserver(
    proseEl,
    () => {
      if (proseEl.value) focusableTables(proseEl.value)
    },
    { childList: true, subtree: true }
  )

  const ROOT_CLASS =
    'w-full text-(--text-default) [&>*:first-child]:mt-0! ' +
    '[&>*:first-child:not([data-doc-chrome])]:pt-0! ' +
    '[&>*:first-child>*:first-child]:mt-0! ' +
    '[&>*:first-child>*:first-child:not([data-doc-chrome])]:pt-0! [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 ' +
    '[&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-2xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-xl ' +
    '[&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 ' +
    '[&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xl [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-md ' +
    '[&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 ' +
    '[&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-lg [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:md:text-heading-sm ' +
    '[&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xl) ' +
    '[&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-lg) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xs ' +
    '[&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) ' +
    '[&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) ' +
    '[&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) ' +
    '[&_em:not([data-doc-chrome],[data-doc-chrome]_*)]:italic ' +
    '[&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link) ' +
    '[&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link)/40 ' +
    '[&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline-offset-4 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:transition-colors ' +
    '[&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:duration-150 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:ease-out ' +
    '[&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link-hover) ' +
    '[&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link-hover) ' +
    '[&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-2 ' +
    '[&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-offset-2 ' +
    '[&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-(--ring-color) ' +
    '[&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:motion-reduce:transition-none ' +
    '[&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:block [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-md) ' +
    '[&_pre:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-md) [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-sm ' +
    '[&_td:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:w-max ' +
    '[&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:max-w-full [&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:overflow-x-auto ' +
    '[&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:outline-none [&_table:focus-visible:not([data-doc-chrome],[data-doc-chrome]_*)]:ring-2 ' +
    '[&_table:focus-visible:not([data-doc-chrome],[data-doc-chrome]_*)]:ring-(--ring-color) ' +
    '[&_table:not([data-doc-chrome],[data-doc-chrome]_*)]:border-collapse [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:border-b ' +
    '[&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-sm) ' +
    '[&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:py-(--spacing-xs) [&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:text-start ' +
    '[&_:is(th,td):not([data-doc-chrome],[data-doc-chrome]_*)]:align-top [&_th:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) ' +
    '[&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-control) [&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:inset-ring ' +
    '[&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:inset-ring-(--border-default) ' +
    '[&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:forced-colors:border ' +
    '[&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:bg-(--bg-hover) [&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-2xs) ' +
    '[&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:text-label-code-sm [&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) ' +
    '[&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:wrap-anywhere [&_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:box-decoration-clone ' +
    '[&_:is(th,td)_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:wrap-normal ' +
    '[&_:is(th,td)_code:not(pre_*,[data-testid],[data-doc-chrome],[data-doc-chrome]_*)]:whitespace-nowrap ' +
    '[&_:not(a,pre)>code:not([data-testid])]:cursor-pointer [&_:not(a,pre)>code:not([data-testid])]:hover:ring-1 [&_:not(a,pre)>code:not([data-testid])]:hover:ring-(--border-default) ' +
    '[&_code[data-command]]:outline-none [&_code[data-command]:focus-visible]:ring-2 [&_code[data-command]:focus-visible]:ring-(--ring-color) ' +
    '[&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) ' +
    '[&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:list-disc [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:list-decimal ' +
    '[&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:ps-(--spacing-lg) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:ps-(--spacing-lg) ' +
    '[&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) ' +
    '[&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:marker:text-(--text-muted) [&_li+li:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) ' +
    '[&_li>p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) ' +
    '[&_li_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-lg) ' +
    '[&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-s-2 [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-strong) ' +
    '[&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:ps-(--spacing-lg) [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-0 ' +
    '[&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-12 ' +
    '[&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-0 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-t ' +
    '[&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) ' +
    '[&_[data-doc-block]]:mt-(--spacing-lg) ' +
    '[&_:is(h1,h2)+:is(h2,h3,h4):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) ' +
    '[&_h3+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) ' +
    '[&_h4+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) ' +
    '[&_h3+[data-doc-block]]:mt-(--spacing-sm) [&_h4+[data-doc-block]]:mt-(--spacing-xs) ' +
    '[&_:is(p,ul,ol,blockquote):not([data-doc-block],[data-doc-chrome],[data-doc-chrome]_*)]:max-w-(--container-xl)'
</script>

<template>
  <div
    ref="proseEl"
    v-bind="$attrs"
    :data-testid="testId"
    data-code-copy
    :class="ROOT_CLASS"
  >
    <slot />

    <DocProseCopyTip
      :copy="copy"
      :test-id="testId"
    />
  </div>
</template>
