<script setup lang="ts">
  import { inject, useAttrs } from 'vue'

  import { useDialogTrigger } from '../../../composables/use-dialog-trigger'
  import { TriggerHost } from '../parts/trigger-host'
  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerTrigger',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)

  const { aria, activate, onKeydown, onControl } = useDialogTrigger(ctx)
</script>

<template>
  <TriggerHost
    :aria="aria"
    as-button
    :class="attrs.class"
    :data-testid="`${ctx?.testId}__trigger`"
    @click="activate"
    @keydown="onKeydown"
    @control="onControl"
  >
    <slot />
  </TriggerHost>
</template>
