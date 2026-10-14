<script setup lang="ts">
  import { computed } from 'vue'

  import { useShellMockupContext } from './composables/use-shell-mockup-context'

  defineOptions({ name: 'MockupPart' })

  interface Props {
    /** Beat this part arrives on; each beat lands one step after the one before it. */
    order?: number
  }

  const props = withDefaults(defineProps<Props>(), { order: 0 })

  defineSlots<{
    /** The part's content. */
    default(): unknown
  }>()

  const { entered, beatStyle } = useShellMockupContext()

  const style = computed(() => beatStyle(props.order))
</script>

<template>
  <div
    :data-entered="entered || null"
    :style="style"
    class="translate-y-4 opacity-0 data-entered:translate-y-0 data-entered:opacity-100 motion-reduce:translate-y-0 motion-reduce:opacity-100"
  >
    <slot />
  </div>
</template>
