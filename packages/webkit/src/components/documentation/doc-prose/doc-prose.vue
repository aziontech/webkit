<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'

  defineOptions({ name: 'DocProse', inheritAttrs: false })

  defineSlots<{
    /** The document body: markdown-rendered HTML or hand-written markup. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const proseRef = ref<HTMLElement | null>(null)
  const tipFor = ref<HTMLElement | null>(null)
  const tipLabel = ref('Copy')
  const tipLeft = ref(0)
  const tipTop = ref(0)
  let resetTimer: ReturnType<typeof globalThis.setTimeout> | null = null

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-prose')

  const chipFrom = (target: globalThis.EventTarget | null): HTMLElement | null => {
    const root = proseRef.value
    const node = target instanceof globalThis.Element ? target : null
    const chip = node?.closest('code') as HTMLElement | null
    if (!chip || !root?.contains(chip) || chip.closest('pre')) return null
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
    if (chipFrom(event.relatedTarget) === chip) return
    clearReset()
    tipFor.value = null
  }

  const onClick = async (event: globalThis.MouseEvent): Promise<void> => {
    const chip = chipFrom(event.target)
    if (!chip || chip.closest('a')) return
    const text = chip.textContent ?? ''
    if (!text) return
    tipFor.value = chip
    anchorTip(chip)
    try {
      await globalThis.navigator.clipboard.writeText(text)
      tipLabel.value = 'Copied'
    } catch {
      tipLabel.value = 'Press \u2318C to copy'
      globalThis.getSelection()?.selectAllChildren(chip)
    }
    clearReset()
    resetTimer = globalThis.setTimeout(() => {
      tipLabel.value = 'Copy'
      resetTimer = null
    }, 1400)
  }

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
  <div
    ref="proseRef"
    v-bind="$attrs"
    :data-testid="testId"
    class="w-full text-(--text-default) [&>*:first-child]:mt-0! [&>*:first-child:not([data-doc-chrome])]:pt-0! [&>*:first-child>*:first-child]:mt-0! [&>*:first-child>*:first-child:not([data-doc-chrome])]:pt-0! [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-2xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-xl [&_h1:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xl [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:text-heading-md [&_h2:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-14 [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-lg [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:md:text-heading-sm [&_h3:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xl) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:sm:pt-(--spacing-lg) [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-heading-xs [&_h4:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:font-normal [&_strong:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_em:not([data-doc-chrome],[data-doc-chrome]_*)]:italic [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-flat) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link)/40 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:underline-offset-4 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:transition-colors [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:duration-150 [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:ease-out [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-link-hover) [&_a:hover:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:decoration-(--text-link-hover) [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-offset-2 [&_a:focus-visible:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:outline-(--ring-color) [&_a:not([data-doc-anchor],[data-doc-chrome],[data-doc-chrome]_*)]:motion-reduce:transition-none [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:rounded-(--shape-elements) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:bg-(--bg-hover) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:px-(--spacing-xs) [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:py-0.5 [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-label-code-sm [&_code:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-default) [&_code:not([data-testid])]:cursor-pointer [&_code:not([data-testid])]:hover:ring-1 [&_code:not([data-testid])]:hover:ring-(--border-default) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:list-disc [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:list-decimal [&_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-body-prose-md [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_li:not([data-doc-chrome],[data-doc-chrome]_*)]:marker:text-(--text-muted) [&_li+li:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_li>p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ul:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_li_ol:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-(--spacing-lg) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-l-2 [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-strong) [&_blockquote:not([data-doc-chrome],[data-doc-chrome]_*)]:pl-(--spacing-lg) [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:pt-0 [&_blockquote_p:not([data-doc-chrome],[data-doc-chrome]_*)]:text-(--text-muted) [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:mt-12 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-0 [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-t [&_hr:not([data-doc-chrome],[data-doc-chrome]_*)]:border-(--border-default) [&_[data-doc-block]]:mt-(--spacing-lg) [&_:is(h1,h2)+:is(h2,h3,h4):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-md) [&_h3+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-sm) [&_h4+:is(h4,p,ul,ol,blockquote):not([data-doc-chrome],[data-doc-chrome]_*)]:pt-(--spacing-xs) [&_h3+[data-doc-block]]:mt-(--spacing-sm) [&_h4+[data-doc-block]]:mt-(--spacing-xs)"
  >
    <slot />

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
