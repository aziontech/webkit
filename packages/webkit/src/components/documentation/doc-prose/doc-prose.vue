<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  // The typography contract documentation pages inherit: styles descendants over any
  // renderer's HTML. Rhythm fitted to the Mintlify reference measured on
  // docs.firecrawl.dev; every gap is padding-top on the following element. Section
  // step: 56 to open, 48 to close — theme primitive steps, flat at every width; h2 and
  // h3 share one rung; a block component sits one rung above flowing copy. See spec.
  defineOptions({ name: 'DocProse', inheritAttrs: false })

  defineSlots<{
    /** The document body: markdown-rendered HTML or hand-written markup. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  // Click-to-copy for inline code chips, delegated from this root: prose code arrives
  // as renderer vnodes, hand-written markup, or raw HTML, and only a container listener
  // catches all three. Attached programmatically — a template click handler on this
  // non-interactive root is what click-events-have-key-events exists to stop. No tab
  // stops on purpose: dozens of chips per page, and the text stays selectable anyway.
  const proseRef = ref<HTMLElement | null>(null)
  const tipFor = ref<HTMLElement | null>(null)
  const tipLabel = ref('Copy')
  const tipLeft = ref(0)
  const tipTop = ref(0)
  let resetTimer: ReturnType<typeof globalThis.setTimeout> | null = null

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-prose')

  const chipFrom = (target: globalThis.EventTarget | null): HTMLElement | null => {
    const root = proseRef.value
    const node = target instanceof globalThis.Element ? target : null
    const chip = node?.closest('code') as HTMLElement | null
    if (!chip || !root?.contains(chip) || chip.closest('pre')) return null
    // The copy boundary is authored-vs-generated, not the data-doc-chrome styling
    // boundary: component-owned code identifies itself with a data-testid or holds
    // child elements, where an authored chip is a bare element with one text node.
    if (chip.dataset['testid'] || chip.childElementCount > 0) return null
    return chip
  }

  const anchorTip = (chip: HTMLElement): void => {
    const rect = chip.getBoundingClientRect()
    tipLeft.value = rect.left + rect.width / 2
    tipTop.value = rect.top
  }

  const clearReset = (): void => {
    if (resetTimer !== null) globalThis.clearTimeout(resetTimer)
    resetTimer = null
  }

  const onOver = (event: globalThis.PointerEvent): void => {
    const chip = chipFrom(event.target)
    if (!chip || chip === tipFor.value) return
    clearReset()
    tipLabel.value = 'Copy'
    tipFor.value = chip
    anchorTip(chip)
  }

  const onOut = (event: globalThis.PointerEvent): void => {
    const chip = chipFrom(event.target)
    if (!chip || chip !== tipFor.value) return
    // Ignore a move between the chip's own text nodes.
    if (chipFrom(event.relatedTarget) === chip) return
    clearReset()
    tipFor.value = null
  }

  const onClick = async (event: globalThis.MouseEvent): Promise<void> => {
    const chip = chipFrom(event.target)
    // A chip inside a link belongs to the link — copying would eat the navigation.
    if (!chip || chip.closest('a')) return
    const text = chip.textContent ?? ''
    if (!text) return
    tipFor.value = chip
    anchorTip(chip)
    try {
      await globalThis.navigator.clipboard.writeText(text)
      tipLabel.value = 'Copied'
    } catch {
      // Clipboard denied or insecure origin: offer the manual path, never fail silently.
      tipLabel.value = 'Press \u2318C to copy'
      globalThis.getSelection()?.selectAllChildren(chip)
    }
    clearReset()
    resetTimer = globalThis.setTimeout(() => {
      tipLabel.value = 'Copy'
      resetTimer = null
    }, 1400)
  }

  // Fixed off a viewport rect: re-anchor on scroll/resize rather than hide the tip.
  const reanchor = (): void => {
    if (tipFor.value) anchorTip(tipFor.value)
  }

  onMounted(() => {
    const root = proseRef.value
    if (!root) return
    root.addEventListener('pointerover', onOver)
    root.addEventListener('pointerout', onOut)
    root.addEventListener('click', onClick)
    globalThis.addEventListener('scroll', reanchor, { passive: true, capture: true })
    globalThis.addEventListener('resize', reanchor, { passive: true })
  })

  onBeforeUnmount(() => {
    const root = proseRef.value
    root?.removeEventListener('pointerover', onOver)
    root?.removeEventListener('pointerout', onOut)
    root?.removeEventListener('click', onClick)
    globalThis.removeEventListener('scroll', reanchor, { capture: true })
    globalThis.removeEventListener('resize', reanchor)
    clearReset()
  })
</script>

<template>
  <!-- Every rule stops at the data-doc-chrome boundary: restyling the paragraphs and
       code inside a wrapped webkit component would break the component that owns them.
       Nested authored prose (a step's body, a tab's panel) keeps the contract. -->
  <div
    ref="proseRef"
    v-bind="$attrs"
    :data-testid="testId"
    class="w-full text-(--text-default) [&>*:first-child]:mt-0! [&>*:first-child]:pt-0! [&>*:first-child>*:first-child]:mt-0! [&>*:first-child>*:first-child]:pt-0! [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-2xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xl [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-md [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-lg [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:md:text-heading-sm [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xl) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-lg) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xs [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_em:not([data-doc-chrome],[data-doc-chrome]_*)]:italic [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link)/40 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline-offset-4 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:transition-colors [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:duration-150 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:ease-out [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link-hover) [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link-hover) [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-offset-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-(--ring-color) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:motion-reduce:transition-none [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-elements) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:bg-(--bg-hover) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-xs) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:py-0.5 [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-label-code-sm [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_code:not([data-testid])]:cursor-pointer [&_code:not([data-testid])]:hover:ring-1 [&_code:not([data-testid])]:hover:ring-(--border-default) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:list-disc [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:list-decimal [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:marker:text-(--text-muted) [&_li+li:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_li>p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-lg) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-l-2 [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-strong) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-0 [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-12 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-0 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-t [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_[data-doc-block]]:mt-(--spacing-lg) [&_:is(h1,h2)+:is(h2,h3,h4):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_h3+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_h4+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_h3+[data-doc-block]]:mt-(--spacing-sm) [&_h4+[data-doc-block]]:mt-(--spacing-xs)"
  >
    <slot />

    <!-- One panel for every chip: the raw-HTML path cannot hold per-chip components.
         It lives inside the root div because a teleport counts as a root node —
         hoisted, this component becomes a fragment, which cannot inherit attributes
         and silently drops the consumer's class. Nested it still renders under body. -->
    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <span
          v-if="tipFor"
          role="tooltip"
          data-testid="documentation-doc-prose-copy-tip"
          :style="{ left: `${tipLeft}px`, top: `${tipTop}px` }"
          class="pointer-events-none fixed z-(--z-input-overlay) -translate-x-1/2 -translate-y-[calc(100%+var(--spacing-xxs))] rounded-(--shape-elements) bg-(--bg-contrast) px-(--spacing-xs) py-(--spacing-xxs) text-body-xs whitespace-nowrap text-(--text-contrast)"
          >{{ tipLabel }}</span
        >
      </Transition>
    </Teleport>
  </div>
</template>
