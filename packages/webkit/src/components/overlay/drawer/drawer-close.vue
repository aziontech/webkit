<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import IconButton from '../../actions/icon-button/icon-button.vue'
  import { DrawerInjectionKey } from './injection-key'

  defineOptions({
    name: 'DrawerClose',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Accessible label for the close control. */
      ariaLabel?: string
    }>(),
    {
      ariaLabel: 'Close'
    }
  )

  const attrs = useAttrs()
  const ctx = inject(DrawerInjectionKey)

  const handleClick = () => {
    ctx?.close()
  }

  const isDisabled = computed(() => !ctx?.closeable)
</script>

<template>
  <IconButton
    v-if="ctx"
    icon="pi pi-times"
    kind="outlined"
    size="small"
    :ariaLabel="props.ariaLabel"
    :disabled="isDisabled"
    :data-testid="`${ctx.testId}__close`"
    :class="attrs.class"
    @click="handleClick"
  />
</template>
