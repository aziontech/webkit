<script setup lang="ts">
  import { ref, type StyleValue, watch } from 'vue'

  import { useTeleportReady } from '../../../../composables/use-teleport-ready'
  import { usePortalLocale } from '../../../../composables/use-translate'
  import { useDropdownContext } from '../composables/use-dropdown-context'

  defineOptions({
    name: 'DropdownMenuPanel',
    inheritAttrs: false
  })

  export interface DropdownMenuPanelProps {
    /** Fixed-position style of the floating panel. */
    panelStyle: StyleValue
    /** Renders an empty fixed element in the portal for the panel to be placed against. */
    anchored?: boolean
    /** Position of that element. */
    anchorStyle?: StyleValue
    /** Accessible name of the menu element. */
    ariaLabel?: string
    /** Id of the element that names the menu element. */
    ariaLabelledby?: string
  }

  defineProps<DropdownMenuPanelProps>()

  const emit = defineEmits<{
    keydown: [event: globalThis.KeyboardEvent]
    anchor: [el: globalThis.HTMLElement | null]
  }>()

  defineSlots<{
    /** Pinned above the menu. */
    header(): unknown
    /** Pinned below the menu. */
    footer(): unknown
  }>()

  const ctx = useDropdownContext()
  const { panelEl, panelBodyEl } = ctx

  const bodyEl = ref<globalThis.HTMLElement | null>(null)

  watch(bodyEl, (el) => {
    if (el) panelBodyEl.value = el
  })

  function onAnchorRef(el: unknown) {
    emit('anchor', el as globalThis.HTMLElement | null)
  }

  function onPanelRef(el: unknown) {
    panelEl.value = el as globalThis.HTMLElement | null
  }

  function onAfterLeave() {
    panelBodyEl.value = null
  }

  const portalLocale = usePortalLocale()

  const PANEL_CLASS =
    'flex min-w-(--container-3xs) max-w-(--container-2xs) flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) py-(--spacing-xs) ' +
    'shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]'

  const teleportReady = useTeleportReady()
</script>

<template>
  <Teleport
    to="body"
    :disabled="!teleportReady"
  >
    <span
      v-if="anchored && ctx.isOpen.value"
      :ref="onAnchorRef"
      aria-hidden="true"
      :style="anchorStyle"
      class="pointer-events-none fixed size-0"
    />
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      @after-leave="onAfterLeave"
    >
      <div
        v-if="ctx.isOpen.value"
        :ref="onPanelRef"
        role="presentation"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        :data-testid="`${ctx.testId}__panel`"
        data-state="open"
        :data-side="ctx.side.value"
        :data-align="ctx.align.value"
        :style="panelStyle"
        :class="PANEL_CLASS"
        @keydown="emit('keydown', $event)"
      >
        <div
          v-if="$slots['header']"
          :data-testid="`${ctx.testId}__header`"
          class="sticky top-0 z-10 bg-(--bg-surface) px-(--spacing-2xs) pb-(--spacing-2xs)"
        >
          <slot name="header" />
        </div>

        <div
          :id="ctx.panelId"
          ref="bodyEl"
          role="menu"
          tabindex="-1"
          :aria-label="ariaLabel || undefined"
          :aria-labelledby="ariaLabelledby"
          :data-testid="`${ctx.testId}__body`"
          class="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
        />

        <div
          v-if="$slots['footer']"
          :data-testid="`${ctx.testId}__footer`"
          class="sticky bottom-0 z-10 bg-(--bg-surface) px-(--spacing-2xs) pt-(--spacing-2xs)"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
