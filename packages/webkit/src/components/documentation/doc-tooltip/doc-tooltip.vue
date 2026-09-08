<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, useAttrs, useId } from 'vue'

  import { usePlacement } from '../../../composables/use-placement/index.js'
  import Link from '../../navigation/link/link.vue'

  /**
   * Inline gloss. With no CTA the panel is a real role tooltip describing its
   * trigger; with one it is a small role dialog announced via aria-expanded, since
   * a tooltip holding a link is unreachable without a mouse (so no webkit tooltip).
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
   * A dialog with no accessible name fails axe aria-dialog-name, so the panel is
   * named by the headline it glosses — or by the tip itself when there is none.
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
    // The shared floating-overlay tier, so a gloss inside a docs panel is not occluded.
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
   * An interactive panel closes on a short delay: the pointer must cross the 8px
   * gap to reach the CTA, and closing on the first mouseleave makes it unclickable.
   * Entering the panel cancels the close; a passive panel closes at once.
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
   * The panel teleports to body, so Tab order skips it and focus is handed across
   * by hand. Refocusing the trigger fires the same focusin that opens the panel —
   * the flag makes that one event inert, or Tab could never pass the glossed word.
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
          class="text-body-sm text-(--text-default)"
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
