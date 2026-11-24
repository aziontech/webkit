<script setup lang="ts">
  import type { Reactive } from 'vue'

  import type { UseInlineCodeCopyReturn } from '../../../../composables/use-inline-code-copy'
  import { useTeleportReady } from '../../../../composables/use-teleport-ready'
  import { usePortalLocale } from '../../../../composables/use-translate'

  defineOptions({ name: 'DocProseCopyTip' })

  interface Props {
    /** The copy state of the host's inline code chips. */
    copy: Reactive<UseInlineCodeCopyReturn>
    /** Test id of the host; the tooltip and the status take it as their prefix. */
    testId: string
  }

  defineProps<Props>()

  const portalLocale = usePortalLocale()

  const COPY_TIP_CLASS =
    'pointer-events-none fixed z-(--z-control-overlay) -translate-x-1/2 -translate-y-[calc(100%+var(--spacing-2xs))] rounded-(--shape-control) bg-(--bg-contrast) px-(--spacing-xs) ' +
    'py-(--spacing-2xs) text-body-xs whitespace-nowrap text-(--text-contrast)'

  const teleportReady = useTeleportReady()
</script>

<template>
  <Teleport
    to="body"
    :disabled="!teleportReady"
  >
    <Transition
      enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
      leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
    >
      <span
        v-if="copy.tipFor"
        :dir="portalLocale.dir"
        :lang="portalLocale.lang"
        role="tooltip"
        :data-testid="`${testId}__copy-tip`"
        :style="{ left: `${copy.tipLeft}px`, top: `${copy.tipTop}px` }"
        :class="COPY_TIP_CLASS"
        >{{ copy.tipLabel }}</span
      >
    </Transition>
    <span
      :dir="portalLocale.dir"
      :lang="portalLocale.lang"
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__copy-status`"
      >{{ copy.announcement }}</span
    >
  </Teleport>
</template>
