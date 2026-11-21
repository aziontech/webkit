<script setup lang="ts">
  import { computed, inject, provide, ref, useAttrs } from 'vue'

  import { useModalOverlay } from '../../../composables/use-modal-overlay'
  import { usePortalLocale } from '../../../composables/use-translate'
  import { cn } from '../../../utils/cn'
  import { PanelHeaderEndInjectionKey } from '../panel/injection-key'
  import Panel from '../panel/panel.vue'
  import DialogClose from './dialog-close.vue'
  import { DialogInjectionKey } from './injection-key'
  import { DIALOG_EXIT_MS } from './presets/transitions'

  defineOptions({
    name: 'DialogContent',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DialogInjectionKey)
  const contentEl = ref<HTMLElement | null>(null)
  const { isPresent, motionState, onBackdropClick } = useModalOverlay(ctx, contentEl, {
    exitMs: DIALOG_EXIT_MS
  })
  const portalLocale = usePortalLocale()
  const testId = computed(() => ctx?.testId ?? 'dialog')

  const forwardedAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class'))
  )

  provide(PanelHeaderEndInjectionKey, {
    panelTestId: `${testId.value}__panel-shell`,
    component: computed(() => (ctx?.closable ? DialogClose : null))
  })

  const BACKDROP_CLASS =
    'fixed inset-0 z-1000 bg-(--bg-backdrop) opacity-0 ' +
    'data-[state=open]:opacity-100 ' +
    'transition-opacity motion-reduce:transition-none max-md:duration-slow-01 max-md:ease-productive-entrance max-md:data-[state=closed]:duration-slow-02 ' +
    'max-md:data-[state=closed]:ease-productive-exit md:duration-moderate-01 md:ease-productive-entrance md:data-[state=closed]:ease-productive-exit'

  const PANEL_SHELL_CLASS =
    'pointer-events-auto mx-auto w-full max-md:w-full ' +
    'data-[size=small]:md:max-w-(--container-sm) data-[size=medium]:md:max-w-(--container-xl) data-[size=large]:md:max-w-(--container-2xl) ' +
    'transition-[translate,scale,opacity] motion-reduce:transition-none max-md:translate-x-0 max-md:duration-slow-02 max-md:ease-expressive-entrance ' +
    'max-md:data-[state=closed]:translate-y-full max-md:data-[state=closed]:duration-slow-01 max-md:data-[state=closed]:ease-expressive-exit max-md:data-[state=open]:translate-y-0 ' +
    'md:origin-center md:translate-y-0 md:scale-90 md:opacity-0 md:duration-moderate-01 md:ease-productive-entrance md:data-[state=closed]:ease-productive-exit ' +
    'md:data-[state=open]:scale-100 md:data-[state=open]:opacity-100'
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
        :class="
          cn(
            'pointer-events-none fixed inset-0 z-1001 flex max-md:items-end max-md:justify-center max-md:p-0 md:items-center md:justify-center md:p-(--spacing-md)',
            attrs.class as string | undefined
          )
        "
        :aria-modal="true"
        :aria-labelledby="ctx?.titleId"
        :aria-describedby="ctx?.hasDescription.value ? ctx.descriptionId : undefined"
        :data-testid="`${testId}__panel`"
        tabindex="-1"
      >
        <div
          :data-state="motionState"
          :data-size="ctx?.size ?? 'medium'"
          :class="PANEL_SHELL_CLASS"
        >
          <Panel
            :size="ctx?.size ?? 'medium'"
            size-at-md
            class="max-md:rounded-b-(--shape-flat) max-md:rounded-t-(--shape-card) max-md:w-full max-md:h-fit max-h-[80dvh] max-sm:h-dvh max-sm:max-h-dvh max-sm:rounded-none max-sm:border-0"
            :data-testid="`${testId}__panel-shell`"
          >
            <slot />
          </Panel>
        </div>
      </div>
    </div>
  </Teleport>
</template>
