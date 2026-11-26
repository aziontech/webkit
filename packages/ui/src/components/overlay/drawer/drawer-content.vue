<script setup lang="ts">
  import { computed, h, inject, provide, ref, unref, useAttrs } from 'vue'

  import { useModalOverlay } from '../../../composables/use-modal-overlay'
  import { usePortalLocale } from '../../../composables/use-translate'
  import { cn } from '../../../utils/cn'
  import { PanelHeaderEndInjectionKey } from '../panel/injection-key'
  import Panel from '../panel/panel.vue'
  import DrawerClose from './drawer-close.vue'
  import { DrawerInjectionKey, DrawerPanelScrollInjectionKey } from './injection-key'
  import { DRAWER_EXIT_MS } from './presets/transitions'

  defineOptions({
    name: 'DrawerContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)
  const contentEl = ref<HTMLElement | null>(null)
  const isModal = computed(() => ctx?.modal ?? true)
  const { isPresent, motionState, onBackdropClick } = useModalOverlay(ctx, contentEl, {
    exitMs: DRAWER_EXIT_MS,
    openFrames: 2,
    modal: isModal
  })
  const portalLocale = usePortalLocale()
  const testId = computed(() => String(attrs['data-testid'] ?? 'drawer-content'))

  const forwardedAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class'))
  )

  const AutoClose = () => h(DrawerClose, { 'data-testid': `${ctx?.testId}__close` })

  provide(PanelHeaderEndInjectionKey, {
    panelTestId: `${testId.value}__panel-shell`,
    component: computed(() => (ctx?.closable ? AutoClose : null))
  })
  provide(DrawerPanelScrollInjectionKey, true)

  const side = computed(() => (ctx?.side === 'start' ? 'start' : 'end'))
  const drawerSize = computed(() => unref(ctx?.size) ?? 'large')

  const BACKDROP_CLASS =
    'fixed inset-0 z-1000 bg-(--bg-backdrop) opacity-0 ' +
    'data-[state=open]:opacity-100 ' +
    'transition-opacity duration-slow-01 ease-productive-entrance ' +
    'data-[state=closed]:duration-slow-02 data-[state=closed]:ease-productive-exit ' +
    'motion-reduce:transition-none'

  const PANEL_SHELL_CLASS =
    'pointer-events-auto flex h-full min-h-0 flex-col max-md:h-fit max-md:max-h-[80dvh] max-md:w-full max-md:max-w-none max-md:rounded-t-(--shape-card) max-md:rounded-b-(--shape-flat) ' +
    'max-sm:h-dvh max-sm:max-h-dvh max-sm:rounded-none max-sm:border-0 md:h-full md:max-h-full md:min-h-0 ' +
    'data-[side=start]:md:rounded-s-(--shape-flat) data-[side=start]:md:rounded-e-(--shape-card) data-[side=end]:md:rounded-s-(--shape-card) data-[side=end]:md:rounded-e-(--shape-flat)'

  const POSITIONER_CLASS =
    'pointer-events-none fixed z-1001 flex p-0 transition-[translate] duration-slow-02 ease-expressive-entrance ' +
    'data-[state=closed]:duration-slow-01 data-[state=closed]:ease-expressive-exit ' +
    'motion-reduce:transition-none max-md:inset-x-0 max-md:top-auto max-md:bottom-0 max-md:h-fit max-md:max-h-[80dvh] max-md:w-full max-md:justify-center max-md:translate-x-0 ' +
    'max-md:data-[state=closed]:translate-y-full max-md:data-[state=open]:translate-y-0 max-sm:top-0 max-sm:h-dvh max-sm:max-h-dvh md:inset-y-0 md:h-full md:min-h-full md:w-full ' +
    'md:translate-y-0 md:data-[state=open]:translate-x-0 ' +
    'data-[side=start]:md:start-0 data-[side=start]:md:justify-start data-[side=start]:md:data-[state=closed]:-translate-x-full ' +
    'data-[side=start]:rtl:md:data-[state=closed]:translate-x-full data-[side=end]:md:end-0 data-[side=end]:md:justify-end data-[side=end]:md:data-[state=closed]:translate-x-full ' +
    'data-[side=end]:rtl:md:data-[state=closed]:-translate-x-full ' +
    'data-[size=small]:md:max-w-(--container-sm) data-[size=medium]:md:max-w-[max(30vw,var(--container-md))] data-[size=large]:md:max-w-[max(40vw,var(--container-lg))]'
</script>

<template>
  <Teleport
    v-if="isPresent"
    to="body"
  >
    <div
      :data-testid="`${testId}__portal`"
      class="contents"
      :dir="portalLocale.dir"
      :lang="portalLocale.lang"
    >
      <div
        v-if="isModal"
        :class="BACKDROP_CLASS"
        :data-state="motionState"
        :data-testid="`${testId}__backdrop`"
        aria-hidden="true"
        @click="onBackdropClick"
      />
      <div
        ref="contentEl"
        role="dialog"
        v-bind="forwardedAttrs"
        :class="cn(POSITIONER_CLASS, attrs.class as string | undefined)"
        :aria-modal="isModal"
        :aria-labelledby="ctx?.titleId"
        :aria-describedby="ctx?.hasDescription.value ? ctx.descriptionId : undefined"
        :data-state="motionState"
        :data-side="side"
        :data-size="drawerSize"
        :data-testid="testId"
        tabindex="-1"
      >
        <Panel
          data-fluid
          :data-side="side"
          :class="PANEL_SHELL_CLASS"
          :data-testid="`${testId}__panel-shell`"
        >
          <slot />
        </Panel>
      </div>
    </div>
  </Teleport>
</template>
