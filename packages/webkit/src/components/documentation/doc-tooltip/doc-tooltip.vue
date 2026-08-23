<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue'

  import { usePlacement } from '../../../composables/use-placement/index.js'
  import Link from '../../navigation/link/link.vue'

  /**
   * The inline gloss — a term in running prose that carries its own definition,
   * shown when the reader hovers or focuses it.
   *
   * IT IS NOT THE WEBKIT TOOLTIP, and the reason is the call to action. The
   * webkit tooltip is a one-line label on the contrast surface with
   * `pointer-events-none` — correct for naming an icon button, and unable to
   * hold a link the reader must be able to travel to. A doc gloss is three
   * things stacked on the raised surface (headline, definition, an optional
   * "read more"), so it takes the popover's surface tokens and keeps its pointer
   * events. Everything else — the placement composable, the scale animation, the
   * link — is the design system's.
   *
   * The CTA is what splits the a11y contract in two, so the component follows
   * the shape it actually has: with no CTA it is a real `role="tooltip"`
   * describing its trigger; with one it is a small `role="dialog"` the reader
   * can enter, announced through `aria-expanded`. A `role="tooltip"` holding a
   * link is a trap — the link is unreachable to anyone who is not using a mouse.
   *
   * The trigger is a real button element, never a bare inline span: a definition only
   * available to a pointer is a definition half the readers never get. It keeps
   * the surrounding type and marks itself with a dotted underline, the
   * convention print has used for a glossed term for a century.
   */
  defineOptions({ name: 'DocTooltip', inheritAttrs: false })

  export type DocTooltipPlacement = 'top' | 'bottom' | 'auto'

  interface Props {
    /** The definition shown inside the panel. */
    tip?: string
    /** Bold lead-in above the definition — usually the term itself. */
    headline?: string
    /** Label for the panel's call-to-action link. Needs `href`. */
    cta?: string
    /** Destination for the call-to-action link. */
    href?: string
    /** Where the panel opens; `'auto'` picks the side with the most room. */
    placement?: DocTooltipPlacement
    /** Hover-open delay in milliseconds. */
    delay?: number
    /** Fallback trigger text when the default slot is empty. */
    label?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    tip: '',
    headline: '',
    cta: '',
    href: '',
    placement: 'top',
    delay: 150,
    label: ''
  })

  defineSlots<{
    /** The glossed term, rendered inline in the sentence. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-tooltip')

  const uid = useId()
  const panelId = `${uid}-tooltip`
  const headlineId = `${uid}-headline`
  const tipId = `${uid}-tip`

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)
  const openTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const restoringFocus = ref(false)
  const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null)
  const open = ref(false)

  /** A panel the reader can travel into is a dialog; a passive one is a tooltip. */
  const interactive = computed(() => props.cta.length > 0 && props.href.length > 0)
  const hasContent = computed(() => props.tip.length > 0 || props.headline.length > 0)

  const isOpen = computed(() => open.value && hasContent.value)

  /*
   * An interactive panel is a `role="dialog"`, and a dialog with no accessible
   * name is announced as an unlabelled group — axe flags it `aria-dialog-name`,
   * and a screen-reader user entering it is told nothing about what they entered.
   * So it is named by the term it glosses (the headline) and, when there is none,
   * by the definition itself: naming a one-sentence panel after that sentence is
   * honest, and infinitely better than a generic "dialog".
   */
  const labelledBy = computed(() => (props.headline ? headlineId : tipId))
  const placementRef = computed(() => props.placement)

  const { resolvedPlacement, panelStyle } = usePlacement({
    triggerRef,
    panelRef,
    isOpen,
    placement: placementRef,
    offset: 8,
    autoPlacements: ['top', 'bottom'],
    // The floating-overlay tier, the same one the webkit tooltip and the menus
    // sit on, so a gloss opened inside a docs panel is never occluded by it.
    zIndex: 1100,
    onDismiss: () => close()
  })

  function clearTimers() {
    if (openTimer.value) clearTimeout(openTimer.value)
    if (closeTimer.value) clearTimeout(closeTimer.value)
    openTimer.value = null
    closeTimer.value = null
  }

  function close() {
    clearTimers()
    open.value = false
  }

  function scheduleOpen() {
    if (!hasContent.value || restoringFocus.value) return
    clearTimers()
    openTimer.value = setTimeout(() => {
      open.value = true
    }, props.delay)
  }

  /*
   * Leaving the trigger cannot close an interactive panel immediately: the
   * pointer has to cross the 8px gap to reach the CTA, and a close on the first
   * `mouseleave` makes that link unclickable. So the close is deferred by one
   * short beat, and entering the panel cancels it. A passive panel has nothing
   * to travel to, so it closes at once.
   */
  function scheduleClose() {
    clearTimers()
    if (!interactive.value) {
      open.value = false
      return
    }
    closeTimer.value = setTimeout(() => {
      open.value = false
    }, 120)
  }

  function toggle() {
    if (open.value) close()
    else {
      clearTimers()
      open.value = hasContent.value
    }
  }

  /*
   * The panel is teleported to the end of the document body, so DOM order does NOT put it
   * after the trigger: a reader who Tabs off the glossed term lands on whatever
   * follows it in the sentence, and the CTA — the whole reason this panel is
   * interactive — is never reached. Focus is therefore handed across explicitly.
   * Tab from the trigger enters the panel; Tab or Shift+Tab from inside it closes
   * the panel and puts focus back on the term, so the reader continues from where
   * they were and the next Tab simply moves on.
   */
  /*
   * Closing and handing focus back to the trigger is one move, not two: focusing
   * the term fires `focusin`, which is the very thing that OPENS the panel — so a
   * naive close-then-focus re-opened it ~150ms later and trapped the reader in a
   * loop where Tab could never get past the glossed word. The flag makes that one
   * focus event inert.
   */
  function returnFocusToTrigger() {
    restoringFocus.value = true
    close()
    triggerRef.value?.focus({ preventScroll: true })
    globalThis.requestAnimationFrame?.(() => {
      restoringFocus.value = false
    })
  }

  function firstFocusable() {
    return panelRef.value?.querySelector<globalThis.HTMLElement>('a[href],button') ?? null
  }

  function onTriggerKeydown(event: globalThis.KeyboardEvent) {
    if (event.key !== 'Tab' || event.shiftKey || !open.value || !interactive.value) return
    const target = firstFocusable()
    if (!target) return
    event.preventDefault()
    target.focus({ preventScroll: true })
  }

  function onPanelKeydown(event: globalThis.KeyboardEvent) {
    if (event.key !== 'Tab') return
    event.preventDefault()
    returnFocusToTrigger()
  }

  function onFocusOut(event: globalThis.FocusEvent) {
    const next = event.relatedTarget as globalThis.Node | null
    if (next && (triggerRef.value?.contains(next) || panelRef.value?.contains(next))) return
    close()
  }

  function onDocumentKeydown(event: globalThis.KeyboardEvent) {
    if (!open.value || event.key !== 'Escape') return
    event.preventDefault()
    returnFocusToTrigger()
  }

  onMounted(() => {
    globalThis.document?.addEventListener('keydown', onDocumentKeydown)
  })

  onBeforeUnmount(() => {
    clearTimers()
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
  })
</script>

<template>
  <button
    ref="triggerRef"
    v-bind="$attrs"
    type="button"
    :data-testid="testId"
    data-doc-chrome
    :data-state="isOpen ? 'open' : 'closed'"
    :data-interactive="interactive || null"
    :aria-describedby="isOpen && !interactive ? panelId : undefined"
    :aria-expanded="interactive ? isOpen : undefined"
    :aria-controls="interactive && isOpen ? panelId : undefined"
    class="m-0 cursor-help rounded-(--shape-flat) border-0 bg-transparent p-0 text-left text-(--text-default) underline decoration-dotted decoration-(--border-strong) underline-offset-4 transition-colors duration-150 ease-out hover:decoration-(--text-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color) data-[state=open]:decoration-(--text-default) motion-reduce:transition-none"
    @mouseenter="scheduleOpen"
    @mouseleave="scheduleClose"
    @focusin="scheduleOpen"
    @focusout="onFocusOut"
    @keydown="onTriggerKeydown"
    @click="toggle"
  >
    <slot>{{ label }}</slot>
  </button>

  <Teleport to="body">
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <div
        v-if="isOpen"
        :id="panelId"
        ref="panelRef"
        data-doc-chrome
        :data-testid="`${testId}__panel`"
        :role="interactive ? 'dialog' : 'tooltip'"
        :data-state="isOpen ? 'open' : 'closed'"
        :aria-labelledby="interactive ? labelledBy : undefined"
        :data-placement="resolvedPlacement"
        :data-interactive="interactive || null"
        :style="panelStyle"
        class="pointer-events-none flex max-w-(--container-2xs) flex-col rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) p-(--spacing-sm) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,center)] data-[interactive]:pointer-events-auto"
        @mouseenter="clearTimers"
        @mouseleave="scheduleClose"
        @focusout="onFocusOut"
        @keydown="onPanelKeydown"
      >
        <span
          v-if="headline"
          :id="headlineId"
          class="text-body-sm font-medium text-(--text-default)"
        >
          {{ headline }}
        </span>
        <span
          v-if="tip"
          :id="tipId"
          :data-headline="Boolean(headline) || null"
          class="text-pretty text-body-sm text-(--text-muted) data-[headline]:pt-(--spacing-xxs)"
        >
          {{ tip }}
        </span>
        <Link
          v-if="interactive"
          :label="cta"
          :href="href"
          size="small"
          icon="pi pi-chevron-right"
          class="mt-(--spacing-xs) self-start"
        />
      </div>
    </Transition>
  </Teleport>
</template>
